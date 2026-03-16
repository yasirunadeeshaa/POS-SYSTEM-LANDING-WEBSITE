import { useState, useMemo, useRef, useEffect } from "react";

const CUSTOMERS = [
  { id: 0, firstName: "Walk-in", lastName: "Customer", phone: "—", email: "—", nic: "—", address: "—", city: "—", tags: [], status: "active", loyaltyPoints: 0, totalSpend: 0, visits: 0, joinedAt: "—", lastVisit: "—", isDefault: true },
  { id: 1, firstName: "Ravi", lastName: "Mendis", phone: "+94 71 234 5678", email: "ravi.mendis@gmail.com", nic: "199012345678", address: "12 Galle Road", city: "Colombo", tags: ["vip", "gold"], status: "active", loyaltyPoints: 4200, totalSpend: 187400, visits: 34, joinedAt: "2022-03-14", lastVisit: "2025-07-01", isDefault: false },
  { id: 2, firstName: "Nishani", lastName: "Perera", phone: "+94 77 891 2345", email: "nishani.p@yahoo.com", nic: "936789012V", address: "45 Duplication Road", city: "Colombo", tags: ["regular"], status: "active", loyaltyPoints: 980, totalSpend: 43200, visits: 11, joinedAt: "2023-01-22", lastVisit: "2025-06-18", isDefault: false },
  { id: 3, firstName: "Kamal", lastName: "Silva", phone: "+94 70 567 8901", email: "—", nic: "880456789V", address: "8 Temple Road", city: "Kandy", tags: ["wholesale"], status: "active", loyaltyPoints: 15600, totalSpend: 620000, visits: 78, joinedAt: "2021-11-05", lastVisit: "2025-07-03", isDefault: false },
  { id: 4, firstName: "Dilhara", lastName: "Fernando", phone: "+94 76 345 6789", email: "dilhara.f@hotmail.com", nic: "991234567V", address: "3 Marine Drive", city: "Negombo", tags: ["new"], status: "active", loyaltyPoints: 120, totalSpend: 6800, visits: 2, joinedAt: "2025-06-28", lastVisit: "2025-07-02", isDefault: false },
  { id: 5, firstName: "Sithara", lastName: "Bandara", phone: "+94 72 678 9012", email: "sithara.b@gmail.com", nic: "870987654V", address: "27 Park Street", city: "Colombo", tags: ["vip"], status: "active", loyaltyPoints: 8750, totalSpend: 312000, visits: 52, joinedAt: "2022-07-19", lastVisit: "2025-06-30", isDefault: false },
  { id: 6, firstName: "Nuwan", lastName: "Jayasinghe", phone: "+94 75 123 4567", email: "nuwan.j@slt.lk", nic: "910234567V", address: "56 High Level Road", city: "Maharagama", tags: ["regular", "wholesale"], status: "active", loyaltyPoints: 3400, totalSpend: 128000, visits: 25, joinedAt: "2023-05-10", lastVisit: "2025-05-22", isDefault: false },
  { id: 7, firstName: "Amara", lastName: "Wickramasinghe", phone: "+94 78 456 7890", email: "amara.w@gmail.com", nic: "960345678V", address: "19 Baseline Road", city: "Colombo", tags: ["gold"], status: "inactive", loyaltyPoints: 2100, totalSpend: 89000, visits: 18, joinedAt: "2023-09-01", lastVisit: "2024-12-15", isDefault: false },
  { id: 8, firstName: "Tharaka", lastName: "Rathnayake", phone: "+94 71 789 0123", email: "tharaka.r@gmail.com", nic: "850123456V", address: "33 Station Road", city: "Gampaha", tags: ["regular"], status: "active", loyaltyPoints: 1650, totalSpend: 67500, visits: 14, joinedAt: "2023-03-17", lastVisit: "2025-06-25", isDefault: false },
];

const TAG_COLORS = {
  vip:       { bg: "rgba(184,144,42,.1)",  border: "rgba(184,144,42,.25)", text: "#B8902A" },
  gold:      { bg: "rgba(184,144,42,.08)", border: "rgba(184,144,42,.2)",  text: "#D4A83C" },
  wholesale: { bg: "rgba(43,84,144,.08)",  border: "rgba(43,84,144,.22)",  text: "#2B5490" },
  regular:   { bg: "rgba(45,106,79,.08)",  border: "rgba(45,106,79,.2)",   text: "#2D6A4F" },
  new:       { bg: "rgba(91,61,143,.08)",  border: "rgba(91,61,143,.2)",   text: "#5B3D8F" },
};

