# ACI Infotech Site Audit: SEO, AEO, GEO

**Date:** 2026-07-17
**Scope:** the full Next.js app (`aci-infotech/`) as of the current branch (v4 homepage promoted to production, SEO week-1 and week-2 commits included), the original v4 homepage source on `agent/homepage-v4-source-for-v5`, the planning docs in `All Important/`, and the prior `docs/blog-quality-audit.md`. Careers detail pages, `/admin`, and `/api` are out of scope as before.
**Method:** five parallel deep-read audits (technical foundation, homepage, 11 service pages, 21 platform/industry pages plus the LP system, and the dynamic content systems plus foundation pages), cross-checked against the external audit supplied on 2026-07-17 and the blog quality audit of 2026-07-01. Live-site crawling was not possible from this environment, so anything that requires production verification (Search Console, actual indexation, descriptor coverage in the CMS) is marked as such.
**Grading scale:** weak (a liability, drags rankings), adequate (present but not competitive), good (competitive top-20 material), great (top-3, citation-worthy).

---

## 1. Executive summary

The technical SEO foundation of this site is genuinely strong, stronger than most enterprise consulting sites: locked canonical architecture, a four-layer staging de-index gate, disciplined sitemap, correct pagination, a connected JSON-LD entity graph, and a real `llms.txt`. The two July commits (8eee18e, 7ec07d4) fixed most of the plumbing that usually holds sites back.

What holds this site back now is the **content layer and a handful of specific defects**:

1. **Proof is broken by a bug.** Every case-study card on seven service pages renders the generic label "Enterprise Client" because `displayClient()` reads `client_descriptor` and the inline study objects only define `client`. The site's strongest E-E-A-T material displays as filler.
2. **Social cards are broken on exactly the money pages.** All 11 service pages, all 10 platform pages, 4 industry pages, LPs, and playbook details set per-page `openGraph` without `images`, which in Next.js replaces the inherited default: those pages emit **no `og:image` at all**. A second group (hubs, about, contact, legal, case-study details) emits the homepage's card with the homepage URL.
3. **Headlines do not target queries.** 10 of 11 service H1s, all 10 platform H1s, and every homepage heading are brand-poetic slogans with no head keyword. The keyword lives in the title tag and eyebrow text; the strongest on-page element carries none of it.
4. **Half the site is missing its AEO layer.** 7 platform pages and 4 industry pages have no FAQ, no FAQPage schema, no related-links band. The site already owns excellent FAQ components; they are wired to only half the pages.
5. **The site contradicts itself on facts.** Snowflake "Select Partner" vs "Elite Partner", ServiceNow "partner" vs "Elite Partner", Azure "Solutions" vs "Gold", manufacturing downtime 67% vs 28%, transportation $30M vs $250K, healthcare uptime 99.99% vs 99.7%, ArqAI "independent partner" (messaging spine) vs "our forward-deployed practice" (homepage, FAQ, llms.txt). Generative engines will surface these conflicts verbatim.
6. **The blog corpus needs its planned remediation.** 348 of 390 posts missing `seo_description`, 6 empty posts, 4 duplicate pairs, 24 posts with embedded HubSpot junk. The in-repo `content-generate` pipeline can produce the fix at scale.
7. **One security defect found during the audit** (not SEO, but urgent): DataForSEO credentials are hardcoded as fallback values in `src/app/api/admin/seo/route.ts:5-6`. Rotate the credential, switch to env-only, and scrub history.

### Scorecard

| Area | SEO | AEO | GEO | Ceiling blocker |
|---|---|---|---|---|
| Technical foundation | great | good | good | OG-image bug, GTM duplicate Org schema |
| Homepage | adequate | good | adequate | poetic headings, buried answer, client-only hero slides |
| Services (11) | good | good | good | H1s, client-descriptor bug, 8 pages missing link bands |
| Platforms (10) | adequate | adequate | adequate | two-tier split: 7 pages bare, tier contradictions |
| Industries (8) | good | adequate | good | 4 pages bare, metric conflicts, no "consulting" coverage |
| Landing pages (15 promoted) | good | great | good | roadmap LP has homepage title; Dynamics 3-way overlap |
| Blog system | good | good | good | 348 missing descriptions, no TOC, no remark-gfm |
| Case studies | adequate | adequate | adequate | anonymization tension, metrics not in schema |
| Whitepapers / playbooks | good | good | adequate | playbooks listing metadata, thank-you noindex |
| Foundation pages | adequate | weak | adequate | contact renders email only, about lacks Person schema |

