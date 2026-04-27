/**
 * Client-side CSV download utility for admin analytics pages.
 * Call downloadCSV(rows, 'filename') to trigger a browser download.
 */

export function downloadCSV(
  rows: Array<Record<string, unknown>>,
  filename: string,
): void {
  if (rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const escape = (v: unknown): string => {
    const str = v === null || v === undefined ? '' : String(v);
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  const header = keys.join(',');
  const body = rows
    .map((row) => keys.map((k) => escape(row[k])).join(','))
    .join('\n');
  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
