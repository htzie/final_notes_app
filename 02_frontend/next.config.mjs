/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_HOST:
      process.env.API_HOST || "http://localhost:3001",
  },
};

export default nextConfig;
