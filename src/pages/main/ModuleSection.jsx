import { useState, useRef, useEffect } from "react";
import { Shield, ShoppingCart, Boxes, Users, BarChart3, LayoutDashboard } from "lucide-react";

const modules = [
  {
    icon: Shield,
    title: "Authentication",
    description: "Secure login system with role-based access control for admins and employees.",
    accent: "#667eea",
    badge: "Security",
    stat: "2FA Ready",
  },
  {
    icon: ShoppingCart,
    title: "Sales",
    description: "Handle customer transactions, billing, and receipt generation with speed.",
    accent: "#f093fb",
    badge: "Core",
    stat: "0.3s checkout",
  },
  {
    icon: Boxes,
    title: "Inventory",
    description: "Track stock levels in real-time, manage categories and supplier records.",
    accent: "#86efac",
    badge: "Real-time",
    stat: "50+ SKUs",
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Store customer profiles, purchase history, and loyalty data in one place.",
    accent: "#fcd34d",
    badge: "CRM",
    stat: "360° View",
  },
  {
    icon: BarChart3,
    title: "Reports",
    description: "Generate sales reports, daily summaries, and deep performance analytics.",
    accent: "#a5b4fc",
    badge: "Analytics",
    stat: "Live data",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    description: "Central control panel for monitoring activity and managing system users.",
    accent: "#fb7185",
    badge: "Control",
    stat: "Unified",
  },
];

