import { createClient } from '@supabase/supabase-js';

// /llms.txt - a curated, plain-text map of the site for AI systems
// (llmstxt.org). Mirrors the approach in sitemap.ts: the core
// service / platform / industry / company lists are authored here so
// they stay canonical, and the resource sections are filled in live
// from Supabase so they never drift stale. If the database is not
// reachable, the listing-page links still ship and the dynamic
// sub-lists are simply omitted.

const baseUrl = 'https://aciinfotech.com';

// Revalidate hourly. The static spine rarely changes; the dynamic
// resource lists pick up new published content within the hour.
export const revalidate = 3600;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

type Link = { name: string; path: string; note?: string };

const services: Link[] = [
  { name: 'Services overview', path: '/services', note: 'Every engineering and advisory offering in one place.' },
  { name: 'Data Engineering', path: '/services/data-engineering', note: 'Modern data platforms on Databricks, Snowflake, and cloud-native architectures.' },
  { name: 'Applied AI & ML', path: '/services/applied-ai-ml', note: 'Predictive and generative AI systems that ship to production.' },
  { name: 'Cloud Modernization', path: '/services/cloud-modernization', note: 'Cloud migrations and modernization across AWS, Azure, and GCP.' },
  { name: 'MarTech & CDP', path: '/services/martech-cdp', note: 'Unified customer data platforms that power personalization.' },
  { name: 'Digital Transformation', path: '/services/digital-transformation', note: 'End-to-end process, systems, and ERP modernization.' },
  { name: 'App Development', path: '/services/app-development', note: 'Enterprise applications built with production rigor.' },
  { name: 'Quality Engineering', path: '/services/quality-engineering', note: 'Quality as an engineering discipline: in-sprint automation and CI/CD quality gates.' },
  { name: 'Cyber Security', path: '/services/cyber-security', note: 'Security architecture, DevSecOps, and compliance frameworks.' },
  { name: 'Advisory & Strategy', path: '/services/advisory-strategy', note: 'Technology strategy grounded in delivery.' },
  { name: 'Managed Operations', path: '/services/managed-operations', note: 'NOC and SOC managed operations.' },
  { name: 'GCC & Captive Operations', path: '/services/gcc', note: 'Offshore captive teams under your operating model.' },
];

const platforms: Link[] = [
  { name: 'Platforms overview', path: '/platforms', note: 'Certified partner implementations by senior architects.' },
  { name: 'Databricks', path: '/platforms/databricks', note: 'Lakehouse architecture with Delta Lake, MLflow, and Spark.' },
  { name: 'Snowflake', path: '/platforms/snowflake', note: 'Snowflake data warehouses with governance and cost efficiency.' },
  { name: 'Salesforce', path: '/platforms/salesforce', note: 'Data Cloud, Marketing Cloud, and Agentforce.' },
  { name: 'Microsoft Dynamics', path: '/platforms/microsoft-dynamics', note: 'Dynamics 365, Copilot, Power Platform, and Fabric.' },
  { name: 'Amazon Web Services', path: '/platforms/aws', note: 'AWS migrations, architecture, and cost optimization.' },
  { name: 'Microsoft Azure', path: '/platforms/azure', note: 'Azure, Synapse, Fabric, and hybrid cloud.' },
  { name: 'Google Cloud', path: '/platforms/gcp', note: 'BigQuery, Vertex AI, and GKE.' },
  { name: 'SAP', path: '/platforms/sap', note: 'SAP S/4HANA implementations and migrations.' },
  { name: 'ServiceNow', path: '/platforms/servicenow', note: 'IT service management, HR, and workflow automation.' },
  { name: 'Braze', path: '/platforms/braze', note: 'Personalized customer engagement across channels.' },
];

