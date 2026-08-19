"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { headers } from "next/headers";
import { quoteStepSchema, quoteContactSchema } from "@/lib/validation/boiler-quote";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { uploadToStorage } from "@/lib/supabase/storage";
import { isRateLimited } from "@/lib/security/rate-limit";
import { sendEmail } from "@/lib/email/send";
import { business } from "@/lib/content/business";
import { calculateQuote, type QuoteInput, type QuoteTier } from "@/lib/quote/pricing";
import { BoilerQuoteDocument } from "@/lib/pdf/boiler-quote";

/**
 * Saves the wizard's cumulative answers after every step — this is the
 * abandonment-capture mechanism from §9.1: any phone number given at any
 * step becomes a lead immediately, even if the visitor never reaches the
 * final screen. The scheduled +2h/+24h nudge email itself is a Phase 3
 * automation engine (§11) — this action only does the capture half.
 */
export async function saveQuoteStep(formData: FormData): Promise<{ ok: boolean }> {
  const parsed = quoteStepSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false };

  const supabase = getSupabaseServiceClient();
  const photoFile = formData.get("photo") as File | null;
  const photoPath = photoFile && photoFile.size > 0 ? await uploadToStorage("boiler-quote-photos", photoFile, "boiler-quotes") : null;

  if (!supabase) {
    console.warn("[STUB] boiler_quotes upsert", { ...parsed.data, photoPath });
    return { ok: true };
  }

  const { data: existing } = await supabase
    .from("boiler_quotes")
    .select("photo_urls")
    .eq("id", parsed.data.quoteId)
    .maybeSingle();

  const photoUrls = [...(existing?.photo_urls ?? []), ...(photoPath ? [photoPath] : [])];

  let leadId: string | null = null;
  if (parsed.data.phone) {
    const { data: lead } = await supabase
      .from("leads")
      .upsert(
        {
          division: "domestic",
          type: "boiler_quote",
          name: "Boiler quote — in progress",
          phone: parsed.data.phone,
          postcode: parsed.data.postcode ?? null,
          source_page: "/boiler-quote",
          idempotency_key: `quote:${parsed.data.quoteId}`,
        },
        { onConflict: "idempotency_key" }
      )
      .select("id")
      .single();
    leadId = lead?.id ?? null;
  }

  const { quoteId, ...patch } = parsed.data;
  const { error } = await supabase.from("boiler_quotes").upsert(
    {
      id: quoteId,
      ...patch,
      photo_urls: photoUrls,
      completed_step: Object.keys(patch).at(-1) ?? "unknown",
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
  if (isRateLimited(`boiler-quote:${ip}`, 5, 60_000)) {
    return { status: "error", message: "Too many requests. Try again in a minute." };
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

  const quoteInput: QuoteInput = {
    propertyType: (formData.get("propertyType") as QuoteInput["propertyType"]) || "semi_detached",
    bedrooms: Number(formData.get("bedrooms")) || 3,
    bathrooms: Number(formData.get("bathrooms")) || 1,
    currentSystem: (formData.get("currentSystem") as QuoteInput["currentSystem"]) || "combi",
    movingLocation: formData.get("boilerLocation") !== formData.get("targetLocation"),
  };

  const tiers = calculateQuote(quoteInput);
  const recommended = tiers.find((t) => t.tier === "recommended")!;

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
          completed_step: "contact",
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

  await sendEmail({
    to: [business.emailGeneral ?? "info@marmion.example"],
    subject: `💷 BOILER QUOTE £${recommended.priceLow.toLocaleString()}–£${recommended.priceHigh.toLocaleString()} — ${contact.data.name} — ${contact.data.postcode}`,
    html: `<p>${contact.data.name} · ${contact.data.phone} · ${contact.data.email} · ${contact.data.postcode}</p><p>Recommended: ${recommended.boiler}, £${recommended.priceLow}–£${recommended.priceHigh}</p>`,
  });

  await sendEmail({
    to: contact.data.email,
    subject: "Your Marmion boiler quote",
    html: `<p>Hi ${contact.data.name},</p><p>Your indicative quote is attached. We'll be in touch to book a free survey and confirm the final price.</p>`,
    attachments: [{ filename: "marmion-boiler-quote.pdf", content: pdfBuffer }],
  });

  return { status: "success", tiers, pdfBase64: pdfBuffer.toString("base64") };
}
