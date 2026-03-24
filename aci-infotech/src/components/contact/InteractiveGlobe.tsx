'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Globe2 } from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';

// World map TopoJSON - using Natural Earth 110m simplified data
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Office locations with real geographic coordinates (longitude, latitude)
const offices = [
  // Americas
  {
    id: 'newjersey',
    city: 'New Jersey',
    region: 'Americas',
    label: 'Global Headquarters',
    isHQ: true,
    company: 'ACI Infotech Inc',
    address: '220 Davidson Avenue, Suite 129',
    cityFull: 'Somerset, New Jersey 08873',
    country: 'United States',
    coordinates: [-74.49, 40.50] as [number, number],
  },
  {
    id: 'atlanta',
    city: 'Atlanta',
    region: 'Americas',
    label: 'East Coast Hub',
    company: 'ACI Infotech Inc',
    address: 'The Pinnacle Building, 3455 Peachtree Road NE',
    cityFull: '5th Floor, Atlanta, Georgia 30326',
    country: 'United States',
    coordinates: [-84.39, 33.75] as [number, number],
  },
  {
    id: 'dallas',
    city: 'Dallas',
    region: 'Americas',
    label: 'Central Region',
    company: 'ACI Infotech Inc',
    address: 'Dallas, Texas',
    cityFull: 'Dallas, Texas',
    country: 'United States',
    coordinates: [-96.80, 32.78] as [number, number],
  },
  {
    id: 'miami',
    city: 'Miami',
    region: 'Americas',
    label: 'Southeast Hub',
    company: 'ACI Infotech Inc',
    address: 'Miami, Florida',
    cityFull: 'Miami, Florida',
    country: 'United States',
    coordinates: [-80.19, 25.76] as [number, number],
  },
  // Europe
  {
    id: 'london',
    city: 'London',
    region: 'Europe',
    label: 'UK & Northern Europe',
    company: 'ACI Infotech Ltd',
    address: 'London',
    cityFull: 'London',
    country: 'United Kingdom',
    coordinates: [-0.13, 51.51] as [number, number],
  },
  {
    id: 'luxembourg',
    city: 'Luxembourg',
    region: 'Europe',
    label: 'Central Europe',
    comingSoon: true,
    company: 'ACI Infotech EU',
    address: 'Coming Soon',
    cityFull: 'Luxembourg',
    country: 'Luxembourg',
    coordinates: [6.13, 49.61] as [number, number],
  },
  // Middle East
  {
    id: 'dubai',
    city: 'Dubai',
    region: 'Middle East',
    label: 'MENA Hub',
    company: 'ACI Global FZ LLC',
    address: 'Dubai, UAE',
    cityFull: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: [55.27, 25.20] as [number, number],
  },
  // India
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    region: 'India',
    label: 'India Headquarters',
    company: 'ACI Global Business Services Pvt Ltd',
    address: 'Mindspace Raheja IT Park, 5th Floor, Bldg. No.9',
    cityFull: 'Hitech City, Hyderabad 500081, Telangana',
    country: 'India',
    coordinates: [78.49, 17.39] as [number, number],
  },
  {
    id: 'noida',
    city: 'Noida',
    region: 'India',
    label: 'North India',
    company: 'ACI Global Business Services Pvt Ltd',
    address: 'Sector 63, Noida, D-108, D Block',
    cityFull: 'Hazratpur Wajidpur, Uttar Pradesh 201301',
    country: 'India',
    coordinates: [77.39, 28.54] as [number, number],
  },
  {
    id: 'bangalore',
    city: 'Bangalore',
    region: 'India',
    label: 'South India',
    company: 'ACI Global Business Services Pvt Ltd',
    address: 'ITI Layout, HSR Layout',
    cityFull: 'Bengaluru, Karnataka 560102',
    country: 'India',
    coordinates: [77.59, 12.97] as [number, number],
  },
  // Asia Pacific
  {
    id: 'singapore',
    city: 'Singapore',
    region: 'Asia Pacific',
    label: 'Southeast Asia Hub',
    comingSoon: true,
    company: 'ACI Infotech Pte Ltd',
    address: 'Coming Soon',
    cityFull: 'Singapore',
    country: 'Singapore',
    coordinates: [103.82, 1.35] as [number, number],
  },
  {
    id: 'kualalumpur',
    city: 'Kuala Lumpur',
    region: 'Asia Pacific',
    label: 'Malaysia Operations',
    comingSoon: true,
    company: 'ACI Infotech Malaysia',
    address: 'Coming Soon',
    cityFull: 'Kuala Lumpur',
    country: 'Malaysia',
    coordinates: [101.69, 3.14] as [number, number],
  },
];

// Region colors
const regionColors: Record<string, string> = {
  'Americas': '#0066CC',
  'Europe': '#8B5CF6',
  'Middle East': '#F59E0B',
  'India': '#10B981',
  'Asia Pacific': '#EC4899',
};

interface Office {
  id: string;
  city: string;
  region: string;
  label: string;
  isHQ?: boolean;
  comingSoon?: boolean;
  company: string;
  address: string;
  cityFull: string;
  country: string;
  coordinates: [number, number];
}

