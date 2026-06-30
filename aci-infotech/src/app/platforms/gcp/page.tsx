import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Award,
  Cloud,
  Shield,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Button from '@/components/ui/Button';

import { displayClient } from '@/lib/content/anonymize';

export const metadata: Metadata = {
  alternates: { canonical: 'https://aciinfotech.com/platforms/gcp' },
  title: 'Google Cloud Platform Services',
  description:
    'ACI Infotech builds on Google Cloud Platform. BigQuery, Vertex AI, GKE, Anthos, and data-driven AI workloads delivered end to end.',
};

const capabilities = [
  {
    title: 'Data Warehousing & Analytics',
    description:
      'BigQuery as the enterprise warehouse with streaming ingestion, federated queries, and governance baked in.',
    features: ['BigQuery architecture', 'Dataflow streaming', 'Dataproc for Spark', 'Looker & BI'],
  },
  {
    title: 'Vertex AI & GenAI',
    description:
      'Production ML and GenAI on Vertex AI, including Gemini-backed agents, RAG over BigQuery, and model governance.',
    features: ['Vertex AI pipelines', 'Gemini and PaLM', 'Agent Builder', 'Model Garden'],
  },
  {
    title: 'Kubernetes on GKE',
    description:
      'Container-native workloads on GKE with Autopilot, Anthos service mesh, and Workload Identity tied to IAM.',
    features: ['GKE Autopilot', 'Anthos service mesh', 'Binary Authorization', 'Workload Identity'],
  },
  {
    title: 'Cloud Migration',
    description:
      'Migrations onto Google Cloud from on-premise, AWS, or Azure, using Migrate to Containers and Database Migration Service.',
    features: ['Migrate to Containers', 'Database Migration Service', 'Transfer Appliance', 'Cutover runbooks'],
  },
  {
    title: 'Security & Compliance',
    description:
      'Security Command Center, VPC Service Controls, and compliance posture for HIPAA, PCI, and SOC 2 on Google Cloud.',
    features: ['Security Command Center', 'VPC Service Controls', 'Chronicle SIEM', 'Compliance posture'],
  },
  {
    title: 'FinOps & Cost Governance',
    description:
      'Ongoing cost optimization, committed use discounts, and chargeback tied to BigQuery billing export.',
    features: ['Committed use planning', 'BigQuery cost analytics', 'Recommender engine', 'Chargeback models'],
  },
];

const caseStudies = [
  {
    client: 'Global CPG & F&B Leader',
    industry: 'Manufacturing',
    challenge:
      'Brand managers waiting on IT tickets for analytics cut across fragmented data warehouses.',
    solution:
      'BigQuery-centred lakehouse with Looker self-service, plus Vertex AI forecasting for demand planning.',
    results: ['Self-service analytics', '75% fewer IT requests', 'Forecast accuracy lift'],
  },
  {
    client: 'Healthcare Network',
    industry: 'Healthcare',
    challenge:
      'Legacy workloads on a three-year-old VMware cluster, with no path to AI or elastic scale.',
    solution:
      'GKE landing zone with Anthos service mesh and BigQuery for clinical analytics, HIPAA posture from day one.',
    results: ['GKE landing zone live', '100% audit pass rate', 'AI workloads unlocked'],
  },
];

const certifications = [
  'Professional Cloud Architect',
  'Professional Data Engineer',
  'Professional Machine Learning Engineer',
  'Professional Cloud DevOps Engineer',
  'Professional Cloud Security Engineer',
  'Professional Cloud Database Engineer',
];

export default function GCPPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Platforms
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#4285F4] rounded-2xl flex items-center justify-center">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#4285F4]/20 text-[#4285F4] text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Google Cloud Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Google Cloud Platform
            <span className="text-[var(--aci-primary-light)]"> Cloud Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            Google Cloud builds for enterprises where data breadth and container-native
            operations are the cloud workload. We stand up BigQuery lakehouses, Vertex AI
            pipelines, and GKE estates, and run them to an SLA.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule Google Cloud Assessment
            </Button>
            <Button href="/case-studies" variant="secondary" size="lg">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#4285F4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-[#4285F4]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">
                Professional Certifications
              </h3>
              <p className="text-gray-600 text-sm">
                Our team holds Google Cloud Professional credentials across data, ML,
                security, and infrastructure tracks.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#4285F4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#4285F4]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">
                BigQuery & Vertex Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Lakehouse, streaming, and AI workloads delivered end to end on the Google
                Cloud data stack.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#4285F4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#4285F4]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">
                Secure by Default
              </h3>
              <p className="text-gray-600 text-sm">
                VPC Service Controls, Security Command Center, and IAM baked into every
                landing zone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center font-semibold text-gray-500 mb-6">Team Certifications</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full shadow-sm"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              What We Deliver
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end Google Cloud services from landing zone to managed operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-3">
                  {cap.title}
                </h3>
                <p className="text-gray-600 mb-4">{cap.description}</p>
                <ul className="space-y-2">
                  {cap.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-4">
              Google Cloud Success Stories
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#4285F4]/10 text-[#4285F4] text-sm font-medium rounded-full">
                    {cs.industry}
                  </span>
                  <span className="text-gray-500 text-sm">{displayClient(cs)}</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Challenge</h3>
                  <p className="text-gray-600">{cs.challenge}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Solution</h3>
                  <p className="text-gray-600">{cs.solution}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Results</h3>
                  <div className="flex flex-wrap gap-3">
                    {cs.results.map((result) => (
                      <span
                        key={result}
                        className="px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg"
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4285F4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build on Google Cloud?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule an assessment with our Google Cloud certified architects.
          </p>
          <Button href="/contact?platform=gcp" variant="lime" size="lg">
            Talk to a Google Cloud Expert
          </Button>
        </div>
      </section>
    </main>
  );
}
