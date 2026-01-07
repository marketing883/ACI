# ACI WEBSITE BUILD - MASTER DOCUMENT INDEX

## 📋 OVERVIEW

This folder contains **all documentation needed** to build the complete ACI Infotech website using Claude Code. Documents are organized by phase and purpose.

**Total Documents:** 14 files  
**Total Content:** ~200,000 words of specifications  
**Build Timeline:** 14 days with Claude Code  

---

## 🎯 START HERE

### **README_FOR_CLAUDE_CODE.md** 📘 [START HERE]
**Purpose:** Master instruction guide for Claude Code  
**When to use:** Give this to Claude Code first  
**Contains:**
- Project overview
- Build sequence (14-day timeline)
- Technology stack
- Environment setup
- Critical rules and guidelines
- Success criteria

**Action:** Give this to Claude Code at the very beginning

---

## 📚 CORE SPECIFICATIONS (Phase 1 - Setup)

### **00_TECHNICAL_SPEC.md** 🔧
**Purpose:** Complete technical architecture  
**When to use:** Day 1 - Project setup  
**Contains:**
- Tech stack details (Next.js 14, Supabase, Claude API)
- Database schema for all tables
- API routes structure
- Security requirements
- Performance targets
- Environment variables needed

**Action:** Claude Code references this during setup

---

### **01_SITEMAP.md** 🗺️
**Purpose:** Complete site structure and navigation  
**When to use:** Day 1 - Navigation build  
**Contains:**
- All 53+ page URLs
- Navigation structure (mega-menus)
- Footer structure
- Breadcrumbs
- URL patterns
- Mobile navigation specs
- Internal linking strategy

**Action:** Claude Code uses this to build navigation

---

### **02_BRAND_NARRATIVE.md** 🎨
**Purpose:** Brand positioning and design system  
**When to use:** Throughout (reference continuously)  
**Contains:**
- **THE BRAND TRUTH:** "Engineers Who Stay" (2am call positioning)
- Brand voice and tone guidelines
- Design system philosophy
- Color psychology
- Typography
- Photography style
- Content patterns (proof over promise)
- Critical "Do's and Don'ts"

**Action:** Claude Code references for tone, voice, design decisions

---

### **04_COMPONENT_LIBRARY.md** 🧩
**Purpose:** All reusable UI components  
**When to use:** Days 1-3 - Component building  
**Contains:**
- Foundation (colors, typography, spacing)
- Atom components (Button, Input, Badge, Icon)
- Molecule components (Card, FormField, TechStack)
- Organism components (Navigation, Footer, Hero, ServiceGrid)
- Page templates (Service, Platform, Industry)
- Build sequence for components

**Action:** Claude Code builds components in order specified

---

## 💬 CHAT AGENT SPECIFICATION (Phase 4)

### **03_CHAT_AGENT_SPEC.md** 🤖
**Purpose:** Complete chat agent implementation guide  
**When to use:** Days 10-12 - Chat agent build  
**Contains:**
- Core capabilities (context-aware, lead qualification, resource recommendations)
- Personality and voice
- Sample conversation flows
- Technical implementation (Claude API integration)
- Vector search / context retrieval
- UI/UX specifications
- Admin features
- Analytics & optimization
- Edge cases & error handling

**Action:** Claude Code follows this for entire chat feature

---

## 📄 PAGE CONTENT (Phase 2-3)

### **content_homepage.json** 🏠
**Purpose:** Structured homepage content  
**When to use:** Days 3-4 - Homepage build  
**Contains:**
- Hero section (headline, stats, CTAs)
- All homepage sections (services, case studies, testimonials, etc.)
- Exact copy for every element
- Image references
- CTA text and URLs

**Action:** Claude Code uses this as data source for homepage

---

### **content_about_us.json** ℹ️
**Purpose:** Structured About Us page content  
**When to use:** Day 4 - About page build  
**Contains:**
- Hero section
- Who we are (history, positioning)
- How we work (3 principles)
- Leadership team
- Awards and certifications
- By the numbers stats
- Technology ecosystem

