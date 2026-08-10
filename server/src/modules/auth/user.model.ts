import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'admin' | 'student';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  enrolledCourses: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student',
    },
    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },
    enrolledCourses: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
