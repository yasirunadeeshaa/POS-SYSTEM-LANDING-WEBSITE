import { useState, useEffect, useRef } from "react";

// ─── CONFIG — edit these to match your setup ─────────────────────────────────
const POS_CONFIG = {
  posName:    "Nexus POS",
  branchName: "Colombo Main Branch",
  branchCode: "BR-001",
  version:    "v2.4.1",
};

const NAV_LINKS = [
  { label: "Dashboard", icon: "⊞", routeTo: "/dashboard" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "warning", title: "Low Stock Alert",       body: "USB-C Hub 7-in-1 has only 3 units left.",             time: "2m ago",  read: false },
  { id: 2, type: "success", title: "GRN-2026-042 Posted",   body: "Goods received from TechSource Lanka successfully.",  time: "18m ago", read: false },
  { id: 3, type: "info",    title: "PO-2026-031 Approved",  body: "Purchase order approved by Manager.",                 time: "1h ago",  read: true  },
  { id: 4, type: "warning", title: "Shift Ending Soon",     body: "Current shift ends in 30 minutes.",                  time: "2h ago",  read: true  },
  { id: 5, type: "error",   title: "Sync Error",            body: "Last sync failed. Retrying automatically.",           time: "3h ago",  read: true  },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

:root {
  --cream:#F6F3EC; --paper:#FDFBF7; --warm:#EEE9DF; --warm2:#E4DDD2;
  --ink:#1B1713; --ink70:#4B4038; --ink50:#6B5F54; --ink40:#9E9080;
  --ink20:#C9C0B2; --ink10:#E4DDD2; --ink06:#EDE8E0;
  --gold:#B8902A; --goldl:#D4A83C; --goldd:#8A6A1A;
  --goldbg:rgba(184,144,42,.1); --goldbr:rgba(184,144,42,.3);
  --green:#2D6A4F; --greenbg:rgba(45,106,79,.12); --greenbr:rgba(45,106,79,.3);
  --red:#B5372A; --redbg:rgba(181,55,42,.12); --redbr:rgba(181,55,42,.28);
  --blue:#2B5490; --bluebg:rgba(43,84,144,.12); --bluebr:rgba(43,84,144,.28);
  --amber:#B8902A;
}

/* ── Header shell ── */
.nh-wrap {
  position: sticky; top: 0; z-index: 100;
  font-family: 'DM Sans', sans-serif;
}

/* ── Top bar ── */
.nh-topbar {
  height: 56px;
  background: var(--ink);
  border-bottom: 2px solid var(--gold);
  display: flex; align-items: center;
  padding: 0 20px; gap: 0;
  position: relative;
}
.nh-topbar::after {
  content: '';
  position: absolute; bottom: -2px; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--goldd) 0%, var(--goldl) 40%, var(--gold) 70%, var(--goldd) 100%);
  pointer-events: none;
}

/* Logo zone */
.nh-logo {
  display: flex; align-items: center; gap: 11px;
  padding-right: 20px;
  border-right: 1px solid rgba(246,243,236,.1);
  flex-shrink: 0;
}
.nh-logo-mark {
  width: 34px; height: 34px; border-radius: 7px;
  background: linear-gradient(135deg, rgba(184,144,42,.25) 0%, rgba(184,144,42,.08) 100%);
  border: 1.5px solid var(--goldbr);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 700; color: var(--goldl);
  position: relative; overflow: hidden;
}
.nh-logo-mark::before {
  content: '';
  position: absolute; top: -6px; right: -6px;
  width: 18px; height: 18px; border-radius: 50%;
  background: radial-gradient(circle, rgba(212,168,60,.35) 0%, transparent 70%);
}
.nh-logo-text {}
.nh-logo-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px; font-weight: 700; color: #F6F3EC;
  line-height: 1; letter-spacing: -.2px;
}
.nh-logo-branch {
  font-size: 9px; font-weight: 600; letter-spacing: 1.8px;
  text-transform: uppercase; color: var(--gold);
  margin-top: 2px; display: flex; align-items: center; gap: 5px;
}
.nh-branch-code {
  font-family: 'Geist Mono', monospace;
  font-size: 8.5px; color: rgba(184,144,42,.55);
  background: rgba(184,144,42,.1); border: 1px solid rgba(184,144,42,.18);
  padding: 1px 5px; border-radius: 3px;
}

