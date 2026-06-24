'use client';

import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import s from './v3.module.css';
import { navItems, hero, type NavItem } from './v3-data';

const V3_BASE = '/preview/v3';

// All inner links point at the live marketing routes. The preview nav
// is for judging the design; the destinations are the real pages.
function MegaPanel({ item }: { item: NavItem }) {
  if (!item.columns) return null;
  return (
    <motion.div
      className={s.megaWrap}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={s.mega}>
        {item.columns.map((col) => (
          <div key={col.heading} className={s.megaCol}>
            <p className={s.megaHeading}>{col.heading}</p>
            {col.links.map((l) => (
              <Link key={l.href} href={l.href} className={s.megaLink}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
        {item.feature && (
          <Link href={item.feature.href} className={s.megaFeature}>
            <div>
              <span className={s.megaFeatureKicker}>{item.feature.kicker}</span>
              <h3 className={s.megaFeatureTitle}>{item.feature.title}</h3>
              <p className={s.megaFeatureBody}>{item.feature.body}</p>
            </div>
            <span className={s.megaFeatureLink}>Explore →</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function V3Nav() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openItem = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  }, []);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  }, []);

  const activeItem = navItems.find((i) => i.label === open);

  return (
    <>
      <header className={s.nav}>
        <div className={s.navInner}>
          <Link href={V3_BASE} className={s.brand} aria-label="ACI Infotech home">
            <span className={s.brandMark}>ACI</span>
            <span className={s.brandPlus}>D+AI</span>
          </Link>

          <nav aria-label="Primary">
            <ul className={s.navList}>
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className={s.navItem}
                  onMouseEnter={() => item.columns && openItem(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href}
                    className={`${s.navLink} ${open === item.label ? s.navLinkOpen : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={s.navRight}>
            <Link href={hero.primaryCta.href} className={`${s.btn} ${s.navCta}`}>
              {hero.primaryCta.label}
            </Link>
            <button
              className={s.burger}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeItem && activeItem.columns && (
            <div
              key={activeItem.label}
              onMouseEnter={() => openItem(activeItem.label)}
              onMouseLeave={scheduleClose}
            >
              <MegaPanel item={activeItem} />
            </div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={s.mobilePanel}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={s.mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={hero.primaryCta.href}
              className={`${s.btn}`}
              style={{ marginTop: '1.5rem' }}
              onClick={() => setMobileOpen(false)}
            >
              {hero.primaryCta.label}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
