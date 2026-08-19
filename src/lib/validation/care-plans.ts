import { z } from "zod";

export const carePlanSignupSchema = z.object({
  tier: z.enum(["service", "cover", "complete"]),
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z.string().trim().min(6, "Enter a phone number").max(40),
  address: z.string().trim().min(4, "Enter your address").max(300),
  postcode: z.string().trim().min(4, "Enter a postcode").max(12),
});

export type CarePlanSignupInput = z.infer<typeof carePlanSignupSchema>;
