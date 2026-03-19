import { useState, useMemo, useEffect } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PO_DATA = [
  { id:1,  poNo:"PO-2026-031", supplier:"TechSource Lanka Pvt Ltd",    supplierCode:"SUP-001", supplierCity:"Colombo",   supplierEmail:"mahesh@techsource.lk",    status:"approved", priority:"Normal",       total:4820.00, items:6,  poDate:"2026-03-14", deliveryDate:"2026-03-28", paymentTerms:"Net 30", currency:"LKR", deliveryLocation:"Main Warehouse – Colombo", reference:"QUO-2026-041", receivedQty:0,  tags:["electronics","preferred"] },
  { id:2,  poNo:"PO-2026-030", supplier:"Ceylon Wholesale Distributors",supplierCode:"SUP-002", supplierCity:"Kandy",     supplierEmail:"pradeep@cwd.lk",           status:"sent",     priority:"Urgent",       total:9350.50, items:11, poDate:"2026-03-13", deliveryDate:"2026-03-20", paymentTerms:"Net 45", currency:"LKR", deliveryLocation:"Branch Store – Kandy",     reference:"",              receivedQty:0,  tags:["wholesale","urgent"] },
  { id:3,  poNo:"PO-2026-029", supplier:"Nexgen IT Solutions",         supplierCode:"SUP-003", supplierCity:"Nugegoda",  supplierEmail:"sampath@nexgen.lk",        status:"received", priority:"Normal",       total:2240.00, items:4,  poDate:"2026-03-10", deliveryDate:"2026-03-17", paymentTerms:"Net 15", currency:"LKR", deliveryLocation:"Main Warehouse – Colombo", reference:"QUO-2026-037", receivedQty:4,  tags:["it","preferred"] },
  { id:4,  poNo:"PO-2026-028", supplier:"Island Apparel Suppliers",    supplierCode:"SUP-004", supplierCity:"Negombo",   supplierEmail:"kumari@islandapp.lk",      status:"partial",  priority:"Normal",       total:6180.75, items:8,  poDate:"2026-03-08", deliveryDate:"2026-03-18", paymentTerms:"Net 60", currency:"LKR", deliveryLocation:"Negombo Outlet",           reference:"QUO-2026-040", receivedQty:5,  tags:["apparel"] },
  { id:5,  poNo:"PO-2026-027", supplier:"Global Stationery Corp",      supplierCode:"SUP-005", supplierCity:"Colombo 3", supplierEmail:"nalin@globalstat.lk",      status:"draft",    priority:"Low Priority", total:870.25,  items:3,  poDate:"2026-03-07", deliveryDate:"2026-03-21", paymentTerms:"Net 30", currency:"LKR", deliveryLocation:"Main Warehouse – Colombo", reference:"",              receivedQty:0,  tags:["stationery"] },
  { id:6,  poNo:"PO-2026-026", supplier:"TechSource Lanka Pvt Ltd",    supplierCode:"SUP-001", supplierCity:"Colombo",   supplierEmail:"mahesh@techsource.lk",    status:"cancelled",priority:"Urgent",       total:3100.00, items:5,  poDate:"2026-03-05", deliveryDate:"2026-03-12", paymentTerms:"Net 30", currency:"LKR", deliveryLocation:"Main Warehouse – Colombo", reference:"QUO-2026-036", receivedQty:0,  tags:["electronics"] },
  { id:7,  poNo:"PO-2026-025", supplier:"Premier Home & Living",       supplierCode:"SUP-006", supplierCity:"Gampaha",   supplierEmail:"dilani@premhome.lk",       status:"received", priority:"Normal",       total:1540.00, items:7,  poDate:"2026-03-01", deliveryDate:"2026-03-08", paymentTerms:"Net 30", currency:"LKR", deliveryLocation:"Main Warehouse – Colombo", reference:"",              receivedQty:7,  tags:["home"] },
  { id:8,  poNo:"PO-2026-024", supplier:"Nexgen IT Solutions",         supplierCode:"SUP-003", supplierCity:"Nugegoda",  supplierEmail:"sampath@nexgen.lk",        status:"approved", priority:"Normal",       total:5620.00, items:9,  poDate:"2026-02-28", deliveryDate:"2026-03-14", paymentTerms:"Net 15", currency:"LKR", deliveryLocation:"Main Warehouse – Colombo", reference:"QUO-2026-030", receivedQty:0,  tags:["it","preferred"] },
  { id:9,  poNo:"PO-2026-023", supplier:"Ceylon Wholesale Distributors",supplierCode:"SUP-002", supplierCity:"Kandy",    supplierEmail:"pradeep@cwd.lk",           status:"sent",     priority:"Normal",       total:7200.00, items:12, poDate:"2026-02-25", deliveryDate:"2026-03-10", paymentTerms:"Net 45", currency:"LKR", deliveryLocation:"Branch Store – Kandy",     reference:"",              receivedQty:0,  tags:["wholesale"] },
  { id:10, poNo:"PO-2026-022", supplier:"Island Apparel Suppliers",    supplierCode:"SUP-004", supplierCity:"Negombo",   supplierEmail:"kumari@islandapp.lk",      status:"received", priority:"Urgent",       total:4390.50, items:6,  poDate:"2026-02-20", deliveryDate:"2026-02-27", paymentTerms:"Net 60", currency:"LKR", deliveryLocation:"Negombo Outlet",           reference:"QUO-2026-025", receivedQty:6,  tags:["apparel","urgent"] },
  { id:11, poNo:"PO-2026-021", supplier:"Global Stationery Corp",      supplierCode:"SUP-005", supplierCity:"Colombo 3", supplierEmail:"nalin@globalstat.lk",      status:"partial",  priority:"Normal",       total:1125.00, items:5,  poDate:"2026-02-18", deliveryDate:"2026-02-25", paymentTerms:"Net 30", currency:"LKR", deliveryLocation:"Main Warehouse – Colombo", reference:"",              receivedQty:3,  tags:["stationery"] },
  { id:12, poNo:"PO-2026-020", supplier:"TechSource Lanka Pvt Ltd",    supplierCode:"SUP-001", supplierCity:"Colombo",   supplierEmail:"mahesh@techsource.lk",    status:"received", priority:"Normal",       total:8940.00, items:10, poDate:"2026-02-14", deliveryDate:"2026-02-21", paymentTerms:"Net 30", currency:"LKR", deliveryLocation:"Main Warehouse – Colombo", reference:"QUO-2026-020", receivedQty:10, tags:["electronics","preferred"] },
];

