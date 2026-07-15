import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import ClientProviders from "@/components/layout/ClientProviders";
import GlobalStructuredData from "@/components/seo/StructuredData";
import { CONSENT_DEFAULT_SCRIPT, GTM_BOOTSTRAP_SCRIPT, GTM_ID } from "@/lib/analytics/consent";

// Self-hosted, automatically subset, font-display: swap. Replaces the
// render-blocking <link> to fonts.googleapis.com that v1 was using.
// Variables here feed the @theme inline tokens in globals.css so every
// `var(--font-sans|title|mono)` reference keeps working unchanged.
//
// Weight set is the audited minimum:
//   - Funnel_Sans: 400/500/600/700 — body inherits 400, buttons + nav
//     hover states use 500/600/700.
//   - Funnel_Display: 500/600/700 — only used at display sizes; the
//     hero italic word ("Delivered.") sits at 500, headings at 700,
//     menu titles at 600. Weight 400 is unused in the display font.
//   - JetBrains_Mono: 400/500 — eyebrows/scroll cues default to 400;
//     a handful of accent labels use 500. preload:false because the
//     mono is only used in 10-12px decorative text and never blocks
//     the LCP element; letting it load lazily frees a connection slot
//     during the first paint.
const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-funnel-sans",
  display: "swap",
});

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-funnel-display",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

// Explicit viewport export. Next.js auto-generates a sensible default
// when this is missing, but Lighthouse occasionally flags the
// "viewport meta tag" audit on mobile if the default isn't picked up
// (e.g. when a third party rewrites the HTML head). Declaring it here
// removes the ambiguity. `themeColor` matches --v2-bg so iOS Safari's
// status bar and Chrome's address bar tint align with the dark
// homepage instead of flashing the system white.
// themeColor matches the white v4 homepage so iOS Safari's status bar
// and Chrome's address bar don't flash a dark tint over a light page.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "ACI Infotech | Enterprise Data & AI, Engineered and Run in Production",
    template: "%s | ACI Infotech",
  },
  description:
    "ACI Infotech engineers the data foundation, builds the AI on top, and runs both in production. Data engineering, applied AI, cloud modernization, and managed operations for large enterprises.",
  keywords:
    "enterprise data engineering, applied AI consulting, cloud modernization, managed operations, lakehouse, Databricks, Snowflake, Azure, production-grade engineering",
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
    title: "ACI Infotech | Enterprise Data & AI, Engineered and Run in Production",
    description:
      "We engineer the data foundation, build the AI on top, and run both in production. 500+ enterprise deployments, documented in playbooks.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ACI Infotech: Build the AI foundation. Run it in production.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACI Infotech | Enterprise Data & AI, Engineered and Run in Production",
    description:
      "We engineer the data foundation, build the AI on top, and run both in production.",
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
        {/* Consent Mode v2: set all signals to denied by default and
            replay a returning visitor's stored choice. Server-rendered
            inline so it executes on parse, before GTM and any Google tag. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
        {/* Google Tag Manager — canonical install, server-rendered inline
            in <head> right after the consent default so the container is
            present in the initial HTML and executes on parse. Loading it
            here (not via next/script in a dynamic ssr:false client
            component) is what makes Tag Assistant actually find it. */}
        <script dangerouslySetInnerHTML={{ __html: GTM_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        {/* GTM noscript fallback — first thing in <body> per Google's
            install. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <GlobalStructuredData />
        <ConditionalLayout>{children}</ConditionalLayout>
        <ClientProviders />
      </body>
    </html>
  );
}
