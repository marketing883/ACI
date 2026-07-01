export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  li_fat_id?: string;
  referrer?: string;
  landing_page?: string;
}

const STORAGE_KEY = 'aci_attribution';
const PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'li_fat_id',
] as const;

/**
 * First-touch attribution for the session. On the first page a visitor
 * lands on, snapshot the UTM/click-id params + external referrer + landing
 * path into sessionStorage, then reuse that snapshot on any later form
 * submit in the same session. First-touch (not last-touch) so a visitor
 * who clicks around before converting still credits the campaign that
 * brought them in. Returns {} on the server or when there's nothing worth
 * recording (direct visit, no params, no external referrer).
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Attribution;

    const params = new URLSearchParams(window.location.search);
    const attr: Attribution = {};
    for (const k of PARAM_KEYS) {
      const v = params.get(k);
      if (v) (attr as Record<string, string>)[k] = v;
    }

    const ref = document.referrer || '';
    const externalRef = ref && !ref.includes(window.location.host) ? ref : '';

    if (Object.keys(attr).length || externalRef) {
      if (externalRef) attr.referrer = externalRef;
      attr.landing_page = window.location.pathname + window.location.search;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attr));
    }
    return attr;
  } catch {
    return {};
  }
}
