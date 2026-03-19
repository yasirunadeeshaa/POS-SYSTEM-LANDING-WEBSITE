import { useState, useMemo, useEffect } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const INITIAL_TRANSACTIONS = [
  { id: "TXN-8821", customer: "Walk-in",          customerId: null,  items: 3,  total: 48.50,  tax: 4.85,  subtotal: 43.65, discount: 0,     method: "Card",        cashier: "Aria K.",  register: "R-01", date: "2025-03-10", time: "14:32", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8820", customer: "Ravi Mendis",       customerId: 1,     items: 1,  total: 12.99,  tax: 1.30,  subtotal: 11.69, discount: 0,     method: "Cash",        cashier: "Zoe R.",   register: "R-04", date: "2025-03-10", time: "14:26", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8819", customer: "Walk-in",          customerId: null,  items: 5,  total: 103.40, tax: 10.34, subtotal: 93.06, discount: 5.00,  method: "QR Pay",      cashier: "Marco D.", register: "R-02", date: "2025-03-10", time: "14:21", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8818", customer: "Priya Silva",       customerId: 2,     items: 2,  total: 34.00,  tax: 3.40,  subtotal: 30.60, discount: 0,     method: "Contactless", cashier: "Aria K.",  register: "R-01", date: "2025-03-10", time: "14:14", status: "refunded",  refundedAmount: 34.00, notes: "Customer returned item" },
  { id: "TXN-8817", customer: "Walk-in",          customerId: null,  items: 4,  total: 67.80,  tax: 6.78,  subtotal: 61.02, discount: 2.50,  method: "Card",        cashier: "Lena S.",  register: "R-03", date: "2025-03-10", time: "14:08", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8816", customer: "Daniel Wijayaratne",customerId: 3,     items: 1,  total: 9.99,   tax: 1.00,  subtotal: 8.99,  discount: 0,     method: "Cash",        cashier: "Zoe R.",   register: "R-04", date: "2025-03-10", time: "13:51", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8815", customer: "Nimesha Gunawardena",customerId: 6,   items: 7,  total: 249.90, tax: 24.99, subtotal: 224.91,discount: 15.00, method: "Card",        cashier: "Aria K.",  register: "R-01", date: "2025-03-10", time: "13:44", status: "completed", refundedAmount: 0,    notes: "VIP discount applied" },
  { id: "TXN-8814", customer: "Walk-in",          customerId: null,  items: 2,  total: 28.50,  tax: 2.85,  subtotal: 25.65, discount: 0,     method: "QR Pay",      cashier: "Marco D.", register: "R-02", date: "2025-03-10", time: "13:38", status: "voided",    refundedAmount: 0,    notes: "Duplicate transaction" },
  { id: "TXN-8813", customer: "Kasun Fernando",    customerId: 5,     items: 3,  total: 74.25,  tax: 7.43,  subtotal: 66.83, discount: 5.00,  method: "Contactless", cashier: "Ben T.",   register: "R-03", date: "2025-03-10", time: "13:22", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8812", customer: "Walk-in",          customerId: null,  items: 1,  total: 19.99,  tax: 2.00,  subtotal: 17.99, discount: 0,     method: "Cash",        cashier: "Lena S.",  register: "R-03", date: "2025-03-10", time: "13:15", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8811", customer: "Asanka Liyanage",   customerId: 13,    items: 12, total: 512.00, tax: 51.20, subtotal: 460.80,discount: 25.00, method: "Card",        cashier: "Aria K.",  register: "R-01", date: "2025-03-10", time: "12:58", status: "completed", refundedAmount: 0,    notes: "Wholesale order" },
  { id: "TXN-8810", customer: "Sachini Jayasinghe",customerId: 8,     items: 2,  total: 43.50,  tax: 4.35,  subtotal: 39.15, discount: 0,     method: "QR Pay",      cashier: "Zoe R.",   register: "R-04", date: "2025-03-10", time: "12:44", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8809", customer: "Walk-in",          customerId: null,  items: 1,  total: 8.50,   tax: 0.85,  subtotal: 7.65,  discount: 0,     method: "Cash",        cashier: "Marco D.", register: "R-02", date: "2025-03-10", time: "12:31", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8808", customer: "Ruwan Bandara",     customerId: 9,     items: 4,  total: 156.75, tax: 15.68, subtotal: 141.08,discount: 10.00, method: "Card",        cashier: "Ben T.",   register: "R-03", date: "2025-03-10", time: "12:20", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8807", customer: "Walk-in",          customerId: null,  items: 2,  total: 35.00,  tax: 3.50,  subtotal: 31.50, discount: 0,     method: "Contactless", cashier: "Lena S.",  register: "R-03", date: "2025-03-10", time: "12:08", status: "refunded",  refundedAmount: 17.50, notes: "Partial refund - 1 item" },
  { id: "TXN-8806", customer: "Dilhani Seneviratne",customerId: 10,  items: 3,  total: 89.00,  tax: 8.90,  subtotal: 80.10, discount: 0,     method: "Card",        cashier: "Aria K.",  register: "R-01", date: "2025-03-09", time: "17:45", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8805", customer: "Walk-in",          customerId: null,  items: 6,  total: 178.40, tax: 17.84, subtotal: 160.56,discount: 8.00,  method: "QR Pay",      cashier: "Zoe R.",   register: "R-04", date: "2025-03-09", time: "17:30", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8804", customer: "Amara Perera",      customerId: 4,     items: 1,  total: 22.00,  tax: 2.20,  subtotal: 19.80, discount: 0,     method: "Cash",        cashier: "Marco D.", register: "R-02", date: "2025-03-09", time: "17:18", status: "completed", refundedAmount: 0,    notes: "" },
  { id: "TXN-8803", customer: "Prasad Kumara",     customerId: 15,    items: 5,  total: 134.95, tax: 13.50, subtotal: 121.46,discount: 5.00,  method: "Card",        cashier: "Aria K.",  register: "R-01", date: "2025-03-09", time: "17:02", status: "voided",    refundedAmount: 0,    notes: "Payment declined" },
  { id: "TXN-8802", customer: "Walk-in",          customerId: null,  items: 2,  total: 55.00,  tax: 5.50,  subtotal: 49.50, discount: 0,     method: "Contactless", cashier: "Ben T.",   register: "R-03", date: "2025-03-09", time: "16:48", status: "completed", refundedAmount: 0,    notes: "" },
];

const CASHIERS  = ["All", "Aria K.", "Zoe R.", "Marco D.", "Lena S.", "Ben T."];
const REGISTERS = ["All", "R-01", "R-02", "R-03", "R-04"];
const METHODS   = ["All", "Card", "Cash", "QR Pay", "Contactless"];
const STATUSES  = ["All", "completed", "refunded", "voided"];

const fmt  = (n) => Number(n||0).toLocaleString("en", { minimumFractionDigits:2, maximumFractionDigits:2 });
const fmtN = (n) => Number(n||0).toLocaleString("en");

const METHOD_ICON = { Card:"💳", Cash:"💵", "QR Pay":"📱", Contactless:"⚡" };
const METHOD_COLOR = {
  Card:        { color:"#2B5490", bg:"rgba(43,84,144,.08)",  border:"rgba(43,84,144,.2)"  },
  Cash:        { color:"#2D6A4F", bg:"rgba(45,106,79,.08)",  border:"rgba(45,106,79,.2)"  },
  "QR Pay":    { color:"#5B3D8F", bg:"rgba(91,61,143,.08)",  border:"rgba(91,61,143,.2)"  },
  Contactless: { color:"#B8902A", bg:"rgba(184,144,42,.08)", border:"rgba(184,144,42,.2)" },
};

const STATUS_STYLE = {
  completed: { color:"#2D6A4F", bg:"rgba(45,106,79,.08)",  border:"rgba(45,106,79,.22)",  dot:"#3D8A65" },
  refunded:  { color:"#B5372A", bg:"rgba(181,55,42,.08)",  border:"rgba(181,55,42,.22)",  dot:"#D4503A" },
  voided:    { color:"#9E9080", bg:"rgba(158,144,128,.08)",border:"rgba(158,144,128,.2)", dot:"#9E9080" },
};

// ── STYLES ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Geist+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  :root {
    --cream:#F6F3EC; --paper:#FDFBF7; --warm:#F0EBE0; --warm2:#E8E2D4;
    --ink:#1B1713; --ink80:#2E2720; --ink60:#4B4038; --ink50:#6B5F54;
    --ink40:#9E9080; --ink30:#B8AFA4; --ink20:#CFC8BC; --ink10:#E4DDD2;
    --ink06:#EDE8E0; --ink03:#F5F1EB;
    --gold:#B8902A; --goldl:#D4A83C; --goldd:#8A6A1A;
    --goldbg:rgba(184,144,42,.07); --goldbr:rgba(184,144,42,.22);
    --green:#2D6A4F; --greenl:#3D8A65;
    --greenbg:rgba(45,106,79,.07); --greenbr:rgba(45,106,79,.22);
    --red:#B5372A; --redbg:rgba(181,55,42,.07); --redbr:rgba(181,55,42,.2);
    --blue:#2B5490; --bluebg:rgba(43,84,144,.07); --bluebr:rgba(43,84,144,.22);
    --purple:#5B3D8F; --purplebg:rgba(91,61,143,.07); --purplebr:rgba(91,61,143,.22);
    --brown:#7A5C1E; --brownbg:rgba(122,92,30,.07); --brownbr:rgba(122,92,30,.22);
    --shadow-xs:0 1px 2px rgba(27,23,19,.04);
    --shadow-sm:0 2px 8px rgba(27,23,19,.06),0 1px 2px rgba(27,23,19,.04);
    --shadow-md:0 6px 20px rgba(27,23,19,.09),0 2px 4px rgba(27,23,19,.05);
    --shadow-lg:0 20px 60px rgba(27,23,19,.18),0 6px 16px rgba(27,23,19,.1);
    --topbar-h:60px;
  }

  html,body,#root { height:100%; background:var(--cream); overflow:hidden; }

  .shell {
    display:flex; flex-direction:column; height:100vh;
    font-family:'Outfit',sans-serif; color:var(--ink);
    background:var(--cream);
    background-image:radial-gradient(ellipse 80% 50% at 50% -10%,rgba(184,144,42,.05) 0%,transparent 60%);
  }

  /* ══ TOPBAR ══ */
  .topbar {
    height:var(--topbar-h); flex-shrink:0;
    background:var(--ink); border-bottom:1px solid rgba(184,144,42,.35);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 28px; z-index:100; position:relative;
  }
  .topbar::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--goldl) 30%,var(--gold) 70%,transparent);
    opacity:.4;
  }
  .topbar-left  { display:flex; align-items:center; gap:24px; }
  .topbar-right { display:flex; align-items:center; gap:10px; }
  .brand { display:flex; align-items:center; gap:13px; }
  .brand-mark {
    width:36px; height:36px; border-radius:8px;
    border:1.5px solid rgba(184,144,42,.45); background:rgba(184,144,42,.08);
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:var(--goldl);
  }
  .brand-name { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; color:#F6F3EC; letter-spacing:.2px; line-height:1; }
  .brand-sub  { font-size:9px; font-weight:600; letter-spacing:2.2px; text-transform:uppercase; color:rgba(184,144,42,.7); line-height:1; }
  .breadcrumb { display:flex; align-items:center; gap:8px; font-size:11.5px; font-weight:500; }
  .bc-sep    { color:rgba(246,243,236,.15); }
  .bc-link   { color:rgba(246,243,236,.3); cursor:pointer; transition:color .15s; }
  .bc-link:hover { color:rgba(246,243,236,.65); }
  .bc-active { color:rgba(246,243,236,.75); font-weight:600; }
  .vdiv { width:1px; height:22px; background:rgba(246,243,236,.08); flex-shrink:0; }
  .avatar {
    width:36px; height:36px; border-radius:8px;
    border:1.5px solid rgba(184,144,42,.3); background:rgba(184,144,42,.08);
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:13px; font-weight:700; color:var(--goldl); cursor:pointer;
  }

  /* ══ MAIN ══ */
  .main { flex:1; display:flex; overflow:hidden; }

  /* ══ CONTENT ══ */
  .content {
    flex:1; overflow-y:auto; padding:22px 28px 36px;
    display:flex; flex-direction:column; gap:18px;
    transition:margin-right .35s cubic-bezier(.16,1,.3,1);
  }
  .content::-webkit-scrollbar { width:3px; }
  .content::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }
  .content.drawer-open { margin-right:420px; }

  /* ══ PAGE HEADER ══ */
  .page-header {
    display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap;
    animation:fadeUp .3s ease both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .page-eyebrow {
    font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase;
    color:var(--gold); margin-bottom:5px; display:flex; align-items:center; gap:8px;
  }
  .page-eyebrow::before { content:''; width:18px; height:1px; background:var(--gold); opacity:.5; }
  .page-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; color:var(--ink); letter-spacing:-.2px; line-height:1; margin-bottom:5px; }
  .page-desc  { font-size:12.5px; color:var(--ink40); }
  .page-actions { display:flex; gap:10px; align-items:center; }

  /* ══ BUTTONS ══ */
  .btn {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:6px;
    font-size:12.5px; font-weight:600; cursor:pointer;
    font-family:'Outfit',sans-serif; letter-spacing:.2px;
    border:1px solid transparent; transition:all .2s;
  }
  .btn-ghost { background:transparent; border-color:var(--ink10); color:var(--ink50); }
  .btn-ghost:hover { border-color:var(--ink20); color:var(--ink60); background:var(--warm); }
  .btn-gold  { background:var(--gold); border-color:var(--goldd); color:#fff; box-shadow:0 2px 8px rgba(184,144,42,.3); }
  .btn-gold:hover { background:var(--goldl); box-shadow:0 4px 16px rgba(184,144,42,.4); transform:translateY(-1px); }
  .btn-red   { background:var(--redbg); border-color:var(--redbr); color:var(--red); }
  .btn-red:hover { background:rgba(181,55,42,.14); }

  /* ══ STAT STRIP ══ */
  .stat-strip { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; animation:fadeUp .35s ease both; animation-delay:40ms; }
  .stat-card {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:10px; padding:14px 16px; box-shadow:var(--shadow-xs);
    position:relative; overflow:hidden; transition:box-shadow .2s,transform .2s; cursor:default;
  }
  .stat-card:hover { box-shadow:var(--shadow-sm); transform:translateY(-1px); }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--sc),transparent); }
  .stat-lbl { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink40); margin-bottom:8px; }
  .stat-val { font-family:'Geist Mono',monospace; font-size:24px; font-weight:600; color:var(--sc); line-height:1; }
  .stat-sub { font-size:10.5px; color:var(--ink40); margin-top:4px; }

  /* ══ FILTER BAR ══ */
  .filter-bar {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:10px; padding:14px 18px; box-shadow:var(--shadow-xs);
    display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;
    animation:fadeUp .4s ease both; animation-delay:70ms;
  }
  .filter-group { display:flex; flex-direction:column; gap:6px; }
  .filter-label { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); }
  .search-wrap  { position:relative; }
  .search-ico   { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:13px; color:var(--ink30); pointer-events:none; }
  .search-input {
    width:100%; padding:9px 12px 9px 36px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; font-family:'Outfit',sans-serif;
    font-size:13px; font-weight:500; color:var(--ink); outline:none; transition:all .18s;
  }
  .search-input::placeholder { color:var(--ink20); }
  .search-input:hover  { border-color:var(--ink20); background:var(--paper); }
  .search-input:focus  { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .search-input.active { border-color:var(--gold); background:var(--paper); }
  .search-clear {
    position:absolute; right:10px; top:50%; transform:translateY(-50%);
    width:20px; height:20px; border-radius:50%;
    background:var(--ink10); border:none; color:var(--ink40);
    font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .search-clear:hover { background:var(--ink20); color:var(--ink60); }
  .filter-select-wrap { position:relative; }
  .filter-select {
    padding:9px 32px 9px 12px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; font-family:'Outfit',sans-serif;
    font-size:12.5px; font-weight:500; color:var(--ink);
    outline:none; appearance:none; cursor:pointer; transition:all .18s; min-width:120px;
  }
  .filter-select:hover { border-color:var(--ink20); background:var(--paper); }
  .filter-select:focus { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .filter-arrow { position:absolute; right:11px; top:50%; transform:translateY(-50%); font-size:9px; color:var(--ink30); pointer-events:none; }
  .filter-divider { width:1px; background:var(--ink10); align-self:stretch; margin:2px 0; }

  /* Date range inputs */
  .date-input {
    padding:9px 12px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; font-family:'Outfit',sans-serif;
    font-size:12px; font-weight:500; color:var(--ink); outline:none; transition:all .18s;
    min-width:130px;
  }
  .date-input:hover { border-color:var(--ink20); background:var(--paper); }
  .date-input:focus { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .date-input.active { border-color:var(--gold); }

  /* ══ RESULTS BAR ══ */
  .results-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .results-count { font-size:12px; color:var(--ink40); font-weight:500; }
  .results-count strong { color:var(--ink60); font-weight:700; }

  /* ══ TABLE ══ */
  .table-card { background:var(--paper); border:1px solid var(--ink10); border-radius:10px; box-shadow:var(--shadow-xs); overflow:hidden; animation:fadeUp .45s ease both; animation-delay:100ms; }

  .tbl-head { display:grid; grid-template-columns:130px 1.8fr 1fr 0.9fr 1fr 1fr 1fr 80px; gap:8px; padding:11px 18px; background:var(--warm); border-bottom:1px solid var(--ink10); }
  .tbl-row  { display:grid; grid-template-columns:130px 1.8fr 1fr 0.9fr 1fr 1fr 1fr 80px; gap:8px; padding:11px 18px; align-items:center; border-bottom:1px solid var(--ink03); transition:background .14s; cursor:pointer; }
  .tbl-row:last-child { border-bottom:none; }
  .tbl-row:hover { background:var(--warm); }
  .tbl-row.selected-row { background:var(--goldbg); border-left:3px solid var(--gold); padding-left:15px; }

  .tbl-hcell { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:4px; cursor:pointer; user-select:none; transition:color .15s; }
  .tbl-hcell:hover { color:var(--ink60); }
  .tbl-hcell.sorted { color:var(--gold); }
  .sort-arr { font-size:8px; }

  /* TX ID */
  .tx-id { font-family:'Geist Mono',monospace; font-size:12px; font-weight:700; color:var(--gold); letter-spacing:.5px; }
  .tx-time { font-size:10px; color:var(--ink30); font-family:'Geist Mono',monospace; margin-top:2px; }

  /* Customer cell */
  .tx-cust-name { font-size:13px; font-weight:600; color:var(--ink); margin-bottom:1px; }
  .tx-cashier   { font-size:10.5px; color:var(--ink40); }

  /* Method badge */
  .method-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }

  /* Status badge */
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:9.5px; font-weight:700; text-transform:capitalize; letter-spacing:.3px; }
  .status-dot   { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

  /* Amount */
  .tx-amount { font-family:'Geist Mono',monospace; font-size:14px; font-weight:700; color:var(--ink); }
  .tx-items  { font-size:10.5px; color:var(--ink40); margin-top:1px; }

  /* Mono cell */
  .tbl-mono { font-family:'Geist Mono',monospace; font-size:12px; color:var(--ink60); }

  /* Actions */
  .tbl-actions { display:flex; gap:4px; justify-content:flex-end; }
  .tbl-act-btn {
    width:28px; height:28px; border-radius:6px;
    background:transparent; border:1px solid transparent;
    color:var(--ink30); cursor:pointer; font-size:12px;
    display:flex; align-items:center; justify-content:center; transition:all .14s;
  }
  .tbl-act-btn:hover     { background:var(--warm2); border-color:var(--ink10); color:var(--ink60); }
  .tbl-act-btn.view-btn:hover { background:var(--bluebg); border-color:var(--bluebr); color:var(--blue); }
  .tbl-act-btn.ref-btn:hover  { background:var(--redbg);  border-color:var(--redbr);  color:var(--red);  }

  /* ══ EMPTY ══ */
  .empty-state { padding:64px 32px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:14px; }
  .empty-ico   { font-size:48px; opacity:.4; }
  .empty-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink60); }
  .empty-sub   { font-size:13px; color:var(--ink40); max-width:300px; line-height:1.6; }

  /* ══ DRAWER ══ */
  .drawer-overlay {
    position:fixed; inset:0; background:rgba(27,23,19,.2);
    z-index:200; backdrop-filter:blur(1px);
    animation:overlayIn .22s ease;
  }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }
  .drawer {
    position:fixed; top:var(--topbar-h); right:0; bottom:0;
    width:420px; background:var(--paper);
    border-left:1px solid var(--ink10); box-shadow:var(--shadow-lg);
    z-index:201; display:flex; flex-direction:column; overflow:hidden;
    animation:drawerIn .3s cubic-bezier(.16,1,.3,1);
  }
  @keyframes drawerIn { from{transform:translateX(100%)} to{transform:none} }

  .drawer-head {
    padding:18px 20px 16px; background:var(--ink);
    border-bottom:1px solid rgba(184,144,42,.2); flex-shrink:0;
  }
  .drawer-head-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .drawer-eyebrow  { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(184,144,42,.7); }
  .drawer-close {
    width:30px; height:30px; border-radius:6px;
    background:rgba(246,243,236,.06); border:1px solid rgba(246,243,236,.1);
    color:rgba(246,243,236,.4); cursor:pointer; font-size:17px;
    display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .drawer-close:hover { background:rgba(246,243,236,.12); color:rgba(246,243,236,.85); }

  .drawer-tx-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
  .drawer-tx-id   { font-family:'Geist Mono',monospace; font-size:22px; font-weight:700; color:var(--goldl); line-height:1; margin-bottom:5px; }
  .drawer-tx-date { font-size:12px; color:rgba(246,243,236,.35); font-family:'Geist Mono',monospace; }

  .drawer-body { flex:1; overflow-y:auto; padding:18px 20px; display:flex; flex-direction:column; gap:18px; }
  .drawer-body::-webkit-scrollbar { width:3px; }
  .drawer-body::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }

  .d-section { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .d-section::after { content:''; flex:1; height:1px; background:var(--ink06); }

  /* Amount hero */
  .amount-hero {
    padding:16px; background:var(--warm); border:1px solid var(--ink10); border-radius:10px;
    text-align:center;
  }
  .amount-big { font-family:'Geist Mono',monospace; font-size:36px; font-weight:700; color:var(--ink); line-height:1; margin-bottom:6px; }
  .amount-big.refunded { color:var(--red); }
  .amount-big.voided   { color:var(--ink30); text-decoration:line-through; }
  .amount-badges { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }

  /* Breakdown */
  .breakdown { background:var(--warm); border:1px solid var(--ink10); border-radius:9px; overflow:hidden; }
  .bd-row { display:flex; justify-content:space-between; align-items:center; padding:9px 14px; border-bottom:1px solid var(--ink06); }
  .bd-row:last-child { border-bottom:none; }
  .bd-row.bd-total { background:var(--ink); }
  .bd-label { font-size:12px; color:var(--ink50); font-weight:500; }
  .bd-value { font-family:'Geist Mono',monospace; font-size:12.5px; font-weight:600; color:var(--ink); }
  .bd-row.bd-total .bd-label { color:rgba(246,243,236,.5); font-size:12px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; }
  .bd-row.bd-total .bd-value { color:var(--goldl); font-size:14px; }

  .d-row { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:7px 0; border-bottom:1px solid var(--ink03); }
  .d-row:last-child { border-bottom:none; }
  .d-label { font-size:11.5px; color:var(--ink40); font-weight:500; flex-shrink:0; }
  .d-value { font-size:12.5px; font-weight:600; color:var(--ink); text-align:right; line-height:1.4; }
  .d-mono  { font-family:'Geist Mono',monospace; font-size:12px; }

  .notes-box { padding:11px 13px; background:var(--warm); border:1px solid var(--ink10); border-radius:8px; font-size:12.5px; color:var(--ink60); line-height:1.6; font-style:italic; }

  .drawer-actions { padding:14px 20px; border-top:1px solid var(--ink10); display:flex; gap:8px; flex-shrink:0; background:var(--paper); }
  .d-btn {
    flex:1; padding:10px; border-radius:7px;
    font-size:12.5px; font-weight:700; cursor:pointer;
    font-family:'Outfit',sans-serif; border:1px solid transparent;
    transition:all .18s; display:flex; align-items:center; justify-content:center; gap:7px;
  }
  .d-btn-gold   { background:var(--gold); border-color:var(--goldd); color:#fff; box-shadow:0 2px 8px rgba(184,144,42,.25); }
  .d-btn-gold:hover { background:var(--goldl); }
  .d-btn-ghost  { background:transparent; border-color:var(--ink10); color:var(--ink50); }
  .d-btn-ghost:hover { border-color:var(--ink20); background:var(--warm); }
  .d-btn-danger { background:var(--redbg); border-color:var(--redbr); color:var(--red); }
  .d-btn-danger:hover { background:rgba(181,55,42,.14); }

  /* ══ TOAST ══ */
  .toast {
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(16px);
    background:var(--ink); border:1px solid rgba(184,144,42,.3);
    border-radius:10px; padding:12px 20px;
    display:flex; align-items:center; gap:10px;
    box-shadow:var(--shadow-lg); z-index:1000;
    opacity:0; pointer-events:none; transition:all .3s cubic-bezier(.16,1,.3,1); white-space:nowrap;
  }
  .toast.show { opacity:1; transform:translateX(-50%) translateY(0); pointer-events:auto; }
  .toast-icon { font-size:15px; }
  .toast-msg  { font-size:13px; font-weight:600; color:#F6F3EC; }
  .toast-sub  { font-size:11.5px; color:rgba(246,243,236,.4); }

  /* ══ RESPONSIVE ══ */
  @media (max-width:1400px) {
    .tbl-head,.tbl-row { grid-template-columns:130px 1.8fr 1fr 1fr 1fr 80px; }
    .tbl-head>:nth-child(4),.tbl-row>:nth-child(4),
    .tbl-head>:nth-child(7),.tbl-row>:nth-child(7) { display:none; }
    .stat-strip { grid-template-columns:repeat(3,1fr); }
    .drawer { width:380px; }
    .content.drawer-open { margin-right:380px; }
  }
  @media (max-width:1050px) {
    .tbl-head,.tbl-row { grid-template-columns:130px 1.8fr 1fr 1fr 80px; }
    .tbl-head>:nth-child(6),.tbl-row>:nth-child(6) { display:none; }
    .content.drawer-open { margin-right:0; }
    .drawer { width:100%; max-width:420px; }
  }
  @media (max-width:700px) {
    .content { padding:14px 16px; }
    .stat-strip { grid-template-columns:repeat(2,1fr); }
  }
`;

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function PaymentTransactions() {
  const [transactions, setTransactions]  = useState(INITIAL_TRANSACTIONS);
  const [searchTxn,    setSearchTxn]     = useState("");
  const [searchCust,   setSearchCust]    = useState("");
  const [methodFilter, setMethodFilter]  = useState("All");
  const [statusFilter, setStatusFilter]  = useState("All");
  const [cashierFilter,setCashierFilter] = useState("All");
  const [regFilter,    setRegFilter]     = useState("All");
  const [dateFrom,     setDateFrom]      = useState("");
  const [dateTo,       setDateTo]        = useState("");
  const [sortKey,      setSortKey]       = useState("id");
  const [sortAsc,      setSortAsc]       = useState(false);
  const [selectedId,   setSelectedId]    = useState(null);
  const [toast,        setToast]         = useState({ show:false, msg:"", sub:"" });

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setSelectedId(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── filter & sort ──
  const filtered = useMemo(() => {
    let list = [...transactions];
    const qid = searchTxn.trim().toLowerCase();
    const qc  = searchCust.trim().toLowerCase();
    if (qid) list = list.filter(t => t.id.toLowerCase().includes(qid));
    if (qc)  list = list.filter(t => t.customer.toLowerCase().includes(qc));
    if (methodFilter  !== "All") list = list.filter(t => t.method  === methodFilter);
    if (statusFilter  !== "All") list = list.filter(t => t.status  === statusFilter);
    if (cashierFilter !== "All") list = list.filter(t => t.cashier === cashierFilter);
    if (regFilter     !== "All") list = list.filter(t => t.register === regFilter);
    if (dateFrom) list = list.filter(t => t.date >= dateFrom);
    if (dateTo)   list = list.filter(t => t.date <= dateTo);

    list.sort((a, b) => {
      let av = a[sortKey] ?? ""; let bv = b[sortKey] ?? "";
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [transactions, searchTxn, searchCust, methodFilter, statusFilter, cashierFilter, regFilter, dateFrom, dateTo, sortKey, sortAsc]);

  const selectedTxn = transactions.find(t => t.id === selectedId);

  // ── stats ──
  const completedTxns   = transactions.filter(t => t.status === "completed");
  const refundedTxns    = transactions.filter(t => t.status === "refunded");
  const totalRevenue    = completedTxns.reduce((s, t) => s + t.total, 0);
  const totalRefunds    = refundedTxns.reduce((s, t) => s + t.refundedAmount, 0);
  const avgSale         = completedTxns.length ? totalRevenue / completedTxns.length : 0;

  const hasFilter = searchTxn || searchCust || methodFilter!=="All" || statusFilter!=="All" || cashierFilter!=="All" || regFilter!=="All" || dateFrom || dateTo;
  const clearAll  = () => { setSearchTxn(""); setSearchCust(""); setMethodFilter("All"); setStatusFilter("All"); setCashierFilter("All"); setRegFilter("All"); setDateFrom(""); setDateTo(""); };

  const toggleSort = (k) => { if (sortKey===k) setSortAsc(v=>!v); else { setSortKey(k); setSortAsc(false); } };
  const SortIcon   = ({ k }) => (
    <span className="sort-arr" style={{ opacity:sortKey===k?1:.3, color:sortKey===k?"var(--gold)":"inherit" }}>
      {sortAsc && sortKey===k ? "▲" : "▼"}
    </span>
  );

  const showToast = (msg, sub="") => {
    setToast({ show:true, msg, sub });
    setTimeout(() => setToast({ show:false, msg:"", sub:"" }), 3000);
  };

  const StatusBadge = ({ status }) => {
    const s = STATUS_STYLE[status] || STATUS_STYLE.voided;
    return (
      <span className="status-badge" style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.color }}>
        <span className="status-dot" style={{ background:s.dot }} />
        {status}
      </span>
    );
  };

  const MethodBadge = ({ method }) => {
    const s = METHOD_COLOR[method] || {};
    return (
      <span className="method-badge" style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.color }}>
        {METHOD_ICON[method]} {method}
      </span>
    );
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">

        {/* ══ TOPBAR ══ */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="brand">
              <div className="brand-mark">N</div>
              <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
                <div className="brand-name">Nexus POS</div>
                <div className="brand-sub">Admin · Retail</div>
              </div>
            </div>
            <div className="vdiv" />
            <nav className="breadcrumb">
              <span className="bc-link">Dashboard</span>
              <span className="bc-sep">›</span>
              <span className="bc-link">History</span>
              <span className="bc-sep">›</span>
              <span className="bc-active">Payment Transactions</span>
            </nav>
          </div>
          <div className="topbar-right">
            <div className="vdiv" />
            <div className="avatar">AD</div>
          </div>
        </header>

        <div className="main">
          <div className={`content${selectedId ? " drawer-open" : ""}`}>

            {/* PAGE HEADER */}
            <div className="page-header">
              <div>
                <div className="page-eyebrow">History · Sales Ledger</div>
                <div className="page-title">Payment Transactions</div>
                <div className="page-desc">{transactions.length} transactions recorded · Today &amp; yesterday</div>
              </div>
              <div className="page-actions">
                <button className="btn btn-ghost" onClick={() => showToast("Export ready", "transactions.csv")}>↓ Export CSV</button>
                <button className="btn btn-gold" onClick={() => showToast("Receipt printed", "All filtered transactions")}>🖨 Print Report</button>
              </div>
            </div>

            {/* STAT STRIP */}
            <div className="stat-strip">
              {[
                { label:"Total Transactions", val: fmtN(transactions.length),         sub:"All recorded",           color:"var(--blue)"   },
                { label:"Completed",          val: fmtN(completedTxns.length),         sub:"Successful sales",       color:"var(--green)"  },
                { label:"Total Revenue",      val:`$${fmt(totalRevenue)}`,             sub:"Net completed sales",    color:"var(--gold)"   },
                { label:"Avg Sale Value",     val:`$${fmt(avgSale)}`,                  sub:"Per completed txn",      color:"var(--purple)" },
                { label:"Refunds Issued",     val:`$${fmt(totalRefunds)}`,             sub:`${refundedTxns.length} transactions`, color:"var(--red)" },
              ].map((s,i) => (
                <div className="stat-card" key={i} style={{ "--sc":s.color }}>
                  <div className="stat-lbl">{s.label}</div>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* FILTER BAR */}
            <div className="filter-bar">
              {/* TXN ID */}
              <div className="filter-group" style={{ minWidth:150 }}>
                <div className="filter-label">Transaction ID</div>
                <div className="search-wrap">
                  <span className="search-ico">🧾</span>
                  <input className={`search-input${searchTxn?" active":""}`} placeholder="TXN-XXXX" value={searchTxn}
                    onChange={e=>setSearchTxn(e.target.value)} style={{ fontFamily:"'Geist Mono',monospace",fontSize:12.5 }} />
                  {searchTxn && <button className="search-clear" onClick={()=>setSearchTxn("")}>×</button>}
                </div>
              </div>

              {/* Customer */}
              <div className="filter-group" style={{ minWidth:160 }}>
                <div className="filter-label">Customer</div>
                <div className="search-wrap">
                  <span className="search-ico">👤</span>
                  <input className={`search-input${searchCust?" active":""}`} placeholder="Name or walk-in…" value={searchCust}
                    onChange={e=>setSearchCust(e.target.value)} />
                  {searchCust && <button className="search-clear" onClick={()=>setSearchCust("")}>×</button>}
                </div>
              </div>

              <div className="filter-divider" />

              {/* Date From */}
              <div className="filter-group">
                <div className="filter-label">Date From</div>
                <input type="date" className={`date-input${dateFrom?" active":""}`} value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
              </div>

              {/* Date To */}
              <div className="filter-group">
                <div className="filter-label">Date To</div>
                <input type="date" className={`date-input${dateTo?" active":""}`} value={dateTo} onChange={e=>setDateTo(e.target.value)} />
              </div>

              <div className="filter-divider" />

              {/* Method */}
              <div className="filter-group">
                <div className="filter-label">Method</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={methodFilter} onChange={e=>setMethodFilter(e.target.value)} style={{ minWidth:130 }}>
                    {METHODS.map(m=><option key={m}>{m}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              {/* Status */}
              <div className="filter-group">
                <div className="filter-label">Status</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                    {STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              {/* Cashier */}
              <div className="filter-group">
                <div className="filter-label">Cashier</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={cashierFilter} onChange={e=>setCashierFilter(e.target.value)}>
                    {CASHIERS.map(c=><option key={c}>{c}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              {/* Register */}
              <div className="filter-group">
                <div className="filter-label">Register</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={regFilter} onChange={e=>setRegFilter(e.target.value)} style={{ minWidth:100 }}>
                    {REGISTERS.map(r=><option key={r}>{r}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              {hasFilter && (
                <button className="btn btn-ghost" style={{ padding:"7px 13px",fontSize:11.5,alignSelf:"flex-end" }} onClick={clearAll}>
                  ✕ Clear all
                </button>
              )}
            </div>

            {/* RESULTS BAR */}
            <div className="results-bar">
              <div className="results-count">
                Showing <strong>{filtered.length}</strong> of <strong>{transactions.length}</strong> transactions
                {hasFilter && " (filtered)"}
                {filtered.length > 0 && (
                  <span style={{ marginLeft:12, fontFamily:"'Geist Mono',monospace", color:"var(--gold)", fontWeight:700 }}>
                    Total: ${fmt(filtered.reduce((s,t)=>s+t.total,0))}
                  </span>
                )}
              </div>
              <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                <span style={{ fontSize:11,color:"var(--ink40)",fontWeight:600 }}>Sort</span>
                <div className="filter-select-wrap">
                  <select className="filter-select" style={{ minWidth:160,fontSize:12 }}
                    value={sortKey} onChange={e=>{ setSortKey(e.target.value); setSortAsc(false); }}>
                    <option value="id">Transaction ID</option>
                    <option value="date">Date</option>
                    <option value="total">Amount</option>
                    <option value="customer">Customer</option>
                    <option value="cashier">Cashier</option>
                    <option value="method">Method</option>
                    <option value="status">Status</option>
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
                <button className="btn btn-ghost" style={{ padding:"7px 11px",fontSize:13 }}
                  onClick={()=>setSortAsc(v=>!v)}>{sortAsc?"↑":"↓"}</button>
              </div>
            </div>

            {/* ══ TABLE ══ */}
            <div className="table-card">
              {filtered.length === 0
                ? (
                  <div className="empty-state">
                    <div className="empty-ico">🧾</div>
                    <div className="empty-title">No transactions found</div>
                    <div className="empty-sub">Try adjusting your filters or date range to find transactions.</div>
                    <button className="btn btn-ghost" onClick={clearAll}>Clear filters</button>
                  </div>
                ) : (
                  <>
                    <div className="tbl-head">
                      <div className={`tbl-hcell${sortKey==="id"?" sorted":""}`} onClick={()=>toggleSort("id")}>ID / Date <SortIcon k="id" /></div>
                      <div className={`tbl-hcell${sortKey==="customer"?" sorted":""}`} onClick={()=>toggleSort("customer")}>Customer / Cashier <SortIcon k="customer" /></div>
                      <div className={`tbl-hcell${sortKey==="method"?" sorted":""}`} onClick={()=>toggleSort("method")}>Method <SortIcon k="method" /></div>
                      <div className={`tbl-hcell${sortKey==="total"?" sorted":""}`} onClick={()=>toggleSort("total")}>Amount <SortIcon k="total" /></div>
                      <div className="tbl-hcell">Register</div>
                      <div className={`tbl-hcell${sortKey==="status"?" sorted":""}`} onClick={()=>toggleSort("status")}>Status <SortIcon k="status" /></div>
                      <div className="tbl-hcell">Items / Disc.</div>
                      <div className="tbl-hcell" style={{ justifyContent:"flex-end" }}>Actions</div>
                    </div>

                    {filtered.map((t, i) => (
                      <div
                        key={t.id}
                        className={`tbl-row${selectedId===t.id?" selected-row":""}`}
                        style={{ animationDelay:`${i*15}ms`, animation:"fadeUp .4s ease both" }}
                        onClick={()=>setSelectedId(s=>s===t.id?null:t.id)}
                      >
                        {/* ID + Date */}
                        <div>
                          <div className="tx-id">{t.id}</div>
                          <div className="tx-time">{t.date} · {t.time}</div>
                        </div>

                        {/* Customer + Cashier */}
                        <div>
                          <div className="tx-cust-name">{t.customer}</div>
                          <div className="tx-cashier">{t.cashier}</div>
                        </div>

                        {/* Method */}
                        <MethodBadge method={t.method} />

                        {/* Amount */}
                        <div>
                          <div className="tx-amount" style={{ color: t.status==="refunded"?"var(--red)":t.status==="voided"?"var(--ink30)":"var(--ink)" }}>
                            ${fmt(t.total)}
                          </div>
                          {t.refundedAmount > 0 && (
                            <div style={{ fontSize:10,color:"var(--red)",fontFamily:"'Geist Mono',monospace" }}>-${fmt(t.refundedAmount)}</div>
                          )}
                        </div>

                        {/* Register */}
                        <span className="tbl-mono">{t.register}</span>

                        {/* Status */}
                        <StatusBadge status={t.status} />

                        {/* Items + Discount */}
                        <div>
                          <div style={{ fontFamily:"'Geist Mono',monospace",fontSize:12,color:"var(--ink60)" }}>{t.items} item{t.items!==1?"s":""}</div>
                          {t.discount > 0 && (
                            <div style={{ fontSize:10,color:"var(--green)",fontFamily:"'Geist Mono',monospace" }}>-${fmt(t.discount)}</div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="tbl-actions" onClick={e=>e.stopPropagation()}>
                          <button className="tbl-act-btn view-btn" title="View details" onClick={()=>setSelectedId(s=>s===t.id?null:t.id)}>👁</button>
                          {t.status === "completed" && (
                            <button className="tbl-act-btn ref-btn" title="Refund" onClick={()=>showToast("Refund initiated", t.id)}>⟲</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
            </div>

          </div>

          {/* ══ DETAIL DRAWER ══ */}
          {selectedId && selectedTxn && (() => {
            const t = selectedTxn;
            const ss = STATUS_STYLE[t.status] || STATUS_STYLE.voided;
            return (
              <>
                <div className="drawer-overlay" onClick={()=>setSelectedId(null)} />
                <aside className="drawer">

                  <div className="drawer-head">
                    <div className="drawer-head-top">
                      <span className="drawer-eyebrow">Transaction Detail</span>
                      <button className="drawer-close" onClick={()=>setSelectedId(null)}>×</button>
                    </div>
                    <div className="drawer-tx-head">
                      <div>
                        <div className="drawer-tx-id">{t.id}</div>
                        <div className="drawer-tx-date">{t.date} · {t.time}</div>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>

                  <div className="drawer-body">

                    {/* Amount hero */}
                    <div className="amount-hero">
                      <div className={`amount-big${t.status==="refunded"?" refunded":t.status==="voided"?" voided":""}`}>
                        ${fmt(t.total)}
                      </div>
                      <div className="amount-badges">
                        <MethodBadge method={t.method} />
                        {t.discount > 0 && (
                          <span style={{ padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700,background:"var(--greenbg)",border:"1px solid var(--greenbr)",color:"var(--green)" }}>
                            -${fmt(t.discount)} discount
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div>
                      <div className="d-section">Amount Breakdown</div>
                      <div className="breakdown">
                        <div className="bd-row"><span className="bd-label">Subtotal</span><span className="bd-value">${fmt(t.subtotal)}</span></div>
                        {t.discount > 0 && (
                          <div className="bd-row"><span className="bd-label" style={{ color:"var(--green)" }}>Discount</span><span className="bd-value" style={{ color:"var(--green)" }}>−${fmt(t.discount)}</span></div>
                        )}
                        <div className="bd-row"><span className="bd-label">Tax (10%)</span><span className="bd-value">${fmt(t.tax)}</span></div>
                        {t.refundedAmount > 0 && (
                          <div className="bd-row"><span className="bd-label" style={{ color:"var(--red)" }}>Refunded</span><span className="bd-value" style={{ color:"var(--red)" }}>−${fmt(t.refundedAmount)}</span></div>
                        )}
                        <div className="bd-row bd-total">
                          <span className="bd-label">Total Charged</span>
                          <span className="bd-value">${fmt(t.total - t.refundedAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction info */}
                    <div>
                      <div className="d-section">Transaction Info</div>
                      <div className="d-row"><span className="d-label">Transaction ID</span><span className="d-value d-mono">{t.id}</span></div>
                      <div className="d-row"><span className="d-label">Date &amp; Time</span><span className="d-value d-mono">{t.date} · {t.time}</span></div>
                      <div className="d-row"><span className="d-label">Items Sold</span><span className="d-value d-mono">{t.items}</span></div>
                      <div className="d-row"><span className="d-label">Payment Method</span><MethodBadge method={t.method} /></div>
                    </div>

                    {/* Staff & Register */}
                    <div>
                      <div className="d-section">Staff &amp; Register</div>
                      <div className="d-row"><span className="d-label">Cashier</span><span className="d-value">{t.cashier}</span></div>
                      <div className="d-row"><span className="d-label">Register</span><span className="d-value d-mono">{t.register}</span></div>
                    </div>

                    {/* Customer */}
                    <div>
                      <div className="d-section">Customer</div>
                      <div className="d-row">
                        <span className="d-label">Name</span>
                        <span className="d-value">
                          {t.customer}
                          {!t.customerId && (
                            <span style={{ marginLeft:6,padding:"2px 7px",borderRadius:20,fontSize:9,fontWeight:700,background:"var(--warm2)",border:"1px solid var(--ink10)",color:"var(--ink40)" }}>
                              walk-in
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="d-row"><span className="d-label">Customer ID</span><span className="d-value d-mono">{t.customerId ? `CID-${String(t.customerId).padStart(4,"0")}` : "—"}</span></div>
                    </div>

                    {/* Notes */}
                    {t.notes && (
                      <div>
                        <div className="d-section">Notes</div>
                        <div className="notes-box">{t.notes}</div>
                      </div>
                    )}

                  </div>

                  <div className="drawer-actions">
                    <button className="d-btn d-btn-gold" onClick={()=>showToast("Receipt sent", t.id)}>🖨 Print Receipt</button>
                    <button className="d-btn d-btn-ghost" style={{ flex:"0 0 auto",padding:"10px 14px" }} onClick={()=>showToast("Copied to clipboard", t.id)}>📋</button>
                    {t.status === "completed" && (
                      <button className="d-btn d-btn-danger" style={{ flex:"0 0 auto",padding:"10px 14px" }}
                        onClick={()=>{ showToast("Refund initiated", t.id); }}>⟲</button>
                    )}
                  </div>

                </aside>
              </>
            );
          })()}

        </div>

        {/* TOAST */}
        <div className={`toast${toast.show?" show":""}`}>
          <span className="toast-icon">✦</span>
          <span className="toast-msg">{toast.msg}</span>
          {toast.sub && <span className="toast-sub">· {toast.sub}</span>}
        </div>

      </div>
    </>
  );
}
