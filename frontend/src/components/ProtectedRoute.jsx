import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="state-container" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <div className="state-icon" style={{ animation: 'spin 1.5s infinite linear' }}>
          {/* SVG spinner */}
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="var(--border-color)" strokeWidth="4" />
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5 2.5 15 3.5 16" stroke="var(--accent-primary)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="state-title">Verifying Session...</h3>
        <p className="state-desc">Connecting to secure server environment.</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
