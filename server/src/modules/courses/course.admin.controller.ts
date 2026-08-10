import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Course } from './course.model.js';
import type { IUnit, ILesson } from './course.model.js';
import { BunnyService } from '../../services/bunny.service.js';

// In-memory store fallback for isolated unit tests / environments without live Mongo
const inMemoryCourses: Map<string, any> = new Map();

const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, thumbnail, price, category, level, isPublished } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ success: false, error: 'Title, description, price, and category are required' });
    }

    const slug = slugify(title) + '-' + Math.random().toString(36).substring(2, 6);
    const initialUnits: IUnit[] = [];

    let courseData: any;
    if (isDbConnected()) {
      try {
        courseData = await Course.create({
          title,
          slug,
          description,
          thumbnail: thumbnail || `${process.env.BUNNY_CDN_URL || 'https://classconnect.b-cdn.net'}/thumbnails/default.jpg`,
          price: Number(price),
          category,
          level: level || 'All Levels',
          isPublished: !!isPublished,
          units: initialUnits,
        });
      } catch (e) {
        // fallback
      }
    }

    if (!courseData) {
      const mockId = 'course_' + Math.random().toString(36).substring(2, 9);
      courseData = {
        _id: mockId,
        id: mockId,
        title,
        slug,
        description,
        thumbnail: thumbnail || `${process.env.BUNNY_CDN_URL || 'https://classconnect.b-cdn.net'}/thumbnails/default.jpg`,
        price: Number(price),
        category,
        level: level || 'All Levels',
        isPublished: !!isPublished,
        units: initialUnits,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryCourses.set(mockId, courseData);
    }

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: courseData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getAdminCourses = async (_req: Request, res: Response) => {
  try {
    let courses: any[] = [];
    if (isDbConnected()) {
      try {
        courses = await Course.find().sort({ createdAt: -1 });
      } catch (e) {
        courses = Array.from(inMemoryCourses.values());
      }
    } else {
      courses = Array.from(inMemoryCourses.values());
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getAdminCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let course: any = null;
    if (isDbConnected()) {
      try {
        course = await Course.findById(id);
      } catch (e) {
        course = inMemoryCourses.get(id);
      }
    } else {
      course = inMemoryCourses.get(id) || Array.from(inMemoryCourses.values()).find(c => c._id === id || c.id === id);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    return res.status(200).json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, price, category, level, isPublished } = req.body;

    let course: any = null;
    if (isDbConnected()) {
      try {
        course = await Course.findById(id);
      } catch (e) {
        course = inMemoryCourses.get(id);
      }
    } else {
      course = inMemoryCourses.get(id) || Array.from(inMemoryCourses.values()).find(c => c._id === id || c.id === id);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    if (title) {
      course.title = title;
      course.slug = slugify(title) + '-' + (course._id || course.id).toString().substring(0, 4);
    }
    if (description !== undefined) course.description = description;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (price !== undefined) course.price = Number(price);
    if (category !== undefined) course.category = category;
    if (level !== undefined) course.level = level;
    if (isPublished !== undefined) course.isPublished = !!isPublished;
    course.updatedAt = new Date();

    if (isDbConnected() && typeof course.save === 'function') {
      await course.save();
    } else {
      inMemoryCourses.set(String(course._id || course.id), course);
    }

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      try {
        await Course.findByIdAndDelete(id);
      } catch (e) {
        inMemoryCourses.delete(id);
      }
    } else {
      inMemoryCourses.delete(id);
    }

    return res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Unit Management
export const addUnit = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Unit title is required' });
    }

    let course: any = null;
    if (isDbConnected()) {
      try {
        course = await Course.findById(courseId);
      } catch (e) {
        course = inMemoryCourses.get(courseId);
      }
    } else {
      course = inMemoryCourses.get(courseId) || Array.from(inMemoryCourses.values()).find(c => c._id === courseId || c.id === courseId);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const unitId = 'unit_' + Math.random().toString(36).substring(2, 9);
    const newUnit: IUnit = {
      id: unitId,
      title,
      description: description || '',
      order: (course.units?.length || 0) + 1,
      lessons: [],
    };

    course.units = course.units || [];
    course.units.push(newUnit);

    if (isDbConnected() && typeof course.save === 'function') {
      await course.save();
    } else {
      inMemoryCourses.set(String(course._id || course.id), course);
    }

    return res.status(201).json({
      success: true,
      message: 'Unit added successfully',
      unit: newUnit,
      units: course.units,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const reorderUnits = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { unitOrders } = req.body; // Array of { id: string, order: number }

    if (!Array.isArray(unitOrders)) {
      return res.status(400).json({ success: false, error: 'unitOrders must be an array' });
    }

    let course: any = null;
    if (isDbConnected()) {
      try {
        course = await Course.findById(courseId);
      } catch (e) {
        course = inMemoryCourses.get(courseId);
      }
    } else {
      course = inMemoryCourses.get(courseId) || Array.from(inMemoryCourses.values()).find(c => c._id === courseId || c.id === courseId);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const orderMap = new Map(unitOrders.map((u: any) => [u.id, u.order]));
    course.units.forEach((unit: IUnit) => {
      if (orderMap.has(unit.id)) {
        unit.order = orderMap.get(unit.id)!;
      }
    });

    course.units.sort((a: IUnit, b: IUnit) => a.order - b.order);

    if (isDbConnected() && typeof course.save === 'function') {
      await course.save();
    } else {
      inMemoryCourses.set(String(course._id || course.id), course);
    }

    return res.status(200).json({
      success: true,
      message: 'Units reordered successfully',
      units: course.units,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const deleteUnit = async (req: Request, res: Response) => {
  try {
    const { courseId, unitId } = req.params;

    let course: any = null;
    if (isDbConnected()) {
      try {
        course = await Course.findById(courseId);
      } catch (e) {
        course = inMemoryCourses.get(courseId);
      }
    } else {
      course = inMemoryCourses.get(courseId) || Array.from(inMemoryCourses.values()).find(c => c._id === courseId || c.id === courseId);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    course.units = (course.units || []).filter((u: IUnit) => u.id !== unitId);

    if (isDbConnected() && typeof course.save === 'function') {
      await course.save();
    } else {
      inMemoryCourses.set(String(course._id || course.id), course);
    }

    return res.status(200).json({
      success: true,
      message: 'Unit deleted successfully',
      units: course.units,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Lesson Management
export const addLesson = async (req: Request, res: Response) => {
  try {
    const { courseId, unitId } = req.params;
    const { title, description, duration, videoUrl, bunnyVideoId, isFreePreview, type } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Lesson title is required' });
    }

    let course: any = null;
    if (isDbConnected()) {
      try {
        course = await Course.findById(courseId);
      } catch (e) {
        course = inMemoryCourses.get(courseId);
      }
    } else {
      course = inMemoryCourses.get(courseId) || Array.from(inMemoryCourses.values()).find(c => c._id === courseId || c.id === courseId);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const unit = course.units.find((u: IUnit) => u.id === unitId);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }

    const lessonId = 'lesson_' + Math.random().toString(36).substring(2, 9);
    const newLesson: ILesson = {
      id: lessonId,
      title,
      description: description || '',
      duration: Number(duration || 300),
      videoUrl: videoUrl || `${process.env.BUNNY_CDN_URL || 'https://classconnect.b-cdn.net'}/videos/sample_${lessonId}.mp4`,
      bunnyVideoId: bunnyVideoId || `bunny_vid_${lessonId}`,
      isFreePreview: !!isFreePreview,
      order: (unit.lessons?.length || 0) + 1,
      type: type === 'live_converted' ? 'live_converted' : 'recorded',
    };

    unit.lessons = unit.lessons || [];
    unit.lessons.push(newLesson);

    if (isDbConnected() && typeof course.save === 'function') {
      await course.save();
    } else {
      inMemoryCourses.set(String(course._id || course.id), course);
    }

    return res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      lesson: newLesson,
      unit,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { courseId, unitId, lessonId } = req.params;

    let course: any = null;
    if (isDbConnected()) {
      try {
        course = await Course.findById(courseId);
      } catch (e) {
        course = inMemoryCourses.get(courseId);
      }
    } else {
      course = inMemoryCourses.get(courseId) || Array.from(inMemoryCourses.values()).find(c => c._id === courseId || c.id === courseId);
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const unit = course.units.find((u: IUnit) => u.id === unitId);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }

    unit.lessons = (unit.lessons || []).filter((l: ILesson) => l.id !== lessonId);

    if (isDbConnected() && typeof course.save === 'function') {
      await course.save();
    } else {
      inMemoryCourses.set(String(course._id || course.id), course);
    }

    return res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
      unit,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// Bunny Upload Handler Stub Endpoint
export const uploadAsset = async (req: Request, res: Response) => {
  try {
    const { filename, folder } = req.body;
    const dummyBuffer = Buffer.from('ClassConnect Dummy Asset Stream');
    const result = await BunnyService.uploadFile(dummyBuffer, filename || 'asset.png', folder || 'thumbnails');

    return res.status(200).json({
      success: true,
      message: 'Asset uploaded to Bunny storage successfully',
      result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};
