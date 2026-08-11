import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Payments & Enrollments API (/api/payments)', () => {
  const app = createApp();

  let studentToken = '';
  let adminToken = '';
  let createdTransactionId = '';
  const testCourseId = 'course_web_dev_101';

  it('should register student and admin users', async () => {
    const studentRes = await request(app).post('/api/auth/register').send({
      name: 'Payment Student',
      email: `pay.student.${Date.now()}@example.com`,
      password: 'password123',
    });
    expect(studentRes.status).toBe(201);
    studentToken = studentRes.body.accessToken;

    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Payment Admin',
      email: `pay.admin.${Date.now()}@example.com`,
      password: 'adminpassword123',
      role: 'admin',
    });
    expect(adminRes.status).toBe(201);
    adminToken = adminRes.body.accessToken;
  });

  it('should create Stripe payment order with referral code capture', async () => {
    const res = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        courseId: testCourseId,
        gateway: 'stripe',
        referralCode: 'REF-SUMMER2026',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order.gateway).toBe('stripe');
    expect(res.body.order.transactionId).toBeDefined();
    createdTransactionId = res.body.order.transactionId;
  });

  it('should confirm payment via webhook/callback and trigger course enrollment', async () => {
    const res = await request(app)
      .post('/api/payments/confirm')
      .send({
        transactionId: createdTransactionId,
        gatewayPaymentId: 'pay_stripe_mock_123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.enrollment.status).toBe('ENROLLED');
  });

  it('should create Razorpay payment order', async () => {
    const res = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        courseId: testCourseId,
        gateway: 'razorpay',
      });

    expect(res.status).toBe(201);
    expect(res.body.order.gateway).toBe('razorpay');
  });

  it('should allow admin to list all transactions', async () => {
    const res = await request(app)
      .get('/api/admin/payments')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.payments)).toBe(true);
  });

  it('should allow admin to issue a refund for a transaction', async () => {
    const res = await request(app)
      .post(`/api/admin/payments/${createdTransactionId}/refund`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Student requested cancellation within 14-day window' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.payment.status).toBe('refunded');
  });
});
