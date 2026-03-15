export const PAYMENT_METHOD_LABELS = {
  DEBIT_CARD: 'Debit Card',
  UPI: 'UPI',
  CASH_ON_DELIVERY: 'Cash on Delivery',
  ONLINE_PAYMENT: 'Online Payment',
};

export const PAYMENT_STATUS_LABELS = {
  PAID: 'Paid',
  UNPAID: 'Unpaid',
  PENDING_PAYMENT: 'Pending Payment',
  PAY_ON_DELIVERY: 'Pay on Delivery',
};

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const formatPaymentMethod = (method, paymentStatus) => {
  if (PAYMENT_METHOD_LABELS[method]) {
    return PAYMENT_METHOD_LABELS[method];
  }

  if (paymentStatus === 'PAY_ON_DELIVERY') {
    return PAYMENT_METHOD_LABELS.CASH_ON_DELIVERY;
  }

  if (paymentStatus === 'PAID' || paymentStatus === 'PENDING_PAYMENT' || paymentStatus === 'UNPAID') {
    return PAYMENT_METHOD_LABELS.ONLINE_PAYMENT;
  }

  return PAYMENT_METHOD_LABELS.ONLINE_PAYMENT;
};

export const formatPaymentStatus = (status) => PAYMENT_STATUS_LABELS[status] || status || 'Unknown';

export const formatOrderStatus = (status) => ORDER_STATUS_LABELS[status] || status || 'Unknown';
