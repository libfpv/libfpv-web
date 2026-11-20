import type { Metadata, Viewport } from "next";
import { Inter, VT323, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ThemeProvider } from "@/components/theme-provider";
import { routing, type Locale } from "@/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const osd = VT323({ subsets: ["latin"], weight: "400", variable: "--font-osd" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-mono" });

/** Only these namespaces are used by client components, so only they are sent to the browser. */
const clientNamespaces = ["header", "hero", "games", "webBuild", "stars", "gallery"] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
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
  params: { locale },
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const clientMessages = Object.fromEntries(clientNamespaces.map((ns) => [ns, messages[ns]]));

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${osd.variable} ${mono.variable} overflow-x-hidden font-sans`}>
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
