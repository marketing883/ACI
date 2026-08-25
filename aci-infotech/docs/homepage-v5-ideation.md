# Homepage v5 ideation: Teckko template mapped onto our content

Status: built. The v5 page is implemented at `/preview/v5`
(components in `src/components/v5/`), pending review and promotion to
the root route. Revision history below. Content is
frozen to the current staging homepage (v4, the root route).

Reference template: "Teckko" IT-services homepage (dark canvas, blue
accent). Current page: v4 editorial homepage at `/`.

Decisions locked in revision 2 (from review):

- The hero follows the template: large, spacious, with a full-bleed
  office-scene background video. The white editorial hero and the
  signal-sphere video are retired from the homepage.
- No CTA section on the page. CtaSection ("Let's Talk Over a Coffee")
  is removed, and the optional mid-page conversion strip from rev 1 is
  dropped. Inline section links (case-study links, "See all
  capabilities", the footer's "Start a project") remain the only
  conversion points.
- The outlined ticker dividers are approved.
- The services section gets a real plan of its own (§5).
- The governing design idea for the whole page: **space**. Fewer
  elements per viewport, larger type, more air. Every section below is
  re-checked against that.

---

## 1. The hero

### Concept

One full-viewport (100dvh) scene. A slow, wide office shot runs
full-bleed behind everything: people at desks, glass, screens, shallow
depth of field, no readable faces or text. Graded dark and slightly
blue so it sits under white type and behind our accent colors. Over
it, a left-heavy gradient scrim for legibility, and a lot of nothing:
the copy block owns the left ~55%, the rest of the frame stays open so
the video breathes. That emptiness is the design.

### Structure (content unchanged, all four slides kept)

The video never changes; only the copy block rotates. The four
existing slides (Service Foundation / Databricks case study /
Microsoft stack / ArqAI Labs) crossfade over the same scene every 7s,
so the hero feels like one place with a changing thought, not four
competing screens.

Per slide, top to bottom, generously spaced:

1. Eyebrow with the existing gray-slash prefix.
2. Headline at genuinely large scale (clamp up to ~7vw, two authored
   lines as today). The accent phrase ("in production.", "Live AI.",
   "AI-Led.", "At Scale.") gets the template's treatment: a filled
   highlight box (accent blue, white text) instead of blue text.
3. Sub-headline, max-w-xl.
4. Tag row (existing lime-slash tags).
5. The slide's CTA link stays as a quiet arrow-link, not a button —
   consistent with "no CTA blocks", these are navigational links the
   slides already carry.

Pinned to the bottom of the frame, independent of rotation:

- Bottom-left: a 2-stat row in the template's spirit — "500+
  Enterprise projects" and "Since 2006" (both existing footer facts).
- Bottom-right: the slide-progress pills, as today.
- Slide marks (Databricks logo + 87% stat, Azure logo, ArqAI logo)
  shrink to a small chip beside the eyebrow rather than a separate
  row, keeping the frame uncluttered.

### Asset note

We need the office loop: 15 to 25s, 4K source, exported ~1080p, target
under ~6 MB (webm + mp4), poster frame for first paint, no audio.
Stock is fine (Pexels/Artgrid class footage) as long as it does not
look American-sitcom fake; grade it to match the brand blue. The
FadingVideo component and the Foldcraft lazy play/pause observer are
reusable as-is.

### Appear animation

1. Poster frame is visible immediately; the video fades in over ~1s
   and the black scrim eases from 80% to its resting gradient.
2. First slide staggers in exactly like today's hero (mark → eyebrow →
   masked headline lines from y:110% → sub → tags → link).
3. The highlight box is drawn empty first, then wipes filled
   left-to-right over 0.45s after its line lands, so the emphasis
   arrives as a separate beat.
4. Stats count up once on load; pills fade in last.
5. Slide changes animate copy only (exit fade/-16px, enter stagger);
   the video and bottom rail never blink.
6. Optional: a very slow Ken-Burns scale (1.0 → 1.06 over the full
   loop) if the footage itself is too static. Skip if the shot already
   has camera movement.

## 2. Page order and rhythm

