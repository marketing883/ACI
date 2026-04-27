# Handoff: ACI Infotech — Homepage

## Overview
Dark-theme, interactive homepage for **aciinfotech.com**. A single long-scroll page anchored by a terminal boot-sequence loader, a multi-layer parallax hero, and a sequence of content sections designed to communicate enterprise-grade engineering capability without resorting to stock imagery or generic corporate IT tropes.

The design pairs a **deep dark blue** foundation (`#050B1F`) with a **lime-green accent** (`#C6FF3D`) and heavy sans-serif typography (Space Grotesk + JetBrains Mono). Animations draw inspiration from [kprverse.com](https://kprverse.com) — confident, technical, not decorative.

## About the Design Files
The files in this bundle are **design references created in HTML** — high-fidelity prototypes showing intended look, motion, and interaction behavior. They are **not production code to copy directly**.

The task is to **recreate these designs inside aciinfotech.com's real codebase** (likely Next.js / React based on the current production site) using that codebase's established patterns, component library, routing, and asset pipeline. If no target framework exists yet, Next.js (App Router) + Tailwind + Framer Motion is a sensible default for this aesthetic.

Treat the HTML as a functional spec: the exact visual look, timing, interaction model, and copy are intentional and should be matched faithfully. The DOM structure, class names, and inline JS are implementation noise — ignore them.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interaction timing are locked. Recreate the UI pixel-perfectly using the codebase's existing libraries and primitives.

## Sections (top → bottom)

### 0. Terminal Loader (page-load only, ~4.5s)
- **Purpose:** brand moment on first paint; sets the "built by engineers" tone before the site reveals.
- **Layout:** full-viewport `position: fixed` overlay with a two-column grid (1.4fr / 1fr). Left column streams a **boot-sequence log** of typed lines with a blinking lime caret; right column shows a progress block with ASCII progress bar, system pill, and flickering glyph matrix.
- **CRT treatment:** repeating 1px scanlines overlaid at `mix-blend-mode: overlay`, radial vignette.
- **Top bar:** `[●●●] ACI://systems.boot — session #0x4F3A2B1` mono label row.
- **Behavior:**
  - Lines type character-by-character (~6–14ms/char) with occasional `err` / `warn` / `ok` colored tokens.
  - Progress bar fills via `█` glyphs; percentage ticks 0 → 100.
  - After ~4s, a single-frame **wipe** animates from the top, revealing the hero. Loader z-index drops and pointer-events disable.
- **Tweakable:** loader style has three variants — `Boot` (default), `Hack` (ssh handshake + commands), `AI` (agent thinking out loud). Include at least `Boot`; the others are nice-to-have.
- **Typography:** JetBrains Mono 12–13px, line-height 1.65.

### 1. Hero
- **Purpose:** brand statement + primary CTA.
- **Layout:** full viewport, left-aligned content stack, breathing room above the fold. Fixed top nav.
- **Headline:** three-line display lock-up, `clamp(64px, 8.5vw, 140px)`, weight 700, letter-spacing `-.035em`, line-height `.92`. Middle word (`signal`) is italicized at weight 500 with a lime underline bar drawn behind the glyph via a pseudo-element. Copy: *"Engineering / the signal / in the noise."*
- **Sub-headline:** `18–20px` light gray (`#9AA7C2`), max-width ~560px. Copy: *"We build, ship and run production-grade systems for Fortune 500 companies. AI, cloud, data, and the unglamorous platform work that holds them together."*
- **CTAs:** two buttons side by side, 18×26px padding —
  - Primary: lime `#C6FF3D` background, deep-ink `#0A1A00` text, `"Start a project →"`
  - Ghost: 1px `#1B2A58` border, `"Explore case studies"`
- **Hero meta strip:** thin row above headline with `/ v2026.4 · ISELIN, NJ ↔ HYD ↔ BLR ↔ TOR` mono text.
- **Hero footer strip:** dashed top border, three pill tags (`SOC 2 · ISO 27001 · HIPAA · GDPR`) plus a `~1,600 engineers online` pulse indicator.
- **Multi-layer parallax background** (6 depth planes, move against mouse at different rates; intensity controlled by `--parallax` variable `0–2`):
  1. Far: radial lime glow `radial-gradient(600px 400px at 30% 40%, rgba(198,255,61,.12), transparent)` — moves 5%
  2. Grid: 80×80 blue grid mask, radial-faded — moves 10%
  3. Node mesh: ~36 SVG circles with connecting lines, laid out in a noise-jittered grid, opacity `.45` — moves 20%
  4. Accent glow orb: soft lime blur behind headline — moves 15%
  5. Contour lines: 3 stacked SVG paths (slowly wobbling) — moves 25%
  6. Foreground dust: ~40 tiny lime dots with CSS keyframe drift — moves 40%
- **Cursor:** custom — 6px lime dot + 34px outlined ring. Ring scales to 58px and goes solid lime on hover of interactive elements. `mix-blend-mode: difference`.
- **Decrypt headline effect:** on hero reveal, the headline characters scramble through random glyphs for ~900ms before locking into the final letters, staggered per-character.

### 2. Playbooks (dark)
- **Purpose:** six opinionated engagement models.
- **Layout:** 12-col grid, each card `span 4` (3 columns × 2 rows). Card is `border: 1px solid #1B2A58`, 6px radius, 26px padding, min-height 280px, flex column.
- **Card content (top→bottom):** tag label (`/ PB-01 · AI/ML`), `h3` title (24px semibold), description (13px, `#9AA7C2`), dashed divider, footer row with `<b>{count}</b> {metric}` + rotated-arrow go button.
- **Hover:** cursor-tracking spotlight — a soft lime radial gradient follows the mouse inside the card (via `mousemove` → CSS custom props `--mx` / `--my`). Border transitions to `#2A3F7A`.
- **Cards:** Enterprise GenAI Accelerator · Legacy-to-Cloud Cutover · Lakehouse in 10 Weeks · Platform Engineering Pod · Commerce & Experience Rebuild · 24×7 Managed Services.

### 3. Services — Capability Dial (dark, auto-cycling)
- **Purpose:** show the 8 capability areas in a living, interactive component.
- **Layout:** two-column, `1.3fr / 1fr`, 80px gap, min-height 620px. Grid background mask with radial fade on the right side.
- **Left column — service list:**
  - 8 rows, each `grid-template-columns: 60px 1fr auto` (number / title / arrow).
  - Row title is `clamp(34px, 4.2vw, 64px)` bold with the middle emphasis word italicized.
  - When the list is not being hovered, the currently-active row is 100% opacity; the others are 55%.
  - When hovered, all non-hovered rows drop to 28%.
  - Active row: accent-colored number, italic word turns lime, title slides right 10px, arrow rotates 0° and fills lime, 6px lime dot appears at `left: -20px`.
- **Right column — live preview panel:**
  - Glassy card with a subtle inner grid, 1px border `#1B2A58`.
  - Header row: `/ {TAG} · CAPABILITY` and a pulsing lime dot + status (`live · 12 engagements`).
  - Title (32px bold), description (14px), 3-up stat row (value + uppercase mono caption), **ASCII diagram** showing the service's operating model, and a tech-stack chip row.
  - Each transition: fade `opacity 0 → 1` over 220ms.
- **Auto-cycle:** every 3.4s when the section is in view; pause while the list is being hovered.
- **The 8 services, stats, stacks and ASCII diagrams:** see `SERVICES` array in `reference/index.html` — copy values verbatim.

### 4. Case Studies — Pinned Horizontal Scroll (dark)
- **Purpose:** four production builds presented as a kprverse-style scroll-pin experience.
- **Outer wrapper:** `.cs-stage` has `height: 400vh` (provides 4 screens of scroll runway).
- **Inner pin:** `.cs-pin` uses `position: sticky; top: 0; height: 100vh; overflow: hidden`.
  - **Critical:** for `sticky` to work, ancestors must not use `overflow-x: hidden` — use `overflow-x: clip` on `html` and `body` instead.
- **Slides track:** `.cs-slides` is `width: 400%` with 4 children at `width: 25%` each, horizontally flexed. As the user scrolls inside the 400vh stage, the track translates in X from `0%` to `-75%` proportional to scroll progress.
- **Per-slide layout:** 2-column grid. Left = copy (eyebrow, client, big italic headline, paragraph, 3 stat tiles with lime-accent left border, CTA button). Right = visual panel with pulsing live label, **big counter** (180–320px bold lime with glow), sparkline SVG where applicable, bottom metadata row.
- **Each slide has its own gradient theme:** dark blue, dark green, dark violet, dark orange — all low-saturation, dark.
- **Counter animation:** the big number and the stat tiles count up from 0 to target when each slide becomes active (once per slide, easeOutCubic, 1000–1200ms).
- **Right-side rail:** 4 vertical ticks that fill lime in sequence as the user scrolls through slides; active tick shows the slide label (e.g. `01 · Fraud AI`).
- **The 4 case studies:** see `reference/index.html` for exact copy, stat values, themes, and visual content.

### 5. Lime Marquee Strip
- Full-width band, lime background `#C6FF3D`, deep-ink text `#0A1A00`, 24px vertical padding.
- Inline-flex track scrolling left at 28s per loop, duplicated span for seamless wrap.
- Content: `APPLIED AI / CLOUD / DATA / PLATFORM / DIGITAL / SRE / SECURITY / ADVISORY /` at `clamp(28px, 3.5vw, 48px)`, weight 700, letter-spacing `-.02em`.
- Pause on hover (optional).

### 6. News (dark)
- 4-column grid of press cards; `bg #070F28`, 1px `#142146` border, 24px padding, min-height 280px.
- Per card: meta row (source + date, mono uppercase 10px), 18px semibold headline, `Read release →` mono link.
- Hover: border turns lime, card lifts 4px.

### 7. Insights (light)
- Color flip: background `#F3F3EE`, ink `#0A1530`.
- 12-col grid, each card `span 3`. White card, 22px padding, 6px radius, min-height 340px.
- Card structure: 120px thumbnail (dark `#0A1530` with subtle grid + single large glyph + lime category badge top-left), 10px mono category label, 17px headline, date footer.
- Hover: lift 6px, drop shadow.
- The four thumbs use different dark hues to tag category: default dark blue, `#142146` (platform), `#0a2d1f` (data/green), `#2a1236` (SRE/violet).

### 8. CTA Band (dark)
- 100–180px vertical padding, centered content, max-width 1200px.
- Enormous headline: `clamp(56px, 10vw, 160px)`, weight 700, letter-spacing `-.035em`, line-height `.9`. Middle phrase italicized + lime-colored: *"Turn your toughest problems / into production."*
- Subhead (17px dim), two buttons (primary + ghost), 40px gap.
- Background: same 80×80 blue grid with a 700×500 radial mask at center (vignette).

### 9. Big Footer
- Dark `#030712` background.
- Top row: 4-col grid (1.6fr / 1fr / 1fr / 1fr), 40px gap, 60px bottom padding, 1px divider.
  - Brand column: logo + mono wordmark, 14px tagline (`Production-grade engineering at enterprise scale. 1,600+ engineers across NJ, Hyderabad, Bengaluru and Toronto. Est. 2003.`), certification pills row (`SOC 2 · ISO 27001 · HIPAA · GDPR`).
  - Three link columns: `Services`, `Resources`, `Company`. Column header is lime mono uppercase 10px `.24em` tracking. Links are 14px white, 6px vertical padding, lime on hover.
- Bottom row: copyright, offices string, legal links. All mono uppercase 11px, `#6B7A99`.

## Global Interactions

- **Custom cursor** (dot + ring, blend-mode difference) — disabled on `max-width: 900px`, revert to native cursor.
- **Fixed page rail (left edge):** vertical list `01 → 07` with 18px × 1px hyphens that grow on the active section. Hidden below 1100px.
- **Scroll-reveal:** section headers and card grids fade + translate-Y `40px → 0` on entering viewport (IntersectionObserver, threshold `0.15`, `rootMargin: '0px 0px -10% 0px'`). Card grids use staggered children (80ms per child).
- **Magnetic CTAs:** `[data-magnetic]` buttons translate toward the cursor within a 120px radius at 30% strength; ease back on leave.
- **Tweaks panel (bottom-right, dev-only):** accent swatches, loader style chips, parallax depth slider, anim speed slider, headline input, replay-loader button. Persist via a single `TWEAK_DEFAULTS` object (see reference). This is a designer tool — either omit in production or guard behind an env flag.

## Design Tokens

```css
/* Colors */
--bg:         #050B1F;   /* primary dark blue */
--bg-2:       #070F28;   /* card surface */
--card:       #0A1530;   /* deep panel */
--line:       #142146;   /* subtle divider */
--line-2:     #1B2A58;   /* border */
--text:       #E8ECF5;   /* primary on dark */
--text-dim:   #9AA7C2;   /* secondary on dark */
--muted:      #6B7A99;   /* tertiary on dark */
--accent:     #C6FF3D;   /* lime primary accent */
--accent-2:   #9BE600;   /* lime shade */
--accent-ink: #0A1A00;   /* text on lime */
--danger:     #FF5577;
--warn:       #FFB648;
--ok:         #5BE39A;

/* Light-section palette */
--light-bg:   #F3F3EE;
--light-ink:  #0A1530;
--light-mut:  #627089;

/* Typography */
--sans: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
--mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;

/* Motion */
--ease: cubic-bezier(.2, .8, .2, 1);
--anim-speed: 1;   /* multiplier, 0.5–2 */
--parallax:   1;   /* multiplier, 0–2 */
```

### Spacing scale
Section vertical padding: `clamp(80px, 10vw, 140px)` standard; `clamp(100px, 14vw, 180px)` for CTA band; 44px page gutter.

### Type scale (bold sans, `-.02em` to `-.035em` tracking, `.9–1` line-height)
- Display XL (hero, CTA): `clamp(64px, 8.5vw, 140px)`
- Display L (section h2): `clamp(40px, 6.5vw, 88px)`
- Display M (case-study h3, service row): `clamp(34px, 4.2vw, 64px)`
- H3: 28–32px / 600
- Body L: 17–18px / 1.55
- Body: 14–15px / 1.6
- Meta (mono uppercase): 10–11px, letter-spacing `.16em – .24em`

### Radii / borders
- 2px — tags, pills, small chips
- 4–6px — cards, panels
- 50% — arrow buttons, cursor ring, status dots
- 1px borders, dashed dividers with `#18254F` / `#1B2A58`

### Shadows
Used sparingly. Primary: `0 30px 60px -20px rgba(10,21,48,.25)` on light-section card hover. Accent glow: `0 0 80px rgba(198,255,61,.3)` behind big counters.

## State, Persistence & Routing

- **Loader state:** session-scoped — play once per full page load. No localStorage required.
- **Cursor / parallax / marquee:** purely visual; no state.
- **Case-study scroll:** driven off scroll position; no state.
- **Services dial:** local component state (`activeIndex`, `isHovering`), interval cleared on section-exit.
- **Tweaks panel:** optional; persist the `TWEAK_DEFAULTS` object to `localStorage` under a single key.
- **Routing:** CTAs and section cards should link to real routes in the codebase (`/contact`, `/work`, `/work/[slug]`, `/insights`, `/insights/[slug]`, `/services/[slug]`, etc.) — in the reference they are `href="#"` stubs.

## Accessibility Notes

- Honor `prefers-reduced-motion: reduce` — skip the loader typing animation (cut to end-state), disable marquee + parallax + decrypt effect, keep scroll-reveal but remove translate, swap the pinned case-study scroll for a normal vertical stack.
- Custom cursor must not suppress native focus styles — keep a visible `:focus-visible` ring (2px lime outline, 2px offset).
- Ensure every icon-only button has an `aria-label`.
- Loader overlay should use `aria-hidden="true"` while visible and be removed from the DOM after the wipe (not just `display: none`) — and should NOT trap keyboard users if it takes longer than expected.
- Contrast: all copy-over-background pairs pass AA. Lime on dark ink (`#C6FF3D` / `#0A1A00`) is fine; do not use lime on `--bg` for body text (fails 4.5:1) — lime is for headlines, accents, and active states only.

## Assets & Dependencies

- **Fonts:** Space Grotesk (400, 500, 600, 700) + JetBrains Mono (400, 500, 700), Google Fonts or self-hosted. No other font families.
- **Icons:** inline SVG only (arrow `→`, small right-arrow, pulse dot). No icon library required — build primitives as React/Vue components.
- **Images:** none. The hero uses generated SVG/CSS layers, not photography. If the team wants to add imagery, slot it as an additional parallax layer behind the existing ones; do not replace them.
- **No third-party libraries are required**, but a production build will benefit from:
  - Framer Motion (or Motion One) for the reveal / decrypt / magnetic animations
  - GSAP ScrollTrigger **or** Lenis + custom logic for the pinned case-study scroll
  - Headless IntersectionObserver hooks
- **CSS approach:** the reference uses raw CSS custom properties. Tailwind + CSS variables work fine; ensure the design tokens above are wired into the theme config so designers can tweak globally.

## Files in This Bundle

- `README.md` — this document.
- `reference/index.html` — the full interactive HTML prototype. Open in a browser to see every interaction, time every animation, and copy exact text. **Do not ship this file** — it is a spec, not source.

## Suggested Component Breakdown (React)

```
components/
  layout/
    Nav.tsx
    PageRail.tsx
    Cursor.tsx
    Footer.tsx
  loader/
    TerminalLoader.tsx        // full-viewport boot sequence
    bootLines.ts              // streamable script
  hero/
    Hero.tsx
    ParallaxLayers.tsx        // 6 depth planes, mouse-driven
    DecryptHeadline.tsx
    MagneticButton.tsx
  sections/
    Playbooks.tsx             // 6-card grid with spotlight hover
    ServicesDial.tsx          // list + live preview panel + cycle timer
    CaseStudiesPinned.tsx     // ScrollTrigger-driven horizontal track
    Marquee.tsx
    News.tsx
    Insights.tsx
    CTABand.tsx
  primitives/
    Label.tsx                 // mono uppercase eyebrow
    ArrowCircle.tsx           // rotating arrow disc
    StatTile.tsx
    Counter.tsx               // intersection-triggered count-up
```

## Open Questions for the Engineering Team

1. Which framework is this being built in? (Confirming assumptions about Next.js / React.)
2. Is there an existing design system / component library we should adapt to, or is this a greenfield rebuild?
3. Do real case studies / news / insights exist in a CMS yet, or do we keep the current copy as placeholder?
4. Should the terminal loader run on every navigation or only on first visit per session?
5. Do we need a `prefers-reduced-motion` audit before launch? (Strongly recommend yes.)
