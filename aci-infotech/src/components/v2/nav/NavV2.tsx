'use client';

/**
 * NavV2 — v2 fixed top navigation, rebuilt as a mega-menu orchestrator.
 *
 *   - Transparent over the hero; a subtle dark blurred surface kicks in
 *     after 40px of scroll
 *   - Five primary triggers (Services, Platforms, Industries, Resources,
 *     Company) each open a dedicated mega menu panel
 *   - useMegaMenuHover centralizes open/close timing so moving between
 *     triggers feels instant without flicker
 *   - Below 820px the triggers collapse to a hamburger that opens
 *     MobileMenu (full-screen accordion)
 *
 * This component owns no menu content — each panel's layout lives in
 * its own file under src/components/v2/nav/. The orchestrator's only
 * job is to wire triggers to panels.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu } from 'lucide-react';
import MegaMenu from './MegaMenu';
import ServicesMenu from './ServicesMenu';
import PlatformsMenu from './PlatformsMenu';
import IndustriesMenu from './IndustriesMenu';
import ResourcesMenu, { ResourcesMenuData } from './ResourcesMenu';
import CompanyMenu, { CompanyMenuData } from './CompanyMenu';
import MobileMenu from './MobileMenu';
import { useMegaMenuHover } from './useMegaMenuHover';
import { PLAYBOOKS } from '@/components/sections/PlaybookVaultSection';

interface NavV2Props {
  /** Pre-fetched data for the Resources mega-menu cards. */
  resources?: ResourcesMenuData;
  /** Pre-fetched data for the Company mega-menu spotlight. */
  company?: CompanyMenuData;
}

type MenuId = 'services' | 'platforms' | 'industries' | 'resources' | 'company';

interface TriggerDef {
  id: MenuId;
  label: string;
  ariaLabel: string;
  maxWidth: number;
  /** Wide menus hug the left gutter; narrower ones look better
   *  centered so they don't sit stranded on the left. */
  align: 'left' | 'center';
}

const TRIGGERS: TriggerDef[] = [
  { id: 'services', label: 'Services', ariaLabel: 'Services menu', maxWidth: 1080, align: 'left' },
  { id: 'platforms', label: 'Platforms', ariaLabel: 'Platforms menu', maxWidth: 1040, align: 'left' },
  { id: 'industries', label: 'Industries', ariaLabel: 'Industries menu', maxWidth: 920, align: 'center' },
  { id: 'resources', label: 'Resources', ariaLabel: 'Resources menu', maxWidth: 1060, align: 'center' },
  { id: 'company', label: 'Company', ariaLabel: 'Company menu', maxWidth: 720, align: 'center' },
];

// Resolve the top playbook client-side. PLAYBOOKS lives in a 'use client'
// module, so importing it into the server page wraps it as a client
// reference proxy (which isn't iterable). Deriving here keeps the
// import on the client side where the array is a plain value.
const TOP_PLAYBOOK = [...PLAYBOOKS].sort(
  (a, b) => b.deployments - a.deployments,
)[0];

