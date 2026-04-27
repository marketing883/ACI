/**
 * Stub used by /admin/copilot/{handoffs,outcome-copy,errors,analytics}
 * pages until their full implementation lands in Phase B / C.
 */
interface StubPageProps {
  title: string;
  summary: string;
  phase: 'Phase B' | 'Phase C';
  previewItems: string[];
}

export default function StubPage({ title, summary, phase, previewItems }: StubPageProps) {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-600">{summary}</p>
      </header>
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--aci-primary,#0052CC)]">
          Coming next ({phase})
        </div>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-gray-700">
          {previewItems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
