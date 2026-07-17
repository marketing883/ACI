'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders the article body. This is a Client Component only so the
 * HubSpot Bootstrap-collapse polyfill (below) can run, but because Next
 * server-renders a client component's initial markup, the full article
 * HTML still lands in the raw response, which is the whole point of the
 * SSR conversion. Content + format come from the server page as props.
 */
export default function ArticleBody({
  content,
  contentFormat,
}: {
  content: string;
  contentFormat?: 'markdown' | 'html' | null;
}) {
  // Ref on the dangerouslySetInnerHTML container so the effect below can
  // find HubSpot-imported `[data-toggle="collapse"]` accordion triggers
  // and polyfill the Bootstrap 3 collapse behavior they were authored
  // against. HubSpot ships those with broken relative hrefs and no
  // bundled JS on our side, so without this they're dead clicks and the
  // answers stay hidden.
  const contentRef = useRef<HTMLDivElement>(null);

  const isHtml =
    contentFormat === 'html' ||
    /^<[a-z]|<p>|<div>|<h[1-6]>|<ul>|<ol>|<span/i.test(content.trim());

  // HubSpot-imported FAQ accordions ship with Bootstrap 3 collapse markup
  // ([data-toggle="collapse"], aria-controls pointing at the answer
  // panel, broken relative href) but no Bootstrap JS on this site to wire
  // up clicks. Without this polyfill the question is a dead link, and the
  // answers stay hidden forever. Pure DOM, scoped to the content div. The
  // cleanup removes every listener it attached.
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    type Wired = { trigger: HTMLElement; handler: (e: Event) => void };
    const wired: Wired[] = [];

    const setHidden = (panel: HTMLElement) => {
      panel.style.display = 'none';
      panel.classList.remove('in');
      panel.classList.remove('show');
    };
    const setVisible = (panel: HTMLElement) => {
      panel.style.display = '';
      panel.style.height = '';
      panel.style.overflow = '';
      panel.style.visibility = '';
      panel.classList.add('in');
      panel.classList.add('show');
      panel.querySelectorAll<HTMLElement>('[style*="display"]').forEach((el) => {
        if (el === panel) return;
        if (el.style.display === 'none') el.style.display = '';
      });
    };

    const triggers = container.querySelectorAll<HTMLElement>('[data-toggle="collapse"]');
    triggers.forEach((trigger) => {
      const ariaControls = trigger.getAttribute('aria-controls');
      if (!ariaControls) return;
      let panel: HTMLElement | null = null;
      try {
        panel = container.querySelector<HTMLElement>(`#${CSS.escape(ariaControls)}`);
      } catch {
        panel = null;
      }
      if (!panel) return;

      setHidden(panel);
      trigger.setAttribute('aria-expanded', 'false');

      const handler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          setHidden(panel);
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          setVisible(panel);
          trigger.setAttribute('aria-expanded', 'true');
        }
      };
      trigger.addEventListener('click', handler);
      wired.push({ trigger, handler });
    });

    return () => {
      for (const { trigger, handler } of wired) {
        trigger.removeEventListener('click', handler);
      }
    };
  }, [content]);

  return (
    <div className="prose prose-lg max-w-none prose-headings:text-[var(--aci-secondary)] prose-a:text-[var(--aci-primary)] prose-strong:text-[var(--aci-secondary)]">
      {isHtml ? (
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: content }}
          className="blog-html-content [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-12 [&_h1]:mb-6 [&_h1]:text-[var(--aci-secondary)] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-[var(--aci-secondary)] [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[var(--aci-secondary)] [&_p]:mb-4 [&_p]:text-gray-700 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_li]:text-gray-700 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--aci-primary)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-6 [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-[var(--aci-primary)] [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_a]:text-[var(--aci-primary)] [&_a]:hover:underline [&_hr]:my-8 [&_hr]:border-gray-200"
        />
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className="my-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-[var(--aci-secondary)]">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-200 px-3 py-2 text-gray-700">{children}</td>
            ),
            // Demoted to <h2>: the post title is already the page's only
            // <h1>, so a body that opens with "# Heading" must not mint
            // a second one.
            h1: ({ children }) => <h2 className="text-3xl font-bold mt-12 mb-6 text-[var(--aci-secondary)]">{children}</h2>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mt-10 mb-4 text-[var(--aci-secondary)]">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-semibold mt-8 mb-3 text-[var(--aci-secondary)]">{children}</h3>,
            p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
            li: ({ children }) => <li className="text-gray-700">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[var(--aci-primary)] pl-4 italic text-gray-600 my-6">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-[var(--aci-primary)]">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a href={href} className="text-[var(--aci-primary)] hover:underline">
                {children}
              </a>
            ),
            hr: () => <hr className="my-8 border-gray-200" />,
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
}
