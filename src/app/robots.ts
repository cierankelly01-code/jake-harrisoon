import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * BUSINESS DECISION — AI crawlers are ALLOWED. Reversible in one line.
 * ─────────────────────────────────────────────────────────────────────────
 * A growing share of "who does commercial PPM near Tamworth?" now happens
 * inside ChatGPT, Claude, Perplexity and Google's AI Overviews rather than
 * on a results page. For a local trade business, being the firm those
 * answers name is worth more than the content is worth withholding —
 * everything on this site is marketing copy the business WANTS repeated.
 * There is no paywalled or proprietary content here to protect.
 *
 * If the owner ever wants the opposite, change `allow: "/"` to
 * `disallow: "/"` in the AI_CRAWLERS rule below. That is the whole change.
 * Note it only affects crawlers that honour robots.txt, and it does not
 * retroactively remove anything already trained on or indexed.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — ChatGPT training + browsing
  "OAI-SearchBot", // OpenAI — ChatGPT search index
  "ChatGPT-User", // OpenAI — user-initiated page fetches
  "ClaudeBot", // Anthropic — Claude crawler
  "Claude-Web", // Anthropic — legacy/user-initiated
  "anthropic-ai", // Anthropic — legacy token
  "PerplexityBot", // Perplexity — search index
  "Perplexity-User", // Perplexity — user-initiated page fetches
  "Google-Extended", // Google — Gemini / AI Overviews grounding opt-in
  "Applebot-Extended", // Apple — Apple Intelligence
  "CCBot", // Common Crawl — feeds many downstream models
  "cohere-ai",
  "meta-externalagent",
];

/**
 * Stripe bounces care-plan checkout back with ?success / ?cancelled, and the
 * API namespace has nothing indexable in it. Shared by both rules: in
 * robots.txt a named user-agent group REPLACES the `*` group rather than
 * merging with it, so omitting these from the AI rule granted those crawlers
 * exactly the paths the `*` rule is there to withhold.
 */
const DISALLOW = ["/api/", "/care-plans?"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Ordinary search crawlers.
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        // See the note above — flip `allow` to `disallow` to opt out.
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    // No `host:` directive — it's a Yandex-only extension that Google ignores,
    // and Next emits it with the scheme attached, which isn't the format it
    // expects anyway. The canonical origin is asserted via metadataBase instead.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
