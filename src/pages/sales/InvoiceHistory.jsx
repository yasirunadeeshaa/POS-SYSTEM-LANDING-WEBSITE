import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SAMPLE_INVOICES = [
  {
    id: "INV-2024-0088",
    customer: "Ravi Mendis",
    email: "ravi.mendis@email.com",
    phone: "+94 77 123 4567",
    date: "2026-03-07",
    due: "2026-03-21",
    status: "paid",
    items: [
      { name: "Wireless Earbuds Pro", sku: "WEP-221", qty: 2, price: 59.99 },
      { name: "USB-C Hub 7-in-1",     sku: "UCH-880", qty: 1, price: 34.99 },
      { name: "Leather Wallet Slim",  sku: "LWS-441", qty: 1, price: 24.99 },
    ],
    tax: 0.08,
    cashier: "Aria K.",
    register: "R-01",
    method: "Card",
  },
  {
    id: "INV-2024-0087",
    customer: "Priya Samarawickrama",
    email: "priya.s@gmail.com",
    phone: "+94 71 987 6543",
    date: "2026-03-07",
    due: "2026-03-21",
    status: "pending",
    items: [
      { name: "Scented Candle Set",      sku: "SCS-112", qty: 3, price: 16.00 },
      { name: "Stainless Water Bottle",  sku: "SWB-330", qty: 2, price: 16.99 },
    ],
    tax: 0.08,
    cashier: "Zoe R.",
    register: "R-04",
    method: "QR Pay",
  },
  {
    id: "INV-2024-0086",
    customer: "Daniel Wijesuriya",
    email: "d.wije@outlook.com",
    phone: "+94 76 555 0011",
    date: "2026-03-06",
    due: "2026-03-20",
    status: "overdue",
    items: [
      { name: "Notebook A5 Grid",   sku: "NAG-007", qty: 5, price: 5.99 },
      { name: "Cotton Crew T-Shirt", sku: "CCT-089", qty: 2, price: 17.99 },
    ],
    tax: 0.08,
    cashier: "Marco D.",
    register: "R-02",
    method: "Cash",
  },
  {
    id: "INV-2024-0085",
    customer: "Walk-in Customer",
    email: "—",
    phone: "—",
    date: "2026-03-06",
    due: "2026-03-06",
    status: "paid",
    items: [
      { name: "Phone Case iPhone", sku: "PCI-556", qty: 1, price: 14.99 },
    ],
    tax: 0.08,
    cashier: "Lena S.",
    register: "R-03",
    method: "Contactless",
  },
];

const statusStyle = {
  paid:    { bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.22)",  text: "#34d399",  dot: "#34d399" },
  pending: { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.22)",  text: "#f59e0b",  dot: "#f59e0b" },
  overdue: { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.22)", text: "#f87171",  dot: "#f87171" },
};

const methodColor = {
  Card: "#5b8af0", Cash: "#34d399", "QR Pay": "#c084fc", Contactless: "#38bdf8",
};

function calcTotals(inv) {
  const sub = inv.items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = sub * inv.tax;
  return { sub, tax, total: sub + tax };
}

