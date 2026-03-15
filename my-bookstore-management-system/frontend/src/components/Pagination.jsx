import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex gap-2 justify-center mt-6">
      <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded border">Prev</button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded border ${p === page ? 'bg-indigo-600 text-white border-indigo-600' : ''}`}
        >
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border">Next</button>
    </div>
  );
}
