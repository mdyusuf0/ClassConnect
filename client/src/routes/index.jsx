import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Catalog from '../pages/Catalog';
import CourseDetail from '../pages/CourseDetail';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import StudentDashboard from '../pages/StudentDashboard';
import CoursePlayer from '../pages/CoursePlayer';
import ReferralDashboard from '../pages/ReferralDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminCourseList from '../pages/admin/AdminCourseList';
import AdminCourseForm from '../pages/admin/AdminCourseForm';
import AdminUnitLessonManager from '../pages/admin/AdminUnitLessonManager';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminReferrals from '../pages/admin/AdminReferrals';
import { RequireRole } from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Catalog Routes */}
      <Route path="/" element={<Catalog />} />
      <Route path="/courses/:slugOrId" element={<CourseDetail />} />
      <Route path="/checkout/:courseId" element={<Checkout />} />

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
      <Route
        path="/learn/:courseId"
        element={
          <RequireRole allowedRoles={['student', 'admin']}>
            <CoursePlayer />
          </RequireRole>
        }
      />
      <Route
        path="/referrals"
        element={
          <RequireRole allowedRoles={['student', 'admin']}>
            <ReferralDashboard />
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
      <Route
        path="/admin/payments"
        element={
          <RequireRole allowedRoles={['admin']}>
            <AdminPayments />
          </RequireRole>
        }
      />
      <Route
        path="/admin/referrals"
        element={
          <RequireRole allowedRoles={['admin']}>
            <AdminReferrals />
          </RequireRole>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
