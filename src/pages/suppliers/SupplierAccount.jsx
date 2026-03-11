import { useState, useMemo, useRef, useEffect } from "react";

// ── SHARED DATA (same as supplier management) ─────────────────────────────────
const INITIAL_SUPPLIERS = [
  { id: 1, name: "TechDist Co.", code: "SUP-001", category: "Electronics", contactName: "Marcus Holt", contactTitle: "Sales Manager", email: "marcus.holt@techdist.com", phone: "+1 415 230 8800", country: "United States", city: "San Francisco", paymentTerms: "Net 30", currency: "USD", status: "active", rating: 5, preferred: true, tags: ["preferred", "electronics", "international"] },
  { id: 2, name: "FabricWorld", code: "SUP-002", category: "Apparel", contactName: "Priyanka Nair", contactTitle: "Account Director", email: "p.nair@fabricworld.in", phone: "+91 22 4001 7700", country: "India", city: "Mumbai", paymentTerms: "Net 45", currency: "INR", status: "active", rating: 4, preferred: false, tags: ["apparel", "bulk", "international"] },
  { id: 3, name: "Global Imports Ltd", code: "SUP-003", category: "General", contactName: "Haruto Yamamoto", contactTitle: "Export Manager", email: "h.yamamoto@globalimports.jp", phone: "+81 3 5678 9010", country: "Japan", city: "Tokyo", paymentTerms: "Net 60", currency: "JPY", status: "active", rating: 5, preferred: true, tags: ["preferred", "general", "international", "reliable"] },
  { id: 4, name: "HomeGoods Inc.", code: "SUP-004", category: "Home", contactName: "Sandra Mills", contactTitle: "Trade Relations", email: "smills@homegoodsinc.com", phone: "+44 20 7946 0321", country: "United Kingdom", city: "London", paymentTerms: "Net 30", currency: "GBP", status: "active", rating: 4, preferred: false, tags: ["home", "international"] },
  { id: 5, name: "DirectSource", code: "SUP-005", category: "Lifestyle", contactName: "Ahmad Khalil", contactTitle: "Head of Wholesale", email: "a.khalil@directsource.ae", phone: "+971 4 321 9900", country: "UAE", city: "Dubai", paymentTerms: "Prepaid", currency: "AED", status: "active", rating: 3, preferred: false, tags: ["lifestyle", "international"] },
  { id: 6, name: "LocalPrint Solutions", code: "SUP-006", category: "Stationery", contactName: "Chamara Dissanayake", contactTitle: "Operations Lead", email: "chamara@localprint.lk", phone: "+94 11 256 8800", country: "Sri Lanka", city: "Colombo", paymentTerms: "Net 14", currency: "LKR", status: "active", rating: 4, preferred: false, tags: ["local", "stationery"] },
  { id: 7, name: "SportGear Asia", code: "SUP-007", category: "Sports", contactName: "Ji-Woo Park", contactTitle: "Export Coordinator", email: "jiwoo.park@sportgearasia.kr", phone: "+82 2 3456 7890", country: "South Korea", city: "Seoul", paymentTerms: "Net 30", currency: "KRW", status: "inactive", rating: 3, preferred: false, tags: ["sports", "international", "under-review"] },
  { id: 8, name: "PackRight Materials", code: "SUP-008", category: "Packaging", contactName: "Lena Bauer", contactTitle: "Key Account Manager", email: "l.bauer@packright.de", phone: "+49 89 4321 0000", country: "Germany", city: "Munich", paymentTerms: "Net 30", currency: "EUR", status: "active", rating: 4, preferred: false, tags: ["packaging", "eco", "international"] },
];

