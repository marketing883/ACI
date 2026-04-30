import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import ClientProviders from "@/components/layout/ClientProviders";
import GlobalStructuredData from "@/components/seo/StructuredData";

// Self-hosted, automatically subset, font-display: swap. Replaces the
// render-blocking <link> to fonts.googleapis.com that v1 was using.
// Variables here feed the @theme inline tokens in globals.css so every
// `var(--font-sans|title|mono)` reference keeps working unchanged.
const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-funnel-sans",
  display: "swap",
});

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-funnel-display",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const USE_V2_HOME = process.env.NEXT_PUBLIC_USE_V2_HOME === "true";

// Explicit viewport export. Next.js auto-generates a sensible default
// when this is missing, but Lighthouse occasionally flags the
// "viewport meta tag" audit on mobile if the default isn't picked up
// (e.g. when a third party rewrites the HTML head). Declaring it here
// removes the ambiguity. `themeColor` matches --v2-bg so iOS Safari's
// status bar and Chrome's address bar tint align with the dark
// homepage instead of flashing the system white.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050B1F",
};

export const metadata: Metadata = {
  title: {
    default: "ACI Infotech | Production-Grade Engineering at Enterprise Scale",
    template: "%s | ACI Infotech",
  },
  description:
    "We build data platforms, AI systems, and cloud architectures for Fortune 500 operations. Senior architects. Production code with SLAs. We answer the 2am call.",
  keywords:
    "enterprise data engineering, AI ML consulting, cloud modernization, Fortune 500 technology consulting, production-grade engineering",
  authors: [{ name: "ACI Infotech" }],
  creator: "ACI Infotech",
  publisher: "ACI Infotech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aciinfotech.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aciinfotech.com",
    siteName: "ACI Infotech",
    title: "ACI Infotech | Production-Grade Engineering at Enterprise Scale",
    description:
      "We build data platforms, AI systems, and cloud architectures for Fortune 500 operations. Senior architects. Production code with SLAs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ACI Infotech - Enterprise Technology Consulting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACI Infotech | Production-Grade Engineering at Enterprise Scale",
    description:
      "We build data platforms, AI systems, and cloud architectures for Fortune 500 operations.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/brand/favicon-32.png",
    apple: "/brand/favicon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${funnelSans.variable} ${funnelDisplay.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        {/* Preload v1's hero poster only on v1 builds. The v2 hero uses
            its own video + parallax stack and never references this
            asset, so preloading it on v2 wasted ~4KB and a connection
            slot. */}
        {!USE_V2_HOME && (
          <link rel="preload" href="/images/hero-poster.webp" as="image" type="image/webp" />
        )}
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <GlobalStructuredData />
        <ConditionalLayout>{children}</ConditionalLayout>
        <ClientProviders />
      </body>
    </html>
  );
}
