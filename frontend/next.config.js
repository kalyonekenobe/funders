/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    backendUrl: process.env.BACKEND_URL,
  },
  publicRuntimeConfig: {
    backendUrl: process.env.BACKEND_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;
