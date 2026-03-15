import React, { useEffect, useState } from 'react';
import {
  FiBookOpen,
  FiDollarSign,
  FiEdit3,
  FiFileText,
  FiHash,
  FiImage,
  FiPackage,
  FiSave,
  FiTag,
  FiUser,
  FiX,
} from 'react-icons/fi';

const emptyForm = {
  title: '',
  author: '',
  genre: '',
  isbn: '',
  price: '',
  stockQuantity: '',
  description: '',
  imageUrl: '',
};

const textFields = [
  { name: 'title', label: 'Book Title', placeholder: 'Enter book title', icon: FiBookOpen },
  { name: 'author', label: 'Author Name', placeholder: 'Enter author name', icon: FiUser },
  { name: 'genre', label: 'Genre', placeholder: 'Enter genre', icon: FiTag },
  { name: 'isbn', label: 'ISBN', placeholder: 'e.g. 9780143127741', icon: FiHash },
  { name: 'imageUrl', label: 'Cover Image URL', placeholder: 'Paste cover image link', icon: FiImage },
];

export default function BookFormModal({ book, isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (book) {
      setForm({
        ...emptyForm,
        ...book,
        price: book.price ?? '',
        stockQuantity: book.stockQuantity ?? '',
      });
      return;
    }

    setForm(emptyForm);
  }, [book]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      isbn: form.isbn.trim(),
      imageUrl: form.imageUrl.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-2xl">
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <FiEdit3 size={22} />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  {book ? 'Edit Book Details' : 'Add New Book'}
                </h3>
                <p className="mt-1 text-sm text-indigo-50">
                  Fill in the book information to keep your catalog clean and complete.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              onClick={onClose}
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <p className="font-semibold text-slate-900">ISBN</p>
              <p className="mt-1">A unique international identifier for a specific book edition.</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <p className="font-semibold text-slate-900">Price</p>
              <p className="mt-1">Set the selling price customers will see in the store.</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <p className="font-semibold text-slate-900">Stock</p>
              <p className="mt-1">Add the number of copies currently available for purchase.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            {textFields.map((field) => {
              const Icon = field.icon;

              return (
                <label key={field.name} className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-glow">
                    <Icon className="shrink-0 text-slate-400" size={18} />
                    <input
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full bg-transparent text-slate-900 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </label>
              );
            })}

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-700">Price</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-glow">
                <FiDollarSign className="shrink-0 text-slate-400" size={18} />
                <input
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full bg-transparent text-slate-900 placeholder:text-slate-400"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-700">Stock Quantity</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-glow">
                <FiPackage className="shrink-0 text-slate-400" size={18} />
                <input
                  name="stockQuantity"
                  type="number"
                  placeholder="Enter available copies"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  className="w-full bg-transparent text-slate-900 placeholder:text-slate-400"
                  min="0"
                  required
                />
              </div>
            </label>

            <label className="md:col-span-2 flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-700">Description</span>
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-glow">
                <FiFileText className="mt-1 shrink-0 text-slate-400" size={18} />
                <textarea
                  name="description"
                  placeholder="Write a short description of the book"
                  value={form.description}
                  onChange={handleChange}
                  className="min-h-[130px] w-full resize-none bg-transparent text-slate-900 placeholder:text-slate-400"
                  rows="4"
                  required
                />
              </div>
            </label>

            <div className="md:col-span-2 mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-2.5 font-semibold text-white shadow-glow hover:-translate-y-0.5"
              >
                <FiSave size={16} />
                Save Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
