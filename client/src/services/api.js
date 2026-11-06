import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(customMessage));
  }
);

export const invoiceApi = {
  // Invoices CRUD
  getAll: (params) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  
  // Payment Recording
  recordPayment: (id, paymentData) => api.post(`/invoices/${id}/payments`, paymentData),
  
  // Dashboard Metrics & Overdue Priority
  getSummary: () => api.get('/dashboard/summary'),
  getPriorityOverdue: () => api.get('/invoices/overdue/priority'),

  // Seeder utility
  seedData: () => api.post('/invoices/seed'),
};

export default api;