Hero (dark video) → **ticker "AI in production"** → PartnerMarquee →
FoldcraftHero → **ticker "The playbook vault"** → PlaybooksSection →
SuccessStories → ServicesSection (§5) → InsightsSection → HomeFaq →
**ticker "Let's talk"** → SiteFooter.

- Decided in revision 3, from the design sample: the page is **dark
  end to end**, like the template. No light proof chapter.
- To keep twelve dark sections from flattening into one slab, the
  darks step in tone (hero gradient, pure black marquee, deep-water
  Foldcraft, #0a0b10 vault and stories, #07080d services and FAQ) and
  every seam carries a white/10 hairline or a ticker.
- Contrast discipline on dark: headings white, body white at 55 to
  70%, text accents move from #1D4ED8 to #60A5FA (the dark-legible
  blue), filled elements keep #1D4ED8, proof stats stay lime. A few
  deliberate light objects punch through: the stories glass card, the
  active tab pill, the inverted whitepaper card.
- The "Let's talk" ticker now leads directly into the dark footer,
  whose existing "Start a project" link quietly does the CTA job. No
  CTA section anywhere.
- With CtaSection gone, the signal-sphere video no longer appears on
  the homepage at all. Accept that: one hero motif (the office scene),
  used once, is more of the template's confidence than two competing
  signature videos. The sphere lives on wherever else it is used.

## 3. Ticker dividers (approved, unchanged from rev 1)

Three outlined, stroke-only marquee headlines at ~10 to 12vw, one
line, edge-masked, phrases lifted from existing copy: "AI in
production", "The playbook vault", "Let's talk". No entrance
animation; already drifting (~40s loop) when they scroll into view,
scroll position adds a scrub offset and flips drift direction.
Reduced motion: static outlined text.

## 4. Retained sections, spacious pass

Content and mechanics unchanged; each gets an air-and-scale pass so
the template's spaciousness carries through the page:

- **PartnerMarquee**: taller section padding, slightly larger logos,
  heading does a masked-line rise. Otherwise as-is.
