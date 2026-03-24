import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { CustomerSelectionModal } from "../customers/CustomerSelectionModel";
import QuotationSummaryModal from "./QuotationSummaryModel";

// ── DATA ──────────────────────────────────────────────────────────────────────
const WALK_IN = { id: 0, name: "Walk-in Customer", email: "—", phone: "—", city: "—", tags: [], initials: "WI", color: "#9E9080", bg: "rgba(158,144,128,.15)" };

const CUSTOMERS = [
  { id: 1,  name: "Ravi Mendis",         email: "ravi.m@email.com",      phone: "+94 71 234 5678", city: "Colombo",    tags: ["vip","regular"],          initials:"RM", color:"#2B5490", bg:"rgba(43,84,144,.15)"  },
  { id: 2,  name: "Priya Silva",          email: "priya.silva@yahoo.com", phone: "+94 77 876 5432", city: "Nugegoda",   tags: ["regular"],                initials:"PS", color:"#5B3D8F", bg:"rgba(91,61,143,.15)"  },
  { id: 3,  name: "Daniel Wijayaratne",   email: "daniel.w@hotmail.com",  phone: "+94 76 543 2109", city: "Maharagama", tags: ["vip","wholesale"],        initials:"DW", color:"#2D6A4F", bg:"rgba(45,106,79,.15)"  },
  { id: 4,  name: "Amara Perera",         email: "amara.p@gmail.com",     phone: "+94 70 112 3344", city: "Wattala",    tags: ["new"],                    initials:"AP", color:"#B8902A", bg:"rgba(184,144,42,.15)" },
  { id: 5,  name: "Kasun Fernando",       email: "kasun.f@sltnet.lk",     phone: "+94 71 998 7766", city: "Kelaniya",   tags: ["regular"],                initials:"KF", color:"#B5372A", bg:"rgba(181,55,42,.15)"  },
  { id: 6,  name: "Nimesha Gunawardena",  email: "nimesha.g@gmail.com",   phone: "+94 78 456 7890", city: "Colombo",    tags: ["vip","gold"],             initials:"NG", color:"#7A5C1E", bg:"rgba(122,92,30,.15)"  },
  { id: 7,  name: "Asanka Liyanage",      email: "asanka.l@hotmail.com",  phone: "+94 72 567 8901", city: "Colombo",    tags: ["vip","gold","wholesale"], initials:"AL", color:"#8A3A6A", bg:"rgba(138,58,106,.15)" },
  { id: 8,  name: "Ruwan Bandara",        email: "ruwan.b@gmail.com",     phone: "+94 77 789 0123", city: "Kandy",      tags: ["regular","vip"],          initials:"RB", color:"#1B6B8A", bg:"rgba(27,107,138,.15)" },
];

const PRODUCTS = [
  { id: 1,  sku:"WEP-221", name:"Wireless Earbuds Pro",     icon:"🎧", cat:"Electronics", price:59.99, tax:18, stock:18 },
  { id: 2,  sku:"CCT-089", name:"Cotton Crew T-Shirt",       icon:"👕", cat:"Apparel",     price:17.99, tax:5,  stock:42 },
  { id: 3,  sku:"LWS-441", name:"Leather Wallet Slim",       icon:"👜", cat:"Accessories", price:24.99, tax:5,  stock:9  },
  { id: 4,  sku:"SCS-112", name:"Scented Candle Set",        icon:"🕯", cat:"Home",        price:15.99, tax:5,  stock:5  },
  { id: 5,  sku:"SWB-330", name:"Stainless Water Bottle",    icon:"🍶", cat:"Lifestyle",   price:16.99, tax:5,  stock:23 },
  { id: 6,  sku:"NAG-007", name:"Notebook A5 Grid",          icon:"📓", cat:"Stationery",  price:5.99,  tax:0,  stock:67 },
  { id: 7,  sku:"UCH-880", name:"USB-C Hub 7-in-1",          icon:"🔌", cat:"Electronics", price:44.99, tax:18, stock:3  },
  { id: 8,  sku:"PCI-556", name:"Phone Case iPhone 15",      icon:"📱", cat:"Accessories", price:12.99, tax:5,  stock:14 },
  { id: 9,  sku:"YMP-203", name:"Yoga Mat Pro",              icon:"🧘", cat:"Sports",      price:34.99, tax:5,  stock:11 },
  { id: 10, sku:"CCM-445", name:"Ceramic Coffee Mug",        icon:"☕", cat:"Home",        price:9.99,  tax:5,  stock:30 },
  { id: 11, sku:"BDO-119", name:"Bamboo Desk Organiser",     icon:"🪴", cat:"Stationery",  price:22.99, tax:5,  stock:8  },
  { id: 12, sku:"RSS-062", name:"Running Socks 3-Pack",      icon:"🧦", cat:"Sports",      price:11.99, tax:5,  stock:55 },
  { id: 14, sku:"MKT-509", name:"Mechanical Keyboard TKL",   icon:"⌨",  cat:"Electronics", price:89.99, tax:18, stock:6  },
  { id: 15, sku:"LTB-883", name:"Linen Throw Blanket",       icon:"🛋", cat:"Home",        price:28.99, tax:5,  stock:16 },
  { id: 16, sku:"PCH-392", name:"Portable Charger 20000mAh", icon:"🔋", cat:"Electronics", price:49.99, tax:18, stock:12 },
];

const PROD_CATS  = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.cat))).sort()];
const TAG_COLORS = {
  vip:       { bg:"rgba(184,144,42,.1)",  br:"rgba(184,144,42,.28)", c:"#B8902A" },
  gold:      { bg:"rgba(184,144,42,.08)", br:"rgba(184,144,42,.2)",  c:"#D4A83C" },
  wholesale: { bg:"rgba(43,84,144,.08)",  br:"rgba(43,84,144,.22)",  c:"#2B5490" },
  regular:   { bg:"rgba(45,106,79,.08)",  br:"rgba(45,106,79,.2)",   c:"#2D6A4F" },
  new:       { bg:"rgba(91,61,143,.08)",  br:"rgba(91,61,143,.2)",   c:"#5B3D8F" },
};
const CAT_COLORS = {
  Electronics:"#2B5490", Apparel:"#5B3D8F", Accessories:"#B8902A",
  Home:"#7A5C1E", Lifestyle:"#2D6A4F", Stationery:"#6B5F54", Sports:"#B5372A",
};

