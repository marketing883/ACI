'use client';

import { Quote } from 'lucide-react';

interface ProofItem {
  headline: string;
  description: string;
  industry?: string;
}

interface LPProofProps {
  proofItems: ProofItem[];
}

export default function LPProof({ proofItems }: LPProofProps) {
  if (!proofItems || proofItems.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Proven Results</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real outcomes from organizations like yours.
          </p>
        </div>

        {/* Proof Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {proofItems.map((item, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Quote className="w-5 h-5 text-[#0066FF]" />
              </div>

              {/* Headline */}
              <h3 className="text-2xl md:text-3xl font-bold text-[#0066FF] mb-4">{item.headline}</h3>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>

              {/* Industry Tag */}
              {item.industry && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full capitalize">
                  {item.industry}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
