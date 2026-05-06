import type { NextConfig } from "next";

const isCustomDomain = process.env.CUSTOM_DOMAIN === "true";

const config: NextConfig = {
  output: "export",
  basePath: isCustomDomain ? "" : "/hatch-n-harvest",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
