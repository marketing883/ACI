# ACI WEBSITE - PHASE-BY-PHASE EXECUTION GUIDE

## PURPOSE

This document provides Claude Code with **exact step-by-step instructions** for building the ACI website. Follow this sequence precisely. Each phase has specific deliverables and verification steps.

---

## 🎯 PROJECT GOALS

**Build:** Complete enterprise website for ACI Infotech consulting firm  
**Timeline:** 14 days intensive development  
**Tech Stack:** Next.js 14, Supabase, Anthropic Claude API, Tailwind CSS  
**Key Feature:** Intelligent chat agent powered by Claude

---

## ⚙️ PREREQUISITES

Before starting, ensure you have:
- [ ] Access to reference design (ArqAI) Git repository
- [ ] All specification documents (00-04 series .md files)
- [ ] Content JSON files (homepage, about, services)
- [ ] Supabase account credentials
- [ ] Anthropic API key for chat agent
- [ ] Calendly URL for meeting scheduling

---

## 📅 PHASE 1: PROJECT SETUP & FOUNDATION (Days 1-2)

### PHASE 1A: Initialize Project (2 hours)

**Commands:**
```bash
# Create Next.js project
npx create-next-app@latest aci-infotech --typescript --tailwind --app --src-dir
cd aci-infotech

# Install dependencies
npm install @supabase/supabase-js framer-motion react-hook-form zod lucide-react
npm install -D @types/node
```

**Deliverable:** Clean Next.js 14 project with TypeScript

**Verify:**
- `npm run dev` starts without errors
- Can access http://localhost:3000

---

### PHASE 1B: Design System Setup (4 hours)

**Task:** Extract and adapt ArqAI design system

**Step 1:** Clone reference design
```bash
git clone [ArqAI_repo_url] reference-design
```

**Step 2:** Create design system file
```
src/styles/design-system.css
```

**Extract from ArqAI:**
- CSS variables (colors, typography, spacing)
- Font imports
- Base utility classes
- Animation keyframes

