import React from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        <p className="mb-5 text-slate-600">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-slate-200">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-rose-600 text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}
