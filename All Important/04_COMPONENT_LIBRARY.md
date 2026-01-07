# ACI WEBSITE - COMPONENT LIBRARY SPECIFICATION

## OVERVIEW

Build these reusable components FIRST, then compose pages using them. This modular approach makes the site faster to build, easier to maintain, and more consistent.

**Build order:** Foundation → Atoms → Molecules → Organisms → Pages

---

## FOUNDATION COMPONENTS

### Colors (CSS Variables)

```css
:root {
  /* Primary Colors */
  --color-brand-blue: #0066CC;
  --color-brand-blue-dark: #004D99;
  --color-brand-blue-light: #3399FF;
  
  /* Neutrals */
  --color-gray-900: #1A1A1A;
  --color-gray-800: #333333;
  --color-gray-700: #4D4D4D;
  --color-gray-600: #666666;
  --color-gray-500: #808080;
  --color-gray-400: #999999;
  --color-gray-300: #CCCCCC;
  --color-gray-200: #E5E5E5;
  --color-gray-100: #F5F5F5;
  --color-white: #FFFFFF;
  
  /* Accent Colors */
  --color-success: #28A745;
  --color-warning: #FFC107;
  --color-error: #DC3545;
  
  /* Background Colors */
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-gray-100);
  --bg-dark: var(--color-gray-900);
  
  /* Text Colors */
  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-700);
  --text-tertiary: var(--color-gray-500);
  --text-inverse: var(--color-white);
}
```

---

### Typography

```css
:root {
  /* Font Families */
  --font-primary: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

---

### Spacing Scale

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

---

### Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;  /* Circular */
}
```

---

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

---

## ATOM COMPONENTS (Smallest Building Blocks)

### Button Component

**File:** `components/ui/Button.tsx`

**Variants:**
- `primary` - Solid brand blue, white text
- `secondary` - Outlined, brand blue border
- `ghost` - Text only, no border
- `danger` - Red background for destructive actions

**Sizes:**
- `sm` - Smaller, for inline actions
- `md` - Default
- `lg` - Larger, for hero CTAs
- `xl` - Extra large, for major CTAs

**States:**
- Default
- Hover
- Active
- Disabled
- Loading (with spinner)

**Props:**
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
  href?: string;  // If link instead of button
  children: ReactNode;
}
```

**Usage:**
```tsx
<Button variant="primary" size="lg">
  Talk to an Architect
</Button>

<Button variant="secondary" rightIcon={<ArrowRight />} href="/case-studies">
  See Case Studies
</Button>
```

---

### Input Component

**File:** `components/ui/Input.tsx`

**Types:**
- text
- email
- tel
- textarea
- select

**States:**
- Default
- Focus
- Error
- Disabled

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'tel';
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
}
```

**Usage:**
```tsx
<Input
  type="email"
  label="Email Address"
  placeholder="you@company.com"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>
```

---

### Badge Component

**File:** `components/ui/Badge.tsx`

**Variants:**
- `default` - Gray
- `success` - Green
- `warning` - Yellow
- `error` - Red
- `info` - Blue

**Usage:**
```tsx
<Badge variant="success">Exclusive Partner</Badge>
<Badge variant="info">New</Badge>
```

---

### Icon Component

**File:** `components/ui/Icon.tsx`

**Use:** Lucide React icons for consistency

**Common Icons:**
- `Database` - Data services
- `Brain` - AI/ML
- `Cloud` - Cloud services
- `ShoppingCart` - MarTech
- `Cog` - Automation
- `Shield` - Security
- `ArrowRight` - CTAs
- `Check` - Checkmarks
- `X` - Close buttons

**Usage:**
```tsx
import { Database, ArrowRight } from 'lucide-react';

<Icon icon={Database} size={24} color="blue" />
```

---

## MOLECULE COMPONENTS (Combinations of Atoms)

### Card Component

**File:** `components/ui/Card.tsx`

**Variants:**
- `default` - White background, subtle border
- `hover` - Lifts on hover (for clickable cards)
- `featured` - Gradient border or special styling

