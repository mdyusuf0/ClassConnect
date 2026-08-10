import { Router } from 'express';
import {
  register,
  login,
  refreshTokenHandler,
  forgotPassword,
  resetPassword,
  getMe,
} from './auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshTokenHandler);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);

export default router;