// ── SAMPLE ACCOUNT TRANSACTIONS per supplier ──────────────────────────────────
const SAMPLE_TRANSACTIONS = {
  1: [
    { id: "TXN-1001", date: "2025-01-08", description: "Purchase Order #PO-2248 — Wireless Earbuds Pro (x120)", type: "debit",  amount: 14400.00, ref: "PO-2248" },
    { id: "TXN-1002", date: "2025-01-15", description: "Payment Issued — Bank Transfer", type: "credit", amount: 14400.00, ref: "PAY-0041" },
    { id: "TXN-1003", date: "2025-01-28", description: "Purchase Order #PO-2261 — USB-C Hub 7-in-1 (x200)", type: "debit",  amount: 9800.00, ref: "PO-2261" },
    { id: "TXN-1004", date: "2025-02-05", description: "Purchase Order #PO-2275 — Mechanical Keyboard TKL (x80)", type: "debit",  amount: 12000.00, ref: "PO-2275" },
    { id: "TXN-1005", date: "2025-02-10", description: "Partial Payment — Bank Transfer", type: "credit", amount: 10000.00, ref: "PAY-0055" },
    { id: "TXN-1006", date: "2025-02-20", description: "Purchase Order #PO-2291 — Portable Charger 20000mAh (x150)", type: "debit",  amount: 7500.00, ref: "PO-2291" },
    { id: "TXN-1007", date: "2025-03-01", description: "Payment Issued — Bank Transfer", type: "credit", amount: 9300.00, ref: "PAY-0068" },
    { id: "TXN-1008", date: "2025-03-05", description: "Credit Note — Returned 5 defective units", type: "credit", amount: 600.00, ref: "CN-0012" },
  ],
  2: [
    { id: "TXN-2001", date: "2025-01-10", description: "Purchase Order #PO-2252 — Cotton Crew T-Shirt (x500)", type: "debit",  amount: 8750.00, ref: "PO-2252" },
    { id: "TXN-2002", date: "2025-01-25", description: "Payment Issued — Bank Transfer", type: "credit", amount: 8750.00, ref: "PAY-0044" },
    { id: "TXN-2003", date: "2025-02-12", description: "Purchase Order #PO-2278 — Running Socks 3-Pack (x400)", type: "debit",  amount: 4800.00, ref: "PO-2278" },
    { id: "TXN-2004", date: "2025-02-18", description: "Purchase Order #PO-2285 — Linen Throw Blanket (x100)", type: "debit",  amount: 5200.00, ref: "PO-2285" },
    { id: "TXN-2005", date: "2025-02-28", description: "Payment Issued — Bank Transfer", type: "credit", amount: 5000.00, ref: "PAY-0061" },
  ],
  3: [
    { id: "TXN-3001", date: "2024-12-15", description: "Purchase Order #PO-2201 — Leather Wallet Slim (x300)", type: "debit",  amount: 21000.00, ref: "PO-2201" },
    { id: "TXN-3002", date: "2025-01-05", description: "Payment Issued — Wire Transfer", type: "credit", amount: 21000.00, ref: "PAY-0038" },
    { id: "TXN-3003", date: "2025-01-20", description: "Purchase Order #PO-2258 — Notebook A5 Grid (x1000)", type: "debit",  amount: 15000.00, ref: "PO-2258" },
    { id: "TXN-3004", date: "2025-02-01", description: "Purchase Order #PO-2269 — Bamboo Desk Organiser (x250)", type: "debit",  amount: 18750.00, ref: "PO-2269" },
    { id: "TXN-3005", date: "2025-02-15", description: "Payment Issued — Wire Transfer", type: "credit", amount: 15000.00, ref: "PAY-0052" },
    { id: "TXN-3006", date: "2025-03-01", description: "Purchase Order #PO-2298 — Phone Case iPhone 15 (x500)", type: "debit",  amount: 12500.00, ref: "PO-2298" },
    { id: "TXN-3007", date: "2025-03-05", description: "Payment Issued — Wire Transfer", type: "credit", amount: 18750.00, ref: "PAY-0070" },
  ],
  4: [
    { id: "TXN-4001", date: "2025-01-18", description: "Purchase Order #PO-2255 — Scented Candle Set (x200)", type: "debit",  amount: 6800.00, ref: "PO-2255" },
    { id: "TXN-4002", date: "2025-02-01", description: "Payment Issued — Bank Transfer", type: "credit", amount: 6800.00, ref: "PAY-0048" },
    { id: "TXN-4003", date: "2025-02-20", description: "Purchase Order #PO-2288 — Ceramic Coffee Mug (x400)", type: "debit",  amount: 5600.00, ref: "PO-2288" },
    { id: "TXN-4004", date: "2025-02-28", description: "Purchase Order #PO-2293 — Aroma Diffuser Glass (x100)", type: "debit",  amount: 4200.00, ref: "PO-2293" },
    { id: "TXN-4005", date: "2025-03-05", description: "Partial Payment — Bank Transfer", type: "credit", amount: 5000.00, ref: "PAY-0072" },
  ],
  5: [
    { id: "TXN-5001", date: "2024-12-20", description: "Purchase Order #PO-2208 — Stainless Water Bottle (x300)", type: "debit",  amount: 7500.00, ref: "PO-2208" },
    { id: "TXN-5002", date: "2025-01-05", description: "Prepayment — Bank Transfer", type: "credit", amount: 7500.00, ref: "PAY-0040" },
    { id: "TXN-5003", date: "2025-01-14", description: "Purchase Order #PO-2248 — Yoga Mat Pro (x150)", type: "debit",  amount: 6000.00, ref: "PO-2248" },
    { id: "TXN-5004", date: "2025-01-14", description: "Prepayment — Bank Transfer", type: "credit", amount: 6000.00, ref: "PAY-0043" },
    { id: "TXN-5005", date: "2025-01-20", description: "Debit Note — Quality issue adjustment", type: "credit", amount: 800.00, ref: "DN-0005" },
  ],
  6: [
    { id: "TXN-6001", date: "2025-02-01", description: "Purchase Order #PO-2265 — Notebook A5 Grid (x200)", type: "debit",  amount: 1400.00, ref: "PO-2265" },
    { id: "TXN-6002", date: "2025-02-10", description: "Payment Issued — Online Transfer", type: "credit", amount: 1400.00, ref: "PAY-0053" },
    { id: "TXN-6003", date: "2025-02-25", description: "Purchase Order #PO-2290 — Bamboo Desk Organiser (x80)", type: "debit",  amount: 2240.00, ref: "PO-2290" },
    { id: "TXN-6004", date: "2025-03-03", description: "Purchase Order #PO-2301 — Notebook A5 Grid (x300)", type: "debit",  amount: 2100.00, ref: "PO-2301" },
    { id: "TXN-6005", date: "2025-03-05", description: "Payment Issued — Online Transfer", type: "credit", amount: 2000.00, ref: "PAY-0074" },
  ],
  7: [
    { id: "TXN-7001", date: "2024-10-10", description: "Purchase Order #PO-2155 — Yoga Mat Pro (x200)", type: "debit",  amount: 8000.00, ref: "PO-2155" },
    { id: "TXN-7002", date: "2024-10-25", description: "Payment Issued — Bank Transfer", type: "credit", amount: 8000.00, ref: "PAY-0022" },
    { id: "TXN-7003", date: "2024-11-15", description: "Purchase Order #PO-2178 — Running Socks 3-Pack (x600)", type: "debit",  amount: 7200.00, ref: "PO-2178" },
    { id: "TXN-7004", date: "2024-11-20", description: "Debit Note — Batch quality hold", type: "credit", amount: 1200.00, ref: "DN-0003" },
    { id: "TXN-7005", date: "2024-12-01", description: "Partial Payment — Bank Transfer", type: "credit", amount: 3000.00, ref: "PAY-0031" },
  ],
  8: [
    { id: "TXN-8001", date: "2025-01-12", description: "Purchase Order #PO-2253 — Gift Packaging (x1000)", type: "debit",  amount: 4500.00, ref: "PO-2253" },
    { id: "TXN-8002", date: "2025-01-22", description: "Payment Issued — Bank Transfer", type: "credit", amount: 4500.00, ref: "PAY-0046" },
    { id: "TXN-8003", date: "2025-02-05", description: "Purchase Order #PO-2272 — Custom Boxes (x500)", type: "debit",  amount: 3800.00, ref: "PO-2272" },
    { id: "TXN-8004", date: "2025-02-10", description: "Purchase Order #PO-2279 — Gift Packaging Premium (x400)", type: "debit",  amount: 3200.00, ref: "PO-2279" },
    { id: "TXN-8005", date: "2025-02-20", description: "Payment Issued — Bank Transfer", type: "credit", amount: 3800.00, ref: "PAY-0059" },
    { id: "TXN-8006", date: "2025-03-01", description: "Purchase Order #PO-2296 — Custom Boxes (x800)", type: "debit",  amount: 6080.00, ref: "PO-2296" },
  ],
};