**Structure:**
```tsx
<Card variant="hover" href="/case-studies/msci">
  <Card.Image src="/images/msci.jpg" alt="MSCI" />
  <Card.Header>
    <Card.Eyebrow>Financial Services</Card.Eyebrow>
    <Card.Title>MSCI: Scalable Data Automation</Card.Title>
  </Card.Header>
  <Card.Body>
    Challenge: 40+ systems to consolidate...
  </Card.Body>
  <Card.Footer>
    <Card.Stats>
      <Stat value="$12M" label="Saved" />
      <Stat value="18 mo" label="Timeline" />
    </Card.Stats>
  </Card.Footer>
</Card>
```

---

### Stat Display Component

**File:** `components/ui/StatDisplay.tsx`

**Usage:**
```tsx
<StatDisplay
  number="80+"
  label="Fortune 500 Clients"
  description="19 years of enterprise experience"
  size="large"
/>
```

---

### Form Field Component

**File:** `components/forms/FormField.tsx`

**Combines:** Label + Input + Error + Help Text

**Usage:**
```tsx
<FormField
  name="email"
  label="Email Address"
  type="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  required
/>
```

---

### Tech Stack Badge Grid

**File:** `components/ui/TechStack.tsx`

**Shows:** Technology logos with names

**Usage:**
```tsx
<TechStack
  technologies={[
    { name: 'Databricks', logo: '/images/databricks.svg' },
    { name: 'Snowflake', logo: '/images/snowflake.svg' },
    { name: 'AWS', logo: '/images/aws.svg' }
  ]}
/>
```

---

## ORGANISM COMPONENTS (Complex Combinations)

### Navigation Component

**File:** `components/layout/Navigation.tsx`

**Features:**
- Sticky header
- Mega-menu dropdowns for Services/Platforms/Industries
- Mobile hamburger menu
- CTA button
- Search (optional)

**Structure:**
```tsx
<Navigation>
  <Navigation.Logo />
  <Navigation.Menu>
    <Navigation.Dropdown label="Services">
      <Navigation.DropdownSection>
        <Navigation.Link href="/services/data-engineering">
          Data Engineering
        </Navigation.Link>
        {/* ... more links */}
      </Navigation.DropdownSection>
    </Navigation.Dropdown>
    {/* More menu items */}
  </Navigation.Menu>
  <Navigation.CTA>
    <Button>Talk to an Architect</Button>
  </Navigation.CTA>
  <Navigation.MobileToggle />
</Navigation>
```

---

### Footer Component

**File:** `components/layout/Footer.tsx`

**Structure:**
- 4-column layout (desktop)
- Stacked layout (mobile)
- Newsletter signup
- Social links
- Legal links
- Certification badges

**Usage:**
```tsx
<Footer>
  <Footer.Columns>
    <Footer.Column title="Company">
      <Footer.Link href="/about">About Us</Footer.Link>
      <Footer.Link href="/careers">Careers</Footer.Link>
    </Footer.Column>
    {/* More columns */}
  </Footer.Columns>
  <Footer.Newsletter />
  <Footer.Bottom>
    <Footer.Copyright />
    <Footer.Legal />
    <Footer.Certifications />
  </Footer.Bottom>
</Footer>
```

---

### Hero Section Component

**File:** `components/sections/HeroSection.tsx`

**Variants:**
- `centered` - Text centered, full width
- `split` - Text left, visual right
- `minimal` - Just headline + CTA

**Usage:**
```tsx
<HeroSection
  variant="centered"
  eyebrow="Engineers Who Stay"
  headline="Production-Grade Engineering at Enterprise Scale"
  subheadline="We build data platforms, AI systems..."
  cta={{
    primary: { text: 'See Case Studies', href: '/case-studies' },
    secondary: { text: 'Talk to an Architect', href: '/contact' }
  }}
  stats={[
    { number: '19', unit: 'Years', description: '...' },
    { number: '80+', unit: 'Fortune 500', description: '...' }
  ]}
/>
```

---

### Service Card Grid Component

**File:** `components/sections/ServiceGrid.tsx`

**Shows:** 6 service cards in responsive grid

**Usage:**
```tsx
<ServiceGrid
  headline="What We Build"
  subheadline="Enterprise systems that run 24/7"
  services={[
    {
      icon: <Database />,
      title: 'Data Engineering',
      description: '...',
      technologies: ['Databricks', 'Snowflake'],
      cta: { text: 'See Projects', href: '...' }
    },
    // ... more services
  ]}
/>
```

---

### Case Study Showcase Component

**File:** `components/sections/CaseStudyShowcase.tsx`

**Shows:** 3-4 featured case studies with images

