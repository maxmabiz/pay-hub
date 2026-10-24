import type { NextConfig } from "next";

/**
 * GitHub Pages（project site）需要 basePath = /<repo>。
 * Actions 中自动读取 GITHUB_REPOSITORY；本地开发默认无 basePath。
 * 也可通过 NEXT_PUBLIC_BASE_PATH=/pay-hub 覆盖。
 */
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "pay-hub";
const explicit = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath =
  explicit !== undefined
    ? explicit
    : process.env.GITHUB_ACTIONS === "true"
      ? `/${repoName}`
      : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
