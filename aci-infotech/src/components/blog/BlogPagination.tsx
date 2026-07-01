import Link from 'next/link';

/**
 * Server-rendered, crawlable numbered pagination. Emits real <a> anchors so
 * Googlebot can reach every /blogs/page/[n] slice (and from there every post)
 * without executing JS. Page 1 lives at the base path (/blogs); deeper pages
 * at {basePath}/page/{n}.
 */
interface Props {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

function hrefFor(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}/page/${page}`;
}

// Compact page list with ellipses: 1 … c-1 c c+1 … last
function pageList(current: number, total: number): (number | 'gap')[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push('gap');
    out.push(p);
    prev = p;
  }
  return out;
}

export default function BlogPagination({ currentPage, totalPages, basePath = '/blogs' }: Props) {
  if (totalPages <= 1) return null;
  const items = pageList(currentPage, totalPages);

  return (
    <nav aria-label="Blog pagination" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-4">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {currentPage > 1 && (
          <li>
            <Link
              href={hrefFor(basePath, currentPage - 1)}
              rel="prev"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Previous
            </Link>
          </li>
        )}
        {items.map((it, i) =>
          it === 'gap' ? (
            <li key={`gap-${i}`} className="px-2 text-gray-400 select-none">…</li>
          ) : (
            <li key={it}>
              <Link
                href={hrefFor(basePath, it)}
                aria-current={it === currentPage ? 'page' : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  it === currentPage
                    ? 'bg-[var(--aci-primary)] text-white border-[var(--aci-primary)]'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {it}
              </Link>
            </li>
          )
        )}
        {currentPage < totalPages && (
          <li>
            <Link
              href={hrefFor(basePath, currentPage + 1)}
              rel="next"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Next
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
