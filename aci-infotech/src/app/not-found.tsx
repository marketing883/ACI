import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <span className="text-[var(--aci-primary)] text-9xl font-bold">404</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button href="/" variant="primary" size="lg">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact Support
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--aci-secondary)] mb-4">
            Popular Pages
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <Link
              href="/services/data-engineering"
              className="p-4 rounded-lg border border-gray-200 hover:border-[var(--aci-primary)] hover:bg-blue-50 transition-colors group"
            >
              <h3 className="font-medium text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)]">
                Data Engineering
              </h3>
              <p className="text-sm text-gray-500">Build enterprise data platforms</p>
            </Link>
            <Link
              href="/services/applied-ai-ml"
              className="p-4 rounded-lg border border-gray-200 hover:border-[var(--aci-primary)] hover:bg-blue-50 transition-colors group"
            >
              <h3 className="font-medium text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)]">
                Applied AI & ML
              </h3>
              <p className="text-sm text-gray-500">AI that drives real business outcomes</p>
            </Link>
            <Link
              href="/case-studies"
              className="p-4 rounded-lg border border-gray-200 hover:border-[var(--aci-primary)] hover:bg-blue-50 transition-colors group"
            >
              <h3 className="font-medium text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)]">
                Case Studies
              </h3>
              <p className="text-sm text-gray-500">See our client success stories</p>
            </Link>
            <Link
              href="/blog"
              className="p-4 rounded-lg border border-gray-200 hover:border-[var(--aci-primary)] hover:bg-blue-50 transition-colors group"
            >
              <h3 className="font-medium text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)]">
                Blog
              </h3>
              <p className="text-sm text-gray-500">Enterprise technology insights</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
