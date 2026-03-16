export const formatCurrency = (value) =>
  `$${Number(value || 0).toFixed(2)}`;

export const formatDateTime = (value) => {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};
