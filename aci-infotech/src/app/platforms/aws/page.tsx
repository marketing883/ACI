import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Award, Cloud, Shield, TrendingUp, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'AWS Cloud Services',
  description: 'ACI Infotech is an AWS Advanced Consulting Partner. Cloud migration, data lakes, serverless architecture, and managed AWS services.',
};

const capabilities = [
  {
    title: 'Cloud Migration',
    description: 'Migrate workloads to AWS with minimal disruption using proven methodologies and tools.',
    features: ['Assessment & planning', 'Lift & shift', 'Re-platforming', 'Application modernization'],
  },
  {
    title: 'Data Lakes & Analytics',
    description: 'Build scalable data lakes on S3 with Glue, Athena, and Redshift for enterprise analytics.',
    features: ['S3 data lake', 'AWS Glue ETL', 'Redshift warehouse', 'QuickSight dashboards'],
  },
  {
    title: 'Serverless Architecture',
    description: 'Design event-driven, serverless applications that scale automatically and reduce costs.',
    features: ['Lambda functions', 'API Gateway', 'Step Functions', 'EventBridge'],
  },
  {
    title: 'Machine Learning on AWS',
    description: 'Deploy ML models at scale using SageMaker, Bedrock, and AWS AI services.',
    features: ['SageMaker pipelines', 'Bedrock GenAI', 'Rekognition', 'Comprehend'],
  },
  {
    title: 'DevOps & Infrastructure',
    description: 'Implement CI/CD pipelines and infrastructure as code for reliable deployments.',
    features: ['CloudFormation/CDK', 'CodePipeline', 'ECS/EKS', 'Terraform'],
  },
  {
    title: 'Managed Services',
    description: 'Ongoing AWS management, monitoring, and optimization with 24/7 support.',
    features: ['Cost optimization', 'Security monitoring', 'Performance tuning', 'Incident response'],
  },
];

const caseStudies = [
  {
    client: 'Healthcare System',
    industry: 'Healthcare',
    challenge: 'On-premise infrastructure limiting ability to scale telehealth services',
    solution: 'Full AWS migration with HIPAA-compliant architecture and auto-scaling',
    results: ['99.99% uptime', '40% cost reduction', 'HIPAA compliant'],
  },
  {
    client: 'E-commerce Platform',
    industry: 'Retail',
    challenge: 'Legacy infrastructure unable to handle peak shopping periods',
    solution: 'Serverless architecture on AWS with auto-scaling and CDN optimization',
    results: ['10x traffic capacity', '65% faster page loads', 'Zero downtime'],
  },
];

const certifications = [
  'AWS Solutions Architect Professional',
  'AWS DevOps Engineer Professional',
  'AWS Data Analytics Specialty',
  'AWS Machine Learning Specialty',
  'AWS Security Specialty',
  'AWS Database Specialty',
];

export default function AWSPage() {
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
            <div className="w-16 h-16 bg-[#FF9900] rounded-2xl flex items-center justify-center">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#FF9900]/20 text-[#FF9900] text-sm font-medium rounded-full flex items-center gap-1">
                <Award className="w-4 h-4" />
                Advanced Partner
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Amazon Web Services
            <span className="text-[var(--aci-primary-light)]"> Cloud Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            As an AWS Advanced Consulting Partner, we bring certified expertise to every cloud
            initiative. From migration to modernization, we help enterprises harness the full
            power of AWS.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/contact?reason=architecture-call" variant="primary" size="lg">
              Schedule AWS Assessment
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
              <div className="w-14 h-14 bg-[#FF9900]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-[#FF9900]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">50+ AWS Certifications</h3>
              <p className="text-gray-600 text-sm">
                Our team holds professional and specialty certifications across all AWS domains.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF9900]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#FF9900]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">100+ AWS Projects</h3>
              <p className="text-gray-600 text-sm">
                Proven track record delivering enterprise AWS solutions across industries.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF9900]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#FF9900]" />
              </div>
              <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">Well-Architected</h3>
              <p className="text-gray-600 text-sm">
                Every solution follows AWS Well-Architected Framework best practices.
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
              <span key={cert} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full shadow-sm">
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
              End-to-end AWS services from cloud strategy to managed operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-3">{cap.title}</h3>
                <p className="text-gray-600 mb-4">{cap.description}</p>
                <ul className="space-y-2">
                  {cap.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
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
              AWS Success Stories
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((cs, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#FF9900]/10 text-[#FF9900] text-sm font-medium rounded-full">
                    {cs.industry}
                  </span>
                  <span className="text-gray-500 text-sm">{cs.client}</span>
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
                      <span key={result} className="px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
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
      <section className="py-20 bg-[#FF9900]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Cloud Journey?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Schedule a free AWS assessment with our certified architects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Free Assessment
            </Button>
            <Button href="/platforms" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Explore Other Platforms
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
