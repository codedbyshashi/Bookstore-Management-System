import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiBook, FiChevronLeft, FiChevronRight, FiHome, FiShoppingCart } from 'react-icons/fi';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/admin/books', label: 'Books', icon: FiBook },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
];

export default function Sidebar({ desktopOpen, mobileOpen, onDesktopToggle, onMobileClose }) {
  const isExpanded = mobileOpen || desktopOpen;

  return (
    <aside
      className={`fixed inset-y-4 left-4 z-40 h-[calc(100vh-2rem)] w-72 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl transition-all duration-300 md:sticky md:top-0 md:z-auto md:h-fit md:shrink-0 md:self-start md:translate-x-0 md:shadow-sm ${
        mobileOpen ? 'translate-x-0' : '-translate-x-[120%]'
      } ${
        desktopOpen ? 'md:w-72' : 'md:w-24'
      }`}
    >
      <div className="relative border-b border-slate-100 px-4 py-5">
        <button
          type="button"
          onClick={onMobileClose}
          aria-label="Close admin sidebar"
          className="absolute right-4 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-slate-950 to-indigo-600 text-white shadow-[0_14px_35px_rgba(30,41,59,0.28)] ring-4 ring-white/80 transition hover:-translate-y-0.5 hover:from-indigo-600 hover:to-cyan-500 md:hidden"
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={onDesktopToggle}
          aria-label={isExpanded ? 'Collapse admin sidebar' : 'Expand admin sidebar'}
          className="absolute right-0 top-5 z-20 hidden h-11 w-11 translate-x-1/2 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-slate-950 to-indigo-600 text-white shadow-[0_14px_35px_rgba(30,41,59,0.28)] ring-4 ring-white/85 transition hover:-translate-y-0.5 hover:from-indigo-600 hover:to-cyan-500 md:inline-flex"
        >
          {isExpanded ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
        <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
            AP
          </div>
          {isExpanded && (
            <div>
              <p className="text-lg font-bold text-slate-900">Admin Panel</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Manage Store</p>
            </div>
          )}
        </div>
      </div>
      <nav className="space-y-2 p-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `group flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isExpanded ? 'gap-3' : 'justify-center'
                } ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
              title={!isExpanded ? link.label : undefined}
            >
              <Icon className="shrink-0 text-lg" />
              {isExpanded && <span>{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