**Adapt for ACI:**
- Change brand color from ArqAI's to ACI's blue (#0066CC)
- Update any ArqAI-specific naming
- Keep typography scale and spacing as-is

**Deliverable:** `design-system.css` with ACI branding

**Verify:**
- Import in `src/app/layout.tsx`
- Test color variables in a test page
- All CSS variables accessible

---

### PHASE 1C: Build Atom Components (8 hours)

**Location:** `src/components/ui/`

**Build these components (in order):**

**1. Button.tsx** (1 hour)
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  href?: string;
  children: ReactNode;
}
```

**2. Input.tsx** (1 hour)
- Text, email, tel, textarea variants
- Error states
- Label + help text

**3. Badge.tsx** (30 mins)
- Variants: default, success, warning, error, info

**4. Icon.tsx** (30 mins)
- Wrapper for lucide-react icons
- Consistent sizing

**5. Card.tsx** (1 hour)
- Base card component
- Hover effects
- Image support

**6. StatDisplay.tsx** (1 hour)
- Large number display
- Label + description
- Size variants

**Deliverable:** 6 functional, reusable atom components

**Verify:**
- Create test page (`/test`) showing all components
- Test responsiveness
- Test all variants

---

### PHASE 1D: Build Molecule Components (8 hours)

**Location:** `src/components/forms/` and `src/components/ui/`

**1. FormField.tsx** (1 hour)
- Combines Input + Label + Error + Help text
- React Hook Form integration

**2. TechStack.tsx** (1 hour)
- Display technology logos in grid
- Hover effects

**3. TestimonialCard.tsx** (1 hour)
- Quote display
- Author + company
- Logo display

**4. ContactForm.tsx** (2 hours)
- Full contact form with validation
- Zod schema
- Supabase submission
- Success/error states

**5. NewsletterForm.tsx** (1 hour)
- Simple email capture
- Supabase submission

**Deliverable:** 5 functional molecule components

**Verify:**
- Forms submit correctly
- Validation works
- Error messages display

---

## 📅 PHASE 2: NAVIGATION & LAYOUT (Day 2)

### PHASE 2A: Build Navigation (4 hours)

**Location:** `src/components/layout/Navigation.tsx`

**Requirements:**
- Sticky header
- Logo (left)
- Menu items (center): Services, Platforms, Industries (dropdowns)
- CTA button (right): "Talk to an Architect"
- Mobile hamburger menu
- Smooth animations

**Mega-menu dropdowns:**
- Services: 6 items in 2 columns
- Platforms: 7 items in 2 columns
- Industries: 10 items in 2 columns

**Deliverable:** Fully functional navigation

**Verify:**
- Desktop: All dropdowns work
- Mobile: Hamburger menu works
- Sticky behavior on scroll
- All links go to correct pages (even if pages don't exist yet)

---

### PHASE 2B: Build Footer (3 hours)

**Location:** `src/components/layout/Footer.tsx`

**Structure:**
- 4 columns (desktop), stacked (mobile)
- Newsletter signup form (inline)
- Social links
- Legal links
- Certification badges

**Deliverable:** Fully functional footer

**Verify:**
- Newsletter form submits
- All links work
- Responsive layout
- Social icons link correctly

---

### PHASE 2C: Create Root Layout (1 hour)

**Location:** `src/app/layout.tsx`

**Include:**
- Navigation
- Main content area
- Footer
- SEO metadata
- Fonts
- Analytics (Google Analytics)

**Deliverable:** Complete site layout

**Verify:**
- Navigation + Footer on every page
- Fonts load correctly
- No layout shifts

---

## 📅 PHASE 3: HOMEPAGE (Days 3-4)

### PHASE 3A: Build Hero Section (2 hours)

**Reference:** `content_homepage.json` → hero section

**Build:**
- Large headline + subheadline
- Stats row (4 stats)
- 2 CTA buttons
- Background animation (subtle)

**Deliverable:** Homepage hero

**Verify:**
- Responsive on all devices
- CTAs link correctly
- Stats display properly

---

### PHASE 3B: Build Service Cards Section (3 hours)

**Reference:** `content_homepage.json` → services section

**Build:**
- Section headline
- 6 service cards in grid (3x2 on desktop, 1 column mobile)
- Each card: icon, title, description, technologies, CTA

**Deliverable:** Services grid

**Verify:**
- Hover effects work
- Cards link to service pages
- Responsive layout

---

### PHASE 3C: Build Case Studies Showcase (3 hours)

**Reference:** `content_homepage.json` → case_studies section

**Build:**
- Dark background section
- 3-4 featured case studies
- Each: client logo, challenge, solution, results (metrics), CTA
- Carousel or grid layout

**Deliverable:** Case studies section

**Verify:**
- Results metrics display prominently
- Client logos visible
- CTAs link to case study pages

---

### PHASE 3D: Build Remaining Homepage Sections (4 hours)

**Sections to build:**
1. Technology partners (logo grid)
2. Recent news (4 cards)
3. Testimonials (carousel)
4. ArqAI platform intro
5. Awards/certifications (badge grid)
6. Blog preview (3 posts)
7. Final CTA

**Deliverable:** Complete homepage

**Verify:**
- All sections display correctly
- Smooth scroll between sections
- Mobile responsive
- No console errors

---

## 📅 PHASE 4: CORE PAGES (Days 4-5)

### PHASE 4A: Build About Us Page (4 hours)

**Reference:** `content_about_us.json`

**Sections:**
1. Hero with stats
2. Who we are (text content)
3. How we work (3 columns)
4. Capabilities (4 columns)
5. Leadership team (grid with photos)
6. Awards (grid)
7. By the numbers (stats grid)
8. Technology ecosystem
9. Testimonials
10. Careers CTA
11. Final CTA

**Deliverable:** Complete About page

**Verify:**
- All sections render
- Leadership photos display (use placeholders if needed)
- Responsive layout

---

### PHASE 4B: Build Contact Page (3 hours)

**Build:**
1. Hero section
2. Contact form (name, email, company, role, inquiry type, message)
3. Form validation (Zod)
4. Submit to Supabase `leads_contacts` table
5. Success page redirect
6. Office locations (if applicable)

**Deliverable:** Functional contact page

**Verify:**
- Form validation works
- Submission stores in database
- Error handling works
- Redirects to thank-you page

---

### PHASE 4C: Build Thank You Pages (1 hour)

**Create:**
- `/thank-you/contact`
- `/thank-you/newsletter`
- `/thank-you/whitepaper`
- `/thank-you/webinar`

**Each page:**
- Confirmation message
- Next steps
- Links back to site

**Deliverable:** 4 thank-you pages

---

### PHASE 4D: Build Error Pages (1 hour)

**Create:**
- `/404` - Page not found
- `/500` - Server error

**Each page:**
- Error message
- Links to homepage
- Search (optional)

**Deliverable:** Error pages

---

## 📅 PHASE 5: SERVICE PAGES (Days 5-6)

### PHASE 5A: Build Service Page Template (4 hours)

**Location:** `src/components/templates/ServicePageTemplate.tsx`

**Reference:** `content_service_data_engineering.json` (full example)

**Structure:**
1. Hero
2. What we build (text)
3. Offerings grid (4-6 offerings)
4. Tech stack visual
5. Case studies (3-4 featured)
6. Process timeline (5 phases)
7. Why choose ACI (5 reasons)
8. FAQ accordion (6-8 questions)
9. Final CTA

**Deliverable:** Reusable service template

**Verify:**
- Template accepts props for all sections
- Renders correctly

---

### PHASE 5B: Build All 6 Service Pages (6 hours)

**Reference:**
- `content_service_data_engineering.json` (detailed)
- `SERVICES_TEMPLATE_GUIDE.md` (for other 5)
- `ACI_Website_Content_KB.md` → SERVICE PAGES (detailed content)

**Create:**
1. `/services/data-engineering` ✅ (use detailed JSON)
2. `/services/applied-ai-ml`
3. `/services/cloud-modernization`
4. `/services/martech-cdp`
5. `/services/digital-transformation`
6. `/services/cyber-security`

**For services 2-6:**
- Use template
- Pull content from KB document
- Adapt offerings, tech stack, case studies per service

**Deliverable:** All 6 service pages live

**Verify:**
- Each page has correct content
- All links work
- Case studies display
- FAQs expand/collapse

---

## 📅 PHASE 6: SUPABASE SETUP & DYNAMIC CONTENT (Days 6-7)

### PHASE 6A: Create Supabase Database (2 hours)

**Reference:** `00_TECHNICAL_SPEC.md` → DATABASE SCHEMA

**Create tables:**
1. `content_case_studies`
2. `content_blog_posts`
3. `content_whitepapers`
4. `content_webinars`
5. `leads_contacts`
6. `leads_newsletter`
7. `chat_conversations`

**Create SQL migrations:**
```sql
-- See TECHNICAL_SPEC for exact schema
-- Include proper indexes
-- Set up Row Level Security
```

**Deliverable:** Database tables created

**Verify:**
- All tables exist
- Can insert/query data
- RLS policies set

---

### PHASE 6B: Seed Case Studies (1 hour)

**Reference:** `CASE_STUDIES_SEED_DATA.md`

**Import 5 case studies:**
1. MSCI
2. RaceTrac
3. Sodexo
4. Healthcare Firm
5. PDS

**Deliverable:** Case studies in database

**Verify:**
- Query returns all 5 case studies
- Data formatted correctly

---

### PHASE 6C: Build Case Studies Pages (4 hours)

**Create:**
1. `/case-studies` (listing page)
   - Grid view
   - Filter by industry
   - Search functionality
   - Fetch from Supabase

2. `/case-studies/[slug]` (detail page)
   - Hero with client logo
   - Challenge, Solution, Results
   - Technologies used
   - Testimonial (if available)
   - Related case studies
   - CTA

**Deliverable:** Case studies pages working

**Verify:**
- Listing shows all case studies
- Filters work
- Detail pages render correctly
- Related case studies display

---

### PHASE 6D: Build Blog Pages (3 hours)

**Create:**
1. `/blog` (listing page)
2. `/blog/[slug]` (detail page)

**Similar structure to case studies**

**Add 2-3 sample blog posts manually via database**

**Deliverable:** Blog pages working

**Verify:**
- Listing displays posts
- Detail pages render
- Categories filter works

---

## 📅 PHASE 7: PLATFORM & INDUSTRY PAGES (Day 8)

### PHASE 7A: Build Platform Page Template (2 hours)

**Similar to service template but simpler**

**Sections:**
1. Hero
2. Platform expertise
3. Implementation process
4. Case studies
5. Why choose ACI
6. CTA

**Deliverable:** Platform template

---

### PHASE 7B: Create 7 Platform Pages (3 hours)

**Reference:** `ACI_Website_Content_KB.md` → PLATFORM PAGES

**Create:**
1. `/platforms/salesforce`
2. `/platforms/servicenow`
3. `/platforms/snowflake`
4. `/platforms/sap`
5. `/platforms/mulesoft`
6. `/platforms/adobe`
7. `/platforms/aws`

**Deliverable:** 7 platform pages

---

### PHASE 7C: Build Industry Page Template (2 hours)

**Sections:**
1. Hero
2. Industry challenges
3. Our expertise
4. Case studies
5. Tech stack
6. CTA

**Deliverable:** Industry template

---

### PHASE 7D: Create 10 Industry Pages (3 hours)

**Reference:** `ACI_Website_Content_KB.md` → INDUSTRY PAGES

**Create all 10 industry pages using template**

**Deliverable:** 10 industry pages

**Verify:**
- All pages render
- Industry-specific content displays

---

## 📅 PHASE 8: ADMIN DASHBOARD (Days 9-10)

### PHASE 8A: Build Admin Authentication (3 hours)

**Create:**
- `/admin/login` page
- Session management (httpOnly cookies)
- Middleware to protect admin routes
- Logout functionality

**Deliverable:** Secure admin login

**Verify:**
- Can log in
- Can't access admin without login
- Logout works
- Session persists

---

### PHASE 8B: Build Admin Dashboard (2 hours)

**Create:** `/admin`

**Show:**
- Total contacts
- Newsletter subscribers
- Recent submissions
- Popular content

**Deliverable:** Admin overview

---

### PHASE 8C: Build Content Management (5 hours)

**Create:**
1. `/admin/content/case-studies` (CRUD)
2. `/admin/content/blog` (CRUD)
3. `/admin/content/whitepapers` (CRUD)
4. `/admin/content/webinars` (CRUD)

**Each includes:**
- List view with edit/delete
- Create/edit form
- Rich text editor for content
- File upload for images
- Status management (draft/published)

**Deliverable:** Full content management

**Verify:**
- Can create new content
- Can edit existing
- Can delete
- Changes reflect on public site

---

### PHASE 8D: Build Lead Management (3 hours)

**Create:**
1. `/admin/leads/contacts`
   - List all contact form submissions
   - Status management
   - CSV export

2. `/admin/leads/newsletter`
   - List all newsletter signups
   - CSV export

**Deliverable:** Lead management pages

**Verify:**
- Submissions display
- CSV export works
- Can update status

---

## 📅 PHASE 9: INTELLIGENT CHAT AGENT (Days 10-12)

### PHASE 9A: Build Chat UI (6 hours)

**Reference:** `03_CHAT_AGENT_SPEC.md` (READ ENTIRE DOCUMENT)

**Components to build:**

**1. ChatWidgetButton.tsx** (1 hour)
- Floating button bottom-right
- Click to open chat
- Notification badge

**2. ChatWindow.tsx** (2 hours)
- Expandable window
- Header with close/minimize
- Messages list
- Input field
- Suggested actions

**3. Message.tsx** (1 hour)
- Assistant message (left, gray)
- User message (right, blue)
- Markdown support
- Timestamp

**4. SuggestedActions.tsx** (1 hour)
- Button group below messages
- Click handlers

**5. LeadCaptureForm.tsx** (1 hour)
- Inline form in chat
- Name, email, company fields
- Submission

**Deliverable:** Complete chat UI

**Verify:**
- Widget button appears
- Window opens/closes
- Messages display
- Input works

---

### PHASE 9B: Integrate Claude API (8 hours)

**Create:** `/api/chat/message` API route

**Steps:**

**1. Set up Anthropic client** (1 hour)
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

**2. Create system prompt** (2 hours)
- Reference `03_CHAT_AGENT_SPEC.md` → System Prompt
- Include ACI knowledge (services, platforms, case studies)
- Define personality and rules

**3. Implement streaming** (2 hours)
- Stream responses to client
- Handle errors gracefully

**4. Store conversations** (2 hours)
- Save to `chat_conversations` table
- Session management

**5. Test thoroughly** (1 hour)
- Ask various questions
- Test lead capture
- Test error handling

**Deliverable:** Working Claude integration

**Verify:**
- Chat responds to questions
- Responses are relevant
- Streaming works
- Conversations save

---

### PHASE 9C: Implement Context Retrieval (8 hours)

**Set up vector search:**

**1. Install pgvector in Supabase** (1 hour)
```sql
CREATE EXTENSION vector;
```

**2. Create embeddings table** (1 hour)
```sql
CREATE TABLE chat_knowledge_base (
  id UUID PRIMARY KEY,
  content_type TEXT,
  title TEXT,
  summary TEXT,
  full_content TEXT,
  embedding VECTOR(1536),
  metadata JSONB,
  url TEXT
);
```

**3. Generate embeddings** (3 hours)
- Use OpenAI embeddings API
- Generate for:
  - All case studies
  - All blog posts
  - All service descriptions
  - All platform descriptions

**4. Implement vector search** (2 hours)
```sql
SELECT * FROM chat_knowledge_base
ORDER BY embedding <=> $embedding
LIMIT 5;
```

**5. Feed context to Claude** (1 hour)
- Retrieve relevant docs based on user question
- Include in Claude context
- Claude references specific case studies

**Deliverable:** Context-aware chat

**Verify:**
- Chat suggests relevant case studies
- References specific services
- Answers are more specific

---

### PHASE 9D: Add Chat Features (4 hours)

**Features to add:**

**1. Lead capture flow** (1 hour)
- Natural conversation before asking for info
- Inline form when appropriate
- Save to database

**2. Calendly integration** (1 hour)
- Embed Calendly when user wants meeting
- Or provide link

**3. Admin chat transcripts** (2 hours)
- `/admin/leads/chat-transcripts`
- View all conversations
- Export functionality

**Deliverable:** Complete chat agent

**Verify:**
- All features work
- Lead capture works
- Calendly integration works
- Transcripts viewable in admin

---

## 📅 PHASE 10: SEO & PERFORMANCE (Day 13)

### PHASE 10A: SEO Implementation (4 hours)

**For every page:**

**1. Dynamic meta tags**
- Title (from content JSON)
- Description
- Keywords
- Open Graph tags
- Twitter Card tags

**2. Structured data**
- Organization schema (homepage)
- Service schema (service pages)
- Article schema (blog posts)

**3. Sitemap generation**
- `/sitemap.xml`
- Dynamic (includes all pages)
- Update on content changes

**4. robots.txt**
- `/robots.txt`
- Allow all except admin

**Deliverable:** Full SEO implementation

**Verify:**
- Google Search Console validates
- Meta tags show correctly
- Structured data valid

---

### PHASE 10B: Performance Optimization (4 hours)

**Optimizations:**

**1. Images**
- Use Next.js Image component
- Lazy loading
- WebP format
- Proper sizing

**2. Fonts**
- Preload critical fonts
- Font display: swap

**3. Code splitting**
- Dynamic imports for heavy components
- Lazy load below-fold sections

**4. Caching**
- Static generation where possible
- ISR for dynamic content

**Deliverable:** Optimized site

**Verify:**
- Lighthouse score 90+ on all metrics
- Page load < 3 seconds
- First Contentful Paint < 1.5s

---

### PHASE 10C: Accessibility Audit (2 hours)

**Check:**
- All images have alt text
- Forms have labels
- Keyboard navigation works
- Color contrast meets WCAG 2.1 AA
- Screen reader friendly
- Focus indicators visible

**Fix issues found**

**Deliverable:** Accessible site

**Verify:**
- Lighthouse accessibility score 90+
- Can navigate entire site with keyboard
- Screen reader test passes

---

## 📅 PHASE 11: TESTING & DEPLOYMENT (Day 14)

### PHASE 11A: Comprehensive Testing (4 hours)

**Test:**
- [ ] All pages load without errors
- [ ] All forms submit correctly
- [ ] Chat agent responds accurately
- [ ] Admin dashboard functional
- [ ] Mobile responsive (test on real devices)
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] No console errors
- [ ] All links work
- [ ] Images load
- [ ] Videos play (if any)

**Fix any bugs found**

**Deliverable:** Fully tested site

---

### PHASE 11B: Deploy to Vercel (2 hours)

**Steps:**

**1. Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [repo_url]
git push -u origin main
```

