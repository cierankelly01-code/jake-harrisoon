"use server";

import { headers } from "next/headers";
import { carePlanSignupSchema } from "@/lib/validation/care-plans";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe/server";
import { protectFormSubmission } from "@/lib/security/guard";
import { CARE_PLANS } from "@/lib/care-plans/tiers";

export type CarePlanActionState = {
  status: "idle" | "redirect" | "stub" | "error";
  url?: string;
  message?: string;
};

export async function signUpForCarePlan(
  _prev: CarePlanActionState,
  formData: FormData
): Promise<CarePlanActionState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for") ?? "unknown";
  const guard = await protectFormSubmission(formData, `care-plans:${ip}`);
  if (!guard.ok) {
    if (guard.silent) return { status: "idle" };
    return { status: "error", message: guard.message };
  }

  const parsed = carePlanSignupSchema.safeParse({
    tier: formData.get("tier"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    postcode: formData.get("postcode"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const plan = CARE_PLANS.find((p) => p.tier === parsed.data.tier);
  if (!plan) {
    // Only reachable if the <select>/hidden tier value diverges from
    // CARE_PLANS (e.g. a stale client bundle after a tier was renamed).
    return { status: "error", message: "That plan isn't available right now — please pick again." };
  }

  const supabase = getSupabaseServiceClient();
  let memberId: string | null = null;

  if (supabase) {
    const { data: member, error } = await supabase
      .from("care_plan_members")
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        address: parsed.data.address,
        postcode: parsed.data.postcode,
        tier: parsed.data.tier,
        status: "pending",
      })
      .select("id")
      .single();
    if (error) console.error("[care_plan_members] insert failed", error);
    memberId = member?.id ?? null;
  } else {
    console.warn("[STUB] care_plan_members insert", parsed.data);
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return {
      status: "stub",
      message:
        "Stripe isn't connected yet, so this is a preview of the checkout flow — your details are saved and a director will be in touch to set up payment.",
    };
  }

  const origin = h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: parsed.data.email,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          recurring: { interval: "month" },
          unit_amount: plan.monthlyPriceGbp * 100,
          product_data: { name: `Marmion Care Plan — ${plan.name}` },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/care-plans?success=1`,
    cancel_url: `${origin}/care-plans?cancelled=1`,
    metadata: { care_plan_member_id: memberId ?? "", tier: parsed.data.tier },
  });

  return { status: "redirect", url: session.url ?? undefined };
}
