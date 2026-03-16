import api from './api';

export const fetchOrders = ({ page = 0, size = 10, status, paymentStatus } = {}) => {
  const params = { page, size };
  if (status) params.status = status;
  if (paymentStatus) params.paymentStatus = paymentStatus;
  return api.get('/api/orders', { params });
};

export const updateOrder = (id, payload) => api.put(`/api/orders/${id}`, payload);
