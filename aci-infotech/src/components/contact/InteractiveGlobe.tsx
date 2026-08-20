'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Globe2 } from 'lucide-react';

// Office locations with coordinates mapped to SVG viewBox (0-100 scale)
const offices = [
  // Americas
  {
    id: 'newjersey',
    city: 'New Jersey',
    region: 'Americas',
    label: 'Global Headquarters',
    isHQ: true,
    company: 'ACI Infotech Inc',
    address: '220 Davidson Ave, 2nd Floor, Suite 129',
    cityFull: 'Somerset, New Jersey 08873',
    country: 'United States',
    x: 23,
    y: 35,
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
    x: 20,
    y: 38,
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
    x: 17,
    y: 39,
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
    x: 21,
    y: 43,
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
    x: 48,
    y: 30,
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
    x: 50,
    y: 31,
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
    x: 60,
    y: 43,
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
    x: 68,
    y: 46,
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
    x: 67,
    y: 40,
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
    x: 67,
    y: 50,
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
    x: 75,
    y: 55,
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
    x: 74,
    y: 53,
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
  x: number;
  y: number;
}

export default function InteractiveGlobe() {
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [hoveredOffice, setHoveredOffice] = useState<string | null>(null);

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
          <svg
            viewBox="0 0 100 60"
            className="w-full h-auto"
            style={{ minHeight: '400px' }}
          >
            {/* Simple world map paths - simplified continents */}
            <g fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.2">
              {/* North America */}
              <path d="M5,20 L25,15 L30,20 L28,30 L25,35 L22,40 L18,42 L15,40 L10,35 L8,28 Z" />
              {/* South America */}
              <path d="M20,45 L28,42 L30,48 L28,55 L22,58 L18,55 L17,48 Z" />
              {/* Europe */}
              <path d="M45,18 L55,16 L58,22 L55,30 L50,32 L45,30 L43,25 Z" />
              {/* Africa */}
              <path d="M45,35 L55,33 L60,40 L58,52 L50,55 L45,50 L43,42 Z" />
              {/* Asia */}
              <path d="M58,15 L85,12 L90,25 L88,40 L78,45 L70,42 L62,35 L58,25 Z" />
              {/* Australia */}
              <path d="M78,50 L88,48 L92,52 L88,58 L80,58 L76,54 Z" />
              {/* India subcontinent */}
              <path d="M62,38 L72,36 L74,45 L70,52 L64,50 L62,44 Z" />
              {/* UK */}
              <ellipse cx="47" cy="26" rx="2" ry="3" />
              {/* Japan */}
              <ellipse cx="88" cy="32" rx="1.5" ry="4" />
              {/* Indonesia */}
              <path d="M75,52 L82,50 L85,52 L82,54 L76,54 Z" />
            </g>

            {/* Connection lines from HQ to all other offices */}
            {hqOffice && offices.map((office) => {
              if (office.isHQ) return null;
              return (
                <line
                  key={`line-${office.id}`}
                  x1={hqOffice.x}
                  y1={hqOffice.y}
                  x2={office.x}
                  y2={office.y}
                  stroke={regionColors[office.region]}
                  strokeWidth="0.3"
                  strokeDasharray="1 1"
                  opacity="0.4"
                />
              );
            })}

            {/* Office markers */}
            {offices.map((office) => (
              <g
                key={office.id}
                transform={`translate(${office.x}, ${office.y})`}
                onMouseEnter={() => setHoveredOffice(office.id)}
                onMouseLeave={() => setHoveredOffice(null)}
                onClick={() => setSelectedOffice(selectedOffice === office.id ? null : office.id)}
                className="cursor-pointer"
              >
                {/* Pulse animation for HQ */}
                {office.isHQ && (
                  <circle
                    r="3"
                    fill={regionColors[office.region]}
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="2;4;2"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0;0.6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Main marker */}
                <circle
                  r={office.isHQ ? 2 : office.comingSoon ? 1.2 : 1.5}
                  fill={office.comingSoon ? 'white' : regionColors[office.region]}
                  stroke={regionColors[office.region]}
                  strokeWidth={office.comingSoon ? 0.4 : 0}
                  strokeDasharray={office.comingSoon ? '0.5 0.3' : 'none'}
                  className="transition-transform duration-200"
                  style={{
                    transform: (selectedOffice === office.id || hoveredOffice === office.id) ? 'scale(1.5)' : 'scale(1)',
                  }}
                />

                {/* Inner circle for HQ */}
                {office.isHQ && (
                  <circle r="0.8" fill="white" />
                )}
              </g>
            ))}
          </svg>

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
