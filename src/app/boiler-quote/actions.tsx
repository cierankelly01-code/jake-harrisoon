"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { headers } from "next/headers";
import { quoteStepSchema, quoteContactSchema } from "@/lib/validation/boiler-quote";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { uploadToStorage } from "@/lib/supabase/storage";
import { protectFormSubmission } from "@/lib/security/guard";
import { sendEmail } from "@/lib/email/send";
import { notifyDirectors } from "@/lib/email/notify-directors";
import { escapeHtml } from "@/lib/security/escape-html";
import { calculateQuote, deriveMovingLocation, type QuoteInput, type QuoteTier } from "@/lib/quote/pricing";
import { BoilerQuoteDocument } from "@/lib/pdf/boiler-quote";

/**
 * Saves the wizard's cumulative answers after every step — this is the
 * abandonment-capture mechanism from §9.1: any phone number given at any
 * step becomes a lead immediately, even if the visitor never reaches the
 * final screen. The scheduled +2h/+24h nudge email itself is a Phase 3
 * automation engine (§11) — this action only does the capture half.
 */
export async function saveQuoteStep(formData: FormData): Promise<{ ok: boolean }> {
  // Keyed on the quote, not the IP: the wizard autosaves nine or ten times in
  // a single sitting, so an IP-keyed 5-per-minute limit throttled one honest
  // visitor partway through — and behind CGNAT or an office NAT it throttled
  // whoever happened to be second. The limit is generous enough for the whole
  // wizard and still bounded per quote id.
  const rateLimitScope = String(formData.get("quoteId") ?? "").slice(0, 64) || "unknown";
  const guard = await protectFormSubmission(formData, `boiler-quote-step:${rateLimitScope}`, {
    limit: 30,
    // Intermediate autosaves carry no Turnstile token by design; the final
    // submit in `completeQuote` is the one that is verified.
    skipTurnstile: true,
  });
  if (!guard.ok) return { ok: guard.silent };

  const parsed = quoteStepSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false };

  const supabase = getSupabaseServiceClient();
  const photoFile = formData.get("photo") as File | null;
  const photoPath =
    photoFile && photoFile.size > 0 ? await uploadToStorage("boiler-quote-photos", photoFile, "boiler-quotes", "photo") : null;

  const { quoteId, step, ...patch } = parsed.data;

  if (!supabase) {
    console.warn("[STUB] boiler_quotes upsert", { quoteId, step, ...patch, photoPath });
    return { ok: true };
  }

  const { data: existing } = await supabase
    .from("boiler_quotes")
    .select("photo_urls")
    .eq("id", quoteId)
    .maybeSingle();

  const photoUrls = [...(existing?.photo_urls ?? []), ...(photoPath ? [photoPath] : [])];

  let leadId: string | null = null;
  if (patch.phone) {
    const { data: lead } = await supabase
      .from("leads")
      .upsert(
        {
          division: "domestic",
          type: "boiler_quote",
          name: "Boiler quote — in progress",
          phone: patch.phone,
          postcode: patch.postcode ?? null,
          source_page: "/boiler-quote",
          idempotency_key: `quote:${quoteId}`,
        },
        { onConflict: "idempotency_key" }
      )
      .select("id")
      .single();
    leadId = lead?.id ?? null;
  }

  const { error } = await supabase.from("boiler_quotes").upsert(
    {
      id: quoteId,
      ...patch,
      photo_urls: photoUrls,
      completed_step: step,
      ...(leadId ? { lead_id: leadId } : {}),
    },
    { onConflict: "id" }
  );

  if (error) console.error("[boiler_quotes] upsert failed", error);
  return { ok: !error };
}

export type CompleteQuoteState = {
  status: "idle" | "success" | "error";
  message?: string;
  tiers?: QuoteTier[];
  pdfBase64?: string;
};