// ─── MOCK LINE ITEMS per PO ───────────────────────────────────────────────────
const PO_LINE_ITEMS = {
  1:  [
    { id:1, icon:"🎧", name:"Wireless Earbuds Pro",      sku:"WEP-221", qty:10, unit:"pcs", unitPrice:320.00, discount:5,  taxRate:18, received:0  },
    { id:2, icon:"🔌", name:"USB-C Hub 7-in-1",          sku:"UCH-880", qty:8,  unit:"pcs", unitPrice:280.00, discount:0,  taxRate:18, received:0  },
    { id:3, icon:"🔋", name:"Portable Charger 20000mAh", sku:"PCH-392", qty:15, unit:"pcs", unitPrice:290.00, discount:3,  taxRate:18, received:0  },
    { id:4, icon:"⌨",  name:"Mechanical Keyboard TKL",   sku:"MKT-509", qty:5,  unit:"pcs", unitPrice:560.00, discount:0,  taxRate:18, received:0  },
    { id:5, icon:"📱", name:"Phone Case iPhone 15",       sku:"PCI-556", qty:20, unit:"pcs", unitPrice:72.00,  discount:0,  taxRate:5,  received:0  },
    { id:6, icon:"📓", name:"Notebook A5 Grid",           sku:"NAG-007", qty:30, unit:"pcs", unitPrice:38.00,  discount:0,  taxRate:0,  received:0  },
  ],
  2:  [
    { id:1, icon:"👕", name:"Cotton Crew T-Shirt",        sku:"CCT-089", qty:60, unit:"pcs", unitPrice:95.00,  discount:10, taxRate:5,  received:0  },
    { id:2, icon:"👜", name:"Leather Wallet Slim",         sku:"LWS-441", qty:25, unit:"pcs", unitPrice:145.00, discount:5,  taxRate:5,  received:0  },
    { id:3, icon:"🧦", name:"Running Socks 3-Pack",        sku:"RSS-062", qty:80, unit:"pcs", unitPrice:62.00,  discount:0,  taxRate:5,  received:0  },
    { id:4, icon:"🧘", name:"Yoga Mat Pro",                sku:"YMP-203", qty:20, unit:"pcs", unitPrice:210.00, discount:8,  taxRate:5,  received:0  },
  ],
  3:  [
    { id:1, icon:"🔌", name:"USB-C Hub 7-in-1",          sku:"UCH-880", qty:6,  unit:"pcs", unitPrice:280.00, discount:5,  taxRate:18, received:6  },
    { id:2, icon:"⌨",  name:"Mechanical Keyboard TKL",   sku:"MKT-509", qty:4,  unit:"pcs", unitPrice:560.00, discount:0,  taxRate:18, received:4  },
    { id:3, icon:"🔋", name:"Portable Charger 20000mAh", sku:"PCH-392", qty:10, unit:"pcs", unitPrice:290.00, discount:5,  taxRate:18, received:10 },
    { id:4, icon:"🎧", name:"Wireless Earbuds Pro",      sku:"WEP-221", qty:8,  unit:"pcs", unitPrice:320.00, discount:0,  taxRate:18, received:8  },
  ],
  4:  [
    { id:1, icon:"👕", name:"Cotton Crew T-Shirt",        sku:"CCT-089", qty:40, unit:"pcs", unitPrice:95.00,  discount:10, taxRate:5,  received:25 },
    { id:2, icon:"👜", name:"Leather Wallet Slim",         sku:"LWS-441", qty:20, unit:"pcs", unitPrice:145.00, discount:5,  taxRate:5,  received:15 },
    { id:3, icon:"🧘", name:"Yoga Mat Pro",                sku:"YMP-203", qty:15, unit:"pcs", unitPrice:210.00, discount:0,  taxRate:5,  received:10 },
    { id:4, icon:"🕯", name:"Scented Candle Set",          sku:"SCS-112", qty:30, unit:"pcs", unitPrice:88.00,  discount:0,  taxRate:5,  received:0  },
  ],
  5:  [
    { id:1, icon:"📓", name:"Notebook A5 Grid",  sku:"NAG-007", qty:50, unit:"pcs", unitPrice:38.00, discount:0, taxRate:0, received:0 },
    { id:2, icon:"🖊", name:"Ballpoint Pen Pack",sku:"BPP-021", qty:20, unit:"box", unitPrice:55.00, discount:5, taxRate:0, received:0 },
    { id:3, icon:"📎", name:"Binder Clips Set",  sku:"BCS-044", qty:15, unit:"box", unitPrice:32.00, discount:0, taxRate:0, received:0 },
  ],
  6:  [
    { id:1, icon:"🎧", name:"Wireless Earbuds Pro",      sku:"WEP-221", qty:12, unit:"pcs", unitPrice:320.00, discount:0, taxRate:18, received:0 },
    { id:2, icon:"🔋", name:"Portable Charger 20000mAh", sku:"PCH-392", qty:8,  unit:"pcs", unitPrice:290.00, discount:0, taxRate:18, received:0 },
    { id:3, icon:"⌨",  name:"Mechanical Keyboard TKL",   sku:"MKT-509", qty:4,  unit:"pcs", unitPrice:560.00, discount:5, taxRate:18, received:0 },
  ],
  7:  [
    { id:1, icon:"🕯", name:"Scented Candle Set",    sku:"SCS-112", qty:20, unit:"pcs", unitPrice:88.00,  discount:0,  taxRate:5,  received:20 },
    { id:2, icon:"☕", name:"Ceramic Coffee Mug",    sku:"CCM-445", qty:30, unit:"pcs", unitPrice:62.00,  discount:5,  taxRate:5,  received:30 },
    { id:3, icon:"🛋", name:"Linen Throw Blanket",   sku:"LTB-883", qty:10, unit:"pcs", unitPrice:185.00, discount:0,  taxRate:5,  received:10 },
    { id:4, icon:"🍶", name:"Stainless Water Bottle",sku:"SWB-330", qty:25, unit:"pcs", unitPrice:95.00,  discount:8,  taxRate:5,  received:25 },
  ],
  8:  [
    { id:1, icon:"🔌", name:"USB-C Hub 7-in-1",          sku:"UCH-880", qty:10, unit:"pcs", unitPrice:280.00, discount:0,  taxRate:18, received:0 },
    { id:2, icon:"🎧", name:"Wireless Earbuds Pro",      sku:"WEP-221", qty:15, unit:"pcs", unitPrice:320.00, discount:5,  taxRate:18, received:0 },
    { id:3, icon:"🔋", name:"Portable Charger 20000mAh", sku:"PCH-392", qty:12, unit:"pcs", unitPrice:290.00, discount:3,  taxRate:18, received:0 },
    { id:4, icon:"📱", name:"Phone Case iPhone 15",       sku:"PCI-556", qty:30, unit:"pcs", unitPrice:72.00,  discount:0,  taxRate:5,  received:0 },
  ],
};

const getLineItems = po => PO_LINE_ITEMS[po.id] || [
  { id:1, icon:"📦", name:"General Items", sku:"GEN-001", qty: po.items, unit:"pcs", unitPrice: po.total / (po.items || 1), discount:0, taxRate:5, received: po.receivedQty },
];

const PO_TIMELINE = {
  1:  [
    { event:"PO Created",        user:"Kasun Fernando",  date:"2026-03-14", time:"09:15 AM", type:"create"  },
    { event:"Sent to Supplier",  user:"Kasun Fernando",  date:"2026-03-14", time:"10:30 AM", type:"send"    },
    { event:"PO Approved",       user:"Manager Perera",  date:"2026-03-14", time:"02:45 PM", type:"approve" },
  ],
  2:  [
    { event:"PO Created",        user:"Dilhara Silva",   date:"2026-03-13", time:"11:00 AM", type:"create"  },
    { event:"Sent to Supplier",  user:"Dilhara Silva",   date:"2026-03-13", time:"03:20 PM", type:"send"    },
  ],
  3:  [
    { event:"PO Created",        user:"Kasun Fernando",  date:"2026-03-10", time:"08:45 AM", type:"create"  },
    { event:"Sent to Supplier",  user:"Kasun Fernando",  date:"2026-03-10", time:"09:00 AM", type:"send"    },
    { event:"PO Approved",       user:"Manager Perera",  date:"2026-03-10", time:"11:30 AM", type:"approve" },
    { event:"GRN Created",       user:"Ruwan Bandara",   date:"2026-03-17", time:"02:00 PM", type:"grn"     },
    { event:"Fully Received",    user:"Ruwan Bandara",   date:"2026-03-17", time:"04:15 PM", type:"receive" },
  ],
  4:  [
    { event:"PO Created",        user:"Amara Perera",    date:"2026-03-08", time:"10:00 AM", type:"create"  },
    { event:"Sent to Supplier",  user:"Amara Perera",    date:"2026-03-08", time:"02:00 PM", type:"send"    },
    { event:"PO Approved",       user:"Manager Perera",  date:"2026-03-09", time:"09:00 AM", type:"approve" },
    { event:"Partial GRN",       user:"Kasun Fernando",  date:"2026-03-18", time:"03:00 PM", type:"grn"     },
  ],
};

const getTimeline = po => PO_TIMELINE[po.id] || [
  { event:"PO Created", user:"System", date: po.poDate, time:"09:00 AM", type:"create" },
];

const TIMELINE_COLORS = {
  create:  { color:"#9E9080", bg:"rgba(158,144,128,.12)", icon:"✦" },
  send:    { color:"#2B5490", bg:"rgba(43,84,144,.12)",   icon:"→" },
  approve: { color:"#B8902A", bg:"rgba(184,144,42,.12)",  icon:"✓" },
  grn:     { color:"#7A5C1E", bg:"rgba(122,92,30,.12)",   icon:"📦" },
  receive: { color:"#2D6A4F", bg:"rgba(45,106,79,.12)",   icon:"✔" },
  cancel:  { color:"#B5372A", bg:"rgba(181,55,42,.12)",   icon:"✕" },
};

