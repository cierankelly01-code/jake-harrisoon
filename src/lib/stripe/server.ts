import "server-only";
import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/env";

export function getStripeClient(): Stripe | null {
  if (!isStripeConfigured()) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}
