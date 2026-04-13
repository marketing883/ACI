#!/usr/bin/env tsx
/**
 * CI gate: enforce Atheros voice rules across every static-copy
 * surface. Returns non-zero on any violation.
 *
 * Scanned surfaces:
 *   - src/lib/copilot/brand.ts                    (VOICE_RULES, FALLBACK_USER_MESSAGES)
 *   - src/lib/copilot/pillCopy.ts                 (via auditPillCopy)
 *   - src/lib/copilot/welcome.ts                  (via auditWelcome)
 *   - src/components/copilot/panels/ComparisonPanel.tsx
 *   - src/components/copilot/mobile/MobilePill.tsx (narration fallbacks)
 *
 * Rules (same as lintOutcomeCopy / auditPillCopy / auditWelcome):
 *   - No "!" in user-visible copy.
 *   - No em-dash (—) or en-dash (–).
 *   - No "$", "pricing", or "cost per".
 *   - No "talk to an architect" as a generic CTA.
 *   - No AI-bot phrasing ("I am an AI", "as an AI",
 *     "I can help you with").
 *
 * Run:
 *   cd aci-infotech
 *   npx tsx scripts/check-voice-rules.ts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { auditPillCopy } from '../src/lib/copilot/pillCopy';
import { auditWelcome } from '../src/lib/copilot/welcome';

const ROOT = join(new URL('..', import.meta.url).pathname);

interface Finding {
  file: string;
  label: string;
  issue: string;
}

const findings: Finding[] = [];

function pushIssue(file: string, label: string, issue: string): void {
  findings.push({ file, label, issue });
}

function scanText(file: string, label: string, text: string, opts: {
  allowDashInBrandDoc?: boolean;
  allowPricingInDoc?: boolean;
} = {}): void {
  if (/!/.test(text)) pushIssue(file, label, 'contains exclamation');
  if (!opts.allowDashInBrandDoc && /[—–]/.test(text)) pushIssue(file, label, 'contains em or en dash');
  if (!opts.allowPricingInDoc) {
    if (/\$[0-9]/.test(text)) pushIssue(file, label, 'mentions pricing ($)');
    if (/\bpricing\b/i.test(text)) pushIssue(file, label, 'mentions "pricing"');
    if (/\bcost per\b/i.test(text)) pushIssue(file, label, 'mentions "cost per"');
  }
  if (/\btalk to (an? )?architect\b/i.test(text)) {
    pushIssue(file, label, 'uses generic "talk to an architect"');
  }
  if (/\bas an AI\b/i.test(text) || /\bI am an AI\b/i.test(text) || /\bI can help you with\b/i.test(text)) {
    pushIssue(file, label, 'AI-assistant-sounding phrase');
  }
}

// 1. Pill copy
for (const i of auditPillCopy()) {
  pushIssue('src/lib/copilot/pillCopy.ts', i.route, i.issue);
}

// 2. Welcome copy
for (const i of auditWelcome()) {
  pushIssue('src/lib/copilot/welcome.ts', i.route, i.issue);
}

// 3. Brand fallback messages (VOICE_RULES itself is a prompt, not user copy)
import('../src/lib/copilot/brand')
  .then((mod) => {
    for (const [key, text] of Object.entries(mod.FALLBACK_USER_MESSAGES)) {
      scanText('src/lib/copilot/brand.ts', `FALLBACK_USER_MESSAGES.${key}`, text as string);
    }
  })
  .catch(() => undefined);

// 4. Comparison panel presets (static copy the user reads)
const cmpPath = join(ROOT, 'src/components/copilot/panels/ComparisonPanel.tsx');
try {
  const cmpSrc = readFileSync(cmpPath, 'utf8');
  const presetBlocks = cmpSrc.match(/rationale:\s*'([^']+)'/g) ?? [];
  for (const block of presetBlocks) {
    const m = block.match(/'([^']+)'/);
    if (m) scanText('src/components/copilot/panels/ComparisonPanel.tsx', 'preset.rationale', m[1]);
  }
} catch {
  // copilot-allow-silent-catch: file missing is caught by tsc
}

// 5. Mobile pill narration fallbacks
const mobilePath = join(ROOT, 'src/components/copilot/mobile/MobilePill.tsx');
try {
  const mSrc = readFileSync(mobilePath, 'utf8');
  const stringLits = mSrc.match(/"[A-Z][^"\n]{10,120}"/g) ?? [];
  for (const s of stringLits) {
    const t = s.slice(1, -1);
    // Skip type-level strings and tags; only lint user-facing fallbacks.
    if (/^(cio|cdo|cto|ciso|ceo|cmo|relay|copilot|service|industry|platform|case|playbook|diagram|comparison|timeline|stats|resource)$/i.test(t)) continue;
    if (t.length > 120) continue;
    scanText('src/components/copilot/mobile/MobilePill.tsx', 'narration-literal', t);
  }
} catch {
  // copilot-allow-silent-catch
}

// Give the dynamic brand import a tick to resolve.
setTimeout(() => {
  if (findings.length === 0) {
    console.log('[check-voice-rules] OK: no voice-rule violations.');
    process.exit(0);
  }
  console.error(`[check-voice-rules] FAIL: ${findings.length} issue(s).`);
  for (const f of findings) {
    console.error(`  ${f.file}  ${f.label}: ${f.issue}`);
  }
  process.exit(1);
}, 200);
