import { z } from "zod";

export const quoteStepSchema = z.object({
  quoteId: z.string().uuid(),
  propertyType: z.enum(["flat", "terraced", "semi_detached", "detached", "bungalow"]).optional(),
  bedrooms: z.coerce.number().int().min(1).max(10).optional(),
  bathrooms: z.coerce.number().int().min(1).max(6).optional(),
  showerType: z.string().max(60).optional(),
  currentSystem: z.enum(["combi", "system", "regular", "back_boiler", "electric", "none"]).optional(),
  boilerLocation: z.string().max(120).optional(),
  targetLocation: z.string().max(120).optional(),
  fuelType: z.string().max(60).optional(),
  urgency: z.string().max(60).optional(),
  postcode: z.string().max(12).optional(),
  phone: z.string().max(40).optional(),
});

export const quoteContactSchema = z.object({
  quoteId: z.string().uuid(),
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z.string().trim().min(6, "Enter a phone number").max(40),
  postcode: z.string().trim().min(4, "Enter a postcode").max(12),
});

export type QuoteStepInput = z.infer<typeof quoteStepSchema>;
export type QuoteContactInput = z.infer<typeof quoteContactSchema>;
