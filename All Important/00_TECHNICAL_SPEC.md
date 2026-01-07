# ACI INFOTECH WEBSITE - TECHNICAL SPECIFICATION

## PROJECT OVERVIEW

**Project:** ACI Infotech Corporate Website Rebuild
**Purpose:** Enterprise consulting firm website showcasing data engineering, AI/ML, and cloud modernization services
**Target Audience:** CIOs, CTOs, CDOs, VP-level technology leaders at Fortune 500 companies
**Primary Goal:** Generate qualified enterprise leads through thought leadership and case study proof

---

## TECH STACK

### Core Framework
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Backend & Database
- **Supabase** for backend services
  - PostgreSQL database
  - Authentication for admin
  - Row Level Security (RLS)
  - Storage for uploaded files

### Forms & Interactions
- **React Hook Form** for form validation
- **Zod** for schema validation

### Deployment
- **Vercel** for hosting
- **GitHub** for version control

---

## REFERENCE DESIGN USAGE

### What to Clone from Reference Design (ArqAI)
✅ **Visual Design System:**
- Color palette and CSS variables
- Typography scale and font choices
- Component styling patterns (cards, buttons, forms)
- Spacing and layout grid
- Navigation structure
- Footer layout
- Animation patterns (page transitions, hover effects)

✅ **Component Patterns:**
- Navigation/Header component
- Hero section layouts
- Card components (various styles)
- CTA sections
- Form components (input, textarea, select)
- Modal/Dialog patterns
- Loading states
- Error states

### What NOT to Clone
❌ **Content & Structure:**
- Page layouts (ACI needs different page types)
- Copy/messaging (use content JSON files)
- Product-specific features (ArqAI is product, ACI is services)
- Feature descriptions
- Pricing pages (ACI doesn't discuss pricing)

### How to Adapt
- Take ArqAI's **visual language** (how things look)
- Apply to ACI's **content structure** (what's being said)
- Think: "If ArqAI's design team built a consulting website"

---

## SITE ARCHITECTURE

### Page Types Required

**Static Marketing Pages:**
- Homepage (hero, services, case studies, proof)
- About Us (team, story, capabilities)
- Contact Us (form, office locations, team directory)
- Careers (jobs listing)

**Service Pages (6 total):**
- Data Engineering Services
- Applied AI & ML Services
- Cloud Modernization Services
- MarTech & CDP Services
- Digital Transformation Services
- Cyber Security Services

**Platform Pages (7 total):**
- Salesforce
- ServiceNow
- Snowflake
- SAP
- Mulesoft
- Adobe
- AWS

**Industry Pages (10 total):**
- Banking & Financial Services
- Healthcare
- Retail & CPG
- Manufacturing
- Hospitality
- Education
- Automotive
- Energy & Utilities
- Public Sector
- Oil & Gas

**Dynamic Content Pages:**
- Case Studies (listing + individual pages)
- Blog (listing + individual posts)
- Resources/Whitepapers (listing + individual pages)
- Webinars (listing + individual pages)

**Admin Pages:**
- Login
- Dashboard
- Content Management (case studies, blog, resources)
- Lead Management (contacts, newsletter)

---

## FEATURES & FUNCTIONALITY

### Public-Facing Features

**1. Navigation**
- Sticky header with services/platforms/industries dropdowns
- Mobile-responsive hamburger menu
- Breadcrumbs on inner pages
- CTA button in nav ("Talk to an Architect")

**2. Forms**
- Contact form (name, email, company, role, message, inquiry type)
- Newsletter signup (email only, simple)
- Case study download (name, email, company)
- "Talk to an Architect" scheduling (integrate Calendly or similar)

**3. Content Display**
- Featured case studies on homepage
- Blog post previews
- Service cards with tech stack icons
- Client logo carousel
- Testimonial sections
- Team member profiles

**4. Interactive Elements**
- Search functionality (blog, case studies)
- Filter/sort for resources
- Tabbed content sections
- Accordion FAQs
- Modal lightboxes for media

**5. SEO & Performance**
- Dynamic meta tags per page
- Structured data (Organization, Service, Article schemas)
- Image optimization (Next.js Image component)
- Lazy loading
- Sitemap generation
- robots.txt

### Chat Agent (IMPORTANT)

**Purpose:** Intelligent conversational assistant for site visitors

**Core Functionality:**
- **Context-aware responses** - Understands ACI's services, case studies, expertise
- **Lead qualification** - Asks smart questions to understand visitor needs
- **Resource recommendations** - Suggests relevant case studies, blog posts, services
- **Meeting scheduling** - Can book time with architects directly
- **Technical depth** - Can discuss specific technologies (Databricks, Snowflake, etc.)

