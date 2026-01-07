# ACI INFOTECH WEBSITE - SITEMAP & NAVIGATION

## PRIMARY NAVIGATION STRUCTURE

```
┌─ Home
├─ Services ▼
│  ├─ Data Engineering
│  ├─ Applied AI & ML
│  ├─ Cloud Modernization
│  ├─ MarTech & CDP
│  ├─ Digital Transformation
│  └─ Cyber Security
├─ Platforms ▼
│  ├─ Salesforce
│  ├─ ServiceNow
│  ├─ Snowflake
│  ├─ SAP
│  ├─ Mulesoft
│  ├─ Adobe
│  └─ AWS
├─ Industries ▼
│  ├─ Banking & Financial Services
│  ├─ Healthcare
│  ├─ Retail & CPG
│  ├─ Manufacturing
│  ├─ Hospitality
│  ├─ Education
│  ├─ Automotive
│  ├─ Energy & Utilities
│  ├─ Public Sector
│  └─ Oil & Gas
├─ Resources ▼
│  ├─ Case Studies
│  ├─ Blog
│  ├─ Whitepapers
│  └─ Webinars
├─ About Us ▼
│  ├─ Who We Are
│  ├─ Leadership Team
│  └─ Careers
└─ Contact Us

[CTA Button in Nav]: "Talk to an Architect"
```

---

## COMPLETE PAGE INVENTORY

### Root Pages (8 pages)

