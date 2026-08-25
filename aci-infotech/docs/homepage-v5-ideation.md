# Homepage v5 ideation: Teckko template mapped onto our content

Status: ideation only. Nothing here is built. Content is frozen to the
current staging homepage (v4, the root route); this doc decides which
template sections we keep, how they carry our existing copy, and how
each section appears on scroll.

Reference template: "Teckko" IT-services homepage (dark canvas, blue
accent). Current page: v4 editorial homepage at `/` (white-dominant,
Funnel Display, signal-sphere video).

---

## 1. What the template is actually good at

Strip the stock photos and the template has five devices worth taking:

1. **Giant outlined marquee headlines between chapters** ("Software
   Development", "Explore Popular Services", "Get In Touch Contact
   Us"). Stroke-only type at ~12vw, moving with the scroll. This is
   the template's signature and the single strongest thing to adopt.
2. **A highlight-box on one hero keyword** ("DIGITAL SOFT" in a filled
   box inside the headline). Cheap, effective emphasis.
3. **A rotating circular text badge** in the about section. Gives a
   static section one point of continuous motion.
4. **Big stat cards that count up** (36k+, 850+). We already do this
   in Playbooks; the template confirms it as a recurring motif.
5. **A long dark run** that makes the light moments feel deliberate.

What the template is bad at: generic copy, stock photography, a team
grid nobody asked for, and a mid-page contact form that competes with
the footer CTA. We take the skeleton and the motion, not those.

## 2. What we keep of ours, non-negotiable

- All copy, stats, CTAs, and CMS wiring exactly as on staging.
- The white editorial hero with the signal-sphere video. It is the
  brand differentiator; the template's photo-hero is weaker.
- SSR/SEO behavior: hidden-slide SSR text, native `<details>` FAQ,
  JSON-LD, section order visible to crawlers.
- `prefers-reduced-motion` kills every animation listed below.

## 3. Section map: template → ours

Template order: Hero → ticker → About+stats → accordion → ticker →
Services cards → conversion strip → Team → Case-study carousel →
Testimonials → CTA+form → Blog → ticker → Footer.

| # | Template section | Our section (content unchanged) | Verdict |
|---|---|---|---|
| 1 | Hero (copy left, photo right, 2 stats, highlighted word) | EditorialHero, 4-slide rotator | **Retain ours, adopt two treatments**: highlight-box on the accent phrase ("in production.", "Live AI.", "AI-Led.", "At Scale."), and a small 2-stat row under the CTA ("500+ enterprise projects" / "Since 2006", both already in the footer facts). Keep the rotator; template's static hero loses three slides of content. |
| 2 | Ticker "Software Development" | New decorative divider | **Adopt.** Outlined ticker reading "AI in production" (pulled from the hero headline, no new copy). Sits on the seam where white hero meets dark marquee. |
| 3 | Logo strip | (template has none; we have PartnerMarquee) | **Retain ours as-is.** Already a marquee; it slots naturally after ticker #1. |
| 4 | About + rotating badge + stat cards | FoldcraftHero ("Your best data is sitting in the dark.") | **Retain ours, adopt the rotating badge**: a circular text ring ("Engineered · Deployed · Run in Production ·") floating in the underwater scene, replacing or joining ParticleRings. Skip extra stat cards; the story card already carries 87% and the quote, which also absorbs the template's separate Testimonials section. |
| 5 | Accordion (Vision / Philosophy / Strategy) | HomeFaq | **Pattern maps to our FAQ, which stays late in the page** for AEO. No new mid-page accordion; one accordion per page. |
| 6 | Ticker "Explore Popular Services" | New divider before Playbooks | **Adopt.** Outlined ticker "The playbook vault" (existing eyebrow copy). |
| 7 | Services 3-card grid | ServicesSection (5 numbered bars + ACI Interactive card) | **Retain ours.** The bar list with hover photo-takeover is stronger than 3 generic cards and holds 5 services + a division card that a 3-up grid cannot. Adopt only the template's entrance rhythm (see §5). |
| 8 | Thin conversion strip (avatars, "1.6M+ trusted clients") | Optional new slim band | **Adopt, optional.** A one-line dark band reusing the footer facts strip ("Founded 2006 · 1,200+ engineers · 500+ enterprise projects · 11 delivery hubs") with the existing "Talk to an architect" link. Zero new copy. Placement: between SuccessStories and Services. Cuttable if the page feels long. |
| 9 | Team grid | — | **Drop.** No team content on the staging homepage, and none is being added. |
| 10 | Case-study carousel | SuccessStories (tabs + video stage + glass card) | **Retain ours.** Tabs beat a free-scrolling carousel for four curated stories. Adopt the template's framing: consider flipping this section dark so the media stage sits in a dark chapter (see §4). |
| 11 | Testimonials wall | — | **Drop as a standalone.** Our one real quote lives in the Foldcraft story card; a wall of them is template filler. |
| 12 | Split CTA + contact form | CtaSection ("Let's Talk Over a Coffee") | **Retain ours.** The single floating button over the returning sphere video is more memorable than a mid-page form; forms live on `/contact`. |
| 13 | Blog cards | InsightsSection (featured news + 3 rows + whitepaper) | **Retain ours as-is.** Direct match, ours carries more content types. |
| 14 | Ticker "Get In Touch Contact Us" | New divider before CtaSection | **Adopt.** Outlined ticker "Let's talk" leading into the coffee CTA. Three tickers total; more would dilute the device. |
| 15 | Footer + newsletter | SiteFooter | **Retain ours.** We already have the template's best footer idea (the oversized wordmark). No newsletter program exists, so the signup block is dropped. |

Resulting v5 order (new elements in bold):

Hero → **ticker "AI in production"** → PartnerMarquee → Foldcraft (+
**rotating badge**) → **ticker "The playbook vault"** → Playbooks →
SuccessStories → **facts strip (optional)** → Services → Insights →
FAQ → **ticker "Let's talk"** → CTA → Footer.

## 4. Light/dark rhythm

Template: dark end to end. Ours today: white hero, dark run
(marquee/Foldcraft/Playbooks), then white the rest of the way to a
dark footer.

Recommendation: **extend the dark run through SuccessStories**, then
break to light for Services → Insights → FAQ, and close dark from the
"Let's talk" ticker through the footer. That gives three clean
chapters (light open, dark middle, light proof, dark close) and lets
the tickers sit on the seams. Going full-dark like the template is the
fallback option, but it flattens the page and costs us the editorial
white that distinguishes us from every dark IT-services site,
including this template.

SuccessStories dark variant is the only real restyle in scope: white
bg → near-black, gray pill bar → white/10 glass, and the existing
glass card gets slightly more opaque for contrast.

## 5. Appear animations, section by section

One shared system, then per-section specifics. Everything below uses
the easing we already ship, `cubic-bezier(0.22, 1, 0.36, 1)`, reveals
once via IntersectionObserver / Framer `whileInView` (threshold ~0.15,
bottom margin -60 to -80px), and collapses to instant under
`prefers-reduced-motion`.

Shared vocabulary (four moves, reused everywhere):

- **Rise**: fade in + translateY 24px → 0, 0.55 to 0.7s, stagger 80
  to 120ms across siblings.
- **Masked line**: headline lines slide up from `y:110%` inside
  `overflow:hidden` spans (already in the hero); promote to every
  section H2.
- **Wipe**: an element scales in horizontally from origin-left
  (highlight box, hairline rules, tab progress).
- **Count-up**: rAF number tick with quartic ease-out over ~1.6s
  (already in Playbooks).

Per section:

1. **EditorialHero** (unchanged mechanics, two additions). Keep the
   staggered entrance: mark/stat → eyebrow → masked headline lines →
   description → tags → CTA. New: (a) the accent phrase's highlight
   box wipes in left-to-right over 0.45s *after* its line lands
   (~0.9s in), so the headline reads first and the emphasis arrives
   as a beat; (b) the new 2-stat row counts up on first load only,
   not per slide.
2. **Ticker dividers** (all three). No entrance; the ticker is
   already in motion when it scrolls into view, like the template.
   Base drift ~40s linear loop; scroll position adds offset so
   scrolling drags the text (scrub), scroll direction flips drift
   direction. Stroke-only text, ~10 to 12vw, one line, edge-masked.
   Under reduced motion: static, centered, no stroke gimmick beyond
   the outline itself.
3. **PartnerMarquee**. Heading does a masked-line rise; the logo
   track is already looping when revealed (never starts from rest).
   Keep 38s loop, hover-pause, edge masks.
4. **FoldcraftHero**. Fix in passing: current `fadeSlideUp` runs on
   page load, so it has already played by the time the user scrolls
   here. Re-trigger it from the section's existing
   IntersectionObserver instead. Sequence: video scrim lifts (black
   overlay fades 0.6s) → kicker/H2 masked lines → body rise → story
   card rises last with its 87% counting up. The rotating badge spins
   continuously at ~20s/rev, independent of reveal; it never
   "appears", it is simply always turning.
5. **PlaybooksSection**. Keep exactly what ships: `.pb-rise` stagger
   at 90ms per card, 500+ count-up on reveal, dual-direction stack
   marquees. Optional polish: add scale 0.985 → 1 to the card rise so
   the bento settles rather than slides.
6. **SuccessStories**. Keep the staggered header reveal, 8s
   auto-rotate, progress bar, and card `AnimatePresence` swap. New:
   the media stage reveals with a bottom-up `clip-path: inset()` wipe
   over 0.8s (the template's carousel-image reveal), with the glass
   card rising 0.15s behind it.
7. **Facts strip** (if kept). Single rise as one unit; numbers count
   up; the "Talk to an architect" arrow link gets the existing
   underline-grow hover. Nothing else; it is a divider, not a scene.
8. **ServicesSection**. Keep per-bar `whileInView` rise with 60ms
   stagger. New: each bar's top hairline draws in (wipe, scaleX
   0 → 1, 0.5s) just before its content rises, so the list appears to
   rule itself onto the page, matching the bar anatomy. Hover
   photo-takeover unchanged.
9. **InsightsSection**. Keep the two-column rise (right column +80ms).
   New: the featured image reveals inside its overflow-hidden frame
   with scale 1.06 → 1 alongside the column rise. Row hover flood
   unchanged.
10. **HomeFaq**. Header block does masked-line + rise; the accordion
    rows stagger-fade at 60ms each. Rows stay native `<details>`;
    entrance is CSS-only so answers remain in initial HTML.
11. **CtaSection**. After the "Let's talk" ticker, the sphere video
    fades in from white; the button pops with a small spring (scale
    0.92 → 1, ~0.5s) when the section centers in the viewport. Hover
    behavior (blue → lime flip, coffee tilt) unchanged.
12. **SiteFooter**. No entrance animation, same as today. The footer
    arrives at rest; after eleven animated sections, stillness is the
    point.

## 6. Open decisions

1. **Hero**: keep the 4-slide rotator restyled (recommended), or go
   static on slide 1 and relocate the Databricks/Azure/ArqAI slides?
   Static means finding those three slides a new home, since content
   is frozen.
2. **Dark rhythm**: chapter approach from §4 (recommended) vs
   full-dark like the template.
3. **Facts strip** (§3 row 8): include or cut?
4. **Section order**: keep ours (recommended) or mirror the template
   by moving Services above SuccessStories?
5. **Ticker copy**: proposed "AI in production" / "The playbook
   vault" / "Let's talk", all lifted from existing copy. Confirm or
   swap phrases.

## 7. Explicitly out of scope for v5

New copy of any kind, team section, testimonial wall, mid-page
contact form, newsletter signup, changes to JSON-LD or section-level
SEO behavior, nav/footer redesign.
