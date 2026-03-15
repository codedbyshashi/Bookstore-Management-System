import React, { useMemo, useState } from 'react';
import { FiArrowRight, FiBookOpen, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function BookCard({ book, onDelete }) {
  const [imageFailed, setImageFailed] = useState(false);
  const genreLabel = useMemo(() => (book.genre || 'Featured').trim(), [book.genre]);
  const showCover = book.imageUrl && !imageFailed;

  return (
    <div className="group overflow-hidden rounded-[28px] border border-white/70 bg-white/92 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
      {showCover ? (
        <img
          src={book.imageUrl}
          alt={book.title}
          onError={() => setImageFailed(true)}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-56 w-full flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-sky-800 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
              {genreLabel}
            </span>
            <FiStar className="text-cyan-100" size={18} />
          </div>
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <FiBookOpen size={22} />
            </div>
            <p className="font-display text-2xl font-bold leading-tight">{book.title}</p>
            <p className="mt-2 text-sm text-slate-200">{book.author}</p>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            {genreLabel}
          </span>
          <span className="font-display text-xl font-bold text-slate-950">{formatCurrency(book.price)}</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-slate-950">{book.title}</h3>
        <p className="mt-2 text-sm text-slate-500">{book.author}</p>

        <div className="mt-5 flex justify-between items-center">
          <span className="text-sm text-slate-500">Open the details and see if this belongs on your shelf</span>
          <Link to={`/books/${book.id}`} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600">
            View
            <FiArrowRight size={16} />
          </Link>
        </div>
        {onDelete && (
          <div className="mt-3 flex gap-2">
            <button onClick={() => onDelete(book.id)} className="text-red-600 text-xs font-semibold hover:underline">Delete</button>
            <Link to={`/admin/books/${book.id}/edit`} className="text-blue-600 text-xs font-semibold hover:underline">Edit</Link>
          </div>
        )}
      </div>
    </div>
  );
}
