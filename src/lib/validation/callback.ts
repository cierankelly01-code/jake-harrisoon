import { z } from "zod";

export const CALLBACK_TOPICS = [
  { value: "new_boiler", label: "A new boiler" },
  { value: "breakdown", label: "Boiler breakdown or no heating" },
  { value: "leak", label: "A leak or plumbing problem" },
  { value: "service", label: "Boiler service or gas safety certificate" },
  { value: "care_plan", label: "A care plan" },
  { value: "other", label: "Something else" },
] as const;

export const CALLBACK_TIMES = [
  { value: "asap", label: "As soon as possible" },
  { value: "morning", label: "Morning (8am–12pm)" },
  { value: "afternoon", label: "Afternoon (12pm–5pm)" },
  { value: "evening", label: "Early evening (5pm–7pm)" },
] as const;

const topicValues = CALLBACK_TOPICS.map((t) => t.value) as [string, ...string[]];
const timeValues = CALLBACK_TIMES.map((t) => t.value) as [string, ...string[]];

export const callbackSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(80),
  phone: z
    .string()
    .trim()
    .min(10, "Enter the number to ring you back on.")
    .max(20)
    .regex(/^[\d\s+()-]+$/, "That doesn't look like a phone number."),
  postcode: z
    .string()
    .trim()
    .toUpperCase()
    .min(5, "Enter your postcode so we can check we cover you.")
    .max(8),
  topic: z.enum(topicValues, { message: "Choose what it's about." }),
  bestTime: z.enum(timeValues, { message: "Choose a time." }),
  message: z.string().trim().max(1000).optional(),
});

export type CallbackInput = z.infer<typeof callbackSchema>;
