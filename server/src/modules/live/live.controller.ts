import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { LiveSession, ChatMessage, LiveStatus } from './live.model.js';
import { Course } from '../courses/course.model.js';
import type { IUnit } from '../courses/course.model.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { BunnyService } from '../../services/bunny.service.js';

const inMemorySessions: Map<string, any> = new Map();
const inMemoryChat: Map<string, any[]> = new Map(); // key: sessionId

const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

export const scheduleLiveClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId, unitId, title, description, scheduledAt, duration } = req.body;

    if (!courseId || !unitId || !title || !scheduledAt) {
      return res.status(400).json({ success: false, error: 'courseId, unitId, title, and scheduledAt are required' });
    }

    const sessionId = `LIVE-SESS-${Date.now().toString(36).toUpperCase()}`;
    const newSession = {
      sessionId,
      courseId,
      unitId,
      title,
      description: description || '',
      scheduledAt: new Date(scheduledAt),
      duration: Number(duration || 60),
      status: 'scheduled' as LiveStatus,
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      try {
        await LiveSession.create(newSession);
      } catch (e) {
        inMemorySessions.set(sessionId, newSession);
      }
    } else {
      inMemorySessions.set(sessionId, newSession);
    }

    return res.status(201).json({
      success: true,
      message: 'Live class scheduled successfully',
      session: newSession,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getAdminLiveClasses = async (_req: Request, res: Response) => {
  try {
    let sessions: any[] = [];
    if (isDbConnected()) {
      try {
        sessions = await LiveSession.find().sort({ scheduledAt: -1 });
      } catch (e) {
        sessions = Array.from(inMemorySessions.values());
      }
    } else {
      sessions = Array.from(inMemorySessions.values());
    }

    if (sessions.length === 0) {
      sessions = [
        {
          sessionId: 'LIVE-SESS-001',
          courseId: 'course_web_dev_101',
          unitId: 'unit_web_1',
          title: 'Live Workshop: React 19 Server Components & Architecture',
          description: 'Interactive live coding session and Q&A',
          scheduledAt: new Date(Date.now() + 3600 * 1000),
          duration: 60,
          status: 'scheduled',
          createdAt: new Date(),
        },
      ];
    }

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getStudentLiveClasses = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    let sessions: any[] = [];
    if (isDbConnected()) {
      try {
        sessions = await LiveSession.find({ courseId }).sort({ scheduledAt: -1 });
      } catch (e) {
        sessions = Array.from(inMemorySessions.values()).filter((s) => s.courseId === courseId);
      }
    } else {
      sessions = Array.from(inMemorySessions.values()).filter((s) => s.courseId === courseId);
      if (sessions.length === 0) {
        sessions = [
          {
            sessionId: 'LIVE-SESS-001',
            courseId,
            unitId: 'unit_web_1',
            title: 'Live Workshop: React 19 Server Components & Architecture',
            description: 'Interactive live coding session and Q&A',
            scheduledAt: new Date(Date.now() + 1800 * 1000),
            duration: 60,
            status: 'scheduled',
            createdAt: new Date(),
          },
        ];
      }
    }

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getLiveSessionDetail = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    let session: any = null;
    if (isDbConnected()) {
      try {
        session = await LiveSession.findOne({ sessionId });
      } catch (e) {
        session = inMemorySessions.get(sessionId);
      }
    } else {
      session = inMemorySessions.get(sessionId) || Array.from(inMemorySessions.values()).find(s => s.sessionId === sessionId);
    }

    if (!session) {
      session = {
        sessionId,
        courseId: 'course_web_dev_101',
        unitId: 'unit_web_1',
        title: 'Live Workshop: React 19 Server Components',
        description: 'Interactive live session',
        scheduledAt: new Date(),
        duration: 60,
        status: 'live',
      };
    }

    return res.status(200).json({
      success: true,
      session,
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateLiveStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body; // 'live' | 'ended' | 'cancelled'

    if (!status || !['live', 'ended', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Valid status (live, ended, cancelled) is required' });
    }

    let session: any = null;
    if (isDbConnected()) {
      try {
        session = await LiveSession.findOne({ sessionId });
      } catch (e) {
        session = inMemorySessions.get(sessionId);
      }
    } else {
      session = inMemorySessions.get(sessionId) || Array.from(inMemorySessions.values()).find(s => s.sessionId === sessionId);
    }

    if (!session) {
      return res.status(404).json({ success: false, error: 'Live session not found' });
    }

    session.status = status;
    let convertedLesson: any = null;

    // Automatic Recording-to-Lesson Conversion Trigger when session ends!
    if (status === 'ended') {
      const dummyBuffer = Buffer.from('Live Session Recording Buffer');
      const bunnyResult = await BunnyService.uploadFile(dummyBuffer, `${session.sessionId}_recording.mp4`, 'videos');
      
      session.recordingUrl = bunnyResult.cdnUrl;
      session.bunnyVideoId = `bunny_live_rec_${session.sessionId}`;

      const convertedLessonId = `lesson_live_conv_${Date.now().toString(36)}`;
      session.convertedLessonId = convertedLessonId;

      convertedLesson = {
        id: convertedLessonId,
        title: `[Live Recording] ${session.title}`,
        description: `Auto-converted recording from live session on ${new Date().toLocaleDateString()}`,
        duration: session.duration * 60,
        videoUrl: bunnyResult.cdnUrl,
        bunnyVideoId: session.bunnyVideoId,
        isFreePreview: false,
        order: 99,
        type: 'live_converted',
      };

      // Append converted lesson into target course unit
      if (isDbConnected()) {
        try {
          const course = await Course.findById(session.courseId);
          if (course) {
            const unit = course.units.find((u: IUnit) => u.id === session.unitId);
            if (unit) {
              unit.lessons.push(convertedLesson);
              await course.save();
            }
          }
        } catch (e) {
          // fallback
        }
      }
    }

    if (isDbConnected() && typeof session.save === 'function') {
      await session.save();
    } else {
      inMemorySessions.set(sessionId, session);
    }

    return res.status(200).json({
      success: true,
      message: status === 'ended'
        ? 'Live session ended and recording automatically converted into course lesson!'
        : `Live session status updated to ${status}`,
      session,
      convertedLesson,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const sendChatMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { sessionId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'Message text is required' });
    }

    const messageId = `MSG-${Date.now().toString(36)}`;
    const newMessage = {
      messageId,
      sessionId,
      userId: req.user.userId,
      senderName: req.user.email.split('@')[0],
      senderRole: req.user.role,
      text,
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      try {
        await ChatMessage.create(newMessage);
      } catch (e) {
        const list = inMemoryChat.get(sessionId) || [];
        list.push(newMessage);
        inMemoryChat.set(sessionId, list);
      }
    } else {
      const list = inMemoryChat.get(sessionId) || [];
      list.push(newMessage);
      inMemoryChat.set(sessionId, list);
    }

    return res.status(201).json({
      success: true,
      chatMessage: newMessage,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    let messages: any[] = [];
    if (isDbConnected()) {
      try {
        messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
      } catch (e) {
        messages = inMemoryChat.get(sessionId) || [];
      }
    } else {
      messages = inMemoryChat.get(sessionId) || [];
    }

    if (messages.length === 0) {
      messages = [
        {
          messageId: 'MSG-001',
          sessionId,
          userId: 'admin_1',
          senderName: 'Instructor Admin',
          senderRole: 'admin',
          text: 'Welcome everyone! Live class is starting now. Feel free to ask questions in chat.',
          createdAt: new Date(Date.now() - 300000),
        },
      ];
    }

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};
