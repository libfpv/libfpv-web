import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Self-contained server in .next/standalone, used by the Docker image.
  output: "standalone",
};

export default withNextIntl(nextConfig);
