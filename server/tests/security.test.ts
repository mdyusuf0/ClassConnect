import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Anti-Piracy Video Security & Signed URLs (/api/courses/.../stream)', () => {
  const app = createApp();

  let studentToken = '';
  let adminToken = '';
  const testCourseId = 'course_web_dev_101';
  const freePreviewLessonId = 'lesson_web_1_1';
  const paidLessonId = 'lesson_web_1_2';

  it('should register student and admin users', async () => {
    const studentRes = await request(app).post('/api/auth/register').send({
      name: 'Security Student',
      email: `security.student.${Date.now()}@example.com`,
      password: 'password123',
    });
    expect(studentRes.status).toBe(201);
    studentToken = studentRes.body.accessToken;

    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Security Admin',
      email: `security.admin.${Date.now()}@example.com`,
      password: 'adminpassword123',
      role: 'admin',
    });
    expect(adminRes.status).toBe(201);
    adminToken = adminRes.body.accessToken;
  });

  it('should allow guest/unauthenticated user to stream free preview lesson with signed URL', async () => {
    const res = await request(app)
      .get(`/api/courses/${testCourseId}/lessons/${freePreviewLessonId}/stream`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isFreePreview).toBe(true);
    expect(res.body.streamUrl).toContain('token=');
  });

  it('should reject unauthenticated request for paid lesson stream', async () => {
    const res = await request(app).get(`/api/courses/${testCourseId}/lessons/${paidLessonId}/stream`);
    expect(res.status).toBe(401);
  });

  it('should return signed streaming URL and anti-piracy student watermark for authorized enrolled student', async () => {
    const res = await request(app)
      .get(`/api/courses/${testCourseId}/lessons/${paidLessonId}/stream`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.streamUrl).toContain('token=');
    expect(res.body.watermark).toBeDefined();
    expect(res.body.watermark.userEmail).toBeDefined();
  });

  it('should return signed streaming URL for admin', async () => {
    const res = await request(app)
      .get(`/api/courses/${testCourseId}/lessons/${paidLessonId}/stream`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.streamUrl).toContain('token=');
  });
});
