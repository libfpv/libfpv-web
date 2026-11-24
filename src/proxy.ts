import createIntlMiddleware from "next-intl/middleware";

import { routing } from "@/navigation";

export const config = {
  // Every path except the API, Next.js internals and static files (anything with a dot, e.g. /games/sm64.mp4).
  matcher: ["/((?!api/|_next|_vercel|.*\\..*).*)"],
};

export default createIntlMiddleware(routing);
