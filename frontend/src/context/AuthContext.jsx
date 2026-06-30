import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session on initialization
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('employee_dashboard_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Session verification failed. Logging out...');
        logout();
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('employee_dashboard_token', token);
      setUser(userData);
      return userData;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('employee_dashboard_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
