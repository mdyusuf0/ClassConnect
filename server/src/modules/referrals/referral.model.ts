import mongoose, { Schema, Document } from 'mongoose';

export interface IReferralSetting extends Document {
  courseId: string;
  referralsEnabled: boolean;
  commissionType: 'percentage' | 'flat';
  commissionValue: number;
  updatedAt: Date;
}

export interface IReferralEarning extends Document {
  referrerUserId: string;
  referredUserId: string;
  referredUserEmail: string;
  courseId: string;
  courseTitle: string;
  transactionId: string;
  commissionAmount: number;
  status: 'credited' | 'pending' | 'cancelled';
  createdAt: Date;
}

export interface IPayoutRequest extends Document {
  requestId: string;
  userId: string;
  userEmail: string;
  amount: number;
  paymentDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSettingSchema = new Schema<IReferralSetting>(
  {
    courseId: { type: String, required: true, unique: true },
    referralsEnabled: { type: Boolean, default: true },
    commissionType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    commissionValue: { type: Number, default: 15 }, // 15% or $15 flat
  },
  { timestamps: true }
);

const ReferralEarningSchema = new Schema<IReferralEarning>(
  {
    referrerUserId: { type: String, required: true },
    referredUserId: { type: String, required: true },
    referredUserEmail: { type: String, required: true },
    courseId: { type: String, required: true },
    courseTitle: { type: String, required: true },
    transactionId: { type: String, required: true },
    commissionAmount: { type: Number, required: true },
    status: { type: String, enum: ['credited', 'pending', 'cancelled'], default: 'credited' },
  },
  { timestamps: true }
);

const PayoutRequestSchema = new Schema<IPayoutRequest>(
  {
    requestId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentDetails: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNotes: { type: String, default: undefined },
  },
  { timestamps: true }
);

export const ReferralSetting = mongoose.model<IReferralSetting>('ReferralSetting', ReferralSettingSchema);
export const ReferralEarning = mongoose.model<IReferralEarning>('ReferralEarning', ReferralEarningSchema);
export const PayoutRequest = mongoose.model<IPayoutRequest>('PayoutRequest', PayoutRequestSchema);
