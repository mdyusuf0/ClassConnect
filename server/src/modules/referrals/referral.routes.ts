import { Router } from 'express';
import {
  getStudentReferralDashboard,
  requestPayout,
  getAdminReferralSettings,
  updateAdminReferralSettings,
  getAdminPayoutRequests,
  processAdminPayout,
} from './referral.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Student Referral Dashboard & Payout Request
router.get('/referrals/dashboard', authenticate, getStudentReferralDashboard);
router.post('/referrals/payout-request', authenticate, requestPayout);

// Admin CMS Course Referral Commission Settings
router.get('/admin/referrals/settings/:courseId', authenticate, authorize('admin'), getAdminReferralSettings);
router.put('/admin/referrals/settings/:courseId', authenticate, authorize('admin'), updateAdminReferralSettings);

// Admin Payout Request Approvals
router.get('/admin/referrals/payouts', authenticate, authorize('admin'), getAdminPayoutRequests);
router.post('/admin/referrals/payouts/:requestId', authenticate, authorize('admin'), processAdminPayout);

export default router;
