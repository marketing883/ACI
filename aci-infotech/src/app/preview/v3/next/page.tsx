import type { Metadata } from 'next';
import V3Next from '@/components/v3/next/V3Next';

export const metadata: Metadata = {
  title: 'v3 — engineered-dark direction (preview)',
  robots: { index: false, follow: false },
};

export default function V3NextPage() {
  return <V3Next />;
}
