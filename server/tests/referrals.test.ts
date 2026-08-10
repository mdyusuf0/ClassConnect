import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Referral Program & CMS Settings (/api/referrals)', () => {
  const app = createApp();

  let studentToken = '';
  let adminToken = '';
  let createdRequestId = '';
  const testCourseId = 'course_web_dev_101';

  it('should register student and admin users', async () => {
    const studentRes = await request(app).post('/api/auth/register').send({
      name: 'Referral Student',
      email: `ref.student.${Date.now()}@example.com`,
      password: 'password123',
    });
    expect(studentRes.status).toBe(201);
    studentToken = studentRes.body.accessToken;

    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Referral Admin',
      email: `ref.admin.${Date.now()}@example.com`,
      password: 'adminpassword123',
      role: 'admin',
    });
    expect(adminRes.status).toBe(201);
    adminToken = adminRes.body.accessToken;
  });

  it('should return unique referral code, shareable link, and wallet balance for student', async () => {
    const res = await request(app)
      .get('/api/referrals/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.referralCode).toContain('REF-');
    expect(res.body.shareableLink).toContain('?ref=');
    expect(res.body.wallet.totalEarned).toBeDefined();
  });

  it('should allow admin to configure course referral commission settings', async () => {
    const res = await request(app)
      .put(`/api/admin/referrals/settings/${testCourseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        referralsEnabled: true,
        commissionType: 'percentage',
        commissionValue: 20, // 20% commission
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.setting.commissionValue).toBe(20);
  });

  it('should allow student to submit a payout request', async () => {
    const res = await request(app)
      .post('/api/referrals/payout-request')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        amount: 14.85,
        paymentDetails: 'PayPal: ref.student@example.com',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.payoutRequest.requestId).toBeDefined();
    createdRequestId = res.body.payoutRequest.requestId;
  });

  it('should allow admin to list all payout requests', async () => {
    const res = await request(app)
      .get('/api/admin/referrals/payouts')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.payoutRequests)).toBe(true);
  });

  it('should allow admin to approve a payout request', async () => {
    const res = await request(app)
      .post(`/api/admin/referrals/payouts/${createdRequestId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'approved',
        adminNotes: 'Payout processed via PayPal batch transfer',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.payoutRequest.status).toBe('approved');
  });
});
