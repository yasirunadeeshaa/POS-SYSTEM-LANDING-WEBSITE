import { useState, useMemo } from "react";

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const QUOTATIONS = [
  { id: 1,  quoteNo:"QUO-2026-041", customer:"Ravi Mendis",        customerCity:"Colombo",    customerEmail:"ravi.m@email.com",      status:"accepted", total:284.50, items:4, issueDate:"2026-03-10", validUntil:"2026-04-09", reference:"PO-2026-014", subject:"Electronics Q1",         tags:["vip","gold"]      },
  { id: 2,  quoteNo:"QUO-2026-040", customer:"Kamal Silva",         customerCity:"Kandy",      customerEmail:"kamal.s@sltnet.lk",    status:"sent",     total:620.00, items:8, issueDate:"2026-03-09", validUntil:"2026-04-08", reference:"PO-2026-013", subject:"Wholesale Apparel",      tags:["wholesale"]       },
  { id: 3,  quoteNo:"QUO-2026-039", customer:"Nimesha Gunawardena", customerCity:"Colombo",    customerEmail:"nimesha.g@gmail.com",  status:"draft",    total:148.75, items:3, issueDate:"2026-03-09", validUntil:"2026-04-08", reference:"",            subject:"Home & Lifestyle",       tags:["vip","gold"]      },
  { id: 4,  quoteNo:"QUO-2026-038", customer:"Dilhara Fernando",    customerCity:"Negombo",    customerEmail:"dilhara.f@hotmail.com",status:"rejected", total:89.99,  items:2, issueDate:"2026-03-07", validUntil:"2026-04-06", reference:"",            subject:"Accessories Bundle",     tags:["new"]             },
  { id: 5,  quoteNo:"QUO-2026-037", customer:"Asanka Liyanage",     customerCity:"Colombo",    customerEmail:"asanka.l@hotmail.com", status:"accepted", total:932.40, items:11,issueDate:"2026-03-06", validUntil:"2026-04-05", reference:"PO-2026-010", subject:"Wholesale Electronics",  tags:["vip","wholesale"] },
  { id: 6,  quoteNo:"QUO-2026-036", customer:"Walk-in Customer",    customerCity:"—",          customerEmail:"—",                    status:"expired",  total:55.00,  items:2, issueDate:"2026-02-12", validUntil:"2026-03-13", reference:"",            subject:"",                       tags:[]                  },
  { id: 7,  quoteNo:"QUO-2026-035", customer:"Ruwan Bandara",       customerCity:"Kandy",      customerEmail:"ruwan.b@gmail.com",    status:"sent",     total:210.00, items:5, issueDate:"2026-03-05", validUntil:"2026-04-04", reference:"PO-2026-009", subject:"Sports & Lifestyle",     tags:["regular","vip"]   },
  { id: 8,  quoteNo:"QUO-2026-034", customer:"Priya Silva",         customerCity:"Nugegoda",   customerEmail:"priya.s@yahoo.com",    status:"accepted", total:76.45,  items:3, issueDate:"2026-03-04", validUntil:"2026-04-03", reference:"",            subject:"Stationery Order",       tags:["regular"]         },
  { id: 9,  quoteNo:"QUO-2026-033", customer:"Kasun Fernando",      customerCity:"Kelaniya",   customerEmail:"kasun.f@sltnet.lk",    status:"draft",    total:320.00, items:6, issueDate:"2026-03-03", validUntil:"2026-04-02", reference:"PO-2026-007", subject:"IT Accessories",         tags:["regular"]         },
  { id: 10, quoteNo:"QUO-2026-032", customer:"Daniel Wijayaratne",  customerCity:"Maharagama", customerEmail:"daniel.w@hotmail.com", status:"rejected", total:450.00, items:7, issueDate:"2026-03-01", validUntil:"2026-03-31", reference:"PO-2026-006", subject:"Wholesale General",      tags:["vip","wholesale"] },
  { id: 11, quoteNo:"QUO-2026-031", customer:"Amara Perera",        customerCity:"Wattala",    customerEmail:"amara.p@gmail.com",    status:"sent",     total:132.80, items:4, issueDate:"2026-02-28", validUntil:"2026-03-29", reference:"",            subject:"Home Decor",             tags:["new"]             },
  { id: 12, quoteNo:"QUO-2026-030", customer:"Sithara Bandara",     customerCity:"Colombo",    customerEmail:"sithara.b@gmail.com",  status:"accepted", total:865.20, items:9, issueDate:"2026-02-25", validUntil:"2026-03-26", reference:"PO-2026-004", subject:"VIP Electronics Bundle", tags:["vip"]             },
];

