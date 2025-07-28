/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "node-server",
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
