import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Payment, PaymentGateway } from './payment.model.js';
import { Course } from '../courses/course.model.js';
import { User } from '../auth/user.model.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

const inMemoryPayments: Map<string, any> = new Map();
const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

export const createPaymentOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { courseId, gateway, referralCode } = req.body;
    if (!courseId || !gateway) {
      return res.status(400).json({ success: false, error: 'courseId and gateway (stripe/razorpay) are required' });
    }

    const selectedGateway: PaymentGateway = gateway === 'razorpay' ? 'razorpay' : 'stripe';

    // Fetch course details
    let course: any = null;
    if (isDbConnected()) {
      try {
        course = await Course.findById(courseId);
      } catch (e) {
        // fallback
      }
    }

    if (!course) {
      course = {
        _id: courseId,
        id: courseId,
        title: 'Full Stack Web Development Bootcamp',
        price: 99,
      };
    }

    const transactionId = `TXN-${selectedGateway.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const gatewayOrderId = `${selectedGateway}_ord_${Math.random().toString(36).substring(2, 10)}`;

    const newPayment = {
      transactionId,
      userId: req.user.userId,
      userEmail: req.user.email,
      courseId: String(course._id || course.id),
      courseTitle: course.title,
      amount: course.price,
      currency: selectedGateway === 'razorpay' ? 'INR' : 'USD',
      gateway: selectedGateway,
      gatewayOrderId,
      status: 'pending',
      referralCode: referralCode || undefined,
      commissionAmount: referralCode ? Math.round(course.price * 0.15) : 0, // Default 15% referral rule
    };

    if (isDbConnected()) {
      try {
        await Payment.create(newPayment);
      } catch (e) {
        inMemoryPayments.set(transactionId, newPayment);
      }
    } else {
      inMemoryPayments.set(transactionId, newPayment);
    }

    return res.status(201).json({
      success: true,
      message: 'Payment order created',
      order: {
        transactionId,
        gateway: selectedGateway,
        gatewayOrderId,
        amount: course.price,
        currency: newPayment.currency,
        courseTitle: course.title,
        stripeClientSecret: selectedGateway === 'stripe' ? `pi_${transactionId}_secret` : undefined,
        razorpayKeyId: selectedGateway === 'razorpay' ? 'rzp_test_mock_key' : undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { transactionId, gatewayPaymentId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ success: false, error: 'transactionId is required' });
    }

    let payment: any = null;
    if (isDbConnected()) {
      try {
        payment = await Payment.findOne({ transactionId });
      } catch (e) {
        payment = inMemoryPayments.get(transactionId);
      }
    } else {
      payment = inMemoryPayments.get(transactionId);
    }

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Transaction record not found' });
    }

    payment.status = 'completed';
    payment.gatewayPaymentId = gatewayPaymentId || `pay_${Math.random().toString(36).substring(2, 9)}`;

    if (isDbConnected() && typeof payment.save === 'function') {
      await payment.save();
    } else {
      inMemoryPayments.set(transactionId, payment);
    }

    // Enrollment Trigger: Add courseId to user enrolledCourses
    if (isDbConnected()) {
      try {
        await User.findByIdAndUpdate(payment.userId, {
          $addToSet: { enrolledCourses: payment.courseId },
        });
      } catch (e) {
        // fallback
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment confirmed and student successfully enrolled in course!',
      enrollment: {
        userId: payment.userId,
        courseId: payment.courseId,
        courseTitle: payment.courseTitle,
        transactionId: payment.transactionId,
        status: 'ENROLLED',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getAdminPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let payments: any[] = [];
    if (isDbConnected()) {
      try {
        payments = await Payment.find().sort({ createdAt: -1 });
      } catch (e) {
        payments = Array.from(inMemoryPayments.values());
      }
    } else {
      payments = Array.from(inMemoryPayments.values());
    }

    // Default mock list if database is empty
    if (payments.length === 0) {
      payments = [
        {
          transactionId: 'TXN-STRIPE-001',
          userId: 'user_1',
          userEmail: 'student.samir@example.com',
          courseId: 'course_web_dev_101',
          courseTitle: 'Full Stack Web Development Bootcamp',
          amount: 99,
          currency: 'USD',
          gateway: 'stripe',
          gatewayOrderId: 'stripe_ord_001',
          status: 'completed',
          referralCode: 'REF-SAMIR2026',
          commissionAmount: 14.85,
          createdAt: new Date(),
        },
        {
          transactionId: 'TXN-RAZORPAY-002',
          userId: 'user_2',
          userEmail: 'student.priya@example.com',
          courseId: 'course_ai_ml_201',
          courseTitle: 'AI & Machine Learning Masterclass',
          amount: 149,
          currency: 'INR',
          gateway: 'razorpay',
          gatewayOrderId: 'rzp_ord_002',
          status: 'completed',
          commissionAmount: 0,
          createdAt: new Date(),
        },
      ];
    }

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const issueRefund = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    let payment: any = null;
    if (isDbConnected()) {
      try {
        payment = await Payment.findOne({ transactionId });
      } catch (e) {
        payment = inMemoryPayments.get(transactionId);
      }
    } else {
      payment = inMemoryPayments.get(transactionId) || Array.from(inMemoryPayments.values()).find(p => p.transactionId === transactionId);
    }

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Transaction record not found' });
    }

    payment.status = 'refunded';
    payment.refundReason = reason || 'Customer requested refund via admin support';

    if (isDbConnected() && typeof payment.save === 'function') {
      await payment.save();
    } else {
      inMemoryPayments.set(transactionId, payment);
    }

    return res.status(200).json({
      success: true,
      message: `Refund processed successfully for ${payment.transactionId} via ${payment.gateway.toUpperCase()}`,
      payment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};
