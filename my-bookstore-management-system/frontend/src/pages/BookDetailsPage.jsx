import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getBook } from '../services/bookService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/format';

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getBook(id);
        setBook(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleQuantityChange = (value) => {
    const requestedQuantity = Number(value);
    const maxQuantity = Math.max(Number(book?.stockQuantity || 0), 1);
    const safeQuantity = Number.isFinite(requestedQuantity)
      ? Math.min(Math.max(requestedQuantity, 1), maxQuantity)
      : 1;
    setQuantity(safeQuantity);
  };

  const addToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'ROLE_ADMIN') {
      toast.info('Admins can manage stock from the admin panel instead of placing customer orders');
      navigate('/admin/books');
      return;
    }

    if (!book.stockQuantity) {
      toast.error('This book is currently out of stock');
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find((item) => item.book.id === book.id);
    const nextQuantity = (existingItem?.quantity || 0) + quantity;

    if (nextQuantity > book.stockQuantity) {
      toast.error(`Only ${book.stockQuantity} copies of ${book.title} are available`);
      return;
    }

    const updated = [
      ...existingCart.filter((item) => item.book.id !== book.id),
      { book, quantity: nextQuantity },
    ];
    localStorage.setItem('cart', JSON.stringify(updated));
    toast.success(`${book.title} added to cart`);
    navigate('/cart');
  };

  if (loading || !book) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-xl">
      <div className="grid gap-4 md:grid-cols-3">
        <img
          className="h-80 w-full rounded object-cover"
          src={book.imageUrl || '/assets/book-placeholder.jpg'}
          alt={book.title}
        />
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="mb-3 text-slate-600">{book.author} | {book.genre}</p>
          <p className="mb-2 text-lg font-bold text-indigo-600">{formatCurrency(book.price)}</p>
          <p className={`mb-4 text-sm font-medium ${book.stockQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {book.stockQuantity > 0 ? `${book.stockQuantity} copies in stock` : 'Currently out of stock'}
          </p>
          <p className="mb-4">{book.description}</p>

          <div className="mb-4 flex items-center gap-2">
            <label className="font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              max={Math.max(Number(book.stockQuantity || 0), 1)}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-20 rounded border px-2 py-1"
              disabled={!book.stockQuantity || user?.role === 'ROLE_ADMIN'}
            />
          </div>

          {user?.role === 'ROLE_ADMIN' ? (
            <Link
              to="/admin/books"
              className="inline-flex rounded bg-slate-900 px-4 py-2 text-white transition hover:bg-indigo-700"
            >
              Manage in Admin
            </Link>
          ) : (
            <button
              onClick={addToCart}
              disabled={!book.stockQuantity}
              className="rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
