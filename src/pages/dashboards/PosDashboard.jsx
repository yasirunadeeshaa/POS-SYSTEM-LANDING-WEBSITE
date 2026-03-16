import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ─── Static Data ──────────────────────────────────────────────────────────────
const DOCUMENTS_COLUMN = {
  key: "documents", label: "Documents", icon: "📄", accent: "#5B3D8F",
  actions: [
    { icon: "🧾", label: "Invoice",      desc: "New invoice",         color: "#5B3D8F", routeTo: "/invoice"       },
    { icon: "📋", label: "Quotation",    desc: "New quotation",       color: "#2B5490", routeTo: "/quotation"     },
    { icon: "📝", label: "Credit Note",  desc: "Issue credit",        color: "#2D6A4F", routeTo: "/credit-note"   },
    { icon: "📌", label: "Debit Note",   desc: "Issue debit",         color: "#B8902A", routeTo: "/debit-note"    },
    { icon: "📦", label: "GRN",          desc: "Goods receipt",       color: "#7A5C1E", routeTo: "/grn" },
    { icon: "💵", label: "Transactions", desc: "Payment ledger",      color: "#2D6A4F", routeTo: "/transactions"  },
    { icon: "🎁", label: "Gift Voucher", desc: "Gift Voucher Manage", color: "#cc6262", routeTo: "/gift-voucher"  },
    { icon: "📊", label: "Reports",      desc: "Reports",             color: "#3088da", routeTo: "/reports"       },
  ],
};

const COLUMN_GROUPS = [
  {
    key: "sales", label: "Sales", icon: "↗", accent: "#2D6A4F",
    primary: [
      { icon: "◷", label: "Hold Sale",      desc: "Park transaction",  color: "#B8902A", badge: "2 held", badgeBg: "#B8902A12", badgeColor: "#7A5C1E", badgeBorder: "#B8902A22" },
      { icon: "⟲", label: "Refund",         desc: "Refund / exchange", color: "#B5372A" },
      { icon: "✦", label: "Discount",       desc: "Apply promo",       color: "#2D6A4F" },
      { icon: "▦", label: "Price Override", desc: "Manual edit",       color: "#B8902A" },
      { icon: "✉", label: "Send Receipt",   desc: "Email / SMS",       color: "#2B5490" },
    ],
    secondary: [],
  },
  {
    key: "inventory", label: "Inventory", icon: "◈", accent: "#2B5490",
    primary: [
      { icon: "📦", label: "Product Management",  desc: "All products",      color: "#2B5490", routeTo: "/productsListView"   },
      { icon: "⚠",  label: "Low Stock",           desc: "Alerts",            color: "#B5372A", routeTo: "/low-stock", badge: "7 alerts", badgeBg: "#B5372A14", badgeColor: "#7A2018", badgeBorder: "#B5372A22" },
      { icon: "🏷",  label: "Category Management", desc: "Manage categories", color: "#2D6A4F", routeTo: "/categoryManagement" },
      { icon: "◈",  label: "Receive Stock",        desc: "Incoming stock",    color: "#5B3D8F" },
      { icon: "⇄",  label: "Transfer Stock",       desc: "Move stock",        color: "#7A5C1E" },
      { icon: "☑",  label: "Stock Count",          desc: "Stocktake",         color: "#2B5490" },
      { icon: "📑", label: "Purchase Orders",      desc: "Create PO",         color: "#818cf8", routeTo: "/purchase-order" },
    ],
    secondary: [],
  },
  {
    key: "history", label: "History", icon: "📅", accent: "#218dbe",
    primary: [
      { icon: "🧾", label: "Sales",             desc: "Past sales",        color: "#2070c8", routeTo: "/sales-history",        badge: "142 today", badgeBg: "#60a5fa12", badgeColor: "#1a5fa0", badgeBorder: "#60a5fa22" },
      { icon: "📋", label: "Quotation History", desc: "Quotation history", color: "#2B5490", routeTo: "/quotationHistory"      },
      { icon: "📋", label: "Purchase Order History", desc: "Purchase order history", color: "#2B5490", routeTo: "/purchase-order-history"      },
      { icon: "📄", label: "Invoices",          desc: "Invoice records",   color: "#0e7fa8", routeTo: "/invoice-history"       },
      { icon: "⊗",  label: "Void Sales",        desc: "Cancelled sales",   color: "#c0392b", routeTo: "/void-history"          },
      { icon: "↩",  label: "Refunds",           desc: "Refunds log",       color: "#9b30a8", routeTo: "/refund-history"        },
      { icon: "📦", label: "Stock In",          desc: "Received stock",    color: "#5a6bb0", routeTo: "/receive-stock-history" },
      { icon: "⇄",  label: "Transfers",         desc: "Stock transfers",   color: "#7c3aed", routeTo: "/transfer-history"      },
      { icon: "☑",  label: "Stock Count",       desc: "Stocktake records", color: "#0891b2", routeTo: "/stock-count-history"   },
      { icon: "💰", label: "Register",          desc: "Cash register log", color: "#64748b", routeTo: "/register-history"      },//purchase-order-history
    ],
    secondary: [],
  },
];

const SECTIONS = [
  {
    key: "customers", label: "Customers", icon: "⌂", accent: "#5B3D8F",
    actions: [
      { icon: "⌂",  label: "Customer Management", desc: "CRM lookup",       color: "#5B3D8F", routeTo: "/customerManagement" },
      { icon: "➕", label: "Customer Accounts",   desc: "Manage customers", color: "#2D6A4F", routeTo: "/add-customer"        },
    ],
  },
  {
    key: "suppliers", label: "Suppliers", icon: "🏭", accent: "#a78bfa",
    actions: [
      { icon: "🏭", label: "Supplier Management", desc: "Manage suppliers",         color: "#a78bfa", routeTo: "/supplierManagement" },
      { icon: "➕", label: "Supplier Accounts",   desc: "Manage supplier accounts", color: "#c084fc", routeTo: "/supplierAccount"    },
    ],
  },
  {
    key: "register", label: "Register", icon: "⊕", accent: "#2D6A4F",
    actions: [
      { icon: "⊕",  label: "Open Register",  desc: "Start till",  color: "#2D6A4F" },
      { icon: "⊟",  label: "Close Register", desc: "Cash up",     color: "#9E9080" },
      { icon: "💵", label: "Cash Mgmt",      desc: "Cash in/out", color: "#2D6A4F" },
      { icon: "⊜",  label: "End of Day",    desc: "EOD report",  color: "#5B3D8F" },
    ],
  },
  {
    key: "settings", label: "Settings", icon: "⚙", accent: "#9E9080",
    actions: [
      { icon: "⚙",  label: "System", desc: "POS config",     color: "#9E9080", routeTo: "/settings" },
      { icon: "👥", label: "Users",  desc: "Manage staff",   color: "#2B5490"                        },
      { icon: "🔐", label: "Roles",  desc: "Access control", color: "#5B3D8F"                        },
    ],
  },
];

const REPORTS_DATA = [
  { icon: "📊", label: "Sales Report",     desc: "Daily / weekly sales",     color: "#2B5490" },
  { icon: "📈", label: "Profit Report",    desc: "Profit & loss analysis",   color: "#2D6A4F" },
  { icon: "📦", label: "Inventory Report", desc: "Stock insights",           color: "#B8902A" },
  { icon: "⊜",  label: "Analysis",        desc: "Full analytics dashboard", color: "#7A5C1E", routeTo: "/analysis" },
  { icon: "👥", label: "Staff Report",     desc: "Performance overview",     color: "#5B3D8F" },
  { icon: "💰", label: "Cash Report",      desc: "Register summary",         color: "#2D6A4F" },
];

const NOTIFICATIONS = [
  { color: "#ef4444", title: "Low stock: USB-C Hub (3 left)",   time: "2 min ago"  },
  { color: "#eab308", title: "Refund approved — TXN-8818",      time: "18 min ago" },
  { color: "#3b82f6", title: "Shift started — Aria K. on R-01", time: "1h ago"     },
  { color: "#22c55e", title: "Daily target 65% reached",         time: "2h ago"     },
  { color: "#eab308", title: "End-of-day report due at 9 PM",   time: "Reminder"   },
];

const TOP_ITEMS = [
  { rank: 1, name: "Wireless Headset",  sold: 24, revenue: 1440 },
  { rank: 2, name: "USB-C Hub",         sold: 18, revenue: 900  },
  { rank: 3, name: "Phone Case Pro",    sold: 15, revenue: 450  },
  { rank: 4, name: "Screen Protector",  sold: 12, revenue: 180  },
];

const PAYMENT_METHODS = [
  { label: "Card",       pct: 68, amount: 5156, color: "#5B3D8F" },
  { label: "Cash",       pct: 22, amount: 1668, color: "#2D6A4F" },
  { label: "QR / Online", pct: 10, amount: 758, color: "#2B5490" },
];

const PENDING = [
  { dot: "#ef4444", title: "2 POs awaiting approval", sub: "Purchase orders"    },
  { dot: "#eab308", title: "3 held sales",             sub: "Resume or cancel"  },
  { dot: "#eab308", title: "EOD report due",           sub: "Due at 9:00 PM"    },
  { dot: "#3b82f6", title: "4 unpaid invoices",        sub: "Overdue by 2 days" },
];

const STAFF = [
  { initials: "AK", name: "Aria K.",  post: "Register 01", color: "#2B5490", status: "#22c55e" },
  { initials: "MR", name: "Marco R.", post: "Register 02", color: "#5B3D8F", status: "#22c55e" },
  { initials: "JS", name: "Jay S.",   post: "Floor",        color: "#B8902A", status: "#eab308" },
  { initials: "PL", name: "Priya L.", post: "Stockroom",    color: "#2D6A4F", status: "#22c55e" },
];

const ACTIVITY = [
  { dot: "#22c55e", title: "Sale #1042",      sub: "$84.50 · Aria K.",   time: "2m"  },
  { dot: "#ef4444", title: "Refund #318",     sub: "$22.00 · TXN-8818",  time: "18m" },
  { dot: "#3b82f6", title: "Invoice #229",    sub: "$340.00 · drafted",  time: "34m" },
  { dot: "#eab308", title: "Low Stock Alert", sub: "USB-C Hub · 3 left", time: "1h"  },
  { dot: "#22c55e", title: "Sale #1041",      sub: "$128.00 · Marco R.", time: "1h"  },
];

