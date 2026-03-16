import React, { useMemo, useState } from 'react';
import {
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiLock,
  FiShoppingBag,
  FiSmartphone,
  FiTruck,
} from 'react-icons/fi';
import { Navigate, useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/format';
import { formatPaymentStatus } from '../utils/payment';
import { useAuth } from '../hooks/useAuth';

const PENDING_UPI_KEY = 'pendingUpiCheckout';

const paymentOptions = [
  {
    id: 'DEBIT_CARD',
    label: 'Debit Card',
    subtitle: 'Card authorization will be completed after the order is placed.',
    icon: FiCreditCard,
    paymentStatus: 'PENDING_PAYMENT',
    accent: 'from-indigo-600 to-violet-500',
    buttonLabel: 'Place Order with Debit Card',
  },
  {
    id: 'UPI',
    label: 'UPI',
    subtitle: 'Continue to a separate UPI payment screen and pay instantly.',
    icon: FiSmartphone,
    paymentStatus: 'PAID',
    accent: 'from-sky-500 to-cyan-500',
    buttonLabel: 'Continue to UPI Payment',
  },
  {
    id: 'CASH_ON_DELIVERY',
    label: 'Cash on Delivery',
    subtitle: 'Pay only when the package reaches your doorstep.',
    icon: FiTruck,
    paymentStatus: 'PAY_ON_DELIVERY',
    accent: 'from-emerald-500 to-lime-500',
    buttonLabel: 'Place Order with Cash on Delivery',
  },
];

export default function CheckoutPage() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0].id);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const activePayment = paymentOptions.find((option) => option.id === selectedPayment) || paymentOptions[0];
  const hasUnavailableItems = cart.some(
    (item) => Number(item.book.stockQuantity || 0) < item.quantity || Number(item.book.stockQuantity || 0) === 0,
  );

  if (user?.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin/orders" replace />;
  }

  const buildBaseOrderPayload = () => ({
    bookIds: cart.map((item) => item.book.id),
    items: cart.map((item) => ({
      bookId: item.book.id,
      quantity: item.quantity,
    })),
    itemCount,
    totalAmount: total,
    orderStatus: 'PENDING',
    paymentMethod: activePayment.id,
    paymentStatus: activePayment.paymentStatus,
  });

  const handleCheckout = async () => {
    if (!cart.length) return;

    if (!user?.id) {
      toast.error('Please login before placing an order');
      navigate('/login');
      return;
    }

    const basePayload = buildBaseOrderPayload();

    if (activePayment.id === 'UPI') {
      localStorage.setItem(
        PENDING_UPI_KEY,
        JSON.stringify({
          payload: basePayload,
          total,
          items: cart.map((item) => ({
            id: item.book.id,
            title: item.book.title,
            quantity: item.quantity,
            amount: item.book.price * item.quantity,
          })),
        }),
      );
      navigate('/checkout/upi');
      return;
    }

    setLoading(true);
    try {
      await placeOrder(basePayload);
      localStorage.removeItem('cart');
      localStorage.removeItem(PENDING_UPI_KEY);
      toast.success(`Order placed with ${activePayment.label}`);
      navigate('/orders');
    } catch (err) {
      toast.error('Order submission failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <p className="text-center text-slate-600">Cart is empty. Add books first.</p>;
  }

  if (hasUnavailableItems) {
    return (
      <div className="mx-auto max-w-3xl rounded-[32px] border border-rose-200 bg-white/95 p-8 text-center shadow-xl">
        <h1 className="font-display text-3xl font-bold text-slate-950">Cart needs attention</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          One or more cart items are above available stock or out of stock. Please update the cart before continuing to payment.
        </p>
        <button
          onClick={() => navigate('/cart')}
          className="mt-6 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <section className="overflow-hidden rounded-[34px] border border-white/70 bg-white/85 shadow-xl backdrop-blur">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 via-indigo-950 to-cyan-900 px-6 py-7 text-white sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <FiShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100">Checkout</p>
              <h1 className="mt-1 font-display text-3xl font-bold">Choose a payment method</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
            Pick how you want to pay. Orders now carry item-by-item quantity details, and stock is validated before the order is accepted.
          </p>
        </div>

        <div className="space-y-4 p-6 sm:p-8">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedPayment === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedPayment(option.id)}
                className={`flex w-full items-center gap-4 rounded-[28px] border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-glow ${
                  isSelected
                    ? 'border-indigo-200 bg-indigo-50/80 ring-1 ring-indigo-100'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${option.accent} text-white shadow-sm`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-xl font-bold text-slate-900">{option.label}</h2>
                    {isSelected && <FiCheckCircle className="text-indigo-600" size={20} />}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{option.subtitle}</p>
                </div>
              </button>
            );
          })}

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <FiLock size={20} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-slate-900">Payment summary</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Selected method: <span className="font-semibold text-slate-900">{activePayment.label}</span>
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Order payment status: <span className="font-semibold text-slate-900">{formatPaymentStatus(activePayment.paymentStatus)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/70 bg-white/92 p-6 shadow-xl backdrop-blur sm:p-8">
        <h2 className="font-display text-2xl font-bold text-slate-950">Order summary</h2>
        <p className="mt-2 text-sm text-slate-500">{itemCount} total item{itemCount === 1 ? '' : 's'} across {cart.length} title{cart.length === 1 ? '' : 's'}</p>
        <div className="mt-5 space-y-3">
          {cart.map((item) => (
            <div key={item.book.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="pr-4 text-slate-700">{item.book.title}</span>
                <span className="font-semibold text-slate-900">{formatCurrency(item.book.price * item.quantity)}</span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                Quantity {item.quantity} | Unit price {formatCurrency(item.book.price)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[28px] bg-slate-950 px-5 py-4 text-white">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Total payable</span>
            <span className="font-display text-2xl font-bold text-white">{formatCurrency(total)}</span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            Selected method: {activePayment.label}
          </p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 font-semibold text-white shadow-glow hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Processing...' : activePayment.buttonLabel}
          {!loading && <FiArrowRight size={18} />}
        </button>
      </section>
    </div>
  );
}
