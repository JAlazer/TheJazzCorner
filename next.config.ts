const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'static.thenounproject.com',
      },
    ],
  },
};

module.exports = nextConfig;