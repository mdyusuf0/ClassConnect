import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Catalog from '../pages/Catalog';
import CourseDetail from '../pages/CourseDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import StudentDashboard from '../pages/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminCourseList from '../pages/admin/AdminCourseList';
import AdminCourseForm from '../pages/admin/AdminCourseForm';
import AdminUnitLessonManager from '../pages/admin/AdminUnitLessonManager';
import { RequireRole } from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Catalog Routes */}
      <Route path="/" element={<Catalog />} />
      <Route path="/courses/:slugOrId" element={<CourseDetail />} />

      {/* Auth Routes */}
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

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <RequireRole allowedRoles={['admin']}>
            <AdminDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <RequireRole allowedRoles={['admin']}>
            <AdminCourseList />
          </RequireRole>
        }
      />
      <Route
        path="/admin/courses/new"
        element={
          <RequireRole allowedRoles={['admin']}>
            <AdminCourseForm />
          </RequireRole>
        }
      />
      <Route
        path="/admin/courses/:id/edit"
        element={
          <RequireRole allowedRoles={['admin']}>
            <AdminCourseForm />
          </RequireRole>
        }
      />
      <Route
        path="/admin/courses/:courseId/units"
        element={
          <RequireRole allowedRoles={['admin']}>
            <AdminUnitLessonManager />
          </RequireRole>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
