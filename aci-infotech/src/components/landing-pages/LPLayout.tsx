'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LPLayoutProps {
  children: ReactNode;
  showMinimalFooter?: boolean;
}

export default function LPLayout({ children, showMinimalFooter = true }: LPLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header - Logo only, no navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-block">
            <Image
              src="/aci-infotech-logo-white.png"
              alt="ACI Infotech"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Minimal Footer */}
      {showMinimalFooter && (
        <footer className="bg-[#0A1628] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <Image
                  src="/aci-infotech-logo-white.png"
                  alt="ACI Infotech"
                  width={120}
                  height={35}
                  className="h-8 w-auto opacity-80"
                />
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
                  <span>Microsoft Partner</span>
                  <span>•</span>
                  <span>AWS Partner</span>
                  <span>•</span>
                  <span>Snowflake Partner</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms
                </Link>
                <span>© {new Date().getFullYear()} ACI Infotech</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
