import api from './api';

export const getBooks = ({ page = 1, size = 8, search = '', genre = '' }) =>
  api.get('/api/books', { params: { page, size, search, genre } });

export const getBook = (id) => api.get(`/api/books/${id}`);
export const createBook = (book) => api.post('/api/books', book);
export const updateBook = (id, book) => api.put(`/api/books/${id}`, book);
export const removeBook = (id) => api.delete(`/api/books/${id}`);
