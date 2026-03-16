import React, { useEffect, useMemo, useState } from 'react';
import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiFilter,
  FiPackage,
  FiRefreshCw,
  FiTruck,
  FiXCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchOrders, updateOrder } from '../services/adminOrderService';
import { formatCurrency, formatDateTime } from '../utils/format';
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
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchOrders({ page, size, status: statusFilter, paymentStatus: paymentFilter });
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
  }, [page, size, statusFilter, paymentFilter]);

  const summary = useMemo(() => ({
    pending: orders.filter((order) => order.orderStatus === 'PENDING').length,
    completed: orders.filter((order) => order.orderStatus === 'COMPLETED').length,
    paymentDue: orders.filter((order) => ['PENDING_PAYMENT', 'PAY_ON_DELIVERY', 'UNPAID'].includes(order.paymentStatus)).length,
  }), [orders]);

  const handleUpdate = async (order, payload, successMessage) => {
    try {
      await updateOrder(order.id, payload);
      toast.success(successMessage);
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
            <p className="mt-3 text-sm text-slate-600">
              Review line items, totals, stock-sensitive cancellations, and payment state from one screen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <FiCreditCard size={16} />
              Total orders: <strong className="text-slate-900">{totalItems}</strong>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <FiClock size={16} />
              Pending: <strong className="text-slate-900">{summary.pending}</strong>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <FiCheckCircle size={16} />
              Payment due: <strong className="text-slate-900">{summary.paymentDue}</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <FiFilter size={16} className="text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="bg-transparent text-sm text-slate-700"
              >
                <option value="">All order status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <FiTruck size={16} className="text-slate-500" />
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setPage(0);
                }}
                className="bg-transparent text-sm text-slate-700"
              >
                <option value="">All payment status</option>
                <option value="PAID">Paid</option>
                <option value="PENDING_PAYMENT">Pending Payment</option>
                <option value="PAY_ON_DELIVERY">Pay on Delivery</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <label>Page size:</label>
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
              className="rounded-lg border border-slate-200 px-2 py-1"
            >
              {[6, 10, 20].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8 text-center shadow-sm">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white/92 p-8 text-center shadow-sm">
          No orders matched the current filters.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => {
              const paymentResetLabel = order.paymentMethod === 'CASH_ON_DELIVERY'
                ? 'Set COD Due'
                : 'Set Pending Payment';

              const paymentResetStatus = order.paymentMethod === 'CASH_ON_DELIVERY'
                ? 'PAY_ON_DELIVERY'
                : 'PENDING_PAYMENT';

              return (
                <div key={order.id} className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-sm">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-2xl font-bold text-slate-950">Order #{order.id}</p>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusClasses(order.orderStatus)}`}>
                          {formatOrderStatus(order.orderStatus)}
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusClasses(order.paymentStatus)}`}>
                          {formatPaymentStatus(order.paymentStatus)}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span>User #{order.userId}</span>
                        <span>Placed {formatDateTime(order.createdAt)}</span>
                        <span>Updated {formatDateTime(order.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">Payment Method</p>
                        <p className="mt-1">{formatPaymentMethod(order.paymentMethod, order.paymentStatus)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">Items</p>
                        <p className="mt-1">{order.itemCount} total</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">Order Total</p>
                        <p className="mt-1">{formatCurrency(order.totalAmount)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Line Items</p>
                      <div className="mt-3 space-y-3">
                        {(order.items || []).map((item) => (
                          <div key={`${order.id}-${item.bookId}`} className="flex flex-col gap-2 rounded-2xl border border-white bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{item.title}</p>
                              <p className="text-sm text-slate-500">{item.author}</p>
                            </div>
                            <div className="text-sm text-slate-600 sm:text-right">
                              <p>Qty {item.quantity} x {formatCurrency(item.unitPrice)}</p>
                              <p className="font-semibold text-slate-900">{formatCurrency(item.lineTotal)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Admin Actions</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.orderStatus === 'CANCELLED' ? (
                          <button
                            onClick={() => handleUpdate(order, { orderStatus: 'PENDING' }, 'Order reopened')}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                          >
                            <FiRefreshCw size={14} />
                            Reopen
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleUpdate(order, { orderStatus: 'COMPLETED' }, 'Order marked completed')}
                              disabled={order.orderStatus === 'COMPLETED'}
                              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FiCheckCircle size={14} />
                              Completed
                            </button>
                            <button
                              onClick={() => handleUpdate(order, { orderStatus: 'CANCELLED' }, 'Order cancelled and stock restored')}
                              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                            >
                              <FiXCircle size={14} />
                              Cancel
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleUpdate(order, { paymentStatus: 'PAID' }, 'Payment marked as paid')}
                          disabled={order.paymentStatus === 'PAID'}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => handleUpdate(order, { paymentStatus: paymentResetStatus }, 'Payment status updated')}
                          disabled={order.paymentStatus === paymentResetStatus}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {paymentResetLabel}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between rounded-[28px] border border-slate-200 bg-white/92 px-5 py-4 shadow-sm">
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
        </>
      )}
    </div>
  );
}
