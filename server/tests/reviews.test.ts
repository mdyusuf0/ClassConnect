import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Ratings & Reviews Moderation (/api/courses/:courseId/reviews)', () => {
  const app = createApp();

  let studentToken = '';
  let adminToken = '';
  let createdReviewId = '';
  const testCourseId = 'course_web_dev_101';

  it('should register student and admin users', async () => {
    const studentRes = await request(app).post('/api/auth/register').send({
      name: 'Review Student',
      email: `review.student.${Date.now()}@example.com`,
      password: 'password123',
    });
    expect(studentRes.status).toBe(201);
    studentToken = studentRes.body.accessToken;

    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Review Admin',
      email: `review.admin.${Date.now()}@example.com`,
      password: 'adminpassword123',
      role: 'admin',
    });
    expect(adminRes.status).toBe(201);
    adminToken = adminRes.body.accessToken;
  });

  it('should allow enrolled student to submit a rating and review (status: pending)', async () => {
    const res = await request(app)
      .post(`/api/courses/${testCourseId}/reviews`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        rating: 5,
        comment: 'Fantastic course! The live classes and certificate were super rewarding.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.review.status).toBe('pending');
    expect(res.body.review.reviewId).toBeDefined();
    createdReviewId = res.body.review.reviewId;
  });

  it('should update existing review when student submits again (single-review enforcement)', async () => {
    const res = await request(app)
      .post(`/api/courses/${testCourseId}/reviews`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        rating: 5,
        comment: 'Updated review: Absolute 5-star course! Everything is top notch.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.review.reviewId).toBe(createdReviewId);
    expect(res.body.review.comment).toContain('Updated review');
  });

  it('should allow admin to view review moderation queue', async () => {
    const res = await request(app)
      .get('/api/admin/reviews')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.reviews)).toBe(true);
  });

  it('should allow admin to approve a review for public display', async () => {
    const res = await request(app)
      .post(`/api/admin/reviews/${createdReviewId}/moderate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'approved' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.review.status).toBe('approved');
  });

  it('should display approved reviews and calculate average rating on public endpoint', async () => {
    const res = await request(app).get(`/api/courses/${testCourseId}/reviews`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.averageRating).toBeGreaterThanOrEqual(1);
    expect(res.body.totalReviews).toBeGreaterThan(0);
    expect(Array.isArray(res.body.reviews)).toBe(true);
  });
});
