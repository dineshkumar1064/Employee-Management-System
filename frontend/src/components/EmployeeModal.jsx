import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

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

const STATUSES = ['Active', 'Inactive', 'On Leave'];

export default function EmployeeModal({ isOpen, onClose, onSubmit, employee = null }) {
  const isEditMode = !!employee;
  
  // Local Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [designation, setDesignation] = useState('');
  const [status, setStatus] = useState(STATUSES[0]);
  const [joiningDate, setJoiningDate] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with selected employee
  useEffect(() => {
    if (isOpen) {
      if (employee) {
        setName(employee.name);
        setEmail(employee.email);
        setDepartment(employee.department);
        setDesignation(employee.designation);
        setStatus(employee.status);
        
        // Format date string to YYYY-MM-DD for date input
        if (employee.joiningDate) {
          const date = new Date(employee.joiningDate);
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          setJoiningDate(`${yyyy}-${mm}-${dd}`);
        } else {
          setJoiningDate('');
        }
      } else {
        // Reset form for create mode
        setName('');
        setEmail('');
        setDepartment(DEPARTMENTS[0]);
        setDesignation('');
        setStatus(STATUSES[0]);
        
        // Default joiningDate to today
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setJoiningDate(`${yyyy}-${mm}-${dd}`);
      }
      setErrors({});
      setSubmitError('');
    }
  }, [isOpen, employee]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Employee name is required';
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!designation.trim()) newErrors.designation = 'Designation is required';
    
    if (!joiningDate) newErrors.joiningDate = 'Joining date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const formData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        department,
        designation: designation.trim(),
        status,
        joiningDate: new Date(joiningDate).toISOString()
      };

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'An error occurred while saving employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Employee Details' : 'Register New Employee'}</h2>
          <button onClick={onClose} className="modal-close" title="Close Dialog">
            <X size={20} />
          </button>
        </div>

        {submitError && (
          <div className="form-error" style={{
            background: 'var(--status-inactive-bg)',
            color: 'var(--status-inactive-text)',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            
            {/* Full Name field */}
            <div className="form-group form-group-full">
              <label className="form-label" htmlFor="name-input">Full Name</label>
              <input
                id="name-input"
                type="text"
                className="form-input"
                style={{ paddingLeft: '16px' }}
                placeholder="e.g. Johnathan Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
              />
              {errors.name && <span className="form-error"><AlertCircle size={12} /> {errors.name}</span>}
            </div>

            {/* Email field */}
            <div className="form-group form-group-full">
              <label className="form-label" htmlFor="email-field">Email Address</label>
              <input
                id="email-field"
                type="email"
                className="form-input"
                style={{ paddingLeft: '16px' }}
                placeholder="john.doe@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
              />
              {errors.email && <span className="form-error"><AlertCircle size={12} /> {errors.email}</span>}
            </div>

            {/* Department select */}
            <div className="form-group">
              <label className="form-label" htmlFor="department-select">Department</label>
              <select
                id="department-select"
                className="select-filter"
                style={{ width: '100%', height: '46px' }}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Designation field */}
            <div className="form-group">
              <label className="form-label" htmlFor="designation-input">Designation</label>
              <input
                id="designation-input"
                type="text"
                className="form-input"
                style={{ paddingLeft: '16px' }}
                placeholder="e.g. Tech Lead"
                value={designation}
                onChange={(e) => {
                  setDesignation(e.target.value);
                  if (errors.designation) setErrors(prev => ({ ...prev, designation: '' }));
                }}
              />
              {errors.designation && <span className="form-error"><AlertCircle size={12} /> {errors.designation}</span>}
            </div>

            {/* Status select */}
            <div className="form-group">
              <label className="form-label" htmlFor="status-select">Status</label>
              <select
                id="status-select"
                className="select-filter"
                style={{ width: '100%', height: '46px' }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map(stat => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
            </div>

            {/* Joining Date date input */}
            <div className="form-group">
              <label className="form-label" htmlFor="joining-date-input">Joining Date</label>
              <input
                id="joining-date-input"
                type="date"
                className="form-input"
                style={{ paddingLeft: '16px', height: '46px' }}
                value={joiningDate}
                onChange={(e) => {
                  setJoiningDate(e.target.value);
                  if (errors.joiningDate) setErrors(prev => ({ ...prev, joiningDate: '' }));
                }}
              />
              {errors.joiningDate && <span className="form-error"><AlertCircle size={12} /> {errors.joiningDate}</span>}
            </div>

          </div>

          {/* Form CTA buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '32px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px'
          }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" style={{
                    animation: 'spin 1s infinite linear',
                    marginRight: '6px'
                  }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                    <path d="M12 2C6.47715 2 2 6.47715 2 12" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Saving...
                </>
              ) : (
                isEditMode ? 'Update Details' : 'Register Employee'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
