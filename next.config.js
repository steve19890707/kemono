/** @type {import('next').NextConfig} */
const { DeleteSourceMapsPlugin } = require("webpack-delete-sourcemaps-plugin");

const nextConfig = {
  output: "standalone",
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
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
