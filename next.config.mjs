import { PHASE_PRODUCTION_BUILD } from "next/constants.js";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => ({
  reactStrictMode: true,
  // Self-contained server in .next/standalone, used by the Docker image.
  output: "standalone",
  // A new id for every build: a tab still running the previous deploy's
  // scripts then gets a full reload when it navigates, instead of mixing old
  // scripts with the new server's pages ("This page couldn't load"). The
  // standalone server keeps the id it was built with (.next/standalone/server.js).
  deploymentId:
    process.env.NEXT_DEPLOYMENT_ID || (phase === PHASE_PRODUCTION_BUILD ? `b${Date.now().toString(36)}` : undefined),
  // `next dev` only serves its scripts and live reload to localhost by default:
  // opened as 127.0.0.1 (e.g. through a forwarded port), the page would never
  // hydrate. Development only; production builds ignore this.
  allowedDevOrigins: ["127.0.0.1"],
});

const config = (phase) => withNextIntl(nextConfig(phase));

export default config;
