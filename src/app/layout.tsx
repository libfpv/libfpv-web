import type { Metadata, Viewport } from "next";
import { Inter, VT323, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const osd = VT323({ subsets: ["latin"], weight: "400", variable: "--font-osd" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const description =
  "libfpv drops a real FPV quadcopter, running real Betaflight firmware, into any game: Super Mario 64, GTA IV, GTA San Andreas, Vice City, Portal 2 and more. Free and open source.";

export const metadata: Metadata = {
  title: "libfpv: FPV drone in any game",
  description,
  applicationName: "libfpv",
  creator: "Hammerill",
  keywords: ["libfpv", "FPV", "drone", "quadcopter", "Betaflight", "game mod", "GTA", "Mario 64", "Portal 2", "open source"],
  openGraph: {
    title: "libfpv: FPV drone in any game",
    description,
    siteName: "libfpv",
    type: "website",
    images: [{ url: "/games/gtasa.jpg", width: 400, height: 224, alt: "GTA San Andreas FPV" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${osd.variable} ${mono.variable} overflow-x-hidden font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
