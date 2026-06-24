'use client';

import Link from 'next/link';
import s from './v3.module.css';
import { footerBoilerplate, navItems } from './v3-data';

const today = '2026';

export default function V3Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.footerTop}>
          <div>
            <p className={s.footerWordmark}>
              Data + AI.
              <br />
              Delivered.
            </p>
            <p className={s.footerBoiler}>{footerBoilerplate}</p>
          </div>
          <div className={s.footerCols}>
            {navItems.slice(0, 2).map((item) => (
              <div key={item.label}>
                <p className={s.footerColHead}>{item.label}</p>
                {(item.columns?.flatMap((c) => c.links) ?? [])
                  .slice(0, 5)
                  .map((l) => (
                    <Link key={l.href} href={l.href} className={s.footerLink}>
                      {l.label}
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>© {today} ACI Infotech. Built, shipped, run in production.</span>
          <span>250+ systems · $1B+ delivered · 20 years</span>
        </div>
      </div>
    </footer>
  );
}