---

## 2. What is already excellent (verified, do not redo)

- **Canonical architecture** (`src/lib/site-url.ts`): every canonical, OG URL, and JSON-LD `@id` resolves to the production apex; a staging build cannot self-canonicalize. Client-component pages push canonicals through pass-through layouts. `/contact` and `/blogs` fold query params into clean canonicals.
- **Staging de-index gate**, four layers: robots disallow-all off production, `X-Robots-Tag: noindex` header off production, nginx layer documented, prebuild env guard.
- **Sitemap discipline:** no fabricated `lastModified` on static routes, real dates on CMS content, deliberate exclusion of noindexed job pages, thank-you pages, `/v1`, previews, external news items. Verified: all 15 promoted LP slugs exist in `LP_CONTENT`; playbook keys match sitemap and llms.txt exactly.
- **Pagination:** page 1 canonicalizes to `/blogs`, deeper pages self-canonical and indexable, out-of-range returns a real 404.
- **JSON-LD graph:** Organization (address, phone, sameAs, foundingDate 2006, 1200 employees, knowsAbout) linked to WebSite, WebPage, OfferCatalog (8 services), FAQPage. FAQ schema and visible FAQ render from the same source, so they cannot drift.
- **`llms.txt`:** entity statement (HQ, divisions, 500+ deployments), summarized canonical page lists, live top-20 blogs/case studies/whitepapers, hourly revalidation. Ahead of nearly every competitor.
- **LP system:** 47 LPs, 15 promoted with one slug per commercial intent, siblings noindexed to avoid doorway patterns, server-rendered base copy, per-LP FAQPage schema, real 404s.
- **Performance posture:** 436 KB lazy hero video with `preload="none"`, self-hosted swap fonts, AVIF/WebP pipeline, three.js and lenis quarantined off public routes, immutable static caching, full security-header suite, Consent Mode v2 denied-default.
- **Redirect hygiene:** www to apex 301 in middleware, legacy `/blog` paths, renamed service, 8 anonymized case-study slugs all 301.
- **Editorial tooling:** the admin `content-generate` route already produces AEO-shaped copy (40-60 word answer paragraphs, question headings, FAQ JSON, forced internal links) with a 4-model fallback chain, and the copilot's content-gaps report mines real user questions with low retrieval scores. This is the machinery the content plan below runs on.

## 3. Reconciliation with the external audit (supplied 2026-07-17)

That audit sampled the **legacy static HTML template files at the repo root** (`index.html`, `about-us.html`, "itodo Template" titles) and the raw Vite experiment in `_incoming/`. Neither is the deployed product, so its Phase-1 findings (no canonicals, no schema, no sitemap, template metadata) are already solved in the Next.js app and should not be re-executed. Its content-layer recommendations remain valid and are folded into the plan below: answer-first modules, decision-grade service pages, industry regulation depth, blog E-E-A-T, glossary/entity hub, reduced-motion and accessibility checks. Its page inventory is stale (6 services vs the actual 11; Mulesoft/Adobe/Education/Automotive/Public-Sector pages do not exist; Databricks/Snowflake/ServiceNow pages exist and need upgrading, not launching).

**Housekeeping recommendation:** archive or delete the legacy HTML template files at the repo root. They already misled one audit and serve no runtime purpose.

---

## 4. Defects to fix immediately (bugs, not content)

