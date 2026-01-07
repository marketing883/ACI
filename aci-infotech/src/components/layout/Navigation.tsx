'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

// Navigation data
const NAV_DATA = {
  services: [
    { label: 'Data Engineering', href: '/services/data-engineering', description: 'Platforms that feed AI and analytics' },
    { label: 'Applied AI & ML', href: '/services/applied-ai-ml', description: 'From GenAI pilots to production ML' },
    { label: 'Cloud Modernization', href: '/services/cloud-modernization', description: 'Multi-cloud without the chaos' },
    { label: 'MarTech & CDP', href: '/services/martech-cdp', description: 'Customer 360 that actually works' },
    { label: 'Digital Transformation', href: '/services/digital-transformation', description: 'Intelligent process automation' },
    { label: 'Cyber Security', href: '/services/cyber-security', description: 'Security built in, not bolted on' },
  ],
  platforms: [
    { label: 'Salesforce', href: '/platforms/salesforce' },
    { label: 'ServiceNow', href: '/platforms/servicenow' },
    { label: 'Snowflake', href: '/platforms/snowflake' },
    { label: 'SAP', href: '/platforms/sap' },
    { label: 'Mulesoft', href: '/platforms/mulesoft' },
    { label: 'Adobe', href: '/platforms/adobe' },
    { label: 'AWS', href: '/platforms/aws' },
  ],
  industries: [
    { label: 'Banking & Financial Services', href: '/industries/banking' },
    { label: 'Healthcare', href: '/industries/healthcare' },
    { label: 'Retail & CPG', href: '/industries/retail' },
    { label: 'Manufacturing', href: '/industries/manufacturing' },
    { label: 'Hospitality', href: '/industries/hospitality' },
    { label: 'Education', href: '/industries/education' },
    { label: 'Automotive', href: '/industries/automotive' },
    { label: 'Energy & Utilities', href: '/industries/energy' },
    { label: 'Public Sector', href: '/industries/public-sector' },
    { label: 'Oil & Gas', href: '/industries/oil-gas' },
  ],
  resources: [
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'Whitepapers', href: '/resources/whitepapers' },
    { label: 'Webinars', href: '/resources/webinars' },
  ],
  about: [
    { label: 'Who We Are', href: '/about' },
    { label: 'Leadership Team', href: '/about#leadership' },
    { label: 'Careers', href: '/careers' },
  ],
};

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-40 h-12">
              {/* Placeholder for logo - replace with actual logo */}
              <span className="text-2xl font-bold text-[var(--aci-primary)]">
                ACI Infotech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Services Dropdown */}
            <NavDropdown
              label="Services"
              isActive={activeDropdown === 'services'}
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <MegaMenuServices items={NAV_DATA.services} />
            </NavDropdown>

            {/* Platforms Dropdown */}
            <NavDropdown
              label="Platforms"
              isActive={activeDropdown === 'platforms'}
              onMouseEnter={() => setActiveDropdown('platforms')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <SimpleDropdown items={NAV_DATA.platforms} columns={2} />
            </NavDropdown>

            {/* Industries Dropdown */}
            <NavDropdown
              label="Industries"
              isActive={activeDropdown === 'industries'}
              onMouseEnter={() => setActiveDropdown('industries')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <SimpleDropdown items={NAV_DATA.industries} columns={2} />
            </NavDropdown>

            {/* Resources Dropdown */}
            <NavDropdown
              label="Resources"
              isActive={activeDropdown === 'resources'}
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <SimpleDropdown items={NAV_DATA.resources} columns={1} />
            </NavDropdown>

            {/* About Dropdown */}
            <NavDropdown
              label="About"
              isActive={activeDropdown === 'about'}
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <SimpleDropdown items={NAV_DATA.about} columns={1} />
            </NavDropdown>

            {/* Contact Link */}
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-[var(--aci-secondary)] hover:text-[var(--aci-primary)] transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button href="/contact" variant="primary" size="md">
              Talk to an Architect
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[var(--aci-secondary)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navData={NAV_DATA}
      />
    </header>
  );
}

// Desktop Dropdown Wrapper
interface NavDropdownProps {
  label: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: React.ReactNode;
}

function NavDropdown({
  label,
  isActive,
  onMouseEnter,
  onMouseLeave,
  children,
}: NavDropdownProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className={`
          flex items-center gap-1 px-4 py-2 text-sm font-medium
          transition-colors
          ${isActive ? 'text-[var(--aci-primary)]' : 'text-[var(--aci-secondary)] hover:text-[var(--aci-primary)]'}
        `}
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Content */}
      <div
        className={`
          absolute top-full left-0 pt-2
          transition-all duration-200
          ${isActive ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
        `}
      >
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// Mega Menu for Services
interface MegaMenuServicesProps {
  items: { label: string; href: string; description: string }[];
}

function MegaMenuServices({ items }: MegaMenuServicesProps) {
  return (
    <div className="p-6 w-[600px]">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors">
              {item.label}
            </div>
            <div className="text-sm text-gray-500 mt-1">{item.description}</div>
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/services"
          className="flex items-center gap-2 text-sm font-medium text-[var(--aci-primary)] hover:underline"
        >
          View all services
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Simple Dropdown for other menus
interface SimpleDropdownProps {
  items: { label: string; href: string }[];
  columns?: 1 | 2;
}

function SimpleDropdown({ items, columns = 1 }: SimpleDropdownProps) {
  return (
    <div className={`p-4 ${columns === 2 ? 'w-[400px]' : 'w-[220px]'}`}>
      <div className={`grid ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-1`}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 text-sm text-[var(--aci-secondary)] hover:text-[var(--aci-primary)] hover:bg-gray-50 rounded-lg transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Mobile Menu
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navData: typeof NAV_DATA;
}

function MobileMenu({ isOpen, onClose, navData }: MobileMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div
      className={`
        fixed inset-0 top-20 bg-white z-40 lg:hidden
        transition-all duration-300
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}
    >
      <div className="h-full overflow-y-auto pb-20">
        <div className="px-4 py-6 space-y-2">
          {/* Services Accordion */}
          <MobileAccordion
            title="Services"
            isExpanded={expandedSection === 'services'}
            onToggle={() =>
              setExpandedSection(expandedSection === 'services' ? null : 'services')
            }
          >
            {navData.services.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="block px-4 py-3 text-gray-600 hover:text-[var(--aci-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </MobileAccordion>

          {/* Platforms Accordion */}
          <MobileAccordion
            title="Platforms"
            isExpanded={expandedSection === 'platforms'}
            onToggle={() =>
              setExpandedSection(expandedSection === 'platforms' ? null : 'platforms')
            }
          >
            {navData.platforms.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="block px-4 py-3 text-gray-600 hover:text-[var(--aci-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </MobileAccordion>

          {/* Industries Accordion */}
          <MobileAccordion
            title="Industries"
            isExpanded={expandedSection === 'industries'}
            onToggle={() =>
              setExpandedSection(expandedSection === 'industries' ? null : 'industries')
            }
          >
            {navData.industries.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="block px-4 py-3 text-gray-600 hover:text-[var(--aci-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </MobileAccordion>

          {/* Resources Accordion */}
          <MobileAccordion
            title="Resources"
            isExpanded={expandedSection === 'resources'}
            onToggle={() =>
              setExpandedSection(expandedSection === 'resources' ? null : 'resources')
            }
          >
            {navData.resources.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="block px-4 py-3 text-gray-600 hover:text-[var(--aci-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </MobileAccordion>

          {/* About Accordion */}
          <MobileAccordion
            title="About"
            isExpanded={expandedSection === 'about'}
            onToggle={() =>
              setExpandedSection(expandedSection === 'about' ? null : 'about')
            }
          >
            {navData.about.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="block px-4 py-3 text-gray-600 hover:text-[var(--aci-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </MobileAccordion>

          {/* Contact Link */}
          <Link
            href="/contact"
            onClick={onClose}
            className="block px-4 py-4 text-lg font-medium text-[var(--aci-secondary)]"
          >
            Contact
          </Link>

          {/* Mobile CTA */}
          <div className="pt-6 px-4">
            <Button href="/contact" variant="primary" size="lg" fullWidth onClick={onClose}>
              Talk to an Architect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Accordion Component
interface MobileAccordionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function MobileAccordion({
  title,
  isExpanded,
  onToggle,
  children,
}: MobileAccordionProps) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-4 text-lg font-medium text-[var(--aci-secondary)]"
      >
        {title}
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isExpanded ? 'max-h-96' : 'max-h-0'}
        `}
      >
        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
}
