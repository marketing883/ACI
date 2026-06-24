import type { Metadata } from 'next';
import HeroConcepts from '@/components/v3/concepts/HeroConcepts';

export const metadata: Metadata = {
  title: 'v3 hero concepts (preview)',
  robots: { index: false, follow: false },
};

export default function ConceptsPage() {
  return <HeroConcepts />;
}