**/** - Homepage
**URL:** `/`
**Priority:** Critical
**Template:** Custom (unique layout)

**About** - Who We Are
**URL:** `/about`
**Priority:** Critical
**Template:** About

**Contact** - Contact Us
**URL:** `/contact`
**Priority:** Critical
**Template:** Contact

**Careers** - Join Our Team
**URL:** `/careers`
**Priority:** Medium
**Template:** Careers

---

### Service Pages (6 pages)

All use `/services/[slug]` pattern

1. `/services/data-engineering` - Data Engineering Services
2. `/services/applied-ai-ml` - Applied AI & ML Services
3. `/services/cloud-modernization` - Cloud Modernization Services
4. `/services/martech-cdp` - MarTech & CDP Services
5. `/services/digital-transformation` - Digital Transformation Services
6. `/services/cyber-security` - Cyber Security Services

**Template:** Service (shared template with dynamic content)

---

### Platform Pages (7 pages)

All use `/platforms/[slug]` pattern

1. `/platforms/salesforce` - Salesforce Consulting
2. `/platforms/servicenow` - ServiceNow Consulting
3. `/platforms/snowflake` - Snowflake Consulting
4. `/platforms/sap` - SAP Consulting
5. `/platforms/mulesoft` - Mulesoft Consulting
6. `/platforms/adobe` - Adobe Consulting
7. `/platforms/aws` - AWS Consulting

**Template:** Platform (shared template with dynamic content)

---

### Industry Pages (10 pages)

All use `/industries/[slug]` pattern

1. `/industries/banking` - Banking & Financial Services
2. `/industries/healthcare` - Healthcare
3. `/industries/retail` - Retail & CPG
4. `/industries/manufacturing` - Manufacturing
5. `/industries/hospitality` - Hospitality
6. `/industries/education` - Education
7. `/industries/automotive` - Automotive
8. `/industries/energy` - Energy & Utilities
9. `/industries/public-sector` - Public Sector
10. `/industries/oil-gas` - Oil & Gas

**Template:** Industry (shared template with dynamic content)

---

### Resource Pages (Dynamic Content)

**Case Studies Listing**
**URL:** `/case-studies`
**Priority:** Critical
**Template:** Listing (filterable, searchable)

**Individual Case Study**
**URL:** `/case-studies/[slug]`
**Priority:** Critical
**Template:** Case Study Detail
**Example:** `/case-studies/msci-data-automation`

**Blog Listing**
**URL:** `/blog`
**Priority:** High
**Template:** Listing (filterable by category, searchable)

**Individual Blog Post**
**URL:** `/blog/[slug]`
**Priority:** High
**Template:** Blog Post Detail
**Example:** `/blog/enterprise-ai-governance`

**Whitepapers Listing**
**URL:** `/resources/whitepapers`
**Priority:** Medium
**Template:** Resource Listing

**Individual Whitepaper**
**URL:** `/resources/whitepapers/[slug]`
**Priority:** Medium
**Template:** Resource Detail with download

**Webinars Listing**
**URL:** `/resources/webinars`
**Priority:** Medium
**Template:** Resource Listing

**Individual Webinar**
**URL:** `/resources/webinars/[slug]`
**Priority:** Medium
**Template:** Resource Detail with video embed

---

### Admin Pages (Protected)

**Admin Login**
**URL:** `/admin/login`
**Access:** Public (shows login form)

**Admin Dashboard**
**URL:** `/admin`
**Access:** Protected (requires auth)

**Content Management**
**URL:** `/admin/content`
**Access:** Protected
**Sections:**
- `/admin/content/case-studies`
- `/admin/content/blog`
- `/admin/content/whitepapers`
- `/admin/content/webinars`

**Lead Management**
**URL:** `/admin/leads`
**Access:** Protected
**Sections:**
- `/admin/leads/contacts`
- `/admin/leads/newsletter`
- `/admin/leads/chat-transcripts`

---

## FOOTER NAVIGATION

**Column 1: Company**
- About Us
- Leadership Team
- Careers
- Contact Us

**Column 2: Services**
- Data Engineering
- Applied AI & ML
- Cloud Modernization
- MarTech & CDP
- Digital Transformation
- Cyber Security

**Column 3: Resources**
- Case Studies
- Blog
- Whitepapers
- Webinars

**Column 4: Connect**
- Newsletter Signup (inline form)
- LinkedIn
- Twitter
- YouTube

**Bottom Bar:**
- © 2025 ACI Infotech. All Rights Reserved
- Privacy Policy
- Terms of Service
- [Certification Badges: ISO 27001, CMMi Level 3, Great Place to Work]

---

## URL PATTERNS & ROUTING

### Static Routes
- Simple pages with fixed URLs: `/about`, `/contact`, `/careers`

### Dynamic Routes with Templates
- Services: `/services/[slug]` - 6 pages, shared template
- Platforms: `/platforms/[slug]` - 7 pages, shared template
- Industries: `/industries/[slug]` - 10 pages, shared template

### Database-Driven Routes
- Case Studies: `/case-studies/[slug]` - fetched from Supabase
- Blog Posts: `/blog/[slug]` - fetched from Supabase
- Whitepapers: `/resources/whitepapers/[slug]` - fetched from Supabase
- Webinars: `/resources/webinars/[slug]` - fetched from Supabase

---

## BREADCRUMB STRUCTURE

All pages except homepage should show breadcrumbs:

**Example - Service Page:**
`Home > Services > Data Engineering`

**Example - Case Study:**
`Home > Case Studies > MSCI: Scalable Data Automation`

**Example - Blog Post:**
`Home > Blog > [Category] > [Post Title]`

**Example - Industry Page:**
`Home > Industries > Banking & Financial Services`

---

## INTERNAL LINKING STRATEGY

### Homepage Links To:
- All 6 service pages (from service cards)
- Featured case studies (from case study section)
- About Us (from "Who We Are" section)
- Contact (from multiple CTAs)
- Blog (from blog preview section)

### Service Pages Link To:
- Related case studies (in proof section)
- Related platforms (in tech stack section)
- Related industries (in "who we serve" section)
- Contact (from CTA sections)

### Case Studies Link To:
- Related services
- Related platforms/technologies
- Related industries
- Other case studies (in "related" section)

### Blog Posts Link To:
- Related case studies
- Related services
- Other blog posts (in "related" section)

---

## SITEMAP.XML STRUCTURE

```xml
Priority Levels:
1.0 - Homepage
0.9 - Services, About, Contact
0.8 - Case Studies (listing + individual)
0.7 - Platforms, Industries
0.6 - Blog (listing + individual)
0.5 - Resources, Careers
0.4 - Admin pages (excluded from sitemap)

Update Frequency:
daily - Homepage, Blog listing, Case Studies listing
weekly - Service pages, Blog posts, Case Studies
monthly - Platform pages, Industry pages, About
yearly - Contact, Careers
```

---

## MOBILE NAVIGATION

**Collapsed State:**
- Hamburger icon (top-right)
- Logo (top-left)
- CTA button (hidden on mobile)

**Expanded State:**
- Full-screen overlay
- Expandable accordion for Services/Platforms/Industries
- Direct links for other pages
- CTA button at bottom
- Close icon (X)

**Behavior:**
- Smooth slide-in animation
- Lock body scroll when open
- Tap outside to close
- Back button support

---

## SEARCH FUNCTIONALITY

**Search Bar Location:**
- Desktop: In navigation (icon that expands)
- Mobile: In hamburger menu

**What's Searchable:**
- Case studies (title, client, challenge, solution)
- Blog posts (title, excerpt, content)
- Services (name, description)
- Platforms (name, description)
- Industries (name, description)

**Search Results Page:**
- URL: `/search?q=[query]`
- Grouped by content type
- Highlighted search terms
- Filters: Type (case study/blog/page)
- Pagination if >20 results

---

## SPECIAL PAGES

**Thank You Pages:**
- `/thank-you/contact` - After contact form submission
- `/thank-you/newsletter` - After newsletter signup
- `/thank-you/whitepaper` - After whitepaper download
- `/thank-you/webinar` - After webinar registration

**Error Pages:**
- `/404` - Page not found
- `/500` - Server error
- Both should have navigation back to homepage

**Legal Pages:**
- `/privacy-policy` - Privacy Policy
- `/terms-of-service` - Terms of Service

---

## PAGE COUNTS SUMMARY

**Total Pages to Build:**
- Root pages: 8
- Service pages: 6
- Platform pages: 7
- Industry pages: 10
- Case study listing: 1
- Blog listing: 1
- Resource listings: 2
- Admin pages: ~10
- Legal pages: 2
- Thank you pages: 4
- Error pages: 2

**Grand Total:** ~53 static/template pages + dynamic content pages

**Development Priority Order:**
1. Homepage, About, Contact (3 pages)
2. All Service pages (6 pages)
3. Case Studies (listing + template)
4. Blog (listing + template)
5. Platform pages (7 pages)
6. Industry pages (10 pages)
7. Resources (2 listing pages)
8. Admin (10 pages)
9. Legal, thank you, error pages (8 pages)

---

## NAVIGATION COMPONENT SPECS

**Desktop Header:**
- Height: 80px
- Sticky on scroll
- Background: White with subtle shadow
- Logo: Left-aligned, 180px width
- Nav items: Centered
- CTA button: Right-aligned, primary color
- Dropdowns: Mega-menu style for Services/Platforms/Industries

**Mobile Header:**
- Height: 64px
- Logo: Left, smaller (140px)
- Hamburger: Right
- Sticky on scroll

**Footer:**
- 4-column layout (desktop)
- Stacked layout (mobile)
- Newsletter form: Inline, simple (email + submit)
- Social icons: Subtle, hover effects
- Background: Dark (matches reference design)

---

**Notes for Claude Code:**
1. Use Next.js `app/` directory routing
2. Create shared layouts for templates (service, platform, industry)
3. Implement middleware for admin route protection
4. Use metadata API for dynamic SEO per page
5. Build responsive navigation component first
6. Test mobile navigation thoroughly

---

**Last Updated:** January 2025
