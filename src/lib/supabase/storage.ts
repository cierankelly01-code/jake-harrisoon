import "server-only";
import { randomUUID } from "crypto";
import { getSupabaseServiceClient } from "./server";
import { stubLog } from "@/lib/env";

/**
 * Uploads a File from a server action's FormData to Supabase Storage.
 * Returns the storage path (not a public URL — these buckets are private;
 * /ops generates signed URLs when a director needs to view a document).
 * Stubs to a fake path when Supabase isn't configured yet, so upload flows
 * are fully exercisable in dev.
 */
export async function uploadToStorage(
  bucket: string,
  file: File,
  prefix: string
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const supabase = getSupabaseServiceClient();
  const path = `${prefix}/${randomUUID()}-${file.name}`;

  if (!supabase) {
    stubLog(`storage upload to ${bucket}`, { path, size: file.size, type: file.type });
    return path;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error(`[storage] upload to ${bucket} failed`, error);
    return null;
  }
  return path;
}
