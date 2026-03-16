import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div
        className={`fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm transition md:hidden ${
          mobileSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />
      <div className="mx-auto flex max-w-[1600px] gap-6 lg:gap-8">
        <Sidebar
          desktopOpen={desktopSidebarOpen}
          mobileOpen={mobileSidebarOpen}
          onDesktopToggle={() => setDesktopSidebarOpen((open) => !open)}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <div className="min-w-0 flex-1 rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Control Center</p>
              <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            </div>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 md:hidden"
            >
              <FiChevronRight size={16} />
              Panel
            </button>
          </div>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
