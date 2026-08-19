/** Escapes user-supplied text before it's interpolated into an HTML email
 * template. Every server action that builds email HTML from form input
 * must run each interpolated field through this first. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
