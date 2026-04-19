import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Live Date/Time Chip ───────────────────────────────────────────────────────

function LiveDateChip() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const year = now.getFullYear();
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const day = String(now.getDate()).padStart(2, "0");
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: "rgba(244,241,233,0.04)",
        border: "1px solid rgba(244,241,233,0.07)",
        borderRadius: 6,
        padding: "4px 10px",
      }}
    >
      <span style={S.chipLabel}>Date</span>
      <span style={S.chipMono}>{year}</span>
      <span style={S.chipSep}>–</span>
      <span style={S.chipMono}>{month}</span>
      <span style={S.chipSep}>–</span>
      <span style={S.chipMono}>{day}</span>
      <span style={S.chipWeekday}>{weekday}</span>
      <span style={S.dividerV} />
      <span style={S.chipLabel}>Time</span>
      <span style={S.chipTime}>{time}</span>
    </div>
  );
}

// ─── Notifications Panel ───────────────────────────────────────────────────────

function NotifDropdown({ items, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 149 }}
      />
      <div
        style={{
          position: "absolute",
          top: 62,
          right: 90,
          width: 300,
          background: "#FDFBF5",
          border: "1px solid #E4DDD3",
          borderRadius: 11,
          boxShadow: "0 8px 32px rgba(26,22,17,0.14)",
          zIndex: 200,
          overflow: "hidden",
          animation: "topbar-dropIn 0.18s ease",
        }}
      >
        <div
          style={{
            padding: "9px 14px 8px",
            background: "#1A1611",
            borderBottom: "1px solid rgba(181,138,36,0.25)",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: "#B58A24",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Notifications
        </div>
        {items.map((n, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 14px",
              borderBottom: i < items.length - 1 ? "1px solid #EDE8DF" : "none",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F0E8")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: n.color,
                flexShrink: 0,
                marginTop: 5,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#1A1611",
                  lineHeight: 1.4,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {n.title}
              </div>
              <div
                style={{
                  fontSize: 9.5,
                  color: "#9B8E80",
                  marginTop: 2,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {n.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Inline Styles ─────────────────────────────────────────────────────────────

const S = {
  chipLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "rgba(181,138,36,0.55)",
    fontFamily: "'DM Sans',sans-serif",
  },
  chipMono: {
    fontSize: 10.5,
    fontWeight: 500,
    color: "rgba(244,241,233,0.55)",
    fontFamily: "'Geist Mono',monospace",
    letterSpacing: 0.5,
  },
  chipWeekday: {
    fontSize: 10.5,
    fontWeight: 600,
    color: "rgba(181,138,36,0.75)",
    fontFamily: "'DM Sans',sans-serif",
  },
  chipSep: { fontSize: 9, color: "rgba(244,241,233,0.18)" },
  chipTime: {
    fontFamily: "'Geist Mono',monospace",
    fontSize: 10.5,
    fontWeight: 600,
    color: "rgba(209,165,52,0.8)",
    letterSpacing: 1,
  },
  dividerV: {
    width: 1,
    height: 14,
    background: "rgba(244,241,233,0.1)",
    display: "inline-block",
    margin: "0 3px",
  },
  tbBtn: {
    height: 32,
    borderRadius: 7,
    background: "rgba(244,241,233,0.05)",
    border: "1px solid rgba(244,241,233,0.09)",
    color: "rgba(244,241,233,0.42)",
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, color 0.15s",
    fontFamily: "'DM Sans',sans-serif",
    padding: "0 10px",
    gap: 5,
  },
};

// ─── CSS (injected once) ───────────────────────────────────────────────────────

const TOPBAR_CSS = `
  @keyframes topbar-dropIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
  @keyframes topbar-blink   { 0%,100%{opacity:1} 50%{opacity:.15} }
  .topbar-tb-btn:hover { background: rgba(244,241,233,0.12) !important; color: rgba(244,241,233,0.8) !important; }
  .topbar-tb-btn-active { background: rgba(181,138,36,0.14) !important; border-color: rgba(181,138,36,0.35) !important; color: rgba(181,138,36,0.85) !important; }
  .topbar-logout:hover  { background: rgba(181,55,42,0.12) !important; border-color: rgba(181,55,42,0.3) !important; color: #e07070 !important; }
  .topbar-role-badge    { font-size: 7.5px; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(181,138,36,0.6); margin-top: -1px; font-family: 'DM Sans', sans-serif; }
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected) return;
  const el = document.createElement("style");
  el.textContent = TOPBAR_CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

export default function TopBar({
  appName = "Nexus POS",
  notifications = [],
  kpis = [],
  showLive = true,
  showFullscreen = true,
  showLogout = true,
  extraLeft = null,
  extraRight = null,
  onLogout,
}) {
  injectCSS();

  const user = { first_name: "Admin", last_name: "User" };
  const logout = async () => {};
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isFs, setIsFs] = useState(false);

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
    : "?";

  // Fullscreen
  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const toggleFs = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Close notif on Escape
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    setLoggingOut(true);
    await logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: 54,
        flexShrink: 0,
        background: "#1A1611",
        borderBottom: "1px solid rgba(181,138,36,0.35)",
        boxShadow:
          "0 1px 0 rgba(181,138,36,0.1), 0 2px 18px rgba(26,22,17,0.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "relative",
        zIndex: 50,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── LEFT ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Logo mark + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(181,138,36,0.1)",
              border: "1.5px solid rgba(181,138,36,0.42)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#D1A534",
            }}
          >
            N
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 17,
                fontWeight: 600,
                color: "#F4F1E9",
                letterSpacing: 0.2,
                lineHeight: 1,
              }}
            >
              {appName}
            </div>
          </div>
        </div>

        <Sep />

        {/* LIVE dot — now on the left where date used to be */}
        {showLive && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 10px",
              background: "rgba(42,101,73,0.14)",
              border: "1px solid rgba(42,101,73,0.3)",
              borderRadius: 20,
              fontSize: 9.5,
              fontWeight: 700,
              color: "#3C8A62",
              letterSpacing: 0.8,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#3C8A62",
                display: "inline-block",
                animation: "topbar-blink 1.5s ease-in-out infinite",
              }}
            />
            LIVE
          </div>
        )}

        {extraLeft && <>{extraLeft}</>}
      </div>

      {/* ── CENTER — Date/Time ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <LiveDateChip />
      </div>

      {/* ── RIGHT ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {extraRight && <>{extraRight}</>}

        {/* Notification bell */}
        {notifications.length > 0 && (
          <button
            className="topbar-tb-btn"
            style={{ ...S.tbBtn, width: 32, position: "relative" }}
            onClick={() => setNotifOpen((v) => !v)}
            title="Notifications"
          >
            🔔
            <span
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                width: 13,
                height: 13,
                background: "#B03428",
                borderRadius: "50%",
                border: "2px solid #1A1611",
                fontSize: 6.5,
                color: "#fff",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {notifications.length}
            </span>
          </button>
        )}

        {/* Settings */}
        <button
          className="topbar-tb-btn"
          style={{ ...S.tbBtn, width: 32 }}
          onClick={() => navigate("/settings")}
          title="Settings"
        >
          ⚙
        </button>

        {/* Avatar */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 7,
            border: "1.5px solid rgba(181,138,36,0.3)",
            background: "rgba(181,138,36,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display',serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#D1A534",
            cursor: "pointer",
          }}
          onClick={() => navigate("/profile")}
          title="My profile"
        >
          {initials}
        </div>

        {/* Fullscreen */}
        {showFullscreen && (
          <button
            className={`topbar-tb-btn${isFs ? " topbar-tb-btn-active" : ""}`}
            style={{ ...S.tbBtn, width: 32 }}
            onClick={toggleFs}
            title={isFs ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFs ? "⊡" : "⊞"}
          </button>
        )}

        <Sep />

        {/* Sign out */}
        {showLogout && (
          <button
            className="topbar-logout"
            disabled={loggingOut}
            onClick={handleLogout}
            style={{
              ...S.tbBtn,
              color: "rgba(244,241,233,0.38)",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {loggingOut ? "Signing out…" : "⊟ Sign Out"}
          </button>
        )}
      </div>

      {/* Notification dropdown */}
      {notifOpen && (
        <NotifDropdown
          items={notifications}
          onClose={() => setNotifOpen(false)}
        />
      )}
    </header>
  );
}

// tiny vertical separator
function Sep() {
  return (
    <span
      style={{
        width: 1,
        height: 20,
        background: "rgba(244,241,233,0.08)",
        flexShrink: 0,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  TopBar — usage examples for every dashboard role
//  Import from wherever you put TopBar.jsx, e.g.:
//  import TopBar from "../../components/shared/TopBar";
// ─────────────────────────────────────────────────────────────────────────────

//import TopBar from "../../components/shared/TopBar";

// ── 1. CASHIER DASHBOARD ─────────────────────────────────────────────────────
//  Shows: live date/time · LIVE dot · revenue KPI · bell · fullscreen · sign out

// function CashierDashboard() {
//   const [revenue, setRevenue] = useState(2184.60);
//   const [txnCount, setTxnCount] = useState(46);

//   return (
//     <>
//       <TopBar
//         appName="Nexus POS"
//         roleLabel="Cashier"
//         showLive
//         showFullscreen
//         showLogout
//         notifications={NOTIFICATIONS}
//         kpis={[
//           { label: "My Sales",     value: `$${fmt(revenue)}`, color: "#4ade80" },
//           { label: "Transactions", value: txnCount },
//         ]}
//       />
//       {/* ...rest of cashier layout */}
//     </>
//   );
// }
