import type { Metadata, Viewport } from "next";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { EVENT, TAGLINE } from "@/content/event";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description = `${TAGLINE} – szkolny turniej League of Legends, ${EVENT.weekday} ${EVENT.dateLabel}, ${EVENT.school}. Zgłoś drużynę, przeczytaj regulamin i śledź drabinkę na żywo.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${TAGLINE} // PZS E-SPORTS`,
    template: "%s // PZS E-SPORTS",
  },
  description,
  applicationName: "PZS E-SPORTS",
  keywords: ["turniej e-sportowy", "PZS Lędziny", "League of Legends", "LoL", "szkolny turniej"],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "PZS E-SPORTS 2026",
    title: TAGLINE,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: TAGLINE,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#010a13",
  colorScheme: "dark",
};

// ustawia flagę przed pierwszym malowaniem, żeby intro nie mignęło przy powrocie w tej samej sesji
const BOOT_FLAG = `try{if(sessionStorage.getItem("pzs.boot")==="1")document.documentElement.setAttribute("data-booted","")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/marcellus-sc-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/barlow-sc-400-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: BOOT_FLAG }} />
      </head>
      <body className="min-h-dvh">
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
