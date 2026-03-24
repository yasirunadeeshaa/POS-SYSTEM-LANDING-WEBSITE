import { useRef } from "react";

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt      = (n) => Number(n || 0).toFixed(2);
const initials = (n) => (n || "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

const STATUS_META = {
  draft:    { color: "#9E9080", bg: "rgba(158,144,128,.1)",  border: "rgba(158,144,128,.25)", label: "Draft",    icon: "✏️" },
  sent:     { color: "#2B5490", bg: "rgba(43,84,144,.08)",   border: "rgba(43,84,144,.25)",   label: "Sent",     icon: "✉️" },
  accepted: { color: "#2D6A4F", bg: "rgba(45,106,79,.08)",   border: "rgba(45,106,79,.28)",   label: "Accepted", icon: "✅" },
  rejected: { color: "#B5372A", bg: "rgba(181,55,42,.08)",   border: "rgba(181,55,42,.22)",   label: "Rejected", icon: "✗"  },
  expired:  { color: "#B8902A", bg: "rgba(184,144,42,.08)",  border: "rgba(184,144,42,.22)",  label: "Expired",  icon: "⏱" },
};

// ── STYLES ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  :root {
    --cream:#F6F3EC; --paper:#FDFBF6; --warm:#EEE9DF;
    --ink:#1B1713; --ink70:#4B4038; --ink40:#9E9080; --ink20:#C9C0B2; --ink10:#E4DDD2;
    --gold:#B8902A; --goldl:#D4A83C; --goldd:#8A6A1A;
    --goldbg:rgba(184,144,42,.07); --goldbr:rgba(184,144,42,.22);
    --green:#2D6A4F; --greenbg:rgba(45,106,79,.08); --greenbr:rgba(45,106,79,.28);
    --red:#B5372A; --redbg:rgba(181,55,42,.08); --redbr:rgba(181,55,42,.22);
    --blue:#2B5490; --bluebg:rgba(43,84,144,.08); --bluebr:rgba(43,84,144,.25);
    --s3:0 24px 64px rgba(27,23,19,.24), 0 4px 16px rgba(27,23,19,.1);
  }

  /* ── Backdrop ── */
  .qsm-backdrop {
    position:fixed; inset:0; background:rgba(27,23,19,.72);
    backdrop-filter:blur(8px); z-index:2000;
    display:flex; align-items:center; justify-content:center; padding:20px;
    animation:qsmBdIn .22s ease;
  }
  @keyframes qsmBdIn { from{opacity:0} to{opacity:1} }

  /* ── Modal shell ── */
  .qsm-modal {
    background:var(--paper); border:1px solid var(--ink10); border-radius:14px;
    box-shadow:var(--s3); width:100%; max-width:780px; max-height:92vh;
    overflow:hidden; display:flex; flex-direction:column;
    animation:qsmIn .28s cubic-bezier(.34,1.18,.64,1);
  }
  @keyframes qsmIn { from{opacity:0;transform:translateY(22px) scale(.96)} to{opacity:1;transform:none} }

  /* ── Gold header ── */
  .qsm-head {
    background:var(--ink); padding:20px 28px;
    display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
    position:relative; overflow:hidden;
    border-bottom:2px solid var(--gold);
  }
  .qsm-head::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(184,144,42,.03) 18px, rgba(184,144,42,.03) 19px);
    pointer-events:none;
  }
  .qsm-head::after {
    content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--goldl) 30%,var(--gold) 70%,transparent);
    opacity:.45;
  }
  .qsm-head-left { display:flex; align-items:center; gap:14px; position:relative }
  .qsm-icon-wrap {
    width:44px; height:44px; border-radius:10px; flex-shrink:0;
    background:rgba(184,144,42,.12); border:1.5px solid rgba(184,144,42,.35);
    display:flex; align-items:center; justify-content:center;
    font-size:22px;
    animation:iconPop .3s .15s cubic-bezier(.34,1.5,.64,1) both;
  }
  @keyframes iconPop { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }
  .qsm-head-eyebrow { font-family:'DM Sans',sans-serif; font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:rgba(184,144,42,.7); margin-bottom:4px }
  .qsm-head-title   { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#F6F3EC; letter-spacing:.3px; line-height:1 }
  .qsm-head-sub     { font-size:11px; color:rgba(246,243,236,.45); margin-top:3px; letter-spacing:.5px }
  .qsm-head-right   { display:flex; align-items:center; gap:10px; position:relative }
  .qsm-quo-pill {
    font-family:'Geist Mono',monospace; font-size:12px; font-weight:600;
    color:var(--goldl); background:rgba(184,144,42,.12); border:1px solid rgba(184,144,42,.3);
    border-radius:6px; padding:6px 13px; letter-spacing:1px;
  }

  /* ── Body ── */
  .qsm-body { display:grid; grid-template-columns:1fr 264px; flex:1; overflow:hidden }

  /* ── Left ── */
  .qsm-left { padding:22px 26px; overflow-y:auto; border-right:1px solid var(--ink10) }
  .qsm-left::-webkit-scrollbar { width:3px }
  .qsm-left::-webkit-scrollbar-thumb { background:var(--ink10) }

  .qsm-sec {
    font-size:9px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase;
    color:var(--ink40); display:flex; align-items:center; gap:8px; margin-bottom:12px;
  }
  .qsm-sec::after { content:''; flex:1; height:1px; background:var(--ink10) }

  /* Customer card */
  .qsm-cust {
    display:flex; align-items:center; gap:12px;
    background:var(--goldbg); border:1px solid var(--goldbr);
    border-radius:8px; padding:12px 14px; margin-bottom:18px;
  }
  .qsm-cust-av {
    width:40px; height:40px; border-radius:6px; flex-shrink:0;
    background:var(--ink); border:1.5px solid var(--gold);
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:600; color:var(--goldl);
  }
  .qsm-cust-name { font-size:14px; font-weight:600; color:var(--ink) }
  .qsm-cust-det  { font-size:11.5px; color:var(--ink40); margin-top:2px }

  /* Meta grid */
  .qsm-meta { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:18px }
  .qsm-meta-item { background:var(--warm); border:1px solid var(--ink10); border-radius:6px; padding:9px 11px }
  .qsm-meta-lbl { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); margin-bottom:3px }
  .qsm-meta-val { font-family:'Geist Mono',monospace; font-size:12px; font-weight:600; color:var(--ink) }
  .qsm-meta-val.expiring { color:var(--gold) }
  .qsm-meta-val.expired  { color:var(--red)  }
  .qsm-meta-val.ok       { color:var(--green) }

  /* Reference / subject row */
  .qsm-ref-row {
    display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:18px;
  }
  .qsm-ref-item { background:var(--warm); border:1px solid var(--ink10); border-radius:6px; padding:9px 11px }
  .qsm-ref-lbl { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); margin-bottom:3px }
  .qsm-ref-val { font-size:12.5px; font-weight:500; color:var(--ink70) }

  /* Line items table */
  .qsm-table { width:100%; border-collapse:collapse; margin-bottom:14px }
  .qsm-table th {
    font-size:9px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;
    color:var(--ink40); padding:6px 8px; background:var(--warm);
    border-bottom:2px solid var(--gold); text-align:left;
  }
  .qsm-table th:last-child { text-align:right }
  .qsm-table td { padding:8px 8px; border-bottom:1px solid var(--ink10); font-size:12px; color:var(--ink70); vertical-align:middle }
  .qsm-table tr:last-child td { border-bottom:none }
  .qsm-table tr:hover td { background:var(--warm) }
  .qtd-name { font-weight:500; color:var(--ink) }
  .qtd-sku  { font-family:'Geist Mono',monospace; font-size:10px; color:var(--ink40); margin-top:1px }
  .qtd-num  { font-family:'Geist Mono',monospace; font-size:12px; text-align:right }
  .qtd-disc { font-size:10px; color:var(--green); margin-top:1px }

  /* Totals block */
  .qsm-totals { background:var(--warm); border:1px solid var(--ink10); border-radius:8px; padding:12px 14px; margin-bottom:18px }
  .qsm-trow { display:flex; justify-content:space-between; padding:3px 0; font-size:12px }
  .qsm-trow .tl { color:var(--ink40) }
  .qsm-trow .tv { font-family:'Geist Mono',monospace; color:var(--ink70); font-size:11.5px }
  .qsm-trow.disc .tl, .qsm-trow.disc .tv { color:var(--green) }
  .qsm-thr { height:1px; background:var(--ink10); margin:6px 0 }
  .qsm-grand {
    display:flex; justify-content:space-between; align-items:center;
    background:var(--ink); border-radius:6px; padding:10px 14px; margin-top:8px;
  }
  .qsm-grand-lbl { font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:600; color:var(--goldl); letter-spacing:.3px }
  .qsm-grand-val { font-family:'Geist Mono',monospace; font-size:20px; font-weight:600; color:#F6F3EC; letter-spacing:.5px }

  /* Terms / notes */
  .qsm-note-box {
    background:var(--goldbg); border:1px solid var(--goldbr); border-radius:7px;
    padding:10px 13px; font-family:'Cormorant Garamond',serif;
    font-size:14px; font-style:italic; color:var(--ink70); line-height:1.6;
  }

  /* Validity countdown */
  .qsm-validity {
    display:flex; align-items:center; justify-content:space-between;
    background:var(--greenbg); border:1px solid var(--greenbr);
    border-radius:7px; padding:10px 14px; margin-bottom:18px;
  }
  .qsm-validity.warn { background:var(--goldbg); border-color:var(--goldbr) }
  .qsm-validity.dead { background:var(--redbg);  border-color:var(--redbr)  }
  .qsm-val-left { display:flex; align-items:center; gap:10px }
  .qsm-val-icon { font-size:20px }
  .qsm-val-title { font-size:12px; font-weight:700 }
  .qsm-val-sub   { font-size:10.5px; opacity:.75; margin-top:1px }
  .qsm-val-badge {
    font-family:'Geist Mono',monospace; font-size:18px; font-weight:700;
  }

  /* ── Right: actions ── */
  .qsm-right {
    padding:22px 20px; background:var(--cream);
    display:flex; flex-direction:column; gap:8px; overflow-y:auto;
  }
  .qsm-right::-webkit-scrollbar { width:3px }
  .qsm-right::-webkit-scrollbar-thumb { background:var(--ink10) }
  .qsm-act-sec {
    font-size:9px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase;
    color:var(--ink40); margin-bottom:2px; margin-top:4px;
  }

  /* Status badge */
  .qsm-status-badge {
    display:flex; align-items:center; gap:10px;
    border-radius:7px; padding:10px 14px;
  }
  .qsm-status-icon  { font-size:22px }
  .qsm-status-title { font-size:12px; font-weight:700 }
  .qsm-status-sub   { font-size:10.5px; opacity:.75; margin-top:1px }

  /* Action buttons */
  .act-btn {
    width:100%; display:flex; align-items:center; gap:11px;
    padding:11px 14px; border-radius:8px; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:600;
    transition:all .16s; border:1.5px solid transparent; text-align:left;
  }
  .act-btn-icon  { font-size:18px; flex-shrink:0; width:24px; text-align:center }
  .act-btn-text  { flex:1 }
  .act-btn-title { font-size:12.5px; font-weight:600; line-height:1 }
  .act-btn-sub   { font-size:10.5px; font-weight:400; margin-top:2px; opacity:.7 }
  .act-btn-arrow { font-size:11px; opacity:.5 }

  .act-primary  { background:var(--ink); border-color:var(--ink); color:#F6F3EC }
  .act-primary:hover { background:var(--ink70); transform:translateY(-1px); box-shadow:0 4px 14px rgba(27,23,19,.25) }

  .act-gold { background:var(--goldbg); border-color:var(--goldbr); color:var(--gold) }
  .act-gold:hover { background:rgba(184,144,42,.14); transform:translateY(-1px) }

  .act-ghost { background:var(--paper); border-color:var(--ink10); color:var(--ink70) }
  .act-ghost:hover { border-color:var(--ink20); background:var(--warm); transform:translateY(-1px) }

  .act-email { background:var(--bluebg); border-color:var(--bluebr); color:var(--blue) }
  .act-email:hover { background:rgba(43,84,144,.14); transform:translateY(-1px) }

  .act-whatsapp { background:rgba(37,211,102,.07); border-color:rgba(37,211,102,.3); color:#128C7E }
  .act-whatsapp:hover { background:rgba(37,211,102,.14); transform:translateY(-1px) }

  .act-pdf { background:var(--redbg); border-color:var(--redbr); color:var(--red) }
  .act-pdf:hover { background:rgba(181,55,42,.13); transform:translateY(-1px) }

  .act-copy { background:var(--goldbg); border-color:var(--goldbr); color:var(--gold) }
  .act-copy:hover { background:rgba(184,144,42,.14); transform:translateY(-1px) }

  .act-green { background:var(--greenbg); border-color:var(--greenbr); color:var(--green) }
  .act-green:hover { background:rgba(45,106,79,.14); transform:translateY(-1px) }

  .act-divider { height:1px; background:var(--ink10); margin:4px 0 }

  /* ── PRINT STYLES ── */
  @media print {
    body * { visibility:hidden !important }
    .qsm-printable, .qsm-printable * { visibility:visible !important }
    .qsm-printable {
      position:fixed; inset:0; background:#fff;
      padding:32px; font-family:'DM Sans',sans-serif; color:#000; z-index:9999;
    }
    .qsm-print-header { text-align:center; margin-bottom:24px; border-bottom:2px solid #1B1713; padding-bottom:16px }
    .qsm-print-co     { font-size:22px; font-weight:700; letter-spacing:1px }
    .qsm-print-quo    { font-size:13px; color:#666; margin-top:4px }
    .qsm-print-table  { width:100%; border-collapse:collapse; margin:16px 0 }
    .qsm-print-table th { background:#f5f5f5; padding:8px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #ddd }
    .qsm-print-table td { padding:8px; border-bottom:1px solid #eee; font-size:12px }
    .qsm-print-table tr:last-child td { border-bottom:none }
    .qsm-print-totals { margin-left:auto; width:220px; margin-top:8px }
    .qsm-print-trow   { display:flex; justify-content:space-between; padding:3px 0; font-size:12px }
    .qsm-print-grand  { display:flex; justify-content:space-between; padding:6px 0; font-size:15px; font-weight:700; border-top:2px solid #1B1713; margin-top:4px }
    .qsm-print-footer { text-align:center; margin-top:32px; font-size:11px; color:#999; border-top:1px solid #eee; padding-top:12px }
  }
`;

// ── COMPONENT ─────────────────────────────────────────────────────────────────
/**
 * QuotationSummaryModal
 *
 * Props:
 *   isOpen        {boolean}
 *   quoteNo       {string}
 *   customer      {{ name, address, email?, phone? }}
 *   lineItems     {Array<{ sku, name, cat, icon, unitPrice, qty, lineDisc }>}
 *   grossTotal    {number}
 *   lineDiscTotal {number}
 *   quoteDiscAmt  {number}
 *   taxRate       {number}
 *   taxAmt        {number}
 *   extraCharge   {number}
 *   extraLabel    {string}
 *   total         {number}
 *   status        {string}   — draft | sent | accepted | rejected | expired
 *   issueDate     {string}
 *   validFrom     {string}
 *   validUntil    {string}
 *   reference     {string}
 *   subject       {string}
 *   terms         {string}
 *   onClose       {() => void}
 *   onNewQuote    {() => void}
 *   onConvertToInvoice {() => void}
 */
export default function QuotationSummaryModal({
  isOpen,
  quoteNo            = "QUO-2026-001",
  customer           = { name: "Walk-in Customer", address: "Counter Sale" },
  lineItems          = [],
  grossTotal         = 0,
  lineDiscTotal      = 0,
  quoteDiscAmt       = 0,
  taxRate            = 0,
  taxAmt             = 0,
  extraCharge        = 0,
  extraLabel         = "Extra",
  total              = 0,
  status             = "sent",
  issueDate          = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  validFrom          = "",
  validUntil         = "",
  reference          = "",
  subject            = "",
  terms              = "",
  onClose,
  onNewQuote,
  onConvertToInvoice,
}) {
  const printRef = useRef(null);

  if (!isOpen) return null;

  const safeName    = customer?.name    || "Walk-in Customer";
  const safeAddress = customer?.address || "—";
  const safeEmail   = customer?.email;
  const safePhone   = customer?.phone;

  const sm = STATUS_META[status] || STATUS_META.draft;

  // Days remaining
  const daysLeft = validUntil
    ? Math.max(0, Math.ceil((new Date(validUntil) - new Date()) / 864e5))
    : null;
  const isExpired  = daysLeft === 0;
  const isExpiring = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;

  const validityClass = isExpired ? "dead" : isExpiring ? "warn" : "";
  const validityColor = isExpired ? "var(--red)" : isExpiring ? "var(--gold)" : "var(--green)";
  const validityIcon  = isExpired ? "⏱" : isExpiring ? "⚠️" : "🗓";
  const validityTitle = isExpired ? "Quotation Expired" : isExpiring ? "Expiring Soon" : "Valid Quotation";
  const validityLabel = daysLeft === null ? "—"
    : isExpired  ? "Expired"
    : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`;
  const validityMetaClass = isExpired ? "expired" : isExpiring ? "expiring" : "ok";

  const totalItems = lineItems.reduce((s, i) => s + i.qty, 0);
  const totalSaved = lineDiscTotal + quoteDiscAmt;

  const handlePrint   = () => window.print();
  const handleCopyLink = () => navigator.clipboard?.writeText(`${window.location.origin}/quotation/${quoteNo}`);

  return (
    <>
      <style>{STYLES}</style>

      {/* Printable area */}
      <div ref={printRef} className="qsm-printable" style={{ display: "none" }}>
        <div className="qsm-print-header">
          <div className="qsm-print-co">NEXUS POS</div>
          <div className="qsm-print-quo">Quotation {quoteNo} · {issueDate}</div>
          {reference && <div style={{ marginTop: 4, fontSize: 12 }}>Ref: {reference}</div>}
          {subject   && <div style={{ marginTop: 2, fontSize: 12 }}>{subject}</div>}
        <div style={{ marginTop: 8, fontSize: 12 }}>{safeName} · {safeAddress}</div>
        </div>
        <table className="qsm-print-table">
          <thead>
            <tr>
              <th>#</th><th>Item</th><th>SKU</th>
              <th style={{ textAlign: "right" }}>Unit Price</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => {
              const discPrice = item.unitPrice * (1 - item.lineDisc / 100);
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 11 }}>{item.sku}</td>
                  <td style={{ textAlign: "right" }}>${fmt(discPrice)}{item.lineDisc > 0 && ` (−${item.lineDisc}%)`}</td>
                  <td style={{ textAlign: "center" }}>{item.qty}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>${fmt(discPrice * item.qty)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="qsm-print-totals">
          {lineDiscTotal > 0 && <div className="qsm-print-trow"><span>Line Discounts</span><span>−${fmt(lineDiscTotal)}</span></div>}
          {quoteDiscAmt  > 0 && <div className="qsm-print-trow"><span>Quote Discount</span><span>−${fmt(quoteDiscAmt)}</span></div>}
          <div className="qsm-print-trow"><span>Tax ({taxRate}%)</span><span>${fmt(taxAmt)}</span></div>
          {extraCharge   > 0 && <div className="qsm-print-trow"><span>{extraLabel}</span><span>+${fmt(extraCharge)}</span></div>}
          <div className="qsm-print-grand"><span>Total</span><span>${fmt(total)}</span></div>
        </div>
        {validUntil && <div style={{ marginTop: 16, fontSize: 12 }}>Valid until: {validUntil}</div>}
        {terms && <div style={{ marginTop: 8, fontSize: 12, fontStyle: "italic" }}>Terms: {terms}</div>}
        <div className="qsm-print-footer">This is a quotation, not an invoice · Nexus POS</div>
      </div>

      {/* ── Modal ── */}
      <div className="qsm-backdrop" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="qsm-modal">

          {/* ── HEADER ── */}
          <div className="qsm-head">
            <div className="qsm-head-left">
              <div className="qsm-icon-wrap">📋</div>
              <div>
                <div className="qsm-head-eyebrow">Documents · Quotations</div>
                <div className="qsm-head-title">Quotation Sent</div>
                <div className="qsm-head-sub">
                  {issueDate} · {lineItems.length} item{lineItems.length !== 1 ? "s" : ""} · {totalItems} unit{totalItems !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
            <div className="qsm-head-right">
              <div className="qsm-quo-pill">{quoteNo}</div>
            </div>
          </div>

          <div className="qsm-body">

            {/* ════ LEFT ════ */}
            <div className="qsm-left">

              {/* Customer */}
              <div className="qsm-sec">Customer</div>
              <div className="qsm-cust">
                <div className="qsm-cust-av">{initials(safeName)}</div>
                <div>
                <div className="qsm-cust-name">{safeName}</div>
                <div className="qsm-cust-det">{safeAddress}</div>
                {safeEmail && safeEmail !== "—" && <div className="qsm-cust-det">{safeEmail}</div>}
                {safePhone && safePhone !== "—" && <div className="qsm-cust-det">{safePhone}</div>}
                </div>
              </div>

              {/* Meta */}
              <div className="qsm-meta">
                <div className="qsm-meta-item">
                  <div className="qsm-meta-lbl">Quote No.</div>
                  <div className="qsm-meta-val">{quoteNo}</div>
                </div>
                <div className="qsm-meta-item">
                  <div className="qsm-meta-lbl">Issue Date</div>
                  <div className="qsm-meta-val" style={{ fontSize: 11 }}>{issueDate}</div>
                </div>
                <div className="qsm-meta-item">
                  <div className="qsm-meta-lbl">Valid Until</div>
                  <div className={`qsm-meta-val ${validityMetaClass}`} style={{ fontSize: 11 }}>
                    {validUntil || "—"}
                  </div>
                </div>
              </div>

              {/* Reference / Subject */}
              {(reference || subject) && (
                <div className="qsm-ref-row">
                  {reference && (
                    <div className="qsm-ref-item">
                      <div className="qsm-ref-lbl">Reference No.</div>
                      <div className="qsm-ref-val">{reference}</div>
                    </div>
                  )}
                  {subject && (
                    <div className="qsm-ref-item">
                      <div className="qsm-ref-lbl">Subject</div>
                      <div className="qsm-ref-val">{subject}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Validity countdown */}
              {daysLeft !== null && (
                <div className={`qsm-validity ${validityClass}`} style={{ marginBottom: 18 }}>
                  <div className="qsm-val-left">
                    <span className="qsm-val-icon">{validityIcon}</span>
                    <div>
                      <div className="qsm-val-title" style={{ color: validityColor }}>{validityTitle}</div>
                      <div className="qsm-val-sub" style={{ color: validityColor }}>
                        {validFrom && validUntil ? `${validFrom} → ${validUntil}` : validUntil}
                      </div>
                    </div>
                  </div>
                  <div className="qsm-val-badge" style={{ color: validityColor }}>{validityLabel}</div>
                </div>
              )}

              {/* Line items */}
              <div className="qsm-sec">Line Items</div>
              {lineItems.length > 0 ? (
                <table className="qsm-table" style={{ marginBottom: 18 }}>
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
                      const discPrice = item.unitPrice * (1 - item.lineDisc / 100);
                      const lineTotal = discPrice * item.qty;
                      return (
                        <tr key={i}>
                          <td style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10.5, color: "var(--ink20)" }}>
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {item.icon && (
                                <div style={{ width: 26, height: 26, borderRadius: 6, background: "var(--warm)", border: "1px solid var(--ink10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                                  {item.icon}
                                </div>
                              )}
                              <div>
                                <div className="qtd-name">{item.name}</div>
                                <div className="qtd-sku">{item.sku}{item.cat ? ` · ${item.cat}` : ""}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: "center", fontFamily: "'Geist Mono',monospace", fontSize: 12 }}>{item.qty}</td>
                          <td style={{ textAlign: "right" }}>
                            <div className="qtd-num">${fmt(discPrice)}</div>
                            {item.lineDisc > 0 && <div className="qtd-disc">−{item.lineDisc}% disc</div>}
                          </td>
                          <td className="qtd-num">${fmt(lineTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div style={{ fontSize: 12, color: "var(--ink40)", marginBottom: 18, fontStyle: "italic" }}>No line items</div>
              )}

              {/* Totals */}
              <div className="qsm-sec">Quote Summary</div>
              <div className="qsm-totals">
                <div className="qsm-trow"><span className="tl">Gross Total</span><span className="tv">${fmt(grossTotal)}</span></div>
                {lineDiscTotal > 0 && <div className="qsm-trow disc"><span className="tl">Line Discounts</span><span className="tv">−${fmt(lineDiscTotal)}</span></div>}
                {quoteDiscAmt  > 0 && <div className="qsm-trow disc"><span className="tl">Quote Discount</span><span className="tv">−${fmt(quoteDiscAmt)}</span></div>}
                <div className="qsm-trow"><span className="tl">Tax ({taxRate}%)</span><span className="tv">${fmt(taxAmt)}</span></div>
                {extraCharge   > 0 && <div className="qsm-trow"><span className="tl">{extraLabel}</span><span className="tv">+${fmt(extraCharge)}</span></div>}
                {totalSaved    > 0 && (
                  <>
                    <div className="qsm-thr" />
                    <div className="qsm-trow disc"><span className="tl">Total Savings</span><span className="tv">−${fmt(totalSaved)}</span></div>
                  </>
                )}
                <div className="qsm-grand">
                  <span className="qsm-grand-lbl">Quoted Total</span>
                  <span className="qsm-grand-val">${fmt(total)}</span>
                </div>
              </div>

              {/* Terms */}
              {terms && (
                <>
                  <div className="qsm-sec" style={{ marginTop: 4 }}>Terms &amp; Notes</div>
                  <div className="qsm-note-box">"{terms}"</div>
                </>
              )}

            </div>

            {/* ════ RIGHT: Actions ════ */}
            <div className="qsm-right">

              {/* Status badge */}
              <div
                className="qsm-status-badge"
                style={{ background: sm.bg, border: `1px solid ${sm.border}` }}
              >
                <span className="qsm-status-icon">{sm.icon}</span>
                <div>
                  <div className="qsm-status-title" style={{ color: sm.color }}>{sm.label}</div>
                  <div className="qsm-status-sub" style={{ color: sm.color }}>
                    {status === "draft"    && "Not yet sent to customer"}
                    {status === "sent"     && "Awaiting customer response"}
                    {status === "accepted" && "Customer confirmed the quote"}
                    {status === "rejected" && "Customer declined the quote"}
                    {status === "expired"  && "Validity period has passed"}
                  </div>
                </div>
              </div>

              <div className="act-divider" />

              {/* Print */}
              <div className="qsm-act-sec">Print</div>

              <button className="act-btn act-primary" onClick={handlePrint}>
                <span className="act-btn-icon">🖨️</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Print Quotation</div>
                  <div className="act-btn-sub">Full A4 document</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <button className="act-btn act-pdf" onClick={handlePrint}>
                <span className="act-btn-icon">📄</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Save as PDF</div>
                  <div className="act-btn-sub">Download to device</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <div className="act-divider" />

              {/* Share */}
              <div className="qsm-act-sec">Share</div>

              <button className="act-btn act-email">
                <span className="act-btn-icon">✉️</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Send by Email</div>
                  <div className="act-btn-sub">
                    {safeEmail && safeEmail !== "—" ? safeEmail : "Enter email address"}
                  </div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <button className="act-btn act-whatsapp">
                <span className="act-btn-icon">💬</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Send via WhatsApp</div>
                  <div className="act-btn-sub">
                    {safePhone && safePhone !== "—" ? safePhone : "Enter phone number"}
                  </div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <button className="act-btn act-copy" onClick={handleCopyLink}>
                <span className="act-btn-icon">🔗</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">Copy Quote Link</div>
                  <div className="act-btn-sub">Share a view-only link</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <div className="act-divider" />

              {/* Next */}
              <div className="qsm-act-sec">Next Steps</div>

              {onConvertToInvoice && (
                <button className="act-btn act-green" onClick={onConvertToInvoice}>
                  <span className="act-btn-icon">⚡</span>
                  <div className="act-btn-text">
                    <div className="act-btn-title">Convert to Invoice</div>
                    <div className="act-btn-sub">Create invoice from this quote</div>
                  </div>
                  <span className="act-btn-arrow">›</span>
                </button>
              )}

              <button className="act-btn act-gold" onClick={onNewQuote}>
                <span className="act-btn-icon">➕</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">New Quotation</div>
                  <div className="act-btn-sub">Start a fresh quote</div>
                </div>
                <span className="act-btn-arrow">›</span>
              </button>

              <button className="act-btn act-ghost" onClick={onClose}>
                <span className="act-btn-icon">📋</span>
                <div className="act-btn-text">
                  <div className="act-btn-title">All Quotations</div>
                  <div className="act-btn-sub">View quotation history</div>
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