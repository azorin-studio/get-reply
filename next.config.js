/** @type {import('next').NextConfig} */

const CopyWebpackPlugin = require('copy-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.plugins = [
      ...config.plugins,
      new CopyWebpackPlugin({
        patterns: [{
            from: "node_modules/bull/lib/commands",
            to: "./server/app/api/process-email"
         }]
      }),
      new CopyWebpackPlugin({
        patterns: [{
            from: "node_modules/bull/lib/commands",
            to: "./server/app/api/get-jobs"
         }]
      }),
    ]

    return config;
  },
}

module.exports = nextConfig
