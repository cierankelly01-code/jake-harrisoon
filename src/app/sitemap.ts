import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Every route that exists in this build. Nothing speculative is listed —
 * a sitemap that advertises Phase 2/3 pages before they exist just earns
 * a pile of soft-404s in Search Console.
 *
 * `lastModified` is set at build time rather than per-page, because there
 * is no CMS yet to give a page a real edited-at date, and a fabricated
 * per-page date is worse than an honest build date. When Phase 2 adds a
 * content source, swap the constant for the real timestamps.
 */

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const ROUTES: Entry[] = [
  // /commercial and /domestic are the real, indexable homepages (see
  // DESIGN_SYSTEM.md §10) — `/` renders the same content cookie-driven and
  // sets its own canonical to whichever of these it resolved to, so it is
  // deliberately not listed here at a competing priority.
  { path: "/commercial", priority: 1.0, changeFrequency: "weekly" },
  { path: "/domestic", priority: 1.0, changeFrequency: "weekly" },
  { path: "/", priority: 0.5, changeFrequency: "weekly" },
  // The two live conversion paths — these earn the highest non-home priority.
  { path: "/boiler-quote", priority: 0.9, changeFrequency: "monthly" },
  { path: "/emergency", priority: 0.9, changeFrequency: "monthly" },
  { path: "/tenders", priority: 0.9, changeFrequency: "monthly" },
  { path: "/capability", priority: 0.8, changeFrequency: "monthly" },
  { path: "/care-plans", priority: 0.8, changeFrequency: "monthly" },
  { path: "/prices", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