const CATEGORIES = ["All", ...Array.from(new Set(INITIAL_SUPPLIERS.map(s => s.category))).sort()];
const COUNTRY_FLAG = { "United States": "🇺🇸", "India": "🇮🇳", "Japan": "🇯🇵", "United Kingdom": "🇬🇧", "UAE": "🇦🇪", "Sri Lanka": "🇱🇰", "South Korea": "🇰🇷", "Germany": "🇩🇪" };

const AV_COLORS = [
  ["#2B5490","rgba(43,84,144,.14)"], ["#5B3D8F","rgba(91,61,143,.14)"],
  ["#2D6A4F","rgba(45,106,79,.14)"], ["#B8902A","rgba(184,144,42,.14)"],
  ["#B5372A","rgba(181,55,42,.14)"], ["#7A5C1E","rgba(122,92,30,.14)"],
  ["#8A3A6A","rgba(138,58,106,.14)"],["#1B6B8A","rgba(27,107,138,.14)"],
];
const avColor = (id) => AV_COLORS[(id - 1) % AV_COLORS.length];
const initials = (name) => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
const fmtAmt = (n) => Number(n || 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TAG_STYLES = {
  preferred:     { bg: "rgba(184,144,42,.1)",  border: "rgba(184,144,42,.25)", text: "#B8902A" },
  electronics:   { bg: "rgba(43,84,144,.08)",  border: "rgba(43,84,144,.2)",  text: "#2B5490" },
  apparel:       { bg: "rgba(91,61,143,.08)",  border: "rgba(91,61,143,.2)",  text: "#5B3D8F" },
  international: { bg: "rgba(45,106,79,.07)",  border: "rgba(45,106,79,.2)",  text: "#2D6A4F" },
  local:         { bg: "rgba(45,106,79,.12)",  border: "rgba(45,106,79,.28)", text: "#2D6A4F" },
  bulk:          { bg: "rgba(122,92,30,.08)",  border: "rgba(122,92,30,.2)",  text: "#7A5C1E" },
  reliable:      { bg: "rgba(43,84,144,.08)",  border: "rgba(43,84,144,.2)",  text: "#2B5490" },
  "under-review":{ bg: "rgba(181,55,42,.08)",  border: "rgba(181,55,42,.2)",  text: "#B5372A" },
  eco:           { bg: "rgba(45,106,79,.08)",  border: "rgba(45,106,79,.2)",  text: "#2D6A4F" },
  packaging:     { bg: "rgba(158,144,128,.1)", border: "rgba(158,144,128,.2)", text: "#9E9080" },
  home:          { bg: "rgba(122,92,30,.07)",  border: "rgba(122,92,30,.18)", text: "#7A5C1E" },
  lifestyle:     { bg: "rgba(45,106,79,.07)",  border: "rgba(45,106,79,.18)", text: "#2D6A4F" },
  general:       { bg: "rgba(158,144,128,.08)",border: "rgba(158,144,128,.2)", text: "#9E9080" },
  stationery:    { bg: "rgba(158,144,128,.1)", border: "rgba(158,144,128,.2)", text: "#6B5F54" },
  sports:        { bg: "rgba(181,55,42,.07)",  border: "rgba(181,55,42,.18)", text: "#B5372A" },
};

// ── STYLES ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Geist+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
    --purple:#5B3D8F;
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
  .tb-avatar {
    width:36px; height:36px; border-radius:8px;
    border:1.5px solid rgba(184,144,42,.3); background:rgba(184,144,42,.08);
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:13px; font-weight:700; color:var(--goldl); cursor:pointer;
  }

  /* ══ CONTENT ══ */
  .main { flex:1; overflow:hidden; display:flex; }
  .content { flex:1; overflow-y:auto; padding:22px 28px 36px; display:flex; flex-direction:column; gap:18px; }
  .content::-webkit-scrollbar { width:3px; }
  .content::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  /* ══ PAGE HEADER ══ */
  .page-header { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; animation:fadeUp .3s ease both; }
  .page-eyebrow { font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); margin-bottom:5px; display:flex; align-items:center; gap:8px; }
  .page-eyebrow::before { content:''; width:18px; height:1px; background:var(--gold); opacity:.5; }
  .page-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; color:var(--ink); letter-spacing:-.2px; line-height:1; margin-bottom:5px; }
  .page-desc  { font-size:12.5px; color:var(--ink40); }
  .page-actions { display:flex; gap:10px; align-items:center; }

  /* ══ BUTTONS ══ */
  .btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:'Outfit',sans-serif; letter-spacing:.2px; border:1px solid transparent; transition:all .2s; }
  .btn-ghost { background:transparent; border-color:var(--ink10); color:var(--ink50); }
  .btn-ghost:hover { border-color:var(--ink20); color:var(--ink60); background:var(--warm); }
  .btn-gold  { background:var(--gold); border-color:var(--goldd); color:#fff; box-shadow:0 2px 8px rgba(184,144,42,.3); }
  .btn-gold:hover { background:var(--goldl); box-shadow:0 4px 16px rgba(184,144,42,.4); transform:translateY(-1px); }
  .btn-ink   { background:var(--ink); border-color:rgba(255,255,255,.08); color:#F6F3EC; }
  .btn-ink:hover { background:var(--ink80); }

  /* ══ SUPPLIER SELECTOR CARD ══ */
  .supplier-selector-card {
    background:var(--paper); border:1px solid var(--ink10); border-radius:12px;
    box-shadow:var(--shadow-xs); overflow:hidden;
    animation:fadeUp .35s ease both; animation-delay:40ms;
  }
  .ssc-empty {
    padding:40px 32px; display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center;
  }
  .ssc-empty-icon {
    width:64px; height:64px; border-radius:16px;
    background:var(--goldbg); border:1.5px solid var(--goldbr);
    display:flex; align-items:center; justify-content:center;
    font-size:28px;
  }
  .ssc-empty-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink); }
  .ssc-empty-sub   { font-size:13px; color:var(--ink40); max-width:320px; line-height:1.65; }
  .ssc-loaded {
    display:flex; align-items:center; gap:0; flex-wrap:nowrap;
  }
  .ssc-info {
    display:flex; align-items:center; gap:16px; padding:18px 22px; flex:1; min-width:0;
  }
  .ssc-av {
    width:54px; height:54px; border-radius:13px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:700; letter-spacing:.3px;
  }
  .ssc-details { flex:1; min-width:0; }
  .ssc-name    { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink); line-height:1.1; margin-bottom:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ssc-meta    { font-size:12px; color:var(--ink40); margin-bottom:7px; }
  .ssc-tags    { display:flex; gap:5px; flex-wrap:wrap; }
  .ssc-divider { width:1px; background:var(--ink06); align-self:stretch; margin:0; }
  .ssc-stats   { display:grid; grid-template-columns:repeat(3,1fr); }
  .ssc-stat    { padding:16px 22px; display:flex; flex-direction:column; gap:3px; }
  .ssc-stat:not(:last-child) { border-right:1px solid var(--ink06); }
  .ssv { font-family:'Geist Mono',monospace; font-size:15px; font-weight:700; color:var(--ink); }
  .ssl { font-size:9px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:var(--ink40); }
  .ssc-actions { padding:14px 20px; border-left:1px solid var(--ink06); display:flex; flex-direction:column; gap:8px; justify-content:center; align-items:stretch; }

  /* ══ STAT STRIP ══ */
  .stat-strip { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; animation:fadeUp .4s ease both; animation-delay:70ms; }
  .stat-card {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:10px; padding:14px 16px; box-shadow:var(--shadow-xs);
    position:relative; overflow:hidden; transition:box-shadow .2s,transform .2s;
  }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--sc),transparent); }
  .stat-lbl { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink40); margin-bottom:8px; }
  .stat-val { font-family:'Geist Mono',monospace; font-size:22px; font-weight:600; color:var(--sc); line-height:1; }
  .stat-sub { font-size:10.5px; color:var(--ink40); margin-top:4px; }

  /* ══ ACCOUNT TOOLBAR ══ */
  .account-toolbar {
    background:var(--paper); border:1px solid var(--ink10); border-radius:10px;
    padding:12px 18px; display:flex; gap:12px; flex-wrap:wrap; align-items:center;
    animation:fadeUp .45s ease both; animation-delay:90ms;
  }
  .filter-group { display:flex; flex-direction:column; gap:5px; }
  .filter-label { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); }
  .search-wrap  { position:relative; }
  .search-ico   { position:absolute; left:11px; top:50%; transform:translateY(-50%); font-size:12px; color:var(--ink30); pointer-events:none; }
  .search-input {
    padding:8px 11px 8px 33px; background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; font-family:'Outfit',sans-serif; font-size:12.5px; font-weight:500;
    color:var(--ink); outline:none; transition:all .18s; width:220px;
  }
  .search-input:focus { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .filter-select-wrap { position:relative; }
  .filter-select {
    padding:8px 30px 8px 11px; background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; font-family:'Outfit',sans-serif; font-size:12px; font-weight:500;
    color:var(--ink); outline:none; appearance:none; cursor:pointer; transition:all .18s;
  }
  .filter-select:focus { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .filter-arrow { position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:9px; color:var(--ink30); pointer-events:none; }
  .toolbar-right { margin-left:auto; display:flex; align-items:center; gap:8px; }

  /* ══ LEDGER TABLE ══ */
  .ledger-card { background:var(--paper); border:1px solid var(--ink10); border-radius:10px; box-shadow:var(--shadow-xs); overflow:hidden; animation:fadeUp .5s ease both; animation-delay:110ms; }
  .ledger-head {
    display:grid; grid-template-columns:110px 50px 1fr 140px 140px 100px;
    gap:8px; padding:10px 20px; background:var(--warm); border-bottom:1px solid var(--ink10);
  }
  .lhc { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:4px; }
  .lhc.right { justify-content:flex-end; }
  .ledger-row {
    display:grid; grid-template-columns:110px 50px 1fr 140px 140px 100px;
    gap:8px; padding:11px 20px; align-items:center;
    border-bottom:1px solid var(--ink03); transition:background .14s; cursor:default;
  }
  .ledger-row:last-child { border-bottom:none; }
  .ledger-row:hover { background:var(--warm); }
  .ledger-row.debit-row  { border-left:3px solid rgba(181,55,42,.3); padding-left:17px; }
  .ledger-row.credit-row { border-left:3px solid rgba(45,106,79,.3); padding-left:17px; }
  .txn-date { font-family:'Geist Mono',monospace; font-size:11px; color:var(--ink40); font-weight:500; }
  .txn-type-badge {
    display:inline-flex; align-items:center; justify-content:center;
    padding:2px 7px; border-radius:5px; font-size:9px; font-weight:800;
    letter-spacing:.5px; text-transform:uppercase;
  }
  .txn-desc { font-size:12.5px; color:var(--ink60); font-weight:500; line-height:1.4; }
  .txn-ref  { font-family:'Geist Mono',monospace; font-size:10px; color:var(--ink30); margin-top:2px; }
  .txn-amount {
    font-family:'Geist Mono',monospace; font-size:13.5px; font-weight:700;
    text-align:right;
  }
  .txn-balance { font-family:'Geist Mono',monospace; font-size:12px; font-weight:600; text-align:right; color:var(--ink50); }

  /* ══ LEDGER FOOTER ══ */
  .ledger-footer {
    border-top:2px solid var(--ink10); background:var(--warm);
    display:grid; grid-template-columns:110px 50px 1fr 140px 140px 100px;
    gap:8px; padding:14px 20px; align-items:center;
  }
  .lf-label { font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:var(--ink50); grid-column:1/4; }
  .lf-total { font-family:'Geist Mono',monospace; font-size:15px; font-weight:700; text-align:right; }

  /* Balance summary strip */
  .balance-strip {
    display:grid; grid-template-columns:1fr 1fr 1fr; border-top:1.5px solid var(--ink10); background:var(--ink);
    border-radius:0 0 10px 10px;
  }
  .bal-cell { padding:16px 22px; display:flex; flex-direction:column; gap:4px; }
  .bal-cell:not(:last-child) { border-right:1px solid rgba(255,255,255,.06); }
  .bal-label { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(246,243,236,.3); }
  .bal-val   { font-family:'Geist Mono',monospace; font-size:22px; font-weight:700; line-height:1; }
  .bal-sub   { font-size:10.5px; color:rgba(246,243,236,.3); }

  /* ══ EMPTY ACCOUNT ══ */
  .empty-account { padding:60px 32px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:14px; }
  .ea-ico   { font-size:44px; opacity:.35; }
  .ea-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink60); }
  .ea-sub   { font-size:13px; color:var(--ink40); max-width:280px; line-height:1.6; }

  /* ══ PICKER MODAL ══ */
  .modal-backdrop { position:fixed; inset:0; background:rgba(27,23,19,.55); z-index:400; backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:20px; animation:bdIn .2s ease; }
  @keyframes bdIn { from{opacity:0} to{opacity:1} }
  .picker-modal {
    background:var(--paper); border:1px solid var(--ink10); border-radius:16px;
    box-shadow:var(--shadow-lg); width:100%; max-width:640px; max-height:88vh;
    display:flex; flex-direction:column; overflow:hidden;
    animation:modalIn .28s cubic-bezier(.16,1,.3,1);
  }
  @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(10px)} to{opacity:1;transform:none} }
  .picker-head {
    padding:20px 24px 18px; background:var(--ink); border-bottom:1px solid rgba(184,144,42,.25);
    display:flex; align-items:flex-start; justify-content:space-between; flex-shrink:0;
  }
  .picker-eyebrow { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(184,144,42,.7); margin-bottom:4px; }
  .picker-title   { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#F6F3EC; }
  .picker-close {
    width:32px; height:32px; border-radius:7px; background:rgba(246,243,236,.06);
    border:1px solid rgba(246,243,236,.1); color:rgba(246,243,236,.4);
    cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .picker-close:hover { background:rgba(246,243,236,.12); color:rgba(246,243,236,.85); }
  .picker-filters {
    padding:14px 22px; background:var(--warm); border-bottom:1px solid var(--ink10);
    display:flex; gap:10px; align-items:center; flex-wrap:wrap; flex-shrink:0;
  }
  .picker-search {
    flex:1; min-width:180px; padding:9px 12px 9px 34px;
    background:var(--paper); border:1.5px solid var(--ink10); border-radius:7px;
    font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; color:var(--ink);
    outline:none; transition:all .18s;
  }
  .picker-search:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .picker-search-wrap { position:relative; flex:1; min-width:180px; }
  .picker-search-ico { position:absolute; left:11px; top:50%; transform:translateY(-50%); font-size:13px; color:var(--ink30); pointer-events:none; }
  .picker-list { flex:1; overflow-y:auto; }
  .picker-list::-webkit-scrollbar { width:3px; }
  .picker-list::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }
  .picker-item {
    display:flex; align-items:center; gap:14px; padding:13px 22px;
    border-bottom:1px solid var(--ink03); cursor:pointer; transition:background .14s;
  }
  .picker-item:last-child { border-bottom:none; }
  .picker-item:hover { background:var(--warm); }
  .picker-item.selected { background:var(--goldbg); }
  .picker-av {
    width:42px; height:42px; border-radius:10px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:700;
  }
  .picker-info { flex:1; min-width:0; }
  .picker-name { font-size:14px; font-weight:700; color:var(--ink); margin-bottom:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .picker-sub  { font-size:11px; color:var(--ink40); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .picker-right { display:flex; flex-direction:column; align-items:flex-end; gap:4px; }
  .picker-count { font-family:'Geist Mono',monospace; font-size:12px; font-weight:700; color:var(--ink); }
  .picker-cnt-lbl { font-size:9.5px; color:var(--ink40); }
  .picker-empty { padding:48px 32px; text-align:center; }
  .picker-empty-ico { font-size:36px; opacity:.3; margin-bottom:10px; }
  .picker-empty-txt { font-size:13px; color:var(--ink40); }
  .picker-footer { padding:14px 22px; border-top:1px solid var(--ink10); display:flex; justify-content:flex-end; gap:8px; flex-shrink:0; background:var(--paper); }

  /* ══ STATUS ══ */
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:9.5px; font-weight:700; text-transform:capitalize; letter-spacing:.3px; }
  .status-dot   { width:5px; height:5px; border-radius:50%; }
  .tag-chip     { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:.3px; white-space:nowrap; }

  /* ══ RESPONSIVE ══ */
  @media (max-width:1100px) {
    .ledger-head,.ledger-row,.ledger-footer { grid-template-columns:100px 46px 1fr 130px 130px 90px; }
    .ssc-stats { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:800px) {
    .ledger-head,.ledger-row,.ledger-footer { grid-template-columns:90px 1fr 120px 120px; }
    .ledger-head>:nth-child(2),.ledger-row>:nth-child(2) { display:none; }
    .ledger-head>:nth-child(6),.ledger-row>:nth-child(6) { display:none; }
    .stat-strip { grid-template-columns:repeat(2,1fr); }
  }
`;

export default function SupplierAccounts() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [pickerOpen,       setPickerOpen]       = useState(false);
  const [pickerSearch,     setPickerSearch]     = useState("");
  const [pickerCategory,   setPickerCategory]   = useState("All");
  const [pickerStatus,     setPickerStatus]     = useState("All");
  const [txnSearch,        setTxnSearch]        = useState("");
  const [txnType,          setTxnType]          = useState("All");
  const [txnSort,          setTxnSort]          = useState("date-desc");
  const pickerSearchRef = useRef();

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setPickerOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    if (pickerOpen) setTimeout(() => pickerSearchRef.current?.focus(), 80);
  }, [pickerOpen]);

  // ── Picker filtering ──
  const filteredPicker = useMemo(() => {
    const q = pickerSearch.toLowerCase().trim();
    return INITIAL_SUPPLIERS.filter(s => {
      if (pickerCategory !== "All" && s.category !== pickerCategory) return false;
      if (pickerStatus   !== "All" && s.status   !== pickerStatus)   return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.code.toLowerCase().includes(q) &&
               !s.contactName.toLowerCase().includes(q) && !s.city.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [pickerSearch, pickerCategory, pickerStatus]);

  // ── Transaction data ──
  const rawTxns = selectedSupplier ? (SAMPLE_TRANSACTIONS[selectedSupplier.id] || []) : [];

  const filteredTxns = useMemo(() => {
    let list = [...rawTxns];
    const q = txnSearch.toLowerCase().trim();
    if (q) list = list.filter(t => t.description.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    if (txnType !== "All") list = list.filter(t => t.type === txnType);
    list.sort((a, b) => {
      if (txnSort === "date-desc") return b.date.localeCompare(a.date);
      if (txnSort === "date-asc")  return a.date.localeCompare(b.date);
      if (txnSort === "amount-desc") return b.amount - a.amount;
      if (txnSort === "amount-asc")  return a.amount - b.amount;
      return 0;
    });
    return list;
  }, [rawTxns, txnSearch, txnType, txnSort]);

  // ── Running balance & totals ──
  const { totalDebit, totalCredit, rowsWithBalance } = useMemo(() => {
    const sorted = [...rawTxns].sort((a, b) => a.date.localeCompare(b.date));
    let running = 0;
    const rows = sorted.map(t => {
      if (t.type === "debit")  running += t.amount;
      if (t.type === "credit") running -= t.amount;
      return { ...t, balance: running };
    });
    const balMap = Object.fromEntries(rows.map(r => [r.id, r.balance]));
    const withBal = filteredTxns.map(t => ({ ...t, balance: balMap[t.id] ?? 0 }));
    const td = rawTxns.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
    const tc = rawTxns.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
    return { totalDebit: td, totalCredit: tc, rowsWithBalance: withBal };
  }, [rawTxns, filteredTxns]);

  const outstanding = totalDebit - totalCredit;

  const handleSelectSupplier = (s) => {
    setSelectedSupplier(s);
    setPickerOpen(false);
    setPickerSearch("");
    setTxnSearch("");
    setTxnType("All");
  };

  const TagBadge = ({ tag }) => {
    const st = TAG_STYLES[tag] || { bg: "var(--warm2)", border: "var(--ink10)", text: "var(--ink50)" };
    return <span className="tag-chip" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.text }}>{tag}</span>;
  };

  const StatusBadge = ({ status }) => (
    <span className="status-badge" style={{
      background: status === "active" ? "var(--greenbg)" : "var(--warm2)",
      border: `1px solid ${status === "active" ? "var(--greenbr)" : "var(--ink10)"}`,
      color: status === "active" ? "var(--green)" : "var(--ink40)",
    }}>
      <span className="status-dot" style={{ background: status === "active" ? "#3D8A65" : "#9E9080" }} />
      {status}
    </span>
  );

  const [clr, bg] = selectedSupplier ? avColor(selectedSupplier.id) : ["#B8902A", "rgba(184,144,42,.12)"];

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="brand">
              <div className="brand-mark">N</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div className="brand-name">Nexus POS</div>
                <div className="brand-sub">Admin · Retail</div>
              </div>
            </div>
            <div className="vdiv" />
            <nav className="breadcrumb">
              <span className="bc-link">Dashboard</span>
              <span className="bc-sep">›</span>
              <span className="bc-link">Procurement</span>
              <span className="bc-sep">›</span>
              <span className="bc-active">Supplier Accounts</span>
            </nav>
          </div>
          <div className="topbar-right">
            <div className="vdiv" />
            <div className="tb-avatar">AD</div>
          </div>
        </header>

        <div className="main">
          <div className="content">

            {/* PAGE HEADER */}
            <div className="page-header">
              <div>
                <div className="page-eyebrow">Finance · Payables</div>
                <div className="page-title">Supplier Accounts</div>
                <div className="page-desc">View ledger, track debits & credits, and manage outstanding balances</div>
              </div>
              <div className="page-actions">
                {selectedSupplier && <button className="btn btn-ghost">↓ Export Ledger</button>}
                <button className="btn btn-gold" onClick={() => setPickerOpen(true)}>
                  ⊕ {selectedSupplier ? "Change Supplier" : "Select Supplier"}
                </button>
              </div>
            </div>

            {/* ── SUPPLIER SELECTOR CARD ── */}
            <div className="supplier-selector-card">
              {!selectedSupplier ? (
                <div className="ssc-empty">
                  <div className="ssc-empty-icon">🏭</div>
                  <div className="ssc-empty-title">No Supplier Selected</div>
                  <div className="ssc-empty-sub">Select a supplier to view their account ledger, outstanding balances, and full transaction history.</div>
                  <button className="btn btn-gold" style={{ marginTop: 4 }} onClick={() => setPickerOpen(true)}>
                    ⊕ Select Supplier
                  </button>
                </div>
              ) : (
                <div className="ssc-loaded">
                  <div className="ssc-info">
                    <div className="ssc-av" style={{ background: bg, border: `2px solid ${clr}30`, color: clr }}>
                      {initials(selectedSupplier.name)}
                    </div>
                    <div className="ssc-details">
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                        <div className="ssc-name">{selectedSupplier.name}</div>
                        {selectedSupplier.preferred && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "var(--goldbg)", border: "1px solid var(--goldbr)", color: "var(--gold)", letterSpacing: ".5px", flexShrink: 0 }}>★ PREFERRED</span>
                        )}
                        <StatusBadge status={selectedSupplier.status} />
                      </div>
                      <div className="ssc-meta">
                        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--gold)" }}>{selectedSupplier.code}</span>
                        <span style={{ color: "var(--ink30)", margin: "0 7px" }}>·</span>
                        {selectedSupplier.category}
                        <span style={{ color: "var(--ink30)", margin: "0 7px" }}>·</span>
                        {COUNTRY_FLAG[selectedSupplier.country] || "🌐"} {selectedSupplier.city}, {selectedSupplier.country}
                        <span style={{ color: "var(--ink30)", margin: "0 7px" }}>·</span>
                        {selectedSupplier.contactName}
                        <span style={{ color: "var(--ink30)", margin: "0 7px" }}>·</span>
                        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11 }}>{selectedSupplier.currency}</span>
                        <span style={{ color: "var(--ink30)", margin: "0 7px" }}>·</span>
                        {selectedSupplier.paymentTerms}
                      </div>
                      <div className="ssc-tags">
                        {selectedSupplier.tags.slice(0, 3).map(t => <TagBadge key={t} tag={t} />)}
                      </div>
                    </div>
                  </div>

                  <div className="ssc-divider" />

                  <div className="ssc-stats">
                    <div className="ssc-stat">
                      <div className="ssv" style={{ color: "var(--red)" }}>{selectedSupplier.currency} {fmtAmt(totalDebit)}</div>
                      <div className="ssl">Total Debit</div>
                    </div>
                    <div className="ssc-stat">
                      <div className="ssv" style={{ color: "var(--green)" }}>{selectedSupplier.currency} {fmtAmt(totalCredit)}</div>
                      <div className="ssl">Total Credit</div>
                    </div>
                    <div className="ssc-stat">
                      <div className="ssv" style={{ color: outstanding > 0 ? "var(--gold)" : "var(--green)" }}>
                        {selectedSupplier.currency} {fmtAmt(Math.abs(outstanding))}
                      </div>
                      <div className="ssl">{outstanding > 0 ? "Outstanding" : "Overpaid"}</div>
                    </div>
                  </div>

                  <div className="ssc-actions">
                    <button className="btn btn-gold" style={{ fontSize: 12, padding: "8px 16px" }} onClick={() => setPickerOpen(true)}>⇄ Change</button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "8px 16px" }}>＋ Add Entry</button>
                  </div>
                </div>
              )}
            </div>

            {/* ── STATS (only when supplier selected) ── */}
            {selectedSupplier && (
              <div className="stat-strip" style={{ animationDelay: "0ms" }}>
                {[
                  { label: "Total Transactions", val: rawTxns.length,           sub: "All entries",          color: "var(--blue)"   },
                  { label: "Total Debits",        val: rawTxns.filter(t => t.type === "debit").length,  sub: "Purchase orders",  color: "var(--red)"    },
                  { label: "Total Credits",       val: rawTxns.filter(t => t.type === "credit").length, sub: "Payments & notes", color: "var(--green)"  },
                  { label: "Outstanding Balance", val: `${selectedSupplier.currency} ${fmtAmt(Math.abs(outstanding))}`, sub: outstanding > 0 ? "Amount payable" : outstanding < 0 ? "Credit balance" : "Fully settled", color: outstanding > 0 ? "var(--gold)" : "var(--green)" },
                ].map((s, i) => (
                  <div className="stat-card" key={i} style={{ "--sc": s.color }}>
                    <div className="stat-lbl">{s.label}</div>
                    <div className="stat-val" style={{ fontSize: typeof s.val === "string" && s.val.length > 10 ? 16 : 22 }}>{s.val}</div>
                    <div className="stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── LEDGER TABLE (only when supplier selected) ── */}
            {selectedSupplier && (
              <>
                {/* Toolbar */}
                <div className="account-toolbar">
                  <div className="filter-group">
                    <div className="filter-label">Search</div>
                    <div className="search-wrap">
                      <span className="search-ico">⌕</span>
                      <input
                        className="search-input"
                        placeholder="Description, ref, TXN ID…"
                        value={txnSearch}
                        onChange={e => setTxnSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="filter-group">
                    <div className="filter-label">Type</div>
                    <div className="filter-select-wrap">
                      <select className="filter-select" value={txnType} onChange={e => setTxnType(e.target.value)} style={{ minWidth: 120 }}>
                        <option value="All">All Types</option>
                        <option value="debit">Debit only</option>
                        <option value="credit">Credit only</option>
                      </select>
                      <span className="filter-arrow">▾</span>
                    </div>
                  </div>

                  <div className="filter-group">
                    <div className="filter-label">Sort</div>
                    <div className="filter-select-wrap">
                      <select className="filter-select" value={txnSort} onChange={e => setTxnSort(e.target.value)} style={{ minWidth: 155 }}>
                        <option value="date-desc">Date — Newest first</option>
                        <option value="date-asc">Date — Oldest first</option>
                        <option value="amount-desc">Amount — Highest first</option>
                        <option value="amount-asc">Amount — Lowest first</option>
                      </select>
                      <span className="filter-arrow">▾</span>
                    </div>
                  </div>

                  <div className="toolbar-right">
                    <span style={{ fontSize: 11.5, color: "var(--ink40)", fontWeight: 500 }}>
                      <strong style={{ color: "var(--ink60)" }}>{rowsWithBalance.length}</strong> of <strong style={{ color: "var(--ink60)" }}>{rawTxns.length}</strong> entries
                    </span>
                  </div>
                </div>

                {/* Ledger */}
                <div className="ledger-card">
                  {rowsWithBalance.length === 0 ? (
                    <div className="empty-account">
                      <div className="ea-ico">📒</div>
                      <div className="ea-title">No matching entries</div>
                      <div className="ea-sub">Adjust the search or filters to find transactions.</div>
                    </div>
                  ) : (
                    <>
                      {/* Table head */}
                      <div className="ledger-head">
                        <div className="lhc">Date</div>
                        <div className="lhc">Type</div>
                        <div className="lhc">Description</div>
                        <div className="lhc right">Debit ({selectedSupplier.currency})</div>
                        <div className="lhc right">Credit ({selectedSupplier.currency})</div>
                        <div className="lhc right">Balance</div>
                      </div>

                      {/* Rows */}
                      {rowsWithBalance.map((t, i) => (
                        <div
                          key={t.id}
                          className={`ledger-row ${t.type}-row`}
                          style={{ animation: "fadeUp .35s ease both", animationDelay: `${i * 20}ms` }}
                        >
                          <div className="txn-date">{t.date}</div>

                          <div>
                            <span className="txn-type-badge" style={
                              t.type === "debit"
                                ? { background: "var(--redbg)", border: "1px solid var(--redbr)", color: "var(--red)" }
                                : { background: "var(--greenbg)", border: "1px solid var(--greenbr)", color: "var(--green)" }
                            }>
                              {t.type === "debit" ? "DR" : "CR"}
                            </span>
                          </div>

                          <div>
                            <div className="txn-desc">{t.description}</div>
                            <div className="txn-ref">{t.id} · {t.ref}</div>
                          </div>

                          <div className="txn-amount" style={{ color: t.type === "debit" ? "var(--red)" : "var(--ink20)" }}>
                            {t.type === "debit" ? fmtAmt(t.amount) : "—"}
                          </div>

                          <div className="txn-amount" style={{ color: t.type === "credit" ? "var(--green)" : "var(--ink20)" }}>
                            {t.type === "credit" ? fmtAmt(t.amount) : "—"}
                          </div>

                          <div className="txn-balance" style={{ color: t.balance > 0 ? "var(--gold)" : t.balance < 0 ? "var(--green)" : "var(--ink40)" }}>
                            {fmtAmt(Math.abs(t.balance))}
                            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: t.balance > 0 ? "var(--gold)" : t.balance < 0 ? "var(--green)" : "var(--ink30)", opacity: .8, marginTop: 1 }}>
                              {t.balance > 0 ? "payable" : t.balance < 0 ? "overpaid" : "settled"}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Footer totals */}
                      <div className="ledger-footer">
                        <div className="lf-label">Totals — {rawTxns.length} transactions</div>
                        <div className="lf-total" style={{ color: "var(--red)" }}>{fmtAmt(totalDebit)}</div>
                        <div className="lf-total" style={{ color: "var(--green)" }}>{fmtAmt(totalCredit)}</div>
                        <div />
                      </div>

                      {/* Balance strip */}
                      <div className="balance-strip">
                        <div className="bal-cell">
                          <div className="bal-label">Total Debit</div>
                          <div className="bal-val" style={{ color: "#E87070" }}>{selectedSupplier.currency} {fmtAmt(totalDebit)}</div>
                          <div className="bal-sub">All purchase orders & charges</div>
                        </div>
                        <div className="bal-cell">
                          <div className="bal-label">Total Credit</div>
                          <div className="bal-val" style={{ color: "#6DBF96" }}>{selectedSupplier.currency} {fmtAmt(totalCredit)}</div>
                          <div className="bal-sub">Payments, refunds & notes</div>
                        </div>
                        <div className="bal-cell">
                          <div className="bal-label">{outstanding >= 0 ? "Amount to Pay" : "Credit Balance"}</div>
                          <div className="bal-val" style={{ color: outstanding > 0 ? "var(--goldl)" : outstanding < 0 ? "#6DBF96" : "rgba(246,243,236,.5)" }}>
                            {selectedSupplier.currency} {fmtAmt(Math.abs(outstanding))}
                          </div>
                          <div className="bal-sub">
                            {outstanding > 0 ? `Due — ${selectedSupplier.paymentTerms}` : outstanding < 0 ? "Supplier owes you" : "Account fully settled"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

          </div>
        </div>

        {/* ══ SUPPLIER PICKER MODAL ══ */}
        {pickerOpen && (
          <div className="modal-backdrop" onClick={() => setPickerOpen(false)}>
            <div className="picker-modal" onClick={e => e.stopPropagation()}>

              <div className="picker-head">
                <div>
                  <div className="picker-eyebrow">Select Supplier Account</div>
                  <div className="picker-title">Choose a Supplier</div>
                </div>
                <button className="picker-close" onClick={() => setPickerOpen(false)}>×</button>
              </div>

              {/* Filters */}
              <div className="picker-filters">
                <div className="picker-search-wrap">
                  <span className="picker-search-ico">⌕</span>
                  <input
                    ref={pickerSearchRef}
                    className="picker-search"
                    placeholder="Search by name, code, contact, city…"
                    value={pickerSearch}
                    onChange={e => setPickerSearch(e.target.value)}
                  />
                </div>

                <div className="filter-select-wrap">
                  <select className="filter-select" value={pickerCategory} onChange={e => setPickerCategory(e.target.value)} style={{ minWidth: 130, background: "var(--paper)" }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>

                <div className="filter-select-wrap">
                  <select className="filter-select" value={pickerStatus} onChange={e => setPickerStatus(e.target.value)} style={{ minWidth: 110, background: "var(--paper)" }}>
                    <option value="All">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>

                <span style={{ fontSize: 11, color: "var(--ink40)", fontWeight: 600, marginLeft: "auto" }}>
                  {filteredPicker.length} supplier{filteredPicker.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* List */}
              <div className="picker-list">
                {filteredPicker.length === 0 ? (
                  <div className="picker-empty">
                    <div className="picker-empty-ico">🔍</div>
                    <div className="picker-empty-txt">No suppliers match your filters</div>
                  </div>
                ) : filteredPicker.map((s, i) => {
                  const [sc, sb] = avColor(s.id);
                  const txns = SAMPLE_TRANSACTIONS[s.id] || [];
                  const td = txns.filter(t => t.type === "debit").reduce((a, t) => a + t.amount, 0);
                  const tc = txns.filter(t => t.type === "credit").reduce((a, t) => a + t.amount, 0);
                  const bal = td - tc;
                  return (
                    <div
                      key={s.id}
                      className={`picker-item${selectedSupplier?.id === s.id ? " selected" : ""}`}
                      style={{ animationDelay: `${i * 20}ms`, animation: "fadeUp .3s ease both" }}
                      onClick={() => handleSelectSupplier(s)}
                    >
                      <div className="picker-av" style={{ background: sb, border: `1.5px solid ${sc}28`, color: sc }}>
                        {initials(s.name)}
                      </div>
                      <div className="picker-info">
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="picker-name">{s.name}</div>
                          {s.preferred && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 20, background: "var(--goldbg)", border: "1px solid var(--goldbr)", color: "var(--gold)" }}>★ PREFERRED</span>}
                          <StatusBadge status={s.status} />
                        </div>
                        <div className="picker-sub">
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: "var(--gold)" }}>{s.code}</span>
                          {" · "}{s.category}{" · "}{COUNTRY_FLAG[s.country] || "🌐"} {s.city}{" · "}{s.contactName}
                        </div>
                      </div>
                      <div className="picker-right">
                        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12.5, fontWeight: 700, color: bal > 0 ? "var(--gold)" : "var(--green)" }}>
                          {s.currency} {fmtAmt(Math.abs(bal))}
                        </div>
                        <div style={{ fontSize: 9.5, color: "var(--ink40)", textAlign: "right" }}>
                          {bal > 0 ? "payable" : bal < 0 ? "credit" : "settled"} · {txns.length} txns
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="picker-footer">
                <button className="btn btn-ghost" onClick={() => setPickerOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}