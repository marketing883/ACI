/**
 * CI gate: fail the build if any case-study render path exposes the raw
 * `client` / `client_name` field instead of going through `displayClient`.
 *
 * Scope: TypeScript/TSX files under src/, excluding:
 *   - src/lib/content/anonymize.ts (the allowlist definition itself)
 *   - src/types/** (type declarations; fields legitimately named there)
 *   - *.test.ts, *.spec.ts
 *
 * What counts as a "leak":
 *   1. JSX text interpolation like {study.client} or {cs.client_name}.
 *   2. Template literals referencing ${obj.client} / ${obj.client_name}.
 *   3. Property-access inside JSX attribute values (alt={study.client}).
 *
 * What does NOT count (intentional):
 *   - Accessing `.client` in regular TS code (lookups, guards, migrations).
 *   - Literal object field definitions (`client: "..."`). Those are the
 *     content team's problem; this script covers render-path hygiene only.
 *
 * Usage:
 *   npx tsx scripts/check-no-client-leak.ts
 * Exits non-zero on any finding and prints each offending location.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = join(ROOT, 'src');

const IGNORE_FILES = new Set<string>([
  join(SRC, 'lib/content/anonymize.ts'),
]);

const IGNORE_DIRS = new Set<string>([
  join(SRC, 'types'),
]);

const LEAK_FIELDS = ['client', 'client_name'] as const;

interface Finding {
  file: string;
  line: number;
  column: number;
  snippet: string;
  match: string;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (IGNORE_DIRS.has(full)) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full));
    } else if (/\.(tsx?|mtsx?)$/.test(name) && !/\.(test|spec)\.tsx?$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

function scanFile(path: string): Finding[] {
  if (IGNORE_FILES.has(path)) return [];
  const content = readFileSync(path, 'utf8');
  const findings: Finding[] = [];

  // Patterns tuned for render paths. We deliberately require a preceding
  // identifier (\w+\.) to avoid catching standalone `client:` property
  // definitions. We look for:
  //   - `{identifier.client}` / `{identifier.client_name}`            (JSX interpolation)
  //   - `${identifier.client}` / `${identifier.client_name}`          (template literal)
  //   - `={identifier.client}` / similar inside JSX attribute values
  for (const field of LEAK_FIELDS) {
    // Match ident.field followed by a boundary that indicates render usage:
    // } (closing JSX expression), ` (template close), ) (call), etc.
    // Using a broad match then filtering in code to keep the regex readable.
    const re = new RegExp(`([A-Za-z_$][\\w$]*)\\.${field}(?![\\w_])`, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      const idx = m.index;
      const pre = content.slice(Math.max(0, idx - 2), idx);
      const fullMatch = m[0];
      const post = content.slice(idx + fullMatch.length, idx + fullMatch.length + 2);

      const isJsxOpen = pre.endsWith('{') || pre.endsWith('={');
      const isTemplate = pre.endsWith('${');
      const isAltOrTitle = /\s(?:alt|title|aria-label)=\{/.test(
        content.slice(Math.max(0, idx - 24), idx),
      );

      if (!isJsxOpen && !isTemplate && !isAltOrTitle) continue;

      // Reject false positives: `client_descriptor`, `clientName` etc.
      // The negative lookahead (?![\w_]) already excludes `client_descriptor`
      // because of the underscore-word character; verify with the post guard.
      if (post.startsWith('_') || /^[A-Za-z0-9_]/.test(post)) continue;

      // Compute line + column
      const before = content.slice(0, idx);
      const line = before.split(/\n/).length;
      const lineStart = before.lastIndexOf('\n') + 1;
      const column = idx - lineStart + 1;
      const lineEnd = content.indexOf('\n', idx);
      const snippet = content
        .slice(lineStart, lineEnd === -1 ? undefined : lineEnd)
        .trim();

      findings.push({
        file: relative(ROOT, path),
        line,
        column,
        snippet,
        match: fullMatch,
      });
    }
  }

  return findings;
}

function main(): void {
  const files = walk(SRC);
  const findings: Finding[] = [];
  for (const f of files) findings.push(...scanFile(f));

  if (findings.length === 0) {
    console.log(
      `[check-no-client-leak] OK: no render-path leaks of .client / .client_name found across ${files.length} files.`,
    );
    process.exit(0);
  }

  console.error(
    `[check-no-client-leak] FAIL: ${findings.length} render-path reference(s) to raw client field(s). Replace with displayClient(...) from @/lib/content/anonymize.`,
  );
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}:${f.column}  ${f.match}`);
    console.error(`    ${f.snippet}`);
  }
  process.exit(1);
}

main();
