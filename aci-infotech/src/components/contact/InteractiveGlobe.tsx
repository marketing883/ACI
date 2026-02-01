'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Building2, Globe2 } from 'lucide-react';

// Office locations with coordinates (approximate positions on the globe visualization)
const offices = [
  // Americas
  {
    id: 'somerset',
    city: 'Somerset, NJ',
    region: 'Americas',
    label: 'Global Headquarters',
    isHQ: true,
    company: 'ACI Infotech Inc',
    address: '220 Davidson Avenue, Suite 129',
    cityFull: 'Somerset, New Jersey - 08873',
    country: 'United States',
    // Position on globe (percentage from left, percentage from top)
    x: 22,
    y: 35,
  },
  {
    id: 'atlanta',
    city: 'Atlanta, GA',
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
    id: 'texas',
    city: 'Bryan, TX',
    region: 'Americas',
    label: 'Central Region',
    company: 'ACI Infotech Inc',
    address: '1716 Briarcrest Drive, 3rd Floor',
    cityFull: 'Bryan, Texas 77802',
    country: 'United States',
    x: 16,
    y: 40,
  },
  // Europe
  {
    id: 'london',
    city: 'London',
    region: 'Europe',
    label: 'UK & Northern Europe',
    company: 'ACI Infotech Ltd',
    address: 'Coming Soon',
    cityFull: 'London',
    country: 'United Kingdom',
    x: 47,
    y: 30,
  },
  {
    id: 'madrid',
    city: 'Madrid',
    region: 'Europe',
    label: 'Southern Europe',
    company: 'ACI Infotech EU',
    address: 'Coming Soon',
    cityFull: 'Madrid',
    country: 'Spain',
    x: 45,
    y: 36,
  },
  // Middle East
  {
    id: 'dubai',
    city: 'Dubai',
    region: 'Middle East',
    label: 'MENA Hub',
    company: 'ACI Global FZ LLC',
    address: 'Coming Soon',
    cityFull: 'Dubai',
    country: 'United Arab Emirates',
    x: 60,
    y: 42,
  },
  {
    id: 'rak',
    city: 'Ras Al-Khaimah',
    region: 'Middle East',
    label: 'UAE Operations',
    company: 'ACI Global FZ LLC',
    address: 'Ras Al Khaimah Economic Zone Authority',
    cityFull: 'Al Mamourah Street - Ras Al-Khaimah',
    country: 'United Arab Emirates',
    x: 61,
    y: 40,
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
    x: 70,
    y: 45,
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
    x: 71,
    y: 40,
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    region: 'India',
    label: 'South India',
    company: 'ACI Global Business Services Pvt Ltd',
    address: 'ITI Layout, HSR Layout',
    cityFull: 'Bengaluru, Karnataka 560102',
    country: 'India',
    x: 69,
    y: 50,
  },
];

// Region colors
const regionColors: Record<string, string> = {
  'Americas': '#0066CC',
  'Europe': '#8B5CF6',
  'Middle East': '#F59E0B',
  'India': '#10B981',
};

