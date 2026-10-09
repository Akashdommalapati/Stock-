import React, { useState, useEffect } from 'react';
import PrintableInvoice from '../components/PrintableInvoice';
import { api } from '../api/axiosInstance';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Search, Receipt, Printer, Eye, RefreshCw } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get('/orders', {
        search,
        startDate,
        endDate,
      });
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, startDate, endDate]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Sales Orders & Delivery History</h2>
          <p className="text-xs text-slate-400">Search past orders, view invoices, and print bills</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, agency or town..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center p-12 text-slate-400 space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
          <span>Loading Orders...</span>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Agency / Customer</th>
                  <th className="py-3.5 px-4">Town</th>
                  <th className="py-3.5 px-4 text-right">Total Cases</th>
                  <th className="py-3.5 px-4 text-right">Total Bill (₹)</th>
                  <th className="py-3.5 px-4 text-right">Profit (₹)</th>
                  <th className="py-3.5 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-500">
                      No matching sales orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {o.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-400">
                        {formatDate(o.orderDate)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {o.customerName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {o.town}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        {o.totalCases} <span className="text-xs font-normal text-slate-400">Cases</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-white">
                        {formatCurrency(o.totalBill)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                        +{formatCurrency(o.totalProfit)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderForInvoice(o)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-all ml-auto"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View Bill</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <PrintableInvoice
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
}
