import store from '../data/mockStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic fetch wrapper with automatic JWT token attachment and mockStore fallback
async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('classconnect_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`API call ${endpoint} failed, using local store fallback:`, error.message);
    return null;
  }
}

// ---- Auth API ----
export async function registerApi(userData) {
  const res = await fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (res && res.success) {
    if (res.accessToken) localStorage.setItem('classconnect_token', res.accessToken);
    return res.user;
  }
  // Fallback to local store
  return store.registerUser(userData);
}

export async function loginApi(email, password) {
  const res = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res && res.success) {
    if (res.accessToken) localStorage.setItem('classconnect_token', res.accessToken);
    return res.user;
  }
  // Fallback to local store
  return store.loginUser(email, password);
}

export async function getMeApi() {
  const res = await fetchApi('/auth/me');
  if (res && res.success) {
    return res.user;
  }
  return null;
}

// ---- Courses API ----
export async function getCoursesApi(category) {
  const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetchApi(`/courses${query}`);
  if (res && res.success && res.courses) {
    return res.courses;
  }
  return store.getCoursesByCategory(category);
}

export async function getCourseDetailApi(id) {
  const res = await fetchApi(`/courses/${id}`);
  if (res && res.success && res.course) {
    return res.course;
  }
  return store.getCourseById(id);
}

export async function createCourseApi(courseData) {
  const res = await fetchApi('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
  if (res && res.success) {
    return res.course;
  }
  return store.addCourse(courseData);
}

export async function deleteCourseApi(id) {
  const res = await fetchApi(`/admin/courses/${id}`, {
    method: 'DELETE',
  });
  if (res && res.success) {
    return true;
  }
  store.deleteCourse(id);
  return true;
}

// ---- Referrals & Payouts API ----
export async function getReferralDashboardApi() {
  const res = await fetchApi('/referrals/dashboard');
  if (res && res.success) {
    return res.referral;
  }
  return null;
}

export async function requestPayoutApi(amount) {
  const res = await fetchApi('/referrals/payout-request', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
  if (res && res.success) {
    return res.request;
  }
  return null;
}

export async function getAdminPayoutsApi() {
  const res = await fetchApi('/admin/referrals/payouts');
  if (res && res.success) {
    return res.payouts;
  }
  return store.getPayoutRequests();
}

export async function processAdminPayoutApi(payoutId, transactionId, action = 'approve') {
  const res = await fetchApi(`/admin/referrals/payouts/${payoutId}`, {
    method: 'POST',
    body: JSON.stringify({ action, transactionId }),
  });
  if (res && res.success) {
    return true;
  }
  if (action === 'approve') {
    store.approvePayout(payoutId, transactionId);
  } else {
    store.rejectPayout(payoutId);
  }
  return true;
}

// ---- Packages API ----
export function getPackagesApi() {
  return store.getPackages();
}

export default {
  registerApi,
  loginApi,
  getMeApi,
  getCoursesApi,
  getCourseDetailApi,
  createCourseApi,
  deleteCourseApi,
  getReferralDashboardApi,
  requestPayoutApi,
  getAdminPayoutsApi,
  processAdminPayoutApi,
  getPackagesApi,
};
