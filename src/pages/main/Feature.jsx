import { useState } from "react";

const features = [
  {
    id: "payments",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
      </svg>
      
    ),
    tag: "Checkout",
    title: "Lightning-fast payments",
    desc: "Accept cash, card, contactless, and QR payments in under 0.3 seconds. Built-in split billing, refunds, and multi-currency support right out of the box.",
    highlights: ["Tap & Pay", "Split Bills", "Instant Refunds", "Multi-currency"],
    visual: <PaymentVisual />,
    color: "#667eea",
    colorBg: "rgba(102,126,234,0.1)",
  },
  {
    id: "inventory",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    tag: "Stock",
    title: "Real-time inventory control",
    desc: "Track every SKU across all locations in real time. Get low-stock alerts, auto-reorder triggers, and barcode scanning — so you never sell what you don't have.",
    highlights: ["Barcode Scan", "Low-stock Alerts", "Auto Reorder", "SKU Tracking"],
    visual: <InventoryVisual />,
    color: "#86efac",
    colorBg: "rgba(134,239,172,0.1)",
  },
  {
    id: "analytics",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    tag: "Insights",
    title: "AI-powered analytics",
    desc: "From hourly sales trends to best-selling products, get instant reports that help you make smarter stocking and staffing decisions — powered by AI predictions.",
    highlights: ["Sales Trends", "AI Forecasting", "Custom Reports", "Export to PDF"],
    visual: <AnalyticsVisual />,
    color: "#a5b4fc",
    colorBg: "rgba(165,180,252,0.1)",
  },
  {
    id: "multilocation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 0 1 8-8z" />
      </svg>
    ),
    tag: "Locations",
    title: "Manage all branches, one view",
    desc: "Run multiple retail locations from a single dashboard. Sync inventory, pricing, and promotions across all branches instantly — no manual updates needed.",
    highlights: ["Central Dashboard", "Branch Sync", "Per-location Reports", "Unified Pricing"],
    visual: <LocationVisual />,
    color: "#fcd34d",
    colorBg: "rgba(252,211,77,0.1)",
  },
  {
    id: "staff",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    tag: "Team",
    title: "Staff roles & permissions",
    desc: "Assign roles like Cashier, Manager, or Admin with fine-grained permissions. Track each staff member's sales performance and shifts in real time.",
    highlights: ["Role-based Access", "Shift Tracking", "Performance Stats", "PIN Login"],
    visual: <StaffVisual />,
    color: "#f093fb",
    colorBg: "rgba(240,147,251,0.1)",
  },
  {
    id: "loyalty",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    tag: "Loyalty",
    title: "Customer & loyalty engine",
    desc: "Build lasting relationships with a built-in CRM, points-based loyalty program, and targeted promotions. Know your top customers by name and spending habits.",
    highlights: ["Points System", "Customer Profiles", "SMS Promos", "Visit History"],
    visual: <LoyaltyVisual />,
    color: "#fb7185",
    colorBg: "rgba(251,113,133,0.1)",
  },
  {
    id: "kds",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8h2M11 8h6M7 12h4M15 12h2" />
      </svg>
    ),
    tag: "Display",
    title: "Kitchen display system",
    desc: "Orders flow directly from the POS to your kitchen screen — no paper tickets, no miscommunication. Colour-coded urgency levels keep the kitchen running smoothly.",
    highlights: ["Live Order Feed", "Priority Flags", "Prep Timer", "Order History"],
    visual: <KDSVisual />,
    color: "#fdba74",
    colorBg: "rgba(253,186,116,0.1)",
  },
  {
    id: "integrations",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
    tag: "Connect",
    title: "50+ integrations built-in",
    desc: "Connect Stripe, Xero, Shopify, Mailchimp, and more with one click. Your POS becomes the central hub of your entire retail tech stack — zero dev work needed.",
    highlights: ["Stripe", "Xero Accounting", "Shopify Sync", "Open API"],
    visual: <IntegrationsVisual />,
    color: "#67e8f9",
    colorBg: "rgba(103,232,249,0.1)",
  },
];

