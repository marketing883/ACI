# ACI Infotech: SEO/AEO remediation plan (response to the 8 Nov 2026 audit)

**Date:** 2026-11-10
**Input:** "SEO / AEO Audit: ACI Infotech and ArqAI Labs" (8 Nov 2026), checked against the
code on `claude/homepage-design-ideation-03gxe7` (the newest branch, 4 Nov 2026). That branch
already contains almost every other branch.
**Scope:** aciinfotech.com only. thearq.ai is not in this repo. Its items (audit #2, #3, #6, #6a,
#12, #16, plus the "By ArqAI" bylines) go to whoever owns that site, and Section 6 gives them a
short brief.
**Limit of this review:** this session could not reach the live sites (the network policy blocks
both domains). Everything below comes from the code. Where the audit and the code disagree, the
live site is either running an older build or Google's index is stale. Step 0 settles which.

---

## 1. Headline: where I agree with the audit, and where I don't

1. **Most of the ACI technical items are already fixed in code.** The 301 from the old AI page,
   the www to apex redirect, the single address, Person schema, logo alt text, and a robots.txt
   that allows AI crawlers are all in the repo (evidence in Section 2). The audit read text as
   search engines index it, so it saw old snapshots. Rewriting code again would be wasted work.
   The real gaps: getting that code deployed, and getting Google to recrawl it.
2. **The audit missed the worst ArqAI problem on ACI's site.** `/services/applied-ai-ml` is the
   page the audit wants the old AI page redirected to. It calls ArqAI "our own governance
   platform" five times, including in FAQ schema. The Terms of Service also claim "ArqAI" as an
   ACI trademark. Both contradict the approved positioning (two independent companies). That is
   a legal and trust risk, not only an SEO one.
3. **The root cause of the naming mess is one sentence, copied everywhere:** "Forward-deployed AI
   engineering is delivered with our strategic partner ArqAI through ArqAI Labs." It tells
   machines that "ArqAI" and "ArqAI Labs" are two different entities, and that the second is a
   joint practice. It sits in the homepage FAQ, llms.txt, the chatbot's knowledge
   (`src/lib/company.ts`) and the lead-scoring agent. Fix the source once and the copies follow.
4. **Two of the audit's suggested fixes would break the approved positioning:**
   - "List ArqAI Labs under subOrganization": no. `subOrganization` says ACI owns it, which is
     exactly what the 22 June positioning doc rules out. The honest machine-readable link is the
     shared founder: one `Person` entity referenced as `founder` from both Organization nodes.
   - "Build answer pages for 'What is forward-deployed AI engineering?'" on ACI: no. That is
     ArqAI Labs' category. If ACI ranks for it, ACI competes with its own partner and blurs the
     two entities further. ACI's answer pages should target ACI's own core: data foundations,
     lakehouse, and AI in production by industry.
5. **"Approve one relationship sentence" is already done** (positioning doc, 22 June 2026,
   recorded in `CLAUDE.md`): on ACI's surfaces, ArqAI Labs is "our strategic AI partner". The
   problem is execution, not a missing decision.

---

## 2. The audit's ACI items, checked against the code

| Audit # | Finding | State in code | Action |
|---|---|---|---|
| 1 | "What is ArqAI Labs?" FAQ answered with the ACI Interactive text | Q/A pairing is correct in code (`home-faq-data.ts:27-36`, one array feeds both the `<details>` markup and the FAQPage schema). **The answer itself is wrong**: "ArqAI is our strategic AI engineering partner, and ArqAI Labs is the forward-deployed practice we run together." | Rewrite the answer (text in 4.1). If the live page really shows the ACI Interactive text, production is running an old build: see Step 0. |
| 4 | Address: Suite 129 vs "2nd Floor, Suite 209" vs Piscataway | All five code copies say `220 Davidson Ave, Suite 129, Somerset, NJ 08873` (commit 06a83f7, 20 Aug, which corrected an earlier Suite 209). No "209" left in the repo. | **Decision:** thearq.ai still says Suite 209. Someone with the lease or the Google Business Profile must confirm which suite is right. Then fix the wrong site and every directory. |
| 4 (new) | NAP has no phone | No phone number appears anywhere visible, and none is in schema (`layout.tsx:78` turns off phone detection; `OrganizationSchema` emits `telephone` only if a caller passes one, and none does). | **Decision:** supply a main line. Then add it to the contact page, footer, Organization schema and Google Business Profile. NAP without the P is a weak local signal. |
| 5 | Relationship described four ways | On ACI the variants are "strategic AI engineering partner" + "practice we run together" (FAQ, llms.txt, company.ts), "our own governance platform" (applied-ai-ml), "strategic partner ArqAI" (`flow-configs.ts:40`), and a trademark claim (ToS). The "AI division" wording comes from the Forbes India card, which is not in this repo. | Section 4.1. Ask Forbes India to correct their card (PR task). |
| 7 | `/services/ai-ml-services` indexed with "16+ years", "Al on Cloud" | 301 to `/services/applied-ai-ml` exists (`next.config.ts:116`, since 18 July), alongside ~90 other legacy redirects. "16+" does not appear in the codebase. | Verify the 301 live, then use GSC URL Inspection and Removals (outdated content) to clear the cached copy. No code change. |
| 8 | www and apex both in results | Middleware 301s www to apex (`src/middleware.ts:44-47`, since 30 June). Canonicals, sitemap and `metadataBase` are all apex. `docs/www-redirect.md` gives an optional nginx layer. | Verify live. Make sure GSC has a Domain property with apex as the preferred version, and resubmit the sitemap. |
| 9 | Third-party size and revenue all over the place | Off-site. | Owner: Marketing ops. Claim ZoomInfo, Crunchbase, LinkedIn, Clutch, G2, Craft, CB Insights. Push one set of facts (Section 4.3). |
| 10 | No Person schema for leadership | **Already present**: `/about` emits Person for the CEO (Jag Kanumuri) and the CRO, with LinkedIn `sameAs` (`about/page.tsx:179-210`). Gaps: no `founder` link from Organization, no `image`, no press `sameAs`, and the Person @id lives only on /about. | Strengthen it, don't add it from scratch (4.2). |
| 11 | sameAs and the brand link | Organization `sameAs` = LinkedIn, X, YouTube only. No Crunchbase, no Wikidata, no ArqAI link. | 4.2. **No `subOrganization`** (see Section 1). |
| 13 | Logo alt text unverified | All 15 logo usages have `alt="ACI Infotech"`. Remaining empty `alt=""` values are decorative and paired with `aria-hidden`. | Done. Spot-check case-study card images (`CaseStudiesClient.tsx:245`). |
| 14 | robots.txt and llms.txt unchecked | `robots.ts` allows `*` (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended included) and blocks only `/api /admin /preview /v1 /dl`. `/llms.txt` is a dynamic route with hourly revalidation. | Verify that no CDN or WAF rule blocks AI user agents (check server logs for 403s to those UAs). Fix llms.txt content (4.1). Optional: name the AI bots explicitly so the intent is on record. |
| 15 | Answer-first pages | The July plan's Phase 3 (glossary hub, answer blocks) is still open. | 4.5, re-scoped to ACI's own categories. |
| 17 | Blog E-E-A-T | Author Person schema exists, but falls back to `{"@type":"Person","name":"ACI Infotech"}` when there is no author (`blogs/[slug]/page.tsx:105-110`): an organization marked up as a person. No author pages. | 4.4. |
| 18 | Cross-linking | `/services/applied-ai-ml` has **zero** links to thearq.ai. The homepage hero, footer and nav link out. | 4.1: applied-ai-ml links to ArqAI Labs with consistent anchor text. |
| 19 | Monthly AI visibility check | Not set up. | 4.6, with disambiguation queries added. |

---

## 3. Deeper issues the audit missed (all on ACI)

### P1: these will be repeated wrongly by AI engines or create legal exposure

| # | Issue | Evidence | Why it matters |
|---|---|---|---|
| D1 | ArqAI presented as ACI's own product | `services/applied-ai-ml/page.tsx` lines 81-83 ("ArqAI is our own governance platform"), 164, 187 (an FAQ answer, so it is also in FAQPage schema), 235 (the lede), 238 ("ArqAI governance platform" chip) | The strongest "ACI owns ArqAI" signal on the site, on the AI money page. It directly contradicts thearq.ai's "independent". |
| D2 | Terms of Service claims "ArqAI" as an ACI trademark | `terms-of-service/page.tsx:97` | A legal statement that one company owns the other's mark. **Legal must review before anyone edits it.** |
| D3 | One proof number, two values | "500+ enterprise projects" appears ~36 times (llms.txt, about, schema, chatbot). "280+ production deployments" appears in the positioning doc, `case-studies/layout.tsx:17`, the Digital Trust Summit LP, and the **new homepage** (`newhome/NHHero.tsx:26`, `deck-data.ts:11`). | When the new homepage ships, the site will say 280+ and 500+ for what reads as the same thing. AI engines will pick one at random or report both. |
| D4 | "11 accelerators" on both brands | The new homepage presents "11 modernization offers" under "Key solutions and accelerators" (`deck-data.ts:115-130`). thearq.ai says "Eleven accelerators" for its agent library. | Two companies with shared founders, the same number, the same word, different things. Expect ChatGPT to merge them. Rename ACI's set ("modernization paths" or "migration factories"). |
| D5 | Unlabeled stats on the new homepage | Each accelerator shows a gain ("35%", "50%", "70%") with no metric named (`deck-data.ts:113-116` admits this) | This is the same class of problem the audit flags on ArqRelease (#12). A number with no unit can't be cited, and it lowers trust. Name the metric (effort, time, cost) or drop it. |
| D6 | Partner tiers contradict each other, and one is defunct | "Microsoft Gold Partner" 10x (`lp-content.ts`), though Microsoft retired Gold in 2022, vs "Microsoft Solutions Partner" 9x. Databricks "Elite" 7x vs "consulting partner". Salesforce "Summit" 3x vs "Consulting Partner" 4x. "AWS Advanced Consulting Partner" 10x is the pre-2023 program name (now "Advanced Tier Services Partner"). | Buyers and AI engines check partner directories. A defunct or unverifiable tier reads as padding. The July audit flagged this. It is still open. |

### P2

| # | Issue | Evidence |
|---|---|---|
| D7 | Five different self-descriptions | "enterprise engineering firm" (FAQ, schema, llms.txt body), "enterprise technology consulting" (llms.txt tagline), "enterprise technology consultancy" (/about), "enterprise data and AI engineering firm" (company.ts, chatbot), "enterprise technology firm" (positioning doc). Pick one category phrase. |
| D8 | The sitewide footer blurb is a sixth description, and it breaks the repo's own voice rules | `SiteFooter.tsx:125` (changed 30 Oct): "measurable business impact", "move beyond AI potential", "lasting business value". Two generic paragraphs on every page dilute every page's unique text, and they say "Fortune 1000" where other pages say "Fortune 500". **Decision:** this was a deliberate recent change, so it needs the owner's sign-off. My recommendation: one sentence, the canonical description. |
| D9 | Stale credential claim | "Great Place to Work: Certified 2024-25" (`about/page.tsx:173`). It is November 2026. Renew and update, or remove. |
| D10 | Unverified claims in outbound email | `src/lib/email.ts:584` sends "80+ Fortune 500 clients, $1B+ value delivered, 95% client retention". `company.ts` deliberately dropped these as unverified, yet the positioning doc lists $1B+ and 95% as proof. **Decision:** source them or drop them everywhere. |
| D11 | DataForSEO credentials still in git history | The fallback literals were removed from `api/admin/seo/route.ts`, but they remain in commits d4e4f6d and bb17c94 on GitHub. | Confirm the credential was rotated. If it wasn't, rotate it now (that matters more than scrubbing history). |
| D12 | Public preview routes carry old positioning | `/v1`, `/preview/home`, `/preview/v2-home`, `/preview/v3*`, `/preview/v4`, `/preview/v5` still render the ArqAI components with "own platform" era copy. They are noindex and robots-disallowed, but AI fetchers that ignore robots, and anyone with a link, still see them. | Delete the dead previews. Keep only `/preview/new-home` until it ships. |
| D13 | Chatbot and lead agent knowledge | `company.ts:41-42, 190`, `copilot/brand.ts:38`, `atheros/contextMap.ts:63-64` ("how ArqAI actually deploys"), `intelligence.ts:577`, `data/playbooks.ts:153`. | Atheros answers buyers live with this text, so it is an answer engine you control. Same fix as 4.1. |
| D14 | CMS content not checked | Blog posts, case studies, whitepapers and news items in Supabase can carry the same ArqAI, number and tier errors. This repo can't see them. | Run the SQL sweep in 4.1 with CMS access. |

---

## 4. The fixes

### Step 0 (day 1): verify what's live before changing anything

1. Confirm which ref production runs. `deploy/README.md` says the ref is chosen at deploy time and
   nothing is pinned. Check `git -C /home/aciadmin/aci-website log -1` on the VPS.
2. From any normal network:
   `curl -sI https://www.aciinfotech.com/` (expect 301 to apex),
   `curl -sI https://aciinfotech.com/services/ai-ml-services` (expect 301),
   `curl -s https://aciinfotech.com/ | grep -o 'Suite [0-9]*'` (expect only 129),
   `curl -s https://aciinfotech.com/robots.txt`.
3. GSC: URL Inspection on `/`, `/about`, `/services/ai-ml-services`, `www` home. Note the
   last-crawl dates.
4. Baseline before any change: a GSC export (queries, pages, CTR), plus the AI-visibility
   question set from 4.6 run once. Without a baseline nobody can show this work moved anything.

If production is older than 20 Aug, most of the audit's ACI technical list closes with one
deploy plus a recrawl request. That is the cheapest fix on this list.

### 4.1 Fix the ArqAI wording at the source (P1, ~1 day dev + legal review)

Approved wording for ACI surfaces, per the positioning doc:

- Short form: **"ArqAI Labs, our strategic AI partner"**. Always "ArqAI Labs" in full. Never
  "ArqAI" alone, never "practice", "platform", "division", "joint", "run together".
- FAQ answer (2 sentences, quotable on its own):
  *"ArqAI Labs is ACI Infotech's strategic AI partner, an independent company with shared
  founders. Its forward-deployed engineers build and run production AI agents for regulated
  enterprises, with an audit trail on every action, at thearq.ai."*
  This is the audit's text plus "independent company with shared founders". That qualifier is
  the fact that stops engines from calling ArqAI Labs a division. Note that `CLAUDE.md` keeps
  "independent AI company" for outside reference only. The FAQ is the one place on our pages
  where we answer the outside question, so I'd allow it there. **Needs your sign-off.**

Changes:

| File | Change |
|---|---|
| `src/lib/company.ts` (ACI_POSITIONING, the ARQAI line in `companyContextBlock`) | Make this the single source. Export an `ARQAI_LABS` constant (name, URL, one-liner, FAQ answer). |
| `home-faq-data.ts`, `llms.txt/route.ts:169`, `copilot/brand.ts`, `flow-configs.ts:40`, `atheros/contextMap.ts`, `intelligence.ts:577`, `data/playbooks.ts:153` | Import from `company.ts` instead of restating it. |
| `services/applied-ai-ml/page.tsx` (5 spots) | Governance becomes ACI's own capability, described as what it is (policy as code, drift and bias monitoring, audit trails on MLflow and Great Expectations), with no product name. Add one "For production agents in regulated operations, we work with ArqAI Labs, our strategic AI partner" block that links to thearq.ai (this also covers audit #18). Also re-check the "EU AI Act aligned from day one" claim: it is a compliance promise. |
| `terms-of-service/page.tsx:97` | Legal decides. Probable fix: drop "ArqAI" from ACI's trademark list. |
| CMS sweep | `select 'blog', slug from blog_posts where content ilike '%arqai%' or content ilike '%arq ai%' union all ...` for case_studies, whitepapers, news. Then review each hit by hand. |
| Guardrail | Add a rule to `scripts/check-voice-rules.ts` that fails on `ArqAI(?! Labs)` and on "our (own )?(AI )?platform" next to Arq, in marketing surfaces. Without it, this drifts back within a month, as it already did between June and now. |

### 4.2 Entity schema (P2, ~half a day)

- Organization: add `telephone` (once supplied), `legalName`, `alternateName: "ACI Infotech Inc."`
  if that is the legal name (never bare "ACI"), and a `disambiguatingDescription` of one line
  (e.g. "Enterprise data and AI engineering firm in Somerset, New Jersey. Not affiliated with ACI
  Worldwide or ACI Learning."). That last line is the cheapest disambiguation available.
- `sameAs`: add Crunchbase, Clutch and G2 once claimed, plus a **Wikidata item**. Create one for
  ACI Infotech, and ask ArqAI Labs to create its own. Wikidata is one of the sources knowledge
  panels and LLMs rely on most for entity facts, and unlike Wikipedia it has no notability bar
  that would block us.
- `founder` on Organization pointing to a site-wide Person `@id` for Jag Kanumuri (move the
  Person node into the global graph, add `image`, add press `sameAs`). Ask thearq.ai to reference
  the same person (same LinkedIn URL) as its `founder`. That gives a true, machine-readable link
  with no ownership claim.
- No `subOrganization`, `parentOrganization` or `brand` relation to ArqAI Labs.
- Blog author fallback: emit `"@type": "Organization", "@id": "/#organization"` when there is no
  named author, not a Person called "ACI Infotech".

### 4.3 One facts ledger (P1 decisions, P2 build)

The July audit proposed `src/content/facts.ts`. `src/lib/company.ts` already half does this for
the AI agents. Extend it and make pages, schema, llms.txt, emails and the chatbot read from it:

| Fact | Today | Decision needed from |
|---|---|---|
| Category phrase | 5 variants | Marketing. My pick: "enterprise data and AI engineering firm", because it is specific and separates us from ACI Worldwide (payments) and ACI Learning (training). |
| Projects / deployments | 500+ vs 280+ | Delivery leadership: which is the counted number, and what exactly does it count? Use one label. |
| Engineers | 1,200+ (schema 1200) | Consistent today. Push it to ZoomInfo and LinkedIn as the fix for audit #9. |
| Address / phone | Suite 129 vs thearq.ai Suite 209; no phone | Facilities / office manager |
| Partner tiers | See D6 | Alliances, with a partner-portal screenshot per tier. Unverifiable tiers come off. |
| $1B+, 95% retention, "Fortune 1000/500" | Mixed | Finance / CEO. Source them or drop them. |
| Certifications | GPTW 2024-25 stale | HR |

### 4.4 Content and E-E-A-T (P2/P3)

- Footer: replace the two-paragraph blurb with the single canonical description (after sign-off, D8).
- Rename ACI's "accelerators" on the new homepage before it ships (D4), and name each gain's metric (D5).
- Author pages (`/authors/[slug]`) with bio, credentials, LinkedIn and post list, and Person
  schema linked from each post's `author.url`. Fix the reading-time fallback. (Several of these
  are already in July Phase 4.)
- Delete dead preview routes (D12).

### 4.5 Answer-first pages, scoped to ACI (P3)

Target the questions buyers ask *ACI*, not ArqAI Labs:
"How long does a Databricks / Snowflake migration take?", "Lakehouse vs data warehouse for
{industry}", "What does it cost to run GenAI in production?", "SAS to PySpark migration",
"Tableau / Cognos to Power BI migration". The last two come straight from ACI's own 11
modernization offers, which are concrete, low-competition, high-intent pages. Each page gets a
40-60 word answer under the H1, a decision table, FAQ schema and a link to the matching service
or LP. The glossary hub from the July plan fits here.

### 4.6 Monthly AI visibility check (P3, ongoing)

15 questions, run in ChatGPT, Perplexity, Gemini, Google AI Overviews and Claude. Log: named? Named
correctly? Which source was cited? Include:

- Disambiguation: "What is ACI Infotech?", "ACI Infotech vs ACI Worldwide", "Who owns ArqAI Labs?",
  "Is ArqAI Labs part of ACI Infotech?" (the expected answer is no: partner, shared founders).
- Category: "best Databricks consulting partners", "enterprise data engineering firms New Jersey",
  "Tableau to Power BI migration services".
- Facts: "How many engineers does ACI Infotech have?", "Where is ACI Infotech headquartered?"

A shared sheet is enough. The value is the trend line and the cited sources, which show which
third-party profile to fix next.

---

## 5. Sequence and owners

| When | Work | Owner | Depends on |
|---|---|---|---|
| Day 1 | Step 0 verification, baseline export | Dev + Marketing | VPS / GSC access |
| Day 1-2 | Decisions: FAQ wording, suite + phone, 500+ vs 280+, category phrase, footer | Marketing lead, CEO | none |
| Day 2 | Legal review of ToS trademark line | Legal | none |
| Days 2-4 | 4.1 code changes + voice-rule guardrail, deploy, GSC recrawl of the changed URLs | Dev | wording decision |
| Week 1 | CMS ArqAI sweep (D14) | Content | CMS access |
| Week 1-2 | 4.2 schema, Wikidata items, claimed profiles | Dev + Marketing ops | phone, legal name |
| Week 2 | Partner-tier verification and cleanup (D6) | Alliances + Dev | portal proof |
| Week 2-3 | Facts ledger refactor (4.3), footer, new-homepage accelerator rename (D4/D5) | Dev | decisions |
| Week 3+ | 4.4 author pages, preview cleanup; 4.5 answer pages (2 per week) | Dev + Content | none |
| Monthly | 4.6 AI visibility log | Marketing | baseline |
| Security, now | Confirm DataForSEO credential rotated (D11) | Dev / IT | none |

---

## 6. Brief for the thearq.ai owner (not actionable in this repo)

- Retire or 301 the legacy pages (`/about-us.html`, `/demo`, `/solutions/arqrelease`) that say
  "built by ACI Infotech" and "enterprise foundry". The new pages already match the positioning
  doc. Drop the patents and 30-day claims unless they can be backed up.
- One accelerator count across the homepage, /about, footer and schema. Keep the master list
  outside the ACI repo (`CLAUDE.md` marks accelerator internals as confidential here).
- Fix the FAQ markup so every answer carries its question in the HTML and in FAQPage schema.
- Confirm the HQ suite matches whatever is confirmed in 4.3.
- Bylines: "ArqAI Labs" or named authors, not "ArqAI".
- Reference the same founder Person (same LinkedIn URL) in schema.
- Sales collateral (brochure v6, the accelerators deck "sister concern" line) sits outside both
  repos, but it feeds what prospects quote back to AI tools. Align it to the same master list
  and relationship sentence.
