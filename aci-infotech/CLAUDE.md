# CLAUDE.md

Memory for Claude Code when working on the ACI Infotech site.

## Copywriting rules

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
