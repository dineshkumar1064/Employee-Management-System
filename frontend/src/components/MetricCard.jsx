import React from 'react';

/**
 * MetricCard
 * A single KPI card displayed in the Overview metrics grid.
 *
 * Props:
 *   label     {string}      - Card label text
 *   value     {number}      - Numeric value to display
 *   icon      {JSX.Element} - Icon element (from lucide-react)
 *   iconBg    {string}      - CSS color for the icon box background
 *   iconColor {string}      - CSS color for the icon itself
 */
export default function MetricCard({ label, value, icon, iconBg, iconColor }) {
  return (
    <div className="metric-card glass-panel glass-panel-hover">
      <div className="metric-info">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}</span>
      </div>
      <div
        className="metric-icon-box"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
    </div>
  );
}
