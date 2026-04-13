'use client';

/**
 * Outcome Copy editor.
 * CRUD over the outcome_copy_overrides table with voice lint on save.
 */
import { useCallback, useEffect, useState } from 'react';

interface OverrideRow {
  id: string;
  route_pattern: string;
  surface: string;
  variant_key: string | null;
  text: string;
  is_active: boolean;
  notes: string | null;
  updated_at: string;
}

const SURFACES = [
  'idle',
  'peek.proactive',
  'peek.narration',
  'panel.primary_oc',
  'chip',
  'welcome',
] as const;

const VARIANTS = ['', 'cio', 'cdo', 'cto', 'ciso', 'ceo', 'cmo'] as const;

interface DraftRow {
  id?: string;
  route_pattern: string;
  surface: string;
  variant_key: string;
  text: string;
  is_active: boolean;
  notes: string;
}

const EMPTY_DRAFT: DraftRow = {
  route_pattern: '',
  surface: 'idle',
  variant_key: '',
  text: '',
  is_active: true,
  notes: '',
};

export default function OutcomeCopyEditor() {
  const [rows, setRows] = useState<OverrideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftRow>(EMPTY_DRAFT);
  const [saveIssues, setSaveIssues] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/admin/copilot/outcome-copy', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      setRows(json.rows as OverrideRow[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const startEdit = (r: OverrideRow) => {
    setDraft({
      id: r.id,
      route_pattern: r.route_pattern,
      surface: r.surface,
      variant_key: r.variant_key ?? '',
      text: r.text,
      is_active: r.is_active,
      notes: r.notes ?? '',
    });
    setSaveIssues(null);
  };

  const startNew = () => {
    setDraft(EMPTY_DRAFT);
    setSaveIssues(null);
  };

  const save = async () => {
    setSaving(true);
    setSaveIssues(null);
    setError(null);
    try {
      const isUpdate = Boolean(draft.id);
      const url = isUpdate
        ? `/api/admin/copilot/outcome-copy?id=${encodeURIComponent(draft.id!)}`
        : '/api/admin/copilot/outcome-copy';
      const res = await fetch(url, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route_pattern: draft.route_pattern.trim(),
          surface: draft.surface,
          variant_key: draft.variant_key.trim() || null,
          text: draft.text.trim(),
          is_active: draft.is_active,
          notes: draft.notes.trim() || null,
        }),
      });
      const json = await res.json();
      if (res.status === 422 && json.issues) {
        setSaveIssues(json.issues as string[]);
        return;
      }
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      setDraft(EMPTY_DRAFT);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this override?')) return;
    try {
      const res = await fetch(`/api/admin/copilot/outcome-copy?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.reason ?? `HTTP ${res.status}`);
        return;
      }
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_minmax(360px,440px)]">
      <section>
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Outcome Copy Overrides</h1>
            <p className="mt-1 text-sm text-gray-600">
              Edit the live copy on the pill, peek, and CTAs without a deploy. Saves apply within a minute.
            </p>
          </div>
          <button
            type="button"
            onClick={startNew}
            className="rounded-lg bg-[var(--aci-primary,#0052CC)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--aci-primary-dark,#003D99)]"
          >
            New override
          </button>
        </header>

        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2">Route</th>
                <th className="px-4 py-2">Surface</th>
                <th className="px-4 py-2">Variant</th>
                <th className="px-4 py-2">Text</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No overrides yet. Use the form to add one.</td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{r.route_pattern}</td>
                    <td className="px-4 py-3">{r.surface}</td>
                    <td className="px-4 py-3 text-gray-600">{r.variant_key ?? '—'}</td>
                    <td className="max-w-sm px-4 py-3 text-gray-800">{r.text}</td>
                    <td className="px-4 py-3">
                      {r.is_active ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">on</span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">off</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(r)}
                        className="text-xs font-semibold text-[var(--aci-primary,#0052CC)] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(r.id)}
                        className="ml-3 text-xs font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {draft.id ? 'Edit override' : 'New override'}
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Voice rules enforced on save: no exclamations, no em/en dashes, no pricing, no &quot;talk to an architect&quot;, no AI-bot phrasing.
        </p>
        <div className="mt-4 space-y-3 text-sm">
          <Field label="Route pattern (e.g. /services/data-engineering or /lp/*)">
            <input
              type="text"
              value={draft.route_pattern}
              onChange={(e) => setDraft({ ...draft, route_pattern: e.target.value })}
              placeholder="/services/data-engineering"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs focus:border-[var(--aci-primary,#0052CC)] focus:outline-none"
            />
          </Field>
          <Field label="Surface">
            <select
              value={draft.surface}
              onChange={(e) => setDraft({ ...draft, surface: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--aci-primary,#0052CC)] focus:outline-none"
            >
              {SURFACES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Variant (persona)">
            <select
              value={draft.variant_key}
              onChange={(e) => setDraft({ ...draft, variant_key: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--aci-primary,#0052CC)] focus:outline-none"
            >
              {VARIANTS.map((v) => <option key={v || 'any'} value={v}>{v || 'any'}</option>)}
            </select>
          </Field>
          <Field label={`Text (${draft.text.length}/280)`}>
            <textarea
              rows={4}
              maxLength={280}
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              placeholder="Data engineering page is up. Three reasons people land here..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--aci-primary,#0052CC)] focus:outline-none"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={draft.is_active}
              onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
            />
            Active
          </label>
          <Field label="Notes (admin-only)">
            <input
              type="text"
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-[var(--aci-primary,#0052CC)] focus:outline-none"
            />
          </Field>
          {saveIssues && saveIssues.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <div className="font-semibold">Voice issues</div>
              <ul className="mt-1 list-disc pl-4">
                {saveIssues.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              disabled={saving || !draft.route_pattern.trim() || !draft.text.trim()}
              onClick={save}
              className="rounded-lg bg-[var(--aci-primary,#0052CC)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Saving…' : draft.id ? 'Update' : 'Create'}
            </button>
            {draft.id && (
              <button
                type="button"
                onClick={startNew}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:border-[var(--aci-primary,#0052CC)]"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">{label}</span>
      {children}
    </label>
  );
}