export default function NavV2({ resources, company }: NavV2Props) {
  const menu = useMegaMenuHover();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const resourcesData: ResourcesMenuData = {
    ...resources,
    featuredPlaybook:
      resources?.featuredPlaybook ??
      (TOP_PLAYBOOK
        ? {
            slug: TOP_PLAYBOOK.slug,
            title: TOP_PLAYBOOK.displayTitle,
            category: TOP_PLAYBOOK.category,
          }
        : null),
  };

  // One ref per trigger so MegaMenu can return focus to the correct
  // button on close without accessing a ref's `.current` during render.
  const servicesRef = useRef<HTMLButtonElement>(null);
  const platformsRef = useRef<HTMLButtonElement>(null);
  const industriesRef = useRef<HTMLButtonElement>(null);
  const resourcesRef = useRef<HTMLButtonElement>(null);
  const companyRef = useRef<HTMLButtonElement>(null);
  const triggerRefs: Record<MenuId, React.RefObject<HTMLButtonElement | null>> = {
    services: servicesRef,
    platforms: platformsRef,
    industries: industriesRef,
    resources: resourcesRef,
    company: companyRef,
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const active = menu.openId as MenuId | null;
  const activeTrigger = active ? TRIGGERS.find((t) => t.id === active) : null;

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: scrolled ? '14px 44px' : '20px 44px',
          background: scrolled
            ? 'rgba(5, 11, 31, 0.82)'
            : active
              ? 'rgba(5, 11, 31, 0.6)'
              : 'transparent',
          backdropFilter: scrolled || active ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled || active ? 'blur(12px)' : 'none',
          borderBottom:
            scrolled || active
              ? '1px solid var(--v2-border-subtle)'
              : '1px solid transparent',
          transition: 'all 300ms var(--v2-ease)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          aria-label="ACI Infotech home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'var(--v2-text-primary)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/aci-infotech-logo-white.png"
            alt="ACI Infotech"
            style={{ height: 32, width: 'auto', display: 'block' }}
          />
        </Link>

        <div
          className="v2-nav-cluster"
          style={{ display: 'flex', alignItems: 'center', gap: 24 }}
        >
          <style>{`
            @media (max-width: 820px) {
              .v2-nav-desktop { display: none !important; }
            }
            @media (min-width: 821px) {
              .v2-nav-mobile { display: none !important; }
            }
            .v2-nav-trigger {
              background: transparent;
              border: none;
              cursor: pointer;
              font-family: var(--font-mono);
              font-size: 12px;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--v2-text-secondary);
              padding: 8px 4px;
              display: inline-flex;
              align-items: center;
              gap: 4px;
              transition: color 200ms var(--v2-ease);
              position: relative;
            }
            .v2-nav-trigger:hover,
            .v2-nav-trigger[aria-expanded="true"] {
              color: var(--v2-accent);
            }
            .v2-nav-trigger[aria-expanded="true"]::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 4px;
              right: 4px;
              height: 2px;
              background: var(--v2-accent);
            }
            .v2-nav-trigger .chev {
              transition: transform 200ms var(--v2-ease);
            }
            .v2-nav-trigger[aria-expanded="true"] .chev {
              transform: rotate(180deg);
            }
          `}</style>

          <div
            className="v2-nav-desktop"
            style={{ display: 'flex', alignItems: 'center', gap: 20 }}
          >
            {TRIGGERS.map((t) => (
              <button
                key={t.id}
                ref={triggerRefs[t.id]}
                type="button"
                className="v2-nav-trigger"
                aria-expanded={menu.isOpen(t.id)}
                aria-haspopup="dialog"
                aria-controls={`v2-menu-${t.id}`}
                onMouseEnter={() => menu.requestOpen(t.id)}
                onMouseLeave={() => menu.requestClose()}
                onFocus={() => menu.requestOpen(t.id)}
                onClick={() => {
                  // Click toggles: open if closed, close if already open.
                  if (menu.isOpen(t.id)) {
                    menu.close();
                  } else {
                    menu.requestOpen(t.id);
                  }
                }}
              >
                {t.label}
                <ChevronDown size={12} className="chev" />
              </button>
            ))}
          </div>

          <Link
            href="/contact?source=v2-nav"
            className="v2-nav-desktop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 16px',
              background: 'var(--v2-accent)',
              color: 'var(--v2-text-inverted)',
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              borderRadius: 2,
              textDecoration: 'none',
              transition: 'background 200ms var(--v2-ease)',
            }}
          >
            Get in Touch
            <ArrowRight size={14} />
          </Link>

          <button
            type="button"
            className="v2-nav-mobile"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            style={{
              display: 'none',
              width: 40,
              height: 40,
              borderRadius: 2,
              border: '1px solid var(--v2-border-strong)',
              background: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--v2-text-primary)',
              cursor: 'pointer',
            }}
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* Desktop mega menus — a single shared shell. Rendering five
          separate MegaMenu instances meant two scrims and two panels
          overlapped in the DOM during a swap, which read as a brief
          flicker and caused the about-to-exit panel's pointer events
          to compete with the about-to-enter panel. One shell with
          keyed content gives a clean crossfade and keeps per-menu
          local state (e.g. IndustriesMenu's hovered row) from being
          reset by remounts. */}
      <MegaMenu
        open={active !== null}
        onClose={menu.close}
        onPointerEnter={menu.cancelClose}
        onPointerLeave={menu.requestClose}
        triggerRef={active ? triggerRefs[active] : undefined}
        maxWidth={activeTrigger?.maxWidth ?? 1080}
        align={activeTrigger?.align ?? 'left'}
        ariaLabel={activeTrigger?.ariaLabel ?? 'Menu'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {active && (
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            >
              {active === 'services' && <ServicesMenu />}
              {active === 'platforms' && <PlatformsMenu />}
              {active === 'industries' && <IndustriesMenu />}
              {active === 'resources' && <ResourcesMenu data={resourcesData} />}
              {active === 'company' && <CompanyMenu data={company ?? {}} />}
            </motion.div>
          )}
        </AnimatePresence>
      </MegaMenu>

      {/* Mobile takeover */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
