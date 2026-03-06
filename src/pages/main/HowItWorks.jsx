import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    tag: "Setup",
    title: "Install & Configure",
    desc: "Download the SwiftPOS app on any tablet or desktop. Connect your hardware — receipt printer, barcode scanner, cash drawer — in minutes with plug-and-play setup.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
    color: "#667eea",
    colorBg: "rgba(102,126,234,0.12)",
    details: ["Plug & play hardware", "5-minute onboarding", "Cloud sync enabled", "No IT team needed"],
    visual: <SetupVisual />,
  },
  {
    number: "02",
    tag: "Manage",
    title: "Add Products & Staff",
    desc: "Import your product catalog via CSV or scan barcodes to build your inventory. Create staff accounts, assign roles, and configure permissions — all from one dashboard.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "#a5b4fc",
    colorBg: "rgba(165,180,252,0.12)",
    details: ["CSV bulk import", "Barcode scanning", "Role-based access", "Unlimited products"],
    visual: <ManageVisual />,
  },
  {
    number: "03",
    tag: "Sell",
    title: "Start Taking Orders",
    desc: "Ring up sales in under 0.3 seconds. Accept any payment method — card, cash, QR, contactless. Print receipts or send them digitally. Split bills with one tap.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="M2 10h20M6 15h4" />
      </svg>
    ),
    color: "#86efac",
    colorBg: "rgba(134,239,172,0.12)",
    details: ["0.3s checkout", "All payment types", "Digital receipts", "Split billing"],
    visual: <SellVisual />,
  },
  {
    number: "04",
    tag: "Grow",
    title: "Analyse & Scale",
    desc: "View real-time dashboards showing sales, top products, and staff performance. Export reports, trigger loyalty campaigns, and expand to new locations — all from one screen.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    color: "#fcd34d",
    colorBg: "rgba(252,211,77,0.12)",
    details: ["Live dashboards", "AI forecasting", "Loyalty engine", "Multi-location"],
    visual: <GrowVisual />,
  },
];

/* ── Step Visuals ── */
function SetupVisual() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProg(p => p >= 100 ? 0 : p + 2), 60);
    return () => clearInterval(t);
  }, []);
  const items = [
    { label: "Receipt Printer", done: prog > 25 },
    { label: "Barcode Scanner", done: prog > 55 },
    { label: "Cash Drawer", done: prog > 80 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ padding: "12px 14px", background: "rgba(102,126,234,0.06)", border: "1px solid rgba(102,126,234,0.2)", borderRadius: 12, marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px" }}>System setup</span>
          <span style={{ fontSize: 11, color: "#667eea", fontFamily: "monospace", fontWeight: 700 }}>{prog}%</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 99 }}>
          <div style={{ height: "100%", width: `${prog}%`, background: "linear-gradient(90deg, #667eea, #a5b4fc)", borderRadius: 99, transition: "width 0.1s linear" }} />
        </div>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${item.done ? "rgba(134,239,172,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10 }}>
          <span style={{ fontSize: 12, color: item.done ? "#fff" : "#94a3b8", fontWeight: item.done ? 600 : 400, transition: "color 0.3s" }}>{item.label}</span>
          <span style={{ fontSize: 12, color: item.done ? "#86efac" : "#475569", fontFamily: "monospace", transition: "color 0.3s" }}>{item.done ? "✓ Connected" : "Waiting..."}</span>
        </div>
      ))}
    </div>
  );
}

function ManageVisual() {
  const products = [
    { name: "Flat White", sku: "BEV-001", stock: 48, color: "#667eea" },
    { name: "Avocado Toast", sku: "FOOD-012", stock: 12, color: "#86efac" },
    { name: "Fresh OJ", sku: "BEV-007", stock: 6, color: "#fcd34d" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
        {["Admin", "Manager", "Cashier"].map((role, i) => (
          <span key={i} style={{ fontSize: 10, padding: "4px 11px", borderRadius: 100, background: i === 0 ? "rgba(102,126,234,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? "rgba(102,126,234,0.35)" : "rgba(255,255,255,0.08)"}`, color: i === 0 ? "#a5b4fc" : "#475569", fontFamily: "monospace", fontWeight: 700 }}>{role}</span>
        ))}
      </div>
      {products.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{p.sku}</div>
          </div>
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: `${p.color}18`, border: `1px solid ${p.color}30`, color: p.color, fontFamily: "monospace", fontWeight: 700 }}>{p.stock} units</span>
        </div>
      ))}
    </div>
  );
}

