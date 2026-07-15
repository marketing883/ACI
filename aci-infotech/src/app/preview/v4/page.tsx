import { permanentRedirect } from 'next/navigation';

// The v4 homepage was promoted to the root route. Anyone holding the
// old preview link (and any crawler that found it) lands on the real
// homepage with a 308, which consolidates signals onto `/`.
export default function V4PreviewPage() {
  permanentRedirect('/');
}
