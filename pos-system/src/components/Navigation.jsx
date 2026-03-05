import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingBag, Github, Linkedin, Twitter, Sun, Moon, Zap } from "lucide-react";

const navItems = [
  { id: "home",        label: "Home",        tag: "01" },
  { id: "features",   label: "Features",    tag: "02" },
  { id: "modules",    label: "Modules",     tag: "03" },
  { id: "how-it-works", label: "How It Works", tag: "04" },
  { id: "comparison", label: "Compare",     tag: "05" },
];

const socialLinks = [
  { icon: Github,   href: "https://github.com/yasirunadeeshaa",                        label: "GitHub"   },
  { icon: Linkedin, href: "https://www.linkedin.com/in/yasiru-nadeesha-aththanayaka/", label: "LinkedIn" },
  { icon: Twitter,  href: "https://twitter.com",                                        label: "Twitter"  },
];

export default function NexusNav() {
  const [scrolled,    setScrolled]    = useState(false);
  const [scrollPct,   setScrollPct]   = useState(0);
  const [active,      setActive]      = useState("home");
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [isDark,      setIsDark]      = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(sy > 40);
      setScrollPct(dh > 0 ? (sy / dh) * 100 : 0);

      // Active section detection
      let current = "home";
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && window.scrollY + 140 >= el.offsetTop) current = item.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const theme = isDark ? "dark" : "light";

  return (
    <>
      <div data-theme={theme}>

        {/* ── Main nav ── */}
        <header className={`nx-nav ${scrolled ? "nx-nav--scrolled" : ""}`} ref={navRef}>

          {/* Animated top border */}
          <div className="nx-topline">
            <div className="nx-topline-fill" style={{ width: `${scrollPct}%` }} />
          </div>

          <div className="nx-nav-inner">

            {/* Logo */}
            <a className="nx-logo" href="#home" onClick={e => { e.preventDefault(); scrollTo("home"); }}>
              <div className="nx-logo-icon">
                <ShoppingBag size={18} strokeWidth={1.8} />
              </div>
              <div className="nx-logo-text">
                <span className="nx-logo-name">Nexus</span>
                <span className="nx-logo-tag">POS</span>
              </div>
              <div className="nx-logo-dot" />
            </a>

            {/* Centre nav pills */}
            <nav className="nx-links">
              <div className="nx-links-track">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className={`nx-link ${active === item.id ? "nx-link--active" : ""}`}
                    onClick={() => scrollTo(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="nx-link-num">{item.tag}</span>
                    <span className="nx-link-label">{item.label}</span>
                    {active === item.id && <div className="nx-link-pill" />}
                  </button>
                ))}
              </div>
            </nav>

            {/* Right controls */}
            <div className="nx-controls">
              {/* Social icons */}
              <div className="nx-socials">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="nx-social"
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <s.icon size={16} strokeWidth={1.8} />
                  </a>
                ))}
              </div>

              {/* Separator */}
              <div className="nx-sep" />

              {/* Theme toggle */}
              <button
                className="nx-theme-btn"
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle theme"
              >
                <div className={`nx-theme-track ${isDark ? "nx-theme-dark" : "nx-theme-light"}`}>
                  <Sun  size={13} className="nx-sun"  />
                  <Moon size={13} className="nx-moon" />
                  <div className="nx-theme-thumb" />
                </div>
              </button>

              {/* CTA */}
              <button className="nx-cta">
                <Zap size={15} strokeWidth={2} />
                <span>Book Demo</span>
                <div className="nx-cta-shine" />
              </button>

              {/* Hamburger */}
              <button
                className={`nx-burger ${menuOpen ? "nx-burger--open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </header>

        {/* ── Mobile drawer ── */}
        <div className={`nx-drawer ${menuOpen ? "nx-drawer--open" : ""}`}>
          <div className="nx-drawer-panel">

            {/* Drawer header */}
            <div className="nx-drawer-head">
              <div className="nx-logo">
                <div className="nx-logo-icon">
                  <ShoppingBag size={16} strokeWidth={1.8} />
                </div>
                <div className="nx-logo-text">
                  <span className="nx-logo-name">Nexus</span>
                  <span className="nx-logo-tag">POS</span>
                </div>
              </div>
              <button className="nx-drawer-close" onClick={() => setMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="nx-drawer-nav">
              {navItems.map((item, i) => (
                <button
                  key={item.id}
                  className={`nx-drawer-link ${active === item.id ? "nx-drawer-link--active" : ""}`}
                  onClick={() => scrollTo(item.id)}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <span className="nx-drawer-num">{item.tag}</span>
                  <span className="nx-drawer-label">{item.label}</span>
                  <span className="nx-drawer-arrow">→</span>
                </button>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="nx-drawer-footer">
              <div className="nx-drawer-socials">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="nx-drawer-social"
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <s.icon size={18} strokeWidth={1.8} />
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
              <button className="nx-drawer-cta" onClick={() => scrollTo("home")}>
                <Zap size={18} strokeWidth={2} />
                <span>Book a Demo</span>
              </button>
              <button className="nx-drawer-theme" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span>Switch to {isDark ? "Light" : "Dark"} Mode</span>
              </button>
            </div>
          </div>

          {/* Backdrop */}
          <div className="nx-drawer-backdrop" onClick={() => setMenuOpen(false)} />
        </div>

      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── THEME TOKENS ── */
        [data-theme="dark"] {
          --nav-bg:       rgba(10, 10, 26, 0);
          --nav-bg-solid: rgba(10, 10, 26, 0.92);
          --nav-border:   rgba(255,255,255,0.07);
          --nav-shadow:   0 16px 48px rgba(0,0,0,0.5);
          --text:         #ffffff;
          --text-2:       #cbd5e1;
          --text-3:       #94a3b8;
          --text-4:       #475569;
          --accent:       #667eea;
          --accent-2:     #764ba2;
          --accent-lit:   #a5b4fc;
          --link-hover:   rgba(102,126,234,0.12);
          --drawer-bg:    rgba(10,10,26,0.97);
          --sep:          rgba(255,255,255,0.08);
          --control-bg:   rgba(255,255,255,0.06);
          --control-bdr:  rgba(255,255,255,0.1);
        }
        [data-theme="light"] {
          --nav-bg:       rgba(255,255,255,0);
          --nav-bg-solid: rgba(255,255,255,0.92);
          --nav-border:   rgba(0,0,0,0.08);
          --nav-shadow:   0 16px 48px rgba(0,0,0,0.1);
          --text:         #0f172a;
          --text-2:       #334155;
          --text-3:       #64748b;
          --text-4:       #94a3b8;
          --accent:       #667eea;
          --accent-2:     #764ba2;
          --accent-lit:   #4f46e5;
          --link-hover:   rgba(102,126,234,0.1);
          --drawer-bg:    rgba(255,255,255,0.98);
          --sep:          rgba(0,0,0,0.08);
          --control-bg:   rgba(0,0,0,0.04);
          --control-bdr:  rgba(0,0,0,0.1);
        }

        body {
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── NAV SHELL ── */
        .nx-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: var(--nav-bg);
          backdrop-filter: blur(0px);
          border-bottom: 1px solid transparent;
          transition: background 0.4s ease, backdrop-filter 0.4s ease,
                      border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .nx-nav--scrolled {
          background: var(--nav-bg-solid);
          backdrop-filter: blur(28px);
          border-color: var(--nav-border);
          box-shadow: var(--nav-shadow);
        }

        /* Progress line */
        .nx-topline {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
          z-index: 2;
        }
        .nx-topline-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
          border-radius: 99px;
          transition: width 0.15s ease;
        }

        /* ── INNER ── */
        .nx-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          height: 72px;
          gap: 20px;
        }

        /* ── LOGO ── */
        .nx-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          cursor: pointer;
          flex-shrink: 0;
          background: none;
          border: none;
          padding: 0;
        }
        .nx-logo-icon {
          width: 38px; height: 38px;
          border-radius: 11px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          box-shadow: 0 4px 16px rgba(102,126,234,0.4);
          flex-shrink: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .nx-logo:hover .nx-logo-icon {
          transform: translateY(-2px) rotate(-4deg);
          box-shadow: 0 8px 24px rgba(102,126,234,0.55);
        }
        .nx-logo-text {
          display: flex;
          align-items: baseline;
          gap: 3px;
        }
        .nx-logo-name {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.8px;
          color: var(--text);
          transition: color 0.25s;
        }
        .nx-logo-tag {
          font-size: 11px;
          font-weight: 700;
          font-family: monospace;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--accent);
          background: rgba(102,126,234,0.12);
          border: 1px solid rgba(102,126,234,0.25);
          padding: 2px 7px;
          border-radius: 6px;
          margin-left: 2px;
        }
        .nx-logo-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #86efac;
          box-shadow: 0 0 8px #86efac;
          animation: dotBlink 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }

        /* ── NAV LINKS ── */
        .nx-links { display: flex; align-items: center; }
        .nx-links-track {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 5px;
          background: var(--control-bg);
          border: 1px solid var(--control-bdr);
          border-radius: 50px;
          backdrop-filter: blur(10px);
        }
        .nx-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 50px;
          border: none;
          background: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-3);
          transition: color 0.25s, background 0.25s;
          white-space: nowrap;
        }
        .nx-link:hover { color: var(--text-2); background: var(--link-hover); }
        .nx-link--active { color: var(--text); }
        .nx-link-num {
          font-size: 9px;
          font-family: monospace;
          font-weight: 700;
          color: var(--text-4);
          letter-spacing: 0.5px;
          transition: color 0.25s;
        }
        .nx-link--active .nx-link-num { color: var(--accent-lit); }
        .nx-link-label { position: relative; z-index: 1; }
        .nx-link-pill {
          position: absolute;
          inset: 0;
          border-radius: 50px;
          background: linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.15));
          border: 1px solid rgba(102,126,234,0.3);
          animation: pillIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
          z-index: 0;
        }
        @keyframes pillIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── CONTROLS ── */
        .nx-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .nx-socials {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nx-social {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-3);
          background: var(--control-bg);
          border: 1px solid var(--control-bdr);
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .nx-social:hover {
          color: var(--accent-lit);
          background: rgba(102,126,234,0.15);
          border-color: rgba(102,126,234,0.3);
          transform: translateY(-2px);
        }
        .nx-sep {
          width: 1px; height: 28px;
          background: var(--sep);
          flex-shrink: 0;
        }

        /* Theme toggle */
        .nx-theme-btn {
          background: none; border: none;
          cursor: pointer; padding: 4px;
        }
        .nx-theme-track {
          position: relative;
          width: 54px; height: 28px;
          border-radius: 50px;
          border: 1px solid var(--control-bdr);
          background: var(--control-bg);
          display: flex; align-items: center;
          padding: 0 7px;
          justify-content: space-between;
          transition: background 0.3s, border-color 0.3s;
          overflow: hidden;
        }
        .nx-theme-track:hover {
          border-color: rgba(102,126,234,0.4);
          background: rgba(102,126,234,0.1);
        }
        .nx-sun  { color: #f59e0b; position: relative; z-index: 1; }
        .nx-moon { color: #a5b4fc; position: relative; z-index: 1; }
        .nx-theme-thumb {
          position: absolute;
          top: 3px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          box-shadow: 0 2px 8px rgba(102,126,234,0.5);
          transition: left 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .nx-theme-dark  .nx-theme-thumb { left: 3px; }
        .nx-theme-light .nx-theme-thumb { left: calc(100% - 25px); }

        /* CTA */
        .nx-cta {
          position: relative;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 22px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 4px 20px rgba(102,126,234,0.4);
          font-family: inherit;
          white-space: nowrap;
        }
        .nx-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(102,126,234,0.55);
        }
        .nx-cta-shine {
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }
        .nx-cta:hover .nx-cta-shine { left: 150%; }

        /* Hamburger */
        .nx-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          width: 40px; height: 40px;
          align-items: center; justify-content: center;
          background: var(--control-bg);
          border: 1px solid var(--control-bdr);
          border-radius: 12px;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s, border-color 0.25s;
        }
        .nx-burger:hover {
          background: rgba(102,126,234,0.15);
          border-color: rgba(102,126,234,0.3);
        }
        .nx-burger span {
          display: block;
          width: 18px; height: 1.5px;
          background: var(--text-2);
          border-radius: 99px;
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
          transform-origin: center;
        }
        .nx-burger--open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nx-burger--open span:nth-child(2) { opacity: 0; width: 0; }
        .nx-burger--open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── MOBILE DRAWER ── */
        .nx-drawer {
          position: fixed;
          inset: 0; z-index: 1100;
          pointer-events: none;
        }
        .nx-drawer--open { pointer-events: all; }

        .nx-drawer-backdrop {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .nx-drawer--open .nx-drawer-backdrop { opacity: 1; }

        .nx-drawer-panel {
          position: absolute;
          top: 0; right: 0;
          width: min(400px, 88vw);
          height: 100vh;
          background: var(--drawer-bg);
          border-left: 1px solid var(--control-bdr);
          box-shadow: -20px 0 60px rgba(0,0,0,0.5);
          backdrop-filter: blur(40px);
          display: flex; flex-direction: column;
          padding: 28px 28px 36px;
          gap: 0;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
          z-index: 1;
          overflow-y: auto;
        }
        .nx-drawer--open .nx-drawer-panel { transform: translateX(0); }

        /* Drawer header */
        .nx-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--sep);
          margin-bottom: 28px;
        }
        .nx-drawer-close {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: var(--control-bg);
          border: 1px solid var(--control-bdr);
          color: var(--text-3);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s;
        }
        .nx-drawer-close:hover {
          background: rgba(251,113,133,0.15);
          border-color: rgba(251,113,133,0.3);
          color: #fb7185;
        }

        /* Drawer nav */
        .nx-drawer-nav {
          display: flex; flex-direction: column; gap: 6px;
          flex: 1;
        }
        .nx-drawer-link {
          display: flex; align-items: center; gap: 14px;
          padding: 15px 18px;
          background: var(--control-bg);
          border: 1px solid var(--control-bdr);
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-3);
          text-align: left;
          transition: all 0.25s ease;
          animation: drawerLinkIn 0.4s ease both;
        }
        @keyframes drawerLinkIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .nx-drawer-link:hover {
          color: var(--text);
          background: rgba(102,126,234,0.1);
          border-color: rgba(102,126,234,0.25);
          transform: translateX(-4px);
        }
        .nx-drawer-link--active {
          color: var(--text);
          background: linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.1));
          border-color: rgba(102,126,234,0.3);
        }
        .nx-drawer-num {
          font-size: 10px;
          font-family: monospace;
          font-weight: 700;
          color: var(--accent);
          width: 24px; flex-shrink: 0;
        }
        .nx-drawer-label { flex: 1; }
        .nx-drawer-arrow {
          color: var(--text-4);
          font-size: 14px;
          transition: transform 0.25s, color 0.25s;
        }
        .nx-drawer-link:hover .nx-drawer-arrow,
        .nx-drawer-link--active .nx-drawer-arrow {
          transform: translateX(-4px);
          color: var(--accent-lit);
        }

        /* Drawer footer */
        .nx-drawer-footer {
          display: flex; flex-direction: column; gap: 12px;
          padding-top: 24px;
          border-top: 1px solid var(--sep);
          margin-top: 24px;
        }
        .nx-drawer-socials {
          display: flex; gap: 8px;
        }
        .nx-drawer-social {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px;
          background: var(--control-bg);
          border: 1px solid var(--control-bdr);
          border-radius: 12px;
          color: var(--text-3);
          text-decoration: none;
          font-size: 12px; font-weight: 600;
          transition: all 0.25s;
        }
        .nx-drawer-social:hover {
          background: rgba(102,126,234,0.15);
          border-color: rgba(102,126,234,0.3);
          color: var(--accent-lit);
          transform: translateY(-2px);
        }
        .nx-drawer-cta {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 15px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          border: none; border-radius: 14px;
          font-size: 15px; font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(102,126,234,0.4);
          transition: transform 0.25s, box-shadow 0.25s;
          font-family: inherit;
        }
        .nx-drawer-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(102,126,234,0.5);
        }
        .nx-drawer-theme {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 13px;
          background: var(--control-bg);
          border: 1px solid var(--control-bdr);
          border-radius: 14px;
          color: var(--text-3);
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          font-family: inherit;
        }
        .nx-drawer-theme:hover {
          background: rgba(102,126,234,0.1);
          border-color: rgba(102,126,234,0.25);
          color: var(--text);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .nx-links { display: none; }
          .nx-burger { display: flex; }
          .nx-socials { display: none; }
          .nx-sep { display: none; }
        }
        @media (max-width: 640px) {
          .nx-nav-inner { padding: 0 24px; height: 64px; }
          .nx-cta { display: none; }
          .nx-logo-name { font-size: 17px; }
        }
      `}</style>
    </>
  );
}