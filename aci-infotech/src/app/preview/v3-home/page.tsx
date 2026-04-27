import type { Metadata } from 'next';
import V3HomeContent from '@/components/v3/home/V3HomeContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ACI Infotech — V3 Homepage Preview',
  robots: { index: false, follow: false },
};

export default function V3HomePreview() {
  return <V3HomeContent />;
}
