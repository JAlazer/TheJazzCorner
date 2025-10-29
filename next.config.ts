/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'static.thenounproject.com',
      },
    ],
  },
};

module.exports = nextConfig;