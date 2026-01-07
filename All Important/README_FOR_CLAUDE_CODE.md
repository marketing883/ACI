# ACI INFOTECH WEBSITE - CLAUDE CODE INSTRUCTION GUIDE

## 🎯 PROJECT OVERVIEW

You are building a complete website for ACI Infotech, an enterprise technology consulting firm. This is NOT a simple brochure site—it includes:
- 53+ static/template pages
- Dynamic content (case studies, blog, resources)
- Intelligent chat agent powered by Claude API
- Admin CMS
- Advanced features (SEO, AEO, GEO, analytics, chat)

**Reference Design:** You have access (https://github.com/marketing883/ACI) main brainch to see the website design (HTML/CSS/JS) in Git repo - use index-2.html as the reference design for the homepage
**IMPORTANT Reference Files:** Access this folder forall important reference files for tech, specs, content, brand, etc - https://github.com/marketing883/ACI/blob/main/All%20Important/SERVICES_TEMPLATE_GUIDE.md
**Your Job:** Use ACI's (www.aciinfotech) visual language, and build ACI's consulting firm content

---

## 📚 DOCUMENTS PROVIDED

### Phase 1 Documents (Setup & Architecture)
1. **00_TECHNICAL_SPEC.md** - Complete technical architecture
2. **01_SITEMAP.md** - Full site structure and navigation
3. **02_BRAND_NARRATIVE.md** - Brand positioning, voice, design principles
4. **04_COMPONENT_LIBRARY.md** - All reusable components to build


### Phase 2 Documents (Content)
5. **content_homepage.json** - Structured homepage content
6. **ACI_Website_Content_KB.md** - Complete content knowledge base (all pages)
   - Use this for detailed page content
   - Has exact copy for every section

### Phase 3 Documents (Advanced Features)
7. **03_CHAT_AGENT_SPEC.md** - Complete chat agent specification

---

## 🚀 BUILD SEQUENCE (FOLLOW THIS ORDER)

### **Start: FOUNDATION & CORE PAGES**

#### First: Project Setup & Component Library

**Step 1: Initialize Project**
```bash
# Create Next.js 14 with TypeScript
npx create-next-app@latest aci-infotech --typescript --tailwind --app --src-dir

# Install dependencies
npm install @supabase/supabase-js framer-motion react-hook-form zod lucide-react
npm install -D @types/node
```

**Step 2: Reference Design Integration**
- (https://github.com/marketing883/ACI) main brainch to see the website design (HTML/CSS/JS) in Git repo - use index-2.html as the reference design for the homepage
- Extract CSS variables (colors, typography, spacing)
- Create `/styles/design-system.css` with ACI-branded variables
- Copy component patterns (but NOT content)

**Step 3: Build Component Library**
**READ:** `04_COMPONENT_LIBRARY.md`

Build in this order:
1. Foundation (CSS variables, typography, spacing)
2. Atoms (Button, Input, Badge, Icon)
3. Molecules (Card, StatDisplay, FormField)
4. Organisms (Navigation, Footer, Hero, ServiceGrid)

**Deliverable:** Functional component library, can compose pages

---

#### Next: Homepage + Core Pages

**Step 4: Build Homepage**
**READ:** `content_homepage.json` (has all structured content)

Build these sections in order:
1. Hero section (headline, stats, CTAs)
2. The Difference (3-column benefits)
3. Services grid (6 services)
4. Case studies showcase (3-4 featured)
5. Technology partners (logo grid)
6. Recent news (4 news items)
7. Testimonials (carousel)
8. ArqAI platform intro
9. Awards/certifications
10. Blog preview
11. Final CTA

**Test:** Homepage should be fully functional, responsive, looks professional

**Step 5: Build About Us Page**
**READ:** `ACI_Website_Content_KB.md` → Section 7 → About Us Page

Sections:
- Hero (who we are)
- How we work (3 principles)
- Our capabilities (4 areas)
- Leadership team (with photos)
- Awards & certifications
- By the numbers (stats)
- Technology ecosystem
- CTA

**Step 6: Build Contact Page**
- Contact form (name, email, company, role, inquiry type, message)
- Form validation (Zod schema)
- Submit to Supabase
- Success/error states
- Calendly embed option

**Deliverable:** Homepage, About, Contact fully functional

---

#### Next: Service Pages (All 6)

**Step 7: Build Service Page Template**
**READ:** `ACI_Website_Content_KB.md` → Section 7 → SERVICE PAGES

Create reusable template `/components/templates/ServicePageTemplate.tsx`

Sections:
- Hero (service-specific headline, value prop)
- What we build (intro paragraph)
- Service offerings (4-6 offerings per service)
- Technology stack (visual)
- Service-specific case studies (3-4)
- Service process (5 phases)
- Why choose ACI (5 points)
- FAQ (5-8 questions)
- CTA

**Step 8: Build All 6 Service Pages**

Use template with content from KB:
1. `/services/data-engineering`
2. `/services/applied-ai-ml`
3. `/services/cloud-modernization`
4. `/services/martech-cdp`
5. `/services/digital-transformation`
6. `/services/cyber-security`

**Deliverable:** All 6 service pages live and functional

---

### **WEEK 2: CONTENT PAGES & CMS**

#### Day 5: Platform & Industry Pages

**Step 9: Build Platform Page Template**
**READ:** `ACI_Website_Content_KB.md` → Section 9 → PLATFORM PAGES

Build 7 platform pages:
1. `/platforms/salesforce`
2. `/platforms/servicenow`
3. `/platforms/snowflake`
4. `/platforms/sap`
5. `/platforms/mulesoft`
6. `/platforms/adobe`
7. `/platforms/aws`

**Step 10: Build Industry Page Template**
**READ:** `ACI_Website_Content_KB.md` → Section 8 → INDUSTRY PAGES

Build 10 industry pages:
1. `/industries/banking`
2. `/industries/healthcare`
3. `/industries/retail`
4. `/industries/manufacturing`
5. `/industries/hospitality`
6. `/industries/education`
7. `/industries/automotive`
8. `/industries/energy`
9. `/industries/public-sector`
10. `/industries/oil-gas`

**Deliverable:** All platform and industry pages functional

---

#### Day 6-7: Case Studies & Blog (CMS)

**Step 11: Set Up Supabase Database**
**READ:** `00_TECHNICAL_SPEC.md` → DATABASE SCHEMA

Create tables:
- `content_case_studies`
- `content_blog_posts`
- `content_whitepapers`
- `content_webinars`
- `leads_contacts`
- `leads_newsletter`
- `chat_conversations`

**Step 12: Build Case Studies**
1. Case study listing page (`/case-studies`)
   - Grid view
   - Filter by industry
   - Search functionality
2. Case study detail template (`/case-studies/[slug]`)
   - Hero with client logo
   - Challenge, Solution, Results sections
   - Technologies used
   - Testimonial (if available)
   - Related case studies

**Step 13: Build Blog**
1. Blog listing page (`/blog`)
   - Grid view
   - Filter by category
   - Search functionality
2. Blog post detail template (`/blog/[slug]`)
   - Featured image
   - Author info
   - Content (markdown or rich text)
   - Related posts

**Step 14: Build Resources Pages**
1. Whitepapers listing (`/resources/whitepapers`)
2. Webinars listing (`/resources/webinars`)
3. Detail pages for each

**Deliverable:** All dynamic content pages working with Supabase

---

#### Day 8-9: Admin Dashboard

**Step 15: Build Admin Authentication**
- Login page (`/admin/login`)
- Session management (httpOnly cookies)
- Protected route middleware

**Step 16: Build Admin Dashboard**
- Dashboard overview (`/admin`)
  - Total contacts
  - Newsletter subscribers
  - Recent submissions
  - Popular content

**Step 17: Build Content Management**
- Case studies CRUD (`/admin/content/case-studies`)
- Blog posts CRUD (`/admin/content/blog`)
- Whitepapers CRUD (`/admin/content/whitepapers`)
- Webinars CRUD (`/admin/content/webinars`)

**Step 18: Build Lead Management**
- Contact submissions (`/admin/leads/contacts`)
- Newsletter subscribers (`/admin/leads/newsletter`)
- CSV export functionality

**Deliverable:** Fully functional admin CMS

---

### **WEEK 3: CHAT AGENT & LAUNCH**

#### Day 10-12: Intelligent Chat Agent

**Step 19: Build Chat UI**
**READ:** `03_CHAT_AGENT_SPEC.md` (ENTIRE DOCUMENT)

Components:
1. ChatWidgetButton (floating button)
2. ChatWindow (expandable chat interface)
3. Message component (user/assistant styling)
4. SuggestedActions (action buttons)
5. LeadCaptureForm (inline form in chat)

**Step 20: Integrate Claude API**
- Create API route `/api/chat/message`
- Connect to Anthropic Claude API
- Implement streaming responses
- Store conversations in Supabase

**Step 21: Implement Context Retrieval**
- Set up pgvector in Supabase
- Generate embeddings for case studies, blog posts, services
- Implement vector search
- Feed relevant context to Claude

**Step 22: Add Chat Features**
- Lead capture flow
- Calendly integration for meeting scheduling
- Suggested actions (view case study, schedule call, etc.)
- Conversation storage and history

**Step 23: Build Admin Chat Management**
- Chat transcripts listing (`/admin/leads/chat-transcripts`)
- View full conversations
- Export transcripts
- Lead status tracking

**Deliverable:** Fully functional intelligent chat agent

---

#### Day 13: SEO & Performance

**Step 24: SEO Implementation**
- Dynamic meta tags per page (from content JSON)
- Structured data (Organization, Service, Article schemas)
- Sitemap generation (`/sitemap.xml`)
- robots.txt
- Open Graph images

**Step 25: Performance Optimization**
- Image optimization (Next.js Image component)
- Lazy loading
- Code splitting
- Font optimization
- Compression

**Deliverable:** Lighthouse score 90+ on all metrics

---

#### Day 14: Testing & Launch Prep

**Step 26: Testing**
- [ ] All pages load correctly
- [ ] All forms submit successfully
- [ ] Chat agent works and captures leads
- [ ] Admin dashboard functional
- [ ] Mobile responsive on all pages
- [ ] No console errors
- [ ] Accessibility check (keyboard nav, screen readers)

**Step 27: Deploy to Vercel**
- Connect GitHub repo
- Set environment variables
- Deploy to production
- Set up custom domain (if provided)
- Test production deployment

**Deliverable:** Live website at production URL

---

## 🎨 DESIGN SYSTEM USAGE

### From ArqAI Reference Design

**CLONE:**
- ✅ Color palette
- ✅ Typography scale
- ✅ Component styling patterns (buttons, cards, forms)
- ✅ Navigation structure
- ✅ Footer layout
- ✅ Animation patterns

**DON'T CLONE:**
- ❌ Page layouts (ACI needs different structure)
- ❌ Copy/content (use ACI content from JSON files)
- ❌ Product-specific features (ArqAI is product, ACI is services)

### ACI Brand Requirements

**READ:** `02_BRAND_NARRATIVE.md` for full brand guidelines

**Key Points:**
- **Voice:** Direct, technical, proof-driven (not marketing fluff)
- **Positioning:** "Engineers who stay" (not consultants who leave)
- **Proof:** Always back claims with case studies, metrics, technologies
- **No Pricing:** NEVER discuss rates, costs, or pricing
- **No Valuation:** NEVER mention company revenue or valuation

---

## ⚠️ CRITICAL RULES

### Content Rules (NEVER VIOLATE)

1. **NO PRICING DISCUSSIONS**
   - Never mention rates, costs, or pricing comparisons
   - Don't say "40-60% less than competitors"
   - Don't discuss budget ranges

2. **NO COMPANY VALUATION**
   - Never mention ACI's revenue or valuation
   - Don't say "$650M value delivered" (that's client outcomes)
   - Client savings are OK (e.g., "MSCI saved $12M")

3. **ALWAYS USE PROOF**
   - Back every claim with case study, metric, or technology
   - Use specific names: "Databricks", "MSCI", "19 years"
   - Never make vague promises

4. **BRAND NARRATIVE**
   - Emphasize "engineers who stay" not "consultants who leave"
   - Focus on production accountability, not just delivery
   - Highlight 2am reliability, senior team, SLAs

---

## 📋 DELIVERABLES CHECKLIST

### Public Pages (53+ pages)
- [ ] Homepage
- [ ] About Us
- [ ] Contact
- [ ] Careers
- [ ] 6 Service pages
- [ ] 7 Platform pages
- [ ] 10 Industry pages
- [ ] Case studies (listing + detail template)
- [ ] Blog (listing + detail template)
- [ ] Whitepapers (listing + detail template)
- [ ] Webinars (listing + detail template)
- [ ] Legal pages (Privacy, Terms)
- [ ] Thank you pages (4 types)
- [ ] Error pages (404, 500)

### Dynamic Features
- [ ] Case studies CMS
- [ ] Blog CMS
- [ ] Resources management
- [ ] Contact form submissions
- [ ] Newsletter signups
- [ ] Chat conversations

### Admin Dashboard
- [ ] Authentication
- [ ] Dashboard overview
- [ ] Content management (CRUD for all content types)
- [ ] Lead management
- [ ] Chat transcripts
- [ ] CSV exports

### Chat Agent
- [ ] Chat UI (widget + window)
- [ ] Claude API integration
- [ ] Context retrieval (vector search)
- [ ] Lead capture
- [ ] Calendly integration
- [ ] Conversation storage

### Technical Requirements
- [ ] SEO (meta tags, structured data, sitemap)
- [ ] Performance (90+ Lighthouse score)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Loading states
- [ ] Security (protected admin routes, HTTPS)

---

## 🔧 ENVIRONMENT VARIABLES

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic (Chat Agent)
ANTHROPIC_API_KEY=your_anthropic_key

# Admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_ga_id

# Optional: Calendly
NEXT_PUBLIC_CALENDLY_URL=your_calendly_url
```

---

## 📦 FINAL DELIVERABLES

When complete, provide:

1. **Full Next.js project** (GitHub repo)
2. **README.md** with:
   - Setup instructions
   - Environment variables needed
   - How to run locally
   - How to deploy
3. **Component documentation** (what each component does)
4. **Admin credentials** (how to log in)
5. **Supabase schema** (SQL to create tables)
6. **Deployment guide** (Vercel setup steps)

---

## 🚨 IF YOU GET STUCK

### Common Issues & Solutions

**Issue:** Reference design doesn't have a component I need  
**Solution:** Create it from scratch using Tailwind, matching visual style

**Issue:** Content JSON doesn't have all the details  
**Solution:** Refer to `ACI_Website_Content_KB.md` for complete content

**Issue:** Chat agent responses are generic  
**Solution:** Check system prompt, ensure context retrieval working

**Issue:** Admin auth not working  
**Solution:** Check middleware, verify session cookies

**Issue:** Supabase queries failing  
**Solution:** Check RLS policies, use service role key for admin

---

## 💡 PRO TIPS

1. **Build components first, then pages** - Reusable components save time
2. **Test mobile constantly** - Don't wait until the end
3. **Use TypeScript** - Catches bugs early
4. **Git commit frequently** - Small, atomic commits
5. **Read brand narrative** - Understanding positioning helps with implementation
6. **Follow the sequence** - Don't jump around, build in order
7. **Chat agent is critical** - Allocate proper time, it's a differentiator
8. **Performance matters** - Enterprise buyers expect fast sites
9. **Ask questions** - If something's unclear, ask before building wrong

---

## 📞 SUPPORT

**Human Contact:** insights@aciinfotech.com  
**Project Owner:** Habib  
**Questions About:** Brand, content, design decisions

---

**Last Updated:** January 2025  
**Status:** Ready for Development  
**Estimated Timeline:** 14 days (2 weeks intensive work)

**LET'S BUILD SOMETHING GREAT!** 🚀
