/**
 * Atheros content indexer.
 *
 * Pipeline:
 *   1. Load LPs from src/lib/lp-content.ts, services/industries/platforms
 *      from src/data/*.ts, and case_studies / blog_posts / whitepapers from
 *      Supabase (read via service-role).
 *   2. Chunk each source into logical sections (hero, offerings, process,
 *      outcomes, case study, FAQ). Target 400-600 tokens per chunk with a
 *      1200-token hard cap.
 *   3. Sanitize: every chunk passes through displayClient + a denylist of
 *      known real client names. Any hit fails the indexer loudly.
 *   4. Embed via OpenAI text-embedding-3-small in batches of 100.
 *   5. Checksum-skip: if sha256(text) matches the row already in the table,
 *      leave it alone. Otherwise upsert.
 *   6. Write to public.content_chunks via the service role.
 *
 * Run:
 *   cd aci-infotech
 *   npx tsx scripts/index-content.ts [--full] [--source lp,service,...]
 *
 * Env vars required:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY.
 */

import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { embedTexts } from '@/lib/copilot/embeddings';
import { log } from '@/lib/copilot/logger';
import { displayClient } from '@/lib/content/anonymize';
import { services } from '@/data/services';
import { industries } from '@/data/industries';
import { platforms } from '@/data/platforms';
import { LP_CONTENT } from '@/lib/lp-content';
import type {
  ContentChunk,
  ServiceEntry,
  IndustryEntry,
  PlatformEntry,
  CaseStudyStub,
} from '@/data/types';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DENYLIST = [
  // These names should never appear in any indexed chunk. The content team
  // is swapping them out of hardcoded page data; this script is the backstop.
  'MSCI',
  'RaceTrac',
  'Sodexo',
  'Coca-Cola',
  'Walmart',
  'Pepsi',
];

const MAX_CHUNK_CHARS = 5000; // ~1200 tokens soft cap
const TARGET_CHUNK_CHARS = 2200; // ~550 tokens target

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function sanitize(text: string, where: string): void {
  for (const name of DENYLIST) {
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i');
    if (re.test(text)) {
      log.error('indexer', `client_leak: "${name}" in ${where}`, {
        extra: { where, snippet: text.slice(0, 200) },
      });
      throw new Error(`[indexer] client_leak: "${name}" found in ${where}`);
    }
  }
}

function estimateTokens(text: string): number {
  // Rough approximation; OpenAI 1 token ~= 4 chars for English prose.
  return Math.ceil(text.length / 4);
}

interface ProtoChunk {
  source_type: ContentChunk['source_type'];
  source_slug: string;
  title: string;
  section_path?: string;
  text: string;
  metadata: ContentChunk['metadata'];
}

function pushChunk(
  out: ProtoChunk[],
  chunk: ProtoChunk,
  where: string,
): void {
  if (!chunk.text || chunk.text.trim().length === 0) return;
  if (chunk.text.length > MAX_CHUNK_CHARS) {
    log.warn('indexer', `chunk over cap (${chunk.text.length} chars) at ${where}; truncating`, {
      extra: { where },
    });
    chunk.text = chunk.text.slice(0, MAX_CHUNK_CHARS);
  }
  sanitize(chunk.text, where);
  sanitize(chunk.title, `${where}:title`);
  out.push(chunk);
}

// ---------------------------------------------------------------------------
// Chunkers
// ---------------------------------------------------------------------------