**Action:** Claude Code uses this for About page

---

### **content_service_data_engineering.json** 🔧
**Purpose:** Complete Data Engineering service page (EXAMPLE)  
**When to use:** Day 5 - Service pages build  
**Contains:**
- Hero
- Service offerings (6 detailed offerings)
- Tech stack
- Case studies
- Process timeline
- Why choose ACI
- FAQ

**Action:** Use as template for all 6 service pages

---

### **SERVICES_TEMPLATE_GUIDE.md** 📋
**Purpose:** Template and brief content for all 6 services  
**When to use:** Days 5-6 - Service pages  
**Contains:**
- Service page structure (template)
- Brief content outlines for all 6 services:
  1. Data Engineering ✅ (detailed JSON exists)
  2. Applied AI & ML
  3. Cloud Modernization
  4. MarTech & CDP
  5. Digital Transformation
  6. Cyber Security
- What offerings to include per service
- Technologies per service

**Action:** Claude Code uses this + ACI_Website_Content_KB.md for services 2-6

---

## 📚 COMPREHENSIVE CONTENT REFERENCE

### **ACI_Website_Content_KB.md** 📖 [63KB, 35,000 words]
**Purpose:** Complete content knowledge base for ALL pages  
**When to use:** Throughout - Reference for any page content  
**Contains:**
- Page-by-page content for:
  - Homepage ✅
  - About Us ✅
  - All 6 Service pages ✅
  - All 7 Platform pages ✅
  - All 10 Industry pages ✅
  - Resources pages
  - Contact, Careers, etc.
- Exact headlines, subheadlines, body copy
- SEO guidelines
- Competitive differentiation
- Proof points and credibility markers
- Content governance rules

**Action:** Claude Code references when detailed content JSON doesn't exist

---

## 🗂️ CASE STUDIES & EXAMPLES

### **CASE_STUDIES_SEED_DATA.md** 📚
**Purpose:** Initial case studies to populate database  
**When to use:** Day 6 - Database seeding  
**Contains:**
- 5 complete case studies with full details:
  1. MSCI - Data Automation
  2. RaceTrac - Real-Time Data Platform
  3. Sodexo - Unified Global Data
  4. Healthcare Firm - Self-Service Analytics
  5. PDS - Healthcare Data Platform
- JSON format ready for database import
- All fields (challenge, solution, results, technologies, testimonials)

**Action:** Claude Code imports these into Supabase

---

## 🚀 EXECUTION & DEPLOYMENT

### **PHASE_EXECUTION_GUIDE.md** 🎯 [CRITICAL]
**Purpose:** Step-by-step build sequence  
**When to use:** Throughout - Follow day-by-day  
**Contains:**
- 11 phases over 14 days
- Exact tasks per phase
- Time estimates per task
- Deliverables per phase
- Verification steps
- Final checklist before launch

**Phases:**
1. Project Setup & Foundation (Days 1-2)
2. Navigation & Layout (Day 2)
3. Homepage (Days 3-4)
4. Core Pages (Days 4-5)
5. Service Pages (Days 5-6)
6. Supabase Setup & Dynamic Content (Days 6-7)
7. Platform & Industry Pages (Day 8)
8. Admin Dashboard (Days 9-10)
9. Intelligent Chat Agent (Days 10-12)
10. SEO & Performance (Day 13)
11. Testing & Deployment (Day 14)

**Action:** Claude Code follows this sequence exactly

---

## 📊 DOCUMENT USAGE BY PHASE

### **Phase 1: Setup (Days 1-2)**
Use:
- ✅ README_FOR_CLAUDE_CODE.md
- ✅ 00_TECHNICAL_SPEC.md
- ✅ 04_COMPONENT_LIBRARY.md
- ✅ 02_BRAND_NARRATIVE.md

