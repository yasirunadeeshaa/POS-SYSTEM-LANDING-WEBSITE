// LeftSidebar.jsx — shared left sidebar for all roles/pages
// Props:
//   navItems      : array of { icon, label, routeTo, badge?, active? }
//   bottomItems   : array of { icon, label, routeTo }  (shown at bottom, e.g. Profile, Audit)
//   onNavigate    : (item) => void
//   activeRoute   : string — current path, used to highlight active item (optional, overrides item.active)

import { useLocation } from "react-router-dom";

export default function LeftSidebar({ navItems = [], bottomItems = [], onNavigate, activeRoute }) {
  const location = useLocation();
  const currentPath = activeRoute || location.pathname;

  return (
    <div className="left-sidebar">
      {navItems.map((item) => {
        const isActive = item.active || currentPath === item.routeTo;
        return (
          <button
            key={item.label}
            className={`nav-item${isActive ? " nav-active" : ""}`}
            onClick={() => onNavigate(item)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </button>
        );
      })}

      <div className="nav-spacer" />

      {bottomItems.length > 0 && (
        <>
          <div className="nav-divider" />
          {bottomItems.map((item) => {
            const isActive = currentPath === item.routeTo;
            return (
              <button
                key={item.label}
                className={`nav-item${isActive ? " nav-active" : ""}`}
                onClick={() => onNavigate(item)}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}