const AV_COLORS = [
  ["#9E9080","rgba(158,144,128,.15)"],
  ["#2B5490","rgba(43,84,144,.15)"],["#5B3D8F","rgba(91,61,143,.15)"],
  ["#2D6A4F","rgba(45,106,79,.15)"],["#B8902A","rgba(184,144,42,.15)"],
  ["#B5372A","rgba(181,55,42,.15)"],["#7A5C1E","rgba(122,92,30,.15)"],
  ["#8A3A6A","rgba(138,58,106,.15)"],["#1B6B8A","rgba(27,107,138,.15)"],
];

const avColor  = (id) => AV_COLORS[id % AV_COLORS.length];
const initials = (c) => c.isDefault ? "WI" : `${c.firstName[0]}${c.lastName[0]}`.toUpperCase();
const fullName = (c) => c.isDefault ? "Walk-in Customer" : `${c.firstName} ${c.lastName}`;

const fmtNumber = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const fmtCurrency = (n) => {
  if (n >= 1000000) return `Rs ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `Rs ${(n / 1000).toFixed(0)}k`;
  return `Rs ${n}`;
};

const highlight = (text, query) => {
  if (!query.trim() || text === "—") return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(184,144,42,.28)", color: "var(--gold)", borderRadius: 2, padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Geist+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap');
  :root {
    --cream:#F6F3EC; --paper:#FDFBF7; --warm:#F0EBE0; --warm2:#E8E2D4;
    --ink:#1B1713; --ink60:#4B4038; --ink50:#6B5F54; --ink40:#9E9080;
    --ink30:#B8AFA4; --ink20:#CFC8BC; --ink10:#E4DDD2; --ink06:#EDE8E0; --ink03:#F5F1EB;
    --gold:#B8902A; --goldl:#D4A83C; --goldd:#8A6A1A;
    --goldbg:rgba(184,144,42,.08); --goldbr:rgba(184,144,42,.25);
    --green:#2D6A4F; --greenbr:rgba(45,106,79,.25);
    --shadow-lg:0 24px 64px rgba(27,23,19,.22),0 8px 20px rgba(27,23,19,.12);
  }

  .csm-backdrop {
    position:fixed; inset:0; z-index:900;
    background:rgba(27,23,19,.58); backdrop-filter:blur(6px) saturate(.85);
    display:flex; align-items:center; justify-content:center; padding:24px;
    animation:csmBdIn .2s ease both;
  }
  @keyframes csmBdIn { from{opacity:0} to{opacity:1} }

  .csm-modal {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:16px; box-shadow:var(--shadow-lg);
    width:100%; max-width:720px; max-height:min(86vh,680px);
    display:flex; flex-direction:column; overflow:hidden;
    animation:csmIn .3s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes csmIn { from{opacity:0;transform:scale(.95) translateY(12px)} to{opacity:1;transform:none} }

  /* Head */
  .csm-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 20px 15px; background:var(--ink);
    border-bottom:1px solid rgba(184,144,42,.18);
    flex-shrink:0; position:relative;
  }
  .csm-head::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--goldl) 30%,var(--gold) 70%,transparent);
    opacity:.32;
  }
  .csm-head-left { display:flex; align-items:center; gap:12px; }
  .csm-icon-wrap {
    width:36px; height:36px; border-radius:8px; flex-shrink:0;
    background:rgba(184,144,42,.1); border:1.5px solid rgba(184,144,42,.28);
    display:flex; align-items:center; justify-content:center;
  }
  .csm-eyebrow { font-family:'Outfit',sans-serif; font-size:8px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:rgba(184,144,42,.6); margin-bottom:2px; }
  .csm-title   { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; color:#F6F3EC; line-height:1; }
  .csm-close {
    width:28px; height:28px; border-radius:7px; flex-shrink:0;
    background:rgba(246,243,236,.06); border:1px solid rgba(246,243,236,.1);
    color:rgba(246,243,236,.35); cursor:pointer;
    display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .csm-close:hover { background:rgba(246,243,236,.13); color:rgba(246,243,236,.9); }

  /* Search zone */
  .csm-search-zone {
    padding:11px 16px; background:var(--warm); border-bottom:1px solid var(--ink10);
    display:flex; align-items:center; gap:10px; flex-shrink:0;
  }
  .csm-search-wrap { flex:1; position:relative; }
  .csm-search-ico  { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--ink30); pointer-events:none; }
  .csm-search {
    width:100%; padding:8px 34px 8px 34px;
    background:var(--paper); border:1.5px solid var(--ink10); border-radius:7px; outline:none;
    font-family:'Outfit',sans-serif; font-size:12.5px; font-weight:500; color:var(--ink);
    transition:all .18s;
  }
  .csm-search::placeholder { color:var(--ink30); font-weight:400; }
  .csm-search:hover { border-color:var(--ink20); }
  .csm-search:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .csm-clear {
    position:absolute; right:9px; top:50%; transform:translateY(-50%);
    width:18px; height:18px; border-radius:50%;
    background:var(--ink10); border:none; cursor:pointer;
    color:var(--ink40); display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .csm-clear:hover { background:var(--ink20); }
  .csm-add-btn {
    display:inline-flex; align-items:center; gap:7px; padding:8px 14px; border-radius:7px;
    background:var(--ink); border:1px solid rgba(184,144,42,.22); color:#F6F3EC;
    font-family:'Outfit',sans-serif; font-size:12px; font-weight:600; white-space:nowrap;
    cursor:pointer; transition:all .18s; flex-shrink:0;
  }
  .csm-add-btn:hover { background:var(--ink60); border-color:rgba(184,144,42,.4); transform:translateY(-1px); box-shadow:0 3px 10px rgba(27,23,19,.2); }
  .csm-add-icon {
    width:18px; height:18px; border-radius:4px; flex-shrink:0;
    background:rgba(184,144,42,.15); border:1px solid rgba(184,144,42,.3);
    display:flex; align-items:center; justify-content:center; color:var(--goldl);
  }

  /* Column header */
  .csm-col-head {
    display:grid; grid-template-columns:190px 100px 1fr 120px;
    gap:0; padding:8px 16px 7px;
    border-bottom:1px solid var(--ink10); flex-shrink:0;
    background:var(--cream);
  }
  .csm-col-lbl {
    font-size:8.5px; font-weight:700; letter-spacing:1.8px;
    text-transform:uppercase; color:var(--ink40);
  }
  .csm-col-lbl.right { text-align:right; }

  /* List */
  .csm-list { flex:1; overflow-y:auto; }
  .csm-list::-webkit-scrollbar { width:3px; }
  .csm-list::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }

  /* Divider label */
  .csm-divider-label {
    padding:6px 16px 5px;
    font-size:8px; font-weight:800; letter-spacing:2px; text-transform:uppercase;
    color:var(--ink30); background:var(--ink03); border-bottom:1px solid var(--ink06);
    display:flex; align-items:center; gap:8px;
  }
  .csm-divider-label::after { content:''; flex:1; height:1px; background:var(--ink10); }

  /* Item */
  .csm-item {
    display:grid; grid-template-columns:190px 100px 1fr 120px;
    gap:0; padding:10px 16px; align-items:center;
    cursor:pointer; border-bottom:1px solid var(--ink03);
    transition:background .12s; position:relative;
    animation:csmItemIn .28s ease both;
  }
  @keyframes csmItemIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
  .csm-item:last-child  { border-bottom:none; }
  .csm-item:hover       { background:var(--warm); }
  .csm-item--selected   { background:var(--goldbg) !important; }
  .csm-item--selected::before {
    content:''; position:absolute; left:0; top:0; bottom:0;
    width:3px; background:var(--gold); border-radius:0 2px 2px 0;
  }
  .csm-item--inactive { opacity:.5; }
  .csm-item--default  { background:rgba(158,144,128,.04); }
  .csm-item--default:hover { background:var(--warm); }

  /* Col 1: Name */
  .csm-col-name { display:flex; align-items:center; gap:10px; min-width:0; padding-right:10px; }
  .csm-av {
    width:36px; height:36px; border-radius:9px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:13px; font-weight:700; letter-spacing:.3px;
  }
  .csm-name-wrap   { min-width:0; }
  .csm-name        { font-size:13px; font-weight:700; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-family:'Outfit',sans-serif; margin-bottom:3px; }
  .csm-name-meta   { display:flex; align-items:center; gap:5px; flex-wrap:wrap; }
  .csm-tag-pill    { font-size:8px; font-weight:800; letter-spacing:.4px; text-transform:uppercase; padding:1px 6px; border-radius:20px; flex-shrink:0; }
  .csm-default-tag { font-size:8px; font-weight:800; letter-spacing:.4px; text-transform:uppercase; padding:1px 6px; border-radius:20px; background:rgba(158,144,128,.12); border:1px solid rgba(158,144,128,.25); color:var(--ink40); flex-shrink:0; }
  .csm-status-dot  { width:5px; height:5px; border-radius:50%; flex-shrink:0; background:var(--ink20); }
  .csm-status-dot--active { background:#3D8A65; }

  /* Col 2: Phone */
  .csm-col-phone { padding-right:10px; }
  .csm-phone    { font-family:'Geist Mono',monospace; font-size:11px; font-weight:600; color:var(--ink60); }
  .csm-nic      { font-family:'Geist Mono',monospace; font-size:10px; color:var(--ink30); margin-top:2px; }

  /* Col 3: Email / Address */
  .csm-col-email   { padding-right:10px; min-width:0; }
  .csm-email       { font-size:11.5px; color:var(--ink50); font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .csm-address     { font-size:10.5px; color:var(--ink40); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

  /* Col 4: Stats */
  .csm-col-stats { text-align:right; }
  .csm-spend     { font-family:'Geist Mono',monospace; font-size:11px; color:var(--ink60); font-weight:600; }
  .csm-visits    { font-family:'Geist Mono',monospace; font-size:10px; color:var(--ink30); margin-top:2px; }
  .csm-loyalty   { display:inline-flex; align-items:center; gap:3px; font-family:'Geist Mono',monospace; font-size:10px; color:var(--gold); font-weight:600; margin-top:2px; }

  /* Selected check overlay */
  .csm-check {
    position:absolute; right:14px; top:50%; transform:translateY(-50%);
    width:20px; height:20px; border-radius:50%;
    background:var(--gold); border:2px solid var(--goldd);
    display:flex; align-items:center; justify-content:center; color:#fff;
  }

  /* Empty */
  .csm-empty { padding:48px 32px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px; }
  .csm-empty-icon  { font-size:32px; opacity:.3; }
  .csm-empty-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:var(--ink60); }
  .csm-empty-sub   { font-size:12px; color:var(--ink40); max-width:240px; line-height:1.6; }

  /* Footer count */
  .csm-footer-count {
    padding:9px 16px; border-top:1px solid var(--ink06);
    background:var(--warm); flex-shrink:0;
    font-size:11px; color:var(--ink40); font-weight:500;
    display:flex; align-items:center; gap:6px;
  }
  .csm-footer-count strong { color:var(--ink60); font-weight:700; }

  @media (max-width:640px) {
    .csm-col-head { grid-template-columns:1fr 110px; }
    .csm-col-head > :nth-child(2), .csm-col-head > :nth-child(4) { display:none; }
    .csm-item     { grid-template-columns:1fr 110px; }
    .csm-item > :nth-child(2), .csm-item > :nth-child(4) { display:none; }
    .csm-modal    { border-radius:14px 14px 0 0; align-self:flex-end; max-height:92vh; }
    .csm-backdrop { padding:0; align-items:flex-end; }
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
// CustomerSelectionModal
// Props: open, onClose, onSelect, onAddNew, selected
// ══════════════════════════════════════════════════════════════════════════════
export function CustomerSelectionModal({ open, onClose, onSelect, onAddNew, selected }) {
  const [search, setSearch] = useState("");
  const searchRef = useRef();

  useEffect(() => {
    if (open) { setSearch(""); setTimeout(() => searchRef.current?.focus(), 80); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const { defaultCustomer, filtered } = useMemo(() => {
    const q = search.toLowerCase().trim();
    const def = CUSTOMERS.find(c => c.isDefault);
    const rest = CUSTOMERS.filter(c => !c.isDefault);
    if (!q) return { defaultCustomer: def, filtered: rest };
    const match = (c) =>
      fullName(c).toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.nic.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q);
    return {
      defaultCustomer: match(def) ? def : null,
      filtered: rest.filter(match),
    };
  }, [search]);

  const totalVisible = (defaultCustomer ? 1 : 0) + filtered.length;

  if (!open) return null;

  const renderItem = (c, i, isDefaultRow = false) => {
    const [clr, bg] = avColor(c.id);
    const isSelected = selected?.id === c.id;
    const primaryTag = c.tags[0];
    const tagStyle = primaryTag ? TAG_COLORS[primaryTag] : null;

    return (
      <div
        key={c.id}
        className={`csm-item${isSelected ? " csm-item--selected" : ""}${c.status === "inactive" ? " csm-item--inactive" : ""}${isDefaultRow ? " csm-item--default" : ""}`}
        style={{ animationDelay: `${i * 16}ms` }}
        onClick={() => { onSelect(c); onClose(); }}
      >
        {/* Col 1: Name + tags */}
        <div className="csm-col-name">
          <div className="csm-av" style={{ background: bg, border: `1.5px solid ${clr}25`, color: clr }}>
            {initials(c)}
          </div>
          <div className="csm-name-wrap">
            <div className="csm-name">{highlight(fullName(c), search)}</div>
            <div className="csm-name-meta">
              {isDefaultRow && <span className="csm-default-tag">Default</span>}
              {!isDefaultRow && primaryTag && tagStyle && (
                <span
                  className="csm-tag-pill"
                  style={{ background: tagStyle.bg, border: `1px solid ${tagStyle.border}`, color: tagStyle.text }}
                >
                  {primaryTag}
                </span>
              )}
              {!isDefaultRow && c.tags.length > 1 && (
                <span style={{ fontSize: 9, color: "var(--ink30)", fontFamily: "'Geist Mono', monospace" }}>
                  +{c.tags.length - 1}
                </span>
              )}
              {!isDefaultRow && (
                <span className={`csm-status-dot${c.status === "active" ? " csm-status-dot--active" : ""}`} />
              )}
            </div>
          </div>
        </div>

        {/* Col 2: Phone */}
        <div className="csm-col-phone">
          <div className="csm-phone">{isDefaultRow ? "—" : highlight(c.phone, search)}</div>
          <div className="csm-nic">{isDefaultRow ? "—" : (c.nic !== "—" ? highlight(c.nic, search) : "—")}</div>
        </div>

        {/* Col 3: Email / Address */}
        <div className="csm-col-email">
          <div className="csm-email">{isDefaultRow ? "—" : (c.email !== "—" ? highlight(c.email, search) : <span style={{ color: "var(--ink20)" }}>—</span>)}</div>
          <div className="csm-address">{isDefaultRow ? "Walk-in / POS" : (c.city !== "—" ? highlight(c.city, search) : "—")}</div>
        </div>

        {/* Col 4: Spend + Loyalty */}
        <div className="csm-col-stats">
          {isDefaultRow ? (
            <div className="csm-spend" style={{ color: "var(--ink30)" }}>—</div>
          ) : (
            <>
              <div className="csm-spend">{fmtCurrency(c.totalSpend)}</div>
              <div className="csm-visits">{c.visits} visit{c.visits !== 1 ? "s" : ""}</div>
              {c.loyaltyPoints > 0 && (
                <div className="csm-loyalty">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {fmtNumber(c.loyaltyPoints)}
                </div>
              )}
            </>
          )}
        </div>

        {isSelected && (
          <div className="csm-check">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="csm-backdrop" onClick={onClose}>
        <div className="csm-modal" onClick={e => e.stopPropagation()}>

          {/* Head */}
          <div className="csm-head">
            <div className="csm-head-left">
              <div className="csm-icon-wrap">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--goldl)" }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <div className="csm-eyebrow">CRM · Customer Relations</div>
                <div className="csm-title">Select Customer</div>
              </div>
            </div>
            <button className="csm-close" onClick={onClose}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Search + Add New */}
          <div className="csm-search-zone">
            <div className="csm-search-wrap">
              <svg className="csm-search-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={searchRef}
                className="csm-search"
                placeholder="Search by name, phone, NIC or city…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoComplete="off"
              />
              {search && (
                <button className="csm-clear" onClick={() => { setSearch(""); searchRef.current?.focus(); }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
            <button className="csm-add-btn" onClick={onAddNew}>
              <span className="csm-add-icon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </span>
              Add New
            </button>
          </div>

          {/* Column headers */}
          <div className="csm-col-head">
            <div className="csm-col-lbl">Customer Name</div>
            <div className="csm-col-lbl">Phone / NIC</div>
            <div className="csm-col-lbl">Email / City</div>
            <div className="csm-col-lbl right">Spend / Loyalty</div>
          </div>

          {/* List */}
          <div className="csm-list">
            {totalVisible === 0 ? (
              <div className="csm-empty">
                <div className="csm-empty-icon">🔍</div>
                <div className="csm-empty-title">No customers found</div>
                <div className="csm-empty-sub">Try a different name, phone, NIC or city.</div>
              </div>
            ) : (
              <>
                {defaultCustomer && (
                  <>
                    <div className="csm-divider-label">Default</div>
                    {renderItem(defaultCustomer, 0, true)}
                  </>
                )}
                {filtered.length > 0 && (
                  <>
                    <div className="csm-divider-label">Customers</div>
                    {filtered.map((c, i) => renderItem(c, i + 1, false))}
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer count */}
          <div className="csm-footer-count">
            <strong>{totalVisible}</strong> customer{totalVisible !== 1 ? "s" : ""} shown
            {search && <> · searching <strong>"{search}"</strong></>}
          </div>

        </div>
      </div>
    </>
  );
}