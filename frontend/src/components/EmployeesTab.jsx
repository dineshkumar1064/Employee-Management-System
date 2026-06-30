import React from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  AlertCircle,
  Users
} from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'HR',
  'Operations',
  'Management'
];

/**
 * EmployeesTab
 * Renders the "Directory" tab content:
 *   - Header with total count and "Register Employee" button
 *   - Search / department / status filter controls
 *   - Full employee table with edit & delete action buttons
 *   - Pagination footer
 *
 * Props:
 *   employees          {Array}    - Current page employee records
 *   totalEmployees     {number}   - Total matched count (across all pages)
 *   totalPages         {number}   - Total number of pages
 *   currentPage        {number}   - Active page number (1-indexed)
 *   listLoading        {boolean}  - Table loading state
 *   listError          {string}   - Error message to display
 *   search             {string}   - Current search input value
 *   setSearch          {Function} - Search input setter
 *   selectedDept       {string}   - Active department filter value
 *   setSelectedDept    {Function} - Department filter setter
 *   selectedStatus     {string}   - Active status filter value
 *   setSelectedStatus  {Function} - Status filter setter
 *   setCurrentPage     {Function} - Page setter
 *   getStatusBadgeClass {Function} - Returns CSS class for a status string
 *   formatDisplayDate  {Function} - Formats an ISO date string for display
 *   onAddEmployee      {Function} - Opens the "add" modal
 *   onEditEmployee     {Function} - Opens the "edit" modal with an employee object
 *   onDeleteEmployee   {Function} - Opens the confirm-delete modal with an employee object
 */
export default function EmployeesTab({
  employees,
  totalEmployees,
  totalPages,
  currentPage,
  listLoading,
  listError,
  search,
  setSearch,
  selectedDept,
  setSelectedDept,
  selectedStatus,
  setSelectedStatus,
  setCurrentPage,
  getStatusBadgeClass,
  formatDisplayDate,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee
}) {
  return (
    <div className="glass-panel" style={{ padding: '32px' }}>

      {/* Header and Add button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>Employee Registry</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Displaying {employees.length} of {totalEmployees} registered employees.
          </p>
        </div>
        <button
          onClick={onAddEmployee}
          className="btn btn-primary"
          id="add-employee-btn"
        >
          <Plus size={18} /> Register Employee
        </button>
      </div>

      {/* Filtering Controls */}
      <div className="table-controls">
        <div className="search-filter-group">

          {/* Search text box */}
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="input-icon" size={16} />
          </div>

          {/* Department Filter dropdown */}
          <select
            className="select-filter"
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Status Filter dropdown */}
          <select
            className="select-filter"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>

        </div>
      </div>

      {/* Error banner */}
      {listError && (
        <div
          className="form-error"
          style={{
            padding: '12px 16px',
            background: 'var(--status-inactive-bg)',
            color: 'var(--status-inactive-text)',
            borderRadius: '8px',
            marginBottom: '16px'
          }}
        >
          <AlertCircle size={16} />
          <span>{listError}</span>
        </div>
      )}

      {/* Main Directory Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Joining Date</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="shimmer-row">
                  <td colSpan="7">&nbsp;</td>
                </tr>
              ))
            ) : (
              employees.map(emp => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 600 }}>{emp.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <Building2 size={14} className="text-muted" style={{ opacity: 0.7 }} />
                      {emp.department}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>{emp.designation}</td>
                  <td>
                    <span className={getStatusBadgeClass(emp.status)}>{emp.status}</span>
                  </td>
                  <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {formatDisplayDate(emp.joiningDate)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-group" style={{ justifyContent: 'center' }}>
                      <button
                        onClick={() => onEditEmployee(emp)}
                        className="icon-btn icon-btn-edit"
                        title="Edit employee record"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteEmployee(emp)}
                        className="icon-btn icon-btn-delete"
                        title="Delete employee record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}

            {!listLoading && employees.length === 0 && (
              <tr>
                <td colSpan="7">
                  <div className="state-container">
                    <div className="state-icon">
                      <Users size={48} />
                    </div>
                    <h3 className="state-title">No employees found</h3>
                    <p className="state-desc">
                      Try loosening your search terms or filters above.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        {!listLoading && employees.length > 0 && (
          <div className="pagination-container">
            <span className="pagination-info">
              Page{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong>{' '}
              of{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
            </span>

            <div className="pagination-buttons">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`pagination-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