// ── INVOICE DETAIL MODAL ─────────────────────────────────────────────────────
function InvoiceDetail({ inv, onClose }) {
  const { sub, tax, total } = calcTotals(inv);
  const s = statusStyle[inv.status];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="dp-top">
          <div className="dp-brand">
            <div className="dp-logo">N</div>
            <div>
              <div className="dp-brand-name">Nexus POS</div>
              <div className="dp-brand-sub">Retail Management System</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="dp-inv-id">{inv.id}</div>
            <div className="dp-inv-date">Issued {inv.date} · Due {inv.due}</div>
            <span className="dp-status" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block", marginRight: 5 }} />
              {inv.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="dp-divider" />

        {/* Billing info */}
        <div className="dp-meta-row">
          <div className="dp-meta-block">
            <div className="dp-meta-label">Billed To</div>
            <div className="dp-meta-val">{inv.customer}</div>
            <div className="dp-meta-sub">{inv.email}</div>
            <div className="dp-meta-sub">{inv.phone}</div>
          </div>
          <div className="dp-meta-block">
            <div className="dp-meta-label">Processed By</div>
            <div className="dp-meta-val">{inv.cashier}</div>
            <div className="dp-meta-sub">Register {inv.register}</div>
            <div className="dp-meta-sub" style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: methodColor[inv.method], display: "inline-block" }} />
              {inv.method}
            </div>
          </div>
          <div className="dp-meta-block" style={{ textAlign: "right" }}>
            <div className="dp-meta-label">Amount Due</div>
            <div className="dp-total-big" style={{ color: inv.status === "paid" ? "#34d399" : inv.status === "overdue" ? "#f87171" : "#f59e0b" }}>
              ${total.toFixed(2)}
            </div>
            <div className="dp-meta-sub">incl. {(inv.tax * 100).toFixed(0)}% tax</div>
          </div>
        </div>

        <div className="dp-divider" />

        {/* Line items */}
        <div className="dp-items-head">
          <span>Item</span><span>SKU</span><span style={{ textAlign: "center" }}>Qty</span>
          <span style={{ textAlign: "right" }}>Unit Price</span><span style={{ textAlign: "right" }}>Total</span>
        </div>
        {inv.items.map((item, i) => (
          <div key={i} className="dp-item-row">
            <span className="dp-item-name">{item.name}</span>
            <span className="dp-item-sku">{item.sku}</span>
            <span className="dp-item-qty">{item.qty}</span>
            <span className="dp-item-price">${item.price.toFixed(2)}</span>
            <span className="dp-item-line">${(item.qty * item.price).toFixed(2)}</span>
          </div>
        ))}

        <div className="dp-divider" />

        {/* Totals */}
        <div className="dp-totals">
          <div className="dp-total-row">
            <span>Subtotal</span><span>${sub.toFixed(2)}</span>
          </div>
          <div className="dp-total-row">
            <span>Tax ({(inv.tax * 100).toFixed(0)}%)</span><span>${tax.toFixed(2)}</span>
          </div>
          <div className="dp-total-row dp-total-final">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="dp-actions">
          <button className="dp-btn dp-btn-ghost" onClick={onClose}>✕ Close</button>
          <button className="dp-btn dp-btn-ghost">⬇ Download PDF</button>
          <button className="dp-btn dp-btn-ghost">✉ Send Email</button>
          {inv.status !== "paid" && (
            <button className="dp-btn dp-btn-primary">✓ Mark as Paid</button>
          )}
        </div>

      </div>
    </div>
  );
}

