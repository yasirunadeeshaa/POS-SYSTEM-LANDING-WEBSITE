// RightSidebar.jsx — shared right sidebar for all roles/pages
// Props:
//   navItems   : array of { icon, label, routeTo, badge? }
//   onNavigate : (item) => void
//   activeRoute: string — current path (optional)

import { useLocation } from "react-router-dom";

export default function RightSidebar({ navItems = [], onNavigate, activeRoute }) {
  const location = useLocation();
  const currentPath = activeRoute || location.pathname;

  return (
    <div className="right-sidebar">
      {navItems.map((item) => {
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
      <div className="nav-spacer" />
    </div>
  );
}