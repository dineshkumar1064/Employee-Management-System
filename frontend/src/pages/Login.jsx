import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Sun, Moon } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local storage theme sync
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Field validation
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Absolute theme toggle on top right */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        style={{ position: 'absolute', top: 24, right: 24 }}
        title="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo">
            <LogIn size={26} strokeWidth={2.5} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to manage your employee registry</p>
        </div>

        {apiError && (
          <div className="form-error" style={{
            background: 'var(--status-inactive-bg)',
            color: 'var(--status-inactive-text)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.87rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                }}
              />
              <Mail className="input-icon" size={18} />
            </div>
            {formErrors.email && (
              <span className="form-error">
                <AlertCircle size={12} /> {formErrors.email}
              </span>
            )}
          </div>

          {/* Password field */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" htmlFor="password-input">Password</label>
            <div className="input-wrapper">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors(prev => ({ ...prev, password: '' }));
                }}
              />
              <Lock className="input-icon" size={18} />

              {/* Show/Hide password switch */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.password && (
              <span className="form-error">
                <AlertCircle size={12} /> {formErrors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
            id="login-submit-btn"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{
                  animation: 'spin 1s infinite linear',
                  marginRight: '8px'
                }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <path d="M12 2C6.47715 2 2 6.47715 2 12" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Logging in...
              </>
            ) : (
              <>
                Sign In <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          {/* <p>Demo Admin: <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>admin@company.com</span> / <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>password123</span></p> */}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