// ── MAIN INVOICE PAGE ────────────────────────────────────────────────────────
export default function Invoice() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_INVOICES.filter(inv => {
    const matchFilter = filter === "all" || inv.status === filter;
    const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
                        inv.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalRevenue = SAMPLE_INVOICES.reduce((s, i) => s + calcTotals(i).total, 0);
  const paidCount    = SAMPLE_INVOICES.filter(i => i.status === "paid").length;
  const pendingCount = SAMPLE_INVOICES.filter(i => i.status === "pending").length;
  const overdueCount = SAMPLE_INVOICES.filter(i => i.status === "overdue").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #07080f;
          --surface: #0c0e1a;
          --card: #0e1020;
          --border: rgba(255,255,255,0.055);
          --border-h: rgba(91,138,240,0.3);
          --text: #eef0f8;
          --text-2: #9ba3bf;
          --text-3: #5a6380;
          --text-4: #2e3450;
          --accent: #5b8af0;
          --accent-2: #8eb4ff;
          --green: #34d399;
          --amber: #f59e0b;
          --red: #f87171;
        }
        html, body, #root {
          width: 100%; min-height: 100%;
          background: var(--bg);
          font-family: 'Geist', system-ui, sans-serif;
          color: var(--text);
          -webkit-font-smoothing: antialiased;
        }

        /* PAGE */
        .inv-page { min-height: 100vh; display: flex; flex-direction: column; }

        /* TOPBAR */
        .inv-topbar {
          height: 58px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
          background: rgba(7,8,15,0.97);
          backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 50;
        }
        .inv-topbar-l { display: flex; align-items: center; gap: 14px; }
        .back-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 9px;
          color: var(--text-2);
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Geist', sans-serif;
        }
        .back-btn:hover { background: rgba(91,138,240,0.08); color: var(--accent-2); border-color: var(--border-h); }
        .tb-sep { width: 1px; height: 20px; background: var(--border); }
        .inv-page-title { font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
        .inv-page-sub { font-size: 12px; color: var(--text-3); font-family: 'Geist Mono', monospace; }
        .inv-topbar-r { display: flex; align-items: center; gap: 8px; }
        .tb-action-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px;
          border-radius: 9px;
          font-size: 12.5px; font-weight: 700;
          cursor: pointer;
          font-family: 'Geist', sans-serif;
          transition: all 0.15s;
        }
        .tb-action-ghost {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          color: var(--text-2);
        }
        .tb-action-ghost:hover { background: rgba(255,255,255,0.06); color: var(--text); }
        .tb-action-primary {
          background: rgba(91,138,240,0.14);
          border: 1px solid rgba(91,138,240,0.3);
          color: var(--accent-2);
        }
        .tb-action-primary:hover { background: rgba(91,138,240,0.22); }

        /* CONTENT */
        .inv-content { flex: 1; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; max-width: 1400px; margin: 0 auto; width: 100%; }

        /* STATS ROW */
        .inv-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .stat-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 18px;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          animation: fadeUp 0.35s ease both;
        }
        .stat-card:hover { border-color: rgba(91,138,240,0.15); transform: translateY(-1px); }
        .stat-shine { position: absolute; top: 0; left: 0; right: 0; height: 1px; }
        .stat-label { font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); margin-bottom: 6px; }
        .stat-val { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin-bottom: 3px; font-family: 'Geist Mono', monospace; }
        .stat-meta { font-size: 11.5px; color: var(--text-3); }

        /* FILTERS */
        .inv-filters { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .search-box {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          flex: 1; min-width: 220px; max-width: 320px;
        }
        .search-box:focus-within { border-color: var(--border-h); }
        .search-icon { color: var(--text-3); font-size: 14px; }
        .search-input {
          background: none; border: none; outline: none;
          color: var(--text); font-size: 13px; font-family: 'Geist', sans-serif;
          width: 100%;
        }
        .search-input::placeholder { color: var(--text-3); }
        .filter-tabs { display: flex; gap: 3px; }
        .f-tab {
          padding: 7px 15px; border-radius: 9px; border: 1px solid transparent;
          background: transparent; color: var(--text-3); font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: 'Geist', sans-serif; transition: all 0.14s;
          text-transform: capitalize;
        }
        .f-tab:hover { color: var(--text-2); background: rgba(255,255,255,0.03); }
        .f-tab.active { background: rgba(91,138,240,0.1); border-color: rgba(91,138,240,0.25); color: var(--accent-2); }
        .f-tab-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 6px; }

        /* TABLE */
        .inv-table-wrap {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          animation: fadeUp 0.4s ease both;
          animation-delay: 0.1s;
        }
        .inv-table-head {
          display: grid;
          grid-template-columns: 150px 1fr 120px 110px 110px 90px 60px;
          padding: 12px 20px;
          border-bottom: 1px solid var(--border);
          font-size: 10.5px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--text-4);
          background: rgba(255,255,255,0.015);
          gap: 8px;
        }
        .inv-row {
          display: grid;
          grid-template-columns: 150px 1fr 120px 110px 110px 90px 60px;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          align-items: center; gap: 8px;
          cursor: pointer;
          transition: background 0.13s;
        }
        .inv-row:last-child { border-bottom: none; }
        .inv-row:hover { background: rgba(91,138,240,0.04); }
        .inv-id { font-family: 'Geist Mono', monospace; font-size: 12px; font-weight: 600; color: var(--accent-2); }
        .inv-cust { font-size: 13px; font-weight: 600; color: var(--text); }
        .inv-cust-email { font-size: 11px; color: var(--text-3); margin-top: 2px; }
        .inv-date { font-family: 'Geist Mono', monospace; font-size: 12px; color: var(--text-2); }
        .inv-method { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--text-2); font-weight: 500; }
        .inv-method-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .inv-amount { font-family: 'Geist Mono', monospace; font-size: 14px; font-weight: 700; color: var(--text); }
        .inv-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 10.5px; font-weight: 700;
          font-family: 'Geist Mono', monospace;
          text-transform: uppercase; white-space: nowrap;
        }
        .inv-badge-dot { width: 5px; height: 5px; border-radius: 50%; }
        .inv-chevron { color: var(--text-4); font-size: 14px; text-align: right; }
        .inv-empty { padding: 48px; text-align: center; color: var(--text-3); font-size: 13px; }

        /* OVERLAY + DETAIL PANEL */
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .detail-panel {
          background: #0e1020;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          width: 100%; max-width: 680px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(91,138,240,0.07);
          animation: slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1);
          padding: 28px;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .detail-panel::-webkit-scrollbar { width: 3px; }
        .detail-panel::-webkit-scrollbar-thumb { background: rgba(91,138,240,0.2); border-radius: 2px; }

        .dp-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .dp-brand { display: flex; align-items: center; gap: 12px; }
        .dp-logo {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #5b8af0, #9b72f7);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 800; color: #fff;
          box-shadow: 0 0 20px rgba(91,138,240,0.3);
        }
        .dp-brand-name { font-size: 15px; font-weight: 800; letter-spacing: -0.02em; }
        .dp-brand-sub { font-size: 11px; color: var(--text-3); margin-top: 2px; }
        .dp-inv-id { font-family: 'Geist Mono', monospace; font-size: 18px; font-weight: 700; color: var(--accent-2); }
        .dp-inv-date { font-size: 11.5px; color: var(--text-3); margin: 4px 0 8px; font-family: 'Geist Mono', monospace; }
        .dp-status { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'Geist Mono', monospace; }

        .dp-divider { height: 1px; background: var(--border); margin: 20px 0; }

        .dp-meta-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .dp-meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-4); font-weight: 700; margin-bottom: 6px; }
        .dp-meta-val { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
        .dp-meta-sub { font-size: 12px; color: var(--text-3); margin-top: 2px; display: flex; align-items: center; gap: 4px; }
        .dp-total-big { font-family: 'Geist Mono', monospace; font-size: 28px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin-bottom: 3px; }

        .dp-items-head {
          display: grid; grid-template-columns: 1fr 90px 50px 90px 90px;
          font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--text-4); padding: 0 0 8px; border-bottom: 1px solid var(--border); gap: 8px;
          margin-bottom: 4px;
        }
        .dp-item-row {
          display: grid; grid-template-columns: 1fr 90px 50px 90px 90px;
          align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.03); gap: 8px;
        }
        .dp-item-row:last-child { border-bottom: none; }
        .dp-item-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .dp-item-sku { font-family: 'Geist Mono', monospace; font-size: 11px; color: var(--text-3); }
        .dp-item-qty { font-family: 'Geist Mono', monospace; font-size: 13px; color: var(--text-2); text-align: center; }
        .dp-item-price { font-family: 'Geist Mono', monospace; font-size: 13px; color: var(--text-2); text-align: right; }
        .dp-item-line { font-family: 'Geist Mono', monospace; font-size: 13px; font-weight: 700; color: var(--text); text-align: right; }

        .dp-totals { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
        .dp-total-row { display: flex; gap: 48px; font-size: 13px; color: var(--text-2); }
        .dp-total-row span:last-child { font-family: 'Geist Mono', monospace; font-weight: 600; min-width: 72px; text-align: right; }
        .dp-total-final { font-size: 15px; font-weight: 800; color: var(--text); margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--border); }

        .dp-actions { display: flex; gap: 8px; margin-top: 24px; flex-wrap: wrap; }
        .dp-btn {
          padding: 9px 18px; border-radius: 10px;
          font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: 'Geist', sans-serif;
          transition: all 0.15s; display: flex; align-items: center; gap: 6px;
        }
        .dp-btn-ghost { background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: var(--text-2); }
        .dp-btn-ghost:hover { background: rgba(255,255,255,0.06); color: var(--text); }
        .dp-btn-primary { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); color: #34d399; margin-left: auto; }
        .dp-btn-primary:hover { background: rgba(52,211,153,0.18); }

        @media (max-width: 900px) {
          .inv-table-head, .inv-row { grid-template-columns: 130px 1fr 100px 90px 80px; }
          .inv-table-head > span:nth-child(3),
          .inv-row > *:nth-child(3) { display: none; }
          .inv-stats { grid-template-columns: repeat(2,1fr); }
          .dp-meta-row { grid-template-columns: 1fr 1fr; }
          .dp-meta-row > div:last-child { grid-column: 1 / -1; text-align: left; }
          .dp-total-big { font-size: 22px; }
        }
      `}</style>

      <div className="inv-page">

        {/* TOPBAR */}
        <header className="inv-topbar">
          <div className="inv-topbar-l">
            <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
              ← Dashboard
            </button>
            <div className="tb-sep" />
            <div>
              <div className="inv-page-title">Invoices</div>
            </div>
            <div className="inv-page-sub">
              {SAMPLE_INVOICES.length} total · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
          <div className="inv-topbar-r">
            <button className="tb-action-btn tb-action-ghost">⬇ Export CSV</button>
            <button className="tb-action-btn tb-action-ghost">⎙ Print All</button>
            <button className="tb-action-btn tb-action-primary">＋ New Invoice</button>
          </div>
        </header>

        <div className="inv-content">

          {/* STATS */}
          <div className="inv-stats">
            {[
              { label: "Total Revenue",    val: `$${totalRevenue.toFixed(2)}`, meta: `${SAMPLE_INVOICES.length} invoices`,  color: "#5b8af0" },
              { label: "Paid",             val: String(paidCount),             meta: "Completed",                            color: "#34d399" },
              { label: "Pending",          val: String(pendingCount),          meta: "Awaiting payment",                     color: "#f59e0b" },
              { label: "Overdue",          val: String(overdueCount),          meta: "Action required",                      color: "#f87171" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="stat-shine" style={{ background: `linear-gradient(90deg, transparent, ${s.color}60, transparent)` }} />
                <div className="stat-label">{s.label}</div>
                <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
                <div className="stat-meta">{s.meta}</div>
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div className="inv-filters">
            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder="Search by ID or customer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {[
                { key: "all",     label: "All",     dot: "#5b8af0" },
                { key: "paid",    label: "Paid",    dot: "#34d399" },
                { key: "pending", label: "Pending", dot: "#f59e0b" },
                { key: "overdue", label: "Overdue", dot: "#f87171" },
              ].map(f => (
                <button key={f.key} className={`f-tab ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
                  <span className="f-tab-dot" style={{ background: f.dot }} />
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="inv-table-wrap">
            <div className="inv-table-head">
              <span>Invoice ID</span>
              <span>Customer</span>
              <span>Date</span>
              <span>Method</span>
              <span>Amount</span>
              <span>Status</span>
              <span></span>
            </div>

            {filtered.length === 0 ? (
              <div className="inv-empty">No invoices match your search.</div>
            ) : filtered.map((inv, i) => {
              const { total } = calcTotals(inv);
              const s = statusStyle[inv.status];
              return (
                <div key={i} className="inv-row" onClick={() => setSelected(inv)}>
                  <span className="inv-id">{inv.id}</span>
                  <div>
                    <div className="inv-cust">{inv.customer}</div>
                    <div className="inv-cust-email">{inv.email}</div>
                  </div>
                  <span className="inv-date">{inv.date}</span>
                  <span className="inv-method">
                    <span className="inv-method-dot" style={{ background: methodColor[inv.method] }} />
                    {inv.method}
                  </span>
                  <span className="inv-amount">${total.toFixed(2)}</span>
                  <span className="inv-badge" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                    <span className="inv-badge-dot" style={{ background: s.dot }} />
                    {inv.status}
                  </span>
                  <span className="inv-chevron">›</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* DETAIL MODAL */}
      {selected && <InvoiceDetail inv={selected} onClose={() => setSelected(null)} />}
    </>
  );
}