| # | Defect | Where | Why it matters |
|---|---|---|---|
| 0 | **DataForSEO credentials hardcoded** | `src/app/api/admin/seo/route.ts:5-6` | Live secret in git. Rotate at DataForSEO, remove the fallback literals, rely on env vars, scrub history. |
| 1 | **`displayClient()` renders "Enterprise Client" everywhere** | `src/lib/content/anonymize.ts` + inline `client:` fields on 7 service pages | All service-page proof displays as filler. Add `client_descriptor` to the inline study objects (or extend the helper to fall back to `client`). |
| 2 | **Per-page OG without images kills `og:image`** | ~27 pages: all `services/*`, all `platforms/*`, 4 industries, `lp/[slug]`, `playbooks/[slug]` | Next.js replaces, not merges, the `openGraph` key. Add a shared metadata helper that always injects `images`, or add `opengraph-image.tsx`. Several also declare `twitter: summary_large_image` with no image. |
| 3 | **Homepage OG card on the wrong pages** | about, hubs, partners, news, contact, careers, legal, 4 industries, `case-studies/[slug]` | These pages set no `openGraph`, so shares emit the homepage title/URL. Case-study detail is the worst offender (it has per-page canonical but no OG). |
| 4 | **Duplicate Organization JSON-LD from GTM** | GTM container (see `docs/gtm-audit.md` P1.4) | A second `Corporation` entity conflicts with the server-side graph. Delete the GTM tag. |
| 5 | **Thank-you pages indexable** | `lp/thank-you`, `playbooks/thank-you` (no robots directive) | Thin utility pages. Add layouts with `robots: {index:false, follow:false}` (whitepapers already does this). |
| 6 | **Legal pages missing canonicals** | `privacy-policy/page.tsx`, `terms-of-service/page.tsx` | In sitemap without self-canonical. Two-line fix each. |
| 7 | **Roadmap LP has the homepage title** | `lp/microsoft-dynamics-roadmap/layout.tsx` (canonical only, no title/description/robots) | An indexable, sitemapped page whose title tag is the site default. Either give it real metadata and a distinct long-tail target, or noindex it as a paid-only asset. |
| 8 | **Manifest icons missing** | `manifest.ts` references `/icon-192.png`, `/icon-512.png`; neither exists | Broken PWA install icons. |
| 9 | **Blog markdown gaps** | `ArticleBody.tsx` | No `remark-gfm` (tables silently drop), body `#` maps to a second H1, HubSpot HTML path is unsanitized. Map `#` to h2, add gfm, sanitize. |
| 10 | **services.ts / platforms.ts / industries.ts are stale decoys** | `src/data/*` | Pages do not read them; the copilot RAG does. Their numbers have drifted from the rendered pages, so the copilot can quote different figures than the site. Either make pages consume them (preferred, single source of truth) or sync and label them. |

---

## 5. Per-area findings

### 5.1 Homepage (SEO adequate, AEO good, GEO adequate)

Metadata: title 69 chars (truncates), description 241 chars (truncates badly; the layout default is also over at 191). Canonical, robots, OG/Twitter all correct.

Headings: exactly one H1, which is right, but it is "Build the AI foundation. Run it in production." and every H2 is poetic ("Field notes from the work", "Answers before the first call", "Your best data is sitting in the dark"). **No heading on the homepage contains the brand name, a service term, or an industry term.**

Answer-first: the best 45-word definitional answer on the site ("ACI Infotech is an enterprise engineering firm. We build the data foundation, put AI on top of it, and run both in production...") exists **only in the FAQ at the bottom of the page**. The brand name never appears in above-the-fold prose. The top of the page runs on two metaphors (signal sphere, underwater data).

Crawlability: hero slides 2-4 and success stories 2-4 are client-only. Roughly six headline messages and their stats (87%, 40-60%, 90d, 99.97%, 67%) are invisible to crawlers and no-JS extraction, which violates the storyboard's own "View Source must show them" rule.

Internal links in initial HTML: 6 of 11 services, 3 of 10 platforms, **zero industry links** (hub or detail), no `/platforms` or `/industries` hub links. Case studies and playbooks are well linked with descriptive anchors.

Entity and proof: location, employee count, founding year, and certifications exist only in JSON-LD and llms.txt, not in visible copy. The messaging spine's proof bar ($1B+ value, 95% retention, 20 years, SOC 2, ISO 27001, CMMI) is entirely absent; only "500+ enterprise deployments" renders. The v4 integration also dropped the source experiment's 30-logo client wall (correctly, per the anonymization rule) without replacing the lost trust signal with a compliant equivalent.

ArqAI contradiction: the messaging spine says ArqAI is an independent partner and forbids "our platform" framing; the homepage hero, FAQ, and llms.txt all present ArqAI Labs as ACI's own forward-deployed practice. One of these is wrong; pick and align everywhere.

