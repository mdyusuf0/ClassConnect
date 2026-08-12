import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import courseRoutes from '../modules/courses/course.routes.js';
import progressRoutes from '../modules/progress/progress.routes.js';
import paymentRoutes from '../modules/payments/payment.routes.js';
import referralRoutes from '../modules/referrals/referral.routes.js';
import liveRoutes from '../modules/live/live.routes.js';
import reviewRoutes from '../modules/reviews/review.routes.js';
import videoStoryRoutes from '../modules/video-stories/video-story.routes.js';
import analyticsRoutes from '../modules/analytics/analytics.routes.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/', courseRoutes);
router.use('/', progressRoutes);
router.use('/', paymentRoutes);
router.use('/', referralRoutes);
router.use('/', liveRoutes);
router.use('/', reviewRoutes);
router.use('/', videoStoryRoutes);
router.use('/', analyticsRoutes);

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
