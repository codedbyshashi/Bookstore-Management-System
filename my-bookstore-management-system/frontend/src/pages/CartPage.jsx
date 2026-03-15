import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateQuantity = (bookId, quantity) => {
    const adjusted = cart.map((item) => (item.book.id === bookId ? { ...item, quantity } : item));
    setCart(adjusted);
    localStorage.setItem('cart', JSON.stringify(adjusted));
  };

  const removeBook = (bookId) => {
    const filtered = cart.filter((item) => item.book.id !== bookId);
    setCart(filtered);
    localStorage.setItem('cart', JSON.stringify(filtered));
  };

  const total = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-slate-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(({ book, quantity }) => (
            <div key={book.id} className="flex gap-4 items-center border p-3 rounded-lg">
              <img src={book.imageUrl || '/assets/book-placeholder.jpg'} alt={book.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3>{book.title}</h3>
                <p className="text-sm text-slate-500">{book.author}</p>
              </div>
              <input type="number" min="1" value={quantity} onChange={(e) => updateQuantity(book.id, Number(e.target.value) || 1)} className="w-16 border rounded px-2" />
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(book.price * quantity)}</p>
                <button onClick={() => removeBook(book.id)} className="text-red-600 text-sm">Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl">Total: {formatCurrency(total)}</div>
          <button onClick={() => navigate('/checkout')} className="bg-indigo-600 text-white px-4 py-2 rounded">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}
