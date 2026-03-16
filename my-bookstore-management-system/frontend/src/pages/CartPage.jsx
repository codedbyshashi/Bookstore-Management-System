import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/format';
import { useAuth } from '../hooks/useAuth';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  if (user?.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin/books" replace />;
  }

  const updateQuantity = (bookId, quantity) => {
    const adjusted = cart.map((item) => {
      if (item.book.id !== bookId) return item;

      const maxQuantity = Math.max(Number(item.book.stockQuantity || 0), 1);
      const safeQuantity = Math.min(Math.max(quantity, 1), maxQuantity);

      if (quantity > maxQuantity) {
        toast.error(`Only ${item.book.stockQuantity} copies of ${item.book.title} are available`);
      }

      return { ...item, quantity: safeQuantity };
    });

    setCart(adjusted);
    localStorage.setItem('cart', JSON.stringify(adjusted));
  };

  const removeBook = (bookId) => {
    const filtered = cart.filter((item) => item.book.id !== bookId);
    setCart(filtered);
    localStorage.setItem('cart', JSON.stringify(filtered));
  };

  const total = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const hasUnavailableItems = cart.some(
    (item) => Number(item.book.stockQuantity || 0) < item.quantity || Number(item.book.stockQuantity || 0) === 0,
  );

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-slate-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(({ book, quantity }) => (
            <div key={book.id} className="flex items-center gap-4 rounded-lg border p-3">
              <img
                src={book.imageUrl || '/assets/book-placeholder.jpg'}
                alt={book.title}
                className="h-20 w-20 rounded object-cover"
              />
              <div className="flex-1">
                <h3>{book.title}</h3>
                <p className="text-sm text-slate-500">{book.author}</p>
                <p className={`mt-1 text-xs font-medium ${book.stockQuantity > 0 ? 'text-slate-500' : 'text-rose-600'}`}>
                  {book.stockQuantity > 0 ? `${book.stockQuantity} left in stock` : 'Out of stock'}
                </p>
              </div>
              <input
                type="number"
                min="1"
                max={Math.max(Number(book.stockQuantity || 0), 1)}
                value={quantity}
                onChange={(e) => updateQuantity(book.id, Number(e.target.value) || 1)}
                className="w-16 rounded border px-2"
                disabled={!book.stockQuantity}
              />
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(book.price * quantity)}</p>
                <button onClick={() => removeBook(book.id)} className="text-sm text-red-600">
                  Remove
                </button>
              </div>
            </div>
          ))}

          {hasUnavailableItems && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              Some cart items are above available stock or out of stock. Adjust them before checkout.
            </div>
          )}

          <div className="text-right text-xl font-bold">Total: {formatCurrency(total)}</div>
          <button
            onClick={() => navigate('/checkout')}
            disabled={hasUnavailableItems}
            className="rounded bg-indigo-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