export default function InteractiveGlobe() {
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [hoveredOffice, setHoveredOffice] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeOffice = offices.find(o => o.id === (selectedOffice || hoveredOffice));

  // Group offices by region for mobile view
  const officesByRegion = offices.reduce((acc, office) => {
    if (!acc[office.region]) acc[office.region] = [];
    acc[office.region].push(office);
    return acc;
  }, {} as Record<string, typeof offices>);

  return (
    <div className="relative" ref={containerRef}>
      {/* Desktop: Interactive Globe */}
      <div className="hidden md:block">
        <div className="relative aspect-[2/1] max-w-5xl mx-auto">
          {/* World map SVG background */}
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
          >
            {/* Simplified world map outline */}
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0E7FF" />
                <stop offset="100%" stopColor="#C7D2FE" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Simplified continent shapes */}
            {/* North America */}
            <path
              d="M10,15 Q15,10 25,12 L28,18 Q30,25 25,32 L20,35 Q12,38 8,30 Q5,22 10,15"
              fill="url(#mapGradient)"
              stroke="#94A3B8"
              strokeWidth="0.2"
            />
            {/* South America */}
            <path
              d="M22,40 Q28,38 30,42 L28,55 Q24,60 20,55 L18,45 Q20,42 22,40"
              fill="url(#mapGradient)"
              stroke="#94A3B8"
              strokeWidth="0.2"
            />
            {/* Europe */}
            <path
              d="M42,12 Q50,10 55,15 L54,22 Q52,28 46,30 L42,25 Q40,18 42,12"
              fill="url(#mapGradient)"
              stroke="#94A3B8"
              strokeWidth="0.2"
            />
            {/* Africa */}
            <path
              d="M44,32 Q52,30 56,35 L55,50 Q50,55 45,52 L42,40 Q43,35 44,32"
              fill="url(#mapGradient)"
              stroke="#94A3B8"
              strokeWidth="0.2"
            />
            {/* Asia */}
            <path
              d="M56,12 Q70,8 85,15 L88,25 Q85,35 75,40 L65,42 Q58,38 55,30 L56,20 Q55,15 56,12"
              fill="url(#mapGradient)"
              stroke="#94A3B8"
              strokeWidth="0.2"
            />
            {/* India subcontinent detail */}
            <path
              d="M65,35 Q70,32 72,36 L70,48 Q68,52 65,48 L64,40 Q64,37 65,35"
              fill="url(#mapGradient)"
              stroke="#94A3B8"
              strokeWidth="0.2"
            />
            {/* Australia */}
            <path
              d="M78,48 Q85,45 90,50 L88,58 Q82,62 78,58 L76,52 Q77,50 78,48"
              fill="url(#mapGradient)"
              stroke="#94A3B8"
              strokeWidth="0.2"
            />

            {/* Connection lines between offices */}
            {offices.map((office, i) => {
              const hqOffice = offices.find(o => o.isHQ);
              if (office.isHQ || !hqOffice) return null;
              return (
                <motion.line
                  key={`line-${office.id}`}
                  x1={hqOffice.x}
                  y1={hqOffice.y}
                  x2={office.x}
                  y2={office.y}
                  stroke={regionColors[office.region]}
                  strokeWidth="0.15"
                  strokeDasharray="1,1"
                  opacity={0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: i * 0.1 }}
                />
              );
            })}
          </svg>

          {/* Office markers */}
          {offices.map((office) => (
            <motion.div
              key={office.id}
              className="absolute cursor-pointer"
              style={{
                left: `${office.x}%`,
                top: `${office.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: Math.random() * 0.5, type: 'spring' }}
              onMouseEnter={() => setHoveredOffice(office.id)}
              onMouseLeave={() => setHoveredOffice(null)}
              onClick={() => setSelectedOffice(selectedOffice === office.id ? null : office.id)}
            >
              {/* Pulse ring for HQ */}
              {office.isHQ && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: regionColors[office.region] }}
                  animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Marker dot */}
              <motion.div
                className={`relative z-10 rounded-full flex items-center justify-center shadow-lg ${
                  office.isHQ ? 'w-5 h-5' : 'w-3 h-3'
                }`}
                style={{ backgroundColor: regionColors[office.region] }}
                whileHover={{ scale: 1.5 }}
                animate={
                  selectedOffice === office.id || hoveredOffice === office.id
                    ? { scale: 1.5 }
                    : { scale: 1 }
                }
              >
                {office.isHQ && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </motion.div>

              {/* City label */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap"
                initial={{ opacity: 0, y: -5 }}
                animate={{
                  opacity: selectedOffice === office.id || hoveredOffice === office.id ? 1 : 0,
                  y: selectedOffice === office.id || hoveredOffice === office.id ? 0 : -5,
                }}
              >
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: regionColors[office.region] }}
                >
                  {office.city}
                </span>
              </motion.div>
            </motion.div>
          ))}

          {/* Location card - slides out when office is selected/hovered */}
          <AnimatePresence>
            {activeOffice && (
              <motion.div
                key={activeOffice.id}
                className="absolute z-20"
                style={{
                  left: `${Math.min(Math.max(activeOffice.x, 20), 80)}%`,
                  top: `${activeOffice.y + 8}%`,
                  transform: 'translateX(-50%)',
                }}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <div
                  className="bg-white rounded-xl shadow-2xl p-4 min-w-[280px] border-t-4"
                  style={{ borderTopColor: regionColors[activeOffice.region] }}
                >
                  {/* Close button for selected state */}
                  {selectedOffice && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOffice(null);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${regionColors[activeOffice.region]}15` }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: regionColors[activeOffice.region] }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{activeOffice.city}</h4>
                      <p className="text-xs text-gray-500">{activeOffice.label}</p>
                    </div>
                    {activeOffice.isHQ && (
                      <span className="ml-auto px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                        HQ
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-800">{activeOffice.company}</p>
                    <p>{activeOffice.address}</p>
                    <p>{activeOffice.cityFull}</p>
                    <p className="font-medium">{activeOffice.country}</p>
                  </div>

                  {/* Region tag */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
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
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {Object.entries(regionColors).map(([region, color]) => (
            <div key={region} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-600">{region}</span>
              <span className="text-xs text-gray-400">
                ({offices.filter(o => o.region === region).length})
              </span>
            </div>
          ))}
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
                      {office.isHQ && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                          HQ
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-800">{office.company}</p>
                      <p>{office.address}</p>
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
            <div className="text-2xl font-bold text-gray-900">{offices.length}</div>
            <div className="text-sm text-gray-500">Offices</div>
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
      </div>
    </div>
  );
}
