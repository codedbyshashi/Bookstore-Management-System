import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, getBook, updateBook } from '../services/bookService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const initialState = { title: '', author: '', genre: '', isbn: '', price: '', description: '', stockQuantity: '', imageUrl: '' };

export default function AdminBookFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await getBook(id);
        setForm({ ...res.data, stockQuantity: res.data.stockQuantity || 0, price: res.data.price || 0 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      if (id) {
        await updateBook(id, form);
        toast.success('Book updated');
      } else {
        await createBook(form);
        toast.success('Book added');
      }
      navigate('/books');
    } catch (err) {
      toast.error('Submission failed');
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Book' : 'Add Book'}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {['title','author','genre','isbn','price','stockQuantity','imageUrl'].map((field) => (
          <input key={field} name={field} type={field === 'price' || field === 'stockQuantity' ? 'number' : 'text'} value={form[field]} onChange={handleChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="border rounded px-3 py-2" required />
        ))}
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border rounded px-3 py-2 h-24" required />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}
