import React, { useEffect, useState } from 'react';
import { FiCreditCard, FiFilter, FiPackage } from 'react-icons/fi';
import { fetchOrders, updateOrderStatus } from '../services/adminOrderService';
import { formatOrderStatus, formatPaymentMethod, formatPaymentStatus } from '../utils/payment';

const getOrderStatusClasses = (status) => {
  if (status === 'COMPLETED') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'CANCELLED') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
};

const getPaymentStatusClasses = (status) => {
  if (status === 'PAID') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'PAY_ON_DELIVERY') return 'bg-sky-50 text-sky-700 border-sky-200';
  if (status === 'PENDING_PAYMENT') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchOrders({ page, size, status: statusFilter });
      const body = res.data;
      const content = Array.isArray(body) ? body : body?.content || [];
      setOrders(content);
      setTotalPages(body?.totalPages ?? 1);
      setTotalItems(body?.totalElements ?? body?.totalItems ?? content.length);
    } catch (err) {
      console.error(err);
      setOrders([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, size, statusFilter]);

  const changeStatus = async (order, status) => {
    try {
      await updateOrderStatus(order.id, status);
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-glow">
              <FiPackage size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Operations</p>
              <h2 className="font-display text-2xl font-bold text-slate-950">Order Management</h2>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">Monitor payments, delivery state, and customer orders from one place.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <FiCreditCard size={16} />
            Total orders: <strong className="text-slate-900">{totalItems}</strong>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <FiFilter size={16} className="text-slate-500" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-sm text-slate-700">
              <option value="">All status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8 text-center shadow-sm">Loading orders...</div>
      ) : (
        <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong></div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <label>Page:</label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={page + 1}
                onChange={(e) => {
                  const requested = Number(e.target.value) - 1;
                  if (Number.isFinite(requested) && requested >= 0 && requested < totalPages) setPage(requested);
                }}
                className="w-16 rounded-lg border border-slate-200 px-2 py-1"
              />
              <label>Page size:</label>
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(0);
                }}
                className="rounded-lg border border-slate-200 px-2 py-1"
              >
                {[10, 20, 50].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-left">
              <thead className="bg-slate-100">
                <tr className="text-sm text-slate-700">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Books</th>
                  <th className="px-4 py-3 font-semibold">Order Status</th>
                  <th className="px-4 py-3 font-semibold">Payment Method</th>
                  <th className="px-4 py-3 font-semibold">Payment Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-slate-500">No orders found</td>
                  </tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100 align-top hover:bg-slate-50/70">
                    <td className="px-4 py-4 font-semibold text-slate-900">{order.id}</td>
                    <td className="px-4 py-4 text-slate-600">{order.userId}</td>
                    <td className="px-4 py-4 text-slate-600">{order.bookIds?.join(', ')}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusClasses(order.orderStatus)}`}>
                        {formatOrderStatus(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {formatPaymentMethod(order.paymentMethod, order.paymentStatus)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusClasses(order.paymentStatus)}`}>
                        {formatPaymentStatus(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => changeStatus(order, 'COMPLETED')}
                          className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Completed
                        </button>
                        <button
                          onClick={() => changeStatus(order, 'CANCELLED')}
                          className="rounded-full bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
                        >
                          Cancelled
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-slate-600">Page {page + 1} / {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50"
                disabled={page === 0}
              >
                Prev
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50"
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