const industries: Link[] = [
  { name: 'Industries overview', path: '/industries', note: 'Enterprise solutions across regulated and data-heavy sectors.' },
  { name: 'Financial Services', path: '/industries/financial-services', note: 'Real-time fraud detection, governance, and infrastructure consolidation.' },
  { name: 'Retail & Consumer', path: '/industries/retail', note: 'Unified customer profiles, recommendations, and demand forecasting.' },
  { name: 'Healthcare & Life Sciences', path: '/industries/healthcare', note: 'HIPAA-compliant platforms for patient data and research.' },
  { name: 'Hospitality & Food Services', path: '/industries/hospitality', note: 'Unified global operations and workforce analytics.' },
  { name: 'Manufacturing', path: '/industries/manufacturing', note: 'IoT analytics and predictive maintenance for Industry 4.0.' },
  { name: 'Energy & Utilities', path: '/industries/energy', note: 'NERC CIP compliance and grid analytics.' },
  { name: 'Transportation & Logistics', path: '/industries/transportation', note: 'Route optimization, real-time tracking, and fleet maintenance.' },
];

const resourceHubs: Link[] = [
  { name: 'Blog', path: '/blogs', note: 'Technical articles and field notes.' },
  { name: 'Case Studies', path: '/case-studies', note: 'Client outcomes with measured results.' },
  { name: 'Whitepapers', path: '/whitepapers', note: 'In-depth guides. Free, email required to download.' },
  { name: 'Playbooks', path: '/playbooks', note: 'Step-by-step implementation guides.' },
  { name: 'News & Press', path: '/news', note: 'Company news and press coverage.' },
];

// Playbooks are authored content (no DB table), so the catalog is
// listed here. Keep in sync with PlaybookVaultSection.tsx.
const playbooks: Link[] = [
  { name: 'Post-Acquisition System Consolidation', path: '/playbooks/post-acquisition-consolidation' },
  { name: 'Multi-Location Real-Time Data Platform', path: '/playbooks/real-time-data-platform' },
  { name: 'Global Data Unification', path: '/playbooks/global-data-unification' },
  { name: 'Enterprise Self-Service Analytics', path: '/playbooks/self-service-analytics' },
  { name: 'Enterprise Agentic AI Deployment', path: '/playbooks/agentic-ai-deployment' },
  { name: 'Enterprise AI Governance & Compliance', path: '/playbooks/enterprise-ai-governance' },
  { name: 'Multi-Jurisdiction Healthcare Data', path: '/playbooks/healthcare-data-platform' },
  { name: 'Supply Chain Visibility', path: '/playbooks/supply-chain-visibility' },
  { name: 'Legacy to Cloud Migration', path: '/playbooks/legacy-cloud-migration' },
  { name: 'Multi-Source Data Integration', path: '/playbooks/multi-source-integration' },
];

// Commercial engagement pages: the indexable subset of /lp (one page
// per bottom-funnel intent; the noindexed variants are not listed).
// Keep in sync with PROMOTED_LP_SLUGS in src/lib/lp-promoted.ts.
const engagements: Link[] = [
  { name: 'Data Engineering Services', path: '/lp/data-engineering-services', note: 'Scoped builds: pipelines, lakehouse, governance.' },
  { name: 'Snowflake Consulting', path: '/lp/snowflake-consulting', note: 'Certified Snowflake implementations and cost tuning.' },
  { name: 'Databricks Consulting', path: '/lp/databricks-services', note: 'Lakehouse implementations with certified engineers.' },
  { name: 'Power BI Consulting', path: '/lp/power-bi-consulting', note: 'Dashboards on a governed semantic model.' },
  { name: 'Cloud Migration Services', path: '/lp/cloud-migration-services', note: 'Migrations with parallel-run cutovers.' },
  { name: 'Dynamics 365 Implementation', path: '/lp/dynamics-365-implementation', note: 'CRM and ERP implementations with a 90-day plan.' },
  { name: 'Generative AI Consulting', path: '/lp/generative-ai-consulting', note: 'GenAI systems that reach production.' },
  { name: 'AI & ML Implementation', path: '/lp/ai-ml-implementation', note: 'Scoped model builds with MLOps included.' },
  { name: 'Agentic AI Development', path: '/lp/agentic-ai-development', note: 'Agent systems with governance built in.' },
  { name: 'Data Integration Services', path: '/lp/data-integration-services', note: 'Source systems unified into one platform.' },
  { name: 'SAP S/4HANA Migration', path: '/lp/sap-s4hana-migration', note: 'ECC to S/4HANA moves, scoped and staged.' },
  { name: 'Salesforce Implementation', path: '/lp/salesforce-implementation', note: 'CRM builds and integrations.' },
  { name: 'ServiceNow Implementation', path: '/lp/servicenow-implementation', note: 'ITSM and workflow implementations.' },
  { name: 'Braze Implementation', path: '/lp/braze-implementation', note: 'Customer engagement and ESP migrations.' },
  { name: 'Data Governance Consulting', path: '/lp/data-governance-consulting', note: 'Lineage, quality, and access controls.' },
];

