import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  Legend
} from 'recharts';
import MetricCard from './MetricCard';

/**
 * OverviewTab
 * Renders the "Overview" tab content:
 *   - 4-card KPI metrics grid
 *   - Recently joined employees mini-table
 *   - Status distribution mini pie chart
 *
 * Props:
 *   analyticsData      {object}   - { total, active, statuses, departments, monthlyHires }
 *   employees          {Array}    - Current page employee list (first 4 used)
 *   listLoading        {boolean}  - Whether the employee list is loading
 *   getStatusBadgeClass {Function} - Returns CSS class string for a status value
 *   setActiveTab       {Function} - Switches to another tab (used for "View All" button)
 *   COLORS             {object}   - Map of status name → hex color for pie slices
 */
export default function OverviewTab({
  analyticsData,
  employees,
  listLoading,
  getStatusBadgeClass,
  setActiveTab,
  COLORS
}) {
  return (
    <div>
      {/* KPI Metrics Grid */}
      <div className="metrics-grid">
        <MetricCard
          label="Headcount"
          value={analyticsData.total}
          icon={<Users size={24} />}
          iconBg="var(--accent-light)"
          iconColor="var(--accent-primary)"
        />
        <MetricCard
          label="Active Roles"
          value={analyticsData.active}
          icon={<UserCheck size={24} />}
          iconBg="#dcfce7"
          iconColor="#16a34a"
        />
        <MetricCard
          label="On Leave"
          value={analyticsData.statuses.find(s => s.name === 'On Leave')?.value || 0}
          icon={<Clock size={24} />}
          iconBg="#fef9c3"
          iconColor="#ca8a04"
        />
        <MetricCard
          label="Inactive Records"
          value={analyticsData.statuses.find(s => s.name === 'Inactive')?.value || 0}
          icon={<UserX size={24} />}
          iconBg="#fee2e2"
          iconColor="#dc2626"
        />
      </div>

      {/* Overview Analytics Teaser Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '24px',
          marginTop: '32px'
        }}
        className="analytics-grid"
      >
        {/* Mini employee table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <h3 style={{ fontSize: '1.1rem' }}>Recently Joined Team</h3>
            <button
              onClick={() => setActiveTab('employees')}
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              View All Directory
            </button>
          </div>

          {listLoading ? (
            <div>
              <div className="shimmer-row" />
              <div className="shimmer-row" />
              <div className="shimmer-row" />
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 4).map(emp => (
                    <tr key={emp.id}>
                      <td style={{ fontWeight: 500 }}>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>
                        <span className={getStatusBadgeClass(emp.status)}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          textAlign: 'center',
                          padding: '24px',
                          color: 'var(--text-muted)'
                        }}
                      >
                        No employees registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status distribution mini pie chart */}
        <div
          className="glass-panel"
          style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}
        >
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Status Breakdown</h3>
          {analyticsData.total > 0 ? (
            <div
              style={{
                flexGrow: 1,
                minHeight: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={analyticsData.statuses}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analyticsData.statuses.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={COLORS[entry.name] || '#4f46e5'}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    formatter={(value) => [`${value} Employees`, 'Count']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={24}
                    iconSize={10}
                    style={{ fontSize: '0.8rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
              No data to chart.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
