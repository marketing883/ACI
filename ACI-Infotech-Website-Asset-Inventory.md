# ACI Infotech Website: Visual Asset Inventory (pre-WordPress migration)

Snapshot of the live Next.js site in `marketing883/ACI` (`aci-infotech/`), commit `7cd6552`, head of branch `claude/homepage-design-ideation-03gxe7` (the branch production deploys from). Generated 2026-10-06. Nothing in the project was modified or deleted to produce it.

## How this was built

Only assets the website actually uses are inventoried. "Used" was established in five steps, and an asset is listed in the main inventory only when the code path that references it is reachable from a public route:

1. **Import graph.** Every route entry under `src/app` (pages, layouts, metadata files, route handlers: 210 entries) was resolved through its imports with the TypeScript parser. That gave 492 reachable source files, 46 unreachable (dead) files, and 63 public routes plus 9 internal preview routes and the admin area.
2. **Reference scan.** Every reachable file (TSX/TS/CSS) was scanned for media paths: `src`/`poster`/`<source>`, `next/image`, CSS `url()`, inline styles, constants and template strings (same-file constants resolved), JSON-LD and metadata. Comments were stripped first.
3. **Runtime crawl.** A production build (`next build` + `next start`) was crawled in headless Chromium: 145 distinct desktop pages (every sitemap URL except individual blog posts, all 47 `/lp/*` landing pages, 6 representative blog posts, both blog listing pages, thank-you pages, 2 job pages, the two static LPs and the 404 page) and 15 pages at a 390px mobile viewport; 162 page loads in total, 0 errors. Each page was scrolled top to bottom; the desktop homepage was also clicked through all 6 hero slides and all 5 success-story tabs, the mega menus were hovered, and the About capability bars were hovered. Every image/media request, `<img>` (with alt text), `<video>` (with all `<source>`s), CSS background, iframe and `<canvas>` was recorded.
4. **CMS media.** Supabase tables `blog_posts` (402 rows), `case_studies` (29), `news` (7) and `whitepapers` (1) were queried and every displayed image URL (featured images and `<img>` tags inside post HTML) was requested to check it still loads.
5. **Provenance.** Video technical data comes from `ffprobe` on each file; origins come from git history (who added each file, commit messages) plus embedded file metadata (copyright / title / encoder tags). `public/images/v4/SOURCES.md` documents the photo sources.

Static-only references are cross-checked against the crawl. Every public asset was either seen loading in the browser or explained: a hover/tab-only state, a `<picture>`/`<source>` fallback a modern browser skips, a `<head>` metadata image, or a download. Nothing was left in "Usage needs verification".

**Original prompts.** The whole repository, its full git history, the docs and the file metadata were searched for generation prompts (Midjourney, Runway, Sora, Veo, Kling, Higgsfield, "prompt" and similar). **No image or video generation prompt exists anywhere in the project.** Every asset is therefore marked "Not found in project" (or "Not applicable" when the source is a known stock library or code renderer). No prompt has been assumed or reconstructed.

## Index

