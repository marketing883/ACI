# CLAUDE.md

Memory for Claude Code when working on the ACI Infotech site.

## Copywriting rules

### Write like a human, not like an AI

Every piece of marketing copy on this site is direct, plain-spoken
English, the way a senior engineer would actually talk. Not the way a
consulting deck would phrase it.

Tells that the copy has drifted into AI-speak:

- "already know how to", "so that you can", "we enable you to",
  "leverage", "drive value", "unlock"
- Hollow amplifiers: "proven pattern", "many times over",
  "battle-tested", "best in class"
- Serial parallelism that reads like a slide bullet list ("the
  problems we solve, the outcomes we deliver, the stack that carries
  each build")
- Polished sentences with no edge

Fix by:

- Using concrete verbs ("ship", "stitch", "wire", "unify",
  "inventory") and concrete objects ("the bill", "the audit", "the
  close").
- Cutting filler. Short sentences beat long ones.
- Letting one line carry a small wink. A single dry aside per
  paragraph (a "google giggle") is what separates human copy from AI
  copy. Do not force a joke. Let one land, where it fits.
- Reading the draft out loud. If it does not sound like a person the
  reader would actually want to hire, rewrite.

### Never leave a widow word

A widow is a single word (or very short fragment) stranded on the last line
of a heading, subheading, or paragraph. Widows look unfinished and
amateurish. This applies to every piece of marketing copy on the site:
hero headlines, section H2s, section sub-headlines, card titles, CTA
copy, everything.

Enforce this by:

1. **Rewriting.** Prefer rewording so the last line of the wrapped copy
   has at least two real words. This is the right fix almost always.
2. **Authored line breaks.** For marquee headlines where the exact shape
   matters (hero H1, section H2s), author the copy as an explicit
   two-line tuple or pre-break it with a non-breaking space (` `)
   between the final two words so the browser never separates them.
3. **Test across widths.** Check the wrap at a typical desktop preview
   viewport before declaring a copy change done. "Works on my screen"
   is not sufficient - widows usually appear at a different width.

Avoid em-dashes (`—`) and en-dashes (`–`) in body copy. Plain sentences,
short words, one or two relevant buzzwords where they earn their keep.
Human voice, not marketing gloss.

## Where things live

- Next.js app: `aci-infotech/`
- Reimagined homepage preview route: `src/app/preview/home/page.tsx`
- Preview-only components: `src/components/preview/home/`
- Shared Playbooks source data: `src/components/sections/PlaybookVaultSection.tsx`
- Navigation (handles transparent overlay on dark-hero routes):
  `src/components/layout/Navigation.tsx` + `ConditionalLayout.tsx`
- Client name anonymization helper: `src/lib/content/anonymize.ts` -
  every visible client reference on the site goes through
  `displayClient()`; real `client_name` must never render.

## Verification before committing

Run from `aci-infotech/`:

- `npx tsc --noEmit`
- `npx eslint <changed files>`
- `npx tsx scripts/check-voice-rules.ts`
- `npx tsx scripts/check-no-client-leak.ts`