function chunkService(s: ServiceEntry): ProtoChunk[] {
  const out: ProtoChunk[] = [];
  const where = `service:${s.slug}`;
  pushChunk(
    out,
    {
      source_type: 'service',
      source_slug: s.slug,
      title: s.title,
      section_path: 'hero',
      text: [s.title, s.tagline, s.description].filter(Boolean).join('\n'),
      metadata: { cluster: s.id },
    },
    `${where}:hero`,
  );
  if (s.keyOutcomes?.length) {
    pushChunk(
      out,
      {
        source_type: 'service',
        source_slug: s.slug,
        title: `${s.title} outcomes`,
        section_path: 'outcomes',
        text: s.keyOutcomes.map((o) => `- ${o}`).join('\n'),
        metadata: { cluster: s.id, outcomes: s.keyOutcomes },
      },
      `${where}:outcomes`,
    );
  }
  for (const off of s.offerings ?? []) {
    pushChunk(
      out,
      {
        source_type: 'service',
        source_slug: s.slug,
        title: `${s.title} offering: ${off.title}`,
        section_path: `offering.${off.id}`,
        text: [off.title, off.description, (off.technologies ?? []).join(', '), (off.outcomes ?? []).join('; ')]
          .filter(Boolean)
          .join('\n'),
        metadata: { cluster: s.id, tech: off.technologies ?? [] },
      },
      `${where}:offering.${off.id}`,
    );
  }
  for (const cs of s.caseStudies ?? []) {
    pushChunk(
      out,
      caseStubChunk(cs, 'service', s.slug, s.title, { cluster: s.id }),
      `${where}:case.${cs.slug}`,
    );
  }
  for (let i = 0; i < (s.faqs ?? []).length; i++) {
    const f = s.faqs![i];
    pushChunk(
      out,
      {
        source_type: 'service',
        source_slug: s.slug,
        title: `${s.title} FAQ: ${f.question}`,
        section_path: `faq.${i}`,
        text: `Q: ${f.question}\nA: ${f.answer}`,
        metadata: { cluster: s.id },
      },
      `${where}:faq.${i}`,
    );
  }
  return out;
}

function chunkIndustry(e: IndustryEntry): ProtoChunk[] {
  const out: ProtoChunk[] = [];
  const where = `industry:${e.slug}`;
  pushChunk(
    out,
    {
      source_type: 'industry',
      source_slug: e.slug,
      title: e.title,
      section_path: 'hero',
      text: [e.title, e.tagline, e.description].filter(Boolean).join('\n'),
      metadata: { industry: e.id },
    },
    `${where}:hero`,
  );
  for (const uc of e.useCases ?? []) {
    pushChunk(
      out,
      {
        source_type: 'industry',
        source_slug: e.slug,
        title: `${e.title}: ${uc.title}`,
        section_path: `usecase.${uc.title.toLowerCase().replace(/\s+/g, '-')}`,
        text: [uc.title, uc.description].filter(Boolean).join('\n'),
        metadata: { industry: e.id },
      },
      `${where}:usecase`,
    );
  }
  for (const cs of e.caseStudies ?? []) {
    pushChunk(
      out,
      caseStubChunk(cs, 'industry', e.slug, e.title, { industry: e.id }),
      `${where}:case.${cs.slug}`,
    );
  }
  return out;
}

function chunkPlatform(e: PlatformEntry): ProtoChunk[] {
  const out: ProtoChunk[] = [];
  const where = `platform:${e.slug}`;
  pushChunk(
    out,
    {
      source_type: 'platform',
      source_slug: e.slug,
      title: e.title,
      section_path: 'hero',
      text: [e.title, e.tagline, e.description].filter(Boolean).join('\n'),
      metadata: { platform: e.id },
    },
    `${where}:hero`,
  );
  for (const c of e.capabilities ?? []) {
    pushChunk(
      out,
      {
        source_type: 'platform',
        source_slug: e.slug,
        title: `${e.title}: ${c.title}`,
        section_path: `cap.${c.title.toLowerCase().replace(/\s+/g, '-')}`,
        text: [c.title, c.description].filter(Boolean).join('\n'),
        metadata: { platform: e.id },
      },
      `${where}:cap`,
    );
  }
  for (const cs of e.caseStudies ?? []) {
    pushChunk(
      out,
      caseStubChunk(cs, 'platform', e.slug, e.title, { platform: e.id }),
      `${where}:case.${cs.slug}`,
    );
  }
  return out;
}

