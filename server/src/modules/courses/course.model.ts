import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  videoUrl: string;
  bunnyVideoId?: string;
  thumbnailUrl?: string;
  isFreePreview: boolean;
  order: number;
  type: 'recorded' | 'live_converted';
}

export interface IUnit {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  isPublished: boolean;
  units: IUnit[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  id: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  videoUrl: { type: String, required: true },
  bunnyVideoId: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  isFreePreview: { type: Boolean, default: false },
  order: { type: Number, default: 1 },
  type: { type: String, enum: ['recorded', 'live_converted'], default: 'recorded' },
});

const UnitSchema = new Schema<IUnit>({
  id: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 1 },
  lessons: { type: [LessonSchema], default: [] },
});

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: [true, 'Course title is required'], trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: [true, 'Course description is required'] },
    thumbnail: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    isPublished: { type: Boolean, default: false },
    units: { type: [UnitSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