const fmt    = n => Number(n||0).toFixed(2);
const genQN  = () => `QUO-${new Date().getFullYear()}-${String(Math.floor(Math.random()*900)+100)}`;
const today  = new Date().toISOString().split("T")[0];
const plus30 = new Date(Date.now()+30*864e5).toISOString().split("T")[0];

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --cream:#F6F3EC;--paper:#FDFBF6;--warm:#EEE9DF;--warm2:#E4DDD2;
    --ink:#1B1713;--ink70:#4B4038;--ink50:#6B5F54;--ink40:#9E9080;
    --ink20:#C9C0B2;--ink10:#E4DDD2;--ink06:#EDE8E0;
    --gold:#B8902A;--goldl:#D4A83C;--goldd:#8A6A1A;
    --goldbg:rgba(184,144,42,.07);--goldbr:rgba(184,144,42,.22);
    --green:#2D6A4F;--greenl:#3D8A65;--greenbg:rgba(45,106,79,.08);--greenbr:rgba(45,106,79,.25);
    --red:#B5372A;--redbg:rgba(181,55,42,.08);--redbr:rgba(181,55,42,.22);
    --blue:#2B5490;--bluebg:rgba(43,84,144,.07);--bluebr:rgba(43,84,144,.22);
    --s0:0 1px 3px rgba(27,23,19,.06),0 1px 2px rgba(27,23,19,.04);
    --s2:0 8px 28px rgba(27,23,19,.12),0 2px 6px rgba(27,23,19,.06);
    --s3:0 24px 64px rgba(27,23,19,.22),0 4px 16px rgba(27,23,19,.1);
  }
  html,body,#root{height:100%;background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--ink);overflow:hidden}
  .page{display:flex;flex-direction:column;height:100vh}

  .tb{height:54px;flex-shrink:0;background:var(--ink);border-bottom:2px solid var(--gold);display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:20}
  .tb-l{display:flex;align-items:center;gap:20px}
  .brand{display:flex;align-items:center;gap:10px}
  .bmark{width:30px;height:30px;border-radius:5px;border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--goldl)}
  .bname{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#F6F3EC}
  .bsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-top:1px}
  .bc{display:flex;align-items:center;gap:7px;font-size:11.5px}
  .bca{color:rgba(246,243,236,.3);cursor:pointer;transition:color .15s}.bca:hover{color:rgba(246,243,236,.65)}
  .bcsep{color:rgba(246,243,236,.15)}.bccur{color:var(--goldl);font-weight:500}
  .tb-r{display:flex;align-items:center;gap:7px}
  .av{width:30px;height:30px;border-radius:4px;border:1.5px solid var(--goldbr);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:600;color:var(--goldl)}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 15px;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;border:1px solid transparent;transition:all .15s;white-space:nowrap}
  .btn-gold{background:var(--gold);color:#F6F3EC;font-weight:600;border-color:var(--goldd)}
  .btn-gold:hover{background:var(--goldl);transform:translateY(-1px);box-shadow:0 4px 14px rgba(184,144,42,.35)}
  .btn-gold:disabled{background:var(--ink20);border-color:var(--ink20);cursor:not-allowed;transform:none;box-shadow:none}
  .btn-ghost{background:transparent;border-color:rgba(246,243,236,.14);color:rgba(246,243,236,.35)}
  .btn-ghost:hover{border-color:rgba(246,243,236,.3);color:rgba(246,243,236,.75)}
  .btn-ol{background:transparent;border-color:rgba(246,243,236,.18);color:rgba(246,243,236,.45)}
  .btn-ol:hover{border-color:rgba(246,243,236,.38);color:rgba(246,243,236,.8)}

  .body{flex:1;overflow:hidden;display:flex;padding:14px 16px;gap:12px}
  .col-l{width:300px;flex-shrink:0;display:flex;flex-direction:column;gap:10px;overflow-y:auto}
  .col-m{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
  .col-r{width:340px;flex-shrink:0;display:flex;flex-direction:column;overflow:hidden}
  .col-l::-webkit-scrollbar,.col-r::-webkit-scrollbar{width:3px}
  .col-l::-webkit-scrollbar-thumb,.col-r::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:2px}

  .card{background:var(--paper);border:1px solid var(--ink10);border-radius:7px;padding:14px 16px;box-shadow:var(--s0)}
  .ctitle{font-size:9px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:var(--ink40);display:flex;align-items:center;gap:8px;margin-bottom:12px}
  .ctitle::after{content:'';flex:1;height:1px;background:var(--ink10)}

  .field{display:flex;flex-direction:column;gap:5px;margin-bottom:9px}
  .field:last-child{margin-bottom:0}
  .field1{display:flex;flex-direction:column;gap:5px;margin-bottom:9px;max-width:126px}
  .field1:last-child{margin-bottom:0}
  .lbl{font-size:9.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink40)}
  .inp{background:var(--warm);border:1px solid var(--ink10);border-radius:5px;padding:8px 10px;color:var(--ink);font-size:12.5px;font-family:'DM Sans',sans-serif;outline:none;width:100%;transition:border-color .15s,box-shadow .15s;appearance:none}
  .inp:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}
  .inp[readonly]{color:var(--gold);font-family:'Geist Mono',monospace;font-size:11.5px;background:var(--goldbg);border-color:var(--goldbr);cursor:default}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:9px}
  .nota{width:100%;background:var(--warm);border:1px solid var(--ink10);border-radius:5px;padding:9px 10px;resize:none;color:var(--ink70);font-family:'Cormorant Garamond',serif;font-size:13.5px;font-style:italic;line-height:1.6;outline:none;transition:border-color .15s}
  .nota:focus{border-color:var(--gold)}

  /* Customer card */
  .cust-trigger{display:flex;align-items:center;gap:10px;padding:10px 13px;background:var(--warm);border:1.5px dashed var(--ink20);border-radius:7px;cursor:pointer;transition:all .18s;width:100%;font-family:'DM Sans',sans-serif;margin-bottom:0}
  .cust-trigger:hover{border-color:var(--gold);background:var(--goldbg)}
  .cust-trigger-ico{width:34px;height:34px;border-radius:6px;background:var(--ink10);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
  .cust-trigger:hover .cust-trigger-ico{background:rgba(184,144,42,.12)}
  .cust-trigger-text{font-size:12.5px;font-weight:600;color:var(--ink50);line-height:1.2}
  .cust-trigger-sub{font-size:10.5px;color:var(--ink30);margin-top:1px}

  .cust-pill{display:flex;align-items:flex-start;gap:11px;padding:11px 13px;background:var(--goldbg);border:1.5px solid var(--goldbr);border-radius:7px;position:relative;margin-bottom:0}
  .cust-pill-av{width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:700;flex-shrink:0}
  .cust-pill-name{font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:1px}
  .cust-pill-sub{font-size:11px;color:var(--ink40);line-height:1.65}
  .cust-pill-tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:5px}
  .cust-change{position:absolute;top:8px;right:8px;padding:3px 9px;background:transparent;border:1px solid var(--goldbr);border-radius:4px;color:var(--gold);font-size:10px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
  .cust-change:hover{background:var(--gold);color:#fff}
  .tc{display:inline-flex;align-items:center;padding:2px 7px;border-radius:20px;font-size:9.5px;font-weight:700}

  /* Validity */
  .vq-row{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}
  .vq-btn{padding:4px 10px;border-radius:20px;font-size:10.5px;font-weight:700;cursor:pointer;border:1.5px solid var(--ink10);background:var(--warm);color:var(--ink50);transition:all .14s;font-family:'DM Sans',sans-serif}
  .vq-btn:hover{border-color:var(--ink20);background:var(--paper)}
  .vq-btn.on{border-color:var(--goldbr);background:var(--goldbg);color:var(--gold)}

  /* Middle */
  .mcard{background:var(--paper);border:1px solid var(--ink10);border-radius:7px;box-shadow:var(--s0);display:flex;flex-direction:column;flex:1;overflow:hidden}
  .mhead{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;background:var(--ink);border-bottom:2px solid var(--gold);border-radius:6px 6px 0 0;flex-shrink:0}
  .mtitle{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#F6F3EC;letter-spacing:.3px}
  .prod-trigger-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:5px;background:rgba(184,144,42,.12);border:1px solid rgba(184,144,42,.35);color:var(--goldl);font-size:11.5px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
  .prod-trigger-btn:hover{background:rgba(184,144,42,.22);border-color:rgba(184,144,42,.6)}

  .tscroll{flex:1;overflow-y:auto}
  .tscroll::-webkit-scrollbar{width:3px}
  .tscroll::-webkit-scrollbar-thumb{background:var(--ink10)}
  .thead{display:grid;grid-template-columns:26px 2fr 88px 72px 90px 120px 78px 86px 28px;gap:6px;padding:8px 14px;background:#EDE8DE;border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:2}
  .tth{font-size:9.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40)}
  .trow{display:grid;grid-template-columns:26px 2fr 88px 72px 90px 120px 78px 86px 28px;gap:6px;align-items:center;padding:9px 14px;border-bottom:1px solid var(--ink10);transition:background .1s}
  .trow:last-child{border-bottom:none}
  .trow:hover{background:var(--warm)}
  .tnum{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink20);font-weight:600}
  .tpname{font-size:12.5px;font-weight:600;color:var(--ink);line-height:1.25}
  .tsku{font-family:'Geist Mono',monospace;font-size:9.5px;color:var(--gold)}
  .tinp{background:var(--warm);border:1px solid var(--ink10);border-radius:4px;padding:5px 6px;color:var(--ink);font-size:12.5px;font-weight:600;font-family:'DM Sans',sans-serif;outline:none;width:100%;text-align:center;transition:border-color .13s}
  .tinp:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(184,144,42,.1)}
  .tdinp{background:var(--greenbg);border:1px solid var(--greenbr);border-radius:4px;padding:5px 6px;color:var(--green);font-size:12.5px;font-weight:600;font-family:'DM Sans',sans-serif;outline:none;width:100%;text-align:center}
  .tdinp:focus{border-color:var(--green)}
  .trm{width:24px;height:24px;background:transparent;border:1px solid transparent;border-radius:4px;color:var(--ink20);cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:all .13s;line-height:1}
  .trm:hover{background:var(--redbg);color:var(--red);border-color:var(--redbr)}
  .tempty{padding:42px 20px;text-align:center;color:var(--ink20);font-size:13px;display:flex;flex-direction:column;align-items:center;gap:10px}

  .tbar{background:var(--ink);border-top:2px solid var(--gold);padding:11px 16px;border-radius:0 0 6px 6px;flex-shrink:0}
  .tgrid{display:grid;grid-template-columns:1fr 1fr 1fr 1px .65fr;align-items:center}
  .ti{padding:0 12px}.ti:first-child{padding-left:0}
  .tlbl{font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:rgba(246,243,236,.3);font-weight:700;margin-bottom:3px}
  .tval{font-family:'Geist Mono',monospace;font-size:13.5px;font-weight:500;color:rgba(246,243,236,.7)}
  .tdiv{width:1px;height:32px;background:rgba(246,243,236,.1);margin:0 4px}
  .tgrand .tlbl{color:var(--gold)}.tgrand .tval{font-size:19px;font-weight:600;color:#F6F3EC}

  .rcard{background:var(--paper);border:1px solid var(--ink10);border-radius:7px;box-shadow:var(--s0);overflow:hidden;flex:1;display:flex;flex-direction:column}
  .rhead{background:var(--ink);padding:12px 16px;border-bottom:2px solid var(--gold);flex-shrink:0}
  .rsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:3px}
  .rtitle{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#F6F3EC}
  .rbody{padding:14px 16px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:14px}
  .rbody::-webkit-scrollbar{width:3px}
  .rbody::-webkit-scrollbar-thumb{background:var(--ink10)}
  .sec{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink40);display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .sec::after{content:'';flex:1;height:1px;background:var(--ink10)}

  .dtabs{display:flex;border:1px solid var(--ink10);border-radius:5px;overflow:hidden;margin-bottom:8px}
  .dtab{flex:1;padding:7px;text-align:center;cursor:pointer;font-size:10.5px;font-weight:600;background:var(--warm);color:var(--ink40);border:none;font-family:'DM Sans',sans-serif;transition:all .15s}
  .dtab.active{background:var(--green);color:#fff}
  .dtab:first-child{border-right:1px solid var(--ink10)}
  .dinpwrap{position:relative}
  .dinp{width:100%;background:var(--greenbg);border:1px solid var(--greenbr);border-radius:5px;padding:9px 28px 9px 10px;color:var(--green);font-size:15px;font-weight:600;font-family:'Geist Mono',monospace;outline:none;transition:border-color .15s}
  .dinp:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(45,106,79,.1)}
  .dunit{position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--green);font-weight:600;pointer-events:none}

  .exrow{display:grid;grid-template-columns:1fr 80px;gap:8px;align-items:end}
  .cinp{width:100%;background:var(--warm);border:1px solid var(--ink10);border-radius:5px;padding:8px 10px;color:var(--ink);font-size:12.5px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .15s}
  .cinp:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}

  .srow{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}
  .slbl{color:var(--ink40)}.sval{color:var(--ink70);font-weight:500;font-family:'Geist Mono',monospace;font-size:11.5px}
  .srow.disc .slbl,.srow.disc .sval{color:var(--green)}
  .shr{height:1px;background:var(--ink10);margin:6px 0}
  .stot{display:flex;justify-content:space-between;align-items:center;background:var(--ink);border-radius:5px;padding:10px 12px;margin-top:2px}
  .stlbl{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--goldl)}
  .stval{font-family:'Geist Mono',monospace;font-size:18px;font-weight:600;color:#F6F3EC}

  .status-row{display:flex;gap:5px;flex-wrap:wrap}
  .stat-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:1.5px solid var(--ink10);background:var(--warm);color:var(--ink50);transition:all .14s;font-family:'DM Sans',sans-serif}
  .stat-btn:hover{border-color:var(--ink20);background:var(--paper)}
  .stat-btn.on{background:var(--sb-bg);border-color:var(--sb-br);color:var(--sb-c)}
  .sdot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.85}

  .issue-btn{background:var(--gold);color:#F6F3EC;width:100%;justify-content:center;padding:12px;font-size:13.5px;font-weight:700;border-radius:6px;border:1px solid var(--goldd);font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:8px}
  .issue-btn:hover{background:var(--goldl);transform:translateY(-1px);box-shadow:0 6px 20px rgba(184,144,42,.4)}
  .issue-btn:disabled{background:var(--ink20);border-color:var(--ink20);cursor:not-allowed;transform:none;box-shadow:none}
  .draft-btn{background:var(--warm);border:1px solid var(--ink10);color:var(--ink40);width:100%;justify-content:center;padding:8px;font-size:11.5px;border-radius:5px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px;margin-top:7px}
  .draft-btn:hover{border-color:var(--ink20);color:var(--ink70)}

  /* ── MODALS ── */
  .modal-bd{position:fixed;inset:0;background:rgba(27,23,19,.62);backdrop-filter:blur(4px);z-index:600;display:flex;align-items:center;justify-content:center;padding:20px;animation:bdIn .2s ease}
  @keyframes bdIn{from{opacity:0}to{opacity:1}}
  .modal-box{background:var(--paper);border:1px solid var(--ink10);border-radius:13px;box-shadow:var(--s3);animation:mIn .24s cubic-bezier(.16,1,.3,1);overflow:hidden;display:flex;flex-direction:column}
  @keyframes mIn{from{opacity:0;transform:scale(.96) translateY(14px)}to{opacity:1;transform:none}}
  .modal-head{background:var(--ink);border-bottom:2px solid var(--gold);padding:16px 22px;flex-shrink:0;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
  .meyebrow{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(184,144,42,.7);margin-bottom:4px}
  .mtitleh{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600;color:#F6F3EC;line-height:1}
  .mclose{width:30px;height:30px;border-radius:6px;background:rgba(246,243,236,.06);border:1px solid rgba(246,243,236,.1);color:rgba(246,243,236,.4);cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
  .mclose:hover{background:rgba(246,243,236,.12);color:rgba(246,243,236,.88)}

  /* Customer Modal */
  .cm-box{width:550px;max-height:80vh}
  .cm-bar{padding:13px 20px;border-bottom:1px solid var(--ink10);background:linear-gradient(180deg,#fff,var(--paper));flex-shrink:0}
  .cm-search-wrap{position:relative}
  .cm-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--ink30);pointer-events:none}
  .cm-input{width:100%;padding:10px 36px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--ink);outline:none;transition:all .18s}
  .cm-input:focus{border-color:var(--gold);background:#fff;box-shadow:0 0 0 3px rgba(184,144,42,.1)}
  .cm-input::placeholder{color:var(--ink20)}
  .cm-clr{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:20px;height:20px;border-radius:50%;background:var(--ink10);border:none;color:var(--ink40);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .cm-list{flex:1;overflow-y:auto;padding:10px 14px 6px}
  .cm-list::-webkit-scrollbar{width:3px}
  .cm-list::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px}
  .cm-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:9px;cursor:pointer;transition:all .15s;border:1.5px solid transparent;margin-bottom:6px}
  .cm-row:hover{background:var(--warm);border-color:var(--ink10)}
  .cm-row.sel{background:var(--goldbg);border-color:var(--goldbr)}
  .cm-av{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;flex-shrink:0}
  .cm-name{font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:2px}
  .cm-sub{font-size:11px;color:var(--ink40);line-height:1.55}
  .cm-tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px}
  .cm-foot{padding:13px 20px;border-top:1px solid var(--ink10);background:var(--paper);display:flex;gap:8px;flex-shrink:0}
  .mbtn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 16px;border-radius:7px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;border:1px solid transparent;transition:all .2s;width:100%}
  .mbtn-gold{background:var(--gold);border-color:var(--goldd);color:#fff;box-shadow:0 2px 8px rgba(184,144,42,.3)}
  .mbtn-gold:hover{background:var(--goldl);transform:translateY(-1px)}
  .mbtn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
  .mbtn-ghost{background:transparent;border-color:var(--ink10);color:var(--ink50)}
  .mbtn-ghost:hover{border-color:var(--ink20);color:var(--ink60);background:var(--warm)}
  .mbtn-sm{padding:7px 14px;font-size:11.5px}

  /* Product Modal */
  .pm-box{width:min(940px,95vw);height:min(84vh,660px)}
  .pm-bar{padding:13px 20px 11px;border-bottom:1px solid var(--ink10);background:linear-gradient(180deg,#fff,var(--paper));flex-shrink:0}
  .pm-top{display:flex;gap:10px;align-items:center;margin-bottom:10px}
  .pm-search-wrap{position:relative;flex:1}
  .pm-sico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--ink30);pointer-events:none}
  .pm-sinp{width:100%;padding:10px 36px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--ink);outline:none;transition:all .18s;font-weight:500}
  .pm-sinp:focus{border-color:var(--gold);background:#fff;box-shadow:0 0 0 3px rgba(184,144,42,.1)}
  .pm-sinp::placeholder{color:var(--ink20)}
  .pm-sclr{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:20px;height:20px;border-radius:50%;background:var(--ink10);border:none;color:var(--ink40);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .pm-cats{display:flex;gap:5px;flex-wrap:wrap}
  .pm-cat{padding:5px 11px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:1.5px solid var(--ink10);background:var(--cream);color:var(--ink50);transition:all .14s;font-family:'DM Sans',sans-serif}
  .pm-cat:hover{border-color:var(--ink20);background:var(--paper)}
  .pm-cat.on{background:var(--goldbg);border-color:var(--goldbr);color:var(--gold)}
  .pm-split{flex:1;display:grid;grid-template-columns:1fr 276px;overflow:hidden}
  .pm-grid-wrap{overflow-y:auto;padding:13px 16px}
  .pm-grid-wrap::-webkit-scrollbar{width:3px}
  .pm-grid-wrap::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px}
  .pm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(152px,1fr));gap:9px}
  .pm-card{background:var(--cream);border:1.5px solid var(--ink10);border-radius:10px;padding:12px;cursor:pointer;transition:all .18s;display:flex;flex-direction:column;gap:9px;position:relative;overflow:hidden}
  .pm-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:var(--cc,transparent);opacity:0;transition:opacity .15s}
  .pm-card:hover{background:var(--paper);border-color:var(--ink20);box-shadow:var(--s2);transform:translateY(-2px)}
  .pm-card:hover::before,.pm-card.in::before{opacity:1}
  .pm-card.in{border-color:var(--gold);background:var(--goldbg);box-shadow:0 0 0 2px rgba(184,144,42,.18)}
  .pm-card.in::before{background:var(--gold)}
  .pm-card.out{opacity:.5;cursor:not-allowed}
  .pm-card.out:hover{transform:none;box-shadow:none}
  .pm-card-top{display:flex;align-items:flex-start;justify-content:space-between}
  .pm-card-icon{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:21px;background:var(--warm2);border:1px solid var(--ink10);flex-shrink:0;transition:transform .15s}
  .pm-card:hover .pm-card-icon{transform:scale(1.06)}
  .pm-card.in .pm-card-icon{background:rgba(184,144,42,.14);border-color:var(--goldbr)}
  .pm-qty-badge{width:20px;height:20px;border-radius:50%;background:var(--gold);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;animation:popIn .18s ease}
  @keyframes popIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
  .pm-sku{font-family:'Geist Mono',monospace;font-size:9.5px;color:var(--gold);margin-bottom:1px}
  .pm-name{font-size:12px;font-weight:700;color:var(--ink);line-height:1.3}
  .pm-card-bot{display:flex;align-items:center;justify-content:space-between;gap:4px;margin-top:auto}
  .pm-price{font-family:'Geist Mono',monospace;font-size:13.5px;font-weight:700;color:var(--ink)}
  .pm-stk{font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:20px}
  .pm-add{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .14s;flex-shrink:0}

  /* Cart sidebar */
  .pm-cart{display:flex;flex-direction:column;background:var(--paper);border-left:1px solid var(--ink10);overflow:hidden}
  .pm-cart-head{padding:11px 14px 10px;border-bottom:1px solid var(--ink10);background:linear-gradient(180deg,#fff,var(--paper));flex-shrink:0;display:flex;align-items:center;justify-content:space-between}
  .pm-cart-title{font-family:'Cormorant Garamond',serif;font-size:14.5px;font-weight:700;color:var(--ink)}
  .pm-items{flex:1;overflow-y:auto;padding:8px 12px}
  .pm-items::-webkit-scrollbar{width:3px}
  .pm-items::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px}
  .pm-ci{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--ink06);animation:siIn .15s ease}
  @keyframes siIn{from{opacity:0;transform:translateX(7px)}to{opacity:1;transform:none}}
  .pm-ci:last-child{border-bottom:none}
  .pm-ci-ico{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:15px;background:var(--warm2);border:1px solid var(--ink10);flex-shrink:0}
  .pm-ci-name{font-size:11.5px;font-weight:700;color:var(--ink);line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100px}
  .pm-ci-sku{font-family:'Geist Mono',monospace;font-size:9px;color:var(--gold)}
  .pm-ci-price{font-family:'Geist Mono',monospace;font-size:11px;font-weight:700;color:var(--ink);text-align:right;white-space:nowrap}
  .pm-ci-sub{font-family:'Geist Mono',monospace;font-size:9.5px;color:var(--ink40);text-align:right}
  .pm-qrow{display:flex;align-items:center;gap:4px;margin-top:4px}
  .pm-qbtn{width:20px;height:20px;border-radius:4px;background:var(--warm2);border:1px solid var(--ink10);color:var(--ink50);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s}
  .pm-qbtn:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
  .pm-qval{min-width:24px;text-align:center;font-family:'Geist Mono',monospace;font-size:11.5px;font-weight:700;color:var(--ink);padding:2px 3px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:4px;outline:none}
  .pm-qval:focus{border-color:var(--gold)}
  .pm-ci-rm{width:20px;height:20px;border-radius:4px;background:transparent;border:1px solid transparent;color:var(--ink20);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:all .12s;flex-shrink:0}
  .pm-ci-rm:hover{background:var(--redbg);color:var(--red);border-color:var(--redbr)}
  .pm-cart-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:20px;text-align:center}
  .pm-empty-ico{font-size:32px;opacity:.2}
  .pm-empty-msg{font-size:12px;color:var(--ink30);font-weight:600;line-height:1.5}
  .pm-cart-foot{padding:12px 14px;border-top:1px solid var(--ink10);background:var(--paper);flex-shrink:0}
  .pm-grand{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:var(--ink);border-radius:7px;margin:8px 0 10px}
  .pm-grand-lbl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(246,243,236,.4)}
  .pm-grand-val{font-family:'Geist Mono',monospace;font-size:16px;font-weight:700;color:var(--goldl)}
  .pm-no-results{padding:36px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px}
  .pm-no-ico{font-size:36px;opacity:.2}
  .pm-no-msg{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--ink40)}

  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .col-l{animation:fadeUp .24s ease both}
  .mcard{animation:fadeUp .24s .04s ease both}
  .rcard{animation:fadeUp .24s .08s ease both}
