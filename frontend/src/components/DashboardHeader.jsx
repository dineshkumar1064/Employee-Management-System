import React from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';

/**
 * DashboardHeader
 * Top header bar showing the current page title, a welcome message,
 * the theme toggle button, and a mobile-only sign-out button.
 *
 * Props:
 *   activeTab   {string}   - Current tab for dynamic title rendering
 *   user        {object}   - Authenticated user ({ name })
 *   theme       {string}   - 'light' | 'dark'
 *   toggleTheme {Function} - Callback to flip the theme
 *   logout      {Function} - Logout callback
 */
export default function DashboardHeader({ activeTab, user, theme, toggleTheme, logout }) {
  const pageTitle =
    activeTab === 'overview'
      ? 'Operational Summary'
      : activeTab === 'employees'
      ? 'Employee Directory'
      : 'Analytics Center';

  return (
    <header className="main-header">
      <div className="header-title-section">
        <h1 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
          {pageTitle}
        </h1>
        <p className="header-subtitle">Welcome back, {user?.name || 'Admin'}</p>
      </div>

      <div className="header-actions">
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title="Toggle color scheme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Mobile-only Logout (sidebar footer is hidden on mobile layout) */}
        <button
          onClick={logout}
          className="theme-toggle mobile-only"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
