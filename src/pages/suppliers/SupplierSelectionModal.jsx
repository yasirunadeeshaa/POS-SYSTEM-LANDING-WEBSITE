import { useState, useMemo, useRef, useEffect } from "react";

const SUPPLIERS = [
  { id: 0, name: "Common Supplier", code: "—", category: "—", contactName: "—", contactTitle: "—", email: "—", phone: "—", country: "—", city: "—", currency: "—", status: "active", preferred: false, isDefault: true },
  { id: 1, name: "TechDist Co.", code: "SUP-001", category: "Electronics", contactName: "Marcus Holt", contactTitle: "Sales Manager", email: "marcus.holt@techdist.com", phone: "+1 415 230 8800", country: "United States", city: "San Francisco", currency: "USD", status: "active", preferred: true, isDefault: false },
  { id: 2, name: "FabricWorld", code: "SUP-002", category: "Apparel", contactName: "Priyanka Nair", contactTitle: "Account Director", email: "p.nair@fabricworld.in", phone: "+91 22 4001 7700", country: "India", city: "Mumbai", currency: "INR", status: "active", preferred: false, isDefault: false },
  { id: 3, name: "Global Imports Ltd", code: "SUP-003", category: "General", contactName: "Haruto Yamamoto", contactTitle: "Export Manager", email: "h.yamamoto@globalimports.jp", phone: "+81 3 5678 9010", country: "Japan", city: "Tokyo", currency: "JPY", status: "active", preferred: true, isDefault: false },
  { id: 4, name: "HomeGoods Inc.", code: "SUP-004", category: "Home", contactName: "Sandra Mills", contactTitle: "Trade Relations", email: "smills@homegoodsinc.com", phone: "+44 20 7946 0321", country: "United Kingdom", city: "London", currency: "GBP", status: "active", preferred: false, isDefault: false },
  { id: 5, name: "DirectSource", code: "SUP-005", category: "Lifestyle", contactName: "Ahmad Khalil", contactTitle: "Head of Wholesale", email: "a.khalil@directsource.ae", phone: "+971 4 321 9900", country: "UAE", city: "Dubai", currency: "AED", status: "active", preferred: false, isDefault: false },
  { id: 6, name: "LocalPrint Solutions", code: "SUP-006", category: "Stationery", contactName: "Chamara Dissanayake", contactTitle: "Operations Lead", email: "chamara@localprint.lk", phone: "+94 11 256 8800", country: "Sri Lanka", city: "Colombo", currency: "LKR", status: "active", preferred: false, isDefault: false },
  { id: 7, name: "SportGear Asia", code: "SUP-007", category: "Sports", contactName: "Ji-Woo Park", contactTitle: "Export Coordinator", email: "jiwoo.park@sportgearasia.kr", phone: "+82 2 3456 7890", country: "South Korea", city: "Seoul", currency: "KRW", status: "inactive", preferred: false, isDefault: false },
  { id: 8, name: "PackRight Materials", code: "SUP-008", category: "Packaging", contactName: "Lena Bauer", contactTitle: "Key Account Manager", email: "l.bauer@packright.de", phone: "+49 89 4321 0000", country: "Germany", city: "Munich", currency: "EUR", status: "active", preferred: false, isDefault: false },
];