`;

// ── CUSTOMER MODAL ────────────────────────────────────────────────────────────
function CustomerModal({ current, onSelect, onClose }) {
  const [q,   setQ]   = useState("");
  const [sel, setSel] = useState(current);
  const ref = useRef();
  

  useEffect(() => { setTimeout(() => ref.current?.focus(), 60); }, []);
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return CUSTOMERS.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      c.phone.includes(s) ||
      c.city.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="modal-bd" onClick={onClose}>
      <div className="modal-box cm-box" onClick={e => e.stopPropagation()}>

        <div className="modal-head">
          <div>
            <div className="meyebrow">CRM · Customer Relations</div>
            <div className="mtitleh">Select Customer</div>
          </div>
          <button className="mclose" onClick={onClose}>×</button>
        </div>

        <div className="cm-bar">
          <div className="cm-search-wrap">
            <span className="cm-ico">⌕</span>
            <input ref={ref} className="cm-input" placeholder="Search by name, phone or email…" value={q} onChange={e => setQ(e.target.value)} />
            {q && <button className="cm-clr" onClick={() => setQ("")}>×</button>}
          </div>
        </div>

        <div className="cm-list">
          {/* Walk-in */}
          <div className={`cm-row${sel?.id===0?" sel":""}`} onClick={() => setSel(WALK_IN)}>
            <div style={{ width:40, height:40, borderRadius:9, background:"var(--warm)", border:"1.5px solid var(--ink10)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0 }}>💵</div>
            <div style={{ flex:1 }}>
              <div className="cm-name">Walk-in Customer</div>
              <div className="cm-sub">Counter sale · No account required</div>
            </div>
            {sel?.id===0 && <span style={{ color:"var(--gold)", fontSize:17 }}>✓</span>}
          </div>

          {filtered.map(c => (
            <div key={c.id} className={`cm-row${sel?.id===c.id?" sel":""}`} onClick={() => setSel(c)}>
              <div className="cm-av" style={{ background:c.bg, border:`1.5px solid ${c.color}30`, color:c.color }}>{c.initials}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="cm-name">{c.name}</div>
                <div className="cm-sub">{c.phone} · {c.email}</div>
                <div className="cm-sub">{c.city}</div>
                <div className="cm-tags">
                  {c.tags.map(t => {
                    const s = TAG_COLORS[t]||{};
                    return <span key={t} className="tc" style={{ background:s.bg, border:`1px solid ${s.br}`, color:s.c }}>{t}</span>;
                  })}
                </div>
              </div>
              {sel?.id===c.id && <span style={{ color:"var(--gold)", fontSize:17, flexShrink:0 }}>✓</span>}
            </div>
          ))}

          {filtered.length===0 && (
            <div style={{ padding:"24px", textAlign:"center", color:"var(--ink30)", fontSize:13 }}>No customers found</div>
          )}
        </div>

        <div className="cm-foot">
          <button className="mbtn mbtn-ghost mbtn-sm" style={{ width:"auto", padding:"8px 16px" }} onClick={onClose}>Cancel</button>
          <button className="mbtn mbtn-gold" onClick={() => { onSelect(sel || WALK_IN); onClose(); }}>✓ Confirm Selection</button>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT MODAL ─────────────────────────────────────────────────────────────
function ProductModal({ currentItems, onConfirm, onClose }) {
  const [q,    setQ]    = useState("");
  const [cat,  setCat]  = useState("All");
  const [cart, setCart] = useState(() => currentItems.map(i => ({ ...i })));
  const ref = useRef();

  useEffect(() => { setTimeout(() => ref.current?.focus(), 60); }, []);
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return PRODUCTS.filter(p => {
      const m = p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s);
      return m && (cat==="All" || p.cat===cat);
    });
  }, [q, cat]);

  const ci   = pid => cart.find(i => i.productId===pid);
  const add  = p => {
    if (p.stock===0) return;
    setCart(prev => {
      const ex = prev.find(i => i.productId===p.id);
      if (ex) return prev.map(i => i.productId===p.id ? { ...i, qty:i.qty+1 } : i);
      return [...prev, { productId:p.id, name:p.name, sku:p.sku, icon:p.icon, cat:p.cat, unitPrice:p.price, tax:p.tax, qty:1, lineDisc:0 }];
    });
  };
  const rm  = pid => setCart(prev => prev.filter(i => i.productId!==pid));
  const qty = (pid, v) => {
    const q = Math.max(1, parseInt(v)||1);
    setCart(prev => prev.map(i => i.productId===pid ? { ...i, qty:q } : i));
  };

  const totals = useMemo(() => ({
    items:    cart.reduce((s,i) => s+i.qty, 0),
    subtotal: cart.reduce((s,i) => s+i.unitPrice*i.qty, 0),
  }), [cart]);

  const StockBadge = ({ n }) => n===0
    ? <span className="pm-stk" style={{ background:"var(--redbg)", color:"var(--red)", border:"1px solid var(--redbr)" }}>Out</span>
    : n<=5
    ? <span className="pm-stk" style={{ background:"var(--goldbg)", color:"var(--gold)", border:"1px solid var(--goldbr)" }}>{n}</span>
    : <span className="pm-stk" style={{ background:"var(--greenbg)", color:"var(--green)", border:"1px solid var(--greenbr)" }}>{n}</span>;

  return (
    <div className="modal-bd" onClick={onClose}>
      <div className="modal-box pm-box" onClick={e => e.stopPropagation()}>

        <div className="modal-head">
          <div>
            <div className="meyebrow">Inventory · Products</div>
            <div className="mtitleh">Select Products</div>
          </div>
          <button className="mclose" onClick={onClose}>×</button>
        </div>

        <div className="pm-bar">
          <div className="pm-top">
            <div className="pm-search-wrap">
              <span className="pm-sico">⌕</span>
              <input ref={ref} className="pm-sinp" placeholder="Search by product name or SKU…" value={q} onChange={e => setQ(e.target.value)} />
              {q && <button className="pm-sclr" onClick={() => setQ("")}>×</button>}
            </div>
            {cart.length>0 && (
              <span style={{ padding:"4px 11px", borderRadius:20, background:"var(--goldbg)", border:"1px solid var(--goldbr)", color:"var(--gold)", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
                {cart.length} selected
              </span>
            )}
          </div>
          <div className="pm-cats">
            {PROD_CATS.map(c => (
              <button key={c} className={`pm-cat${cat===c?" on":""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="pm-split">
          {/* Product grid */}
          <div className="pm-grid-wrap">
            {filtered.length===0 ? (
              <div className="pm-no-results">
                <div className="pm-no-ico">🔍</div>
                <div className="pm-no-msg">No products found</div>
                <button className="mbtn mbtn-ghost mbtn-sm" style={{ width:"auto", marginTop:4 }} onClick={() => { setQ(""); setCat("All"); }}>Clear</button>
              </div>
            ) : (
              <div className="pm-grid">
                {filtered.map((p, i) => {
                  const item = ci(p.id);
                  const cc   = CAT_COLORS[p.cat]||"#6B5F54";
                  return (
                    <div key={p.id}
                      className={`pm-card${item?" in":""}${p.stock===0?" out":""}`}
                      style={{ "--cc":cc, animationDelay:`${i*16}ms`, animation:"fadeUp .22s ease both" }}
                      onClick={() => add(p)}>
                      <div className="pm-card-top">
                        <div className="pm-card-icon">{p.icon}</div>
                        {item && <div className="pm-qty-badge">{item.qty}</div>}
                      </div>
                      <div>
                        <div className="pm-sku">{p.sku}</div>
                        <div className="pm-name">{p.name}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:4 }}>
                        <span style={{ padding:"2px 7px", borderRadius:20, fontSize:9.5, fontWeight:700, background:`${cc}18`, color:cc, border:`1px solid ${cc}28` }}>{p.cat}</span>
                        <StockBadge n={p.stock} />
                      </div>
                      <div className="pm-card-bot">
                        <div className="pm-price">${fmt(p.price)}</div>
                        <div className="pm-add" style={{ background:item?"var(--gold)":"var(--warm2)", border:`1.5px solid ${item?"var(--goldd)":"var(--ink10)"}`, color:item?"#fff":"var(--ink40)" }}>{item?"✓":"+"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="pm-cart">
            <div className="pm-cart-head">
              <div className="pm-cart-title">Selected</div>
              {cart.length>0 && (
                <button className="mbtn mbtn-ghost mbtn-sm" style={{ width:"auto", padding:"4px 9px", fontSize:10.5 }} onClick={() => setCart([])}>Clear</button>
              )}
            </div>

            {cart.length===0 ? (
              <div className="pm-cart-empty">
                <div className="pm-empty-ico">🛒</div>
                <div className="pm-empty-msg">Click products<br/>to add them</div>
              </div>
            ) : (
              <div className="pm-items">
                {cart.map((item, i) => (
                  <div key={item.productId} className="pm-ci" style={{ animationDelay:`${i*18}ms` }}>
                    <div className="pm-ci-ico">{item.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="pm-ci-name">{item.name}</div>
                      <div className="pm-ci-sku">{item.sku}</div>
                      <div className="pm-qrow">
                        <button className="pm-qbtn" onClick={() => item.qty>1 ? qty(item.productId, item.qty-1) : rm(item.productId)}>−</button>
                        <input className="pm-qval" type="number" min="1" value={item.qty} onChange={e => qty(item.productId, e.target.value)} />
                        <button className="pm-qbtn" onClick={() => qty(item.productId, item.qty+1)}>+</button>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
                      <div className="pm-ci-price">${fmt(item.unitPrice)}</div>
                      <div className="pm-ci-sub">${fmt(item.unitPrice*item.qty)}</div>
                      <button className="pm-ci-rm" onClick={() => rm(item.productId)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pm-cart-foot">
              {cart.length>0 && (
                <div className="pm-grand">
                  <span className="pm-grand-lbl">{totals.items} item{totals.items!==1?"s":""}</span>
                  <span className="pm-grand-val">${fmt(totals.subtotal)}</span>
                </div>
              )}
              <button className="mbtn mbtn-gold" disabled={cart.length===0} onClick={() => { onConfirm(cart); onClose(); }}>
                ✓ Add {cart.length>0?`${cart.length} Product${cart.length>1?"s":""}` : "Products"}
              </button>
              <button className="mbtn mbtn-ghost" style={{ marginTop:6 }} onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function CreateQuotation() {
  const [quoteNo]  = useState(genQN);
  const [validFrom,  setValidFrom]  = useState(today);
  const [validUntil, setValidUntil] = useState(plus30);
  const [validDays,  setValidDays]  = useState(30);
  const [taxRate,    setTaxRate]    = useState(8);
  const [reference,  setReference]  = useState("");
  const [subject,    setSubject]    = useState("");
  const [terms,      setTerms]      = useState("Payment due within 30 days. Prices subject to change after validity period.");
  const [status,     setStatus]     = useState("draft");
  const [showSummary, setShowSummary] = useState(false);

  const [customer,     setCustomer]     = useState(WALK_IN);
  const [showCustMod,  setShowCustMod]  = useState(false);
  const [showProdMod,  setShowProdMod]  = useState(false);
  const [lineItems,    setLineItems]    = useState([]);
  const [quoteDisc,    setQuoteDisc]    = useState(0);
  const [quoteDiscType,setQuoteDiscType]= useState("pct");
  const [extraCharge,  setExtraCharge]  = useState(0);
  const [extraLabel,   setExtraLabel]   = useState("Delivery");

  const updateItem = (id, f, v) => setLineItems(p => p.map(i => i.id===id ? { ...i, [f]:v } : i));
  const removeItem = id => setLineItems(p => p.filter(i => i.id!==id));

  const handleProdsConfirmed = useCallback(cartItems => {
    setLineItems(() => cartItems.map(ci => ({
      id: ci.productId + "-" + ci.productId,
      ...ci,
      lineDisc: 0,
    })));
  }, []);

  const setValidity = days => {
    setValidDays(days);
    const d = new Date(validFrom);
    d.setDate(d.getDate() + days);
    setValidUntil(d.toISOString().split("T")[0]);
  };

  const daysLeft = useMemo(() => Math.max(0, Math.ceil((new Date(validUntil)-new Date(validFrom))/864e5)), [validFrom, validUntil]);

  const grossTotal    = lineItems.reduce((s,i) => s + i.unitPrice*i.qty, 0);
  const lineDiscTotal = lineItems.reduce((s,i) => s + i.unitPrice*i.qty*(i.lineDisc/100), 0);
  const lineSubtotal  = grossTotal - lineDiscTotal;
  const quoteDiscAmt  = quoteDiscType==="pct" ? lineSubtotal*(quoteDisc/100) : Math.min(+quoteDisc, lineSubtotal);
  const afterDisc     = lineSubtotal - quoteDiscAmt;
  const taxAmt        = afterDisc * (taxRate/100);
  const total         = afterDisc + taxAmt + +extraCharge;
  const totalItems    = lineItems.reduce((s,i) => s+i.qty, 0);
  const totalSaved    = lineDiscTotal + quoteDiscAmt;

  const statusCfg = {
    draft:    { c:"var(--ink40)", bg:"var(--warm2)",   br:"var(--ink10)",  dot:"#9E9080",  label:"Draft"    },
    sent:     { c:"var(--blue)",  bg:"var(--bluebg)",  br:"var(--bluebr)", dot:"#2B5490",  label:"Sent"     },
    accepted: { c:"var(--green)", bg:"var(--greenbg)", br:"var(--greenbr)",dot:"#3D8A65",  label:"Accepted" },
    rejected: { c:"var(--red)",   bg:"var(--redbg)",   br:"var(--redbr)",  dot:"#B5372A",  label:"Rejected" },
    expired:  { c:"var(--gold)",  bg:"var(--goldbg)",  br:"var(--goldbr)", dot:"#B8902A",  label:"Expired"  },
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="page">

        {/* TOPBAR */}
        <header className="tb">
          <div className="tb-l">
            <div className="brand">
              <div className="bmark">N</div>
              <div><div className="bname">Nexus POS</div><div className="bsub">Quotations</div></div>
            </div>
            <div className="bc">
              <span className="bca">Dashboard</span><span className="bcsep">›</span>
              <span className="bca">Documents</span><span className="bcsep">›</span>
              <span className="bccur">New Quotation</span>
            </div>
          </div>
        </header>

        <div className="body">

          {/* ══ LEFT ══ */}
          <div className="col-l">

            <div className="card">
              <div className="ctitle">Quotation Details</div>
              <div className="field">
                <label className="lbl">Quote No.</label>
                <input className="inp" readOnly value={quoteNo} />
              </div>
              <div className="g2">
                <div className="field">
                  <label className="lbl">Issue Date</label>
                  <input className="inp" readOnly value={new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})} style={{ fontSize:11 }} />
                </div>
                <div className="field">
                  <label className="lbl">Status</label>
                  <div style={{ position:"relative" }}>
                    <select className="inp" value={status} onChange={e => setStatus(e.target.value)} style={{ paddingRight:28, cursor:"pointer" }}>
                      {Object.entries(statusCfg).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <span style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", fontSize:9, color:"var(--ink30)", pointerEvents:"none" }}>▾</span>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="lbl">Reference No.</label>
                <input className="inp" placeholder="e.g. PO-2025-001" value={reference} onChange={e => setReference(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Subject</label>
                <input className="inp" placeholder="e.g. Electronics wholesale Q2" value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              <div className="field">
                <label className="lbl">Tax Rate (%)</label>
                <input type="number" className="inp" min={0} max={30} step={0.5} value={taxRate} onChange={e => setTaxRate(+e.target.value)} />
              </div>
            </div>

            <div className="card">
              <div className="ctitle">Validity Period</div>
              <div className="g2">
                <div className="field1">
                  <label className="lbl">Valid From</label>
                  <input type="date" className="inp" value={validFrom} onChange={e => { setValidFrom(e.target.value); setValidDays(null); }} />
                </div>
                <div className="field1">
                  <label className="lbl">Valid Until</label>
                  <input type="date" className="inp" value={validUntil} onChange={e => { setValidUntil(e.target.value); setValidDays(null); }} />
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 11px", background:"var(--warm)", border:"1px solid var(--ink10)", borderRadius:6, marginBottom:8 }}>
                <span style={{ fontSize:11, color:"var(--ink50)", fontWeight:600 }}>Duration</span>
                <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:13, fontWeight:700, color:daysLeft===0?"var(--red)":daysLeft<=7?"var(--gold)":"var(--green)" }}>
                  {daysLeft===0?"Expired":`${daysLeft} day${daysLeft!==1?"s":""}`}
                </span>
              </div>
              <div className="vq-row">
                {[7,14,30,60,90].map(d => (
                  <button key={d} className={`vq-btn${validDays===d?" on":""}`} onClick={() => setValidity(d)}>{d}d</button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="ctitle">Customer</div>

              {/* Always-visible pill */}
              {customer.id !== 0 ? (
                <div className="cust-pill" style={{ marginBottom: 8 }}>
                  <div className="cust-pill-av" style={{ background: customer.bg, border: `1.5px solid ${customer.color}35`, color: customer.color }}>
                    {customer.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="cust-pill-name">{customer.name}</div>
                    <div className="cust-pill-sub">{customer.phone}<br/>{customer.email}<br/>{customer.city}</div>
                    <div className="cust-pill-tags">
                      {customer.tags?.map(t => {
                        const s = TAG_COLORS[t] || {};
                        return <span key={t} className="tc" style={{ background: s.bg, border: `1px solid ${s.br}`, color: s.c }}>{t}</span>;
                      })}
                    </div>
                  </div>
                  <button className="cust-change" onClick={() => setShowCustMod(true)}>Change</button>
                </div>
              ) : (
                <div className="cust-pill" style={{ marginBottom: 8, borderColor: "var(--ink10)", background: "var(--warm)" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: "var(--ink10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>💵</div>
                  <div style={{ flex: 1 }}>
                    <div className="cust-pill-name">Walk-in Customer</div>
                    <div className="cust-pill-sub">Counter sale · No account</div>
                  </div>
                  <button className="cust-change" onClick={() => setShowCustMod(true)}>Change</button>
                </div>
              )}

              {/* Select customer button — always visible */}
              <button className="cust-trigger" onClick={() => setShowCustMod(true)}>
                <div className="cust-trigger-ico">👤</div>
                <div>
                  <div className="cust-trigger-text">Select Customer</div>
                  <div className="cust-trigger-sub">Search &amp; link a customer record</div>
                </div>
                <span style={{ marginLeft: "auto", color: "var(--gold)", fontSize: 18 }}>›</span>
              </button>
            </div>

            <div className="card">
              <div className="ctitle">Terms &amp; Notes</div>
              <textarea className="nota" rows={3} value={terms} onChange={e => setTerms(e.target.value)} placeholder="Payment terms, notes…" />
            </div>

          </div>

          {/* ══ MIDDLE ══ */}
          <div className="col-m">
            <div className="mcard">
              <div className="mhead">
                <div className="mtitle">Line Items</div>
                <button className="prod-trigger-btn" onClick={() => setShowProdMod(true)}>
                  ⊞ Select Products {lineItems.length>0 && `· ${lineItems.length}`}
                </button>
              </div>

              <div className="tscroll">
                {lineItems.length===0 ? (
                  <div className="tempty">
                    <div style={{ fontSize:32 }}>📦</div>
                    <div>Click <strong>Select Products</strong> above to add items</div>
                    <button className="prod-trigger-btn" style={{ border:"1.5px dashed rgba(184,144,42,.35)", marginTop:4 }} onClick={() => setShowProdMod(true)}>⊞ Browse Products</button>
                  </div>
                ) : (
                  <>
                    <div className="thead">
                      <span className="tth">#</span>
                      <span className="tth">Product</span>
                      <span className="tth">Category</span>
                      <span className="tth">Unit Price</span>
                      <span className="tth" style={{ textAlign:"center" }}>Disc %</span>
                      <span className="tth" style={{ textAlign:"right" }}>Disc. Price</span>
                      <span className="tth" style={{ textAlign:"center" }}>Qty</span>
                      <span className="tth" style={{ textAlign:"right" }}>Total</span>
                      <span/>
                    </div>
                    {lineItems.map((item, i) => {
                      const discUnit  = item.unitPrice * (1 - item.lineDisc/100);
                      const grossLine = item.unitPrice * item.qty;
                      const netLine   = discUnit * item.qty;
                      const cc = CAT_COLORS[item.cat]||"#6B5F54";
                      return (
                        <div className="trow" key={item.id}>
                          <span className="tnum">{String(i+1).padStart(2,"0")}</span>
                          <div>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:30, height:30, borderRadius:7, background:"var(--warm2)", border:"1px solid var(--ink10)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{item.icon}</div>
                              <div style={{ minWidth:0 }}>
                                <div className="tpname">{item.name}</div>
                                <div className="tsku">{item.sku}</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span style={{ padding:"2px 7px", borderRadius:3, fontSize:9.5, fontWeight:700, background:`${cc}15`, color:cc, border:`1px solid ${cc}28` }}>{item.cat}</span>
                          </div>
                          <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:12.5, fontWeight:600, color:"var(--ink70)" }}>${fmt(item.unitPrice)}</span>
                          <input className="tdinp" type="number" min={0} max={100} value={item.lineDisc}
                            onChange={e => updateItem(item.id, "lineDisc", Math.max(0, Math.min(100, +e.target.value)))} />
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:12.5, fontWeight:700, color:"var(--green)" }}>${fmt(discUnit)}</div>
                            {item.lineDisc>0 && <div style={{ fontSize:9.5, color:"var(--green)", opacity:.7 }}>save ${fmt(grossLine-netLine)}</div>}
                          </div>
                          <input className="tinp" type="number" min={1} value={item.qty}
                            onChange={e => updateItem(item.id, "qty", Math.max(1, +e.target.value))} />
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:13, fontWeight:700, color:"var(--ink)" }}>${fmt(grossLine)}</div>
                            {item.lineDisc>0 && <div style={{ fontSize:9.5, color:"var(--green)" }}>net ${fmt(netLine)}</div>}
                          </div>
                          <button className="trm" onClick={() => removeItem(item.id)}>×</button>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              <div className="tbar">
                <div className="tgrid">
                  <div className="ti"><div className="tlbl">Gross Total</div><div className="tval">${fmt(grossTotal)}</div></div>
                  <div className="ti"><div className="tlbl">Line Discounts</div><div className="tval" style={{ color:lineDiscTotal>0?"#86efac":undefined }}>−${fmt(lineDiscTotal)}</div></div>
                  <div className="ti"><div className="tlbl">Net Subtotal</div><div className="tval">${fmt(lineSubtotal)}</div></div>
                  <div className="tdiv"/>
                  <div className="ti tgrand"><div className="tlbl">Payable Total</div><div className="tval">${fmt(total)}</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="col-r">
            <div className="rcard">
              <div className="rhead">
                <div className="rsub">Discounts &amp; Details</div>
                <div className="rtitle">Order Summary</div>
              </div>
              <div className="rbody">

                <div>
                  <div className="sec">Quotation Discount</div>
                  <div className="dtabs">
                    <button className={`dtab${quoteDiscType==="pct"?" active":""}`} onClick={() => { setQuoteDiscType("pct"); setQuoteDisc(0); }}>% Percentage</button>
                    <button className={`dtab${quoteDiscType==="amt"?" active":""}`} onClick={() => { setQuoteDiscType("amt"); setQuoteDisc(0); }}>$ Fixed</button>
                  </div>
                  <div className="dinpwrap">
                    <input className="dinp" type="number" min={0} max={quoteDiscType==="pct"?100:undefined} step={quoteDiscType==="pct"?.5:.01}
                      value={quoteDisc} onChange={e => setQuoteDisc(+e.target.value)} placeholder="0" />
                    <span className="dunit">{quoteDiscType==="pct"?"%":"$"}</span>
                  </div>
                  {quoteDiscAmt>0 && <div style={{ marginTop:5, fontSize:11, color:"var(--green)", fontWeight:600 }}>Saving ${fmt(quoteDiscAmt)} on this quotation</div>}
                </div>

                <div>
                  <div className="sec">Additional Charge</div>
                  <div className="exrow">
                    <div className="field" style={{ marginBottom:0 }}>
                      <label className="lbl">Label</label>
                      <input className="cinp" value={extraLabel} onChange={e => setExtraLabel(e.target.value)} placeholder="e.g. Delivery" />
                    </div>
                    <div className="field" style={{ marginBottom:0 }}>
                      <label className="lbl">Amount</label>
                      <input className="cinp" type="number" min={0} step={0.5} value={extraCharge} onChange={e => setExtraCharge(+e.target.value)} />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="sec">Quote Status</div>
                  <div className="status-row">
                    {Object.entries(statusCfg).map(([k,v]) => (
                      <button key={k} className={`stat-btn${status===k?" on":""}`}
                        style={status===k?{"--sb-bg":v.bg,"--sb-br":v.br,"--sb-c":v.c}:{}}
                        onClick={() => setStatus(k)}>
                        <span className="sdot" style={{ background:v.dot }}/>{v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="sec">Order Summary</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                    <div style={{ background:"var(--warm)", border:"1px solid var(--ink10)", borderRadius:6, padding:"10px 12px" }}>
                      <div style={{ fontSize:9, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:"var(--ink40)", marginBottom:4 }}>Items</div>
                      <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:20, fontWeight:600, color:"var(--ink)" }}>{lineItems.length}</div>
                      <div style={{ fontSize:10.5, color:"var(--ink40)", marginTop:2 }}>{totalItems} unit{totalItems!==1?"s":""}</div>
                    </div>
                    <div style={{ background:"var(--greenbg)", border:"1px solid var(--greenbr)", borderRadius:6, padding:"10px 12px" }}>
                      <div style={{ fontSize:9, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:"var(--green)", marginBottom:4 }}>Savings</div>
                      <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:20, fontWeight:600, color:"var(--green)" }}>${fmt(totalSaved)}</div>
                      <div style={{ fontSize:10.5, color:"var(--green)", opacity:.7, marginTop:2 }}>total discounts</div>
                    </div>
                  </div>
                  <div className="srow"><span className="slbl">Gross Total</span><span className="sval">${fmt(grossTotal)}</span></div>
                  {lineDiscTotal>0 && <div className="srow disc"><span className="slbl">Line Discounts</span><span className="sval">−${fmt(lineDiscTotal)}</span></div>}
                  <div className="srow"><span className="slbl">Net Subtotal</span><span className="sval">${fmt(lineSubtotal)}</span></div>
                  {quoteDiscAmt>0 && <div className="srow disc"><span className="slbl">Quote Discount</span><span className="sval">−${fmt(quoteDiscAmt)}</span></div>}
                  <div className="srow"><span className="slbl">Tax ({taxRate}%)</span><span className="sval">${fmt(taxAmt)}</span></div>
                  {+extraCharge>0 && <div className="srow"><span className="slbl">{extraLabel||"Extra"}</span><span className="sval">+${fmt(+extraCharge)}</span></div>}
                  <div className="srow">
                    <span className="slbl">Valid for</span>
                    <span className="sval" style={{ color:daysLeft===0?"var(--red)":daysLeft<=7?"var(--gold)":"var(--green)", fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>
                      {daysLeft===0?"Expired":`${daysLeft} days`}
                    </span>
                  </div>
                  <div className="shr"/>
                  <div className="stot">
                    <span className="stlbl">Total Payable</span>
                    <span className="stval">${fmt(total)}</span>
                  </div>
                </div>

                <div style={{ flex:1 }}/>
                <button className="issue-btn"
                  disabled={lineItems.length === 0}
                  onClick={() => setShowSummary(true)}>
                  ✉ Send Quotation →
                </button>
                <button className="draft-btn">💾 Save as Draft</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showCustMod && (
        <CustomerSelectionModal
          open={showCustMod}
          selected={customer}
          onSelect={c => setCustomer(c)}
          onClose={() => setShowCustMod(false)}
          onAddNew={() => {
            setShowCustMod(false);
            // open your AddCustomerModal here if wired up
          }}
        />
      )}
      {showProdMod && (
        <ProductModal
          currentItems={lineItems.map(i => ({ productId:i.productId, name:i.name, sku:i.sku, icon:i.icon, cat:i.cat, unitPrice:i.unitPrice, tax:i.tax, qty:i.qty, lineDisc:i.lineDisc }))}
          onConfirm={handleProdsConfirmed}
          onClose={() => setShowProdMod(false)}
        />
      )}
      {showSummary && (
        <QuotationSummaryModal
          isOpen={showSummary}
          quoteNo={quoteNo}
          customer={{ name: customer.name, address: customer.city || "—", email: customer.email, phone: customer.phone }}
          lineItems={lineItems.map(i => ({ ...i, price: i.unitPrice }))}
          grossTotal={grossTotal}
          lineDiscTotal={lineDiscTotal}
          quoteDiscAmt={quoteDiscAmt}
          taxRate={taxRate}
          taxAmt={taxAmt}
          extraCharge={extraCharge}
          extraLabel={extraLabel}
          total={total}
          status={status}
          issueDate={new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
          validFrom={validFrom}
          validUntil={validUntil}
          reference={reference}
          subject={subject}
          terms={terms}
          onClose={() => setShowSummary(false)}
          onNewQuote={() => { setShowSummary(false); /* reset form */ }}
          onConvertToInvoice={() => { setShowSummary(false); /* navigate to invoice */ }}
        />
      )}
    </>
  );
}