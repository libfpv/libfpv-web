import type { ReactNode } from "react";

/**
 * Tags shared by every translated string, for t.rich(): <nbsp></nbsp> is a
 * non-breaking space (as on hammerill.com) and <b> is bold.
 */
export const tags = {
  nbsp: () => " ",
  b: (chunks: ReactNode) => <b>{chunks}</b>,
};

/** "A, B and C" in the page's language. */
export function joinList(locale: string, items: string[]) {
  return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items);
}
