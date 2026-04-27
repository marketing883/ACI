'use client';

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface LPSolutionProps {
  headline: string;
  description: string;
  processSteps: ProcessStep[];
}

export default function LPSolution({ headline, description, processSteps }: LPSolutionProps) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{headline}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <div key={index} className="relative text-center">
                {/* Step Number */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0044AA] rounded-full text-white text-xl font-bold mb-6 shadow-lg shadow-blue-500/30">
                  {item.step}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>

                {/* Arrow (not on last item, desktop only) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 text-blue-300">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
