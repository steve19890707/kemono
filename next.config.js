/** @type {import('next').NextConfig} */
const { DeleteSourceMapsPlugin } = require("webpack-delete-sourcemaps-plugin");

const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

const nextConfig = {
  output: isGitHubPages ? "export" : "standalone",
  ...(isGitHubPages
    ? {
        basePath: "/kemono",
        assetPrefix: "/kemono/",
        images: {
          unoptimized: true,
        },
        trailingSlash: true,
      }
    : {
        async redirects() {
          return [
            {
              source: "/demo",
              destination: "/",
              permanent: true,
            },
          ];
        },
      }),
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new DeleteSourceMapsPlugin({ isServer, keepServerSourcemaps: true })
    );
    return config;
  },
};

module.exports = nextConfig;
