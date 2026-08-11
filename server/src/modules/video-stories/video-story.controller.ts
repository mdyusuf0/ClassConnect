import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { VideoStory } from './video-story.model.js';

const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

// In-memory fallback (empty by default)
const inMemoryStories: Map<string, any> = new Map();

export const getVideoStories = async (_req: Request, res: Response) => {
  try {
    let stories: any[] = [];
    if (isDbConnected()) {
      try {
        stories = await VideoStory.find().sort({ createdAt: -1 });
      } catch (e) {
        stories = Array.from(inMemoryStories.values());
      }
    } else {
      stories = Array.from(inMemoryStories.values());
    }
    return res.status(200).json({
      success: true,
      count: stories.length,
      videoStories: stories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const createVideoStory = async (req: Request, res: Response) => {
  try {
    const { name, role, courseTag, badge, avatar, thumbnail, videoUrl, quote, rating } = req.body;
    if (!name || !role || !courseTag || !videoUrl || !quote) {
      return res.status(400).json({ success: false, error: 'name, role, courseTag, videoUrl, and quote are required' });
    }

    const storyId = `VT-${Date.now().toString(36).toUpperCase()}`;
    const newStory = {
      id: storyId,
      name,
      role,
      courseTag,
      badge: badge || 'STUDENT STORY',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop',
      videoUrl,
      quote,
      rating: Number(rating || 5),
    };

    if (isDbConnected()) {
      try {
        await VideoStory.create(newStory);
      } catch (e) {
        inMemoryStories.set(storyId, newStory);
      }
    } else {
      inMemoryStories.set(storyId, newStory);
    }

    return res.status(201).json({
      success: true,
      message: 'Video story created successfully',
      videoStory: newStory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const deleteVideoStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      try {
        await VideoStory.findOneAndDelete({ id });
      } catch (e) {
        inMemoryStories.delete(id);
      }
    } else {
      inMemoryStories.delete(id);
    }
    return res.status(200).json({
      success: true,
      message: 'Video story deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};
