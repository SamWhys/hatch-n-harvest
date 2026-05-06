import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  basePath: "/hatch-n-harvest",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
