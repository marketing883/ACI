# ACI Homepage Scroll Storyboard and Art Direction

Light theme, cinematic. The spec a 3D or motion artist and a front-end build follow. Built on the creative direction and the messaging spine. The visual is rendered, not drawn in code. No crude SVG.

## Art direction

### Canvas and mood

White, but not empty. A clean white ground with depth built from composition, layering, and shadow, not from haze. High contrast and graphic, closer to Sin City than to a soft studio render. Black ink and line work carry the structure, blue carries the brand, and depth comes from 2.5D layering and light rather than photoreal volume. Wide field and cinematic framing, but crisp and high contrast, not glowy.

The feeling across the whole page is calm precision. Bright, engineered, expensive. The drama comes from the data material transforming, not from color noise or flashing motion.

### The method: perceived 3D, spent precisely

Cinematic here does not mean a big-budget photoreal render of everything. It means resourceful art direction. One real, well-made 3D element carries the weight, and everything around it is lighter graphic work, layered and composed so the whole thing feels rich. Think Sin City or Spider-Man Noir, or a low-budget film that feels expensive because the director spends exactly where it counts and stylizes the rest.

Two things make this work for ACI.

First, the spot-color logic. Sin City is near-monochrome with one color used surgically. That is our palette already. A black-and-white world with blue structure, almost graphic and flat, with lime as the only live spark, placed only where data becomes intelligence. The restraint is the style, and it is cheap to execute well.

Second, spend on one hero element. Pick a single real 3D object, the thing the data flows into and through, and make that one asset excellent. Light it once, reuse it across the beats from different angles. The rest is 2.5D: layered graphic planes, parallax, grain and halftone texture, vector marks, and depth that comes from composition and light, not from rendering everything in 3D.

This is more distinctive than a photoreal render, far cheaper, consistent enough for generative tools to produce the layer art, and buildable directly in the browser.

### The data material

One form, held the whole way down: the icosahedron. It signifies data at every stage. It never changes identity, only quality. Raw data is rough and dirty, refined data is clean and sharp, and intelligence in production is a single pristine icosahedron with a lime core. One motif, a whole quality gradient.

Raw state, how we show dirty data: many tiny icosahedrons, scattered and drifting, each one wrong in its own way. Deformed, lopsided geometry with uneven facets and different sizes, because nothing is standardized. Chipped edges, cracked or caved faces, a pitted, stippled, grainy fill instead of clean white. Dull and smudged, with ink bleed and noise around them. Some overlap, which reads as duplicates. Some are ghosted or half missing, which reads as incomplete records. No lime anywhere, because there is no intelligence yet. The whole field jitters, unstable.

The cleaning gradient, how it refines: the geometry regularizes into true icosahedrons, faces smooth, edges resolve into crisp clean lines, the noise and smudges clear to white. They snap onto a blue lattice and align, duplicates merge, gaps fill. Many consolidate into fewer, then into one. Only at the end does lime ignite at the core.

End state: a single pristine icosahedron, sharp faceted, clean white and precise blue, with a steady lime core. Stable, lit, running. This is in production.

Build note: this is one shape rendered many ways, instanced geometry, so it stays performant and it is literally one owned form the whole way down. The cleanest possible version of spend on one object.

### Palette and accent

Base: black on white. Clean white ground, near-black for text and line work. High contrast and graphic, which suits the Sin City treatment and keeps the page fast and readable.

The accents, in strict order:

- Blue is the primary accent. It carries the structure and the brand, used with intent, never spread into glowing gradients. Solid, deliberate, near-architectural.
- Lime is the spark. Used sparingly, for maximum impact, only where data becomes intelligence. Never a background, never overpowering. One or two lime moments per view at most. The rarity is the whole point.
- White ground, black ink, blue structure, lime spark. That order is the discipline. The moment lime spreads or blue glows, it cheapens.

### Typography

Editorial display type for headlines, tight tracking, real whitespace, confident not loud. Monospace for metrics, figure labels, and the small technical captions. The mono is the dialect that says engineers built this.

### Motion principles

Scroll-driven, with a sticky stage. The data material stays pinned in view while the copy scrolls past and advances its state. Each element has its own motion, but they resolve into one continuous travel through the pipeline, the Framer feel you described.

Restraint over spectacle. Slow camera, smooth easing, satisfying state changes at each beat so the visitor feels distance covered. A subtle progress marker shows where they are in the pipeline, because visible progress is what keeps people scrolling. Motion explains the transformation. It never just decorates.

## The hero (the trailer)

One cinematic shot that plays the whole journey in a few seconds. We open in the raw state, a field of tiny dirty icosahedrons scattered in disarray. A slow push begins, and as the camera travels they clean, align, and consolidate, ending on one pristine icosahedron with a lime core, running in production. Short, not elaborate. It sets the promise, then settles into a held frame that becomes the entry to the scroll.

Copy over the hero:

- H1: From data foundation to AI outcomes.
- Sub: We engineer the data foundation, build the AI on top, and run it in production. Most enterprise AI stalls before it gets there.
- Button: Get in touch.
- Proof line: 250+ systems in production. $1B value delivered. 95% client retention.

Load behavior: a poster still paints first for speed, the short clip or scroll-scrubbed sequence loads after. The H1, sub, and proof are real text in the HTML, not baked into the video.

## The scroll journey, beat by beat

The hero settles, the camera pulls back, and the same material becomes the constant that travels with the scroll. Each beat is one station. The sticky stage holds the material, the copy scrolls beside it, the partner shows up as a tool at the relevant beat, not as its own scene.

