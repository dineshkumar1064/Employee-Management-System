import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import OverviewTab from '../components/OverviewTab';
import EmployeesTab from '../components/EmployeesTab';
import AnalyticsTab from '../components/AnalyticsTab';
import EmployeeModal from '../components/EmployeeModal';
import ConfirmModal from '../components/ConfirmModal';

// Pie / donut slice colours shared across Overview and Analytics tabs
const COLORS = {
  Active: '#15803d',
  Inactive: '#b91c1c',
  'On Leave': '#a16207'
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview | employees | analytics
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Sync theme to <html data-theme>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // ── Employee list state ──────────────────────────────────────────────────────
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Debounce search input (300 ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // ── Analytics state ──────────────────────────────────────────────────────────
  const [analyticsData, setAnalyticsData] = useState({
    total: 0,
    active: 0,
    departments: [],
    statuses: [],
    monthlyHires: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // ── Data fetching ────────────────────────────────────────────────────────────
  const fetchEmployees = async () => {
    setListLoading(true);
    setListError('');
    try {
      const response = await api.get('/employees', {
        params: {
          search: debouncedSearch,
          department: selectedDept,
          status: selectedStatus,
          page: currentPage,
          limit: 5
        }
      });
      setEmployees(response.data.employees);
      setTotalEmployees(response.data.total);
      setTotalPages(response.data.pages);
    } catch (err) {
      setListError(err.response?.data?.error || 'Failed to retrieve employee directory.');
    } finally {
      setListLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const response = await api.get('/employees/analytics');
      setAnalyticsData(response.data);
    } catch (err) {
      setAnalyticsError(err.response?.data?.error || 'Failed to calculate analytics metrics.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Re-fetch employees whenever filters or page change
  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearch, selectedDept, selectedStatus, currentPage]);

  // Re-fetch analytics on tab change (keeps metrics fresh after CRUD ops)
  useEffect(() => {
    fetchAnalytics();
  }, [activeTab]);

  // ── CRUD handlers ────────────────────────────────────────────────────────────
  const handleEmployeeSubmit = async (formData) => {
    try {
      if (selectedEmployeeForEdit) {
        await api.put(`/employees/${selectedEmployeeForEdit.id}`, formData);
        setSelectedEmployeeForEdit(null);
        toast.success('Employee updated successfully!');
      } else {
        await api.post('/employees', formData);
        toast.success('Employee created successfully!');
      }
      fetchEmployees();
      fetchAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save employee.');
    }
  };

  const handleEmployeeDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await api.delete(`/employees/${employeeToDelete.id}`);
      fetchEmployees();
      fetchAnalytics();
      setEmployeeToDelete(null);
      toast.success('Employee deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete employee.');
    }
  };

  // ── UI helpers ───────────────────────────────────────────────────────────────
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('default', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':   return 'badge badge-active';
      case 'Inactive': return 'badge badge-inactive';
      case 'On Leave': return 'badge badge-leave';
      default:         return 'badge';
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-layout">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
      />

      <main className="main-content">
        <DashboardHeader
          activeTab={activeTab}
          user={user}
          theme={theme}
          toggleTheme={toggleTheme}
          logout={logout}
        />

        <div className="page-container">
          {activeTab === 'overview' && (
            <OverviewTab
              analyticsData={analyticsData}
              employees={employees}
              listLoading={listLoading}
              getStatusBadgeClass={getStatusBadgeClass}
              setActiveTab={setActiveTab}
              COLORS={COLORS}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeesTab
              employees={employees}
              totalEmployees={totalEmployees}
              totalPages={totalPages}
              currentPage={currentPage}
              listLoading={listLoading}
              listError={listError}
              search={search}
              setSearch={setSearch}
              selectedDept={selectedDept}
              setSelectedDept={setSelectedDept}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              setCurrentPage={setCurrentPage}
              getStatusBadgeClass={getStatusBadgeClass}
              formatDisplayDate={formatDisplayDate}
              onAddEmployee={() => {
                setSelectedEmployeeForEdit(null);
                setIsEmployeeModalOpen(true);
              }}
              onEditEmployee={(emp) => {
                setSelectedEmployeeForEdit(emp);
                setIsEmployeeModalOpen(true);
              }}
              onDeleteEmployee={(emp) => {
                setEmployeeToDelete(emp);
                setIsConfirmModalOpen(true);
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab
              analyticsData={analyticsData}
              analyticsLoading={analyticsLoading}
              COLORS={COLORS}
            />
          )}
        </div>
      </main>

      {/* CRUD Overlay Dialogs */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleEmployeeSubmit}
        employee={selectedEmployeeForEdit}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleEmployeeDelete}
        title="Remove Employee"
        message="Are you sure you want to delete this employee record? This action will permanently wipe their history from the server data index."
        employeeName={employeeToDelete?.name}
      />

    </div>
  );
}
