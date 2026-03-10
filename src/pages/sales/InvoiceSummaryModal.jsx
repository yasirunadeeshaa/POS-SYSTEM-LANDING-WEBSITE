import { useRef } from "react";

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt      = (n) => Number(n || 0).toFixed(2);
const initials = (n) => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

const METHOD_META = {
  cash:        { icon: "💵", label: "Cash",          color: "#2D6A4F" },
  card:        { icon: "💳", label: "Card",          color: "#2B5490" },
  wallet:      { icon: "📲", label: "Mobile Wallet", color: "#5B3D8F" },
  contactless: { icon: "⚡", label: "Contactless",   color: "#B8902A" },
  cheque:      { icon: "🧾", label: "Cheque",        color: "#7A5C1E" },
  credit:      { icon: "📋", label: "Credit",        color: "#B5372A" },
};

// ── STYLES ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  :root {
    --cream:#F6F3EC; --paper:#FDFBF6; --warm:#EEE9DF;
    --ink:#1B1713; --ink70:#4B4038; --ink40:#9E9080; --ink20:#C9C0B2; --ink10:#E4DDD2;
    --gold:#B8902A; --goldl:#D4A83C; --goldbg:rgba(184,144,42,.07); --goldbr:rgba(184,144,42,.22);
    --green:#2D6A4F; --greenbg:rgba(45,106,79,.08); --greenbr:rgba(45,106,79,.28);
    --red:#B5372A; --redbg:rgba(181,55,42,.08); --redbr:rgba(181,55,42,.22);
    --s3:0 24px 64px rgba(27,23,19,.24), 0 4px 16px rgba(27,23,19,.1);
  }

  /* ── Backdrop ── */
  .ism-backdrop {
    position:fixed; inset:0; background:rgba(27,23,19,.72);
    backdrop-filter:blur(8px); z-index:2000;
    display:flex; align-items:center; justify-content:center; padding:20px;
    animation:ismBdIn .22s ease;
  }
  @keyframes ismBdIn { from{opacity:0} to{opacity:1} }

  /* ── Modal shell ── */
  .ism-modal {
    background:var(--paper); border:1px solid var(--ink10); border-radius:14px;
    box-shadow:var(--s3); width:100%; max-width:780px; max-height:92vh;
    overflow:hidden; display:flex; flex-direction:column;
    animation:ismIn .28s cubic-bezier(.34,1.18,.64,1);
  }
  @keyframes ismIn { from{opacity:0;transform:translateY(22px) scale(.96)} to{opacity:1;transform:none} }

  /* ── Success header ── */
  .ism-head {
    background:var(--green); padding:20px 28px;
    display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
    position:relative; overflow:hidden;
  }
  .ism-head::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,.025) 18px, rgba(255,255,255,.025) 19px);
    pointer-events:none;
  }
  .ism-head-left { display:flex; align-items:center; gap:14px; position:relative }
  .ism-check {
    width:44px; height:44px; border-radius:50%; border:2px solid rgba(255,255,255,.4);
    background:rgba(255,255,255,.12); display:flex; align-items:center; justify-content:center;
    font-size:20px; animation:checkPop .3s .15s cubic-bezier(.34,1.5,.64,1) both;
  }
  @keyframes checkPop { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }
  .ism-head-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#fff; letter-spacing:.3px }
  .ism-head-sub   { font-size:11px; color:rgba(255,255,255,.65); margin-top:2px; letter-spacing:.5px }
  .ism-inv-pill   { font-family:'Geist Mono',monospace; font-size:12px; font-weight:600; color:#fff; background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.25); border-radius:6px; padding:6px 13px; letter-spacing:1px; position:relative }

  /* ── Body ── */
  .ism-body { display:grid; grid-template-columns:1fr 264px; flex:1; overflow:hidden }

  /* ── Left: invoice detail ── */
  .ism-left { padding:22px 26px; overflow-y:auto; border-right:1px solid var(--ink10) }
  .ism-left::-webkit-scrollbar { width:3px }
  .ism-left::-webkit-scrollbar-thumb { background:var(--ink10) }

  .ism-sec { font-size:9px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:8px; margin-bottom:12px }
  .ism-sec::after { content:''; flex:1; height:1px; background:var(--ink10) }

  /* Customer card */
  .ism-cust { display:flex; align-items:center; gap:12px; background:var(--goldbg); border:1px solid var(--goldbr); border-radius:8px; padding:12px 14px; margin-bottom:18px }
  .ism-cust-av { width:40px; height:40px; border-radius:6px; flex-shrink:0; background:var(--ink); border:1.5px solid var(--gold); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:600; color:var(--goldl) }
  .ism-cust-name { font-size:14px; font-weight:600; color:var(--ink) }
  .ism-cust-det  { font-size:11.5px; color:var(--ink40); margin-top:2px }

  /* Invoice meta grid */
  .ism-meta { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:18px }
  .ism-meta-item { background:var(--warm); border:1px solid var(--ink10); border-radius:6px; padding:9px 11px }
  .ism-meta-lbl { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); margin-bottom:3px }
  .ism-meta-val { font-family:'Geist Mono',monospace; font-size:12px; font-weight:600; color:var(--ink) }

  /* Line items table */
  .ism-table { width:100%; border-collapse:collapse; margin-bottom:14px }
  .ism-table th { font-size:9px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--ink40); padding:6px 8px; background:var(--warm); border-bottom:2px solid var(--gold); text-align:left }
  .ism-table th:last-child { text-align:right }
  .ism-table td { padding:8px 8px; border-bottom:1px solid var(--ink10); font-size:12px; color:var(--ink70); vertical-align:middle }
  .ism-table tr:last-child td { border-bottom:none }
  .ism-table tr:hover td { background:var(--warm) }
  .td-name { font-weight:500; color:var(--ink) }
  .td-sku  { font-family:'Geist Mono',monospace; font-size:10px; color:var(--ink40); margin-top:1px }
  .td-num  { font-family:'Geist Mono',monospace; font-size:12px; text-align:right }
  .td-disc { font-size:10px; color:var(--green); margin-top:1px }

  /* Totals block */
  .ism-totals { background:var(--warm); border:1px solid var(--ink10); border-radius:8px; padding:12px 14px; margin-bottom:18px }
  .ism-trow { display:flex; justify-content:space-between; padding:3px 0; font-size:12px }
  .ism-trow .tl { color:var(--ink40) }
  .ism-trow .tv { font-family:'Geist Mono',monospace; color:var(--ink70); font-size:11.5px }
  .ism-trow.disc .tl, .ism-trow.disc .tv { color:var(--green) }
  .ism-thr { height:1px; background:var(--ink10); margin:6px 0 }
  .ism-grand { display:flex; justify-content:space-between; align-items:center; background:var(--ink); border-radius:6px; padding:10px 14px; margin-top:8px }
  .ism-grand-lbl { font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:600; color:var(--goldl); letter-spacing:.3px }
  .ism-grand-val { font-family:'Geist Mono',monospace; font-size:20px; font-weight:600; color:#F6F3EC; letter-spacing:.5px }

  /* Payment methods used */
  .ism-pay-row { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid var(--ink10) }
  .ism-pay-row:last-child { border-bottom:none }
  .ism-pay-left { display:flex; align-items:center; gap:8px }
  .ism-pay-icon { font-size:16px }
  .ism-pay-lbl  { font-size:12.5px; font-weight:600 }
  .ism-pay-sub  { font-size:10px; color:var(--ink40); font-family:'Geist Mono',monospace; margin-top:1px }
  .ism-pay-amt  { font-family:'Geist Mono',monospace; font-size:13px; font-weight:700 }

  /* Note */
  .ism-note-box { background:var(--goldbg); border:1px solid var(--goldbr); border-radius:7px; padding:10px 13px; font-family:'Cormorant Garamond',serif; font-size:14px; font-style:italic; color:var(--ink70); line-height:1.6 }

  /* ── Right: actions ── */
  .ism-right { padding:22px 20px; background:var(--cream); display:flex; flex-direction:column; gap:8px; overflow-y:auto }
  .ism-right::-webkit-scrollbar { width:3px }
  .ism-right::-webkit-scrollbar-thumb { background:var(--ink10) }
  .ism-act-sec { font-size:9px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:var(--ink40); margin-bottom:2px; margin-top:4px }

  /* Action button base */
  .act-btn {
    width:100%; display:flex; align-items:center; gap:11px;
    padding:11px 14px; border-radius:8px; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:600;
    transition:all .16s; border:1.5px solid transparent; text-align:left;
  }
  .act-btn-icon { font-size:18px; flex-shrink:0; width:24px; text-align:center }
  .act-btn-text { flex:1 }
  .act-btn-title { font-size:12.5px; font-weight:600; line-height:1 }
  .act-btn-sub   { font-size:10.5px; font-weight:400; margin-top:2px; opacity:.7 }
  .act-btn-arrow { font-size:11px; opacity:.5 }

  /* Print — primary */
  .act-print {
    background:var(--ink); border-color:var(--ink); color:#F6F3EC;
  }
  .act-print:hover { background:var(--ink70); transform:translateY(-1px); box-shadow:0 4px 14px rgba(27,23,19,.25) }

  /* Thermal */
  .act-thermal {
    background:var(--paper); border-color:var(--ink10); color:var(--ink70);
  }
  .act-thermal:hover { border-color:var(--ink20); background:var(--warm); transform:translateY(-1px) }

  /* Email */
  .act-email {
    background:var(--bluebg,rgba(43,84,144,.08)); border-color:rgba(43,84,144,.25); color:#2B5490;
  }
  .act-email:hover { background:rgba(43,84,144,.14); transform:translateY(-1px) }

  /* WhatsApp */
  .act-whatsapp {
    background:rgba(37,211,102,.07); border-color:rgba(37,211,102,.3); color:#128C7E;
  }
  .act-whatsapp:hover { background:rgba(37,211,102,.14); transform:translateY(-1px) }

  /* PDF */
  .act-pdf {
    background:rgba(181,55,42,.07); border-color:rgba(181,55,42,.22); color:var(--red,#B5372A);
  }
  .act-pdf:hover { background:rgba(181,55,42,.13); transform:translateY(-1px) }

  /* Copy link */
  .act-copy {
    background:var(--goldbg); border-color:var(--goldbr); color:var(--gold);
  }
  .act-copy:hover { background:rgba(184,144,42,.14); transform:translateY(-1px) }

  /* New invoice */
  .act-new {
    background:var(--greenbg); border-color:var(--greenbr); color:var(--green);
    margin-top:4px;
  }
  .act-new:hover { background:rgba(45,106,79,.14); transform:translateY(-1px) }

  /* Divider */
  .act-divider { height:1px; background:var(--ink10); margin:4px 0 }

  /* Change badge */
  .ism-change-badge {
    display:flex; align-items:center; justify-content:space-between;
    background:var(--goldbg); border:1px solid var(--goldbr);
    border-radius:7px; padding:10px 14px;
  }
  .ism-change-lbl { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--gold); margin-bottom:3px }
  .ism-change-val { font-family:'Geist Mono',monospace; font-size:20px; font-weight:700; color:var(--gold) }
  .ism-change-hint { font-size:10.5px; color:var(--ink40) }

  /* Fully paid badge */
  .ism-paid-badge {
    display:flex; align-items:center; gap:10px;
    background:var(--greenbg); border:1px solid var(--greenbr);
    border-radius:7px; padding:10px 14px;
  }
  .ism-paid-icon { font-size:22px }
  .ism-paid-title { font-size:12px; font-weight:700; color:var(--green) }
  .ism-paid-sub   { font-size:10.5px; color:var(--green); opacity:.75; margin-top:1px }

  /* ── PRINT STYLES ── */
  @media print {
    body * { visibility:hidden !important }
    .ism-printable, .ism-printable * { visibility:visible !important }
    .ism-printable {
      position:fixed; inset:0; background:#fff;
      padding:32px; font-family:'DM Sans',sans-serif;
      color:#000; z-index:9999;
    }
    .ism-print-hide { display:none !important }
    .ism-print-header { text-align:center; margin-bottom:24px; border-bottom:2px solid #1B1713; padding-bottom:16px }
    .ism-print-co  { font-size:22px; font-weight:700; letter-spacing:1px }
    .ism-print-inv { font-size:13px; color:#666; margin-top:4px }
    .ism-print-table { width:100%; border-collapse:collapse; margin:16px 0 }
    .ism-print-table th { background:#f5f5f5; padding:8px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #ddd }
    .ism-print-table td { padding:8px; border-bottom:1px solid #eee; font-size:12px }
    .ism-print-table tr:last-child td { border-bottom:none }
    .ism-print-totals { margin-left:auto; width:220px; margin-top:8px }
    .ism-print-trow { display:flex; justify-content:space-between; padding:3px 0; font-size:12px }
    .ism-print-grand { display:flex; justify-content:space-between; padding:6px 0; font-size:15px; font-weight:700; border-top:2px solid #1B1713; margin-top:4px }
    .ism-print-footer { text-align:center; margin-top:32px; font-size:11px; color:#999; border-top:1px solid #eee; padding-top:12px }
  }
`;

// ── COMPONENT ─────────────────────────────────────────────────────────────────
/**
 * InvoiceSummaryModal
 *
 * Props:
 *   isOpen        {boolean}
 *   invoiceId     {string}
 *   customer      {{ name, address, email?, phone? }}
 *   lineItems     {Array<{ sku, name, cat, price, qty, lineDisc }>}
 *   grossTotal    {number}
 *   lineDiscTotal {number}
 *   invDiscAmt    {number}
 *   taxRate       {number}
 *   taxAmt        {number}
 *   extraCharge   {number}
 *   extraLabel    {string}
 *   total         {number}
 *   payments      {{ amounts, cards, wallets, cheques, note }}
 *   issueDate     {string}
 *   dueDate       {string}
 *   onClose       {() => void}           — back to invoice list / new invoice
 *   onNewInvoice  {() => void}
 */
export default function InvoiceSummaryModal({
  isOpen,
  invoiceId     = "INV-2026-000",
  customer      = { name: "Cash Customer", address: "Walk-in / Counter Sale" },
  lineItems     = [],
  grossTotal    = 0,
  lineDiscTotal = 0,
  invDiscAmt    = 0,
  taxRate       = 0,
  taxAmt        = 0,
  extraCharge   = 0,
  extraLabel    = "Extra",
  total         = 0,
  payments      = { amounts: {}, cards: [], wallets: [], cheques: [], note: "" },
  issueDate     = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  dueDate       = "",
  onClose,
  onNewInvoice,
}) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const { amounts = {}, cards = [], wallets = [], cheques = [], note = "" } = payments;

  // Build paid methods list for display
  const paidMethods = [];
  Object.entries(amounts).forEach(([id, val]) => {
    if (!(+val > 0)) return;
    const meta = METHOD_META[id] || { icon: "💰", label: id, color: "var(--ink)" };
    if (id === "card" && cards.some(c => +c.amount > 0)) {
      cards.filter(c => +c.amount > 0).forEach((c, i) => paidMethods.push({
        key: c.id, icon: "💳", label: `Card ${i + 1}`, color: "#2B5490",
        amount: +c.amount,
        sub: [c.bank, c.last4 ? `···· ${c.last4}` : "", c.holder].filter(Boolean).join("  ·  "),
      }));
    } else if (id === "wallet" && wallets.some(w => +w.amount > 0)) {
      wallets.filter(w => +w.amount > 0).forEach((w, i) => paidMethods.push({
        key: w.id, icon: "📲", label: `Wallet ${i + 1}`, color: "#5B3D8F",
        amount: +w.amount,
        sub: [w.wallet, w.txRef ? `Ref: ${w.txRef}` : ""].filter(Boolean).join("  ·  "),
      }));
    } else if (id === "cheque" && cheques.some(c => +c.amount > 0)) {
      cheques.filter(c => +c.amount > 0).forEach((c, i) => paidMethods.push({
        key: c.id, icon: "🧾", label: `Cheque ${i + 1}`, color: "#7A5C1E",
        amount: +c.amount,
        sub: [c.bank, c.chequeNo ? `#${c.chequeNo}` : "", c.holder].filter(Boolean).join("  ·  "),
      }));
    } else {
      paidMethods.push({ key: id, icon: meta.icon, label: meta.label, color: meta.color, amount: +val, sub: null });
    }
  });

  const totalPaid = paidMethods.reduce((s, m) => s + m.amount, 0);
  const change    = totalPaid > total + 0.001 ? totalPaid - total : 0;

  const handlePrint = () => window.print();

  const handlePDF = () => {
    // Trigger browser print → Save as PDF
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/invoice/${invoiceId}`);
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Printable receipt area (hidden on screen, visible on print) ── */}
      <div ref={printRef} className="ism-printable" style={{ display: "none" }}>
        <div className="ism-print-header">
          <div className="ism-print-co">NEXUS POS</div>
          <div className="ism-print-inv">Invoice {invoiceId} · {issueDate}</div>
          <div style={{ marginTop: 8, fontSize: 12 }}>
            {customer.name} · {customer.address}
          </div>
        </div>
        <table className="ism-print-table">
          <thead>
            <tr>
              <th>#</th><th>Item</th><th>SKU</th><th style={{ textAlign: "right" }}>Unit Price</th>
              <th style={{ textAlign: "center" }}>Qty</th><th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => {
              const discPrice = item.price * (1 - item.lineDisc / 100);
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 11 }}>{item.sku}</td>
                  <td style={{ textAlign: "right" }}>${fmt(discPrice)}{item.lineDisc > 0 && ` (-${item.lineDisc}%)`}</td>
                  <td style={{ textAlign: "center" }}>{item.qty}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>${fmt(discPrice * item.qty)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="ism-print-totals">
          {lineDiscTotal > 0 && <div className="ism-print-trow"><span>Line Discounts</span><span>−${fmt(lineDiscTotal)}</span></div>}
          {invDiscAmt   > 0 && <div className="ism-print-trow"><span>Invoice Discount</span><span>−${fmt(invDiscAmt)}</span></div>}
          <div className="ism-print-trow"><span>Tax ({taxRate}%)</span><span>${fmt(taxAmt)}</span></div>
          {extraCharge  > 0 && <div className="ism-print-trow"><span>{extraLabel}</span><span>+${fmt(extraCharge)}</span></div>}
          <div className="ism-print-grand"><span>Total</span><span>${fmt(total)}</span></div>
        </div>
        <div style={{ marginTop: 20, fontSize: 12 }}>
          <strong>Payment:</strong>{" "}
          {paidMethods.map(m => `${m.label} $${fmt(m.amount)}`).join("  |  ")}
          {change > 0 && `  |  Change $${fmt(change)}`}
        </div>
        {note && <div style={{ marginTop: 8, fontSize: 12, fontStyle: "italic" }}>Note: {note}</div>}
        <div className="ism-print-footer">Thank you for your purchase · Nexus POS</div>
      </div>

      {/* ── Modal ── */}
      <div className="ism-backdrop" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="ism-modal">

          {/* ── GREEN SUCCESS HEADER ── */}
          <div className="ism-head">
            <div className="ism-head-left">
              <div className="ism-check">✓</div>
              <div>
                <div className="ism-head-title">Invoice Issued Successfully</div>
                <div className="ism-head-sub">{issueDate} · {paidMethods.length} payment method{paidMethods.length !== 1 ? "s" : ""} · {lineItems.length} item{lineItems.length !== 1 ? "s" : ""}</div>
              </div>
            </div>
            <div className="ism-inv-pill">{invoiceId}</div>
          </div>

          <div className="ism-body">

            {/* ════ LEFT: Full invoice detail ════ */}
            <div className="ism-left">

              {/* Customer */}
              <div className="ism-sec">Customer</div>
              <div className="ism-cust">
                <div className="ism-cust-av">{initials(customer.name)}</div>
                <div>
                  <div className="ism-cust-name">{customer.name}</div>
                  <div className="ism-cust-det">{customer.address}</div>
                  {customer.email && <div className="ism-cust-det">{customer.email}</div>}
                  {customer.phone && <div className="ism-cust-det">{customer.phone}</div>}
                </div>
              </div>

              {/* Invoice meta */}
              <div className="ism-meta">
                <div className="ism-meta-item">
                  <div className="ism-meta-lbl">Invoice No.</div>
                  <div className="ism-meta-val">{invoiceId}</div>
                </div>
                <div className="ism-meta-item">
                  <div className="ism-meta-lbl">Issue Date</div>
                  <div className="ism-meta-val">{issueDate}</div>
                </div>
                <div className="ism-meta-item">
                  <div className="ism-meta-lbl">Due Date</div>
                  <div className="ism-meta-val">{dueDate || "—"}</div>
                </div>
              </div>

              {/* Line items */}
              <div className="ism-sec">Line Items</div>
              {lineItems.length > 0 ? (
                <table className="ism-table" style={{ marginBottom: 18 }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th style={{ textAlign: "center" }}>Qty</th>
                      <th style={{ textAlign: "right" }}>Unit Price</th>
                      <th style={{ textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, i) => {
                      const discPrice = item.price * (1 - item.lineDisc / 100);
                      const lineTotal = discPrice * item.qty;
                      return (
                        <tr key={i}>
                          <td style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10.5, color: "var(--ink20)" }}>
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td>
                            <div className="td-name">{item.name}</div>
                            <div className="td-sku">{item.sku} · {item.cat}</div>
                          </td>
                          <td style={{ textAlign: "center", fontFamily: "'Geist Mono',monospace", fontSize: 12 }}>{item.qty}</td>
                          <td style={{ textAlign: "right" }}>
                            <div className="td-num">${fmt(discPrice)}</div>
                            {item.lineDisc > 0 && <div className="td-disc">−{item.lineDisc}% disc</div>}
                          </td>
                          <td className="td-num">${fmt(lineTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div style={{ fontSize: 12, color: "var(--ink40)", marginBottom: 18, fontStyle: "italic" }}>No line items</div>
              )}

              {/* Totals */}
              <div className="ism-sec">Order Summary</div>
              <div className="ism-totals">
                <div className="ism-trow"><span className="tl">Gross Total</span><span className="tv">${fmt(grossTotal)}</span></div>
                {lineDiscTotal > 0 && <div className="ism-trow disc"><span className="tl">Line Discounts</span><span className="tv">−${fmt(lineDiscTotal)}</span></div>}
                {invDiscAmt   > 0 && <div className="ism-trow disc"><span className="tl">Invoice Discount</span><span className="tv">−${fmt(invDiscAmt)}</span></div>}
                <div className="ism-trow"><span className="tl">Tax ({taxRate}%)</span><span className="tv">${fmt(taxAmt)}</span></div>
                {extraCharge  > 0 && <div className="ism-trow"><span className="tl">{extraLabel}</span><span className="tv">+${fmt(extraCharge)}</span></div>}
                <div className="ism-grand">
                  <span className="ism-grand-lbl">Total Paid</span>
                  <span className="ism-grand-val">${fmt(total)}</span>
                </div>
              </div>

              {/* Payment methods */}
              <div className="ism-sec">Payment Received</div>
              <div style={{ background: "var(--paper)", border: "1px solid var(--ink10)", borderRadius: 8, padding: "2px 14px", marginBottom: note ? 18 : 0 }}>
                {paidMethods.map(m => (
                  <div key={m.key} className="ism-pay-row">
                    <div className="ism-pay-left">
                      <span className="ism-pay-icon">{m.icon}</span>
                      <div>
                        <div className="ism-pay-lbl" style={{ color: m.color }}>{m.label}</div>
                        {m.sub && <div className="ism-pay-sub">{m.sub}</div>}
                      </div>
                    </div>
                    <span className="ism-pay-amt" style={{ color: m.color }}>${fmt(m.amount)}</span>
                  </div>
                ))}
                {change > 0 && (
                  <div className="ism-pay-row">
                    <div className="ism-pay-left">
                      <span className="ism-pay-icon">↩</span>
                      <div><div className="ism-pay-lbl" style={{ color: "var(--gold)" }}>Change Returned</div></div>
                    </div>
                    <span className="ism-pay-amt" style={{ color: "var(--gold)" }}>${fmt(change)}</span>
                  </div>
                )}
              </div>

              {/* Note */}
              {note && (
                <>
                  <div className="ism-sec" style={{ marginTop: 18 }}>Note</div>
                  <div className="ism-note-box">"{note}"</div>
                </>
              )}

            </div>

            {/* ════ RIGHT: Action panel ════ */}
            <div className="ism-right">

              {/* Status badge */}
              {change > 0 ? (
                <div className="ism-change-badge">
                  <div>
                    <div className="ism-change-lbl">Change Due</div>
                    <div className="ism-change-val">${fmt(change)}</div>
                    <div className="ism-change-hint">Return to customer</div>
                  </div>
                  <span style={{ fontSize: 28 }}>↩</span>
                </div>
              ) : (
                <div className="ism-paid-badge">
                  <span className="ism-paid-icon">✅</span>
                  <div>
                    <div className="ism-paid-title">Payment Complete</div>
                    <div className="ism-paid-sub">${fmt(total)} received</div>
                  </div>
                </div>
              )}

              <div className="act-divider" />

              {/* Print actions */}
              <div className="ism-act-sec">Print</div>

              <button className="act-btn act-print" onClick={handlePrint}>
                <span className="act-btn-icon">🖨️</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Print Invoice</div>
                  <div className="act-btn-sub">Full A4 invoice</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <button className="act-btn act-thermal" onClick={handlePrint}>
                <span className="act-btn-icon">🧾</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Print Receipt</div>
                  <div className="act-btn-sub">Thermal / POS roll</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <button className="act-btn act-pdf" onClick={handlePDF}>
                <span className="act-btn-icon">📄</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Save as PDF</div>
                  <div className="act-btn-sub">Download to device</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <div className="act-divider" />

              {/* Share actions */}
              <div className="ism-act-sec">Share</div>

              <button className="act-btn act-email">
                <span className="act-btn-icon">✉️</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Send by Email</div>
                  <div className="act-btn-sub">
                    {customer.email && customer.email !== "—" ? customer.email : "Enter email address"}
                  </div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <button className="act-btn act-whatsapp">
                <span className="act-btn-icon">💬</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Send via WhatsApp</div>
                  <div className="act-btn-sub">
                    {customer.phone && customer.phone !== "—" ? customer.phone : "Enter phone number"}
                  </div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <button className="act-btn act-copy" onClick={handleCopyLink}>
                <span className="act-btn-icon">🔗</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Copy Invoice Link</div>
                  <div className="act-btn-sub">Share a view-only link</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <div className="act-divider" />

              {/* Next actions */}
              <div className="ism-act-sec">Next</div>

              <button className="act-btn act-new" onClick={onNewInvoice}>
                <span className="act-btn-icon">➕</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">New Invoice</div>
                  <div className="act-btn-sub">Start a fresh sale</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <button className="act-btn act-thermal" onClick={onClose}>
                <span className="act-btn-icon">📋</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">View All Invoices</div>
                  <div className="act-btn-sub">Go to invoice history</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}