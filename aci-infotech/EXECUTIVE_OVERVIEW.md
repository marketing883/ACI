# ACI Infotech Platform - Executive Overview

## Admin Dashboard Access

| Field | Value |
|-------|-------|
| **URL** | `https://[your-domain]/admin` |
| **Email** | `{{ADMIN_EMAIL}}` |
| **Password** | `{{ADMIN_PASSWORD}}` |

> **Note:** Admin credentials are managed through Supabase Authentication. Contact your system administrator for access.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Public Website](#2-public-website)
3. [Admin Dashboard](#3-admin-dashboard)
4. [Lead Management System](#4-lead-management-system)
5. [Content Management System](#5-content-management-system)
6. [Analytics & Tracking](#6-analytics--tracking)
7. [AI-Powered Features](#7-ai-powered-features)
8. [Hiring & Careers](#8-hiring--careers)
9. [Technical Infrastructure](#9-technical-infrastructure)
10. [Security Features](#10-security-features)

---

## 1. Platform Overview

ACI Infotech's digital platform is a comprehensive enterprise marketing and lead generation system built with modern web technologies. The platform serves two primary functions:

1. **Public Website** - A professional marketing website showcasing services, case studies, and thought leadership content
2. **Admin Dashboard** - A full-featured back-office system for lead management, content management, analytics, and hiring

### Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14 (React), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Server Components |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| AI Models | Claude (Anthropic), GPT-4o (OpenAI) |
| Email | Resend |
| Analytics | Custom real-time tracking system |
| Rate Limiting | Upstash Redis |

---

## 2. Public Website

### 2.1 Homepage (`/`)
- Hero section with value proposition
- Services overview with interactive cards
- Partner logos (Databricks, Snowflake, AWS, Azure, Salesforce)
- Featured case studies carousel
- Client testimonials
- Newsletter signup
- AI-powered chat widget

### 2.2 Services Pages (`/services/*`)

| Service | Route | Description |
|---------|-------|-------------|
| Services Hub | `/services` | Overview of all service offerings |
| Data Engineering | `/services/data-engineering` | Data platforms, ETL, data mesh, lakehouse |
| Applied AI/ML | `/services/applied-ai-ml` | GenAI, MLOps, computer vision, NLP |
| Cloud Modernization | `/services/cloud-modernization` | AWS, Azure, Kubernetes, migration |
| MarTech & CDP | `/services/martech-cdp` | Salesforce, Braze, customer data platforms |
| Digital Transformation | `/services/digital-transformation` | SAP S/4HANA, ServiceNow, ERP modernization |
| Cyber Security | `/services/cyber-security` | Zero trust, DevSecOps, compliance |

### 2.3 Industries Pages (`/industries/*`)

| Industry | Route |
|----------|-------|
| Industries Hub | `/industries` |
| Financial Services | `/industries/financial-services` |
| Healthcare | `/industries/healthcare` |
| Retail | `/industries/retail` |
| Manufacturing | `/industries/manufacturing` |
| Energy | `/industries/energy` |
| Hospitality | `/industries/hospitality` |
| Transportation | `/industries/transportation` |

### 2.4 Platforms/Partners (`/platforms/*`)

| Platform | Route |
|----------|-------|
| Platforms Hub | `/platforms` |
| Databricks | `/platforms/databricks` |
| Snowflake | `/platforms/snowflake` |
| AWS | `/platforms/aws` |
| Azure | `/platforms/azure` |
| Salesforce | `/platforms/salesforce` |
| SAP | `/platforms/sap` |
| ServiceNow | `/platforms/servicenow` |
| Microsoft Dynamics | `/platforms/microsoft-dynamics` |
| Braze | `/platforms/braze` |

### 2.5 Content & Resources

| Content Type | Route | Description |
|--------------|-------|-------------|
| Case Studies | `/case-studies` | Client success stories with metrics |
| Case Study Detail | `/case-studies/[slug]` | Individual case study pages |
| Blog | `/blogs` | Technical articles and insights |
| Blog Post | `/blogs/[slug]` | Individual blog posts |
| Whitepapers | `/whitepapers` | Gated downloadable resources |
| Whitepaper Detail | `/whitepapers/[slug]` | Whitepaper landing pages |
| Playbooks | `/playbooks` | Strategic implementation guides |
| Playbook Detail | `/playbooks/[slug]` | Individual playbook pages |
| News & Press | `/news` | Company news and press releases |

### 2.6 Company Pages

| Page | Route |
|------|-------|
| About Us | `/about` |
| Contact | `/contact` |
| Careers | `/careers` |
| Job Detail | `/careers/[slug]` |
| Privacy Policy | `/privacy-policy` |
| Terms of Service | `/terms-of-service` |

### 2.7 Landing Pages (`/lp/*`)
- Dynamic landing pages for campaigns
- UTM parameter tracking
- Custom forms per campaign
- Thank you page with conversion tracking

### 2.8 Interactive Components

#### Chat Widget
- AI-powered conversational assistant
- Page-aware context (knows what page visitor is on)
- Natural lead qualification through conversation
- Collects: name, email, company, job title, service interest
- 4-layer AI fallback (Claude Sonnet > Claude Haiku > GPT-4o > GPT-4o-mini)

#### Forms
- Contact form with spam protection
- Newsletter signup (footer + dedicated sections)
- Whitepaper download (gated with email verification)
- Playbook access (gated with email verification)
- Job application form

---

## 3. Admin Dashboard

### 3.1 Access & Navigation

**URL:** `/admin`

**Sidebar Sections:**
- Dashboard (home)
- Leads (5 lead types)
- Content (5 content types)
- Hiring (jobs + applications)
- Analytics (real-time + triggers)

### 3.2 Main Dashboard (`/admin`)

The dashboard provides an at-a-glance view of:
- **Total Leads** - Aggregate count across all sources
- **New This Week** - Recent lead activity
- **Avg Lead Score** - AI-calculated engagement score
- **Content Published** - Total published content pieces

**Lead Source Breakdown:**
- Contact form submissions
- Chat widget leads
- Playbook downloads
- Whitepaper downloads

**Quick Access:**
- Recent leads with AI scoring
- Content statistics
- Pending items requiring attention

---

## 4. Lead Management System

### 4.1 Lead Types & Sources

| Lead Type | Admin Route | Source | Data Captured |
|-----------|-------------|--------|---------------|
| Contact Submissions | `/admin/contacts` | Contact form | Name, email, company, phone, inquiry type, message |
| Chat Leads | `/admin/chat-leads` | Chat widget | Name, email, company, job title, conversation history, pages visited |
| Playbook Leads | `/admin/playbook-leads` | Playbook downloads | Name, email, company, job title, playbook requested |
| Whitepaper Leads | `/admin/whitepaper-leads` | Whitepaper downloads | Name, email, company, job title, whitepaper requested |
| Newsletter Subscribers | `/admin/subscribers` | Newsletter signup | Email, source page, subscription status |
| Landing Page Leads | `/admin/lp-leads` | Campaign landing pages | Full form data + UTM parameters |

### 4.2 Lead Lifecycle

```
New > Contacted > Qualified > Closed
```

Each lead progresses through these stages with full audit trail.

### 4.3 Lead Features

**For All Lead Types:**
- Search and filter capabilities
- Status management
- Export to CSV
- Delete with confirmation

**AI Intelligence Reports:**
Available for Contact and Chat leads, includes:
- **Person Profile**: Role analysis, seniority level, decision-maker probability
- **Company Analysis**: Industry, size estimation, tech stack inference, likely challenges
- **Opportunity Fit**: Pain points, value propositions, relevant case studies
- **Engagement Strategy**: Talking points, discovery questions, objection handling
- **Signals**: Intent score, urgency indicators, budget signals, timeline estimation

### 4.4 Lead Scoring

AI-powered scoring (0-100) based on:
- Company size and industry fit
- Job title and seniority
- Engagement behavior (pages visited, time on site)
- Content consumed (whitepapers, case studies)
- Chat conversation quality

---

## 5. Content Management System

### 5.1 Blog Posts (`/admin/blog`)

**Capabilities:**
- Create, edit, publish, unpublish
- Rich text editor
- Featured image upload
- Category and tag management
- SEO fields (meta title, description, keywords)
- Read time calculation
- Author attribution
- Bulk import from external sources

**Fields:**
- Title, slug, excerpt, content
- Author name and image
- Category, tags, keywords
- Featured image
- Publish date
- Status (draft/published)

### 5.2 Case Studies (`/admin/case-studies`)

**Capabilities:**
- Full CRUD operations
- Client logo upload
- Metrics and results tracking
- Service and technology tagging
- Testimonial management
- Featured status toggle

**Fields:**
- Client name, industry, logo
- Challenge, solution, results
- Key metrics (quantified outcomes)
- Technologies used
- Services provided
- Client testimonial (quote, author, title)
- SEO metadata

### 5.3 Whitepapers (`/admin/whitepapers`)

**Capabilities:**
- PDF upload and management
- Download tracking
- Gated/ungated toggle
- Category management

**Fields:**
- Title, description, category
- PDF file URL
- Cover image
- Author information
- Page count, file size
- Table of contents
- Related services/industries
- Download count (auto-tracked)

### 5.4 Webinars (`/admin/webinars`)

**Capabilities:**
- Schedule management
- Registration tracking
- Recording management post-event

**Fields:**
- Title, description, category
- Scheduled date/time
- Duration
- Platform (Zoom, Teams, etc.)
- Registration URL
- Speaker information (name, title, bio)
- Agenda items
- Recording URL (post-event)
- Slides URL

### 5.5 News & Press (`/admin/news`)

**Capabilities:**
- Internal news and external press links
- Featured toggle
- Archive management

**Fields:**
- Title, content/excerpt
- External URL (for press coverage)
- Image
- Published date
- Status (draft/published/archived)
- Featured toggle

---

## 6. Analytics & Tracking

### 6.1 Real-Time Analytics (`/admin/analytics`)

**Live Metrics:**
- Active visitors (currently on site)
- Page views (last hour)
- Average engagement score
- Countries with active visitors

**Visitor Details:**
- Device type (desktop/mobile/tablet)
- Browser and OS
- Geographic location (country, city)
- Company detection (via IP/domain)
- Entry page and current page
- Pages viewed count
- Engagement score
- Session duration

**Visualizations:**
- Active visitors list with live updates
- Top pages (1 hour)
- Device breakdown chart
- Live feed of page views

### 6.2 Engagement Triggers (`/admin/analytics/triggers`)

Automated engagement system that triggers actions based on visitor behavior.

**Trigger Types:**

| Trigger | Description |
|---------|-------------|
| Exit Intent | When visitor moves cursor toward browser close/back |
| Idle Time | After period of inactivity (configurable seconds) |
| Scroll Depth | When reaching scroll milestone (0-100%) |
| Time on Page | After spending X seconds on page |
| Engagement Score | When score reaches threshold |
| Return Visitor | For returning visitors |
| Section Time | Time spent in specific page section |

**Trigger Configuration:**
- Target pages (specific or all)
- Exclude pages
- Message/action content
- Cooldown period
- Frequency cap (per session/visitor)
- Device targeting
- Visitor type targeting
- Priority setting

**Performance Tracking:**
- Impressions (times shown)
- Engagements (interactions)
- Conversions (desired outcomes)
- Conversion rate

### 6.3 Tracked Events

| Category | Events |
|----------|--------|
| Navigation | page_view, page_exit, navigation |
| Engagement | click, scroll, hover, cta_interaction |
| Forms | form_focus, form_input, form_submit |
| Media | video_play, video_pause, video_complete |
| Chat | chat_open, chat_message, chat_close |
| Behavior | idle_start, idle_end, exit_intent, rage_click |

### 6.4 Attribution Tracking

- First touch attribution (original source)
- Last touch attribution (converting source)
- UTM parameter capture (source, medium, campaign, content, term)
- Multi-session journey tracking
- Lead ID linking upon conversion

---

## 7. AI-Powered Features

### 7.1 Chat Assistant

**Location:** Floating widget on all public pages

**Capabilities:**
- Natural conversation flow
- Page-aware context (adapts responses based on current page)
- Lead qualification through conversation
- Service recommendation
- Meeting scheduling assistance

**AI Models (Fallback Chain):**
1. Claude Sonnet 4 (primary)
2. Claude 3.5 Haiku (fallback)
3. GPT-4o (fallback)
4. GPT-4o-mini (final fallback)

### 7.2 Lead Intelligence Reports

**Triggered:** On-demand from admin lead detail view

**Report Sections:**
- Person profile analysis
- Company intelligence
- Opportunity assessment
- Engagement strategy recommendations
- Intent and urgency signals

### 7.3 Content Generation

**Available For:** Blog posts, case studies, whitepapers, webinars

**Features:**
- AI-generated drafts based on topic/outline
- SEO optimization suggestions
- Internal linking recommendations
- Schema markup generation

### 7.4 Whitepaper Nurturing

**Triggered:** After whitepaper download

**Features:**
- Personalized thank-you email generation
- Related content recommendations
- Follow-up topic suggestions
- Personalized CTAs

---

## 8. Hiring & Careers

### 8.1 Job Listings (`/admin/jobs`)

**Capabilities:**
- Create and manage job postings
- Department categorization
- Status management (draft/published/closed)
- Application tracking

**Fields:**
- Title, slug, description
- Department (Data Engineering, AI & ML, Cloud, MarTech, Cybersecurity, Digital Transformation)
- Location and location type (remote/hybrid/onsite)
- Employment type (full-time/part-time/contract)
- Experience level
- Requirements and responsibilities
- Benefits
- Salary range (optional)

**Departments:**
- Data Engineering
- AI & ML
- Cloud
- MarTech
- Cybersecurity
- Digital Transformation

### 8.2 Job Applications (`/admin/job-applications`)

**Capabilities:**
- View and manage all applications
- Filter by job and status
- Status workflow management
- Notes and rating system

**Application Status Workflow:**
```
New > Reviewing > Interviewed > Offered > Hired
                              > Rejected
```

**Captured Data:**
- Applicant name, email, phone
- Resume URL
- LinkedIn and portfolio URLs
- Cover letter
- Current company and title
- Experience level
- Internal notes
- Rating (1-5)

---

## 9. Technical Infrastructure

### 9.1 Database Tables

| Table | Purpose |
|-------|---------|
| `contacts` | Contact form submissions |
| `chat_leads` | Chat widget leads |
| `playbook_leads` | Playbook download leads |
| `whitepaper_leads` | Whitepaper download leads |
| `newsletter_subscribers` | Email subscribers |
| `lp_leads` | Landing page leads |
| `blog_posts` | Blog content |
| `case_studies` | Case study content |
| `whitepapers` | Whitepaper content |
| `webinars` | Webinar events |
| `news` | News items |
| `jobs` | Job listings |
| `job_applications` | Job applications |
| `visitor_sessions` | Analytics sessions |
| `visitor_events` | Analytics events |
| `page_views` | Page view tracking |
| `engagement_triggers` | Trigger configurations |
| `team_members` | Team directory |
| `partners` | Partner logos |
| `certifications` | Company certifications |

### 9.2 API Routes

**Public APIs:**
- `/api/contact` - Contact form submission
- `/api/newsletter` - Newsletter signup
- `/api/chat` - Chat widget messages
- `/api/chat/lead` - Chat lead capture
- `/api/whitepaper-leads` - Whitepaper downloads
- `/api/playbook-leads` - Playbook downloads
- `/api/jobs` - Public job listings
- `/api/jobs/apply` - Job applications
- `/api/lp/submit` - Landing page submissions

**Analytics APIs:**
- `/api/analytics/events` - Event tracking
- `/api/analytics/session` - Session management
- `/api/analytics/heatmap` - Heatmap data
- `/api/analytics/triggers` - Trigger management

**Admin APIs:**
- `/api/admin/blogs` - Blog CRUD
- `/api/admin/case-studies` - Case study CRUD
- `/api/admin/whitepapers` - Whitepaper CRUD
- `/api/admin/webinars` - Webinar CRUD
- `/api/admin/news` - News CRUD
- `/api/admin/jobs` - Job CRUD
- `/api/admin/job-applications` - Application management
- `/api/admin/lead-intelligence` - AI lead analysis
- `/api/admin/content-generate` - AI content generation
- `/api/admin/upload` - File uploads

### 9.3 External Integrations

| Service | Purpose |
|---------|---------|
| Supabase | Database, Auth, Storage |
| Anthropic (Claude) | Primary AI models |
| OpenAI (GPT-4o) | Fallback AI models |
| Resend | Email delivery |
| Upstash Redis | Rate limiting, caching |
| LinkedIn Insight Tag | Conversion tracking |

### 9.4 Environment Variables Required

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Email
RESEND_API_KEY=
FROM_EMAIL=
ADMIN_EMAIL=

# Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 10. Security Features

### 10.1 Authentication
- Supabase Auth with email/password
- Server-side session management
- Protected admin routes

### 10.2 Form Protection
- **Rate Limiting**: 5 submissions per hour per IP
- **Bot Detection**: Honeypot fields, submission timing analysis
- **Spam Filtering**: Content analysis, pattern detection
- **Email Validation**: Format validation + corporate email preference

### 10.3 Data Protection
- Input sanitization on all endpoints
- SQL injection prevention (Supabase parameterized queries)
- XSS protection (React automatic escaping)
- CORS configuration

### 10.4 Privacy
- Privacy policy page
- Cookie consent management
- Do-not-track respect option
- IP anonymization capability

---

## Quick Reference

### Key URLs

| Function | URL |
|----------|-----|
| Public Website | `/` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin` |
| Contact Leads | `/admin/contacts` |
| Chat Leads | `/admin/chat-leads` |
| Blog Management | `/admin/blog` |
| Case Studies | `/admin/case-studies` |
| Analytics | `/admin/analytics` |
| Job Listings | `/admin/jobs` |

### Common Tasks

| Task | Location |
|------|----------|
| View new leads | Admin Dashboard > Leads section |
| Publish blog post | Admin > Blog > New/Edit > Set status to Published |
| Generate lead intelligence | Admin > Contacts/Chat Leads > Select lead > Generate Report |
| Create engagement trigger | Admin > Analytics > Triggers > Create Trigger |
| Post new job | Admin > Hiring > Job Listings > New Job |
| Export leads | Any lead list > Export to CSV button |

---

*Document generated: March 2026*
*Platform Version: 1.0*
