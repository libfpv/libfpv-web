/**
 * Site-wide links. If paypal is emptied, the PayPal button shows as "coming soon".
 */
export const links = {
  patreon: "https://patreon.com/Hammerill",
  paypal: "https://paypal.me/hammerill",
  github: "https://github.com/hammerill/libfpv",
  author: "https://hammerill.com",
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
