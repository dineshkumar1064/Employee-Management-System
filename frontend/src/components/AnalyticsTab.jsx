import React from 'react';
import { Building2, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

/**
 * AnalyticsTab
 * Renders the "Visual Insights" tab content:
 *   - Bar chart: headcount per department
 *   - Donut pie chart: employee status distribution
 *   - Area chart: monthly hires trend
 *
 * Props:
 *   analyticsData    {object}  - { departments, statuses, monthlyHires }
 *   analyticsLoading {boolean} - Whether analytics are still loading
 *   COLORS           {object}  - Map of status name → hex color for pie slices
 */
export default function AnalyticsTab({ analyticsData, analyticsLoading, COLORS }) {
  return (
    <div className="analytics-grid">

      {/* Chart 1: Headcount by department (Bar) */}
      <div className="glass-panel chart-card">
        <h3 className="chart-title">
          <Building2 size={18} style={{ color: 'var(--accent-primary)' }} />
          Department Breakdown
        </h3>
        {analyticsLoading ? (
          <div className="state-container">
            <div className="shimmer-row" style={{ width: '100%', height: '240px' }} />
          </div>
        ) : analyticsData.departments.length > 0 ? (
          <div className="chart-container-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.departments} margin={{ left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  style={{ fontSize: '0.75rem' }}
                  allowDecimals={false}
                />
                <ChartTooltip
                  formatter={(value) => [`${value} Hires`, 'Size']}
                  cursor={{ fill: 'var(--border-color)', opacity: 0.15 }}
                />
                <Bar
                  dataKey="value"
                  fill="var(--accent-primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ margin: 'auto', color: 'var(--text-muted)' }}>
            No department records detected.
          </div>
        )}
      </div>

      {/* Chart 2: Status distribution (Donut Pie) */}
      <div className="glass-panel chart-card">
        <h3 className="chart-title">
          <PieIcon size={18} style={{ color: 'var(--accent-secondary)' }} />
          Status Distribution Ratio
        </h3>
        {analyticsLoading ? (
          <div className="state-container">
            <div className="shimmer-row" style={{ width: '100%', height: '240px' }} />
          </div>
        ) : analyticsData.statuses.length > 0 ? (
          <div className="chart-container-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.statuses}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
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
                  formatter={(value) => [`${value} Employees`, 'Total']}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ margin: 'auto', color: 'var(--text-muted)' }}>
            No status records detected.
          </div>
        )}
      </div>

      {/* Chart 3: Monthly hired employees trend (Area) */}
      <div className="glass-panel chart-card" style={{ gridColumn: 'span 2' }}>
        <h3 className="chart-title">
          <TrendingUp size={18} style={{ color: '#10b981' }} />
          Hires Trends Timeline (Joined Employees)
        </h3>
        {analyticsLoading ? (
          <div className="state-container">
            <div className="shimmer-row" style={{ width: '100%', height: '240px' }} />
          </div>
        ) : analyticsData.monthlyHires.length > 0 ? (
          <div className="chart-container-box" style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData.monthlyHires}
                margin={{ left: -20, right: 10 }}
              >
                <defs>
                  <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  style={{ fontSize: '0.75rem' }}
                  allowDecimals={false}
                />
                <ChartTooltip
                  formatter={(value) => [`${value} Hires`, 'Joined']}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--accent-primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHires)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ margin: 'auto', color: 'var(--text-muted)' }}>
            No records detected.
          </div>
        )}
      </div>

    </div>
  );
}
