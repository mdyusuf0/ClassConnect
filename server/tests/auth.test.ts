import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Authentication & Roles API (/api/auth)', () => {
  const app = createApp();
  const testStudent = {
    name: 'Samir Student',
    email: 'samir.student@example.com',
    password: 'password123',
    courseId: 'course_web_dev_101',
    paymentMethod: 'stripe_stub',
  };

  const testAdmin = {
    name: 'System Admin',
    email: 'admin.system@example.com',
    password: 'adminpassword123',
    role: 'admin',
  };

  let studentToken = '';
  let adminToken = '';

  it('should register a new student with selected course and payment stub', async () => {
    const res = await request(app).post('/api/auth/register').send(testStudent);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.role).toBe('student');
    expect(res.body.user.enrolledCourses).toContain('course_web_dev_101');
    expect(res.body.paymentStatus).toBe('STUB_COMPLETED');
    studentToken = res.body.accessToken;
  });

  it('should register an admin user', async () => {
    const res = await request(app).post('/api/auth/register').send(testAdmin);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('admin');
    adminToken = res.body.accessToken;
  });

  it('should log in student with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testStudent.email,
      password: testStudent.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testStudent.email.toLowerCase());
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testStudent.email,
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin token to access admin-only endpoint', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard-stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should forbid student token from accessing admin-only endpoint', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard-stats')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
