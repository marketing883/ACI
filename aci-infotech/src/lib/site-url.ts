/**
 * Single source of truth for the site's URLs.
 *
 * Two distinct concepts, deliberately separated:
 *
 * 1. getSiteUrl() — the CANONICAL origin. Always production. Used for
 *    canonicals, OpenGraph URLs, and JSON-LD @id/url. A staging build
 *    must never self-canonicalize: before this helper existed, every
 *    page deriving its canonical from NEXT_PUBLIC_SITE_URL published
 *    `https://staging.aciinfotech.com` as its canonical on staging,
 *    inviting Google to index the staging domain as the original.
 *
 * 2. getDeploymentUrl() / isProductionDeployment() — the origin this
 *    build actually serves from. Used only for environment decisions
 *    (e.g. robots.txt disallowing everything off-production).
 */

export const PRODUCTION_URL = 'https://aciinfotech.com';

/** Canonical origin for canonicals/OG/JSON-LD. Always production. */
export function getSiteUrl(): string {
  return PRODUCTION_URL;
}

/** The origin this deployment serves from (staging or production). */
export function getDeploymentUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_URL;
  return url.replace(/\/+$/, '');
}

/** True only when this build serves the production origin. */
export function isProductionDeployment(): boolean {
  return getDeploymentUrl() === PRODUCTION_URL;
}
