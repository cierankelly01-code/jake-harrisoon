import type { Metadata } from "next";
import { EmergencyTriage } from "@/components/emergency/emergency-triage";

export const metadata: Metadata = {
  title: "Emergency? No Heat, Leak or Gas Smell",
  description:
    "Smell gas, a leak, no heat or no hot water: what to check right now, and how to get an engineer out. Two-hour arrival windows, no callout fee on quoted work.",
  alternates: { canonical: "/emergency" },
  openGraph: {
    url: "/emergency",
    title: "Emergency? No Heat, Leak or Gas Smell",
    description:
      "Smell gas, a leak, no heat or no hot water: what to check right now, and how to get an engineer out.",
  },
};

export default function EmergencyPage() {
  return <EmergencyTriage />;
}
