/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    backendUrl: process.env.NEXT_SERVER_BACKEND_URL,
  },
  publicRuntimeConfig: {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
};

module.exports = nextConfig;
