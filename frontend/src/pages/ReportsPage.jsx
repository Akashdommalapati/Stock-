import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosInstance';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCsv';
import {
  BarChart3,
  Download,
  Calendar,
  RefreshCw,
  TrendingUp,
  Boxes,
  IndianRupee,
  Receipt,
  Users,
  Package,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'customers'
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.get('/reports/analytics', { startDate, endDate });
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const handleExportCSV = () => {
    if (!reports) return;

    if (activeTab === 'products') {
      const csvData = (reports.productSummary || []).map((p) => ({
        Flavor: p.flavor,
        BottleSize: p.bottleSize,
        TotalCasesSold: p.cases,
        Revenue: p.revenue,
        Cost: p.cost,
        NetProfit: p.profit,
      }));
      exportToCSV(csvData, `product_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    } else {
      const csvData = (reports.customerSummary || []).map((c) => ({
        AgencyName: c.customerName,
        Town: c.town,
        OrderCount: c.orderCount,
        TotalCasesBought: c.totalCases,
        TotalRevenue: c.totalRevenue,
        TotalProfit: c.totalProfit,
      }));
      exportToCSV(csvData, `agency_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    }
  };

  if (loading || !reports) {
    return (
      <div className="flex justify-center p-12 text-slate-400 space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
        <span>Loading Analytics Reports...</span>
      </div>
    );
  }

  const { summary, customerSummary, productSummary } = reports;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Sales & Financial Analytics Reports</h2>
          <p className="text-xs text-slate-400">Generate period reports, product profit breakdowns, and CSV data</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export {activeTab === 'products' ? 'Product' : 'Customer'} CSV</span>
        </button>
      </div>

      {/* Date Range Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Filter Report Period:</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
          <span className="text-xs text-slate-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-amber-400 hover:underline px-2"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</p>
          <p className="text-xl font-extrabold text-amber-400 mt-1">
            {formatCurrency(summary.totalRevenue)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Cases Dispatched</p>
          <p className="text-xl font-extrabold text-blue-400 mt-1">
            {summary.totalCases} Cases
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Cost of Goods</p>
          <p className="text-xl font-extrabold text-purple-400 mt-1">
            {formatCurrency(summary.totalCost)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Net Profit</p>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(summary.totalProfit)}
          </p>
        </div>
      </div>

      {/* RECHARTS PERFORMANCE GRAPH */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Product Profitability Chart</h3>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productSummary.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="flavor" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(value, name) => [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'Profit']}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#FF6B00" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
              <Bar dataKey="profit" fill="#22C55E" radius={[6, 6, 0, 0]} name="Net Profit (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABBED BREAKDOWN TABLES */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-800 space-x-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'products'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product-Wise Profit Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'customers'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Agency Customer-Wise Summary</span>
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Flavor & Size</th>
                    <th className="py-3.5 px-4 text-right">Cases Sold</th>
                    <th className="py-3.5 px-4 text-right">Revenue (₹)</th>
                    <th className="py-3.5 px-4 text-right">Cost (₹)</th>
                    <th className="py-3.5 px-4 text-right">Net Profit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {productSummary.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {p.flavor} <span className="text-xs font-normal text-slate-400">({p.bottleSize})</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-blue-400">{p.cases} Cases</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-amber-400">
                        {formatCurrency(p.revenue)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-400">
                        {formatCurrency(p.cost)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">
                        +{formatCurrency(p.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Agency / Customer</th>
                    <th className="py-3.5 px-4">Town</th>
                    <th className="py-3.5 px-4 text-center">Orders</th>
                    <th className="py-3.5 px-4 text-right">Cases Bought</th>
                    <th className="py-3.5 px-4 text-right">Total Revenue (₹)</th>
                    <th className="py-3.5 px-4 text-right">Generated Profit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {customerSummary.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-bold text-white">{c.customerName}</td>
                      <td className="py-3.5 px-4 text-slate-400">{c.town}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-300">{c.orderCount}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-blue-400">{c.totalCases} Cases</td>
                      <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                        {formatCurrency(c.totalRevenue)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">
                        +{formatCurrency(c.totalProfit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
