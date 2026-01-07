'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Database,
  Brain,
  Cloud,
  Target,
  Cog,
  Shield,
  Building2,
  ShoppingCart,
  Heart,
  Factory,
  Zap,
  Snowflake,
  MessageSquare,
  Server,
  Workflow,
  FileText,
  BookOpen,
  Users,
  Award,
  Download,
  Play,
} from 'lucide-react';
import Button from '@/components/ui/Button';

// Navigation data with icons
const NAV_DATA = {
  services: [
    {
      label: 'Data Engineering',
      href: '/services/data-engineering',
      description: 'Platforms that feed AI and analytics',
      icon: Database,
      color: 'text-blue-500',
    },
    {
      label: 'Applied AI & ML',
      href: '/services/applied-ai-ml',
      description: 'From GenAI pilots to production ML',
      icon: Brain,
      color: 'text-purple-500',
    },
    {
      label: 'Cloud Modernization',
      href: '/services/cloud-modernization',
      description: 'Multi-cloud without the chaos',
      icon: Cloud,
      color: 'text-cyan-500',
    },
    {
      label: 'MarTech & CDP',
      href: '/services/martech-cdp',
      description: 'Customer 360 that actually works',
      icon: Target,
      color: 'text-pink-500',
    },
    {
      label: 'Digital Transformation',
      href: '/services/digital-transformation',
      description: 'Intelligent process automation',
      icon: Cog,
      color: 'text-orange-500',
    },
    {
      label: 'Cyber Security',
      href: '/services/cyber-security',
      description: 'Security built in, not bolted on',
      icon: Shield,
      color: 'text-red-500',
    },
  ],
  platforms: [
    { label: 'Databricks', href: '/platforms/databricks', icon: Database, color: 'text-[#FF3621]' },
    { label: 'Snowflake', href: '/platforms/snowflake', icon: Snowflake, color: 'text-[#29B5E8]' },
    { label: 'AWS', href: '/platforms/aws', icon: Cloud, color: 'text-[#FF9900]' },
    { label: 'Azure', href: '/platforms/azure', icon: Cloud, color: 'text-[#0078D4]' },
    { label: 'Salesforce', href: '/platforms/salesforce', icon: Users, color: 'text-[#00A1E0]' },
    { label: 'SAP', href: '/platforms/sap', icon: Server, color: 'text-[#0FAAFF]' },
    { label: 'ServiceNow', href: '/platforms/servicenow', icon: Workflow, color: 'text-[#81B5A1]' },
    { label: 'Braze', href: '/platforms/braze', icon: MessageSquare, color: 'text-[#ED4B4B]' },
  ],
  industries: [
    { label: 'Financial Services', href: '/industries/financial-services', icon: Building2, color: 'text-emerald-600' },
    { label: 'Retail & Consumer', href: '/industries/retail', icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Healthcare', href: '/industries/healthcare', icon: Heart, color: 'text-red-500' },
    { label: 'Manufacturing', href: '/industries/manufacturing', icon: Factory, color: 'text-orange-600' },
    { label: 'Energy & Utilities', href: '/industries/energy', icon: Zap, color: 'text-yellow-500' },
  ],
  resources: [
    { label: 'Case Studies', href: '/case-studies', icon: Award, description: 'Real results from real clients' },
    { label: 'Blog', href: '/blog', icon: BookOpen, description: 'Insights and thought leadership' },
  ],
};

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

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
        ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-[var(--aci-primary)]">
              ACI Infotech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Services Dropdown */}
            <NavDropdown
              label="Services"
              isActive={activeDropdown === 'services'}
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
              wide
            >
              <ServicesMegaMenu items={NAV_DATA.services} />
            </NavDropdown>

            {/* Platforms Dropdown */}
            <NavDropdown
              label="Platforms"
              isActive={activeDropdown === 'platforms'}
              onMouseEnter={() => setActiveDropdown('platforms')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <PlatformsMegaMenu items={NAV_DATA.platforms} />
            </NavDropdown>

            {/* Industries Dropdown */}
            <NavDropdown
              label="Industries"
              isActive={activeDropdown === 'industries'}
              onMouseEnter={() => setActiveDropdown('industries')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <IndustriesMegaMenu items={NAV_DATA.industries} />
            </NavDropdown>

            {/* Resources Dropdown */}
            <NavDropdown
              label="Resources"
              isActive={activeDropdown === 'resources'}
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <ResourcesMegaMenu items={NAV_DATA.resources} />
            </NavDropdown>

            {/* About Link */}
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-[var(--aci-secondary)] hover:text-[var(--aci-primary)] transition-colors"
            >
              About
            </Link>

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
            <Button href="/contact?reason=architecture-call" variant="primary" size="md">
              Talk to an Architect
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[var(--aci-secondary)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
  wide?: boolean;
}

function NavDropdown({ label, isActive, onMouseEnter, onMouseLeave, children, wide }: NavDropdownProps) {
  return (
    <div className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button
        className={`
          flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors
          ${isActive ? 'text-[var(--aci-primary)]' : 'text-[var(--aci-secondary)] hover:text-[var(--aci-primary)]'}
        `}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`
          absolute top-full ${wide ? 'left-1/2 -translate-x-1/2' : 'left-0'} pt-4
          transition-all duration-200
          ${isActive ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
        `}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// Grand Services Mega Menu with Video Promo
interface ServicesMegaMenuProps {
  items: typeof NAV_DATA.services;
}

function ServicesMegaMenu({ items }: ServicesMegaMenuProps) {
  return (
    <div className="flex w-[850px]">
      {/* Services List */}
      <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Our Services
        </div>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                  <Icon className={`w-5 h-5 ${item.color} transition-transform group-hover:scale-110`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors text-sm">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--aci-primary)] hover:gap-3 transition-all"
          >
            View all services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Video Promo Section */}
      <div className="w-[280px] bg-gradient-to-br from-[var(--aci-secondary)] to-[#1a2a4a] p-6 flex flex-col justify-between">
        <div>
          <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
            Featured
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Enterprise Data Transformation
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            See how we helped MSCI save $12M with unified data platform
          </p>
        </div>

        {/* Video Placeholder with Play Button */}
        <div className="relative aspect-video bg-black/30 rounded-xl overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 bg-[var(--aci-primary)]/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Play className="w-5 h-5 text-[var(--aci-primary)] ml-1" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <span className="text-xs text-white/80">2 min watch</span>
          </div>
        </div>

        <Link
          href="/case-studies/msci-data-automation"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-200 transition-colors"
        >
          View case study <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Platforms Mega Menu with Icons
interface PlatformsMegaMenuProps {
  items: typeof NAV_DATA.platforms;
}

function PlatformsMegaMenu({ items }: PlatformsMegaMenuProps) {
  return (
    <div className="p-6 w-[480px] bg-gradient-to-br from-gray-50 to-white">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Technology Partners
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-gray-50 flex items-center justify-center transition-colors border border-gray-200">
                <Icon className={`w-5 h-5 ${item.color} transition-transform group-hover:scale-110`} />
              </div>
              <span className="font-medium text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/platforms"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--aci-primary)] hover:gap-3 transition-all"
        >
          View all platforms <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Industries Mega Menu
interface IndustriesMegaMenuProps {
  items: typeof NAV_DATA.industries;
}

function IndustriesMegaMenu({ items }: IndustriesMegaMenuProps) {
  return (
    <div className="p-6 w-[400px] bg-gradient-to-br from-gray-50 to-white">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Industries We Serve
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-gray-50 flex items-center justify-center transition-colors">
                <Icon className={`w-5 h-5 ${item.color} transition-transform group-hover:scale-110`} />
              </div>
              <span className="font-medium text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/industries"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--aci-primary)] hover:gap-3 transition-all"
        >
          View all industries <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Resources Mega Menu with Ebook Promo
interface ResourcesMegaMenuProps {
  items: typeof NAV_DATA.resources;
}

function ResourcesMegaMenu({ items }: ResourcesMegaMenuProps) {
  return (
    <div className="flex w-[580px]">
      {/* Resources List */}
      <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Resources
        </div>
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-[var(--aci-primary)] transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <div className="font-medium text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-500">{item.description}</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Ebook Promo Section */}
      <div className="w-[260px] bg-gradient-to-br from-[var(--aci-primary)] to-blue-700 p-6 flex flex-col">
        <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-3">
          Free Download
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          2025 Enterprise Data Strategy Guide
        </h3>
        <p className="text-sm text-blue-100 mb-4 flex-1">
          Learn how leading companies are building modern data platforms
        </p>

        {/* Ebook Visual */}
        <div className="relative mb-4">
          <div className="bg-white rounded-lg shadow-xl p-4 transform -rotate-3 hover:rotate-0 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-800">PDF Guide</div>
                <div className="text-xs text-gray-500">32 pages</div>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/contact?reason=ebook"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[var(--aci-primary)] rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Free
        </Link>
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
    <>
      {/* Menu Panel - Full screen overlay below header */}
      <div
        className={`
          fixed top-20 left-0 right-0 bottom-0 bg-white z-50 lg:hidden
          transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6 space-y-1">
            {/* Services */}
            <MobileAccordion
              title="Services"
              isExpanded={expandedSection === 'services'}
              onToggle={() => setExpandedSection(expandedSection === 'services' ? null : 'services')}
            >
              {navData.services.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[var(--aci-primary)] hover:bg-gray-50 rounded-lg"
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/services"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 text-[var(--aci-primary)] font-medium"
              >
                View all services <ArrowRight className="w-4 h-4" />
              </Link>
            </MobileAccordion>

            {/* Platforms */}
            <MobileAccordion
              title="Platforms"
              isExpanded={expandedSection === 'platforms'}
              onToggle={() => setExpandedSection(expandedSection === 'platforms' ? null : 'platforms')}
            >
              {navData.platforms.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[var(--aci-primary)] hover:bg-gray-50 rounded-lg"
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/platforms"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 text-[var(--aci-primary)] font-medium"
              >
                View all platforms <ArrowRight className="w-4 h-4" />
              </Link>
            </MobileAccordion>

            {/* Industries */}
            <MobileAccordion
              title="Industries"
              isExpanded={expandedSection === 'industries'}
              onToggle={() => setExpandedSection(expandedSection === 'industries' ? null : 'industries')}
            >
              {navData.industries.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[var(--aci-primary)] hover:bg-gray-50 rounded-lg"
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/industries"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 text-[var(--aci-primary)] font-medium"
              >
                View all industries <ArrowRight className="w-4 h-4" />
              </Link>
            </MobileAccordion>

            {/* Resources */}
            <MobileAccordion
              title="Resources"
              isExpanded={expandedSection === 'resources'}
              onToggle={() => setExpandedSection(expandedSection === 'resources' ? null : 'resources')}
            >
              {navData.resources.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[var(--aci-primary)] hover:bg-gray-50 rounded-lg"
                  >
                    <Icon className="w-5 h-5 text-[var(--aci-primary)]" />
                    <div>
                      <div>{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400">{item.description}</div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </MobileAccordion>

            {/* Direct Links */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-4 text-lg font-medium text-[var(--aci-secondary)] hover:text-[var(--aci-primary)]"
              >
                <Users className="w-5 h-5" />
                About Us
              </Link>

              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-4 text-lg font-medium text-[var(--aci-secondary)] hover:text-[var(--aci-primary)]"
              >
                <MessageSquare className="w-5 h-5" />
                Contact
              </Link>
            </div>

            {/* CTA */}
            <div className="pt-6 px-4 pb-8">
              <Button href="/contact?reason=architecture-call" variant="primary" size="lg" fullWidth onClick={onClose}>
                Talk to an Architect
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Mobile Accordion
interface MobileAccordionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function MobileAccordion({ title, isExpanded, onToggle, children }: MobileAccordionProps) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-4 text-lg font-semibold text-[var(--aci-secondary)]"
      >
        <span>{title}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="pb-4 pl-2">{children}</div>
      </div>
    </div>
  );
}