const STATUS_META = {
  draft:     { color:"#9E9080", bg:"rgba(158,144,128,.1)",  border:"rgba(158,144,128,.28)", label:"Draft",     dot:"#9E9080"  },
  sent:      { color:"#2B5490", bg:"rgba(43,84,144,.08)",   border:"rgba(43,84,144,.28)",   label:"Sent",      dot:"#2B5490"  },
  approved:  { color:"#B8902A", bg:"rgba(184,144,42,.08)",  border:"rgba(184,144,42,.28)",  label:"Approved",  dot:"#B8902A"  },
  partial:   { color:"#7A5C1E", bg:"rgba(122,92,30,.08)",   border:"rgba(122,92,30,.25)",   label:"Partial",   dot:"#B8902A"  },
  received:  { color:"#2D6A4F", bg:"rgba(45,106,79,.08)",   border:"rgba(45,106,79,.28)",   label:"Received",  dot:"#3D8A65"  },
  cancelled: { color:"#B5372A", bg:"rgba(181,55,42,.08)",   border:"rgba(181,55,42,.25)",   label:"Cancelled", dot:"#B5372A"  },
};

const PRIORITY_META = {
  "Normal":       { color:"#9E9080", bg:"transparent",              border:"transparent"            },
  "Urgent":       { color:"#B5372A", bg:"rgba(181,55,42,.08)",      border:"rgba(181,55,42,.22)"    },
  "Low Priority": { color:"#6B5F54", bg:"transparent",              border:"transparent"            },
};

const AV_COLORS = [
  ["#9E9080","rgba(158,144,128,.15)"],["#2B5490","rgba(43,84,144,.15)"],
  ["#5B3D8F","rgba(91,61,143,.15)"], ["#2D6A4F","rgba(45,106,79,.15)"],
  ["#B8902A","rgba(184,144,42,.15)"],["#B5372A","rgba(181,55,42,.15)"],
  ["#7A5C1E","rgba(122,92,30,.15)"], ["#8A3A6A","rgba(138,58,106,.15)"],
  ["#1B6B8A","rgba(27,107,138,.15)"],
];

const avColor  = name => AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];
const initials = name => name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const fmt      = n    => Number(n||0).toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2});

const STATUS_FILTERS = ["all","draft","sent","approved","partial","received","cancelled"];

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --cream:#F6F3EC;--paper:#FDFBF7;--warm:#EEE9DF;--warm2:#E4DDD2;
  --ink:#1B1713;--ink70:#4B4038;--ink50:#6B5F54;--ink40:#9E9080;
  --ink20:#C9C0B2;--ink10:#E4DDD2;--ink06:#EDE8E0;--ink03:#F5F1EB;
  --gold:#B8902A;--goldl:#D4A83C;--goldd:#8A6A1A;
  --goldbg:rgba(184,144,42,.07);--goldbr:rgba(184,144,42,.22);
  --green:#2D6A4F;--greenbg:rgba(45,106,79,.08);--greenbr:rgba(45,106,79,.25);
  --red:#B5372A;--redbg:rgba(181,55,42,.08);--redbr:rgba(181,55,42,.22);
  --blue:#2B5490;--bluebg:rgba(43,84,144,.08);--bluebr:rgba(43,84,144,.22);
  --s0:0 1px 3px rgba(27,23,19,.06);--s1:0 4px 14px rgba(27,23,19,.1);
}
html,body,#root{min-height:100%;background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--ink)}

@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes rowIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

/* ── Page ── */
.poh-page{min-height:100vh;display:flex;flex-direction:column;background:var(--cream)}

/* ── Topbar ── */
.poh-tb{height:54px;flex-shrink:0;background:var(--ink);border-bottom:2px solid var(--gold);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:50}
.poh-tb-l{display:flex;align-items:center;gap:20px}
.poh-brand{display:flex;align-items:center;gap:10px}
.poh-bmark{width:30px;height:30px;border-radius:5px;border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--goldl)}
.poh-bname{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#F6F3EC}
.poh-bsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-top:1px}
.poh-bc{display:flex;align-items:center;gap:7px;font-size:11.5px}
.poh-bca{color:rgba(246,243,236,.3);cursor:pointer;transition:color .15s}.poh-bca:hover{color:rgba(246,243,236,.65)}
.poh-bcsep{color:rgba(246,243,236,.15)}.poh-bccur{color:var(--goldl);font-weight:500}
.poh-tb-r{display:flex;align-items:center;gap:8px}
.poh-new-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:5px;background:var(--gold);border:1px solid var(--goldd);color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.poh-new-btn:hover{background:var(--goldl);transform:translateY(-1px);box-shadow:0 4px 14px rgba(184,144,42,.4)}

/* ── Main ── */
.poh-main{flex:1;padding:22px 24px 40px;width:100%}

/* ── Page header ── */
.poh-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:20px}
.poh-eyebrow{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:5px;display:flex;align-items:center;gap:8px}
.poh-eyebrow::before{content:'';width:18px;height:1px;background:var(--gold);opacity:.6}
.poh-page-title{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:600;color:var(--ink);line-height:1;letter-spacing:-.3px}
.poh-page-sub{font-size:12px;color:var(--ink40);margin-top:5px}

/* ── Stat cards ── */
.poh-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:20px;animation:fadeUp .2s ease both}
.poh-stat{background:var(--paper);border:1px solid var(--ink10);border-radius:8px;padding:12px 14px;box-shadow:var(--s0);cursor:pointer;transition:all .16s;position:relative;overflow:hidden}
.poh-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:var(--sc,var(--ink10));opacity:.6;transition:opacity .15s}
.poh-stat:hover{border-color:var(--ink20);box-shadow:var(--s1);transform:translateY(-2px)}
.poh-stat:hover::before,.poh-stat.active::before{opacity:1}
.poh-stat.active{border-color:var(--sc,var(--ink10))}
.poh-stat-lbl{font-size:8.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink40);margin-bottom:5px;display:flex;align-items:center;gap:5px}
.poh-stat-dot{width:6px;height:6px;border-radius:50%;background:var(--sc);flex-shrink:0}
.poh-stat-val{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--ink);line-height:1}
.poh-stat-sub{font-size:10px;color:var(--ink40);margin-top:3px}

/* ── Toolbar ── */
.poh-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.poh-search-wrap{position:relative;flex:1;min-width:220px;max-width:380px}
.poh-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--ink20);pointer-events:none}
.poh-search{width:100%;padding:9px 34px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;color:var(--ink);outline:none;transition:all .18s}
.poh-search::placeholder{color:var(--ink20)}
.poh-search:hover{border-color:var(--ink20)}
.poh-search:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}
.poh-search-clr{position:absolute;right:9px;top:50%;transform:translateY(-50%);width:18px;height:18px;border-radius:50%;background:var(--ink10);border:none;color:var(--ink40);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s;font-size:11px}
.poh-search-clr:hover{background:var(--ink20)}

.poh-filter-tabs{display:flex;gap:4px;flex-wrap:wrap}
.poh-ftab{padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:1.5px solid var(--ink10);background:var(--paper);color:var(--ink50);transition:all .14s;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:5px}
.poh-ftab:hover{border-color:var(--ink20);background:var(--warm)}
.poh-ftab.on{background:var(--goldbg);border-color:var(--goldbr);color:var(--gold)}
.poh-ftab-count{font-size:9px;font-weight:800;padding:1px 5px;border-radius:10px}

.poh-sort-wrap{position:relative;margin-left:auto}
.poh-sort{padding:8px 28px 8px 11px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;color:var(--ink50);outline:none;cursor:pointer;appearance:none;transition:border-color .15s}
.poh-sort:focus{border-color:var(--gold)}
.poh-sort-arrow{position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:9px;color:var(--ink30);pointer-events:none}

