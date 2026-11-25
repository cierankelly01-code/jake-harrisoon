"use server";

import { headers } from "next/headers";
import { callbackSchema, CALLBACK_TOPICS, CALLBACK_TIMES } from "@/lib/validation/callback";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { protectFormSubmission } from "@/lib/security/guard";
import { escapeHtml } from "@/lib/security/escape-html";
import { notifyDirectors } from "@/lib/email/notify-directors";
import { isPostcodeLikelyInCoverage } from "@/lib/content/coverage-postcodes";

export type CallbackState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "phone" | "postcode" | "topic" | "bestTime" | "message", string>>;
};

export async function requestCallback(_prev: CallbackState, formData: FormData): Promise<CallbackState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const guard = await protectFormSubmission(formData, `callback:${ip}`);
  if (!guard.ok) {
    if (guard.silent) return { status: "success" };
    return { status: "error", message: guard.message };
  }

  const parsed = callbackSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    postcode: formData.get("postcode"),
    topic: formData.get("topic"),
    bestTime: formData.get("bestTime"),
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: CallbackState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<CallbackState["fieldErrors"]>;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Check the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;
  const idempotencyKey = (formData.get("idempotencyKey") as string) || crypto.randomUUID();
  const isEmergency = data.topic === "breakdown" || data.topic === "leak";
  const inArea = isPostcodeLikelyInCoverage(data.postcode);

  let stored = false;
  const supabase = getSupabaseServiceClient();
  if (supabase) {
    const { error } = await supabase.from("leads").upsert(
      {
        division: "domestic",
        type: isEmergency ? "emergency" : "general",
        name: data.name,
        phone: data.phone,
        postcode: data.postcode,
        message: [`Topic: ${data.topic}`, `Best time: ${data.bestTime}`, data.message].filter(Boolean).join("\n"),
        source_page: "/contact",
        priority: isEmergency ? "emergency" : "normal",
        idempotency_key: idempotencyKey,
      },
      { onConflict: "idempotency_key", ignoreDuplicates: false }
    );
    if (error) console.error("[leads] callback upsert failed", error);
    stored = !error;
  } else {
    console.warn("[STUB] callback request", { ...data, idempotencyKey });
  }

  const topicLabel = CALLBACK_TOPICS.find((t) => t.value === data.topic)?.label ?? data.topic;
  const timeLabel = CALLBACK_TIMES.find((t) => t.value === data.bestTime)?.label ?? data.bestTime;

  const notified = await notifyDirectors({
    subject: `${isEmergency ? "🚨 URGENT — " : "📞 "}Callback — ${escapeHtml(data.name)} — ${escapeHtml(topicLabel)}`,
    html: `<p><strong>${escapeHtml(data.name)}</strong> wants a call back on <strong>${escapeHtml(data.phone)}</strong>.</p>
      <p>About: ${escapeHtml(topicLabel)}<br>Best time: ${escapeHtml(timeLabel)}<br>Postcode: ${escapeHtml(data.postcode)}${inArea ? "" : " (outside the usual coverage list — check before promising a window)"}</p>
      ${data.message ? `<p>${escapeHtml(data.message)}</p>` : ""}`,
  });

  /**
   * Do not claim success when the lead went nowhere.
   *
   * `notifyDirectors` returns `{ ok: false }` when no director email is
   * configured (`business.emailGeneral` and `emailTenders` are both still
   * null), and the Supabase write is skipped entirely when the service-role
   * key is unset. With both unconfigured this action used to return
   * "success" and the form told the customer "Got it — we'll ring you
   * back", having written the request to a console log nobody reads.
   *
   * This is the only way a visitor reaches a human while the phone number
   * is unconfirmed, so a silent drop is the worst failure on the site.
   */
  if (!stored && !notified.ok) {
    console.error("[callback] lead not stored and not emailed — reporting failure to the user");
    return {
      status: "error",
      message:
        "Something went wrong at our end and your request did not reach us. Nothing was saved, so please do try again — or email us directly rather than wait for a call that will not come.",
    };
  }

  return { status: "success" };
}
