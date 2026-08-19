import { z } from "zod";

export const capabilityDownloadSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  organisation: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(160),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  sector: z.string().trim().max(120).optional().or(z.literal("")),
});

export type CapabilityDownloadInput = z.infer<typeof capabilityDownloadSchema>;
