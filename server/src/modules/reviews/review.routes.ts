import { Router } from 'express';
import {
  submitOrUpdateReview,
  getPublicCourseReviews,
  getAdminReviews,
  moderateReview,
} from './review.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Public Course Reviews & Ratings Endpoint
router.get('/courses/:courseId/reviews', getPublicCourseReviews);

// Student Review Submission Endpoint (Protected & Enrolled Only)
router.post('/courses/:courseId/reviews', authenticate, submitOrUpdateReview);

// Admin Review Moderation Queue Endpoints
router.get('/admin/reviews', authenticate, authorize('admin'), getAdminReviews);
router.post('/admin/reviews/:reviewId/moderate', authenticate, authorize('admin'), moderateReview);

export default router;