### 5.2 Services (11 detail pages + hub)

Two generations of copy exist. Gen-2 pages (quality-engineering, advisory-strategy, gcc, managed-operations) are concrete, human, and differentiated: the QA-vs-QE comparison table, the 48-hour strategy memo and "we disagree about 20% of the time" honesty, the 40-engineer floor / 200-engineer ceiling captive heuristic, the P1-in-15-minutes SLA table. Gen-1 pages (data-engineering, applied-ai-ml, cloud-modernization, martech-cdp, digital-transformation, cyber-security, app-development as hybrid) share verbatim boilerplate blocks ("Beyond Delivery... We run what we build.", "Why Choose ACI for X... What makes us different", "Real projects. Real Fortune 500 clients. Real outcomes.") and hollow amplifiers the repo's own voice rules ban.

Systemic issues: 10 of 11 H1s omit the head keyword; RelatedLinks renders on only 3 pages (martech-cdp and digital-transformation have zero contextual internal links); 6 meta descriptions exceed 160 chars (gcc 200, quality-engineering 194, data-engineering 189, advisory 189, app-development 183 with a banned em-dash, cloud-modernization 161); ServiceSchema's offer catalog contains one self-referential offer instead of the six offerings; the hub has no ItemList/CollectionPage schema and under-links managed-operations.

Standouts, weak points, thin pages:

| Page | SEO/AEO/GEO | Words | Note |
|---|---|---|---|
| data-engineering | good/great/good | ~1,800 eff. | Best answer-first depth; H1 misses keyword |
| applied-ai-ml | good/good/good | ~1,400 eff. | ArqAI is the strongest citable differentiator; no process section |
| cloud-modernization | good/great/good | ~1,800 eff. | 6R framework buried in FAQ; surface it on-page |
| martech-cdp | adequate/adequate/weak | ~815 | Zero internal links; needs CDP comparison table |
| digital-transformation | weak/adequate/weak | ~620 | Thinnest page; "digital transformation" never appears in body or any H2 |
| cyber-security | adequate/good/adequate | ~915 | SOC section duplicates managed-operations; "multiple compliance certifications" unnamed |
| app-development | good/good/good | ~1,450 | Best scoping copy; only one case study |
| quality-engineering | good/great/good | ~1,795 | Richest page; zero client proof |
| advisory-strategy | adequate/great/good | ~1,180 | Best FAQ set on the site; links to no delivery page |
| gcc | adequate/great/good | ~780 | Great decision heuristics; 200-char description |
| managed-operations | good/great/good | ~1,007 | "Managed IT services" exists only as contact links, no indexable body |

Offering-level cannibalization: application/legacy modernization contested by cloud-modernization, app-development, digital-transformation; NOC/SOC contested by managed-operations, cyber-security, cloud-modernization; document AI contested by digital-transformation and applied-ai-ml; API/integration contested by app-development and digital-transformation. Metadata-level targeting is clean; the fix is canonical ownership plus teaser-and-link on the non-owners.

### 5.3 Platforms (10 detail pages + hub)

The defining fact: a **two-tier split**. Databricks, Snowflake, ServiceNow have FAQs with schema, related-links bands, cluster posts, and ~700 words with real named-capability depth (Unity Catalog, MLflow, Photon, Snowpark, resource monitors, CMDB governance). The other seven (aws, azure, braze, gcp, microsoft-dynamics, salesforce, sap) are ~380-420 word islands: no FAQ, no schema beyond global, no related links, and a verbatim hero skeleton ("As a {Partner}, we help... From {X} to {Y}, we maximize/unlock...") that violates the voice rules and reads as boilerplate to answer engines.

Named-entity gaps on the bare pages: Azure page lacks Fabric and landing zones (the hub mentions Fabric); Salesforce page lacks Agentforce (the hub lists it). GCP has the best hero copy of the set and an awkward H1 ("Google Cloud Platform Cloud Solutions").

Keyword layering: "{platform} consulting" appears in zero platform titles/H1s. That head term deliberately lives on the promoted LPs (snowflake-consulting, databricks-services, etc.), which is a defensible architecture, but Azure and GCP have no consulting-intent coverage at either layer.

