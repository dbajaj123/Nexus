/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com'], // For Google Cloud Storage
  },
};

module.exports = nextConfig;
