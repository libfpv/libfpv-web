/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Self-contained server in .next/standalone, used by the Docker image.
  output: "standalone",
};

export default nextConfig;
