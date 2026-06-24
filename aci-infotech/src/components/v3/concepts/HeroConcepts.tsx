import s from './concepts.module.css';

/**
 * Three distinct above-the-fold design languages for the v3 homepage,
 * stacked for side-by-side comparison. Same copy across all three so the
 * comparison is about design language, not words. Preview-only.
 */

const NAV = ['Services', 'Industries', 'Platforms', 'Work', 'Company'];

function Badge({ label }: { label: string }) {
  return <div className={s.badge}>{label}</div>;
}

/* ---------- Concept A — Swiss / spec-sheet editorial ---------------- */
function ConceptA() {
  return (
    <section className={`${s.screen} ${s.aRoot}`}>
      <Badge label="A · Editorial / spec-sheet" />
      <div className={s.aGrid} aria-hidden />
      <header className={s.aNav}>
        <span className={s.aBrand}>ACI / Data + AI</span>
        <nav className={s.aNavLinks}>
          {NAV.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </nav>
        <span className={s.aNavMeta}>EST. 2004 — FORTUNE 500</span>
      </header>

      <div className={s.aMain}>
        <div className={s.aColLeft}>
          <p className={s.aIndex}>
            <span>01</span> / DATA &amp; AI, IN PRODUCTION
          </p>
          <h1 className={s.aTitle}>
            Data and AI,
            <br />
            engineered
            <br />
            to <span className={s.aMark}>ship.</span>
          </h1>
        </div>
        <div className={s.aColRight}>
          <p className={s.aLead}>
            We engineer the data foundation, build the AI on top, and run it in
            production. Twenty years of it, for Fortune 500 operators.
          </p>
          <div className={s.aActions}>
            <a className={s.aBtn} href="#">
              Start a build →
            </a>
            <a className={s.aBtnText} href="#">
              See the work
            </a>
          </div>
        </div>
      </div>

      <div className={s.aStats}>
        {[
          ['250+', 'systems in production'],
          ['$1B+', 'value delivered'],
          ['95%', 'client retention'],
          ['20yrs', 'in the field'],
        ].map(([n, l]) => (
          <div className={s.aStat} key={l}>
            <span className={s.aStatN}>{n}</span>
            <span className={s.aStatL}>{l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Concept B — Black canvas / premium AI ------------------- */
function ConceptB() {
  return (
    <section className={`${s.screen} ${s.bRoot}`}>
      <Badge label="B · Black canvas / premium" />
      <div className={s.bGlow} aria-hidden />
      <div className={s.bGrid} aria-hidden />
      <header className={s.bNav}>
        <span className={s.bBrand}>
          ACI <span className={s.bBrandPlus}>Data+AI</span>
        </span>
        <nav className={s.bNavLinks}>
          {NAV.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </nav>
        <a className={s.bNavCta} href="#">
          Get in touch
        </a>
      </header>

      <div className={s.bMain}>
        <p className={s.bEyebrow}>● Data + AI · In production</p>
        <h1 className={s.bTitle}>
          Enterprise AI that
          <br />
          actually <span className={s.bMark}>makes it</span> to production.
        </h1>
        <p className={s.bLead}>
          We engineer the data foundation, build the AI on top, and run it in
          production. Not a pilot. Not a deck. The live system.
        </p>
        <div className={s.bActions}>
          <a className={s.bBtn} href="#">
            Start a build →
          </a>
          <a className={s.bBtnGhost} href="#">
            See the work
          </a>
        </div>
        <div className={s.bTrust}>
          <span>DATABRICKS</span>
          <span>AWS</span>
          <span>AZURE</span>
          <span>SAP</span>
          <span>SERVICENOW</span>
          <span>SALESFORCE</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Concept C — Color split / bold block ------------------- */
function ConceptC() {
  return (
    <section className={`${s.screen} ${s.cRoot}`}>
      <Badge label="C · Color split / bold block" />
      <div className={s.cLeft}>
        <header className={s.cNav}>
          <span className={s.cBrand}>ACI / Data + AI</span>
        </header>
        <div className={s.cLeftMain}>
          <p className={s.cEyebrow}>Data + AI, in production</p>
          <h1 className={s.cTitle}>
            We build the data.
            <br />
            We build the AI.
            <br />
            We <span className={s.cMark}>run it.</span>
          </h1>
          <div className={s.cActions}>
            <a className={s.cBtn} href="#">
              Start a build →
            </a>
            <a className={s.cBtnGhost} href="#">
              See the work
            </a>
          </div>
        </div>
      </div>
      <div className={s.cRight}>
        <nav className={s.cRightNav}>
          {NAV.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </nav>
        <div className={s.cRightBody}>
          <p className={s.cRightLead}>
            We engineer the data foundation, build the AI on top, and run it in
            production. Twenty years of it, for Fortune 500 operators.
          </p>
          <div className={s.cStats}>
            {[
              ['250+', 'systems in production'],
              ['$1B+', 'value delivered'],
              ['95%', 'client retention'],
            ].map(([n, l]) => (
              <div className={s.cStat} key={l}>
                <span className={s.cStatN}>{n}</span>
                <span className={s.cStatL}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeroConcepts() {
  return (
    <main className={s.wrap}>
      <ConceptA />
      <ConceptB />
      <ConceptC />
    </main>
  );
}