**Implementation Approach:**
- **Backend:** Anthropic Claude API (latest Sonnet model)
- **Context:** Pre-loaded with ACI knowledge base (services, case studies, platforms)
- **Retrieval:** Vector search against case studies, blog posts for relevant info
- **UI:** Floating chat widget (bottom-right), expandable to full view
- **Personality:** Technical but approachable, direct, no marketing fluff

**Chat Agent Features:**
- Conversation memory (session-based)
- Suggested questions/prompts
- "Talk to a human" escalation button
- Transcript export for visitors
- Lead capture at start of conversation
- Typing indicators, read receipts
- Mobile-optimized interface

**Integration Points:**
- Access to case study database
- Access to blog posts
- Access to service descriptions
- Integration with contact form (can transition to form)
- Integration with calendar (can book meetings)

**Technical Specs:**
- Store conversations in Supabase
- Use Claude API with streaming responses
- Vector embeddings for content retrieval (use Supabase pgvector)
- Rate limiting to manage API costs
- Session management (30 min timeout)

### Admin Features (Simplified)

**Dashboard:**
- Total contacts count
- Newsletter subscribers count
- Popular content (views)
- Recent form submissions

**Content Management:**
- CRUD for case studies (title, client, challenge, solution, results, tags, images)
- CRUD for blog posts (title, content, author, featured image, SEO)
- CRUD for whitepapers (title, description, PDF file, cover image)
- CRUD for webinars (title, description, video URL, thumbnail)

**Lead Management:**
- View contact form submissions
- View newsletter signups
- View chat transcripts
- Export to CSV
- Simple status tags (new/contacted/qualified)

**No Complex Features:**
- ❌ No lead scoring
- ❌ No AI analysis of leads
- ❌ No behavioral tracking
- ❌ No download tokens
- Keep it simple - consulting sales is relationship-driven

---

## DATABASE SCHEMA (Supabase)

### Tables Required

**content_case_studies**
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- client_name (text)
- client_logo_url (text)
- industry (text)
- challenge (text)
- solution (text)
- results (jsonb) - array of result metrics
- technologies (jsonb) - array of tech used
- featured_image_url (text)
- published_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
- status (enum: draft/published)

**content_blog_posts**
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- excerpt (text)
- content (text)
- author (text)
- author_image_url (text)
- featured_image_url (text)
- category (text)
- tags (jsonb)
- published_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
- status (enum: draft/published)

**content_whitepapers**
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- description (text)
- cover_image_url (text)
- file_url (text)
- category (text)
- published_at (timestamp)
- created_at (timestamp)
- status (enum: draft/published)

**content_webinars**
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- description (text)
- thumbnail_url (text)
- video_url (text)
- duration (text)
- published_at (timestamp)
- created_at (timestamp)
- status (enum: draft/published)

**leads_contacts**
- id (uuid, primary key)
- name (text)
- email (text)
- company (text)
- role (text)
- message (text)
- inquiry_type (text)
- source (text) - which page they came from
- status (enum: new/contacted/qualified)
- created_at (timestamp)

**leads_newsletter**
- id (uuid, primary key)
- email (text, unique)
- source (text) - footer/popup/blog/etc
- subscribed_at (timestamp)
- status (enum: active/unsubscribed)

**chat_conversations**
- id (uuid, primary key)
- session_id (text, unique)
- visitor_email (text, nullable)
- visitor_name (text, nullable)
- messages (jsonb) - array of message objects
- context_documents (jsonb) - which case studies/blogs were referenced
- lead_captured (boolean)
- started_at (timestamp)
- last_message_at (timestamp)

---

## DEVELOPMENT PHASES

### Phase 1: Setup & Core Pages (Priority 1)
- Project setup (Next.js, Tailwind, Supabase)
- Reference design system implementation
- Component library (buttons, cards, forms, nav, footer)
- **Pages:** Homepage, About Us, Contact, all 6 Service pages

### Phase 2: Content Pages (Priority 2)
- Platform pages (7 pages - can use template)
- Industry pages (10 pages - can use template)
- Case Studies listing + detail pages
- Blog listing + detail pages

### Phase 3: CMS & Admin (Priority 3)
- Admin authentication
- Dashboard
- Content management (case studies, blog, resources)
- Lead management
- File upload to Supabase storage

### Phase 4: Chat Agent (Priority 4)
- Chat UI component
- Claude API integration
- Context retrieval system (vector search)
- Conversation storage
- Lead capture flow
- Mobile optimization

