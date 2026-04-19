// navConfig.js — nav items per role
//
// Static arrays:  LEFT_NAV_ADMIN, RIGHT_NAV_ADMIN, etc.
//   → use when you have no live data yet (badges omitted or hardcoded)
//
// Factory functions: getLeftNavAdmin({ lowStock, poCount, alertCount, lockedCount })
//   → call inside the dashboard with real API data so badges reflect live counts
//   → any count that is 0 or falsy will hide the badge automatically

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────────────────────

export const getLeftNavAdmin = ({ lowStock = 0, poCount = 0 } = {}) => [
  { icon: "⊞",  label: "Home",     routeTo: "/dashboard"        },
  { icon: "👥", label: "Users",    routeTo: "/users"            },
  { icon: "🏪", label: "Branches", routeTo: "/branches"         },
  { icon: "↗",  label: "Sale",     routeTo: "/sale"             },
  { icon: "🧾", label: "Invoice",  routeTo: "/invoice"          },
  { icon: "📦", label: "Products", routeTo: "/productsListView" },
  { icon: "⚠",  label: "Stock",   routeTo: "/low-stock",      ...(lowStock ? { badge: String(lowStock) } : {}) },
  { icon: "📑", label: "PO",       routeTo: "/purchase-order", ...(poCount  ? { badge: String(poCount)  } : {}) },
  { icon: "📊", label: "Reports",  routeTo: "/reports"          },
];

export const LEFT_NAV_BOTTOM_ADMIN = [
  { icon: "🔖", label: "Audit",   routeTo: "/audit"   },
  { icon: "👤", label: "Profile", routeTo: "/profile" },
];

export const getRightNavAdmin = ({ alertCount = 0 } = {}) => [
  { icon: "👤", label: "Customer", routeTo: "/customerManagement"                                          },
  { icon: "🏭", label: "Supplier", routeTo: "/supplierManagement"                                          },
  { icon: "🔔", label: "Alerts",   routeTo: "/alerts", ...(alertCount ? { badge: String(alertCount) } : {}) },
  { icon: "🎁", label: "Vouchers", routeTo: "/gift-voucher"                                                },
  { icon: "💰", label: "Cash",     routeTo: "/transactions"                                                },
  { icon: "⚙",  label: "Settings", routeTo: "/settings"                                                   },
];