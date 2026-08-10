import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Courses, Units & CMS API (/api/v1/courses)', () => {
  const app = createApp();

  let adminToken = '';
  let createdCourseId = '';
  let createdUnitId = '';

  it('should register an admin to perform CMS operations', async () => {
    const adminRes = await request(app).post('/api/v1/auth/register').send({
      name: 'CMS Admin',
      email: `cms.admin.${Date.now()}@example.com`,
      password: 'adminpassword123',
      role: 'admin',
    });
    expect(adminRes.status).toBe(201);
    adminToken = adminRes.body.accessToken;
  });

  it('should allow admin to create a new course', async () => {
    const coursePayload = {
      title: 'DevOps & Cloud Architecture',
      description: 'Master Docker, Kubernetes, AWS, and CI/CD pipelines.',
      thumbnail: 'https://classconnect.b-cdn.net/thumbnails/devops.jpg',
      price: 199,
      category: 'Web Development',
      level: 'Advanced',
      isPublished: true,
    };

    const res = await request(app)
      .post('/api/v1/admin/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(coursePayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.course.title).toBe(coursePayload.title);
    createdCourseId = String(res.body.course._id || res.body.course.id);
  });

  it('should allow admin to add a unit to the course', async () => {
    const unitPayload = {
      title: 'Unit 1: Docker Containers Fundamentals',
      description: 'Containerization, Dockerfile syntax, and volumes',
    };

    const res = await request(app)
      .post(`/api/v1/admin/courses/${createdCourseId}/units`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(unitPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.unit.title).toBe(unitPayload.title);
    createdUnitId = res.body.unit.id;
  });

  it('should allow admin to add a video lesson to the unit', async () => {
    const lessonPayload = {
      title: 'Lesson 1.1: What is Containerization?',
      description: 'Intro to container isolation and image layers',
      duration: 450,
      videoUrl: 'https://classconnect.b-cdn.net/videos/docker_101.mp4',
      isFreePreview: true,
    };

    const res = await request(app)
      .post(`/api/v1/admin/courses/${createdCourseId}/units/${createdUnitId}/lessons`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(lessonPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.lesson.isFreePreview).toBe(true);
  });

  it('should return public catalog with search and category filtering', async () => {
    const res = await request(app).get('/api/v1/courses?category=Web Development');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.courses)).toBe(true);
  });

  it('should return public course detail with free preview lesson accessible', async () => {
    const res = await request(app).get(`/api/v1/courses/${createdCourseId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.course).toBeDefined();
  });
});
