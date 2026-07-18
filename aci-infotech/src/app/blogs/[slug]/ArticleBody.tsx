'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { v4Display, v4DisplayVar } from '@/components/v4/fonts';

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

  // v4 article typography: 17px gray-800 body, Funnel Display headings,
  // blue-700 underlined links, blue left rule on blockquotes, dark code
  // blocks. The heading font class is injected per-element for the HTML
  // branch via arbitrary-variant utilities so both branches match.
  return (
    <div className="text-[17px] leading-relaxed text-gray-800">
      {isHtml ? (
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: content }}
          className={`blog-html-content ${v4DisplayVar} [&_h1]:[font-family:var(--font-v4-display)] [&_h2]:[font-family:var(--font-v4-display)] [&_h3]:[font-family:var(--font-v4-display)] [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mt-12 [&_h1]:mb-5 [&_h1]:text-black [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-black [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-black [&_p]:mb-5 [&_p]:text-gray-800 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2 [&_li]:text-gray-800 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-700 [&_blockquote]:pl-5 [&_blockquote]:text-gray-600 [&_blockquote]:my-8 [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[15px] [&_code]:font-mono [&_code]:text-blue-700 [&_pre]:bg-[#0b1220] [&_pre]:text-gray-100 [&_pre]:p-5 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:my-8 [&_pre]:ring-1 [&_pre]:ring-white/10 [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0 [&_a]:text-blue-700 [&_a]:underline [&_a]:decoration-blue-200 [&_a]:underline-offset-2 [&_a:hover]:decoration-blue-700 [&_hr]:my-10 [&_hr]:border-gray-200 [&_img]:rounded-2xl [&_img]:max-w-full`}
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
              <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-black">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-200 px-3 py-2 text-gray-800">{children}</td>
            ),
            // Demoted to <h2>: the post title is already the page's only
            // <h1>, so a body that opens with "# Heading" must not mint
            // a second one.
            h1: ({ children }) => <h2 className={`mb-5 mt-12 text-3xl font-bold tracking-tight text-black ${v4Display}`}>{children}</h2>,
            h2: ({ children }) => <h2 className={`mb-4 mt-10 text-2xl font-bold tracking-tight text-black ${v4Display}`}>{children}</h2>,
            h3: ({ children }) => <h3 className={`mb-3 mt-8 text-xl font-semibold text-black ${v4Display}`}>{children}</h3>,
            p: ({ children }) => <p className="mb-5 leading-relaxed text-gray-800">{children}</p>,
            ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>,
            ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>,
            li: ({ children }) => <li className="text-gray-800">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="my-8 border-l-2 border-blue-700 pl-5 text-gray-600">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[15px] text-blue-700">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="my-8 overflow-x-auto rounded-2xl bg-[#0b1220] p-5 text-gray-100 ring-1 ring-white/10 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-gray-100">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a href={href} className="text-blue-700 underline decoration-blue-200 underline-offset-2 hover:decoration-blue-700">
                {children}
              </a>
            ),
            hr: () => <hr className="my-10 border-gray-200" />,
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
}
