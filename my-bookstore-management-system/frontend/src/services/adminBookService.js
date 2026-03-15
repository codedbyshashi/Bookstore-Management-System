import api from './api';

export const fetchBooks = (params = {}) => api.get('/api/books', { params });
export const fetchBookById = (id) => api.get(`/api/books/${id}`);
export const createBook = (payload) => api.post('/api/books', payload);
export const updateBook = (id, payload) => api.put(`/api/books/${id}`, payload);
export const deleteBook = (id) => api.delete(`/api/books/${id}`);