- **FoldcraftHero**: already the most spacious section on the site;
  keep. Add the rotating circular text badge ("Engineered · Deployed ·
  Run in Production ·", ~20s/rev, always turning). Fix the rev-1
  finding: entrance currently plays on page load, re-trigger from its
  IntersectionObserver. Card rises last, 87% counts up.
- **PlaybooksSection**: reimagined in revision 3; the bento grid is
  retired, and so is the 500+ big number: it was a vague sum
  ("deployments" of what?) and duplicated the hero's stat rail. The
  vault becomes an editorial ledger on the dark canvas: the section's
  thesis is the existing "hundredth mile" line promoted to display
  type ("Pick the one that fits, and we start from the hundredth
  mile, not the first.", accent on the hundredth mile); the five
  patterns as full-width index rows under labeled ledger columns
  (Times run / Pattern / Domain, with the "10 patterns" chip), each a
  large lime multiplier, the pattern name in display type, category
  chip and arrow, hairline-ruled - the multipliers are the section's
  numbers now, and the column labels make them self-explanatory; the
  flagship
  Mainframe-to-Cloud playbook as a wide feature band (cloud imagery
  wash right, the three outcomes large in lime); "Runs on" reduced to
  one quiet caption line of stack names; and "Can't find your
  scenario?" closing the section as a ruled text row with the "Talk
  to an architect" link, not a card. Appear: the statement rises;
  ledger rows rise staggered 80ms, each multiplier counting to its
  number; hairlines wipe with their rows; the flagship band
  clip-reveals; the closer lands last. All copy unchanged.
- **SuccessStories**: keep tabs + video stage + glass card, restyled
  dark: glass tab bar, near-black frame, the white case card as the
  section's one light object. Media stage gains the bottom-up
  clip-path reveal; header keeps its stagger.
- **InsightsSection / HomeFaq**: unchanged plans from rev 1 (column
  rise + image settle; masked header + 60ms row stagger on native
  `<details>`).
- **SiteFooter**: unchanged, still no entrance animation. The giant
  wordmark is the page's last big-type moment.

## 5. Services section, planned properly

The content it must carry, unchanged: five services (number, eyebrow
message, name, one proof line with a hard stat, four chips, three
platform logos, link) plus ACI Interactive as a distinct
specialized-division card with its own CTA link. That is six items
with real depth — exactly what the template's three shallow cards
cannot hold, and what the current v4 row-list compresses too hard for
a "spacious" page.

Decided in revision 3, from the design sample: **Option B**. Option A
is kept below for the record.

### Option A (not chosen): sticky index + full-height chapters

A split section. Left ~40% is a sticky rail: eyebrow "/ What we
build", the H2 "From raw data to AI in production.", and an index list
01–05 + "ACI Interactive". Right ~60% is a scroll of five tall panels,
each ~80vh, one service per panel, with the division card as a full
width closer under the split.

Each panel, spacious by construction:

- The service number as a huge watermark (20vh+, low-contrast).
- Eyebrow message ("Move your data onto modern ground.") as a large
  lead line — promoted from decoration to the panel's voice.
- Service name in display type.
- The proof line pulled out as the panel's big object, stat first:
  "3 weeks → 4 hours" large, the sentence small beneath it.
- Chip row and platform logos at the bottom, arrow-link to the
  service page.
- Per-service background image (the existing `svc-*.jpg` hover
  assets) as a quiet right-edge band or panel wash, always visible at
  low opacity instead of hover-only.

As the reader scrolls, the sticky index tracks the active panel: a
small blue marker slides between items, the active item at full
contrast, the rest dimmed. ACI Interactive breaks the rhythm on
purpose: full-width dark blue gradient card after the split ends,
lime glow, "Explore ACI Interactive" link.

Appear animation: rail rises once and pins. Each panel as it enters:
hairline wipes across the top → number watermark fades in → masked
name lines → proof stat counts/slides in → chips and logos rise.
Index marker movement is a spring translate, not a jump. Mobile: rail
collapses to a plain section header, panels stack at natural height,
watermark shrinks behind the number.

Why recommended: it is the most literal expression of "big spacious"
(each service gets most of a viewport), there is no scroll hijack
(plain document scroll, sticky positioning only), all six items fit
without crowding, and everything stays in the initial HTML for SEO.

### Option B (chosen): expanding columns

Five full-height vertical panels side by side on the dark canvas:
the four services plus ACI Interactive as the fifth, division-styled
column (blue gradient, lime badge). Each collapsed panel is a dimmed
service image spine with the number and a vertical service name. One
panel is always open at ~2.6x width via a flex-grow transition
(~0.6s), revealing the eyebrow message, service name, proof stat in
lime, chips, and platform logos; it auto-advances roughly every 6s
until the pointer takes over, and hover or tap expands any spine.
Appear: the five columns rise staggered on reveal, then the first
panel opens. Mobile: the columns stack to full-width cards at natural
height, all content visible, no expansion trick. Known cost, accepted:
only one service's full content is visible at a time on desktop; the
collapsed spines carry name and number so the row still scans.

### Option C: pinned card deck

Rejected (scroll hijacking); noted in rev 2 for completeness.

The current hover photo-takeover rows are retired; the hover assets
are reused as the column imagery.

## 6. Animation system (unchanged foundation)

Everything uses `cubic-bezier(0.22, 1, 0.36, 1)`, reveals once
(threshold ~0.15, bottom margin -60 to -80px), and collapses to
instant under `prefers-reduced-motion`. Four shared moves: rise
(fade + 24px, 80–120ms stagger), masked line (H2s site-wide), wipe
(highlight box, hairlines, clip-path media), count-up (~1.6s quartic
ease-out).

## 7. Open decisions

Settled so far: services layout is Option B (expanding columns); the
page theme is dark end to end. Still open:

1. Hero footage: source and grade of the office loop; who picks it.
2. "No CTA" scope check: assumed to mean no CTA sections/blocks;
   inline arrow-links inside sections and the footer's "Start a
   project" remain. Flag if the intent was stricter.
3. Ticker phrases: "AI in production" / "The playbook vault" /
   "Let's talk" — confirm or swap.

## 8. Out of scope for v5

New copy, team section, testimonial wall, contact form, newsletter,
CTA sections of any kind, JSON-LD or section-level SEO changes,
nav/footer redesign.