/* ── Table ── */
.poh-table-wrap{background:var(--paper);border:1px solid var(--ink10);border-radius:10px;box-shadow:var(--s0);overflow:hidden;animation:fadeUp .22s .06s ease both}
.poh-thead{display:grid;grid-template-columns:48px 2.2fr 1.4fr 100px 110px 130px 110px 110px 90px;gap:0;padding:9px 18px;background:#EDE8DE;border-bottom:2px solid var(--gold)}
.poh-th{font-size:8.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink40);display:flex;align-items:center;gap:4px;cursor:pointer;user-select:none;transition:color .13s}
.poh-th:hover{color:var(--ink70)}
.poh-th.r{justify-content:flex-end}

/* Row */
.poh-row{display:grid;grid-template-columns:48px 2.2fr 1.4fr 100px 110px 130px 110px 110px 90px;gap:0;padding:11px 18px;border-bottom:1px solid var(--ink06);align-items:center;transition:background .12s;cursor:pointer;animation:rowIn .24s ease both}
.poh-row:last-child{border-bottom:none}
.poh-row:hover{background:var(--warm)}
.poh-row:hover .poh-row-actions{opacity:1}

/* Col: # */
.poh-col-num{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink20);font-weight:600}

/* Col: PO / Supplier */
.poh-col-po{display:flex;align-items:center;gap:10px;min-width:0;padding-right:10px}
.poh-av{width:34px;height:34px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:700}
.poh-po-no{font-family:'Geist Mono',monospace;font-size:10.5px;font-weight:600;color:var(--gold);margin-bottom:2px}
.poh-supplier-name{font-size:12.5px;font-weight:700;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.poh-supplier-city{font-size:10px;color:var(--ink40);margin-top:1px}

/* Col: Delivery location */
.poh-col-loc{font-size:11.5px;color:var(--ink50);font-weight:500;padding-right:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.poh-col-ref{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink30);margin-top:2px}

/* Col: Items */
.poh-col-items{font-family:'Geist Mono',monospace;font-size:12px;font-weight:700;color:var(--ink)}
.poh-col-items-sub{font-size:10px;color:var(--ink40);margin-top:2px}

/* Col: Priority */
.poh-priority{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:.3px}

/* Col: Date */
.poh-col-date{}
.poh-date-val{font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink50);font-weight:500}
.poh-date-sub{font-size:10px;margin-top:2px}
.poh-date-sub.overdue{color:var(--red)}
.poh-date-sub.due-soon{color:var(--gold)}
.poh-date-sub.ok{color:var(--ink30)}

/* Col: Status */
.poh-status{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:20px;font-size:10.5px;font-weight:700}
.poh-sdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}

/* Receipt progress */
.poh-col-receipt{padding-right:8px}
.poh-receipt-bar-wrap{height:4px;background:var(--ink06);border-radius:4px;overflow:hidden;margin-bottom:3px}
.poh-receipt-bar{height:100%;border-radius:4px;transition:width .4s ease}
.poh-receipt-lbl{font-size:9.5px;color:var(--ink40);font-family:'Geist Mono',monospace;font-weight:600}

/* Col: Total */
.poh-col-total{text-align:right;padding-right:8px}
.poh-total-val{font-family:'Geist Mono',monospace;font-size:12.5px;font-weight:700;color:var(--ink)}
.poh-total-terms{font-size:10px;color:var(--ink40);margin-top:2px}

/* Col: Actions */
.poh-col-actions{display:flex;justify-content:flex-end;gap:3px}
.poh-row-actions{opacity:0;transition:opacity .15s;display:flex;gap:3px}
.poh-action-btn{width:27px;height:27px;border-radius:6px;border:1px solid var(--ink10);background:var(--paper);color:var(--ink40);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:all .13s}
.poh-action-btn:hover{background:var(--warm);border-color:var(--ink20);color:var(--ink70)}
.poh-action-btn.gold:hover{background:var(--goldbg);border-color:var(--goldbr);color:var(--gold)}
.poh-action-btn.blue:hover{background:var(--bluebg);border-color:var(--bluebr);color:var(--blue)}
.poh-action-btn.green:hover{background:var(--greenbg);border-color:var(--greenbr);color:var(--green)}
.poh-action-btn.red:hover{background:var(--redbg);border-color:var(--redbr);color:var(--red)}

/* Highlight */
.poh-hl{background:rgba(184,144,42,.28);color:var(--gold);border-radius:2px;padding:0 1px}

/* Empty */
.poh-empty{padding:72px 32px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
.poh-empty-icon{font-size:44px;opacity:.18}
.poh-empty-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink50)}
.poh-empty-sub{font-size:13px;color:var(--ink30);max-width:280px;line-height:1.6}
.poh-empty-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:6px;background:var(--gold);border:1px solid var(--goldd);color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif;margin-top:4px}
.poh-empty-btn:hover{background:var(--goldl);transform:translateY(-1px)}

/* Footer */
.poh-footer{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid var(--ink06);background:var(--paper);font-size:11px;color:var(--ink40)}
.poh-footer strong{color:var(--ink70);font-weight:700}
.poh-footer-totals{display:flex;align-items:center;gap:16px}
.poh-footer-total-item{display:flex;align-items:center;gap:5px}
.poh-footer-total-dot{width:6px;height:6px;border-radius:50%}

/* ══════════════════════════════════════
   PO VIEW MODAL — slide-in drawer
══════════════════════════════════════ */
@keyframes vmOverlayIn{from{opacity:0}to{opacity:1}}
@keyframes vmSlideIn{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:none}}

.vm-overlay{
  position:fixed;inset:0;z-index:200;
  background:rgba(27,23,19,.48);backdrop-filter:blur(3px);
  animation:vmOverlayIn .2s ease;
  display:flex;justify-content:flex-end;
}
.vm-drawer{
  width:min(780px,90vw);height:100%;
  background:var(--cream);
  border-left:1px solid var(--ink10);
  box-shadow:-8px 0 40px rgba(27,23,19,.18);
  display:flex;flex-direction:column;overflow:hidden;
  animation:vmSlideIn .28s cubic-bezier(.16,1,.3,1);
}

/* Drawer header */
.vm-head{
  background:var(--ink);
  border-bottom:2px solid var(--gold);
  padding:16px 20px;flex-shrink:0;
  position:relative;
}
.vm-head::after{
  content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--goldd),var(--goldl) 40%,var(--gold) 70%,var(--goldd));
  pointer-events:none;
}
.vm-head-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px}
.vm-head-left{display:flex;align-items:center;gap:12px}
.vm-head-av{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;flex-shrink:0}
.vm-po-no{font-family:'Geist Mono',monospace;font-size:11px;font-weight:600;color:var(--gold);margin-bottom:3px;letter-spacing:.5px}
.vm-supplier-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:#F6F3EC;line-height:1}
.vm-supplier-sub{font-size:10.5px;color:rgba(246,243,236,.35);margin-top:3px;display:flex;align-items:center;gap:8px}
.vm-close{
  width:32px;height:32px;border-radius:7px;flex-shrink:0;
  background:rgba(246,243,236,.07);border:1px solid rgba(246,243,236,.12);
  color:rgba(246,243,236,.4);cursor:pointer;font-size:18px;
  display:flex;align-items:center;justify-content:center;transition:all .15s;
}
.vm-close:hover{background:rgba(246,243,236,.14);color:#F6F3EC}

/* Head pills row */
.vm-head-pills{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.vm-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:10.5px;font-weight:700;border:1.5px solid}
.vm-pill-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}

/* Tab bar */
.vm-tabs{display:flex;border-bottom:1px solid var(--ink10);background:var(--paper);flex-shrink:0}
.vm-tab{padding:11px 18px;font-size:12px;font-weight:700;color:var(--ink40);cursor:pointer;border:none;background:transparent;transition:all .14s;border-bottom:2px solid transparent;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px}
.vm-tab:hover{color:var(--ink70);background:var(--warm)}
.vm-tab.active{color:var(--gold);border-bottom-color:var(--gold);background:var(--goldbg)}
.vm-tab-count{font-size:9px;font-weight:800;padding:1px 5px;border-radius:10px;background:var(--ink06);color:var(--ink40)}
.vm-tab.active .vm-tab-count{background:rgba(184,144,42,.15);color:var(--gold)}

