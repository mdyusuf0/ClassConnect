import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('classconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getHealthCheck = async () => {
  const res = await api.get('/health');
  return res.data;
};

// Auth API
export const registerApi = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const loginApi = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const getMeApi = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const forgotPasswordApi = async (data) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};

export const resetPasswordApi = async (data) => {
  const res = await api.post('/auth/reset-password', data);
  return res.data;
};

// Public Courses API
export const getCoursesApi = async (params = {}) => {
  const res = await api.get('/courses', { params });
  return res.data;
};

export const getCourseDetailApi = async (slugOrId) => {
  const res = await api.get(`/courses/${slugOrId}`);
  return res.data;
};

// Admin CMS Courses API
export const getAdminCoursesApi = async () => {
  const res = await api.get('/admin/courses');
  return res.data;
};

export const getAdminCourseByIdApi = async (id) => {
  const res = await api.get(`/admin/courses/${id}`);
  return res.data;
};

export const createCourseApi = async (courseData) => {
  const res = await api.post('/admin/courses', courseData);
  return res.data;
};

export const updateCourseApi = async (id, courseData) => {
  const res = await api.put(`/admin/courses/${id}`, courseData);
  return res.data;
};

export const deleteCourseApi = async (id) => {
  const res = await api.delete(`/admin/courses/${id}`);
  return res.data;
};

// Admin Unit & Lesson Management API
export const addUnitApi = async (courseId, unitData) => {
  const res = await api.post(`/admin/courses/${courseId}/units`, unitData);
  return res.data;
};

export const reorderUnitsApi = async (courseId, unitOrders) => {
  const res = await api.put(`/admin/courses/${courseId}/units/reorder`, { unitOrders });
  return res.data;
};

export const deleteUnitApi = async (courseId, unitId) => {
  const res = await api.delete(`/admin/courses/${courseId}/units/${unitId}`);
  return res.data;
};

export const addLessonApi = async (courseId, unitId, lessonData) => {
  const res = await api.post(`/admin/courses/${courseId}/units/${unitId}/lessons`, lessonData);
  return res.data;
};

export const deleteLessonApi = async (courseId, unitId, lessonId) => {
  const res = await api.delete(`/admin/courses/${courseId}/units/${unitId}/lessons/${lessonId}`);
  return res.data;
};

export const uploadBunnyAssetApi = async (assetData) => {
  const res = await api.post('/admin/courses/upload-asset', assetData);
  return res.data;
};

// Progress & Certificates API
export const getCourseProgressApi = async (courseId) => {
  const res = await api.get(`/progress/courses/${courseId}`);
  return res.data;
};

export const updateLessonProgressApi = async (progressData) => {
  const res = await api.post('/progress/update', progressData);
  return res.data;
};

export const downloadCertificateApi = async (certificateId) => {
  const res = await api.get(`/certificates/${certificateId}/download`, {
    responseType: 'blob',
  });
  return res.data;
};

// Payments & Admin Refunds API
export const createPaymentOrderApi = async (orderData) => {
  const res = await api.post('/payments/create-order', orderData);
  return res.data;
};

export const confirmPaymentApi = async (confirmData) => {
  const res = await api.post('/payments/confirm', confirmData);
  return res.data;
};

export const getAdminPaymentsApi = async () => {
  const res = await api.get('/admin/payments');
  return res.data;
};

export const issueRefundApi = async (transactionId, reasonData) => {
  const res = await api.post(`/admin/payments/${transactionId}/refund`, reasonData);
  return res.data;
};

// Referral Program & CMS Settings API
export const getReferralDashboardApi = async () => {
  const res = await api.get('/referrals/dashboard');
  return res.data;
};

export const requestPayoutApi = async (payoutData) => {
  const res = await api.post('/referrals/payout-request', payoutData);
  return res.data;
};

export const getAdminReferralSettingsApi = async (courseId) => {
  const res = await api.get(`/admin/referrals/settings/${courseId}`);
  return res.data;
};

export const updateAdminReferralSettingsApi = async (courseId, settingData) => {
  const res = await api.put(`/admin/referrals/settings/${courseId}`, settingData);
  return res.data;
};

export const getAdminPayoutsApi = async () => {
  const res = await api.get('/admin/referrals/payouts');
  return res.data;
};

export const processAdminPayoutApi = async (requestId, processData) => {
  const res = await api.post(`/admin/referrals/payouts/${requestId}`, processData);
  return res.data;
};

export default api;
