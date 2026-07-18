'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { v4Display } from '@/components/v4/fonts';

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
    <div className="mt-12 border-t border-gray-200 pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Questions</p>
      <h2 className={`mt-4 text-2xl font-bold tracking-tight text-black ${v4Display}`}>
        Frequently asked questions
      </h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className={index > 0 ? 'border-t border-gray-200' : ''}>
            <button
              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              aria-expanded={openFaqIndex === index}
              className="flex w-full items-center justify-between gap-4 bg-white p-5 text-left transition-colors hover:bg-gray-50"
            >
              <h3 className={`text-base font-semibold text-black ${v4Display}`}>{faq.question}</h3>
              <Plus
                size={18}
                aria-hidden="true"
                className={`shrink-0 text-blue-700 transition-transform duration-300 ${
                  openFaqIndex === index ? 'rotate-45' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openFaqIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <p className="p-5 pt-0 text-[15px] leading-relaxed text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
