import { Router } from 'express';
import {
  getAdminAnalyticsDashboard,
  getAdminNotifications,
  markNotificationRead,
} from './analytics.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Admin Analytics Dashboard Endpoint
router.get('/admin/analytics', authenticate, authorize('admin'), getAdminAnalyticsDashboard);

// Admin System Notifications Endpoints
router.get('/admin/notifications', authenticate, authorize('admin'), getAdminNotifications);
router.put('/admin/notifications/:id/read', authenticate, authorize('admin'), markNotificationRead);

export default router;
