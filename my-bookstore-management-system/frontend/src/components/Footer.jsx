import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} Bookstore Management System. Built with React + Vite + Tailwind.
      </div>
    </footer>
  );
}
