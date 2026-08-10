import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType =
  | 'enrollment'
  | 'course_completion'
  | 'certificate_earned'
  | 'review_submitted'
  | 'payout_requested'
  | 'payout_processed';

export interface INotification extends Document {
  notificationId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: any;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    notificationId: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: [
        'enrollment',
        'course_completion',
        'certificate_earned',
        'review_submitted',
        'payout_requested',
        'payout_processed',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
