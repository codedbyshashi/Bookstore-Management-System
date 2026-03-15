import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiGrid, FiLogIn, FiLogOut, FiShoppingCart, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(count);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="group inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 text-white shadow-glow">
            <FiBookOpen size={20} />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Bookstore
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium text-slate-600">
          <Link to="/books" className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700">
            <FiBookOpen size={16} />
            Books
          </Link>
          {(user || cartCount > 0) && (
            <Link to="/cart" className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700">
              <FiShoppingCart size={16} />
              Cart
              {cartCount > 0 && (
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {user && (
            <Link to="/orders" className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700">
              <FiGrid size={16} />
              My Orders
            </Link>
          )}
          {user?.role === 'ROLE_ADMIN' && (
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700">
              <FiGrid size={16} />
              Admin
            </Link>
          )}
          {user?.role === 'ROLE_ADMIN' && (
            <Link to="/admin/books" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 px-4 py-2 text-white shadow-glow hover:-translate-y-0.5">
              <FiBookOpen size={16} />
              Book Mgmt
            </Link>
          )}
          {!user && (
            <>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700">
                <FiLogIn size={16} />
                Login
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-indigo-700 hover:bg-indigo-100">
                <FiUserPlus size={16} />
                Register
              </Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700">
              <FiLogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