**Usage:**
```tsx
<CaseStudyShowcase
  headline="Here's What We Built"
  featured={[
    {
      client: 'MSCI',
      logo: '/images/msci.svg',
      challenge: '...',
      results: [...]
    },
    // ... more
  ]}
/>
```

---

### Testimonial Carousel Component

**File:** `components/sections/TestimonialCarousel.tsx`

**Features:**
- Auto-rotate (optional)
- Manual navigation (arrows)
- Dots indicator
- Responsive

**Usage:**
```tsx
<TestimonialCarousel
  testimonials={[
    {
      quote: '...',
      author: 'Director',
      company: 'RaceTrac',
      logo: '/images/racetrac.svg'
    },
    // ... more
  ]}
/>
```

---

### CTA Section Component

**File:** `components/sections/CTASection.tsx`

**Variants:**
- `centered` - Text and buttons centered
- `split` - Text left, form/visual right
- `banner` - Full-width banner style

**Usage:**
```tsx
<CTASection
  variant="centered"
  headline="Ready to Build Something That Lasts?"
  subheadline="Talk to an architect..."
  cta={{
    primary: { text: 'Schedule Call', href: '/contact' },
    secondary: { text: 'See Case Studies', href: '/case-studies' }
  }}
  trustSignals={[
    'Talk to senior architects, not sales reps',
    'No sales pitch, just engineering conversation'
  ]}
/>
```

---

### Contact Form Component

**File:** `components/forms/ContactForm.tsx`

**Fields:**
- Name (required)
- Email (required)
- Company (required)
- Role (required)
- Inquiry Type (dropdown)
- Message (textarea, required)

**Features:**
- Client-side validation (Zod)
- Server-side submission
- Success/error states
- Loading states

**Usage:**
```tsx
<ContactForm
  onSuccess={() => router.push('/thank-you/contact')}
  inquiryTypes={[
    'General Inquiry',
    'Data Engineering',
    'AI & ML',
    'Cloud Migration',
    'Other'
  ]}
/>
```

---

### Newsletter Form Component

**File:** `components/forms/NewsletterForm.tsx`

**Simple:** Email only

**Usage:**
```tsx
<NewsletterForm
  source="footer"
  onSuccess={() => showToast('Subscribed!')}
/>
```

---

### Partner Logo Grid Component

**File:** `components/sections/PartnerLogos.tsx`

**Shows:** Technology partner logos in grid

**Usage:**
```tsx
<PartnerLogos
  headline="Built on Enterprise-Grade Platforms"
  partners={[
    { name: 'Databricks', logo: '...', badge: 'Exclusive Partner' },
    { name: 'AWS', logo: '...', badge: null },
    // ... more
  ]}
/>
```

---

### Blog Card Grid Component

**File:** `components/blog/BlogCardGrid.tsx`

**Shows:** Blog post cards in grid

**Usage:**
```tsx
<BlogCardGrid
  posts={[
    {
      title: '...',
      excerpt: '...',
      author: '...',
      date: '...',
      category: '...',
      featuredImage: '...',
      slug: '...'
    },
    // ... more
  ]}
/>
```

---

## PAGE TEMPLATE COMPONENTS

### Service Page Template

**File:** `components/templates/ServicePageTemplate.tsx`

**Sections:**
- Hero
- Service offerings (4-6 offerings)
- Tech stack
- Case studies
- Why choose ACI
- FAQ
- CTA

**Usage:**
```tsx
<ServicePageTemplate
  service={{
    name: 'Data Engineering',
    tagline: '...',
    offerings: [...],
    technologies: [...],
    caseStudies: [...],
    faqs: [...]
  }}
/>
```

---

### Platform Page Template

**File:** `components/templates/PlatformPageTemplate.tsx`

**Similar to service template but platform-specific**

---

### Industry Page Template

**File:** `components/templates/IndustryPageTemplate.tsx`

**Sections:**
- Hero
- Industry challenges
- Our expertise
- Case studies
- Tech stack
- CTA

---

### Case Study Detail Template

**File:** `components/templates/CaseStudyTemplate.tsx`

**Sections:**
- Hero (client logo, industry)
- Challenge
- Solution
- Results (big metrics)
- Technologies used
- Testimonial (if available)
- Related case studies
- CTA

---

### Blog Post Template

