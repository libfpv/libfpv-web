/**
 * Site-wide links. If paypal is emptied, the PayPal button shows as "coming soon".
 */
export const links = {
  patreon: "https://patreon.com/Hammerill",
  paypal: "https://paypal.me/hammerill",
  github: "https://github.com/hammerill/libfpv",
  author: "https://hammerill.com",
  /** The story of how libfpv was made. No locale: hammerill.com redirects to the visitor's. */
  blog: "https://hammerill.com/blog/libfpv",
  social: {
    youtube: "https://youtube.com/@hammerill",
    instagram: "https://instagram.com/hammerill_",
    tiktok: "https://tiktok.com/@hammerill_",
  },
  docs: {
    integration: "https://github.com/hammerill/libfpv/blob/main/docs/INTEGRATION.md",
    web: "https://github.com/hammerill/libfpv/blob/main/docs/WEB.md",
    publishing: "https://github.com/hammerill/libfpv/blob/main/docs/PUBLISHING.md",
    header: "https://github.com/hammerill/libfpv/blob/main/include/libfpv.h",
  },
} as const;