Each beat carries: a visual transformation, a plain headline and line, one proof point, and one soft next step into a deeper page. The text stands on its own.

### Beat 1, Strategy and assessment

Scene: a vast field of tiny, dirty, malformed icosahedrons drifting in disarray. Faint survey lines sweep across them, measuring and mapping the mess. Nothing is fixed yet, but the chaos is now being read.

Copy:
- Headline: Start with the outcome, not the tool.
- Line: We map your operation and find where AI actually pays off, before anyone builds.
- Proof: A paid assessment, with a prioritized roadmap in two to three weeks.
- Next step: See how we assess.

### Beat 2, Modernize the foundation

Scene: the scattered icosahedrons begin migrating onto a clean blue grid forming beneath them. Rough data settling onto modern ground, starting to sit in ordered rows. Databricks, Snowflake, and Azure appear as small tool marks on the structure.

Copy:
- Headline: Move your data onto modern ground.
- Line: Lakehouse migration on Databricks, Snowflake, and Azure, without the rip and replace.
- Proof: A convenience chain went from days to under four hours, and saved $4.2M across 500+ stores.
- Next step: See the migration work.

### Beat 3, Engineer and integrate

Scene: separate clusters of icosahedrons link up and begin moving together, many silos resolving into a few aligned streams flowing through the frame.

Copy:
- Headline: Connect the silos into one clean flow.
- Line: Pipelines and multi-source integration that turn scattered systems into one source of truth.
- Proof: A global operation unified across 34 countries, with 78% faster processing.
- Next step: See the integration work.

### Beat 4, Govern and trust

Scene: the streams pass through a precise gate. Malformed icosahedrons are corrected into true form, duplicates merge, missing faces fill, surface grime is scrubbed off. They come out clean, uniform, and crisp, snapped to a sharp blue lattice. The first hint of lime appears at the gate.

Copy:
- Headline: Make the data AI can trust.
- Line: Governance, quality, and compliance built in, so the AI on top holds up to audit.
- Proof: Governed to SOC 2, ISO 27001, and HIPAA-ready standards, with Informatica.
- Next step: See how we govern data.

### Beat 5, Analytics and intelligence

Scene: the clean, uniform icosahedrons arrange into legible formations, ordered patterns that read as understanding rather than raw data. The data becomes something you can act on.

Copy:
- Headline: Put the answers in your team's hands.
- Line: Self-service intelligence that turns the data into decisions people actually make.
- Proof: Brand managers cut campaign analysis from three weeks to four hours, with 94% adoption.
- Next step: See the analytics work.

### Beat 6, Applied AI and GenAI

Scene: the clean icosahedrons consolidate and assemble into one larger faceted icosahedron, the system taking shape. Lime begins to ignite at its core. Intelligence becoming a built thing.

Copy:
- Headline: Build the AI on a foundation that holds.
- Line: Copilots, agents, and RAG systems built on data that is finally ready for them.
- Proof: 12 live engagements, a 94% eval pass rate, and 90 days from first build to production.
- Next step: See the AI work.

### Beat 7, In production and run

Scene: a single pristine icosahedron, sharp and clean, with a steady lime core glowing, holding stable. The hero shot from the trailer, now earned. A quiet pulse shows it is live and monitored in production.

Copy:
- Headline: Past the pilot. Into production. Run for good.
- Line: We ship it into your live environment, govern every action, and operate it after launch.
- Proof: 250+ systems in production, $1B value delivered, 95% client retention.
- Next step: Get in touch.

## After the journey (the resolve)

The cinematic budget ends at beat 7. Below it the page returns to clean, conventional sections, still light and precise:

- Proof: two or three full case studies with hard numbers.
- By industry: the same journey applied to financial services, retail, manufacturing, hospitality, and CPG. One promise and one proof each.
- The full capability foundation: the rest of the services, findable, for buyers who shop by capability.
- ArqAI: a light, partner-framed mention.
- Trust and certifications, then a final call to action.

## How this gets built, so it hits the bar

Assets: the one hero 3D element is a faceted icosahedron, the refined crystal the data resolves into, with a lime spark at its core. Because an icosahedron is a geometric primitive, we generate it natively rather than download anyone's file, so there are no license strings and it is fully ours. Build it once in the engine or model it fresh, light it well, and re-frame it across the beats from different angles. Everything else is lighter graphic work: 2.5D layered planes, parallax, grain and halftone texture, vector marks, and the lime spot color, composed for depth rather than fully rendered. The layer art can be generated, since a stylized graphic look holds consistency far more easily than photoreal. This is produced and art-directed, not shapes drawn in code and hoped over, but it is browser-native and within reach.

Build: a sticky pinned stage with scroll driving the scene, in Framer or a custom front end with a smooth-scroll layer. One embedded 3D model plus 2.5D parallax layers. Each beat is a scroll waypoint that re-frames the hero object, advances the graphic layers, and brings in the copy.

Light-theme craft: keep the paper base off pure white so it does not blow out, reserve clean quiet space for the copy so text never sits on busy areas, and hold contrast for readability and accessibility.

Non-negotiables that protect speed and AI visibility:
- All headlines, lines, and proof are real text in semantic HTML. View Page Source must show them.
- Poster still first, heavy sequence deferred, off the critical path. LCP under 2.5s.
- A reduced-motion fallback that swaps the animation for clean static key frames at each beat.
- Real anchor links on every next step. JSON-LD on the page.

What is explicitly out: drawing the cinematic scene as live SVG or canvas primitives and hoping it looks good. The hero and the beats are rendered assets, art-directed to the look above.
