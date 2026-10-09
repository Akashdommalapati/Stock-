import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import LowStockBanner from '../components/LowStockBanner';
import {
  IndianRupee,
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  Boxes,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatIndianNumber } from '../utils/formatters';
import { api } from '../api/axiosInstance';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [dashRes, prodRes] = await Promise.all([
          api.get('/reports/dashboard'),
          api.get('/stock/low-alerts'),
        ]);
        setData(dashRes);
        setLowStockProducts(prodRes || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Godown Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-semibold">Loading Live Godown Metrics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const today = data?.today || { cases: 0, revenue: 0, cost: 0, profit: 0 };
  const week = data?.week || { cases: 0, revenue: 0, cost: 0, profit: 0 };
  const month = data?.month || { cases: 0, revenue: 0, cost: 0, profit: 0 };
  const chartData = data?.chartData || data?.last7Days || [];
  const topSellers = data?.topSellers || [];

  return (
    <DashboardLayout title="Godown Dashboard">
      <div className="space-y-6">
        {/* Low Stock Alert */}
        <LowStockBanner lowStockItems={lowStockProducts} />

        {/* TODAY'S METRICS GRID */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Today's Dispatches & Financials</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Real-time Godown Aggregates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Today's Cases Sold"
              value={`${formatIndianNumber(today.cases)} Cases`}
              subtext="Total volumes dispatched"
              icon={Boxes}
              color="cyan"
            />
            <StatCard
              title="Today's Revenue"
              value={formatCurrency(today.revenue)}
              subtext="Total billing value"
              icon={IndianRupee}
              color="blue"
            />
            <StatCard
              title="Today's Cost"
              value={formatCurrency(today.cost)}
              subtext="Purchase cost of goods"
              icon={ShoppingBag}
              color="purple"
            />
            <StatCard
              title="Today's Net Profit"
              value={formatCurrency(today.profit)}
              subtext="Auto selling - purchase"
              icon={TrendingUp}
              color="emerald"
            />
          </div>
        </div>

        {/* WEEKLY & MONTHLY SUMMARY ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>7-Day Performance Aggregate</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-xs text-slate-400">Total Cases</p>
                <p className="text-xl font-extrabold text-white mt-0.5">{formatIndianNumber(week.cases)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Net Profit</p>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{formatCurrency(week.profit)}</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Monthly Performance Aggregate</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-xs text-slate-400">Total Revenue</p>
                <p className="text-xl font-extrabold text-white mt-0.5">{formatCurrency(month.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Net Profit</p>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{formatCurrency(month.profit)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RECHARTS TREND GRAPH & TOP SELLERS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart (2 Cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">7-Day Sales & Profit Trend</h3>
                <p className="text-xs text-slate-400">Revenue vs. Net Profit Comparison</p>
              </div>
              <div className="flex items-center space-x-4 text-xs font-semibold">
                <span className="flex items-center space-x-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span>Revenue</span>
                </span>
                <span className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Profit</span>
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#F8FAFC',
                      }}
                      formatter={(val) => [`₹${val}`, '']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  No sales data recorded yet. Create a sale order to view charts.
                </div>
              )}
            </div>
          </div>

          {/* Top Sellers (1 Col) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Top Best Sellers</h3>
            <p className="text-xs text-slate-400">By Cases Dispatched</p>

            <div className="space-y-3">
              {topSellers.length > 0 ? (
                topSellers.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">{item.name || `${item.flavor} (${item.bottleSize})`}</p>
                        <p className="text-[10px] text-slate-400">{formatIndianNumber(item.cases || item.totalCases)} Cases Sold</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {formatCurrency(item.profit || item.totalProfit)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-slate-500">
                  No sales recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
