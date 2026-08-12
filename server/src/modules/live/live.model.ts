import mongoose, { Schema, Document } from 'mongoose';

export type LiveStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';

export interface ILiveSession extends Document {
  sessionId: string;
  courseId: string;
  unitId: string;
  title: string;
  description: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: LiveStatus;
  chatEnabled: boolean;
  recordingUrl?: string;
  bunnyVideoId?: string;
  convertedLessonId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage extends Document {
  messageId: string;
  sessionId: string;
  userId: string;
  senderName: string;
  senderRole: 'admin' | 'student';
  text: string;
  createdAt: Date;
}

const LiveSessionSchema = new Schema<ILiveSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    courseId: { type: String, required: true },
    unitId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    status: { type: String, enum: ['scheduled', 'live', 'ended', 'cancelled'], default: 'scheduled' },
    chatEnabled: { type: Boolean, default: true },
    recordingUrl: { type: String, default: undefined },
    bunnyVideoId: { type: String, default: undefined },
    convertedLessonId: { type: String, default: undefined },
  },
  { timestamps: true }
);

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    messageId: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true },
    userId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ['admin', 'student'], required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const LiveSession = mongoose.model<ILiveSession>('LiveSession', LiveSessionSchema);
export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
