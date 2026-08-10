import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import StudentDashboard from '../pages/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import { RequireRole } from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Student Routes */}
      <Route
        path="/dashboard"
        element={
          <RequireRole allowedRoles={['student', 'admin']}>
            <StudentDashboard />
          </RequireRole>
        }
      />

      {/* Protected Admin-Only Routes */}
      <Route
        path="/admin"
        element={
          <RequireRole allowedRoles={['admin']}>
            <AdminDashboard />
          </RequireRole>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
