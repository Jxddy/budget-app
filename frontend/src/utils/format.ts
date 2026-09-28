export const formatCurrency = (
  amount: number | string | undefined | null,
  currency: string = localStorage.getItem('currency') || 'EUR'
): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount || 0);

  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : currency,
      maximumFractionDigits: currency === 'XOF' ? 0 : 2,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toFixed(2)} ${currency}`;
  }
};

export const formatPercentage = (value: number | undefined | null): string => {
  const num = Number(value || 0);
  return `${num.toFixed(1)}%`;
};

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};
