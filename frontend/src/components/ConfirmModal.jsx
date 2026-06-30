import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, employeeName }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-modal-content glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#fee2e2',
            color: '#ef4444'
          }}>
            <AlertTriangle size={22} />
          </div>
          <button onClick={onClose} className="modal-close" title="Close modal">
            <X size={18} />
          </button>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{title || 'Are you sure?'}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.4' }}>
          {message || 'This action cannot be undone.'}{' '}
          {employeeName && (
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              ({employeeName})
            </span>
          )}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isDeleting}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isDeleting}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
