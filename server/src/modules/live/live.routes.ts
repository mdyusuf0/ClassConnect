import { Router } from 'express';
import {
  scheduleLiveClass,
  getAdminLiveClasses,
  getStudentLiveClasses,
  getLiveSessionDetail,
  updateLiveStatus,
  sendChatMessage,
  getChatMessages,
} from './live.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Admin Live Management Routes
router.post('/admin/live/schedule', authenticate, authorize('admin'), scheduleLiveClass);
router.get('/admin/live/classes', authenticate, authorize('admin'), getAdminLiveClasses);
router.put('/admin/live/sessions/:sessionId/status', authenticate, authorize('admin'), updateLiveStatus);

// Student & Participant Live Room & Chat Routes
router.get('/live/courses/:courseId', authenticate, getStudentLiveClasses);
router.get('/live/sessions/:sessionId', authenticate, getLiveSessionDetail);
router.post('/live/sessions/:sessionId/chat', authenticate, sendChatMessage);
router.get('/live/sessions/:sessionId/chat', authenticate, getChatMessages);

export default router;
