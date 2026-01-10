import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag, Share2, Linkedin, Twitter } from 'lucide-react';
import Button from '@/components/ui/Button';

// Blog data - in production, fetch from Supabase
const blogPostsData: Record<string, BlogPostDetail> = {
  'building-enterprise-data-mesh-architecture': {
    slug: 'building-enterprise-data-mesh-architecture',
    title: 'Building an Enterprise Data Mesh Architecture: A Practical Guide',
    excerpt: 'Learn how to implement a data mesh architecture that scales with your organization while maintaining data quality and governance.',
    author: {
      name: 'Jag Tangirala',
      title: 'CEO & Founder',
      bio: 'Jag has over 20 years of experience in enterprise data architecture and has led digital transformations for Fortune 500 companies.',
      image: '/images/team/jag-tangirala.jpg',
      linkedin: 'https://linkedin.com/in/jagtangirala',
    },
    category: 'Data Engineering',
    tags: ['Data Mesh', 'Architecture', 'Data Governance', 'Enterprise', 'Decentralization'],
    featured_image: '/images/blog/data-mesh.jpg',
    read_time: '12 min read',
    date: '2025-01-03',
    content: `
## The Promise and Reality of Data Mesh

Data mesh has emerged as one of the most talked-about paradigms in enterprise data architecture. But beyond the buzzwords, what does it actually mean to implement a data mesh, and is it right for your organization?

After implementing data mesh architectures for over a dozen Fortune 500 companies, we've learned what works, what doesn't, and how to navigate the common pitfalls.

## What is Data Mesh?

At its core, data mesh is an organizational and architectural paradigm that treats data as a product. It shifts ownership from centralized data teams to domain teams who understand the data best.

The four pillars of data mesh are:

1. **Domain Ownership**: Business domains own their data as products
2. **Data as a Product**: Data is treated with the same rigor as customer-facing products
3. **Self-Serve Data Platform**: Infrastructure enables autonomous domain teams
4. **Federated Computational Governance**: Governance is embedded, not centralized

## When Data Mesh Makes Sense

Data mesh isn't a universal solution. It works best when:

- Your organization has multiple distinct business domains
- You have skilled engineers across domains who can own data pipelines
- Centralized data teams have become bottlenecks
- Data quality issues stem from lack of domain knowledge
- You need to scale data capabilities across the organization

## Implementation Approach

### Phase 1: Foundation (Months 1-3)

Start with your self-serve data platform. This includes:

- Standardized data infrastructure templates
- Automated data pipeline deployment
- Centralized data catalog with federated input
- Observability and monitoring tools

### Phase 2: Pilot Domains (Months 4-6)

Choose 2-3 domains to pilot:

- Select domains with engaged leadership
- Start with well-understood data products
- Establish data product templates and standards
- Build feedback loops for continuous improvement

### Phase 3: Governance Framework (Months 7-9)

Implement federated governance:

- Define global policies (security, privacy, compliance)
- Create domain-level governance automation
- Establish data quality SLAs
- Build cross-domain interoperability standards

### Phase 4: Scale (Months 10+)

Expand to remaining domains:

- Use learnings from pilots to refine approach
- Build internal community of practice
- Continuously evolve the platform based on domain needs

## Common Pitfalls to Avoid

**1. Underestimating Cultural Change**

Data mesh requires a fundamental shift in how organizations think about data ownership. Technical implementation is often easier than organizational change.

**2. Building Too Much Platform Too Soon**

Start with minimum viable platform and evolve based on actual domain needs. Over-engineering upfront leads to unused capabilities.

**3. Ignoring Governance**

Federated doesn't mean absent. Without clear governance guardrails, data mesh becomes data chaos.

**4. Treating All Data as Products**

Not all data needs to be a product. Focus on data that provides cross-domain value.

## Measuring Success

Track these metrics to measure data mesh effectiveness:

- Time to create new data products
- Data product adoption rates
- Data quality scores by domain
- Cross-domain data sharing velocity
- Developer satisfaction scores

## Conclusion

Data mesh is a powerful paradigm for organizations that have outgrown centralized data architectures. But success requires more than technology—it requires organizational alignment, strong governance, and a commitment to treating data as a true product.

The investment pays off in faster time-to-insight, better data quality, and more scalable data capabilities across your enterprise.

---

*Ready to explore if data mesh is right for your organization? [Schedule an architecture call](/contact?reason=architecture-call) with our data engineering team.*
    `,
    relatedPosts: ['databricks-vs-snowflake-2025', 'data-quality-automation', 'real-time-analytics-architecture'],
  },
  'ai-governance-enterprise-guide': {
    slug: 'ai-governance-enterprise-guide',
    title: 'AI Governance for the Enterprise: From Policy to Practice',
    excerpt: 'A comprehensive framework for implementing AI governance that satisfies regulators while enabling innovation.',
    author: {
      name: 'Sarah Chen',
      title: 'Head of AI Solutions',
      bio: 'Sarah leads ACI\'s AI practice, specializing in enterprise AI strategy and responsible AI implementation.',
      image: '/images/team/sarah-chen.jpg',
      linkedin: 'https://linkedin.com/in/sarahchen',
    },
    category: 'Applied AI & ML',
    tags: ['AI Governance', 'Enterprise AI', 'Compliance', 'ArqAI', 'Responsible AI'],
    featured_image: '/images/blog/ai-governance.jpg',
    read_time: '10 min read',
    date: '2024-12-18',
    content: `
## The AI Governance Imperative

As AI moves from experimentation to production, enterprises face a critical challenge: how do you scale AI responsibly while maintaining the agility to innovate?

The stakes are high. Regulatory frameworks like the EU AI Act are coming into force. Stakeholders demand transparency. And a single AI failure can cause reputational damage that takes years to repair.

## Why Traditional Governance Falls Short

Most enterprises try to govern AI with existing data governance frameworks. This approach fails for several reasons:

- **AI systems are dynamic**: Unlike static reports, AI models drift and evolve
- **Risk profiles differ**: AI introduces new risk categories like algorithmic bias
- **Accountability is complex**: Who's responsible when an AI makes a bad decision?
- **Speed matters**: Governance can't be a bottleneck to AI adoption

## A Practical AI Governance Framework

Based on our work with Fortune 500 companies deploying enterprise AI, we've developed a framework that balances control with agility.

### 1. Risk-Based Model Classification

Not all AI models need the same level of oversight. Classify models by risk:

**Tier 1 - Critical**: Customer-facing decisions, financial impact, regulatory exposure
- Full model validation before deployment
- Continuous monitoring with human oversight
- Regular bias and fairness audits

**Tier 2 - Significant**: Internal process automation, operational optimization
- Automated validation with sample review
- Periodic monitoring and audits
- Documented decision rationale

**Tier 3 - Low Risk**: Internal tools, non-critical recommendations
- Self-certification by model owners
- Exception-based monitoring
- Lightweight documentation

### 2. Model Lifecycle Governance

Implement governance at each stage:

**Development**
- Approved training data sources
- Bias testing requirements
- Documentation standards

**Validation**
- Independent model review for Tier 1
- Performance benchmarking
- Fairness and explainability testing

**Deployment**
- Approval workflows based on tier
- Rollback capabilities
- Monitoring setup verification

**Operation**
- Continuous performance monitoring
- Drift detection alerts
- Incident response procedures

**Retirement**
- Model deprecation process
- Data retention compliance
- Knowledge transfer

### 3. Automated Policy Enforcement

Manual governance doesn't scale. Implement policy-as-code:

- Automated bias checks in CI/CD pipelines
- Model cards generated automatically
- Drift alerts that trigger review workflows
- Audit trails for all model decisions

### 4. Clear Accountability Structure

Define roles and responsibilities:

- **Model Owners**: Domain teams responsible for model performance
- **AI Risk Committee**: Approves Tier 1 models, sets policy
- **MLOps Team**: Maintains governance tooling, monitors compliance
- **Ethics Review Board**: Consults on edge cases, updates ethical guidelines

## Implementation Roadmap

**Months 1-2: Assessment**
- Inventory existing AI/ML models
- Classify by risk tier
- Identify governance gaps

**Months 3-4: Framework Design**
- Define policies by tier
- Design approval workflows
- Select governance tooling

**Months 5-6: Pilot**
- Implement for new models first
- Refine based on feedback
- Build automation incrementally

**Months 7+: Scale**
- Bring existing models into compliance
- Expand automation
- Regular framework review

## Introducing ArqAI

This is exactly why we built ArqAI—our enterprise AI governance platform. ArqAI provides:

- Automated model inventory and classification
- Policy-as-code governance enforcement
- Continuous bias and drift monitoring
- Regulatory compliance reporting
- Complete audit trails

[Learn more about ArqAI →](/services/applied-ai-ml#arqai)

## Conclusion

AI governance isn't about slowing down innovation—it's about enabling sustainable AI adoption. With the right framework, you can move faster because you have confidence that your AI systems are compliant, fair, and reliable.

The enterprises winning at AI are those treating governance as a competitive advantage, not a compliance burden.

---

*Ready to implement AI governance at your organization? [Contact our AI team](/contact?reason=architecture-call) to discuss your needs.*
    `,
    relatedPosts: ['mlops-best-practices-production', 'llm-enterprise-integration'],
  },
  'databricks-vs-snowflake-2025': {
    slug: 'databricks-vs-snowflake-2025',
    title: 'Databricks vs Snowflake in 2025: Choosing the Right Platform',
    excerpt: 'An objective comparison of the two leading data platforms, including real-world performance benchmarks and cost analysis.',
    author: {
      name: 'Michael Torres',
      title: 'Principal Data Architect',
      bio: 'Michael has architected data platforms for some of the world\'s largest enterprises and holds certifications in both Databricks and Snowflake.',
      image: '/images/team/michael-torres.jpg',
      linkedin: 'https://linkedin.com/in/michaeltorres',
    },
    category: 'Data Engineering',
    tags: ['Databricks', 'Snowflake', 'Data Platform', 'Comparison', 'Lakehouse'],
    featured_image: '/images/blog/databricks-snowflake.jpg',
    read_time: '15 min read',
    date: '2024-12-10',
    content: `
## The Platform Decision

If you're building a modern data platform, you've likely narrowed your choices to Databricks and Snowflake. Both are excellent platforms, but they have different strengths and philosophies.

Having implemented both platforms across dozens of enterprise deployments, here's our honest assessment to help you make the right choice.

## Philosophy: Lakehouse vs Data Cloud

**Databricks** pioneered the lakehouse architecture—combining the best of data lakes and data warehouses on open formats like Delta Lake. Their philosophy: one platform for all data workloads.

**Snowflake** started as a cloud data warehouse and has expanded into what they call the Data Cloud—a platform focused on data sharing and collaboration with best-in-class SQL performance.

## When to Choose Databricks

Databricks is the better choice when:

### You Have Significant ML/AI Workloads

Databricks excels at machine learning workflows. The integration with MLflow, the collaborative notebook experience, and native support for distributed computing make it ideal for data science teams.

### You Want Open Formats

Delta Lake, the underlying format for Databricks, is open source. Your data remains portable, and you avoid format lock-in. This matters for enterprises with strict data sovereignty requirements.

### You Need Streaming + Batch

Databricks' Spark Structured Streaming provides true unified batch and streaming. If you have real-time analytics requirements alongside batch processing, Databricks handles both seamlessly.

### Cost Sensitivity at Scale

At large scale (petabytes of data, heavy compute), Databricks often has better economics. The ability to auto-scale clusters and use spot instances provides cost optimization options.

## When to Choose Snowflake

Snowflake is the better choice when:

### SQL-First Workloads

If your primary use case is SQL analytics with occasional Python/Scala, Snowflake's SQL performance is unmatched. The query optimizer is exceptional, and the managed experience means less tuning.

### Data Sharing Requirements

Snowflake's data sharing and marketplace capabilities are industry-leading. If you need to share data with partners, customers, or across business units, Snowflake makes this trivially easy.

### Simplicity is Priority

Snowflake is easier to get started with and requires less operational expertise. There are no clusters to manage, no storage to configure—it just works.

### Mixed Technical Team

If your team has varying technical skills, Snowflake's SQL-centric approach is more accessible. Databricks requires more engineering sophistication for advanced use cases.

## Performance Comparison

Based on our benchmarks across multiple client deployments:

| Workload Type | Databricks | Snowflake |
|--------------|------------|-----------|
| Complex SQL Queries | Good | Excellent |
| ML Training | Excellent | Good (with Snowpark) |
| Real-time Streaming | Excellent | Good |
| Ad-hoc Analysis | Good | Excellent |
| Large-scale ETL | Excellent | Good |

## Cost Comparison

Cost depends heavily on workload patterns:

- **Predictable SQL workloads**: Snowflake often cheaper due to efficient query execution
- **Heavy compute workloads**: Databricks often cheaper with spot instances and cluster optimization
- **Storage costs**: Similar, but Databricks allows external storage options

For most enterprises, total cost of ownership is comparable. The deciding factor is usually alignment with use cases, not cost.

## The Hybrid Approach

Many of our clients use both platforms:

- **Databricks** for data engineering, ML pipelines, and streaming
- **Snowflake** for business analytics, data sharing, and SQL-first workloads

This isn't complexity for complexity's sake—it's using each tool where it excels.

## Our Recommendation

There's no universal answer, but here's our decision framework:

**Choose Databricks if**: ML/AI is core to your strategy, you need streaming, you want open formats, or you have sophisticated engineering talent.

**Choose Snowflake if**: SQL analytics is primary, you need data sharing, simplicity is valued, or you have a SQL-skilled team.

**Consider both if**: You have diverse workloads, large scale, and the operational capacity to manage multiple platforms.

---

*Need help choosing and implementing the right data platform? [Talk to our data architects](/contact?reason=architecture-call) about your specific requirements.*
    `,
    relatedPosts: ['building-enterprise-data-mesh-architecture', 'real-time-analytics-architecture'],
  },
};

