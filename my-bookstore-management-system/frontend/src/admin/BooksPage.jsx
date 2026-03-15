import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { fetchBooks, createBook, updateBook, deleteBook } from '../services/adminBookService';
import BookFormModal from './BookFormModal';
import ConfirmModal from './ConfirmModal';

const pageSizeOptions = [8, 10, 20, 50];

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await fetchBooks({ page: page - 1, size, search, genre });
      const body = res.data;
      const content = Array.isArray(body) ? body : body?.content || [];
      setBooks(content);
      setTotalPages(body?.totalPages ?? 1);
      setTotalItems(body?.totalElements ?? body?.totalItems ?? content.length);
    } catch (err) {
      console.error(err);
      setBooks([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [page, size, search, genre]);

  const genres = useMemo(() => [...new Set(books.map((b) => b.genre).filter(Boolean))], [books]);

  const paged = books;

  const openAdd = () => {
    setSelected(null);
    setIsOpen(true);
  };

  const openEdit = (book) => {
    setSelected(book);
    setIsOpen(true);
  };

  const submitBook = async (bookData) => {
    try {
      if (selected?.id) {
        await updateBook(selected.id, bookData);
      } else {
        await createBook(bookData);
      }
      setIsOpen(false);
      loadBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const requestDelete = (book) => {
    setToDelete(book);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteBook(toDelete.id);
      setConfirmOpen(false);
      setToDelete(null);
      loadBooks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold">Book Management</h2>
        <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded">+ Add Book</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search title" className="border rounded p-2" />
        <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }} className="border rounded p-2">
          <option value="">All genres</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <div className="text-slate-600">Total {totalItems} books</div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Page:</label>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={page}
            onChange={(e) => {
              const p = Number(e.target.value);
              if (p >= 1 && p <= totalPages) setPage(p);
            }}
            className="w-16 border rounded p-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Page size:</label>
          <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }} className="border rounded p-2">
            {pageSizeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg border">
        <table className="min-w-full text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-3 py-2">Image</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2">Genre</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="p-4 text-center">Loading...</td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan="7" className="p-4 text-center">No books found</td></tr>
            ) : paged.map((book) => (
              <tr key={book.id} className="border-b hover:bg-slate-50">
                <td className="p-2"><img src={book.imageUrl || 'https://via.placeholder.com/80'} alt={book.title} className="w-16 h-10 object-cover rounded" /></td>
                <td className="p-2">{book.title}</td>
                <td className="p-2">{book.author}</td>
                <td className="p-2">{book.genre}</td>
                <td className="p-2">${book.price.toFixed(2)}</td>
                <td className="p-2">{book.stockQuantity}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => openEdit(book)} className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs"><FiEdit /> Edit</button>
                  <button onClick={() => requestDelete(book)} className="flex items-center gap-1 px-2 py-1 bg-rose-600 text-white rounded text-xs"><FiTrash2 /> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <p>Page {page} / {totalPages}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded" disabled={page <= 1}>Prev</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded" disabled={page >= totalPages}>Next</button>
        </div>
      </div>

      <BookFormModal book={selected} isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={submitBook} />
      <ConfirmModal isOpen={confirmOpen} title="Delete Book" message={`Delete '${toDelete?.title}'?`} onConfirm={confirmDelete} onCancel={() => setConfirmOpen(false)} />
    </div>
  );
}
