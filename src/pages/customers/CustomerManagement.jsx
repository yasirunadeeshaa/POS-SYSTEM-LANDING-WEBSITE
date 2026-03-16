import { useState, useMemo, useRef, useEffect } from "react";
import AddCustomer from "./AddCustomer";

// ── DATA ──────────────────────────────────────────────────────────────────────
const INITIAL_CUSTOMERS = [
  { id: 1,  firstName: "Ravi",      lastName: "Mendis",      email: "ravi.mendis@gmail.com",        phone: "+94 71 234 5678", nic: "199012345678",  dob: "1990-05-14", gender: "Male",   address: "12 Galle Rd, Colombo 03",          city: "Colombo",    loyaltyPoints: 1240, totalSpend: 4820.50, visits: 18, status: "active",   joinedAt: "2023-03-12", lastVisit: "2025-03-07", notes: "Prefers card payment. VIP customer.", tags: ["vip","regular"] },
  { id: 2,  firstName: "Priya",     lastName: "Silva",       email: "priya.silva@yahoo.com",        phone: "+94 77 876 5432", nic: "935234567V",    dob: "1993-11-02", gender: "Female", address: "45 Station Rd, Nugegoda",          city: "Nugegoda",   loyaltyPoints: 560,  totalSpend: 1930.00, visits: 9,  status: "active",   joinedAt: "2023-07-22", lastVisit: "2025-02-28", notes: "",           tags: ["regular"] },
  { id: 3,  firstName: "Daniel",    lastName: "Wijayaratne", email: "daniel.w@hotmail.com",         phone: "+94 76 543 2109", nic: "880987654321",  dob: "1988-08-30", gender: "Male",   address: "78 High Level Rd, Maharagama",     city: "Maharagama", loyaltyPoints: 3100, totalSpend: 11200.00,visits: 42, status: "active",   joinedAt: "2022-11-05", lastVisit: "2025-03-08", notes: "Bulk buyer. Applies discounts regularly.", tags: ["vip","wholesale"] },
  { id: 4,  firstName: "Amara",     lastName: "Perera",      email: "amara.p@gmail.com",            phone: "+94 70 112 3344", nic: "976123456789",  dob: "1997-03-19", gender: "Female", address: "23 Negombo Rd, Wattala",           city: "Wattala",    loyaltyPoints: 90,   totalSpend: 340.00,  visits: 3,  status: "active",   joinedAt: "2024-08-10", lastVisit: "2025-01-15", notes: "",           tags: ["new"] },
  { id: 5,  firstName: "Kasun",     lastName: "Fernando",    email: "kasun.fernando@sltnet.lk",     phone: "+94 71 998 7766", nic: "851234567890",  dob: "1985-12-25", gender: "Male",   address: "5 Kandy Rd, Kelaniya",             city: "Kelaniya",   loyaltyPoints: 780,  totalSpend: 2650.75, visits: 14, status: "active",   joinedAt: "2023-01-30", lastVisit: "2025-02-10", notes: "",           tags: ["regular"] },
  { id: 6,  firstName: "Nimesha",   lastName: "Gunawardena", email: "nimesha.g@gmail.com",          phone: "+94 78 456 7890", nic: "926789012345",  dob: "1992-07-07", gender: "Female", address: "99 Baseline Rd, Colombo 09",       city: "Colombo",    loyaltyPoints: 2200, totalSpend: 7840.00, visits: 27, status: "active",   joinedAt: "2022-09-18", lastVisit: "2025-03-05", notes: "Loyalty gold tier.",              tags: ["vip","gold"] },
  { id: 7,  firstName: "Thilak",    lastName: "Rathnayake",  email: "thilak.r@yahoo.com",           phone: "+94 72 321 6540", nic: "790234567V",    dob: "1979-04-11", gender: "Male",   address: "34 Temple Rd, Kotte",              city: "Kotte",      loyaltyPoints: 420,  totalSpend: 1560.00, visits: 7,  status: "inactive", joinedAt: "2023-05-14", lastVisit: "2024-09-20", notes: "No contact since Sep 2024.",      tags: [] },
  { id: 8,  firstName: "Sachini",   lastName: "Jayasinghe",  email: "sachini.j@outlook.com",        phone: "+94 75 654 3210", nic: "010345678901",  dob: "2001-09-23", gender: "Female", address: "67 Duplication Rd, Colombo 04",    city: "Colombo",    loyaltyPoints: 155,  totalSpend: 520.00,  visits: 5,  status: "active",   joinedAt: "2024-02-28", lastVisit: "2025-01-30", notes: "",           tags: ["new"] },
  { id: 9,  firstName: "Ruwan",     lastName: "Bandara",     email: "ruwan.b@gmail.com",            phone: "+94 77 789 0123", nic: "820456789012",  dob: "1982-02-16", gender: "Male",   address: "15 Peradeniya Rd, Kandy",          city: "Kandy",      loyaltyPoints: 1890, totalSpend: 6700.00, visits: 22, status: "active",   joinedAt: "2022-06-01", lastVisit: "2025-02-22", notes: "",           tags: ["regular","vip"] },
  { id: 10, firstName: "Dilhani",   lastName: "Seneviratne", email: "dilhani.s@gmail.com",          phone: "+94 71 234 0987", nic: "955678901234",  dob: "1995-06-30", gender: "Female", address: "8 Ward Place, Colombo 07",         city: "Colombo",    loyaltyPoints: 670,  totalSpend: 2340.00, visits: 11, status: "active",   joinedAt: "2023-10-05", lastVisit: "2025-03-01", notes: "",           tags: ["regular"] },
  { id: 11, firstName: "Nuwan",     lastName: "Dissanayake", email: "nuwan.d@sltnet.lk",            phone: "+94 76 111 2233", nic: "875012345678",  dob: "1987-10-08", gender: "Male",   address: "29 Nawala Rd, Rajagiriya",         city: "Rajagiriya", loyaltyPoints: 0,    totalSpend: 85.00,   visits: 1,  status: "active",   joinedAt: "2025-02-14", lastVisit: "2025-02-14", notes: "First visit.",tags: ["new"] },
  { id: 12, firstName: "Kamani",    lastName: "Wickramasinghe", email: "kamani.w@gmail.com",       phone: "+94 70 987 6543", nic: "903456789V",    dob: "1990-01-20", gender: "Female", address: "55 Main St, Gampaha",              city: "Gampaha",    loyaltyPoints: 310,  totalSpend: 1100.00, visits: 6,  status: "inactive", joinedAt: "2023-12-01", lastVisit: "2024-07-14", notes: "Moved abroad.",                   tags: [] },
  { id: 13, firstName: "Asanka",    lastName: "Liyanage",    email: "asanka.l@hotmail.com",         phone: "+94 72 567 8901", nic: "811234567890",  dob: "1981-11-11", gender: "Male",   address: "18 Bauddhaloka Mawatha, Col 07",   city: "Colombo",    loyaltyPoints: 4500, totalSpend: 16300.00,visits: 55, status: "active",   joinedAt: "2022-01-10", lastVisit: "2025-03-06", notes: "Top customer. Handle personally.",tags: ["vip","gold","wholesale"] },
  { id: 14, firstName: "Iresha",    lastName: "Weerasinghe", email: "iresha.w@gmail.com",           phone: "+94 78 345 6789", nic: "006789012345",  dob: "2000-04-05", gender: "Female", address: "3 Park Rd, Borella",               city: "Colombo",    loyaltyPoints: 220,  totalSpend: 740.00,  visits: 4,  status: "active",   joinedAt: "2024-05-17", lastVisit: "2025-01-20", notes: "",           tags: ["new"] },
  { id: 15, firstName: "Prasad",    lastName: "Kumara",      email: "prasad.k@yahoo.com",           phone: "+94 71 876 5432", nic: "769012345678",  dob: "1976-07-19", gender: "Male",   address: "42 Hospital Rd, Kurunegala",       city: "Kurunegala", loyaltyPoints: 880,  totalSpend: 3120.00, visits: 16, status: "active",   joinedAt: "2023-04-08", lastVisit: "2025-02-18", notes: "",           tags: ["regular"] },
];