function caseStubChunk(
  cs: CaseStudyStub,
  parentType: ContentChunk['source_type'],
  parentSlug: string,
  parentTitle: string,
  baseMetadata: ContentChunk['metadata'],
): ProtoChunk {
  const anon = displayClient(cs);
  const results = cs.results.map((r) => `${r.metric}: ${r.description}`).join('\n');
  // Propagate the case study's own industry into chunk metadata so a
  // manufacturing case nested under the microsoft-dynamics platform page
  // still answers queries like "Dynamics 365 for manufacturing".
  const caseIndustry = normalizeIndustryLabel(cs.industry);
  return {
    source_type: parentType,
    source_slug: parentSlug,
    title: `${parentTitle}: ${anon}`,
    section_path: `case.${cs.slug}`,
    text: [
      `Client: ${anon}`,
      `Industry: ${cs.industry ?? baseMetadata.industry ?? 'Enterprise'}`,
      `Challenge: ${cs.challenge}`,
      cs.solution ? `Solution: ${cs.solution}` : '',
      `Results:\n${results}`,
      cs.technologies?.length ? `Technologies: ${cs.technologies.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    metadata: {
      ...baseMetadata,
      ...(caseIndustry
        ? { industry: caseIndustry as ContentChunk['metadata']['industry'] }
        : {}),
      tech: cs.technologies ?? [],
    },
  };
}

/**
 * Normalize a free-text industry label from LP_CONTENT proofItems into one
 * of the canonical IndustryId values used across services/industries data.
 * Returns undefined when no known industry matches.
 */
function normalizeIndustryLabel(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const s = raw.toLowerCase();
  if (/(financial|fintech|bank|insur|capital)/.test(s)) return 'financial-services';
  if (/(health|hospital|payer|provider|clinical|life scienc)/.test(s)) return 'healthcare';
  if (/(retail|ecommerce|omnichannel|cpg)/.test(s)) return 'retail';
  if (/(manufactur|factory|shopfloor|supply chain|mes|scada)/.test(s))
    return 'manufacturing';
  if (/(hospitality|hotel|restaurant|travel)/.test(s)) return 'hospitality';
  if (/(energy|utilit|oil|gas|grid)/.test(s)) return 'energy';
  if (/(transport|logistic|freight|fleet|shipping)/.test(s)) return 'transportation';
  return undefined;
}

function chunkLP(lp: unknown): ProtoChunk[] {
  const out: ProtoChunk[] = [];
  // LP_CONTENT entries have a stable shape; cast via the runtime shape.
  const c = lp as {
    slug: string;
    serviceCluster?: string;
    keyword?: string;
    metaTitle?: string;
    metaDescription?: string;
    headline?: string;
    subheadline?: string;
    painPoints?: Array<{ title: string; description: string }>;
    processSteps?: Array<{ step?: string; title: string; description: string }>;
    stats?: Array<{ value: string; label: string }>;
    benefits?: Array<{ title: string; description: string }>;
    faqs?: Array<{ question: string; answer: string }>;
    proofItems?: Array<{ headline: string; description: string; industry?: string }>;
  };
  const where = `lp:${c.slug}`;
  const title = c.metaTitle ?? c.headline ?? c.slug;
  // Derive an industry tag for this LP: first proof item with a known
  // industry wins. Falls back to slug-based heuristics so LPs like
  // `retail-data-modernization` are still industry-tagged. Without this
  // tag, LP chunks never match ctx.industry and lose ranking on composite
  // queries ("Dynamics 365 for manufacturing").
  const industryFromProof = (c.proofItems ?? [])
    .map((p) => normalizeIndustryLabel(p.industry))
    .find((x): x is string => Boolean(x));
  const industryFromSlug = normalizeIndustryLabel(c.slug.replace(/-/g, ' '));
  const lpIndustry = industryFromProof ?? industryFromSlug;
  const baseMeta = {
    cluster: c.serviceCluster as ContentChunk['metadata']['cluster'],
    ...(lpIndustry
      ? { industry: lpIndustry as ContentChunk['metadata']['industry'] }
      : {}),
  } satisfies ContentChunk['metadata'];
  pushChunk(
    out,
    {
      source_type: 'lp',
      source_slug: c.slug,
      title,
      section_path: 'hero',
      text: [c.headline, c.subheadline, c.metaDescription, c.keyword].filter(Boolean).join('\n'),
      metadata: baseMeta,
    },
    `${where}:hero`,
  );
  if (c.painPoints?.length) {
    pushChunk(
      out,
      {
        source_type: 'lp',
        source_slug: c.slug,
        title: `${title}: pain points`,
        section_path: 'pain-points',
        text: c.painPoints.map((p) => `- ${p.title}: ${p.description}`).join('\n'),
        metadata: baseMeta,
      },
      `${where}:pain`,
    );
  }
  if (c.processSteps?.length) {
    pushChunk(
      out,
      {
        source_type: 'lp',
        source_slug: c.slug,
        title: `${title}: process`,
        section_path: 'process',
        text: c.processSteps.map((p) => `${p.step ?? ''}. ${p.title}: ${p.description}`).join('\n'),
        metadata: baseMeta,
      },
      `${where}:process`,
    );
  }
  if (c.benefits?.length) {
    pushChunk(
      out,
      {
        source_type: 'lp',
        source_slug: c.slug,
        title: `${title}: benefits`,
        section_path: 'benefits',
        text: c.benefits.map((b) => `- ${b.title}: ${b.description}`).join('\n'),
        metadata: baseMeta,
      },
      `${where}:benefits`,
    );
  }
  // One chunk per proof item, tagged with the specific industry on the
  // proof so "Dynamics 365 for manufacturing" can match the manufacturing
  // proof point inside the broader dynamics-365-implementation LP without
  // pulling the whole LP's hero.
  for (let i = 0; i < (c.proofItems ?? []).length; i++) {
    const p = c.proofItems![i];
    const proofIndustry = normalizeIndustryLabel(p.industry);
    const proofMeta = {
      ...baseMeta,
      ...(proofIndustry
        ? { industry: proofIndustry as ContentChunk['metadata']['industry'] }
        : {}),
    } satisfies ContentChunk['metadata'];
    pushChunk(
      out,
      {
        source_type: 'lp',
        source_slug: c.slug,
        title: `${title} proof: ${p.headline}`,
        section_path: `proof.${i}`,
        text: [
          p.industry ? `Industry: ${p.industry}` : '',
          `Headline: ${p.headline}`,
          p.description,
        ]
          .filter(Boolean)
          .join('\n'),
        metadata: proofMeta,
      },
      `${where}:proof.${i}`,
    );
  }
  if (c.faqs?.length) {
    for (let i = 0; i < c.faqs.length; i++) {
      const f = c.faqs[i];
      pushChunk(
        out,
        {
          source_type: 'lp',
          source_slug: c.slug,
          title: `${title} FAQ: ${f.question}`,
          section_path: `faq.${i}`,
          text: `Q: ${f.question}\nA: ${f.answer}`,
          metadata: baseMeta,
        },
        `${where}:faq.${i}`,
      );
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Supabase loaders
// ---------------------------------------------------------------------------

// Loose client type so we can pass the result of createClient(url, key)
// without threading Database generics through every helper. The indexer
// runs with service-role privileges against a small, stable subset of
// columns; the compile-time safety trade-off is accepted.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

type DbRow = Record<string, unknown>;

async function loadDbCaseStudies(supabase: SupabaseClient): Promise<ProtoChunk[]> {
  const { data, error } = await supabase
    .from('case_studies')
    .select('slug,industry,headline,excerpt,challenge,solution,results,metrics,technologies,client_descriptor');
  if (error) {
    log.error('indexer', error, { extra: { phase: 'load case_studies' } });
    return [];
  }
  const out: ProtoChunk[] = [];
  for (const row of (data as DbRow[] | null) ?? []) {
    const anon = displayClient(row as unknown as { client_descriptor?: string | null });
    const metrics = Array.isArray(row.metrics) ? row.metrics : [];
    const results = Array.isArray(row.results) ? row.results : [];
    const text = [
      `Client: ${anon}`,
      row.industry ? `Industry: ${row.industry}` : '',
      row.headline ? `Headline: ${row.headline}` : '',
      row.excerpt ? `Summary: ${row.excerpt}` : '',
      row.challenge ? `Challenge: ${row.challenge}` : '',
      row.solution ? `Solution: ${row.solution}` : '',
      results.length ? `Results:\n${results.map((r: { metric?: string; description?: string }) => `${r.metric ?? ''}: ${r.description ?? ''}`).join('\n')}` : '',
      metrics.length ? `Metrics:\n${metrics.map((m: { label?: string; value?: string }) => `${m.label ?? ''}: ${m.value ?? ''}`).join('\n')}` : '',
      Array.isArray(row.technologies) && row.technologies.length
        ? `Technologies: ${row.technologies.join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');
    if (!text.trim()) continue;
    pushChunk(
      out,
      {
        source_type: 'case_study',
        source_slug: row.slug as string,
        title: (row.headline as string) || anon,
        section_path: 'summary',
        text,
        // Normalize the raw DB industry label ("Manufacturing", "Banking",
        // etc.) to the canonical IndustryId so retrieval boosts on
        // ctx.industry (always lower-case canonical) match.
        metadata: {
          industry: normalizeIndustryLabel(row.industry as string | undefined) as
            | ContentChunk['metadata']['industry']
            | undefined,
        },
      },
      `case_study:${row.slug}`,
    );
  }
  return out;
}

async function loadDbBlogs(supabase: SupabaseClient): Promise<ProtoChunk[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug,title,excerpt,content,category,tags,author_name,author_title')
    .eq('is_published', true);
  if (error) {
    log.warn('indexer', error, { extra: { phase: 'load blog_posts' } });
    return [];
  }
  const out: ProtoChunk[] = [];
  for (const row of (data as DbRow[] | null) ?? []) {
    const excerpt = (row.excerpt as string) ?? '';
    const content = (row.content as string) ?? '';
    const slug = row.slug as string;
    const title = (row.title as string) ?? slug;
    // Chunk long blog content by paragraph groups under the soft target.
    const full = [excerpt, content].filter(Boolean).join('\n\n');
    const paragraphs = full.split(/\n{2,}/).filter((p) => p.trim().length > 0);
    let current = '';
    let partIdx = 0;
    const flush = () => {
      if (!current.trim()) return;
      pushChunk(
        out,
        {
          source_type: 'blog',
          source_slug: slug,
          title: `${title} (part ${partIdx + 1})`,
          section_path: `part.${partIdx}`,
          text: current.trim(),
          metadata: {},
        },
        `blog:${slug}:${partIdx}`,
      );
      partIdx += 1;
      current = '';
    };
    for (const p of paragraphs) {
      if ((current.length + p.length) > TARGET_CHUNK_CHARS && current.length > 0) {
        flush();
      }
      current = current ? `${current}\n\n${p}` : p;
    }
    flush();
  }
  return out;
}

async function loadDbWhitepapers(supabase: SupabaseClient): Promise<ProtoChunk[]> {
  const { data, error } = await supabase
    .from('whitepapers')
    .select('slug,title,description,excerpt,category,tags');
  if (error) {
    log.warn('indexer', error, { extra: { phase: 'load whitepapers' } });
    return [];
  }
  const out: ProtoChunk[] = [];
  for (const row of (data as DbRow[] | null) ?? []) {
    const text = [row.title, row.excerpt, row.description, row.category]
      .filter(Boolean)
      .join('\n');
    if (!text.trim()) continue;
    pushChunk(
      out,
      {
        source_type: 'whitepaper',
        source_slug: row.slug as string,
        title: (row.title as string) ?? (row.slug as string),
        section_path: 'summary',
        text,
        metadata: {},
      },
      `whitepaper:${row.slug}`,
    );
  }
  return out;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface IndexReport {
  totals: Record<string, number>;
  written: number;
  skipped: number;
  errors: number;
  tokensUsed: number;
  costUsd: number;
}

async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('[indexer] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(2);
  }
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const args = process.argv.slice(2);
  const fullRebuild = args.includes('--full');
  const sourceFilter = new Set<string>(
    (args.find((a) => a.startsWith('--source='))?.split('=')[1] ?? '')
      .split(',')
      .filter(Boolean),
  );
  const wantSource = (t: string) =>
    sourceFilter.size === 0 || sourceFilter.has(t);

  const chunks: ProtoChunk[] = [];

  if (wantSource('lp')) {
    for (const lp of Object.values(LP_CONTENT)) {
      chunks.push(...chunkLP(lp));
    }
  }
  if (wantSource('service')) {
    for (const s of Object.values(services)) chunks.push(...chunkService(s));
  }
  if (wantSource('industry')) {
    for (const e of Object.values(industries)) chunks.push(...chunkIndustry(e));
  }
  if (wantSource('platform')) {
    for (const e of Object.values(platforms)) chunks.push(...chunkPlatform(e));
  }
  if (wantSource('case_study')) {
    chunks.push(...(await loadDbCaseStudies(supabase)));
  }
  if (wantSource('blog')) {
    chunks.push(...(await loadDbBlogs(supabase)));
  }
  if (wantSource('whitepaper')) {
    chunks.push(...(await loadDbWhitepapers(supabase)));
  }

  const report: IndexReport = {
    totals: {},
    written: 0,
    skipped: 0,
    errors: 0,
    tokensUsed: 0,
    costUsd: 0,
  };
  for (const c of chunks) report.totals[c.source_type] = (report.totals[c.source_type] ?? 0) + 1;

  console.log(`[indexer] collected ${chunks.length} proto-chunks:`, report.totals);

  // Load existing checksums so we can skip unchanged chunks on re-run.
  const existingChecksums = new Map<string, string>(); // key = source_type|source_slug|section_path
  if (!fullRebuild) {
    const { data, error } = await supabase
      .from('content_chunks')
      .select('source_type,source_slug,section_path,checksum');
    if (error) {
      log.warn('indexer', error, { extra: { phase: 'load checksums' } });
    } else {
      for (const r of data ?? []) {
        const k = `${r.source_type}|${r.source_slug}|${r.section_path ?? ''}`;
        existingChecksums.set(k, r.checksum as string);
      }
    }
  }

  // Decide which chunks need (re)embedding.
  const toEmbed: Array<ProtoChunk & { checksum: string }> = [];
  for (const c of chunks) {
    const checksum = sha256(c.text);
    const key = `${c.source_type}|${c.source_slug}|${c.section_path ?? ''}`;
    const prior = existingChecksums.get(key);
    if (prior === checksum) {
      report.skipped += 1;
      continue;
    }
    toEmbed.push({ ...c, checksum });
  }

  console.log(
    `[indexer] ${toEmbed.length} chunks require (re)embedding; ${report.skipped} unchanged skipped.`,
  );

  if (toEmbed.length > 0) {
    const texts = toEmbed.map((c) => c.text);
    const embedRes = await embedTexts(texts, 'indexer');
    if (!embedRes) {
      console.error('[indexer] embeddings disabled (OPENAI_API_KEY missing)');
      process.exit(3);
    }
    report.tokensUsed = embedRes.tokensUsed;
    report.costUsd = embedRes.costUsd;

    // Upsert in batches.
    const rows = toEmbed.map((c, i) => ({
      source_type: c.source_type,
      source_slug: c.source_slug,
      section_path: c.section_path ?? null,
      title: c.title,
      text: c.text,
      metadata: c.metadata,
      embedding: embedRes.embeddings[i],
      token_count: estimateTokens(c.text),
      checksum: c.checksum,
      stale_at: null,
      indexed_at: new Date().toISOString(),
    }));

    const BATCH = 200;
    for (let i = 0; i < rows.length; i += BATCH) {
      const slice = rows.slice(i, i + BATCH);
      const { error } = await supabase
        .from('content_chunks')
        .upsert(slice, { onConflict: 'source_type,source_slug,section_path' });
      if (error) {
        log.error('indexer', error, { extra: { phase: 'upsert', batchStart: i } });
        report.errors += 1;
      } else {
        report.written += slice.length;
      }
    }

  }

  console.log(
    `[indexer] DONE. written=${report.written} skipped=${report.skipped} errors=${report.errors} tokens=${report.tokensUsed} cost=$${report.costUsd.toFixed(4)}`,
  );
  if (report.errors > 0) process.exit(1);
}

main().catch((err) => {
  // copilot-allow-silent-catch: top-level catch only rethrows for process exit
  log.fatal('indexer', err);
  console.error('[indexer] FATAL', err);
  process.exit(1);
});
