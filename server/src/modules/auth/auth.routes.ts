import { Router } from 'express';
import {
  register,
  login,
  refreshTokenHandler,
  forgotPassword,
  resetPassword,
  getMe,
  getAdminUsers,
  toggleUserSuspension,
  updateProfile,
} from './auth.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshTokenHandler);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

// Admin user management routes
router.get('/admin/users', authenticate, authorize('admin'), getAdminUsers);
router.put('/admin/users/:userId/suspend', authenticate, authorize('admin'), toggleUserSuspension);

export default router;