const CITIES   = ["All", ...Array.from(new Set(INITIAL_CUSTOMERS.map(c => c.city))).sort()];
const TAG_OPTS = ["All", "vip", "gold", "wholesale", "regular", "new"];

const fmt  = (n) => Number(n || 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtN = (n) => Number(n || 0).toLocaleString("en");

const initials = (c) => `${c.firstName[0]}${c.lastName[0]}`.toUpperCase();

const AVATAR_COLORS = [
  ["#2B5490","rgba(43,84,144,.15)"],["#5B3D8F","rgba(91,61,143,.15)"],
  ["#2D6A4F","rgba(45,106,79,.15)"],["#B8902A","rgba(184,144,42,.15)"],
  ["#B5372A","rgba(181,55,42,.15)"],["#7A5C1E","rgba(122,92,30,.15)"],
  ["#8A3A6A","rgba(138,58,106,.15)"],["#1B6B8A","rgba(27,107,138,.15)"],
];
const avatarColor = (id) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];

const tierInfo = (spend) => {
  if (spend >= 10000) return { label: "Platinum", color: "#5B8FA8", bg: "rgba(91,143,168,.1)", border: "rgba(91,143,168,.25)" };
  if (spend >= 5000)  return { label: "Gold",     color: "#B8902A", bg: "rgba(184,144,42,.08)", border: "rgba(184,144,42,.22)" };
  if (spend >= 1500)  return { label: "Silver",   color: "#9E9080", bg: "rgba(158,144,128,.08)", border: "rgba(158,144,128,.22)" };
  return                     { label: "Bronze",   color: "#7A5C1E", bg: "rgba(122,92,30,.07)", border: "rgba(122,92,30,.18)" };
};

const BLANK_FORM = {
  firstName: "", lastName: "", email: "", phone: "", nic: "",
  dob: "", gender: "", address: "", city: "",
  notes: "", tags: [], status: "active",
};