/* Nav — dashboard only, no right border */
.nh-nav {
  display: flex; align-items: center; gap: 2px;
  padding: 0 16px;
  flex-shrink: 0;
}
.nh-nav-link {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 6px;
  font-size: 11.5px; font-weight: 600;
  color: rgba(246,243,236,.4);
  cursor: pointer; transition: all .15s;
  border: 1px solid transparent;
  white-space: nowrap;
  background: none;
  font-family: 'DM Sans', sans-serif;
}
.nh-nav-link:hover {
  color: rgba(246,243,236,.8);
  background: rgba(246,243,236,.06);
}
.nh-nav-link.active {
  color: var(--goldl);
  background: rgba(184,144,42,.12);
  border-color: rgba(184,144,42,.22);
}
.nh-nav-icon {
  font-size: 13px; line-height: 1; opacity: .7;
}

/* Centered clock in topbar */
.nh-center {
  position: absolute; left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  pointer-events: none;
}
.nh-center-time {
  font-family: 'Geist Mono', monospace;
  font-size: 15px; font-weight: 600;
  color: rgba(246,243,236,.85);
  letter-spacing: 1px; line-height: 1;
}
.nh-center-date {
  font-size: 9.5px; font-weight: 500;
  color: var(--gold);
  letter-spacing: 1.2px; text-transform: uppercase;
}

/* Right cluster */
.nh-right {
  margin-left: auto;
  display: flex; align-items: center; gap: 6px;
}

/* Network status pill */
.nh-net {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 11px; border-radius: 20px;
  font-size: 10.5px; font-weight: 700;
  border: 1.5px solid; cursor: default;
  transition: all .3s;
}
.nh-net.online  { color: var(--green); background: var(--greenbg); border-color: var(--greenbr); }
.nh-net.offline { color: var(--red);   background: var(--redbg);   border-color: var(--redbr);   }
.nh-net.syncing { color: var(--amber); background: var(--goldbg);  border-color: var(--goldbr);  }
.nh-net-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.nh-net.online  .nh-net-dot { background: var(--green);  animation: nhPulse 2s ease infinite; }
.nh-net.offline .nh-net-dot { background: var(--red); }
.nh-net.syncing .nh-net-dot { background: var(--amber); animation: nhSpin 1s linear infinite; border-radius: 0; clip-path: polygon(50% 0%,100% 100%,0% 100%); }
@keyframes nhPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
@keyframes nhSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

/* Separator */
.nh-sep {
  width: 1px; height: 22px;
  background: rgba(246,243,236,.1);
  flex-shrink: 0; margin: 0 2px;
}

/* Notification button */
.nh-notif-btn {
  position: relative;
  width: 34px; height: 34px; border-radius: 8px;
  background: rgba(246,243,236,.05);
  border: 1px solid rgba(246,243,236,.1);
  color: rgba(246,243,236,.5); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s; flex-shrink: 0;
}
.nh-notif-btn:hover { background: rgba(246,243,236,.1); color: rgba(246,243,236,.85); }
.nh-notif-btn.has-unread { color: var(--goldl); border-color: rgba(184,144,42,.3); background: rgba(184,144,42,.1); }
.nh-notif-badge {
  position: absolute; top: 4px; right: 4px;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--red); border: 2px solid var(--ink);
  font-size: 7px; font-weight: 800; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Geist Mono', monospace;
}

/* Shift pill */
.nh-shift {
  display: flex; align-items: center; gap: 7px;
  padding: 5px 12px; border-radius: 20px;
  border: 1.5px solid;
  font-size: 10.5px; font-weight: 700; cursor: pointer;
  transition: all .15s; flex-shrink: 0;
}
.nh-shift.open   { color: var(--green); background: var(--greenbg); border-color: var(--greenbr); }
.nh-shift.closed { color: var(--red);   background: var(--redbg);   border-color: var(--redbr);   }
.nh-shift-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.nh-shift.open   .nh-shift-dot { background: var(--green); }
.nh-shift.closed .nh-shift-dot { background: var(--red); }

