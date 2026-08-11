import mongoose, { Schema, Document } from 'mongoose';

export interface IVideoStory extends Document {
  id: string;
  name: string;
  role: string;
  courseTag: string;
  badge: string;
  avatar: string;
  thumbnail: string;
  videoUrl: string;
  quote: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoStorySchema = new Schema<IVideoStory>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    courseTag: { type: String, required: true },
    badge: { type: String, required: true },
    avatar: { type: String, required: true },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const VideoStory = mongoose.model<IVideoStory>('VideoStory', VideoStorySchema);