const SHIFT_NOTES = [
  { text: "Printer on R-02 is slow",      author: "Aria K.",  time: "10:30 AM", color: "#B8902A" },
  { text: "Restock tissue paper aisle 3", author: "Marco R.", time: "9:15 AM",  color: "#2B5490" },
];

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Geist+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.15} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes dropIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
  @keyframes modalIn { from{opacity:0;transform:scale(.97) translateY(6px)} to{opacity:1;transform:none} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:none} }

  .row-tile {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 8px; border-radius: 9px; cursor: pointer;
    background: transparent; border: 1px solid transparent;
    width: 100%; text-align: left; font-family: 'DM Sans', sans-serif;
    transition: all 0.15s; margin-bottom: 2px; animation: fadeUp 0.2s ease both;
  }
  .row-tile:hover { background: #fff; border-color: rgba(26,22,17,0.09); transform: translateX(2px); box-shadow: 0 2px 10px rgba(26,22,17,0.06); }
  .row-tile:hover .rt-arrow { opacity: 1; transform: translateX(0); }
  .row-tile:hover .rt-icon  { transform: scale(1.06); }
  .rt-icon  { transition: transform 0.15s; }
  .rt-arrow { font-size: 11px; color: #C8BFB4; opacity: 0; transform: translateX(-4px); transition: all 0.15s; flex-shrink: 0; }

  .prime-tile {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px;
    border-radius: 10px; cursor: pointer; width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s; margin-bottom: 5px;
  }
  .prime-tile:hover { transform: translateX(2px); filter: brightness(1.03); }
  .prime-tile:hover .prime-icon { transform: scale(1.06); }
  .prime-icon { transition: transform 0.15s; }

  .sec-divider {
    display: flex; align-items: center; gap: 7px; font-size: 8px; font-weight: 700;
    letter-spacing: 1.8px; text-transform: uppercase; color: #9B8E80;
    padding: 7px 6px 3px; font-family: 'DM Sans', sans-serif;
  }
  .sec-divider::after { content: ''; flex: 1; height: 1px; background: rgba(26,22,17,0.07); }

  .sec-col {
    display: flex; flex-direction: column; background: #FDFBF5; border: 1px solid #E4DDD3;
    border-radius: 14px; overflow: hidden; height: 100%;
    box-shadow: 0 1px 4px rgba(26,22,17,0.04); transition: box-shadow 0.2s;
  }
  .sec-col:hover { box-shadow: 0 6px 24px rgba(26,22,17,0.08), 0 1px 4px rgba(26,22,17,0.04); }

  .rc-tile {
    display: flex; align-items: center; gap: 8px; padding: 7px 9px; border-radius: 8px;
    cursor: pointer; background: rgba(255,255,255,0.52); border: 1px solid rgba(26,22,17,0.07);
    font-family: 'DM Sans', sans-serif; transition: all 0.14s; width: 100%;
    position: relative; overflow: hidden; animation: slideIn 0.2s ease both;
  }
  .rc-tile::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2.5px; background: var(--tile-accent, transparent); opacity: 0; transition: opacity 0.15s; border-radius: 0; }
  .rc-tile:hover { background: #fff; border-color: rgba(26,22,17,0.12); box-shadow: 0 2px 8px rgba(26,22,17,0.08); transform: translateY(-1px); }
  .rc-tile:hover::before { opacity: 1; }

  .tb-btn {
    width: 32px; height: 32px; border-radius: 7px; background: rgba(244,241,233,0.05);
    border: 1px solid rgba(244,241,233,0.09); color: rgba(244,241,233,0.42); cursor: pointer;
    font-size: 14px; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s;
  }
  .tb-btn:hover { background: rgba(244,241,233,0.12); color: rgba(244,241,233,0.8); }
  .notif-row:hover { background: #F5F0E8; }
  .report-tile { transition: all 0.15s !important; }
  .report-tile:hover { background: #fff !important; border-color: var(--rt-c, #E4DDD3) !important; transform: translateY(-1px) !important; box-shadow: 0 4px 16px rgba(26,22,17,0.08) !important; }

  .col-scroll::-webkit-scrollbar { width: 3px; }
  .col-scroll::-webkit-scrollbar-track { background: transparent; }
  .col-scroll::-webkit-scrollbar-thumb { background: rgba(26,22,17,0.1); border-radius: 3px; }

  .kpi-card { background: rgba(255,255,255,0.6); border: 1px solid rgba(26,22,17,0.08); border-radius: 8px; padding: 6px 12px; text-align: right; backdrop-filter: blur(4px); transition: background 0.15s, box-shadow 0.15s; }
  .kpi-card:hover { background: rgba(255,255,255,0.85); box-shadow: 0 2px 10px rgba(26,22,17,0.07); }

  .doc-tile {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; padding: 14px 8px; border-radius: 11px; cursor: pointer; width: 100%;
    text-align: center; transition: all 0.16s; position: relative; overflow: hidden;
    min-height: 88px; font-family: 'DM Sans', sans-serif; animation: fadeUp 0.2s ease both;
  }
  .doc-tile:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(26,22,17,0.08); filter: brightness(1.03); }
  .doc-tile:hover .doc-icon { transform: scale(1.08); }
  .doc-icon { transition: transform 0.15s; }

  /* ── Widget card (cols 6 & 7) ── */
  .w-card { background: #FDFBF5; border: 1px solid #E4DDD3; border-radius: 12px; overflow: hidden; flex-shrink: 0; box-shadow: 0 1px 4px rgba(26,22,17,0.04); }
  .w-head { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px 7px; border-bottom: 1px solid rgba(26,22,17,0.055); background: linear-gradient(180deg,#FDFBF5 0%,rgba(253,251,245,0.6) 100%); }
  .w-body { padding: 8px 10px; background: rgba(245,242,236,0.35); }
  .w-row { display: flex; align-items: center; justify-content: space-between; padding: 5px 2px; border-bottom: 1px solid rgba(26,22,17,0.04); font-family: 'DM Sans', sans-serif; }
  .w-row:last-child { border-bottom: none; }
  .w-item { display: flex; align-items: center; gap: 8px; padding: 5px 6px; border-radius: 7px; background: rgba(255,255,255,0.6); border: 1px solid rgba(26,22,17,0.06); margin-bottom: 4px; font-family: 'DM Sans', sans-serif; }
  .w-item:last-child { margin-bottom: 0; }
  .progress-bg { height: 4px; background: rgba(26,22,17,0.07); border-radius: 4px; overflow: hidden; margin-top: 4px; }
  .progress-fill { height: 100%; border-radius: 4px; }
`;

// ─── Shared widget card header ────────────────────────────────────────────────
function WHead({ accent, icon, label, badge, badgeStyle }) {
  return (
    <div>
      <div style={{ height: 2, background: `linear-gradient(90deg,${accent} 0%,transparent 65%)`, opacity: 0.75 }} />
      <div className="w-head">
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: accent + "12", border: `1px solid ${accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: accent }}>{icon}</div>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 12.5, fontWeight: 700, color: "#1A1611" }}>{label}</span>
        </div>
        {badge !== undefined && (
          <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 20, ...badgeStyle }}>{badge}</span>
        )}
      </div>
    </div>
  );
}

// ─── Col 6 widgets ────────────────────────────────────────────────────────────

