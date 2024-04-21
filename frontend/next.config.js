/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    backendUrl: process.env.BACKEND_URL,
  },
  publicRuntimeConfig: {
    backendUrl: process.env.BACKEND_URL,
  },
};

module.exports = nextConfig;