const company: Link[] = [
  { name: 'About', path: '/about', note: 'Who we are and how we work.' },
  { name: 'Careers', path: '/careers', note: 'Open engineering, AI, cloud, and security roles.' },
  { name: 'Contact', path: '/contact', note: 'Start a conversation about a project.' },
];

const optional: Link[] = [
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms of Service', path: '/terms-of-service' },
];

function renderSection(title: string, links: Link[]): string {
  if (links.length === 0) return '';
  const lines = links.map(({ name, path, note }) => {
    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
    return note ? `- [${name}](${url}): ${note}` : `- [${name}](${url})`;
  });
  return `## ${title}\n\n${lines.join('\n')}\n`;
}

export async function GET(): Promise<Response> {
  const supabase = getSupabase();

  let blogLinks: Link[] = [];
  let caseStudyLinks: Link[] = [];
  let whitepaperLinks: Link[] = [];

  if (supabase) {
    const [blogs, caseStudies, whitepapers] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('title, slug')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(20),
      supabase
        .from('case_studies')
        .select('title, slug')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('whitepapers')
        .select('title, slug')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    blogLinks = (blogs.data ?? []).map((b) => ({ name: b.title, path: `/blogs/${b.slug}` }));
    caseStudyLinks = (caseStudies.data ?? []).map((c) => ({ name: c.title, path: `/case-studies/${c.slug}` }));
    whitepaperLinks = (whitepapers.data ?? []).map((w) => ({ name: w.title, path: `/whitepapers/${w.slug}` }));
  }

  const intro = [
    '# ACI Infotech',
    '',
    '> Enterprise technology consulting. We build data platforms, AI systems, and cloud architectures that run in production for large enterprises.',
    '',
    'ACI Infotech is an enterprise engineering firm based in Monmouth Junction, New Jersey, with delivery teams worldwide. Founded in 2006, with 1,200+ engineers across 11 global delivery hubs. We build the enterprise data foundation, put AI on top of it, and run both in production: data engineering and lakehouse platforms, applied AI and GenAI, cloud modernization, MarTech and CDP (through our specialized division ACI Interactive), security, and 24/7 managed operations. 500+ enterprise projects, documented as reusable playbooks. Forward-deployed AI engineering is delivered with our strategic partner ArqAI through ArqAI Labs (https://thearq.ai). To start a conversation, visit https://aciinfotech.com/contact.',
    '',
  ].join('\n');

  const sections = [
    renderSection('Services', services),
    renderSection('Platforms', platforms),
    renderSection('Industries', industries),
    renderSection('Resources', resourceHubs),
    renderSection('Latest Blog Posts', blogLinks),
    renderSection('Case Studies', caseStudyLinks),
    renderSection('Whitepapers', whitepaperLinks),
    renderSection('Playbooks', playbooks),
    renderSection('Engagement Pages', engagements),
    renderSection('Company', company),
    renderSection('Optional', optional),
  ].filter(Boolean);

  const body = `${intro}\n${sections.join('\n')}`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