### **Phase 2: Navigation (Day 2)**
Use:
- ✅ 01_SITEMAP.md
- ✅ 04_COMPONENT_LIBRARY.md

### **Phase 3: Homepage (Days 3-4)**
Use:
- ✅ content_homepage.json
- ✅ 02_BRAND_NARRATIVE.md

### **Phase 4: Core Pages (Days 4-5)**
Use:
- ✅ content_about_us.json
- ✅ ACI_Website_Content_KB.md

### **Phase 5: Service Pages (Days 5-6)**
Use:
- ✅ content_service_data_engineering.json
- ✅ SERVICES_TEMPLATE_GUIDE.md
- ✅ ACI_Website_Content_KB.md

### **Phase 6: Database & Content (Days 6-7)**
Use:
- ✅ 00_TECHNICAL_SPEC.md (database schema)
- ✅ CASE_STUDIES_SEED_DATA.md

### **Phase 7: Platform & Industry Pages (Day 8)**
Use:
- ✅ ACI_Website_Content_KB.md

### **Phase 8: Admin Dashboard (Days 9-10)**
Use:
- ✅ 00_TECHNICAL_SPEC.md

### **Phase 9: Chat Agent (Days 10-12)**
Use:
- ✅ 03_CHAT_AGENT_SPEC.md ⚠️ [CRITICAL - Read entire document]

### **Phase 10: SEO & Performance (Day 13)**
Use:
- ✅ 00_TECHNICAL_SPEC.md
- ✅ ACI_Website_Content_KB.md

### **Phase 11: Testing & Deploy (Day 14)**
Use:
- ✅ PHASE_EXECUTION_GUIDE.md (final checklist)

---

## 📦 WHAT TO GIVE CLAUDE CODE & WHEN

### **Initial Setup (Give Everything)**
Send Claude Code all documents in this order:

1. **README_FOR_CLAUDE_CODE.md** - "Read this first"
2. **PHASE_EXECUTION_GUIDE.md** - "Follow this sequence"
3. **00_TECHNICAL_SPEC.md** - "Technical architecture"
4. **01_SITEMAP.md** - "Site structure"
5. **02_BRAND_NARRATIVE.md** - "Brand guidelines"
6. **04_COMPONENT_LIBRARY.md** - "Component specs"

Then say: **"Start with Phase 1 from PHASE_EXECUTION_GUIDE.md"**

---

### **As Needed (Reference Documents)**
Claude Code will reference these as it builds:

- **content_homepage.json** - When building homepage
- **content_about_us.json** - When building about page
- **content_service_data_engineering.json** - When building services
- **SERVICES_TEMPLATE_GUIDE.md** - For service page structure
- **CASE_STUDIES_SEED_DATA.md** - For database seeding
- **ACI_Website_Content_KB.md** - For any detailed content needs
- **03_CHAT_AGENT_SPEC.md** - When building chat agent

---

### **Throughout (Continuous Reference)**
Claude Code should continuously reference:
- **02_BRAND_NARRATIVE.md** - For voice, tone, positioning
- **PHASE_EXECUTION_GUIDE.md** - For sequence and tasks
- **00_TECHNICAL_SPEC.md** - For technical decisions

---

## ⚠️ CRITICAL REMINDERS FOR CLAUDE CODE

### **Content Rules (NEVER VIOLATE)**
1. ❌ **NO PRICING DISCUSSIONS** - Never mention rates, costs, or pricing
2. ❌ **NO COMPANY VALUATION** - Never mention ACI's revenue or valuation
3. ✅ **ALWAYS USE PROOF** - Back claims with case studies, metrics, technologies
4. ✅ **ENGINEERS WHO STAY** - Emphasize "2am call" positioning

### **Brand Positioning**
- NOT: "Better than Accenture" or "Cheaper than Big 4"
- YES: "Engineers who stay" vs "Consultants who leave"
- YES: "We answer the 2am call"
- YES: Production accountability, senior team, SLAs

