import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  commission: number; // referral commission amount
  selectedCourses: string[]; // course IDs
  features: string[];
  popular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    commission: { type: Number, default: 0, min: 0 },
    selectedCourses: { type: [String], default: [] },
    features: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Package = mongoose.model<IPackage>('Package', PackageSchema);