Fact contradictions to resolve before any LLM cites them: Snowflake Select vs Elite; ServiceNow partner vs Elite; Azure Solutions vs Gold; Braze Alloy vs Alloys; Databricks "consulting partner" vs "exclusive partner".

### 5.4 Industries (8 detail pages + hub)

Same two-tier split: financial-services, manufacturing, retail, oil-gas are enhanced (5 FAQs with schema, related links); healthcare, energy, hospitality, transportation are bare. The painful case is **healthcare**: it has the best compliance band on the site (HIPAA, HITRUST, SOC 2 Type II, FDA 21 CFR Part 11, GDPR, GxP) and no FAQ or schema wrapping it. Oil-gas is the in-repo model for the whole site: answer-first hero ("Data, AI, and cloud for operators who run on decades of data trapped in systems that were never meant to talk"), value-chain structure, named systems (SCADA, PI historians), though it lacks a case-study band.

Metric conflicts between hub and detail pages: manufacturing 67% vs 28% downtime reduction; transportation $30M vs $250K fuel savings; healthcare 99.99% vs 99.7% uptime.

Keyword gap: no page on the site targets "{industry} technology consulting"; all eight target "{Industry} Technology Solutions". Titles over 60 chars: hospitality 63, healthcare 62, transportation 62.

### 5.5 Landing pages

The 15 promoted LPs are the site's best pure-AEO assets: server-rendered, 4 FAQs each with schema, proof cards with metrics, certification badges, ~750-780 words. Weaknesses: H1s are benefit slogans ("Maximize Your Snowflake Investment") with the keyword only in the title tag; two titles over 70 chars (databricks-services, dynamics-365-implementation).

Cannibalization to resolve: the **Microsoft Dynamics three-way** (platform page, dynamics-365-implementation LP, and the roadmap LP with its default homepage title). Assign: platform page = "Microsoft Dynamics consulting" (informational), LP = "Dynamics 365 implementation services" (transactional), roadmap = noindex or a distinct long-tail ("Dynamics 365 90-day roadmap workshop"). The cloud-migration stack (aws/azure/gcp pages + service pillar + cloud-migration-services LP) needs the same discipline: platform pages stay vendor-specific, the generic head term belongs to the pillar and LP. The Snowflake/Databricks platform-vs-LP pairing is already healthy and is the model.

### 5.6 Blogs

The rendering system is good: metadata fallback chain, BlogPosting + Breadcrumb + conditional FAQPage schema, author bio boxes with LinkedIn, guaranteed 3+ server-rendered related posts, clean pagination. Gaps: no Twitter card block or `og:modified_time` on posts, author schema is a bare name (no `url`/`sameAs`/`jobTitle`), no table of contents or heading anchors, reading time falls back to a hardcoded "5 min", and the markdown pipeline drops GFM tables and can produce a second H1.

The corpus (from the 2026-07-01 blog audit, requires live CMS to execute): 348 of 390 posts missing `seo_description`; 6 empty posts (5 convertible to case studies, 1 unpublish); 4 duplicate pairs to port-and-301; 24 posts with HubSpot markup junk; a 37-post dated cohort split keep/enrich/refresh/redirect. 256 posts are healthy keepers. Execute this before writing net-new posts.

### 5.7 Case studies, whitepapers, playbooks, news

Case studies: the schema fields for great proof all exist in the database (metrics JSONB, testimonials, meta fields, even a `schema_markup` column). The page emits Article + Breadcrumb but never emits metrics as structured data, never uses Review/AggregateRating despite having testimonial fields, and never reads `schema_markup`. Anonymization is policy and stays, but it caps proof: compensate with specific descriptors (avoid interchangeable "Fortune 500 X Client"), metrics-rich schema, and named-role testimonials where permitted. Case-study detail pages also need per-page OG (currently share the homepage card).

Whitepapers: strong. Ungated server-rendered abstract, Report + Breadcrumb schema, correct thank-you noindex. Add the author E-E-A-T the database already stores, and guard against null `published_at`.

Playbooks: content and schema are good; the listing layout has a canonical but no title/description (inherits the site default), and the thank-you page is indexable.