/* ── Mini Visuals — unchanged ── */
function PaymentVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[{ label: "Visa ···· 4291", amt: "$124.50", status: "Approved", c: "#667eea" },
        { label: "Apple Pay", amt: "$38.00", status: "Approved", c: "#667eea" },
        { label: "Cash", amt: "$20.00", status: "Complete", c: "#86efac" }].map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>{r.label}</span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "monospace" }}>{r.amt}</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: `${r.c}22`, color: r.c, fontWeight: 700, fontFamily: "monospace" }}>{r.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function InventoryVisual() {
  const items = [
    { name: "Blue Denim Jacket", stock: 4, max: 50, alert: true },
    { name: "White Sneakers S42", stock: 23, max: 50, alert: false },
    { name: "Canvas Tote Bag", stock: 2, max: 30, alert: true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${item.alert ? "rgba(252,211,77,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{item.name}</span>
            <span style={{ fontSize: 11, color: item.alert ? "#fcd34d" : "#94a3b8", fontFamily: "monospace" }}>{item.alert ? "⚠ Low" : `${item.stock} units`}</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${(item.stock / item.max) * 100}%`, background: item.alert ? "#fcd34d" : "#86efac", borderRadius: 99 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsVisual() {
  const bars = [40, 65, 50, 80, 60, 90, 75, 95, 70, 88, 62, 100];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        {[{ l: "Revenue", v: "$4,820", c: "#a5b4fc" }, { l: "Orders", v: "184", c: "#667eea" }, { l: "Avg Basket", v: "$26.2", c: "#86efac" }].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.c, fontFamily: "monospace" }}>{s.v}</div>
            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 48 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0", background: i === bars.length - 1 ? "#a5b4fc" : "rgba(165,180,252,0.2)" }} />
        ))}
      </div>
    </div>
  );
}

function LocationVisual() {
  const locs = [
    { name: "Colombo Main", sales: "$2,140" },
    { name: "Kandy Branch", sales: "$980" },
    { name: "Galle Outlet", sales: "$700" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {locs.map((l, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#86efac", boxShadow: "0 0 6px #86efac" }} />
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{l.name}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fcd34d", fontFamily: "monospace" }}>{l.sales}</span>
        </div>
      ))}
    </div>
  );
}

function StaffVisual() {
  const staff = [
    { name: "Kasun P.", role: "Cashier", sales: 42, color: "#667eea" },
    { name: "Nimasha R.", role: "Manager", sales: 68, color: "#f093fb" },
    { name: "Lahiru S.", role: "Cashier", sales: 31, color: "#a5b4fc" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {staff.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{s.name}</div>
            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "monospace" }}>{s.role}</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.sales} sales</div>
        </div>
      ))}
    </div>
  );
}

function LoyaltyVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ padding: "14px", background: "linear-gradient(135deg, rgba(102,126,234,0.12), rgba(240,147,251,0.08))", border: "1px solid rgba(102,126,234,0.25)", borderRadius: 12 }}>
        <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6, fontFamily: "monospace" }}>Top Customer</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Sanduni Perera</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <div><div style={{ fontSize: 18, fontWeight: 700, color: "#fb7185", fontFamily: "monospace" }}>2,450</div><div style={{ fontSize: 10, color: "#475569" }}>Points</div></div>
          <div><div style={{ fontSize: 18, fontWeight: 700, color: "#a5b4fc", fontFamily: "monospace" }}>$1,240</div><div style={{ fontSize: 10, color: "#475569" }}>Lifetime spend</div></div>
          <div><div style={{ fontSize: 18, fontWeight: 700, color: "#86efac", fontFamily: "monospace" }}>38</div><div style={{ fontSize: 10, color: "#475569" }}>Visits</div></div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {["Gold Tier ✦", "SMS Sent ✓", "Promo Active"].map((tag, i) => (
          <span key={i} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 100, background: "rgba(102,126,234,0.1)", border: "1px solid rgba(102,126,234,0.2)", color: "#a5b4fc", fontFamily: "monospace" }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function KDSVisual() {
  const orders = [
    { id: "#042", items: ["Latte ×2", "Toast ×1"], time: "2m", urgent: false },
    { id: "#043", items: ["OJ ×1", "Bagel ×2"], time: "6m", urgent: true },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {orders.map((o, i) => (
        <div key={i} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.03)", border: `1px solid ${o.urgent ? "rgba(253,186,116,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{o.id}</span>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 100, background: o.urgent ? "rgba(253,186,116,0.2)" : "rgba(134,239,172,0.15)", color: o.urgent ? "#fdba74" : "#86efac", fontWeight: 700 }}>{o.time}</span>
          </div>
          {o.items.map((item, j) => (
            <div key={j} style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, fontFamily: "monospace" }}>— {item}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function IntegrationsVisual() {
  const logos = [
    { name: "Stripe", color: "#667eea" },
    { name: "Xero", color: "#67e8f9" },
    { name: "Shopify", color: "#86efac" },
    { name: "Mailchimp", color: "#fcd34d" },
    { name: "Slack", color: "#f093fb" },
    { name: "API", color: "#a5b4fc" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
      {logos.map((l, i) => (
        <div key={i} style={{ padding: "12px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, textAlign: "center", transition: "border-color 0.2s" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${l.color}18`, border: `1px solid ${l.color}30`, margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: l.color, fontFamily: "monospace", letterSpacing: "-0.5px" }}>{l.name[0]}</span>
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>{l.name}</div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturesSection() {
  const [active, setActive] = useState(0);
  const feat = features[active];

  return (
    <>
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
          --green-bg:   rgba(72, 187, 120, 0.2);
          --green-bdr:  rgba(72, 187, 120, 0.3);
          --amber:      #fcd34d;
          --amber-bg:   rgba(251,191,36,0.2);
          --amber-bdr:  rgba(251,191,36,0.3);
        }

        html, body, #root {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--bg-start);
          color: var(--text);
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── SECTION ── */
        .features-section {
          width: 100%;
          padding: 100px 60px 110px;
          background: linear-gradient(180deg, var(--bg-end) 0%, var(--bg-mid) 50%, var(--bg-start) 100%);
          position: relative;
          overflow: hidden;
        }

        /* Grid bg */
        .features-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(102,126,234,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102,126,234,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }

        /* Orbs */
        .feat-orb-a {
          position: absolute;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(102,126,234,0.09) 0%, transparent 70%);
          top: -200px; right: -200px;
          pointer-events: none; z-index: 0;
        }
        .feat-orb-b {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(118,75,162,0.09) 0%, transparent 70%);
          bottom: 0; left: -150px;
          pointer-events: none; z-index: 0;
        }

        /* ── HEADER ── */
        .section-header {
          text-align: center;
          max-width: 620px;
          margin: 0 auto 72px;
          position: relative;
          z-index: 2;
        }
        .section-badge-row {
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
          animation: pulseDot 2s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }

        .section-title {
          font-size: clamp(34px, 3.5vw, 52px);
          font-weight: 900;
          line-height: 1.08;
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
        .section-sub {
          font-size: 16px;
          color: var(--text-2);
          line-height: 1.8;
          font-weight: 400;
        }

        /* Divider */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 280px;
          margin: 28px auto 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(102,126,234,0.4), transparent);
        }
        .divider-diamond { font-size: 14px; color: var(--accent-lit); opacity: 0.7; }

        /* ── LAYOUT ── */
        .features-layout {
          display: flex;
          gap: 28px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          align-items: flex-start;
        }

        /* ── LEFT NAV ── */
        .feat-nav {
          flex: 0 0 256px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: sticky;
          top: 32px;
        }
        .feat-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 14px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: background 0.25s, border-color 0.25s, transform 0.2s;
          position: relative;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .feat-nav-item:hover {
          background: rgba(102,126,234,0.06);
          transform: translateX(2px);
        }
        .feat-nav-item.active {
          background: rgba(102,126,234,0.08);
          border-color: rgba(102,126,234,0.2);
        }
        .feat-nav-active-bar {
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 55%;
          border-radius: 99px;
          opacity: 0;
          transition: opacity 0.25s;
          background: linear-gradient(180deg, var(--accent), var(--accent-2));
        }
        .feat-nav-item.active .feat-nav-active-bar { opacity: 1; }

        .feat-nav-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.25s, box-shadow 0.25s;
        }
        .feat-nav-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-3);
          transition: color 0.25s;
          white-space: nowrap;
          flex: 1;
        }
        .feat-nav-item.active .feat-nav-label { color: var(--text); }

        .feat-nav-tag {
          font-size: 9px;
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 3px 9px;
          border-radius: 100px;
          opacity: 0;
          transition: opacity 0.25s;
          font-weight: 700;
        }
        .feat-nav-item.active .feat-nav-tag { opacity: 1; }

        /* ── RIGHT PANEL ── */
        .feat-panel {
          flex: 1;
          min-height: 460px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(102,126,234,0.06),
            0 30px 70px rgba(0,0,0,0.5);
          animation: panelIn 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .feat-panel-glow {
          position: absolute;
          top: -80px; right: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.2;
          z-index: 0;
        }

        .feat-panel-top {
          padding: 36px 40px 28px;
          border-bottom: 1px solid var(--border);
          position: relative;
          z-index: 1;
        }
        .feat-panel-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 700;
          margin-bottom: 16px;
          padding: 4px 12px 4px 10px;
          border-radius: 100px;
        }
        .feat-panel-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: pulseDot 2s ease-in-out infinite;
        }
        .feat-panel-title {
          font-size: clamp(24px, 2.4vw, 34px);
          font-weight: 900;
          letter-spacing: -0.8px;
          color: var(--text);
          line-height: 1.1;
          max-width: 480px;
          margin-bottom: 14px;
        }
        .feat-panel-desc {
          font-size: 15px;
          color: var(--text-2);
          line-height: 1.8;
          font-weight: 400;
          max-width: 520px;
        }
        .feat-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }
        .feat-highlight {
          font-size: 11px;
          font-family: monospace;
          padding: 5px 13px;
          border-radius: 100px;
          border: 1px solid rgba(102,126,234,0.2);
          color: var(--accent-lit);
          background: rgba(102,126,234,0.08);
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .feat-panel-bottom {
          padding: 28px 40px 36px;
          position: relative;
          z-index: 1;
        }
        .feat-panel-visual-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--text-4);
          margin-bottom: 14px;
          font-family: monospace;
          font-weight: 700;
        }

        /* ── BOTTOM MINI GRID ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          max-width: 1200px;
          margin: 48px auto 0;
          position: relative;
          z-index: 2;
        }
        .feat-mini {
          padding: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 18px;
          cursor: pointer;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s, background 0.25s;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(16px);
        }
        .feat-mini:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
          background: rgba(30, 41, 59, 0.9);
        }
        .feat-mini.active {
          box-shadow: 0 12px 36px rgba(0,0,0,0.35);
        }
        .feat-mini-glow {
          position: absolute;
          bottom: -20px; right: -20px;
          width: 80px; height: 80px;
          border-radius: 50%;
          filter: blur(28px);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .feat-mini:hover .feat-mini-glow,
        .feat-mini.active .feat-mini-glow { opacity: 0.45; }

        .feat-mini-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .feat-mini-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.3;
        }
        .feat-mini-tag {
          margin-top: 6px;
          font-size: 10px;
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-4);
          font-weight: 600;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .features-section { padding: 80px 36px; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .feat-nav { flex: 0 0 220px; }
        }
        @media (max-width: 768px) {
          .features-section { padding: 64px 24px; }
          .features-layout { flex-direction: column; }
          .feat-nav { flex: none; width: 100%; position: static; flex-direction: row; flex-wrap: wrap; }
          .feat-nav-tag { display: none; }
          .feat-panel-top, .feat-panel-bottom { padding: 24px; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <section className="features-section">
        <div className="feat-orb-a" />
        <div className="feat-orb-b" />

        {/* ── Header ── */}
        <div className="section-header">
          <div className="section-badge-row">
            <span className="badge badge-primary">
              <span className="badge-dot" />
              Everything you need
            </span>
            <span className="badge badge-green">⚡ 8 Features</span>
          </div>
          <h2 className="section-title">
            Built for the way{" "}
            <span className="gradient-text">retail actually works</span>
          </h2>
          <p className="section-sub">
            Every feature designed around real retail workflows —
            from the checkout counter to the back office.
          </p>
          <div className="section-divider">
            <div className="divider-line" />
            <span className="divider-diamond">◈</span>
            <div className="divider-line" />
          </div>
        </div>

        {/* ── Main interactive layout ── */}
        <div className="features-layout">

          {/* Left nav */}
          <nav className="feat-nav">
            {features.map((f, i) => (
              <button
                key={f.id}
                className={`feat-nav-item ${active === i ? "active" : ""}`}
                onClick={() => setActive(i)}
              >
                <div
                  className="feat-nav-active-bar"
                  style={{ background: f.color }}
                />
                <div
                  className="feat-nav-icon"
                  style={{
                    background: active === i ? f.colorBg : "rgba(255,255,255,0.04)",
                    color: active === i ? f.color : "var(--text-4)",
                    boxShadow: active === i ? `0 0 16px ${f.color}33` : "none",
                  }}
                >
                  {f.icon}
                </div>
                <span className="feat-nav-label">
                  {f.title.split(" ").slice(0, 3).join(" ")}
                </span>
                <span
                  className="feat-nav-tag"
                  style={{ background: f.colorBg, color: f.color, border: `1px solid ${f.color}33` }}
                >
                  {f.tag}
                </span>
              </button>
            ))}
          </nav>

          {/* Right detail panel */}
          <div className="feat-panel" key={feat.id}>
            <div className="feat-panel-glow" style={{ background: feat.color }} />

            <div className="feat-panel-top">
              <div
                className="feat-panel-eyebrow"
                style={{ background: feat.colorBg, color: feat.color, border: `1px solid ${feat.color}33` }}
              >
                <span className="feat-panel-eyebrow-dot" style={{ background: feat.color }} />
                {feat.tag}
              </div>
              <h3 className="feat-panel-title">{feat.title}</h3>
              <p className="feat-panel-desc">{feat.desc}</p>
              <div className="feat-highlights">
                {feat.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="feat-highlight"
                    style={{ background: `${feat.color}12`, borderColor: `${feat.color}30`, color: feat.color }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="feat-panel-bottom">
              <div className="feat-panel-visual-label">◈ Live preview</div>
              {feat.visual}
            </div>
          </div>
        </div>

        {/* ── Bottom mini grid ── */}
        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={f.id}
              className={`feat-mini ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}
              style={{
                borderColor: active === i ? `${f.color}44` : undefined,
                boxShadow: active === i ? `0 0 0 1px ${f.color}22, 0 12px 36px rgba(0,0,0,0.35)` : undefined,
              }}
            >
              <div className="feat-mini-glow" style={{ background: f.color }} />
              <div
                className="feat-mini-icon"
                style={{ background: f.colorBg, color: f.color }}
              >
                {f.icon}
              </div>
              <div className="feat-mini-title">{f.title}</div>
              <div className="feat-mini-tag" style={{ color: active === i ? f.color : undefined }}>
                {f.tag}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}