const STATUS_META = {
  draft:    { color:"#9E9080", bg:"rgba(158,144,128,.1)",  border:"rgba(158,144,128,.28)", label:"Draft",    dot:"#9E9080"  },
  sent:     { color:"#2B5490", bg:"rgba(43,84,144,.08)",   border:"rgba(43,84,144,.28)",   label:"Sent",     dot:"#2B5490"  },
  accepted: { color:"#2D6A4F", bg:"rgba(45,106,79,.08)",   border:"rgba(45,106,79,.28)",   label:"Accepted", dot:"#3D8A65"  },
  rejected: { color:"#B5372A", bg:"rgba(181,55,42,.08)",   border:"rgba(181,55,42,.25)",   label:"Rejected", dot:"#B5372A"  },
  expired:  { color:"#B8902A", bg:"rgba(184,144,42,.08)",  border:"rgba(184,144,42,.25)",  label:"Expired",  dot:"#B8902A"  },
};

const TAG_COLORS = {
  vip:       { bg:"rgba(184,144,42,.1)",  border:"rgba(184,144,42,.28)", color:"#B8902A" },
  gold:      { bg:"rgba(184,144,42,.08)", border:"rgba(184,144,42,.2)",  color:"#D4A83C" },
  wholesale: { bg:"rgba(43,84,144,.08)",  border:"rgba(43,84,144,.22)",  color:"#2B5490" },
  regular:   { bg:"rgba(45,106,79,.08)",  border:"rgba(45,106,79,.2)",   color:"#2D6A4F" },
  new:       { bg:"rgba(91,61,143,.08)",  border:"rgba(91,61,143,.2)",   color:"#5B3D8F" },
};

const AV_COLORS = [
  ["#9E9080","rgba(158,144,128,.15)"],
  ["#2B5490","rgba(43,84,144,.15)"], ["#5B3D8F","rgba(91,61,143,.15)"],
  ["#2D6A4F","rgba(45,106,79,.15)"], ["#B8902A","rgba(184,144,42,.15)"],
  ["#B5372A","rgba(181,55,42,.15)"], ["#7A5C1E","rgba(122,92,30,.15)"],
  ["#8A3A6A","rgba(138,58,106,.15)"],["#1B6B8A","rgba(27,107,138,.15)"],
];

const fmt      = (n) => Number(n || 0).toFixed(2);
const initials = (n) => (n || "").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
const avColor  = (name) => AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];

