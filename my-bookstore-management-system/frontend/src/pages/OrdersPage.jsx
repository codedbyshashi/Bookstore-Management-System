import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiPackage,
  FiTruck,
} from 'react-icons/fi';
import { getOrders } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { useAuth } from '../hooks/useAuth';
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

const getDeliveryMessage = (order) => {
  if (order.orderStatus === 'COMPLETED') return 'The bookstore marked this order as completed.';
  if (order.orderStatus === 'CANCELLED') return 'This order was cancelled and any reserved stock was returned.';
  if (order.paymentStatus === 'PAY_ON_DELIVERY') return 'Payment will be collected when the order is delivered.';
  if (order.paymentStatus === 'PAID') return 'Payment is complete and the order is ready for fulfillment.';
  return 'The bookstore is reviewing your order and payment state.';
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getOrders({ page: page - 1, size });
        const data = res?.data;
        const content = Array.isArray(data) ? data : data?.content || [];
        setOrders(content);
        setTotalPages(Math.max(1, data?.totalPages ?? 1));
        setTotalItems(data?.totalElements ?? content.length);
      } catch (err) {
        console.error(err);
        setOrders([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, size]);

  if (user?.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin/orders" replace />;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-glow">
              <FiPackage size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-500">Purchase History</p>
              <h1 className="mt-1 font-display text-3xl font-bold text-slate-950">My Orders</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              Total orders: <strong className="text-slate-900">{totalItems}</strong>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <label htmlFor="user-order-page-size">Page size</label>
              <select
                id="user-order-page-size"
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-full border border-slate-200 bg-white px-3 py-2"
              >
                {[3, 6, 9].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Every order now includes item-level quantity details, payment state, order totals, and the latest store update.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-8 text-center shadow-xl backdrop-blur">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <FiClock size={24} />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-slate-950">No orders yet</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Once you place an order, it will appear here with quantity, payment, and delivery details.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-[28px] border border-white/70 bg-white/92 p-5 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Order #{order.id}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusClasses(order.orderStatus)}`}>
                        {formatOrderStatus(order.orderStatus)}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusClasses(order.paymentStatus)}`}>
                        {formatPaymentStatus(order.paymentStatus)}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <FiCalendar size={14} />
                        Placed {formatDateTime(order.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <FiClock size={14} />
                        Updated {formatDateTime(order.updatedAt)}
                      </span>
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

                <div className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Items Ordered</p>
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
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Delivery and Payment</p>
                    <div className="mt-3 space-y-3 text-sm text-slate-600">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                        <FiCreditCard size={14} />
                        {formatPaymentMethod(order.paymentMethod, order.paymentStatus)}
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                        <FiTruck size={14} />
                        {getDeliveryMessage(order)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 px-4 py-5 shadow-lg backdrop-blur">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