### **Voice & Tone**
- Direct, not corporate
- Confident, not arrogant
- Specific, not vague (name actual technologies)
- Proof-driven, not promise-driven
- Realistic, not hyperbolic

---

## 📊 DOCUMENT STATISTICS

| Document | Word Count | Page Count | Purpose |
|----------|-----------|------------|---------|
| README_FOR_CLAUDE_CODE | ~5,000 | 18 | Master guide |
| 00_TECHNICAL_SPEC | ~5,500 | 19 | Architecture |
| 01_SITEMAP | ~4,000 | 13 | Structure |
| 02_BRAND_NARRATIVE | ~7,500 | 24 | Brand & Design |
| 03_CHAT_AGENT_SPEC | ~9,000 | 29 | Chat feature |
| 04_COMPONENT_LIBRARY | ~7,000 | 22 | Components |
| PHASE_EXECUTION_GUIDE | ~12,000 | 38 | Build sequence |
| content_homepage.json | ~6,000 | 20 | Homepage data |
| content_about_us.json | ~4,000 | 13 | About page data |
| content_service_data_engineering.json | ~8,000 | 26 | Service example |
| SERVICES_TEMPLATE_GUIDE | ~3,000 | 10 | Service structure |
| CASE_STUDIES_SEED_DATA | ~5,500 | 18 | Database seed |
| ACI_Website_Content_KB | ~35,000 | 110 | Full content |
| **TOTAL** | **~111,500** | **~360** | Complete spec |

---

## 🎯 SUCCESS METRICS

**Website is considered complete when:**
- [ ] All 53+ pages exist and load
- [ ] All features work (forms, chat, admin)
- [ ] Lighthouse score 90+ on all metrics
- [ ] Mobile responsive on all devices
- [ ] SEO implemented on all pages
- [ ] Chat agent responds intelligently
- [ ] Admin dashboard functional
- [ ] Deployed to production
- [ ] Documentation complete

---

## 🆘 TROUBLESHOOTING

**If Claude Code Gets Stuck:**
1. Reference **PHASE_EXECUTION_GUIDE.md** for current phase
2. Check **02_BRAND_NARRATIVE.md** for brand guidelines
3. Reference **ACI_Website_Content_KB.md** for detailed content
4. Review **00_TECHNICAL_SPEC.md** for technical decisions

**If Content is Missing:**
- Check **ACI_Website_Content_KB.md** - it has everything

**If Design Decisions Needed:**
- Reference **02_BRAND_NARRATIVE.md** for brand guidelines
- Reference ArqAI design system for visual patterns

**If Technical Questions:**
- Reference **00_TECHNICAL_SPEC.md** for architecture
- Reference **03_CHAT_AGENT_SPEC.md** for chat technical details

---

## 📞 CONTACT

**Project Owner:** Habib  
**Company:** ACI Infotech  
**Email:** insights@aciinfotech.com  

**Questions about:**
- Brand positioning → Reference 02_BRAND_NARRATIVE.md first
- Technical architecture → Reference 00_TECHNICAL_SPEC.md first
- Content → Reference ACI_Website_Content_KB.md first
- Build sequence → Reference PHASE_EXECUTION_GUIDE.md first

---

## ✅ FINAL CHECKLIST FOR HABIB

Before giving to Claude Code, ensure:
- [ ] All 14 documents are in the folder
- [ ] Reference design (ArqAI) Git repo URL ready
- [ ] Supabase account created
- [ ] Anthropic API key obtained
- [ ] Calendly URL for meeting scheduling
- [ ] Admin password decided
- [ ] Google Analytics ID (optional)

**Then:** Give Claude Code the README_FOR_CLAUDE_CODE.md and say "Let's build the ACI website following the PHASE_EXECUTION_GUIDE.md"

---

**Last Updated:** January 2025  
**Status:** Complete documentation package ready  
**Estimated Build Time:** 14 days with Claude Code  

🚀 **READY TO BUILD!**
