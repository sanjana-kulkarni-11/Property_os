/**
 * Formats a currency amount into Indian Rupee denomination:
 * >= 1 Crore (10,000,000) -> ₹XX.X Cr
 * >= 1 Lakh (100,000) -> ₹XX.X L
 * otherwise standard Indian grouping ₹XX,XXX
 */
export function formatINR(amount: number, compact: boolean = true): string {
  if (isNaN(amount)) return '₹0';

  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';

    if (abs >= 10000000) {
      const cr = abs / 10000000;
      return `${sign}₹${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (abs >= 100000) {
      const l = abs / 100000;
      return `${sign}₹${l.toFixed(2).replace(/\.00$/, '')} L`;
    }
  }

  // Standard Indian formatting
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