**2. Connect to Vercel**
- Create Vercel project
- Connect GitHub repo
- Set environment variables
- Deploy

**3. Configure custom domain** (if provided)

**4. Set up production environment variables**

**Deliverable:** Live production site

**Verify:**
- Site accessible at production URL
- All features work in production
- Environment variables set correctly

---

### PHASE 11C: Final Documentation (2 hours)

**Create:**

**1. README.md**
- Project overview
- Setup instructions
- Environment variables
- Deployment guide
- Architecture overview

**2. ADMIN_GUIDE.md**
- How to log in
- How to manage content
- How to view leads
- How to export data

**3. MAINTENANCE.md**
- How to update content
- How to add case studies
- How to monitor chat
- Troubleshooting

**Deliverable:** Complete documentation

---

## 📋 FINAL CHECKLIST

Before declaring complete, verify:

### Content
- [ ] All 53+ pages exist and load
- [ ] Homepage fully functional
- [ ] About page complete
- [ ] All 6 service pages live
- [ ] All 7 platform pages live
- [ ] All 10 industry pages live
- [ ] Case studies display correctly
- [ ] Blog posts display correctly

### Features
- [ ] Contact form works
- [ ] Newsletter signup works
- [ ] Chat agent responds intelligently
- [ ] Chat captures leads
- [ ] Chat suggests relevant content
- [ ] Admin login works
- [ ] Admin can manage content
- [ ] Admin can view leads
- [ ] CSV export works

### Technical
- [ ] SEO implemented (all pages)
- [ ] Lighthouse score 90+
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] No console errors
- [ ] All images load
- [ ] Deployed to production

### Documentation
- [ ] README complete
- [ ] Admin guide complete
- [ ] Maintenance guide complete
- [ ] Environment variables documented

---

## 🎉 PROJECT COMPLETE!

Once all checklist items are verified, the website is ready for launch.

**Handoff to client includes:**
1. Live production URL
2. GitHub repository access
3. Admin credentials
4. All documentation
5. Supabase credentials
6. Anthropic API usage notes

---

**Last Updated:** January 2025  
**Estimated Total Time:** 14 days  
**Status:** Ready for execution