/* Drawer body */
.vm-body{flex:1;overflow-y:auto}
.vm-body::-webkit-scrollbar{width:3px}
.vm-body::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px}
.vm-section{padding:18px 20px;border-bottom:1px solid var(--ink06)}
.vm-section:last-child{border-bottom:none}
.vm-section-title{font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--ink40);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.vm-section-title::after{content:'';flex:1;height:1px;background:var(--ink06)}

/* Detail grid */
.vm-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.vm-detail-grid.cols3{grid-template-columns:1fr 1fr 1fr}
.vm-detail-item{background:var(--warm);border:1px solid var(--ink10);border-radius:7px;padding:9px 12px}
.vm-detail-label{font-size:8.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink40);margin-bottom:4px}
.vm-detail-val{font-size:12.5px;font-weight:700;color:var(--ink70)}
.vm-detail-val.mono{font-family:'Geist Mono',monospace;font-size:12px;color:var(--gold)}

/* Items table */
.vm-items-head{display:grid;grid-template-columns:32px 2fr 90px 70px 90px 80px 90px;gap:0;padding:7px 10px;background:#EDE8DE;border-radius:7px 7px 0 0;border:1px solid var(--ink10);border-bottom:none}
.vm-items-th{font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40)}
.vm-items-th.r{text-align:right}
.vm-item-row{display:grid;grid-template-columns:32px 2fr 90px 70px 90px 80px 90px;gap:0;padding:9px 10px;border:1px solid var(--ink10);border-top:none;align-items:center;transition:background .12s}
.vm-item-row:hover{background:var(--warm)}
.vm-item-row:last-child{border-radius:0 0 7px 7px}
.vm-item-icon{font-size:16px;text-align:center}
.vm-item-name{font-size:12px;font-weight:700;color:var(--ink);margin-bottom:2px}
.vm-item-sku{font-family:'Geist Mono',monospace;font-size:9.5px;color:var(--gold)}
.vm-item-num{font-family:'Geist Mono',monospace;font-size:11.5px;font-weight:700;color:var(--ink)}
.vm-item-total{font-family:'Geist Mono',monospace;font-size:12px;font-weight:700;color:var(--ink);text-align:right}
.vm-item-recv{display:flex;align-items:center;gap:5px}
.vm-recv-bar-wrap{flex:1;height:4px;background:var(--ink06);border-radius:4px;overflow:hidden}
.vm-recv-bar{height:100%;border-radius:4px}
.vm-recv-lbl{font-size:9px;font-family:'Geist Mono',monospace;font-weight:700;color:var(--ink40);white-space:nowrap}

/* Items totals */
.vm-items-totals{background:var(--ink);border-radius:8px;padding:12px 14px;margin-top:12px}
.vm-totals-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0}
.vm-totals-label{font-size:11px;color:rgba(246,243,236,.4);font-weight:500}
.vm-totals-val{font-family:'Geist Mono',monospace;font-size:12px;font-weight:700;color:rgba(246,243,236,.75)}
.vm-totals-grand{display:flex;justify-content:space-between;align-items:center;padding-top:8px;margin-top:6px;border-top:1px solid rgba(246,243,236,.1)}
.vm-totals-grand-label{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(246,243,236,.4)}
.vm-totals-grand-val{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--goldl)}

/* Timeline */
.vm-timeline{display:flex;flex-direction:column;gap:0;position:relative;padding-left:28px}
.vm-timeline::before{content:'';position:absolute;left:10px;top:6px;bottom:6px;width:1.5px;background:var(--ink10)}
.vm-tl-item{position:relative;padding-bottom:16px}
.vm-tl-item:last-child{padding-bottom:0}
.vm-tl-dot{position:absolute;left:-23px;top:3px;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;border:2px solid var(--cream);z-index:1}
.vm-tl-content{background:var(--warm);border:1px solid var(--ink10);border-radius:7px;padding:9px 12px}
.vm-tl-event{font-size:12px;font-weight:700;color:var(--ink);margin-bottom:3px}
.vm-tl-meta{display:flex;align-items:center;gap:8px;font-size:10.5px;color:var(--ink40)}
.vm-tl-user{font-weight:600;color:var(--ink50)}
.vm-tl-sep{color:var(--ink20)}
.vm-tl-time{font-family:'Geist Mono',monospace;font-size:10px}