export async function completeQuote(
  _prev: CompleteQuoteState,
  formData: FormData
): Promise<CompleteQuoteState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const guard = await protectFormSubmission(formData, `boiler-quote-complete:${ip}`);
  if (!guard.ok) {
    if (guard.silent) return { status: "idle" };
    return { status: "error", message: guard.message };
  }

  const contact = quoteContactSchema.safeParse({
    quoteId: formData.get("quoteId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    postcode: formData.get("postcode"),
  });
  if (!contact.success) {
    return { status: "error", message: contact.error.issues[0]?.message ?? "Check the form and try again." };
  }

  // See deriveMovingLocation in lib/quote/pricing.ts for why this isn't a
  // raw string comparison — a blank `targetLocation` (the wizard tells the
  // reader to leave it blank if the boiler is staying put) used to compare
  // as "moving", applying the £340–£540 relocation uplift to essentially
  // every quote the site produced.
  const currentLocation = String(formData.get("boilerLocation") ?? "");
  const targetLocation = String(formData.get("targetLocation") ?? "");

  const quoteInput: QuoteInput = {
    propertyType: (formData.get("propertyType") as QuoteInput["propertyType"]) || "semi_detached",
    bedrooms: Number(formData.get("bedrooms")) || 3,
    bathrooms: Number(formData.get("bathrooms")) || 1,
    currentSystem: (formData.get("currentSystem") as QuoteInput["currentSystem"]) || "combi",
    movingLocation: deriveMovingLocation(currentLocation, targetLocation),
  };

  const tiers = calculateQuote(quoteInput);
  const recommended = tiers.find((t) => t.tier === "recommended");
  if (!recommended) {
    // calculateQuote always returns a "recommended" tier for a valid QuoteInput —
    // this only trips if the pricing config itself was edited incorrectly.
    console.error("[boiler-quote] pricing config produced no 'recommended' tier");
    return { status: "error", message: "Something went wrong calculating your quote. Please try again." };
  }

  const supabase = getSupabaseServiceClient();
  let leadId: string | null = null;

  if (supabase) {
    const { data: lead } = await supabase
      .from("leads")
      .upsert(
        {
          division: "domestic",
          type: "boiler_quote",
          name: contact.data.name,
          email: contact.data.email,
          phone: contact.data.phone,
          postcode: contact.data.postcode,
          source_page: "/boiler-quote",
          idempotency_key: `quote:${contact.data.quoteId}`,
        },
        { onConflict: "idempotency_key" }
      )
      .select("id")
      .single();
    leadId = lead?.id ?? null;

    await supabase
      .from("boiler_quotes")
      .upsert(
        {
          id: contact.data.quoteId,
          lead_id: leadId,
          postcode: contact.data.postcode,
          phone: contact.data.phone,
          quoted_low: recommended.priceLow,
          quoted_high: recommended.priceHigh,
          tier_shown: "recommended",
          completed_step: "contact_details",
          completed_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
  } else {
    console.warn("[STUB] boiler quote completed", { ...contact.data, quoteInput, tiers });
  }

  const pdfBuffer = await renderToBuffer(
    <BoilerQuoteDocument tiers={tiers} customerName={contact.data.name} quoteRef={contact.data.quoteId.slice(0, 8).toUpperCase()} />
  );

  const safeName = escapeHtml(contact.data.name);
  const safePhone = escapeHtml(contact.data.phone);
  const safeEmail = escapeHtml(contact.data.email);
  const safePostcode = escapeHtml(contact.data.postcode);

  await notifyDirectors({
    subject: `💷 BOILER QUOTE £${recommended.priceLow.toLocaleString()}–£${recommended.priceHigh.toLocaleString()} — ${safeName} — ${safePostcode}`,
    html: `<p>${safeName} · ${safePhone} · ${safeEmail} · ${safePostcode}</p><p>Recommended: ${escapeHtml(recommended.boiler)}, £${recommended.priceLow}–£${recommended.priceHigh}</p>`,
  });

  await sendEmail({
    to: contact.data.email,
    subject: "Your Hartson boiler quote",
    html: `<p>Hi ${safeName},</p><p>Your indicative quote is attached. We'll be in touch to book a free survey and confirm the final price.</p>`,
    attachments: [{ filename: "hartson-boiler-quote.pdf", content: pdfBuffer }],
  });

  return { status: "success", tiers, pdfBase64: pdfBuffer.toString("base64") };
}
