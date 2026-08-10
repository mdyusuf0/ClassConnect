import { Router } from 'express';
import {
  getStudentCourseProgress,
  updateLessonProgress,
  downloadCertificate,
} from './progress.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/progress/courses/:courseId', authenticate, getStudentCourseProgress);
router.post('/progress/update', authenticate, updateLessonProgress);
router.get('/certificates/:certificateId/download', authenticate, downloadCertificate);

export default router;
