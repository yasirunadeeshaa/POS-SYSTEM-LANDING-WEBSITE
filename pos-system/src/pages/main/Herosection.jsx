import { useState, useEffect } from "react";

const stats = [
  { value: "10K+", label: "Transactions/Day" },
  { value: "99.9%", label: "Uptime" },
  { value: "0.3s", label: "Avg. Checkout Speed" },
  { value: "50+", label: "Integrations" },
];

const floatingCards = [
  {
    icon: "💳",
    title: "Payment Processed",
    sub: "$124.50 — Visa •••• 4291",
    color: "#00f5a0",
    top: "8%",
    right: "-20px",
    delay: "0s",
  },
  {
    icon: "📦",
    title: "Low Stock Alert",
    sub: "Espresso Beans — 3 left",
    color: "#f5a623",
    top: "52%",
    right: "-20px",
    delay: "0.4s",
  },
  {
    icon: "📊",
    title: "Today's Revenue",
    sub: "$4,820.00 (+18%)",
    color: "#7b61ff",
    bottom: "8%",
    left: "-20px",
    delay: "0.8s",
  },
];

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        :root {
          --bg: #080c14;
          --surface: #0f1623;
          --border: rgba(255,255,255,0.07);
          --accent: #00f5a0;
          --accent2: #7b61ff;
          --text: #e8eaf0;
          --muted: #6b7280;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body, #root {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── hero wrapper ── */
        .hero-wrapper {
          width: 100%;
          min-height: 100vh;
          background: var(--bg);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── grid bg ── */
        .hero-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,245,160,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,160,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── glow orbs ── */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: rgba(0,245,160,0.07);
          top: -150px; left: -150px;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: rgba(123,97,255,0.09);
          bottom: -100px; right: 0;
        }

        /* ── navbar ── */
        .nav-bar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 60px;
          position: relative;
          z-index: 10;
          border-bottom: 1px solid var(--border);
          background: rgba(8,12,20,0.8);
          backdrop-filter: blur(12px);
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: -0.5px;
          white-space: nowrap;
        }
        .nav-logo span { color: var(--text); }
        .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
        }
        .nav-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-links a:hover { color: var(--text); }
        .nav-cta {
          background: var(--accent);
          color: #000;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          white-space: nowrap;
        }
        .nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── hero content ── */
        .hero-content {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: center;
          padding: 80px 60px 60px;
          position: relative;
          z-index: 5;
          gap: 60px;
        }

        /* LEFT SIDE — 55% */
        .hero-left {
          flex: 0 0 55%;
          max-width: 55%;
          display: flex;
          flex-direction: column;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,245,160,0.08);
          border: 1px solid rgba(0,245,160,0.2);
          color: var(--accent);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 28px;
          width: fit-content;
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.6s ease forwards;
          animation-delay: 0.1s;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: var(--accent);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
          flex-shrink: 0;
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(40px, 4vw, 68px);
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -2px;
          color: var(--text);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.25s;
        }
        .hero-title .accent { color: var(--accent); }

        .hero-sub {
          margin-top: 22px;
          font-size: 17px;
          line-height: 1.75;
          color: var(--muted);
          max-width: 520px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.4s;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          margin-top: 36px;
          align-items: center;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.55s;
        }
        .btn-primary {
          background: var(--accent);
          color: #000;
          border: none;
          padding: 14px 32px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 30px rgba(0,245,160,0.2);
          white-space: nowrap;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(0,245,160,0.35);
        }
        .btn-secondary {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 500;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: border-color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .btn-secondary:hover {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.03);
        }

        /* ── stats ── */
        .stats-row {
          display: flex;
          gap: 0;
          margin-top: 52px;
          padding-top: 36px;
          border-top: 1px solid var(--border);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.7s ease forwards;
          animation-delay: 0.7s;
        }
        .stat-item {
          flex: 1;
          padding-right: 24px;
        }
        .stat-item + .stat-item {
          padding-left: 24px;
          padding-right: 24px;
          border-left: 1px solid var(--border);
        }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -1px;
        }
        .stat-label {
          font-size: 11px;
          color: var(--muted);
          margin-top: 3px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        /* RIGHT SIDE — 45% */
        .hero-right {
          flex: 0 0 45%;
          max-width: 45%;
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: fadeIn 1s ease forwards;
          animation-delay: 0.6s;
        }

        /* ── POS Screen ── */
        .pos-screen {
          width: 100%;
          max-width: 360px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 40px 100px rgba(0,0,0,0.6),
            0 0 0 1px rgba(255,255,255,0.04);
          position: relative;
          z-index: 2;
        }
        .pos-header {
          background: rgba(0,245,160,0.06);
          border-bottom: 1px solid var(--border);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pos-dots { display: flex; gap: 6px; }
        .pos-dot { width: 10px; height: 10px; border-radius: 50%; }
        .pos-body { padding: 20px; }
        .pos-label {
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        .pos-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .pos-item-name { color: var(--text); font-weight: 500; }
        .pos-item-price { color: var(--accent); font-weight: 700; }
        .pos-total {
          border-top: 1px solid var(--border);
          padding-top: 14px;
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
        }
        .pos-pay-btn {
          width: 100%;
          padding: 14px;
          background: var(--accent);
          color: #000;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          margin-top: 16px;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: opacity 0.2s;
        }
        .pos-pay-btn:hover { opacity: 0.88; }

        /* ── floating cards ── */
        .float-card {
          position: absolute;
          background: var(--surface);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          min-width: 195px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          z-index: 3;
          animation: floatAnim 4s ease-in-out infinite;
        }
        .float-card:nth-child(2) { animation-delay: -1.3s; }
        .float-card:nth-child(3) { animation-delay: -2.6s; }
        .float-icon { font-size: 18px; margin-bottom: 4px; }
        .float-title { font-size: 12px; font-weight: 600; color: var(--text); }
        .float-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
        .float-accent-bar {
          width: 28px; height: 2px;
          border-radius: 2px;
          margin-bottom: 8px;
        }

        /* ── keyframes ── */
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* ── responsive ── */
        @media (max-width: 1100px) {
          .nav-bar { padding: 20px 32px; }
          .hero-content { padding: 60px 32px 50px; gap: 40px; }
        }

        @media (max-width: 900px) {
          .hero-right { display: none; }
          .hero-left { flex: 0 0 100%; max-width: 100%; }
          .nav-links { display: none; }
          .hero-content { padding: 50px 24px 40px; }
          .nav-bar { padding: 18px 24px; }
          .stats-row { flex-wrap: wrap; gap: 20px; }
          .stat-item + .stat-item { border-left: none; padding-left: 0; }
        }
      `}</style>

      <div className="hero-wrapper">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Navbar */}
        <nav className="nav-bar">
          <div className="nav-logo">swift<span>POS</span></div>
          <ul className="nav-links">
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Integrations</a></li>
            <li><a href="#">Docs</a></li>
          </ul>
          <button className="nav-cta">Get Started Free</button>
        </nav>

        {/* Hero Body */}
        <div className="hero-content">

          {/* ── LEFT ── */}
          <div className="hero-left">
            <div className="badge">
              <div className="badge-dot" />
              Now with AI-powered analytics
            </div>

            <h1 className="hero-title">
              The POS that<br />
              moves as fast<br />
              as <span className="accent">your business</span>
            </h1>

            <p className="hero-sub">
              A blazing-fast, cloud-native point-of-sale system built for modern retail,
              restaurants, and service businesses. Real-time inventory, smart analytics,
              and seamless payments — all in one dashboard.
            </p>

            <div className="hero-actions">
              <button className="btn-primary">
                Start Free Trial
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </button>
              <button className="btn-secondary">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 8l6 4-6 4V8z" />
                </svg>
                Watch Demo
              </button>
            </div>

            <div className="stats-row">
              {stats.map((s) => (
                <div key={s.label} className="stat-item">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — POS mockup ── */}
          <div className="hero-right">
            {floatingCards.map((card, i) => (
              <div
                key={i}
                className="float-card"
                style={{
                  top: card.top,
                  right: card.right,
                  bottom: card.bottom,
                  left: card.left,
                  animationDelay: card.delay,
                }}
              >
                <div className="float-accent-bar" style={{ background: card.color }} />
                <div className="float-icon">{card.icon}</div>
                <div className="float-title">{card.title}</div>
                <div className="float-sub">{card.sub}</div>
              </div>
            ))}

            <div className="pos-screen">
              <div className="pos-header">
                <div className="pos-dots">
                  <div className="pos-dot" style={{ background: "#ff5f57" }} />
                  <div className="pos-dot" style={{ background: "#febc2e" }} />
                  <div className="pos-dot" style={{ background: "#28c840" }} />
                </div>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>Order #1042 · Table 7</span>
                <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>● LIVE</span>
              </div>
              <div className="pos-body">
                <div className="pos-label">Order Items</div>
                {[
                  { name: "Flat White",    qty: "×2", price: "$9.00"  },
                  { name: "Avocado Toast", qty: "×1", price: "$14.50" },
                  { name: "Orange Juice",  qty: "×1", price: "$6.00"  },
                ].map((item) => (
                  <div className="pos-item" key={item.name}>
                    <span className="pos-item-name">
                      {item.name}{" "}
                      <span style={{ color: "var(--muted)", fontSize: 11 }}>{item.qty}</span>
                    </span>
                    <span className="pos-item-price">{item.price}</span>
                  </div>
                ))}
                <div className="pos-total">
                  <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 14 }}>Total</span>
                  <span style={{ color: "var(--accent)" }}>$29.50</span>
                </div>
                <button className="pos-pay-btn">Charge $29.50 →</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}