News: metadata fine, but every item links externally, so the page owns no rankable content and passes equity outward. Decision for the team: keep as a trust page, or add owned `/news/[id]` articles with NewsArticle schema. Also review the service-role Supabase key used on this public page.

### 5.8 Foundation pages

About: good depth (~1,300 words), real E-E-A-T facts (founded 2006, 1,200+ experts, 500+ projects, 11 hubs, CEO and CRO bios with LinkedIn, ISO 27001:2022, CMMi L3, Great Place to Work), but only Breadcrumb schema; no AboutPage/Person schema for the executives, and a seven-person leadership grid is hidden behind a `{false && ...}` block.

Contact: the weakest foundation page. Visible content is an email address; the phone number and the street address (1100 Cornwall Road, Suite 215, Monmouth Junction, NJ 08852) exist only in the global Organization schema. No ContactPage/ContactPoint/LocalBusiness schema on the page; the LocalBusinessSchema component exists, unused, with dead image references. For a firm selling to enterprises, a contact page with no phone or address in visible text is a trust and NAP-consistency failure.

Partners: honest and well linked; could add `hasCredential`/partnership schema.

---

## 6. Cross-site issues

### 6.1 Keyword ownership map (updated for the LP layer)

| Query intent | Owner | Support (links in) | Action |
|---|---|---|---|
| enterprise data & AI (brand umbrella) | `/` | all | Add entity subhead + visible proof bar |
| data engineering services/consulting | `/services/data-engineering` | databricks, snowflake, blogs, `/lp/data-engineering-services` | H1 keyword; trim description |
| AI/ML consulting, GenAI implementation | `/services/applied-ai-ml` | `/lp/generative-ai-consulting`, `/lp/ai-ml-implementation`, `/lp/agentic-ai-development` | H1; add process section; ensure LPs cross-link |
| cloud modernization/migration services | `/services/cloud-modernization` + `/lp/cloud-migration-services` | aws/azure/gcp pages (vendor-specific only) | De-genericize platform pages; add GCP to the related cluster |
| {platform} implementation | `/platforms/{x}` | matching service + LP | Bare-tier parity upgrades |
| {platform} consulting | promoted LP layer | platform page cross-link | Azure + GCP consulting coverage missing entirely; add LPs or extend pages |
| Dynamics 365 implementation | `/lp/dynamics-365-implementation` | `/platforms/microsoft-dynamics` (informational) | Fix roadmap LP (noindex or long-tail) |
| managed IT / NOC / SOC | `/services/managed-operations` | cyber (teaser), cloud-mod (teaser) | Consolidate head term; give "managed IT services" an indexable body section |
| {industry} technology solutions | `/industries/{x}` | services, platforms, case studies | Bare-tier parity; fix metric conflicts |
| {industry} technology consulting | **nobody** | | Decide whether to target (H2/body addition is enough to start) |
| thought leadership | `/blogs` + clusters | pillars | Execute corpus remediation first |

### 6.2 Fact-consistency ledger (fix once, everywhere)

