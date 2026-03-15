import api from './api';

export const getOrders = (params = {}) => api.get('/api/orders', { params });
export const getOrder = (id) => api.get(`/api/orders/${id}`);
export const placeOrder = (payload) => api.post('/api/orders', payload);
export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}/status`, { status });
