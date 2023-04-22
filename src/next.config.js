/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["ui-avatars.com", "storage.cloud.google.com"]
  }
}

module.exports = nextConfig
