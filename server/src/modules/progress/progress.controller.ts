import { Response } from 'express';
import mongoose from 'mongoose';
import { UserProgress, IUserProgress } from './progress.model.js';
import { Certificate } from '../certificates/certificate.model.ts';
import { Course } from '../courses/course.model.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { PDFService } from '../../services/pdf.service.js';

const inMemoryProgress: Map<string, any> = new Map();
const inMemoryCertificates: Map<string, any> = new Map();

const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

export const getStudentCourseProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { courseId } = req.params;
    const userId = req.user.userId;
    const key = `${userId}_${courseId}`;

    let progress: any = null;
    if (isDbConnected()) {
      try {
        progress = await UserProgress.findOne({ userId, courseId });
      } catch (e) {
        progress = inMemoryProgress.get(key);
      }
    } else {
      progress = inMemoryProgress.get(key);
    }

    // Default structure if progress record doesn't exist yet
    if (!progress) {
      progress = {
        userId,
        courseId,
        lessonProgress: [],
        unitProgress: [],
        overallCoursePercentage: 0,
        isCertificateUnlocked: false,
      };
    }

    // Fetch course structure to evaluate unit locking
    let course: any = null;
    if (isDbConnected()) {
      try {
        course = await Course.findById(courseId);
      } catch (e) {
        // fallback
      }
    }

    if (!course) {
      course = {
        _id: courseId,
        title: 'Full Stack Web Development Bootcamp',
        units: [
          { id: 'unit_web_1', title: 'Unit 1: Fundamentals', order: 1, lessons: [{ id: 'lesson_web_1_1', duration: 600 }] },
          { id: 'unit_web_2', title: 'Unit 2: React & State', order: 2, lessons: [{ id: 'lesson_web_2_1', duration: 900 }] },
        ],
      };
    }

    // Calculate unit lock states sequentially
    const sortedUnits = (course.units || []).sort((a: any, b: any) => a.order - b.order);
    const unitLockStatusMap: Record<string, { isUnlocked: boolean; percentageWatched: number }> = {};

    sortedUnits.forEach((unit: any, idx: number) => {
      if (idx === 0) {
        // First unit unlocked by default
        const existingProgress = progress.unitProgress?.find((u: any) => u.unitId === unit.id);
        unitLockStatusMap[unit.id] = {
          isUnlocked: true,
          percentageWatched: existingProgress ? existingProgress.percentageWatched : 0,
        };
      } else {
        const prevUnit = sortedUnits[idx - 1];
        const prevProgress = progress.unitProgress?.find((u: any) => u.unitId === prevUnit.id);
        const prevWatched = prevProgress ? prevProgress.percentageWatched : 0;

        // Unlocked only if previous unit reached at least 90% watched
        const isUnlocked = prevWatched >= 90;
        const currentProgress = progress.unitProgress?.find((u: any) => u.unitId === unit.id);
        unitLockStatusMap[unit.id] = {
          isUnlocked,
          percentageWatched: currentProgress ? currentProgress.percentageWatched : 0,
        };
      }
    });

    return res.status(200).json({
      success: true,
      progress: {
        userId,
        courseId,
        overallCoursePercentage: progress.overallCoursePercentage || 0,
        isCertificateUnlocked: (progress.overallCoursePercentage || 0) >= 90,
        certificateId: progress.certificateId || (progress.overallCoursePercentage >= 90 ? `CERT-${courseId}-${userId.slice(-4)}` : null),
        lessonProgress: progress.lessonProgress || [],
        unitLockStatusMap,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateLessonProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { courseId, unitId, lessonId, watchedSeconds, totalDuration } = req.body;
    const userId = req.user.userId;

    if (!courseId || !unitId || !lessonId || watchedSeconds === undefined) {
      return res.status(400).json({ success: false, error: 'courseId, unitId, lessonId, and watchedSeconds are required' });
    }

    const duration = Number(totalDuration || 600);
    const watched = Math.min(Number(watchedSeconds), duration);
    const lessonPercentage = Math.min(100, Math.round((watched / duration) * 100));

    const key = `${userId}_${courseId}`;
    let progress: any = null;

    if (isDbConnected()) {
      try {
        progress = await UserProgress.findOne({ userId, courseId });
      } catch (e) {
        progress = inMemoryProgress.get(key);
      }
    } else {
      progress = inMemoryProgress.get(key);
    }

    if (!progress) {
      progress = {
        userId,
        courseId,
        lessonProgress: [],
        unitProgress: [],
        overallCoursePercentage: 0,
        isCertificateUnlocked: false,
      };
    }

    // Update specific lesson progress
    const existingLessonIdx = progress.lessonProgress.findIndex((l: any) => l.lessonId === lessonId);
    if (existingLessonIdx > -1) {
      progress.lessonProgress[existingLessonIdx].watchedSeconds = Math.max(
        progress.lessonProgress[existingLessonIdx].watchedSeconds,
        watched
      );
      progress.lessonProgress[existingLessonIdx].percentage = Math.max(
        progress.lessonProgress[existingLessonIdx].percentage,
        lessonPercentage
      );
      if (lessonPercentage >= 90) {
        progress.lessonProgress[existingLessonIdx].isCompleted = true;
      }
    } else {
      progress.lessonProgress.push({
        lessonId,
        unitId,
        watchedSeconds: watched,
        duration,
        percentage: lessonPercentage,
        isCompleted: lessonPercentage >= 90,
      });
    }

    // Recalculate Unit Watched Percentage
    const unitLessons = progress.lessonProgress.filter((l: any) => l.unitId === unitId);
    const unitTotalWatched = unitLessons.reduce((sum: number, l: any) => sum + l.watchedSeconds, 0);
    const unitTotalDuration = unitLessons.reduce((sum: number, l: any) => sum + l.duration, 0) || duration;
    const unitPercentage = Math.min(100, Math.round((unitTotalWatched / unitTotalDuration) * 100));

    const unitProgressIdx = progress.unitProgress.findIndex((u: any) => u.unitId === unitId);
    if (unitProgressIdx > -1) {
      progress.unitProgress[unitProgressIdx].percentageWatched = unitPercentage;
      if (unitPercentage >= 90) {
        progress.unitProgress[unitProgressIdx].isUnlocked = true;
      }
    } else {
      progress.unitProgress.push({
        unitId,
        isUnlocked: true,
        percentageWatched: unitPercentage,
      });
    }

    // Recalculate Overall Course Percentage
    const allWatched = progress.lessonProgress.reduce((sum: number, l: any) => sum + l.watchedSeconds, 0);
    const allDuration = progress.lessonProgress.reduce((sum: number, l: any) => sum + l.duration, 0) || duration;
    const overallCoursePercentage = Math.min(100, Math.round((allWatched / allDuration) * 100));
    progress.overallCoursePercentage = overallCoursePercentage;

    // Automatic Certificate Generation Trigger (Overall Progress >= 90%)
    let newlyUnlockedCertId = null;
    if (overallCoursePercentage >= 90 && !progress.isCertificateUnlocked) {
      progress.isCertificateUnlocked = true;
      const certId = `CERT-${Date.now().toString(36).toUpperCase()}-${userId.slice(-4).toUpperCase()}`;
      progress.certificateId = certId;
      newlyUnlockedCertId = certId;

      const certRecord = {
        certificateId: certId,
        userId,
        courseId,
        studentName: req.user.email.split('@')[0],
        courseTitle: 'Full Stack Web Development Bootcamp',
        issuedDate: new Date(),
        pdfUrl: `/api/v1/certificates/${certId}/download`,
      };

      if (isDbConnected()) {
        try {
          await Certificate.create(certRecord);
        } catch (e) {
          inMemoryCertificates.set(certId, certRecord);
        }
      } else {
        inMemoryCertificates.set(certId, certRecord);
      }
    }

    if (isDbConnected() && typeof progress.save === 'function') {
      await progress.save();
    } else {
      inMemoryProgress.set(key, progress);
    }

    return res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      progress: {
        courseId,
        unitId,
        lessonId,
        lessonPercentage,
        unitPercentage,
        overallCoursePercentage,
        isCertificateUnlocked: progress.isCertificateUnlocked,
        certificateId: progress.certificateId,
        newlyUnlockedCertId,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const downloadCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { certificateId } = req.params;

    let cert: any = null;
    if (isDbConnected()) {
      try {
        cert = await Certificate.findOne({ certificateId });
      } catch (e) {
        cert = inMemoryCertificates.get(certificateId);
      }
    }

    if (!cert) {
      cert = inMemoryCertificates.get(certificateId) || {
        certificateId,
        studentName: req.user?.email ? req.user.email.split('@')[0] : 'Enrolled Student',
        courseTitle: 'Full Stack Web Development Bootcamp',
        issuedDate: new Date().toLocaleDateString(),
      };
    }

    const pdfBuffer = await PDFService.generateCertificatePDF({
      certificateId: cert.certificateId || certificateId,
      studentName: cert.studentName || 'ClassConnect Student',
      courseTitle: cert.courseTitle || 'Mastery Certification',
      issuedDate: cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString() : new Date().toLocaleDateString(),
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ClassConnect_Certificate_${certificateId}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};
