import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);

// Role Protection Test Endpoints
router.get('/admin/dashboard-stats', authenticate, authorize('admin'), (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Admin Portal. Access granted.',
    stats: { totalStudents: 1420, revenueUSD: 85400 },
  });
});

router.get('/student/my-courses', authenticate, authorize('student', 'admin'), (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to your Student Learning Dashboard.',
    courses: [],
  });
});

export default router;
