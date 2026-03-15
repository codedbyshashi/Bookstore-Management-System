import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCompass,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from 'react-icons/fi';
import { getBooks } from '../services/bookService';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const highlightCards = [
  {
    title: "Editor's Spotlight",
    description: 'Standout picks presented with stronger hierarchy so the homepage feels selected, not scattered.',
    icon: FiStar,
  },
  {
    title: 'Checkout Without Friction',
    description: 'Card, UPI, and cash-on-delivery flows that move quickly and feel easier to trust.',
    icon: FiShoppingBag,
  },
  {
    title: 'Orders You Can Read at a Glance',
    description: 'Payment method, delivery cues, and status chips that are clearer the moment you land on them.',
    icon: FiTruck,
  },
];

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await getBooks({ page: 0, size: 8 });
        setBooks(response.data.content || response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/92 shadow-2xl">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-cyan-50 to-transparent lg:block" />
        <div className="absolute -left-10 top-12 h-48 w-48 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute right-10 top-10 h-52 w-52 rounded-full bg-cyan-200/25 blur-3xl" />

        <div className="relative grid gap-8 px-6 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              <FiCompass size={16} />
              Your next favorite read starts here
            </div>

            <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Stories, skills, and ideas worth taking home
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Discover featured titles, jump into the full catalog, and explore a homepage shaped more like a modern bookstore window than a utility dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/books"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-3 font-semibold text-white shadow-glow hover:-translate-y-0.5"
              >
                Explore the collection
                <FiArrowRight size={18} />
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-700"
                >
                  Start your library
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {highlightCards.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold text-slate-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[38px] border border-white/70 bg-white/90 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-500">Shelf of the Week</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-slate-950">Books worth opening tonight</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              A calmer featured shelf with cleaner contrast, stronger cards, and safer image fallbacks for every title.
            </p>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-700"
          >
            Browse every title
            <FiArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </section>
    </div>
  );
}
