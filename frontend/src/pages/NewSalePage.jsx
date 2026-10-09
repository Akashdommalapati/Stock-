import React, { useState, useEffect } from 'react';
import CustomerModal from '../components/CustomerModal';
import PrintableInvoice from '../components/PrintableInvoice';
import { api } from '../api/axiosInstance';
import { formatCurrency } from '../utils/formatters';
import {
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShoppingCart,
  UserPlus,
  Printer,
  Sparkles,
} from 'lucide-react';

export default function NewSalePage() {
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedTown, setSelectedTown] = useState('');

  // Line items state: [{ productId, flavor, bottleSize, cases, availableStock, sellingPrice, purchasePrice, totalPrice, profit }]
  const [items, setItems] = useState([
    { productId: '', cases: 1, availableStock: 0, sellingPrice: 0, purchasePrice: 0, totalPrice: 0, profit: 0 },
  ]);

  const [stockBlockedError, setStockBlockedError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [savedOrderForPrint, setSavedOrderForPrint] = useState(null);

  const fetchData = async () => {
    try {
      const [custData, prodData] = await Promise.all([
        api.get('/customers'),
        api.get('/products'),
      ]);
      setCustomers(custData);
      setProducts(prodData.filter((p) => p.isActive));

      if (custData.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(custData[0]._id);
        setSelectedTown(custData[0].town);
      }
    } catch (err) {
      console.error('Failed to load customers or products:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCustomerChange = (e) => {
    const id = e.target.value;
    setSelectedCustomerId(id);
    const cust = customers.find((c) => c._id === id);
    setSelectedTown(cust ? cust.town : '');
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'productId') {
      item.productId = value;
      const product = products.find((p) => p._id === value);
      if (product) {
        item.availableStock = product.currentStock;
        item.sellingPrice = product.sellingPricePerCase;
        item.purchasePrice = product.purchasePricePerCase;
      } else {
        item.availableStock = 0;
        item.sellingPrice = 0;
        item.purchasePrice = 0;
      }
    } else if (field === 'cases') {
      item.cases = Number(value) || 0;
    }

    // Recalculate totals for row
    const rowCases = Number(item.cases) || 0;
    item.totalPrice = rowCases * item.sellingPrice;
    item.profit = rowCases * (item.sellingPrice - item.purchasePrice);

    newItems[index] = item;
    setItems(newItems);
    validateStock(newItems);
  };

  const handleAddItem = () => {
    const newItems = [
      ...items,
      { productId: '', cases: 1, availableStock: 0, sellingPrice: 0, purchasePrice: 0, totalPrice: 0, profit: 0 },
    ];
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    validateStock(newItems);
  };

  // Check if any row requested cases exceed available stock
  const validateStock = (currentItems) => {
    setStockBlockedError('');
    for (let i = 0; i < currentItems.length; i++) {
      const item = currentItems[i];
      if (item.productId && item.cases > item.availableStock) {
        const prod = products.find((p) => p._id === item.productId);
        const name = prod ? `${prod.flavor} (${prod.bottleSize})` : `Item #${i + 1}`;
        setStockBlockedError(
          `Stock Insufficient for ${name}! Available: ${item.availableStock} Cases, Requested: ${item.cases} Cases. Order saving is BLOCKED.`
        );
        return false;
      }
    }
    return true;
  };

  const totalCases = items.reduce((sum, item) => sum + (Number(item.cases) || 0), 0);
  const totalBill = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalCost = items.reduce((sum, item) => sum + (item.cases * item.purchasePrice), 0);
  const totalProfit = items.reduce((sum, item) => sum + item.profit, 0);

  const handleCreateCustomer = async (custData) => {
    const newCust = await api.post('/customers', custData);
    await fetchData();
    setSelectedCustomerId(newCust._id);
    setSelectedTown(newCust.town);
  };

  const handleSubmitSale = async (e) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      alert('Please select a customer agency.');
      return;
    }

    if (items.some((i) => !i.productId || i.cases <= 0)) {
      alert('Please complete all line items with valid products and quantities.');
      return;
    }

    if (!validateStock(items)) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        orderDate,
        customerId: selectedCustomerId,
        items: items.map((i) => ({
          productId: i.productId,
          cases: i.cases,
        })),
      };

      const res = await api.post('/orders', payload);
      setSavedOrderForPrint(res.order);
      // Reset form
      setItems([{ productId: '', cases: 1, availableStock: 0, sellingPrice: 0, purchasePrice: 0, totalPrice: 0, profit: 0 }]);
      await fetchData();
    } catch (err) {
      setStockBlockedError(err.message || 'Saving order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <span>Daily Sale Order Entry</span>
          </h2>
          <p className="text-xs text-slate-400">Record agency dispatches with live stock validation & instant bills</p>
        </div>
      </div>

      {/* Stock Blocked Alert Banner */}
      {stockBlockedError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/50 text-red-400 text-sm font-bold flex items-center space-x-3 shadow-xl animate-pulse">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <span>{stockBlockedError}</span>
        </div>
      )}

      <form onSubmit={handleSubmitSale} className="space-y-6">
        {/* Customer & Date Selector Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Order Date
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer Agency
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="text-xs text-amber-400 font-semibold hover:underline flex items-center space-x-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add New Agency</span>
                </button>
              </div>
              <select
                value={selectedCustomerId}
                onChange={handleCustomerChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                required
              >
                <option value="">-- Select Agency --</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.town})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Town / Location (Auto-Filled)
              </label>
              <input
                type="text"
                value={selectedTown}
                readOnly
                placeholder="Select an agency"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-amber-400 font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* LINE ITEMS TABLE */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Order Line Items</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 font-bold text-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Item Row</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const isStockExceeded = item.productId && item.cases > item.availableStock;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isStockExceeded
                      ? 'bg-red-950/20 border-red-500/50'
                      : 'bg-slate-800/50 border-slate-700/60'
                  } grid grid-cols-1 md:grid-cols-12 gap-3 items-center`}
                >
                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Beverage Flavor & Bottle Size
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm"
                      required
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.flavor} ({p.bottleSize}) - ₹{p.sellingPricePerCase}/Case
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Available Stock
                    </label>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm font-extrabold ${
                        isStockExceeded ? 'bg-red-500/20 text-red-400' : 'bg-slate-900 text-amber-400'
                      }`}
                    >
                      {item.availableStock} Cases
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Cases Requested
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.cases}
                      onChange={(e) => handleItemChange(idx, 'cases', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg bg-slate-900 border text-white text-sm font-bold ${
                        isStockExceeded ? 'border-red-500 text-red-300' : 'border-slate-700'
                      }`}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 text-right">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Line Total (₹)
                    </label>
                    <p className="text-sm font-extrabold text-white py-2">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length === 1}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REAL-TIME SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Cases</p>
            <p className="text-xl font-extrabold text-blue-400 mt-1">{totalCases} Cases</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Bill (Revenue)</p>
            <p className="text-xl font-extrabold text-amber-400 mt-1">{formatCurrency(totalBill)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Cost (Investment)</p>
            <p className="text-xl font-extrabold text-purple-400 mt-1">{formatCurrency(totalCost)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Net Profit</p>
            <p className="text-xl font-extrabold text-emerald-400 mt-1">{formatCurrency(totalProfit)}</p>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading || !!stockBlockedError}
            className="flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 hover:opacity-95 text-slate-950 font-black text-base shadow-2xl shadow-amber-500/20 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
          >
            <span>{loading ? 'Processing Order...' : 'Complete Sale & Generate Bill'}</span>
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Customer Quick Add Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSubmit={handleCreateCustomer}
      />

      {/* Printable Invoice Modal upon completing sale */}
      {savedOrderForPrint && (
        <PrintableInvoice
          order={savedOrderForPrint}
          onClose={() => setSavedOrderForPrint(null)}
        />
      )}
    </div>
  );
}
