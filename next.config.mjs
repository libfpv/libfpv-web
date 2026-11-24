import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Self-contained server in .next/standalone, used by the Docker image.
  output: "standalone",
  // `next dev` only serves its scripts and live reload to localhost by default:
  // opened as 127.0.0.1 (e.g. through a forwarded port), the page would never
  // hydrate. Development only; production builds ignore this.
  allowedDevOrigins: ["127.0.0.1"],
};

export default withNextIntl(nextConfig);
