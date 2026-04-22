import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error normalization
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const workspaceAPI = {
  getAll: (filters = {}) => api.get('/workspaces', { params: filters }),
  getById: (id) => api.get(`/workspaces/${id}`),
  report: (id, data) => api.post(`/workspaces/${id}/report`, data),
  negotiate: (id, data) => api.post(`/workspaces/${id}/negotiate`, data),
};

export const aiAPI = {
  match: (profile) => api.post('/ai/match', profile),
  meetup: () => api.get('/ai/meetup'),
  collab: (data) => api.post('/ai/collab', data),
};

export const checkinAPI = {
  getAll: (filters = {}) => api.get('/checkins', { params: filters }),
  checkin: (data) => api.post('/checkins', data),
  checkout: (userId) => api.delete(`/checkins/${userId}`),
  updateStatus: (userId, data) => api.patch(`/checkins/${userId}`, data),
};

export const meetupAPI = {
  getAll: () => api.get('/meetups'),
  rsvp: (id) => api.post(`/meetups/${id}/rsvp`),
  create: (data) => api.post('/meetups', data),
};

export const userAPI = {
  getAll: (filters = {}) => api.get('/users', { params: filters }),
  getById: (id) => api.get(`/users/${id}`),
};

export default api;