Partner tiers (Snowflake, ServiceNow, Azure, Braze, Databricks), the four conflicting metrics (manufacturing, transportation, healthcare, plus index-vs-detail Databricks figures), the number ladder (40+ platforms / 50+ AI models / 200+ migrations / 500+ deployments / 500+ projects and the spine's 250/280+), the ArqAI relationship, and unverifiable absolutes ("Zero production failures in last 3 years", "300% average ROI", "5,000+ technology leaders"). Recommendation: create one `src/content/facts.ts` (or a CMS table) as the single source for tiers, counts, certifications, SLAs; render everywhere from it; delete numbers that cannot be sourced.

### 6.3 Template repetition

Verbatim skeletons on 8 of 10 platform heroes, 7 of 8 industry heroes, identical H2 sets, and a capability card repeated on six pages. Gen-1 service boilerplate blocks repeat on six pages. Answer engines compress duplicated phrasing into "boilerplate"; humans read it as filler. The oil-gas page and the Gen-2 service pages prove the team can write the alternative.

---

## 7. The benchmark: definition of done per page

A commercial page is done when it has: one primary query it owns (recorded in the keyword map); title ≤60 chars and description ≤158; an H1 containing the head term; a 40-60 word answer directly under the H1; body depth matched to intent (pillars 1,200-2,000 words, platforms/industries 700-1,000 with named products/regulations/KPIs); at least 5 query-shaped FAQs rendered and in schema; one decision artifact (comparison table, process steps, or heuristic); proof with numbers that reconcile with the facts ledger; a related-links band in and out; correct OG card; page-type schema (Service with enumerated offers, or FAQ/Breadcrumb minimum); all copy passing the voice rules; and everything visible in server HTML.

---

## 8. Rewrite and remediation plan (what, where, why)

### Phase 0, immediate (bugs; ~1 day of work)
Items in section 4, in order: credentials rotation, `displayClient` fix, shared OG-image helper across the 27 broken pages plus per-page OG for the inheritance group (case-study detail first), GTM Org-schema tag removal, thank-you noindexes, legal canonicals, roadmap-LP metadata decision, manifest icons, blog markdown fixes. None of these are editorial; all are high-leverage.

### Phase 1, metadata and answer layer (week 1)
1. **H1 rewrites, 21 pages.** All 11 services, all 10 platforms. Pattern: keep the brand line as a kicker/eyebrow, put the query in the H1. Example: "Two centers. One escalation path." becomes the support line under an H1 "Managed IT Operations: 24/7 NOC and SOC". Why: the strongest on-page relevance signal currently carries none of the target query, and this fix needs no new content.
2. **Title/description trims:** homepage title to ~55 chars and description to ~150; layout default description to ≤160; the six long service descriptions; three long industry titles; two long LP titles. Why: every truncated description is a rewritten SERP snippet you did not choose.
3. **Homepage answer block:** add one server-rendered sentence naming the entity and category under the H1, and lift the FAQ's 45-word definition to a visible intro near the hero. Add a visible proof bar (500+ systems, founded 2006, 1,200+ engineers, 11 hubs, ISO 27001, CMMI L3, Great Place to Work; add $1B+/95% only if the team can stand behind them). Why: the page's best GEO copy is currently at the bottom, and its scale facts are schema-only.
4. **SSR the hidden homepage content:** hero slides 2-4 and success stories 2-4 into initial HTML (render-all-then-animate or visually-hidden list). Why: six messages and five stats are invisible to crawlers today.
5. **Homepage/footer link coverage:** add an industries block (or footer column), `/platforms` and `/industries` hub links, the 5 unlinked service pages, the 7 unlinked platform pages. Why: industry pages currently receive zero crawlable homepage equity.

### Phase 2, parity upgrades (weeks 2-3)
1. **Wire the AEO layer to the 11 bare pages:** FaqBlock + RelatedLinks for aws, azure, braze, gcp, microsoft-dynamics, salesforce, sap, energy, healthcare, hospitality, transportation. Healthcare and energy first (their compliance content is the best raw material). Write 5 FAQs each in the established voice (the Databricks/oil-gas sets are the model). Why: this is the difference between the enhanced tier that can win featured snippets and the bare tier that cannot.
2. **RelatedLinks on the 8 service pages missing it** (extend `related-links.ts`; advisory links to the delivery services it feeds; managed-operations links back to cyber and cloud). Why: the topical cluster is half-wired; links flow in but not out.
3. **Schema enrichment:** enumerate the six offerings in each ServiceSchema offer catalog; ItemList on the three hubs; ContactPage + LocalBusiness (fixed assets) on `/contact` with visible phone and address; AboutPage + Person (CEO, CRO) on `/about` and unhide or delete the leadership grid; metrics + Review/AggregateRating on case-study detail. Why: rich-result eligibility is currently inconsistent across siblings, and contact/about are the entity anchors generative engines check.
4. **Facts ledger:** create it, reconcile the tier/metric/number conflicts, decide the ArqAI framing, propagate. Why: self-contradiction is the fastest way to lose machine trust.

### Phase 3, content rewrites (weeks 3-6)
1. **digital-transformation** (thinnest, weakest): decide the head term (own "intelligent process automation" or actually say "digital transformation" in the body), add process section, ROI methodology instead of "300% ROI", internal links, 2-3 more FAQs. 
2. **martech-cdp:** add the Salesforce Data Cloud vs Adobe RT-CDP vs Segment comparison table, a "what is a CDP" answer block, related links, 5-6 FAQs.
3. **Bare-tier platform rewrites** to the Databricks standard, adding the missing flagship entities (Azure: Fabric, landing zones; Salesforce: Agentforce, Data Cloud depth) and replacing the shared hero skeleton with page-specific answer-first openers (GCP's is the model).
4. **Industry enrichment:** named regulations and KPIs on the four bare pages (healthcare: HEDIS, readmission; transportation: OTIF; hospitality: RevPAR, named PMS/POS; energy: FERC, DERMS), a case-study band for oil-gas, and reconciled metrics.
5. **Gen-1 service boilerplate replacement:** rewrite the repeated "Beyond Delivery"/"Why Choose ACI" blocks per-page with concrete, differentiated content in the Gen-2 register; kill the banned amplifiers sitewide (the voice-rules script can gate marketing copy surfaces in CI).
6. **Contact page rewrite:** visible phone, address, response expectations, routing (sales/partnership/careers/press), short FAQ.

### Phase 4, corpus and resources (weeks 4-8, needs CMS access)
1. Execute the blog audit: 348 `seo_description` backfills through the existing `content-generate` pipeline with human review; 6 empty posts (5 case-study conversions, 1 unpublish); 4 duplicate 301s; 24 HubSpot cleanups; the 37-post dated-cohort actions; fix the one wrong-topic excerpt.
2. Blog template: TOC with heading anchors, author Person schema with `sameAs`, Twitter card block, computed reading time.
3. Whitepaper author E-E-A-T; playbook listing metadata; per-item OG for case studies.
4. Add a glossary/definitions hub (lakehouse, agentic AI, CDP, data governance, GCC, zero trust...) with DefinedTerm schema, each entry linking to its pillar. Why: definitional queries are the cheapest AI-citation surface, and the FAQ voice already fits.
5. llms.txt: add the 15 promoted LPs with one-line notes, add summaries to dynamic entries, generate the playbook list from `playbooksData` instead of hand-syncing.

### Phase 5, measurement (ongoing from week 1)
1. Baseline GSC export before Phase 1 ships (queries, impressions, position, CTR per page); re-export at each phase boundary and attribute movement per phase.
2. Track: indexed pages (should drop as corpus is pruned), rich-result eligibility in GSC enhancements, CTR on the 27 pages that get real OG cards, top-10 keyword count for the mapped targets, organic form fills by landing page.
3. AI visibility: monthly spot-checks of brand and category queries in AI Overviews, Perplexity, ChatGPT, Gemini; log citations of aciinfotech.com. The llms.txt access logs (if surfaced) tell you which engines read it.
4. Convert `scripts/audit-case-studies.ts` into a monthly content-health report (descriptor coverage, missing meta, metric presence), and add a schema-coverage check to CI: every indexable route must emit its page-type schema or the build warns.
5. Fix the GA4 lead-event placeholder ID and hostname filter (docs/gtm-audit.md P0/P1) so organic conversions are actually attributable.

---

## 9. Decisions needed from the team (not unilateral)

1. **ArqAI:** independent partner (per messaging spine) or ACI's own practice (per homepage/FAQ/llms.txt)? Everything downstream (hero slide 4, FAQ, llms.txt, schema) follows.
2. **Anonymization vs proof:** the client-name ban is policy and this audit respects it. But the homepage lost a 30-logo trust wall in integration. Decide the compliant replacement: anonymized descriptor wall, certification badges, or written clearance for a subset of names/logos.
3. **Unverifiable numbers:** $1B+ value delivered, 95% retention, 300% ROI, "zero production failures in 3 years", "5,000+ subscribers". Source them or drop them; the plan assumes drop-unless-sourced.
4. **News strategy:** external-link list (status quo) vs owned articles.
5. **Industry-consulting keywords:** worth targeting "{industry} technology consulting" or not.
6. **Roadmap LP:** organic asset with its own long-tail, or paid-only (noindex).

---

*Report compiled from five parallel code audits over the full public route tree, reconciled with `docs/blog-quality-audit.md` (2026-07-01) and the external audit supplied 2026-07-17. Everything in sections 4-6 carries file-level evidence; production-only items (live descriptor coverage, GSC data, actual indexation) are marked and need verification against the deployed site.*
