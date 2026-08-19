import "server-only";
import { randomUUID } from "crypto";
import { getSupabaseServiceClient } from "./server";
import { stubLog } from "@/lib/env";

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

const ALLOWED_TYPES: Record<string, string[]> = {
  photo: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

/**
 * Uploads a File from a server action's FormData to Supabase Storage.
 * Returns the storage path (not a public URL — these buckets are private;
 * /ops generates signed URLs when a director needs to view a document).
 * Stubs to a fake path when Supabase isn't configured yet, so upload flows
 * are fully exercisable in dev.
 *
 * `kind` enforces a server-side size + MIME allow-list — the dropzone's
 * `accept: "image/*"` on the client is a UX hint only and doesn't stop a
 * direct call to the server action with an arbitrary file.
 */
export async function uploadToStorage(
  bucket: string,
  file: File,
  prefix: string,
  kind: "photo" | "document" = "document"
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (file.size > MAX_FILE_BYTES) {
    console.warn(`[storage] rejected upload to ${bucket}: ${file.size} bytes exceeds limit`);
    return null;
  }
  if (!ALLOWED_TYPES[kind].includes(file.type)) {
    console.warn(`[storage] rejected upload to ${bucket}: disallowed type ${file.type}`);
    return null;
  }

  const supabase = getSupabaseServiceClient();
  const path = `${prefix}/${randomUUID()}-${sanitizeFilename(file.name)}`;

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
