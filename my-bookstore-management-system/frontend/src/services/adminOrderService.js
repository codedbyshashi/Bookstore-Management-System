import api from './api';

export const fetchOrders = ({ page = 0, size = 10, status } = {}) => {
  const params = { page, size };
  if (status) params.status = status;
  return api.get('/api/orders', { params });
};

export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}`, { orderStatus: status });