| Section | Count |
|---|---|
| [Brand identity, favicons and share image](#brand-identity-favicons-and-share-image) | 9 |
| [Video files (stored in the project)](#video-files-stored-in-the-project) | 24 |
| [Photography and illustrations](#photography-and-illustrations) | 34 |
| [Partner and platform logos](#partner-and-platform-logos) | 26 |
| [Technology stack logos (Simple Icons SVG set)](#technology-stack-logos-simple-icons-svg-set) | 54 |
| [Certification and award badges](#certification-and-award-badges) | 5 |
| [People photos](#people-photos) | 6 |
| [Event landing page imagery](#event-landing-page-imagery) | 1 |
| [Code-rendered animations (not video files)](#code-rendered-animations-not-video-files) | 20 |
| [Icon systems](#icon-systems) | 3 entries (92 Lucide icons + X icon + inline SVG marks) |
| [Third-party externally hosted media](#third-party-externally-hosted-media) | 3 |
| [CMS-managed media](#cms-managed-media) | 6 classes (366 image files + 64 inline blog images) |
| [Downloadable documents (non-visual)](#downloadable-documents-non-visual) | 3 entries |
| [Broken or missing references](#broken-or-missing-references) | 8 |
| [Internal preview / admin-only assets](#internal-preview--admin-only-assets) | 26 |
| [Unused assets](#unused-assets) | 77 |
| [Summary](#summary) | |

Reading the cards: "Page(s) where used" comes from the crawl: the pages whose rendered DOM contained the asset (network requests caused only by Next.js prefetching linked pages are ignored). Hover-only assets and `<head>` images, which never sit in the DOM, are counted from their network requests or the rendered HTML. "Exact section / component" lists every public source location as `file:line`.

## Brand identity, favicons and share image

#### BR-01 · ACI Infotech logo (white)

| Field | Value |
|---|---|
| Asset name / filename | ACI Infotech logo (white) |
| Asset type | Logo (raster) |
| Format | PNG, 250x62, 4 KB |
| Path / location | `aci-infotech/public/aci-infotech-logo-white.png` (URL `/aci-infotech-logo-white.png`) |
| Page(s) where used | Rendered on 144 of 145 crawled desktop pages: `/`, `/about`, `/blogs` + `/blogs/*` (8), `/careers` + `/careers/*` (2), `/case-studies` + `/case-studies/*` (30), `/contact`, `/industries` + `/industries/*` (9), `/lp/*` (49), `/news`, `/partners`, `/platforms` + `/platforms/*` (11), `/playbooks` + `/playbooks/*` (12), `/privacy-policy`, `/services` + `/services/*` (12), `/terms-of-service`, `/this-page-does-not-exist-404`, `/whitepapers` + `/whitepapers/*` (3). Global: rendered by the root layout / site header / footer on every page. |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:1306`<br>`/lp/thank-you` header — `app/lp/thank-you/page.tsx:74`<br>LP template hero `LPHero` (`/lp/[slug]`) — `components/landing-pages/LPHero.tsx:74`<br>LP template header `LPLayout` (`/lp/[slug]`) — `components/landing-pages/LPLayout.tsx:25`<br>Global footer `SiteFooter` — `components/v4/hero/SiteFooter.tsx:121` |
| Purpose / description | White wordmark on dark surfaces: global footer, LP template header and hero, AION LP footer, LP thank-you header |
| Desktop / mobile usage | Desktop + mobile (observed on 144 desktop / 14 mobile pages) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 145 pages / 5 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-07 (commit `b272350`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/`; header + footer logo via Site Editor (Site Logo block) or Customizer > Site Identity; dark-header variant needs a second logo field (theme option / ACF) |
| Notes | Two different white-logo files are live (`/aci-infotech-logo-white.png` and `/brand/aci-infotech-logo-white.png`); consolidate to one in WordPress. |

#### BR-02 · ACI Infotech logo (full colour)

| Field | Value |
|---|---|
| Asset name / filename | ACI Infotech logo (full colour) |
| Asset type | Logo (raster) |
| Format | PNG, 849x271, 75 KB |
| Path / location | `aci-infotech/public/aci-infotech-logo.png` (URL `/aci-infotech-logo.png`) |
| Page(s) where used | Rendered on 96 of 145 crawled desktop pages: `/`, `/about`, `/blogs` + `/blogs/*` (8), `/careers` + `/careers/*` (2), `/case-studies` + `/case-studies/*` (30), `/contact`, `/industries` + `/industries/*` (9), `/lp/*` (1), `/news`, `/partners`, `/platforms` + `/platforms/*` (11), `/playbooks` + `/playbooks/*` (12), `/privacy-policy`, `/services` + `/services/*` (12), `/terms-of-service`, `/this-page-does-not-exist-404`, `/whitepapers` + `/whitepapers/*` (3). Global: rendered by the root layout / site header / footer on every page. |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:519`<br>Organization JSON-LD `logo` (structured data, not rendered) — `components/seo/StructuredData.tsx:96`<br>Global header `SiteNav` (desktop bar + mobile menu sheet) — `components/v4/hero/SiteNav.tsx:106,161` |
| Purpose / description | Primary ACI Infotech wordmark on light backgrounds; also the Organization logo in JSON-LD |
| Desktop / mobile usage | Desktop + mobile (observed on 96 desktop / 13 mobile pages) |
| Background or foreground | Foreground |
| Animation / motion usage | None (header bar fades/blurs on scroll via SiteNav, the logo itself is static) |
| Reusable or page-specific | Reusable (used on 97 pages / 3 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-07 (commit `b272350`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/`; header + footer logo via Site Editor (Site Logo block) or Customizer > Site Identity |
| Notes | 77 KB PNG for a ~150px logo; a 5 KB compressed copy exists at `/brand/aci-infotech-logo.png` but is not referenced. Ask the brand owner for an SVG master. |

#### BR-03 · ACI Infotech logo (white, compressed)

| Field | Value |
|---|---|
| Asset name / filename | ACI Infotech logo (white, compressed) |
| Asset type | Logo (raster) |
| Format | PNG, 250x62, 2 KB |
| Path / location | `aci-infotech/public/brand/aci-infotech-logo-white.png` (URL `/brand/aci-infotech-logo-white.png`) |
| Page(s) where used | `/industries/energy`, `/industries/healthcare`, `/industries/hospitality`, `/industries/manufacturing`, `/industries/oil-gas`, `/industries/transportation`, `/services/advisory-strategy`, `/services/digital-transformation`, `/services/gcc`, `/services/managed-operations`, `/services/quality-engineering` |
| Exact section / component | `/industries/energy` page (<FoldcraftHero>) — `app/industries/energy/page.tsx:248`<br>`/industries/healthcare` page (<FoldcraftHero>) — `app/industries/healthcare/page.tsx:233`<br>`/industries/hospitality` page (<FoldcraftHero>) — `app/industries/hospitality/page.tsx:240`<br>`/industries/manufacturing` page (<FoldcraftHero>) — `app/industries/manufacturing/page.tsx:233`<br>`/industries/oil-gas` page (<FoldcraftHero>) — `app/industries/oil-gas/page.tsx:250`<br>`/industries/transportation` page (<FoldcraftHero>) — `app/industries/transportation/page.tsx:248`<br>`/services/advisory-strategy` page (<FoldcraftHero>) — `app/services/advisory-strategy/page.tsx:258`<br>`/services/digital-transformation` page (<FoldcraftHero>) — `app/services/digital-transformation/page.tsx:285`<br>`/services/gcc` page (<FoldcraftHero>) — `app/services/gcc/page.tsx:251`<br>`/services/managed-operations` page (<FoldcraftHero>) — `app/services/managed-operations/page.tsx:280`<br>`/services/quality-engineering` page (<FoldcraftHero>) — `app/services/quality-engineering/page.tsx:310` |
| Purpose / description | White ACI mark inside the FoldcraftHero story card on industry/service pages |
| Desktop / mobile usage | Desktop observed (11 pages); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 11 pages / 14 source locations) |
| Original source / generation method | Added in development commit `f4c273d` (2026-04-22): "feat(v2): compressed brand assets + real logo in nav/footer + favicon wiring". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/`; header + footer logo via Site Editor (Site Logo block) or Customizer > Site Identity |
| Notes | Duplicate of the root white logo at a smaller size; consolidate. Also referenced by internal preview code (components/v2/home/FooterV2.tsx, components/v2/nav/MobileMenu.tsx, components/v2/nav/NavV2.tsx); that does not affect the live site. |

#### BR-04 · Favicon 192px / Apple touch icon

| Field | Value |
|---|---|
| Asset name / filename | Favicon 192px / Apple touch icon |
| Asset type | Favicon / app icon |
| Format | PNG, 192x192, 7 KB |
| Path / location | `aci-infotech/public/brand/favicon-192.png` (URL `/brand/favicon-192.png`) |
| Page(s) where used | Every page `<head>` (metadata link; browsers fetch it only when bookmarking / adding to home screen, so it never appears as a page request) |
| Exact section / component | Root layout `<head>` metadata (favicons / Open Graph / Twitter card) — `app/layout.tsx:118,121`<br>Web app manifest `/manifest.webmanifest` icons — `app/manifest.ts:19` |
| Purpose / description | Apple touch icon, 192px icon link and PWA manifest icon |
| Desktop / mobile usage | Both (metadata) |
| Background or foreground | n/a (browser chrome) |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (site-wide metadata) |
| Original source / generation method | Added in development commit `f4c273d` (2026-04-22): "feat(v2): compressed brand assets + real logo in nav/footer + favicon wiring". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Site Identity > Site Icon (generated automatically from the 512px master) |
| Notes | Verified in rendered `<head>`: `<link rel="icon" sizes="192x192">` and `<link rel="apple-touch-icon">`. Not fetched during a normal page view, so the crawl shows no request; usage confirmed from HTML. |

#### BR-05 · Favicon 32px

| Field | Value |
|---|---|
| Asset name / filename | Favicon 32px |
| Asset type | Favicon |
| Format | PNG, 32x32, 973 B |
| Path / location | `aci-infotech/public/brand/favicon-32.png` (URL `/brand/favicon-32.png`) |
| Page(s) where used | Rendered on 145 of 145 crawled desktop pages: `/`, `/about`, `/blogs` + `/blogs/*` (8), `/careers` + `/careers/*` (2), `/case-studies` + `/case-studies/*` (30), `/contact`, `/industries` + `/industries/*` (9), `/lp/*` (50), `/news`, `/partners`, `/platforms` + `/platforms/*` (11), `/playbooks` + `/playbooks/*` (12), `/privacy-policy`, `/services` + `/services/*` (12), `/terms-of-service`, `/this-page-does-not-exist-404`, `/whitepapers` + `/whitepapers/*` (3). Global: rendered by the root layout / site header / footer on every page. |
| Exact section / component | Root layout `<head>` metadata (favicons / Open Graph / Twitter card) — `app/layout.tsx:117,120` |
| Purpose / description | Browser tab icon (`<link rel="icon" sizes="32x32">` and shortcut icon) |
| Desktop / mobile usage | Desktop + mobile (observed on 145 desktop / 15 mobile pages) |
| Background or foreground | n/a (browser chrome) |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 146 pages / 1 source location) |
| Original source / generation method | Added in development commit `f4c273d` (2026-04-22): "feat(v2): compressed brand assets + real logo in nav/footer + favicon wiring". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Site Editor / Customizer > Site Identity > Site Icon (upload one 512x512 PNG; WordPress generates 32/180/192/270 sizes) |
| Notes | Provide a 512x512 master; WordPress builds every favicon size from it. |

#### BR-06 · favicon.ico (multi-size)

| Field | Value |
|---|---|
| Asset name / filename | favicon.ico (multi-size) |
| Asset type | Favicon |
| Format | ICO, 4 icons (16x16, 32x32 ...), served from `src/app/favicon.ico` (Next.js metadata file convention) |
| Path / location | `aci-infotech/src/app/favicon.ico` (served at `/favicon.ico`) |
| Page(s) where used | Every page `<head>` (`<link rel="icon" href="/favicon.ico">`, verified in rendered HTML; served HTTP 200 `image/x-icon`) |
| Exact section / component | Root `<head>` (auto-injected `<link rel="icon">`) — `src/app/favicon.ico`<br>Blog post author byline avatar — `app/blogs/[slug]/page.tsx:245`<br>Web app manifest — `app/manifest.ts:14` |
| Purpose / description | Default browser favicon; ALSO rendered as the author avatar image on every blog post (`<Image src="/favicon.ico" alt={author_name}>`); manifest icon |
| Desktop / mobile usage | Both (metadata) |
| Background or foreground | Foreground (blog avatar) / browser chrome |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (site-wide metadata) |
| Original source / generation method | Present since project setup (Next.js app directory). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Site Identity > Site Icon; for the blog byline use real author avatars (Gravatar / user profile image) |
| Notes | Using the favicon as the author photo is a placeholder; WordPress author avatars replace it. The blog fallback only renders for a post that has an author bio but no author image; no published post is in that state today (all 55 posts with a bio have an image URL, see CMS-06). |

#### BR-07 · ArqAI Labs logo (light, for dark backgrounds)

| Field | Value |
|---|---|
| Asset name / filename | ArqAI Labs logo (light, for dark backgrounds) |
| Asset type | Partner logo (raster) |
| Format | PNG, 2562x972, 340 KB |
| Path / location | `aci-infotech/public/images/ArqAI-Labs-Logo-light.png` (URL `/images/ArqAI-Labs-Logo-light.png`) |
| Page(s) where used | `/lp/digital-trust-summit-2026` |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:1246`<br>Homepage hero `V5Hero` — `components/v5/V5Hero.tsx:103` |
| Purpose / description | ArqAI Labs mark: homepage hero slide 6 eyebrow ("our strategic AI partner" slide) and AION LP footer/partner strip |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | Slide enter/exit via Framer Motion (V5Hero carousel, 7s rotation) |
| Reusable or page-specific | Reusable (used on 1 page / 2 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-07-21 (commit `04b22d5`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/`; header + footer logo via Site Editor (Site Logo block) or Customizer > Site Identity |
| Notes | 2439x858 source at 340 KB for a ~24px-tall eyebrow; export a smaller WebP. Positioning rule: always "our strategic AI partner", never "division/arm". |

#### BR-08 · ArqAI Labs logo (dark, for light backgrounds)

| Field | Value |
|---|---|
| Asset name / filename | ArqAI Labs logo (dark, for light backgrounds) |
| Asset type | Partner logo (raster) |
| Format | PNG, 2562x972, 412 KB |
| Path / location | `aci-infotech/public/images/ArqAI-Labs-Logo.png` (URL `/images/ArqAI-Labs-Logo.png`) |
| Page(s) where used | `/lp/digital-trust-summit-2026` |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:530` |
| Purpose / description | ArqAI Labs mark on the AION 2026 LP header association line |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-07-21 (commit `04b22d5`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/`; header + footer logo via Site Editor (Site Logo block) or Customizer > Site Identity |
| Notes | 412 KB PNG; export a smaller WebP. |

#### BR-09 · Default social share image (Open Graph)

| Field | Value |
|---|---|
| Asset name / filename | Default social share image (Open Graph) |
| Asset type | Social share image |
| Format | PNG, 1200x630, 91 KB |
| Path / location | `aci-infotech/public/og-image.png` (URL `/og-image.png`) |
| Page(s) where used | Every page `<head>` (`og:image`, verified in rendered HTML: `https://aciinfotech.com/og-image.png`, 1200x630) |
| Exact section / component | Root layout `<head>` metadata (favicons / Open Graph / Twitter card) — `app/layout.tsx:90,102`<br>Homepage metadata + JSON-LD — `app/page.tsx:92,104,180`<br>Shared Open Graph helper (default share image) — `lib/seo/og.ts:13,20` |
| Purpose / description | Default `og:image` / Twitter card image for every page without its own image (1200x630) |
| Desktop / mobile usage | Both (metadata) |
| Background or foreground | n/a (shown by social platforms) |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (site-wide default metadata) |
| Original source / generation method | Generated by screenshotting the v4 hero in development (commit `03ad74c`, regenerated in `5730717`). Not prompt-generated. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | SEO plugin (Yoast / Rank Math) > Social > default share image; per-post featured images override it |
| Notes | OUTDATED: it is a screenshot of the old white v4 hero, not the current dark v5 homepage. Regenerate before or during migration. Never requested by a browser during a page view, so no crawl request; usage confirmed from HTML. |

## Video files (stored in the project)

#### VID-01 · Homepage hero background loop (WebM)

| Field | Value |
|---|---|
| Asset name / filename | Homepage hero background loop (WebM) |
| Asset type | Video (background loop) |
| Format | WEBM (VP9), 1280x720, 24 fps, 4.25s, 322 KB, no audio |
| Path / location | `aci-infotech/public/videos/office-hero.webm` (URL `/videos/office-hero.webm`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage hero `V5Hero` — `components/v5/V5Hero.tsx:23` |
| Purpose / description | Full-bleed background loop behind the homepage hero headline carousel (first `<source>`, what Chrome/Firefox/Edge play) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay, muted, loop, playsInline; graded overlay + Framer Motion text carousel on top |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Encoded in commit `09655a0` from an ACI-uploaded file `office-home-hero-bg.mp4` (the upload was removed after encoding). Original footage creator/source not recorded. Not documented as AI-generated. |
| Original prompt | Original video source/prompt: Not found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block |
| Notes | 4.25s loop. The MP4 sibling serves Safari. |

#### VID-02 · Homepage hero background loop (MP4)

| Field | Value |
|---|---|
| Asset name / filename | Homepage hero background loop (MP4) |
| Asset type | Video (background loop) |
| Format | MP4 (H264), 1280x720, 24 fps, 4.25s, 417 KB, no audio |
| Path / location | `aci-infotech/public/videos/office-hero.mp4` (URL `/videos/office-hero.mp4`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage hero `V5Hero` — `components/v5/V5Hero.tsx:24` |
| Purpose / description | MP4 fallback of the hero loop (second `<source>`, used by Safari / iOS) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay, muted, loop, playsInline |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Same as office-hero.webm (encoded in `09655a0` from the uploaded `office-home-hero-bg.mp4`). Original source not recorded. |
| Original prompt | Original video source/prompt: Not found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block |
| Notes | Listed in the `<video>` element; Chromium did not fetch it because the WebM played. Required for Safari. |

#### VID-03 · Legacy hero loop (compressed, WebM), hero fallback

| Field | Value |
|---|---|
| Asset name / filename | Legacy hero loop (compressed, WebM), hero fallback |
| Asset type | Video (fallback source) |
| Format | WEBM (VP9), 960x540, 30 fps, 25.03s, 1.2 MB, no audio |
| Path / location | `aci-infotech/public/hero-bg-compressed.webm` (URL `/hero-bg-compressed.webm`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage hero `V5Hero` — `components/v5/V5Hero.tsx:26` |
| Purpose / description | Third `<source>` in the homepage hero video: plays only if both office-hero files fail |
| Desktop / mobile usage | Fallback source only (not fetched when office-hero plays) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay, muted, loop |
| Reusable or page-specific | Reusable (used on 1 page / 4 source locations) |
| Original source / generation method | Getty Images stock clip: compressed (commit `357a3e0`) from `hero-video.*`, which is the ACI-uploaded `GettyImages-1394448388.webm` (identical 5,153,361-byte file; embedded tag "This video is subject to copyright."). |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Do not migrate unless kept as a fallback; the hero already has office-hero |
| Notes | Fallback only; never fetched in the crawl. Getty licence must be confirmed for continued use. Also referenced by internal preview code (components/preview/home/HeroRotator.tsx, components/sections/HeroSection.tsx, components/v2/home/HeroV2.tsx); that does not affect the live site. |

#### VID-04 · Legacy hero video (MP4, 17.5 MB), hero fallback

| Field | Value |
|---|---|
| Asset name / filename | Legacy hero video (MP4, 17.5 MB), hero fallback |
| Asset type | Video (fallback source) |
| Format | MP4 (H264), 1280x720, 30 fps, 25.03s, 16.7 MB, has audio track |
| Path / location | `aci-infotech/public/hero-video.mp4` (URL `/hero-video.mp4`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage hero `V5Hero` — `components/v5/V5Hero.tsx:27` |
| Purpose / description | Fourth / last `<source>` in the homepage hero video; plays only if all earlier sources fail |
| Desktop / mobile usage | Fallback source only (not fetched when office-hero plays) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay, muted, loop |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Getty Images stock clip (same footage as `GettyImages-1394448388.webm`, uploaded by the ACI team 2026-01-07); MP4 added in commit `55d7203`. Embedded tag "This video is subject to copyright." |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Do not migrate (fallback only, 17.5 MB) |
| Notes | 17.5 MB with an audio track. Effectively dead weight behind office-hero; drop it or re-encode. |

#### VID-05 · Success story clip: data-velocity (MP4)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: data-velocity (MP4) |
| Asset type | Video (card media, autoplay loop) |
| Format | MP4 (H264), 960x400, 60 fps, 3.8s, 914 KB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/data-velocity.mp4` (URL `/assets/success-stories/data-velocity.mp4`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:77` |
| Purpose / description | Media panel of the homepage Success Stories Tab 1 "Retail data, rebuilt for operational speed." (MP4 fallback for Safari) |
| Desktop / mobile usage | Desktop + mobile (MP4 fallback; fetched by Safari / iOS) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Pexels stock footage per commit `9dc625e` ("Videos sourced from Pexels, trimmed to 8s, 960x400"). Individual Pexels clip IDs not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes | MP4 listed as fallback; Chromium fetched the WebM. |

#### VID-06 · Success story clip: data-velocity (WEBM)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: data-velocity (WEBM) |
| Asset type | Video (card media, autoplay loop) |
| Format | WEBM (VP9), 960x400, 60 fps, 3.8s, 1.1 MB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/data-velocity.webm` (URL `/assets/success-stories/data-velocity.webm`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:78` |
| Purpose / description | Media panel of the homepage Success Stories Tab 1 "Retail data, rebuilt for operational speed." (WebM, first source) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Pexels stock footage per commit `9dc625e` ("Videos sourced from Pexels, trimmed to 8s, 960x400"). Individual Pexels clip IDs not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes |  |

#### VID-07 · Success story clip: decision-intelligence (MP4)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: decision-intelligence (MP4) |
| Asset type | Video (card media, autoplay loop) |
| Format | MP4 (H264), 960x400, 25 fps, 8s, 446 KB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/decision-intelligence.mp4` (URL `/assets/success-stories/decision-intelligence.mp4`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:97` |
| Purpose / description | Media panel of the homepage Success Stories Tab 2 "A lakehouse that moves models into production faster." (story id ai-in-production) (MP4 fallback for Safari) |
| Desktop / mobile usage | Desktop + mobile (MP4 fallback; fetched by Safari / iOS) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Pexels stock footage per commit `9dc625e` ("Videos sourced from Pexels, trimmed to 8s, 960x400"). Individual Pexels clip IDs not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes | MP4 listed as fallback; Chromium fetched the WebM. |

#### VID-08 · Success story clip: decision-intelligence (WEBM)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: decision-intelligence (WEBM) |
| Asset type | Video (card media, autoplay loop) |
| Format | WEBM (VP9), 960x400, 25 fps, 8s, 294 KB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/decision-intelligence.webm` (URL `/assets/success-stories/decision-intelligence.webm`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:98` |
| Purpose / description | Media panel of the homepage Success Stories Tab 2 "A lakehouse that moves models into production faster." (story id ai-in-production) (WebM, first source) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Pexels stock footage per commit `9dc625e` ("Videos sourced from Pexels, trimmed to 8s, 960x400"). Individual Pexels clip IDs not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes |  |

#### VID-09 · Success story clip: intelligent-operations (MP4)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: intelligent-operations (MP4) |
| Asset type | Video (card media, autoplay loop) |
| Format | MP4 (H264), 960x400, 25 fps, 8s, 806 KB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/intelligent-operations.mp4` (URL `/assets/success-stories/intelligent-operations.mp4`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:137` |
| Purpose / description | Media panel of the homepage Success Stories Tab 4 "Finance reporting, rebuilt on S/4HANA." (story id erp-modernization) (MP4 fallback for Safari) |
| Desktop / mobile usage | Desktop + mobile (MP4 fallback; fetched by Safari / iOS) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Pexels stock footage per commit `9dc625e` ("Videos sourced from Pexels, trimmed to 8s, 960x400"). Individual Pexels clip IDs not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes | MP4 listed as fallback; Chromium fetched the WebM. |

#### VID-10 · Success story clip: intelligent-operations (WEBM)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: intelligent-operations (WEBM) |
| Asset type | Video (card media, autoplay loop) |
| Format | WEBM (VP9), 960x400, 25 fps, 8s, 589 KB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/intelligent-operations.webm` (URL `/assets/success-stories/intelligent-operations.webm`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:138` |
| Purpose / description | Media panel of the homepage Success Stories Tab 4 "Finance reporting, rebuilt on S/4HANA." (story id erp-modernization) (WebM, first source) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Pexels stock footage per commit `9dc625e` ("Videos sourced from Pexels, trimmed to 8s, 960x400"). Individual Pexels clip IDs not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes |  |

#### VID-11 · Success story clip: noc-soc (MP4)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: noc-soc (MP4) |
| Asset type | Video (card media, autoplay loop) - code-rendered (Remotion) |
| Format | MP4 (H264), 1200x674, 30 fps, 8s, 246 KB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/noc-soc.mp4` (URL `/assets/success-stories/noc-soc.mp4`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:157` |
| Purpose / description | Media panel of the homepage Success Stories Tab 5 "Reactive IT put under constant watch." (MP4 fallback for Safari) |
| Desktop / mobile usage | Desktop + mobile (MP4 fallback; fetched by Safari / iOS) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Rendered by code with Remotion (embedded metadata comment "Made with Remotion 4.0.487"; added in commit `a445fbc`). The Remotion composition source is NOT in this repository. |
| Original prompt | Not applicable: code-rendered (Remotion), not prompt-generated. Remotion source/composition: Not found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes | MP4 listed as fallback; Chromium fetched the WebM. Remotion-rendered: keep the rendered file, there is no source project to re-render from. |

#### VID-12 · Success story clip: noc-soc (WEBM)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: noc-soc (WEBM) |
| Asset type | Video (card media, autoplay loop) - code-rendered (Remotion) |
| Format | WEBM (VP9), 1200x674, 30 fps, 8s, 359 KB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/noc-soc.webm` (URL `/assets/success-stories/noc-soc.webm`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:158` |
| Purpose / description | Media panel of the homepage Success Stories Tab 5 "Reactive IT put under constant watch." (WebM, first source) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Rendered by code with Remotion (embedded metadata comment "Made with Remotion 4.0.487"; added in commit `a445fbc`). The Remotion composition source is NOT in this repository. |
| Original prompt | Not applicable: code-rendered (Remotion), not prompt-generated. Remotion source/composition: Not found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes |  Remotion-rendered: keep the rendered file, there is no source project to re-render from. |

#### VID-13 · Success story clip: reliable-scale (MP4)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: reliable-scale (MP4) |
| Asset type | Video (card media, autoplay loop) |
| Format | MP4 (H264), 960x400, 24 fps, 8s, 351 KB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/reliable-scale.mp4` (URL `/assets/success-stories/reliable-scale.mp4`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:117` |
| Purpose / description | Media panel of the homepage Success Stories Tab 3 "A complex digital estate, engineered to stay available." (MP4 fallback for Safari) |
| Desktop / mobile usage | Desktop + mobile (MP4 fallback; fetched by Safari / iOS) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Pexels stock footage per commit `9dc625e` ("Videos sourced from Pexels, trimmed to 8s, 960x400"). Individual Pexels clip IDs not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes | MP4 listed as fallback; Chromium fetched the WebM. |

#### VID-14 · Success story clip: reliable-scale (WEBM)

| Field | Value |
|---|---|
| Asset name / filename | Success story clip: reliable-scale (WEBM) |
| Asset type | Video (card media, autoplay loop) |
| Format | WEBM (VP9), 960x400, 24 fps, 8s, 130 KB, no audio |
| Path / location | `aci-infotech/public/assets/success-stories/reliable-scale.webm` (URL `/assets/success-stories/reliable-scale.webm`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:118` |
| Purpose / description | Media panel of the homepage Success Stories Tab 3 "A complex digital estate, engineered to stay available." (WebM, first source) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground (media panel inside the tab card) |
| Animation / motion usage | Autoplay muted loop; 700ms crossfade between stacked tab videos (Framer Motion AnimatePresence); 8s auto-rotate with CSS progress bar `ss-progress`; only active/outgoing clip plays (IntersectionObserver) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Pexels stock footage per commit `9dc625e` ("Videos sourced from Pexels, trimmed to 8s, 960x400"). Individual Pexels clip IDs not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; tabs need a custom block (or tabs plugin) with per-tab video fields |
| Notes |  |

#### VID-15 · Ray-Ban Meta lucky-draw film

| Field | Value |
|---|---|
| Asset name / filename | Ray-Ban Meta lucky-draw film |
| Asset type | Video (background loop) |
| Format | MP4 (H264), 1280x720, 25 fps, 11s, 470 KB, no audio |
| Path / location | `aci-infotech/public/videos/aion-2026/draw-promo.mp4` (URL `/videos/aion-2026/draw-promo.mp4`) |
| Page(s) where used | `/lp/digital-trust-summit-2026` |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:945` |
| Purpose / description | Background film of the "lucky draw" section on the AION 2026 LP, under the floating Ray-Ban Meta product shot |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay muted loop; product PNG floats on top with CSS `float_7s` keyframes |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Third-party brand film: the official Ray-Ban Meta campaign film from the Luxottica media CDN (commit `2841b62`), compressed in `03f22f4`. |
| Original prompt | Not applicable: third-party brand campaign film, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block |
| Notes | Third-party brand asset: confirm usage rights before re-publishing on WordPress. |

#### VID-16 · AION 2026 hero poster frame

| Field | Value |
|---|---|
| Asset name / filename | AION 2026 hero poster frame |
| Asset type | Video poster image |
| Format | WEBP, 1280x720, 119 KB |
| Path / location | `aci-infotech/public/videos/aion-2026/event-hero-poster.webp` (URL `/videos/aion-2026/event-hero-poster.webp`) |
| Page(s) where used | `/lp/digital-trust-summit-2026` |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:495` |
| Purpose / description | `poster` frame of the AION hero film (shown before the video plays) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Background |
| Animation / motion usage | None (static poster) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Frame exported from event-hero.mp4 in commit `03f22f4`. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image (set as the Cover block poster) |
| Notes |  |

#### VID-17 · AION 2026 event-floor hero film

| Field | Value |
|---|---|
| Asset name / filename | AION 2026 event-floor hero film |
| Asset type | Video (background loop) |
| Format | MP4 (H264), 1280x720, 30 fps, 10s, 1.6 MB, no audio |
| Path / location | `aci-infotech/public/videos/aion-2026/event-hero.mp4` (URL `/videos/aion-2026/event-hero.mp4`) |
| Page(s) where used | `/lp/digital-trust-summit-2026` |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:498` |
| Purpose / description | Hero background film on /lp/digital-trust-summit-2026 |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay muted loop with navy gradient + film-grain overlay |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Stock footage: embedded metadata `copyright: "2025 Rawpixel Ltd."` and a stock-library `title` tag. Added in commit `03f22f4` ("real event hero film"), compressed 6.3 MB -> 1.7 MB. |
| Original prompt | Not applicable: stock footage. The embedded `title` tag ("Wide-angle shot of a bustling tech expo, showcasing attendees exploring innovative displays and video screens under modern lighting.") is the stock library's description, not a confirmed generation prompt. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block |
| Notes | Event LP for a past/dated event; decide whether to migrate the LP at all. Confirm the Rawpixel licence. |

#### VID-18 · "Foldcraft" sphere video (MP4, 7.3 MB)

| Field | Value |
|---|---|
| Asset name / filename | "Foldcraft" sphere video (MP4, 7.3 MB) |
| Asset type | Video (background loop) |
| Format | MP4 (H264), 1920x1080, 24 fps, 8.04s, 7.3 MB, no audio |
| Path / location | `aci-infotech/public/videos/foldcraft.mp4` (URL `/videos/foldcraft.mp4`) |
| Page(s) where used | `/`, `/services/data-engineering` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `FoldcraftHero` band (service / industry / platform pages) — `components/v4/hero/FoldcraftHero.tsx:115`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:207`<br>Homepage video band `V5Foldcraft` — `components/v5/V5Foldcraft.tsx:77` |
| Purpose / description | MP4 fallback of the Foldcraft loop (Safari / iOS) |
| Desktop / mobile usage | Desktop + mobile (MP4 fallback; fetched by Safari / iOS) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay muted loop (lazy play via IntersectionObserver) |
| Reusable or page-specific | Reusable (used on 2 pages / 3 source locations) |
| Original source / generation method | Added in development commit `8ff0336` (2026-07-11): "feat(v4): webm video sources, bigger marquee logos, Foldcraft section". |
| Original prompt | Original video source/prompt: Not found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block |
| Notes | Origin not documented (first appears in commit `8ff0336`). 7.3 MB at 1920x1080: compress before upload. |

#### VID-19 · "Foldcraft" sphere video (WebM)

| Field | Value |
|---|---|
| Asset name / filename | "Foldcraft" sphere video (WebM) |
| Asset type | Video (background loop) |
| Format | WEBM (VP9), 1600x900, 24 fps, 8.04s, 1.4 MB, no audio |
| Path / location | `aci-infotech/public/videos/foldcraft.webm` (URL `/videos/foldcraft.webm`) |
| Page(s) where used | `/`, `/services/data-engineering` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `FoldcraftHero` band (service / industry / platform pages) — `components/v4/hero/FoldcraftHero.tsx:114`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:206`<br>Homepage video band `V5Foldcraft` — `components/v5/V5Foldcraft.tsx:76` |
| Purpose / description | Background loop of the homepage `V5Foldcraft` band; feature card video in the desktop mega menu Services panel; FoldcraftHero video on /services/data-engineering |
| Desktop / mobile usage | Desktop + mobile (observed on 2 desktop / 2 mobile pages); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay muted loop; plays only while near the viewport (IntersectionObserver); CSS rotating text badge (`v5-badge-spin`) overlaid on homepage |
| Reusable or page-specific | Reusable (used on 2 pages / 3 source locations) |
| Original source / generation method | Added in development commit `8ff0336` (2026-07-11): "feat(v4): webm video sources, bigger marquee logos, Foldcraft section". |
| Original prompt | Original video source/prompt: Not found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block |
| Notes | Origin not documented anywhere in the repo (added by commit `8ff0336` as a WebM encode of foldcraft.mp4). Cannot confirm whether it is stock, filmed or AI-generated: ask the person who supplied it. |

#### VID-20 · Retail store background video

| Field | Value |
|---|---|
| Asset name / filename | Retail store background video |
| Asset type | Video (background loop) |
| Format | MP4 (H264), 1280x720, 24 fps, 10.54s, 6.7 MB, no audio |
| Path / location | `aci-infotech/public/videos/retail-bg.mp4` (URL `/videos/retail-bg.mp4`) |
| Page(s) where used | `/industries/retail`, `/platforms/braze`, `/platforms/databricks`, `/platforms/salesforce`, `/services/app-development`, `/services/applied-ai-ml`, `/services/martech-cdp` |
| Exact section / component | `/industries/retail` page (<CmsProofCards>) — `app/industries/retail/page.tsx:289`<br>`/platforms/braze` page (<CmsProofCards>) — `app/platforms/braze/page.tsx:300`<br>`/platforms/databricks` page (<CmsProofCards>) — `app/platforms/databricks/page.tsx:282`<br>`/platforms/salesforce` page (<CmsProofCards>) — `app/platforms/salesforce/page.tsx:302`<br>`/services/app-development` page (<CmsProofCards>) — `app/services/app-development/page.tsx:402`<br>`/services/data-engineering` page (<CmsProofCards>) — `app/services/data-engineering/page.tsx:311`<br>`/services/martech-cdp` page (<CmsProofCards>) — `app/services/martech-cdp/page.tsx:365`<br>`CmsProofCards` proof-card grid (industry fallback backdrops / feature-card video) — `components/v4/page/CmsProofCards.tsx:94` |
| Purpose / description | Feature-card backdrop video in `ProofCards` when the lead case study is retail (CMS proof grid) and the authored fallback on retail-adjacent pages |
| Desktop / mobile usage | Desktop + mobile (observed on 7 desktop / 1 mobile page) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay muted loop |
| Reusable or page-specific | Reusable (used on 7 pages / 8 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-06-25 (commit `c4df179`). Original creator / source not recorded in project. |
| Original prompt | Original video source/prompt: Not found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block |
| Notes | Uploaded by the ACI team 2026-06-25 (commit `c4df179`); original footage source not recorded. 6.7 MB, no WebM sibling: compress and add WebM. |

#### VID-21 · "Signal" sphere video (MP4)

| Field | Value |
|---|---|
| Asset name / filename | "Signal" sphere video (MP4) |
| Asset type | Video (background / masked circle) |
| Format | MP4 (H264), 960x540, 30 fps, 6s, 433 KB, no audio |
| Path / location | `aci-infotech/public/videos/v4-editorial-signal.mp4` (URL `/videos/v4-editorial-signal.mp4`) |
| Page(s) where used | Rendered on 83 of 145 crawled desktop pages: `/about`, `/blogs/*` (6), `/careers`, `/case-studies` + `/case-studies/*` (30), `/industries` + `/industries/*` (9), `/partners`, `/platforms` + `/platforms/*` (11), `/playbooks` + `/playbooks/*` (11), `/services` + `/services/*` (12), `/whitepapers`. |
| Exact section / component | Closing CTA band `CtaSection` (blog posts, service, industry, platform pages) — `components/v4/hero/CtaSection.tsx:8`<br>Shared page kit `kit.tsx` (DecisionCircle / DecisionPanel / ProofCards / BridgeBand) — `components/v4/page/kit.tsx:227,305` |
| Purpose / description | Circular video window in `DecisionCircle` / `DecisionPanel` (two-way comparison on service + platform pages) and the background of the closing `CtaSection` band |
| Desktop / mobile usage | Desktop + mobile (MP4 fallback; fetched by Safari / iOS) |
| Background or foreground | Background (inside a circular mask in DecisionPanel) |
| Animation / motion usage | Autoplay muted loop; `FadingVideo` lazy play + JS fade |
| Reusable or page-specific | Reusable (used on 83 pages / 2 source locations) |
| Original source / generation method | Getty Images stock clip per commit `fb714ca` ("Replaced the hero video with the new GettyImages source, compressed ... 21MB-class source down to ~440KB"). Embedded tag "This video is subject to copyright." Getty asset ID not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block |
| Notes | Getty licence must cover continued web use after migration. |

#### VID-22 · "Signal" sphere video (WEBM)

| Field | Value |
|---|---|
| Asset name / filename | "Signal" sphere video (WEBM) |
| Asset type | Video (background / masked circle) |
| Format | WEBM (VP9), 960x540, 30 fps, 6s, 602 KB, no audio |
| Path / location | `aci-infotech/public/videos/v4-editorial-signal.webm` (URL `/videos/v4-editorial-signal.webm`) |
| Page(s) where used | Rendered on 83 of 145 crawled desktop pages: `/about`, `/blogs/*` (6), `/careers`, `/case-studies` + `/case-studies/*` (30), `/industries` + `/industries/*` (9), `/partners`, `/platforms` + `/platforms/*` (11), `/playbooks` + `/playbooks/*` (11), `/services` + `/services/*` (12), `/whitepapers`. |
| Exact section / component | Closing CTA band `CtaSection` (blog posts, service, industry, platform pages) — `components/v4/hero/CtaSection.tsx:9`<br>Shared page kit `kit.tsx` (DecisionCircle / DecisionPanel / ProofCards / BridgeBand) — `components/v4/page/kit.tsx:227,305` |
| Purpose / description | Circular video window in `DecisionCircle` / `DecisionPanel` (two-way comparison on service + platform pages) and the background of the closing `CtaSection` band |
| Desktop / mobile usage | Desktop + mobile (observed on 83 desktop / 8 mobile pages) |
| Background or foreground | Background (inside a circular mask in DecisionPanel) |
| Animation / motion usage | Autoplay muted loop; `FadingVideo` lazy play + JS fade |
| Reusable or page-specific | Reusable (used on 83 pages / 2 source locations) |
| Original source / generation method | Getty Images stock clip per commit `fb714ca` ("Replaced the hero video with the new GettyImages source, compressed ... 21MB-class source down to ~440KB"). Embedded tag "This video is subject to copyright." Getty asset ID not recorded. |
| Original prompt | Not applicable: stock footage, not prompt-generated. No prompt found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block |
| Notes | Getty licence must cover continued web use after migration. |

#### VID-23 · BridgeBand background film (MP4)

| Field | Value |
|---|---|
| Asset name / filename | BridgeBand background film (MP4) |
| Asset type | Video (background loop) |
| Format | MP4 (H264), 1924x1076, 24 fps, 10.04s, 19.1 MB, no audio |
| Path / location | `aci-infotech/public/videos/v4-slide1.mp4` (URL `/videos/v4-slide1.mp4`) |
| Page(s) where used | Rendered on 30 of 145 crawled desktop pages: `/about`, `/industries/*` (8), `/platforms/*` (10), `/services/*` (11). |
| Exact section / component | Shared page kit `kit.tsx` (DecisionCircle / DecisionPanel / ProofCards / BridgeBand) — `components/v4/page/kit.tsx:511` |
| Purpose / description | Default background film of the `BridgeBand` section (bottom bridge band on /about, all industry, service and platform pages) |
| Desktop / mobile usage | Desktop + mobile (MP4 fallback; fetched by Safari / iOS) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay muted loop via `FadingVideo` (lazy load, JS fade-in, pauses off-screen) |
| Reusable or page-specific | Reusable (used on 30 pages / 1 source location) |
| Original source / generation method | Added in development commit `6eb620c` (2026-07-11): "feat(v4): two-slide morphing hero deck (Asme + VEX)". |
| Original prompt | Original video source/prompt: Not found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; one reusable "bridge band" pattern/block |
| Notes | 20 MB MP4 at 1924x1076: must be compressed. Origin not documented: commit `6eb620c` only says "Slide-1 video sourced to public/videos/v4-slide1.mp4". Cannot confirm stock vs AI-generated. |

#### VID-24 · BridgeBand background film (WEBM)

| Field | Value |
|---|---|
| Asset name / filename | BridgeBand background film (WEBM) |
| Asset type | Video (background loop) |
| Format | WEBM (VP9), 1600x894, 24 fps, 10.04s, 2.7 MB, no audio |
| Path / location | `aci-infotech/public/videos/v4-slide1.webm` (URL `/videos/v4-slide1.webm`) |
| Page(s) where used | Rendered on 30 of 145 crawled desktop pages: `/about`, `/industries/*` (8), `/platforms/*` (10), `/services/*` (11). |
| Exact section / component | Shared page kit `kit.tsx` (DecisionCircle / DecisionPanel / ProofCards / BridgeBand) — `components/v4/page/kit.tsx:511` |
| Purpose / description | Default background film of the `BridgeBand` section (bottom bridge band on /about, all industry, service and platform pages) |
| Desktop / mobile usage | Desktop + mobile (observed on 30 desktop / 4 mobile pages) |
| Background or foreground | Background |
| Animation / motion usage | Autoplay muted loop via `FadingVideo` (lazy load, JS fade-in, pauses off-screen) |
| Reusable or page-specific | Reusable (used on 30 pages / 1 source location) |
| Original source / generation method | Added in development commit `8ff0336` (2026-07-11): "feat(v4): webm video sources, bigger marquee logos, Foldcraft section". |
| Original prompt | Original video source/prompt: Not found in project. |
| WordPress migration requirement | Media Library (or a video CDN such as Bunny/Vimeo for files over ~5 MB); Cover block background video or custom block; one reusable "bridge band" pattern/block |
| Notes | Origin not documented: commit `6eb620c` only says "Slide-1 video sourced to public/videos/v4-slide1.mp4". Cannot confirm stock vs AI-generated. |

## Photography and illustrations

#### PH-01 · About parallax balloon 1 (PNG)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon 1 (PNG) |
| Asset type | Illustration / cut-out (transparent) |
| Format | PNG, 988x913, 49 KB |
| Path / location | `aci-infotech/public/images/about-page-img/1.png` (URL `/images/about-page-img/1.png`) |
| Page(s) where used | `/about` (referenced in markup; the browser does not fetch it, see Notes) |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:42` |
| Purpose / description | White hot air balloon with ACI logo: layer of the About hero parallax scene (PNG `<img>` fallback in `<picture>`) |
| Desktop / mobile usage | Fallback only: browsers with WebP support (all current ones) never fetch it |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `56f9d0e`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes | PNG fallback of a `<picture>` element; not fetched by modern browsers. Migrate only the WebP (or let WP generate WebP from the PNG). |

#### PH-02 · About parallax balloon 1 (WEBP)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon 1 (WEBP) |
| Asset type | Illustration / cut-out (transparent) |
| Format | WEBP, 988x913, 20 KB |
| Path / location | `aci-infotech/public/images/about-page-img/1.webp` (URL `/images/about-page-img/1.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:43` |
| Purpose / description | White hot air balloon with ACI logo: layer of the About hero parallax scene (WebP `<source>`) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | WebP conversion made in development (commit `1bb969e`/`8a63320`) from the ACI-uploaded PNG. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes |  |

#### PH-03 · About parallax balloon 2 (PNG)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon 2 (PNG) |
| Asset type | Illustration / cut-out (transparent) |
| Format | PNG, 727x579, 53 KB |
| Path / location | `aci-infotech/public/images/about-page-img/2.png` (URL `/images/about-page-img/2.png`) |
| Page(s) where used | `/about` (referenced in markup; the browser does not fetch it, see Notes) |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:53` |
| Purpose / description | Orange hot air balloon with ACI logo: layer of the About hero parallax scene (PNG `<img>` fallback in `<picture>`) |
| Desktop / mobile usage | Fallback only: browsers with WebP support (all current ones) never fetch it |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `56f9d0e`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes | PNG fallback of a `<picture>` element; not fetched by modern browsers. Migrate only the WebP (or let WP generate WebP from the PNG). |

#### PH-04 · About parallax balloon 2 (WEBP)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon 2 (WEBP) |
| Asset type | Illustration / cut-out (transparent) |
| Format | WEBP, 727x579, 19 KB |
| Path / location | `aci-infotech/public/images/about-page-img/2.webp` (URL `/images/about-page-img/2.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:54` |
| Purpose / description | Orange hot air balloon with ACI logo: layer of the About hero parallax scene (WebP `<source>`) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | WebP conversion made in development (commit `1bb969e`/`8a63320`) from the ACI-uploaded PNG. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes |  |

#### PH-05 · About parallax balloon 3 (PNG)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon 3 (PNG) |
| Asset type | Illustration / cut-out (transparent) |
| Format | PNG, 432x440, 13 KB |
| Path / location | `aci-infotech/public/images/about-page-img/3.png` (URL `/images/about-page-img/3.png`) |
| Page(s) where used | `/about` (referenced in markup; the browser does not fetch it, see Notes) |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:20` |
| Purpose / description | Hot air balloon in distance: layer of the About hero parallax scene (PNG `<img>` fallback in `<picture>`) |
| Desktop / mobile usage | Fallback only: browsers with WebP support (all current ones) never fetch it |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `56f9d0e`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes | PNG fallback of a `<picture>` element; not fetched by modern browsers. Migrate only the WebP (or let WP generate WebP from the PNG). |

#### PH-06 · About parallax balloon 3 (WEBP)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon 3 (WEBP) |
| Asset type | Illustration / cut-out (transparent) |
| Format | WEBP, 432x440, 6 KB |
| Path / location | `aci-infotech/public/images/about-page-img/3.webp` (URL `/images/about-page-img/3.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:21` |
| Purpose / description | Hot air balloon in distance: layer of the About hero parallax scene (WebP `<source>`) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | WebP conversion made in development (commit `1bb969e`/`8a63320`) from the ACI-uploaded PNG. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes |  |

#### PH-07 · About parallax balloon 4 (PNG)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon 4 (PNG) |
| Asset type | Illustration / cut-out (transparent) |
| Format | PNG, 408x563, 31 KB |
| Path / location | `aci-infotech/public/images/about-page-img/4.png` (URL `/images/about-page-img/4.png`) |
| Page(s) where used | `/about` (referenced in markup; the browser does not fetch it, see Notes) |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:31` |
| Purpose / description | Hot air balloons floating: layer of the About hero parallax scene (PNG `<img>` fallback in `<picture>`) |
| Desktop / mobile usage | Fallback only: browsers with WebP support (all current ones) never fetch it |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `56f9d0e`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes | PNG fallback of a `<picture>` element; not fetched by modern browsers. Migrate only the WebP (or let WP generate WebP from the PNG). |

#### PH-08 · About parallax balloon 4 (WEBP)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon 4 (WEBP) |
| Asset type | Illustration / cut-out (transparent) |
| Format | WEBP, 408x563, 16 KB |
| Path / location | `aci-infotech/public/images/about-page-img/4.webp` (URL `/images/about-page-img/4.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:32` |
| Purpose / description | Hot air balloons floating: layer of the About hero parallax scene (WebP `<source>`) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | WebP conversion made in development (commit `1bb969e`/`8a63320`) from the ACI-uploaded PNG. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes |  |

#### PH-09 · About hero sky background (JPEG fallback)

| Field | Value |
|---|---|
| Asset name / filename | About hero sky background (JPEG fallback) |
| Asset type | Photograph (scene background) |
| Format | JPG, 1920x1097, 271 KB |
| Path / location | `aci-infotech/public/images/about-page-img/bg.jpg` (URL `/images/about-page-img/bg.jpg`) |
| Page(s) where used | `/about` |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:128` |
| Purpose / description | JPEG `<img>` fallback inside the same `<picture>` element |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Background |
| Animation / motion usage | Scroll parallax (JS scroll listener translates layers at different speeds) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `56f9d0e`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS or a parallax block |
| Notes | Fetched by Chromium as well as the WebP (it is the `<img>` src); keep one format in WordPress. |

#### PH-10 · About hero sky background (WebP)

| Field | Value |
|---|---|
| Asset name / filename | About hero sky background (WebP) |
| Asset type | Photograph (scene background) |
| Format | WEBP, 1920x1097, 208 KB |
| Path / location | `aci-infotech/public/images/about-page-img/bg.webp` (URL `/images/about-page-img/bg.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:126` |
| Purpose / description | Sky/cloud background of the About hero parallax scene (`<picture>` WebP source) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Background |
| Animation / motion usage | Scroll parallax (JS scroll listener translates layers at different speeds) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | WebP conversion created in commit `8a63320` from the ACI-uploaded bg.jpg. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS or a parallax block |
| Notes |  |

#### PH-11 · About parallax balloon last (PNG)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon last (PNG) |
| Asset type | Illustration / cut-out (transparent) |
| Format | PNG, 1920x1120, 177 KB |
| Path / location | `aci-infotech/public/images/about-page-img/last.png` (URL `/images/about-page-img/last.png`) |
| Page(s) where used | `/about` |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:67` |
| Purpose / description | ACI Infotech branded hot air balloon rising (hero balloon): layer of the About hero parallax scene (PNG `<img>` fallback in `<picture>`) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `56f9d0e`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes |  |

#### PH-12 · About parallax balloon last (WEBP)

| Field | Value |
|---|---|
| Asset name / filename | About parallax balloon last (WEBP) |
| Asset type | Illustration / cut-out (transparent) |
| Format | WEBP, 1920x1120, 57 KB |
| Path / location | `aci-infotech/public/images/about-page-img/last.webp` (URL `/images/about-page-img/last.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | About hero parallax balloon scene `ParallaxBalloons` — `components/about/ParallaxBalloons.tsx:68` |
| Purpose / description | ACI Infotech branded hot air balloon rising (hero balloon): layer of the About hero parallax scene (WebP `<source>`) |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground layer (decorative) |
| Animation / motion usage | Scroll parallax: each balloon moves at its own speed (JS scroll listener) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | WebP conversion made in development (commit `1bb969e`/`8a63320`) from the ACI-uploaded PNG. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image; parallax needs theme JS |
| Notes |  |

#### PH-13 · Intelligent Automation capability image

| Field | Value |
|---|---|
| Asset name / filename | Intelligent Automation capability image |
| Asset type | Photograph |
| Format | JPG, 1000x667, 84 KB |
| Path / location | `aci-infotech/public/images/digital-transformation.jpg` (URL `/images/digital-transformation.jpg`) |
| Page(s) where used | `/about` |
| Exact section / component | About "What we build" `CapabilityBars` (hover image takeover) — `components/about/CapabilityBars.tsx:66` |
| Purpose / description | Hover takeover image for the "Intelligent Automation" bar in About > What we build |
| Desktop / mobile usage | Desktop (hover interaction); touch devices load it on tap/focus |
| Background or foreground | Background (hover only) |
| Animation / motion usage | Fades in on hover (CSS); fetched only on pointer-enter |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-13 (commit `6e7abfb`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | Loaded only after hovering; confirmed in the interaction crawl. |

#### PH-14 · MarTech & CDP capability image

| Field | Value |
|---|---|
| Asset name / filename | MarTech & CDP capability image |
| Asset type | Photograph |
| Format | JPG, 1000x753, 60 KB |
| Path / location | `aci-infotech/public/images/martech-cdp.jpg` (URL `/images/martech-cdp.jpg`) |
| Page(s) where used | `/about` |
| Exact section / component | About "What we build" `CapabilityBars` (hover image takeover) — `components/about/CapabilityBars.tsx:55` |
| Purpose / description | Hover takeover image for the "MarTech & CDP" bar in About > What we build |
| Desktop / mobile usage | Desktop (hover interaction); touch devices load it on tap/focus |
| Background or foreground | Background (hover only, under dark gradient) |
| Animation / motion usage | Fades in on hover (CSS opacity 500ms + scale 700ms); fetched only on pointer-enter |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-13 (commit `6e7abfb`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | Loaded only after hovering the bar; confirmed in the interaction crawl. |

#### PH-15 · Retail case backdrop (preview set)

| Field | Value |
|---|---|
| Asset name / filename | Retail case backdrop (preview set) |
| Asset type | Photograph |
| Format | JPG, 1100x580, 63 KB |
| Path / location | `aci-infotech/public/images/preview-bg/case-retail.jpg` (URL `/images/preview-bg/case-retail.jpg`) |
| Page(s) where used | `/lp/digital-trust-summit-2026` |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:297` |
| Purpose / description | Retail case card image on the AION 2026 LP |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Background |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 1 page / 2 source locations) |
| Original source / generation method | Added in development commit `0a28ca4` (2026-06-25): "content+design(preview): supply-chain video, services, hover work". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | Lives in a preview folder but is used by a public LP. Also referenced by internal preview code (components/v3/next/V3Next.tsx); that does not affect the live site. |

#### PH-16 · v4 photo: case-energy

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: case-energy |
| Asset type | Photograph |
| Format | JPG, 1600x1067, 123 KB |
| Path / location | `aci-infotech/public/images/v4/case-energy.jpg` (URL `/images/v4/case-energy.jpg`) |
| Page(s) where used | `/platforms/azure` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/case-studies` listing card backdrop (fallback when a study has no CMS image) — `app/case-studies/CaseStudiesClient.tsx:63,64`<br>`/platforms/azure` page (<FoldcraftHero>) — `app/platforms/azure/page.tsx:244`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:143`<br>`CmsProofCards` proof-card grid (industry fallback backdrops / feature-card video) — `components/v4/page/CmsProofCards.tsx:29,30`<br>Shared page kit `kit.tsx` (DecisionCircle / DecisionPanel / ProofCards / BridgeBand) — `components/v4/page/kit.tsx:375` |
| Purpose / description | Energy backdrop: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 1 page / 5 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-17 · v4 photo: case-finance

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: case-finance |
| Asset type | Photograph |
| Format | JPG, 1600x901, 171 KB |
| Path / location | `aci-infotech/public/images/v4/case-finance.jpg` (URL `/images/v4/case-finance.jpg`) |
| Page(s) where used | `/industries/energy`, `/industries/financial-services`, `/industries/hospitality`, `/industries/oil-gas`, `/lp/digital-trust-summit-2026`, `/platforms/aws`, `/platforms/azure`, `/platforms/braze`, `/platforms/gcp`, `/platforms/sap`, `/platforms/snowflake`, `/services/advisory-strategy`, `/services/app-development`, `/services/cyber-security`, `/services/digital-transformation` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/case-studies` listing card backdrop (fallback when a study has no CMS image) — `app/case-studies/CaseStudiesClient.tsx:56,57,58`<br>`/industries/energy` page (PROOF_FALLBACK) — `app/industries/energy/page.tsx:139`<br>`/industries/financial-services` page (<FoldcraftHero>, PROOF_FALLBACK) — `app/industries/financial-services/page.tsx:107,117,218`<br>`/industries/hospitality` page (PROOF_FALLBACK) — `app/industries/hospitality/page.tsx:131`<br>`/industries/oil-gas` page (PROOF_FALLBACK) — `app/industries/oil-gas/page.tsx:141`<br>`/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:306`<br>`/platforms/aws` page (PROOF_FALLBACK) — `app/platforms/aws/page.tsx:115`<br>`/platforms/azure` page (PROOF_FALLBACK) — `app/platforms/azure/page.tsx:105`<br>`/platforms/braze` page (PROOF_FALLBACK) — `app/platforms/braze/page.tsx:114`<br>`/platforms/databricks` page (PROOF_FALLBACK) — `app/platforms/databricks/page.tsx:115`<br>`/platforms/gcp` page (PROOF_FALLBACK) — `app/platforms/gcp/page.tsx:115`<br>`/platforms/sap` page (PROOF_FALLBACK) — `app/platforms/sap/page.tsx:105`<br>`/platforms/snowflake` page (<FoldcraftHero>, PROOF_FALLBACK) — `app/platforms/snowflake/page.tsx:116,217`<br>`/services/advisory-strategy` page (<FoldcraftHero>) — `app/services/advisory-strategy/page.tsx:244`<br>`/services/app-development` page (PROOF) — `app/services/app-development/page.tsx:134`<br>`/services/applied-ai-ml` page (PROOF) — `app/services/applied-ai-ml/page.tsx:108`<br>`/services/cyber-security` page (PROOF) — `app/services/cyber-security/page.tsx:110`<br>`/services/data-engineering` page (PROOF) — `app/services/data-engineering/page.tsx:116`<br>`/services/digital-transformation` page (PROOF) — `app/services/digital-transformation/page.tsx:129`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:138`<br>`CmsProofCards` proof-card grid (industry fallback backdrops / feature-card video) — `components/v4/page/CmsProofCards.tsx:22,23,24`<br>Shared page kit `kit.tsx` (DecisionCircle / DecisionPanel / ProofCards / BridgeBand) — `components/v4/page/kit.tsx:375` |
| Purpose / description | Financial-services backdrop (Frankfurt skyline per SOURCES.md): a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop + mobile (observed on 15 desktop / 2 mobile pages); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 15 pages / 22 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-18 · v4 photo: case-healthcare

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: case-healthcare |
| Asset type | Photograph |
| Format | JPG, 1600x1067, 145 KB |
| Path / location | `aci-infotech/public/images/v4/case-healthcare.jpg` (URL `/images/v4/case-healthcare.jpg`) |
| Page(s) where used | `/platforms/microsoft-dynamics`, `/platforms/salesforce`, `/platforms/servicenow`, `/services/cyber-security` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/case-studies` listing card backdrop (fallback when a study has no CMS image) — `app/case-studies/CaseStudiesClient.tsx:59`<br>`/industries/healthcare` page (PROOF_FALLBACK) — `app/industries/healthcare/page.tsx:107`<br>`/platforms/microsoft-dynamics` page (PROOF_FALLBACK) — `app/platforms/microsoft-dynamics/page.tsx:121`<br>`/platforms/salesforce` page (PROOF_FALLBACK) — `app/platforms/salesforce/page.tsx:116`<br>`/platforms/servicenow` page (PROOF_FALLBACK) — `app/platforms/servicenow/page.tsx:116`<br>`/services/applied-ai-ml` page (PROOF) — `app/services/applied-ai-ml/page.tsx:117`<br>`/services/cyber-security` page (PROOF) — `app/services/cyber-security/page.tsx:101`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:139`<br>`CmsProofCards` proof-card grid (industry fallback backdrops / feature-card video) — `components/v4/page/CmsProofCards.tsx:25` |
| Purpose / description | Healthcare backdrop: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop observed (4 pages); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 4 pages / 9 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-19 · v4 photo: case-manufacturing

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: case-manufacturing |
| Asset type | Photograph |
| Format | JPG, 1600x1003, 175 KB |
| Path / location | `aci-infotech/public/images/v4/case-manufacturing.jpg` (URL `/images/v4/case-manufacturing.jpg`) |
| Page(s) where used | `/platforms/sap`, `/services/quality-engineering` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/case-studies` listing card backdrop (fallback when a study has no CMS image) — `app/case-studies/CaseStudiesClient.tsx:60`<br>`/industries/manufacturing` page (PROOF_FALLBACK) — `app/industries/manufacturing/page.tsx:117`<br>`/platforms/sap` page (<FoldcraftHero>) — `app/platforms/sap/page.tsx:242`<br>`/services/cloud-modernization` page (PROOF) — `app/services/cloud-modernization/page.tsx:145`<br>`/services/quality-engineering` page (<FoldcraftHero>) — `app/services/quality-engineering/page.tsx:296`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:142`<br>`CmsProofCards` proof-card grid (industry fallback backdrops / feature-card video) — `components/v4/page/CmsProofCards.tsx:26` |
| Purpose / description | Manufacturing backdrop: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop observed (2 pages); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 2 pages / 7 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-20 · v4 photo: case-retail

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: case-retail |
| Asset type | Photograph |
| Format | JPG, 1600x1067, 292 KB |
| Path / location | `aci-infotech/public/images/v4/case-retail.jpg` (URL `/images/v4/case-retail.jpg`) |
| Page(s) where used | `/industries/energy`, `/industries/hospitality`, `/industries/oil-gas`, `/lp/digital-trust-summit-2026`, `/platforms/aws`, `/platforms/azure`, `/platforms/braze`, `/platforms/gcp`, `/platforms/microsoft-dynamics`, `/platforms/salesforce`, `/platforms/sap`, `/platforms/snowflake`, `/services/cyber-security`, `/services/martech-cdp` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/case-studies` listing card backdrop (fallback when a study has no CMS image) — `app/case-studies/CaseStudiesClient.tsx:54,55,65,66`<br>`/industries/energy` page (PROOF_FALLBACK) — `app/industries/energy/page.tsx:129`<br>`/industries/healthcare` page (PROOF_FALLBACK) — `app/industries/healthcare/page.tsx:117`<br>`/industries/hospitality` page (PROOF_FALLBACK) — `app/industries/hospitality/page.tsx:111`<br>`/industries/oil-gas` page (PROOF_FALLBACK) — `app/industries/oil-gas/page.tsx:131`<br>`/industries/retail` page (PROOF_FALLBACK) — `app/industries/retail/page.tsx:107,117`<br>`/industries/transportation` page (PROOF_FALLBACK) — `app/industries/transportation/page.tsx:129`<br>`/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:279`<br>`/platforms/aws` page (PROOF_FALLBACK) — `app/platforms/aws/page.tsx:125`<br>`/platforms/azure` page (PROOF_FALLBACK) — `app/platforms/azure/page.tsx:115`<br>`/platforms/braze` page (PROOF_FALLBACK) — `app/platforms/braze/page.tsx:124`<br>`/platforms/databricks` page (PROOF_FALLBACK) — `app/platforms/databricks/page.tsx:125`<br>`/platforms/gcp` page (PROOF_FALLBACK) — `app/platforms/gcp/page.tsx:105`<br>`/platforms/microsoft-dynamics` page (PROOF_FALLBACK) — `app/platforms/microsoft-dynamics/page.tsx:131`<br>`/platforms/salesforce` page (<FoldcraftHero>, PROOF_FALLBACK) — `app/platforms/salesforce/page.tsx:106,243`<br>`/platforms/sap` page (PROOF_FALLBACK) — `app/platforms/sap/page.tsx:115`<br>`/platforms/snowflake` page (PROOF_FALLBACK) — `app/platforms/snowflake/page.tsx:126`<br>`/services/cloud-modernization` page (PROOF) — `app/services/cloud-modernization/page.tsx:136`<br>`/services/cyber-security` page (PROOF) — `app/services/cyber-security/page.tsx:119`<br>`/services/data-engineering` page (PROOF) — `app/services/data-engineering/page.tsx:125`<br>`/services/martech-cdp` page (<FoldcraftHero>, PROOF) — `app/services/martech-cdp/page.tsx:124,248`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:140,352`<br>`CmsProofCards` proof-card grid (industry fallback backdrops / feature-card video) — `components/v4/page/CmsProofCards.tsx:20,21,31,32` |
| Purpose / description | Retail backdrop: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop + mobile (observed on 14 desktop / 2 mobile pages); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 14 pages / 23 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-21 · v4 photo: case-transport

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: case-transport |
| Asset type | Photograph |
| Format | JPG, 1600x1067, 217 KB |
| Path / location | `aci-infotech/public/images/v4/case-transport.jpg` (URL `/images/v4/case-transport.jpg`) |
| Page(s) where used | `/`, `/services`, `/services/gcc` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/case-studies` listing card backdrop (fallback when a study has no CMS image) — `app/case-studies/CaseStudiesClient.tsx:61,62`<br>`/services/gcc` page (<FoldcraftHero>) — `app/services/gcc/page.tsx:237`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:144`<br>`CmsProofCards` proof-card grid (industry fallback backdrops / feature-card video) — `components/v4/page/CmsProofCards.tsx:27,28` |
| Purpose / description | Transportation backdrop: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop only: not loaded on mobile for /, /services (desktop-only UI, e.g. mega menu or hover state); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 3 pages / 4 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-22 · v4 photo: hero-atmosphere

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: hero-atmosphere |
| Asset type | Photograph |
| Format | JPG, 1600x1064, 59 KB |
| Path / location | `aci-infotech/public/images/v4/hero-atmosphere.jpg` (URL `/images/v4/hero-atmosphere.jpg`) |
| Page(s) where used | `/`, `/platforms/braze`, `/services/cyber-security` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/platforms/braze` page (<FoldcraftHero>) — `app/platforms/braze/page.tsx:241`<br>`/services/cyber-security` page (<FoldcraftHero>) — `app/services/cyber-security/page.tsx:312`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:141,316`<br>Homepage Services columns `ServicesColumns` — `components/v5/ServicesColumns.tsx:86` |
| Purpose / description | Atmospheric dark backdrop (hospitality / security / generic): a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop + mobile (observed on 3 desktop / 1 mobile page); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 3 pages / 4 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-23 · Industry hero image: energy

| Field | Value |
|---|---|
| Asset name / filename | Industry hero image: energy |
| Asset type | Photograph |
| Format | JPG, 1500x841, 106 KB |
| Path / location | `aci-infotech/public/images/v4/ind-energy.jpg` (URL `/images/v4/ind-energy.jpg`) |
| Page(s) where used | `/industries/energy` |
| Exact section / component | `/industries/energy` page (<FoldcraftHero>) — `app/industries/energy/page.tsx:233` |
| Purpose / description | FoldcraftHero "problem band" still on the energy industry page |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Background (left-heavy dark veil over it) |
| Animation / motion usage | None (static still); FoldcraftHero copy fades in (`fadeSlideUp`) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Supplied by the ACI marketing team (uploaded 2026-07-19) and optimized to 1600px progressive JPEG q80 with Sharp, per `public/images/v4/SOURCES.md`. Original photographer/licence not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes |  |

#### PH-24 · Industry hero image: healthcare

| Field | Value |
|---|---|
| Asset name / filename | Industry hero image: healthcare |
| Asset type | Photograph |
| Format | JPG, 1500x841, 104 KB |
| Path / location | `aci-infotech/public/images/v4/ind-healthcare.jpg` (URL `/images/v4/ind-healthcare.jpg`) |
| Page(s) where used | `/industries/healthcare` |
| Exact section / component | `/industries/healthcare` page (<FoldcraftHero>) — `app/industries/healthcare/page.tsx:218` |
| Purpose / description | FoldcraftHero "problem band" still on the healthcare industry page |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Background (left-heavy dark veil over it) |
| Animation / motion usage | None (static still); FoldcraftHero copy fades in (`fadeSlideUp`) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Supplied by the ACI marketing team (uploaded 2026-07-19) and optimized to 1600px progressive JPEG q80 with Sharp, per `public/images/v4/SOURCES.md`. Original photographer/licence not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes |  |

#### PH-25 · Industry hero image: hospitality

| Field | Value |
|---|---|
| Asset name / filename | Industry hero image: hospitality |
| Asset type | Photograph |
| Format | JPG, 1500x841, 67 KB |
| Path / location | `aci-infotech/public/images/v4/ind-hospitality.jpg` (URL `/images/v4/ind-hospitality.jpg`) |
| Page(s) where used | `/industries/hospitality` |
| Exact section / component | `/industries/hospitality` page (<FoldcraftHero>) — `app/industries/hospitality/page.tsx:225` |
| Purpose / description | FoldcraftHero "problem band" still on the hospitality industry page |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Background (left-heavy dark veil over it) |
| Animation / motion usage | None (static still); FoldcraftHero copy fades in (`fadeSlideUp`) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Supplied by the ACI marketing team (uploaded 2026-07-19) and optimized to 1600px progressive JPEG q80 with Sharp, per `public/images/v4/SOURCES.md`. Original photographer/licence not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes |  |

#### PH-26 · Industry hero image: manufacturing

| Field | Value |
|---|---|
| Asset name / filename | Industry hero image: manufacturing |
| Asset type | Photograph |
| Format | JPG, 1500x844, 173 KB |
| Path / location | `aci-infotech/public/images/v4/ind-manufacturing.jpg` (URL `/images/v4/ind-manufacturing.jpg`) |
| Page(s) where used | `/industries/manufacturing` |
| Exact section / component | `/industries/manufacturing` page (<FoldcraftHero>) — `app/industries/manufacturing/page.tsx:218` |
| Purpose / description | FoldcraftHero "problem band" still on the manufacturing industry page |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Background (left-heavy dark veil over it) |
| Animation / motion usage | None (static still); FoldcraftHero copy fades in (`fadeSlideUp`) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Supplied by the ACI marketing team (uploaded 2026-07-19) and optimized to 1600px progressive JPEG q80 with Sharp, per `public/images/v4/SOURCES.md`. Original photographer/licence not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes |  |

#### PH-27 · Industry hero image: oil-gas

| Field | Value |
|---|---|
| Asset name / filename | Industry hero image: oil-gas |
| Asset type | Photograph |
| Format | JPG, 1500x1130, 89 KB |
| Path / location | `aci-infotech/public/images/v4/ind-oil-gas.jpg` (URL `/images/v4/ind-oil-gas.jpg`) |
| Page(s) where used | `/industries/oil-gas` |
| Exact section / component | `/industries/oil-gas` page (<FoldcraftHero>) — `app/industries/oil-gas/page.tsx:235` |
| Purpose / description | FoldcraftHero "problem band" still on the oil-gas industry page |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Background (left-heavy dark veil over it) |
| Animation / motion usage | None (static still); FoldcraftHero copy fades in (`fadeSlideUp`) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Supplied by the ACI marketing team (uploaded 2026-07-19) and optimized to 1600px progressive JPEG q80 with Sharp, per `public/images/v4/SOURCES.md`. Original photographer/licence not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes |  |

#### PH-28 · Industry hero image: retail

| Field | Value |
|---|---|
| Asset name / filename | Industry hero image: retail |
| Asset type | Photograph |
| Format | JPG, 1500x751, 87 KB |
| Path / location | `aci-infotech/public/images/v4/ind-retail.jpg` (URL `/images/v4/ind-retail.jpg`) |
| Page(s) where used | `/industries/retail`, `/lp/digital-trust-summit-2026` |
| Exact section / component | `/industries/retail` page (<FoldcraftHero>) — `app/industries/retail/page.tsx:218`<br>`/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:288` |
| Purpose / description | FoldcraftHero "problem band" still on the retail industry page |
| Desktop / mobile usage | Desktop + mobile (observed on 2 desktop / 2 mobile pages) |
| Background or foreground | Background (left-heavy dark veil over it) |
| Animation / motion usage | None (static still); FoldcraftHero copy fades in (`fadeSlideUp`) |
| Reusable or page-specific | Reusable (used on 2 pages / 2 source locations) |
| Original source / generation method | Supplied by the ACI marketing team (uploaded 2026-07-19) and optimized to 1600px progressive JPEG q80 with Sharp, per `public/images/v4/SOURCES.md`. Original photographer/licence not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes |  |

#### PH-29 · Industry hero image: transport

| Field | Value |
|---|---|
| Asset name / filename | Industry hero image: transport |
| Asset type | Photograph |
| Format | JPG, 1500x841, 208 KB |
| Path / location | `aci-infotech/public/images/v4/ind-transport.jpg` (URL `/images/v4/ind-transport.jpg`) |
| Page(s) where used | `/industries/transportation` |
| Exact section / component | `/industries/transportation` page (<FoldcraftHero>) — `app/industries/transportation/page.tsx:233` |
| Purpose / description | FoldcraftHero "problem band" still on the transport industry page |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Background (left-heavy dark veil over it) |
| Animation / motion usage | None (static still); FoldcraftHero copy fades in (`fadeSlideUp`) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Supplied by the ACI marketing team (uploaded 2026-07-19) and optimized to 1600px progressive JPEG q80 with Sharp, per `public/images/v4/SOURCES.md`. Original photographer/licence not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes |  |

#### PH-30 · v4 photo: svc-ai

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: svc-ai |
| Asset type | Photograph |
| Format | JPG, 1600x1201, 143 KB |
| Path / location | `aci-infotech/public/images/v4/svc-ai.jpg` (URL `/images/v4/svc-ai.jpg`) |
| Page(s) where used | `/`, `/platforms/gcp`, `/platforms/salesforce`, `/platforms/servicenow`, `/services/applied-ai-ml` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/platforms/gcp` page (<FoldcraftHero>) — `app/platforms/gcp/page.tsx:242`<br>`/platforms/salesforce` page (PROOF_FALLBACK) — `app/platforms/salesforce/page.tsx:126`<br>`/platforms/servicenow` page (PROOF_FALLBACK) — `app/platforms/servicenow/page.tsx:126`<br>`/services/applied-ai-ml` page (<FoldcraftHero>) — `app/services/applied-ai-ml/page.tsx:250`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:351`<br>Homepage Services columns `ServicesColumns` — `components/v5/ServicesColumns.tsx:53`<br>Homepage Insights section `V5Insights` — `components/v5/V5Insights.tsx:25` |
| Purpose / description | Applied AI service backdrop: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop + mobile (observed on 5 desktop / 1 mobile page); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 5 pages / 7 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-31 · v4 photo: svc-cloud

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: svc-cloud |
| Asset type | Photograph |
| Format | JPG, 1600x1068, 116 KB |
| Path / location | `aci-infotech/public/images/v4/svc-cloud.jpg` (URL `/images/v4/svc-cloud.jpg`) |
| Page(s) where used | `/`, `/platforms/aws`, `/services/cloud-modernization` |
| Exact section / component | `/platforms/aws` page (<FoldcraftHero>) — `app/platforms/aws/page.tsx:243`<br>`/services/cloud-modernization` page (<FoldcraftHero>, PROOF) — `app/services/cloud-modernization/page.tsx:127,310`<br>Homepage Services columns `ServicesColumns` — `components/v5/ServicesColumns.tsx:64`<br>Homepage Playbook vault `VaultLedger` (flagship card backdrop) — `components/v5/VaultLedger.tsx:145` |
| Purpose / description | Cloud modernization backdrop: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop + mobile (observed on 3 desktop / 1 mobile page) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 3 pages / 4 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-32 · v4 photo: svc-data

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: svc-data |
| Asset type | Photograph |
| Format | JPG, 1600x898, 166 KB |
| Path / location | `aci-infotech/public/images/v4/svc-data.jpg` (URL `/images/v4/svc-data.jpg`) |
| Page(s) where used | `/`, `/industries/hospitality`, `/platforms/databricks`, `/platforms/snowflake`, `/services/app-development` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/industries/hospitality` page (PROOF_FALLBACK) — `app/industries/hospitality/page.tsx:121`<br>`/industries/retail` page (PROOF_FALLBACK) — `app/industries/retail/page.tsx:127`<br>`/platforms/databricks` page (<FoldcraftHero>) — `app/platforms/databricks/page.tsx:219`<br>`/platforms/snowflake` page (PROOF_FALLBACK) — `app/platforms/snowflake/page.tsx:106`<br>`/services/app-development` page (<FoldcraftHero>) — `app/services/app-development/page.tsx:266`<br>`/services/applied-ai-ml` page (PROOF) — `app/services/applied-ai-ml/page.tsx:126`<br>About "What we build" `CapabilityBars` (hover image takeover) — `components/about/CapabilityBars.tsx:33`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:353`<br>Homepage Services columns `ServicesColumns` — `components/v5/ServicesColumns.tsx:42`<br>Homepage Insights section `V5Insights` — `components/v5/V5Insights.tsx:24` |
| Purpose / description | Data engineering backdrop: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop + mobile (observed on 5 desktop / 1 mobile page); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 5 pages / 10 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-33 · v4 photo: svc-ops

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: svc-ops |
| Asset type | Photograph |
| Format | JPG, 1600x1067, 61 KB |
| Path / location | `aci-infotech/public/images/v4/svc-ops.jpg` (URL `/images/v4/svc-ops.jpg`) |
| Page(s) where used | `/`, `/industries/energy`, `/industries/oil-gas`, `/platforms/aws`, `/platforms/azure`, `/platforms/gcp`, `/platforms/microsoft-dynamics`, `/platforms/sap`, `/platforms/servicenow`, `/services/app-development`, `/services/digital-transformation`, `/services/managed-operations` |
| Exact section / component | `/case-studies` listing card backdrop (fallback when a study has no CMS image) — `app/case-studies/CaseStudiesClient.tsx:67`<br>`/industries/energy` page (PROOF_FALLBACK) — `app/industries/energy/page.tsx:119`<br>`/industries/financial-services` page (PROOF_FALLBACK) — `app/industries/financial-services/page.tsx:127`<br>`/industries/healthcare` page (PROOF_FALLBACK) — `app/industries/healthcare/page.tsx:127`<br>`/industries/manufacturing` page (PROOF_FALLBACK) — `app/industries/manufacturing/page.tsx:107`<br>`/industries/oil-gas` page (PROOF_FALLBACK) — `app/industries/oil-gas/page.tsx:121`<br>`/industries/transportation` page (PROOF_FALLBACK) — `app/industries/transportation/page.tsx:119`<br>`/platforms/aws` page (PROOF_FALLBACK) — `app/platforms/aws/page.tsx:105`<br>`/platforms/azure` page (PROOF_FALLBACK) — `app/platforms/azure/page.tsx:125`<br>`/platforms/gcp` page (PROOF_FALLBACK) — `app/platforms/gcp/page.tsx:125`<br>`/platforms/microsoft-dynamics` page (PROOF_FALLBACK) — `app/platforms/microsoft-dynamics/page.tsx:111`<br>`/platforms/sap` page (PROOF_FALLBACK) — `app/platforms/sap/page.tsx:125`<br>`/platforms/servicenow` page (<FoldcraftHero>, PROOF_FALLBACK) — `app/platforms/servicenow/page.tsx:106,217`<br>`/services/app-development` page (PROOF) — `app/services/app-development/page.tsx:143`<br>`/services/digital-transformation` page (PROOF) — `app/services/digital-transformation/page.tsx:147`<br>`/services/managed-operations` page (<FoldcraftHero>) — `app/services/managed-operations/page.tsx:266`<br>About "What we build" `CapabilityBars` (hover image takeover) — `components/about/CapabilityBars.tsx:44`<br>`CmsProofCards` proof-card grid (industry fallback backdrops / feature-card video) — `components/v4/page/CmsProofCards.tsx:33`<br>Homepage Services columns `ServicesColumns` — `components/v5/ServicesColumns.tsx:75` |
| Purpose / description | Managed operations backdrop: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop + mobile (observed on 12 desktop / 2 mobile pages) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 12 pages / 19 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

#### PH-34 · v4 photo: why-visual

| Field | Value |
|---|---|
| Asset name / filename | v4 photo: why-visual |
| Asset type | Photograph |
| Format | JPG, 1600x1152, 87 KB |
| Path / location | `aci-infotech/public/images/v4/why-visual.jpg` (URL `/images/v4/why-visual.jpg`) |
| Page(s) where used | `/platforms/microsoft-dynamics`, `/services/digital-transformation` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/industries/manufacturing` page (PROOF_FALLBACK) — `app/industries/manufacturing/page.tsx:127`<br>`/industries/transportation` page (PROOF_FALLBACK) — `app/industries/transportation/page.tsx:139`<br>`/platforms/microsoft-dynamics` page (<FoldcraftHero>) — `app/platforms/microsoft-dynamics/page.tsx:248`<br>`/services/digital-transformation` page (<FoldcraftHero>, PROOF) — `app/services/digital-transformation/page.tsx:138,270`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:354`<br>Homepage Insights section `V5Insights` — `components/v5/V5Insights.tsx:20,26` |
| Purpose / description | Editorial "why" visual: a shared library photo reused in several places (mega-menu cards, proof-card and case-study backdrops, hero stills, homepage sections); every location is listed under Exact section |
| Desktop / mobile usage | Desktop observed (2 pages); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Background (behind gradient/scrim) in most places; foreground image in mega-menu feature cards |
| Animation / motion usage | CSS opacity/scale hover transitions; mega-menu panel image swap with `navFeatIn` keyframe |
| Reusable or page-specific | Reusable (used on 2 pages / 6 source locations) |
| Original source / generation method | Unsplash (Unsplash License) per `public/images/v4/SOURCES.md`; the file-to-photo-ID mapping is not recorded. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); used as Cover-block / section background or card image |
| Notes | One of the 12 shared v4 library photos. |

## Partner and platform logos

#### LG-01 · Anthropic wordmark

| Field | Value |
|---|---|
| Asset name / filename | Anthropic wordmark |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 -15 106 54, 466 B |
| Path / location | `aci-infotech/public/brand/anthropic-wordmark.svg` (URL `/brand/anthropic-wordmark.svg`) |
| Page(s) where used | `/services/applied-ai-ml` |
| Exact section / component | `FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:37` |
| Purpose / description | Frontier-AI node in the Applied AI & ML FlowScene |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Foreground (drawn into canvas scene) |
| Animation / motion usage | Part of FlowScene canvas animation |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Composed wordmark SVG created in development (commit `3e25786`). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes |  |

#### LG-02 · AWS logo (colour)

| Field | Value |
|---|---|
| Asset name / filename | AWS logo (colour) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 2 KB |
| Path / location | `aci-infotech/public/brand/aws-color.png` (URL `/brand/aws-color.png`) |
| Page(s) where used | `/`, `/about`, `/industries/financial-services`, `/industries/healthcare`, `/industries/manufacturing`, `/partners`, `/platforms/aws`, `/platforms/sap`, `/services/applied-ai-ml`, `/services/cloud-modernization`, `/services/cyber-security`, `/services/data-engineering`, `/services/digital-transformation` |
| Exact section / component | `/partners` partner grid — `app/partners/page.tsx:55`<br>`/platforms/aws` page (<DecisionPanel>, <FoldcraftHero>) — `app/platforms/aws/page.tsx:258,282`<br>`/services/cloud-modernization` page (<FoldcraftHero>) — `app/services/cloud-modernization/page.tsx:326`<br>Homepage partner logo marquee `PartnerMarquee` — `components/v4/hero/PartnerMarquee.tsx:17`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:54,221`<br>Tech-stack chips (`tech-logos.ts` -> `OfferingList` chips, About `CapabilityBars`) — `components/v4/page/tech-logos.ts:77,78,79,80,81,82,83` |
| Purpose / description | AWS logo: homepage partner marquee, /partners grid, platform page DecisionPanel, FlowScene nodes, tech chips |
| Desktop / mobile usage | Desktop + mobile (observed on 13 desktop / 3 mobile pages) |
| Background or foreground | Foreground |
| Animation / motion usage | Marquee: infinite CSS scroll (`marquee-scroll`) on the homepage |
| Reusable or page-specific | Reusable (used on 13 pages / 6 source locations) |
| Original source / generation method | Existing grayscale mark recoloured to the vendor's documented brand hex in development (commit `441f380`); no redistributable colour source existed. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/`; logo strip / marquee block |
| Notes |  |

#### LG-03 · Microsoft Azure logo (colour)

| Field | Value |
|---|---|
| Asset name / filename | Microsoft Azure logo (colour) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 2 KB |
| Path / location | `aci-infotech/public/brand/azure-color.png` (URL `/brand/azure-color.png`) |
| Page(s) where used | `/`, `/about`, `/industries/energy`, `/industries/financial-services`, `/industries/healthcare`, `/industries/hospitality`, `/industries/manufacturing`, `/partners`, `/platforms/azure`, `/platforms/microsoft-dynamics`, `/platforms/sap`, `/services/app-development`, `/services/applied-ai-ml`, `/services/cloud-modernization`, `/services/cyber-security`, `/services/digital-transformation` |
| Exact section / component | `/industries/financial-services` page (<FoldcraftHero>) — `app/industries/financial-services/page.tsx:233`<br>`/partners` partner grid — `app/partners/page.tsx:63`<br>`/platforms/azure` page (<DecisionPanel>, <FoldcraftHero>) — `app/platforms/azure/page.tsx:259,283`<br>Homepage partner logo marquee `PartnerMarquee` — `components/v4/hero/PartnerMarquee.tsx:10`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:55,125,235`<br>Tech-stack chips (`tech-logos.ts` -> `OfferingList` chips, About `CapabilityBars`) — `components/v4/page/tech-logos.ts:84,85` |
| Purpose / description | Microsoft Azure logo: homepage partner marquee, /partners grid, platform page DecisionPanel, FlowScene nodes, tech chips |
| Desktop / mobile usage | Desktop + mobile (observed on 16 desktop / 3 mobile pages) |
| Background or foreground | Foreground |
| Animation / motion usage | Marquee: infinite CSS scroll (`marquee-scroll`) on the homepage |
| Reusable or page-specific | Reusable (used on 16 pages / 6 source locations) |
| Original source / generation method | Existing grayscale mark recoloured to the vendor's documented brand hex in development (commit `441f380`); no redistributable colour source existed. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/`; logo strip / marquee block |
| Notes |  |

#### LG-04 · Azure glyph

| Field | Value |
|---|---|
| Asset name / filename | Azure glyph |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 59.242 47.271, 199 B |
| Path / location | `aci-infotech/public/brand/azure-glyph.svg` (URL `/brand/azure-glyph.svg`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:54` |
| Purpose / description | Azure mark on the "AI in production" success-story stack chip |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | Tab crossfade (Framer Motion) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Derived in development from azure-mono.svg, recoloured to #0078D4 (commit `00ce69a`). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes |  |

#### LG-05 · Databricks logo (for light backgrounds)

| Field | Value |
|---|---|
| Asset name / filename | Databricks logo (for light backgrounds) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 120 60, 6 KB |
| Path / location | `aci-infotech/public/brand/databricks-color-on-light.svg` (URL `/brand/databricks-color-on-light.svg`) |
| Page(s) where used | `/partners`, `/platforms/databricks`, `/services/data-engineering` |
| Exact section / component | `/partners` partner grid — `app/partners/page.tsx:31`<br>`/platforms/databricks` page (<DecisionPanel>) — `app/platforms/databricks/page.tsx:262`<br>`/services/data-engineering` page (<DecisionPanel>) — `app/services/data-engineering/page.tsx:292`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:20,194` |
| Purpose / description | Databricks logo on light surfaces: /partners, /platforms/databricks, data-engineering FlowScene |
| Desktop / mobile usage | Desktop + mobile (observed on 3 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 3 pages / 4 source locations) |
| Original source / generation method | Added in development commit `3ae9283` (2026-07-15): "v4 home: slide logos, blue keywords, sticky nav, CMS content, CTA video". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes | Same file size as databricks-color.svg (6,206 B) but different content: the light-background colour variant. Migrate both. |

#### LG-06 · Databricks logo (colour SVG)

| Field | Value |
|---|---|
| Asset name / filename | Databricks logo (colour SVG) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 120 60, 6 KB |
| Path / location | `aci-infotech/public/brand/databricks-color.svg` (URL `/brand/databricks-color.svg`) |
| Page(s) where used | `/`, `/industries/retail`, `/platforms/databricks`, `/services/app-development`, `/services/applied-ai-ml`, `/services/data-engineering`, `/services/martech-cdp` |
| Exact section / component | `/industries/retail` page (<FoldcraftHero>) — `app/industries/retail/page.tsx:233`<br>`/platforms/databricks` page (<FoldcraftHero>) — `app/platforms/databricks/page.tsx:234`<br>`/services/applied-ai-ml` page (<FoldcraftHero>) — `app/services/applied-ai-ml/page.tsx:266`<br>`FoldcraftHero` band (service / industry / platform pages) — `components/v4/hero/FoldcraftHero.tsx:151`<br>Homepage partner logo marquee `PartnerMarquee` — `components/v4/hero/PartnerMarquee.tsx:11`<br>Homepage video band `V5Foldcraft` — `components/v5/V5Foldcraft.tsx:117`<br>Homepage hero `V5Hero` — `components/v5/V5Hero.tsx:73` |
| Purpose / description | Databricks mark: homepage hero slide 2 eyebrow, partner marquee, V5Foldcraft story card, FoldcraftHero story card, platform/service pages |
| Desktop / mobile usage | Desktop + mobile (observed on 7 desktop / 3 mobile pages) |
| Background or foreground | Foreground |
| Animation / motion usage | Marquee CSS scroll; hero slide transitions (Framer Motion) |
| Reusable or page-specific | Reusable (used on 7 pages / 7 source locations) |
| Original source / generation method | Added in development commit `9eb3fd3` (2026-07-11): "feat(v4): use official colored Databricks logo on the story card". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes |  |

#### LG-07 · Microsoft Dynamics 365 glyph

| Field | Value |
|---|---|
| Asset name / filename | Microsoft Dynamics 365 glyph |
| Asset type | Partner logo (raster) |
| Format | PNG, 192x256, 32 KB |
| Path / location | `aci-infotech/public/brand/dynamics365-glyph.png` (URL `/brand/dynamics365-glyph.png`) |
| Page(s) where used | `/`, `/services` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:108`<br>Homepage hero `V5Hero` — `components/v5/V5Hero.tsx:98` |
| Purpose / description | Dynamics 365 mark in the homepage hero slide 5 eyebrow capsule and the "Microsoft Dynamics" entry of the mega menu Platforms panel |
| Desktop / mobile usage | Desktop observed (hero slide 5 + mega menu); hero slide also renders on mobile when the carousel reaches slide 5 |
| Background or foreground | Foreground |
| Animation / motion usage | Hero slide transitions (Framer Motion) |
| Reusable or page-specific | Reusable (used on 2 pages / 2 source locations) |
| Original source / generation method | Cropped in development (commit `de3398c`) from the ACI-uploaded `MS-Dynamics-365-logo.png`. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/` |
| Notes |  |

#### LG-08 · Dynatrace logo (colour SVG)

| Field | Value |
|---|---|
| Asset name / filename | Dynatrace logo (colour SVG) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 24 24, 1 KB |
| Path / location | `aci-infotech/public/brand/dynatrace-color.svg` (URL `/brand/dynatrace-color.svg`) |
| Page(s) where used | `/`, `/partners`, `/services/cyber-security` |
| Exact section / component | `/partners` partner grid — `app/partners/page.tsx:110`<br>Homepage partner logo marquee `PartnerMarquee` — `components/v4/hero/PartnerMarquee.tsx:16`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:74` |
| Purpose / description | Dynatrace logo: homepage partner marquee, /partners grid, platform pages, FlowScene nodes, tech chips |
| Desktop / mobile usage | Desktop + mobile (observed on 3 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | Marquee: infinite CSS scroll (`marquee-scroll`) on the homepage |
| Reusable or page-specific | Reusable (used on 3 pages / 3 source locations) |
| Original source / generation method | Simple Icons brand-colour SVG (commit `441f380`). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes |  |

#### LG-09 · Google Cloud logo (colour SVG)

| Field | Value |
|---|---|
| Asset name / filename | Google Cloud logo (colour SVG) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 24 24, 698 B |
| Path / location | `aci-infotech/public/brand/googlecloud-color.svg` (URL `/brand/googlecloud-color.svg`) |
| Page(s) where used | `/`, `/partners`, `/platforms/gcp`, `/platforms/sap`, `/services/cloud-modernization`, `/services/digital-transformation` |
| Exact section / component | `/partners` partner grid — `app/partners/page.tsx:71`<br>`/platforms/gcp` page (<DecisionPanel>, <FoldcraftHero>) — `app/platforms/gcp/page.tsx:257,281`<br>Homepage partner logo marquee `PartnerMarquee` — `components/v4/hero/PartnerMarquee.tsx:13`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:56,249`<br>Tech-stack chips (`tech-logos.ts` -> `OfferingList` chips, About `CapabilityBars`) — `components/v4/page/tech-logos.ts:36,37,38` |
| Purpose / description | Google Cloud logo: homepage partner marquee, /partners grid, platform pages, FlowScene nodes, tech chips |
| Desktop / mobile usage | Desktop + mobile (observed on 6 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | Marquee: infinite CSS scroll (`marquee-scroll`) on the homepage |
| Reusable or page-specific | Reusable (used on 6 pages / 5 source locations) |
| Original source / generation method | Simple Icons brand-colour SVG (commit `441f380`). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes |  |

#### LG-10 · Microsoft logo (mono SVG)

| Field | Value |
|---|---|
| Asset name / filename | Microsoft logo (mono SVG) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 23 23, 254 B |
| Path / location | `aci-infotech/public/brand/microsoft-mono.svg` (URL `/brand/microsoft-mono.svg`) |
| Page(s) where used | `/about`, `/industries/energy`, `/industries/financial-services`, `/industries/healthcare`, `/industries/hospitality`, `/industries/manufacturing`, `/industries/retail`, `/platforms`, `/platforms/azure`, `/platforms/microsoft-dynamics`, `/services/applied-ai-ml`, `/services/cyber-security`, `/services/digital-transformation` |
| Exact section / component | `/platforms/microsoft-dynamics` page (<DecisionPanel>, <FoldcraftHero>) — `app/platforms/microsoft-dynamics/page.tsx:263,287`<br>`/platforms` platform index cards — `app/platforms/page.tsx:99`<br>`/services/cyber-security` page (<FoldcraftHero>) — `app/services/cyber-security/page.tsx:328`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:75,109,305`<br>Tech-stack chips (`tech-logos.ts` -> `OfferingList` chips, About `CapabilityBars`) — `components/v4/page/tech-logos.ts:86,87` |
| Purpose / description | Microsoft mark: /platforms index, Dynamics platform page, cyber-security page, FlowScene nodes, tech chips |
| Desktop / mobile usage | Desktop + mobile (observed on 13 desktop / 3 mobile pages) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 13 pages / 6 source locations) |
| Original source / generation method | Added in development commit `36af565` (2026-04-22): "feat(platforms): add Google Cloud + AWS and Microsoft logo fixes". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes | Also referenced by internal preview code (components/v2/home/stack-icons.ts); that does not affect the live site. |

#### LG-11 · OpenAI wordmark

| Field | Value |
|---|---|
| Asset name / filename | OpenAI wordmark |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 -15 88 54, 2 KB |
| Path / location | `aci-infotech/public/brand/openai-wordmark.svg` (URL `/brand/openai-wordmark.svg`) |
| Page(s) where used | `/services/applied-ai-ml` |
| Exact section / component | `FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:38` |
| Purpose / description | Frontier-AI node in the Applied AI & ML FlowScene |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Foreground (drawn into canvas scene) |
| Animation / motion usage | Part of FlowScene canvas animation |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Composed wordmark SVG created in development (commit `3e25786`). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes |  |

#### LG-12 · Salesforce logo (colour)

| Field | Value |
|---|---|
| Asset name / filename | Salesforce logo (colour) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 2 KB |
| Path / location | `aci-infotech/public/brand/salesforce-color.png` (URL `/brand/salesforce-color.png`) |
| Page(s) where used | `/`, `/about`, `/industries/financial-services`, `/industries/hospitality`, `/industries/retail`, `/partners`, `/platforms/salesforce`, `/services/martech-cdp` |
| Exact section / component | `/partners` partner grid — `app/partners/page.tsx:47`<br>`/platforms/salesforce` page (<DecisionPanel>, <FoldcraftHero>) — `app/platforms/salesforce/page.tsx:258,282`<br>`/services/martech-cdp` page (<OfferingList>) — `app/services/martech-cdp/page.tsx:310`<br>Homepage partner logo marquee `PartnerMarquee` — `components/v4/hero/PartnerMarquee.tsx:15`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:91,263`<br>Tech-stack chips (`tech-logos.ts` -> `OfferingList` chips, About `CapabilityBars`) — `components/v4/page/tech-logos.ts:88,89,90,91,92` |
| Purpose / description | Salesforce logo: homepage partner marquee, /partners grid, platform page DecisionPanel, FlowScene nodes, tech chips |
| Desktop / mobile usage | Desktop + mobile (observed on 8 desktop / 3 mobile pages) |
| Background or foreground | Foreground |
| Animation / motion usage | Marquee: infinite CSS scroll (`marquee-scroll`) on the homepage |
| Reusable or page-specific | Reusable (used on 8 pages / 6 source locations) |
| Original source / generation method | Existing grayscale mark recoloured to the vendor's documented brand hex in development (commit `441f380`); no redistributable colour source existed. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/`; logo strip / marquee block |
| Notes |  |

#### LG-13 · SAP logo (colour SVG)

| Field | Value |
|---|---|
| Asset name / filename | SAP logo (colour SVG) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 24 24, 1 KB |
| Path / location | `aci-infotech/public/brand/sap-color.svg` (URL `/brand/sap-color.svg`) |
| Page(s) where used | `/`, `/industries/manufacturing`, `/partners`, `/platforms/sap` |
| Exact section / component | `/partners` partner grid — `app/partners/page.tsx:79`<br>`/platforms/sap` page (<DecisionPanel>, <FoldcraftHero>) — `app/platforms/sap/page.tsx:257,281`<br>Homepage partner logo marquee `PartnerMarquee` — `components/v4/hero/PartnerMarquee.tsx:14`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:277`<br>Tech-stack chips (`tech-logos.ts` -> `OfferingList` chips, About `CapabilityBars`) — `components/v4/page/tech-logos.ts:60` |
| Purpose / description | SAP logo: homepage partner marquee, /partners grid, platform pages, FlowScene nodes, tech chips |
| Desktop / mobile usage | Desktop + mobile (observed on 4 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | Marquee: infinite CSS scroll (`marquee-scroll`) on the homepage |
| Reusable or page-specific | Reusable (used on 4 pages / 5 source locations) |
| Original source / generation method | Simple Icons brand-colour SVG (commit `441f380`). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes |  |

#### LG-14 · SAP glyph

| Field | Value |
|---|---|
| Asset name / filename | SAP glyph |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 6.064 24 11.872, 1 KB |
| Path / location | `aci-infotech/public/brand/sap-glyph.svg` (URL `/brand/sap-glyph.svg`) |
| Page(s) where used | `/` |
| Exact section / component | Homepage Success Stories tabs `V5SuccessStories` (`success-stories-data.ts`) — `components/v5/success-stories-data.ts:57` |
| Purpose / description | SAP mark on the "Finance reporting, rebuilt on S/4HANA" success-story stack chip |
| Desktop / mobile usage | Desktop observed after selecting tab 4 (interaction crawl); same tab exists on mobile |
| Background or foreground | Foreground |
| Animation / motion usage | Tab crossfade (Framer Motion) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Derived in development from sap-color.svg with the viewBox cropped (commit `00ce69a`). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes | Only loads once tab 4 is shown (auto-rotation or click). |

#### LG-15 · Snowflake logo (colour SVG)

| Field | Value |
|---|---|
| Asset name / filename | Snowflake logo (colour SVG) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 24 24, 2 KB |
| Path / location | `aci-infotech/public/brand/snowflake-color.svg` (URL `/brand/snowflake-color.svg`) |
| Page(s) where used | `/`, `/partners`, `/platforms/snowflake`, `/services/data-engineering` |
| Exact section / component | `/partners` partner grid — `app/partners/page.tsx:39`<br>`/platforms/snowflake` page (<DecisionPanel>, <FoldcraftHero>) — `app/platforms/snowflake/page.tsx:232,256`<br>`/services/data-engineering` page (<DecisionPanel>) — `app/services/data-engineering/page.tsx:291`<br>Homepage partner logo marquee `PartnerMarquee` — `components/v4/hero/PartnerMarquee.tsx:12`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:21,207` |
| Purpose / description | Snowflake logo: homepage partner marquee, /partners grid, platform pages, FlowScene nodes, tech chips |
| Desktop / mobile usage | Desktop + mobile (observed on 4 desktop / 2 mobile pages) |
| Background or foreground | Foreground |
| Animation / motion usage | Marquee: infinite CSS scroll (`marquee-scroll`) on the homepage |
| Reusable or page-specific | Reusable (used on 4 pages / 5 source locations) |
| Original source / generation method | Simple Icons brand-colour SVG (commit `441f380`). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes |  |

#### LG-16 · ArqAI logo (no tagline)

| Field | Value |
|---|---|
| Asset name / filename | ArqAI logo (no tagline) |
| Asset type | Partner logo (raster) |
| Format | PNG, 717x253, 51 KB |
| Path / location | `aci-infotech/public/images/ArqAI-Logo-no-tagline.png` (URL `/images/ArqAI-Logo-no-tagline.png`) |
| Page(s) where used | `/services/applied-ai-ml` |
| Exact section / component | Tech-stack chips (`tech-logos.ts` -> `OfferingList` chips, About `CapabilityBars`) — `components/v4/page/tech-logos.ts:19` |
| Purpose / description | ArqAI chip logo in tech-stack chips (`tech-logos.ts` entry "ArqAI") |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-15 (commit `4910b2d`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/`; header + footer logo via Site Editor (Site Logo block) or Customizer > Site Identity |
| Notes | Old "ArqAI" naming; correct company name is "ArqAI Labs". Check before reuse. |

#### LG-17 · AWS logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | AWS logo (Solution-Partners set) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 3 KB |
| Path / location | `aci-infotech/public/images/Solution-Partners/aws.png` (URL `/images/Solution-Partners/aws.png`) |
| Page(s) where used | `/platforms` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/platforms` platform index cards — `app/platforms/page.tsx:57`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:101` |
| Purpose / description | AWS logo in the desktop mega menu Platforms panel and the /platforms index |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 1 page / 7 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `e3b3439`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/` |
| Notes | Also referenced by internal preview code (app/preview/home/page.tsx, app/v1/page.tsx, components/v2/home/mobile/MobilePartners.tsx, components/v2/home/stack-icons.ts...); that does not affect the live site. |

#### LG-18 · Azure logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | Azure logo (Solution-Partners set) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 2 KB |
| Path / location | `aci-infotech/public/images/Solution-Partners/azure.png` (URL `/images/Solution-Partners/azure.png`) |
| Page(s) where used | `/platforms` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/platforms` platform index cards — `app/platforms/page.tsx:64`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:102` |
| Purpose / description | Azure logo in the desktop mega menu Platforms panel and the /platforms index |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 1 page / 5 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `e3b3439`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/` |
| Notes | Also referenced by internal preview code (app/preview/home/page.tsx, app/v1/page.tsx, components/v3/next/V3Next.tsx); that does not affect the live site. |

#### LG-19 · Braze logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | Braze logo (Solution-Partners set) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 3 KB |
| Path / location | `aci-infotech/public/images/Solution-Partners/braze.png` (URL `/images/Solution-Partners/braze.png`) |
| Page(s) where used | `/about`, `/industries/financial-services`, `/industries/hospitality`, `/industries/retail`, `/partners`, `/platforms`, `/platforms/braze`, `/services/martech-cdp` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/partners` partner grid — `app/partners/page.tsx:95`<br>`/platforms/braze` page (<DecisionPanel>, <FoldcraftHero>) — `app/platforms/braze/page.tsx:256,280`<br>`/platforms` platform index cards — `app/platforms/page.tsx:106`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:107`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:92,319`<br>Tech-stack chips (`tech-logos.ts` -> `OfferingList` chips, About `CapabilityBars`) — `components/v4/page/tech-logos.ts:21,22` |
| Purpose / description | Braze logo in the desktop mega menu Platforms panel and the /platforms index (also /partners, Braze pages, tech chips) |
| Desktop / mobile usage | Desktop + mobile (observed on 8 desktop / 2 mobile pages); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 8 pages / 11 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `e3b3439`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/` |
| Notes | Also referenced by internal preview code (app/preview/home/page.tsx, app/v1/page.tsx, components/v2/home/mobile/MobilePartners.tsx, components/v2/home/stack-icons.ts...); that does not affect the live site. |

#### LG-20 · Databricks logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | Databricks logo (Solution-Partners set) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 3 KB |
| Path / location | `aci-infotech/public/images/Solution-Partners/databricks.png` (URL `/images/Solution-Partners/databricks.png`) |
| Page(s) where used | `/platforms` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/platforms` platform index cards — `app/platforms/page.tsx:43`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:99` |
| Purpose / description | Databricks logo in the desktop mega menu Platforms panel and the /platforms index |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 1 page / 6 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `e3b3439`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/` |
| Notes | Also referenced by internal preview code (app/preview/home/page.tsx, app/v1/page.tsx, components/v2/home/mobile/MobilePartners.tsx, components/v3/next/V3Next.tsx); that does not affect the live site. |

#### LG-21 · Google Cloud logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | Google Cloud logo (Solution-Partners set) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 24 24, 698 B |
| Path / location | `aci-infotech/public/images/Solution-Partners/googlecloud.svg` (URL `/images/Solution-Partners/googlecloud.svg`) |
| Page(s) where used | `/platforms` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/platforms` platform index cards — `app/platforms/page.tsx:71`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:103` |
| Purpose / description | Google Cloud logo in the desktop mega menu Platforms panel and the /platforms index |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 1 page / 3 source locations) |
| Original source / generation method | Added in development commit `10e2bf8` (2026-06-24): "feat(preview): ecosystem logos, video moment, CMS work + insights". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes | Also referenced by internal preview code (components/v3/next/V3Next.tsx); that does not affect the live site. |

#### LG-22 · Kubernetes logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | Kubernetes logo (Solution-Partners set) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 24 24, 3 KB |
| Path / location | `aci-infotech/public/images/Solution-Partners/kubernetes.svg` (URL `/images/Solution-Partners/kubernetes.svg`) |
| Page(s) where used | `/services/app-development` |
| Exact section / component | `FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:126` |
| Purpose / description | Kubernetes logo in the desktop mega menu Platforms panel and the /platforms index (Kubernetes FlowScene node on App Development) |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 1 page / 2 source locations) |
| Original source / generation method | Added in development commit `0a28ca4` (2026-06-25): "content+design(preview): supply-chain video, services, hover work". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes | Also referenced by internal preview code (components/v3/next/V3Next.tsx); that does not affect the live site. |

#### LG-23 · Salesforce logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | Salesforce logo (Solution-Partners set) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 3 KB |
| Path / location | `aci-infotech/public/images/Solution-Partners/salesforce.png` (URL `/images/Solution-Partners/salesforce.png`) |
| Page(s) where used | `/platforms` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/platforms` platform index cards — `app/platforms/page.tsx:78`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:106` |
| Purpose / description | Salesforce logo in the desktop mega menu Platforms panel and the /platforms index |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 1 page / 7 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `e3b3439`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/` |
| Notes | Also referenced by internal preview code (app/preview/home/page.tsx, app/v1/page.tsx, components/v2/home/mobile/MobilePartners.tsx, components/v2/home/stack-icons.ts...); that does not affect the live site. |

#### LG-24 · SAP logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | SAP logo (Solution-Partners set) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 2 KB |
| Path / location | `aci-infotech/public/images/Solution-Partners/sap.png` (URL `/images/Solution-Partners/sap.png`) |
| Page(s) where used | `/platforms` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/platforms` platform index cards — `app/platforms/page.tsx:85`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:104` |
| Purpose / description | SAP logo in the desktop mega menu Platforms panel and the /platforms index |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 1 page / 7 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `e3b3439`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/` |
| Notes | Also referenced by internal preview code (app/preview/home/page.tsx, app/v1/page.tsx, components/v2/home/mobile/MobilePartners.tsx, components/v2/home/stack-icons.ts...); that does not affect the live site. |

#### LG-25 · ServiceNow logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | ServiceNow logo (Solution-Partners set) |
| Asset type | Partner logo (raster) |
| Format | PNG, 146x77, 3 KB |
| Path / location | `aci-infotech/public/images/Solution-Partners/servicenow.png` (URL `/images/Solution-Partners/servicenow.png`) |
| Page(s) where used | `/about`, `/industries/energy`, `/industries/financial-services`, `/partners`, `/platforms`, `/platforms/servicenow`, `/services/digital-transformation` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/partners` partner grid — `app/partners/page.tsx:87`<br>`/platforms` platform index cards — `app/platforms/page.tsx:92`<br>`/platforms/servicenow` page (<DecisionPanel>, <FoldcraftHero>) — `app/platforms/servicenow/page.tsx:232,256`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:105`<br>`FlowScene` hero canvas, source/output node logos (`flow-configs.ts`) — `components/v4/page/flow-configs.ts:108,291`<br>Tech-stack chips (`tech-logos.ts` -> `OfferingList` chips, About `CapabilityBars`) — `components/v4/page/tech-logos.ts:62` |
| Purpose / description | ServiceNow logo in the desktop mega menu Platforms panel and the /platforms index (also /partners, Braze pages, tech chips) |
| Desktop / mobile usage | Desktop + mobile (observed on 7 desktop / 1 mobile page); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 7 pages / 11 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `177c060`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library `/brand/` |
| Notes | Also referenced by internal preview code (app/preview/home/page.tsx, app/v1/page.tsx, components/v2/home/mobile/MobilePartners.tsx, components/v2/home/stack-icons.ts...); that does not affect the live site. |

#### LG-26 · Snowflake logo (Solution-Partners set)

| Field | Value |
|---|---|
| Asset name / filename | Snowflake logo (Solution-Partners set) |
| Asset type | Partner logo (SVG) |
| Format | SVG, viewBox 0 0 24 24, 2 KB |
| Path / location | `aci-infotech/public/images/Solution-Partners/snowflake.svg` (URL `/images/Solution-Partners/snowflake.svg`) |
| Page(s) where used | `/platforms` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/platforms` platform index cards — `app/platforms/page.tsx:50`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:100` |
| Purpose / description | Snowflake logo in the desktop mega menu Platforms panel and the /platforms index |
| Desktop / mobile usage | Desktop observed (1 page); mobile not separately crawled for these pages (responsive layout, expected on both); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | Mega-menu panel slide/fade (`navPanelIn` CSS keyframes) |
| Reusable or page-specific | Reusable (used on 1 page / 3 source locations) |
| Original source / generation method | Added in development commit `10e2bf8` (2026-06-24): "feat(preview): ecosystem logos, video moment, CMS work + insights". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder |
| Notes | Also referenced by internal preview code (components/v3/next/V3Next.tsx); that does not affect the live site. |

## Technology stack logos (Simple Icons SVG set)

Fields common to every logo in this group:

| Field | Value |
|---|---|
| Asset type | Technology logo (SVG icon, 24x24 viewBox, brand colour fill) |
| Exact section / component | Tech-stack chips: `src/components/v4/page/tech-logos.ts` maps chip labels to logos, rendered by `OfferingList` in `src/components/v4/page/kit.tsx` (service, industry and platform pages) and by About `CapabilityBars`. Some also appear as `FlowScene` nodes (`flow-configs.ts`). |
| Purpose / description | Small logo inside each technology chip ("Databricks", "Terraform" ...) so the stack is recognisable at a glance |
| Background or foreground | Foreground |
| Animation / motion usage | None (static); chip hover colour transition in CSS |
| Reusable or page-specific | Reusable (a chip can appear on any page that lists that technology) |
| Original source / generation method | Simple Icons project brand SVG (extracted into `public/brand/tech` in commit `b12f9ca`). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library with SVG support enabled (WordPress blocks SVG uploads by default; install Safe SVG) or bundle in the theme `assets/` folder; a "tech chip" block or ACF repeater that maps a label to the logo |
| Notes | Simple Icons are CC0 but the marks remain the vendors' trademarks: use them only to name the technology. |

| ID | Logo | File | Format | Pages where loaded (desktop / mobile) | Desktop/mobile | Alt text seen |
|---|---|---|---|---|---|---|
| TL-01 | Ansible | `public/brand/tech/ansible.svg` | SVG, viewBox 0 0 24 24, 455 B | 1 / 0: /services/cloud-modernization | Desktop observed | empty alt="" (decorative) |
| TL-02 | Anthropic | `public/brand/tech/anthropic.svg` | SVG, viewBox 0 0 24 24, 296 B | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-03 | Apache Hadoop | `public/brand/tech/apachehadoop.svg` | SVG, viewBox 0 0 24 24, 7 KB | 2 / 1: /platforms/databricks, /services/data-engineering | Desktop + mobile | empty alt="" (decorative) |
| TL-04 | Apache Kafka | `public/brand/tech/apachekafka.svg` | SVG, viewBox 0 0 24 24, 3 KB | 6 / 2: /industries/financial-services, /industries/healthcare, /industries/manufacturing, /industries/retail, /services/app-development, /services/data-engineering | Desktop + mobile | empty alt="" (decorative) |
| TL-05 | Apache Spark | `public/brand/tech/apachespark.svg` | SVG, viewBox 0 0 24 24, 2 KB | 3 / 1: /platforms/databricks, /services/applied-ai-ml, /services/data-engineering | Desktop + mobile | empty alt="" (decorative) |
| TL-06 | Argo | `public/brand/tech/argo.svg` | SVG, viewBox 0 0 24 24, 5 KB | 2 / 0: /services/app-development, /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-07 | Backstage | `public/brand/tech/backstage.svg` | SVG, viewBox 0 0 24 24, 3 KB | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-08 | Camunda | `public/brand/tech/camunda.svg` | SVG, viewBox 0 0 24 24, 610 B | 1 / 0: /services/digital-transformation | Desktop observed | empty alt="" (decorative) |
| TL-09 | Claude | `public/brand/tech/claude.svg` | SVG, viewBox 0 0 24 24, 2 KB | 1 / 0: /services/applied-ai-ml | Desktop observed | empty alt="" (decorative) |
| TL-10 | Cypress | `public/brand/tech/cypress.svg` | SVG, viewBox 0 0 24 24, 1 KB | 1 / 0: /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-11 | Databricks | `public/brand/tech/databricks.svg` | SVG, viewBox 0 0 24 24, 437 B | 12 / 4: /, /about, /industries/energy, /industries/financial-services, /industries/healthcare, /industries/hospitality ... | Desktop + mobile | empty alt="" (decorative) |
| TL-12 | Datadog | `public/brand/tech/datadog.svg` | SVG, viewBox 0 0 24 24, 3 KB | 2 / 1: /about, /services/quality-engineering | Desktop + mobile | empty alt="" (decorative) |
| TL-13 | Docker | `public/brand/tech/docker.svg` | SVG, viewBox 0 0 24 24, 2 KB | 2 / 0: /services/app-development, /services/cloud-modernization | Desktop observed | empty alt="" (decorative) |
| TL-14 | .NET | `public/brand/tech/dotnet.svg` | SVG, viewBox 0 0 24 24, 549 B | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-15 | Dynatrace | `public/brand/tech/dynatrace.svg` | SVG, viewBox 0 0 24 24, 1 KB | 4 / 2: /about, /platforms/servicenow, /services/cyber-security, /services/data-engineering | Desktop + mobile | empty alt="" (decorative) |
| TL-16 | FastAPI | `public/brand/tech/fastapi.svg` | SVG, viewBox 0 0 24 24, 362 B | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-17 | Gatling | `public/brand/tech/gatling.svg` | SVG, viewBox 0 0 24 24, 2 KB | 1 / 0: /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-18 | GitHub Actions | `public/brand/tech/githubactions.svg` | SVG, viewBox 0 0 24 24, 2 KB | 2 / 0: /services/app-development, /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-19 | GitLab | `public/brand/tech/gitlab.svg` | SVG, viewBox 0 0 24 24, 588 B | 2 / 0: /services/cyber-security, /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-20 | Google Analytics | `public/brand/tech/googleanalytics.svg` | SVG, viewBox 0 0 24 24, 753 B | 1 / 0: /services/martech-cdp | Desktop observed | empty alt="" (decorative) |
| TL-21 | Grafana | `public/brand/tech/grafana.svg` | SVG, viewBox 0 0 24 24, 4 KB | 2 / 1: /about, /services/quality-engineering | Desktop + mobile | empty alt="" (decorative) |
| TL-22 | GraphQL | `public/brand/tech/graphql.svg` | SVG, viewBox 0 0 24 24, 681 B | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-23 | Istio | `public/brand/tech/istio.svg` | SVG, viewBox 0 0 24 24, 177 B | 1 / 0: /services/cloud-modernization | Desktop observed | empty alt="" (decorative) |
| TL-24 | Jenkins | `public/brand/tech/jenkins.svg` | SVG, viewBox 0 0 24 24, 5 KB | 1 / 0: /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-25 | Jest | `public/brand/tech/jest.svg` | SVG, viewBox 0 0 24 24, 3 KB | 1 / 0: /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-26 | k6 | `public/brand/tech/k6.svg` | SVG, viewBox 0 0 24 24, 724 B | 1 / 0: /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-27 | Kubernetes | `public/brand/tech/kubernetes.svg` | SVG, viewBox 0 0 24 24, 3 KB | 2 / 0: /services/app-development, /services/cloud-modernization | Desktop observed | empty alt="" (decorative) |
| TL-28 | LangChain | `public/brand/tech/langchain.svg` | SVG, viewBox 0 0 24 24, 542 B | 2 / 0: /services/app-development, /services/applied-ai-ml | Desktop observed | empty alt="" (decorative) |
| TL-29 | Looker | `public/brand/tech/looker.svg` | SVG, viewBox 0 0 24 24, 1 KB | 2 / 0: /platforms/gcp, /services/martech-cdp | Desktop observed | empty alt="" (decorative) |
| TL-30 | MLflow | `public/brand/tech/mlflow.svg` | SVG, viewBox 0 0 24 24, 368 B | 6 / 2: /industries/financial-services, /industries/healthcare, /industries/retail, /platforms/databricks, /services/applied-ai-ml, /services/data-engineering | Desktop + mobile | empty alt="" (decorative) |
| TL-31 | Next.js | `public/brand/tech/nextdotjs.svg` | SVG, viewBox 0 0 24 24, 337 B | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-32 | Node.js | `public/brand/tech/nodedotjs.svg` | SVG, viewBox 0 0 24 24, 2 KB | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-33 | Okta | `public/brand/tech/okta.svg` | SVG, viewBox 0 0 24 24, 254 B | 1 / 0: /services/cyber-security | Desktop observed | empty alt="" (decorative) |
| TL-34 | OWASP | `public/brand/tech/owasp.svg` | SVG, viewBox 0 0 24 24, 2 KB | 2 / 0: /services/cyber-security, /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-35 | PostgreSQL | `public/brand/tech/postgresql.svg` | SVG, viewBox 0 0 24 24, 5 KB | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-36 | Pulumi | `public/brand/tech/pulumi.svg` | SVG, viewBox 0 0 24 24, 2 KB | 1 / 0: /services/cloud-modernization | Desktop observed | empty alt="" (decorative) |
| TL-37 | Pytest | `public/brand/tech/pytest.svg` | SVG, viewBox 0 0 24 24, 479 B | 1 / 0: /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-38 | Python | `public/brand/tech/python.svg` | SVG, viewBox 0 0 24 24, 1 KB | 7 / 1: /industries/financial-services, /industries/healthcare, /industries/manufacturing, /industries/retail, /platforms/snowflake, /services/app-development ... | Desktop + mobile | empty alt="" (decorative) |
| TL-39 | Qualys | `public/brand/tech/qualys.svg` | SVG, viewBox 0 0 24 24, 800 B | 1 / 0: /services/cyber-security | Desktop observed | empty alt="" (decorative) |
| TL-40 | React | `public/brand/tech/react.svg` | SVG, viewBox 0 0 24 24, 3 KB | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-41 | Red Hat Open Shift | `public/brand/tech/redhatopenshift.svg` | SVG, viewBox 0 0 24 24, 1 KB | 1 / 0: /services/cloud-modernization | Desktop observed | empty alt="" (decorative) |
| TL-42 | scikit-learn | `public/brand/tech/scikitlearn.svg` | SVG, viewBox 0 0 24 24, 5 KB | 1 / 0: /services/applied-ai-ml | Desktop observed | empty alt="" (decorative) |
| TL-43 | Selenium | `public/brand/tech/selenium.svg` | SVG, viewBox 0 0 24 24, 1 KB | 1 / 0: /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-44 | Snowflake | `public/brand/tech/snowflake.svg` | SVG, viewBox 0 0 24 24, 2 KB | 9 / 3: /about, /industries/financial-services, /industries/healthcare, /industries/hospitality, /industries/manufacturing, /industries/retail ... | Desktop + mobile | empty alt="" (decorative) |
| TL-45 | Snyk | `public/brand/tech/snyk.svg` | SVG, viewBox 0 0 24 24, 3 KB | 2 / 0: /services/cyber-security, /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-46 | SonarQube Server | `public/brand/tech/sonarqubeserver.svg` | SVG, viewBox 0 0 24 24, 1 KB | 2 / 0: /services/cyber-security, /services/quality-engineering | Desktop observed | empty alt="" (decorative) |
| TL-47 | Splunk | `public/brand/tech/splunk.svg` | SVG, viewBox 0 0 24 24, 2 KB | 3 / 0: /industries/energy, /platforms/servicenow, /services/cyber-security | Desktop observed | empty alt="" (decorative) |
| TL-48 | Spring Boot | `public/brand/tech/springboot.svg` | SVG, viewBox 0 0 24 24, 1001 B | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-49 | TensorFlow | `public/brand/tech/tensorflow.svg` | SVG, viewBox 0 0 24 24, 300 B | 2 / 0: /industries/financial-services, /services/applied-ai-ml | Desktop observed | empty alt="" (decorative) |
| TL-50 | Teradata | `public/brand/tech/teradata.svg` | SVG, viewBox 0 0 24 24, 418 B | 3 / 1: /platforms/databricks, /platforms/snowflake, /services/data-engineering | Desktop + mobile | empty alt="" (decorative) |
| TL-51 | Terraform | `public/brand/tech/terraform.svg` | SVG, viewBox 0 0 24 24, 268 B | 4 / 1: /platforms/aws, /platforms/azure, /services/app-development, /services/cloud-modernization | Desktop + mobile | empty alt="" (decorative) |
| TL-52 | TypeScript | `public/brand/tech/typescript.svg` | SVG, viewBox 0 0 24 24, 1 KB | 1 / 0: /services/app-development | Desktop observed | empty alt="" (decorative) |
| TL-53 | UiPath | `public/brand/tech/uipath.svg` | SVG, viewBox 0 0 24 24, 2 KB | 4 / 1: /about, /partners, /services/applied-ai-ml, /services/digital-transformation | Desktop + mobile | empty alt="" (decorative); "UiPath logo" |
| TL-54 | VMware | `public/brand/tech/vmware.svg` | SVG, viewBox 0 0 24 24, 2 KB | 1 / 0: /services/cloud-modernization | Desktop observed | empty alt="" (decorative) |

## Certification and award badges

#### CB-01 · Badge: 5 Best Data Analytics Company

| Field | Value |
|---|---|
| Asset name / filename | Badge: 5 Best Data Analytics Company |
| Asset type | Certification / award badge |
| Format | WEBP, 104x60, 5 KB |
| Path / location | `aci-infotech/public/images/certifications-awards/best-data-analytics-company.webp` (URL `/images/certifications-awards/best-data-analytics-company.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | `/about` page (leadership / certifications) — `app/about/page.tsx:176` |
| Purpose / description | 5 Best Data Analytics Company badge in /about certifications |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 1 page / 2 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `8c75e7b`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); certifications row block |
| Notes | Badge artwork from the certifying body; keep proportions unaltered. Also referenced by internal preview code (components/v2/home/Marquee.tsx); that does not affect the live site. |

#### CB-02 · Badge: Great Place to Work Certified

| Field | Value |
|---|---|
| Asset name / filename | Badge: Great Place to Work Certified |
| Asset type | Certification / award badge |
| Format | WEBP, 60x104, 6 KB |
| Path / location | `aci-infotech/public/images/certifications-awards/best-place-to-work.webp` (URL `/images/certifications-awards/best-place-to-work.webp`) |
| Page(s) where used | `/about` **Plus the desktop mega menu on every page** (shown when a menu panel opens; confirmed by hovering the menus on `/` and `/services`). |
| Exact section / component | `/about` page (leadership / certifications) — `app/about/page.tsx:173`<br>Global desktop mega menu `HeroMegaNav` — `components/v4/hero/HeroMegaNav.tsx:438` |
| Purpose / description | Great Place to Work Certified badge in /about certifications and the mega menu Company panel card badge |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page); the mega-menu usage is desktop only (the mobile menu sheet is text links, no images) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 1 page / 3 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `8c75e7b`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); certifications row block |
| Notes | Badge artwork is issued by the certifying body; check brand-use rules and expiry year ("Certified 2024-25"). Also referenced by internal preview code (components/v2/home/Marquee.tsx); that does not affect the live site. |

#### CB-03 · Badge: CMMi Level 3

| Field | Value |
|---|---|
| Asset name / filename | Badge: CMMi Level 3 |
| Asset type | Certification / award badge |
| Format | WEBP, 104x60, 4 KB |
| Path / location | `aci-infotech/public/images/certifications-awards/cmmi.webp` (URL `/images/certifications-awards/cmmi.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | `/about` page (leadership / certifications) — `app/about/page.tsx:175` |
| Purpose / description | CMMi Level 3 badge in /about certifications |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 1 page / 3 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `8c75e7b`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); certifications row block |
| Notes | Badge artwork from the certifying body; keep proportions unaltered. Also referenced by internal preview code (components/v2/home/Marquee.tsx, components/v3/next/V3Next.tsx); that does not affect the live site. |

#### CB-04 · Badge: GSA Contract Holder

| Field | Value |
|---|---|
| Asset name / filename | Badge: GSA Contract Holder |
| Asset type | Certification badge |
| Format | PNG, 800x186, 20 KB |
| Path / location | `aci-infotech/public/images/certifications-awards/gsa-contract-holder.png` (URL `/images/certifications-awards/gsa-contract-holder.png`) |
| Page(s) where used | Rendered on 95 of 145 crawled desktop pages: `/`, `/about`, `/blogs` + `/blogs/*` (8), `/careers` + `/careers/*` (2), `/case-studies` + `/case-studies/*` (30), `/contact`, `/industries` + `/industries/*` (9), `/news`, `/partners`, `/platforms` + `/platforms/*` (11), `/playbooks` + `/playbooks/*` (12), `/privacy-policy`, `/services` + `/services/*` (12), `/terms-of-service`, `/this-page-does-not-exist-404`, `/whitepapers` + `/whitepapers/*` (3). Global: rendered by the root layout / site header / footer on every page. |
| Exact section / component | Global footer `SiteFooter` — `components/v4/hero/SiteFooter.tsx:72` |
| Purpose / description | GSA Contract Holder badge under the Company column of the global footer |
| Desktop / mobile usage | Desktop + mobile (observed on 95 desktop / 12 mobile pages) |
| Background or foreground | Foreground (keeps its own white field) |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 96 pages / 1 source location) |
| Original source / generation method | Resized in development (commit `39f5e6c`) from the GSA badge image supplied by the ACI team in chat; saved as an 800x186 palette PNG. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); footer widget / footer template part |
| Notes | GSA mark guidelines: do not recolour or invert it for dark backgrounds. |

#### CB-05 · Badge: ISO 27001:2022

| Field | Value |
|---|---|
| Asset name / filename | Badge: ISO 27001:2022 |
| Asset type | Certification / award badge |
| Format | WEBP, 104x60, 4 KB |
| Path / location | `aci-infotech/public/images/certifications-awards/iso-27001.webp` (URL `/images/certifications-awards/iso-27001.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | `/about` page (leadership / certifications) — `app/about/page.tsx:174` |
| Purpose / description | ISO 27001:2022 badge in /about certifications |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 1 page / 3 source locations) |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-10 (commit `8c75e7b`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); certifications row block |
| Notes | Badge artwork from the certifying body; keep proportions unaltered. Also referenced by internal preview code (components/v2/home/Marquee.tsx, components/v3/next/V3Next.tsx); that does not affect the live site. |

## People photos

#### PP-01 · Headshot: Amit Khare

| Field | Value |
|---|---|
| Asset name / filename | Headshot: Amit Khare |
| Asset type | Portrait photograph |
| Format | WEBP, 400x400, 13 KB |
| Path / location | `aci-infotech/public/images/about-team/Amit-K.webp` (URL `/images/about-team/Amit-K.webp`) |
| Page(s) where used | `/lp/digital-trust-summit-2026` |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:252` |
| Purpose / description | Amit Khare headshot: AION 2026 LP speaker card |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Added in development commit `1bb969e` (2026-01-19): "Revamp About page: enhanced parallax, CEO feature section, leadership team grid". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); team member CPT / ACF image field |
| Notes | Personal photo: confirm consent for continued use. |

#### PP-02 · Headshot: Jag Kanumuri (fallback)

| Field | Value |
|---|---|
| Asset name / filename | Headshot: Jag Kanumuri (fallback) |
| Asset type | Portrait photograph |
| Format | PNG, 400x320, 33 KB |
| Path / location | `aci-infotech/public/images/about-team/Jag.png` (URL `/images/about-team/Jag.png`) |
| Page(s) where used | `/about` |
| Exact section / component | `/about` page (leadership / certifications) — `app/about/page.tsx:151` |
| Purpose / description | Jag Kanumuri headshot: /about leadership section (`<picture>` fallback) |
| Desktop / mobile usage | Desktop only: not loaded on mobile for /about (desktop-only UI, e.g. mega menu or hover state) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `d2a1c54`). Original creator / source not recorded in project. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); team member CPT / ACF image field |
| Notes | Personal photo: confirm consent for continued use. Fallback `<img>` inside `<picture>`; Chromium loaded it on desktop alongside the WebP. Keep one format. |

#### PP-03 · Headshot: Jag Kanumuri

| Field | Value |
|---|---|
| Asset name / filename | Headshot: Jag Kanumuri |
| Asset type | Portrait photograph |
| Format | WEBP, 400x320, 9 KB |
| Path / location | `aci-infotech/public/images/about-team/Jag.webp` (URL `/images/about-team/Jag.webp`) |
| Page(s) where used | `/about` |
| Exact section / component | `/about` page (leadership / certifications) — `app/about/page.tsx:152` |
| Purpose / description | Jag Kanumuri headshot: /about leadership section |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Added in development commit `1bb969e` (2026-01-19): "Revamp About page: enhanced parallax, CEO feature section, leadership team grid". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); team member CPT / ACF image field |
| Notes | Personal photo: confirm consent for continued use. |

#### PP-04 · Headshot: Prakash Hingorani (fallback)

| Field | Value |
|---|---|
| Asset name / filename | Headshot: Prakash Hingorani (fallback) |
| Asset type | Portrait photograph |
| Format | JPG, 600x901, 43 KB |
| Path / location | `aci-infotech/public/images/about-team/Prakash.jpg` (URL `/images/about-team/Prakash.jpg`) |
| Page(s) where used | `/about` |
| Exact section / component | `/about` page (leadership / certifications) — `app/about/page.tsx:167` |
| Purpose / description | Prakash Hingorani headshot: /about leadership section (`<picture>` fallback) |
| Desktop / mobile usage | Desktop only: not loaded on mobile for /about (desktop-only UI, e.g. mega menu or hover state) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Added in development commit `852c24b` (2026-06-09): "feat(about): add Prakash Hingorani CRO section below Jag". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); team member CPT / ACF image field |
| Notes | Personal photo: confirm consent for continued use. Fallback `<img>` inside `<picture>`; Chromium loaded it on desktop alongside the WebP. Keep one format. |

#### PP-05 · Headshot: Prakash Hingorani

| Field | Value |
|---|---|
| Asset name / filename | Headshot: Prakash Hingorani |
| Asset type | Portrait photograph |
| Format | WEBP, 600x901, 29 KB |
| Path / location | `aci-infotech/public/images/about-team/Prakash.webp` (URL `/images/about-team/Prakash.webp`) |
| Page(s) where used | `/about`, `/lp/digital-trust-summit-2026` |
| Exact section / component | `/about` page (leadership / certifications) — `app/about/page.tsx:168`<br>`/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:240` |
| Purpose / description | Prakash Hingorani headshot: /about leadership section and AION LP speakers |
| Desktop / mobile usage | Desktop + mobile (observed on 2 desktop / 2 mobile pages) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (used on 2 pages / 2 source locations) |
| Original source / generation method | Added in development commit `852c24b` (2026-06-09): "feat(about): add Prakash Hingorani CRO section below Jag". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); team member CPT / ACF image field |
| Notes | Personal photo: confirm consent for continued use. |

#### PP-06 · Headshot: Rajiv Kumar Pandey

| Field | Value |
|---|---|
| Asset name / filename | Headshot: Rajiv Kumar Pandey |
| Asset type | Portrait photograph |
| Format | WEBP, 820x1025, 41 KB |
| Path / location | `aci-infotech/public/images/about-team/Rajiv.webp` (URL `/images/about-team/Rajiv.webp`) |
| Page(s) where used | `/lp/digital-trust-summit-2026` |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:246` |
| Purpose / description | Rajiv Kumar Pandey headshot: AION 2026 LP speaker card |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Added in development commit `03f22f4` (2026-07-21): "LP: real event hero film, Rajiv photo, and a hard perf pass". |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`); team member CPT / ACF image field |
| Notes | Personal photo: confirm consent for continued use. |

## Event landing page imagery

#### EV-01 · Ray-Ban Meta smart glasses product shot

| Field | Value |
|---|---|
| Asset name / filename | Ray-Ban Meta smart glasses product shot |
| Asset type | Product cut-out (transparent PNG) |
| Format | PNG, 1440x720, 96 KB |
| Path / location | `aci-infotech/public/images/events/rayban-meta-glasses.png` (URL `/images/events/rayban-meta-glasses.png`) |
| Page(s) where used | `/lp/digital-trust-summit-2026` |
| Exact section / component | `/lp/digital-trust-summit-2026` (AION 2026 event LP) — `app/lp/digital-trust-summit-2026/page.tsx:591,999` |
| Purpose / description | Grand-prize product image floating in the AION LP hero and lucky-draw section |
| Desktop / mobile usage | Desktop + mobile (observed on 1 desktop / 1 mobile page) |
| Background or foreground | Foreground |
| Animation / motion usage | CSS `float_7s` up/down keyframe loop |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Transparent product shot from Ray-Ban's image CDN per commit `2841b62` (compressed 1.14 MB -> 96 KB). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Media Library (`wp-content/uploads`) |
| Notes | Third-party brand imagery: confirm usage rights. |

## Code-rendered animations (not video files)

These visuals move on screen but are not video or image files. They are drawn or animated by JavaScript/CSS in the browser, so there is nothing to upload: each one has to be rebuilt in the WordPress theme (or replaced by a recorded video). No Lottie, Rive, GSAP or Three.js is used on the public site (Three.js and Lenis appear only in internal preview code).

#### ANI-01 · FlowScene: animated service/industry/platform hero visual

| Field | Value |
|---|---|
| Asset name / filename | FlowScene: animated service/industry/platform hero visual |
| Asset type | Canvas 2D animation (JS, requestAnimationFrame) |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v4/page/FlowScene.tsx` + per-page configs in `src/components/v4/page/flow-configs.ts` |
| Page(s) where used | Hero visual of every service (11), industry (8) and platform (10) page; observed as a `<canvas>` on 29 crawled pages |
| Exact section / component | `src/components/v4/page/FlowScene.tsx` + per-page configs in `src/components/v4/page/flow-configs.ts` |
| Purpose / description | Labelled source nodes (partner logos) feed particle streams through a rotating dust-particle sphere into three labelled output tiers. Everything is computed: seeded PRNG layout, cubic Bezier paths, Fibonacci-lattice sphere. |
| Desktop / mobile usage | Desktop + mobile (resizes to container) |
| Background or foreground | Foreground (hero visual) |
| Animation / motion usage | Continuous rAF loop; pauses off-screen (IntersectionObserver); single static frame under prefers-reduced-motion |
| Reusable or page-specific | Reusable (one engine, 29 configs) |
| Original source / generation method | Dynamically generated by code. Not a video file; nothing to export. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Rebuild as a theme JS module + custom block (port FlowScene.tsx to vanilla canvas JS, one JSON config per page), or record each page's scene as a short MP4/WebM loop with a poster and accept losing interactivity |
| Notes | Uses logo files LG-* / TL-* as node images. |

#### ANI-02 · ParticleRings: dust-particle concentric rings

| Field | Value |
|---|---|
| Asset name / filename | ParticleRings: dust-particle concentric rings |
| Asset type | Canvas 2D animation (JS, rAF) |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v4/hero/ParticleRings.tsx` (inside FoldcraftHero) |
| Page(s) where used | FoldcraftHero bands on industry/service/platform pages |
| Exact section / component | `src/components/v4/hero/ParticleRings.tsx` (inside FoldcraftHero) |
| Purpose / description | Tilted elliptical rings of shimmering dust rotating at different speeds, with a cached glow sprite. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Background / decorative |
| Animation / motion usage | rAF loop only while on screen; static frame under reduced motion |
| Reusable or page-specific | Reusable |
| Original source / generation method | Dynamically generated by code. Not a video file. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Port to theme JS (canvas) or replace with a lightweight looping WebM/Lottie |
| Notes |  |

#### ANI-03 · Homepage hero headline carousel

| Field | Value |
|---|---|
| Asset name / filename | Homepage hero headline carousel |
| Asset type | Framer Motion (React) animation |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v5/V5Hero.tsx` |
| Page(s) where used | `/` hero |
| Exact section / component | `src/components/v5/V5Hero.tsx` |
| Purpose / description | Six rotating slides (7s each) with staggered headline line reveals, underline sweep, eyebrow logo swap and slide dots; sits over the office-hero video. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | Framer Motion AnimatePresence + motion, respects useReducedMotion; setInterval rotation |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Code animation (Framer Motion). Not a video. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Rebuild with a slider block/library (e.g. Swiper) + CSS keyframes, or a custom block with vanilla JS |
| Notes | Slide marks: BR-ArqAI light logo, LG Databricks, LG Dynamics 365 glyph. |

#### ANI-04 · Success Stories tab reel

| Field | Value |
|---|---|
| Asset name / filename | Success Stories tab reel |
| Asset type | Framer Motion + CSS keyframes |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v5/V5SuccessStories.tsx`, `src/components/v4/hero/success-stories.css` |
| Page(s) where used | `/` Success Stories |
| Exact section / component | `src/components/v5/V5SuccessStories.tsx`, `src/components/v4/hero/success-stories.css` |
| Purpose / description | Five tabs with stacked video layers crossfading (700ms), 8s auto-rotation with a CSS progress bar (`ss-progress`), stat count-ups. |
| Desktop / mobile usage | Desktop + mobile (tab bar is a 2/3-column grid on small screens) |
| Background or foreground | Foreground |
| Animation / motion usage | AnimatePresence crossfade, CSS progress keyframe, IntersectionObserver play/pause |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Code animation driving stored video files VID success-story clips. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Custom tabs block with per-tab video; reimplement crossfade + progress in CSS/JS |
| Notes |  |

#### ANI-05 · Rotating text badge ("Engineered / Deployed / Run in Production")

| Field | Value |
|---|---|
| Asset name / filename | Rotating text badge ("Engineered / Deployed / Run in Production") |
| Asset type | Inline SVG + CSS keyframe rotation |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v5/V5Foldcraft.tsx` (RotatingBadge), `src/components/v5/v5.css` (`v5-spin`) |
| Page(s) where used | `/` Foldcraft band |
| Exact section / component | `src/components/v5/V5Foldcraft.tsx` (RotatingBadge), `src/components/v5/v5.css` (`v5-spin`) |
| Purpose / description | Circular text-on-path SVG ring, always turning. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground (decorative, aria-hidden) |
| Animation / motion usage | CSS infinite rotation |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Code-rendered SVG. Not a file. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Copy the inline SVG + CSS into a Custom HTML block or theme template |
| Notes |  |

#### ANI-06 · Homepage section reveals and count-ups

| Field | Value |
|---|---|
| Asset name / filename | Homepage section reveals and count-ups |
| Asset type | CSS transitions + JS (IntersectionObserver, rAF) |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v5/reveal.ts`, `src/components/v5/v5.css` (`.is-revealed`) |
| Page(s) where used | `/` all v5 sections |
| Exact section / component | `src/components/v5/reveal.ts`, `src/components/v5/v5.css` (`.is-revealed`) |
| Purpose / description | Sections fade/slide in once on scroll; stats count up from 0 with a quartic ease (~1.6s). |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | IntersectionObserver + rAF; snaps under reduced motion |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Code animation. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Theme JS (small IntersectionObserver script) or an animation block plugin |
| Notes |  |

#### ANI-07 · Partner logo marquee

| Field | Value |
|---|---|
| Asset name / filename | Partner logo marquee |
| Asset type | CSS keyframe animation |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v4/hero/PartnerMarquee.tsx`, `hero.css` (`marquee-scroll`, `hero-sheen`) |
| Page(s) where used | `/` partner strip |
| Exact section / component | `src/components/v4/hero/PartnerMarquee.tsx`, `hero.css` (`marquee-scroll`, `hero-sheen`) |
| Purpose / description | Infinite horizontal scroll of 8 partner logos. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | CSS infinite translate |
| Reusable or page-specific | Reusable |
| Original source / generation method | Code animation using logo files. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Logo carousel block / CSS marquee in theme |
| Notes |  |

#### ANI-08 · Mega menu panel animations

| Field | Value |
|---|---|
| Asset name / filename | Mega menu panel animations |
| Asset type | CSS keyframes + JS |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v4/hero/nav.css` (`navFadeDown`, `navPanelIn`, `navFeatIn`, `navOverlayIn`), `SiteNav.tsx`, `HeroMegaNav.tsx` |
| Page(s) where used | All pages (desktop header) |
| Exact section / component | `src/components/v4/hero/nav.css` (`navFadeDown`, `navPanelIn`, `navFeatIn`, `navOverlayIn`), `SiteNav.tsx`, `HeroMegaNav.tsx` |
| Purpose / description | Panels drop in, industry feature image swaps on hover, overlay fades; header turns to glass on scroll (rAF scroll listener). |
| Desktop / mobile usage | Desktop (mega menu); mobile uses a slide-in sheet |
| Background or foreground | Foreground |
| Animation / motion usage | CSS keyframes, hover-intent JS |
| Reusable or page-specific | Reusable (global) |
| Original source / generation method | Code animation. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Mega-menu plugin (e.g. Max Mega Menu) or a block-theme navigation with custom CSS |
| Notes | Contains video VID foldcraft and photos PH-*. |

#### ANI-09 · FadingVideo lazy background player

| Field | Value |
|---|---|
| Asset name / filename | FadingVideo lazy background player |
| Asset type | JS (IntersectionObserver + rAF fade) |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v4/hero/FadingVideo.tsx` |
| Page(s) where used | BridgeBand + CtaSection on /about, blog posts, service, industry, platform pages |
| Exact section / component | `src/components/v4/hero/FadingVideo.tsx` |
| Purpose / description | Loads and plays background videos only near the viewport, fades them in once, supports offset/mirror framing. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Background |
| Animation / motion usage | JS fade + play/pause |
| Reusable or page-specific | Reusable |
| Original source / generation method | Code behaviour around stored videos (v4-slide1, v4-editorial-signal). |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Theme JS for lazy video (or `preload="none"` + a small script); Cover block alone will autoplay everything |
| Notes |  |

#### ANI-10 · About hero parallax balloon scene

| Field | Value |
|---|---|
| Asset name / filename | About hero parallax balloon scene |
| Asset type | JS scroll parallax |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/about/ParallaxBalloons.tsx` |
| Page(s) where used | `/about` hero |
| Exact section / component | `src/components/about/ParallaxBalloons.tsx` |
| Purpose / description | Sky background plus five balloon cut-outs moving at different scroll speeds. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Background + foreground layers |
| Animation / motion usage | Scroll-driven transforms |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Code animation using image files PH about-page-img. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Parallax block/plugin or theme JS |
| Notes |  |

#### ANI-11 · About capability bars

| Field | Value |
|---|---|
| Asset name / filename | About capability bars |
| Asset type | Framer Motion whileInView + CSS hover |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/about/CapabilityBars.tsx` |
| Page(s) where used | `/about` What we build |
| Exact section / component | `src/components/about/CapabilityBars.tsx` |
| Purpose / description | Bars fade/slide in on scroll; hovering a bar reveals a full photo under a dark gradient. |
| Desktop / mobile usage | Desktop (hover); touch shows on focus |
| Background or foreground | Foreground / hover background |
| Animation / motion usage | Framer Motion, CSS transitions |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Code animation. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Custom block + CSS hover |
| Notes |  |

#### ANI-12 · 404 page mouse-scrubbed video

| Field | Value |
|---|---|
| Asset name / filename | 404 page mouse-scrubbed video |
| Asset type | JS-controlled video (currentTime scrubbing) |
| Format | No file: rendered in the browser by code |
| Path / location | `src/app/not-found.tsx` |
| Page(s) where used | 404 page |
| Exact section / component | `src/app/not-found.tsx` |
| Purpose / description | Background video whose playhead follows the mouse X position (throttled seeks), plus a blinking-cursor typed intro (`nf-blink`). |
| Desktop / mobile usage | Desktop (mouse); mobile shows the first frame |
| Background or foreground | Background |
| Animation / motion usage | JS scrubbing, CSS blink keyframe |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Code interaction over an externally hosted video (EXT-01). |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | 404 template in theme + JS; self-host the video |
| Notes |  |

#### ANI-13 · Atheros copilot UI motion

| Field | Value |
|---|---|
| Asset name / filename | Atheros copilot UI motion |
| Asset type | Framer Motion + CSS keyframes + rAF |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/atheros/AtherosNudge.tsx`, `src/components/copilot/*` (ConsultationShell, ContentCanvas, ChatColumn, MobileSheet, PillPeek `atheros-peek-in`, PillIdle `atheros-pill-pulse`), `src/lib/copilot/presenter.ts` |
| Page(s) where used | All public pages except /lp/* (chat launcher, nudge bubble, mobile pill) |
| Exact section / component | `src/components/atheros/AtherosNudge.tsx`, `src/components/copilot/*` (ConsultationShell, ContentCanvas, ChatColumn, MobileSheet, PillPeek `atheros-peek-in`, PillIdle `atheros-pill-pulse`), `src/lib/copilot/presenter.ts` |
| Purpose / description | Desktop nudge bubble after 7s or 25% scroll; animated chat panels; mobile pill pulse/peek; streaming text presenter. |
| Desktop / mobile usage | Desktop nudge; mobile pill + sheet |
| Background or foreground | Foreground (overlay) |
| Animation / motion usage | Framer Motion + CSS keyframes + rAF |
| Reusable or page-specific | Reusable (global) |
| Original source / generation method | Code animation. Avatar is an inline SVG data URI (`src/lib/copilot/brand.ts`). |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Depends on how the chat is moved: an embed script / plugin. Not a media upload |
| Notes | Backend chat API must be migrated separately. |

#### ANI-14 · Cookie consent slide-up

| Field | Value |
|---|---|
| Asset name / filename | Cookie consent slide-up |
| Asset type | CSS keyframe |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/CookieConsent.tsx` (`aci-cookie-slide-up`) |
| Page(s) where used | All pages (first visit) |
| Exact section / component | `src/components/CookieConsent.tsx` (`aci-cookie-slide-up`) |
| Purpose / description | Consent banner slides up from the bottom. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground (overlay) |
| Animation / motion usage | CSS keyframe |
| Reusable or page-specific | Reusable |
| Original source / generation method | Code animation. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Replaced by the WordPress consent plugin (must keep GTM Consent Mode v2 defaults) |
| Notes |  |

#### ANI-15 · Route loading bar

| Field | Value |
|---|---|
| Asset name / filename | Route loading bar |
| Asset type | CSS keyframe |
| Format | No file: rendered in the browser by code |
| Path / location | `src/app/loading.tsx` (`route-loading-slide`) |
| Page(s) where used | Shown between route transitions |
| Exact section / component | `src/app/loading.tsx` (`route-loading-slide`) |
| Purpose / description | Thin sliding progress bar while a route loads. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | CSS keyframe |
| Reusable or page-specific | Reusable |
| Original source / generation method | Code animation. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Not needed in WordPress (full page loads) |
| Notes |  |

#### ANI-16 · Global CSS keyframe library

| Field | Value |
|---|---|
| Asset name / filename | Global CSS keyframe library |
| Asset type | CSS keyframes |
| Format | No file: rendered in the browser by code |
| Path / location | `src/app/globals.css` (`heroFadeUp`, `heroFadeIn`, `float`), `src/styles/design-system.css` (`fadeIn`, `fadeInUp`, `slideInRight`, `pulse`, `spin`), `src/components/v4/hero/foldcraft.css` (`fadeSlideUp`) |
| Page(s) where used | Site-wide utility classes |
| Exact section / component | `src/app/globals.css` (`heroFadeUp`, `heroFadeIn`, `float`), `src/styles/design-system.css` (`fadeIn`, `fadeInUp`, `slideInRight`, `pulse`, `spin`), `src/components/v4/hero/foldcraft.css` (`fadeSlideUp`) |
| Purpose / description | Entrance fades/slides, floats, spinners. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | CSS keyframes |
| Reusable or page-specific | Reusable |
| Original source / generation method | Code animation. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Copy into the theme stylesheet |
| Notes |  |

#### ANI-17 · Tailwind utility animations

| Field | Value |
|---|---|
| Asset name / filename | Tailwind utility animations |
| Asset type | CSS (Tailwind `animate-*`) |
| Format | No file: rendered in the browser by code |
| Path / location | `animate-spin` (Loader2 on all forms/download buttons), `animate-pulse` (contact, LP hero, copilot diagrams), `animate-bounce` (Dynamics roadmap LP), `animate-[float_7s...]` (AION LP) |
| Page(s) where used | Forms, LPs, contact |
| Exact section / component | `animate-spin` (Loader2 on all forms/download buttons), `animate-pulse` (contact, LP hero, copilot diagrams), `animate-bounce` (Dynamics roadmap LP), `animate-[float_7s...]` (AION LP) |
| Purpose / description | Loading spinners, pulsing dots, bouncing scroll cue, floating product shot. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | CSS |
| Reusable or page-specific | Reusable |
| Original source / generation method | Code animation. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Theme CSS / form plugin spinners |
| Notes |  |

#### ANI-18 · LP counters and countdowns

| Field | Value |
|---|---|
| Asset name / filename | LP counters and countdowns |
| Asset type | JS (rAF + IntersectionObserver) |
| Format | No file: rendered in the browser by code |
| Path / location | `src/app/lp/digital-trust-summit-2026/page.tsx` (live countdown, Bengaluru clock, rolling-text button), `src/app/lp/microsoft-dynamics-roadmap/page.tsx` (count-up stats), `src/components/landing-pages/LPStats.tsx` |
| Page(s) where used | /lp/digital-trust-summit-2026, /lp/microsoft-dynamics-roadmap, /lp/[slug] stats |
| Exact section / component | `src/app/lp/digital-trust-summit-2026/page.tsx` (live countdown, Bengaluru clock, rolling-text button), `src/app/lp/microsoft-dynamics-roadmap/page.tsx` (count-up stats), `src/components/landing-pages/LPStats.tsx` |
| Purpose / description | Animated numbers and event countdown. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | rAF / IntersectionObserver |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Code animation. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | LP builder blocks or a small counter script |
| Notes |  |

#### ANI-19 · Dotted world map (Global offices band)

| Field | Value |
|---|---|
| Asset name / filename | Dotted world map (Global offices band) |
| Asset type | Generated inline SVG (from data) |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/contact/GlobalOfficesBand.tsx` + data `src/components/contact/world-map-data.json` (77 KB, generated by `scripts/generate-world-dots.mjs` from world-atlas land geometry) |
| Page(s) where used | `/contact` offices band |
| Exact section / component | `src/components/contact/GlobalOfficesBand.tsx` + data `src/components/contact/world-map-data.json` (77 KB, generated by `scripts/generate-world-dots.mjs` from world-atlas land geometry) |
| Purpose / description | Dot-matrix world map marking all 11 ACI offices with hand-placed labels. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground (decorative map) |
| Animation / motion usage | Hover state on markers (CSS); otherwise static |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Dynamically generated by code from geodata. Not an image file. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Export the rendered SVG once and upload it as an SVG (Safe SVG) or inline it in a Custom HTML block |
| Notes |  |

#### ANI-20 · Film-grain / noise textures

| Field | Value |
|---|---|
| Asset name / filename | Film-grain / noise textures |
| Asset type | Inline SVG data-URI (feTurbulence) in CSS |
| Format | No file: rendered in the browser by code |
| Path / location | `src/components/v4/hero/hero.css` (`.v4-noise::after`), `src/styles/design-system-v2.css` |
| Page(s) where used | v4 dark bands (hero/CTA/proof) site-wide |
| Exact section / component | `src/components/v4/hero/hero.css` (`.v4-noise::after`), `src/styles/design-system-v2.css` |
| Purpose / description | Procedural fractal-noise overlay, soft-light blend. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Background overlay |
| Animation / motion usage | None (static texture) |
| Reusable or page-specific | Reusable |
| Original source / generation method | Code-generated texture. |
| Original prompt | Not applicable (code-rendered, no prompt). None found in project. |
| WordPress migration requirement | Copy the CSS rule into the theme |
| Notes |  |

## Icon systems

#### IC-01 · Lucide icon set (92 icons)

| Field | Value |
|---|---|
| Asset name / filename | Lucide icon set (92 icons) |
| Asset type | Icon library (React SVG components, `lucide-react`) |
| Format | Inline SVG (no image files) |
| Path / location | npm package `lucide-react`; imported per component |
| Page(s) where used | Site-wide |
| Exact section / component | Arrows/CTAs, mega-menu service & industry icons, LP benefit/pain-point icons, success-story stack chips, form states, social icons (LinkedIn, YouTube, Facebook) |
| Purpose / description | UI and content icons: Activity, AlertCircle, AlertOctagon, AlertTriangle, ArrowLeft, ArrowRight, ArrowRightLeft, ArrowUpRight, Award, BadgeCheck, BarChart3, Blocks, BookOpen, Bot, Box, Boxes, BrainCircuit, Building2, Calendar, Check, CheckCircle, CheckCircle2, ChevronDown, ClipboardCheck, Clock, Cloud, Code2, Coffee, Compass, Cookie, Cpu, Database, DollarSign, Download, Edit3, ExternalLink, EyeOff, Facebook, Factory, FileSpreadsheet, FileText, Fuel, Gift, GitBranch, HeartPulse, HelpCircle, Landmark, Layers, Layout, Lightbulb, Link, Link2, Linkedin, Loader2, Lock, MapPin, Megaphone, MonitorSmartphone, Play, Plus, Puzzle, Quote, Radar, RefreshCw, Rocket, Search, Send, Server, ServerCog, Settings, Shield, ShieldCheck, ShieldOff, ShoppingBag, Siren, Sliders, Smartphone, Sparkles, Store, Table2, Target, TrendingDown, TrendingUp, Trophy, Truck, Unlink, Users, UtensilsCrossed, Workflow, X, Youtube, Zap |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | Some hover translate (CSS); Loader2 spins (`animate-spin`) |
| Reusable or page-specific | Reusable |
| Original source / generation method | Open-source icon library (ISC licence), rendered as inline SVG at build time. |
| Original prompt | Not applicable. None found in project. |
| WordPress migration requirement | Use an icon block plugin with Lucide, or build a theme SVG sprite of these 92 icons. Do not upload individually. |
| Notes |  |

#### IC-02 · X (formerly Twitter) logo icon

| Field | Value |
|---|---|
| Asset name / filename | X (formerly Twitter) logo icon |
| Asset type | Custom inline SVG component |
| Format | Inline SVG (no image files) |
| Path / location | `src/components/ui/XIcon.tsx` |
| Page(s) where used | Global footer social row; blog post share buttons ("Share on X") |
| Exact section / component | `src/components/ui/XIcon.tsx` |
| Purpose / description | Current X mark, links to https://x.com/Aciinfotech01 |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | Hover colour (CSS) |
| Reusable or page-specific | Reusable |
| Original source / generation method | Hand-authored SVG path (X brand mark). |
| Original prompt | Not applicable. None found in project. |
| WordPress migration requirement | Theme SVG sprite / social icons block (WordPress core Social Icons block includes X) |
| Notes |  |

#### IC-03 · Other inline SVG marks

| Field | Value |
|---|---|
| Asset name / filename | Other inline SVG marks |
| Asset type | Inline SVG in components |
| Format | Inline SVG (no image files) |
| Path / location | `src/app/lp/digital-trust-summit-2026/page.tsx` (Starburst association mark), `src/components/landing-pages/LPHero.tsx`, `LPSolution.tsx`, `LPCTASection.tsx` (check/feature glyphs), `src/components/copilot/mobile/PillPeek.tsx`, `src/components/copilot/diagrams/primitives.tsx`, `src/app/not-found.tsx` (copy icon), `src/app/blogs/[slug]/ShareButtons.tsx`, `src/lib/copilot/brand.ts` (Atheros avatar data URI) |
| Page(s) where used | LPs, 404, blog share, copilot |
| Exact section / component | `src/app/lp/digital-trust-summit-2026/page.tsx` (Starburst association mark), `src/components/landing-pages/LPHero.tsx`, `LPSolution.tsx`, `LPCTASection.tsx` (check/feature glyphs), `src/components/copilot/mobile/PillPeek.tsx`, `src/components/copilot/diagrams/primitives.tsx`, `src/app/not-found.tsx` (copy icon), `src/app/blogs/[slug]/ShareButtons.tsx`, `src/lib/copilot/brand.ts` (Atheros avatar data URI) |
| Purpose / description | Small decorative glyphs and badges. |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | Mostly static |
| Reusable or page-specific | Mixed |
| Original source / generation method | Hand-authored inline SVG. |
| Original prompt | Not applicable. None found in project. |
| WordPress migration requirement | Recreate inline in templates/blocks; no media upload needed |
| Notes |  |

## Third-party externally hosted media

Media the site loads at runtime from someone else's server. All three should be downloaded and self-hosted in WordPress.

#### EXT-01 · 404 background video (externally hosted)

| Field | Value |
|---|---|
| Asset name / filename | 404 background video (externally hosted) |
| Asset type | Video (background, mouse-scrubbed) |
| Format | MP4 (H.264), 3828x2164, 24 fps, 4.04s, 4.4 MB, no audio (probed from the live URL) |
| Path / location | `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4` (second `<source>`; the first, `/videos/atheros-404.mp4`, does not exist) |
| Page(s) where used | 404 page (any unknown URL; crawled `/this-page-does-not-exist-404`) |
| Exact section / component | `src/app/not-found.tsx:142` full-screen background |
| Purpose / description | Decorative backdrop whose playhead follows the mouse |
| Desktop / mobile usage | Desktop + mobile (scrub on desktop mouse move) |
| Background or foreground | Background |
| Animation / motion usage | JS scrubbing (see ANI-12) |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Externally hosted on a third-party CloudFront distribution. How it was made, and by whom, is not documented anywhere in the project; the file name records only a date stamp and an ID. |
| Original prompt | Original video source/prompt: Not found in project. |
| WordPress migration requirement | Download and self-host in the Media Library (compress: 3828px wide is far beyond need); update the 404 template |
| Notes | The project expects a self-hosted copy at `public/videos/atheros-404.mp4` that was never added. If the external host removes the file the 404 background disappears. |

#### EXT-02 · Unsplash photo (Dynamics roadmap LP)

| Field | Value |
|---|---|
| Asset name / filename | Unsplash photo (Dynamics roadmap LP) |
| Asset type | Photograph (hotlinked) |
| Format | JPEG via Unsplash CDN, `w=800` |
| Path / location | `https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format` |
| Page(s) where used | /lp/microsoft-dynamics-roadmap |
| Exact section / component | `src/app/lp/microsoft-dynamics-roadmap/page.tsx:549` content image |
| Purpose / description | Supporting team/office photo |
| Desktop / mobile usage | Desktop + mobile (observed) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Unsplash CDN hotlink (Unsplash License). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Download and upload to Media Library (do not hotlink) |
| Notes | Hotlinked from Unsplash at runtime. |

#### EXT-03 · Unsplash photo (Dynamics roadmap LP background)

| Field | Value |
|---|---|
| Asset name / filename | Unsplash photo (Dynamics roadmap LP background) |
| Asset type | Photograph (hotlinked background) |
| Format | JPEG via Unsplash CDN, `w=1600` |
| Path / location | `https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format` |
| Page(s) where used | /lp/microsoft-dynamics-roadmap |
| Exact section / component | `src/app/lp/microsoft-dynamics-roadmap/page.tsx:771` section background |
| Purpose / description | Office background behind a CTA section |
| Desktop / mobile usage | Desktop + mobile (observed) |
| Background or foreground | Background |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Unsplash CDN hotlink (Unsplash License). |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Download and upload to Media Library |
| Notes | Hotlinked from Unsplash at runtime. |

## CMS-managed media

These images are not in the repository: they live in Supabase Storage and their URLs are stored in database rows, so they move with the content import rather than with the theme. Each class is one card; every individual URL with its HTTP status is in the appendices.

#### CMS-01 · Blog featured images (329 files)

| Field | Value |
|---|---|
| Asset name / filename | Blog featured images (329 files) |
| Asset type | Photograph / illustration (CMS-managed) |
| Format | Mostly WebP/JPEG/PNG in Supabase Storage |
| Path / location | Supabase Storage bucket `ACI-web` (`tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/...`), column `blog_posts.featured_image_url` |
| Page(s) where used | `/blogs` listing cards, `/blogs/[slug]` hero image, homepage Insights cards (latest posts), related-post cards; also `og:image` of each post |
| Exact section / component | `app/blogs/BlogListingClient.tsx`, `app/blogs/[slug]/page.tsx`, `components/v5/V5Insights.tsx` |
| Purpose / description | Per-post hero/thumbnail |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | Card hover zoom (CSS) |
| Reusable or page-specific | Per-post |
| Original source / generation method | Uploaded through the site admin; original creators not recorded per image. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Import with posts (WP All Import / migration script); sideload into Media Library and set as Featured Image; keep alt text |
| Notes | 329 of 329 load fine (HTTP 200/206). Full URL list in Appendix A. |

#### CMS-02 · Case study featured images (29 files)

| Field | Value |
|---|---|
| Asset name / filename | Case study featured images (29 files) |
| Asset type | Photograph (CMS-managed) |
| Format | Images in Supabase Storage |
| Path / location | Supabase Storage bucket `ACI-web` (`tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/...`), column `case_studies.featured_image_url` |
| Page(s) where used | `/case-studies` listing, `/case-studies/[slug]` hero, `CmsProofCards` on service/industry/platform pages |
| Exact section / component | `app/case-studies/CaseStudiesClient.tsx`, `app/case-studies/[slug]/page.tsx`, `components/v4/page/CmsProofCards.tsx` |
| Purpose / description | Case-study hero / card backdrop |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Background (under scrim) on cards; foreground on detail page |
| Animation / motion usage | Hover transitions (CSS) |
| Reusable or page-specific | Reused across listing, detail and proof grids |
| Original source / generation method | Uploaded through the site admin. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Import with the case-study CPT; set as Featured Image |
| Notes | 29 of 29 load fine. Rows without an image fall back to the v4 industry photos (PH-*). Client names must stay anonymised (`displayClient()`) in WordPress too. |

#### CMS-03 · News images (7 files)

| Field | Value |
|---|---|
| Asset name / filename | News images (7 files) |
| Asset type | Photograph / publication logo (CMS-managed) |
| Format | Images in Supabase Storage |
| Path / location | Supabase Storage bucket `ACI-web` (`tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/...`), column `news.image_url` |
| Page(s) where used | `/news` list (square thumbnail), homepage Insights news cards |
| Exact section / component | `app/news/page.tsx`, `components/v5/V5Insights.tsx` |
| Purpose / description | News item thumbnail |
| Desktop / mobile usage | Desktop + mobile (thumbnail moves above text on mobile) |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Per-item |
| Original source / generation method | Uploaded through the site admin. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Import with news posts; set Featured Image; alt is currently empty (decorative) because the title sits beside it |
| Notes | 7 of 7 load fine. One image (news item "ACI Infotech Unveils ArqAI at World CIO 200 Summit", file `...-GeminiGeneratedImageadt9nhadt9nhadt9-1.webp`) carries the default download name of Google Gemini, which indicates it was AI-generated with Gemini; no prompt is stored in the project. That news title also uses the old "ArqAI" name. |

#### CMS-04 · Whitepaper cover image (1 file)

| Field | Value |
|---|---|
| Asset name / filename | Whitepaper cover image (1 file) |
| Asset type | Cover image (CMS-managed) |
| Format | Image in Supabase Storage |
| Path / location | Supabase Storage bucket `ACI-web` (`tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/...`), column `whitepapers.cover_image` |
| Page(s) where used | `/whitepapers`, `/whitepapers/[slug]` |
| Exact section / component | `app/whitepapers/WhitepapersClient.tsx`, `app/whitepapers/[slug]/page.tsx` |
| Purpose / description | Whitepaper cover |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded through the site admin. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Import with the whitepaper post; Featured Image |
| Notes | 1 of 1 loads. The code fallback cover `/images/whitepapers/retail-benchmark-cover.jpg` is missing (see Broken references). |

#### CMS-05 · Inline images inside blog body HTML (64 references in 25 posts)

| Field | Value |
|---|---|
| Asset name / filename | Inline images inside blog body HTML (64 references in 25 posts) |
| Asset type | Content images (legacy HubSpot) |
| Format | PNG/JPEG/GIF on HubSpot hosts |
| Path / location | Inside `blog_posts.content` HTML: `*.hubspotusercontent-na1.net`, `www.aciinfotech.com/hs-fs/hubfs/...`, `go.aciinfotech.com/...` |
| Page(s) where used | The individual `/blogs/[slug]` posts listed in Appendix B |
| Exact section / component | Blog post body (`dangerouslySetInnerHTML` content) |
| Purpose / description | Diagrams, screenshots and icons inside old articles |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Per-post |
| Original source / generation method | Imported from the previous HubSpot blog. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | During import, download every working image into the Media Library and rewrite the `src` (e.g. WP All Import "download images" or Auto Upload Images); remove or replace the broken ones |
| Notes | 20 still load from HubSpot's CDN (rehosting risk if the HubSpot account closes); 44 are ALREADY BROKEN in 21 posts (`www.aciinfotech.com/hs-fs/...` returns 404, `go.aciinfotech.com` no longer resolves). See Appendix B. |

#### CMS-06 · Blog author photos (55 posts with an author card)

| Field | Value |
|---|---|
| Asset name / filename | Blog author photos (55 posts with an author card) |
| Asset type | Portrait / avatar (CMS-managed reference) |
| Format | Expected image; none load |
| Path / location | `blog_posts.author_image_url`: 54 posts point at `/images/team/aci-team.png` (file missing from the project), 1 post at a private SharePoint link |
| Page(s) where used | `/blogs/[slug]` "About the author" card (only rendered when `author_bio` is set: 55 published posts) |
| Exact section / component | `app/blogs/[slug]/page.tsx:231-246` |
| Purpose / description | Author photo next to the bio (E-E-A-T card) |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | Foreground |
| Animation / motion usage | None |
| Reusable or page-specific | Reused across posts |
| Original source / generation method | CMS field values; the referenced files do not exist or are not public. |
| Original prompt | Not applicable (image is not prompt-generated); no prompt found in project. |
| WordPress migration requirement | Map authors to WordPress users and use profile avatars (Gravatar or a local avatar plugin) |
| Notes | ALL 55 are broken images on the live site today (verified: `/_next/image` returns HTTP 400). When the field is empty the code falls back to `/favicon.ico` (BR-06). |

## Downloadable documents (non-visual)

Not visual assets, listed separately because they are files the site serves and the migration has to carry them.

#### DOC-01 · Playbook PDFs (8 files)

| Field | Value |
|---|---|
| Asset name / filename | Playbook PDFs (8 files) |
| Asset type | Downloadable PDF |
| Format | PDF 1.4, 791 bytes each, all 8 byte-identical |
| Path / location | `aci-infotech/public/playbooks/pdfs/{global-data-unification, healthcare-data-platform, legacy-cloud-migration, multi-source-integration, post-acquisition-consolidation, real-time-data-platform, self-service-analytics, supply-chain-visibility}.pdf` |
| Page(s) where used | `/playbooks/thank-you` (after the gated form on `/playbooks/[slug]`) |
| Exact section / component | `app/api/playbook-leads/download/route.ts:31` returns the path; `app/playbooks/thank-you/page.tsx:101` fallback link |
| Purpose / description | The file a visitor receives after filling in a playbook form |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | n/a |
| Animation / motion usage | None |
| Reusable or page-specific | Reusable (one per playbook) |
| Original source / generation method | Generated placeholder. |
| Original prompt | Not applicable |
| WordPress migration requirement | Upload the REAL playbook PDFs; gate them with the form plugin (e.g. Gravity Forms + protected downloads) |
| Notes | PROBLEM: every file is a one-page placeholder reading "This is a placeholder PDF. The actual playbook content will be available soon. Contact us at contact@aci-infotech.com" (wrong domain). Visitors who fill in the form get this today. |

#### DOC-02 · Whitepaper file (1 file)

| Field | Value |
|---|---|
| Asset name / filename | Whitepaper file (1 file) |
| Asset type | Downloadable PDF (CMS-managed) |
| Format | PDF in Supabase Storage |
| Path / location | Supabase Storage bucket `ACI-web` (`tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/...`), column `whitepapers.file_url` |
| Page(s) where used | `/whitepapers/[slug]` gated download, `/whitepapers/thank-you` |
| Exact section / component | `app/whitepapers/[slug]/WhitepaperDownloadCta.tsx` |
| Purpose / description | Gated whitepaper download |
| Desktop / mobile usage | Desktop + mobile |
| Background or foreground | n/a |
| Animation / motion usage | None |
| Reusable or page-specific | Page-specific |
| Original source / generation method | Uploaded through the site admin. |
| Original prompt | Not applicable |
| WordPress migration requirement | Media Library (protected) + form plugin |
| Notes | 1 of 1 loads. |

#### DOC-03 · ArqVantage eBook (email-only, encrypted)

| Field | Value |
|---|---|
| Asset name / filename | ArqVantage eBook (email-only, encrypted) |
| Asset type | Downloadable PDF (private) |
| Format | AES-256-GCM encrypted PDF |
| Path / location | `aci-infotech/private/ebooks/arqvantage.pdf.enc` (not in `public/`), served by `/dl/arqvantage?k=<token>&e=<email>` |
| Page(s) where used | Not linked from the website; only from the Zoho email campaign |
| Exact section / component | `src/app/dl/[slug]/route.ts`, `src/lib/ebook.ts` |
| Purpose / description | Campaign giveaway, works only with a signed, expiring link |
| Desktop / mobile usage | n/a |
| Background or foreground | n/a |
| Animation / motion usage | None |
| Reusable or page-specific | Campaign-specific |
| Original source / generation method | Supplied by the ACI team. |
| Original prompt | Not applicable |
| WordPress migration requirement | Needs a private-download mechanism in WordPress (signed-URL plugin or keep this route on a subdomain). `EBOOK_SECRET` lives only in the server env files |
| Notes | Listed for completeness: not a visual asset and not publicly reachable. |

## Broken or missing references

| Reference | Where | Problem | Migration action |
|---|---|---|---|
| `/videos/atheros-404.mp4` | `src/app/not-found.tsx:140` | File never added; the 404 video falls through to the external CloudFront copy (EXT-01). | Self-host the video in WordPress. |
| `/images/whitepapers/retail-benchmark-cover.jpg` | `src/app/whitepapers/*` fallback cover | Missing file. Only shown if a whitepaper has no CMS cover (the one live whitepaper has one). | Provide a default cover or drop the fallback. |
| `/whitepapers/pdfs/retail-technology-benchmark-report-2026.pdf` | Whitepaper fallback file path | Missing file. Only used when the CMS row has no `file_url`. | Upload the real PDF if this report is still offered. |
| `/images/logo.png`, `/images/office.jpg` | `LocalBusinessSchema` defaults (`components/seo/StructuredData.tsx:302-303`) | Files do not exist, but the component is not rendered anywhere, so there is no live impact. | When configuring LocalBusiness schema in the SEO plugin, use the real logo and an office photo. |
| `/images/team/aci-team.png` | Blog author card on 54 published posts (`blog_posts.author_image_url`, rendered at `app/blogs/[slug]/page.tsx:237`); also the admin default avatar | File does not exist: the author photo in the "About the author" card is a broken image on every post that has an author bio (`/_next/image` returns 400, the raw file 404). | Use WordPress author avatars (one real ACI avatar for the house author). |
| SharePoint author photo | 1 published post (`ai-ready-data-architecture-2026-the-lakehouse-rebuild-you-need`) | `author_image_url` points at a private SharePoint share link; `/_next/image` returns 400, so the photo is broken. | Upload the photo to the WordPress user profile instead. |
| 44 inline blog images | 21 blog posts (Appendix B) | Legacy HubSpot URLs return 404 / DNS failure. | Find originals or remove the images during import. |
| 8 playbook PDFs | Playbook download flow | Files exist but are placeholders (DOC-01). | Upload the real PDFs. |

## Internal preview / admin-only assets

Referenced only by internal preview routes (`/preview/*`, `/v1`) or the admin area. Visitors never see them; they do not need to move to WordPress.

| File | Format | Referenced only from |
|---|---|---|
| `public/brand/aci-infotech-logo-white.webp` | WEBP, 250x62, 3 KB | `/preview/v2-home` |
| `public/brand/azure-mono.svg` | SVG, viewBox 0 0 59.242 47.271, 199 B | `/preview/v2-home` |
| `public/hero-bg-compressed.mp4` | MP4 (H264), 960x540, 30 fps, 25.03s, 1.2 MB, no audio | `/preview/home`, `/preview/v2-home`, `/v1` |
| `public/images/ArqAI-Logo-white.png` | PNG, 717x253, 13 KB | `/preview/home`, `/preview/v2-home`, `/v1` |
| `public/images/Solution-Partners/dynatrace.png` | PNG, 146x77, 3 KB | `/preview/home`, `/preview/v2-home`, `/preview/v3/next`, `/v1` |
| `public/images/aci-cta-home-bg.jpg` | JPG, 1000x360, 190 KB | `/preview/home`, `/v1` |
| `public/images/brand/logo-white.svg` | SVG, viewBox 0 0 280 60, 634 B | `/admin/login` |
| `public/images/case-studies-bg.jpg` | JPG, 1500x1000, 861 KB | `/preview/home`, `/v1` |
| `public/images/hero-poster.webp` | WEBP, 1920x1080, 4 KB | `/preview/home`, `/v1` |
| `public/images/news/PR-newswire-new.jpg` | JPG, 300x300, 18 KB | `/preview/home`, `/v1` |
| `public/images/news/outlook-new.jpg` | JPG, 300x300, 18 KB | `/preview/home`, `/v1` |
| `public/images/playbook-section-bg.jpg` | JPG, 800x1000, 312 KB | `/preview/home` |
| `public/images/preview-bg/case-financial.jpg` | JPG, 1100x619, 42 KB | `/preview/v3/next` |
| `public/images/preview-bg/case-global.jpg` | JPG, 1100x619, 47 KB | `/preview/v3/next` |
| `public/images/preview-bg/case-manufacturing.jpg` | JPG, 1100x619, 51 KB | `/preview/v3/next` |
| `public/images/preview-bg/svc-ai.jpg` | JPG, 1000x668, 35 KB | `/preview/v3/next` |
| `public/images/preview-bg/svc-data.jpg` | JPG, 1000x667, 72 KB | `/preview/v3/next` |
| `public/images/preview-bg/svc-integration.jpg` | JPG, 1000x1503, 109 KB | `/preview/v3/next` |
| `public/images/preview-bg/svc-run.jpg` | JPG, 1000x667, 77 KB | `/preview/v3/next` |
| `public/video/ArqAI-foundry-v2.webm` | WEBM (VP9), 826x754, 30 fps, 6.43s, 82 KB, no audio | `/preview/home`, `/preview/v2-home`, `/v1` |
| `public/video/factory-graded.mp4` | MP4 (H264), 1920x1080, 100 fps, 9.86s, 2.8 MB, no audio | `/preview/v3/next` |
| `public/video/factory-poster.jpg` | JPG, 1920x1080, 131 KB | `/preview/v3/next` |
| `public/video/hero-graded.mp4` | MP4 (H264), 1920x1080, 30 fps, 10s, 3.0 MB, no audio | `/preview/v3/next` |
| `public/video/hero-poster.jpg` | JPG, 1920x1080, 92 KB | `/preview/v3/next` |
| `public/video/retail-bg-graded.mp4` | MP4 (H264), 1280x720, 24 fps, 10.54s, 3.1 MB, no audio | `/preview/v3/next` |
| `public/video/retail-bg-poster.jpg` | JPG, 1280x720, 136 KB | `/preview/v3/next` |

## Unused assets

### Referenced only by dead code

These are referenced by components that no route imports, so nothing on the site renders them.

| File | Format | Dead reference | Origin |
|---|---|---|---|
| `public/brand/arqai-labs-logo.png` | PNG, 2439x858, 192 KB | `components/v4/hero/EditorialHero.tsx:66` | Added in development commit `fb714ca` (2026-07-15): "v4 hero: pure white bg, new signal video, ArqAI logo, marquee revert". |
| `public/brand/langgraph-wordmark.svg` | SVG, viewBox 0 -15 108 54, 387 B | `components/v4/hero/ServicesSection.tsx:25` | Added in development commit `3e25786` (2026-07-15): "v4 home: services refresh, insights polish, CTA restyle, footer fix". |
| `public/images/Solution-Partners/googlebigquery.svg` | SVG, viewBox 0 0 24 24, 717 B | `components/v4/hero/PlaybooksSection.tsx:51` | Added in development commit `0a28ca4` (2026-06-25): "content+design(preview): supply-chain video, services, hover work". |
| `public/video/Financial-giant-SAP-Modernization.mp4` | MP4 (H264), 1024x576, 30 fps, 267.97s, 21.1 MB, has audio track | `components/layout/Navigation.tsx:474` | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-16 (commit `baf89fd`). Original creator / source not recorded in project. |

### Never referenced

No source file, CSS, metadata or CMS record points at these. They are safe to leave behind (none were deleted).

| File | Format | Origin | Note |
|---|---|---|---|
| `public/GettyImages-1394448388.webm` | WEBM (VP9), 1280x720, 30 fps, 25.03s, 4.9 MB, has audio track | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-07 (commit `83997fc`). Original creator / source not recorded in project. | Original Getty upload behind the legacy hero videos (same bytes as `hero-video.webm`). |
| `public/aci-office-location-on-map.png` | PNG, 2549x1289, 5.1 MB | Uploaded by the ACI team (GitHub user marketing883) on 2026-03-25 (commit `7fce09f`). Original creator / source not recorded in project. | 5.1 MB; superseded by the generated world map (ANI-19). |
| `public/aci-office-location-on-map.webp` | WEBP, 1920x971, 153 KB | Added in development commit `657d2c2` (2026-03-24): "Replace interactive map with optimized static image on contact page". |  |
| `public/brand/MS-Dynamics-365-logo.png` | PNG, 1920x671, 438 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-09-08 (commit `020a68f`). Original creator / source not recorded in project. | Source the live Dynamics 365 glyph was cropped from. |
| `public/brand/aci-infotech-logo.png` | PNG, 301x96, 5 KB | Added in development commit `f4c273d` (2026-04-22): "feat(v2): compressed brand assets + real logo in nav/footer + favicon wiring". |  |
| `public/brand/aci-infotech-logo.webp` | WEBP, 301x96, 7 KB | Added in development commit `f4c273d` (2026-04-22): "feat(v2): compressed brand assets + real logo in nav/footer + favicon wiring". |  |
| `public/brand/dynamics365-icon.png` | PNG, 447x447, 18 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-09-08 (commit `020a68f`). Original creator / source not recorded in project. |  |
| `public/favicon.png` | PNG, 225x225, 24 KB | Added in development commit `fd137aa` (2026-04-22): "feat(v2): editorial mega menus for the v2 navigation". |  |
| `public/file.svg` | SVG, viewBox 0 0 16 16, 391 B | Added in development commit `533a5a7` (2026-01-07): "Set up Next.js project foundation with design system and core components". |  |
| `public/globe.svg` | SVG, viewBox 0 0 16 16, 1 KB | Added in development commit `533a5a7` (2026-01-07): "Set up Next.js project foundation with design system and core components". |  |
| `public/google0f858b4b34c9472f.html` | HTML, 54 B | Added in development commit `cc13a58` (2026-07-01): "chore(seo): add Google Search Console verification file". | Google Search Console verification file. Not visual, but KEEP it (or re-verify via the SEO plugin) after migration. |
| `public/hero-video.webm` | WEBM (VP9), 1280x720, 30 fps, 25.03s, 4.9 MB, has audio track | Added in development commit `5a0ce2a` (2026-01-07): "Add optimized WebM video, lime green hover effects, and larger logo". |  |
| `public/images/228939.jpg` | JPG, 1500x1000, 861 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-09 (commit `c727a28`). Original creator / source not recorded in project. |  |
| `public/images/BenchMark_Report_Retail_2026_-cover.png` | PNG, 573x796, 704 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-02-24 (commit `7677308`). Original creator / source not recorded in project. |  |
| `public/images/QA-testing.jpg` | JPG, 1000x560, 34 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-13 (commit `6e7abfb`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Amit-A.png` | PNG, 400x400, 45 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `d2a1c54`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Amit-A.webp` | WEBP, 400x400, 14 KB | Added in development commit `1bb969e` (2026-01-19): "Revamp About page: enhanced parallax, CEO feature section, leadership team grid". |  |
| `public/images/about-team/Amit-K.png` | PNG, 400x400, 48 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `d2a1c54`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Habib-Mehmoodi.png` | PNG, 400x436, 178 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `424b172`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Habib.png` | PNG, 400x500, 52 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `d2a1c54`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Habib.webp` | WEBP, 400x500, 13 KB | Added in development commit `1bb969e` (2026-01-19): "Revamp About page: enhanced parallax, CEO feature section, leadership team grid". |  |
| `public/images/about-team/Krish.png` | PNG, 400x400, 52 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `d2a1c54`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Krish.webp` | WEBP, 400x400, 15 KB | Added in development commit `1bb969e` (2026-01-19): "Revamp About page: enhanced parallax, CEO feature section, leadership team grid". |  |
| `public/images/about-team/Madhu.png` | PNG, 400x225, 25 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `d2a1c54`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Madhu.webp` | WEBP, 400x225, 12 KB | Added in development commit `1bb969e` (2026-01-19): "Revamp About page: enhanced parallax, CEO feature section, leadership team grid". |  |
| `public/images/about-team/Narayanan.png` | PNG, 400x400, 41 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `d2a1c54`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Narayanan.webp` | WEBP, 400x400, 12 KB | Added in development commit `1bb969e` (2026-01-19): "Revamp About page: enhanced parallax, CEO feature section, leadership team grid". |  |
| `public/images/about-team/Rashmita-EA.jpg` | JPG, 956x1021, 50 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-16 (commit `3f13773`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Thomas.png` | PNG, 400x400, 45 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-19 (commit `51cb9c2`). Original creator / source not recorded in project. |  |
| `public/images/about-team/Thomas.webp` | WEBP, 400x400, 12 KB | Added in development commit `8ab2de0` (2026-01-19): "Add Thomas George's photo and optimize image". |  |
| `public/images/ai-ml-services.jpg` | JPG, 1600x897, 61 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-13 (commit `6e7abfb`). Original creator / source not recorded in project. |  |
| `public/images/app-development.jpg` | JPG, 1000x667, 62 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-13 (commit `b298ef4`). Original creator / source not recorded in project. |  |
| `public/images/arqai/arq-ai-logo-white.svg` | SVG, viewBox 0 0 300 100, 9 KB | Added in development commit `b928dd7` (2026-01-10): "Update Partners and ArqAI sections with new content". |  |
| `public/images/brand/logo-color.svg` | SVG, viewBox 0 0 280 60, 991 B | Added in development commit `11257b4` (2026-01-07): "Add brand logos to header and footer". |  |
| `public/images/cloud-modernization-services.jpg` | JPG, 1600x900, 127 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-13 (commit `6e7abfb`). Original creator / source not recorded in project. |  |
| `public/images/cyber-security.jpg` | JPG, 1000x560, 44 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-13 (commit `6e7abfb`). Original creator / source not recorded in project. |  |
| `public/images/data-engineering.jpg` | JPG, 1000x667, 85 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-13 (commit `6e7abfb`). Original creator / source not recorded in project. |  |
| `public/images/favicon.png` | PNG, 225x225, 24 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-13 (commit `8b6392f`). Original creator / source not recorded in project. |  |
| `public/images/happy-team.jpg` | JPG, 1000x500, 43 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-14 (commit `69c05ff`). Original creator / source not recorded in project. |  |
| `public/images/happy-team.webp` | WEBP, 1000x500, 29 KB | Added in development commit `f45c458` (2026-04-14): "careers: optimise happy-team.jpg and use it as the hero background". |  |
| `public/images/hero/abstract-data-bg.svg` | SVG, viewBox 0 0 1920 1080, 3 KB | Added in development commit `2923dfd` (2026-01-07): "Add image optimization system (Phase 5)". |  |
| `public/images/news/CIO-SUMMIT-Egypt.jpg` | JPG, 250x110, 23 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-12 (commit `9edc776`). Original creator / source not recorded in project. |  |
| `public/images/news/EIN-presswire.jpg` | JPG, 300x300, 17 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-12 (commit `bf7aa33`). Original creator / source not recorded in project. |  |
| `public/images/news/GEC-Newswire.jpg` | JPG, 300x300, 54 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-12 (commit `bf7aa33`). Original creator / source not recorded in project. |  |
| `public/images/news/Jag-post-CIO_post.jpg` | JPG, 250x110, 26 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-12 (commit `9edc776`). Original creator / source not recorded in project. |  |
| `public/images/news/agentforce-partnership.svg` | SVG, viewBox 0 0 400 300, 898 B | Added in development commit `657f776` (2026-01-09): "Redesign NewsSection with horizontal card layout and images on left". |  |
| `public/images/news/arqai-egypt-summit.svg` | SVG, viewBox 0 0 400 300, 1 KB | Added in development commit `657f776` (2026-01-09): "Redesign NewsSection with horizontal card layout and images on left". |  |
| `public/images/news/jag-kanumuri-outlook.svg` | SVG, viewBox 0 0 400 300, 956 B | Added in development commit `657f776` (2026-01-09): "Redesign NewsSection with horizontal card layout and images on left". |  |
| `public/images/news/outlook-india.jpg` | JPG, 200x107, 7 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-12 (commit `b5fc815`). Original creator / source not recorded in project. |  |
| `public/images/news/pr-newswire.jpg` | JPG, 200x107, 7 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-12 (commit `9edc776`). Original creator / source not recorded in project. |  |
| `public/images/news/salesforce-agentforce.svg` | SVG, viewBox 0 0 400 300, 856 B | Added in development commit `657f776` (2026-01-09): "Redesign NewsSection with horizontal card layout and images on left". |  |
| `public/images/news/salesforce-partnership.jpg` | JPG, 150x80, 5 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-01-12 (commit `9edc776`). Original creator / source not recorded in project. |  |
| `public/images/placeholder-image.svg` | SVG, viewBox 0 0 800 600, 385 B | Added in development commit `2923dfd` (2026-01-07): "Add image optimization system (Phase 5)". |  |
| `public/images/services-hero-bg.jpg` | JPG, 1000x560, 71 KB | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-13 (commit `3d89656`). Original creator / source not recorded in project. |  |
| `public/images/v4/SOURCES.md` | MD, 2 KB | Added in development commit `bd960eb` (2026-07-10): "feat(preview): v4 homepage on the Effica structure (royal blue + lime)". | Documentation (photo licences). Keep with the migration records. |
| `public/next.svg` | SVG, viewBox 0 0 394 80, 1 KB | Added in development commit `533a5a7` (2026-01-07): "Set up Next.js project foundation with design system and core components". |  |
| `public/vercel.svg` | SVG, viewBox 0 0 1155 1000, 128 B | Added in development commit `533a5a7` (2026-01-07): "Set up Next.js project foundation with design system and core components". |  |
| `public/video/homepage-cta-bg-video.mp4` | MP4 (H264), 1280x720, 23.98 fps, 9.67s, 6.0 MB, has audio track | Uploaded by the ACI team (GitHub user marketing883) on 2026-02-25 (commit `db81635`). Original creator / source not recorded in project. |  |
| `public/video/manufacturing-graded.mp4` | MP4 (H264), 1920x1012, 25 fps, 8s, 4.5 MB, no audio | Added in development commit `ad73cb5` (2026-06-25): "content+design(preview): calmer confidence, manufacturing video moment". |  |
| `public/video/manufacturing-poster.jpg` | JPG, 1920x1012, 153 KB | Added in development commit `ad73cb5` (2026-06-25): "content+design(preview): calmer confidence, manufacturing video moment". |  |
| `public/video/retail-store-poster.jpg` | JPG, 1920x1012, 254 KB | Added in development commit `6256e9b` (2026-06-25): "content(preview): retail video moment, storyboard services, hard values". |  |
| `public/video/retail-store.mp4` | MP4 (H264), 1920x1012, 25 fps, 17.28s, 4.6 MB, no audio | Added in development commit `6256e9b` (2026-06-25): "content(preview): retail video moment, storyboard services, hard values". |  |
| `public/video/retail-supplychain-poster.jpg` | JPG, 1920x1080, 133 KB | Added in development commit `0a28ca4` (2026-06-25): "content+design(preview): supply-chain video, services, hover work". |  |
| `public/video/retail-supplychain.mp4` | MP4 (H264), 1920x1080, 29.97 fps, 16.08s, 5.6 MB, no audio | Added in development commit `0a28ca4` (2026-06-25): "content+design(preview): supply-chain video, services, hover work". |  |
| `public/videos/20072-307163785_small.mp4` | MP4 (H264), 1920x1080, 25 fps, 28.48s, 18.1 MB, has audio track | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-27 (commit `1bf4feb`). Original creator / source not recorded in project. | File-name pattern of a stock-library download; source not recorded. |
| `public/videos/23730-336607640_tiny.mp4` | MP4 (H264), 1920x1080, 25 fps, 30.08s, 14.7 MB, has audio track | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-27 (commit `023e703`). Original creator / source not recorded in project. | File-name pattern of a stock-library download; source not recorded. |
| `public/videos/Active Theory · Creative Digital Experiences.mp4` | MP4 (H264), 1280x720, 30 fps, 71.2s, 21.7 MB, has audio track | Uploaded by the ACI team (GitHub user marketing883) on 2026-04-27 (commit `3a5508c`). Original creator / source not recorded in project. | Screen recording of a third-party agency website; do not publish. |
| `public/videos/cta-bg.mp4` | MP4 (H264), 1280x720, 23.98 fps, 9.65s, 1.6 MB, has audio track | Added in development commit `bed836b` (2026-02-25): "Redesign homepage CTA section with video background". |  |
| `public/videos/v4-editorial.mp4` | MP4 (H264), 3828x2164, 24 fps, 10.04s, 21.0 MB, no audio | Added in development commit `0be8ee0` (2026-07-11): "feat(v4): replace hero with editorial split (video right, content left)". |  |
| `public/videos/v4-editorial.webm` | WEBM (VP9), 1400x792, 24 fps, 10.04s, 2.1 MB, no audio | Added in development commit `0be8ee0` (2026-07-11): "feat(v4): replace hero with editorial split (video right, content left)". |  |
| `public/videos/v4-hero-bg.mp4` | MP4 (H264), 1924x1076, 24 fps, 10.04s, 13.1 MB, no audio | Added in development commit `1ac2ddb` (2026-07-11): "feat(preview): rebuild /preview/v4 as the video-background hero (VEX spec)". |  |
| `public/videos/v4/ops-loop.mp4` | MP4 (H264), 1200x674, 30 fps, 8.04s, 768 KB, has audio track | Added in development commit `f6af6cf` (2026-07-10): "feat(v4): Remotion ops-loop video for the why-ACI panel". | Remotion-rendered loop (metadata "Made with Remotion 4.0.487"); no longer placed on any page. |
| `public/window.svg` | SVG, viewBox 0 0 16 16, 385 B | Added in development commit `533a5a7` (2026-01-07): "Set up Next.js project foundation with design system and core components". |  |

## Appendix A: CMS image URLs

<details><summary>Blog featured images (`blog_posts.featured_image_url`): 329 URLs, 329 load</summary>

| Record (slug) | URL | HTTP |
|---|---|---|
| `16-elite-tips-that-will-help-businesses-optimize-their-data-analytics` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/16-elite-tips-that-will-help-businesses-optimize-their-data-analytics.jpg | 206 |
| `2024-ai-revolution-in-iot-trends-business-impact` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/2024-ai-revolution-in-iot-trends-business-impact.png | 206 |
| `2024-media-trends-ai-impact-digital-evolution-unveiled` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/2024-media-trends-ai-impact-digital-evolution-unveiled.png | 206 |
| `2024-retail-iot-revolution` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/2024-retail-iot-revolution.png | 206 |
| `3-steps-to-establishing-a-data-analytics-driven-business` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/3-steps-to-establishing-a-data-analytics-driven-business.png | 206 |
| `5-keys-to-upgrade-your-organization-digital-maturity` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/5-keys-to-upgrade-your-organization-digital-maturity.jpg | 206 |
| `5-ways-how-the-right-bi-strategy-can-help-cios-make-better-business-decisions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/5-ways-how-the-right-bi-strategy-can-help-cios-make-better-business-decisions.jpg | 206 |
| `5g-core-observability-why-telcos-cannot-ignore-it` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1784720725790-5g-core-observability-telecom-network-2026.webp | 206 |
| `6rs-of-cloud-migration-for-business-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/6rs-of-cloud-migration-for-business-transformation.webp | 206 |
| `7-most-important-artificial-intelligence-trends-of-2023` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/7-most-important-artificial-intelligence-trends-of-2023.jpg | 206 |
| `9-reasons-why-pharmaceutical-businesses-need-to-move-their-workloads-to-the-cloud` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/9-reasons-why-pharmaceutical-businesses-need-to-move-their-workloads-to-the-cloud.png | 206 |
| `accelerate-sap-s4hana-modernization` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/accelerate-sap-s4hana-modernization.webp | 206 |
| `accelerates-business-processes-and-delivers-business-intelligence` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/accelerates-business-processes-and-delivers-business-intelligence.jpg | 206 |
| `accelerating-psu-digital-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/accelerating-psu-digital-transformation.webp | 206 |
| `aci-has-implemented-material-requirement-planning-mrp-optimization-for-a-texas-based-sheet-metal-fabrication-manufacturing-company` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/aci-has-implemented-material-requirement-planning-mrp-optimization-for-a-texas-based-sheet-metal-fab.png | 206 |
| `aci-has-implemented-production-quality-optimization-to-predict-phosphorous-impurity-for-a-steel-manufacturer-located-in-ohio` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/aci-has-implemented-production-quality-optimization-to-predict-phosphorous-impurity-for-a-steel-manu.png | 206 |
| `aci-has-successfully-implemented-inventory-optimization-to-identify-inventory-pileup-for-a-furniture-manufacturer` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/aci-has-successfully-implemented-inventory-optimization-to-identify-inventory-pileup-for-a-furniture.png | 206 |
| `aci-infotech-has-implemented-demand-forecasting-for-a-large-retail-organization` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/aci-infotech-has-implemented-demand-forecasting-for-a-large-retail-organization.png | 206 |
| `adobe-generative-ai-creative-workflows-2025` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/adobe-generative-ai-creative-workflows-2025.webp | 206 |
| `advanced-analytics-defining-the-future-of-the-business` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/advanced-analytics-defining-the-future-of-the-business.png | 206 |
| `advancing-legal-tech-ediscovery-solutions-digital-data-impact` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/advancing-legal-tech-ediscovery-solutions-digital-data-impact.png | 206 |
| `agentforce-enterprise-ai-use-cases` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/agentforce-enterprise-ai-use-cases.png | 206 |
| `agentforce-service-agent` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/agentforce-service-agent.jpg | 206 |
| `agentic-ai-cybersecurity-what-your-soc-team-must-rethink-in-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1790680200827-agentic-ai-cybersecurity-soc-2026.webp | 206 |
| `agentic-ai-enterprise-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/agentic-ai-enterprise-automation.png | 206 |
| `agentic-ai-in-travel-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/agentic-ai-in-travel-transformation.webp | 206 |
| `agentic-ai-retail` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/agentic-ai-retail.webp | 206 |
| `agentic-ai-tmt` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/agentic-ai-tmt.webp | 206 |
| `agentic-commerce-cpg-2026-how-brands-win-or-lose-on-ai-shelves` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1783940603072-agentic-commerce-cpg-ai-shelves-2026.webp | 206 |
| `agentic-crm-consulting-salesforce-ai-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/agentic-crm-consulting-salesforce-ai-automation.png | 206 |
| `agentic-payments-ai-commerce` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/agentic-payments-ai-commerce.webp | 206 |
| `ai-agent-costs-in-2026-apis-data-fees-budget-risks` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1776171761578-ai-agent-cost-breakdown-enterprise.webp | 206 |
| `ai-agent-negotiation-game-theory-multi-agent-systems-roi` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1779452755936-ai-agent-negotiation-multi-agent-systems-roi.webp | 206 |
| `ai-automation-data-engineering-real-time-analytics` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-automation-data-engineering-real-time-analytics.webp | 206 |
| `ai-cloud-convergence-energy` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-cloud-convergence-energy.webp | 206 |
| `ai-cloud-cross-docking-optimization` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-cloud-cross-docking-optimization.webp | 206 |
| `ai-data-management-solutions-optimize-workflows` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-data-management-solutions-optimize-workflows.png | 206 |
| `ai-data-operating-models-private-markets` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-data-operating-models-private-markets.webp | 206 |
| `ai-data-protection-implementation-ethics` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-data-protection-implementation-ethics.png | 206 |
| `ai-defect-detection-quality-control-manufacturing` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-defect-detection-quality-control-manufacturing.png | 206 |
| `ai-done-smarter-aci-infotech-productivity` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-done-smarter-aci-infotech-productivity.png | 206 |
| `ai-driven-efficiency-healthcare-supply-chains` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-driven-efficiency-healthcare-supply-chains.png | 206 |
| `ai-driven-utilities-sustainability-metrics-green-solutions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-driven-utilities-sustainability-metrics-green-solutions.png | 206 |
| `ai-enabled-cyberattacks-leadership-reset` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-enabled-cyberattacks-leadership-reset.webp | 206 |
| `ai-engineering-digital-twins-enterprise` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-engineering-digital-twins-enterprise.webp | 206 |
| `ai-for-quick-service-restaurants-growth` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-for-quick-service-restaurants-growth.png | 206 |
| `ai-fraud-prevention-banking-ciso-playbook` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-fraud-prevention-banking-ciso-playbook.webp | 206 |
| `ai-governance-agentic-marketing` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-governance-agentic-marketing.webp | 206 |
| `ai-in-crm-erp-systems-2024` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-in-crm-erp-systems-2024.png | 206 |
| `ai-in-medicine-faster-drug-discovery-and-better-care` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-in-medicine-faster-drug-discovery-and-better-care.png | 206 |
| `ai-influence-on-public-sector-transforming-governance` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-influence-on-public-sector-transforming-governance.png | 206 |
| `ai-integration-field-service-5-step-plan` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-integration-field-service-5-step-plan.png | 206 |
| `ai-integration-optimizes-it-service-desks` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-integration-optimizes-it-service-desks.png | 206 |
| `ai-maintenance-energy-sector-predictive-analytics` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-maintenance-energy-sector-predictive-analytics.png | 206 |
| `ai-middleware-solutions-for-intelligent-cloud-integration` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-middleware-solutions-for-intelligent-cloud-integration.webp | 206 |
| `ai-observability-enterprise-ai-adoption` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-observability-enterprise-ai-adoption.webp | 206 |
| `ai-optimized-hybrid-cloud-infrastructure` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-optimized-hybrid-cloud-infrastructure.webp | 206 |
| `ai-personalizing-retail-experiences` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-personalizing-retail-experiences.png | 206 |
| `ai-powered-business-intelligence-driving-insights-and-growth` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-powered-business-intelligence-driving-insights-and-growth.png | 206 |
| `ai-powered-cyber-attacks-autonomous-agents` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1780052277554-ai-powered-cyber-attacks-autonomous-agents.webp | 206 |
| `ai-powered-digital-twins-revolutionizing-industries` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-powered-digital-twins-revolutionizing-industries.png | 206 |
| `ai-powered-manufacturing-automation-smart-production` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-powered-manufacturing-automation-smart-production.png | 206 |
| `ai-powered-service-agentforce` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-powered-service-agentforce.png | 206 |
| `ai-quantum-computing-algorithm-development` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-quantum-computing-algorithm-development.webp | 206 |
| `ai-ready-data-architecture-2026-the-lakehouse-rebuild-you-need` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1781091120944-ai-ready-data-architecture-lakehouse-rebuild.webp | 206 |
| `ai-retail-solutions-personalized-customer-experience` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-retail-solutions-personalized-customer-experience.png | 206 |
| `ai-roi-cloud-data-investments` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-roi-cloud-data-investments.png | 206 |
| `ai-scale-demand-planning-on-azure-cosmos-db-for-retail` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1785154984996-ai-demand-planning-azure-cosmos-db-retail.webp | 206 |
| `ai-solutions-for-warehouses-enhancing-efficiency-with-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-solutions-for-warehouses-enhancing-efficiency-with-automation.png | 206 |
| `ai-solutions-revolutionizing-oil-gas-industry-2024-innovations` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-solutions-revolutionizing-oil-gas-industry-2024-innovations.png | 206 |
| `ai-supply-chain-optimization-pharma-healthcare-logistics` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-supply-chain-optimization-pharma-healthcare-logistics.png | 206 |
| `ai-transforming-pharmaceutical-research` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ai-transforming-pharmaceutical-research.png | 206 |
| `aiops-for-it-operations` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/aiops-for-it-operations.webp | 206 |
| `ais-transformative-impact-on-capital-markets-innovations-efficiency` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ais-transformative-impact-on-capital-markets-innovations-efficiency.png | 206 |
| `an-automated-approach-to-scaling-your-devsecops-organization` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/an-automated-approach-to-scaling-your-devsecops-organization.jpg | 206 |
| `application-modernization-enabling-countless-possibilities-for-businesses` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/application-modernization-enabling-countless-possibilities-for-businesses.jpg | 206 |
| `application-modernization-strategy-for-large-enterprises-in-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1770385733356-Application-Modernization-Strategy.webp | 206 |
| `application-of-managed-services-in-solving-business-problems-in-2022` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/application-of-managed-services-in-solving-business-problems-in-2022.jpg | 206 |
| `appsec-intent-to-execution-devsecops` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/appsec-intent-to-execution-devsecops.webp | 206 |
| `artificial-intelligence-evolution-or-revolution` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/artificial-intelligence-evolution-or-revolution.jpg | 206 |
| `artificial-intelligence-in-customer-experience` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/artificial-intelligence-in-customer-experience.png | 206 |
| `augmented-analytics-bi-evolution` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/augmented-analytics-bi-evolution.png | 206 |
| `autonomous-ai-agents-for-enterprise-it-ops` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/autonomous-ai-agents-for-enterprise-it-ops.webp | 206 |
| `autonomous-networks-2026-close-the-gap-between-detection-and-action` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1784122821108-autonomous-networks-ai-network-operations-2026.webp | 206 |
| `azure-databricks-scalable-data-solutions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/azure-databricks-scalable-data-solutions.png | 206 |
| `bank-integration-document-automation-modern-financial-services` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/bank-integration-document-automation-modern-financial-services.png | 206 |
| `banking-compliance-ai-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/banking-compliance-ai-automation.webp | 206 |
| `becoming-a-fully-intelligent-enterprise-with-sap-technologies` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/becoming-a-fully-intelligent-enterprise-with-sap-technologies.jpg | 206 |
| `benefit-from-visual-analytics-for-real-business-for-cios` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/benefit-from-visual-analytics-for-real-business-for-cios.png | 206 |
| `best-practices-to-ensure-a-seamless-cloud-migration` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/best-practices-to-ensure-a-seamless-cloud-migration.jpg | 206 |
| `blockchain-transparency-insurance-underwriting` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/blockchain-transparency-insurance-underwriting.png | 206 |
| `blockchains-impact-on-supply-chain-management` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/blockchains-impact-on-supply-chain-management.jpg | 206 |
| `boost-sales-ops-with-ai-and-salesforce-cpq` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/boost-sales-ops-with-ai-and-salesforce-cpq.png | 206 |
| `boosting-operational-efficiency-insurance-conga-clm` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/boosting-operational-efficiency-insurance-conga-clm.png | 206 |
| `bounded-autonomy-enterprise-ai-governance-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1775039800822-bounded-autonomy-ai-governance-enterprise-control.webp | 206 |
| `breaking-down-silos-how-azure-devops-fosters-collaboration-across-business-units` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/breaking-down-silos-how-azure-devops-fosters-collaboration-across-business-units.jpg | 206 |
| `build-once-scale-everywhere-servicenow-guide` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/build-once-scale-everywhere-servicenow-guide.webp | 206 |
| `building-products-in-the-digital-age-its-hard-to-get-smart` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/building-products-in-the-digital-age-its-hard-to-get-smart.jpg | 206 |
| `business-efficiency-hyperautomation-solutions-for-maximum-productivity` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/business-efficiency-hyperautomation-solutions-for-maximum-productivity.png | 206 |
| `cdp-in-healthcare-personalizing-patient-experience` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cdp-in-healthcare-personalizing-patient-experience.png | 206 |
| `cisos-and-cios-must-engage-in-digital-risk-management-to-build-a-resilient-digital-business` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cisos-and-cios-must-engage-in-digital-risk-management-to-build-a-resilient-digital-business.png | 206 |
| `cloud-erp-modernization-for-business-agility-and-growth` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1772016620644-modernizing-erp-for-the-cloud.webp | 206 |
| `cloud-journey-success-for-cios-challenges-roadmap-cloud-center-of-excellence-cloud-first-to-cloud-smart` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cloud-journey-success-for-cios-challenges-roadmap-cloud-center-of-excellence-cloud-first-to-cloud-sm.jpg | 206 |
| `cloud-key-to-driving-business-agility` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cloud-key-to-driving-business-agility.png | 206 |
| `cloud-migration-in-financial-services-industry-an-overwhelming-trend` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cloud-migration-in-financial-services-industry-an-overwhelming-trend.jpg | 206 |
| `cloud-migration-in-financial-services-industry-an-overwhelming-trend-old` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cloud-migration-in-financial-services-industry-an-overwhelming-trend-old.jpg | 206 |
| `cloud-retail-solutions-digital-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cloud-retail-solutions-digital-transformation.png | 206 |
| `cloud-smart-enterprise-ai-infrastructure` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cloud-smart-enterprise-ai-infrastructure.webp | 206 |
| `cloud-zombie-resources-cleanup` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cloud-zombie-resources-cleanup.webp | 206 |
| `composable-dxp-vs-monolithic-cms-sitecore-xm-cloud-2025` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/composable-dxp-vs-monolithic-cms-sitecore-xm-cloud-2025.webp | 206 |
| `context-engineering-enterprise-ai-roi` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/context-engineering-enterprise-ai-roi.webp | 206 |
| `covid-19-business-continuity-and-beyond` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/covid-19-business-continuity-and-beyond.jpg | 206 |
| `crafting-brand-prestige-consumer-engagement-success-strategies` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/crafting-brand-prestige-consumer-engagement-success-strategies.png | 206 |
| `creating-effective-power-bi-reports-improve-dashboard-design-visualization-quality` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/creating-effective-power-bi-reports-improve-dashboard-design-visualization-quality.png | 206 |
| `crm-enterprise-data-strategy-engine` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/crm-enterprise-data-strategy-engine.png | 206 |
| `cross-channel-marketing-mastery-unifying-strategies-with-salesforce-marketing-cloud` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cross-channel-marketing-mastery-unifying-strategies-with-salesforce-marketing-cloud.jpg | 206 |
| `cspm-cloud-security` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cspm-cloud-security.png | 206 |
| `cyber-resilience-zero-trust-enterprise` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cyber-resilience-zero-trust-enterprise.webp | 206 |
| `cybersecurity-knowledge-graph-defense-intelligence` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/cybersecurity-knowledge-graph-defense-intelligence.webp | 206 |
| `data-ai-modernization-enterprise-genai` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/data-ai-modernization-enterprise-genai.webp | 206 |
| `data-analytics-empowers-eco-friendly-logistics` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/data-analytics-empowers-eco-friendly-logistics.png | 206 |
| `data-analytics-for-growth-and-success-in-retail` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/data-analytics-for-growth-and-success-in-retail.jpg | 206 |
| `data-analytics-optimizes-procurement-strategy-performance` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/data-analytics-optimizes-procurement-strategy-performance.png | 206 |
| `data-engineering-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/data-engineering-automation.webp | 206 |
| `data-lakehouse-strategy-5-essential-steps-for-c-suite` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1768136573499-Data-Lakehouse-Strategy-5-Essential-Steps-for-C-Suite.webp | 206 |
| `data-mesh-databricks` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/data-mesh-databricks.png | 206 |
| `data-observability-bi` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/data-observability-bi.webp | 206 |
| `data-observability-for-cios` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/data-observability-for-cios.jpg | 206 |
| `databricks-agent-bricks-data-science-agent` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/databricks-agent-bricks-data-science-agent.webp | 206 |
| `databricks-lakebase-oltp-ai-database` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/databricks-lakebase-oltp-ai-database.webp | 206 |
| `databricks-lakeflow-data-management-solutions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/databricks-lakeflow-data-management-solutions.png | 206 |
| `design-driven-life-sciences-solutions-unveiling-business-impact` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/design-driven-life-sciences-solutions-unveiling-business-impact.png | 206 |
| `devops-edge-computing-innovation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/devops-edge-computing-innovation.png | 206 |
| `devsecops-for-kubernetes-the-imperative` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/devsecops-for-kubernetes-the-imperative.jpg | 206 |
| `devsecops-in-2026-why-shift-left-now-means-embedding-ai-into-ci-cd-pipeline` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1776683800397-ai-devsecops-pipeline-security-architecture.webp | 206 |
| `digital-core-with-microsoft-azure` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/digital-core-with-microsoft-azure.png | 206 |
| `digital-experience-the-customers-advantage` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/digital-experience-the-customers-advantage.jpg | 206 |
| `digital-identity-ekyc-fraud-prevention-bfsi-cybersecurity` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/digital-identity-ekyc-fraud-prevention-bfsi-cybersecurity.webp | 206 |
| `digital-transformation-delivers-value` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/digital-transformation-delivers-value.png | 206 |
| `digital-twins-the-art-of-the-possible-in-product-development-and-beyond` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/digital-twins-the-art-of-the-possible-in-product-development-and-beyond.jpg | 206 |
| `discount-analysis-dashboard-implementation-for-a-large-electronics-manufacturer-to-analyze-and-measure-the-effectiveness-of-discount-types` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/discount-analysis-dashboard-implementation-for-a-large-electronics-manufacturer-to-analyze-and-measu.png | 206 |
| `discover-the-latest-trends-and-technologies-in-the-travel-industry` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/discover-the-latest-trends-and-technologies-in-the-travel-industry.png | 206 |
| `discovering-the-benefits-of-unified-endpoint-management` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/discovering-the-benefits-of-unified-endpoint-management.png | 206 |
| `dynamics365-ai-driven-time-management-solutions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/dynamics365-ai-driven-time-management-solutions.png | 206 |
| `early-disease-detection-through-ai-image-analysis` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/early-disease-detection-through-ai-image-analysis.png | 206 |
| `east-coast-refineries-green-hydrogen-tech` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/east-coast-refineries-green-hydrogen-tech.webp | 206 |
| `edge-computing-cybersecurity-vulnerabilities-strategies` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/edge-computing-cybersecurity-vulnerabilities-strategies.png | 206 |
| `edge-native-tinyml-real-time-enterprise-intelligence` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/edge-native-tinyml-real-time-enterprise-intelligence.webp | 206 |
| `efficient-collaboration-streamlining-finance-and-supply-chain-with-servicenow` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/efficient-collaboration-streamlining-finance-and-supply-chain-with-servicenow.png | 206 |
| `eight-trends-predicted-to-define-data-analytics-in-2022` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/eight-trends-predicted-to-define-data-analytics-in-2022.jpg | 206 |
| `empowering-cyber-defense-ctems-proactive-approach` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/empowering-cyber-defense-ctems-proactive-approach.png | 206 |
| `empowering-lenders-tailored-strategies-for-borrower-centric-success` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/empowering-lenders-tailored-strategies-for-borrower-centric-success.png | 206 |
| `empowering-utility-sector-trends-driving-operational-excellence-risk-mitigation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/empowering-utility-sector-trends-driving-operational-excellence-risk-mitigation.png | 206 |
| `enhance-cybersecurity-with-sentiment-analysis` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/enhance-cybersecurity-with-sentiment-analysis.png | 206 |
| `enhancing-drupal-accessibility` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/enhancing-drupal-accessibility.png | 206 |
| `enhancing-security-compliance-with-managed-it-solutions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/enhancing-security-compliance-with-managed-it-solutions.png | 206 |
| `enterprise-ai-cost-optimization-framework-to-maximize-llm-value-in-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1787750969026-enterprise-ai-cost-optimization.webp | 206 |
| `enterprise-ai-readiness-2026-are-you-stalled-shadow-ai-or-truly-ai-native` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1776950737967-enterprise-ai-readiness-maturity-model.webp | 206 |
| `enterprise-application-modernization` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/enterprise-application-modernization.webp | 206 |
| `enterprise-data-observability-dynatrace` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/enterprise-data-observability-dynatrace.png | 206 |
| `enterprise-llmops-scalable-governed-cost-effective-genai` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/enterprise-llmops-scalable-governed-cost-effective-genai.png | 206 |
| `enterprise-snowflake-migration-strategy` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/enterprise-snowflake-migration-strategy.webp | 206 |
| `enterprise-technology-readiness-cloud-data-ai` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/enterprise-technology-readiness-cloud-data-ai.webp | 206 |
| `environmental-social-and-governance-esg-policy` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/environmental-social-and-governance-esg-policy.jpg | 206 |
| `erp-ai-integration-apac-how-manufacturers-win-without-big-sis` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1783510756858-erp-ai-integration-apac-smart-manufacturing-aci-infotech.webp | 206 |
| `erp-to-ai-evolution-manufacturing-operations` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/erp-to-ai-evolution-manufacturing-operations.webp | 206 |
| `ethical-ai-in-life-sciences-impact-guidelines` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ethical-ai-in-life-sciences-impact-guidelines.png | 206 |
| `eu-ai-act-compliance-2026-governance-architecture-for-enterprise-ai` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1783326940967-eu-ai-act-compliance-enterprise-ai-governance-2026.webp | 206 |
| `finops-for-ai-workloads-gpu-cost-optimization` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/finops-for-ai-workloads-gpu-cost-optimization.webp | 206 |
| `from-data-to-insights-how-generative-ai-is-optimising-operations-of-every-industry` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/from-data-to-insights-how-generative-ai-is-optimising-operations-of-every-industry.png | 206 |
| `future-generative-ai-market-growth-business-revolution-2030` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/future-generative-ai-market-growth-business-revolution-2030.png | 206 |
| `future-of-enterprise-apps-with-conversational-interfaces` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/future-of-enterprise-apps-with-conversational-interfaces.png | 206 |
| `future-proof-digital-core-enterprise-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1774440030053-enterprise-digital-core-architecture-transformation.webp | 206 |
| `future-sustainable-technology-readiness` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/future-sustainable-technology-readiness.png | 206 |
| `ga4-predictive-analytics-enterprise-marketing` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/ga4-predictive-analytics-enterprise-marketing.webp | 206 |
| `gcc-enterprise-ai-2026-the-hidden-trait-behind-successful-scaling` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1782987564466-enterprise-ai-scaling-gcc.webp | 206 |
| `gen-ai-redefines-drug-development-healthcare` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/gen-ai-redefines-drug-development-healthcare.png | 206 |
| `genai-meets-platform-engineering` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/genai-meets-platform-engineering.webp | 206 |
| `generative-ai-business-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/generative-ai-business-transformation.png | 206 |
| `gitex-2025-innovation-ai-cloud` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/gitex-2025-innovation-ai-cloud.png | 206 |
| `governance-agentforce-trust-autonomous-ai` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/governance-agentforce-trust-autonomous-ai.webp | 206 |
| `green-it-initiative-sustainability` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/green-it-initiative-sustainability.webp | 206 |
| `grocery-chain-digital-transformation-acceleration-with-these-disrupting-technologies-and-tools` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/grocery-chain-digital-transformation-acceleration-with-these-disrupting-technologies-and-tools.png | 206 |
| `harnessing-generative-ai-trust-loyalty` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/harnessing-generative-ai-trust-loyalty.png | 206 |
| `high-tech-revenue-lifecycle-optimize-with-conga-solutions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/high-tech-revenue-lifecycle-optimize-with-conga-solutions.png | 206 |
| `how-aci-infotech-and-databricks-turn-data-into-real-results` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-aci-infotech-and-databricks-turn-data-into-real-results.png | 206 |
| `how-aci-infotech-helps-enterprises-master-data-observability` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-aci-infotech-helps-enterprises-master-data-observability.png | 206 |
| `how-application-development-and-maintenance-can-be-beneficial-for-any-business` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-application-development-and-maintenance-can-be-beneficial-for-any-business.png | 206 |
| `how-artificial-intelligence-is-transforming-businesses-for-major-industries` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-artificial-intelligence-is-transforming-businesses-for-major-industries.png | 206 |
| `how-automation-makes-managing-remote-workforce-easier` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-automation-makes-managing-remote-workforce-easier.jpg | 206 |
| `how-blockchain-can-help-address-the-top-5-challenges-of-big-data-trends-in-2022` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-blockchain-can-help-address-the-top-5-challenges-of-big-data-trends-in-2022.jpg | 206 |
| `how-business-intelligence-can-reform-your-business-in-2022` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-business-intelligence-can-reform-your-business-in-2022.jpg | 206 |
| `how-data-analytics-became-hyperconverged` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-data-analytics-became-hyperconverged.jpg | 206 |
| `how-data-analytics-became-hyperconverged-1` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-data-analytics-became-hyperconverged-1.jpg | 206 |
| `how-data-is-humanizing-customer-experiences` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-data-is-humanizing-customer-experiences.jpg | 206 |
| `how-databricks-ai-builder-enables-llm-fine-tuning-without-labeled-data` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1771228954448-Databricks-AI-Builder-Enables-LLM-Fine-Tuning-Without-Labeled-Data.webp | 206 |
| `how-do-ipaas-solutions-help-businesses-in-driving-hyperautomation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-do-ipaas-solutions-help-businesses-in-driving-hyperautomation.jpg | 206 |
| `how-is-ai-leading-the-way-for-data-management` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-is-ai-leading-the-way-for-data-management.jpg | 206 |
| `how-leaders-should-create-an-incredible-digital-workplace` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-leaders-should-create-an-incredible-digital-workplace.jpg | 206 |
| `how-rpa-is-playing-a-paramount-role-in-reducing-rd-costs-for-the-pharma-industry` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-rpa-is-playing-a-paramount-role-in-reducing-rd-costs-for-the-pharma-industry.png | 206 |
| `how-technology-is-changing-how-we-treat-application-development` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-technology-is-changing-how-we-treat-application-development.png | 206 |
| `how-to-become-a-data-analytics-driven-enterprise` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-to-become-a-data-analytics-driven-enterprise.jpg | 206 |
| `how-to-build-future-ready-it-architectures-for-innovation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1772807140280-future-ready-enterprise-it-architecture-innovation.webp | 206 |
| `how-to-create-a-customer-centric-experience-that-drives-loyalty` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-to-create-a-customer-centric-experience-that-drives-loyalty.jpg | 206 |
| `how-to-create-the-best-digital-customer-strategy` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-to-create-the-best-digital-customer-strategy.jpg | 206 |
| `how-to-create-the-perfect-digital-experience-with-cloud` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-to-create-the-perfect-digital-experience-with-cloud.jpg | 206 |
| `how-to-hook-your-customers-with-an-innovative-digital-product` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-to-hook-your-customers-with-an-innovative-digital-product.png | 206 |
| `how-to-leverage-intelligent-process-automation-in-your-business` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-to-leverage-intelligent-process-automation-in-your-business.jpg | 206 |
| `how-to-master-data-management-for-ai-and-trust-in-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1770104720088-master-data-management-ai-compliance.webp | 206 |
| `how-to-transform-operations-with-intelligent-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1772545690228-agentic-ai-autonomous-enterprise-transformation.webp | 206 |
| `how-we-deploy-secure-agentforce-solutions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-we-deploy-secure-agentforce-solutions.png | 206 |
| `how-will-multicloud-strategy-dominate-us-enterprises-in-2023` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/how-will-multicloud-strategy-dominate-us-enterprises-in-2023.jpg | 206 |
| `hybrid-cloud-unleash-agility-and-flexibility` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/hybrid-cloud-unleash-agility-and-flexibility.jpg | 206 |
| `hyper-personalized-customer-loyalty-programs-in-financial-services` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1778845393317-enterprise-scale-ai-infrastructure-crisis.webp | 206 |
| `iam-genai-identity-access-management` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/iam-genai-identity-access-management.webp | 206 |
| `importance-of-application-modernization-for-businesses-in-2022` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/importance-of-application-modernization-for-businesses-in-2022.jpg | 206 |
| `improve-on-your-approach-to-application-modernization-with-5-simple-editions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/improve-on-your-approach-to-application-modernization-with-5-simple-editions.png | 206 |
| `improving-the-customer-experience-is-one-of-the-most-sought-after-things-for-any-organization` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/improving-the-customer-experience-is-one-of-the-most-sought-after-things-for-any-organization.jpg | 206 |
| `increase-sales-efficiency-and-revenue-using-ai-tech` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/increase-sales-efficiency-and-revenue-using-ai-tech.png | 206 |
| `industry-4-0-in-action-how-to-transform-your-factory-into-a-self-optimizing-system` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1773299592991-self-optimizing-smart-factory-industry-4-0-manufacturing.webp | 206 |
| `industry-a-revolution-for-digitization-in-manufacturing-sector` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/industry-a-revolution-for-digitization-in-manufacturing-sector.jpg | 206 |
| `industry-cloud-platforms-transforming-vertical-solutions-for-digital-success` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/industry-cloud-platforms-transforming-vertical-solutions-for-digital-success.png | 206 |
| `intelligent-solutions-driving-oil-and-gas-sustainability-iot-insights` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/intelligent-solutions-driving-oil-and-gas-sustainability-iot-insights.png | 206 |
| `iot-customer-experience-solutions-convenience-stores` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/iot-customer-experience-solutions-convenience-stores.png | 206 |
| `iot-security-guidelines-aws-mobility-solutions-safeguard` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/iot-security-guidelines-aws-mobility-solutions-safeguard.png | 206 |
| `is-your-enterprise-really-ai-ready-the-4-dimension-matrix-leaders-never-miss` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1778674221998-enterprise-ai-readiness-matrix-2026.webp | 206 |
| `key-strategies-for-crafting-a-high-performance-analytics-database` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/key-strategies-for-crafting-a-high-performance-analytics-database.png | 206 |
| `kubernetes-for-the-mainframe-era-containerizing-legacy-apps-safely` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1774439324671-containerizing-legacy-apps-kubernetes-modernization.webp | 206 |
| `kubernetes-genai-real-time-inference` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/kubernetes-genai-real-time-inference.webp | 206 |
| `lakehouse-for-retail-future-of-data-management` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/lakehouse-for-retail-future-of-data-management.webp | 206 |
| `lakehouse-migration-ai-data-governance` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1775734114730-lakehouse-data-governance-ai-pipeline.webp | 206 |
| `legacy-vs.-intelligent-erp-systems-which-one-to-adopt` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/legacy-vs-intelligent-erp-systems-which-one-to-adopt.jpg | 206 |
| `low-code-development-platform` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/low-code-development-platform.png | 206 |
| `making-a-new-home-in-cloud-for-financial-services` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/making-a-new-home-in-cloud-for-financial-services.jpg | 206 |
| `managed-it-services-ransomware-defense` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/managed-it-services-ransomware-defense.webp | 206 |
| `managed-services-makeover-cloud-era` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/managed-services-makeover-cloud-era.webp | 206 |
| `martech-consulting-generative-ai-customer-experience` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/martech-consulting-generative-ai-customer-experience.webp | 206 |
| `martech-services-stack-strategy` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/martech-services-stack-strategy.webp | 206 |
| `mastering-business-roles-sap-access-control-s4hana` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/mastering-business-roles-sap-access-control-s4hana.png | 206 |
| `mastering-calculation-groups-in-power-bi-advanced-techniques` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/mastering-calculation-groups-in-power-bi-advanced-techniques.png | 206 |
| `mastering-customer-centric-analytics-deployment-best-practices` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/mastering-customer-centric-analytics-deployment-best-practices.png | 206 |
| `mastering-digital-commerce-efficiency-ai-driven-order-processing-advanced-techniques` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/mastering-digital-commerce-efficiency-ai-driven-order-processing-advanced-techniques.png | 206 |
| `maximizes-roi-with-salesforce-ai` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/maximizes-roi-with-salesforce-ai.png | 206 |
| `maximizing-cloud-roi-generative-ai-integration-for-businesses` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/maximizing-cloud-roi-generative-ai-integration-for-businesses.png | 206 |
| `maximizing-data-security-in-azure-databricks` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/maximizing-data-security-in-azure-databricks.png | 206 |
| `metaverse-revolutionizing-automotive-industry` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/metaverse-revolutionizing-automotive-industry.png | 206 |
| `model-based-vs-model-free-learning-what-ai-agents-use-in-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1779190847623-model-based-vs-model-free-ai-agents-enterprise-ai.webp | 206 |
| `multi-agent-ai-for-cloud-cost-optimization` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1775817490850-lakehouse-data-governance-ai-pipeline-2.webp | 206 |
| `pharma-ai-data-problem-why-clinical-trial-data-kills-your-models` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1789037358163-pharma-ai-clinical-trial-data-infrastructure.webp | 206 |
| `polyfunctional-robots-in-manufacturing-automation-trends-driving-efficiency` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1774441888587-polyfunctional-robots-smart-manufacturing.webp | 206 |
| `quantum-networking-enterprise-infrastructure-readiness` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1777039650784-quantum-networking-infrastructure-enterprise.webp | 206 |
| `real-time-data-streaming-with-apache-kafka-aci-infotech` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1768021347996-2397479.webp | 206 |
| `real-time-revenue-management-mlops` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1774441799708-real-time-revenue-management-mlops-dynamic-pricing-1.webp | 206 |
| `responsible-adaptive-ai-governance-compliance` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1774440286183-responsible-adaptive-ai.webp | 206 |
| `retail-ai-use-cases` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/retail-ai-use-cases.webp | 206 |
| `retail-data-analytics-boost-sales-inventory` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/retail-data-analytics-boost-sales-inventory.png | 206 |
| `retail-marketing-analytics` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/retail-marketing-analytics.webp | 206 |
| `retail-tech-strategies-regulatory-future` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/retail-tech-strategies-regulatory-future.png | 206 |
| `revolutionizing-the-banking-and-finance-sector-unleashing-the-power-of-advance-analytics` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/revolutionizing-the-banking-and-finance-sector-unleashing-the-power-of-advance-analytics.jpg | 206 |
| `robotic-process-automation-and-whether-to-automate-or-not` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/robotic-process-automation-and-whether-to-automate-or-not.jpg | 206 |
| `role-of-automation-in-boosting-the-healthcare-bottom-line` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/role-of-automation-in-boosting-the-healthcare-bottom-line.jpg | 206 |
| `salesforce-agentforce-nvidia-gtc-2026-what-the-partnership-actually-means-for-your-business` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1774613400044-nvidia-salesforce-agentforce-ai-crm-transformation.webp | 206 |
| `salesforce-crm-for-healthcare-companies-to-bringing-better-customer-experience` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/salesforce-crm-for-healthcare-companies-to-bringing-better-customer-experience.png | 206 |
| `salesforce-integration-multi-cloud-growth` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/salesforce-integration-multi-cloud-growth.webp | 206 |
| `salesforce-snowflake-integration-cloud-data-success` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/salesforce-snowflake-integration-cloud-data-success.png | 206 |
| `salesforce-the-key-support-system-of-banks-for-becoming-living-businesses` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/salesforce-the-key-support-system-of-banks-for-becoming-living-businesses.png | 206 |
| `sap-ai-agents-autonomous-erp-operations` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1786967856765-sap-ai-agents-autonomous-erp-operations-2026.webp | 206 |
| `sap-ariba-supplier-collaboration-supply-chain-visibility` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/sap-ariba-supplier-collaboration-supply-chain-visibility.webp | 206 |
| `sap-core-modernization-services` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/sap-core-modernization-services.png | 206 |
| `sap-enterprise-supply-chain-visibility` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/sap-enterprise-supply-chain-visibility.webp | 206 |
| `sap-next-gen-telematics-revolutionizing-automotive` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/sap-next-gen-telematics-revolutionizing-automotive.png | 206 |
| `sap-s-4hana-agentic-ai-building-a-self-optimizing-erp` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1775570444847-agentic-ai-autonomous-erp-sap-s4hana.webp | 206 |
| `sase-cloud-compliance-business-agility` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/sase-cloud-compliance-business-agility.webp | 206 |
| `scalable-data-pipelines-strategies-best-practices` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/scalable-data-pipelines-strategies-best-practices.png | 206 |
| `scaling-retail-ai-vs-legacy-systems` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/scaling-retail-ai-vs-legacy-systems.png | 206 |
| `seamlessly-move-applications-and-workloads-between-aws-and-azure-clouds` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/seamlessly-move-applications-and-workloads-between-aws-and-azure-clouds.png | 206 |
| `secops-reinvention-with-ai-cyber-security` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/secops-reinvention-with-ai-cyber-security.webp | 206 |
| `secure-payment-gateway-transaction-safety-cybersecurity` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/secure-payment-gateway-transaction-safety-cybersecurity.png | 206 |
| `securing-enterprise-from-cyber-chaos-to-cloud-confidence-2025` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/securing-enterprise-from-cyber-chaos-to-cloud-confidence-2025.webp | 206 |
| `self-healing-networks-autonomous-operations-beyond-it-tickets` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1779791462579-self-healing-networks-autonomous-operations.webp | 206 |
| `self-service-analytics-put-your-data-to-work` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/self-service-analytics-put-your-data-to-work.jpg | 206 |
| `serverless-microservices-cloud-native-architecture-scalable-apps` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/serverless-microservices-cloud-native-architecture-scalable-apps.webp | 206 |
| `servicenow-it-operations-autonomous-future-backbone` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/servicenow-it-operations-autonomous-future-backbone.png | 206 |
| `servicenow-itsm-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/servicenow-itsm-automation.jpg | 206 |
| `six-opportunities-for-digital-transformation-in-higher-education` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/six-opportunities-for-digital-transformation-in-higher-education.png | 206 |
| `smart-ai-solutions-for-retail-fraud-detection` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/smart-ai-solutions-for-retail-fraud-detection.png | 206 |
| `smart-manufacturing-with-ai-and-iot-predictive-maintenance-that-prevents-downtime` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1772201186166-ai-iot-predictive-maintenance-manufacturing-industry.webp | 206 |
| `smart-patient-care-with-ai-analytics` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/smart-patient-care-with-ai-analytics.png | 206 |
| `snowflake-driven-ad-roi-strategies` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/snowflake-driven-ad-roi-strategies.png | 206 |
| `snowflake-salesforce-integration` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/snowflake-salesforce-integration.png | 206 |
| `solving-core-business-challenges-with-rpa` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/solving-core-business-challenges-with-rpa.jpg | 206 |
| `sovereign-cloud-healthcare-ai-compliance` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/sovereign-cloud-healthcare-ai-compliance.webp | 206 |
| `spatial-computing-for-enterprises` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/spatial-computing-for-enterprises.webp | 206 |
| `sre-automation-2-ai-runbooks-mttr` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/sre-automation-2-ai-runbooks-mttr.webp | 206 |
| `streamlining-data-engineering-azure-databricks` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/streamlining-data-engineering-azure-databricks.png | 206 |
| `sustainable-ai-green-cloud-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/sustainable-ai-green-cloud-automation.png | 206 |
| `tech-leaders-data-observability` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/tech-leaders-data-observability.png | 206 |
| `the-5-key-benefits-of-microsoft-power-bi-you-must-know` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-5-key-benefits-of-microsoft-power-bi-you-must-know.png | 206 |
| `the-art-of-managing-robotic-process-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-art-of-managing-robotic-process-automation.jpg | 206 |
| `the-benefits-of-intelligent-automation-for-healthcare` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-benefits-of-intelligent-automation-for-healthcare.jpg | 206 |
| `the-best-strategy-for-modernizing-your-applications-in-2023` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-best-strategy-for-modernizing-your-applications-in-2023.png | 206 |
| `the-best-ways-to-effectively-illustrate-data-leveraging-microsoft-power-bi` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-best-ways-to-effectively-illustrate-data-leveraging-microsoft-power-bi.jpg | 206 |
| `the-digital-transformation-journey-post-pandemic-why-cios-from-start-ups-are-first-up-in-the-line` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-digital-transformation-journey-post-pandemic-why-cios-from-start-ups-are-first-up-in-the-line.jpg | 206 |
| `the-enterprise-quantum-agenda-navigating-the-quantum-shift` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1787920451582-enterprise-quantum-readiness-2026.webp | 206 |
| `the-hidden-infrastructure-crisis-why-ai-at-scale-is-breaking-enterprise-it` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1778075229636-ai-infrastructure-crisis-enterprise-scale.webp | 206 |
| `the-impact-of-artificial-intelligence-in-the-next-generation-of-connected-systems` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-impact-of-artificial-intelligence-in-the-next-generation-of-connected-systems.png | 206 |
| `the-importance-of-managed-itservices` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-importance-of-managed-itservices.jpg | 206 |
| `the-paradigm-shift-with-cloud-engineering-and-assurance` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-paradigm-shift-with-cloud-engineering-and-assurance.jpg | 206 |
| `the-questions-leaders-should-ask-in-the-new-era-of-digital-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-questions-leaders-should-ask-in-the-new-era-of-digital-transformation.jpg | 206 |
| `the-rise-of-data-engineering-in-the-digital-era` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-rise-of-data-engineering-in-the-digital-era.jpg | 206 |
| `the-roi-of-azure-devops-how-it-drives-business-growth-and-profitability` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-roi-of-azure-devops-how-it-drives-business-growth-and-profitability.jpg | 206 |
| `the-role-of-artificial-intelligence-in-the-bfs-industry-for-driving-innovation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-role-of-artificial-intelligence-in-the-bfs-industry-for-driving-innovation.jpg | 206 |
| `the-role-of-resiliency-and-hybrid-working-challenges-in-defining-strategies` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-role-of-resiliency-and-hybrid-working-challenges-in-defining-strategies.jpg | 206 |
| `the-secret-to-an-excellent-employee-experience-ex` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-secret-to-an-excellent-employee-experience-ex.png | 206 |
| `the-smartest-way-to-develop-deploy-test-high-quality-applications` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-smartest-way-to-develop-deploy-test-high-quality-applications.jpg | 206 |
| `the-top-5-technologies-that-make-up-the-cios-tech-stack` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-top-5-technologies-that-make-up-the-cios-tech-stack.jpg | 206 |
| `the-top-6-customer-experience-pitfalls-that-will-kill-your-company` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-top-6-customer-experience-pitfalls-that-will-kill-your-company.jpg | 206 |
| `the-ultimate-blueprint-for-developing-a-digital-customer-strategy-for-b2b` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-ultimate-blueprint-for-developing-a-digital-customer-strategy-for-b2b.jpg | 206 |
| `the-ultimate-guide-on-how-to-monetize-data-in-2023-and-beyond` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-ultimate-guide-on-how-to-monetize-data-in-2023-and-beyond.png | 206 |
| `the-unsang-power-of-personalization-in-cost-to-serve-reduction` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/the-unsang-power-of-personalization-in-cost-to-serve-reduction.png | 206 |
| `this-is-how-ai-and-machine-learning-will-transform-your-business` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/this-is-how-ai-and-machine-learning-will-transform-your-business.jpg | 206 |
| `this-is-what-the-modern-work-environment-looks-like` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/blog-images/this-is-what-the-modern-work-environment-looks-like.jpg | 206 |
| `top-6-ai-powered-healthcare-solutions-the-ultimate-tech-guide-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1770720099574-Top-6-AI-Powered-Healthcare-Solutions.webp | 206 |
| `top-technology-trends-enterprises-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1774440102700-technology-trends-enterprises-2026.webp | 206 |
| `unified-data-platforms-driving-better-healthcare-outcomes` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1772020685673-unified-healthcare-data-platform-connected-intelligence.webp | 206 |
| `unity-catalog-metrics-deliver-trusted-kpis-across-your-enterprise` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1780654245498-databricks-unity-catalog-trusted-kpis.webp | 206 |
| `vector-database-strategy-the-key-to-ai-success-in-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1781530015971-enterprise-vector-database-strategy-ai.webp | 206 |
| `why-enterprise-ai-pilots-fail-apac-ai-deployment-lessons` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1782388404003-enterprise-ai-pilot-failure-apac-production-deployment.webp | 206 |
| `why-small-language-models-are-enterprise-artificial-intelligence-s-new-powerhouse` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/blog-images/1770898512859-Small-Language-Models-Are-Enterprise-Artificial-Intelligences-New-Powerhouse.webp | 206 |

</details>

<details><summary>Case study featured images: 29 URLs, 29 load</summary>

| Record (slug) | URL | HTTP |
|---|---|---|
| `accelerating-cloud-monetization-with-aci-infotech-s-sap-brim-expertise` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `accelerating-contract-performance-through-intelligent-automation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `aci-drives-shift-left-cybersecurity-for-medical-device-innovation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `aci-infotech-drives-refinery-excellence-with-kpi-led-digital-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `aci-infotech-powers-enterprise-cloud-modernization-with-proven-excellence` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `aci-s-data-quality-framework-powers-smarter-decisions-in-renewable-energy` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `advisor-productivity-with-intelligent-crm-modernization` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `agile-multi-cloud-transformation-case-study` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `databricks-modernization-ai-enablement-for-leading-c-store-chain` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `digital-procurement-case-study-22-percent-savings` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `driving-enterprise-data-transformation-with-aci-s-azure-lakehouse` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `from-fragmented-systems-to-intelligent-billing-aci-s-sap-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `from-silos-to-speed-aci-infotech-transforms-enterprise-delivery` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `global-cpg-self-service-analytics-brand-managers` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `global-food-facilities-data-intelligence` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `healthcare-cloud-transformation-aws-case-study` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `healthcare-eligibility-verification-automation-aci-yesbot` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `how-aci-infotech-enabled-a-retail-leader-to-unlock-the-power-of-data` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `intelligent-cms-modernization-productivity-engagement` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `logistics-optimization-case-study-10m-savings` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `modernizes-finance-reporting-with-sap-transformation` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `modernizing-critical-operations-with-aci-s-cloud-first-approach` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `modernizing-wealth-advisory-crm-with-aci-s-salesforce-expertise` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `optimizing-enterprise-it-operations-with-automated-devops-and-monitoring` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `retail-transformation-data-driven-decisions` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `salesforce-lightning-migration-healthcare-case-study` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `servicenow-integrated-service-management-construction-case-study` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `servicenow-university-service-transformation-case-study` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |
| `transforming-reactive-it-into-strategic-advantage-with-aci` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/case-studies/`[file name withheld: some case-study file names contain real client names; export from the CMS]` | 206 |

</details>

<details><summary>News images: 7 URLs, 7 load</summary>

| Record (slug) | URL | HTTP |
|---|---|---|
| `0ef4ef0e-1aec-45c8-9939-94eda461e2d1` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/news-images/1776927753874-prnews-1.webp | 206 |
| `0f31d90b-b2df-47f1-9f5f-a4fefa78c297` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/news-images/1775049967230-EIN-presswire.webp | 206 |
| `221790c9-e365-408e-a0e6-2ea2144a43c7` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/news-images/1777638974593-ACI-ceo-firms-100.webp | 206 |
| `45bd204b-e848-4dfb-87af-57c41577d1a0` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/news-images/1777975886163-Forbes-ACI.webp | 206 |
| `bb2934e9-045e-4ffa-a9b1-a7f7a9767656` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/news-images/1776951437611-Outlook-india.webp | 206 |
| `c5150587-5b5a-4605-9888-a808513302cf` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/news-images/1776871387602-GeminiGeneratedImageadt9nhadt9nhadt9-1.webp | 206 |
| `ce0a90b2-8993-4a9f-b72f-b2b998da9ba6` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/news-images/1777008027619-jag-1.webp | 206 |

</details>

<details><summary>Whitepaper cover: 1 URLs, 1 load</summary>

| Record (slug) | URL | HTTP |
|---|---|---|
| `retail-technology-benchmark-report-2026` | https://tfqnmtgycndatkqifsow.supabase.co/storage/v1/object/public/ACI-web/whitepaper-covers/1771956926700-Retail-Technology-Benchmark-Report-2026-cover.webp | 206 |

</details>

## Appendix B: Inline blog images

| Post (slug) | Image URL | Status |
|---|---|---|
| `agentforce-enterprise-ai-use-cases` | https://www.aciinfotech.com/hs-fs/hubfs/undefined-Jun-18-2025-05-38-08-0099-PM.png?width=650&height=975&name=undefined-Jun-18-2025-05-38-08-0099-PM.png | BROKEN (404) |
| `becoming-a-fully-intelligent-enterprise-with-sap-technologies` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20sitepage%20images/Blog-Intelligent-Technologies-S4HANA-development-erp-system.png?width=786&name=Blog-Intelligent-Technologies-S4HANA-development-erp-system.png | BROKEN (404) |
| `becoming-a-fully-intelligent-enterprise-with-sap-technologies` | https://www.aciinfotech.com/hubfs/undefined.jpeg | BROKEN (404) |
| `benefit-from-visual-analytics-for-real-business-for-cios` | https://go.aciinfotech.com/hubfs/Blog/ACI-analytics-and-executive-dashboards-solution-1024x879.png | BROKEN (ERR URLError) |
| `benefit-from-visual-analytics-for-real-business-for-cios` | https://go.aciinfotech.com/hubfs/Blog/Visual_analytics_for-cxos-888x1024.png | BROKEN (ERR URLError) |
| `benefit-from-visual-analytics-for-real-business-for-cios` | https://go.aciinfotech.com/hubfs/Blog/Ebook-Image-v2.png | BROKEN (ERR URLError) |
| `benefit-from-visual-analytics-for-real-business-for-cios` | https://go.aciinfotech.com/hubfs/Blog/1423x250-V2.png | BROKEN (ERR URLError) |
| `cisos-and-cios-must-engage-in-digital-risk-management-to-build-a-resilient-digital-business` | https://go.aciinfotech.com/hubfs/Blog/CISOs-and-CIOs-Are-you-future-ready-changed-Info-300x232.png | BROKEN (ERR URLError) |
| `cisos-and-cios-must-engage-in-digital-risk-management-to-build-a-resilient-digital-business` | https://go.aciinfotech.com/hubfs/Blog/Ebook-Image-v2.png | BROKEN (ERR URLError) |
| `cloud-migration-in-financial-services-industry-an-overwhelming-trend` | https://www.aciinfotech.com/hubfs/undefined-1.png | BROKEN (404) |
| `gen-ai-redefines-drug-development-healthcare` | https://www.aciinfotech.com/hs-fs/hubfs/undefined-2.png?width=663&height=577&name=undefined-2.png | BROKEN (404) |
| `how-artificial-intelligence-is-transforming-businesses-for-major-industries` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/10999-NN4WTF-962x1024.png?width=600&name=10999-NN4WTF-962x1024.png | BROKEN (404) |
| `how-artificial-intelligence-is-transforming-businesses-for-major-industries` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/Ebook-Image-v2-1.png?width=970&name=Ebook-Image-v2-1.png | BROKEN (404) |
| `how-artificial-intelligence-is-transforming-businesses-for-major-industries` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/1423x250-V2.png?width=1015&name=1423x250-V2.png | BROKEN (404) |
| `how-automation-makes-managing-remote-workforce-easier` | https://www.aciinfotech.com/hs-fs/hubfs/thumbnail_image001.jpg?width=600&name=thumbnail_image001.jpg | BROKEN (404) |
| `how-data-analytics-became-hyperconverged-1` | https://www.aciinfotech.com/hs-fs/hubfs/Data-Analytics-Strategy.png?width=100&name=Data-Analytics-Strategy.png | BROKEN (404) |
| `how-data-analytics-became-hyperconverged-1` | https://www.aciinfotech.com/hs-fs/hubfs/Service/big-data-analytics.png?width=1332&name=big-data-analytics.png | BROKEN (404) |
| `how-data-analytics-became-hyperconverged-1` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/big_data_analytics.jpg?width=1000&name=big_data_analytics.jpg | BROKEN (404) |
| `how-data-analytics-became-hyperconverged-1` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/Data-and-Analytics.png%3Fw=500.png?width=300&name=Data-and-Analytics.png%3Fw=500.png | BROKEN (404) |
| `how-data-is-humanizing-customer-experiences` | https://www.aciinfotech.com/hs-fs/hubfs/ACI_Revamp_22/Career/Latest/Financial/Landing%20page/content.png?width=350&name=content.png | BROKEN (404) |
| `how-data-is-humanizing-customer-experiences` | https://www.aciinfotech.com/hs-fs/hubfs/Industry/Customer.png?width=800&name=Customer.png | BROKEN (404) |
| `how-rpa-is-playing-a-paramount-role-in-reducing-rd-costs-for-the-pharma-industry` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/ACIs-RPA-Services-has-Automated-the-Back-office-Processing-for-a-Mid-sized-Bank.png?width=300&name=ACIs-RPA-Services-has-Automated-the-Back-office-Processing-for-a-Mid-sized-Bank.png | BROKEN (404) |
| `how-rpa-is-playing-a-paramount-role-in-reducing-rd-costs-for-the-pharma-industry` | https://www.aciinfotech.com/hs-fs/hubfs/rpa.png?width=1215&height=518&name=rpa.png | BROKEN (404) |
| `how-rpa-is-playing-a-paramount-role-in-reducing-rd-costs-for-the-pharma-industry` | https://www.aciinfotech.com/hs-fs/hubfs/Ebook-Image-v2.png?width=970&height=250&name=Ebook-Image-v2.png | BROKEN (404) |
| `how-to-create-a-customer-centric-experience-that-drives-loyalty` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20sitepage%20images/Email-Personalization.jpg?width=1313&name=Email-Personalization.jpg | BROKEN (404) |
| `how-to-create-a-customer-centric-experience-that-drives-loyalty` | https://www.aciinfotech.com/hs-fs/hubfs/img2.jpg?width=470&name=img2.jpg | BROKEN (404) |
| `how-to-create-a-customer-centric-experience-that-drives-loyalty` | https://www.aciinfotech.com/hs-fs/hubfs/Image-3.jpg?width=638&name=Image-3.jpg | BROKEN (404) |
| `how-to-create-a-customer-centric-experience-that-drives-loyalty` | https://www.aciinfotech.com/hs-fs/hubfs/HM-welcome-email.png?width=758&name=HM-welcome-email.png | BROKEN (404) |
| `how-to-create-a-customer-centric-experience-that-drives-loyalty` | https://www.aciinfotech.com/hs-fs/hubfs/Wrapped-How-to.png?width=758&name=Wrapped-How-to.png | BROKEN (404) |
| `how-to-create-the-perfect-digital-experience-with-cloud` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20sitepage%20images/Starbucks-1024x704-1-1.jpg?width=1024&name=Starbucks-1024x704-1-1.jpg | BROKEN (404) |
| `how-we-deploy-secure-agentforce-solutions` | https://www.aciinfotech.com/hs-fs/hubfs/undefined-Jun-13-2025-03-44-44-3216-PM.png?width=494&height=732&name=undefined-Jun-13-2025-03-44-44-3216-PM.png | BROKEN (404) |
| `improving-the-customer-experience-is-one-of-the-most-sought-after-things-for-any-organization` | https://www.aciinfotech.com/hs-fs/hubfs/Industry/customer_experience_solutions-1-1.png?width=691&name=customer_experience_solutions-1-1.png | BROKEN (404) |
| `industry-a-revolution-for-digitization-in-manufacturing-sector` | https://www.aciinfotech.com/hs-fs/hubfs/IoT-devices.jpg?width=400&name=IoT-devices.jpg | BROKEN (404) |
| `navigating-data-integration-modernization` | https://go.aciinfotech.com/hubfs/Blog/web.jpg | BROKEN (ERR URLError) |
| `navigating-data-integration-modernization` | https://go.aciinfotech.com/hubfs/Blog/network-3154913_640.jpg | BROKEN (ERR URLError) |
| `six-opportunities-for-digital-transformation-in-higher-education` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/digital_transformation_consulting_services.png?width=600&name=digital_transformation_consulting_services.png | BROKEN (404) |
| `six-opportunities-for-digital-transformation-in-higher-education` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/digital-transformation-for-education-industry-768x587.png?width=600&name=digital-transformation-for-education-industry-768x587.png | BROKEN (404) |
| `six-opportunities-for-digital-transformation-in-higher-education` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/1423x250-V2-2.png?width=1423&name=1423x250-V2-2.png | BROKEN (404) |
| `streamlining-data-engineering-azure-databricks` | https://www.aciinfotech.com/hs-fs/hubfs/undefined-3.png?width=877&height=429&name=undefined-3.png | BROKEN (404) |
| `the-questions-leaders-should-ask-in-the-new-era-of-digital-transformation` | https://www.aciinfotech.com/hs-fs/hubfs/Artificial-Intelligence-1.jpg?width=800&name=Artificial-Intelligence-1.jpg | BROKEN (404) |
| `the-questions-leaders-should-ask-in-the-new-era-of-digital-transformation` | https://www.aciinfotech.com/hs-fs/hubfs/How-is-Digital-Transformation-Changing-Marketing_blog.jpg?width=846&height=444&name=How-is-Digital-Transformation-Changing-Marketing_blog.jpg | BROKEN (404) |
| `the-questions-leaders-should-ask-in-the-new-era-of-digital-transformation` | https://www.aciinfotech.com/hs-fs/hubfs/Imported%20images/sn-employee-exprience-icon.png?width=300&name=sn-employee-exprience-icon.png | BROKEN (404) |
| `what-big-data-predictive-analytics-and-the-rise-of-artificial-intelligence-mean-for-retail-businesses` | https://www.aciinfotech.com/hs-fs/hubfs/Image1.1-288x300.png?width=288&name=Image1.1-288x300.png | BROKEN (404) |
| `what-big-data-predictive-analytics-and-the-rise-of-artificial-intelligence-mean-for-retail-businesses` | https://www.aciinfotech.com/hs-fs/hubfs/Ebook-Image-v2.png?width=970&name=Ebook-Image-v2.png | BROKEN (404) |
| `aci-has-implemented-material-requirement-planning-mrp-optimization-for-a-texas-based-sheet-metal-fabrication-manufacturing-company` | https://7528309.fs1.hubspotusercontent-na1.net/hub/7528309/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/facebook-color.png?width=28&name=facebook-color.png | OK |
| `aci-has-implemented-material-requirement-planning-mrp-optimization-for-a-texas-based-sheet-metal-fabrication-manufacturing-company` | https://7528302.fs1.hubspotusercontent-na1.net/hub/7528302/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/linkedin-color.png?width=28&name=linkedin-color.png | OK |
| `aci-has-implemented-material-requirement-planning-mrp-optimization-for-a-texas-based-sheet-metal-fabrication-manufacturing-company` | https://7528304.fs1.hubspotusercontent-na1.net/hub/7528304/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/twitter-color.png?width=28&name=twitter-color.png | OK |
| `aci-has-implemented-material-requirement-planning-mrp-optimization-for-a-texas-based-sheet-metal-fabrication-manufacturing-company` | https://7528311.fs1.hubspotusercontent-na1.net/hub/7528311/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/pinterest-color.png?width=28&name=pinterest-color.png | OK |
| `aci-has-implemented-material-requirement-planning-mrp-optimization-for-a-texas-based-sheet-metal-fabrication-manufacturing-company` | https://7528311.fs1.hubspotusercontent-na1.net/hub/7528311/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/email-color.png?width=28&name=email-color.png | OK |
| `aci-has-implemented-production-quality-optimization-to-predict-phosphorous-impurity-for-a-steel-manufacturer-located-in-ohio` | https://7528309.fs1.hubspotusercontent-na1.net/hub/7528309/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/facebook-color.png?width=28&name=facebook-color.png | OK |
| `aci-has-implemented-production-quality-optimization-to-predict-phosphorous-impurity-for-a-steel-manufacturer-located-in-ohio` | https://7528302.fs1.hubspotusercontent-na1.net/hub/7528302/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/linkedin-color.png?width=28&name=linkedin-color.png | OK |
| `aci-has-implemented-production-quality-optimization-to-predict-phosphorous-impurity-for-a-steel-manufacturer-located-in-ohio` | https://7528304.fs1.hubspotusercontent-na1.net/hub/7528304/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/twitter-color.png?width=28&name=twitter-color.png | OK |
| `aci-has-implemented-production-quality-optimization-to-predict-phosphorous-impurity-for-a-steel-manufacturer-located-in-ohio` | https://7528311.fs1.hubspotusercontent-na1.net/hub/7528311/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/pinterest-color.png?width=28&name=pinterest-color.png | OK |
| `aci-has-implemented-production-quality-optimization-to-predict-phosphorous-impurity-for-a-steel-manufacturer-located-in-ohio` | https://7528311.fs1.hubspotusercontent-na1.net/hub/7528311/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/email-color.png?width=28&name=email-color.png | OK |
| `aci-has-successfully-implemented-inventory-optimization-to-identify-inventory-pileup-for-a-furniture-manufacturer` | https://7528309.fs1.hubspotusercontent-na1.net/hub/7528309/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/facebook-color.png?width=28&name=facebook-color.png | OK |
| `aci-has-successfully-implemented-inventory-optimization-to-identify-inventory-pileup-for-a-furniture-manufacturer` | https://7528302.fs1.hubspotusercontent-na1.net/hub/7528302/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/linkedin-color.png?width=28&name=linkedin-color.png | OK |
| `aci-has-successfully-implemented-inventory-optimization-to-identify-inventory-pileup-for-a-furniture-manufacturer` | https://7528304.fs1.hubspotusercontent-na1.net/hub/7528304/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/twitter-color.png?width=28&name=twitter-color.png | OK |
| `aci-has-successfully-implemented-inventory-optimization-to-identify-inventory-pileup-for-a-furniture-manufacturer` | https://7528311.fs1.hubspotusercontent-na1.net/hub/7528311/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/pinterest-color.png?width=28&name=pinterest-color.png | OK |
| `aci-has-successfully-implemented-inventory-optimization-to-identify-inventory-pileup-for-a-furniture-manufacturer` | https://7528311.fs1.hubspotusercontent-na1.net/hub/7528311/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/email-color.png?width=28&name=email-color.png | OK |
| `discount-analysis-dashboard-implementation-for-a-large-electronics-manufacturer-to-analyze-and-measure-the-effectiveness-of-discount-types` | https://7528309.fs1.hubspotusercontent-na1.net/hub/7528309/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/facebook-color.png?width=28&name=facebook-color.png | OK |
| `discount-analysis-dashboard-implementation-for-a-large-electronics-manufacturer-to-analyze-and-measure-the-effectiveness-of-discount-types` | https://7528302.fs1.hubspotusercontent-na1.net/hub/7528302/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/linkedin-color.png?width=28&name=linkedin-color.png | OK |
| `discount-analysis-dashboard-implementation-for-a-large-electronics-manufacturer-to-analyze-and-measure-the-effectiveness-of-discount-types` | https://7528304.fs1.hubspotusercontent-na1.net/hub/7528304/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/twitter-color.png?width=28&name=twitter-color.png | OK |
| `discount-analysis-dashboard-implementation-for-a-large-electronics-manufacturer-to-analyze-and-measure-the-effectiveness-of-discount-types` | https://7528311.fs1.hubspotusercontent-na1.net/hub/7528311/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/pinterest-color.png?width=28&name=pinterest-color.png | OK |
| `discount-analysis-dashboard-implementation-for-a-large-electronics-manufacturer-to-analyze-and-measure-the-effectiveness-of-discount-types` | https://7528311.fs1.hubspotusercontent-na1.net/hub/7528311/hubfs/raw_assets/public/mV0_d-web-default-modules_hubspot/img/email-color.png?width=28&name=email-color.png | OK |

## Summary

| # | Measure | Result |
|---|---|---|
| 1 | Total assets identified | **615 used on the live site**: 159 project media files (incl. `src/app/favicon.ico`), 3 externally hosted files, 366 CMS images + 64 inline blog images (44 of them broken), 20 code-rendered animations, and 3 icon systems (92 Lucide icons + X icon + inline SVG marks). Separately: 3 downloadable documents (10 files), 26 preview/admin-only files, and 77 unused files. |
| 2 | Total videos | **24 video files used on the site, 14 distinct clips**: 23 files stored in the project (10 WebM + 13 MP4; 13 clips, most shipped as a WebM + MP4 pair) + 1 externally hosted clip (404 page). 1 more is referenced but missing (`atheros-404.mp4`). 21 further video files in the repo are unused or preview-only. |
| 3 | Total AI/prompt-generated videos | **0 confirmed.** Nothing in the project documents any video as AI- or prompt-generated. 1 clip (`noc-soc`, 2 files) is rendered by code with Remotion, which is not prompt-based. For 5 clips the origin is undocumented, so AI generation can be neither confirmed nor ruled out: foldcraft, v4-slide1, office-hero, retail-bg and the external 404 video. |
| 4 | Videos with original prompts found | **0** |
| 5 | Videos where the original source/prompt could not be found | **Prompt not found: all 14 clips.** No prompt exists in the project for any video. **Source (origin) also not found: 5 clips**: `foldcraft`, `v4-slide1`, `office-hero` (encoded from an ACI upload of unknown origin), `retail-bg` (ACI upload) and the external 404 video. Source is documented for the other 9: Getty Images (`v4-editorial-signal`, legacy hero `hero-video` / `hero-bg-compressed`), Pexels (`data-velocity`, `decision-intelligence`, `reliable-scale`, `intelligent-operations`), Rawpixel (`event-hero`), Ray-Ban Meta campaign film (`draw-promo`), Remotion render (`noc-soc`). |
| 6 | Animation-based visuals that are NOT video files | **20** (ANI-01 to ANI-20): 2 canvas engines (FlowScene on 29 pages, ParticleRings), 5 Framer Motion systems, CSS keyframe sets, JS scroll/parallax/scrub effects, a generated SVG world map and a procedural noise texture. No Lottie/Rive/GSAP on the public site. |
| 7 | Pages/components scanned | 56 public page routes (every one crawled) + 7 special public entries (loading, not-found, manifest, robots, sitemap, `/dl/[slug]`, `/llms.txt`) + 9 internal preview routes + the admin area; 210 route entries; 492 reachable source files (all TSX/TS/CSS) plus 46 dead files checked; 269 files in `public/`; 162 browser page loads (145 desktop + 15 mobile pages); 439 CMS rows (402 blogs, 29 case studies, 7 news, 1 whitepaper) with 431 media URLs checked. |
| 8 | Assets requiring special attention | See list below (14 groups). |

**Special attention during the WordPress migration**

1. Videos with no documented origin (cannot confirm stock vs filmed vs AI-generated): `foldcraft.webm/.mp4`, `v4-slide1.webm/.mp4`, `office-hero.webm/.mp4` (from an ACI upload), `retail-bg.mp4` (ACI upload), and the external 404 video (EXT-01). Ask whoever supplied them before migrating; no prompt exists in the project for any of them.
2. Licensed stock / third-party footage that needs a licence check before re-publishing: Getty Images (`v4-editorial-signal.*`, legacy `hero-video.mp4` + `hero-bg-compressed.webm`), Pexels (4 success-story clips), Rawpixel (`aion-2026/event-hero.mp4`), Ray-Ban Meta campaign film and product shot (AION LP).
3. Heavy files to compress before upload: `v4-slide1.mp4` (19.1 MB), `hero-video.mp4` (16.7 MB, fallback only), `foldcraft.mp4` (7.3 MB), `retail-bg.mp4` (6.7 MB, no WebM sibling), the external 404 video (4.4 MB at 3828px wide), `ArqAI-Labs-Logo.png` / `-light.png` (~400 KB for small marks).
4. Code-rendered visuals that must be rebuilt, not uploaded: FlowScene canvas (29 pages), ParticleRings, homepage hero carousel, success-story tabs, mega menu, parallax balloons, 404 scrub video, world map (see ANI-01 to ANI-20).
5. SVG files (68 on the live site: 54 tech logos plus partner logos, glyphs and wordmarks) need SVG upload support in WordPress (Safe SVG; core WordPress blocks SVG uploads) or bundling in the theme.
6. CMS media lives in Supabase, not the repo: 366 featured/news/cover images must be sideloaded with the content import; 20 inline blog images still load from HubSpot's CDN and 44 in 21 posts are already broken.
7. Broken author photos: the "About the author" card on all 55 published posts that have an author bio shows a broken image (54 point at the missing `/images/team/aci-team.png`, 1 at a private SharePoint link). Use WordPress user avatars.
8. Client names in file names: several case-study cover images in Supabase have the real client name in the file name (the anonymised case-study text does not). WordPress keeps file names in media URLs, so rename these files on import. They are deliberately not listed in this document.
9. AI-generated image (not video): one news image is named like a Google Gemini export (`GeminiGeneratedImage...`). It is the only asset whose name points to AI generation; no prompt is stored for it.
10. Placeholder playbook PDFs: all 8 downloads are a one-page "placeholder" PDF with a wrong email domain. Supply the real files.
11. Outdated default share image: `/og-image.png` still shows the old white v4 hero; regenerate for the current design.
12. Missing files referenced by code: `/videos/atheros-404.mp4` (live 404 page falls back to the external copy), whitepaper fallback cover + PDF (only used if the CMS row lacks them), `/images/team/aci-team.png` (live, see item 7).
13. Duplicates to consolidate: two white logos (`/aci-infotech-logo-white.png` and `/brand/aci-infotech-logo-white.png`), `<picture>` PNG/JPG fallbacks next to their WebP versions (migrate one format), favicon used as the blog author avatar.
14. Positioning/legal: `ArqAI-Logo-no-tagline.png` carries the old "ArqAI" name (correct: ArqAI Labs). Headshots need consent on file. Badge artwork (GSA, Great Place to Work 2024-25, ISO, CMMi) must keep the issuers' usage rules and current years.
