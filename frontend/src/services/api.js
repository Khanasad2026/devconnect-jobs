const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080/api'
  : (import.meta.env.VITE_API_BASE_URL || 'https://devconnect-backend.onrender.com/api');

// Helper to get auth token from localStorage
export const getAuthToken = () => localStorage.getItem('token');
export const getUserInfo = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Generic fetch wrapper with Bearer token authentication
async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = typeof data === 'string' ? data : (data?.message || 'An error occurred');
    throw new Error(errorMsg);
  }

  return data;
}

// Authentication APIs
export const authApi = {
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email, password, role, fullName) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, fullName }),
    }),
};

// Profile APIs
export const profileApi = {
  getProfile: (userId) => apiFetch(`/profiles/${userId}`),

  updateProfile: (userId, profileData) =>
    apiFetch(`/profiles?userId=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

// Job APIs
export const jobApi = {
  getAllJobs: () => apiFetch('/jobs'),

  getJobsByRole: (role) => apiFetch(`/jobs/role/${role}`),

  getJobById: (id) => apiFetch(`/jobs/${id}`),

  getRecommendations: (candidateId) =>
    apiFetch(`/jobs/recommendations?candidateId=${candidateId}`),

  createJob: (recruiterId, jobData) =>
    apiFetch(`/jobs?recruiterId=${recruiterId}`, {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),
};

// Application APIs
export const applicationApi = {
  applyToJob: (candidateId, applicationData) =>
    apiFetch(`/applications?candidateId=${candidateId}`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),

  getCandidateApplications: (candidateId) =>
    apiFetch(`/applications/candidate/${candidateId}`),

  getJobApplicants: (jobId, recruiterId) =>
    apiFetch(`/applications/job/${jobId}?recruiterId=${recruiterId}`),

  updateStatus: (applicationId, status, recruiterId) =>
    apiFetch(
      `/applications/${applicationId}/status?status=${status}&recruiterId=${recruiterId}`,
      { method: 'PUT' }
    ),
};

// AI Agent APIs
export const aiApi = {
  interact: (action, candidateId, jobId, userPrompt, apiKey) =>
    apiFetch('/ai/career-agent', {
      method: 'POST',
      body: JSON.stringify({ action, candidateId, jobId, userPrompt, apiKey }),
    }),
};