const AV_COLORS = [
  ["#9E9080","rgba(158,144,128,.15)"],
  ["#2B5490","rgba(43,84,144,.15)"],["#5B3D8F","rgba(91,61,143,.15)"],
  ["#2D6A4F","rgba(45,106,79,.15)"],["#B8902A","rgba(184,144,42,.15)"],
  ["#B5372A","rgba(181,55,42,.15)"],["#7A5C1E","rgba(122,92,30,.15)"],
  ["#8A3A6A","rgba(138,58,106,.15)"],["#1B6B8A","rgba(27,107,138,.15)"],
];
const avColor  = (id) => AV_COLORS[id % AV_COLORS.length];
const initials = (name) => name === "Common Supplier" ? "CS" : name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
const highlight = (text, query) => {
  if (!query.trim() || text === "—") return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<mark style={{ background: "rgba(184,144,42,.28)", color: "var(--gold)", borderRadius: 2, padding: "0 1px" }}>{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>;
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

  .spm-backdrop {
    position:fixed; inset:0; z-index:900;
    background:rgba(27,23,19,.58); backdrop-filter:blur(6px) saturate(.85);
    display:flex; align-items:center; justify-content:center; padding:24px;
    animation:spmBdIn .2s ease both;
  }
  @keyframes spmBdIn { from{opacity:0} to{opacity:1} }

  .spm-modal {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:16px; box-shadow:var(--shadow-lg);
    width:100%; max-width:700px; max-height:min(86vh,680px);
    display:flex; flex-direction:column; overflow:hidden;
    animation:spmIn .3s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes spmIn { from{opacity:0;transform:scale(.95) translateY(12px)} to{opacity:1;transform:none} }

  /* Head */
  .spm-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 20px 15px; background:var(--ink);
    border-bottom:1px solid rgba(184,144,42,.18);
    flex-shrink:0; position:relative;
  }
  .spm-head::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--goldl) 30%,var(--gold) 70%,transparent);
    opacity:.32;
  }
  .spm-head-left { display:flex; align-items:center; gap:12px; }
  .spm-icon-wrap {
    width:36px; height:36px; border-radius:8px; flex-shrink:0;
    background:rgba(184,144,42,.1); border:1.5px solid rgba(184,144,42,.28);
    display:flex; align-items:center; justify-content:center;
  }
  .spm-eyebrow { font-family:'Outfit',sans-serif; font-size:8px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:rgba(184,144,42,.6); margin-bottom:2px; }
  .spm-title   { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; color:#F6F3EC; line-height:1; }
  .spm-close {
    width:28px; height:28px; border-radius:7px; flex-shrink:0;
    background:rgba(246,243,236,.06); border:1px solid rgba(246,243,236,.1);
    color:rgba(246,243,236,.35); cursor:pointer;
    display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .spm-close:hover { background:rgba(246,243,236,.13); color:rgba(246,243,236,.9); }

  /* Search zone */
  .spm-search-zone {
    padding:11px 16px; background:var(--warm); border-bottom:1px solid var(--ink10);
    display:flex; align-items:center; gap:10px; flex-shrink:0;
  }
  .spm-search-wrap { flex:1; position:relative; }
  .spm-search-ico  { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--ink30); pointer-events:none; }
  .spm-search {
    width:100%; padding:8px 34px 8px 34px;
    background:var(--paper); border:1.5px solid var(--ink10); border-radius:7px; outline:none;
    font-family:'Outfit',sans-serif; font-size:12.5px; font-weight:500; color:var(--ink);
    transition:all .18s;
  }
  .spm-search::placeholder { color:var(--ink30); font-weight:400; }
  .spm-search:hover { border-color:var(--ink20); }
  .spm-search:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .spm-clear {
    position:absolute; right:9px; top:50%; transform:translateY(-50%);
    width:18px; height:18px; border-radius:50%;
    background:var(--ink10); border:none; cursor:pointer;
    color:var(--ink40); display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .spm-clear:hover { background:var(--ink20); }
  .spm-add-btn {
    display:inline-flex; align-items:center; gap:7px; padding:8px 14px; border-radius:7px;
    background:var(--ink); border:1px solid rgba(184,144,42,.22); color:#F6F3EC;
    font-family:'Outfit',sans-serif; font-size:12px; font-weight:600; white-space:nowrap;
    cursor:pointer; transition:all .18s; flex-shrink:0;
  }
  .spm-add-btn:hover { background:var(--ink60); border-color:rgba(184,144,42,.4); transform:translateY(-1px); box-shadow:0 3px 10px rgba(27,23,19,.2); }
  .spm-add-icon {
    width:18px; height:18px; border-radius:4px; flex-shrink:0;
    background:rgba(184,144,42,.15); border:1px solid rgba(184,144,42,.3);
    display:flex; align-items:center; justify-content:center; color:var(--goldl);
  }

  /* Column header */
  .spm-col-head {
    display:grid; grid-template-columns:200px 110px 1fr 130px;
    gap:0; padding:8px 16px 7px;
    border-bottom:1px solid var(--ink10); flex-shrink:0;
    background:var(--cream);
  }
  .spm-col-lbl {
    font-size:8.5px; font-weight:700; letter-spacing:1.8px;
    text-transform:uppercase; color:var(--ink40);
  }
  .spm-col-lbl.right { text-align:right; }

  /* List */
  .spm-list { flex:1; overflow-y:auto; }
  .spm-list::-webkit-scrollbar { width:3px; }
  .spm-list::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }

  /* Default divider label */
  .spm-divider-label {
    padding:6px 16px 5px;
    font-size:8px; font-weight:800; letter-spacing:2px; text-transform:uppercase;
    color:var(--ink30); background:var(--ink03); border-bottom:1px solid var(--ink06);
    display:flex; align-items:center; gap:8px;
  }
  .spm-divider-label::after { content:''; flex:1; height:1px; background:var(--ink10); }

  /* Item */
  .spm-item {
    display:grid; grid-template-columns:200px 110px 1fr 130px;
    gap:0; padding:10px 16px; align-items:center;
    cursor:pointer; border-bottom:1px solid var(--ink03);
    transition:background .12s; position:relative;
    animation:spmItemIn .28s ease both;
  }
  @keyframes spmItemIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
  .spm-item:last-child  { border-bottom:none; }
  .spm-item:hover       { background:var(--warm); }
  .spm-item--selected   { background:var(--goldbg) !important; }
  .spm-item--selected::before {
    content:''; position:absolute; left:0; top:0; bottom:0;
    width:3px; background:var(--gold); border-radius:0 2px 2px 0;
  }
  .spm-item--inactive { opacity:.5; }
  .spm-item--default  { background:rgba(158,144,128,.04); }
  .spm-item--default:hover { background:var(--warm); }

  /* Col: Name */
  .spm-col-name { display:flex; align-items:center; gap:10px; min-width:0; padding-right:10px; }
  .spm-av {
    width:36px; height:36px; border-radius:9px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:13px; font-weight:700; letter-spacing:.3px;
  }
  .spm-name-wrap  { min-width:0; }
  .spm-name       { font-size:13px; font-weight:700; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-family:'Outfit',sans-serif; margin-bottom:2px; }
  .spm-name-meta  { display:flex; align-items:center; gap:5px; }
  .spm-preferred  { font-size:8px; font-weight:800; letter-spacing:.4px; text-transform:uppercase; padding:1px 6px; border-radius:20px; background:var(--goldbg); border:1px solid var(--goldbr); color:var(--gold); flex-shrink:0; }
  .spm-default-tag{ font-size:8px; font-weight:800; letter-spacing:.4px; text-transform:uppercase; padding:1px 6px; border-radius:20px; background:rgba(158,144,128,.12); border:1px solid rgba(158,144,128,.25); color:var(--ink40); flex-shrink:0; }
  .spm-status-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; background:var(--ink20); }
  .spm-status-dot--active { background:#3D8A65; }

  /* Col: Supplier No */
  .spm-col-code { padding-right:10px; }
  .spm-code { font-family:'Geist Mono',monospace; font-size:11px; font-weight:600; color:var(--gold); }
  .spm-category { font-size:10.5px; color:var(--ink40); margin-top:2px; }

  /* Col: Email */
  .spm-col-email { padding-right:10px; min-width:0; }
  .spm-email { font-size:11.5px; color:var(--ink50); font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .spm-contact-name { font-size:10.5px; color:var(--ink40); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

  /* Col: Phone */
  .spm-col-phone { text-align:right; }
  .spm-phone { font-family:'Geist Mono',monospace; font-size:11px; color:var(--ink50); font-weight:500; }
  .spm-currency { font-family:'Geist Mono',monospace; font-size:10px; color:var(--ink30); margin-top:2px; }

  /* Selected check overlay */
  .spm-check {
    position:absolute; right:14px; top:50%; transform:translateY(-50%);
    width:20px; height:20px; border-radius:50%;
    background:var(--gold); border:2px solid var(--goldd);
    display:flex; align-items:center; justify-content:center; color:#fff;
  }

  /* Empty */
  .spm-empty { padding:48px 32px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px; }
  .spm-empty-icon  { font-size:32px; opacity:.3; }
  .spm-empty-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:var(--ink60); }
  .spm-empty-sub   { font-size:12px; color:var(--ink40); max-width:240px; line-height:1.6; }

  /* Count footer */
  .spm-footer-count {
    padding:9px 16px; border-top:1px solid var(--ink06);
    background:var(--warm); flex-shrink:0;
    font-size:11px; color:var(--ink40); font-weight:500;
    display:flex; align-items:center; gap:6px;
  }
  .spm-footer-count strong { color:var(--ink60); font-weight:700; }

  @media (max-width:640px) {
    .spm-col-head  { grid-template-columns:1fr 100px; }
    .spm-col-head > :nth-child(2), .spm-col-head > :nth-child(4) { display:none; }
    .spm-item      { grid-template-columns:1fr 100px; }
    .spm-item > :nth-child(2), .spm-item > :nth-child(4) { display:none; }
    .spm-modal     { border-radius:14px 14px 0 0; align-self:flex-end; max-height:92vh; }
    .spm-backdrop  { padding:0; align-items:flex-end; }
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
// SupplierSelectionModal
// Props: open, onClose, onSelect, onAddNew, selected
// ══════════════════════════════════════════════════════════════════════════════
export function SupplierSelectionModal({ open, onClose, onSelect, onAddNew, selected }) {
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

  const { defaultSupplier, filtered } = useMemo(() => {
    const q = search.toLowerCase().trim();
    const def = SUPPLIERS.find(s => s.isDefault);
    const rest = SUPPLIERS.filter(s => !s.isDefault);
    if (!q) return { defaultSupplier: def, filtered: rest };
    const match = (s) =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.contactName.toLowerCase().includes(q);
    return {
      defaultSupplier: match(def) ? def : null,
      filtered: rest.filter(match),
    };
  }, [search]);

  const totalVisible = (defaultSupplier ? 1 : 0) + filtered.length;

  if (!open) return null;

  const renderItem = (s, i, isDefaultRow = false) => {
    const [clr, bg] = avColor(s.id);
    const isSelected = selected?.id === s.id;
    return (
      <div
        key={s.id}
        className={`spm-item${isSelected ? " spm-item--selected" : ""}${s.status === "inactive" ? " spm-item--inactive" : ""}${isDefaultRow ? " spm-item--default" : ""}`}
        style={{ animationDelay: `${i * 16}ms` }}
        onClick={() => { onSelect(s); onClose(); }}
      >
        {/* Col 1: Name */}
        <div className="spm-col-name">
          <div className="spm-av" style={{ background: bg, border: `1.5px solid ${clr}25`, color: clr }}>
            {initials(s.name)}
          </div>
          <div className="spm-name-wrap">
            <div className="spm-name">{highlight(s.name, search)}</div>
            <div className="spm-name-meta">
              {isDefaultRow && <span className="spm-default-tag">Default</span>}
              {s.preferred && <span className="spm-preferred">★ Preferred</span>}
              {!isDefaultRow && <span className={`spm-status-dot${s.status === "active" ? " spm-status-dot--active" : ""}`} />}
            </div>
          </div>
        </div>

        {/* Col 2: Supplier No */}
        <div className="spm-col-code">
          <div className="spm-code">{isDefaultRow ? "—" : highlight(s.code, search)}</div>
          <div className="spm-category">{s.category}</div>
        </div>

        {/* Col 3: Email */}
        <div className="spm-col-email">
          <div className="spm-email">{isDefaultRow ? "—" : s.email}</div>
          <div className="spm-contact-name">{isDefaultRow ? "Walk-in / General" : highlight(s.contactName, search)}</div>
        </div>

        {/* Col 4: Phone */}
        <div className="spm-col-phone">
          <div className="spm-phone">{isDefaultRow ? "—" : s.phone}</div>
          <div className="spm-currency">{isDefaultRow ? "" : s.currency}</div>
        </div>

        {isSelected && (
          <div className="spm-check">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="spm-backdrop" onClick={onClose}>
        <div className="spm-modal" onClick={e => e.stopPropagation()}>

          {/* Head */}
          <div className="spm-head">
            <div className="spm-head-left">
              <div className="spm-icon-wrap">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--goldl)" }}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <div className="spm-eyebrow">Procurement</div>
                <div className="spm-title">Select Supplier</div>
              </div>
            </div>
            <button className="spm-close" onClick={onClose}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Search + Add New */}
          <div className="spm-search-zone">
            <div className="spm-search-wrap">
              <svg className="spm-search-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                ref={searchRef}
                className="spm-search"
                placeholder="Search by name, code or contact…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoComplete="off"
              />
              {search && (
                <button className="spm-clear" onClick={() => { setSearch(""); searchRef.current?.focus(); }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            <button className="spm-add-btn" onClick={onAddNew}>
              <span className="spm-add-icon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </span>
              Add New
            </button>
          </div>

          {/* Column headers */}
          <div className="spm-col-head">
            <div className="spm-col-lbl">Supplier Name</div>
            <div className="spm-col-lbl">Supplier No.</div>
            <div className="spm-col-lbl">Email</div>
            <div className="spm-col-lbl right">Phone</div>
          </div>

          {/* List */}
          <div className="spm-list">
            {totalVisible === 0 ? (
              <div className="spm-empty">
                <div className="spm-empty-icon">🔍</div>
                <div className="spm-empty-title">No suppliers found</div>
                <div className="spm-empty-sub">Try a different name, code, or contact.</div>
              </div>
            ) : (
              <>
                {/* Default / Common Supplier */}
                {defaultSupplier && (
                  <>
                    <div className="spm-divider-label">Default</div>
                    {renderItem(defaultSupplier, 0, true)}
                  </>
                )}

                {/* Regular suppliers */}
                {filtered.length > 0 && (
                  <>
                    <div className="spm-divider-label">Suppliers</div>
                    {filtered.map((s, i) => renderItem(s, i + 1, false))}
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer count */}
          <div className="spm-footer-count">
            <strong>{totalVisible}</strong> supplier{totalVisible !== 1 ? "s" : ""} shown
            {search && <> · searching <strong>"{search}"</strong></>}
          </div>

        </div>
      </div>
    </>
  );
}