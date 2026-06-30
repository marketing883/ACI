import type { Metadata } from 'next';

// Post-download confirmation page. Keep it out of the index, and give it
// a self-referencing canonical so it does not inherit the /whitepapers
// listing canonical from the parent layout.
export const metadata: Metadata = {
  title: { absolute: 'Thank You | ACI Infotech' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://aciinfotech.com/whitepapers/thank-you' },
};

export default function WhitepaperThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
