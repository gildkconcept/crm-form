import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ============ SERVICES ============

// Auth
export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
};

// Partenaires
export const partnerService = {
  getAll: (params) => api.get('/partenaires', { params }),
  getById: (id) => api.get(`/partenaires/${id}`),
  create: (data) => api.post('/partenaires/inscription', data),
  update: (id, data) => api.put(`/partenaires/${id}`, data),
  updateStatus: (id, statut) => api.patch(`/partenaires/${id}/statut`, { statut }),
  delete: (id) => api.delete(`/partenaires/${id}`),
  getNotes: (id) => api.get(`/partenaires/${id}/notes`),
  addNote: (id, contenu) => api.post(`/partenaires/${id}/notes`, { contenu }),
  getHistorique: (id) => api.get(`/partenaires/${id}/historique`),
};

// Statistiques
export const statsService = {
  getDashboard: () => api.get('/stats/dashboard'),
  getFormules: () => api.get('/stats/formules'),
  getTypes: () => api.get('/stats/types'),
  getPays: () => api.get('/stats/pays'),
  getStatuts: () => api.get('/stats/statuts'),
  getEvolution: () => api.get('/stats/evolution'),
};

// Administrateurs
export const adminService = {
  getAll: () => api.get('/admin'),
  getById: (id) => api.get(`/admin/${id}`),
  create: (data) => api.post('/auth/admins', data),
  update: (id, data) => api.put(`/admin/${id}`, data),
  toggle: (id) => api.patch(`/admin/${id}/toggle`),
  delete: (id) => api.delete(`/admin/${id}`),
  getProfile: () => api.get('/admin/profile/me'),
};