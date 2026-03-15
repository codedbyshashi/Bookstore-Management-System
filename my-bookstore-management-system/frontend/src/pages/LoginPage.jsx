import React, { useMemo, useState } from 'react';
import {
  FiArrowRight,
  FiLock,
  FiLogIn,
  FiMail,
  FiShield,
  FiStar,
  FiUser,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const roleCards = [
  {
    id: 'admin',
    label: 'Admin',
    title: 'Admin Login',
    icon: FiShield,
    description: 'Use the admin portal to manage books, orders, and store activity.',
    accent: 'from-indigo-600 via-violet-500 to-fuchsia-500',
    tint: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    button: 'bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500',
    mismatchMessage: 'This account does not have admin access. Please use an admin account.',
  },
  {
    id: 'user',
    label: 'User',
    title: 'User Login',
    icon: FiUser,
    description: 'Use the reader portal to browse books, manage your cart, and place orders.',
    accent: 'from-sky-500 via-cyan-500 to-emerald-400',
    tint: 'border-sky-200 bg-sky-50 text-sky-700',
    button: 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-400',
    mismatchMessage: 'This account is an admin account. Switch to Admin Login to continue.',
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('user');
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const activeRole = useMemo(
    () => roleCards.find((roleCard) => roleCard.id === selectedRole) || roleCards[1],
    [selectedRole],
  );

  const ActiveIcon = activeRole.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await login({ email: email.trim(), password });
      const isAdminAccount = resp?.data?.user?.role === 'ROLE_ADMIN';

      if (selectedRole === 'admin' && !isAdminAccount) {
        logout();
        setError(activeRole.mismatchMessage);
        return;
      }

      if (selectedRole === 'user' && isAdminAccount) {
        logout();
        setError(activeRole.mismatchMessage);
        return;
      }

      navigate(isAdminAccount ? '/admin/orders' : '/books');
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-[140%] rounded-full bg-indigo-200/55 blur-3xl" />
      <div className="absolute right-1/2 top-24 h-80 w-80 translate-x-[145%] rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-100/35 blur-3xl" />

      <div className="relative w-full max-w-xl rounded-[36px] border border-white/70 bg-white/82 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${activeRole.accent} text-white shadow-glow`}>
            <ActiveIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Account Access</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-950">{activeRole.title}</h1>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-600">
          {activeRole.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-2">
          {roleCards.map((roleCard) => {
            const Icon = roleCard.icon;
            const isActive = selectedRole === roleCard.id;

            return (
              <button
                key={roleCard.id}
                type="button"
                onClick={() => {
                  setSelectedRole(roleCard.id);
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-[20px] border px-4 py-3 text-sm font-semibold transition ${
                  isActive ? roleCard.tint : 'border-transparent bg-transparent text-slate-500 hover:bg-white'
                }`}
              >
                <Icon size={17} />
                {roleCard.label}
              </button>
            );
          })}
        </div>

        <div className={`mt-6 rounded-[28px] border p-4 ${activeRole.tint}`}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-current shadow-sm">
              <FiStar size={18} />
            </div>
            <div>
              <p className="font-semibold">{activeRole.title} is active</p>
              <p className="mt-1 text-sm">
                Sign in with the correct account type. If the selected portal does not match the account role, the app will stop the login and ask you to switch.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              {selectedRole === 'admin' ? 'Admin Email Address' : 'User Email Address'}
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-glow">
              <FiMail className="text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'admin' ? 'Enter admin email' : 'Enter user email'}
                required
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              {selectedRole === 'admin' ? 'Admin Password' : 'User Password'}
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-glow">
              <FiLock className="text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={selectedRole === 'admin' ? 'Enter admin password' : 'Enter user password'}
                required
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </label>

          <button
            type="submit"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white shadow-glow hover:-translate-y-0.5 ${activeRole.button}`}
          >
            <FiLogIn size={18} />
            {activeRole.title}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need an account?{' '}
          <Link to="/register" className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700">
            Create one here
            <FiArrowRight size={14} />
          </Link>
        </p>
      </div>
    </div>
  );
}
