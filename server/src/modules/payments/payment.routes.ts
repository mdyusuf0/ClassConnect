import { Router } from 'express';
import {
  createPaymentOrder,
  confirmPayment,
  getAdminPayments,
  issueRefund,
} from './payment.controller.js';
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

export default router;