/* User badge */
.nh-user {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 4px 4px 12px; border-radius: 20px;
  background: rgba(246,243,236,.05); border: 1px solid rgba(246,243,236,.1);
  cursor: pointer; transition: all .15s; flex-shrink: 0;
}
.nh-user:hover { background: rgba(246,243,236,.1); border-color: rgba(246,243,236,.2); }
.nh-user-info { text-align: right; }
.nh-user-name  { font-size: 11.5px; font-weight: 700; color: rgba(246,243,236,.85); line-height: 1; }
.nh-user-role  { font-size: 9px; color: rgba(246,243,236,.35); margin-top: 2px; letter-spacing: .5px; }
.nh-user-av {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, var(--goldbg), rgba(184,144,42,.18));
  border: 1.5px solid var(--goldbr);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px; font-weight: 700; color: var(--goldl);
}

/* Live clock — kept for shift modal use */
.nh-clock-time {
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 600; color: rgba(246,243,236,.7);
  letter-spacing: .5px;
}
.nh-clock-date {
  font-size: 10px; color: rgba(246,243,236,.3); font-weight: 500;
}

/* ── Notification dropdown ── */
.nh-notif-panel {
  position: absolute; top: calc(100% + 8px); right: 0;
  width: 340px;
  background: var(--paper);
  border: 1px solid var(--ink10);
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(27,23,19,.22), 0 4px 12px rgba(27,23,19,.1);
  overflow: hidden;
  animation: nhDropIn .2s cubic-bezier(.16,1,.3,1);
  z-index: 200;
}
@keyframes nhDropIn { from{opacity:0;transform:translateY(-8px) scale(.97)} to{opacity:1;transform:none} }
.nh-np-head {
  padding: 13px 16px 11px;
  background: var(--ink);
  border-bottom: 1px solid rgba(184,144,42,.18);
  display: flex; align-items: center; justify-content: space-between;
}
.nh-np-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; font-weight: 600; color: #F6F3EC;
}
.nh-np-mark-all {
  font-size: 10px; font-weight: 700; color: var(--gold);
  background: none; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; padding: 0; transition: opacity .13s;
}
.nh-np-mark-all:hover { opacity: .7; }
.nh-np-list { max-height: 320px; overflow-y: auto; }
.nh-np-list::-webkit-scrollbar { width: 3px; }
.nh-np-list::-webkit-scrollbar-thumb { background: var(--ink10); border-radius: 3px; }
.nh-np-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 11px 14px; border-bottom: 1px solid var(--ink06);
  cursor: pointer; transition: background .12s;
  position: relative;
}
.nh-np-item:last-child { border-bottom: none; }
.nh-np-item:hover { background: var(--warm); }
.nh-np-item.unread { background: rgba(184,144,42,.04); }
.nh-np-item.unread::before {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  border-radius: 0 2px 2px 0;
}
.nh-np-item.unread.warning::before { background: var(--gold); }
.nh-np-item.unread.success::before { background: var(--green); }
.nh-np-item.unread.info::before    { background: var(--blue); }
.nh-np-item.unread.error::before   { background: var(--red); }
.nh-np-icon {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 13px;
}
.nh-np-icon.warning { background: var(--goldbg); border: 1px solid var(--goldbr); }
.nh-np-icon.success { background: var(--greenbg); border: 1px solid var(--greenbr); }
.nh-np-icon.info    { background: var(--bluebg);  border: 1px solid var(--bluebr);  }
.nh-np-icon.error   { background: var(--redbg);   border: 1px solid var(--redbr);   }
.nh-np-content { flex: 1; min-width: 0; }
.nh-np-ntitle { font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 2px; }
.nh-np-body   { font-size: 11px; color: var(--ink50); line-height: 1.5; }
.nh-np-time   { font-size: 9.5px; color: var(--ink40); margin-top: 3px; font-family: 'Geist Mono', monospace; }
.nh-np-footer {
  padding: 9px 14px;
  border-top: 1px solid var(--ink06);
  text-align: center; background: var(--warm);
  font-size: 11px; font-weight: 700; color: var(--gold);
  cursor: pointer; transition: background .13s;
}
.nh-np-footer:hover { background: var(--warm2); }

