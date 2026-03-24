import { useState, useMemo, useRef, useCallback } from "react";

// ── STATIC DATA ───────────────────────────────────────────────────────────────
const SUPPLIERS = [
  { id: 1, name: "TechSource Lanka Pvt Ltd",    code: "SUP-001", category: "Electronics",  contactName: "Mahesh Perera",       email: "mahesh@techsource.lk",   phone: "+94 11 456 7890", country: "Sri Lanka", city: "Colombo",   currency: "LKR", status: "active",   preferred: true  },
  { id: 2, name: "Ceylon Wholesale Distributors",code: "SUP-002", category: "General",       contactName: "Pradeep Jayawardena", email: "pradeep@cwd.lk",         phone: "+94 81 234 5678", country: "Sri Lanka", city: "Kandy",     currency: "LKR", status: "active",   preferred: false },
  { id: 3, name: "Nexgen IT Solutions",          code: "SUP-003", category: "IT & Computing",contactName: "Sampath De Silva",    email: "sampath@nexgen.lk",      phone: "+94 11 789 0123", country: "Sri Lanka", city: "Nugegoda",  currency: "LKR", status: "active",   preferred: true  },
  { id: 4, name: "Island Apparel Suppliers",     code: "SUP-004", category: "Apparel",       contactName: "Kumari Mendis",       email: "kumari@islandapp.lk",    phone: "+94 31 345 6789", country: "Sri Lanka", city: "Negombo",   currency: "LKR", status: "active",   preferred: false },
  { id: 5, name: "Global Stationery Corp",       code: "SUP-005", category: "Stationery",    contactName: "Nalin Wijesinghe",    email: "nalin@globalstat.lk",    phone: "+94 11 901 2345", country: "Sri Lanka", city: "Colombo 3", currency: "LKR", status: "active",   preferred: false },
  { id: 6, name: "Premier Home & Living",        code: "SUP-006", category: "Home & Decor",  contactName: "Dilani Rathnayake",   email: "dilani@premhome.lk",     phone: "+94 33 567 8901", country: "Sri Lanka", city: "Gampaha",   currency: "LKR", status: "inactive", preferred: false },
];

const MOCK_GRNS = [
  { id: "GRN-2026-441", date: "Mar 1, 2026",  supplier: SUPPLIERS[0], total: 284.94, items: [
    { sku: "WEP-221", name: "Wireless Earbuds Pro",  unitPrice: 59.99, qty: 3, unit: "pcs" },
    { sku: "UCH-880", name: "USB-C Hub 7-in-1",      unitPrice: 44.99, qty: 2, unit: "pcs" },
  ]},
  { id: "GRN-2026-388", date: "Feb 27, 2026", supplier: SUPPLIERS[1], total: 196.00, items: [
    { sku: "CCT-089", name: "Cotton Crew T-Shirt",   unitPrice: 18.00, qty: 4, unit: "pcs" },
    { sku: "NAG-007", name: "Notebook A5 Grid",      unitPrice: 6.00,  qty: 8, unit: "pcs" },
    { sku: "SCS-112", name: "Scented Candle Set",    unitPrice: 16.00, qty: 3, unit: "pcs" },
  ]},
  { id: "GRN-2026-312", date: "Feb 20, 2026", supplier: SUPPLIERS[2], total: 462.88, items: [
    { sku: "MKT-509", name: "Mechanical Keyboard TKL", unitPrice: 89.99, qty: 3, unit: "pcs" },
    { sku: "PCH-392", name: "Portable Charger 20000mAh",unitPrice: 49.99, qty: 4, unit: "pcs" },
  ]},
  { id: "GRN-2026-290", date: "Feb 15, 2026", supplier: SUPPLIERS[3], total: 138.00, items: [
    { sku: "CCT-089", name: "Cotton Crew T-Shirt",   unitPrice: 18.00, qty: 5, unit: "pcs" },
    { sku: "LWS-441", name: "Leather Wallet Slim",   unitPrice: 25.00, qty: 2, unit: "pcs" },
  ]},
];

const REASON_OPTIONS = [
  "Short delivery / quantity discrepancy",
  "Overcharged on invoice",
  "Defective / damaged goods",
  "Wrong items delivered",
  "Price variance from purchase order",
  "Returned goods — quality failure",
  "Duplicate invoice / billing error",
  "Freight / shipping overcharge",
  "Warranty claim",
  "Other",
];

const AV_COLORS = [
  ["#9E9080","rgba(158,144,128,.15)"],["#2B5490","rgba(43,84,144,.15)"],
  ["#5B3D8F","rgba(91,61,143,.15)"], ["#2D6A4F","rgba(45,106,79,.15)"],
  ["#B8902A","rgba(184,144,42,.15)"],["#B5372A","rgba(181,55,42,.15)"],
  ["#7A5C1E","rgba(122,92,30,.15)"], ["#8A3A6A","rgba(138,58,106,.15)"],
  ["#1B6B8A","rgba(27,107,138,.15)"],
];
const avColor  = (id) => AV_COLORS[id % AV_COLORS.length];
const initials = (n) => n.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();
const fmt      = (n) => Number(n || 0).toFixed(2);
let _uid = 100; const uid = () => ++_uid;
function genDnId() { return `DN-2026-${String(Math.floor(Math.random() * 900) + 100)}`; }

