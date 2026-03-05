import { useState, useEffect, useRef } from "react";

const metrics = [
  { value: "10K+", label: "Transactions daily", icon: "↗" },
  { value: "99.9%", label: "Uptime SLA", icon: "◈" },
  { value: "0.3s", label: "Checkout speed", icon: "⚡" },
  { value: "50+", label: "Integrations", icon: "⬡" },
];

const orderItems = [
  { name: "Flat White", qty: 2, price: 9.00, cat: "Beverage" },
  { name: "Avocado Toast", qty: 1, price: 14.50, cat: "Food" },
  { name: "Fresh OJ", qty: 1, price: 6.00, cat: "Beverage" },
];

const notifications = [
  { icon: "✦", label: "Payment confirmed", sub: "$29.50 · Visa ···· 4291", color: "#667eea", delay: 0 },
  { icon: "◈", label: "Stock alert", sub: "Espresso — 3 units left", color: "#f093fb", delay: 2.5 },
  { icon: "▲", label: "Revenue today", sub: "$4,820 · +18% vs yesterday", color: "#a5b4fc", delay: 5 },
];

export default function HeroSection() {
  const [tick, setTick] = useState(0);
  const [activeNotif, setActiveNotif] = useState(0);
  const [amount, setAmount] = useState(0);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  // Particle canvas — same as PortfolioHero
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    let animId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 80);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const target = 29.50;
    let curr = 0;
    const step = target / 30;
    const t = setInterval(() => {
      curr = Math.min(curr + step, target);
      setAmount(curr);
      if (curr >= target) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const cycle = setInterval(() => {
      setActiveNotif(n => (n + 1) % notifications.length);
    }, 3500);
    return () => clearInterval(cycle);
  }, []);

  return (
    <>
      <div className="hero" ref={heroRef}>
        {/* Particle Canvas */}
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* Purple/indigo radial orbs matching PortfolioHero */}
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />

        {/* ── BODY ── */}
        <div className="hero-body">

          {/* LEFT */}
          <div className="left">
            {/* Badges — same style as PortfolioHero */}
            <div className="badge-group">
              <span className="badge badge-primary">
                <span className="badge-dot pulse" />
                AI-powered analytics — now live
              </span>
              <span className="badge badge-green">
                ⚡ Live System
              </span>
              <span className="badge badge-amber">
                ◈ Enterprise Ready
              </span>
            </div>

            <h1 className="headline">
              The POS that moves
              <br />
              as fast as{" "}
              <span className="gradient-text">your business</span>
              <br />
              <span className="dim">was built to.</span>
            </h1>

            <p className="desc">
              Cloud-native point-of-sale for modern retail, restaurants, and service businesses.
              Real-time inventory, predictive analytics, and seamless payments — all unified.
            </p>

            {/* Stats — same as PortfolioHero */}
            <div className="stats">
              {metrics.map((m, i) => (
                <div className="stat-item" key={i}>
                  <span className="stat-number">{m.value}</span>
                  <span className="stat-label">{m.label}</span>
                </div>
              ))}
            </div>

            <div className="actions">
              <button className="btn-p">
                Explore Features
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

          {/* RIGHT */}
          <div className="right">
            {/* Animated Rings — same as PortfolioHero */}
            <div className="ring ring-1" />
            <div className="ring ring-2" />

            {/* Notification stack */}
            <div className="notif-stack">
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className={`notif ${i === activeNotif ? "visible" : ""}`}
                >
                  <div className="notif-icon-ring" style={{ background: `${n.color}22` }}>
                    <span style={{ color: n.color }}>{n.icon}</span>
                  </div>
                  <div className="notif-body">
                    <div className="notif-title">{n.label}</div>
                    <div className="notif-sub">{n.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* POS Screen */}
            <div className="pos">
              <div className="pos-chrome">
                <div className="pos-dots">
                  <div className="pos-dot" style={{ background: "#ef4444" }} />
                  <div className="pos-dot" style={{ background: "#f59e0b" }} />
                  <div className="pos-dot" style={{ background: "#10b981" }} />
                </div>
                <span className="pos-title">Order #1042 · Table 7</span>
                <div className="pos-live">
                  <span className="pos-live-dot" />
                  LIVE
                </div>
              </div>

              <div className="pos-inner">
                <div className="pos-section-label">Order items</div>
                {orderItems.map((item) => (
                  <div className="pos-row" key={item.name}>
                    <div className="pos-row-left">
                      <span className="pos-row-name">{item.name}</span>
                      <span className="pos-row-cat">{item.cat}</span>
                    </div>
                    <div className="pos-row-right">
                      <span className="pos-row-price">${item.price.toFixed(2)}</span>
                      <span className="pos-row-qty">×{item.qty}</span>
                    </div>
                  </div>
                ))}

                <div className="pos-divider" />

                <div className="pos-total-row">
                  <span className="pos-total-label">Total due</span>
                  <span className="pos-total-val">${amount.toFixed(2)}</span>
                </div>

                <button className="pos-charge">
                  <span className="pos-charge-icon">↗</span>
                  Charge ${amount.toFixed(2)}
                </button>

                <div className="pos-sparkline">
                  <div className="sparkline-label">Hourly revenue</div>
                  <div className="sparkline-bars">
                    {[30, 52, 44, 68, 45, 72, 88, 62, 95, 80, 100, tick % 100].map((h, i, arr) => (
                      <div
                        key={i}
                        className={`spark-bar ${i === arr.length - 1 ? "active" : ""}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating info cards — same as PortfolioHero */}
            <div className="float-card float-card-top">
              <span className="float-card-icon">◈</span>
              <div>
                <div className="float-card-title">Tech Stack</div>
                <div className="float-card-tags">
                  <span className="tag-chip">React</span>
                  <span className="tag-chip">Node.js</span>
                  <span className="tag-chip">Stripe</span>
                </div>
              </div>
            </div>

            <div className="float-card float-card-bottom">
              <span className="float-card-icon">🏆</span>
              <div>
                <div className="float-card-title">Uptime this month</div>
                <div className="float-card-sub">99.97% · Zero incidents</div>
                <span className="achievement-badge">2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="ticker-wrap">
          <span className="ticker-label">↑ Live</span>
          <div className="ticker-inner">
            <div className="ticker-track">
              {[
                ["Latte ×2", "+$9.00"],
                ["Inventory synced", "12 SKUs"],
                ["Payment", "+$42.50"],
                ["New order", "Table 3"],
                ["Daily revenue", "$4,820"],
                ["Uptime", "99.97%"],
                ["Stripe connected", "Active"],
                ["Report ready", "Q2 summary"],
                ["Latte ×2", "+$9.00"],
                ["Inventory synced", "12 SKUs"],
                ["Payment", "+$42.50"],
                ["New order", "Table 3"],
                ["Daily revenue", "$4,820"],
                ["Uptime", "99.97%"],
                ["Stripe connected", "Active"],
                ["Report ready", "Q2 summary"],
              ].map(([label, val], i) => (
                <span className="ticker-item" key={i}>
                  {label} — <span>{val}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator — same as PortfolioHero */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
          <span className="scroll-text">Scroll to explore</span>
        </div>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── PortfolioHero color palette ── */
        :root {
          --bg-start:   #0f0f23;
          --bg-mid:     #1a1a2e;
          --bg-end:     #16213e;
          --card-bg:    rgba(17, 24, 39, 0.85);
          --card-bg2:   rgba(30, 41, 59, 0.8);
          --border:     rgba(255,255,255,0.1);
          --border-h:   rgba(102,126,234,0.5);
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
          --amber:      #fcd34d;
          --amber-bg:   rgba(251,191,36,0.2);
          --amber-bdr:  rgba(251,191,36,0.3);
        }

        html, body, #root { width: 100%; min-height: 100vh; overflow-x: hidden; }
        body {
          background: var(--bg-start);
          color: var(--text);
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── HERO SHELL ── */
        .hero {
          width: 100%;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, var(--bg-start) 0%, var(--bg-mid) 50%, var(--bg-end) 100%);
          color: var(--text);
        }

        /* Particle canvas */
        .hero-canvas {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        /* Orbs — purple/indigo like PortfolioHero */
        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .orb-a {
          width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(102,126,234,0.12) 0%, transparent 70%);
          top: -300px; left: -200px;
        }
        .orb-b {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(118,75,162,0.12) 0%, transparent 70%);
          bottom: -200px; right: -100px;
        }
        .orb-c {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(240,147,251,0.06) 0%, transparent 70%);
          top: 40%; left: 45%;
          transform: translate(-50%, -50%);
        }

        /* ── HERO BODY ── */
        .hero-body {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 70px 60px 80px;
          position: relative;
          z-index: 5;
          gap: 60px;
        }

        /* ── LEFT ── */
        .left {
          flex: 0 0 50%;
          max-width: 50%;
          display: flex;
          flex-direction: column;
          animation: fadeInLeft 0.8s ease-out;
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Badges — PortfolioHero style */
        .badge-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
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
          animation: floatBadge 3s ease-in-out infinite;
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
          50%       { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }

        .headline {
          font-size: clamp(40px, 4vw, 62px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -2px;
          color: var(--text);
          margin-bottom: 22px;
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
        .dim { color: var(--text-3); }

        .desc {
          font-size: 17px;
          line-height: 1.8;
          color: var(--text-2);
          max-width: 500px;
          font-weight: 400;
          margin-bottom: 36px;
        }

        /* Stats — same structure as PortfolioHero */
        .stats {
          display: flex;
          gap: 36px;
          margin-bottom: 38px;
          padding-bottom: 36px;
          border-bottom: 1px solid var(--border);
        }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-number {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .stat-label {
          font-size: 12px;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .actions {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        .btn-p {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 8px 32px rgba(102,126,234,0.4);
          letter-spacing: 0.1px;
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
          padding: 16px 28px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 15px;
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
          flex-shrink: 0;
        }
        .play-ring svg { margin-left: 1px; }

        /* ── RIGHT ── */
        .right {
          flex: 0 0 50%;
          max-width: 80%;
          position: relative;
          min-height: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeInRight 0.8s ease-out;
          margin-left: -100px;
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Animated rings — PortfolioHero style */
        .ring {
          position: absolute;
          border: 2px solid rgba(102,126,234,0.18);
          border-radius: 50%;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
        }
        .ring-1 {
          width: 480px; height: 480px;
          animation: rotateRing 20s linear infinite;
        }
        .ring-2 {
          width: 620px; height: 620px;
          animation: rotateRingRev 30s linear infinite;
        }
        @keyframes rotateRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes rotateRingRev {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        /* ── POS CARD ── */
        .pos {
          width: 330px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          z-index: 4;
          box-shadow:
            0 0 0 1px rgba(102,126,234,0.08),
            0 30px 70px rgba(0,0,0,0.6),
            0 0 80px rgba(102,126,234,0.08);
          backdrop-filter: blur(20px);
          animation: floatCard 6s ease-in-out infinite;
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        .pos-chrome {
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--card-bg2);
        }
        .pos-dots { display: flex; gap: 6px; }
        .pos-dot { width: 11px; height: 11px; border-radius: 50%; }
        .pos-title {
          font-size: 11px;
          color: var(--text-3);
          font-family: 'Courier New', monospace;
          letter-spacing: 0.3px;
          margin: 0 auto;
        }
        .pos-live {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-family: monospace;
          color: #86efac;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .pos-live-dot {
          width: 6px; height: 6px;
          background: #86efac;
          border-radius: 50%;
          animation: blink 1.2s infinite;
        }
        .pos-inner { padding: 20px 18px; }
        .pos-section-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-4);
          font-weight: 700;
          margin-bottom: 12px;
        }
        .pos-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 13px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 10px;
          margin-bottom: 7px;
          transition: border-color 0.2s;
        }
        .pos-row:hover { border-color: rgba(102,126,234,0.35); }
        .pos-row-left { display: flex; flex-direction: column; gap: 2px; }
        .pos-row-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .pos-row-cat {
          font-size: 10px;
          color: var(--text-4);
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pos-row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
        .pos-row-price {
          font-size: 13px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pos-row-qty { font-size: 10px; color: var(--text-4); font-family: monospace; }
        .pos-divider { height: 1px; background: var(--border); margin: 14px 0; }
        .pos-total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .pos-total-label { font-size: 12px; color: var(--text-3); }
        .pos-total-val {
          font-size: 30px;
          font-weight: 900;
          background: linear-gradient(135deg, #fff, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
        }
        .pos-charge {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          margin-top: 16px;
          margin-bottom: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(102,126,234,0.35);
        }
        .pos-charge:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(102,126,234,0.5);
        }
        .pos-charge-icon {
          width: 20px; height: 20px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        /* Sparkline */
        .pos-sparkline {
          margin: 0 -18px -20px;
          padding: 12px 18px 0;
          border-top: 1px solid var(--border);
          background: rgba(102,126,234,0.04);
        }
        .sparkline-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-4);
          margin-bottom: 8px;
        }
        .sparkline-bars {
          display: flex;
          gap: 4px;
          align-items: flex-end;
          height: 32px;
        }
        .spark-bar {
          flex: 1;
          border-radius: 3px 3px 0 0;
          background: rgba(102,126,234,0.2);
          min-height: 4px;
          transition: background 0.2s;
        }
        .spark-bar.active {
          background: linear-gradient(180deg, #a5b4fc, #667eea);
        }
        .spark-bar:hover { background: rgba(102,126,234,0.4); }

        /* Floating cards — PortfolioHero style */
        .float-card {
          position: absolute;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 18px;
          backdrop-filter: blur(20px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
          z-index: 6;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          transition: all 0.4s ease;
          margin-right: 50px;
          margin-top: 50px;
        }
        .float-card:hover {
          transform: translateY(-8px) scale(1.04);
          border-color: rgba(102,126,234,0.35);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .float-card-top {
          top: 30px;
          right: -30px;
          animation: floatCard1 8s ease-in-out infinite;
        }
        .float-card-bottom {
          bottom: 40px;
          left: -40px;
          animation: floatCard2 10s ease-in-out infinite;
        }
        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50%       { transform: translateY(-16px) translateX(8px); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(3deg); }
        }
        .float-card-icon {
          font-size: 20px;
          color: var(--accent-lit);
          flex-shrink: 0;
        }
        .float-card-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }
        .float-card-sub {
          font-size: 12px;
          color: var(--text-3);
          margin-bottom: 8px;
        }
        .float-card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag-chip {
          padding: 4px 11px;
          background: rgba(102,126,234,0.18);
          border: 1px solid rgba(102,126,234,0.3);
          border-radius: 20px;
          font-size: 11px;
          color: var(--accent-lit);
          font-weight: 600;
        }
        .achievement-badge {
          display: inline-block;
          padding: 3px 11px;
          background: var(--amber-bg);
          border: 1px solid var(--amber-bdr);
          border-radius: 10px;
          font-size: 11px;
          color: var(--amber);
          font-weight: 700;
        }

        /* Notification stack */
        .notif-stack {
          position: absolute;
          right: 10px;
          top: 90%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 6;
        }
        .notif {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 12px 16px;
          min-width: 210px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          opacity: 0.2;
          scale: 0.94;
          transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), scale 0.6s ease;
        }
        .notif.visible { opacity: 1; scale: 1; }
        .notif-icon-ring {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }
        .notif-title { font-size: 12px; font-weight: 700; color: var(--text); }
        .notif-sub { font-size: 11px; color: var(--text-3); margin-top: 2px; font-family: monospace; }

        /* ── TICKER ── */
        .ticker-wrap {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 36px;
          border-top: 1px solid var(--border);
          overflow: hidden;
          z-index: 10;
          background: rgba(15,15,35,0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
        }
        .ticker-label {
          font-size: 10px;
          font-family: monospace;
          color: var(--accent-lit);
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 0 20px;
          border-right: 1px solid var(--border);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ticker-inner { display: flex; white-space: nowrap; overflow: hidden; flex: 1; }
        .ticker-track {
          display: flex;
          animation: ticker 28s linear infinite;
        }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 28px;
          border-right: 1px solid var(--border);
          font-size: 11px;
          font-family: monospace;
          color: var(--text-3);
          white-space: nowrap;
        }
        .ticker-item span {
          background: linear-gradient(135deg, #667eea, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Scroll indicator — PortfolioHero style */
        .scroll-indicator {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          z-index: 10;
        }
        .scroll-mouse {
          width: 26px; height: 40px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 13px;
          position: relative;
        }
        .scroll-wheel {
          width: 4px; height: 8px;
          background: rgba(255,255,255,0.7);
          border-radius: 2px;
          position: absolute;
          top: 8px; left: 50%;
          transform: translateX(-50%);
          animation: scrollWheel 1.5s ease-in-out infinite;
        }
        @keyframes scrollWheel {
          0%   { opacity: 1; top: 8px; }
          100% { opacity: 0; top: 20px; }
        }
        .scroll-text {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.5px;
        }

        /* ── SHARED KEYFRAMES ── */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .notif-stack { right: -120px; }
        }
        @media (max-width: 900px) {
          .right { display: none; }
          .left { flex: 0 0 100%; max-width: 100%; }
          .nav-pills { display: none; }
          .hero-body { padding: 50px 24px 60px; }
          .nav { padding: 0 24px; }
          .stats { flex-wrap: wrap; gap: 20px; }
        }
        @media (max-width: 600px) {
          .headline { font-size: 36px; }
          .badge-group { gap: 8px; }
          .actions { flex-direction: column; }
          .btn-p, .btn-s { width: 100%; justify-content: center; }
        }
      `}</style>
    </>
  );
}