/* ── Shift confirm modal ── */
.nh-shift-modal-bg {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(27,23,19,.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  animation: nhFadeIn .18s ease;
}
@keyframes nhFadeIn { from{opacity:0} to{opacity:1} }
.nh-shift-modal {
  background: var(--paper);
  border: 1px solid var(--ink10); border-radius: 14px;
  width: 320px; overflow: hidden;
  box-shadow: 0 24px 64px rgba(27,23,19,.25);
  animation: nhScaleIn .22s cubic-bezier(.16,1,.3,1);
}
@keyframes nhScaleIn { from{opacity:0;transform:scale(.94) translateY(10px)} to{opacity:1;transform:none} }
.nh-sm-head {
  padding: 14px 18px;
  background: var(--ink);
  border-bottom: 1px solid rgba(184,144,42,.18);
}
.nh-sm-title { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 600; color: #F6F3EC; }
.nh-sm-sub   { font-size: 10.5px; color: rgba(246,243,236,.35); margin-top: 2px; }
.nh-sm-body  { padding: 16px 18px; }
.nh-sm-info  { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.nh-sm-row   { display: flex; justify-content: space-between; align-items: center; font-size: 12px; padding: 5px 0; border-bottom: 1px solid var(--ink06); }
.nh-sm-row:last-child { border-bottom: none; }
.nh-sm-lbl   { color: var(--ink40); font-weight: 500; font-size: 10.5px; text-transform: uppercase; letter-spacing: .8px; }
.nh-sm-val   { font-weight: 700; color: var(--ink70); font-family: 'Geist Mono', monospace; font-size: 11.5px; }
.nh-sm-btns  { display: flex; gap: 8px; }
.nh-sm-btn   { flex: 1; padding: 9px; border-radius: 7px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all .14s; font-family: 'DM Sans', sans-serif; border: 1px solid; }
.nh-sm-btn.cancel  { background: transparent; border-color: var(--ink10); color: var(--ink50); }
.nh-sm-btn.cancel:hover  { background: var(--warm); }
.nh-sm-btn.confirm-open  { background: var(--green); border-color: rgba(45,106,79,.6); color: #fff; }
.nh-sm-btn.confirm-open:hover  { background: #3D8A65; }
.nh-sm-btn.confirm-close { background: var(--red); border-color: rgba(181,55,42,.6); color: #fff; }
.nh-sm-btn.confirm-close:hover { background: #C94030; }

/* Demo page wrapper */
.nh-demo-page { min-height: 100vh; background: var(--cream); font-family: 'DM Sans', sans-serif; }
.nh-demo-body { padding: 28px; max-width: 900px; margin: 0 auto; }
.nh-demo-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
.nh-demo-sub   { font-size: 12.5px; color: var(--ink40); margin-bottom: 24px; }
.nh-demo-card  { background: var(--paper); border: 1px solid var(--ink10); border-radius: 10px; padding: 20px 24px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(27,23,19,.06); }
.nh-demo-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 10px; }
.nh-code-block {
  background: var(--ink); border-radius: 8px; padding: 16px 18px;
  font-family: 'Geist Mono', monospace; font-size: 12px; line-height: 1.7;
  color: rgba(246,243,236,.75); overflow-x: auto;
  border: 1px solid rgba(184,144,42,.15);
}
.nh-code-block .kw  { color: var(--goldl); }
.nh-code-block .str { color: #98C379; }
.nh-code-block .cmt { color: rgba(246,243,236,.25); font-style: italic; }
.nh-code-block .fn  { color: #61AFEF; }
.nh-code-block .tag { color: #E06C75; }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const NOTIF_ICONS = { warning:"⚠", success:"✓", info:"ℹ", error:"✕" };

const formatTime = d => d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true});
const formatDate = d => d.toLocaleDateString("en-US",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});

// ─── HEADER COMPONENT ────────────────────────────────────────────────────────
export function NexusHeader({
  // Props you can pass from any page
  activePage   = "Dashboard",   // highlights the matching nav link
  breadcrumbs  = [],            // e.g. [{ label:"Documents" }, { label:"GRN", current:true }]
  user         = { name:"Kasun Fernando", role:"Cashier", initials:"KF" },
  onNavigate   = () => {},      // called with path when nav link is clicked
}) {
  const [now,          setNow]         = useState(new Date());
  const [netStatus,    setNetStatus]   = useState("online");   // online | offline | syncing
  const [shiftOpen,    setShiftOpen]   = useState(true);
  const [shiftStart,   setShiftStart]  = useState("08:30 AM");
  const [showNotif,    setShowNotif]   = useState(false);
  const [showShiftModal,setShowShiftModal] = useState(false);
  const [notifications,setNotifications]  = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef();

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate network events
  useEffect(() => {
    const t = setInterval(() => {
      const r = Math.random();
      if (r < 0.05)       setNetStatus("offline");
      else if (r < 0.12)  setNetStatus("syncing");
      else                setNetStatus("online");
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // Close notif panel on outside click
  useEffect(() => {
    const h = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead  = () => setNotifications(ns => ns.map(n => ({...n, read:true})));
  const markOneRead  = id  => setNotifications(ns => ns.map(n => n.id===id ? {...n,read:true} : n));

  const handleShiftToggle = () => {
    setShiftOpen(v => !v);
    if (!shiftOpen) setShiftStart(formatTime(new Date()).replace(/:\d\d\s/, " "));
    setShowShiftModal(false);
  };

  const netLabel = { online:"Online", offline:"Offline", syncing:"Syncing…" };

  return (
    <>
      <style>{CSS}</style>

      {/* ── Shift Modal ── */}
      {showShiftModal && (
        <div className="nh-shift-modal-bg" onClick={()=>setShowShiftModal(false)}>
          <div className="nh-shift-modal" onClick={e=>e.stopPropagation()}>
            <div className="nh-sm-head">
              <div className="nh-sm-title">{shiftOpen ? "Close Shift" : "Open Shift"}</div>
              <div className="nh-sm-sub">{shiftOpen ? "Confirm end of current shift" : "Start a new shift"}</div>
            </div>
            <div className="nh-sm-body">
              <div className="nh-sm-info">
                <div className="nh-sm-row"><span className="nh-sm-lbl">Cashier</span><span className="nh-sm-val">{user.name}</span></div>
                <div className="nh-sm-row"><span className="nh-sm-lbl">Branch</span><span className="nh-sm-val">{POS_CONFIG.branchCode}</span></div>
                <div className="nh-sm-row"><span className="nh-sm-lbl">{shiftOpen ? "Shift Start" : "New Shift"}</span><span className="nh-sm-val">{shiftOpen ? shiftStart : formatTime(new Date())}</span></div>
                <div className="nh-sm-row"><span className="nh-sm-lbl">{shiftOpen ? "Close Time" : "Opening Time"}</span><span className="nh-sm-val">{formatTime(now)}</span></div>
              </div>
              <div className="nh-sm-btns">
                <button className="nh-sm-btn cancel" onClick={()=>setShowShiftModal(false)}>Cancel</button>
                <button className={`nh-sm-btn ${shiftOpen?"confirm-close":"confirm-open"}`} onClick={handleShiftToggle}>
                  {shiftOpen ? "Close Shift" : "Open Shift"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="nh-wrap">
        {/* ── TOPBAR ── */}
        <div className="nh-topbar">

          {/* Logo */}
          <div className="nh-logo">
            <div className="nh-logo-mark">N</div>
            <div className="nh-logo-text">
              <div className="nh-logo-name">{POS_CONFIG.posName}</div>
              <div className="nh-logo-branch">
                {POS_CONFIG.branchName}
                <span className="nh-branch-code">{POS_CONFIG.branchCode}</span>
              </div>
            </div>
          </div>

          {/* Nav links — Dashboard only + breadcrumbs */}
          <nav className="nh-nav">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                className={`nh-nav-link${activePage===link.label?" active":""}`}
                onClick={() => onNavigate(link.path, link.label)}
              >
                <span className="nh-nav-icon">{link.icon}</span>
                {link.label}
              </button>
            ))}

            {/* Breadcrumbs — inline right of Dashboard button */}
            {breadcrumbs.length > 0 && (
              <div style={{display:"flex",alignItems:"center",gap:5,paddingLeft:10,borderLeft:"1px solid rgba(246,243,236,.1)",marginLeft:6}}>
                {breadcrumbs.map((b, i) => (
                  <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                    {i > 0 && <span style={{color:"rgba(246,243,236,.15)",fontSize:11}}>›</span>}
                    {b.current
                      ? <span style={{fontSize:11.5,fontWeight:700,color:"var(--goldl)"}}>{b.label}</span>
                      : <span style={{fontSize:11.5,fontWeight:500,color:"rgba(246,243,236,.3)",cursor:"pointer",transition:"color .13s"}} onMouseEnter={e=>e.target.style.color="rgba(246,243,236,.65)"} onMouseLeave={e=>e.target.style.color="rgba(246,243,236,.3)"}>{b.label}</span>
                    }
                  </span>
                ))}
              </div>
            )}
          </nav>

          {/* Centered clock */}
          <div className="nh-center">
            <div className="nh-center-time">{formatTime(now)}</div>
            <div className="nh-center-date">{formatDate(now)}</div>
          </div>

          {/* Right cluster */}
          <div className="nh-right">

            {/* Network status */}
            <div className={`nh-net ${netStatus}`}>
              <span className="nh-net-dot"/>
              {netLabel[netStatus]}
            </div>

            <div className="nh-sep"/>

            {/* Notifications */}
            <div style={{position:"relative"}} ref={notifRef}>
              <button
                className={`nh-notif-btn${unreadCount>0?" has-unread":""}`}
                onClick={() => setShowNotif(v=>!v)}
                title="Notifications"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && <span className="nh-notif-badge">{unreadCount}</span>}
              </button>

              {/* Notification panel */}
              {showNotif && (
                <div className="nh-notif-panel">
                  <div className="nh-np-head">
                    <span className="nh-np-title">Notifications {unreadCount>0&&<span style={{fontSize:11,fontFamily:"'Geist Mono',monospace",color:"var(--gold)",marginLeft:6}}>{unreadCount} new</span>}</span>
                    {unreadCount>0 && <button className="nh-np-mark-all" onClick={markAllRead}>Mark all read</button>}
                  </div>
                  <div className="nh-np-list">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`nh-np-item ${n.type}${!n.read?" unread":""}`}
                        onClick={() => markOneRead(n.id)}
                      >
                        <div className={`nh-np-icon ${n.type}`}>{NOTIF_ICONS[n.type]}</div>
                        <div className="nh-np-content">
                          <div className="nh-np-ntitle">{n.title}</div>
                          <div className="nh-np-body">{n.body}</div>
                          <div className="nh-np-time">{n.time}</div>
                        </div>
                        {!n.read && <div style={{width:7,height:7,borderRadius:"50%",background:"var(--gold)",flexShrink:0,marginTop:4}}/>}
                      </div>
                    ))}
                  </div>
                  <div className="nh-np-footer" onClick={()=>setShowNotif(false)}>
                    View all notifications →
                  </div>
                </div>
              )}
            </div>

            <div className="nh-sep"/>

            {/* Shift toggle */}
            <button className={`nh-shift ${shiftOpen?"open":"closed"}`} onClick={()=>setShowShiftModal(true)}>
              <span className="nh-shift-dot"/>
              {shiftOpen ? `Shift Open · ${shiftStart}` : "Shift Closed"}
            </button>

            <div className="nh-sep"/>

            {/* User */}
            <div className="nh-user">
              <div className="nh-user-info">
                <div className="nh-user-name">{user.name}</div>
                <div className="nh-user-role">{user.role}</div>
              </div>
              <div className="nh-user-av">{user.initials}</div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

// ─── DEMO PAGE (shows the header + integration guide) ────────────────────────
export default function NexusHeaderDemo() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="nh-demo-page">
      <NexusHeader
        activePage={activePage}
        breadcrumbs={[{ label:"Dashboard", current: activePage==="Dashboard" }]}
        user={{ name:"Kasun Fernando", role:"Cashier", initials:"KF" }}
        onNavigate={(path, label) => setActivePage(label)}
      />

      <div className="nh-demo-body">
        <div className="nh-demo-title">NexusHeader — Integration Guide</div>
        <div className="nh-demo-sub">
          A standalone component. Import once, use on every page. All features are live — try the nav links, notifications, and shift button above.
        </div>

        {/* Step 1 */}
        <div className="nh-demo-card">
          <h3>Step 1 — Copy the file</h3>
          <p style={{fontSize:12.5,color:"var(--ink50)",marginBottom:12,lineHeight:1.6}}>
            Save <strong>NexusHeader.jsx</strong> into your project's <code style={{fontFamily:"'Geist Mono',monospace",background:"var(--ink06)",padding:"1px 5px",borderRadius:3,fontSize:11}}>src/components/</code> folder.
            It has zero external dependencies beyond React.
          </p>
          <div className="nh-code-block">
            <span className="cmt">// src/components/NexusHeader.jsx  ← place here</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="nh-demo-card">
          <h3>Step 2 — Import & use on any page</h3>
          <div className="nh-code-block">
<span className="kw">import</span> {"{ NexusHeader }"} <span className="kw">from</span> <span className="str">'../components/NexusHeader'</span>;{"\n\n"}
<span className="cmt">// Inside your page component:</span>{"\n"}
<span className="kw">export default function</span> <span className="fn">GRNPage</span>() {"{"}{"\n"}
{"  "}<span className="kw">return</span> ({"\n"}
{"    "}<span className="tag">&lt;&gt;</span>{"\n"}
{"      "}<span className="tag">&lt;NexusHeader</span>{"\n"}
{"        "}<span className="kw">activePage</span>=<span className="str">"Documents"</span>{"\n"}
{"        "}<span className="kw">breadcrumbs</span>={"{["}
{"{ label: "}
<span className="str">"Documents"</span>
{" }, { label: "}
<span className="str">"GRN"</span>
{", current: true }]}"}{"\n"}
{"        "}<span className="kw">user</span>={`{{ name:"Kasun Fernando", role:"Cashier", initials:"KF" }}`}{"\n"}
{"        "}<span className="kw">onNavigate</span>={"{(path) => navigate(path)}"}{"\n"}
{"      "}<span className="tag">/&gt;</span>{"\n"}
{"      "}<span className="cmt">{"{ /* rest of your page */ }"}</span>{"\n"}
{"    "}<span className="tag">&lt;/&gt;</span>{"\n"}
{"  "});{"\n"}
{"}"}
          </div>
        </div>

        {/* Step 3 */}
        <div className="nh-demo-card">
          <h3>Step 3 — Remove the old topbar from each page</h3>
          <p style={{fontSize:12.5,color:"var(--ink50)",marginBottom:12,lineHeight:1.6}}>
            In your <strong>GRNPage.jsx</strong>, <strong>PurchaseOrderPage.jsx</strong>, and <strong>QuotationHistory.jsx</strong>,
            delete the existing <code style={{fontFamily:"'Geist Mono',monospace",background:"var(--ink06)",padding:"1px 5px",borderRadius:3,fontSize:11}}>&lt;header className="grn-tb"&gt;</code> block
            and replace it with <code style={{fontFamily:"'Geist Mono',monospace",background:"var(--ink06)",padding:"1px 5px",borderRadius:3,fontSize:11}}>&lt;NexusHeader .../&gt;</code>.
          </p>
          <div className="nh-code-block">
<span className="cmt">{"// BEFORE — delete this block from each page:"}</span>{"\n"}
<span className="tag">&lt;header</span> <span className="kw">className</span>=<span className="str">"grn-tb"</span><span className="tag">&gt;</span>{"\n"}
{"  "}... old topbar JSX ...{"\n"}
<span className="tag">&lt;/header&gt;</span>{"\n\n"}
<span className="cmt">{"// AFTER — one line replaces it:"}</span>{"\n"}
<span className="tag">&lt;NexusHeader</span> <span className="kw">activePage</span>=<span className="str">"Documents"</span> <span className="kw">breadcrumbs</span>={"{[...]}"} <span className="tag">/&gt;</span>
          </div>
        </div>

        {/* Props reference */}
        <div className="nh-demo-card">
          <h3>Props reference</h3>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:"2px solid var(--gold)"}}>
                {["Prop","Type","Default","Description"].map(h=>(
                  <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--ink40)",background:"#EDE8DE"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["activePage",  "string",   '"Dashboard"', "Highlights the matching nav link"],
                ["breadcrumbs", "array",    "[]",          '[{ label:"GRN", current:true }]'],
                ["user",        "object",   "KF / Cashier","{ name, role, initials }'],"],
                ["onNavigate",  "function", "() => {}",    "Called with (path, label) on nav click"],
              ].map(([p,t,d,desc],i)=>(
                <tr key={p} style={{borderBottom:"1px solid var(--ink06)",background:i%2===0?"transparent":"var(--ink03)"}}>
                  <td style={{padding:"8px 10px",fontFamily:"'Geist Mono',monospace",fontSize:11,color:"var(--gold)",fontWeight:600}}>{p}</td>
                  <td style={{padding:"8px 10px",fontFamily:"'Geist Mono',monospace",fontSize:11,color:"var(--blue)"}}>{t}</td>
                  <td style={{padding:"8px 10px",fontFamily:"'Geist Mono',monospace",fontSize:11,color:"var(--ink40)"}}>{d}</td>
                  <td style={{padding:"8px 10px",fontSize:11.5,color:"var(--ink50)"}}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Config */}
        <div className="nh-demo-card">
          <h3>Customise POS name, branch & nav links</h3>
          <p style={{fontSize:12.5,color:"var(--ink50)",marginBottom:12,lineHeight:1.6}}>
            Edit the constants at the top of <strong>NexusHeader.jsx</strong>:
          </p>
          <div className="nh-code-block">
<span className="kw">const</span> <span className="fn">POS_CONFIG</span> = {"{"}{"\n"}
{"  "}<span className="kw">posName</span>:    <span className="str">"Nexus POS"</span>,{"\n"}
{"  "}<span className="kw">branchName</span>: <span className="str">"Colombo Main Branch"</span>,{"\n"}
{"  "}<span className="kw">branchCode</span>: <span className="str">"BR-001"</span>,{"\n"}
{"  "}<span className="kw">version</span>:    <span className="str">"v2.4.1"</span>,{"\n"}
{"}"};{"\n\n"}
<span className="kw">const</span> <span className="fn">NAV_LINKS</span> = [{"\n"}
{"  "}{"{ label: "}<span className="str">"Dashboard"</span>{", icon: "}<span className="str">"⊞"</span>{", path: "}<span className="str">"/dashboard"</span>{" },"}{"\n"}
{"  "}{"{ label: "}<span className="str">"POS"</span>{",       icon: "}<span className="str">"⊡"</span>{", path: "}<span className="str">"/pos"</span>{" },"}{"\n"}
{"  "}{"{ label: "}<span className="str">"Documents"</span>{", icon: "}<span className="str">"≡"</span>{", path: "}<span className="str">"/documents"</span>{" },"}{"\n"}
{"]"};
          </div>
        </div>

      </div>
    </div>
  );
}