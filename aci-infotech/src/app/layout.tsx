import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300;400;500;600;700;800&family=Funnel+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">
        <GoogleAnalytics />
        <ConditionalLayout>{children}</ConditionalLayout>
        <CookieConsent />
      </body>
    </html>
  );
}
