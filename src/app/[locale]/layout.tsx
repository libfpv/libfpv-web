import type { Metadata, Viewport } from "next";
// Self-hosted from npm (Fontsource): served by this site, and the build fetches nothing from Google.
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/vt323";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ThemeProvider } from "@/components/theme-provider";
import { routing, type Locale } from "@/navigation";
import "./globals.css";

/** Only these namespaces are used by client components, so only they are sent to the browser. */
const clientNamespaces = ["header", "hero", "games", "webBuild", "stars", "gallery", "counters"] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL("https://libfpv.com"),
    title: t("title"),
    description: t("description"),
    applicationName: "libfpv",
    creator: "Hammerill",
    keywords: t("keywords").split(", "),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "libfpv",
      type: "website",
      locale,
      images: [{ url: "/games/gtasa.jpg", width: 400, height: 224, alt: t("ogAlt") }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const clientMessages = Object.fromEntries(clientNamespaces.map((ns) => [ns, messages[ns]]));

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="overflow-x-hidden font-sans">
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <script
          async
          src="https://ackee.hammerill.com/tracker.js"
          data-ackee-server="https://ackee.hammerill.com"
          data-ackee-domain-id="db13ab8d-3252-4e1e-9db2-896f6cf05012"
          data-ackee-opts='{ "detailed": true }'
        ></script>
      </body>
    </html>
  );
}
