import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// Same order as the dashboard home screen's nav grid.
const NAV_ITEMS = [
  { to: '/inventory-checkouts', icon: '👜', label: 'Inventory Checkouts' },
  { to: '/inventory-items', icon: '📦', label: 'Inventory Items' },
  { to: '/purchase-requests', icon: '💸', label: 'Purchase Requests' },
  { to: '/suppliers', icon: '🏤', label: 'Suppliers' },
  { to: '/users', icon: '👤', label: 'Users' },
];

const Sidebar = () => {
  // Persist the collapsed preference so it survives navigation and refresh.
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebarCollapsed') === 'true'
  );

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={toggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? '»' : '«'}
      </button>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link sidebar-home ${isActive ? 'sidebar-link-active' : ''}`
          }
          title="Home"
        >
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-label">Home</span>
        </NavLink>

        <div className="sidebar-divider" />

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
