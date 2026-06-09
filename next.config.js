/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.api-football.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