const STATUS_FILTERS = ["all", "draft", "sent", "accepted", "rejected", "expired"];

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --cream:#F6F3EC; --paper:#FDFBF7; --warm:#EEE9DF; --warm2:#E4DDD2;
    --ink:#1B1713; --ink70:#4B4038; --ink50:#6B5F54; --ink40:#9E9080;
    --ink20:#C9C0B2; --ink10:#E4DDD2; --ink06:#EDE8E0; --ink03:#F5F1EB;
    --gold:#B8902A; --goldl:#D4A83C; --goldd:#8A6A1A;
    --goldbg:rgba(184,144,42,.07); --goldbr:rgba(184,144,42,.22);
    --green:#2D6A4F; --greenbg:rgba(45,106,79,.08); --greenbr:rgba(45,106,79,.25);
    --red:#B5372A; --redbg:rgba(181,55,42,.08); --redbr:rgba(181,55,42,.22);
    --blue:#2B5490; --bluebg:rgba(43,84,144,.08); --bluebr:rgba(43,84,144,.22);
    --s0:0 1px 3px rgba(27,23,19,.06); --s1:0 4px 14px rgba(27,23,19,.1);
    --s2:0 8px 28px rgba(27,23,19,.13);
  }
  html,body,#root{height:100%;background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--ink)}

  /* ── Page shell ── */
  .qh-page{min-height:100vh;display:flex;flex-direction:column;background:var(--cream)}

  /* ── Topbar ── */
  .qh-tb{height:54px;flex-shrink:0;background:var(--ink);border-bottom:2px solid var(--gold);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:50}
  .qh-tb-l{display:flex;align-items:center;gap:20px}
  .qh-brand{display:flex;align-items:center;gap:10px}
  .qh-bmark{width:30px;height:30px;border-radius:5px;border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--goldl)}
  .qh-bname{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#F6F3EC}
  .qh-bsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-top:1px}
  .qh-bc{display:flex;align-items:center;gap:7px;font-size:11.5px}
  .qh-bca{color:rgba(246,243,236,.3);cursor:pointer;transition:color .15s}.qh-bca:hover{color:rgba(246,243,236,.65)}
  .qh-bcsep{color:rgba(246,243,236,.15)}.qh-bccur{color:var(--goldl);font-weight:500}
  .qh-tb-r{display:flex;align-items:center;gap:8px}
  .qh-new-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:5px;background:var(--gold);border:1px solid var(--goldd);color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
  .qh-new-btn:hover{background:var(--goldl);transform:translateY(-1px);box-shadow:0 4px 14px rgba(184,144,42,.4)}

  /* ── Main content ── */
  .qh-main{flex:1;padding:22px 24px 32px;max-width:1400px;width:100%;margin:0 auto}

  /* ── Page header ── */
  .qh-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:22px}
  .qh-header-left{}
  .qh-eyebrow{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:5px;display:flex;align-items:center;gap:8px}
  .qh-eyebrow::before{content:'';width:18px;height:1px;background:var(--gold);opacity:.6}
  .qh-page-title{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:600;color:var(--ink);line-height:1;letter-spacing:-.3px}
  .qh-page-sub{font-size:12px;color:var(--ink40);margin-top:5px}

  /* ── Stat cards ── */
  .qh-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px}
  .qh-stat{background:var(--paper);border:1px solid var(--ink10);border-radius:8px;padding:13px 15px;box-shadow:var(--s0);cursor:pointer;transition:all .16s;position:relative;overflow:hidden}
  .qh-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:var(--sc,var(--ink10));opacity:.7;transition:opacity .15s}
  .qh-stat:hover{border-color:var(--ink20);box-shadow:var(--s1);transform:translateY(-2px)}
  .qh-stat:hover::before{opacity:1}
  .qh-stat.active{border-color:var(--sc,var(--ink10));box-shadow:0 0 0 2px rgba(var(--scr),0.12)}
  .qh-stat-lbl{font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink40);margin-bottom:6px}
  .qh-stat-val{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:var(--ink);line-height:1}
  .qh-stat-sub{font-size:10.5px;color:var(--ink40);margin-top:3px}
  .qh-stat-dot{width:7px;height:7px;border-radius:50%;background:var(--sc);display:inline-block;margin-right:5px;vertical-align:middle}

  /* ── Toolbar ── */
  .qh-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}
  .qh-search-wrap{position:relative;flex:1;min-width:220px;max-width:360px}
  .qh-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--ink30);pointer-events:none;font-size:13px}
  .qh-search{width:100%;padding:9px 34px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;color:var(--ink);outline:none;transition:all .18s}
  .qh-search::placeholder{color:var(--ink20)}
  .qh-search:hover{border-color:var(--ink20)}
  .qh-search:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}
  .qh-search-clr{position:absolute;right:9px;top:50%;transform:translateY(-50%);width:18px;height:18px;border-radius:50%;background:var(--ink10);border:none;color:var(--ink40);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s;font-size:11px}
  .qh-search-clr:hover{background:var(--ink20)}

  .qh-filter-tabs{display:flex;gap:4px;flex-wrap:wrap}
  .qh-ftab{padding:6px 13px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:1.5px solid var(--ink10);background:var(--paper);color:var(--ink50);transition:all .14s;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:5px}
  .qh-ftab:hover{border-color:var(--ink20);background:var(--warm)}
  .qh-ftab.on{background:var(--goldbg);border-color:var(--goldbr);color:var(--gold)}

  .qh-sort-wrap{position:relative;margin-left:auto}
  .qh-sort{padding:8px 28px 8px 11px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;color:var(--ink50);outline:none;cursor:pointer;appearance:none;transition:border-color .15s}
  .qh-sort:focus{border-color:var(--gold)}
  .qh-sort-arrow{position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:9px;color:var(--ink30);pointer-events:none}

  /* ── Table ── */
  .qh-table-wrap{background:var(--paper);border:1px solid var(--ink10);border-radius:10px;box-shadow:var(--s0);overflow:hidden}
  .qh-thead{display:grid;grid-template-columns:52px 2fr 140px 140px 110px 120px 100px 80px;gap:0;padding:9px 18px;background:#EDE8DE;border-bottom:2px solid var(--gold);position:sticky;top:54px;z-index:10}
  .qh-th{font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink40);display:flex;align-items:center;gap:4px}
  .qh-th.right{justify-content:flex-end}
  .qh-th.center{justify-content:center}
  .qh-th-sort{cursor:pointer;user-select:none;transition:color .13s}
  .qh-th-sort:hover{color:var(--ink70)}

  /* Row */
  .qh-row{display:grid;grid-template-columns:52px 2fr 140px 140px 110px 120px 100px 80px;gap:0;padding:12px 18px;border-bottom:1px solid var(--ink06);align-items:center;transition:background .12s;cursor:pointer;animation:qhRowIn .24s ease both}
  @keyframes qhRowIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
  .qh-row:last-child{border-bottom:none}
  .qh-row:hover{background:var(--warm)}
  .qh-row:hover .qh-row-actions{opacity:1}

  /* Col: # */
  .qh-col-num{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink20);font-weight:600}

  /* Col: Quote */
  .qh-col-quote{display:flex;align-items:center;gap:11px;min-width:0;padding-right:10px}
  .qh-av{width:36px;height:36px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;letter-spacing:.3px}
  .qh-quote-wrap{min-width:0}
  .qh-quote-no{font-family:'Geist Mono',monospace;font-size:10.5px;font-weight:600;color:var(--gold);margin-bottom:2px}
  .qh-cust-name{font-size:13px;font-weight:700;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .qh-cust-city{font-size:10.5px;color:var(--ink40);margin-top:1px}

  /* Col: Tags */
  .qh-col-tags{display:flex;gap:4px;flex-wrap:wrap;padding-right:8px}
  .qh-tag{font-size:8.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;padding:2px 7px;border-radius:20px}

  /* Col: Subject */
  .qh-col-subject{padding-right:10px;min-width:0}
  .qh-subject{font-size:12px;color:var(--ink70);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
  .qh-ref{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink30);margin-top:2px}

  /* Col: Date */
  .qh-col-date{padding-right:10px}
  .qh-date-val{font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink50);font-weight:500}
  .qh-date-valid{font-size:10px;color:var(--ink30);margin-top:2px}
  .qh-date-valid.expiring{color:var(--gold)}
  .qh-date-valid.expired{color:var(--red)}

  /* Col: Status */
  .qh-col-status{}
  .qh-status{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:20px;font-size:10.5px;font-weight:700}
  .qh-sdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}

  /* Col: Total */
  .qh-col-total{text-align:right;padding-right:10px}
  .qh-total-val{font-family:'Geist Mono',monospace;font-size:13px;font-weight:700;color:var(--ink)}
  .qh-items-count{font-size:10px;color:var(--ink40);margin-top:2px}

  /* Col: Actions */
  .qh-col-actions{display:flex;justify-content:flex-end;gap:4px}
  .qh-row-actions{opacity:0;transition:opacity .15s;display:flex;gap:4px}
  .qh-action-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--ink10);background:var(--paper);color:var(--ink40);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all .13s}
  .qh-action-btn:hover{background:var(--warm);border-color:var(--ink20);color:var(--ink70)}
  .qh-action-btn.gold:hover{background:var(--goldbg);border-color:var(--goldbr);color:var(--gold)}
  .qh-action-btn.green:hover{background:var(--greenbg);border-color:var(--greenbr);color:var(--green)}
  .qh-action-btn.red:hover{background:var(--redbg);border-color:var(--redbr);color:var(--red)}

  /* Empty state */
  .qh-empty{padding:72px 32px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
  .qh-empty-icon{font-size:42px;opacity:.2}
  .qh-empty-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink50)}
  .qh-empty-sub{font-size:13px;color:var(--ink30);max-width:280px;line-height:1.6}
  .qh-empty-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:6px;background:var(--gold);border:1px solid var(--goldd);color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif;margin-top:4px}
  .qh-empty-btn:hover{background:var(--goldl);transform:translateY(-1px)}

  /* Footer */
  .qh-footer{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid var(--ink06);background:var(--paper);font-size:11px;color:var(--ink40)}
  .qh-footer strong{color:var(--ink60);font-weight:700}

  /* Highlight match */
  .qh-hl{background:rgba(184,144,42,.28);color:var(--gold);border-radius:2px;padding:0 1px}

  @media(max-width:900px){
    .qh-thead{grid-template-columns:2fr 110px 100px 80px;.qh-th:nth-child(1),.qh-th:nth-child(3),.qh-th:nth-child(5){display:none}}
    .qh-row{grid-template-columns:2fr 110px 100px 80px}
    .qh-row>:nth-child(1),.qh-row>:nth-child(3),.qh-row>:nth-child(5){display:none}
    .qh-stats{grid-template-columns:repeat(3,1fr)}
    .qh-stats>:nth-child(4),.qh-stats>:nth-child(5){display:none}
  }

  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .qh-stats{animation:fadeUp .2s ease both}
  .qh-table-wrap{animation:fadeUp .22s .06s ease both}
