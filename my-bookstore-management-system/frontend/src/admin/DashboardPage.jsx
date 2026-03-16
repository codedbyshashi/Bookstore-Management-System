import React, { useEffect, useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { fetchBooks } from '../services/adminBookService';
import { fetchOrders } from '../services/adminOrderService';
import { formatCurrency } from '../utils/format';
import { formatOrderStatus, formatPaymentMethod, formatPaymentStatus } from '../utils/payment';

const getContent = (body) => (Array.isArray(body) ? body : body?.content || []);
const getPercent = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);

const statusPillClasses = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  CANCELLED: 'border-rose-200 bg-rose-50 text-rose-700',
};

const paymentPillClasses = {
  PAID: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  PAY_ON_DELIVERY: 'border-sky-200 bg-sky-50 text-sky-700',
  PENDING_PAYMENT: 'border-amber-200 bg-amber-50 text-amber-700',
  UNPAID: 'border-slate-200 bg-slate-100 text-slate-700',
};

export default function DashboardPage() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totals, setTotals] = useState({ books: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [bookRes, orderRes] = await Promise.all([
          fetchBooks({ page: 0, size: 1000 }),
          fetchOrders({ page: 0, size: 1000 }),
        ]);
        const bookBody = bookRes.data;
        const orderBody = orderRes.data;
        const bookContent = getContent(bookBody);
        const orderContent = getContent(orderBody);

        setBooks(bookContent);
        setOrders(orderContent);
        setTotals({
          books: Array.isArray(bookBody) ? bookContent.length : (bookBody?.totalElements ?? bookContent.length),
          orders: Array.isArray(orderBody) ? orderContent.length : (orderBody?.totalElements ?? orderContent.length),
        });
      } catch (error) {
        console.error(error);
        setBooks([]);
        setOrders([]);
        setTotals({ books: 0, orders: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.orderStatus === 'PENDING').length;
    const completed = orders.filter((o) => o.orderStatus === 'COMPLETED').length;
    const cancelled = orders.filter((o) => o.orderStatus === 'CANCELLED').length;
    const paid = orders.filter((o) => o.paymentStatus === 'PAID').length;
    const payOnDelivery = orders.filter((o) => o.paymentStatus === 'PAY_ON_DELIVERY').length;
    const pendingPayment = orders.filter((o) => ['PENDING_PAYMENT', 'UNPAID'].includes(o.paymentStatus)).length;
    const inventoryUnits = books.reduce((sum, book) => sum + Number(book.stockQuantity || 0), 0);
    const inventoryValue = books.reduce(
      (sum, book) => sum + (Number(book.stockQuantity || 0) * Number(book.price || 0)),
      0,
    );
    const lowStockBooks = [...books]
      .filter((book) => Number(book.stockQuantity || 0) <= 10)
      .sort((left, right) => Number(left.stockQuantity || 0) - Number(right.stockQuantity || 0));
    const outOfStock = lowStockBooks.filter((book) => Number(book.stockQuantity || 0) === 0).length;
    const latestOrders = [...orders]
      .sort((left, right) => Number(right.id || 0) - Number(left.id || 0))
      .slice(0, 5);

    const bookUsage = orders.reduce((accumulator, order) => {
      (order.bookIds || []).forEach((bookId) => {
        accumulator[bookId] = (accumulator[bookId] || 0) + 1;
      });
      return accumulator;
    }, {});

    const popularTitles = Object.entries(bookUsage)
      .map(([bookId, count]) => {
        const book = books.find((entry) => Number(entry.id) === Number(bookId));
        return {
          id: Number(bookId),
          count,
          title: book?.title || `Book #${bookId}`,
          author: book?.author || 'Unknown author',
        };
      })
      .sort((left, right) => right.count - left.count)
      .slice(0, 4);

    return {
      pending,
      completed,
      cancelled,
      paid,
      payOnDelivery,
      pendingPayment,
      inventoryUnits,
      inventoryValue,
      lowStockBooks,
      outOfStock,
      latestOrders,
      popularTitles,
    };
  }, [books, orders]);

  const overviewCards = [
    {
      label: 'Catalog Titles',
      value: totals.books,
      note: 'Books currently live in the store',
      icon: FiBookOpen,
      tone: 'from-indigo-600 to-cyan-500',
    },
    {
      label: 'Inventory Units',
      value: stats.inventoryUnits,
      note: `${formatCurrency(stats.inventoryValue)} in listed stock value`,
      icon: FiLayers,
      tone: 'from-slate-900 to-indigo-700',
    },
    {
      label: 'Orders Needing Review',
      value: stats.pending,
      note: `${stats.pendingPayment} payment follow-up items`,
      icon: FiClock,
      tone: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Stock Alerts',
      value: stats.lowStockBooks.length,
      note: `${stats.outOfStock} currently out of stock`,
      icon: FiAlertTriangle,
      tone: 'from-rose-500 to-orange-500',
    },
  ];

  const orderFlow = [
    { label: 'Pending', value: stats.pending, tone: 'bg-amber-500' },
    { label: 'Completed', value: stats.completed, tone: 'bg-emerald-500' },
    { label: 'Cancelled', value: stats.cancelled, tone: 'bg-rose-500' },
  ];

  const paymentFlow = [
    { label: 'Paid', value: stats.paid, tone: 'bg-emerald-500' },
    { label: 'Pending Payment', value: stats.pendingPayment, tone: 'bg-amber-500' },
    { label: 'Cash on Delivery', value: stats.payOnDelivery, tone: 'bg-sky-500' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-[24px] border border-slate-200 bg-slate-100" />
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-[28px] border border-slate-200 bg-slate-100" />
          <div className="h-80 animate-pulse rounded-[28px] border border-slate-200 bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[24px] border border-slate-200 bg-white/95 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">{card.label}</p>
                  <p className="mt-3 font-display text-4xl font-bold text-slate-950">{card.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{card.note}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-white shadow-glow`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Inventory Watch</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Restock priority list</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Focus on the titles that are about to run out instead of scanning the whole catalog manually.
              </p>
            </div>
            <Link
              to="/admin/books"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
            >
              Manage catalog
              <FiArrowRight size={16} />
            </Link>
          </div>

          {stats.lowStockBooks.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">
              Inventory looks healthy. No titles are currently inside the low-stock threshold.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {stats.lowStockBooks.slice(0, 5).map((book) => {
                const stockLevel = Number(book.stockQuantity || 0);
                return (
                  <div key={book.id} className="flex flex-col gap-3 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{book.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{book.author || 'Unknown author'}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {book.genre || 'General'}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stockLevel === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {stockLevel === 0 ? 'Out of stock' : `${stockLevel} left`}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {formatCurrency(book.price)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-600 text-white">
              <FiTrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Operations Pulse</p>
              <h2 className="font-display text-2xl font-bold text-slate-950">Order flow snapshot</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {orderFlow.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.value} of {totals.orders}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${item.tone}`}
                    style={{ width: `${getPercent(item.value, totals.orders)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              <FiCheckCircle size={16} />
              Payment mix
            </div>
            {paymentFlow.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm text-slate-600">
                <span>{item.label}</span>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Demand Signals</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Popular titles</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                A quick view of the books showing up most often in orders.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-glow">
              <FiShoppingCart size={20} />
            </div>
          </div>

          {stats.popularTitles.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-600">
              Once customers start placing orders, the most requested titles will show up here.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {stats.popularTitles.map((book, index) => (
                <div key={book.id} className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{book.title}</p>
                      <p className="text-sm text-slate-500">{book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-950">{book.count} orders</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Demand rank</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Recent Activity</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">Latest order queue</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                The newest orders are listed here first so the team can react quickly.
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
            >
              Open orders
              <FiArrowRight size={16} />
            </Link>
          </div>

          {stats.latestOrders.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-600">
              No orders have been created yet.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {stats.latestOrders.map((order) => (
                <div key={order.id} className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">Order #{order.id}</p>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusPillClasses[order.orderStatus] || 'border-slate-200 bg-slate-100 text-slate-700'}`}>
                          {formatOrderStatus(order.orderStatus)}
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${paymentPillClasses[order.paymentStatus] || 'border-slate-200 bg-slate-100 text-slate-700'}`}>
                          {formatPaymentStatus(order.paymentStatus)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        User #{order.userId} | {(order.bookIds || []).length} book{(order.bookIds || []).length === 1 ? '' : 's'} | {formatPaymentMethod(order.paymentMethod, order.paymentStatus)}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <FiPackage size={14} />
                      Queue item
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
