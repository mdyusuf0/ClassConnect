import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Admin Analytics Dashboard & Notifications (/api/admin/analytics)', () => {
  const app = createApp();

  let adminToken = '';
  let studentToken = '';

  it('should register admin and student users', async () => {
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Analytics Admin',
      email: `analytics.admin.${Date.now()}@example.com`,
      password: 'adminpassword123',
      role: 'admin',
    });
    expect(adminRes.status).toBe(201);
    adminToken = adminRes.body.accessToken;

    const studentRes = await request(app).post('/api/auth/register').send({
      name: 'Analytics Student',
      email: `analytics.student.${Date.now()}@example.com`,
      password: 'password123',
    });
    expect(studentRes.status).toBe(201);
    studentToken = studentRes.body.accessToken;
  });

  it('should allow admin to view aggregated platform analytics & gateway breakdown', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analytics.totalRevenue).toBeDefined();
    expect(res.body.analytics.gatewayBreakdown.stripe).toBeDefined();
    expect(res.body.analytics.gatewayBreakdown.razorpay).toBeDefined();
    expect(Array.isArray(res.body.analytics.topCourses)).toBe(true);
  });

  it('should deny non-admin access to analytics dashboard', async () => {
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
  });

  it('should allow admin to view system notifications feed', async () => {
    const res = await request(app)
      .get('/api/admin/notifications')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.unreadCount).toBeDefined();
    expect(Array.isArray(res.body.notifications)).toBe(true);
  });

  it('should allow admin to mark notifications as read', async () => {
    const res = await request(app)
      .put('/api/admin/notifications/NOTIF-001/read')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