function TopItems() {
  return (
    <div className="w-card">
      <WHead accent="#2D6A4F" icon="🏆" label="Top Items" badge="today" badgeStyle={{ color: "#9B8E80" }} />
      <div className="w-body">
        {TOP_ITEMS.map((item) => (
          <div key={item.rank} className="w-row">
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 16, fontSize: 8.5, fontWeight: 700, color: item.rank === 1 ? "#D1A534" : "#9B8E80", textAlign: "center" }}>#{item.rank}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#1A1611" }}>{item.name}</div>
                <div style={{ fontSize: 8.5, color: "#9B8E80" }}>{item.sold} sold</div>
              </div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#2D6A4F", fontFamily: "monospace" }}>${item.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentMethods() {
  return (
    <div className="w-card">
      <WHead accent="#5B3D8F" icon="💳" label="Payments" badge="142 txns" badgeStyle={{ color: "#9B8E80" }} />
      <div className="w-body" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {PAYMENT_METHODS.map((m) => (
          <div key={m.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 9.5, fontWeight: 600, color: "#1A1611", fontFamily: "'DM Sans',sans-serif" }}>{m.label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: m.color, fontFamily: "monospace" }}>{m.pct}% · ${m.amount.toLocaleString()}</span>
            </div>
            <div className="progress-bg"><div className="progress-fill" style={{ width: `${m.pct}%`, background: m.color }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingTasks() {
  return (
    <div className="w-card">
      <WHead accent="#B8902A" icon="📋" label="Pending"
        badge={`${PENDING.length} items`} badgeStyle={{ background: "#B5372A14", color: "#7A2018", border: "1px solid #B5372A22" }} />
      <div className="w-body" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {PENDING.map((p, i) => (
          <div key={i} className="w-item">
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.dot, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#1A1611" }}>{p.title}</div>
              <div style={{ fontSize: 8.5, color: "#9B8E80", marginTop: 1 }}>{p.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoreStatus() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diffMs = new Date().setHours(21, 0, 0, 0) - time;
  const hrs  = Math.max(0, Math.floor(diffMs / 3600000));
  const mins = Math.max(0, Math.floor((diffMs % 3600000) / 60000));
  const rows = [
    { l: "Hours today",    v: "9:00 AM – 9:00 PM", c: "#1A1611" },
    { l: "Closing in",     v: `${hrs}h ${mins}m`,  c: "#B8902A" },
    { l: "Registers open", v: "2 of 3",             c: "#2D6A4F" },
    { l: "Last backup",    v: "12 min ago",          c: "#1A1611" },
  ];
  return (
    <div className="w-card">
      <WHead accent="#9E9080" icon="🏪" label="Store Status"
        badge="OPEN" badgeStyle={{ background: "#2D6A4F14", color: "#1A4533", border: "1px solid #2D6A4F22" }} />
      <div className="w-body">
        {rows.map(({ l, v, c }) => (
          <div key={l} className="w-row">
            <span style={{ fontSize: 9.5, color: "#9B8E80", fontFamily: "'DM Sans',sans-serif" }}>{l}</span>
            <span style={{ fontSize: 9.5, fontWeight: 600, color: c, fontFamily: "'DM Sans',sans-serif" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Col 7 widgets ────────────────────────────────────────────────────────────

function ShiftNotes({ onAdd }) {
  return (
    <div className="w-card">
      <div>
        <div style={{ height: 2, background: "linear-gradient(90deg,#218dbe 0%,transparent 65%)", opacity: 0.75 }} />
        <div className="w-head">
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: "#218dbe12", border: "1px solid #218dbe20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#218dbe" }}>📝</div>
            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 12.5, fontWeight: 700, color: "#1A1611" }}>Shift Notes</span>
          </div>
          <button onClick={onAdd} style={{ fontSize: 9, color: "#218dbe", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>+ Add</button>
        </div>
      </div>
      <div className="w-body" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {SHIFT_NOTES.map((n, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(26,22,17,0.07)", borderRadius: "0 7px 7px 0", borderLeft: `3px solid ${n.color}`, padding: "7px 8px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#1A1611" }}>{n.text}</div>
            <div style={{ fontSize: 8.5, color: "#9B8E80", marginTop: 2 }}>{n.author} · {n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveStaff() {
  return (
    <div className="w-card">
      <WHead accent="#2B5490" icon="👥" label="Staff On Shift"
        badge="4 active" badgeStyle={{ background: "#2D6A4F12", border: "1px solid #2D6A4F20", color: "#2D6A4F" }} />
      <div className="w-body" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {STAFF.map((s) => (
          <div key={s.initials} className="w-item">
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.color + "18", border: `1.5px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "#1A1611" }}>{s.name}</div>
              <div style={{ fontSize: 8.5, color: "#9B8E80" }}>{s.post}</div>
            </div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.status, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TodaysSales({ revenue, txnCount }) {
  const avgBasket = Math.round(revenue / txnCount);
  const stats = [
    { l: "Revenue", v: `$${fmt(revenue)}`, c: "#1A1611" },
    { l: "Orders",  v: txnCount,            c: "#2D6A4F" },
    { l: "Returns", v: 3,                   c: "#B5372A" },
    { l: "Avg",     v: `$${avgBasket}`,     c: "#1A1611" },
  ];
  return (
    <div className="w-card">
      <WHead accent="#2D6A4F" icon="📊" label="Today's Sales"
        badge="LIVE" badgeStyle={{ background: "#2D6A4F12", border: "1px solid #2D6A4F22", color: "#2D6A4F" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "8px 10px 4px" }}>
        {stats.map(({ l, v, c }) => (
          <div key={l} style={{ background: "#fff", border: "1px solid rgba(26,22,17,0.07)", borderRadius: 8, padding: "7px 9px" }}>
            <div style={{ fontSize: 8, color: "#9B8E80", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{l}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c, marginTop: 2, fontFamily: "monospace" }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "4px 10px 9px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 8.5, color: "#9B8E80", fontFamily: "'DM Sans',sans-serif" }}>Daily target</span>
          <span style={{ fontSize: 8.5, fontWeight: 700, color: "#2D6A4F", fontFamily: "'DM Sans',sans-serif" }}>65%</span>
        </div>
        <div className="progress-bg"><div className="progress-fill" style={{ width: "65%", background: "#2D6A4F" }} /></div>
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="w-card">
      <WHead accent="#B8902A" icon="⚡" label="Recent Activity" />
      <div className="w-body">
        {ACTIVITY.map((a, i) => (
          <div key={i} className="w-row">
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#1A1611" }}>{a.title}</div>
                <div style={{ fontSize: 8.5, color: "#9B8E80" }}>{a.sub}</div>
              </div>
            </div>
            <span style={{ fontSize: 8, color: "#C8BFB4", fontFamily: "'DM Sans',sans-serif" }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Core tile components ─────────────────────────────────────────────────────
function DocTile({ action, delay = 0, onClick }) {
  return (
    <button className="doc-tile" style={{ background: action.color + "0E", border: `1.5px solid ${action.color}28`, animationDelay: `${delay}ms` }} onClick={onClick}>
      <div className="doc-icon" style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: action.color + "16", border: `1.5px solid ${action.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: action.color }}>{action.icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1611", lineHeight: 1.25, textAlign: "center" }}>{action.label}</div>
        <div style={{ fontSize: 11, color: "#9B8E80", marginTop: 2, textAlign: "center" }}>{action.desc}</div>
      </div>
    </button>
  );
}

function RowTile({ action, delay = 0, onClick }) {
  return (
    <button className="row-tile" style={{ animationDelay: `${delay}ms` }} onClick={onClick}>
      <div className="rt-icon" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: action.color + "14", border: `1.5px solid ${action.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: action.color }}>{action.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1A1611", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.label}</div>
        <div style={{ fontSize: 9.5, color: "#9B8E80", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.desc}</div>
      </div>
      {action.badge && (
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.4, padding: "2px 6px", borderRadius: 20, flexShrink: 0, background: action.badgeBg || action.color + "14", color: action.badgeColor || action.color, border: `1px solid ${action.badgeBorder || action.color + "22"}`, whiteSpace: "nowrap" }}>{action.badge}</span>
      )}
      <span className="rt-arrow">›</span>
    </button>
  );
}

function PrimeTile({ action, delay = 0, onClick }) {
  if (action.solid) {
    return (
      <button className="prime-tile" style={{ background: action.color, border: `1.5px solid ${action.color}`, animationDelay: `${delay}ms`, animation: "fadeUp 0.2s ease both" }} onClick={onClick}>
        <div className="prime-icon" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{action.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{action.label}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{action.desc}</div>
        </div>
        <span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>›</span>
      </button>
    );
  }
  return (
    <button className="prime-tile" style={{ background: action.color + "12", border: `1.5px solid ${action.color}30`, animationDelay: `${delay}ms`, animation: "fadeUp 0.2s ease both" }} onClick={onClick}>
      <div className="prime-icon" style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: action.color + "18", border: `1.5px solid ${action.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: action.color }}>{action.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1A1611", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.label}</div>
        <div style={{ fontSize: 10, color: "#9B8E80", marginTop: 2 }}>{action.desc}</div>
      </div>
      {action.badge && (
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.4, padding: "2px 6px", borderRadius: 20, flexShrink: 0, background: action.badgeBg || action.color + "14", color: action.badgeColor || action.color, border: `1px solid ${action.badgeBorder || action.color + "22"}`, whiteSpace: "nowrap" }}>{action.badge}</span>
      )}
    </button>
  );
}

function ColHeader({ accent, icon, label, count }) {
  return (
    <>
      <div style={{ height: 3, flexShrink: 0, background: `linear-gradient(90deg,${accent},${accent}55,transparent)`, borderRadius: "14px 14px 0 0" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px 10px", borderBottom: "1px solid rgba(26,22,17,0.05)", background: "linear-gradient(180deg,#fff 0%,rgba(253,251,245,0.7) 100%)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: accent + "13", border: `1px solid ${accent}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: accent, flexShrink: 0 }}>{icon}</div>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 14.5, fontWeight: 700, color: "#1A1611", letterSpacing: 0.15 }}>{label}</span>
        </div>
        <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 0.8, padding: "2px 7px", borderRadius: 20, background: accent + "12", border: `1px solid ${accent}22`, color: accent }}>{count}</span>
      </div>
    </>
  );
}

function DocumentsColumn({ onAction }) {
  const col = DOCUMENTS_COLUMN;
  return (
    <div className="sec-col">
      <ColHeader accent={col.accent} icon={col.icon} label={col.label} count={col.actions.length} />
      <div className="col-scroll" style={{ flex: 1, overflowY: "auto", padding: "9px", background: "rgba(245,242,236,0.25)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, alignContent: "start" }}>
        {col.actions.map((action, i) => (
          <DocTile key={action.label} action={action} delay={i * 22} onClick={() => onAction(action)} />
        ))}
      </div>
    </div>
  );
}

function MainColumn({ colData, onAction }) {
  const total = colData.primary.length + colData.secondary.length;
  return (
    <div className="sec-col">
      <ColHeader accent={colData.accent} icon={colData.icon} label={colData.label} count={total} />
      <div className="col-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px", background: "rgba(245,242,236,0.25)" }}>
        {colData.primary.map((action, i) => (
          <PrimeTile key={action.label} action={action} delay={i * 22} onClick={() => onAction(action)} />
        ))}
        {colData.secondary.length > 0 && (
          <>
            <div className="sec-divider" style={{ marginTop: 4 }}>More</div>
            {colData.secondary.map((action, i) => (
              <RowTile key={action.label} action={action} delay={(colData.primary.length + i) * 22} onClick={() => onAction(action)} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function RcTile({ action, delay = 0, onClick }) {
  return (
    <button className="rc-tile" style={{ "--tile-accent": action.color, animationDelay: `${delay}ms` }} onClick={onClick}>
      <div style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, background: action.color + "15", border: `1px solid ${action.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: action.color }}>{action.icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#1A1611", lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.label}</div>
        <div style={{ fontSize: 9, color: "#9B8E80", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.desc}</div>
      </div>
    </button>
  );
}

function RightSection({ sectionKey, onAction }) {
  const section = SECTIONS.find((s) => s.key === sectionKey);
  if (!section) return null;
  return (
    <div className="w-card">
      <div>
        <div style={{ height: 2, background: `linear-gradient(90deg,${section.accent} 0%,transparent 65%)`, opacity: 0.75 }} />
        <div className="w-head">
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: section.accent + "12", border: `1px solid ${section.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: section.accent }}>{section.icon}</div>
            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 12.5, fontWeight: 700, color: "#1A1611" }}>{section.label}</span>
          </div>
          <span style={{ fontSize: 8.5, fontWeight: 700, padding: "1px 6px", borderRadius: 20, background: section.accent + "12", border: `1px solid ${section.accent}20`, color: section.accent }}>{section.actions.length}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "7px 8px", background: "rgba(245,242,236,0.35)" }}>
        {section.actions.map((action, i) => (
          <RcTile key={action.label} action={action} delay={i * 16} onClick={() => onAction(action)} />
        ))}
      </div>
    </div>
  );
}

function KpiCard({ label, value, valueColor }) {
  return (
    <div className="kpi-card">
      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#9B8E80" }}>{label}</div>
      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, fontWeight: 600, color: valueColor || "#1A1611", marginTop: 1 }}>{value}</div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function POSDashboard() {
  const navigate = useNavigate();
  const [revenue,      setRevenue]      = useState(6482.4);
  const [txnCount]                      = useState(142);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [reportOpen,   setReportOpen]   = useState(false);
  const [toastMsg,     setToastMsg]     = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.72) setRevenue((v) => +(v + Math.random() * 14).toFixed(2));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") { setNotifOpen(false); setReportOpen(false); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const showToast = useCallback((msg) => {
    setToastMsg(msg); setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2400);
  }, []);

  const handleAction = useCallback((action) => {
    if (action.routeTo) navigate(action.routeTo);
    else showToast(`${action.label} — coming soon`);
  }, [navigate, showToast]);

  const avgBasket = (revenue / txnCount).toFixed(2);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#EEE8DF", overflow: "hidden" }}>

        {/* ── TOP BAR ── */}
        <header style={{ height: 54, flexShrink: 0, background: "#1A1611", borderBottom: "1px solid rgba(181,138,36,0.35)", boxShadow: "0 1px 0 rgba(181,138,36,0.1),0 2px 18px rgba(26,22,17,0.32)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "relative", zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(181,138,36,0.1)", border: "1.5px solid rgba(181,138,36,0.42)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 700, color: "#D1A534" }}>N</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 17, fontWeight: 600, color: "#F4F1E9", letterSpacing: 0.2 }}>Nexus POS</div>
                <div style={{ fontSize: 7.5, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(181,138,36,0.6)", marginTop: -1 }}>Admin · Retail</div>
              </div>
            </div>
            <div style={{ width: 1, height: 20, background: "rgba(244,241,233,0.08)" }} />
            <div style={{ fontSize: 10.5, fontWeight: 500, color: "rgba(244,241,233,0.32)", background: "rgba(244,241,233,0.04)", border: "1px solid rgba(244,241,233,0.07)", borderRadius: 6, padding: "3px 10px" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", background: "rgba(42,101,73,0.14)", border: "1px solid rgba(42,101,73,0.3)", borderRadius: 20, fontSize: 9.5, fontWeight: 700, color: "#3C8A62", letterSpacing: 0.8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#3C8A62", display: "inline-block", animation: "blink 1.5s ease-in-out infinite" }} />
              LIVE
            </div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, fontWeight: 600, color: "rgba(244,241,233,0.42)", background: "rgba(244,241,233,0.04)", border: "1px solid rgba(244,241,233,0.07)", borderRadius: 6, padding: "3px 10px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 7.5, letterSpacing: 2, textTransform: "uppercase", color: "rgba(181,138,36,0.65)", fontWeight: 700 }}>TODAY</span>
              ${fmt(revenue)}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setReportOpen(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 7, background: "rgba(181,138,36,0.1)", border: "1.5px solid rgba(181,138,36,0.38)", color: "#D1A534", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 700, transition: "background 0.15s,border-color 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(181,138,36,0.18)"; e.currentTarget.style.borderColor = "rgba(181,138,36,0.55)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(181,138,36,0.1)"; e.currentTarget.style.borderColor = "rgba(181,138,36,0.38)"; }}>
              📊 Reports
            </button>
            <div style={{ width: 1, height: 20, background: "rgba(244,241,233,0.08)" }} />
            <button className="tb-btn" onClick={() => setNotifOpen((v) => !v)} style={{ position: "relative" }}>
              🔔
              <span style={{ position: "absolute", top: -3, right: -3, width: 13, height: 13, background: "#B03428", borderRadius: "50%", border: "2px solid #1A1611", fontSize: 6.5, color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>5</span>
            </button>
            <button className="tb-btn">⚙</button>
            <div style={{ width: 32, height: 32, borderRadius: 7, border: "1.5px solid rgba(181,138,36,0.3)", background: "rgba(181,138,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',Georgia,serif", fontSize: 13, fontWeight: 600, color: "#D1A534", cursor: "pointer" }}>AD</div>
          </div>
          {notifOpen && (
            <div style={{ position: "absolute", top: 62, right: 50, width: 290, background: "#FDFBF5", border: "1px solid #E4DDD3", borderRadius: 11, boxShadow: "0 8px 32px rgba(26,22,17,0.14),0 2px 8px rgba(26,22,17,0.06)", zIndex: 200, overflow: "hidden", animation: "dropIn 0.18s ease" }}>
              <div style={{ padding: "9px 14px 8px", background: "#1A1611", borderBottom: "1px solid rgba(181,138,36,0.25)", fontSize: 8, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#B58A24" }}>Notifications</div>
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} className="notif-row" style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid #EDE8DF" : "none", cursor: "pointer", transition: "background 0.12s" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1A1611", lineHeight: 1.4 }}>{n.title}</div>
                    <div style={{ fontSize: 9.5, color: "#9B8E80", marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* ── PAGE TITLE ── */}
        <div style={{ flexShrink: 0, padding: "12px 20px 0", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 700, color: "#1A1611", letterSpacing: -0.3, lineHeight: 1 }}>Operations Dashboard</div>
            <div style={{ fontSize: 10, color: "#9B8E80", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginTop: 3 }}>Point of Sale · Command Centre</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <KpiCard label="Transactions" value={txnCount}          valueColor="#2D6A4F" />
            <KpiCard label="Avg. Basket"  value={`$${avgBasket}`}                        />
            <KpiCard label="Low Stock"    value="7 items"           valueColor="#B8902A" />
            <KpiCard label="Staff Active" value="4"                 valueColor="#2D6A4F" />
          </div>
        </div>

        {/* ── BODY: 7 columns ── */}
        <div style={{
          flex: 1, overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 240px 220px 220px",
          gap: 8,
          padding: "10px 14px 12px",
        }}>
          {/* Col 1 — Documents */}
          <DocumentsColumn onAction={handleAction} />

          {/* Cols 2–4 — Sales, Inventory, History */}
          {COLUMN_GROUPS.map((col) => (
            <MainColumn key={col.key} colData={col} onAction={handleAction} />
          ))}

          {/* Col 5 — Customers / Suppliers / Register / Settings */}
          <div className="col-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflowY: "auto" }}>
            <RightSection sectionKey="customers" onAction={handleAction} />
            <RightSection sectionKey="suppliers" onAction={handleAction} />
            <RightSection sectionKey="register"  onAction={handleAction} />
            <RightSection sectionKey="settings"  onAction={handleAction} />
          </div>

          {/* Col 6 — Top Items / Payments / Pending / Store Status */}
          <div className="col-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflowY: "auto" }}>
            <TopItems />
            <PaymentMethods />
            <PendingTasks />
            <StoreStatus />
          </div>

          {/* Col 7 — Shift Notes / Staff / Today's Sales / Recent Activity */}
          <div className="col-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflowY: "auto" }}>
            <ShiftNotes onAdd={() => showToast("Add note — coming soon")} />
            <ActiveStaff />
            <TodaysSales revenue={revenue} txnCount={txnCount} />
            <RecentActivity />
          </div>
        </div>

        {/* ── REPORTS MODAL ── */}
        {reportOpen && (
          <div onClick={() => setReportOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(26,22,17,0.6)", backdropFilter: "blur(3px)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#FDFBF5", border: "1px solid #E4DDD3", borderRadius: 16, width: "100%", maxWidth: 540, overflow: "hidden", boxShadow: "0 24px 64px rgba(26,22,17,0.22),0 6px 20px rgba(26,22,17,0.1)", animation: "modalIn 0.22s cubic-bezier(.16,1,.3,1)" }}>
              <div style={{ padding: "18px 22px 16px", background: "#1A1611", borderBottom: "1px solid rgba(181,138,36,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 7.5, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(181,138,36,0.65)", marginBottom: 4 }}>Analytics · Reporting</div>
                  <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 21, fontWeight: 600, color: "#F4F1E9" }}>Reports &amp; Analysis</div>
                </div>
                <button onClick={() => setReportOpen(false)} style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(244,241,233,0.06)", border: "1px solid rgba(244,241,233,0.1)", color: "rgba(244,241,233,0.5)", cursor: "pointer", fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s,color 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,241,233,0.14)"; e.currentTarget.style.color = "rgba(244,241,233,0.9)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(244,241,233,0.06)"; e.currentTarget.style.color = "rgba(244,241,233,0.5)"; }}>×</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 18 }}>
                {REPORTS_DATA.map((r, i) => (
                  <button key={r.label} className="report-tile" onClick={() => { r.routeTo ? navigate(r.routeTo) : showToast(`${r.label} — coming soon`); setReportOpen(false); }} style={{ "--rt-c": r.color, display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 10, background: "rgba(245,242,236,0.7)", border: "1px solid #E4DDD3", cursor: "pointer", textAlign: "left", boxShadow: "0 1px 3px rgba(26,22,17,0.04)", animationDelay: `${i * 30}ms` }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: r.color + "14", border: `1px solid ${r.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{r.icon}</div>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1A1611", marginBottom: 2 }}>{r.label}</div>
                      <div style={{ fontSize: 10.5, color: "#9B8E80" }}>{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TOAST ── */}
        <div style={{ position: "fixed", bottom: 22, left: "50%", transform: toastVisible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(10px)", background: "#1A1611", border: "1px solid rgba(181,138,36,0.3)", borderRadius: 9, padding: "8px 18px", display: "flex", alignItems: "center", gap: 9, boxShadow: "0 8px 28px rgba(26,22,17,0.2)", zIndex: 1000, opacity: toastVisible ? 1 : 0, pointerEvents: toastVisible ? "auto" : "none", transition: "opacity 0.22s,transform 0.22s", whiteSpace: "nowrap" }}>
          <span style={{ color: "#B58A24", fontSize: 10 }}>✦</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#F4F1E9", fontFamily: "'DM Sans',sans-serif" }}>{toastMsg}</span>
        </div>

      </div>
    </>
  );
}




// dark mood 

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// const fmt = (n) =>
//   Number(n || 0).toLocaleString("en", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// // ─── Dark theme tokens (derived from topbar: #1A1611 base, #D1A534 gold) ─────
// const T = {
//   bg:         "#111009",   // deepest background
//   bgCard:     "#1A1611",   // card / column background  (topbar color)
//   bgCardHov:  "#211E17",   // card hover
//   bgSurface:  "#231F18",   // inner surface (tile bg)
//   bgSurfHov:  "#2C2720",   // tile hover
//   bgInput:    "#2A2520",   // input / stat block
//   border:     "rgba(181,138,36,0.12)",   // gold-tinted border
//   borderHov:  "rgba(181,138,36,0.28)",   // hover border
//   borderSub:  "rgba(181,138,36,0.07)",   // subtle divider
//   gold:       "#D1A534",
//   goldDim:    "rgba(181,138,36,0.55)",
//   goldFaint:  "rgba(181,138,36,0.12)",
//   text:       "#F4F1E9",   // primary text
//   textSub:    "rgba(244,241,233,0.55)",  // secondary text
//   textMuted:  "rgba(244,241,233,0.28)",  // muted / labels
// };

// // ─── Static Data ──────────────────────────────────────────────────────────────
// const DOCUMENTS_COLUMN = {
//   key: "documents", label: "Documents", icon: "📄", accent: "#B58A24",
//   actions: [
//     { icon: "🧾", label: "Invoice",      desc: "New invoice",         color: "#B58A24", routeTo: "/invoice"       },
//     { icon: "📋", label: "Quotation",    desc: "New quotation",       color: "#7B9ED9", routeTo: "/quotation"     },
//     { icon: "📝", label: "Credit Note",  desc: "Issue credit",        color: "#5C9E7A", routeTo: "/credit-note"   },
//     { icon: "📌", label: "Debit Note",   desc: "Issue debit",         color: "#C4933A", routeTo: "/debit-note"    },
//     { icon: "📦", label: "GRN",          desc: "Goods receipt",       color: "#9A7840", routeTo: "/goods-receipt" },
//     { icon: "💵", label: "Transactions", desc: "Payment ledger",      color: "#5C9E7A", routeTo: "/transactions"  },
//     { icon: "🎁", label: "Gift Voucher", desc: "Gift Voucher Manage", color: "#C47070", routeTo: "/gift-voucher"  },
//     { icon: "📊", label: "Reports",      desc: "Reports",             color: "#6A9FCC", routeTo: "/reports"       },
//   ],
// };

// const COLUMN_GROUPS = [
//   {
//     key: "sales", label: "Sales", icon: "↗", accent: "#5C9E7A",
//     primary: [
//       { icon: "◷", label: "Hold Sale",      desc: "Park transaction",  color: "#C4933A", badge: "2 held", badgeBg: "#C4933A18", badgeColor: "#F0C97A", badgeBorder: "#C4933A30" },
//       { icon: "⟲", label: "Refund",         desc: "Refund / exchange", color: "#C46060" },
//       { icon: "✦", label: "Discount",       desc: "Apply promo",       color: "#5C9E7A" },
//       { icon: "▦", label: "Price Override", desc: "Manual edit",       color: "#C4933A" },
//       { icon: "✉", label: "Send Receipt",   desc: "Email / SMS",       color: "#7B9ED9" },
//     ],
//     secondary: [],
//   },
//   {
//     key: "inventory", label: "Inventory", icon: "◈", accent: "#7B9ED9",
//     primary: [
//       { icon: "📦", label: "Product Management",  desc: "All products",      color: "#7B9ED9", routeTo: "/productsListView"   },
//       { icon: "⚠",  label: "Low Stock",           desc: "Alerts",            color: "#C46060", routeTo: "/low-stock", badge: "7 alerts", badgeBg: "#C4606018", badgeColor: "#F09090", badgeBorder: "#C4606030" },
//       { icon: "🏷",  label: "Category Management", desc: "Manage categories", color: "#5C9E7A", routeTo: "/categoryManagement" },
//       { icon: "◈",  label: "Receive Stock",        desc: "Incoming stock",    color: "#9A78C8" },
//       { icon: "⇄",  label: "Transfer Stock",       desc: "Move stock",        color: "#9A7840" },
//       { icon: "☑",  label: "Stock Count",          desc: "Stocktake",         color: "#7B9ED9" },
//       { icon: "📑", label: "Purchase Orders",      desc: "Create PO",         color: "#9A78C8" },
//     ],
//     secondary: [],
//   },
//   {
//     key: "history", label: "History", icon: "📅", accent: "#6AAED4",
//     primary: [
//       { icon: "🧾", label: "Sales",             desc: "Past sales",        color: "#6AAED4", routeTo: "/sales-history",        badge: "142 today", badgeBg: "#6AAED418", badgeColor: "#A8D4EE", badgeBorder: "#6AAED430" },
//       { icon: "📋", label: "Quotation History", desc: "Quotation history", color: "#7B9ED9", routeTo: "/quotationHistory"      },
//       { icon: "📄", label: "Invoices",          desc: "Invoice records",   color: "#6AAED4", routeTo: "/invoice-history"       },
//       { icon: "⊗",  label: "Void Sales",        desc: "Cancelled sales",   color: "#C46060", routeTo: "/void-history"          },
//       { icon: "↩",  label: "Refunds",           desc: "Refunds log",       color: "#B870C8", routeTo: "/refund-history"        },
//       { icon: "📦", label: "Stock In",          desc: "Received stock",    color: "#7B9ED9", routeTo: "/receive-stock-history" },
//       { icon: "⇄",  label: "Transfers",         desc: "Stock transfers",   color: "#9A78C8", routeTo: "/transfer-history"      },
//       { icon: "☑",  label: "Stock Count",       desc: "Stocktake records", color: "#6AAED4", routeTo: "/stock-count-history"   },
//       { icon: "💰", label: "Register",          desc: "Cash register log", color: "#8A9AAA", routeTo: "/register-history"      },
//     ],
//     secondary: [],
//   },
// ];

// const SECTIONS = [
//   {
//     key: "customers", label: "Customers", icon: "⌂", accent: "#9A78C8",
//     actions: [
//       { icon: "⌂",  label: "Customer Management", desc: "CRM lookup",       color: "#9A78C8", routeTo: "/customerManagement" },
//       { icon: "➕", label: "Customer Accounts",   desc: "Manage customers", color: "#5C9E7A", routeTo: "/add-customer"        },
//     ],
//   },
//   {
//     key: "suppliers", label: "Suppliers", icon: "🏭", accent: "#9A78C8",
//     actions: [
//       { icon: "🏭", label: "Supplier Management", desc: "Manage suppliers",         color: "#9A78C8", routeTo: "/supplierManagement" },
//       { icon: "➕", label: "Supplier Accounts",   desc: "Manage supplier accounts", color: "#B870C8", routeTo: "/supplierAccount"    },
//     ],
//   },
//   {
//     key: "register", label: "Register", icon: "⊕", accent: "#5C9E7A",
//     actions: [
//       { icon: "⊕",  label: "Open Register",  desc: "Start till",  color: "#5C9E7A" },
//       { icon: "⊟",  label: "Close Register", desc: "Cash up",     color: "#8A9090" },
//       { icon: "💵", label: "Cash Mgmt",      desc: "Cash in/out", color: "#5C9E7A" },
//       { icon: "⊜",  label: "End of Day",    desc: "EOD report",  color: "#9A78C8" },
//     ],
//   },
//   {
//     key: "settings", label: "Settings", icon: "⚙", accent: "#8A9090",
//     actions: [
//       { icon: "⚙",  label: "System", desc: "POS config",     color: "#8A9090", routeTo: "/settings" },
//       { icon: "👥", label: "Users",  desc: "Manage staff",   color: "#7B9ED9"                        },
//       { icon: "🔐", label: "Roles",  desc: "Access control", color: "#9A78C8"                        },
//     ],
//   },
// ];

// const REPORTS_DATA = [
//   { icon: "📊", label: "Sales Report",     desc: "Daily / weekly sales",     color: "#7B9ED9" },
//   { icon: "📈", label: "Profit Report",    desc: "Profit & loss analysis",   color: "#5C9E7A" },
//   { icon: "📦", label: "Inventory Report", desc: "Stock insights",           color: "#C4933A" },
//   { icon: "⊜",  label: "Analysis",        desc: "Full analytics dashboard", color: "#9A7840", routeTo: "/analysis" },
//   { icon: "👥", label: "Staff Report",     desc: "Performance overview",     color: "#9A78C8" },
//   { icon: "💰", label: "Cash Report",      desc: "Register summary",         color: "#5C9E7A" },
// ];

// const NOTIFICATIONS = [
//   { color: "#C46060", title: "Low stock: USB-C Hub (3 left)",   time: "2 min ago"  },
//   { color: "#C4933A", title: "Refund approved — TXN-8818",      time: "18 min ago" },
//   { color: "#7B9ED9", title: "Shift started — Aria K. on R-01", time: "1h ago"     },
//   { color: "#5C9E7A", title: "Daily target 65% reached",         time: "2h ago"     },
//   { color: "#C4933A", title: "End-of-day report due at 9 PM",   time: "Reminder"   },
// ];

// const TOP_ITEMS = [
//   { rank: 1, name: "Wireless Headset",  sold: 24, revenue: 1440 },
//   { rank: 2, name: "USB-C Hub",         sold: 18, revenue: 900  },
//   { rank: 3, name: "Phone Case Pro",    sold: 15, revenue: 450  },
//   { rank: 4, name: "Screen Protector",  sold: 12, revenue: 180  },
// ];

// const PAYMENT_METHODS = [
//   { label: "Card",        pct: 68, amount: 5156, color: "#9A78C8" },
//   { label: "Cash",        pct: 22, amount: 1668, color: "#5C9E7A" },
//   { label: "QR / Online", pct: 10, amount: 758,  color: "#7B9ED9" },
// ];

// const PENDING = [
//   { dot: "#C46060", title: "2 POs awaiting approval", sub: "Purchase orders"    },
//   { dot: "#C4933A", title: "3 held sales",             sub: "Resume or cancel"  },
//   { dot: "#C4933A", title: "EOD report due",           sub: "Due at 9:00 PM"    },
//   { dot: "#7B9ED9", title: "4 unpaid invoices",        sub: "Overdue by 2 days" },
// ];

// const STAFF = [
//   { initials: "AK", name: "Aria K.",  post: "Register 01", color: "#7B9ED9", status: "#5C9E7A" },
//   { initials: "MR", name: "Marco R.", post: "Register 02", color: "#9A78C8", status: "#5C9E7A" },
//   { initials: "JS", name: "Jay S.",   post: "Floor",        color: "#C4933A", status: "#C4933A" },
//   { initials: "PL", name: "Priya L.", post: "Stockroom",    color: "#5C9E7A", status: "#5C9E7A" },
// ];

// const ACTIVITY = [
//   { dot: "#5C9E7A", title: "Sale #1042",      sub: "$84.50 · Aria K.",   time: "2m"  },
//   { dot: "#C46060", title: "Refund #318",     sub: "$22.00 · TXN-8818",  time: "18m" },
//   { dot: "#7B9ED9", title: "Invoice #229",    sub: "$340.00 · drafted",  time: "34m" },
//   { dot: "#C4933A", title: "Low Stock Alert", sub: "USB-C Hub · 3 left", time: "1h"  },
//   { dot: "#5C9E7A", title: "Sale #1041",      sub: "$128.00 · Marco R.", time: "1h"  },
// ];

// const SHIFT_NOTES = [
//   { text: "Printer on R-02 is slow",      author: "Aria K.",  time: "10:30 AM", color: "#C4933A" },
//   { text: "Restock tissue paper aisle 3", author: "Marco R.", time: "9:15 AM",  color: "#7B9ED9" },
// ];

// // ─── Global CSS ───────────────────────────────────────────────────────────────
// const GLOBAL_CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Geist+Mono:wght@400;500;600&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.15} }
//   @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
//   @keyframes dropIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
//   @keyframes modalIn { from{opacity:0;transform:scale(.97) translateY(6px)} to{opacity:1;transform:none} }
//   @keyframes slideIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:none} }

//   .row-tile {
//     display: flex; align-items: center; gap: 10px;
//     padding: 7px 8px; border-radius: 9px; cursor: pointer;
//     background: transparent; border: 1px solid transparent;
//     width: 100%; text-align: left; font-family: 'DM Sans', sans-serif;
//     transition: all 0.15s; margin-bottom: 2px; animation: fadeUp 0.2s ease both;
//   }
//   .row-tile:hover { background: rgba(181,138,36,0.07); border-color: rgba(181,138,36,0.18); transform: translateX(2px); }
//   .row-tile:hover .rt-arrow { opacity: 1; transform: translateX(0); }
//   .row-tile:hover .rt-icon  { transform: scale(1.06); }
//   .rt-icon  { transition: transform 0.15s; }
//   .rt-arrow { font-size: 11px; color: rgba(181,138,36,0.35); opacity: 0; transform: translateX(-4px); transition: all 0.15s; flex-shrink: 0; }

//   .prime-tile {
//     display: flex; align-items: center; gap: 12px; padding: 10px 12px;
//     border-radius: 10px; cursor: pointer; width: 100%; text-align: left;
//     font-family: 'DM Sans', sans-serif; transition: all 0.15s; margin-bottom: 5px;
//   }
//   .prime-tile:hover { transform: translateX(2px); filter: brightness(1.08); }
//   .prime-tile:hover .prime-icon { transform: scale(1.06); }
//   .prime-icon { transition: transform 0.15s; }

//   .sec-divider {
//     display: flex; align-items: center; gap: 7px; font-size: 8px; font-weight: 700;
//     letter-spacing: 1.8px; text-transform: uppercase; color: rgba(181,138,36,0.4);
//     padding: 7px 6px 3px; font-family: 'DM Sans', sans-serif;
//   }
//   .sec-divider::after { content: ''; flex: 1; height: 1px; background: rgba(181,138,36,0.1); }

//   .sec-col {
//     display: flex; flex-direction: column;
//     background: #1A1611; border: 1px solid rgba(181,138,36,0.14);
//     border-radius: 14px; overflow: hidden; height: 100%;
//     box-shadow: 0 1px 8px rgba(0,0,0,0.4); transition: box-shadow 0.2s, border-color 0.2s;
//   }
//   .sec-col:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.5); border-color: rgba(181,138,36,0.24); }

//   .rc-tile {
//     display: flex; align-items: center; gap: 8px; padding: 7px 9px; border-radius: 8px;
//     cursor: pointer; background: rgba(244,241,233,0.04); border: 1px solid rgba(181,138,36,0.1);
//     font-family: 'DM Sans', sans-serif; transition: all 0.14s; width: 100%;
//     position: relative; overflow: hidden; animation: slideIn 0.2s ease both;
//   }
//   .rc-tile::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2.5px; background: var(--tile-accent, transparent); opacity: 0; transition: opacity 0.15s; border-radius: 0; }
//   .rc-tile:hover { background: rgba(181,138,36,0.08); border-color: rgba(181,138,36,0.22); transform: translateY(-1px); }
//   .rc-tile:hover::before { opacity: 1; }

//   .tb-btn {
//     width: 32px; height: 32px; border-radius: 7px; background: rgba(244,241,233,0.05);
//     border: 1px solid rgba(244,241,233,0.09); color: rgba(244,241,233,0.42); cursor: pointer;
//     font-size: 14px; display: flex; align-items: center; justify-content: center;
//     transition: background 0.15s, color 0.15s;
//   }
//   .tb-btn:hover { background: rgba(181,138,36,0.15); color: #D1A534; border-color: rgba(181,138,36,0.3); }

//   .notif-row:hover { background: rgba(181,138,36,0.07); }
//   .report-tile { transition: all 0.15s !important; }
//   .report-tile:hover { background: rgba(181,138,36,0.1) !important; border-color: rgba(181,138,36,0.28) !important; transform: translateY(-1px) !important; }

//   .col-scroll::-webkit-scrollbar { width: 3px; }
//   .col-scroll::-webkit-scrollbar-track { background: transparent; }
//   .col-scroll::-webkit-scrollbar-thumb { background: rgba(181,138,36,0.2); border-radius: 3px; }

//   .kpi-card {
//     background: rgba(244,241,233,0.04); border: 1px solid rgba(181,138,36,0.14);
//     border-radius: 8px; padding: 6px 12px; text-align: right;
//     transition: background 0.15s, border-color 0.15s;
//   }
//   .kpi-card:hover { background: rgba(181,138,36,0.08); border-color: rgba(181,138,36,0.28); }

//   .doc-tile {
//     display: flex; flex-direction: column; align-items: center; justify-content: center;
//     gap: 8px; padding: 14px 8px; border-radius: 11px; cursor: pointer; width: 100%;
//     text-align: center; transition: all 0.16s; position: relative; overflow: hidden;
//     min-height: 88px; font-family: 'DM Sans', sans-serif; animation: fadeUp 0.2s ease both;
//   }
//   .doc-tile:hover { transform: translateY(-2px); filter: brightness(1.12); }
//   .doc-tile:hover .doc-icon { transform: scale(1.08); }
//   .doc-icon { transition: transform 0.15s; }

//   .w-card {
//     background: #1A1611; border: 1px solid rgba(181,138,36,0.14);
//     border-radius: 12px; overflow: hidden; flex-shrink: 0;
//     box-shadow: 0 1px 8px rgba(0,0,0,0.35);
//   }
//   .w-head {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 8px 12px 7px; border-bottom: 1px solid rgba(181,138,36,0.1);
//     background: rgba(244,241,233,0.03);
//   }
//   .w-body { padding: 8px 10px; background: rgba(0,0,0,0.15); }
//   .w-row {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 5px 2px; border-bottom: 1px solid rgba(181,138,36,0.07);
//     font-family: 'DM Sans', sans-serif;
//   }
//   .w-row:last-child { border-bottom: none; }
//   .w-item {
//     display: flex; align-items: center; gap: 8px; padding: 5px 6px; border-radius: 7px;
//     background: rgba(244,241,233,0.04); border: 1px solid rgba(181,138,36,0.1);
//     margin-bottom: 4px; font-family: 'DM Sans', sans-serif;
//   }
//   .w-item:last-child { margin-bottom: 0; }
//   .progress-bg { height: 4px; background: rgba(244,241,233,0.07); border-radius: 4px; overflow: hidden; margin-top: 4px; }
//   .progress-fill { height: 100%; border-radius: 4px; }
// `;

// // ─── Shared widget header ─────────────────────────────────────────────────────
// function WHead({ accent, icon, label, badge, badgeStyle }) {
//   return (
//     <div>
//       <div style={{ height: 2, background: `linear-gradient(90deg,${accent} 0%,transparent 65%)`, opacity: 0.6 }} />
//       <div className="w-head">
//         <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//           <div style={{ width: 22, height: 22, borderRadius: 5, background: accent + "20", border: `1px solid ${accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: accent }}>{icon}</div>
//           <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 12.5, fontWeight: 700, color: T.text }}>{label}</span>
//         </div>
//         {badge !== undefined && (
//           <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 20, ...badgeStyle }}>{badge}</span>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Col 6 Widgets ────────────────────────────────────────────────────────────
// function TopItems() {
//   return (
//     <div className="w-card">
//       <WHead accent="#C4933A" icon="🏆" label="Top Items" badge="today" badgeStyle={{ color: T.textMuted }} />
//       <div className="w-body">
//         {TOP_ITEMS.map((item) => (
//           <div key={item.rank} className="w-row">
//             <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//               <span style={{ width: 16, fontSize: 8.5, fontWeight: 700, color: item.rank === 1 ? T.gold : T.textMuted, textAlign: "center" }}>#{item.rank}</span>
//               <div>
//                 <div style={{ fontSize: 10, fontWeight: 600, color: T.text }}>{item.name}</div>
//                 <div style={{ fontSize: 8.5, color: T.textSub }}>{item.sold} sold</div>
//               </div>
//             </div>
//             <span style={{ fontSize: 9, fontWeight: 700, color: "#5C9E7A", fontFamily: "monospace" }}>${item.revenue.toLocaleString()}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function PaymentMethods() {
//   return (
//     <div className="w-card">
//       <WHead accent="#9A78C8" icon="💳" label="Payments" badge="142 txns" badgeStyle={{ color: T.textMuted }} />
//       <div className="w-body" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
//         {PAYMENT_METHODS.map((m) => (
//           <div key={m.label}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
//               <span style={{ fontSize: 9.5, fontWeight: 600, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{m.label}</span>
//               <span style={{ fontSize: 9, fontWeight: 700, color: m.color, fontFamily: "monospace" }}>{m.pct}% · ${m.amount.toLocaleString()}</span>
//             </div>
//             <div className="progress-bg"><div className="progress-fill" style={{ width: `${m.pct}%`, background: m.color }} /></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function PendingTasks() {
//   return (
//     <div className="w-card">
//       <WHead accent="#C4933A" icon="📋" label="Pending"
//         badge={`${PENDING.length} items`} badgeStyle={{ background: "#C4606020", color: "#F09090", border: "1px solid #C4606030" }} />
//       <div className="w-body" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//         {PENDING.map((p, i) => (
//           <div key={i} className="w-item">
//             <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.dot, flexShrink: 0 }} />
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <div style={{ fontSize: 10, fontWeight: 600, color: T.text }}>{p.title}</div>
//               <div style={{ fontSize: 8.5, color: T.textSub, marginTop: 1 }}>{p.sub}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function StoreStatus() {
//   const [time, setTime] = useState(new Date());
//   useEffect(() => {
//     const id = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(id);
//   }, []);
//   const diffMs = new Date().setHours(21, 0, 0, 0) - time;
//   const hrs  = Math.max(0, Math.floor(diffMs / 3600000));
//   const mins = Math.max(0, Math.floor((diffMs % 3600000) / 60000));
//   const rows = [
//     { l: "Hours today",    v: "9:00 AM – 9:00 PM", c: T.text     },
//     { l: "Closing in",     v: `${hrs}h ${mins}m`,  c: "#C4933A"  },
//     { l: "Registers open", v: "2 of 3",             c: "#5C9E7A"  },
//     { l: "Last backup",    v: "12 min ago",          c: T.text     },
//   ];
//   return (
//     <div className="w-card">
//       <WHead accent="#8A9090" icon="🏪" label="Store Status"
//         badge="OPEN" badgeStyle={{ background: "#5C9E7A20", color: "#90DDAA", border: "1px solid #5C9E7A30" }} />
//       <div className="w-body">
//         {rows.map(({ l, v, c }) => (
//           <div key={l} className="w-row">
//             <span style={{ fontSize: 9.5, color: T.textSub, fontFamily: "'DM Sans',sans-serif" }}>{l}</span>
//             <span style={{ fontSize: 9.5, fontWeight: 600, color: c, fontFamily: "'DM Sans',sans-serif" }}>{v}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Col 7 Widgets ────────────────────────────────────────────────────────────
// function ShiftNotes({ onAdd }) {
//   return (
//     <div className="w-card">
//       <div>
//         <div style={{ height: 2, background: "linear-gradient(90deg,#6AAED4 0%,transparent 65%)", opacity: 0.6 }} />
//         <div className="w-head">
//           <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//             <div style={{ width: 22, height: 22, borderRadius: 5, background: "#6AAED420", border: "1px solid #6AAED435", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6AAED4" }}>📝</div>
//             <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 12.5, fontWeight: 700, color: T.text }}>Shift Notes</span>
//           </div>
//           <button onClick={onAdd} style={{ fontSize: 9, color: "#6AAED4", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>+ Add</button>
//         </div>
//       </div>
//       <div className="w-body" style={{ display: "flex", flexDirection: "column", gap: 5 }}>
//         {SHIFT_NOTES.map((n, i) => (
//           <div key={i} style={{ background: "rgba(244,241,233,0.04)", border: "1px solid rgba(181,138,36,0.1)", borderRadius: "0 7px 7px 0", borderLeft: `3px solid ${n.color}`, padding: "7px 8px" }}>
//             <div style={{ fontSize: 10, fontWeight: 600, color: T.text }}>{n.text}</div>
//             <div style={{ fontSize: 8.5, color: T.textSub, marginTop: 2 }}>{n.author} · {n.time}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function ActiveStaff() {
//   return (
//     <div className="w-card">
//       <WHead accent="#7B9ED9" icon="👥" label="Staff On Shift"
//         badge="4 active" badgeStyle={{ background: "#5C9E7A20", border: "1px solid #5C9E7A30", color: "#90DDAA" }} />
//       <div className="w-body" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//         {STAFF.map((s) => (
//           <div key={s.initials} className="w-item">
//             <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.color + "20", border: `1.5px solid ${s.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.initials}</div>
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <div style={{ fontSize: 10.5, fontWeight: 600, color: T.text }}>{s.name}</div>
//               <div style={{ fontSize: 8.5, color: T.textSub }}>{s.post}</div>
//             </div>
//             <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.status, flexShrink: 0 }} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function TodaysSales({ revenue, txnCount }) {
//   const avgBasket = Math.round(revenue / txnCount);
//   const stats = [
//     { l: "Revenue", v: `$${fmt(revenue)}`, c: T.text      },
//     { l: "Orders",  v: txnCount,            c: "#5C9E7A"   },
//     { l: "Returns", v: 3,                   c: "#C46060"   },
//     { l: "Avg",     v: `$${avgBasket}`,     c: T.text      },
//   ];
//   return (
//     <div className="w-card">
//       <WHead accent="#5C9E7A" icon="📊" label="Today's Sales"
//         badge="LIVE" badgeStyle={{ background: "#5C9E7A20", border: "1px solid #5C9E7A30", color: "#90DDAA" }} />
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, padding: "8px 10px 4px" }}>
//         {stats.map(({ l, v, c }) => (
//           <div key={l} style={{ background: "rgba(244,241,233,0.04)", border: "1px solid rgba(181,138,36,0.1)", borderRadius: 8, padding: "7px 9px" }}>
//             <div style={{ fontSize: 8, color: T.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{l}</div>
//             <div style={{ fontSize: 13, fontWeight: 700, color: c, marginTop: 2, fontFamily: "monospace" }}>{v}</div>
//           </div>
//         ))}
//       </div>
//       <div style={{ padding: "4px 10px 9px" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
//           <span style={{ fontSize: 8.5, color: T.textSub, fontFamily: "'DM Sans',sans-serif" }}>Daily target</span>
//           <span style={{ fontSize: 8.5, fontWeight: 700, color: "#5C9E7A", fontFamily: "'DM Sans',sans-serif" }}>65%</span>
//         </div>
//         <div className="progress-bg"><div className="progress-fill" style={{ width: "65%", background: "#5C9E7A" }} /></div>
//       </div>
//     </div>
//   );
// }

// function RecentActivity() {
//   return (
//     <div className="w-card">
//       <WHead accent="#C4933A" icon="⚡" label="Recent Activity" />
//       <div className="w-body">
//         {ACTIVITY.map((a, i) => (
//           <div key={i} className="w-row">
//             <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//               <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
//               <div>
//                 <div style={{ fontSize: 10, fontWeight: 600, color: T.text }}>{a.title}</div>
//                 <div style={{ fontSize: 8.5, color: T.textSub }}>{a.sub}</div>
//               </div>
//             </div>
//             <span style={{ fontSize: 8, color: T.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{a.time}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Core tile components ─────────────────────────────────────────────────────
// function DocTile({ action, delay = 0, onClick }) {
//   return (
//     <button className="doc-tile" style={{ background: action.color + "14", border: `1.5px solid ${action.color}28`, animationDelay: `${delay}ms` }} onClick={onClick}>
//       <div className="doc-icon" style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: action.color + "20", border: `1.5px solid ${action.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: action.color }}>{action.icon}</div>
//       <div>
//         <div style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.25, textAlign: "center" }}>{action.label}</div>
//         <div style={{ fontSize: 11, color: T.textSub, marginTop: 2, textAlign: "center" }}>{action.desc}</div>
//       </div>
//     </button>
//   );
// }

// function RowTile({ action, delay = 0, onClick }) {
//   return (
//     <button className="row-tile" style={{ animationDelay: `${delay}ms` }} onClick={onClick}>
//       <div className="rt-icon" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: action.color + "18", border: `1.5px solid ${action.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: action.color }}>{action.icon}</div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontSize: 11.5, fontWeight: 600, color: T.text, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.label}</div>
//         <div style={{ fontSize: 9.5, color: T.textSub, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.desc}</div>
//       </div>
//       {action.badge && (
//         <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.4, padding: "2px 6px", borderRadius: 20, flexShrink: 0, background: action.badgeBg || action.color + "18", color: action.badgeColor || action.color, border: `1px solid ${action.badgeBorder || action.color + "30"}`, whiteSpace: "nowrap" }}>{action.badge}</span>
//       )}
//       <span className="rt-arrow">›</span>
//     </button>
//   );
// }

// function PrimeTile({ action, delay = 0, onClick }) {
//   return (
//     <button className="prime-tile" style={{ background: action.color + "16", border: `1.5px solid ${action.color}32`, animationDelay: `${delay}ms`, animation: "fadeUp 0.2s ease both" }} onClick={onClick}>
//       <div className="prime-icon" style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: action.color + "22", border: `1.5px solid ${action.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: action.color }}>{action.icon}</div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.label}</div>
//         <div style={{ fontSize: 10, color: T.textSub, marginTop: 2 }}>{action.desc}</div>
//       </div>
//       {action.badge && (
//         <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.4, padding: "2px 6px", borderRadius: 20, flexShrink: 0, background: action.badgeBg || action.color + "18", color: action.badgeColor || action.color, border: `1px solid ${action.badgeBorder || action.color + "30"}`, whiteSpace: "nowrap" }}>{action.badge}</span>
//       )}
//     </button>
//   );
// }

// function ColHeader({ accent, icon, label, count }) {
//   return (
//     <>
//       <div style={{ height: 3, flexShrink: 0, background: `linear-gradient(90deg,${accent},${accent}44,transparent)`, borderRadius: "14px 14px 0 0" }} />
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px 10px", borderBottom: `1px solid rgba(181,138,36,0.1)`, background: "rgba(244,241,233,0.03)", flexShrink: 0 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
//           <div style={{ width: 30, height: 30, borderRadius: 8, background: accent + "18", border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: accent, flexShrink: 0 }}>{icon}</div>
//           <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 14.5, fontWeight: 700, color: T.text, letterSpacing: 0.15 }}>{label}</span>
//         </div>
//         <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 0.8, padding: "2px 7px", borderRadius: 20, background: accent + "18", border: `1px solid ${accent}30`, color: accent }}>{count}</span>
//       </div>
//     </>
//   );
// }

// function DocumentsColumn({ onAction }) {
//   const col = DOCUMENTS_COLUMN;
//   return (
//     <div className="sec-col">
//       <ColHeader accent={col.accent} icon={col.icon} label={col.label} count={col.actions.length} />
//       <div className="col-scroll" style={{ flex: 1, overflowY: "auto", padding: "9px", background: "rgba(0,0,0,0.2)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, alignContent: "start" }}>
//         {col.actions.map((action, i) => (
//           <DocTile key={action.label} action={action} delay={i * 22} onClick={() => onAction(action)} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function MainColumn({ colData, onAction }) {
//   const total = colData.primary.length + colData.secondary.length;
//   return (
//     <div className="sec-col">
//       <ColHeader accent={colData.accent} icon={colData.icon} label={colData.label} count={total} />
//       <div className="col-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px", background: "rgba(0,0,0,0.2)" }}>
//         {colData.primary.map((action, i) => (
//           <PrimeTile key={action.label} action={action} delay={i * 22} onClick={() => onAction(action)} />
//         ))}
//         {colData.secondary.length > 0 && (
//           <>
//             <div className="sec-divider" style={{ marginTop: 4 }}>More</div>
//             {colData.secondary.map((action, i) => (
//               <RowTile key={action.label} action={action} delay={(colData.primary.length + i) * 22} onClick={() => onAction(action)} />
//             ))}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function RcTile({ action, delay = 0, onClick }) {
//   return (
//     <button className="rc-tile" style={{ "--tile-accent": action.color, animationDelay: `${delay}ms` }} onClick={onClick}>
//       <div style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, background: action.color + "18", border: `1px solid ${action.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: action.color }}>{action.icon}</div>
//       <div style={{ minWidth: 0 }}>
//         <div style={{ fontSize: 11, fontWeight: 600, color: T.text, lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.label}</div>
//         <div style={{ fontSize: 9, color: T.textSub, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.desc}</div>
//       </div>
//     </button>
//   );
// }

// function RightSection({ sectionKey, onAction }) {
//   const section = SECTIONS.find((s) => s.key === sectionKey);
//   if (!section) return null;
//   return (
//     <div className="w-card">
//       <div>
//         <div style={{ height: 2, background: `linear-gradient(90deg,${section.accent} 0%,transparent 65%)`, opacity: 0.6 }} />
//         <div className="w-head">
//           <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//             <div style={{ width: 22, height: 22, borderRadius: 5, background: section.accent + "20", border: `1px solid ${section.accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: section.accent }}>{section.icon}</div>
//             <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 12.5, fontWeight: 700, color: T.text }}>{section.label}</span>
//           </div>
//           <span style={{ fontSize: 8.5, fontWeight: 700, padding: "1px 6px", borderRadius: 20, background: section.accent + "18", border: `1px solid ${section.accent}30`, color: section.accent }}>{section.actions.length}</span>
//         </div>
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "7px 8px", background: "rgba(0,0,0,0.15)" }}>
//         {section.actions.map((action, i) => (
//           <RcTile key={action.label} action={action} delay={i * 16} onClick={() => onAction(action)} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function KpiCard({ label, value, valueColor }) {
//   return (
//     <div className="kpi-card">
//       <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: T.textMuted }}>{label}</div>
//       <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, fontWeight: 600, color: valueColor || T.text, marginTop: 1 }}>{value}</div>
//     </div>
//   );
// }

// // ─── Main Dashboard ───────────────────────────────────────────────────────────
// export default function POSDashboard() {
//   const navigate = useNavigate();
//   const [revenue,      setRevenue]      = useState(6482.4);
//   const [txnCount]                      = useState(142);
//   const [notifOpen,    setNotifOpen]    = useState(false);
//   const [reportOpen,   setReportOpen]   = useState(false);
//   const [toastMsg,     setToastMsg]     = useState("");
//   const [toastVisible, setToastVisible] = useState(false);
//   const toastTimer = useRef(null);

//   useEffect(() => {
//     const id = setInterval(() => {
//       if (Math.random() > 0.72) setRevenue((v) => +(v + Math.random() * 14).toFixed(2));
//     }, 2200);
//     return () => clearInterval(id);
//   }, []);

//   useEffect(() => {
//     const h = (e) => { if (e.key === "Escape") { setNotifOpen(false); setReportOpen(false); } };
//     window.addEventListener("keydown", h);
//     return () => window.removeEventListener("keydown", h);
//   }, []);

//   const showToast = useCallback((msg) => {
//     setToastMsg(msg); setToastVisible(true);
//     clearTimeout(toastTimer.current);
//     toastTimer.current = setTimeout(() => setToastVisible(false), 2400);
//   }, []);

//   const handleAction = useCallback((action) => {
//     if (action.routeTo) navigate(action.routeTo);
//     else showToast(`${action.label} — coming soon`);
//   }, [navigate, showToast]);

//   const avgBasket = (revenue / txnCount).toFixed(2);

//   return (
//     <>
//       <style>{GLOBAL_CSS}</style>
//       <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans',sans-serif", background: T.bg, overflow: "hidden" }}>

//         {/* ── TOP BAR ── */}
//         <header style={{ height: 54, flexShrink: 0, background: "#1A1611", borderBottom: "1px solid rgba(181,138,36,0.35)", boxShadow: "0 1px 0 rgba(181,138,36,0.1),0 2px 18px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", position: "relative", zIndex: 50 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(181,138,36,0.1)", border: "1.5px solid rgba(181,138,36,0.42)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 700, color: "#D1A534" }}>N</div>
//               <div>
//                 <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 17, fontWeight: 600, color: "#F4F1E9", letterSpacing: 0.2 }}>Nexus POS</div>
//                 <div style={{ fontSize: 7.5, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(181,138,36,0.6)", marginTop: -1 }}>Admin · Retail</div>
//               </div>
//             </div>
//             <div style={{ width: 1, height: 20, background: "rgba(244,241,233,0.08)" }} />
//             <div style={{ fontSize: 10.5, fontWeight: 500, color: "rgba(244,241,233,0.32)", background: "rgba(244,241,233,0.04)", border: "1px solid rgba(244,241,233,0.07)", borderRadius: 6, padding: "3px 10px" }}>
//               {new Date().toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", background: "rgba(92,158,122,0.14)", border: "1px solid rgba(92,158,122,0.3)", borderRadius: 20, fontSize: 9.5, fontWeight: 700, color: "#90DDAA", letterSpacing: 0.8 }}>
//               <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#90DDAA", display: "inline-block", animation: "blink 1.5s ease-in-out infinite" }} />
//               LIVE
//             </div>
//             <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, fontWeight: 600, color: "rgba(244,241,233,0.42)", background: "rgba(244,241,233,0.04)", border: "1px solid rgba(244,241,233,0.07)", borderRadius: 6, padding: "3px 10px", display: "flex", alignItems: "center", gap: 6 }}>
//               <span style={{ fontSize: 7.5, letterSpacing: 2, textTransform: "uppercase", color: "rgba(181,138,36,0.65)", fontWeight: 700 }}>TODAY</span>
//               ${fmt(revenue)}
//             </div>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <button onClick={() => setReportOpen(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 7, background: "rgba(181,138,36,0.1)", border: "1.5px solid rgba(181,138,36,0.38)", color: "#D1A534", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, fontWeight: 700, transition: "background 0.15s,border-color 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(181,138,36,0.2)"; e.currentTarget.style.borderColor = "rgba(181,138,36,0.55)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(181,138,36,0.1)"; e.currentTarget.style.borderColor = "rgba(181,138,36,0.38)"; }}>
//               📊 Reports
//             </button>
//             <div style={{ width: 1, height: 20, background: "rgba(244,241,233,0.08)" }} />
//             <button className="tb-btn" onClick={() => setNotifOpen((v) => !v)} style={{ position: "relative" }}>
//               🔔
//               <span style={{ position: "absolute", top: -3, right: -3, width: 13, height: 13, background: "#C46060", borderRadius: "50%", border: "2px solid #1A1611", fontSize: 6.5, color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>5</span>
//             </button>
//             <button className="tb-btn">⚙</button>
//             <div style={{ width: 32, height: 32, borderRadius: 7, border: "1.5px solid rgba(181,138,36,0.3)", background: "rgba(181,138,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',Georgia,serif", fontSize: 13, fontWeight: 600, color: "#D1A534", cursor: "pointer" }}>AD</div>
//           </div>

//           {notifOpen && (
//             <div style={{ position: "absolute", top: 62, right: 50, width: 290, background: "#1A1611", border: "1px solid rgba(181,138,36,0.25)", borderRadius: 11, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 200, overflow: "hidden", animation: "dropIn 0.18s ease" }}>
//               <div style={{ padding: "9px 14px 8px", background: "#111009", borderBottom: "1px solid rgba(181,138,36,0.2)", fontSize: 8, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#B58A24" }}>Notifications</div>
//               {NOTIFICATIONS.map((n, i) => (
//                 <div key={i} className="notif-row" style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid rgba(181,138,36,0.08)" : "none", cursor: "pointer", transition: "background 0.12s" }}>
//                   <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: 5 }} />
//                   <div>
//                     <div style={{ fontSize: 11.5, fontWeight: 600, color: T.text, lineHeight: 1.4 }}>{n.title}</div>
//                     <div style={{ fontSize: 9.5, color: T.textSub, marginTop: 2 }}>{n.time}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </header>

//         {/* ── PAGE TITLE ── */}
//         <div style={{ flexShrink: 0, padding: "12px 20px 0", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
//           <div>
//             <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 24, fontWeight: 700, color: T.text, letterSpacing: -0.3, lineHeight: 1 }}>Operations Dashboard</div>
//             <div style={{ fontSize: 10, color: T.goldDim, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginTop: 3 }}>Point of Sale · Command Centre</div>
//           </div>
//           <div style={{ display: "flex", gap: 8 }}>
//             <KpiCard label="Transactions" value={txnCount}          valueColor="#5C9E7A" />
//             <KpiCard label="Avg. Basket"  value={`$${avgBasket}`}                        />
//             <KpiCard label="Low Stock"    value="7 items"           valueColor="#C4933A" />
//             <KpiCard label="Staff Active" value="4"                 valueColor="#5C9E7A" />
//           </div>
//         </div>

//         {/* ── BODY: 7 columns ── */}
//         <div style={{ flex: 1, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 180px 180px 180px", gap: 8, padding: "10px 14px 12px" }}>

//           <DocumentsColumn onAction={handleAction} />

//           {COLUMN_GROUPS.map((col) => (
//             <MainColumn key={col.key} colData={col} onAction={handleAction} />
//           ))}

//           {/* Col 5 */}
//           <div className="col-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflowY: "auto" }}>
//             <RightSection sectionKey="customers" onAction={handleAction} />
//             <RightSection sectionKey="suppliers" onAction={handleAction} />
//             <RightSection sectionKey="register"  onAction={handleAction} />
//             <RightSection sectionKey="settings"  onAction={handleAction} />
//           </div>

//           {/* Col 6 */}
//           <div className="col-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflowY: "auto" }}>
//             <TopItems />
//             <PaymentMethods />
//             <PendingTasks />
//             <StoreStatus />
//           </div>

//           {/* Col 7 */}
//           <div className="col-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflowY: "auto" }}>
//             <ShiftNotes onAdd={() => showToast("Add note — coming soon")} />
//             <ActiveStaff />
//             <TodaysSales revenue={revenue} txnCount={txnCount} />
//             <RecentActivity />
//           </div>
//         </div>

//         {/* ── REPORTS MODAL ── */}
//         {reportOpen && (
//           <div onClick={() => setReportOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(3px)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
//             <div onClick={(e) => e.stopPropagation()} style={{ background: "#1A1611", border: "1px solid rgba(181,138,36,0.28)", borderRadius: 16, width: "100%", maxWidth: 540, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)", animation: "modalIn 0.22s cubic-bezier(.16,1,.3,1)" }}>
//               <div style={{ padding: "18px 22px 16px", background: "#111009", borderBottom: "1px solid rgba(181,138,36,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <div>
//                   <div style={{ fontSize: 7.5, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(181,138,36,0.65)", marginBottom: 4 }}>Analytics · Reporting</div>
//                   <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 21, fontWeight: 600, color: T.text }}>Reports &amp; Analysis</div>
//                 </div>
//                 <button onClick={() => setReportOpen(false)} style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(244,241,233,0.06)", border: "1px solid rgba(244,241,233,0.1)", color: "rgba(244,241,233,0.5)", cursor: "pointer", fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(181,138,36,0.15)"; e.currentTarget.style.color = T.gold; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(244,241,233,0.06)"; e.currentTarget.style.color = "rgba(244,241,233,0.5)"; }}>×</button>
//               </div>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 18 }}>
//                 {REPORTS_DATA.map((r, i) => (
//                   <button key={r.label} className="report-tile" onClick={() => { r.routeTo ? navigate(r.routeTo) : showToast(`${r.label} — coming soon`); setReportOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 10, background: r.color + "14", border: `1px solid ${r.color}25`, cursor: "pointer", textAlign: "left", animationDelay: `${i * 30}ms` }}>
//                     <div style={{ width: 38, height: 38, borderRadius: 9, background: r.color + "20", border: `1px solid ${r.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{r.icon}</div>
//                     <div>
//                       <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text, marginBottom: 2 }}>{r.label}</div>
//                       <div style={{ fontSize: 10.5, color: T.textSub }}>{r.desc}</div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── TOAST ── */}
//         <div style={{ position: "fixed", bottom: 22, left: "50%", transform: toastVisible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(10px)", background: "#1A1611", border: "1px solid rgba(181,138,36,0.35)", borderRadius: 9, padding: "8px 18px", display: "flex", alignItems: "center", gap: 9, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", zIndex: 1000, opacity: toastVisible ? 1 : 0, pointerEvents: toastVisible ? "auto" : "none", transition: "opacity 0.22s,transform 0.22s", whiteSpace: "nowrap" }}>
//           <span style={{ color: "#B58A24", fontSize: 10 }}>✦</span>
//           <span style={{ fontSize: 12, fontWeight: 600, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{toastMsg}</span>
//         </div>

//       </div>
//     </>
//   );
// }