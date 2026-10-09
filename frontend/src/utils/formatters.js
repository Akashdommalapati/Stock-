// Indian Currency Formatter (₹)
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

// Indian Number Formatter (e.g. 1,25,000)
export const formatIndianNumber = (num) => {
  const n = Number(num) || 0;
  return new Intl.NumberFormat('en-IN').format(n);
};

// Date Formatter: DD-MM-YYYY
export const formatDate = (dateInput) => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// Stock Status Badge Config
export const getStockBadge = (currentStock, minStock) => {
  const current = Number(currentStock) || 0;
  const min = Number(minStock) || 0;

  if (current <= min) {
    return {
      label: 'Low Stock',
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      dotColor: 'bg-rose-500',
      type: 'red',
    };
  } else if (current <= min + 10) {
    return {
      label: 'Near Limit',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      dotColor: 'bg-amber-500',
      type: 'orange',
    };
  } else {
    return {
      label: 'Sufficient',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      dotColor: 'bg-emerald-500',
      type: 'green',
    };
  }
};
