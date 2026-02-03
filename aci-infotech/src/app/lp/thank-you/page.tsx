'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ArrowRight, BookOpen, FileText, Loader2 } from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get('name') || 'there';
  const serviceCluster = searchParams.get('service') || 'our services';
  const interest = searchParams.get('interest') || 'your request';

  // Map service clusters to relevant resources
  const getRelevantResources = (service: string) => {
    const resourceMap: Record<string, { blog: string; playbook?: string }> = {
      'data-engineering': {
        blog: '/blog',
        playbook: '/playbooks/data-modernization-playbook',
      },
      'data-analytics': {
        blog: '/blog',
        playbook: '/playbooks/analytics-maturity-playbook',
      },
      'cloud-modernization': {
        blog: '/blog',
        playbook: '/playbooks/cloud-migration-playbook',
      },
      'dynamics-365': {
        blog: '/blog',
      },
      'gen-ai': {
        blog: '/blog',
        playbook: '/playbooks/gen-ai-readiness-playbook',
      },
      'ai-ml': {
        blog: '/blog',
      },
      'agentic-ai': {
        blog: '/blog',
      },
      'data-integration': {
        blog: '/blog',
      },
      'data-observability': {
        blog: '/blog',
      },
      'erp-transformation': {
        blog: '/blog',
      },
    };

    return resourceMap[service] || { blog: '/blog' };
  };

  const resources = getRelevantResources(serviceCluster);

  // Format the service cluster name for display
  const formatServiceName = (service: string) => {
    return service
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0F2847] to-[#0A1628]">
      {/* Header */}
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Image
              src="/images/aci-logo-white.png"
              alt="ACI Infotech"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-8">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Thank You, {firstName}!
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We've received your request regarding <strong className="text-white">{formatServiceName(serviceCluster)}</strong>.
            A specialist will reach out within 24 business hours to discuss how we can help.
          </p>

          {/* What Happens Next */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 text-left">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">What Happens Next?</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0066FF] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-white font-medium">Review</h3>
                  <p className="text-gray-400 text-sm">
                    A specialist will review your requirements and prepare relevant insights.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0066FF] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-white font-medium">Connect</h3>
                  <p className="text-gray-400 text-sm">
                    We'll reach out to schedule a brief discovery call at your convenience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0066FF] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-white font-medium">Deliver</h3>
                  <p className="text-gray-400 text-sm">
                    You'll receive a customized assessment or roadmap based on your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <h2 className="text-xl font-semibold text-white mb-6">
            While You Wait, Explore Our Resources
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <Link
              href={resources.blog}
              className="flex items-center gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Read Our Blog</h3>
                <p className="text-gray-400 text-sm">Expert insights and best practices</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 ml-auto" />
            </Link>

            {resources.playbook ? (
              <Link
                href={resources.playbook}
                className="flex items-center gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Download Playbook</h3>
                  <p className="text-gray-400 text-sm">Free strategic guide</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 ml-auto" />
              </Link>
            ) : (
              <Link
                href="/case-studies"
                className="flex items-center gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">View Case Studies</h3>
                  <p className="text-gray-400 text-sm">See our client success stories</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 ml-auto" />
              </Link>
            )}
          </div>

          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Homepage
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ACI Infotech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
}

export default function LPThankYouPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ThankYouContent />
    </Suspense>
  );
}
