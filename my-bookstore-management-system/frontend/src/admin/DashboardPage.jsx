import React, { useEffect, useMemo, useState } from 'react';
import { fetchBooks } from '../services/adminBookService';
import { fetchOrders } from '../services/adminOrderService';

const getContent = (body) => (Array.isArray(body) ? body : body?.content || []);

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
    const lowStock = books.filter((b) => b.stockQuantity <= 10).length;
    return { pending, completed, cancelled, lowStock };
  }, [books, orders]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-slate-500">Total Books</p>
          <p className="text-3xl font-bold">{totals.books}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="text-3xl font-bold">{totals.orders}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-slate-500">Completed Orders</p>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-sm text-slate-500">Low Stock Items</p>
          <p className="text-3xl font-bold">{stats.lowStock}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border">Pending: {stats.pending}</div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">Cancelled: {stats.cancelled}</div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">Most recent order: {orders[0]?.id ?? 'N/A'}</div>
      </div>
    </div>
  );
}
