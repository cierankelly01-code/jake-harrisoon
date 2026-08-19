import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseServiceConfigured } from "@/lib/env";

/**
 * Service-role client for server actions only. Never import this from a
 * client component. RLS is still enabled on every table (deny-by-default);
 * this key bypasses it deliberately for trusted server-side writes after
 * zod validation, mirroring the Definition of Done in the master brief.
 */
export function getSupabaseServiceClient(): SupabaseClient | null {
  if (!isSupabaseServiceConfigured()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
