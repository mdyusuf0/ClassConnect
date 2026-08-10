import mongoose, { Schema, Document } from 'mongoose';

export type PaymentGateway = 'stripe' | 'razorpay';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface IPayment extends Document {
  transactionId: string;
  userId: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  status: PaymentStatus;
  referralCode?: string;
  referrerUserId?: string;
  commissionAmount: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    transactionId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    courseId: { type: String, required: true },
    courseTitle: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    gateway: { type: String, enum: ['stripe', 'razorpay'], required: true },
    gatewayOrderId: { type: String, required: true },
    gatewayPaymentId: { type: String, default: undefined },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    referralCode: { type: String, default: undefined },
    referrerUserId: { type: String, default: undefined },
    commissionAmount: { type: Number, default: 0 },
    refundReason: { type: String, default: undefined },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
