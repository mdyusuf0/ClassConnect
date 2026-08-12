import { Router } from 'express';
import {
  getVideoStories,
  createVideoStory,
  deleteVideoStory,
} from './video-story.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/video-stories', getVideoStories);
router.post('/admin/video-stories', authenticate, authorize('admin'), createVideoStory);
router.delete('/admin/video-stories/:id', authenticate, authorize('admin'), deleteVideoStory);

export default router;
