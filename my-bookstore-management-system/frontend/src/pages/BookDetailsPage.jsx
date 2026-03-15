import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBook } from '../services/bookService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

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

  const addToCart = () => {
    if (!user) {
      return navigate('/login');
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updated = [...existingCart.filter((item) => item.book.id !== book.id), { book, quantity }];
    localStorage.setItem('cart', JSON.stringify(updated));
    navigate('/cart');
  };

  if (loading || !book) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl p-6 shadow-xl">
      <div className="grid gap-4 md:grid-cols-3">
        <img className="w-full h-80 object-cover rounded" src={book.imageUrl || '/assets/book-placeholder.jpg'} alt={book.title} />
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-slate-600 mb-3">{book.author} • {book.genre}</p>
          <p className="text-lg font-bold text-indigo-600 mb-4">${book.price}</p>
          <p className="mb-4">{book.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <label className="font-medium">Quantity:</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-20 border rounded px-2 py-1" />
          </div>
          <button onClick={addToCart} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
