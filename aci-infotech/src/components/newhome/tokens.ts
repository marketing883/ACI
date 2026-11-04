// Design tokens for the new homepage (/preview/new-home).
//
// One palette for every section so the light and dark scenes read as one
// system: deep ink and midnight for the dark scenes, porcelain for the
// light ones, ACI cobalt as the brand light, cyan as its glow, and the
// Atheros lime as a rare signal colour.

export const INK = '#05070d';
export const MIDNIGHT = '#0a1024';
export const NAVY = '#0d1633';
export const PORCELAIN = '#f4f6fb';
export const COBALT = '#1d4ed8';
export const ELECTRIC = '#3b82f6';
export const CYAN = '#22d3ee';
export const VIOLET = '#7c3aed';
export const LIME = '#a3e635';

/** Shared easing: fast out, long settle. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Film grain as an inline SVG, so no extra request. */
export const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
