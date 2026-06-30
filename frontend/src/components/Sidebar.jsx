import React from 'react';
import { Users, Grid, LogOut, BarChart3 as BarIcon } from 'lucide-react';

/**
 * Sidebar
 * Left-hand navigation panel containing the logo, nav links,
 * user info, and sign-out button.
 *
 * Props:
 *   activeTab    {string}   - Currently active tab ('overview' | 'employees' | 'analytics')
 *   setActiveTab {Function} - Setter to switch tabs
 *   user         {object}   - Authenticated user ({ name, role })
 *   logout       {Function} - Logout callback
 */
export default function Sidebar({ activeTab, setActiveTab, user, logout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Users size={20} strokeWidth={2.5} />
        </div>
        <span className="sidebar-title">EMS</span>
      </div>

      <ul className="sidebar-menu">
        <li className="sidebar-menu-item">
          <button
            onClick={() => setActiveTab('overview')}
            className={`sidebar-link btn-block ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <Grid size={18} /> Overview
          </button>
        </li>
        <li className="sidebar-menu-item">
          <button
            onClick={() => setActiveTab('employees')}
            className={`sidebar-link btn-block ${activeTab === 'employees' ? 'active' : ''}`}
          >
            <Users size={18} /> Directory
          </button>
        </li>
        <li className="sidebar-menu-item">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`sidebar-link btn-block ${activeTab === 'analytics' ? 'active' : ''}`}
          >
            <BarIcon size={18} /> Visual Insights
          </button>
        </li>
      </ul>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name || 'Authorized User'}</p>
            <p className="sidebar-user-role">{user?.role || 'Administrator'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="btn btn-outline btn-block btn-primary"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171'
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
