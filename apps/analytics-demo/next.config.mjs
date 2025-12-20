/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    enabled: true,
    root: __dirname,
  },
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
};

export default nextConfig;