// Basic posts without full content
const basicPosts = [
  'zero-trust-security-implementation',
  'mlops-best-practices-production',
  'customer-data-platform-selection',
  'cloud-cost-optimization-strategies',
  'real-time-analytics-architecture',
  'llm-enterprise-integration',
  'data-quality-automation',
];

interface BlogPostDetail {
  slug: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    title: string;
    bio: string;
    image?: string;
    linkedin?: string;
  };
  category: string;
  tags: string[];
  featured_image?: string;
  read_time: string;
  date: string;
  content: string;
  relatedPosts?: string[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(blogPostsData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsData[slug];

  if (!post) {
    return {
      title: 'Article Not Found | ACI Infotech Blog',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';
  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  const imageUrl = post.featured_image?.startsWith('http')
    ? post.featured_image
    : `${siteUrl}${post.featured_image || '/images/og-default.jpg'}`;

  return {
    title: `${post.title} | ACI Infotech Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      siteName: 'ACI Infotech',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// JSON-LD structured data for SEO/AEO/GEO
function generateArticleStructuredData(post: BlogPostDetail, slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image?.startsWith('http')
      ? post.featured_image
      : `${siteUrl}${post.featured_image || '/images/og-default.jpg'}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.title,
      description: post.author.bio,
      url: post.author.linkedin,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ACI Infotech',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    timeRequired: post.read_time,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPostsData[slug];

  if (!post) {
    if (basicPosts.includes(slug)) {
      return (
        <main className="min-h-screen">
          <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-[var(--aci-primary-light)] font-medium mb-4">Blog</p>
              <h1 className="text-4xl font-bold text-white mb-6">Article Coming Soon</h1>
              <p className="text-xl text-gray-400 mb-8">
                We're putting the finishing touches on this article. In the meantime, explore our other insights.
              </p>
              <Button href="/blog" variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
              </Button>
            </div>
          </section>
        </main>
      );
    }
    notFound();
  }

  const relatedPosts = post.relatedPosts
    ?.map(slug => blogPostsData[slug])
    .filter(Boolean) || [];

  const articleStructuredData = generateArticleStructuredData(post, slug);

  return (
    <>
      {/* JSON-LD Structured Data for SEO/AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-sm font-medium rounded">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              {post.read_time}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
            <div className="w-14 h-14 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-white">{post.author.name}</div>
              <div className="text-gray-400 text-sm">{post.author.title}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Prose content */}
          <div className="prose prose-lg max-w-none prose-headings:text-[var(--aci-secondary)] prose-a:text-[var(--aci-primary)] prose-strong:text-[var(--aci-secondary)]">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-12 mb-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-semibold mt-8 mb-3">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <p key={index} className="font-semibold text-[var(--aci-secondary)]">{paragraph.replace(/\*\*/g, '')}</p>;
              }
              if (paragraph.startsWith('- ')) {
                return <li key={index} className="ml-4">{paragraph.replace('- ', '')}</li>;
              }
              if (paragraph.startsWith('| ')) {
                return null; // Skip table rows for simplified rendering
              }
              if (paragraph.startsWith('---')) {
                return <hr key={index} className="my-8 border-gray-200" />;
              }
              if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                return <p key={index} className="italic text-gray-600 bg-gray-50 p-4 rounded-lg">{paragraph.replace(/^\*|\*$/g, '')}</p>;
              }
              if (paragraph.trim() === '') return null;
              return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Share this article:</span>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[var(--aci-primary)] hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[var(--aci-primary)] hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[var(--aci-primary)] hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Author Bio */}
      <section className="py-12 bg-gray-50 border-y">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 items-start">
            <div className="w-20 h-20 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-1">
                About {post.author.name}
              </h3>
              <p className="text-[var(--aci-primary)] font-medium mb-3">{post.author.title}</p>
              <p className="text-gray-600">{post.author.bio}</p>
              {post.author.linkedin && (
                <a
                  href={post.author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--aci-primary)] font-medium mt-4 hover:underline"
                >
                  <Linkedin className="w-4 h-4" />
                  Connect on LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <span className="px-2 py-1 bg-[var(--aci-primary)] text-white text-xs font-medium rounded">
                    {related.category}
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--aci-secondary)] mt-4 mb-2 group-hover:text-[var(--aci-primary)] transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{related.excerpt}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{related.read_time}</span>
                    <span className="text-[var(--aci-primary)] font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Put These Insights Into Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team of experts can help you implement these strategies at your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/blog" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Read More Articles
            </Button>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
