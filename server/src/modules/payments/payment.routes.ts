import { Router } from 'express';
import {
  createPaymentOrder,
  confirmPayment,
  getAdminPayments,
  issueRefund,
} from './payment.controller.js';
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from './package.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Student Payment & Webhook Endpoints
router.post('/payments/create-order', authenticate, createPaymentOrder);
router.post('/payments/confirm', confirmPayment);
router.post('/payments/webhooks/stripe', confirmPayment);
router.post('/payments/webhooks/razorpay', confirmPayment);

// Admin Refund & Payment Lookup Endpoints
router.get('/admin/payments', authenticate, authorize('admin'), getAdminPayments);
router.post('/admin/payments/:transactionId/refund', authenticate, authorize('admin'), issueRefund);

// Packages CRUD Endpoints
router.get('/packages', getPackages);
router.post('/admin/packages', authenticate, authorize('admin'), createPackage);
router.put('/admin/packages/:packageId', authenticate, authorize('admin'), updatePackage);
router.delete('/admin/packages/:packageId', authenticate, authorize('admin'), deletePackage);

export default router;