`;

// ── HIGHLIGHT HELPER ──────────────────────────────────────────────────────────
function Hl({ text, q }) {
  if (!q || !text) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return <>{text.slice(0, i)}<mark className="qh-hl">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function QuotationHistory({ onNewQuote, onViewQuote }) {
  const [search,     setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy,     setSortBy]     = useState("date-desc");

  // Stats
  const stats = useMemo(() => {
    const counts = { all: QUOTATIONS.length };
    Object.keys(STATUS_META).forEach(s => {
      counts[s] = QUOTATIONS.filter(q => q.status === s).length;
    });
    const totalValue    = QUOTATIONS.reduce((s, q) => s + q.total, 0);
    const acceptedValue = QUOTATIONS.filter(q => q.status === "accepted").reduce((s, q) => s + q.total, 0);
    return { counts, totalValue, acceptedValue };
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = QUOTATIONS.filter(item => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchSearch = !q ||
        item.quoteNo.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.customerCity.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
    switch (sortBy) {
      case "date-desc":  list = [...list].sort((a, b) => b.issueDate.localeCompare(a.issueDate)); break;
      case "date-asc":   list = [...list].sort((a, b) => a.issueDate.localeCompare(b.issueDate)); break;
      case "total-desc": list = [...list].sort((a, b) => b.total - a.total); break;
      case "total-asc":  list = [...list].sort((a, b) => a.total - b.total); break;
      case "customer":   list = [...list].sort((a, b) => a.customer.localeCompare(b.customer)); break;
    }
    return list;
  }, [search, statusFilter, sortBy]);

  const daysLeft = (until) => {
    if (!until) return null;
    return Math.ceil((new Date(until) - new Date()) / 864e5);
  };

  const statCards = [
    { key:"all",      label:"All Quotes",   val:stats.counts.all,      color:"#B8902A", sub:`$${fmt(stats.totalValue)} total value` },
    { key:"sent",     label:"Sent",         val:stats.counts.sent,     color:"#2B5490", sub:"Awaiting response"    },
    { key:"accepted", label:"Accepted",     val:stats.counts.accepted, color:"#2D6A4F", sub:`$${fmt(stats.acceptedValue)} confirmed` },
    { key:"draft",    label:"Draft",        val:stats.counts.draft,    color:"#9E9080", sub:"Not yet sent"         },
    { key:"expired",  label:"Expired",      val:stats.counts.expired,  color:"#B5372A", sub:"Past validity"        },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="qh-page">

        {/* ── TOPBAR ── */}
        <header className="qh-tb">
          <div className="qh-tb-l">
            <div className="qh-brand">
              <div className="qh-bmark">N</div>
              <div>
                <div className="qh-bname">Nexus POS</div>
                <div className="qh-bsub">Documents</div>
              </div>
            </div>
            <div className="qh-bc">
              <span className="qh-bca">Dashboard</span>
              <span className="qh-bcsep">›</span>
              <span className="qh-bca">Documents</span>
              <span className="qh-bcsep">›</span>
              <span className="qh-bccur">Quotations</span>
            </div>
          </div>
          <div className="qh-tb-r">
            <button className="qh-new-btn" onClick={onNewQuote}>
              ✦ New Quotation
            </button>
          </div>
        </header>

        <div className="qh-main">

          {/* ── PAGE HEADER ── */}
          <div className="qh-header">
            <div className="qh-header-left">
              <div className="qh-eyebrow">Documents · Procurement</div>
              <div className="qh-page-title">Quotation History</div>
              <div className="qh-page-sub">{QUOTATIONS.length} quotations · {new Date().toLocaleDateString("en-US", { month:"long", year:"numeric" })}</div>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="qh-stats">
            {statCards.map(sc => (
              <div
                key={sc.key}
                className={`qh-stat${statusFilter === sc.key ? " active" : ""}`}
                style={{ "--sc": sc.color }}
                onClick={() => setStatusFilter(sc.key)}
              >
                <div className="qh-stat-lbl">
                  {sc.key !== "all" && <span className="qh-stat-dot" style={{ background: sc.color }} />}
                  {sc.label}
                </div>
                <div className="qh-stat-val" style={{ color: statusFilter === sc.key ? sc.color : "var(--ink)" }}>
                  {sc.val}
                </div>
                <div className="qh-stat-sub">{sc.sub}</div>
              </div>
            ))}
          </div>

          {/* ── TOOLBAR ── */}
          <div className="qh-toolbar">
            <div className="qh-search-wrap">
              <svg className="qh-search-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="qh-search"
                placeholder="Search by quote no., customer, subject…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="qh-search-clr" onClick={() => setSearch("")}>×</button>
              )}
            </div>

            <div className="qh-filter-tabs">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f}
                  className={`qh-ftab${statusFilter === f ? " on" : ""}`}
                  onClick={() => setStatusFilter(f)}
                >
                  {f === "all" ? "All" : STATUS_META[f]?.label}
                  {f !== "all" && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 10,
                      background: statusFilter === f ? "rgba(184,144,42,.15)" : "var(--ink06)",
                      color: statusFilter === f ? "var(--gold)" : "var(--ink40)",
                    }}>
                      {stats.counts[f]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="qh-sort-wrap">
              <select className="qh-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="date-desc">Date: Newest</option>
                <option value="date-asc">Date: Oldest</option>
                <option value="total-desc">Total: High → Low</option>
                <option value="total-asc">Total: Low → High</option>
                <option value="customer">Customer A–Z</option>
              </select>
              <span className="qh-sort-arrow">▾</span>
            </div>
          </div>

          {/* ── TABLE ── */}
          <div className="qh-table-wrap">
            {/* Column headers */}
            <div className="qh-thead">
              <div className="qh-th">#</div>
              <div className="qh-th">Customer / Quote</div>
              <div className="qh-th">Tags</div>
              <div className="qh-th">Subject</div>
              <div className="qh-th">Issue Date</div>
              <div className="qh-th">Status</div>
              <div className="qh-th right">Total</div>
              <div className="qh-th right">Actions</div>
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="qh-empty">
                <div className="qh-empty-icon">📋</div>
                <div className="qh-empty-title">No quotations found</div>
                <div className="qh-empty-sub">
                  {search ? `No results for "${search}". Try a different search term.` : "No quotations match the selected filter."}
                </div>
                {search && (
                  <button className="qh-empty-btn" onClick={() => { setSearch(""); setStatusFilter("all"); }}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filtered.map((q, i) => {
                const sm  = STATUS_META[q.status] || STATUS_META.draft;
                const [clr, bg] = avColor(q.customer);
                const dl  = daysLeft(q.validUntil);
                const isExpiring = dl !== null && dl <= 7 && dl > 0;
                const isExpired  = dl !== null && dl <= 0;

                return (
                  <div
                    key={q.id}
                    className="qh-row"
                    style={{ animationDelay: `${i * 20}ms` }}
                    onClick={() => onViewQuote?.(q)}
                  >
                    {/* # */}
                    <div className="qh-col-num">{String(i + 1).padStart(2, "0")}</div>

                    {/* Customer / Quote */}
                    <div className="qh-col-quote">
                      <div className="qh-av" style={{ background: bg, border: `1.5px solid ${clr}28`, color: clr }}>
                        {initials(q.customer)}
                      </div>
                      <div className="qh-quote-wrap">
                        <div className="qh-quote-no">
                          <Hl text={q.quoteNo} q={search} />
                        </div>
                        <div className="qh-cust-name">
                          <Hl text={q.customer} q={search} />
                        </div>
                        <div className="qh-cust-city">
                          <Hl text={q.customerCity} q={search} />
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="qh-col-tags">
                      {q.tags.slice(0, 2).map(t => {
                        const tc = TAG_COLORS[t];
                        return tc ? (
                          <span key={t} className="qh-tag" style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.color }}>
                            {t}
                          </span>
                        ) : null;
                      })}
                      {q.tags.length > 2 && (
                        <span style={{ fontSize: 9, color: "var(--ink30)", fontFamily: "'Geist Mono',monospace" }}>+{q.tags.length - 2}</span>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="qh-col-subject">
                      <div className="qh-subject">
                        {q.subject ? <Hl text={q.subject} q={search} /> : <span style={{ color: "var(--ink20)", fontStyle: "italic" }}>—</span>}
                      </div>
                      {q.reference && (
                        <div className="qh-ref"><Hl text={q.reference} q={search} /></div>
                      )}
                    </div>

                    {/* Date */}
                    <div className="qh-col-date">
                      <div className="qh-date-val">{q.issueDate}</div>
                      <div className={`qh-date-valid${isExpiring ? " expiring" : isExpired ? " expired" : ""}`}>
                        {isExpired  ? "Expired"
                         : isExpiring ? `${dl}d left`
                         : dl !== null ? `Until ${q.validUntil}`
                         : "—"}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="qh-col-status">
                      <div className="qh-status" style={{ background: sm.bg, border: `1px solid ${sm.border}`, color: sm.color }}>
                        <span className="qh-sdot" style={{ background: sm.dot }} />
                        {sm.label}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="qh-col-total">
                      <div className="qh-total-val">${fmt(q.total)}</div>
                      <div className="qh-items-count">{q.items} item{q.items !== 1 ? "s" : ""}</div>
                    </div>

                    {/* Actions */}
                    <div className="qh-col-actions">
                      <div className="qh-row-actions" onClick={e => e.stopPropagation()}>
                        <button className="qh-action-btn gold" title="View">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button className="qh-action-btn" title="Print">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                          </svg>
                        </button>
                        {q.status === "accepted" && (
                          <button className="qh-action-btn green" title="Convert to Invoice">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="13 17 18 12 13 7"/><path d="M6 12h12"/><circle cx="12" cy="12" r="10"/>
                            </svg>
                          </button>
                        )}
                        <button className="qh-action-btn red" title="Delete">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}

            {/* Footer */}
            {filtered.length > 0 && (
              <div className="qh-footer">
                <span>
                  Showing <strong>{filtered.length}</strong> of <strong>{QUOTATIONS.length}</strong> quotations
                  {search && <> · matching <strong>"{search}"</strong></>}
                </span>
                <span>
                  Total value: <strong>
                    ${fmt(filtered.reduce((s, q) => s + q.total, 0))}
                  </strong>
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}