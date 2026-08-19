import { z } from "zod";

export const tenderEnquirySchema = z.object({
  organisation: z.string().trim().min(2, "Enter your organisation").max(200),
  contactName: z.string().trim().min(2, "Enter a contact name").max(120),
  contactRole: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  sector: z.string().trim().max(120).optional().or(z.literal("")),
  contractType: z.enum(["ppm", "reactive", "installation", "framework", "one_off"]),
  siteCount: z.coerce.number().int().min(1).max(100000).optional(),
  valueBand: z.string().trim().max(120).optional().or(z.literal("")),
  termMonths: z.coerce.number().int().min(0).max(600).optional(),
  deadline: z.string().trim().optional().or(z.literal("")),
  pqqRequired: z.coerce.boolean().optional(),
  frameworkName: z.string().trim().max(200).optional().or(z.literal("")),
  currentProvider: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
});

export type TenderEnquiryInput = z.infer<typeof tenderEnquirySchema>;
