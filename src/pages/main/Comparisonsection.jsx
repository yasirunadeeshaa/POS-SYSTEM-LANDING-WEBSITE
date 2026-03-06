import { useEffect, useRef, useState } from "react";

const competitors = [
  {
    name: "SwiftPOS",
    tag: "Our System",
    highlight: true,
    color: "#667eea",
    colorBg: "rgba(102,126,234,0.12)",
    price: "Free / Open",
    badge: "Best Value",
  },
  {
    name: "Square POS",
    tag: "Competitor",
    highlight: false,
    color: "#475569",
    colorBg: "rgba(71,85,105,0.08)",
    price: "$60/mo",
    badge: null,
  },
  {
    name: "Lightspeed",
    tag: "Competitor",
    highlight: false,
    color: "#475569",
    colorBg: "rgba(71,85,105,0.08)",
    price: "$119/mo",
    badge: null,
  },
  {
    name: "Toast POS",
    tag: "Competitor",
    highlight: false,
    color: "#475569",
    colorBg: "rgba(71,85,105,0.08)",
    price: "$110/mo",
    badge: null,
  },
];

// null = partial/limited, true = full, false = no, string = custom label
const features = [
  {
    category: "Core",
    rows: [
      { label: "Sales & Checkout",        icon: "↗", vals: [true, true, true, true] },
      { label: "Inventory Management",    icon: "◈", vals: [true, true, true, true] },
      { label: "Customer Management",     icon: "◈", vals: [true, true, null, true] },
      { label: "Staff Roles & Permissions",icon: "◈", vals: [true, null, true, true] },
    ],
  },
  {
    category: "Analytics",
    rows: [
      { label: "Real-time Dashboard",     icon: "▲", vals: [true, true, true, true] },
      { label: "AI-powered Forecasting",  icon: "✦", vals: [true, false, null, false] },
      { label: "Custom Report Export",    icon: "◈", vals: [true, null, true, null] },
      { label: "Multi-location Reports",  icon: "◈", vals: [true, true, true, true] },
    ],
  },
  {
    category: "Operations",
    rows: [
      { label: "Kitchen Display System",  icon: "◈", vals: [true, false, false, true] },
      { label: "Barcode Scanner Support", icon: "◈", vals: [true, true, true, true] },
      { label: "Offline Mode",            icon: "◈", vals: [true, true, null, null] },
      { label: "Multi-location Sync",     icon: "◈", vals: [true, true, true, true] },
    ],
  },
  {
    category: "Integrations & Support",
    rows: [
      { label: "Stripe Integration",      icon: "◈", vals: [true, true, true, true] },
      { label: "Accounting (Xero/QB)",    icon: "◈", vals: [true, null, true, null] },
      { label: "Open API Access",         icon: "◈", vals: [true, true, true, false] },
      { label: "24/7 Support",            icon: "◈", vals: [true, null, true, true] },
      { label: "Free Onboarding",         icon: "◈", vals: [true, false, false, false] },
    ],
  },
];