### Phase 5: Polish & Launch (Priority 5)
- SEO optimization (meta tags, structured data, sitemap)
- Performance optimization (image optimization, lazy loading)
- Accessibility audit (WCAG 2.1 AA)
- Mobile responsiveness final check
- Analytics setup (Google Analytics 4)
- Deploy to Vercel

---

## BUILD SEQUENCE FOR CLAUDE CODE

**Week 1: Core Infrastructure**
1. Project setup with reference design system
2. Component library (all reusable components)
3. Homepage (fully functional)
4. About Us page
5. Contact form (working with Supabase)

**Week 1-2: Service & Content Pages**
6. Service pages (all 6) - use template
7. Platform pages (all 7) - use template
8. Industry pages (all 10) - use template
9. Case studies (listing + CMS + detail view)
10. Blog (listing + CMS + detail view)

**Week 2: Admin & CMS**
11. Admin login/authentication
12. Admin dashboard
13. Content management interface
14. Lead management interface

**Week 2-3: Chat Agent**
15. Chat UI component
16. Claude API integration
17. Context retrieval system
18. Conversation management
19. Mobile chat experience

**Week 3: Launch Prep**
20. SEO implementation
21. Performance optimization
22. Testing & QA
23. Deploy to production

---

## KEY TECHNICAL DECISIONS

### Why Next.js App Router?
- Server-side rendering for SEO
- Dynamic routing for blog/case studies
- API routes for forms and chat agent
- Image optimization built-in
- Easy deployment to Vercel

### Why Supabase?
- PostgreSQL database (powerful, scalable)
- Built-in auth for admin
- Real-time subscriptions (for chat)
- Storage for file uploads
- Row Level Security for data protection
- Generous free tier

### Why Claude for Chat Agent?
- Best-in-class conversational AI
- Long context window (can load entire case studies)
- Strong technical reasoning (can discuss architectures)
- Tool use capability (can interact with database)
- Fast streaming responses

### Why Simplified Admin?
- Consulting sales is relationship-driven
- Don't need complex lead scoring
- Focus on content quality over automation
- Keep it maintainable
- Reduce surface area for bugs

---

## PERFORMANCE TARGETS

- **Lighthouse Score:** 90+ on all metrics
- **Time to Interactive:** < 3 seconds
- **First Contentful Paint:** < 1.5 seconds
- **Core Web Vitals:** All "Good" ratings
- **Mobile Performance:** 85+ score

---

## ACCESSIBILITY REQUIREMENTS

- WCAG 2.1 AA compliance
- Keyboard navigation throughout
- Screen reader friendly
- Sufficient color contrast (4.5:1 minimum)
- Alt text on all images
- Semantic HTML
- Focus indicators visible
- Skip navigation links

---

## SECURITY REQUIREMENTS

- Admin routes protected (middleware)
- Environment variables for secrets
- HTTPS only (enforced)
- CSRF protection on forms
- Rate limiting on API routes
- SQL injection prevention (Supabase handles)
- XSS protection (React handles)
- Content Security Policy headers

---

## ENVIRONMENT VARIABLES NEEDED

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (Chat Agent)
ANTHROPIC_API_KEY=

# Admin
ADMIN_PASSWORD_HASH=

# Optional: Analytics
NEXT_PUBLIC_GA_ID=
```

---

## SUCCESS METRICS

**For Build Quality:**
- All pages load under 3 seconds
- Mobile responsive on all devices
- No console errors
- All forms functional
- Chat agent responds correctly

**For Business Goals:**
- Contact form submissions (track)
- Newsletter signups (track)
- Case study views (track)
- Chat conversations initiated (track)
- Meeting bookings (track)

---

## NOTES FOR CLAUDE CODE

1. **Start with components, then compose pages** - Build the Lego blocks first
2. **Use reference design's visual language** - But ACI's content structure
3. **Keep admin simple** - Don't over-engineer
4. **Chat agent is critical** - Allocate proper time for this
5. **Content comes from JSON files** - Don't make up content
6. **Mobile-first approach** - Design for mobile, enhance for desktop
7. **Performance matters** - Enterprise clients expect fast sites
8. **SEO is essential** - These buyers start with Google search

---

## DELIVERABLES EXPECTED

From Claude Code, expect:
- ✅ Full Next.js project with all pages
- ✅ Component library documented
- ✅ Working admin interface
- ✅ Functional chat agent
- ✅ Supabase schema created
- ✅ All forms working
- ✅ SEO implemented
- ✅ Deployed to Vercel
- ✅ README with setup instructions
- ✅ Environment variable template

---

**Last Updated:** January 2025
**Status:** Ready for development