const highlight = (text, q) => {
  if (!q.trim() || !text || text === "—") return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return <>{text.slice(0,i)}<mark style={{background:"rgba(180,120,30,.28)",color:"#C4870A",borderRadius:2,padding:"0 1px"}}>{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>;
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --cream:#F6F3EC;--paper:#FDFBF7;--warm:#EEE9DF;--warm2:#E4DDD2;
    --ink:#1B1713;--ink70:#4B4038;--ink50:#6B5F54;--ink40:#9E9080;
    --ink20:#C9C0B2;--ink10:#E4DDD2;--ink06:#EDE8E0;--ink03:#F5F1EB;

    /* AMBER / BRONZE — Debit Note's signature colour */
    --amb:#B87820;--ambl:#D4960E;--ambd:#8A5A10;
    --ambbg:rgba(184,120,32,.08);--ambbr:rgba(184,120,32,.26);
    --ambhov:rgba(184,120,32,.14);

    --green:#2D6A4F;--greenbg:rgba(45,106,79,.08);--greenbr:rgba(45,106,79,.25);
    --red:#B5372A;--redbg:rgba(181,55,42,.08);--redbr:rgba(181,55,42,.22);
    --blue:#2B5490;--bluebg:rgba(43,84,144,.08);--bluebr:rgba(43,84,144,.22);

    --s0:0 1px 3px rgba(27,23,19,.06);--s1:0 4px 14px rgba(27,23,19,.1);
    --s2:0 8px 28px rgba(27,23,19,.13);--s3:0 24px 64px rgba(27,23,19,.22),0 6px 20px rgba(27,23,19,.1);
  }
  html,body,#root{min-height:100%;background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--ink)}

  @keyframes fadeUp  {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes rowIn   {from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  @keyframes overlayIn{from{opacity:0}to{opacity:1}}
  @keyframes spmIn   {from{opacity:0;transform:scale(.95) translateY(12px)}to{opacity:1;transform:none}}
  @keyframes toastIn {from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
  @keyframes modalIn {from{opacity:0;transform:scale(.97) translateY(16px)}to{opacity:1;transform:none}}

  /* ── PAGE ── */
  .dn-page{min-height:100vh;display:flex;flex-direction:column;background:var(--cream)}

  /* ── TOPBAR ── */
  .dn-tb{height:54px;flex-shrink:0;background:var(--ink);border-bottom:2px solid var(--amb);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:50}
  .dn-tb-l{display:flex;align-items:center;gap:20px}
  .dn-brand{display:flex;align-items:center;gap:10px}
  .dn-bmark{width:30px;height:30px;border-radius:5px;border:1.5px solid var(--amb);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--ambl)}
  .dn-bname{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#F6F3EC}
  .dn-bsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--amb);font-weight:600;margin-top:1px}
  .dn-bc{display:flex;align-items:center;gap:7px;font-size:11.5px}
  .dn-bca{color:rgba(246,243,236,.3);cursor:pointer;transition:color .15s}.dn-bca:hover{color:rgba(246,243,236,.65)}
  .dn-bcsep{color:rgba(246,243,236,.15)}.dn-bccur{color:var(--ambl);font-weight:500}
  .dn-tb-r{display:flex;align-items:center;gap:8px}
  .dn-av{width:30px;height:30px;border-radius:4px;border:1.5px solid var(--ambbr);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:600;color:var(--ambl)}
  .btn{display:inline-flex;align-items:center;gap:5px;padding:7px 15px;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .15s;white-space:nowrap}
  .btn-amb{background:var(--amb);color:#fff;font-weight:700}
  .btn-amb:hover{background:var(--ambl);transform:translateY(-1px);box-shadow:0 4px 14px rgba(184,120,32,.42)}
  .btn-amb:disabled{background:var(--ink20);cursor:not-allowed;transform:none;box-shadow:none}
  .btn-ol{background:transparent;border-color:rgba(246,243,236,.2)!important;color:rgba(246,243,236,.55)}
  .btn-ol:hover{border-color:rgba(246,243,236,.42)!important;color:#F6F3EC}
  .btn-gh{background:transparent;border-color:rgba(246,243,236,.1)!important;color:rgba(246,243,236,.28)}
  .btn-gh:hover{color:rgba(246,243,236,.55);border-color:rgba(246,243,236,.2)!important}

  /* ── LAYOUT ── */
  .dn-body{flex:1;overflow:hidden;display:flex;padding:14px 16px 80px;gap:12px;background:var(--cream)}
  .col-l{width:300px;flex-shrink:0;display:flex;flex-direction:column;gap:10px;overflow-y:auto}
  .col-m{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;gap:10px}
  .col-r{width:390px;flex-shrink:0;display:flex;flex-direction:column;overflow:hidden}
  .col-l::-webkit-scrollbar,.col-r::-webkit-scrollbar{width:3px}
  .col-l::-webkit-scrollbar-thumb,.col-r::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:2px}

  /* ── CARD ── */
  .card{background:var(--paper);border:1px solid var(--ink10);border-radius:8px;box-shadow:var(--s0);overflow:hidden;animation:fadeUp .22s ease both}
  .card+.card{margin-top:10px}
  .card-head{padding:11px 16px;border-bottom:1px solid var(--ink06);display:flex;align-items:center;justify-content:space-between;background:#EDE8DE}
  .card-title{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:7px}
  .card-ico{width:20px;height:20px;border-radius:5px;background:var(--ambbg);border:1px solid var(--ambbr);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
  .card-body{padding:14px 16px}

  /* ── FORM ── */
  .lbl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40);margin-bottom:5px;display:block}
  .lbl .req{color:var(--amb)}
  .inp,.sel,.ta{width:100%;padding:8px 11px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;color:var(--ink);outline:none;transition:all .18s;appearance:none}
  .inp:hover,.sel:hover{border-color:var(--ink20)}
  .inp:focus,.sel:focus,.ta:focus{border-color:var(--amb);box-shadow:0 0 0 3px rgba(184,120,32,.1);background:var(--paper)}
  .inp::placeholder{color:var(--ink20)}
  .inp-ro{background:var(--ambbg)!important;border-color:var(--ambbr)!important;color:var(--amb)!important;font-family:'Geist Mono',monospace!important;font-size:11px!important;cursor:default}
  .mono{font-family:'Geist Mono',monospace;font-size:11.5px}
  .sel-wrap{position:relative}.sel-wrap::after{content:'▾';position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:9px;color:var(--ink30);pointer-events:none}
  .sel{padding-right:26px;cursor:pointer}
  .ta{resize:vertical;min-height:68px;line-height:1.5}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .fld{margin-bottom:10px}.fld:last-child{margin-bottom:0}

  /* ── SUPPLIER ── */
  .sup-trigger{display:flex;align-items:center;gap:10px;padding:11px 13px;border:1.5px dashed var(--ambbr);border-radius:8px;background:var(--ambbg);cursor:pointer;transition:all .15s}
  .sup-trigger:hover{border-style:solid;background:var(--ambhov)}
  .sup-ico{width:36px;height:36px;border-radius:8px;background:rgba(184,120,32,.1);border:1px solid var(--ambbr);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px}
  .sup-trigger-txt{font-size:12.5px;font-weight:700;color:var(--amb)}
  .sup-trigger-sub{font-size:10.5px;color:var(--ink40);margin-top:1px}

  .sup-pill{border:1.5px solid var(--ambbr);border-radius:8px;padding:13px;background:var(--ambbg)}
  .sup-pill-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}
  .sup-av{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:700;flex-shrink:0}
  .sup-name{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:3px}
  .sup-tags{display:flex;gap:5px;flex-wrap:wrap}
  .sup-tag{font-size:8.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;padding:2px 7px;border-radius:20px;background:var(--bluebg);border:1px solid var(--bluebr);color:var(--blue)}
  .sup-dets{display:flex;flex-direction:column;gap:5px}
  .sup-row{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--ink06)}
  .sup-row:last-child{border-bottom:none}
  .sup-rl{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink40);flex-shrink:0}
  .sup-rv{font-size:11.5px;font-weight:600;color:var(--ink70);text-align:right;word-break:break-word;max-width:60%}
  .sup-change{display:flex;align-items:center;justify-content:center;gap:5px;margin-top:10px;padding:6px 12px;border-radius:6px;border:1px solid var(--ambbr);background:transparent;color:var(--amb);font-size:11px;font-weight:700;cursor:pointer;transition:all .13s;font-family:'DM Sans',sans-serif;width:100%}
  .sup-change:hover{background:var(--ambbg)}

  /* ── GRN SEARCH/LINK ── */
  .sbox{display:flex;align-items:center;gap:7px;background:var(--warm);border:1.5px solid var(--ink10);border-radius:6px;padding:0 10px;height:34px;transition:border-color .15s}
  .sbox:focus-within{border-color:var(--amb);box-shadow:0 0 0 3px rgba(184,120,32,.1)}
  .sico{color:var(--ink20);font-size:13px}
  .sinp{background:transparent;border:none;outline:none;color:var(--ink);font-size:12.5px;font-family:'DM Sans',sans-serif;width:100%}
  .sinp::placeholder{color:var(--ink20)}
  .drop{position:absolute;top:calc(100% + 5px);left:0;right:0;background:var(--paper);border:1.5px solid var(--ink10);border-radius:8px;z-index:100;box-shadow:var(--s2);overflow:hidden}
  .ditem{padding:9px 12px;cursor:pointer;transition:background .1s;border-bottom:1px solid var(--ink10)}
  .ditem:last-child{border-bottom:none}
  .ditem:hover{background:var(--warm)}
  .dn-pill{font-family:'Geist Mono',monospace;font-size:11px;color:var(--amb);font-weight:600}
  .dn-meta{font-size:11px;color:var(--ink40);margin-top:1px}

  .grn-pill{display:flex;align-items:center;gap:12px;background:var(--ambbg);border:1.5px solid var(--ambbr);border-radius:8px;padding:10px 13px;position:relative}
  .grn-pill-ico{width:36px;height:36px;border-radius:6px;background:var(--ink);border:1.5px solid var(--amb);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
  .grn-pill-id{font-family:'Geist Mono',monospace;font-size:12.5px;font-weight:700;color:var(--amb);letter-spacing:.5px}
  .grn-pill-meta{font-size:11px;color:var(--ink40);line-height:1.7;margin-top:1px}
  .unlink{position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:3px;background:transparent;border:1px solid var(--ambbr);color:var(--amb);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:all .13s;line-height:1}
  .unlink:hover{background:var(--amb);color:#fff}

  /* ── LINE ITEMS TABLE ── */
  .mcard{background:var(--paper);border:1px solid var(--ink10);border-radius:8px;box-shadow:var(--s0);display:flex;flex-direction:column;animation:fadeUp .22s .04s ease both}
  .mhead{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;background:var(--ink);border-bottom:2px solid var(--amb);border-radius:7px 7px 0 0;flex-shrink:0}
  .mtitle{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#F6F3EC;letter-spacing:.3px}
  .msub{font-size:10px;color:rgba(246,243,236,.4);margin-top:2px}

  .thead{display:grid;grid-template-columns:26px 1.8fr 90px 76px 80px 90px 70px 100px 28px;gap:6px;padding:8px 14px;background:#EDE8DE;border-bottom:2px solid var(--amb);position:sticky;top:0;z-index:2}
  .th{font-size:9.5px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:var(--ink40)}
  .th.r{text-align:right}

  .trow{display:grid;grid-template-columns:26px 1.8fr 90px 76px 80px 90px 70px 100px 28px;gap:6px;align-items:center;padding:8px 14px;border-bottom:1px solid var(--ink06);transition:background .1s;animation:rowIn .2s ease both}
  .trow:last-child{border-bottom:none}
  .trow:hover{background:var(--warm)}
  .tnum{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink20);font-weight:600}

  .tinp{width:100%;padding:6px 7px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;color:var(--ink);outline:none;transition:border-color .14s}
  .tinp:focus{border-color:var(--amb);box-shadow:0 0 0 2px rgba(184,120,32,.1)}
  .tinp::placeholder{color:var(--ink20)}
  .tinp.mono{font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink50)}
  .tinp.num{text-align:right}

  .tsel-w{position:relative}.tsel-w::after{content:'▾';position:absolute;right:7px;top:50%;transform:translateY(-50%);font-size:8px;color:var(--ink30);pointer-events:none}
  .tsel{width:100%;padding:6px 18px 6px 6px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:5px;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--ink);outline:none;appearance:none;cursor:pointer;transition:border-color .14s}
  .tsel:focus{border-color:var(--amb)}

  .tamt{font-family:'Geist Mono',monospace;font-size:12.5px;font-weight:700;color:var(--amb);text-align:right;padding-right:4px}
  .tdel{width:24px;height:24px;border-radius:5px;border:1px solid transparent;background:none;color:var(--ink20);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s;margin:0 auto}
  .tdel:hover{background:var(--redbg);border-color:var(--redbr);color:var(--red)}
  .tdel:disabled{opacity:.3;cursor:default}
  .tempty{padding:36px 20px;text-align:center;color:var(--ink20);font-size:13px}

  .add-row{padding:10px 14px;border-top:1px dashed var(--ink10);display:flex;align-items:center;gap:8px}
  .add-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:6px;border:1.5px dashed var(--ambbr);background:var(--ambbg);color:var(--amb);font-size:11.5px;font-weight:700;cursor:pointer;transition:all .14s;font-family:'DM Sans',sans-serif}
  .add-btn:hover{background:var(--ambhov);border-style:solid}
  .add-grn-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:6px;border:1.5px solid var(--bluebr);background:var(--bluebg);color:var(--blue);font-size:11.5px;font-weight:700;cursor:pointer;transition:all .14s;font-family:'DM Sans',sans-serif}
  .add-grn-btn:hover{background:rgba(43,84,144,.14)}

  .tbar{background:var(--ink);border-top:2px solid var(--amb);padding:12px 16px;border-radius:0 0 7px 7px}
  .tgrid{display:grid;grid-template-columns:1fr 1fr 1fr 1px 0.6fr;align-items:center}
  .ti{padding:0 12px}.ti:first-child{padding-left:0}
  .tlbl{font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:rgba(246,243,236,.3);font-weight:700;margin-bottom:3px}
  .tval{font-family:'Geist Mono',monospace;font-size:13.5px;font-weight:500;color:rgba(246,243,236,.7)}
  .tdiv{width:1px;height:32px;background:rgba(246,243,236,.1);margin:0 4px}
  .tgrand .tlbl{color:var(--amb);opacity:.9}
  .tgrand .tval{font-size:19px;font-weight:600;color:#F6F3EC;letter-spacing:.5px}

  /* ── RIGHT PANEL ── */
  .rcard{background:var(--paper);border:1px solid var(--ink10);border-radius:8px;box-shadow:var(--s0);overflow:hidden;flex:1;display:flex;flex-direction:column;animation:fadeUp .22s .08s ease both}
  .rhead{background:var(--ink);padding:12px 16px;border-bottom:2px solid var(--amb);flex-shrink:0}
  .rsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--amb);font-weight:700;margin-bottom:3px;opacity:.9}
  .rtitle{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#F6F3EC}
  .rbody{padding:14px 16px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:14px}
  .rbody::-webkit-scrollbar{width:3px}
  .rbody::-webkit-scrollbar-thumb{background:var(--ink10)}
  .sec{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink40);display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .sec::after{content:'';flex:1;height:1px;background:var(--ink10)}

  /* Resolution method */
  .res-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
  .res-card{padding:9px 10px;border-radius:7px;cursor:pointer;border:1.5px solid var(--ink10);background:var(--warm);transition:all .15s;text-align:left}
  .res-card:hover{border-color:var(--ink20);background:var(--paper)}
  .res-card.active{border-color:var(--amb);background:var(--ambbg)}
  .res-card.active .res-lbl{color:var(--amb)}
  .res-ico{font-size:17px;margin-bottom:5px}
  .res-lbl{font-size:11.5px;font-weight:700;color:var(--ink);display:block;margin-bottom:2px}
  .res-desc{font-size:9.5px;color:var(--ink40)}

  /* Summary rows */
  .srow{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}
  .slbl{color:var(--ink40)}
  .sval{color:var(--ink70);font-weight:500;font-family:'Geist Mono',monospace;font-size:11.5px}
  .srow.amb .slbl,.srow.amb .sval{color:var(--amb)}
  .shr{height:1px;background:var(--ink10);margin:6px 0}
  .stot{display:flex;justify-content:space-between;align-items:center;background:var(--ink);border-radius:6px;padding:10px 13px;margin-top:2px}
  .stlbl{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--ambl);letter-spacing:.3px}
  .stval{font-family:'Geist Mono',monospace;font-size:18px;font-weight:600;color:#F6F3EC;letter-spacing:.5px}

  /* Issue button */
  .issue-btn{background:var(--amb);color:#fff;width:100%;justify-content:center;padding:13px;font-size:14px;font-weight:700;letter-spacing:.3px;border-radius:7px;border:none;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:8px;margin-top:auto}
  .issue-btn:hover{background:var(--ambl);transform:translateY(-1px);box-shadow:0 6px 20px rgba(184,120,32,.42)}
  .issue-btn:disabled{background:var(--ink20);cursor:not-allowed;transform:none;box-shadow:none;opacity:.6}
  .draft-btn{background:var(--warm);border:1px solid var(--ink10);color:var(--ink40);width:100%;justify-content:center;padding:9px;font-size:12px;font-weight:500;border-radius:6px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px;margin-top:7px}
  .draft-btn:hover{border-color:var(--ink20);color:var(--ink70)}

  .nota{width:100%;background:var(--warm);border:1.5px solid var(--ink10);border-radius:6px;padding:9px 10px;resize:none;color:var(--ink70);font-family:'Cormorant Garamond',serif;font-size:14px;font-style:italic;line-height:1.6;outline:none;transition:border-color .15s}
  .nota:focus{border-color:var(--amb)}

  /* ── SUPPLIER MODAL ── */
  .spm-bd{position:fixed;inset:0;z-index:900;background:rgba(27,23,19,.58);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;animation:overlayIn .2s ease both}
  .spm-modal{background:var(--paper);border:1px solid var(--ink10);border-radius:16px;box-shadow:var(--s3);width:100%;max-width:700px;max-height:min(86vh,680px);display:flex;flex-direction:column;overflow:hidden;animation:spmIn .3s cubic-bezier(.16,1,.3,1) both}
  .spm-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 15px;background:var(--ink);border-bottom:1px solid rgba(184,120,32,.18);flex-shrink:0;position:relative}
  .spm-head::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--ambl) 30%,var(--amb) 70%,transparent);opacity:.32}
  .spm-head-l{display:flex;align-items:center;gap:12px}
  .spm-icon{width:36px;height:36px;border-radius:8px;background:rgba(184,120,32,.1);border:1.5px solid rgba(184,120,32,.28);display:flex;align-items:center;justify-content:center;font-size:16px}
  .spm-eyebrow{font-size:8px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:rgba(184,120,32,.6);margin-bottom:2px}
  .spm-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:#F6F3EC;line-height:1}
  .spm-close{width:28px;height:28px;border-radius:7px;background:rgba(246,243,236,.06);border:1px solid rgba(246,243,236,.1);color:rgba(246,243,236,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;font-size:16px}
  .spm-close:hover{background:rgba(246,243,236,.13);color:rgba(246,243,236,.9)}
  .spm-search-zone{padding:11px 16px;background:var(--warm);border-bottom:1px solid var(--ink10);display:flex;align-items:center;gap:10px;flex-shrink:0}
  .spm-sw{flex:1;position:relative}
  .spm-si{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--ink30);pointer-events:none;font-size:13px}
  .spm-sinp{width:100%;padding:8px 34px 8px 34px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:7px;outline:none;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;color:var(--ink);transition:all .18s}
  .spm-sinp::placeholder{color:var(--ink30)}
  .spm-sinp:focus{border-color:var(--amb);box-shadow:0 0 0 3px rgba(184,120,32,.1)}
  .spm-clr{position:absolute;right:9px;top:50%;transform:translateY(-50%);width:18px;height:18px;border-radius:50%;background:var(--ink10);border:none;cursor:pointer;color:var(--ink40);display:flex;align-items:center;justify-content:center;transition:all .15s}
  .spm-clr:hover{background:var(--ink20)}
  .spm-col-head{display:grid;grid-template-columns:200px 110px 1fr 130px;gap:0;padding:8px 16px 7px;border-bottom:1px solid var(--ink10);flex-shrink:0;background:var(--cream)}
  .spm-cl{font-size:8.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink40)}
  .spm-cl.r{text-align:right}
  .spm-list{flex:1;overflow-y:auto}
  .spm-list::-webkit-scrollbar{width:3px}
  .spm-list::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px}
  .spm-div{padding:6px 16px 5px;font-size:8px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--ink30);background:var(--ink03);border-bottom:1px solid var(--ink06);display:flex;align-items:center;gap:8px}
  .spm-div::after{content:'';flex:1;height:1px;background:var(--ink10)}
  .spm-item{display:grid;grid-template-columns:200px 110px 1fr 130px;gap:0;padding:10px 16px;align-items:center;cursor:pointer;border-bottom:1px solid var(--ink03);transition:background .12s;position:relative;animation:rowIn .28s ease both}
  .spm-item:last-child{border-bottom:none}
  .spm-item:hover{background:var(--warm)}
  .spm-item.sel{background:var(--ambbg)!important}
  .spm-item.sel::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--amb);border-radius:0 2px 2px 0}
  .spm-item.inactive{opacity:.5}
  .spm-col-name{display:flex;align-items:center;gap:10px;min-width:0;padding-right:10px}
  .spm-av{width:36px;height:36px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700}
  .spm-name{font-size:13px;font-weight:700;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .spm-tags{display:flex;align-items:center;gap:5px;margin-top:2px}
  .spm-pref{font-size:8px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;padding:1px 6px;border-radius:20px;background:var(--ambbg);border:1px solid var(--ambbr);color:var(--amb)}
  .spm-dot{width:5px;height:5px;border-radius:50%;background:var(--ink20)}
  .spm-dot.on{background:#3D8A65}
  .spm-code{font-family:'Geist Mono',monospace;font-size:11px;font-weight:600;color:var(--amb)}
  .spm-cat{font-size:10.5px;color:var(--ink40);margin-top:2px}
  .spm-email{font-size:11.5px;color:var(--ink50);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .spm-contact{font-size:10.5px;color:var(--ink40);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .spm-phone{font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink50);font-weight:500;text-align:right}
  .spm-curr{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink30);margin-top:2px;text-align:right}
  .spm-check{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:20px;height:20px;border-radius:50%;background:var(--amb);border:2px solid var(--ambd);display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px}
  .spm-empty{padding:48px 32px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
  .spm-empty-ico{font-size:32px;opacity:.3}
  .spm-empty-ttl{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink40)}
  .spm-footer{padding:9px 16px;border-top:1px solid var(--ink06);background:var(--warm);flex-shrink:0;font-size:11px;color:var(--ink40);font-weight:500;display:flex;align-items:center;gap:6px}
  .spm-footer strong{color:var(--ink70)}

  /* ── CONFIRM MODAL ── */
  .cm-bd{position:fixed;inset:0;background:rgba(27,23,19,.65);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:overlayIn .2s ease}
  .cm-modal{background:var(--paper);border:1px solid var(--ambbr);border-radius:13px;box-shadow:var(--s3);width:100%;max-width:470px;overflow:hidden;animation:modalIn .22s cubic-bezier(.34,1.2,.64,1)}
  .cm-head{background:var(--ink);border-bottom:2px solid var(--amb);padding:16px 22px;display:flex;align-items:center;justify-content:space-between}
  .cm-eyebrow{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--amb);font-weight:700;margin-bottom:4px;opacity:.9}
  .cm-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#F6F3EC}
  .cm-close{width:32px;height:32px;border-radius:6px;background:rgba(246,243,236,.06);border:1px solid rgba(246,243,236,.12);color:rgba(246,243,236,.5);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .15s}
  .cm-close:hover{background:rgba(184,120,32,.18);color:#F6F3EC;border-color:var(--ambbr)}
  .cm-body{padding:22px}
  .cm-badge{font-family:'Geist Mono',monospace;font-size:13px;font-weight:600;color:var(--ambl);background:var(--ambbg);border:1px solid var(--ambbr);border-radius:5px;padding:6px 12px;letter-spacing:.8px;display:inline-block;margin-bottom:16px}
  .cm-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}
  .cm-lbl{color:var(--ink40)}
  .cm-val{font-weight:600;color:var(--ink)}
  .cm-hr{height:1px;background:var(--ink10);margin:10px 0}
  .cm-total{display:flex;justify-content:space-between;align-items:center;background:var(--ambbg);border:1.5px solid var(--ambbr);border-radius:7px;padding:12px 16px;margin-top:14px}
  .cm-total-lbl{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--amb)}
  .cm-total-val{font-family:'Geist Mono',monospace;font-size:20px;font-weight:600;color:var(--amb)}
  .cm-note{display:flex;align-items:flex-start;gap:8px;padding:9px 12px;background:var(--warm);border:1px solid var(--ink10);border-radius:6px;margin-top:10px;font-size:11.5px;color:var(--ink50);line-height:1.5}
  .cm-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px}
  .cm-cancel{background:var(--warm);border:1px solid var(--ink10);color:var(--ink40);padding:10px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;cursor:pointer;transition:all .15s}
  .cm-cancel:hover{border-color:var(--ink20);color:var(--ink)}
  .cm-confirm{background:var(--amb);color:#fff;padding:10px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;border:none;transition:all .15s}
  .cm-confirm:hover{background:var(--ambl);box-shadow:0 4px 14px rgba(184,120,32,.35)}

  /* ── ISSUED STATE ── */
  .issued-bd{position:fixed;inset:0;background:rgba(27,23,19,.65);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:overlayIn .2s ease}
  .issued-card{background:var(--paper);border:1px solid var(--ambbr);border-radius:13px;box-shadow:var(--s3);width:100%;max-width:440px;padding:32px;text-align:center;animation:modalIn .3s cubic-bezier(.34,1.2,.64,1)}
  .issued-ico{width:64px;height:64px;border-radius:50%;background:var(--ambbg);border:2px solid var(--ambbr);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px}
  .issued-eyebrow{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--amb);font-weight:700;margin-bottom:6px}
  .issued-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink);margin-bottom:4px}
  .issued-sub{font-size:12.5px;color:var(--ink40);margin-bottom:22px}
  .issued-cn{font-family:'Geist Mono',monospace;font-size:15px;font-weight:600;color:var(--amb);background:var(--ambbg);border:1.5px solid var(--ambbr);border-radius:7px;padding:8px 18px;display:inline-block;margin-bottom:22px;letter-spacing:.8px}
  .issued-dets{background:var(--warm);border:1px solid var(--ink10);border-radius:8px;padding:14px 16px;margin-bottom:20px;text-align:left}
  .issued-row{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}
  .issued-rl{color:var(--ink40)}
  .issued-rv{font-weight:600;color:var(--ink)}
  .issued-tot{font-family:'Geist Mono',monospace;font-size:18px;font-weight:600;color:var(--amb)}
  .issued-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .btn-outline-amb{background:transparent;border:1.5px solid var(--ambbr);color:var(--amb);padding:10px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:600;cursor:pointer;transition:all .15s}
  .btn-outline-amb:hover{background:var(--ambbg)}
  .btn-primary-amb{background:var(--amb);color:#fff;padding:10px;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;border:none;transition:all .15s}
  .btn-primary-amb:hover{background:var(--ambl)}

  /* ── ACTION BAR ── */
  .action-bar{position:fixed;bottom:0;left:0;right:0;background:var(--ink);border-top:2px solid var(--amb);padding:11px 24px;display:flex;align-items:center;justify-content:space-between;z-index:40;box-shadow:0 -4px 20px rgba(27,23,19,.3)}
  .ainfo{font-size:11px;color:rgba(246,243,236,.35);display:flex;align-items:center;gap:14px}
  .ainfo strong{color:var(--ambl);font-family:'Geist Mono',monospace;font-size:12px}
  .abtns{display:flex;gap:7px}

  /* ── TOAST ── */
  .toast{position:fixed;top:66px;right:22px;z-index:200;background:var(--ink);border:1px solid var(--amb);border-radius:8px;padding:11px 16px;display:flex;align-items:center;gap:9px;font-size:12px;font-weight:600;color:#F6F3EC;box-shadow:var(--s2);animation:toastIn .22s ease;pointer-events:none}
  .toast-dot{width:7px;height:7px;border-radius:50%;background:var(--amb);flex-shrink:0}
`;

// ── SUPPLIER MODAL ─────────────────────────────────────────────────────────────
function SupplierModal({ open, onClose, onSelect, selected }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const lq = q.toLowerCase().trim();
    return lq
      ? SUPPLIERS.filter(s =>
          s.name.toLowerCase().includes(lq) ||
          s.code.toLowerCase().includes(lq) ||
          s.contactName.toLowerCase().includes(lq))
      : SUPPLIERS;
  }, [q]);

  if (!open) return null;

  return (
    <div className="spm-bd" onClick={onClose}>
      <div className="spm-modal" onClick={e => e.stopPropagation()}>
        <div className="spm-head">
          <div className="spm-head-l">
            <div className="spm-icon">🏭</div>
            <div><div className="spm-eyebrow">Procurement · Supplier</div><div className="spm-title">Select Supplier</div></div>
          </div>
          <button className="spm-close" onClick={onClose}>×</button>
        </div>
        <div className="spm-search-zone">
          <div className="spm-sw">
            <span className="spm-si">⌕</span>
            <input className="spm-sinp" placeholder="Search by name, code or contact…"
              value={q} onChange={e => setQ(e.target.value)} autoFocus />
            {q && <button className="spm-clr" onClick={() => setQ("")}>×</button>}
          </div>
        </div>
        <div className="spm-col-head">
          <div className="spm-cl">Supplier Name</div>
          <div className="spm-cl">Supplier No.</div>
          <div className="spm-cl">Email</div>
          <div className="spm-cl r">Phone</div>
        </div>
        <div className="spm-list">
          {filtered.length === 0 ? (
            <div className="spm-empty">
              <div className="spm-empty-ico">🔍</div>
              <div className="spm-empty-ttl">No suppliers found</div>
            </div>
          ) : (
            <>
              <div className="spm-div">Suppliers</div>
              {filtered.map((s, i) => {
                const [clr, bg] = avColor(s.id);
                const isSel = selected?.id === s.id;
                return (
                  <div key={s.id}
                    className={`spm-item${isSel ? " sel" : ""}${s.status === "inactive" ? " inactive" : ""}`}
                    style={{ animationDelay: `${i * 16}ms` }}
                    onClick={() => { onSelect(s); onClose(); }}>
                    <div className="spm-col-name">
                      <div className="spm-av" style={{ background: bg, border: `1.5px solid ${clr}25`, color: clr }}>{initials(s.name)}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className="spm-name">{highlight(s.name, q)}</div>
                        <div className="spm-tags">
                          {s.preferred && <span className="spm-pref">★ Preferred</span>}
                          <span className={`spm-dot${s.status === "active" ? " on" : ""}`} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="spm-code">{highlight(s.code, q)}</div>
                      <div className="spm-cat">{s.category}</div>
                    </div>
                    <div style={{ paddingRight: 10, minWidth: 0 }}>
                      <div className="spm-email">{s.email}</div>
                      <div className="spm-contact">{highlight(s.contactName, q)}</div>
                    </div>
                    <div>
                      <div className="spm-phone">{s.phone}</div>
                      <div className="spm-curr">{s.currency}</div>
                    </div>
                    {isSel && <div className="spm-check">✓</div>}
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className="spm-footer"><strong>{filtered.length}</strong> supplier{filtered.length !== 1 ? "s" : ""} shown</div>
      </div>
    </div>
  );
}

// ── MAIN DEBIT NOTE ────────────────────────────────────────────────────────────
export default function DebitNote() {
  const [debitNoteId] = useState(genDnId);
  const [issueDate]   = useState("Mar 16, 2026");
  const [taxRate,    setTaxRate]    = useState(8);
  const [dueDate,    setDueDate]    = useState("2026-03-31");
  const [note,       setNote]       = useState("Please process this debit note against the referenced GRN / invoice.");
  const [reason,     setReason]     = useState(REASON_OPTIONS[0]);
  const [customReason, setCustomReason] = useState("");

  // Supplier
  const [supplier,      setSupplier]      = useState(null);
  const [showSupModal,  setShowSupModal]  = useState(false);

  // GRN reference
  const [grnSearch,    setGrnSearch]    = useState("");
  const [showGrnDrop,  setShowGrnDrop]  = useState(false);
  const [linkedGrn,    setLinkedGrn]    = useState(null);

  // Line items
  const [lineItems, setLineItems] = useState([]);

  // Resolution method
  const [resolution, setResolution] = useState("credit-adjustment");

  // Modals
  const [showConfirm, setShowConfirm] = useState(false);
  const [issued,      setIssued]      = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const showToast = useCallback(msg => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  // GRN filter
  const filtGrn = MOCK_GRNS.filter(g =>
    g.id.toLowerCase().includes(grnSearch.toLowerCase()) ||
    g.supplier.name.toLowerCase().includes(grnSearch.toLowerCase())
  );

  const linkGrn = (grn) => {
    setLinkedGrn(grn);
    setSupplier(grn.supplier);
    setLineItems(grn.items.map((it, i) => ({
      id: uid(), description: it.name, sku: it.sku,
      unitPrice: it.unitPrice, qty: it.qty, unit: it.unit || "pcs",
      debitQty: it.qty, discount: 0, taxRate: taxRate, selected: true,
    })));
    setGrnSearch("");
    setShowGrnDrop(false);
  };

  const updateLine = (id, f, v) => setLineItems(prev => prev.map(l => l.id === id ? { ...l, [f]: v } : l));
  const toggleLine = (id) => setLineItems(prev => prev.map(l => l.id === id ? { ...l, selected: !l.selected } : l));
  const removeLine = (id) => setLineItems(prev => prev.filter(l => l.id !== id));
  const addBlankLine = () => setLineItems(prev => [...prev, {
    id: uid(), description: "", sku: "", unitPrice: "", qty: "", unit: "pcs",
    debitQty: "", discount: 0, taxRate: taxRate, selected: true,
  }]);

  const activeLines   = lineItems.filter(l => l.selected);
  const subtotal      = activeLines.reduce((s, l) => s + (parseFloat(l.unitPrice) || 0) * (parseFloat(l.debitQty) || 0), 0);
  const discTotal     = activeLines.reduce((s, l) => s + (parseFloat(l.unitPrice) || 0) * (parseFloat(l.debitQty) || 0) * (l.discount / 100), 0);
  const afterDisc     = subtotal - discTotal;
  const taxAmt        = afterDisc * (taxRate / 100);
  const debitTotal    = afterDisc + taxAmt;
  const totalDebitQty = activeLines.reduce((s, l) => s + (parseFloat(l.debitQty) || 0), 0);

  const RESOLUTION_METHODS = [
    { key: "credit-adjustment", label: "Credit Adjustment", icon: "📊", desc: "Offset against future invoices"    },
    { key: "refund",            label: "Cash Refund",       icon: "💵", desc: "Direct payment from supplier"      },
    { key: "replacement",       label: "Replacement",       icon: "📦", desc: "Supplier to resend goods"          },
    { key: "price-correction",  label: "Price Correction",  icon: "🧾", desc: "Correct the original invoice"      },
  ];

  const handleIssue   = () => { if (activeLines.length === 0 || !supplier) return; setShowConfirm(true); };
  const handleConfirm = () => { setShowConfirm(false); setIssued(true); };

  const checklist = [
    { label: "Supplier selected",    done: !!supplier                                     },
    { label: "GRN / ref linked",     done: !!linkedGrn                                    },
    { label: "Line items added",     done: activeLines.length > 0                         },
    { label: "Quantities entered",   done: activeLines.some(l => parseFloat(l.debitQty) > 0) },
    { label: "Reason specified",     done: !!reason                                       },
    { label: "Resolution selected",  done: !!resolution                                   },
    { label: "Due date set",         done: !!dueDate                                      },
  ];
  const checkDone = checklist.filter(c => c.done).length;

  const [clr, bg] = supplier ? avColor(supplier.id) : ["#B87820", "rgba(184,120,32,.12)"];

  return (
    <>
      <style>{CSS}</style>

      <SupplierModal open={showSupModal} onClose={() => setShowSupModal(false)}
        onSelect={s => setSupplier(s)} selected={supplier} />

      <div className="dn-page">
        {/* ── TOPBAR ── */}
        <header className="dn-tb">
          <div className="dn-tb-l">
            <div className="dn-brand">
              <div className="dn-bmark">N</div>
              <div><div className="dn-bname">Nexus POS</div><div className="dn-bsub">Debit Notes</div></div>
            </div>
            <div className="dn-bc">
              <span className="dn-bca">Dashboard</span><span className="dn-bcsep">›</span>
              <span className="dn-bca">Documents</span><span className="dn-bcsep">›</span>
              <span className="dn-bca">Debit Notes</span><span className="dn-bcsep">›</span>
              <span className="dn-bccur">New Debit Note</span>
            </div>
          </div>
          <div className="dn-tb-r">
            <button className="btn btn-gh">📋 History</button>
            <button className="btn btn-ol">Save Draft</button>
            <button className="btn btn-amb"
              disabled={activeLines.length === 0 || !supplier}
              onClick={handleIssue}>
              Issue Debit Note →
            </button>
            <div className="dn-av">AD</div>
          </div>
        </header>

        <div className="dn-body">

          {/* ══ LEFT ══ */}
          <div className="col-l">

            {/* Debit Note Details */}
            <div className="card" style={{ animationDelay: "0ms" }}>
              <div className="card-head">
                <div className="card-title"><div className="card-ico">📌</div>Debit Note Details</div>
              </div>
              <div className="card-body">
                <div className="fld">
                  <label className="lbl">Debit Note No. <span className="req">✦</span></label>
                  <input className="inp inp-ro mono" readOnly value={debitNoteId} style={{ fontWeight: 700, letterSpacing: ".5px" }} />
                </div>
                <div className="g2" style={{ marginBottom: 10 }}>
                  <div>
                    <label className="lbl">Issue Date</label>
                    <input className="inp" readOnly value={issueDate} style={{ fontSize: 11 }} />
                  </div>
                  <div>
                    <label className="lbl">Due Date</label>
                    <input type="date" className="inp mono" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                  </div>
                </div>
                <div className="fld">
                  <label className="lbl">Tax Rate (%)</label>
                  <input type="number" className="inp" min={0} max={30} step={0.5} value={taxRate}
                    onChange={e => setTaxRate(+e.target.value)} />
                </div>
              </div>
            </div>

            {/* Supplier */}
            <div className="card" style={{ animationDelay: "40ms" }}>
              <div className="card-head">
                <div className="card-title"><div className="card-ico">🏭</div>Supplier</div>
                {supplier && (
                  <button className="sup-change" style={{ width: "auto", padding: "4px 10px", marginTop: 0 }}
                    onClick={() => setShowSupModal(true)}>Change</button>
                )}
              </div>
              <div className="card-body">
                {!supplier ? (
                  <div className="sup-trigger" onClick={() => setShowSupModal(true)}>
                    <div className="sup-ico">🏭</div>
                    <div>
                      <div className="sup-trigger-txt">Select Supplier</div>
                      <div className="sup-trigger-sub">Click to choose from supplier list</div>
                    </div>
                  </div>
                ) : (
                  <div className="sup-pill">
                    <div className="sup-pill-top">
                      <div className="sup-av" style={{ background: bg, border: `1.5px solid ${clr}30`, color: clr }}>{initials(supplier.name)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="sup-name">{supplier.name}</div>
                        <div className="sup-tags">
                          {supplier.city && <span className="sup-tag">📍 {supplier.city}</span>}
                          {supplier.category && <span className="sup-tag">{supplier.category}</span>}
                          {supplier.preferred && <span style={{ fontSize: "8.5px", fontWeight: 800, padding: "2px 7px", borderRadius: 20, background: "var(--ambbg)", border: "1px solid var(--ambbr)", color: "var(--amb)" }}>★ Preferred</span>}
                        </div>
                      </div>
                    </div>
                    <div className="sup-dets">
                      {[["Code", supplier.code], ["Contact", supplier.contactName], ["Phone", supplier.phone], ["Email", supplier.email], ["Currency", supplier.currency], ["Country", supplier.country]].map(([l, v]) =>
                        v && v !== "—" ? (
                          <div key={l} className="sup-row">
                            <span className="sup-rl">{l}</span>
                            <span className="sup-rv">{v}</span>
                          </div>
                        ) : null
                      )}
                    </div>
                    <button className="sup-change" onClick={() => setShowSupModal(true)}>✎ Change Supplier</button>
                  </div>
                )}
              </div>
            </div>

            {/* Reference GRN */}
            <div className="card" style={{ animationDelay: "80ms" }}>
              <div className="card-head">
                <div className="card-title"><div className="card-ico">📦</div>Reference GRN</div>
              </div>
              <div className="card-body">
                {!linkedGrn ? (
                  <>
                    <div style={{ position: "relative" }}>
                      <div className="sbox">
                        <span className="sico">⌕</span>
                        <input className="sinp" placeholder="Search GRN or supplier…" value={grnSearch}
                          onChange={e => { setGrnSearch(e.target.value); setShowGrnDrop(true); }}
                          onFocus={() => setShowGrnDrop(true)}
                          onBlur={() => setTimeout(() => setShowGrnDrop(false), 160)} />
                      </div>
                      {showGrnDrop && filtGrn.length > 0 && (
                        <div className="drop">
                          {filtGrn.map(g => (
                            <div className="ditem" key={g.id} onMouseDown={() => linkGrn(g)}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span className="dn-pill">{g.id}</span>
                                <span style={{ fontSize: 11, color: "var(--ink40)" }}>· {g.supplier.name}</span>
                              </div>
                              <div className="dn-meta">{g.date} · ${fmt(g.total)} · {g.items.length} items</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: 8, padding: "10px 12px", background: "var(--warm)", border: "1px dashed var(--ink10)", borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--ink20)", marginBottom: 3 }}>No GRN linked</div>
                      <div style={{ fontSize: 10.5, color: "var(--ink40)" }}>Link a GRN to auto-populate items</div>
                    </div>
                  </>
                ) : (
                  <div className="grn-pill">
                    <div className="grn-pill-ico">📦</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="grn-pill-id">{linkedGrn.id}</div>
                      <div className="grn-pill-meta">
                        {linkedGrn.supplier.name}<br />
                        {linkedGrn.date} · ${fmt(linkedGrn.total)}
                      </div>
                    </div>
                    <button className="unlink"
                      onClick={() => { setLinkedGrn(null); setLineItems([]); setSupplier(null); }}>×</button>
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="card" style={{ animationDelay: "120ms" }}>
              <div className="card-head">
                <div className="card-title"><div className="card-ico">📋</div>Reason</div>
              </div>
              <div className="card-body">
                <div className="fld">
                  <label className="lbl">Reason Category <span className="req">✦</span></label>
                  <div className="sel-wrap">
                    <select className="sel" value={reason} onChange={e => setReason(e.target.value)}>
                      {REASON_OPTIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                {reason === "Other" && (
                  <div className="fld">
                    <label className="lbl">Describe</label>
                    <input className="inp" placeholder="Describe the reason…" value={customReason}
                      onChange={e => setCustomReason(e.target.value)} />
                  </div>
                )}
                <div className="fld">
                  <label className="lbl">Notes to Supplier</label>
                  <textarea className="nota" rows={3} value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Explanation for supplier…" />
                </div>
              </div>
            </div>
          </div>

          {/* ══ MIDDLE ══ */}
          <div className="col-m">
            <div className="mcard">
              <div className="mhead">
                <div>
                  <div className="mtitle">Debit Line Items</div>
                  <div className="msub">
                    {linkedGrn
                      ? `From ${linkedGrn.id} · uncheck items not being debited`
                      : "Link a GRN above or add lines manually"}
                  </div>
                </div>
                {activeLines.length > 0 && (
                  <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11.5, color: "var(--ambl)", background: "rgba(184,120,32,.12)", border: "1px solid rgba(184,120,32,.3)", borderRadius: 5, padding: "4px 10px" }}>
                    {activeLines.length} of {lineItems.length} active
                  </div>
                )}
              </div>

              {lineItems.length === 0 ? (
                <div className="tempty">
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔗</div>
                  Link a reference GRN or add lines manually
                </div>
              ) : (
                <>
                  <div className="thead">
                    <span className="th">✓</span>
                    <span className="th">Description</span>
                    <span className="th">SKU</span>
                    <span className="th r">Orig. Qty</span>
                    <span className="th r">Debit Qty</span>
                    <span className="th r">Unit Price</span>
                    <span className="th r">Tax %</span>
                    <span className="th r">Debit Amt</span>
                    <span></span>
                  </div>
                  {lineItems.map((item, i) => {
                    const debitAmt = (parseFloat(item.unitPrice) || 0) * (parseFloat(item.debitQty) || 0);
                    return (
                      <div className={`trow`} key={item.id}
                        style={{ animationDelay: `${i * 22}ms`, opacity: item.selected ? 1 : 0.4 }}>
                        <input type="checkbox" style={{ width: 15, height: 15, accentColor: "var(--amb)", cursor: "pointer" }}
                          checked={item.selected} onChange={() => toggleLine(item.id)} />
                        <input className="tinp" placeholder="Description…" value={item.description}
                          disabled={!item.selected}
                          onChange={e => updateLine(item.id, "description", e.target.value)} />
                        <input className="tinp mono" placeholder="SKU" value={item.sku}
                          disabled={!item.selected}
                          onChange={e => updateLine(item.id, "sku", e.target.value)} />
                        <div style={{ textAlign: "right", fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--ink20)", paddingRight: 4 }}>
                          {item.qty || "—"}
                        </div>
                        <input className="tinp mono num" type="number" min={1} max={item.qty || undefined}
                          value={item.debitQty}
                          disabled={!item.selected}
                          onChange={e => updateLine(item.id, "debitQty", Math.max(1, +e.target.value))} />
                        <input className="tinp mono num" type="number" min={0} step={0.01}
                          value={item.unitPrice}
                          disabled={!item.selected}
                          onChange={e => updateLine(item.id, "unitPrice", e.target.value)} />
                        <input className="tinp mono num" type="number" min={0} max={100} step={0.5}
                          value={item.taxRate}
                          disabled={!item.selected}
                          onChange={e => updateLine(item.id, "taxRate", +e.target.value)} />
                        <div style={{ textAlign: "right", paddingRight: 4 }}>
                          <span className="tamt" style={{ color: item.selected ? "var(--amb)" : "var(--ink20)" }}>
                            ${fmt(debitAmt)}
                          </span>
                        </div>
                        <button className="tdel" onClick={() => removeLine(item.id)}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </>
              )}

              <div className="add-row">
                <button className="add-btn" onClick={addBlankLine}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Line
                </button>
                {!linkedGrn && (
                  <button className="add-grn-btn" onClick={() => setShowGrnDrop(true)}>
                    📦 Link GRN
                  </button>
                )}
              </div>

              <div className="tbar">
                <div className="tgrid">
                  <div className="ti">
                    <div className="tlbl">Active Lines</div>
                    <div className="tval">{activeLines.length}</div>
                  </div>
                  <div className="ti">
                    <div className="tlbl">Debit Units</div>
                    <div className="tval">{fmt(totalDebitQty)}</div>
                  </div>
                  <div className="ti">
                    <div className="tlbl">Tax ({taxRate}%)</div>
                    <div className="tval">${fmt(taxAmt)}</div>
                  </div>
                  <div className="tdiv" />
                  <div className="ti tgrand">
                    <div className="tlbl">Debit Total</div>
                    <div className="tval">${fmt(debitTotal)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="card" style={{ animationDelay: "60ms" }}>
              <div className="card-head">
                <div className="card-title"><div className="card-ico">✔</div>Completion Checklist</div>
                <span style={{ fontSize: 10, fontWeight: 700, color: checkDone === checklist.length ? "var(--green)" : "var(--ink40)", fontFamily: "'Geist Mono',monospace" }}>
                  {checkDone}/{checklist.length}
                </span>
              </div>
              <div className="card-body" style={{ padding: "12px 14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 16px", marginBottom: 12 }}>
                  {checklist.map(c => (
                    <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", fontSize: 11 }}>
                      <div style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, background: c.done ? "var(--greenbg)" : "var(--ink06)", border: `1.5px solid ${c.done ? "var(--greenbr)" : "var(--ink10)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: c.done ? "var(--green)" : "transparent", transition: "all .2s" }}>✓</div>
                      <span style={{ color: c.done ? "var(--ink70)" : "var(--ink30)", fontWeight: c.done ? 600 : 400 }}>{c.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 4, borderRadius: 4, background: "var(--ink10)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(checkDone / checklist.length) * 100}%`, background: checkDone === checklist.length ? "var(--green)" : "var(--amb)", borderRadius: 4, transition: "width .4s ease" }} />
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="col-r">
            <div className="rcard">
              <div className="rhead">
                <div className="rsub">Supplier Debit · Adjustments</div>
                <div className="rtitle">Debit Summary</div>
              </div>
              <div className="rbody">

                {/* Resolution Method */}
                <div>
                  <div className="sec">Resolution Method</div>
                  <div className="res-grid">
                    {RESOLUTION_METHODS.map(m => (
                      <button key={m.key}
                        className={`res-card${resolution === m.key ? " active" : ""}`}
                        onClick={() => setResolution(m.key)}>
                        <div className="res-ico">{m.icon}</div>
                        <span className="res-lbl">{m.label}</span>
                        <span className="res-desc">{m.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <div className="sec">Debit Breakdown</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    <div style={{ background: "var(--warm)", border: "1px solid var(--ink10)", borderRadius: 7, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--ink40)", marginBottom: 4 }}>Lines</div>
                      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>{activeLines.length}</div>
                      <div style={{ fontSize: 10.5, color: "var(--ink40)", marginTop: 2 }}>{fmt(totalDebitQty)} units</div>
                    </div>
                    <div style={{ background: "var(--ambbg)", border: "1px solid var(--ambbr)", borderRadius: 7, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--amb)", marginBottom: 4 }}>Debit</div>
                      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 20, fontWeight: 600, color: "var(--amb)" }}>${fmt(debitTotal)}</div>
                      <div style={{ fontSize: 10.5, color: "var(--amb)", opacity: .7, marginTop: 2 }}>to be raised</div>
                    </div>
                  </div>

                  <div className="srow">
                    <span className="slbl">Subtotal</span>
                    <span className="sval">${fmt(subtotal)}</span>
                  </div>
                  {discTotal > 0 && (
                    <div className="srow">
                      <span className="slbl">Adjustments</span>
                      <span className="sval" style={{ color: "var(--green)" }}>−${fmt(discTotal)}</span>
                    </div>
                  )}
                  <div className="srow amb">
                    <span className="slbl">Tax ({taxRate}%)</span>
                    <span className="sval">${fmt(taxAmt)}</span>
                  </div>
                  <div className="shr" />
                  <div className="stot">
                    <span className="stlbl">Debit Total</span>
                    <span className="stval">${fmt(debitTotal)}</span>
                  </div>
                </div>

                {/* Details card */}
                <div>
                  <div className="sec">Note Details</div>
                  <div style={{ background: "var(--warm)", border: "1px solid var(--ink10)", borderRadius: 7, padding: "10px 12px" }}>
                    <div className="srow" style={{ padding: "2px 0" }}>
                      <span className="slbl">Debit Note</span>
                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--amb)", fontWeight: 700 }}>{debitNoteId}</span>
                    </div>
                    {linkedGrn && (
                      <div className="srow" style={{ padding: "2px 0" }}>
                        <span className="slbl">Reference GRN</span>
                        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--ink70)", fontWeight: 600 }}>{linkedGrn.id}</span>
                      </div>
                    )}
                    <div className="srow" style={{ padding: "2px 0" }}>
                      <span className="slbl">Due Date</span>
                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--ink70)", fontWeight: 600 }}>{dueDate}</span>
                    </div>
                    <div className="srow" style={{ padding: "2px 0" }}>
                      <span className="slbl">Reason</span>
                      <span className="sval" style={{ fontSize: 10.5, color: "var(--ink)", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, textAlign: "right", maxWidth: 160 }}>
                        {reason === "Other" ? (customReason || "Other") : reason}
                      </span>
                    </div>
                    <div className="srow" style={{ padding: "2px 0" }}>
                      <span className="slbl">Resolution</span>
                      <span className="sval" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
                        {RESOLUTION_METHODS.find(m => m.key === resolution)?.label}
                      </span>
                    </div>
                    {supplier && (
                      <div className="srow" style={{ padding: "2px 0" }}>
                        <span className="slbl">Supplier</span>
                        <span className="sval" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{supplier.name.split(" ").slice(0, 3).join(" ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ flex: 1 }} />

                <button className="issue-btn"
                  disabled={activeLines.length === 0 || !supplier}
                  onClick={handleIssue}>
                  📌 Issue Debit Note →
                </button>
                <button className="draft-btn" onClick={() => showToast("✦ Draft saved")}>Save as Draft</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTION BAR ── */}
      <div className="action-bar">
        <div className="ainfo">
          <span>DN · <strong>{debitNoteId}</strong></span>
          {supplier && <span>Supplier: <strong>{supplier.name.split(" ").slice(0, 2).join(" ")}</strong></span>}
          <span>Total: <strong>LKR {fmt(debitTotal)}</strong></span>
          <span style={{ color: checkDone === checklist.length ? "var(--green)" : "inherit" }}>
            Checklist: <strong>{checkDone}/{checklist.length}</strong>
          </span>
        </div>
        <div className="abtns">
          <button className="btn btn-ol" onClick={() => showToast("✦ Draft saved")}>
            💾 Save Draft
          </button>
          <button className="btn btn-ol" onClick={() => showToast("🖨 Print preview opened")}>
            🖨 Print
          </button>
          <button className="btn btn-amb"
            disabled={activeLines.length === 0 || !supplier}
            onClick={handleIssue}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Issue Debit Note
          </button>
        </div>
      </div>

      {/* ── CONFIRM MODAL ── */}
      {showConfirm && (
        <div className="cm-bd" onClick={() => setShowConfirm(false)}>
          <div className="cm-modal" onClick={e => e.stopPropagation()}>
            <div className="cm-head">
              <div>
                <div className="cm-eyebrow">Confirm Issuance</div>
                <div className="cm-title">Issue Debit Note</div>
              </div>
              <button className="cm-close" onClick={() => setShowConfirm(false)}>×</button>
            </div>
            <div className="cm-body">
              <div className="cm-badge">{debitNoteId}</div>
              {supplier && (
                <div className="cm-row"><span className="cm-lbl">Supplier</span><span className="cm-val">{supplier.name}</span></div>
              )}
              {linkedGrn && (
                <div className="cm-row">
                  <span className="cm-lbl">Reference GRN</span>
                  <span className="cm-val" style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12 }}>{linkedGrn.id}</span>
                </div>
              )}
              <div className="cm-row"><span className="cm-lbl">Debit Lines</span><span className="cm-val">{activeLines.length} items ({fmt(totalDebitQty)} units)</span></div>
              <div className="cm-row"><span className="cm-lbl">Reason</span><span className="cm-val" style={{ maxWidth: 220, textAlign: "right", fontSize: 12 }}>{reason === "Other" ? (customReason || "Other") : reason}</span></div>
              <div className="cm-row"><span className="cm-lbl">Resolution</span><span className="cm-val">{RESOLUTION_METHODS.find(m => m.key === resolution)?.label}</span></div>
              <div className="cm-row"><span className="cm-lbl">Due Date</span><span className="cm-val" style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12 }}>{dueDate}</span></div>
              <div className="cm-hr" />
              <div className="cm-row"><span className="cm-lbl">Subtotal</span><span className="cm-val" style={{ fontFamily: "'Geist Mono',monospace" }}>${fmt(subtotal)}</span></div>
              <div className="cm-row"><span className="cm-lbl">Tax ({taxRate}%)</span><span className="cm-val" style={{ fontFamily: "'Geist Mono',monospace" }}>${fmt(taxAmt)}</span></div>
              <div className="cm-total">
                <span className="cm-total-lbl">Debit Total</span>
                <span className="cm-total-val">${fmt(debitTotal)}</span>
              </div>
              <div className="cm-note">
                <span style={{ fontSize: 16 }}>{RESOLUTION_METHODS.find(m => m.key === resolution)?.icon}</span>
                <span>{RESOLUTION_METHODS.find(m => m.key === resolution)?.desc} — ${fmt(debitTotal)} will be raised against this supplier.</span>
              </div>
              <div className="cm-actions">
                <button className="cm-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button className="cm-confirm" onClick={handleConfirm}>Confirm & Issue →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ISSUED STATE ── */}
      {issued && (
        <div className="issued-bd">
          <div className="issued-card">
            <div className="issued-ico">📌</div>
            <div className="issued-eyebrow">Debit Note Issued</div>
            <div className="issued-title">Debit Note Raised</div>
            <div className="issued-sub">The debit has been recorded and the supplier has been notified.</div>
            <div className="issued-cn">{debitNoteId}</div>
            <div className="issued-dets">
              {supplier && (
                <div className="issued-row">
                  <span className="issued-rl">Supplier</span>
                  <span className="issued-rv">{supplier.name}</span>
                </div>
              )}
              {linkedGrn && (
                <div className="issued-row">
                  <span className="issued-rl">Reference GRN</span>
                  <span className="issued-rv" style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11 }}>{linkedGrn.id}</span>
                </div>
              )}
              <div className="issued-row">
                <span className="issued-rl">Resolution</span>
                <span className="issued-rv">{RESOLUTION_METHODS.find(m => m.key === resolution)?.label}</span>
              </div>
              <div className="issued-row">
                <span className="issued-rl">Debit lines</span>
                <span className="issued-rv">{activeLines.length} items · {fmt(totalDebitQty)} units</span>
              </div>
              <div className="issued-row">
                <span className="issued-rl">Due Date</span>
                <span className="issued-rv" style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11 }}>{dueDate}</span>
              </div>
              <div style={{ height: 1, background: "var(--ink10)", margin: "8px 0" }} />
              <div className="issued-row">
                <span className="issued-rl" style={{ fontWeight: 700, color: "var(--ink)" }}>Debit Total</span>
                <span className="issued-tot">${fmt(debitTotal)}</span>
              </div>
            </div>
            <div className="issued-btns">
              <button className="btn-outline-amb"
                onClick={() => { setIssued(false); }}>
                + New Debit Note
              </button>
              <button className="btn-primary-amb" onClick={() => showToast("🖨 Print preview opened")}>
                🖨 Print / Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="toast">
          <div className="toast-dot" />
          {toast}
        </div>
      )}
    </>
  );
}