function CellIcon({ val, highlight }) {
  if (val === true) {
    return (
      <div className={`cell-icon cell-yes ${highlight ? "cell-yes-hl" : ""}`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (val === false) {
    return (
      <div className="cell-icon cell-no">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    );
  }
  // null = partial
  return (
    <div className="cell-icon cell-partial">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </div>
  );
}

export default function ComparisonSection() {
  const [visible, setVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Count wins for SwiftPOS
  const totalRows = features.reduce((acc, cat) => acc + cat.rows.length, 0);
  const wins = features.reduce((acc, cat) =>
    acc + cat.rows.filter(r => r.vals[0] === true && r.vals.slice(1).some(v => v !== true)).length, 0
  );

  return (
    <>
      <section className="cmp-section" ref={sectionRef}>
        <div className="cmp-orb cmp-orb-a" />
        <div className="cmp-orb cmp-orb-b" />
        <div className="cmp-grid-bg" />

        <div className="cmp-container">

          {/* ── Header ── */}
          <div className={`cmp-header ${visible ? "cmp-in" : ""}`}>
            <div className="cmp-badge-row">
              <span className="badge badge-primary">
                <span className="badge-dot pulse" />
                Side-by-side comparison
              </span>
              <span className="badge badge-green">
                ✦ {wins} exclusive features
              </span>
            </div>
            <h2 className="cmp-headline">
              See why SwiftPOS{" "}
              <span className="gradient-text">stands apart</span>
            </h2>
            <p className="cmp-sub">
              A transparent look at how SwiftPOS compares to the most popular POS solutions on the market — feature by feature.
            </p>
            <div className="cmp-divider">
              <div className="divider-line" />
              <span className="divider-diamond">◈</span>
              <div className="divider-line" />
            </div>
          </div>

          {/* ── Score cards ── */}
          <div className={`cmp-scorecards ${visible ? "cmp-in" : ""}`} style={{ transitionDelay: "0.12s" }}>
            {[
              { label: "Features covered", val: `${totalRows}/${totalRows}`, color: "#86efac", icon: "✓" },
              { label: "Exclusive advantages", val: `${wins} features`, color: "#667eea", icon: "✦" },
              { label: "Monthly cost", val: "Free / Open", color: "#fcd34d", icon: "◈" },
              { label: "Competitor avg. cost", val: "$96/mo", color: "#fb7185", icon: "↑" },
            ].map((s, i) => (
              <div className="cmp-scorecard" key={i}>
                <div className="cmp-scorecard-icon" style={{ color: s.color }}>{s.icon}</div>
                <div className="cmp-scorecard-val" style={{ color: s.color }}>{s.val}</div>
                <div className="cmp-scorecard-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Legend ── */}
          <div className={`cmp-legend ${visible ? "cmp-in" : ""}`} style={{ transitionDelay: "0.2s" }}>
            <div className="cmp-legend-item">
              <div className="cell-icon cell-yes cell-yes-hl" style={{ width: 22, height: 22 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>Full support</span>
            </div>
            <div className="cmp-legend-item">
              <div className="cell-icon cell-partial" style={{ width: 22, height: 22 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span>Limited / add-on</span>
            </div>
            <div className="cmp-legend-item">
              <div className="cell-icon cell-no" style={{ width: 22, height: 22 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <span>Not available</span>
            </div>
          </div>

          {/* ── Table ── */}
          <div className={`cmp-table-wrap ${visible ? "cmp-in" : ""}`} style={{ transitionDelay: "0.28s" }}>
            <div className="cmp-table">

              {/* ── Column headers ── */}
              <div className="cmp-thead">
                {/* Feature label column */}
                <div className="cmp-th cmp-th-label">Feature</div>

                {/* Competitor columns */}
                {competitors.map((c, ci) => (
                  <div
                    key={ci}
                    className={`cmp-th ${c.highlight ? "cmp-th-highlight" : ""}`}
                    style={c.highlight ? { borderColor: `${c.color}40` } : {}}
                  >
                    {c.highlight && (
                      <div className="cmp-th-glow" style={{ background: `radial-gradient(circle at 50% 100%, ${c.color}20, transparent 70%)` }} />
                    )}
                    <div className="cmp-th-inner">
                      {c.badge && (
                        <span className="cmp-best-badge">
                          ✦ {c.badge}
                        </span>
                      )}
                      <div
                        className="cmp-th-logo"
                        style={{ background: c.colorBg, border: `1px solid ${c.color}40`, color: c.color }}
                      >
                        {c.name[0]}
                      </div>
                      <div className="cmp-th-name" style={{ color: c.highlight ? "#fff" : "var(--text-3)" }}>
                        {c.name}
                      </div>
                      <div
                        className="cmp-th-tag"
                        style={{ background: c.colorBg, color: c.color, border: `1px solid ${c.color}30` }}
                      >
                        {c.tag}
                      </div>
                      <div
                        className="cmp-th-price"
                        style={{ color: c.highlight ? "#86efac" : "var(--text-4)" }}
                      >
                        {c.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Category groups + rows ── */}
              {features.map((cat, catIdx) => (
                <div key={catIdx} className="cmp-category-block">
                  {/* Category label */}
                  <div className="cmp-category-row">
                    <div className="cmp-category-label">
                      <span className="cmp-category-diamond">◈</span>
                      {cat.category}
                    </div>
                    {competitors.map((_, ci) => (
                      <div
                        key={ci}
                        className={`cmp-category-spacer ${ci === 0 ? "cmp-category-spacer-hl" : ""}`}
                      />
                    ))}
                  </div>

                  {/* Feature rows */}
                  {cat.rows.map((row, rowIdx) => {
                    const globalIdx = `${catIdx}-${rowIdx}`;
                    const isHovered = hoveredRow === globalIdx;
                    return (
                      <div
                        key={rowIdx}
                        className={`cmp-row ${isHovered ? "cmp-row-hovered" : ""}`}
                        onMouseEnter={() => setHoveredRow(globalIdx)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{ animationDelay: `${(catIdx * 5 + rowIdx) * 0.04}s` }}
                      >
                        {/* Feature label */}
                        <div className="cmp-row-label">
                          <span className="cmp-row-icon">{row.icon}</span>
                          <span>{row.label}</span>
                        </div>

                        {/* Cells */}
                        {row.vals.map((val, ci) => (
                          <div
                            key={ci}
                            className={`cmp-cell ${ci === 0 ? "cmp-cell-highlight" : ""}`}
                            style={ci === 0 ? { borderColor: "rgba(102,126,234,0.15)" } : {}}
                          >
                            <CellIcon val={val} highlight={ci === 0} />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* ── Price footer row ── */}
              <div className="cmp-footer-row">
                <div className="cmp-row-label" style={{ fontWeight: 800, color: "var(--text)" }}>
                  <span className="cmp-row-icon">$</span>
                  Monthly Pricing
                </div>
                {competitors.map((c, ci) => (
                  <div
                    key={ci}
                    className={`cmp-cell cmp-price-cell ${ci === 0 ? "cmp-cell-highlight" : ""}`}
                    style={ci === 0 ? { borderColor: "rgba(102,126,234,0.15)" } : {}}
                  >
                    <span
                      className="cmp-price-val"
                      style={{ color: ci === 0 ? "#86efac" : "var(--text-3)" }}
                    >
                      {c.price}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div className={`cmp-cta ${visible ? "cmp-in" : ""}`} style={{ transitionDelay: "0.4s" }}>
            <div className="cmp-cta-inner">
              <div className="cmp-cta-left">
                <span className="cmp-cta-eyebrow">◈ The verdict</span>
                <span className="cmp-cta-text">
                  SwiftPOS delivers <strong style={{ color: "#a5b4fc" }}>more features</strong>, at <strong style={{ color: "#86efac" }}>zero monthly cost</strong>.
                </span>
              </div>
              <div className="cmp-cta-right">
                <button className="btn-p">
                  Get Started Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="btn-s">
                  <span className="play-ring">
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M3 2l7 4-7 4V2z" />
                    </svg>
                  </span>
                  Book a Demo
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-start:   #0f0f23;
          --bg-mid:     #1a1a2e;
          --bg-end:     #16213e;
          --card-bg:    rgba(17, 24, 39, 0.85);
          --card-bg2:   rgba(30, 41, 59, 0.8);
          --border:     rgba(255,255,255,0.1);
          --text:       #ffffff;
          --text-2:     #cbd5e1;
          --text-3:     #94a3b8;
          --text-4:     #475569;
          --accent:     #667eea;
          --accent-2:   #764ba2;
          --accent-3:   #f093fb;
          --accent-lit: #a5b4fc;
          --green:      #86efac;
          --green-bg:   rgba(72,187,120,0.2);
          --green-bdr:  rgba(72,187,120,0.3);
          --amber:      #fcd34d;
          --amber-bg:   rgba(251,191,36,0.2);
          --amber-bdr:  rgba(251,191,36,0.3);
        }

        html, body, #root {
          background: var(--bg-start);
          color: var(--text);
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── SECTION ── */
        .cmp-section {
          width: 100%;
          background: linear-gradient(180deg, var(--bg-end) 0%, var(--bg-start) 60%, var(--bg-mid) 100%);
          padding: 110px 0 120px;
          position: relative;
          overflow: hidden;
        }
        .cmp-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .cmp-orb-a {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(102,126,234,0.09) 0%, transparent 70%);
          top: -150px; right: -200px;
        }
        .cmp-orb-b {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(118,75,162,0.09) 0%, transparent 70%);
          bottom: 0; left: -150px;
        }
        .cmp-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(102,126,234,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102,126,234,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none; z-index: 0;
        }
        .cmp-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 60px;
          position: relative;
          z-index: 5;
        }

        /* ── Scroll reveal ── */
        .cmp-header, .cmp-scorecards, .cmp-legend, .cmp-table-wrap, .cmp-cta {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .cmp-in { opacity: 1 !important; transform: translateY(0) !important; }

        /* ── HEADER ── */
        .cmp-header {
          text-align: center;
          max-width: 620px;
          margin: 0 auto 52px;
        }
        .cmp-badge-row {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; flex-wrap: wrap; margin-bottom: 22px;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-radius: 50px;
          font-size: 13px; font-weight: 600; backdrop-filter: blur(10px);
        }
        .badge-primary {
          background: linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2));
          border: 1px solid rgba(102,126,234,0.35);
          color: var(--accent-lit);
        }
        .badge-green {
          background: var(--green-bg);
          border: 1px solid var(--green-bdr);
          color: var(--green);
        }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent-lit);
        }
        .badge-dot.pulse { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        .cmp-headline {
          font-size: clamp(32px, 4vw, 50px);
          font-weight: 900; line-height: 1.1;
          letter-spacing: -1.5px; color: var(--text); margin-bottom: 16px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; background-size: 200% 200%;
          animation: gradientShift 5s ease infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .cmp-sub {
          font-size: 16px; color: var(--text-2);
          line-height: 1.8; font-weight: 400;
        }
        .cmp-divider {
          display: flex; align-items: center; gap: 16px;
          max-width: 260px; margin: 28px auto 0;
        }
        .divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(102,126,234,0.4), transparent);
        }
        .divider-diamond { font-size: 14px; color: var(--accent-lit); opacity: 0.7; }

        /* ── SCORE CARDS ── */
        .cmp-scorecards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .cmp-scorecard {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px 22px;
          backdrop-filter: blur(16px);
          display: flex; flex-direction: column; gap: 4px;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .cmp-scorecard:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.35);
        }
        .cmp-scorecard-icon {
          font-size: 16px; margin-bottom: 4px;
        }
        .cmp-scorecard-val {
          font-size: 22px; font-weight: 900;
          font-family: monospace; letter-spacing: -0.5px;
        }
        .cmp-scorecard-label {
          font-size: 11px; color: var(--text-3);
          text-transform: uppercase; letter-spacing: 0.8px;
          font-weight: 600;
        }

        /* ── LEGEND ── */
        .cmp-legend {
          display: flex; align-items: center; gap: 24px;
          margin-bottom: 24px;
          padding: 14px 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: 12px;
          width: fit-content;
        }
        .cmp-legend-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: var(--text-3);
          font-weight: 500;
        }

        /* ── TABLE WRAPPER ── */
        .cmp-table-wrap {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(102,126,234,0.06),
            0 30px 70px rgba(0,0,0,0.45);
          margin-bottom: 28px;
        }

        /* ── TABLE ── */
        .cmp-table {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        /* ── THEAD ── */
        .cmp-thead {
          display: grid;
          grid-template-columns: 1fr repeat(4, 160px);
          border-bottom: 1px solid var(--border);
          background: rgba(30,41,59,0.6);
        }
        .cmp-th {
          padding: 24px 16px 20px;
          position: relative;
          overflow: hidden;
          border-left: 1px solid var(--border);
        }
        .cmp-th:first-child { border-left: none; }
        .cmp-th-label {
          display: flex; align-items: center;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.5px;
          color: var(--text-4); font-family: monospace;
          padding-left: 20px;
        }
        .cmp-th-highlight {
          background: linear-gradient(180deg, rgba(102,126,234,0.08), rgba(102,126,234,0.04));
          border-left: 1px solid rgba(102,126,234,0.25) !important;
          border-right: 1px solid rgba(102,126,234,0.25);
        }
        .cmp-th-glow {
          position: absolute; inset: 0; pointer-events: none;
        }
        .cmp-th-inner {
          display: flex; flex-direction: column;
          align-items: center; gap: 8px; position: relative; z-index: 1;
        }
        .cmp-best-badge {
          font-size: 9px; font-weight: 800;
          font-family: monospace; text-transform: uppercase;
          letter-spacing: 1px; padding: 4px 10px;
          border-radius: 100px;
          background: linear-gradient(135deg, rgba(102,126,234,0.25), rgba(118,75,162,0.2));
          border: 1px solid rgba(102,126,234,0.4);
          color: var(--accent-lit);
          animation: badgePulse 3s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(102,126,234,0); }
          50%       { box-shadow: 0 0 12px 2px rgba(102,126,234,0.25); }
        }
        .cmp-th-logo {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 900;
          font-family: monospace;
        }
        .cmp-th-name {
          font-size: 14px; font-weight: 800; text-align: center;
        }
        .cmp-th-tag {
          font-size: 9px; font-weight: 700;
          font-family: monospace; text-transform: uppercase;
          letter-spacing: 1px; padding: 3px 10px; border-radius: 100px;
        }
        .cmp-th-price {
          font-size: 12px; font-weight: 700;
          font-family: monospace;
        }

        /* ── CATEGORY ── */
        .cmp-category-block { display: flex; flex-direction: column; }
        .cmp-category-row {
          display: grid;
          grid-template-columns: 1fr repeat(4, 160px);
          background: rgba(102,126,234,0.04);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cmp-category-label {
          padding: 10px 20px;
          font-size: 10px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 2px;
          color: var(--accent-lit);
          font-family: monospace;
          display: flex; align-items: center; gap: 8px;
        }
        .cmp-category-diamond { font-size: 12px; opacity: 0.7; }
        .cmp-category-spacer {
          border-left: 1px solid rgba(255,255,255,0.06);
        }
        .cmp-category-spacer-hl {
          border-left: 1px solid rgba(102,126,234,0.15);
          background: rgba(102,126,234,0.03);
        }

        /* ── ROWS ── */
        .cmp-row {
          display: grid;
          grid-template-columns: 1fr repeat(4, 160px);
          border-top: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
          animation: rowIn 0.5s ease both;
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .cmp-row-hovered { background: rgba(255,255,255,0.02); }
        .cmp-row-label {
          padding: 14px 20px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13.5px; font-weight: 500; color: var(--text-2);
          transition: color 0.2s;
        }
        .cmp-row-hovered .cmp-row-label { color: var(--text); }
        .cmp-row-icon {
          font-size: 12px; color: var(--text-4);
          width: 16px; text-align: center; flex-shrink: 0;
        }

        /* ── CELLS ── */
        .cmp-cell {
          display: flex; align-items: center; justify-content: center;
          padding: 14px 16px;
          border-left: 1px solid rgba(255,255,255,0.06);
        }
        .cmp-cell-highlight {
          background: rgba(102,126,234,0.04);
          border-left: 1px solid rgba(102,126,234,0.15) !important;
          border-right: 1px solid rgba(102,126,234,0.15);
        }

        /* Cell icons */
        .cell-icon {
          width: 26px; height: 26px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cell-yes {
          background: rgba(134,239,172,0.1);
          border: 1px solid rgba(134,239,172,0.25);
          color: #86efac;
        }
        .cell-yes-hl {
          background: rgba(102,126,234,0.15);
          border: 1px solid rgba(102,126,234,0.4);
          color: var(--accent-lit);
          box-shadow: 0 0 10px rgba(102,126,234,0.2);
        }
        .cell-no {
          background: rgba(251,113,133,0.08);
          border: 1px solid rgba(251,113,133,0.2);
          color: #fb7185;
        }
        .cell-partial {
          background: rgba(252,211,77,0.08);
          border: 1px solid rgba(252,211,77,0.2);
          color: #fcd34d;
        }

        /* ── PRICE FOOTER ── */
        .cmp-footer-row {
          display: grid;
          grid-template-columns: 1fr repeat(4, 160px);
          border-top: 1px solid rgba(102,126,234,0.2);
          background: rgba(102,126,234,0.04);
        }
        .cmp-price-cell { border-left: 1px solid rgba(255,255,255,0.06); }
        .cmp-price-val {
          font-size: 13px; font-weight: 800;
          font-family: monospace;
        }

        /* ── BOTTOM CTA ── */
        .cmp-cta { }
        .cmp-cta-inner {
          display: flex; align-items: center;
          justify-content: space-between;
          background: rgba(17,24,39,0.7);
          border: 1px solid rgba(102,126,234,0.2);
          border-radius: 20px; padding: 28px 36px;
          backdrop-filter: blur(20px); gap: 24px; flex-wrap: wrap;
          box-shadow: 0 0 60px rgba(102,126,234,0.06);
        }
        .cmp-cta-left {
          display: flex; flex-direction: column; gap: 4px;
        }
        .cmp-cta-eyebrow {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 2px; color: var(--accent-lit);
          font-weight: 700; font-family: monospace;
        }
        .cmp-cta-text {
          font-size: 16px; font-weight: 600; color: var(--text-2);
        }
        .cmp-cta-right {
          display: flex; gap: 14px; align-items: center; flex-wrap: wrap;
        }

        /* ── BUTTONS ── */
        .btn-p {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff; border: none; padding: 14px 28px;
          border-radius: 50px; font-weight: 700; font-size: 14px;
          cursor: pointer; display: flex; align-items: center; gap: 10px;
          transition: transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 8px 32px rgba(102,126,234,0.4);
          font-family: inherit;
        }
        .btn-p:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 48px rgba(102,126,234,0.55);
        }
        .btn-p svg { transition: transform 0.2s; }
        .btn-p:hover svg { transform: translateX(4px); }
        .btn-s {
          background: rgba(255,255,255,0.08);
          color: var(--text-2);
          border: 2px solid rgba(255,255,255,0.15);
          padding: 14px 24px; border-radius: 50px;
          font-weight: 600; font-size: 14px; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.25s; backdrop-filter: blur(10px);
          font-family: inherit;
        }
        .btn-s:hover {
          color: var(--text); border-color: rgba(102,126,234,0.4);
          background: rgba(102,126,234,0.1); transform: translateY(-2px);
        }
        .play-ring {
          width: 20px; height: 20px; border-radius: 50%;
          border: 1.5px solid currentColor;
          display: flex; align-items: center; justify-content: center;
        }
        .play-ring svg { margin-left: 1px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .cmp-container { padding: 0 36px; }
          .cmp-thead { grid-template-columns: 1fr repeat(4, 130px); }
          .cmp-row, .cmp-category-row, .cmp-footer-row {
            grid-template-columns: 1fr repeat(4, 130px);
          }
          .cmp-cell, .cmp-th { padding: 14px 10px; }
          .cmp-scorecards { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .cmp-section { padding: 72px 0 80px; }
          .cmp-container { padding: 0 20px; }
          .cmp-table-wrap { overflow-x: auto; }
          .cmp-table { min-width: 700px; }
          .cmp-scorecards { grid-template-columns: repeat(2, 1fr); }
          .cmp-cta-inner { flex-direction: column; align-items: flex-start; }
          .cmp-legend { flex-wrap: wrap; gap: 14px; }
        }
        @media (max-width: 480px) {
          .cmp-scorecards { grid-template-columns: 1fr 1fr; }
          .cmp-headline { font-size: 28px; }
        }
      `}</style>
    </>
  );
}