**File:** `components/templates/BlogPostTemplate.tsx`

**Features:**
- Featured image
- Author info
- Publish date
- Reading time
- Category tags
- Share buttons
- Related posts

---

## CHAT AGENT COMPONENTS

### Chat Widget Button Component

**File:** `components/chat/ChatWidgetButton.tsx`

**Floating button in bottom-right**

---

### Chat Window Component

**File:** `components/chat/ChatWindow.tsx`

**Full chat interface:**
- Header
- Messages list
- Input field
- Suggested actions

---

### Message Component

**File:** `components/chat/Message.tsx`

**Variants:**
- Assistant message (left, gray)
- User message (right, blue)
- System message (centered, small)

---

### Suggested Action Buttons Component

**File:** `components/chat/SuggestedActions.tsx`

**Shows action buttons below assistant messages**

---

## ANIMATION COMPONENTS

### Page Transition Component

**File:** `components/animations/PageTransition.tsx`

**Wraps pages for smooth transitions**

**Usage:**
```tsx
<PageTransition>
  {children}
</PageTransition>
```

---

### Fade In On Scroll Component

**File:** `components/animations/FadeInOnScroll.tsx`

**Reveals content as user scrolls**

**Usage:**
```tsx
<FadeInOnScroll>
  <ServiceCard />
</FadeInOnScroll>
```

---

### Count Up Animation Component

**File:** `components/animations/CountUp.tsx`

**Animates numbers counting up**

**Usage:**
```tsx
<CountUp
  end={80}
  suffix="+"
  duration={2000}
/>
```

---

## ADMIN COMPONENTS

### Data Table Component

**File:** `components/admin/DataTable.tsx`

**Features:**
- Sortable columns
- Filterable
- Pagination
- Row actions (edit, delete)
- CSV export

---

### Content Editor Component

**File:** `components/admin/ContentEditor.tsx`

**Rich text editor for blog posts, case studies**

---

### File Upload Component

**File:** `components/admin/FileUpload.tsx`

**Drag-and-drop file upload to Supabase storage**

---

## UTILITY COMPONENTS

### Loading Spinner Component

**File:** `components/ui/LoadingSpinner.tsx`

---

### Toast Notification Component

**File:** `components/ui/Toast.tsx`

**For success/error messages**

---

### Modal/Dialog Component

**File:** `components/ui/Modal.tsx`

**For confirmations, forms in overlay**

---

### Breadcrumbs Component

**File:** `components/ui/Breadcrumbs.tsx`

---

### SEO Component

**File:** `components/seo/SEO.tsx`

**Sets meta tags per page**

**Usage:**
```tsx
<SEO
  title="Data Engineering Services | ACI Infotech"
  description="..."
  canonical="/services/data-engineering"
  openGraph={{
    image: '/images/og-data-engineering.jpg'
  }}
/>
```

---

## BUILD SEQUENCE FOR CLAUDE CODE

**Phase 1: Foundation (Day 1)**
1. Set up CSS variables (colors, typography, spacing)
2. Create basic layout (container, grid, flex utilities)
3. Build atoms (Button, Input, Badge, Icon)

**Phase 2: Molecules (Day 1-2)**
4. Build molecules (Card, StatDisplay, FormField, TechStack)
5. Build forms (ContactForm, NewsletterForm)

**Phase 3: Organisms (Day 2-3)**
6. Build Navigation
7. Build Footer
8. Build Hero sections
9. Build service/case study grids
10. Build testimonial carousel

**Phase 4: Templates (Day 3-4)**
11. Build page templates (Service, Platform, Industry)
12. Build content detail templates (Case Study, Blog Post)

**Phase 5: Compose Pages (Day 4-6)**
13. Build Homepage (using components)
14. Build About page
15. Build service pages
16. Build platform/industry pages

**Phase 6: Chat & Admin (Day 6-7)**
17. Build chat components
18. Build admin components
19. Integrate everything

---

**Notes for Claude Code:**

- **Reuse, don't repeat:** If you're writing similar code twice, make it a component
- **Props over variants:** Make components flexible with props
- **Composition over configuration:** Small, composable components > big configurable ones
- **Accessibility first:** Every component should be keyboard navigable
- **TypeScript:** Strong typing prevents bugs
- **Storybook (optional):** Document components for future developers

---

**Last Updated:** January 2025
**Status:** Component Library Specification Complete
