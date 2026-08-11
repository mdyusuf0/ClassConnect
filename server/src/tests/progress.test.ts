import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Progress Tracking, Sequential Unit Unlock & Certificates (/api/progress)', () => {
  const app = createApp();

  let studentToken = '';
  const testCourseId = 'course_web_dev_101';
  let generatedCertId = '';

  it('should register student and obtain token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Progress Student',
      email: `progress.student.${Date.now()}@example.com`,
      password: 'password123',
      courseId: testCourseId,
    });
    expect(res.status).toBe(201);
    studentToken = res.body.accessToken;
  });

  it('should fetch initial course progress with Unit 1 unlocked by default', async () => {
    const res = await request(app)
      .get(`/api/progress/courses/${testCourseId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.progress.unitLockStatusMap['unit_web_1'].isUnlocked).toBe(true);
  });

  it('should update lesson progress for Unit 1 and calculate watched percentage', async () => {
    const res = await request(app)
      .post('/api/progress/update')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        courseId: testCourseId,
        unitId: 'unit_web_1',
        lessonId: 'lesson_web_1_1',
        watchedSeconds: 580,
        totalDuration: 600,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.progress.unitPercentage).toBeGreaterThanOrEqual(90);
  });

  it('should automatically unlock Unit 2 once Unit 1 reaches 90% completion', async () => {
    const res = await request(app)
      .get(`/api/progress/courses/${testCourseId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.progress.unitLockStatusMap['unit_web_2'].isUnlocked).toBe(true);
  });

  it('should automatically unlock certificate when overall course progress reaches 90%', async () => {
    // Complete unit 2 as well
    const updateRes = await request(app)
      .post('/api/progress/update')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        courseId: testCourseId,
        unitId: 'unit_web_2',
        lessonId: 'lesson_web_2_1',
        watchedSeconds: 880,
        totalDuration: 900,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.progress.overallCoursePercentage).toBeGreaterThanOrEqual(90);
    expect(updateRes.body.progress.isCertificateUnlocked).toBe(true);
    expect(updateRes.body.progress.certificateId).toBeDefined();

    generatedCertId = updateRes.body.progress.certificateId;
  });

  it('should download generated PDF certificate with valid PDF headers', async () => {
    const res = await request(app)
      .get(`/api/certificates/${generatedCertId}/download`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toContain('attachment');
  });
});
