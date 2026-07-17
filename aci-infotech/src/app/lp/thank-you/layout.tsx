import type { Metadata } from 'next';

// Post-conversion confirmation page: thin, query-param-driven utility
// content. Never worth indexing (whitepapers/thank-you already does
// this; lp and playbooks were the stragglers).
export const metadata: Metadata = {
  title: { absolute: 'Thank You | ACI Infotech' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://aciinfotech.com/lp/thank-you' },
};

export default function LpThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