function SellVisual() {
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v = v >= 29.50 ? 0 : v + 0.5;
      setAmount(v);
    }, 60);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[{ name: "Flat White ×2", price: "$9.00" }, { name: "Avocado Toast ×1", price: "$14.50" }, { name: "Fresh OJ ×1", price: "$6.00" }].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
          <span style={{ fontSize: 12, color: "#cbd5e1" }}>{item.name}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#86efac", fontFamily: "monospace" }}>{item.price}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.1))", border: "1px solid rgba(102,126,234,0.3)", borderRadius: 12, marginTop: 4 }}>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>Total due</span>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "monospace", letterSpacing: "-1px" }}>${amount.toFixed(2)}</span>
      </div>
    </div>
  );
}

function GrowVisual() {
  const bars = [30, 52, 44, 68, 45, 72, 88, 62, 95, 80, 100, 74];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        {[{ l: "Revenue", v: "$4,820", c: "#fcd34d" }, { l: "Growth", v: "+18%", c: "#86efac" }, { l: "Customers", v: "1,240", c: "#a5b4fc" }].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 17, fontWeight: 800, color: s.c, fontFamily: "monospace" }}>{s.v}</div>
            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 44 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0", background: i === bars.length - 1 ? "#fcd34d" : "rgba(252,211,77,0.18)" }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {["AI Forecast ↑", "Export PDF", "Multi-branch"].map((t, i) => (
          <span key={i} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: "rgba(252,211,77,0.1)", border: "1px solid rgba(252,211,77,0.2)", color: "#fcd34d", fontFamily: "monospace", fontWeight: 700 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % steps.length);
    }, 3800);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleStepClick = (i) => {
    setActive(i);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % steps.length);
    }, 3800);
  };

  const step = steps[active];

  return (
    <>
      <section className="hiw-section" ref={sectionRef}>
        {/* Orbs */}
        <div className="hiw-orb hiw-orb-a" />
        <div className="hiw-orb hiw-orb-b" />
        <div className="hiw-grid-bg" />

        <div className="hiw-container">

          {/* ── Header ── */}
          <div className={`hiw-header ${visible ? "hiw-visible" : ""}`}>
            <div className="hiw-badge-row">
              <span className="badge badge-primary">
                <span className="badge-dot pulse" />
                Simple by design
              </span>
              <span className="badge badge-amber">◈ 4 Steps</span>
            </div>
            <h2 className="hiw-headline">
              Up and running in{" "}
              <span className="gradient-text">under an hour</span>
            </h2>
            <p className="hiw-sub">
              No technical expertise required. Follow four simple steps and your POS system is live, configured, and ready to take its first sale.
            </p>
            <div className="hiw-divider">
              <div className="divider-line" />
              <span className="divider-diamond">◈</span>
              <div className="divider-line" />
            </div>
          </div>

          {/* ── Step tabs ── */}
          <div className={`hiw-tabs ${visible ? "hiw-visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
            {steps.map((s, i) => (
              <button
                key={i}
                className={`hiw-tab ${active === i ? "hiw-tab-active" : ""}`}
                onClick={() => handleStepClick(i)}
                style={{
                  borderColor: active === i ? `${s.color}50` : undefined,
                  background: active === i ? `${s.color}0e` : undefined,
                }}
              >
                <div
                  className="hiw-tab-num"
                  style={{
                    background: active === i ? s.colorBg : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active === i ? s.color + "50" : "rgba(255,255,255,0.1)"}`,
                    color: active === i ? s.color : "var(--text-4)",
                    boxShadow: active === i ? `0 0 16px ${s.color}30` : "none",
                  }}
                >
                  {s.number}
                </div>
                <div className="hiw-tab-text">
                  <span className="hiw-tab-tag" style={{ color: active === i ? s.color : undefined }}>{s.tag}</span>
                  <span className="hiw-tab-title">{s.title}</span>
                </div>
                {/* Progress bar under active tab */}
                {active === i && (
                  <div className="hiw-tab-progress">
                    <div className="hiw-tab-progress-fill" style={{ background: s.color }} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* ── Main content panel ── */}
          <div className={`hiw-panel ${visible ? "hiw-visible" : ""}`} style={{ transitionDelay: "0.25s" }} key={active}>
            {/* Left: text */}
            <div className="hiw-panel-left">
              <div
                className="hiw-step-eyebrow"
                style={{ background: step.colorBg, border: `1px solid ${step.color}33`, color: step.color }}
              >
                <span
                  className="hiw-step-dot"
                  style={{ background: step.color }}
                />
                Step {step.number} — {step.tag}
              </div>

              <h3 className="hiw-panel-title">{step.title}</h3>
              <p className="hiw-panel-desc">{step.desc}</p>

              <div className="hiw-detail-list">
                {step.details.map((d, i) => (
                  <div
                    key={i}
                    className="hiw-detail-item"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div
                      className="hiw-detail-check"
                      style={{ background: step.colorBg, border: `1px solid ${step.color}40`, color: step.color }}
                    >
                      ✓
                    </div>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              {/* Step navigation dots */}
              <div className="hiw-dots">
                {steps.map((s, i) => (
                  <button
                    key={i}
                    className={`hiw-dot ${active === i ? "hiw-dot-active" : ""}`}
                    onClick={() => handleStepClick(i)}
                    style={{ background: active === i ? s.color : undefined, boxShadow: active === i ? `0 0 10px ${s.color}60` : undefined }}
                  />
                ))}
              </div>
            </div>

            {/* Right: visual card */}
            <div className="hiw-panel-right">
              {/* Connector line decoration */}
              <div className="hiw-connector">
                <div className="hiw-connector-line" style={{ background: `linear-gradient(180deg, ${step.color}60, transparent)` }} />
                <div className="hiw-connector-dot" style={{ background: step.color, boxShadow: `0 0 16px ${step.color}80` }} />
              </div>

              <div
                className="hiw-visual-card"
                style={{
                  borderColor: `${step.color}30`,
                  boxShadow: `0 0 0 1px ${step.color}10, 0 30px 70px rgba(0,0,0,0.55), 0 0 60px ${step.color}0a`,
                }}
              >
                {/* Card glow */}
                <div className="hiw-card-glow" style={{ background: `radial-gradient(circle at 70% 0%, ${step.color}20 0%, transparent 65%)` }} />

                {/* Chrome bar */}
                <div className="hiw-card-chrome">
                  <div className="hiw-card-dots">
                    <div className="hiw-dot-r" style={{ background: "#ef4444" }} />
                    <div className="hiw-dot-r" style={{ background: "#f59e0b" }} />
                    <div className="hiw-dot-r" style={{ background: "#10b981" }} />
                  </div>
                  <span className="hiw-card-title-bar">SwiftPOS · {step.tag}</span>
                  <div className="hiw-card-live">
                    <span className="hiw-card-live-dot" />
                    LIVE
                  </div>
                </div>

                {/* Card icon header */}
                <div className="hiw-card-header">
                  <div
                    className="hiw-card-icon"
                    style={{ background: step.colorBg, border: `1px solid ${step.color}40`, color: step.color, boxShadow: `0 0 20px ${step.color}30` }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div className="hiw-card-step-num" style={{ color: step.color }}>{step.number}</div>
                    <div className="hiw-card-step-label">{step.title}</div>
                  </div>
                </div>

                {/* Visual content */}
                <div className="hiw-card-body">
                  <div className="hiw-card-visual-label">◈ Live preview</div>
                  {step.visual}
                </div>
              </div>

              {/* Floating tag */}
              <div
                className="hiw-float-tag"
                style={{ background: step.colorBg, border: `1px solid ${step.color}35`, color: step.color }}
              >
                <span style={{ fontSize: 16 }}>
                  {active === 0 ? "⚙" : active === 1 ? "👥" : active === 2 ? "⚡" : "📈"}
                </span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{step.tag} Phase</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>{step.details[0]}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom connector strip ── */}
          <div className={`hiw-timeline ${visible ? "hiw-visible" : ""}`} style={{ transitionDelay: "0.35s" }}>
            {steps.map((s, i) => (
              <div key={i} className="hiw-timeline-item" onClick={() => handleStepClick(i)}>
                <div
                  className={`hiw-timeline-node ${active === i ? "hiw-timeline-node-active" : ""}`}
                  style={{
                    background: active >= i ? s.color : "rgba(255,255,255,0.06)",
                    border: `2px solid ${active >= i ? s.color : "rgba(255,255,255,0.1)"}`,
                    boxShadow: active === i ? `0 0 20px ${s.color}60` : "none",
                  }}
                >
                  {active > i ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 800, color: active === i ? "#fff" : "#475569", fontFamily: "monospace" }}>{s.number}</span>
                  )}
                </div>
                <div className="hiw-timeline-label">
                  <span className="hiw-timeline-tag" style={{ color: active >= i ? s.color : "#475569" }}>{s.tag}</span>
                  <span className="hiw-timeline-name" style={{ color: active >= i ? "#cbd5e1" : "#475569" }}>{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hiw-timeline-connector">
                    <div
                      className="hiw-timeline-fill"
                      style={{ background: `linear-gradient(90deg, ${s.color}, ${steps[i + 1].color})`, width: active > i ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            ))}
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
        .hiw-section {
          width: 100%;
          background: linear-gradient(180deg, var(--bg-mid) 0%, var(--bg-start) 50%, var(--bg-end) 100%);
          padding: 110px 0 120px;
          position: relative;
          overflow: hidden;
        }

        .hiw-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .hiw-orb-a {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(102,126,234,0.09) 0%, transparent 70%);
          top: -100px; left: -200px;
        }
        .hiw-orb-b {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(118,75,162,0.09) 0%, transparent 70%);
          bottom: -100px; right: -100px;
        }
        .hiw-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(102,126,234,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102,126,234,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }

        .hiw-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 60px;
          position: relative;
          z-index: 5;
        }

        /* ── Scroll reveal ── */
        .hiw-header, .hiw-tabs, .hiw-panel, .hiw-timeline {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hiw-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* ── HEADER ── */
        .hiw-header {
          text-align: center;
          max-width: 620px;
          margin: 0 auto 60px;
        }
        .hiw-badge-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }
        .badge-primary {
          background: linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2));
          border: 1px solid rgba(102,126,234,0.35);
          color: var(--accent-lit);
        }
        .badge-amber {
          background: var(--amber-bg);
          border: 1px solid var(--amber-bdr);
          color: var(--amber);
        }
        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent-lit);
        }
        .badge-dot.pulse { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }

        .hiw-headline {
          font-size: clamp(34px, 4vw, 52px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -1.5px;
          color: var(--text);
          margin-bottom: 16px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradientShift 5s ease infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .hiw-sub {
          font-size: 16px;
          color: var(--text-2);
          line-height: 1.8;
          font-weight: 400;
        }
        .hiw-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 260px;
          margin: 28px auto 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(102,126,234,0.4), transparent);
        }
        .divider-diamond { font-size: 14px; color: var(--accent-lit); opacity: 0.7; }

        /* ── STEP TABS ── */
        .hiw-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 36px;
        }
        .hiw-tab {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-family: inherit;
          overflow: hidden;
          backdrop-filter: blur(16px);
        }
        .hiw-tab:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.18);
        }
        .hiw-tab-num {
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          font-family: monospace;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .hiw-tab-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .hiw-tab-tag {
          font-size: 10px;
          font-weight: 700;
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-4);
          transition: color 0.3s;
        }
        .hiw-tab-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.3;
        }
        .hiw-tab-progress {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .hiw-tab-progress-fill {
          height: 100%;
          animation: tabProgress 3.8s linear;
          border-radius: 99px;
        }
        @keyframes tabProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* ── MAIN PANEL ── */
        .hiw-panel {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 52px;
          align-items: center;
          margin-bottom: 48px;
          animation: panelSwitch 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes panelSwitch {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Left */
        .hiw-panel-left {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .hiw-step-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-family: monospace;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 5px 14px 5px 10px;
          border-radius: 100px;
          margin-bottom: 20px;
          width: fit-content;
        }
        .hiw-step-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: pulseDot 2s ease-in-out infinite;
        }
        .hiw-panel-title {
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 900;
          letter-spacing: -1px;
          color: var(--text);
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .hiw-panel-desc {
          font-size: 15.5px;
          color: var(--text-2);
          line-height: 1.8;
          font-weight: 400;
          margin-bottom: 28px;
        }
        .hiw-detail-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 36px;
        }
        .hiw-detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-2);
          animation: detailIn 0.4s ease both;
        }
        @keyframes detailIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hiw-detail-check {
          width: 24px; height: 24px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .hiw-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .hiw-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .hiw-dot-active {
          width: 24px;
          border-radius: 4px;
        }

        /* Right */
        .hiw-panel-right {
          position: relative;
        }
        .hiw-connector {
          position: absolute;
          left: -26px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          z-index: 2;
        }
        .hiw-connector-line {
          width: 2px;
          height: 60px;
        }
        .hiw-connector-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          margin-top: -2px;
        }

        .hiw-visual-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 22px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          position: relative;
          animation: cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .hiw-card-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* Chrome bar */
        .hiw-card-chrome {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 18px;
          border-bottom: 1px solid var(--border);
          background: rgba(30,41,59,0.8);
          position: relative;
          z-index: 1;
        }
        .hiw-card-dots { display: flex; gap: 6px; }
        .hiw-dot-r { width: 11px; height: 11px; border-radius: 50%; }
        .hiw-card-title-bar {
          font-size: 11px;
          color: var(--text-4);
          font-family: monospace;
          letter-spacing: 0.3px;
          margin: 0 auto;
        }
        .hiw-card-live {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-family: monospace;
          color: #86efac;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .hiw-card-live-dot {
          width: 6px; height: 6px;
          background: #86efac;
          border-radius: 50%;
          animation: blink 1.2s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        .hiw-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 22px 16px;
          position: relative;
          z-index: 1;
        }
        .hiw-card-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: box-shadow 0.3s;
        }
        .hiw-card-step-num {
          font-size: 22px;
          font-weight: 900;
          font-family: monospace;
          line-height: 1;
          margin-bottom: 2px;
        }
        .hiw-card-step-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text);
        }

        .hiw-card-body {
          padding: 0 22px 24px;
          position: relative;
          z-index: 1;
        }
        .hiw-card-visual-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--text-4);
          margin-bottom: 12px;
          font-family: monospace;
          font-weight: 700;
        }

        /* Floating tag */
        .hiw-float-tag {
          position: absolute;
          bottom: -16px;
          right: -16px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 14px;
          backdrop-filter: blur(20px);
          box-shadow: 0 10px 36px rgba(0,0,0,0.4);
          z-index: 10;
          animation: floatTag 4s ease-in-out infinite;
        }
        @keyframes floatTag {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }

        /* ── TIMELINE ── */
        .hiw-timeline {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 32px 40px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 0 1px rgba(102,126,234,0.06);
        }
        .hiw-timeline-item {
          display: flex;
          align-items: center;
          flex: 1;
          gap: 14px;
          cursor: pointer;
        }
        .hiw-timeline-node {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.4s ease;
        }
        .hiw-timeline-label {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-shrink: 0;
        }
        .hiw-timeline-tag {
          font-size: 10px;
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
          transition: color 0.3s;
        }
        .hiw-timeline-name {
          font-size: 12px;
          font-weight: 600;
          transition: color 0.3s;
        }
        .hiw-timeline-connector {
          flex: 1;
          height: 2px;
          background: rgba(255,255,255,0.07);
          border-radius: 99px;
          overflow: hidden;
          margin: 0 12px;
        }
        .hiw-timeline-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .hiw-panel { grid-template-columns: 1fr; gap: 36px; }
          .hiw-connector { display: none; }
          .hiw-tabs { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .hiw-section { padding: 72px 0 80px; }
          .hiw-container { padding: 0 24px; }
          .hiw-tabs { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .hiw-timeline { padding: 20px 24px; flex-wrap: wrap; gap: 20px; }
          .hiw-timeline-connector { display: none; }
          .hiw-timeline-item { flex: 0 0 auto; }
          .hiw-float-tag { display: none; }
        }
        @media (max-width: 480px) {
          .hiw-tabs { grid-template-columns: 1fr 1fr; }
          .hiw-headline { font-size: 30px; }
        }
      `}</style>
    </>
  );
}