import React, { useMemo, useState } from 'react';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLock,
  FiSmartphone,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { placeOrder } from '../services/orderService';
import { formatCurrency } from '../utils/format';

const PENDING_UPI_KEY = 'pendingUpiCheckout';
const upiPattern = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

export default function UpiPaymentPage() {
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const pendingPayment = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(PENDING_UPI_KEY) || 'null');
    } catch (parseError) {
      localStorage.removeItem(PENDING_UPI_KEY);
      return null;
    }
  }, []);

  const handlePayNow = async (e) => {
    e.preventDefault();

    if (!pendingPayment?.payload) {
      setError('No pending UPI checkout was found. Please start from checkout again.');
      return;
    }

    if (!upiPattern.test(upiId.trim())) {
      setError('Enter a valid UPI ID like name@bank');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await placeOrder({
        ...pendingPayment.payload,
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
      });
      localStorage.removeItem(PENDING_UPI_KEY);
      localStorage.removeItem('cart');
      toast.success('UPI payment successful');
      navigate('/orders');
    } catch (requestError) {
      console.error(requestError);
      setError('UPI payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!pendingPayment?.payload) {
    return (
      <div className="mx-auto max-w-2xl rounded-[32px] border border-white/70 bg-white/90 p-8 text-center shadow-xl backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <FiSmartphone size={24} />
        </div>
        <h1 className="mt-5 font-display text-3xl font-bold text-slate-950">No UPI payment in progress</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Start from checkout, choose UPI, and then continue to this payment page.
        </p>
        <Link
          to="/checkout"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-3 font-semibold text-white shadow-glow"
        >
          <FiArrowLeft size={18} />
          Back to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.95fr]">
      <section className="overflow-hidden rounded-[34px] border border-white/70 bg-white/85 shadow-xl backdrop-blur">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 via-sky-900 to-cyan-700 px-6 py-7 text-white sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <FiSmartphone size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100">UPI Payment</p>
              <h1 className="mt-1 font-display text-3xl font-bold">Complete payment with your UPI ID</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
            Enter a valid UPI ID and we will mark this order as paid immediately in your order history.
          </p>
        </div>

        <div className="space-y-4 p-6 sm:p-8">
          {pendingPayment.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span className="pr-4 text-slate-700">{item.title} x {item.quantity}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(item.amount)}</span>
            </div>
          ))}

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <FiCheckCircle size={20} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-slate-900">What happens next</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Once you submit a valid UPI ID, the order is created with payment method <span className="font-semibold text-slate-900">UPI</span> and payment status <span className="font-semibold text-slate-900">Paid</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/70 bg-white/92 p-6 shadow-xl backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm">
            <FiLock size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Secure Entry</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-950">Enter UPI ID</h2>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-slate-950 px-5 py-4 text-white">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Total to pay</span>
            <span className="font-display text-2xl font-bold text-white">
              {formatCurrency(pendingPayment.total || 0)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handlePayNow} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">UPI ID</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-sky-300 focus-within:bg-white focus-within:shadow-glow">
              <FiSmartphone className="text-slate-400" size={18} />
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@upi"
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-3 font-semibold text-white shadow-glow hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Confirming Payment...' : 'Pay with UPI'}
          </button>
        </form>

        <Link
          to="/checkout"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          <FiArrowLeft size={16} />
          Back to checkout
        </Link>
      </section>
    </div>
  );
}
