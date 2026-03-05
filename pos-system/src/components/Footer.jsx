import { useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Send,
  MapPin,
  Phone,
  Heart,
  ArrowUp,
  Code2,
  ShoppingBag,
} from "lucide-react";

const footerLinks = {
  navigation: [
    { label: "Features", href: "#features" },
    { label: "Modules", href: "#modules" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#integrations" },
    { label: "Contact", href: "#contact" },
  ],
  system: [
    { label: "Sales Module", href: "#sales" },
    { label: "Inventory", href: "#inventory" },
    { label: "Reports", href: "#reports" },
    { label: "Authentication", href: "#auth" },
    { label: "Admin Panel", href: "#admin" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Case Studies", href: "#cases" },
    { label: "Open Source", href: "#opensource" },
    { label: "Changelog", href: "#changelog" },
    { label: "Support", href: "#support" },
  ],
};

const socialLinks = [
  { icon: Github,   href: "https://github.com/yasirunadeeshaa",                         label: "GitHub"   },
  { icon: Linkedin, href: "https://www.linkedin.com/in/yasiru-nadeesha-aththanayaka/",  label: "LinkedIn" },
  { icon: Twitter,  href: "https://twitter.com",                                         label: "Twitter"  },
  { icon: Mail,     href: "mailto:yasiru@example.com",                                   label: "Email"    },
];

const stats = [
  { value: "10K+", label: "Daily transactions" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "50+", label: "Integrations" },
  { value: "0.3s", label: "Checkout speed" },
];

export default function POSFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer className="ft-footer">
        {/* Background orbs — same as hero */}
        <div className="ft-orb ft-orb-a" />
        <div className="ft-orb ft-orb-b" />
        <div className="ft-orb ft-orb-c" />

        {/* Subtle grid */}
        <div className="ft-grid-bg" />

        {/* ── Animated top border ── */}
        <div className="ft-top-border">
          <div className="ft-border-glow" />
        </div>

        {/* ── CTA Banner ── */}
        <div className="ft-cta-wrap">
          <div className="ft-cta-inner">
            <div className="ft-cta-left">
              <div className="ft-badge-row">
                <span className="badge badge-primary">
                  <span className="badge-dot pulse" />
                  Ready to get started?
                </span>
                <span className="badge badge-green">⚡ Free Demo</span>
              </div>
              <h2 className="ft-cta-headline">
                Take your business to the{" "}
                <span className="gradient-text">next level</span>
              </h2>
              <p className="ft-cta-sub">
                Join hundreds of businesses already using our POS system to streamline operations and boost revenue.
              </p>
            </div>
            <div className="ft-cta-right">
              {stats.map((s, i) => (
                <div className="ft-stat" key={i}>
                  <span className="ft-stat-val">{s.value}</span>
                  <span className="ft-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Links Grid ── */}
        <div className="ft-container">
          <div className="ft-links-grid">

            {/* Brand column */}
            <div className="ft-col ft-brand-col">
              <div className="ft-brand">
                <div className="ft-brand-icon">
                  <ShoppingBag size={22} color="#fff" strokeWidth={1.8} />
                </div>
                <span className="ft-brand-name">SwiftPOS</span>
              </div>
              <p className="ft-brand-desc">
                Cloud-native point-of-sale for modern retail, restaurants, and service businesses. Built for speed, scale, and simplicity.
              </p>
              <div className="ft-contact-list">
                <div className="ft-contact-row">
                  <MapPin size={14} color="#667eea" />
                  <span>Baththaramulla, Sri Lanka</span>
                </div>
                <div className="ft-contact-row">
                  <Phone size={14} color="#667eea" />
                  <span>+94 74 176 7063</span>
                </div>
                <div className="ft-contact-row">
                  <Mail size={14} color="#667eea" />
                  <span>yasiru@example.com</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="ft-col">
              <h4 className="ft-col-title">
                <span className="ft-col-diamond">◈</span> Navigation
              </h4>
              <ul className="ft-link-list">
                {footerLinks.navigation.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="ft-link">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* System */}
            <div className="ft-col">
              <h4 className="ft-col-title">
                <span className="ft-col-diamond">◈</span> System
              </h4>
              <ul className="ft-link-list">
                {footerLinks.system.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="ft-link">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="ft-col">
              <h4 className="ft-col-title">
                <span className="ft-col-diamond">◈</span> Resources
              </h4>
              <ul className="ft-link-list">
                {footerLinks.resources.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="ft-link">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter + Social */}
            <div className="ft-col ft-newsletter-col">
              <h4 className="ft-col-title">
                <span className="ft-col-diamond">◈</span> Stay Updated
              </h4>
              <p className="ft-newsletter-desc">
                Get the latest updates on features, releases, and business tips.
              </p>
              <div className="ft-newsletter-wrap">
                <div className="ft-input-wrap">
                  <Mail size={15} className="ft-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="ft-input"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className={`ft-send-btn ${submitted ? "sent" : ""}`}
                >
                  {submitted ? "✓" : <Send size={16} />}
                </button>
              </div>
              {submitted && (
                <p className="ft-success">Thanks! You're subscribed ✦</p>
              )}

              {/* Social icons */}
              <div className="ft-socials">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="ft-social"
                    title={s.label}
                    aria-label={s.label}
                  >
                    <s.icon size={18} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="ft-bottom">
            <p className="ft-copy">
              © {new Date().getFullYear()} SwiftPOS · Yasiru Nadeesha. Made with{" "}
              <Heart size={12} className="ft-heart" /> in Sri Lanka
            </p>
            <div className="ft-bottom-links">
              <a href="#privacy" className="ft-bottom-link">Privacy Policy</a>
              <span className="ft-dot">·</span>
              <a href="#terms" className="ft-bottom-link">Terms of Service</a>
              <span className="ft-dot">·</span>
              <a href="#cookies" className="ft-bottom-link">Cookie Policy</a>
            </div>
            {/* Live ticker badge */}
            <div className="ft-live-badge">
              <span className="ft-live-dot" />
              <span>System Live</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button className="ft-scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
        <ArrowUp size={18} />
      </button>

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
          background: var(--bg-start);
          color: var(--text);
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── FOOTER SHELL ── */
        .ft-footer {
          position: relative;
          background: linear-gradient(180deg, var(--bg-end) 0%, var(--bg-mid) 40%, var(--bg-start) 100%);
          overflow: hidden;
          color: var(--text);
        }

        /* Orbs */
        .ft-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .ft-orb-a {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%);
          top: -200px; right: -200px;
        }
        .ft-orb-b {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(118,75,162,0.1) 0%, transparent 70%);
          bottom: 0; left: -150px;
        }
        .ft-orb-c {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(240,147,251,0.05) 0%, transparent 70%);
          top: 40%; left: 45%;
          transform: translate(-50%,-50%);
        }

        /* Grid bg */
        .ft-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(102,126,234,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102,126,234,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }

        /* Animated top border */
        .ft-top-border {
          height: 1px;
          background: var(--border);
          position: relative;
          overflow: hidden;
        }
        .ft-border-glow {
          position: absolute;
          top: 0; left: 0;
          height: 100%;
          width: 35%;
          background: linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent);
          animation: borderSlide 4s ease-in-out infinite;
        }
        @keyframes borderSlide {
          0%, 100% { transform: translateX(-100%); }
          50%       { transform: translateX(320%); }
        }

        /* ── CTA BANNER ── */
        .ft-cta-wrap {
          position: relative;
          z-index: 5;
          padding: 64px 60px 0;
        }
        .ft-cta-inner {
          background: rgba(17, 24, 39, 0.7);
          border: 1px solid rgba(102,126,234,0.18);
          border-radius: 24px;
          padding: 44px 48px;
          display: flex;
          align-items: center;
          gap: 60px;
          flex-wrap: wrap;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(102,126,234,0.06),
            0 30px 70px rgba(0,0,0,0.4),
            0 0 60px rgba(102,126,234,0.05);
        }
        .ft-cta-left { flex: 1; min-width: 280px; }
        .ft-cta-right {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .ft-stat { display: flex; flex-direction: column; gap: 4px; }
        .ft-stat-val {
          font-size: 30px;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .ft-stat-label {
          font-size: 11px;
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        /* Badge row — identical to hero */
        .ft-badge-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 12px;
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
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent-lit);
        }
        .badge-dot.pulse { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }

        .ft-cta-headline {
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -1px;
          color: var(--text);
          margin-bottom: 12px;
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
        .ft-cta-sub {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.75;
          max-width: 420px;
        }

        /* ── MAIN GRID ── */
        .ft-container {
          position: relative;
          z-index: 5;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 60px;
        }
        .ft-links-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr 1.4fr;
          gap: 56px;
          padding: 72px 0 56px;
          border-top: 1px solid var(--border);
          margin-top: 56px;
        }
        .ft-col {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Brand */
        .ft-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }
        .ft-brand-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(102,126,234,0.35);
          flex-shrink: 0;
        }
        .ft-brand-name {
          font-size: 22px;
          font-weight: 900;
          color: var(--text);
          letter-spacing: -0.5px;
        }
        .ft-brand-desc {
          font-size: 13.5px;
          color: var(--text-3);
          line-height: 1.75;
        }
        .ft-contact-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ft-contact-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-2);
        }

        /* Column titles */
        .ft-col-title {
          font-size: 11px;
          font-weight: 800;
          color: var(--text);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: 'Courier New', monospace;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .ft-col-diamond { color: var(--accent-lit); font-size: 14px; }

        /* Links */
        .ft-link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ft-link {
          font-size: 14px;
          color: var(--text-3);
          text-decoration: none;
          transition: color 0.25s, transform 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          position: relative;
          padding-left: 0;
        }
        .ft-link::before {
          content: '→';
          font-size: 11px;
          color: var(--accent);
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.25s, transform 0.25s;
        }
        .ft-link:hover {
          color: var(--accent-lit);
          transform: translateX(6px);
        }
        .ft-link:hover::before {
          opacity: 1;
          transform: translateX(-6px);
        }

        /* Newsletter */
        .ft-newsletter-col { gap: 16px; }
        .ft-newsletter-desc {
          font-size: 13px;
          color: var(--text-3);
          line-height: 1.7;
        }
        .ft-newsletter-wrap {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .ft-input-wrap {
          flex: 1;
          position: relative;
        }
        .ft-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-4);
          pointer-events: none;
        }
        .ft-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 50px;
          color: var(--text);
          font-size: 13px;
          transition: border-color 0.25s, background 0.25s;
        }
        .ft-input::placeholder { color: var(--text-4); }
        .ft-input:focus {
          outline: none;
          border-color: rgba(102,126,234,0.5);
          background: rgba(102,126,234,0.06);
        }
        .ft-send-btn {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          flex-shrink: 0;
          transition: transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 6px 20px rgba(102,126,234,0.4);
        }
        .ft-send-btn:hover {
          transform: scale(1.12);
          box-shadow: 0 10px 30px rgba(102,126,234,0.55);
        }
        .ft-send-btn.sent {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 6px 20px rgba(16,185,129,0.4);
        }
        .ft-success {
          font-size: 12px;
          color: var(--green);
          font-family: monospace;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Socials */
        .ft-socials {
          display: flex;
          gap: 10px;
          margin-top: 4px;
        }
        .ft-social {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-3);
          transition: all 0.25s;
          text-decoration: none;
        }
        .ft-social:hover {
          background: rgba(102,126,234,0.2);
          border-color: rgba(102,126,234,0.45);
          color: var(--accent-lit);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(102,126,234,0.25);
        }

        /* ── BOTTOM BAR ── */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding: 28px 0 36px;
          border-top: 1px solid var(--border);
        }
        .ft-copy {
          font-size: 13px;
          color: var(--text-3);
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
        }
        .ft-heart {
          color: #ef4444;
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25%       { transform: scale(1.3); }
          50%       { transform: scale(1); }
        }
        .ft-bottom-links {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .ft-bottom-link {
          font-size: 13px;
          color: var(--text-3);
          text-decoration: none;
          transition: color 0.25s;
        }
        .ft-bottom-link:hover { color: var(--accent-lit); }
        .ft-dot { color: var(--text-4); }

        /* Live badge */
        .ft-live-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          font-family: monospace;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--green);
          background: rgba(134,239,172,0.1);
          border: 1px solid rgba(134,239,172,0.25);
          padding: 6px 14px;
          border-radius: 50px;
        }
        .ft-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--green);
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* Scroll to top */
        .ft-scroll-top {
          position: fixed;
          bottom: 36px;
          right: 36px;
          width: 50px; height: 50px;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          border: none;
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 32px rgba(102,126,234,0.45);
          transition: transform 0.25s, box-shadow 0.25s;
          z-index: 1000;
        }
        .ft-scroll-top:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 44px rgba(102,126,234,0.6);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1200px) {
          .ft-links-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 36px;
          }
          .ft-brand-col { grid-column: span 3; }
          .ft-cta-inner { gap: 40px; }
        }
        @media (max-width: 768px) {
          .ft-cta-wrap { padding: 40px 24px 0; }
          .ft-container { padding: 0 24px; }
          .ft-links-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-top: 40px;
            padding-top: 40px;
          }
          .ft-brand-col { grid-column: span 2; }
          .ft-cta-right { gap: 24px; }
          .ft-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .ft-scroll-top { bottom: 20px; right: 20px; width: 44px; height: 44px; }
        }
        @media (max-width: 480px) {
          .ft-links-grid { grid-template-columns: 1fr; }
          .ft-brand-col { grid-column: span 1; }
          .ft-cta-headline { font-size: 24px; }
        }
      `}</style>
    </>
  );
}