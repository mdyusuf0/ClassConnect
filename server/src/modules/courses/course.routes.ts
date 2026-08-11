import { Router } from 'express';
import { getPublicCourses, getPublicCourseDetail, getSignedLessonStream } from './course.public.controller.js';
import {
  createCourse,
  getAdminCourses,
  getAdminCourseById,
  updateCourse,
  deleteCourse,
  addUnit,
  reorderUnits,
  deleteUnit,
  addLesson,
  deleteLesson,
  uploadAsset,
  updateUnit,
  updateLesson,
} from './course.admin.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Public Routes
router.get('/courses', getPublicCourses);
router.get('/courses/:slugOrId', getPublicCourseDetail);

// Anti-Piracy Short-Lived Signed Stream URL Endpoint
router.get('/courses/:courseId/lessons/:lessonId/stream', authenticate, getSignedLessonStream);

// Protected Admin CMS Routes
router.post('/admin/courses', authenticate, authorize('admin'), createCourse);
router.get('/admin/courses', authenticate, authorize('admin'), getAdminCourses);
router.get('/admin/courses/:id', authenticate, authorize('admin'), getAdminCourseById);
router.put('/admin/courses/:id', authenticate, authorize('admin'), updateCourse);
router.delete('/admin/courses/:id', authenticate, authorize('admin'), deleteCourse);

// Unit & Lesson Management Routes
router.post('/admin/courses/:courseId/units', authenticate, authorize('admin'), addUnit);
router.put('/admin/courses/:courseId/units/reorder', authenticate, authorize('admin'), reorderUnits);
router.put('/admin/courses/:courseId/units/:unitId', authenticate, authorize('admin'), updateUnit);
router.delete('/admin/courses/:courseId/units/:unitId', authenticate, authorize('admin'), deleteUnit);

router.post('/admin/courses/:courseId/units/:unitId/lessons', authenticate, authorize('admin'), addLesson);
router.put('/admin/courses/:courseId/units/:unitId/lessons/:lessonId', authenticate, authorize('admin'), updateLesson);
router.delete('/admin/courses/:courseId/units/:unitId/lessons/:lessonId', authenticate, authorize('admin'), deleteLesson);

// Bunny Upload Route
router.post('/admin/courses/upload-asset', authenticate, authorize('admin'), uploadAsset);

export default router;
