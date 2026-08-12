const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Generic fetch wrapper with automatic JWT token attachment
async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('classconnect_token') || 
                localStorage.getItem('token') || 
                getCookie('classconnect_token') || 
                getCookie('token') || 
                getCookie('session');
                
  const hasToken = token && token !== 'null' && token !== 'undefined' && token !== '';
  const headers = {
    'Content-Type': 'application/json',
    ...(hasToken ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// ---- Auth API ----
export async function registerApi(userData) {
  const res = await fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (res && res.accessToken) {
    localStorage.setItem('classconnect_token', res.accessToken);
    if (res.user) {
      res.user.token = res.accessToken;
    }
  }
  return res.user;
}

export async function loginApi(email, password) {
  const res = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res && res.accessToken) {
    localStorage.setItem('classconnect_token', res.accessToken);
    if (res.user) {
      res.user.token = res.accessToken;
    }
  }
  return res.user;
}

export async function getMeApi() {
  const res = await fetchApi('/auth/me');
  return res.user;
}

export async function updateProfileApi(profileData) {
  const res = await fetchApi('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  return res.user;
}

// ---- Admin User Management API ----
export async function getAdminUsersApi() {
  const res = await fetchApi('/admin/users');
  return res.users;
}

export async function toggleUserSuspensionApi(userId, isSuspended) {
  const res = await fetchApi(`/admin/users/${userId}/suspend`, {
    method: 'PUT',
    body: JSON.stringify({ isSuspended }),
  });
  return res.success;
}

// ---- Courses API ----
export async function getCoursesApi(category) {
  const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetchApi(`/courses${query}`);
  return res.courses;
}

export async function getCourseDetailApi(id) {
  const res = await fetchApi(`/courses/${id}`);
  return res.course;
}

export async function createCourseApi(courseData) {
  const res = await fetchApi('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
  return res.course;
}

export async function updateCourseApi(id, courseData) {
  const res = await fetchApi(`/admin/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
  return res.course;
}

export async function deleteCourseApi(id) {
  const res = await fetchApi(`/admin/courses/${id}`, {
    method: 'DELETE',
  });
  return res.success;
}

// ---- Unit & Lesson Management API ----
export async function addUnitApi(courseId, unitData) {
  const res = await fetchApi(`/admin/courses/${courseId}/units`, {
    method: 'POST',
    body: JSON.stringify(unitData),
  });
  return res.units;
}

export async function updateUnitApi(courseId, unitId, unitData) {
  const res = await fetchApi(`/admin/courses/${courseId}/units/${unitId}`, {
    method: 'PUT',
    body: JSON.stringify(unitData),
  });
  return res.units;
}

export async function deleteUnitApi(courseId, unitId) {
  const res = await fetchApi(`/admin/courses/${courseId}/units/${unitId}`, {
    method: 'DELETE',
  });
  return res.units;
}

export async function addLessonApi(courseId, unitId, lessonData) {
  const res = await fetchApi(`/admin/courses/${courseId}/units/${unitId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(lessonData),
  });
  return res.unit;
}

export async function updateLessonApi(courseId, unitId, lessonId, lessonData) {
  const res = await fetchApi(`/admin/courses/${courseId}/units/${unitId}/lessons/${lessonId}`, {
    method: 'PUT',
    body: JSON.stringify(lessonData),
  });
  return res.unit;
}

export async function deleteLessonApi(courseId, unitId, lessonId) {
  const res = await fetchApi(`/admin/courses/${courseId}/units/${unitId}/lessons/${lessonId}`, {
    method: 'DELETE',
  });
  return res.unit;
}

export async function uploadAssetApi(file, filename, folder) {
  const res = await fetchApi('/admin/courses/upload-asset', {
    method: 'POST',
    body: JSON.stringify({ file, filename, folder }),
  });
  return res.result;
}

// ---- Packages API ----
export async function getPackagesApi() {
  const res = await fetchApi('/packages');
  return res.packages;
}

export async function createPackageApi(packageData) {
  const res = await fetchApi('/admin/packages', {
    method: 'POST',
    body: JSON.stringify(packageData),
  });
  return res.package;
}

export async function updatePackageApi(packageId, packageData) {
  const res = await fetchApi(`/admin/packages/${packageId}`, {
    method: 'PUT',
    body: JSON.stringify(packageData),
  });
  return res.package;
}

export async function deletePackageApi(packageId) {
  const res = await fetchApi(`/admin/packages/${packageId}`, {
    method: 'DELETE',
  });
  return res.success;
}

// ---- Referrals & Payouts API ----
export async function getReferralDashboardApi() {
  const res = await fetchApi('/referrals/dashboard');
  return res;
}

export async function requestPayoutApi(amount, paymentDetails) {
  const res = await fetchApi('/referrals/payout-request', {
    method: 'POST',
    body: JSON.stringify({ amount, paymentDetails }),
  });
  return res.payoutRequest;
}

export async function getAdminPayoutsApi() {
  const res = await fetchApi('/admin/referrals/payouts');
  return res.payoutRequests;
}

export async function processAdminPayoutApi(requestId, status, adminNotes = '') {
  const res = await fetchApi(`/admin/referrals/payouts/${requestId}`, {
    method: 'POST',
    body: JSON.stringify({ status, adminNotes }),
  });
  return res.success;
}

export async function getCourseReferralSettingsApi(courseId) {
  const res = await fetchApi(`/admin/referrals/settings/${courseId}`);
  return res.setting;
}

export async function updateCourseReferralSettingsApi(courseId, settingsData) {
  const res = await fetchApi(`/admin/referrals/settings/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  });
  return res.setting;
}

// ---- Reviews & Video Stories API ----
export async function getPublicCourseReviewsApi(courseId) {
  const res = await fetchApi(`/courses/${courseId}/reviews`);
  return res;
}

export async function submitOrUpdateReviewApi(courseId, rating, comment) {
  const res = await fetchApi(`/courses/${courseId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  });
  return res.review;
}

export async function getAdminReviewsApi() {
  const res = await fetchApi('/admin/reviews');
  return res.reviews;
}

export async function moderateReviewApi(reviewId, status) {
  const res = await fetchApi(`/admin/reviews/${reviewId}/moderate`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
  return res.success;
}

export async function getVideoStoriesApi() {
  const res = await fetchApi('/video-stories');
  return res.videoStories;
}

export async function createVideoStoryApi(storyData) {
  const res = await fetchApi('/admin/video-stories', {
    method: 'POST',
    body: JSON.stringify(storyData),
  });
  return res.videoStory;
}

export async function deleteVideoStoryApi(id) {
  const res = await fetchApi(`/admin/video-stories/${id}`, {
    method: 'DELETE',
  });
  return res.success;
}

// ---- Live Sessions API ----
export async function getAdminLiveClassesApi() {
  const res = await fetchApi('/admin/live/classes');
  return res.sessions;
}

export async function getStudentLiveClassesApi(courseId) {
  const res = await fetchApi(`/live/courses/${courseId}`);
  return res.sessions;
}

export async function scheduleLiveClassApi(classData) {
  const res = await fetchApi('/admin/live/schedule', {
    method: 'POST',
    body: JSON.stringify(classData),
  });
  return res.session;
}

export async function getLiveSessionDetailApi(sessionId) {
  const res = await fetchApi(`/live/sessions/${sessionId}`);
  return res;
}

export async function updateLiveStatusApi(sessionId, status) {
  const res = await fetchApi(`/admin/live/sessions/${sessionId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return res;
}

export async function toggleLiveChatApi(sessionId, chatEnabled) {
  const res = await fetchApi(`/admin/live/sessions/${sessionId}/chat-status`, {
    method: 'PUT',
    body: JSON.stringify({ chatEnabled }),
  });
  return res;
}

export async function getChatMessagesApi(sessionId) {
  const res = await fetchApi(`/live/sessions/${sessionId}/chat`);
  return res.messages;
}

export async function sendChatMessageApi(sessionId, text) {
  const res = await fetchApi(`/live/sessions/${sessionId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return res.chatMessage;
}

export async function deleteLiveChatMessageApi(sessionId, messageId) {
  const res = await fetchApi(`/admin/live/sessions/${sessionId}/chat/${messageId}`, {
    method: 'DELETE',
  });
  return res.success;
}

// ---- Analytics API ----
export async function getAdminAnalyticsApi() {
  const res = await fetchApi('/admin/analytics');
  return res.analytics;
}

export default {
  registerApi,
  loginApi,
  getMeApi,
  updateProfileApi,
  getAdminUsersApi,
  toggleUserSuspensionApi,
  getCoursesApi,
  getCourseDetailApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  addUnitApi,
  updateUnitApi,
  deleteUnitApi,
  addLessonApi,
  updateLessonApi,
  deleteLessonApi,
  getPackagesApi,
  createPackageApi,
  updatePackageApi,
  deletePackageApi,
  getReferralDashboardApi,
  requestPayoutApi,
  getAdminPayoutsApi,
  processAdminPayoutApi,
  getCourseReferralSettingsApi,
  updateCourseReferralSettingsApi,
  getPublicCourseReviewsApi,
  submitOrUpdateReviewApi,
  getAdminReviewsApi,
  moderateReviewApi,
  getVideoStoriesApi,
  createVideoStoryApi,
  deleteVideoStoryApi,
  getAdminLiveClassesApi,
  getStudentLiveClassesApi,
  scheduleLiveClassApi,
  getLiveSessionDetailApi,
  updateLiveStatusApi,
  toggleLiveChatApi,
  getChatMessagesApi,
  sendChatMessageApi,
  deleteLiveChatMessageApi,
  getAdminAnalyticsApi,
  uploadAssetApi,
};
