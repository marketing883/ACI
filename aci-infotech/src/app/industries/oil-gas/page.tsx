import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Activity, Gauge, Shield, Database, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import FaqBlock from '@/components/seo/FaqBlock';
import { oilGasFaqs } from '@/content/industry-faqs';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { oilGasRelated } from '@/content/related-links';

export const metadata: Metadata = {
  title: 'Oil & Gas Technology Solutions',
  description:
    'Data, AI, and cloud for upstream, midstream, and downstream operators. SCADA and historian integration, predictive maintenance, production analytics, and HSE and emissions reporting.',
  alternates: { canonical: 'https://aciinfotech.com/industries/oil-gas' },
};

const valueChain = [
  {
    stage: 'Upstream',
    icon: Gauge,
    body: 'Production and drilling analytics on top of SCADA, historian, and well data. One governed view of output and equipment instead of a folder of exported spreadsheets.',
    points: ['Production surveillance', 'Drilling and completion analytics', 'Well and reservoir data'],
  },
  {
    stage: 'Midstream',
    icon: Activity,
    body: 'Pipeline and asset monitoring that brings sensor, SCADA, and maintenance data together so integrity and throughput are visible in real time, not after an incident.',
    points: ['Pipeline integrity monitoring', 'Asset performance', 'Throughput and balancing'],
  },
  {
    stage: 'Downstream',
    icon: TrendingUp,
    body: 'Refinery, trading, and supply-chain data unified for margin, yield, and scheduling decisions, with the lineage to trace any figure back to where it came from.',
    points: ['Refinery and yield analytics', 'Trading and supply data', 'Demand and scheduling'],
  },
];

const useCases = [
  {
    icon: Database,
    title: 'SCADA & historian integration',
    body: 'Pull SCADA, historians like PI, and ERP into one governed cloud platform so engineers and analysts stop exporting CSVs and start working from a single source.',
  },
  {
    icon: Gauge,
    title: 'Predictive maintenance',
    body: 'Models that read sensor, historian, and maintenance history flag equipment issues before they become failures or safety incidents.',
  },
  {
    icon: Activity,
    title: 'Production analytics',
    body: 'Surveillance and optimization across wells and facilities, so production teams see what is happening now instead of last week.',
  },
  {
    icon: Shield,
    title: 'HSE & emissions reporting',
    body: 'A trustworthy data foundation for health, safety, emissions, and regulatory reporting, with lineage to back every figure when an auditor asks.',
  },
  {
    icon: TrendingUp,
    title: 'Energy transition & ESG',
    body: 'The same governed platform that runs production analytics carries emissions, ESG, and energy-transition reporting, so sustainability data holds up like financial data.',
  },
  {
    icon: Database,
    title: 'Cloud modernization',
    body: 'Move aging on-prem analytics to a governed cloud platform with FinOps and security built in, phased so operations never wait on a big bang.',
  },
];

export default function OilGasPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Industries
          </Link>
          <div className="max-w-3xl">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Energy
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Oil & Gas Technology Solutions
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Data, AI, and cloud for operators who run on decades of data trapped in systems that
              were never meant to talk. We unify it, govern it, and make it usable, from the
              wellhead to the refinery to the regulator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact?industry=oil-gas" variant="lime" size="lg">
                Talk to an Energy Architect
              </Button>
              <Button href="/case-studies" variant="secondary" size="lg">
                See the Proof
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value chain */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Across the value chain
            </h2>
            <p className="text-lg text-gray-600">
              Upstream, midstream, and downstream run on different systems and different clocks. We
              build the data foundation that ties them together without pretending they are the same.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {valueChain.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.stage} className="bg-white rounded-xl p-7 border border-gray-200">
                  <div className="w-12 h-12 rounded-lg bg-[var(--aci-primary)]/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[var(--aci-primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-3">{v.stage}</h3>
                  <p className="text-gray-600 mb-4">{v.body}</p>
                  <ul className="space-y-2">
                    {v.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-[var(--aci-primary)] mt-0.5 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              What we build for operators
            </h2>
            <p className="text-lg text-gray-600">
              Concrete systems that move a number you care about: uptime, throughput, margin, or the
              figure on a regulatory filing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((u) => {
              const Icon = u.icon;
              return (
                <div key={u.title} className="rounded-xl p-7 border border-gray-200 hover:border-[var(--aci-primary)]/40 transition-colors">
                  <div className="w-11 h-11 rounded-lg bg-[var(--aci-secondary)]/5 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[var(--aci-secondary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--aci-secondary)] mb-2">{u.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{u.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <RelatedLinks items={oilGasRelated} />

      <FaqBlock items={oilGasFaqs} eyebrow="Oil & gas FAQ" />

      {/* CTA */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Put your operational data to work.
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Talk to an architect who has wired SCADA, historians, and ERP into one governed platform
            before. No pitch, just an engineering conversation.
          </p>
          <Button href="/contact?industry=oil-gas" variant="lime" size="lg">
            Talk to an Energy Architect
          </Button>
        </div>
      </section>
    </main>
  );
}
