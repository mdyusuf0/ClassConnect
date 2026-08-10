import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { User, UserRole } from './user.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

// In-memory store for fallback/tests
const inMemoryUsers: Map<string, any> = new Map();

const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

const findUserByEmail = async (email: string): Promise<any | null> => {
  const targetEmail = email.toLowerCase();
  if (isDbConnected()) {
    try {
      const dbUser = await User.findOne({ email: targetEmail }).select('+password');
      if (dbUser) return dbUser;
    } catch (e) {
      // fallback
    }
  }
  for (const u of inMemoryUsers.values()) {
    if (u.email.toLowerCase() === targetEmail) {
      return u;
    }
  }
  return null;
};

const findUserById = async (id: string): Promise<any | null> => {
  if (isDbConnected()) {
    try {
      const dbUser = await User.findById(id);
      if (dbUser) return dbUser;
    } catch (e) {
      // fallback
    }
  }
  return inMemoryUsers.get(id) || null;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, courseId, paymentMethod } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const assignedRole: UserRole = role === 'admin' ? 'admin' : 'student';
    const initialCourses = courseId ? [courseId] : [];

    let newUser: any;
    if (isDbConnected()) {
      try {
        newUser = await User.create({
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: assignedRole,
          enrolledCourses: initialCourses,
        });
      } catch (dbError) {
        const mockId = 'user_' + Math.random().toString(36).substring(2, 9);
        newUser = {
          _id: mockId,
          id: mockId,
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: assignedRole,
          enrolledCourses: initialCourses,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        inMemoryUsers.set(mockId, newUser);
      }
    } else {
      const mockId = 'user_' + Math.random().toString(36).substring(2, 9);
      newUser = {
        _id: mockId,
        id: mockId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: assignedRole,
        enrolledCourses: initialCourses,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryUsers.set(mockId, newUser);
    }

    const payload = { userId: String(newUser._id || newUser.id), email: newUser.email, role: newUser.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: {
        id: String(newUser._id || newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        enrolledCourses: newUser.enrolledCourses,
      },
      paymentStatus: paymentMethod ? 'STUB_COMPLETED' : 'FREE_ENROLLED',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const payload = { userId: String(user._id || user.id), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: String(user._id || user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        enrolledCourses: user.enrolledCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email exists in our system, password reset instructions have been sent.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    if (isDbConnected() && typeof user.save === 'function') {
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'If that email exists in our system, password reset instructions have been sent.',
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: 'Token and new password are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    let user: any = null;
    if (isDbConnected()) {
      try {
        user = await User.findOne({
          resetPasswordToken: hashedToken,
          resetPasswordExpires: { $gt: new Date() },
        });
      } catch (e) {
        // fallback
      }
    }

    if (!user) {
      for (const u of inMemoryUsers.values()) {
        if (u.resetPasswordToken === hashedToken && u.resetPasswordExpires && u.resetPasswordExpires > new Date()) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired password reset token' });
    }

    user.password = await bcrypt.hash(newPassword, 8);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    if (isDbConnected() && typeof user.save === 'function') {
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: String(user._id || user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        enrolledCourses: user.enrolledCourses || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};
