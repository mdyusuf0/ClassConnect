import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonProgress {
  lessonId: string;
  unitId: string;
  watchedSeconds: number;
  duration: number;
  percentage: number;
  isCompleted: boolean;
}

export interface IUnitProgress {
  unitId: string;
  isUnlocked: boolean;
  percentageWatched: number;
}

export interface IUserProgress extends Document {
  userId: string;
  courseId: string;
  lessonProgress: ILessonProgress[];
  unitProgress: IUnitProgress[];
  overallCoursePercentage: number;
  isCertificateUnlocked: boolean;
  certificateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LessonProgressSchema = new Schema<ILessonProgress>({
  lessonId: { type: String, required: true },
  unitId: { type: String, required: true },
  watchedSeconds: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
});

const UnitProgressSchema = new Schema<IUnitProgress>({
  unitId: { type: String, required: true },
  isUnlocked: { type: Boolean, default: false },
  percentageWatched: { type: Number, default: 0 },
});

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    lessonProgress: { type: [LessonProgressSchema], default: [] },
    unitProgress: { type: [UnitProgressSchema], default: [] },
    overallCoursePercentage: { type: Number, default: 0 },
    isCertificateUnlocked: { type: Boolean, default: false },
    certificateId: { type: String, default: undefined },
  },
  {
    timestamps: true,
  }
);

UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
