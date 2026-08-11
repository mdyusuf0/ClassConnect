import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

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

  it('should reject registration with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Missing Fields User'
      // email and password missing
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject registration with a duplicate email', async () => {
    // Attempting to register another user with Samir's email
    const res = await request(app).post('/api/auth/register').send({
      name: 'Samir Duplicate',
      email: testStudent.email,
      password: 'newpassword123'
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('already registered');
  });

  it('should get current user profile with a valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testStudent.email.toLowerCase());
  });

  it('should reject accessing profile without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject accessing profile with an invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_or_placeholder_token');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
