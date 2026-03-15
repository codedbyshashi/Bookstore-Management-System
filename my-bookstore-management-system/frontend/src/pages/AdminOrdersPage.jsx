import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const changeStatus = async (order, newStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      toast.success('Status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <div className="space-y-3">
        {orders.map((order, index) => (
          <div key={order.id ?? index} className="border p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <p>Order #{order.id}</p>
              <span className="text-sm font-semibold">{order.orderStatus}</span>
            </div>
            <p>Payment: {order.paymentStatus}</p>
            <p>Books: {order.bookIds?.join(', ')}</p>
            <div className="mt-2 flex gap-2">
              <button className="text-white bg-blue-600 px-3 py-1 rounded" onClick={() => changeStatus(order, 'COMPLETED')}>Set Completed</button>
              <button className="text-white bg-orange-600 px-3 py-1 rounded" onClick={() => changeStatus(order, 'CANCELLED')}>Set Cancelled</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
