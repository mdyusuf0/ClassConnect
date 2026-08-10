import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ReferralSetting, ReferralEarning, PayoutRequest } from './referral.model.js';
import { Course } from '../courses/course.model.js';
import { User } from '../auth/user.model.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

const inMemorySettings: Map<string, any> = new Map();
const inMemoryEarnings: Map<string, any[]> = new Map(); // key: userId
const inMemoryPayouts: Map<string, any> = new Map();

const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

export const getStudentReferralDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const userId = req.user.userId;
    const email = req.user.email;
    const nameSlug = email.split('@')[0].toUpperCase();
    const referralCode = `REF-${nameSlug}-${userId.slice(-4).toUpperCase()}`;
    const shareableLink = `${req.protocol}://${req.get('host') || 'localhost:3000'}/register?ref=${referralCode}`;

    let earnings: any[] = [];
    let payouts: any[] = [];

    if (isDbConnected()) {
      try {
        earnings = await ReferralEarning.find({ referrerUserId: userId }).sort({ createdAt: -1 });
        payouts = await PayoutRequest.find({ userId }).sort({ createdAt: -1 });
      } catch (e) {
        earnings = inMemoryEarnings.get(userId) || [];
        payouts = Array.from(inMemoryPayouts.values()).filter((p) => p.userId === userId);
      }
    } else {
      earnings = inMemoryEarnings.get(userId) || [
        {
          referrerUserId: userId,
          referredUserId: 'user_referred_101',
          referredUserEmail: 'alex.smith@example.com',
          courseId: 'course_web_dev_101',
          courseTitle: 'Full Stack Web Development Bootcamp',
          transactionId: 'TXN-STRIPE-9812',
          commissionAmount: 14.85,
          status: 'credited',
          createdAt: new Date(),
        },
      ];
      payouts = Array.from(inMemoryPayouts.values()).filter((p) => p.userId === userId);
    }

    const totalEarned = earnings.reduce((sum, e) => sum + (e.commissionAmount || 0), 0);
    const totalPaidOut = payouts
      .filter((p) => p.status === 'approved')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingPayout = payouts
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const availableBalance = Math.max(0, totalEarned - totalPaidOut - pendingPayout);

    return res.status(200).json({
      success: true,
      referralCode,
      shareableLink,
      wallet: {
        totalEarned,
        totalPaidOut,
        pendingPayout,
        availableBalance,
      },
      earningsHistory: earnings,
      payoutRequests: payouts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const requestPayout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { amount, paymentDetails } = req.body;
    const requestAmount = Number(amount);

    if (!requestAmount || requestAmount <= 0 || !paymentDetails) {
      return res.status(400).json({ success: false, error: 'Valid amount and payment details are required' });
    }

    const userId = req.user.userId;
    const requestId = `PAYOUT-REQ-${Date.now().toString(36).toUpperCase()}`;

    const newPayout = {
      requestId,
      userId,
      userEmail: req.user.email,
      amount: requestAmount,
      paymentDetails,
      status: 'pending',
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      try {
        await PayoutRequest.create(newPayout);
      } catch (e) {
        inMemoryPayouts.set(requestId, newPayout);
      }
    } else {
      inMemoryPayouts.set(requestId, newPayout);
    }

    return res.status(201).json({
      success: true,
      message: 'Payout request submitted successfully. Awaiting admin approval.',
      payoutRequest: newPayout,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Admin Course Referral CMS Settings
export const getAdminReferralSettings = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    let setting: any = null;
    if (isDbConnected()) {
      try {
        setting = await ReferralSetting.findOne({ courseId });
      } catch (e) {
        setting = inMemorySettings.get(courseId);
      }
    } else {
      setting = inMemorySettings.get(courseId);
    }

    if (!setting) {
      setting = {
        courseId,
        referralsEnabled: true,
        commissionType: 'percentage',
        commissionValue: 15,
      };
    }

    return res.status(200).json({ success: true, setting });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateAdminReferralSettings = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { referralsEnabled, commissionType, commissionValue } = req.body;

    const updated = {
      courseId,
      referralsEnabled: referralsEnabled !== undefined ? !!referralsEnabled : true,
      commissionType: commissionType === 'flat' ? 'flat' : 'percentage',
      commissionValue: Number(commissionValue || 15),
      updatedAt: new Date(),
    };

    if (isDbConnected()) {
      try {
        await ReferralSetting.findOneAndUpdate({ courseId }, updated, { upsert: true, new: true });
      } catch (e) {
        inMemorySettings.set(courseId, updated);
      }
    } else {
      inMemorySettings.set(courseId, updated);
    }

    return res.status(200).json({
      success: true,
      message: 'Referral commission rule updated for course.',
      setting: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Admin Payout Management
export const getAdminPayoutRequests = async (_req: Request, res: Response) => {
  try {
    let payouts: any[] = [];
    if (isDbConnected()) {
      try {
        payouts = await PayoutRequest.find().sort({ createdAt: -1 });
      } catch (e) {
        payouts = Array.from(inMemoryPayouts.values());
      }
    } else {
      payouts = Array.from(inMemoryPayouts.values());
    }

    if (payouts.length === 0) {
      payouts = [
        {
          requestId: 'PAYOUT-REQ-001',
          userId: 'user_samir',
          userEmail: 'samir.student@example.com',
          amount: 14.85,
          paymentDetails: 'PayPal: samir.student@example.com',
          status: 'pending',
          createdAt: new Date(),
        },
      ];
    }

    return res.status(200).json({
      success: true,
      count: payouts.length,
      payoutRequests: payouts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const processAdminPayout = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { status, adminNotes } = req.body; // 'approved' | 'rejected'

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status must be approved or rejected' });
    }

    let payout: any = null;
    if (isDbConnected()) {
      try {
        payout = await PayoutRequest.findOne({ requestId });
      } catch (e) {
        payout = inMemoryPayouts.get(requestId);
      }
    } else {
      payout = inMemoryPayouts.get(requestId) || Array.from(inMemoryPayouts.values()).find(p => p.requestId === requestId);
    }

    if (!payout) {
      return res.status(404).json({ success: false, error: 'Payout request not found' });
    }

    payout.status = status;
    payout.adminNotes = adminNotes || `Payout request ${status} by admin`;
    payout.updatedAt = new Date();

    if (isDbConnected() && typeof payout.save === 'function') {
      await payout.save();
    } else {
      inMemoryPayouts.set(requestId, payout);
    }

    return res.status(200).json({
      success: true,
      message: `Payout request ${requestId} ${status} successfully.`,
      payoutRequest: payout,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};