/* Drawer footer */
.vm-footer{
  padding:12px 20px;
  border-top:2px solid var(--gold);
  background:var(--ink);
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  flex-shrink:0;
}
.vm-footer-info{font-size:10.5px;color:rgba(246,243,236,.3);display:flex;align-items:center;gap:10px}
.vm-footer-info strong{color:var(--goldl);font-family:'Geist Mono',monospace}
.vm-footer-btns{display:flex;gap:7px}
.vm-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif;border:1px solid}
.vm-btn-ghost{background:transparent;border-color:rgba(246,243,236,.18);color:rgba(246,243,236,.6)}
.vm-btn-ghost:hover{border-color:rgba(246,243,236,.35);color:#F6F3EC}
.vm-btn-blue{background:var(--blue);border-color:rgba(43,84,144,.7);color:#fff}
.vm-btn-blue:hover{background:#3A6BC5;transform:translateY(-1px)}
.vm-btn-green{background:var(--green);border-color:rgba(45,106,79,.7);color:#fff}
.vm-btn-green:hover{background:#3D8A65;transform:translateY(-1px)}
.vm-btn-gold{background:var(--gold);border-color:var(--goldd);color:#fff}
.vm-btn-gold:hover{background:var(--goldl);transform:translateY(-1px)}
.vm-btn-red{background:transparent;border-color:rgba(181,55,42,.4);color:var(--red)}
.vm-btn-red:hover{background:var(--redbg);border-color:var(--redbr)}
`;

// ─── HIGHLIGHT ────────────────────────────────────────────────────────────────
function Hl({ text, q }) {
  if (!q || !text) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return <>{text.slice(0,i)}<mark className="poh-hl">{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>;
}

// ─── PO VIEW MODAL ────────────────────────────────────────────────────────────
function POViewModal({ po, onClose }) {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!po) return null;

  const sm        = STATUS_META[po.status] || STATUS_META.draft;
  const pm        = PRIORITY_META[po.priority] || PRIORITY_META.Normal;
  const [clr, bg] = avColor(po.supplier);
  const lineItems = getLineItems(po);
  const timeline  = getTimeline(po);
  const pct       = po.items > 0 ? Math.round((po.receivedQty / po.items) * 100) : 0;

  // Calculate totals from line items
  const lineNet   = it => (it.qty * it.unitPrice) * (1 - (it.discount || 0) / 100);
  const lineTax   = it => lineNet(it) * (it.taxRate / 100);
  const lineTotal = it => lineNet(it) + lineTax(it);
  const subtotal  = lineItems.reduce((s, it) => s + lineNet(it), 0);
  const totalTax  = lineItems.reduce((s, it) => s + lineTax(it), 0);
  const grand     = subtotal + totalTax;

  const tabs = [
    { id:"details",  label:"Details",   count:null },
    { id:"items",    label:"Items",     count:lineItems.length },
    { id:"timeline", label:"Timeline",  count:timeline.length  },
  ];

  return (
    <div className="vm-overlay" onClick={onClose}>
      <div className="vm-drawer" onClick={e => e.stopPropagation()}>

        {/* ── HEAD ── */}
        <div className="vm-head">
          <div className="vm-head-top">
            <div className="vm-head-left">
              <div className="vm-head-av" style={{ background:bg, border:`1.5px solid ${clr}35`, color:clr }}>
                {initials(po.supplier)}
              </div>
              <div>
                <div className="vm-po-no">📋 {po.poNo}</div>
                <div className="vm-supplier-name">{po.supplier}</div>
                <div className="vm-supplier-sub">
                  <span>{po.supplierCode}</span>
                  <span style={{color:"rgba(246,243,236,.15)"}}>·</span>
                  <span>{po.supplierCity}</span>
                  <span style={{color:"rgba(246,243,236,.15)"}}>·</span>
                  <span>{po.supplierEmail}</span>
                </div>
              </div>
            </div>
            <button className="vm-close" onClick={onClose}>×</button>
          </div>

          {/* Pills */}
          <div className="vm-head-pills">
            <span className="vm-pill" style={{ background:sm.bg, borderColor:sm.border, color:sm.color }}>
              <span className="vm-pill-dot" style={{ background:sm.dot }}/>
              {sm.label}
            </span>
            {po.priority !== "Normal" && (
              <span className="vm-pill" style={{ background:pm.bg, borderColor:pm.border, color:pm.color }}>
                {po.priority === "Urgent" ? "⚡ Urgent" : po.priority}
              </span>
            )}
            <span className="vm-pill" style={{ background:"rgba(246,243,236,.06)", borderColor:"rgba(246,243,236,.12)", color:"rgba(246,243,236,.5)" }}>
              📅 {po.poDate}
            </span>
            <span className="vm-pill" style={{ background:"rgba(246,243,236,.06)", borderColor:"rgba(246,243,236,.12)", color:"rgba(246,243,236,.5)" }}>
              🚚 {po.deliveryDate}
            </span>
            {po.reference && (
              <span className="vm-pill" style={{ background:"var(--goldbg)", borderColor:"var(--goldbr)", color:"var(--gold)" }}>
                🔗 {po.reference}
              </span>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="vm-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`vm-tab${activeTab===t.id?" active":""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              {t.count !== null && <span className="vm-tab-count">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className="vm-body">

          {/* ══ DETAILS TAB ══ */}
          {activeTab === "details" && (
            <>
              {/* Order Info */}
              <div className="vm-section">
                <div className="vm-section-title">Order Information</div>
                <div className="vm-detail-grid cols3">
                  {[
                    { label:"PO Number",       val:po.poNo,             mono:true  },
                    { label:"PO Date",         val:po.poDate,           mono:true  },
                    { label:"Delivery Date",   val:po.deliveryDate,     mono:true  },
                    { label:"Payment Terms",   val:po.paymentTerms,     mono:false },
                    { label:"Currency",        val:po.currency,         mono:true  },
                    { label:"Status",          val:sm.label,            mono:false },
                  ].map(d => (
                    <div key={d.label} className="vm-detail-item">
                      <div className="vm-detail-label">{d.label}</div>
                      <div className={`vm-detail-val${d.mono?" mono":""}`}>{d.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supplier Info */}
              <div className="vm-section">
                <div className="vm-section-title">Supplier Details</div>
                <div className="vm-detail-grid">
                  {[
                    { label:"Supplier Name",   val:po.supplier         },
                    { label:"Supplier Code",   val:po.supplierCode     },
                    { label:"City",            val:po.supplierCity     },
                    { label:"Email",           val:po.supplierEmail    },
                  ].map(d => (
                    <div key={d.label} className="vm-detail-item">
                      <div className="vm-detail-label">{d.label}</div>
                      <div className="vm-detail-val">{d.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="vm-section">
                <div className="vm-section-title">Delivery & Reference</div>
                <div className="vm-detail-grid">
                  <div className="vm-detail-item" style={{ gridColumn:"1 / -1" }}>
                    <div className="vm-detail-label">Delivery Location</div>
                    <div className="vm-detail-val">📍 {po.deliveryLocation}</div>
                  </div>
                  {po.reference && (
                    <div className="vm-detail-item">
                      <div className="vm-detail-label">Quotation / Reference</div>
                      <div className="vm-detail-val mono">🔗 {po.reference}</div>
                    </div>
                  )}
                  <div className="vm-detail-item">
                    <div className="vm-detail-label">Priority</div>
                    <div className="vm-detail-val" style={{ color:pm.color }}>
                      {po.priority === "Urgent" ? "⚡ " : ""}{po.priority}
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt progress */}
              {!["draft","cancelled"].includes(po.status) && (
                <div className="vm-section">
                  <div className="vm-section-title">Receipt Progress</div>
                  <div style={{ background:po.status==="received"?"var(--greenbg)":"var(--warm)", border:`1px solid ${po.status==="received"?"var(--greenbr)":"var(--ink10)"}`, borderRadius:8, padding:"14px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:"var(--ink70)" }}>
                        {po.receivedQty} of {po.items} lines received
                      </span>
                      <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:14, fontWeight:700, color: pct===100?"var(--green)":pct>0?"var(--gold)":"var(--ink40)" }}>
                        {pct}%
                      </span>
                    </div>
                    <div style={{ height:8, background:"var(--ink10)", borderRadius:6, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:pct===100?"var(--green)":pct>0?"var(--gold)":"var(--ink10)", borderRadius:6, transition:"width .5s ease" }}/>
                    </div>
                    <div style={{ marginTop:8, fontSize:11, color:"var(--ink40)" }}>
                      {pct === 100 ? "✓ All items received" : pct > 0 ? `${po.items - po.receivedQty} lines still pending` : "Awaiting delivery"}
                    </div>
                  </div>
                </div>
              )}

              {/* Value summary */}
              <div className="vm-section">
                <div className="vm-section-title">Value Summary</div>
                <div className="vm-items-totals">
                  <div className="vm-totals-row">
                    <span className="vm-totals-label">{lineItems.length} line items</span>
                    <span className="vm-totals-val">{po.currency} {fmt(subtotal)}</span>
                  </div>
                  <div className="vm-totals-row">
                    <span className="vm-totals-label">Tax</span>
                    <span className="vm-totals-val">{po.currency} {fmt(totalTax)}</span>
                  </div>
                  <div className="vm-totals-grand">
                    <span className="vm-totals-grand-label">Grand Total</span>
                    <span className="vm-totals-grand-val">{fmt(grand)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ ITEMS TAB ══ */}
          {activeTab === "items" && (
            <div className="vm-section">
              <div className="vm-section-title">Order Line Items</div>

              <div className="vm-items-head">
                <div className="vm-items-th"></div>
                <div className="vm-items-th">Item / SKU</div>
                <div className="vm-items-th r">Qty</div>
                <div className="vm-items-th r">Unit Price</div>
                <div className="vm-items-th r">Disc %</div>
                <div className="vm-items-th">Received</div>
                <div className="vm-items-th r">Line Total</div>
              </div>

              {lineItems.map((it, i) => {
                const net   = lineNet(it);
                const total = lineTotal(it);
                const recvPct = it.qty > 0 ? Math.round((it.received / it.qty) * 100) : 0;
                return (
                  <div key={it.id} className="vm-item-row" style={{ animationDelay:`${i*20}ms`, animation:"rowIn .2s ease both" }}>
                    <div className="vm-item-icon">{it.icon}</div>
                    <div>
                      <div className="vm-item-name">{it.name}</div>
                      <div className="vm-item-sku">{it.sku}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div className="vm-item-num">{it.qty}</div>
                      <div style={{ fontSize:9.5, color:"var(--ink40)", fontFamily:"'DM Sans',sans-serif" }}>{it.unit}</div>
                    </div>
                    <div className="vm-item-num" style={{ textAlign:"right" }}>{fmt(it.unitPrice)}</div>
                    <div style={{ textAlign:"right" }}>
                      {it.discount > 0
                        ? <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:11.5, fontWeight:700, color:"var(--gold)" }}>{it.discount}%</span>
                        : <span style={{ color:"var(--ink20)", fontSize:11 }}>—</span>
                      }
                    </div>
                    <div>
                      {!["draft","cancelled"].includes(po.status) ? (
                        <div className="vm-item-recv">
                          <div className="vm-recv-bar-wrap">
                            <div className="vm-recv-bar" style={{
                              width:`${recvPct}%`,
                              background: recvPct===100?"var(--green)":recvPct>0?"var(--gold)":"var(--ink10)"
                            }}/>
                          </div>
                          <div className="vm-recv-lbl">{it.received}/{it.qty}</div>
                        </div>
                      ) : <span style={{ color:"var(--ink20)", fontSize:11 }}>—</span>}
                    </div>
                    <div className="vm-item-total">{po.currency} {fmt(total)}</div>
                  </div>
                );
              })}

              {/* Totals */}
              <div className="vm-items-totals">
                <div className="vm-totals-row">
                  <span className="vm-totals-label">Subtotal ({lineItems.length} lines)</span>
                  <span className="vm-totals-val">{po.currency} {fmt(subtotal)}</span>
                </div>
                <div className="vm-totals-row">
                  <span className="vm-totals-label">Tax</span>
                  <span className="vm-totals-val">{po.currency} {fmt(totalTax)}</span>
                </div>
                <div className="vm-totals-grand">
                  <span className="vm-totals-grand-label">Grand Total</span>
                  <span className="vm-totals-grand-val">{fmt(grand)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ══ TIMELINE TAB ══ */}
          {activeTab === "timeline" && (
            <div className="vm-section">
              <div className="vm-section-title">Activity Timeline</div>
              <div className="vm-timeline">
                {timeline.map((t, i) => {
                  const tc = TIMELINE_COLORS[t.type] || TIMELINE_COLORS.create;
                  return (
                    <div key={i} className="vm-tl-item">
                      <div className="vm-tl-dot" style={{ background:tc.bg, color:tc.color }}>
                        {tc.icon}
                      </div>
                      <div className="vm-tl-content">
                        <div className="vm-tl-event">{t.event}</div>
                        <div className="vm-tl-meta">
                          <span className="vm-tl-user">{t.user}</span>
                          <span className="vm-tl-sep">·</span>
                          <span className="vm-tl-time">{t.date} {t.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Future placeholder */}
                {!["received","cancelled"].includes(po.status) && (
                  <div className="vm-tl-item">
                    <div className="vm-tl-dot" style={{ background:"var(--ink06)", color:"var(--ink20)", border:"1.5px dashed var(--ink10)" }}>
                      …
                    </div>
                    <div style={{ padding:"8px 10px", border:"1px dashed var(--ink10)", borderRadius:7, fontSize:11, color:"var(--ink30)", fontStyle:"italic" }}>
                      Awaiting next action…
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ── FOOTER ── */}
        <div className="vm-footer">
          <div className="vm-footer-info">
            <span><strong>{po.poNo}</strong></span>
            <span>·</span>
            <span>Total: <strong>{po.currency} {fmt(po.total)}</strong></span>
            <span>·</span>
            <span style={{ color: sm.color }}>{sm.label}</span>
          </div>
          <div className="vm-footer-btns">
            <button className="vm-btn vm-btn-ghost" onClick={onClose}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Close
            </button>
            <button className="vm-btn vm-btn-ghost">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print
            </button>
            {po.status === "draft" && (
              <button className="vm-btn vm-btn-blue">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Send to Supplier
              </button>
            )}
            {["approved","partial"].includes(po.status) && (
              <button className="vm-btn vm-btn-green">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Create GRN
              </button>
            )}
            {po.status === "sent" && (
              <button className="vm-btn vm-btn-gold">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Approve PO
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function POHistoryPage({ onNewPO }) {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy,       setSortBy]       = useState("date-desc");
  const [selectedPO,   setSelectedPO]   = useState(null);

  // Stats
  const stats = useMemo(() => {
    const counts = { all: PO_DATA.length };
    Object.keys(STATUS_META).forEach(s => { counts[s] = PO_DATA.filter(p => p.status === s).length; });
    const totalValue    = PO_DATA.reduce((s,p) => s + p.total, 0);
    const approvedValue = PO_DATA.filter(p => p.status === "approved").reduce((s,p) => s + p.total, 0);
    const pendingValue  = PO_DATA.filter(p => ["sent","approved"].includes(p.status)).reduce((s,p) => s + p.total, 0);
    return { counts, totalValue, approvedValue, pendingValue };
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = PO_DATA.filter(p => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchSearch = !q ||
        p.poNo.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.supplierCode.toLowerCase().includes(q) ||
        p.supplierCity.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q) ||
        p.deliveryLocation.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
    switch (sortBy) {
      case "date-desc":  list = [...list].sort((a,b) => b.poDate.localeCompare(a.poDate)); break;
      case "date-asc":   list = [...list].sort((a,b) => a.poDate.localeCompare(b.poDate)); break;
      case "total-desc": list = [...list].sort((a,b) => b.total - a.total); break;
      case "total-asc":  list = [...list].sort((a,b) => a.total - b.total); break;
      case "supplier":   list = [...list].sort((a,b) => a.supplier.localeCompare(b.supplier)); break;
      case "delivery":   list = [...list].sort((a,b) => a.deliveryDate.localeCompare(b.deliveryDate)); break;
    }
    return list;
  }, [search, statusFilter, sortBy]);

  const daysUntil = dateStr => {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr) - new Date()) / 864e5);
  };

  const receiptPct = po => po.items > 0 ? Math.round((po.receivedQty / po.items) * 100) : 0;

  const statCards = [
    { key:"all",       label:"All Orders",  val:stats.counts.all,       color:"#B8902A", sub:`LKR ${fmt(stats.totalValue)} total`      },
    { key:"draft",     label:"Draft",       val:stats.counts.draft,     color:"#9E9080", sub:"Not yet sent"                            },
    { key:"sent",      label:"Sent",        val:stats.counts.sent,      color:"#2B5490", sub:"Awaiting supplier"                       },
    { key:"approved",  label:"Approved",    val:stats.counts.approved,  color:"#B8902A", sub:`LKR ${fmt(stats.approvedValue)}`         },
    { key:"received",  label:"Received",    val:stats.counts.received,  color:"#2D6A4F", sub:"Goods delivered"                        },
    { key:"cancelled", label:"Cancelled",   val:stats.counts.cancelled, color:"#B5372A", sub:"Voided orders"                          },
  ];

  return (
    <>
      <style>{CSS}</style>
      {selectedPO && <POViewModal po={selectedPO} onClose={() => setSelectedPO(null)} />}
      <div className="poh-page">

        {/* TOPBAR */}
        <header className="poh-tb">
          <div className="poh-tb-l">
            <div className="poh-brand">
              <div className="poh-bmark">N</div>
              <div>
                <div className="poh-bname">Nexus POS</div>
                <div className="poh-bsub">Documents</div>
              </div>
            </div>
            <div className="poh-bc">
              <span className="poh-bca">Dashboard</span>
              <span className="poh-bcsep">›</span>
              <span className="poh-bca">Documents</span>
              <span className="poh-bcsep">›</span>
              <span className="poh-bccur">Purchase Orders</span>
            </div>
          </div>
          <div className="poh-tb-r">
            <button className="poh-new-btn" onClick={onNewPO}>
              ✦ New Purchase Order
            </button>
          </div>
        </header>

        <div className="poh-main">

          {/* PAGE HEADER */}
          <div className="poh-header">
            <div>
              <div className="poh-eyebrow">Documents · Procurement</div>
              <div className="poh-page-title">Purchase Orders</div>
              <div className="poh-page-sub">
                {PO_DATA.length} orders · {new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})}
              </div>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="poh-stats">
            {statCards.map(sc => (
              <div
                key={sc.key}
                className={`poh-stat${statusFilter===sc.key?" active":""}`}
                style={{"--sc":sc.color}}
                onClick={()=>setStatusFilter(sc.key)}
              >
                <div className="poh-stat-lbl">
                  {sc.key!=="all" && <span className="poh-stat-dot"/>}
                  {sc.label}
                </div>
                <div className="poh-stat-val" style={{color:statusFilter===sc.key?sc.color:"var(--ink)"}}>
                  {sc.val}
                </div>
                <div className="poh-stat-sub">{sc.sub}</div>
              </div>
            ))}
          </div>

          {/* TOOLBAR */}
          <div className="poh-toolbar">
            {/* Search */}
            <div className="poh-search-wrap">
              <svg className="poh-search-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="poh-search"
                placeholder="Search PO no., supplier, location, reference…"
                value={search}
                onChange={e=>setSearch(e.target.value)}
              />
              {search && <button className="poh-search-clr" onClick={()=>setSearch("")}>×</button>}
            </div>

            {/* Status filter tabs */}
            <div className="poh-filter-tabs">
              {STATUS_FILTERS.map(f => {
                const isOn = statusFilter === f;
                return (
                  <button
                    key={f}
                    className={`poh-ftab${isOn?" on":""}`}
                    onClick={()=>setStatusFilter(f)}
                  >
                    {f === "all" ? "All" : STATUS_META[f]?.label}
                    {f !== "all" && (
                      <span className="poh-ftab-count" style={{
                        background: isOn?"rgba(184,144,42,.15)":"var(--ink06)",
                        color:      isOn?"var(--gold)":"var(--ink40)",
                      }}>
                        {stats.counts[f] ?? 0}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="poh-sort-wrap">
              <select className="poh-sort" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                <option value="date-desc">Date: Newest</option>
                <option value="date-asc">Date: Oldest</option>
                <option value="delivery">Delivery Date</option>
                <option value="total-desc">Total: High → Low</option>
                <option value="total-asc">Total: Low → High</option>
                <option value="supplier">Supplier A–Z</option>
              </select>
              <span className="poh-sort-arrow">▾</span>
            </div>
          </div>

          {/* TABLE */}
          <div className="poh-table-wrap">

            {/* Column headers */}
            <div className="poh-thead">
              <div className="poh-th">#</div>
              <div className="poh-th">Supplier / PO</div>
              <div className="poh-th">Delivery Location</div>
              <div className="poh-th">Items</div>
              <div className="poh-th">Priority</div>
              <div className="poh-th">PO Date · Delivery</div>
              <div className="poh-th">Status</div>
              <div className="poh-th r">Total</div>
              <div className="poh-th r">Actions</div>
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="poh-empty">
                <div className="poh-empty-icon">📋</div>
                <div className="poh-empty-title">No purchase orders found</div>
                <div className="poh-empty-sub">
                  {search
                    ? `No results for "${search}". Try a different search term.`
                    : "No orders match the selected filter."}
                </div>
                <button className="poh-empty-btn" onClick={()=>{setSearch("");setStatusFilter("all")}}>
                  Clear Filters
                </button>
              </div>
            ) : (
              filtered.map((po, i) => {
                const sm         = STATUS_META[po.status] || STATUS_META.draft;
                const pm         = PRIORITY_META[po.priority] || PRIORITY_META.Normal;
                const [clr, bg]  = avColor(po.supplier);
                const dl         = daysUntil(po.deliveryDate);
                const pct        = receiptPct(po);
                const isOverdue  = dl !== null && dl < 0 && !["received","cancelled"].includes(po.status);
                const isDueSoon  = dl !== null && dl >= 0 && dl <= 3 && !["received","cancelled"].includes(po.status);

                return (
                  <div
                    key={po.id}
                    className="poh-row"
                    style={{animationDelay:`${i*18}ms`}}
                    onClick={()=>setSelectedPO(po)}
                  >
                    {/* # */}
                    <div className="poh-col-num">{String(i+1).padStart(2,"0")}</div>

                    {/* Supplier / PO */}
                    <div className="poh-col-po">
                      <div className="poh-av" style={{background:bg,border:`1.5px solid ${clr}28`,color:clr}}>
                        {initials(po.supplier)}
                      </div>
                      <div style={{minWidth:0}}>
                        <div className="poh-po-no"><Hl text={po.poNo} q={search}/></div>
                        <div className="poh-supplier-name"><Hl text={po.supplier} q={search}/></div>
                        <div className="poh-supplier-city">
                          <Hl text={po.supplierCity} q={search}/>
                          {po.reference && <span style={{marginLeft:6,fontFamily:"'Geist Mono',monospace",fontSize:9,color:"var(--ink30)"}}><Hl text={po.reference} q={search}/></span>}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Location */}
                    <div style={{paddingRight:8,minWidth:0}}>
                      <div className="poh-col-loc"><Hl text={po.deliveryLocation} q={search}/></div>
                      <div style={{fontFamily:"'Geist Mono',monospace",fontSize:9,color:"var(--ink30)",marginTop:2}}>{po.supplierCode}</div>
                    </div>

                    {/* Items + receipt progress */}
                    <div>
                      <div className="poh-col-items">{po.items} <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"var(--ink40)",fontWeight:400}}>lines</span></div>
                      {po.status !== "draft" && po.status !== "cancelled" && (
                        <div className="poh-col-receipt" style={{marginTop:4}}>
                          <div className="poh-receipt-bar-wrap" style={{width:60}}>
                            <div className="poh-receipt-bar" style={{
                              width:`${pct}%`,
                              background: pct===100?"var(--green)":pct>0?"var(--gold)":"var(--ink10)"
                            }}/>
                          </div>
                          <div className="poh-receipt-lbl">{pct}%</div>
                        </div>
                      )}
                    </div>

                    {/* Priority */}
                    <div>
                      {po.priority !== "Normal" ? (
                        <span className="poh-priority" style={{background:pm.bg,border:`1.5px solid ${pm.border}`,color:pm.color}}>
                          {po.priority === "Urgent" && "⚡ "}
                          {po.priority}
                        </span>
                      ) : (
                        <span style={{fontSize:11,color:"var(--ink20)",fontWeight:500}}>—</span>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <div className="poh-date-val">{po.poDate}</div>
                      <div className={`poh-date-sub${isOverdue?" overdue":isDueSoon?" due-soon":" ok"}`}>
                        {isOverdue  ? `Overdue ${Math.abs(dl)}d`
                         : isDueSoon ? `Due in ${dl}d`
                         : po.status === "received"  ? "Delivered"
                         : po.status === "cancelled" ? "Cancelled"
                         : `Deliver ${po.deliveryDate}`}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <div className="poh-status" style={{background:sm.bg,border:`1px solid ${sm.border}`,color:sm.color}}>
                        <span className="poh-sdot" style={{background:sm.dot}}/>
                        {sm.label}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="poh-col-total">
                      <div className="poh-total-val">LKR {fmt(po.total)}</div>
                      <div className="poh-total-terms">{po.paymentTerms}</div>
                    </div>

                    {/* Actions */}
                    <div className="poh-col-actions">
                      <div className="poh-row-actions" onClick={e=>e.stopPropagation()}>
                        {/* View */}
                        <button className="poh-action-btn gold" title="View PO" onClick={e=>{e.stopPropagation();setSelectedPO(po);}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        {/* Print */}
                        <button className="poh-action-btn" title="Print">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                          </svg>
                        </button>
                        {/* Convert to GRN — only for approved/partial */}
                        {["approved","partial"].includes(po.status) && (
                          <button className="poh-action-btn green" title="Create GRN">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="13 17 18 12 13 7"/><path d="M6 12h12"/><circle cx="12" cy="12" r="10"/>
                            </svg>
                          </button>
                        )}
                        {/* Send — only for draft */}
                        {po.status === "draft" && (
                          <button className="poh-action-btn blue" title="Send to Supplier">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                          </button>
                        )}
                        {/* Delete — only for draft/cancelled */}
                        {["draft","cancelled"].includes(po.status) && (
                          <button className="poh-action-btn red" title="Delete">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}

            {/* Table footer */}
            {filtered.length > 0 && (
              <div className="poh-footer">
                <span>
                  Showing <strong>{filtered.length}</strong> of <strong>{PO_DATA.length}</strong> purchase orders
                  {search && <> · matching <strong>"{search}"</strong></>}
                </span>
                <div className="poh-footer-totals">
                  {[
                    { label:"Filtered Total", val: filtered.reduce((s,p)=>s+p.total,0), color:"var(--ink40)" },
                    { label:"Approved",       val: filtered.filter(p=>p.status==="approved").reduce((s,p)=>s+p.total,0), color:"var(--gold)" },
                    { label:"Received",       val: filtered.filter(p=>p.status==="received").reduce((s,p)=>s+p.total,0), color:"var(--green)" },
                  ].map(t => (
                    <div key={t.label} className="poh-footer-total-item">
                      <span className="poh-footer-total-dot" style={{background:t.color}}/>
                      <span style={{color:"var(--ink40)"}}>{t.label}:</span>
                      <strong style={{color:"var(--ink70)",fontFamily:"'Geist Mono',monospace",fontSize:11}}>LKR {fmt(t.val)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}