import React, { useState, useEffect } from 'react';
import CustomerModal from '../components/CustomerModal';
import PrintableInvoice from '../components/PrintableInvoice';
import { api } from '../api/axiosInstance';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Users, Plus, Search, Edit2, ChevronRight, RefreshCw, Award, ArrowLeft } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/customers');
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSaveCustomer = async (formData) => {
    if (editingCustomer) {
      await api.put(`/customers/${editingCustomer._id}`, formData);
    } else {
      await api.post('/customers', formData);
    }
    await fetchCustomers();
  };

  const handleOpenDetail = async (customerId) => {
    try {
      const detail = await api.get(`/customers/${customerId}`);
      setSelectedCustomerDetail(detail);
    } catch (err) {
      console.error('Failed to fetch customer detail:', err);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.town.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* If viewing single customer detail */}
      {selectedCustomerDetail ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedCustomerDetail(null)}
            className="flex items-center space-x-2 text-xs font-bold text-amber-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Customer Agencies</span>
          </button>

          {/* Agency Header Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-lg">
                  🏢
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{selectedCustomerDetail.customer.name}</h2>
                  <p className="text-xs text-amber-400 font-semibold">{selectedCustomerDetail.customer.town} Town</p>
                  {selectedCustomerDetail.customer.phone && (
                    <p className="text-xs text-slate-400">Phone: {selectedCustomerDetail.customer.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-slate-800/60 text-right">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Orders</p>
                <p className="text-lg font-bold text-white">{selectedCustomerDetail.summary.totalOrders}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 text-right">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Cases</p>
                <p className="text-lg font-bold text-blue-400">{selectedCustomerDetail.summary.totalCases} Cases</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 text-right">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Spend</p>
                <p className="text-lg font-bold text-emerald-400">
                  {formatCurrency(selectedCustomerDetail.summary.totalBill)}
                </p>
              </div>
            </div>
          </div>

          {/* Top Purchased Products */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Top Purchased Flavors & Bottle Sizes</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(selectedCustomerDetail.summary.topProducts || []).map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Rank #{idx + 1}</span>
                  <h4 className="text-sm font-bold text-white">{item.flavor} ({item.bottleSize})</h4>
                  <p className="text-xs font-semibold text-blue-400">{item.totalCases} Cases Bought</p>
                  <p className="text-xs text-slate-400">{formatCurrency(item.totalAmount)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agency Order History */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Order History for {selectedCustomerDetail.customer.name}</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Cases</th>
                    <th className="py-3 px-3 text-right">Total Amount</th>
                    <th className="py-3 px-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {selectedCustomerDetail.orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">{o.orderNumber}</td>
                      <td className="py-3 px-3 text-xs text-slate-400">{formatDate(o.orderDate)}</td>
                      <td className="py-3 px-3 text-right font-bold text-white">{o.totalCases} Cases</td>
                      <td className="py-3 px-3 text-right font-extrabold text-emerald-400">
                        {formatCurrency(o.totalBill)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedInvoice(o)}
                          className="px-3 py-1 rounded bg-slate-800 text-amber-400 text-xs font-bold hover:bg-slate-700 ml-auto"
                        >
                          View Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Customers Directory */
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Customer Agencies & Wholesale Buyers</h2>
              <p className="text-xs text-slate-400">Manage buyer directory, towns, and purchase statistics</p>
            </div>

            <button
              onClick={() => {
                setEditingCustomer(null);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Agency</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by agency name or town..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {loading ? (
            <div className="flex justify-center p-12 text-slate-400 space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
              <span>Loading Agencies...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((c) => (
                <div
                  key={c._id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-base">
                        🏢
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{c.name}</h3>
                        <p className="text-xs font-semibold text-amber-400">{c.town} Town</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingCustomer(c);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-800/60">
                      <p className="text-slate-400">Total Purchases</p>
                      <p className="font-bold text-amber-400 mt-0.5">{formatCurrency(c.totalBill || 0)}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/60">
                      <p className="text-slate-400">Cases Bought</p>
                      <p className="font-bold text-blue-400 mt-0.5">{c.totalCases || 0} Cases</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDetail(c._id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all"
                  >
                    <span>View Purchase History & Analytics</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCustomer}
        customer={editingCustomer}
      />

      {/* Invoice Viewer */}
      {selectedInvoice && (
        <PrintableInvoice
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
