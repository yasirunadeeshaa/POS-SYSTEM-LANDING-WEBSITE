// DashboardLayout.jsx — master layout shell for ALL pages
//
// Wraps any page content with: TopBar + LeftSidebar + RightSidebar + BottomBar
//
// Props:
//   children        : ReactNode — the main page content
//   leftNavItems    : array — top nav items for left sidebar
//   leftBottomItems : array — bottom nav items for left sidebar (e.g. Profile, Audit)
//   rightNavItems   : array — nav items for right sidebar
//   bottomLeftItems : array — BottomBar left stats  [{ label, value, color?, dot?, dotColor?, dotBlink? }]
//   bottomRightItems: array — BottomBar right stats (clock always appended)
//   topBarProps     : object — passed directly to <TopBar> (appName, kpis, notifications, showLive, etc.)
//   onNavigate      : (item) => void — shared nav handler
//   toast           : { message, visible } — optional toast state
//   appName         : string (default "Nexus POS")

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopBar       from "./TopBar";
import LeftSidebar  from "./Leftsidebar";
import RightSidebar from "./Rightsidebar";
import BottomBar    from "./BottomBar";
import { DASHBOARD_CSS } from "./Dashboardstyles";

export default function DashboardLayout({
  children,
  leftNavItems    = [],
  leftBottomItems = [],
  rightNavItems   = [],
  bottomLeftItems = [],
  bottomRightItems = [],
  topBarProps     = {},
  onNavigate,
  toast,
}) {
  const navigate = useNavigate();

  const handleNavigate = useCallback((item) => {
    if (onNavigate) {
      onNavigate(item);
    } else if (item.routeTo) {
      navigate(item.routeTo);
    }
  }, [onNavigate, navigate]);

  return (
    <>
      <style>{DASHBOARD_CSS}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          fontFamily: "'DM Sans',sans-serif",
          background: "#EDEAD5",
          overflow: "hidden",
        }}
      >
        {/* ══ TOP BAR ══════════════════════════════════════════════════════ */}
        <TopBar
          appName="Nexus POS"
          showLive
          showFullscreen
          showLogout
          {...topBarProps}
        />

        {/* ══ MIDDLE ROW ═══════════════════════════════════════════════════ */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "row" }}>

          {/* Left Sidebar */}
          <LeftSidebar
            navItems={leftNavItems}
            bottomItems={leftBottomItems}
            onNavigate={handleNavigate}
          />

          {/* Page Content */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {children}
          </div>

          {/* Right Sidebar */}
          <RightSidebar
            navItems={rightNavItems}
            onNavigate={handleNavigate}
          />
        </div>

        {/* ══ BOTTOM STATUS BAR ════════════════════════════════════════════ */}
        <BottomBar
          leftItems={bottomLeftItems}
          rightItems={bottomRightItems}
        />
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 44,
            left: "50%",
            transform: toast.visible
              ? "translateX(-50%) translateY(0)"
              : "translateX(-50%) translateY(10px)",
            background: "#1A1611",
            border: "1px solid rgba(181,138,36,0.3)",
            borderRadius: 9,
            padding: "8px 18px",
            display: "flex",
            alignItems: "center",
            gap: 9,
            boxShadow: "0 8px 28px rgba(26,22,17,0.2)",
            zIndex: 1000,
            opacity: toast.visible ? 1 : 0,
            pointerEvents: toast.visible ? "auto" : "none",
            transition: "opacity 0.22s, transform 0.22s",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#B58A24", fontSize: 10 }}>✦</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "#F4F1E9" }}>
            {toast.message}
          </span>
        </div>
      )}
    </>
  );
}