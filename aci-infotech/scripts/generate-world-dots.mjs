// Generates the dotted world map behind the global offices band.
// Samples a lon/lat grid, keeps points that fall on land (world-atlas
// 110m data), projects them equirectangular, and writes the dot list
// plus projected office coordinates to src/components/contact/world-map-data.json.
//
// Run: node scripts/generate-world-dots.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import * as topojson from 'topojson-client';

const topo = JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'));
const land = topojson.feature(topo, topo.objects.land);

// Map window: full longitude sweep, latitudes cropped to where land
// actually is (drop Antarctica and the empty far south).
const LON_MIN = -170, LON_MAX = 180, LAT_MIN = -56, LAT_MAX = 74;
const STEP = 1.4; // degrees between dots

// Ray-casting point-in-polygon on [lon, lat] rings.
function inRing(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function inPolygon(pt, polygon) {
  // polygon: [outer, hole, hole...]
  if (!inRing(pt, polygon[0])) return false;
  for (let h = 1; h < polygon.length; h++) if (inRing(pt, polygon[h])) return false;
  return true;
}

function onLand(pt) {
  for (const feature of land.features) {
    const g = feature.geometry;
    if (g.type === 'Polygon') {
      if (inPolygon(pt, g.coordinates)) return true;
    } else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates) if (inPolygon(pt, poly)) return true;
    }
  }
  return false;
}

// Equirectangular projection into a 1000-wide viewBox.
const W = 1000;
const H = Math.round((W * (LAT_MAX - LAT_MIN)) / (LON_MAX - LON_MIN));
const px = (lon) => ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
const py = (lat) => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;

const dots = [];
for (let lat = LAT_MIN; lat <= LAT_MAX; lat += STEP) {
  for (let lon = LON_MIN; lon <= LON_MAX; lon += STEP) {
    if (onLand([lon, lat])) {
      dots.push([+px(lon).toFixed(1), +py(lat).toFixed(1)]);
    }
  }
}

const OFFICES = [
  { city: 'Somerset, NJ', hq: true, lat: 40.4976, lon: -74.4885, region: 'Americas' },
  { city: 'Atlanta', lat: 33.749, lon: -84.388, region: 'Americas' },
  { city: 'Dallas', lat: 32.7767, lon: -96.797, region: 'Americas' },
  { city: 'Miami', lat: 25.7617, lon: -80.1918, region: 'Americas' },
  { city: 'London', lat: 51.5074, lon: -0.1278, region: 'Europe' },
  { city: 'Dubai', lat: 25.2048, lon: 55.2708, region: 'Middle East' },
  { city: 'Noida', lat: 28.5355, lon: 77.391, region: 'Asia' },
  { city: 'Hyderabad', lat: 17.385, lon: 78.4867, region: 'Asia' },
  { city: 'Bangalore', lat: 12.9716, lon: 77.5946, region: 'Asia' },
  { city: 'Kuala Lumpur', lat: 3.139, lon: 101.6869, region: 'Asia' },
  { city: 'Singapore', lat: 1.3521, lon: 103.8198, region: 'Asia' },
];

const offices = OFFICES.map((o) => ({
  city: o.city,
  hq: !!o.hq,
  region: o.region,
  x: +px(o.lon).toFixed(1),
  y: +py(o.lat).toFixed(1),
}));

const out = { width: W, height: H, dots, offices };
writeFileSync('src/components/contact/world-map-data.json', JSON.stringify(out));
console.log(`dots: ${dots.length}, viewBox: ${W}x${H}, offices: ${offices.length}`);
