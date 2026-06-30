'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// FAQ accordion. Client only for the open/close toggle, but the
// questions and answers are in the server-rendered HTML (and mirrored in
// FAQPage schema on the page), so crawlers and AI systems read them even
// with the accordion collapsed.
export default function BlogFaqs({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-[var(--aci-secondary)] pr-4">{faq.question}</h3>
              <ChevronDown
                className={`w-5 h-5 text-[var(--aci-primary)] flex-shrink-0 transition-transform duration-200 ${
                  openFaqIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openFaqIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-5 pt-0 bg-white">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