const TAG_COLORS = {
  vip:       { bg: "rgba(184,144,42,.1)",  border: "rgba(184,144,42,.25)", text: "#B8902A" },
  gold:      { bg: "rgba(184,144,42,.08)", border: "rgba(184,144,42,.2)",  text: "#D4A83C" },
  wholesale: { bg: "rgba(43,84,144,.08)",  border: "rgba(43,84,144,.22)",  text: "#2B5490" },
  regular:   { bg: "rgba(45,106,79,.08)",  border: "rgba(45,106,79,.2)",   text: "#2D6A4F" },
  new:       { bg: "rgba(91,61,143,.08)",  border: "rgba(91,61,143,.2)",   text: "#5B3D8F" },
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
    --purple:#5B3D8F; --purplebg:rgba(91,61,143,.07); --purplebr:rgba(91,61,143,.22);
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
  .content.drawer-open { margin-right:400px; }

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
  .btn-ghost  { background:transparent; border-color:var(--ink10); color:var(--ink50); }
  .btn-ghost:hover { border-color:var(--ink20); color:var(--ink60); background:var(--warm); }
  .btn-gold   { background:var(--gold); border-color:var(--goldd); color:#fff; box-shadow:0 2px 8px rgba(184,144,42,.3); }
  .btn-gold:hover { background:var(--goldl); box-shadow:0 4px 16px rgba(184,144,42,.4); transform:translateY(-1px); }
  .btn-red    { background:var(--redbg); border-color:var(--redbr); color:var(--red); }
  .btn-red:hover { background:rgba(181,55,42,.14); }
  .btn-green  { background:var(--green); border-color:#205038; color:#fff; box-shadow:0 2px 8px rgba(45,106,79,.25); }
  .btn-green:hover { background:var(--greenl); transform:translateY(-1px); }

  /* ══ STAT STRIP ══ */
  .stat-strip { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; animation:fadeUp .35s ease both; animation-delay:40ms; }
  .stat-card  {
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

  .view-toggle { display:flex; border:1.5px solid var(--ink10); border-radius:7px; overflow:hidden; }
  .view-btn    { padding:8px 12px; background:transparent; border:none; color:var(--ink30); cursor:pointer; font-size:14px; transition:all .15s; display:flex; align-items:center; }
  .view-btn:hover  { background:var(--warm); color:var(--ink50); }
  .view-btn.active { background:var(--ink); color:var(--goldl); }

  .filter-chips { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
  .filter-chip  { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; background:var(--goldbg); border:1px solid var(--goldbr); color:var(--gold); font-size:11px; font-weight:700; }
  .chip-remove  { background:none; border:none; cursor:pointer; color:var(--gold); opacity:.65; font-size:14px; line-height:1; padding:0; }
  .chip-remove:hover { opacity:1; }

  /* ══ SEARCH LEGEND ══ */
  .search-legend {
    display:flex; gap:6px; flex-wrap:wrap; align-items:center;
    padding:8px 14px; background:var(--bluebg); border:1px solid var(--bluebr);
    border-radius:7px; animation:fadeUp .25s ease;
  }
  .legend-label { font-size:10.5px; font-weight:700; color:var(--blue); margin-right:4px; }
  .legend-tag   {
    padding:2px 9px; border-radius:20px;
    background:var(--paper); border:1px solid var(--bluebr);
    font-size:10.5px; font-weight:600; color:var(--blue);
    font-family:'Geist Mono',monospace;
  }

  /* ══ RESULTS BAR ══ */
  .results-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .results-count { font-size:12px; color:var(--ink40); font-weight:500; }
  .results-count strong { color:var(--ink60); font-weight:700; }

  /* ══ TABLE ══ */
  .table-card { background:var(--paper); border:1px solid var(--ink10); border-radius:10px; box-shadow:var(--shadow-xs); overflow:hidden; animation:fadeUp .45s ease both; animation-delay:100ms; }
  .tbl-head { display:grid; grid-template-columns:52px 2.6fr 1.5fr 1.3fr 1fr 1.1fr 90px; gap:8px; padding:11px 18px; background:var(--warm); border-bottom:1px solid var(--ink10); }
  .tbl-hcell { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:4px; cursor:pointer; user-select:none; transition:color .15s; }
  .tbl-hcell:hover { color:var(--ink60); }
  .tbl-hcell.sorted { color:var(--gold); }
  .sort-arr { font-size:8px; }

  .tbl-row {
    display:grid; grid-template-columns:52px 2.6fr 1.5fr 1.3fr 1fr 1.1fr 90px; gap:8px;
    padding:11px 18px; align-items:center;
    border-bottom:1px solid var(--ink03); transition:background .14s; cursor:pointer;
  }
  .tbl-row:last-child { border-bottom:none; }
  .tbl-row:hover { background:var(--warm); }
  .tbl-row.selected-row { background:var(--goldbg); border-left:3px solid var(--gold); padding-left:15px; }

  /* Avatar */
  .cust-av {
    width:40px; height:40px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:700;
    flex-shrink:0; letter-spacing:.3px;
  }
  .cust-av-lg {
    width:56px; height:56px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700;
    letter-spacing:.3px; flex-shrink:0;
  }

  .cust-name { font-size:13.5px; font-weight:700; color:var(--ink); margin-bottom:2px; }
  .cust-sub  { font-size:11px; color:var(--ink40); }
  .tbl-cell  { font-size:12.5px; color:var(--ink60); font-weight:500; }
  .tbl-mono  { font-family:'Geist Mono',monospace; font-size:11.5px; color:var(--ink60); }
  .tbl-actions { display:flex; gap:4px; justify-content:flex-end; }
  .tbl-act-btn {
    width:28px; height:28px; border-radius:6px;
    background:transparent; border:1px solid transparent;
    color:var(--ink30); cursor:pointer; font-size:12px;
    display:flex; align-items:center; justify-content:center; transition:all .14s;
  }
  .tbl-act-btn:hover      { background:var(--warm2); border-color:var(--ink10); color:var(--ink60); }
  .tbl-act-btn.edit:hover { background:var(--goldbg); border-color:var(--goldbr); color:var(--gold); }
  .tbl-act-btn.del:hover  { background:var(--redbg);  border-color:var(--redbr);  color:var(--red);  }

  /* Status badge */
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:9.5px; font-weight:700; text-transform:capitalize; letter-spacing:.3px; }
  .status-dot   { width:5px; height:5px; border-radius:50%; }

  /* Tag chip */
  .tag-chip { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:.3px; }

  /* ══ CARD VIEW ══ */
  .cust-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px; animation:fadeUp .45s ease both; animation-delay:100ms; }
  .cust-card {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:12px; overflow:hidden; box-shadow:var(--shadow-xs);
    cursor:pointer; transition:all .22s cubic-bezier(.16,1,.3,1);
  }
  .cust-card:hover { box-shadow:var(--shadow-md); transform:translateY(-3px); border-color:var(--ink20); }
  .cust-card.drawer-selected { border-color:var(--gold); box-shadow:0 0 0 2px var(--gold),var(--shadow-sm); }

  .cust-card-top { padding:16px 16px 12px; display:flex; gap:12px; align-items:flex-start; }
  .cust-card-info { flex:1; min-width:0; }
  .cust-card-name { font-size:14.5px; font-weight:700; color:var(--ink); line-height:1.2; margin-bottom:3px; }
  .cust-card-email { font-size:11.5px; color:var(--ink40); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:5px; }
  .cust-card-tags { display:flex; gap:4px; flex-wrap:wrap; }

  .cust-card-stats { display:grid; grid-template-columns:1fr 1fr 1fr; border-top:1px solid var(--ink06); }
  .cust-stat { padding:10px 12px; display:flex; flex-direction:column; gap:3px; }
  .cust-stat:not(:last-child) { border-right:1px solid var(--ink06); }
  .cst-val { font-family:'Geist Mono',monospace; font-size:13px; font-weight:700; color:var(--ink); }
  .cst-lbl { font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--ink40); }

  .cust-card-footer { padding:10px 16px; background:var(--warm); border-top:1px solid var(--ink06); display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .cust-card-actions { display:flex; gap:5px; }
  .cust-act-btn {
    width:28px; height:28px; border-radius:6px;
    background:transparent; border:1px solid transparent;
    color:var(--ink30); cursor:pointer; font-size:12px;
    display:flex; align-items:center; justify-content:center; transition:all .14s;
  }
  .cust-act-btn:hover      { background:var(--warm2); border-color:var(--ink10); color:var(--ink60); }
  .cust-act-btn.edit:hover { background:var(--goldbg); border-color:var(--goldbr); color:var(--gold); }
  .cust-act-btn.del:hover  { background:var(--redbg);  border-color:var(--redbr);  color:var(--red);  }

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
    width:400px; background:var(--paper);
    border-left:1px solid var(--ink10); box-shadow:var(--shadow-lg);
    z-index:201; display:flex; flex-direction:column; overflow:hidden;
    animation:drawerIn .3s cubic-bezier(.16,1,.3,1);
  }
  @keyframes drawerIn { from{transform:translateX(100%)} to{transform:none} }

  .drawer-head {
    padding:18px 20px 16px; background:var(--ink);
    border-bottom:1px solid rgba(184,144,42,.2);
    flex-shrink:0;
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

  .drawer-profile { display:flex; align-items:center; gap:14px; }
  .drawer-profile-info {}
  .drawer-cust-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#F6F3EC; line-height:1.1; margin-bottom:4px; }
  .drawer-cust-email { font-size:12px; color:rgba(246,243,236,.4); }
  .drawer-tags { display:flex; gap:5px; flex-wrap:wrap; margin-top:7px; }

  .drawer-body { flex:1; overflow-y:auto; padding:18px 20px; display:flex; flex-direction:column; gap:20px; }
  .drawer-body::-webkit-scrollbar { width:3px; }
  .drawer-body::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }

  .d-section { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .d-section::after { content:''; flex:1; height:1px; background:var(--ink06); }

  .d-kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
  .d-kpi {
    padding:12px 13px; border-radius:9px;
    background:var(--warm); border:1px solid var(--ink10); text-align:center;
  }
  .d-kpi-val { font-family:'Geist Mono',monospace; font-size:17px; font-weight:700; color:var(--ink); line-height:1; margin-bottom:4px; }
  .d-kpi-lbl { font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--ink40); }

  .d-row { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:7px 0; border-bottom:1px solid var(--ink03); }
  .d-row:last-child { border-bottom:none; }
  .d-label { font-size:11.5px; color:var(--ink40); font-weight:500; flex-shrink:0; }
  .d-value { font-size:12.5px; font-weight:600; color:var(--ink); text-align:right; line-height:1.4; }
  .d-mono  { font-family:'Geist Mono',monospace; font-size:12px; }

  /* Loyalty bar */
  .loyalty-bar-wrap { padding:12px 14px; background:var(--warm); border:1px solid var(--ink10); border-radius:9px; }
  .loyalty-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .loyalty-pts { font-family:'Geist Mono',monospace; font-size:20px; font-weight:700; color:var(--gold); }
  .loyalty-label { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--ink40); }
  .loyalty-bar  { height:5px; background:var(--ink10); border-radius:3px; overflow:hidden; margin-bottom:6px; }
  .loyalty-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--gold),var(--goldl)); transition:width .8s cubic-bezier(.16,1,.3,1); }
  .loyalty-next { font-size:10.5px; color:var(--ink40); }

  .notes-box { padding:11px 13px; background:var(--warm); border:1px solid var(--ink10); border-radius:8px; font-size:12.5px; color:var(--ink60); line-height:1.6; font-style:italic; }

  .drawer-actions { padding:14px 20px; border-top:1px solid var(--ink10); display:flex; gap:8px; flex-shrink:0; background:var(--paper); }
  .d-btn {
    flex:1; padding:10px; border-radius:7px;
    font-size:12.5px; font-weight:700; cursor:pointer;
    font-family:'Outfit',sans-serif; border:1px solid transparent;
    transition:all .18s; display:flex; align-items:center; justify-content:center; gap:7px;
  }
  .d-btn-gold    { background:var(--gold); border-color:var(--goldd); color:#fff; box-shadow:0 2px 8px rgba(184,144,42,.25); }
  .d-btn-gold:hover { background:var(--goldl); }
  .d-btn-ghost   { background:transparent; border-color:var(--ink10); color:var(--ink50); }
  .d-btn-ghost:hover { border-color:var(--ink20); background:var(--warm); }
  .d-btn-danger  { background:var(--redbg); border-color:var(--redbr); color:var(--red); }
  .d-btn-danger:hover { background:rgba(181,55,42,.14); }

  /* ══ MODAL ══ */
  .modal-backdrop {
    position:fixed; inset:0; background:rgba(27,23,19,.5);
    z-index:400; backdrop-filter:blur(3px);
    display:flex; align-items:center; justify-content:center; padding:20px;
    animation:bdIn .22s ease;
  }
  @keyframes bdIn { from{opacity:0} to{opacity:1} }
  .modal {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:16px; box-shadow:var(--shadow-lg);
    width:100%; max-width:620px; max-height:93vh;
    display:flex; flex-direction:column; overflow:hidden;
    animation:modalIn .28s cubic-bezier(.16,1,.3,1);
  }
  @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(12px)} to{opacity:1;transform:none} }

  .modal-head {
    padding:20px 24px 18px; background:var(--ink);
    border-bottom:1px solid rgba(184,144,42,.25);
    display:flex; align-items:flex-start; justify-content:space-between; flex-shrink:0;
  }
  .modal-eyebrow { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(184,144,42,.7); margin-bottom:4px; }
  .modal-title   { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#F6F3EC; }
  .modal-close {
    width:32px; height:32px; border-radius:7px;
    background:rgba(246,243,236,.06); border:1px solid rgba(246,243,236,.1);
    color:rgba(246,243,236,.4); cursor:pointer; font-size:18px;
    display:flex; align-items:center; justify-content:center; transition:all .15s; flex-shrink:0;
  }
  .modal-close:hover { background:rgba(246,243,236,.12); color:rgba(246,243,236,.85); }

  /* Preview strip in modal */
  .modal-preview {
    padding:14px 24px; background:linear-gradient(135deg,rgba(27,23,19,.96),rgba(43,38,33,.9));
    border-bottom:1px solid rgba(184,144,42,.12);
    display:flex; align-items:center; gap:14px; flex-shrink:0;
  }
  .mp-initials {
    width:44px; height:44px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:700; flex-shrink:0;
  }
  .mp-name  { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; color:#F6F3EC; line-height:1.1; }
  .mp-email { font-size:11.5px; color:rgba(246,243,236,.4); margin-top:2px; }

  .modal-body { padding:22px 24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:18px; }
  .modal-body::-webkit-scrollbar { width:3px; }
  .modal-body::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }

  /* Form */
  .field       { display:flex; flex-direction:column; gap:7px; }
  .field-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .field-row-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
  .label {
    font-size:10.5px; font-weight:700; letter-spacing:.8px;
    text-transform:uppercase; color:var(--ink50);
    display:flex; align-items:center; gap:5px;
  }
  .label-req  { color:var(--red); font-size:13px; line-height:1; }
  .label-hint { font-size:10px; font-weight:400; color:var(--ink30); letter-spacing:0; text-transform:none; }

  .input,.textarea,.mselect {
    width:100%; padding:10px 13px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; color:var(--ink);
    font-size:13.5px; font-weight:500; font-family:'Outfit',sans-serif;
    outline:none; transition:all .18s; appearance:none;
  }
  .input::placeholder,.textarea::placeholder { color:var(--ink20); font-weight:400; }
  .input:hover,.textarea:hover,.mselect:hover { border-color:var(--ink20); background:var(--paper); }
  .input:focus,.textarea:focus,.mselect:focus { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .input.error { border-color:var(--red); box-shadow:0 0 0 3px rgba(181,55,42,.08); }
  .textarea  { resize:vertical; min-height:70px; line-height:1.55; }
  .sel-wrap  { position:relative; }
  .sel-arrow { position:absolute; right:11px; top:50%; transform:translateY(-50%); font-size:9px; color:var(--ink30); pointer-events:none; }
  .field-error { font-size:11px; color:var(--red); font-weight:500; display:flex; align-items:center; gap:4px; }

  /* Tag checkbox row */
  .tag-check-row { display:flex; gap:8px; flex-wrap:wrap; }
  .tag-check {
    display:inline-flex; align-items:center; gap:6px;
    padding:5px 12px; border-radius:20px;
    border:1.5px solid var(--ink10); background:var(--warm);
    cursor:pointer; font-size:12px; font-weight:600; color:var(--ink50);
    transition:all .16s; user-select:none;
  }
  .tag-check:hover { border-color:var(--ink20); background:var(--paper); }
  .tag-check.selected { border-color:var(--tc); background:var(--tbg); color:var(--tc); }

  /* Toggle */
  .toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .toggle-info .toggle-title { font-size:13px; font-weight:600; color:var(--ink); margin-bottom:2px; }
  .toggle-info .toggle-desc  { font-size:11px; color:var(--ink40); line-height:1.4; }
  .toggle { position:relative; width:40px; height:22px; flex-shrink:0; cursor:pointer; }
  .toggle input { opacity:0; width:0; height:0; position:absolute; }
  .toggle-track { position:absolute; inset:0; border-radius:11px; background:var(--ink10); transition:all .2s; border:1.5px solid var(--ink10); }
  .toggle input:checked~.toggle-track { background:var(--green); border-color:#205038; }
  .toggle-thumb { position:absolute; top:3px; left:3px; width:14px; height:14px; border-radius:50%; background:#fff; transition:transform .2s cubic-bezier(.16,1,.3,1); box-shadow:0 1px 3px rgba(27,23,19,.2); }
  .toggle input:checked~.toggle-track .toggle-thumb { transform:translateX(18px); }

  /* Section divider */
  .m-section { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink30); display:flex; align-items:center; gap:10px; }
  .m-section::after { content:''; flex:1; height:1px; background:var(--ink06); }

  .modal-footer {
    padding:16px 24px; border-top:1px solid var(--ink10);
    display:flex; align-items:center; gap:10px; flex-shrink:0; background:var(--paper);
  }
  .modal-footer-hint { flex:1; font-size:11px; color:var(--ink30); }

  /* Delete modal */
  .del-modal { max-width:400px; }
  .del-body  { padding:28px 24px; display:flex; flex-direction:column; gap:14px; align-items:center; text-align:center; }
  .del-icon  { font-size:44px; }
  .del-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink); }
  .del-sub   { font-size:13px; color:var(--ink40); line-height:1.6; max-width:280px; }

  /* Toast */
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
  @media (max-width:1300px) {
    .tbl-head,.tbl-row { grid-template-columns:52px 2.6fr 1.5fr 1fr 1.1fr 90px; }
    .tbl-head>:nth-child(4),.tbl-row>:nth-child(4) { display:none; }
    .stat-strip { grid-template-columns:repeat(3,1fr); }
    .drawer { width:360px; }
    .content.drawer-open { margin-right:360px; }
  }
  @media (max-width:1000px) {
    .tbl-head,.tbl-row { grid-template-columns:52px 2.6fr 1.5fr 1.1fr 90px; }
    .tbl-head>:nth-child(5),.tbl-row>:nth-child(5) { display:none; }
    .stat-strip { grid-template-columns:repeat(3,1fr); }
    .content.drawer-open { margin-right:0; }
    .drawer { width:100%; max-width:400px; }
  }
  @media (max-width:680px) {
    .content { padding:14px 16px; }
    .stat-strip { grid-template-columns:repeat(2,1fr); }
    .field-row-2,.field-row-3 { grid-template-columns:1fr; }
    .cust-grid { grid-template-columns:1fr; }
  }
`;

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function CustomerManagement() {
  const [customers,  setCustomers]  = useState(INITIAL_CUSTOMERS);
  const [searchName, setSearchName] = useState("");
  const [searchPhone,setSearchPhone]= useState("");
  const [searchNic,  setSearchNic]  = useState("");
  const [searchEmail,setSearchEmail]= useState("");
  const [statFilter, setStatFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [tagFilter,  setTagFilter]  = useState("All");
  const [sortKey,    setSortKey]    = useState("firstName");
  const [sortAsc,    setSortAsc]    = useState(true);
  const [view,       setView]       = useState("table");
  const [selectedId, setSelectedId] = useState(null);
  const [modalMode,  setModalMode]  = useState(null);  // null | "add" | "edit"
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [form,       setForm]       = useState(BLANK_FORM);
  const [errors,     setErrors]     = useState({});
  const [toast,      setToast]      = useState({ show:false, msg:"", sub:"" });

  // close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") { setModalMode(null); setDelTarget(null); setSelectedId(null); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── filter & sort ──
  const filtered = useMemo(() => {
    let list = [...customers];
    const qn = searchName.toLowerCase().trim();
    const qp = searchPhone.replace(/\s/g,"").trim();
    const qnic = searchNic.trim().toLowerCase();
    const qe = searchEmail.toLowerCase().trim();

    if (qn)   list = list.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(qn));
    if (qp)   list = list.filter(c => c.phone.replace(/\s/g,"").includes(qp));
    if (qnic) list = list.filter(c => c.nic.toLowerCase().includes(qnic));
    if (qe)   list = list.filter(c => c.email.toLowerCase().includes(qe));
    if (statFilter !== "All") list = list.filter(c => c.status === statFilter);
    if (cityFilter !== "All") list = list.filter(c => c.city === cityFilter);
    if (tagFilter  !== "All") list = list.filter(c => c.tags.includes(tagFilter));

    list.sort((a, b) => {
      let av = sortKey === "fullName" ? `${a.firstName} ${a.lastName}` : a[sortKey] ?? "";
      let bv = sortKey === "fullName" ? `${b.firstName} ${b.lastName}` : b[sortKey] ?? "";
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [customers, searchName, searchPhone, searchNic, searchEmail, statFilter, cityFilter, tagFilter, sortKey, sortAsc]);

  const selectedCustomer = customers.find(c => c.id === selectedId);

  // ── stats ──
  const totalActive  = customers.filter(c => c.status === "active").length;
  const vipCount     = customers.filter(c => c.tags.includes("vip")).length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpend, 0);
  const newCount     = customers.filter(c => c.tags.includes("new")).length;

  // ── modal ──
  const openAdd = () => {
    setForm(BLANK_FORM);
    setErrors({});
    setEditTarget(null);
    setModalMode("add");
  };
  const openEdit = (c) => {
    setForm({
      firstName: c.firstName, lastName: c.lastName, email: c.email,
      phone: c.phone, nic: c.nic, dob: c.dob, gender: c.gender,
      address: c.address, city: c.city, notes: c.notes,
      tags: [...c.tags], status: c.status,
    });
    setErrors({});
    setEditTarget(c.id);
    setModalMode("edit");
  };
  const updateForm = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: null }));
  };
  const toggleTag = (t) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(t) ? f.tags.filter(x => x !== t) : [...f.tags, t],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";
    if (!form.phone.trim())     e.phone     = "Phone number is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (modalMode === "add") {
      const nc = {
        id: Date.now(),
        ...form,
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim(),
        phone:     form.phone.trim(),
        nic:       form.nic.trim(),
        loyaltyPoints: 0, totalSpend: 0, visits: 0,
        joinedAt: new Date().toISOString().split("T")[0],
        lastVisit: new Date().toISOString().split("T")[0],
      };
      setCustomers(c => [nc, ...c]);
      showToast("Customer added", `${form.firstName} ${form.lastName}`);
    } else {
      setCustomers(c => c.map(x => x.id === editTarget ? { ...x, ...form } : x));
      showToast("Customer updated", `${form.firstName} ${form.lastName}`);
    }
    setModalMode(null);
  };

  const handleDelete = () => {
    const c = customers.find(x => x.id === delTarget);
    setCustomers(list => list.filter(x => x.id !== delTarget));
    if (selectedId === delTarget) setSelectedId(null);
    setDelTarget(null);
    showToast("Customer removed", `${c?.firstName} ${c?.lastName}`);
  };

  const showToast = (msg, sub = "") => {
    setToast({ show:true, msg, sub });
    setTimeout(() => setToast({ show:false, msg:"", sub:"" }), 3000);
  };

  const toggleSort = (k) => { if (sortKey === k) setSortAsc(v => !v); else { setSortKey(k); setSortAsc(true); } };
  const SortIcon   = ({ k }) => (
    <span className="sort-arr" style={{ opacity: sortKey===k?1:.3, color: sortKey===k?"var(--gold)":"inherit" }}>
      {sortAsc && sortKey===k ? "▲" : "▼"}
    </span>
  );

  const hasFilter = searchName || searchPhone || searchNic || searchEmail || statFilter!=="All" || cityFilter!=="All" || tagFilter!=="All";
  const clearAll  = () => { setSearchName(""); setSearchPhone(""); setSearchNic(""); setSearchEmail(""); setStatFilter("All"); setCityFilter("All"); setTagFilter("All"); };

  // ── Tag badge ──
  const TagBadge = ({ tag }) => {
    const s = TAG_COLORS[tag] || { bg:"var(--warm2)", border:"var(--ink10)", text:"var(--ink50)" };
    return <span className="tag-chip" style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.text }}>{tag}</span>;
  };

  // ── Status badge ──
  const StatusBadge = ({ status }) => (
    <span className="status-badge" style={{
      background: status==="active"?"var(--greenbg)":"var(--warm2)",
      border:`1px solid ${status==="active"?"var(--greenbr)":"var(--ink10)"}`,
      color: status==="active"?"var(--green)":"var(--ink40)",
    }}>
      <span className="status-dot" style={{ background:status==="active"?"#3D8A65":"#9E9080" }} />
      {status}
    </span>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">

        {/* ══ TOPBAR ══ */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="brand">
              <div className="brand-mark">N</div>
              <div style={{ display:"flex",flexDirection:"column",gap:1 }}>
                <div className="brand-name">Nexus POS</div>
                <div className="brand-sub">Admin · Retail</div>
              </div>
            </div>
            <div className="vdiv" />
            <nav className="breadcrumb">
              <span className="bc-link">Dashboard</span>
              <span className="bc-sep">›</span>
              <span className="bc-link">CRM</span>
              <span className="bc-sep">›</span>
              <span className="bc-active">Customers</span>
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
                <div className="page-eyebrow">CRM · Customer Relations</div>
                <div className="page-title">Customer Management</div>
                <div className="page-desc">{customers.length} registered customers · {totalActive} active</div>
              </div>
              <div className="page-actions">
                <button className="btn btn-ghost">↓ Export</button>
                <button className="btn btn-gold" onClick={openAdd}>＋ Add Customer</button>
              </div>
            </div>

            {/* STAT STRIP */}
            <div className="stat-strip">
              {[
                { label:"Total Customers", val: fmtN(customers.length), sub:"All registered",            color:"var(--blue)"   },
                { label:"Active",          val: fmtN(totalActive),       sub:"Currently engaging",       color:"var(--green)"  },
                { label:"VIP Customers",   val: fmtN(vipCount),          sub:"Tagged as VIP",            color:"var(--gold)"   },
                { label:"New (This Month)",val: fmtN(newCount),          sub:"First-time customers",     color:"var(--purple)" },
                { label:"Total Revenue",   val:`$${Math.round(totalRevenue/1000)}k`, sub:"Lifetime spend",color:"var(--brown)"  },
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
              {/* Name */}
              <div className="filter-group" style={{ minWidth:170 }}>
                <div className="filter-label">Name</div>
                <div className="search-wrap">
                  <span className="search-ico">👤</span>
                  <input className={`search-input${searchName?" active":""}`} placeholder="First or last name…" value={searchName} onChange={e=>setSearchName(e.target.value)} />
                  {searchName && <button className="search-clear" onClick={()=>setSearchName("")}>×</button>}
                </div>
              </div>

              {/* Phone */}
              <div className="filter-group" style={{ minWidth:155 }}>
                <div className="filter-label">Phone</div>
                <div className="search-wrap">
                  <span className="search-ico">📞</span>
                  <input className={`search-input${searchPhone?" active":""}`} placeholder="+94 7X XXX XXXX" value={searchPhone} onChange={e=>setSearchPhone(e.target.value)} style={{ fontFamily:"'Geist Mono',monospace",fontSize:12.5 }} />
                  {searchPhone && <button className="search-clear" onClick={()=>setSearchPhone("")}>×</button>}
                </div>
              </div>

              {/* NIC */}
              <div className="filter-group" style={{ minWidth:150 }}>
                <div className="filter-label">NIC / ID</div>
                <div className="search-wrap">
                  <span className="search-ico">🪪</span>
                  <input className={`search-input${searchNic?" active":""}`} placeholder="NIC number…" value={searchNic} onChange={e=>setSearchNic(e.target.value)} style={{ fontFamily:"'Geist Mono',monospace",fontSize:12.5 }} />
                  {searchNic && <button className="search-clear" onClick={()=>setSearchNic("")}>×</button>}
                </div>
              </div>

              {/* Email */}
              <div className="filter-group" style={{ minWidth:170 }}>
                <div className="filter-label">Email</div>
                <div className="search-wrap">
                  <span className="search-ico">✉</span>
                  <input className={`search-input${searchEmail?" active":""}`} placeholder="Email address…" value={searchEmail} onChange={e=>setSearchEmail(e.target.value)} />
                  {searchEmail && <button className="search-clear" onClick={()=>setSearchEmail("")}>×</button>}
                </div>
              </div>

              <div className="filter-divider" />

              {/* Status */}
              <div className="filter-group">
                <div className="filter-label">Status</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={statFilter} onChange={e=>setStatFilter(e.target.value)}>
                    <option>All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              {/* City */}
              <div className="filter-group">
                <div className="filter-label">City</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={cityFilter} onChange={e=>setCityFilter(e.target.value)}>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              {/* Tag */}
              <div className="filter-group">
                <div className="filter-label">Tag</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={tagFilter} onChange={e=>setTagFilter(e.target.value)} style={{ minWidth:110 }}>
                    {TAG_OPTS.map(t=><option key={t}>{t}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              <div className="filter-divider" />

              {/* View */}
              <div className="filter-group">
                <div className="filter-label">View</div>
                <div className="view-toggle">
                  <button className={`view-btn${view==="table"?" active":""}`} onClick={()=>setView("table")} title="Table">☰</button>
                  <button className={`view-btn${view==="card"?" active":""}`}  onClick={()=>setView("card")}  title="Cards">⊞</button>
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
                Showing <strong>{filtered.length}</strong> of <strong>{customers.length}</strong> customers
                {hasFilter && " (filtered)"}
              </div>
              <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                <span style={{ fontSize:11,color:"var(--ink40)",fontWeight:600 }}>Sort</span>
                <div className="filter-select-wrap">
                  <select className="filter-select" style={{ minWidth:140,fontSize:12 }}
                    value={sortKey} onChange={e=>{ setSortKey(e.target.value); setSortAsc(true); }}>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                    <option value="totalSpend">Total Spend</option>
                    <option value="loyaltyPoints">Loyalty Pts</option>
                    <option value="visits">Visits</option>
                    <option value="joinedAt">Date Joined</option>
                    <option value="lastVisit">Last Visit</option>
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
                <button className="btn btn-ghost" style={{ padding:"7px 11px",fontSize:13 }}
                  onClick={()=>setSortAsc(v=>!v)}>{sortAsc?"↑":"↓"}</button>
              </div>
            </div>

            {/* ══ TABLE VIEW ══ */}
            {view === "table" && (
              <div className="table-card">
                {filtered.length === 0
                  ? <div className="empty-state"><div className="empty-ico">👥</div><div className="empty-title">No customers found</div><div className="empty-sub">Try adjusting your search filters or add a new customer.</div><button className="btn btn-ghost" onClick={clearAll}>Clear filters</button></div>
                  : (
                    <>
                      <div className="tbl-head">
                        <div className="tbl-hcell" />
                        <div className={`tbl-hcell${sortKey==="firstName"?" sorted":""}`} onClick={()=>toggleSort("firstName")}>Customer <SortIcon k="firstName" /></div>
                        <div className={`tbl-hcell${sortKey==="phone"?" sorted":""}`} onClick={()=>toggleSort("phone")}>Phone / NIC <SortIcon k="phone" /></div>
                        <div className={`tbl-hcell${sortKey==="totalSpend"?" sorted":""}`} onClick={()=>toggleSort("totalSpend")}>Spend <SortIcon k="totalSpend" /></div>
                        <div className={`tbl-hcell${sortKey==="loyaltyPoints"?" sorted":""}`} onClick={()=>toggleSort("loyaltyPoints")}>Loyalty <SortIcon k="loyaltyPoints" /></div>
                        <div className="tbl-hcell">Status</div>
                        <div className="tbl-hcell" style={{ justifyContent:"flex-end" }}>Actions</div>
                      </div>

                      {filtered.map((c,i) => {
                        const [clr, bg] = avatarColor(c.id);
                        const tier = tierInfo(c.totalSpend);
                        return (
                          <div
                            key={c.id}
                            className={`tbl-row${selectedId===c.id?" selected-row":""}`}
                            style={{ animationDelay:`${i*15}ms`,animation:"fadeUp .4s ease both" }}
                            onClick={()=>setSelectedId(s=>s===c.id?null:c.id)}
                          >
                            {/* Avatar */}
                            <div className="cust-av" style={{ background:bg, border:`1.5px solid ${clr}30`, color:clr }}>
                              {initials(c)}
                            </div>

                            {/* Name + email */}
                            <div style={{ minWidth:0 }}>
                              <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:2 }}>
                                <span className="cust-name">{c.firstName} {c.lastName}</span>
                                {c.tags.slice(0,2).map(t=><TagBadge key={t} tag={t}/>)}
                              </div>
                              <div className="cust-sub">{c.email || <span style={{ fontStyle:"italic",color:"var(--ink20)" }}>No email</span>}</div>
                            </div>

                            {/* Phone / NIC */}
                            <div>
                              <div className="tbl-mono" style={{ marginBottom:2 }}>{c.phone}</div>
                              <div style={{ fontFamily:"'Geist Mono',monospace",fontSize:10,color:"var(--ink30)" }}>{c.nic}</div>
                            </div>

                            {/* Spend */}
                            <div>
                              <div style={{ fontFamily:"'Geist Mono',monospace",fontSize:13,fontWeight:700,color:"var(--ink)",marginBottom:2 }}>${fmt(c.totalSpend)}</div>
                              <span style={{ padding:"2px 7px",borderRadius:20,fontSize:9,fontWeight:700,background:tier.bg,border:`1px solid ${tier.border}`,color:tier.color }}>{tier.label}</span>
                            </div>

                            {/* Loyalty */}
                            <div>
                              <div style={{ fontFamily:"'Geist Mono',monospace",fontSize:13,fontWeight:700,color:"var(--gold)" }}>{fmtN(c.loyaltyPoints)}</div>
                              <div style={{ fontSize:10,color:"var(--ink40)" }}>{c.visits} visits</div>
                            </div>

                            <StatusBadge status={c.status} />

                            <div className="tbl-actions" onClick={e=>e.stopPropagation()}>
                              <button className="tbl-act-btn edit" title="Edit" onClick={()=>openEdit(c)}>✏</button>
                              <button className="tbl-act-btn del"  title="Delete" onClick={()=>setDelTarget(c.id)}>🗑</button>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )
                }
              </div>
            )}

            {/* ══ CARD VIEW ══ */}
            {view === "card" && (
              filtered.length === 0
                ? <div className="table-card"><div className="empty-state"><div className="empty-ico">👥</div><div className="empty-title">No customers found</div><div className="empty-sub">Adjust filters to find customers.</div><button className="btn btn-ghost" onClick={clearAll}>Clear filters</button></div></div>
                : (
                  <div className="cust-grid">
                    {filtered.map((c,i) => {
                      const [clr,bg] = avatarColor(c.id);
                      const tier = tierInfo(c.totalSpend);
                      return (
                        <div
                          key={c.id}
                          className={`cust-card${selectedId===c.id?" drawer-selected":""}`}
                          style={{ animationDelay:`${i*20}ms`,animation:"fadeUp .4s ease both" }}
                          onClick={()=>setSelectedId(s=>s===c.id?null:c.id)}
                        >
                          <div className="cust-card-top">
                            <div className="cust-av" style={{ background:bg,border:`1.5px solid ${clr}30`,color:clr,width:46,height:46,borderRadius:10,fontSize:16 }}>
                              {initials(c)}
                            </div>
                            <div className="cust-card-info">
                              <div className="cust-card-name">{c.firstName} {c.lastName}</div>
                              <div className="cust-card-email">{c.email || "—"}</div>
                              <div className="cust-card-tags">
                                {c.tags.map(t=><TagBadge key={t} tag={t}/>)}
                              </div>
                            </div>
                          </div>
                          <div className="cust-card-stats">
                            <div className="cust-stat"><div className="cst-val">${Math.round(c.totalSpend/1000*10)/10}k</div><div className="cst-lbl">Spent</div></div>
                            <div className="cust-stat"><div className="cst-val">{fmtN(c.loyaltyPoints)}</div><div className="cst-lbl">Points</div></div>
                            <div className="cust-stat"><div className="cst-val">{c.visits}</div><div className="cst-lbl">Visits</div></div>
                          </div>
                          <div className="cust-card-footer">
                            <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                              <StatusBadge status={c.status} />
                              <span style={{ padding:"3px 8px",borderRadius:20,fontSize:9,fontWeight:700,background:tier.bg,border:`1px solid ${tier.border}`,color:tier.color }}>{tier.label}</span>
                            </div>
                            <div className="cust-card-actions" onClick={e=>e.stopPropagation()}>
                              <button className="cust-act-btn edit" onClick={()=>openEdit(c)}>✏</button>
                              <button className="cust-act-btn del"  onClick={()=>setDelTarget(c.id)}>🗑</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
            )}

          </div>

          {/* ══ DETAIL DRAWER ══ */}
          {selectedId && selectedCustomer && (() => {
            const c = selectedCustomer;
            const [clr,bg] = avatarColor(c.id);
            const tier = tierInfo(c.totalSpend);
            const nextTierSpend = c.totalSpend >= 10000 ? null : c.totalSpend >= 5000 ? 10000 : c.totalSpend >= 1500 ? 5000 : 1500;
            const loyaltyPct = Math.min((c.loyaltyPoints / 5000) * 100, 100);
            return (
              <>
                <div className="drawer-overlay" onClick={()=>setSelectedId(null)} />
                <aside className="drawer">
                  <div className="drawer-head">
                    <div className="drawer-head-top">
                      <span className="drawer-eyebrow">Customer Profile</span>
                      <button className="drawer-close" onClick={()=>setSelectedId(null)}>×</button>
                    </div>
                    <div className="drawer-profile">
                      <div className="cust-av-lg" style={{ background:bg, border:`2px solid ${clr}35`, color:clr }}>{initials(c)}</div>
                      <div>
                        <div className="drawer-cust-name">{c.firstName} {c.lastName}</div>
                        <div className="drawer-cust-email">{c.email || "No email on file"}</div>
                        <div className="drawer-tags">
                          {c.tags.map(t=><TagBadge key={t} tag={t}/>)}
                          <span style={{ padding:"3px 8px",borderRadius:20,fontSize:9,fontWeight:700,background:tier.bg,border:`1px solid ${tier.border}`,color:tier.color }}>{tier.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="drawer-body">

                    {/* KPIs */}
                    <div className="d-kpi-row">
                      <div className="d-kpi"><div className="d-kpi-val">${fmt(c.totalSpend)}</div><div className="d-kpi-lbl">Total Spend</div></div>
                      <div className="d-kpi"><div className="d-kpi-val">{c.visits}</div><div className="d-kpi-lbl">Visits</div></div>
                      <div className="d-kpi"><div className="d-kpi-val">{c.totalSpend&&c.visits?`$${fmt(c.totalSpend/c.visits)}`:"—"}</div><div className="d-kpi-lbl">Avg / Visit</div></div>
                    </div>

                    {/* Loyalty */}
                    <div>
                      <div className="d-section">Loyalty</div>
                      <div className="loyalty-bar-wrap">
                        <div className="loyalty-top">
                          <span className="loyalty-label">Points Balance</span>
                          <span className="loyalty-pts">{fmtN(c.loyaltyPoints)} pts</span>
                        </div>
                        <div className="loyalty-bar">
                          <div className="loyalty-fill" style={{ width:`${loyaltyPct}%` }} />
                        </div>
                        <div className="loyalty-next">
                          {tier.label === "Platinum"
                            ? "✦ Platinum tier — highest level"
                            : `${fmtN(nextTierSpend - c.totalSpend)} more to next tier`}
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <div className="d-section">Contact Details</div>
                      <div className="d-row"><span className="d-label">Phone</span><span className="d-value d-mono">{c.phone}</span></div>
                      <div className="d-row"><span className="d-label">Email</span><span className="d-value" style={{ fontSize:12 }}>{c.email||"—"}</span></div>
                      <div className="d-row"><span className="d-label">NIC / ID</span><span className="d-value d-mono">{c.nic||"—"}</span></div>
                      <div className="d-row"><span className="d-label">Address</span><span className="d-value">{c.address||"—"}</span></div>
                    </div>

                    {/* Account */}
                    <div>
                      <div className="d-section">Account</div>
                      <div className="d-row"><span className="d-label">Status</span><StatusBadge status={c.status} /></div>
                      <div className="d-row"><span className="d-label">Joined</span><span className="d-value d-mono">{c.joinedAt}</span></div>
                      <div className="d-row"><span className="d-label">Last Visit</span><span className="d-value d-mono">{c.lastVisit}</span></div>
                    </div>

                    {/* Notes */}
                    {c.notes && (
                      <div>
                        <div className="d-section">Notes</div>
                        <div className="notes-box">{c.notes}</div>
                      </div>
                    )}

                  </div>

                  <div className="drawer-actions">
                    <button className="d-btn d-btn-gold" onClick={()=>{ openEdit(c); }}>✏ Edit</button>
                    <button className="d-btn d-btn-ghost" style={{ flex:"0 0 auto",padding:"10px 14px" }}>📋</button>
                    <button className="d-btn d-btn-danger" style={{ flex:"0 0 auto",padding:"10px 14px" }} onClick={()=>setDelTarget(c.id)}>🗑</button>
                  </div>
                </aside>
              </>
            );
          })()}
        </div>

        {/* ══ DELETE CONFIRM ══ */}
        {delTarget && (() => {
          const c = customers.find(x=>x.id===delTarget);
          const [clr,bg] = avatarColor(c?.id||1);
          return (
            <div className="modal-backdrop" onClick={()=>setDelTarget(null)}>
              <div className="modal del-modal" onClick={e=>e.stopPropagation()}>
                <div className="modal-head">
                  <div><div className="modal-eyebrow">Confirm Action</div><div className="modal-title">Remove Customer</div></div>
                  <button className="modal-close" onClick={()=>setDelTarget(null)}>×</button>
                </div>
                <div className="del-body">
                  <div className="cust-av-lg" style={{ background:bg,border:`2px solid ${clr}35`,color:clr,fontSize:22 }}>{c&&initials(c)}</div>
                  <div className="del-title">{c?.firstName} {c?.lastName}</div>
                  <div className="del-sub">This will permanently remove the customer record, including their purchase history and loyalty points. This action cannot be undone.</div>
                  <div style={{ display:"flex",gap:10,width:"100%",marginTop:4 }}>
                    <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setDelTarget(null)}>Cancel</button>
                    <button className="btn btn-red"   style={{ flex:1 }} onClick={handleDelete}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TOAST */}
        <div className={`toast${toast.show?" show":""}`}>
          <span className="toast-icon">✦</span>
          <span className="toast-msg">{toast.msg}</span>
          {toast.sub && <span className="toast-sub">· {toast.sub}</span>}
        </div>

        {modalMode === "add" && (
          <AddCustomer
            onClose={() => setModalMode(null)}
            onSave={(newCustomer) => {
              setCustomers(c => [newCustomer, ...c]);
              showToast("Customer added", `${newCustomer.firstName} ${newCustomer.lastName}`);
            }}
          />
        )}

      </div>
    </>
  );
}