import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Minimal Header - Logo only, no navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/aci-infotech-logo.png"
                alt="ACI Infotech"
                width={160}
                height={40}
                className="h-9 w-auto"
                priority
              />
            </Link>

            {/* Contact Info - Subtle */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <a href="tel:+16099362729" className="hover:text-[var(--aci-primary)] transition-colors">
                +1 (609) 936-2729
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - No footer on landing pages */}
      <main>
        {children}
      </main>
    </div>
  );
}
