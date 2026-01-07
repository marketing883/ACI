import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ChatWidgetWrapper from "@/components/chat/ChatWidgetWrapper";

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
      <body className="antialiased">
        <Navigation />
        <main className="pt-20">{children}</main>
        <Footer />
        <ChatWidgetWrapper />
      </body>
    </html>
  );
}
