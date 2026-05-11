'use client';

/**
 * Client-side dedupe for the nav mega-menu spotlight data.
 *
 * Every internal page mounts ConditionalLayout, which mounts NavV2.
 * Without a cache, every soft navigation between marketing pages
 * would re-fetch /api/nav/featured even though the response is the
 * same. A module-level promise here means the first mount kicks off
 * the fetch, every subsequent mount in the same session reads the
 * same promise. Module state persists across App Router soft
 * navigations because the module isn't unloaded.
 *
 * HTTP Cache-Control on the endpoint gives the browser a 5-minute
 * fresh window on top of this — a hard refresh hits browser cache,
 * not the network.
 */

import type { ResourcesMenuData } from '@/components/v2/nav/ResourcesMenu';
import type { CompanyMenuData } from '@/components/v2/nav/CompanyMenu';

export interface NavFeaturedResponse {
  resources: ResourcesMenuData;
  company: CompanyMenuData;
}

let inflight: Promise<NavFeaturedResponse> | null = null;

const EMPTY: NavFeaturedResponse = {
  resources: {},
  company: {},
};

export function getNavFeatured(): Promise<NavFeaturedResponse> {
  if (inflight) return inflight;
  inflight = fetch('/api/nav/featured', { credentials: 'same-origin' })
    .then(async (r) => {
      if (!r.ok) return EMPTY;
      const data = (await r.json()) as NavFeaturedResponse | null;
      return data ?? EMPTY;
    })
    .catch(() => {
      // Reset the cache on transient failure so a later mount can
      // retry. Otherwise the empty fallback would stick for the
      // lifetime of the tab.
      inflight = null;
      return EMPTY;
    });
  return inflight;
}
