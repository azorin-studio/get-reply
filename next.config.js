/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['bullmq']
  },
  modularizeImports: {
    'react-icons': {
      transform: 'react-icons/{{member}}',
    }
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    
    return config;
  },
}

module.exports = nextConfig
