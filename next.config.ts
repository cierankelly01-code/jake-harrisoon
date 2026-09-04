import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allows a production build to run without clobbering the dev server's
     .next directory (set NEXT_DIST_DIR when building alongside `next dev`). */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /* Dev-only floating "N" badge (bottom-left, route/build indicator). It
     doesn't ship to production either way, but it sits directly on top of
     live content in every dev-server screenshot our own review process
     takes — a fresh reviewer flagged it as obscuring copy on three separate
     pages. Off, so screenshots show what a visitor actually sees. */
  devIndicators: false,
};

export default nextConfig;