export default function InteractiveGlobe() {
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [hoveredOffice, setHoveredOffice] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const activeOffice = offices.find(o => o.id === (selectedOffice || hoveredOffice)) as Office | undefined;

  // Group offices by region for mobile view and legend
  const officesByRegion = offices.reduce((acc, office) => {
    if (!acc[office.region]) acc[office.region] = [];
    acc[office.region].push(office);
    return acc;
  }, {} as Record<string, typeof offices>);

  const hqOffice = offices.find(o => o.isHQ);

  return (
    <div className="relative">
      {/* Desktop: Interactive Globe */}
      <div className="hidden md:block">
        <div className="relative max-w-5xl mx-auto bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl overflow-hidden shadow-inner">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 130,
              center: [30, 30],
            }}
            style={{ width: '100%', height: 'auto' }}
          >
            {/* World map geographies */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#CBD5E1"
                    stroke="#94A3B8"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#B0BFCF' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Connection lines from HQ to all other offices */}
            {hqOffice && offices.map((office) => {
              if (office.isHQ) return null;
              return (
                <Line
                  key={`line-${office.id}`}
                  from={hqOffice.coordinates}
                  to={office.coordinates}
                  stroke={regionColors[office.region]}
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                />
              );
            })}

            {/* Office markers */}
            {offices.map((office) => (
              <Marker
                key={office.id}
                coordinates={office.coordinates}
                onMouseEnter={(e) => {
                  setHoveredOffice(office.id);
                  const rect = (e.target as SVGElement).getBoundingClientRect();
                  setTooltipPosition({ x: rect.x + rect.width / 2, y: rect.y });
                }}
                onMouseLeave={() => {
                  setHoveredOffice(null);
                  setTooltipPosition(null);
                }}
                onClick={() => setSelectedOffice(selectedOffice === office.id ? null : office.id)}
              >
                {/* Pulse animation for HQ */}
                {office.isHQ && (
                  <motion.circle
                    r={12}
                    fill={regionColors[office.region]}
                    animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Main marker */}
                <motion.circle
                  r={office.isHQ ? 8 : office.comingSoon ? 5 : 6}
                  fill={office.comingSoon ? 'white' : regionColors[office.region]}
                  stroke={regionColors[office.region]}
                  strokeWidth={office.comingSoon ? 2 : 0}
                  strokeDasharray={office.comingSoon ? '3 2' : 'none'}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: selectedOffice === office.id || hoveredOffice === office.id ? 1.4 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="cursor-pointer"
                />

                {/* Inner circle for HQ */}
                {office.isHQ && (
                  <circle r={3} fill="white" />
                )}
              </Marker>
            ))}
          </ComposableMap>

          {/* Location card */}
          <AnimatePresence>
            {activeOffice && (
              <motion.div
                className="absolute z-20 pointer-events-auto"
                style={{
                  left: '50%',
                  bottom: '20px',
                  transform: 'translateX(-50%)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div
                  className="bg-white rounded-xl shadow-2xl p-5 min-w-[320px] border-t-4"
                  style={{ borderTopColor: regionColors[activeOffice.region] }}
                >
                  {/* Close button */}
                  {selectedOffice && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOffice(null);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${regionColors[activeOffice.region]}15` }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: regionColors[activeOffice.region] }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{activeOffice.city}</h4>
                      <p className="text-sm text-gray-500">{activeOffice.label}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {activeOffice.isHQ && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                          HQ
                        </span>
                      )}
                      {activeOffice.comingSoon && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-800">{activeOffice.company}</p>
                    {!activeOffice.comingSoon && <p>{activeOffice.address}</p>}
                    <p>{activeOffice.cityFull}</p>
                    <p className="font-medium">{activeOffice.country}</p>
                  </div>

                  {/* Region tag */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: regionColors[activeOffice.region] }}
                    >
                      <Globe2 className="w-3 h-3" />
                      {activeOffice.region}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Region legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {Object.entries(regionColors).map(([region, color]) => {
            const regionOffices = offices.filter(o => o.region === region);
            const comingSoonCount = regionOffices.filter(o => o.comingSoon).length;
            const activeCount = regionOffices.length - comingSoonCount;
            return (
              <div key={region} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700">{region}</span>
                <span className="text-xs text-gray-400">
                  ({activeCount}{comingSoonCount > 0 ? ` + ${comingSoonCount} soon` : ''})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Scrollable cards by region */}
      <div className="md:hidden space-y-8">
        {Object.entries(officesByRegion).map(([region, regionOffices]) => (
          <div key={region}>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: regionColors[region] }}
              />
              <h3 className="font-semibold text-gray-900">{region}</h3>
              <span className="text-sm text-gray-500">({regionOffices.length} offices)</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {regionOffices.map((office) => (
                <motion.div
                  key={office.id}
                  className="flex-shrink-0 w-[280px] snap-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="bg-white rounded-xl shadow-md p-4 h-full border-l-4"
                    style={{ borderLeftColor: regionColors[region] }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{office.city}</h4>
                        <p className="text-xs text-gray-500">{office.label}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {office.isHQ && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                            HQ
                          </span>
                        )}
                        {office.comingSoon && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-800">{office.company}</p>
                      {!office.comingSoon && <p>{office.address}</p>}
                      <p>{office.cityFull}</p>
                      <p className="font-medium">{office.country}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-6 mt-12">
        <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-sm">
          <div className="w-10 h-10 bg-[var(--aci-primary)] rounded-full flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{offices.filter(o => !o.comingSoon).length}</div>
            <div className="text-sm text-gray-500">Active Offices</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-sm">
          <div className="w-10 h-10 bg-[var(--aci-primary)] rounded-full flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{Object.keys(officesByRegion).length}</div>
            <div className="text-sm text-gray-500">Regions</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-sm">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{offices.filter(o => o.comingSoon).length}</div>
            <div className="text-sm text-gray-500">Coming Soon</div>
          </div>
        </div>
      </div>
    </div>
  );
}