function ModuleCard({ mod, index }) {
  const [hovered, setHovered] = useState(false);
  const Icon = mod.icon;

  return (
    <div
      className={`mod-card mod-card-${index}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow orb behind card */}
      <div
        className="card-glow"
        style={{ background: `radial-gradient(circle at 50% 0%, ${mod.accent}22 0%, transparent 70%)` }}
      />

      {/* Top row: icon + badge */}
      <div className="card-top">
        <div
          className="card-icon-ring"
          style={{
            background: `${mod.accent}18`,
            border: `1px solid ${mod.accent}40`,
            boxShadow: hovered ? `0 0 24px ${mod.accent}33` : "none",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <Icon size={22} color={mod.accent} strokeWidth={1.8} />
        </div>

        <span
          className="card-badge"
          style={{
            background: `${mod.accent}18`,
            border: `1px solid ${mod.accent}30`,
            color: mod.accent,
          }}
        >
          {mod.badge}
        </span>
      </div>

      {/* Content */}
      <h3 className="card-title">{mod.title}</h3>
      <p className="card-desc">{mod.description}</p>

      {/* Footer stat */}
      <div className="card-footer">
        <span
          className="card-stat-dot"
          style={{ background: mod.accent }}
        />
        <span className="card-stat-text" style={{ color: mod.accent }}>
          {mod.stat}
        </span>
      </div>

      {/* Hover border gradient */}
      <div
        className="card-border-grad"
        style={{
          opacity: hovered ? 1 : 0,
          background: `linear-gradient(135deg, ${mod.accent}55, transparent, ${mod.accent}22)`,
        }}
      />

      <style>{`
        .mod-card {
          position: relative;
          background: rgba(17, 24, 39, 0.85);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 28px 26px 24px;
          overflow: hidden;
          cursor: default;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s;
          backdrop-filter: blur(20px);
          animation: cardFadeIn 0.6s ease-out both;
          animation-delay: calc(${index} * 0.1s);
        }
        .mod-card-${index}:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(102,126,234,0.3);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(102,126,234,0.08);
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-glow {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 200px;
          pointer-events: none;
          z-index: 0;
        }
        .card-border-grad {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          pointer-events: none;
          transition: opacity 0.4s ease;
          border: 1px solid transparent;
          background-clip: padding-box;
          z-index: 0;
        }
        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        .card-icon-ring {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .card-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          font-family: 'Courier New', monospace;
        }
        .card-title {
          font-size: 17px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: -0.3px;
          position: relative;
          z-index: 1;
        }
        .card-desc {
          font-size: 13.5px;
          line-height: 1.75;
          color: #94a3b8;
          font-weight: 400;
          margin: 0 0 20px;
          position: relative;
          z-index: 1;
        }
        .card-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
          position: relative;
          z-index: 1;
        }
        .card-stat-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          animation: blink 2s ease-in-out infinite;
        }
        .card-stat-text {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          font-family: 'Courier New', monospace;
          text-transform: uppercase;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export default function ModulesSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section className="modules-section" ref={sectionRef}>
        {/* Background orbs matching hero */}
        <div className="mod-orb mod-orb-a" />
        <div className="mod-orb mod-orb-b" />

        {/* Subtle grid pattern */}
        <div className="mod-grid-bg" />

        <div className="mod-container">

          {/* Section header */}
          <div className={`mod-header ${visible ? "mod-header-visible" : ""}`}>
            {/* Badge row */}
            <div className="mod-badge-row">
              <span className="badge badge-primary">
                <span className="badge-dot pulse" />
                Fully Integrated Modules
              </span>
              <span className="badge badge-green">⚡ 6 Modules</span>
            </div>

            <h2 className="mod-headline">
              Every tool your business{" "}
              <span className="gradient-text">needs to thrive</span>
            </h2>

            <p className="mod-subtext">
              The POS system is built with six tightly integrated modules —
              from authentication to analytics — all working in sync.
            </p>

            {/* Horizontal rule with accent */}
            <div className="mod-divider">
              <div className="divider-line" />
              <div className="divider-diamond">◈</div>
              <div className="divider-line" />
            </div>
          </div>

          {/* Cards grid */}
          <div className={`mod-grid ${visible ? "mod-grid-visible" : ""}`}>
            {modules.map((mod, i) => (
              <ModuleCard mod={mod} index={i} key={i} />
            ))}
          </div>

          {/* Bottom CTA strip */}
          <div className={`mod-cta ${visible ? "mod-cta-visible" : ""}`}>
            <div className="cta-inner">
              <div className="cta-left">
                <span className="cta-eyebrow">Ready to deploy?</span>
                <span className="cta-text">All modules come pre-configured out of the box.</span>
              </div>
              <div className="cta-right">
                <button className="btn-p">
                  Explore Full System
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
          --green-bg:   rgba(72, 187, 120, 0.2);
          --green-bdr:  rgba(72, 187, 120, 0.3);
        }

        html, body, #root {
          width: 100%;
          background: var(--bg-start);
          color: var(--text);
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── SECTION SHELL ── */
        .modules-section {
          width: 100%;
          background: linear-gradient(180deg, var(--bg-end) 0%, var(--bg-mid) 50%, var(--bg-start) 100%);
          position: relative;
          overflow: hidden;
          padding: 100px 0 120px;
        }

        /* Orbs */
        .mod-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .mod-orb-a {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%);
          top: -200px; right: -200px;
        }
        .mod-orb-b {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(118,75,162,0.1) 0%, transparent 70%);
          bottom: -100px; left: -100px;
        }

        /* Grid pattern overlay */
        .mod-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(102,126,234,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102,126,234,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── CONTAINER ── */
        .mod-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 60px;
          position: relative;
          z-index: 5;
        }

        /* ── HEADER ── */
        .mod-header {
          text-align: center;
          margin-bottom: 70px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .mod-header.mod-header-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .mod-badge-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
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
        .badge-green {
          background: var(--green-bg);
          border: 1px solid var(--green-bdr);
          color: var(--green);
        }
        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent-lit);
        }
        .badge-dot.pulse { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.3); }
        }

        .mod-headline {
          font-size: clamp(34px, 4vw, 52px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -1.5px;
          color: var(--text);
          margin-bottom: 18px;
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

        .mod-subtext {
          font-size: 17px;
          line-height: 1.75;
          color: var(--text-2);
          max-width: 560px;
          margin: 0 auto 40px;
          font-weight: 400;
        }

        /* Divider */
        .mod-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 320px;
          margin: 0 auto;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(102,126,234,0.4), transparent);
        }
        .divider-diamond {
          font-size: 16px;
          color: var(--accent-lit);
          opacity: 0.7;
        }

        /* ── GRID ── */
        .mod-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
        }
        .mod-grid.mod-grid-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── CTA STRIP ── */
        .mod-cta {
          margin-top: 64px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }
        .mod-cta.mod-cta-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(17,24,39,0.7);
          border: 1px solid rgba(102,126,234,0.2);
          border-radius: 20px;
          padding: 28px 36px;
          backdrop-filter: blur(20px);
          gap: 24px;
          flex-wrap: wrap;
          box-shadow: 0 0 60px rgba(102,126,234,0.06);
        }
        .cta-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cta-eyebrow {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--accent-lit);
          font-weight: 700;
          font-family: monospace;
        }
        .cta-text {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-2);
        }
        .cta-right {
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }

        /* Buttons — identical to hero */
        .btn-p {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 8px 32px rgba(102,126,234,0.4);
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
          padding: 14px 24px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s;
          backdrop-filter: blur(10px);
        }
        .btn-s:hover {
          color: var(--text);
          border-color: rgba(102,126,234,0.4);
          background: rgba(102,126,234,0.1);
          transform: translateY(-2px);
        }
        .play-ring {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 1.5px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .play-ring svg { margin-left: 1px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .mod-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .mod-grid { grid-template-columns: 1fr; }
          .mod-container { padding: 0 24px; }
          .cta-inner { flex-direction: column; align-items: flex-start; }
          .mod-headline { font-size: 32px; }
        }
      `}</style>
    </>
  );
}