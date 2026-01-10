'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface MessageRendererProps {
  content: string;
  isUser?: boolean;
}

// Parse markdown-style content and render as React elements
export default function MessageRenderer({ content, isUser = false }: MessageRendererProps) {
  // If user message, just render plain text
  if (isUser) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  const elements: React.ReactNode[] = [];
  let currentIndex = 0;

  // Process the content
  const lines = content.split('\n');

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      elements.push(<br key={`br-${lineIndex}`} />);
    }

    // Check if line is a bullet point
    const bulletMatch = line.match(/^[\s]*[-•]\s+(.+)$/);
    if (bulletMatch) {
      elements.push(
        <div key={`bullet-${lineIndex}`} className="flex items-start gap-2 my-1">
          <span className="text-[#0052CC] mt-1.5">•</span>
          <span>{parseInlineContent(bulletMatch[1], `inline-${lineIndex}`)}</span>
        </div>
      );
      return;
    }

    // Check if line is a numbered list
    const numberedMatch = line.match(/^[\s]*(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      elements.push(
        <div key={`num-${lineIndex}`} className="flex items-start gap-2 my-1">
          <span className="text-[#0052CC] font-semibold min-w-[1.25rem]">{numberedMatch[1]}.</span>
          <span>{parseInlineContent(numberedMatch[2], `inline-${lineIndex}`)}</span>
        </div>
      );
      return;
    }

    // Regular line - parse inline content
    elements.push(
      <span key={`line-${lineIndex}`}>
        {parseInlineContent(line, `inline-${lineIndex}`)}
      </span>
    );
  });

  return <div className="space-y-0.5">{elements}</div>;
}

// Parse inline content (bold, links, etc.)
function parseInlineContent(text: string, keyPrefix: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let remaining = text;
  let partIndex = 0;

  while (remaining.length > 0) {
    // Find the next special pattern
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Determine which comes first
    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const linkIndex = linkMatch ? remaining.indexOf(linkMatch[0]) : Infinity;

    if (boldIndex === Infinity && linkIndex === Infinity) {
      // No more patterns, add remaining text
      if (remaining) {
        elements.push(<span key={`${keyPrefix}-text-${partIndex}`}>{remaining}</span>);
      }
      break;
    }

    if (boldIndex < linkIndex) {
      // Bold comes first
      if (boldIndex > 0) {
        elements.push(
          <span key={`${keyPrefix}-text-${partIndex++}`}>
            {remaining.substring(0, boldIndex)}
          </span>
        );
      }
      elements.push(
        <strong key={`${keyPrefix}-bold-${partIndex++}`} className="font-semibold text-[#0052CC]">
          {boldMatch![1]}
        </strong>
      );
      remaining = remaining.substring(boldIndex + boldMatch![0].length);
    } else {
      // Link comes first
      if (linkIndex > 0) {
        elements.push(
          <span key={`${keyPrefix}-text-${partIndex++}`}>
            {remaining.substring(0, linkIndex)}
          </span>
        );
      }

      const linkText = linkMatch![1];
      const linkUrl = linkMatch![2];
      const isExternal = linkUrl.startsWith('http');

      elements.push(
        <Link
          key={`${keyPrefix}-link-${partIndex++}`}
          href={linkUrl}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0052CC] text-white text-xs font-medium rounded hover:bg-[#003D99] transition-colors mx-0.5"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {linkText}
          {isExternal && <ExternalLink className="w-3 h-3" />}
        </Link>
      );
      remaining = remaining.substring(linkIndex + linkMatch![0].length);
    }
  }

  return elements;
}

// Component for rendering page link cards (for prominent CTAs)
export function PageLinkCard({
  href,
  title,
  description
}: {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <Link
      href={href}
      className="block mt-2 p-3 bg-gradient-to-r from-[#0052CC]/10 to-[#0052CC]/5 border border-[#0052CC]/20 rounded-lg hover:border-[#0052CC]/40 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0052CC] group-hover:text-[#003D99]">
            {title}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-[#0052CC] opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
