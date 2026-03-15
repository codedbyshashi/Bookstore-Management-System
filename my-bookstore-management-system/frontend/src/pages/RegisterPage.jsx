import React, { useState } from 'react';
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
  FiUserPlus,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('ROLE_USER');
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register({ name: name.trim(), email: email.trim(), password, role });
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data || err?.response?.data?.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white/60 bg-white/75 shadow-2xl backdrop-blur-xl">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-indigo-200/45 blur-3xl" />
      <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-cyan-100/35 blur-3xl" />

      <div className="relative grid lg:grid-cols-[1fr_1.02fr]">
        <section className="border-b border-white/60 p-8 lg:border-b-0 lg:border-r lg:border-r-white/60 lg:p-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-glow">
            <FiBookOpen size={24} />
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.28em] text-indigo-500">Create Account</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-950">
            Join a bookstore experience that feels premium from the start
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            Build your customer account with a cleaner layout, softer background, and clearer form guidance. Admins can also create admin accounts from here when signed in.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <FiUserPlus size={22} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Simple onboarding</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Clear labels, friendly spacing, and better feedback make the form easier to trust and complete.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <FiCheckCircle size={22} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Protected account flow</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The page keeps sensitive data inside the form only and uses stronger visual cues throughout the experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-8 lg:p-10">
          <div className="rounded-[32px] border border-white/70 bg-white/90 p-7 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-sm">
                <FiUserPlus size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">New Profile</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-slate-950">Register</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fill in your details to create an account and start browsing the bookstore.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-glow">
                  <FiUser className="text-slate-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address</span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-glow">
                  <FiMail className="text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-glow">
                  <FiLock className="text-slate-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </label>

              {user?.role === 'ROLE_ADMIN' ? (
                <div>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Account Role</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setRole('ROLE_USER')}
                      className={`rounded-2xl border p-4 text-left transition ${
                        role === 'ROLE_USER'
                          ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FiUser size={18} />
                        <span className="font-semibold">User</span>
                      </div>
                      <p className="mt-2 text-sm">Standard account for shopping, orders, and browsing.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('ROLE_ADMIN')}
                      className={`rounded-2xl border p-4 text-left transition ${
                        role === 'ROLE_ADMIN'
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FiShield size={18} />
                        <span className="font-semibold">Admin</span>
                      </div>
                      <p className="mt-2 text-sm">Elevated access for store operations and management tools.</p>
                    </button>
                  </div>
                </div>
              ) : (
                <input type="hidden" value={role} />
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-3 font-semibold text-white shadow-glow hover:-translate-y-0.5"
              >
                <FiUserPlus size={18} />
                Register
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700">
                Login here
                <FiArrowRight size={14} />
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
