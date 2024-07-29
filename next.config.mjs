import NextPWA from "next-pwa";

const withPWA = NextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200
        }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
};

export default withPWA(nextConfig);
