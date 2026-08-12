import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Live Classes with Chat & Auto-Recording (/api/live)', () => {
  const app = createApp();

  let adminToken = '';
  let studentToken = '';
  let createdSessionId = '';
  const testCourseId = 'course_web_dev_101';
  const testUnitId = 'unit_web_1';

  it('should register admin and student users', async () => {
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Live Admin Host',
      email: `live.admin.${Date.now()}@example.com`,
      password: 'adminpassword123',
      role: 'admin',
    });
    expect(adminRes.status).toBe(201);
    adminToken = adminRes.body.accessToken;

    const studentRes = await request(app).post('/api/auth/register').send({
      name: 'Live Student Participant',
      email: `live.student.${Date.now()}@example.com`,
      password: 'password123',
    });
    expect(studentRes.status).toBe(201);
    studentToken = studentRes.body.accessToken;
  });

  it('should allow admin to schedule a live class tied to course and unit', async () => {
    const res = await request(app)
      .post('/api/admin/live/schedule')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        courseId: testCourseId,
        unitId: testUnitId,
        title: 'Live Q&A: Advanced React & State Management',
        description: 'Live interactive coding and architecture discussion',
        scheduledAt: new Date(Date.now() + 3600 * 1000),
        duration: 45,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.session.sessionId).toBeDefined();
    expect(res.body.session.status).toBe('scheduled');
    createdSessionId = res.body.session.sessionId;
  });

  it('should allow enrolled student to view upcoming live classes for course', async () => {
    const res = await request(app)
      .get(`/api/live/courses/${testCourseId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.sessions)).toBe(true);
  });

  it('should allow admin to start the live class session', async () => {
    const res = await request(app)
      .put(`/api/admin/live/sessions/${createdSessionId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'live' });

    expect(res.status).toBe(200);
    expect(res.body.session.status).toBe('live');
  });

  it('should allow student and admin to participate in live chat', async () => {
    const res = await request(app)
      .post(`/api/live/sessions/${createdSessionId}/chat`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ text: 'Hello instructor! Is Server Components covered today?' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.chatMessage.text).toBe('Hello instructor! Is Server Components covered today?');
  });

  it('should automatically upload recording to Bunny and convert into a recorded course lesson when live session ends', async () => {
    const res = await request(app)
      .put(`/api/admin/live/sessions/${createdSessionId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'ended' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.session.status).toBe('ended');
    expect(res.body.session.recordingUrl).toBeDefined();
    expect(res.body.convertedLesson).toBeDefined();
    expect(res.body.convertedLesson.type).toBe('live_converted');
  });
});
