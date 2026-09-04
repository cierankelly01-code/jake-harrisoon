import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allows a production build to run without clobbering the dev server's
     .next directory (set NEXT_DIST_DIR when building alongside `next dev`). */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
