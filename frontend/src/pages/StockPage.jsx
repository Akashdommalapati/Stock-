import React, { useState, useEffect } from 'react';
import StockModal from '../components/StockModal';
import LowStockBanner from '../components/LowStockBanner';
import { api } from '../api/axiosInstance';
import { formatDate, getStockBadge } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCsv';
import {
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  SlidersHorizontal,
  RefreshCw,
  Download,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'receive' | 'adjust' | null
  const [filterType, setFilterType] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, movs, alerts] = await Promise.all([
        api.get('/products'),
        api.get('/stock/movements'),
        api.get('/stock/low-alerts'),
      ]);
      setProducts(prods);
      setMovements(movs);
      setLowStockAlerts(alerts);
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReceiveStock = async (data) => {
    await api.post('/stock/receive', data);
    await fetchData();
  };

  const handleAdjustStock = async (data) => {
    await api.post('/stock/adjust', data);
    await fetchData();
  };

  const handleExportCSV = () => {
    const csvData = products.map((p) => ({
      Flavor: p.flavor,
      BottleSize: p.bottleSize,
      CurrentStock: p.currentStock,
      MinStockLimit: p.minStockCases,
      Status: getStockBadge(p.currentStock, p.minStockCases).label,
      PurchasePrice: p.purchasePricePerCase,
      SellingPrice: p.sellingPricePerCase,
    }));
    exportToCSV(csvData, 'godown_stock_report.csv');
  };

  const filteredMovements = movements.filter((m) => {
    if (filterType === 'ALL') return true;
    return m.type === filterType;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Stock & Inventory Controls</h2>
          <p className="text-xs text-slate-400">Track physical case counts, intake receipts & audit logs</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Stock CSV</span>
          </button>

          <button
            onClick={() => setModalMode('adjust')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-sm border border-amber-500/30 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Adjust Stock</span>
          </button>

          <button
            onClick={() => setModalMode('receive')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Receive Stock Intake</span>
          </button>
        </div>
      </div>

      {/* Low Stock Banner */}
      <LowStockBanner lowStockItems={lowStockAlerts} />

      {/* CURRENT STOCK TABLE */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Boxes className="w-5 h-5 text-amber-400" />
          <span>Current Product Stock Levels</span>
        </h3>

        {loading ? (
          <div className="flex justify-center p-12 text-slate-400 space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
            <span>Loading Inventory...</span>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Variant (Flavor & Size)</th>
                    <th className="py-3.5 px-4 text-center">Opening Stock</th>
                    <th className="py-3.5 px-4 text-center">Min Stock Level</th>
                    <th className="py-3.5 px-4 text-center">Current Stock</th>
                    <th className="py-3.5 px-4 text-center">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {products.map((p) => {
                    const badge = getStockBadge(p.currentStock, p.minStockCases);
                    return (
                      <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm">
                            🥤
                          </div>
                          <div>
                            <p>{p.flavor}</p>
                            <p className="text-xs text-slate-400 font-normal">{p.bottleSize}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                          {p.openingStock} Cases
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                          {p.minStockCases} Cases
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-white text-base">
                          {p.currentStock} <span className="text-xs font-normal text-slate-400">Cases</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
                            <span>{badge.label}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* STOCK MOVEMENT HISTORY LOG */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Stock Movement Logs & Audit History</span>
          </h3>

          <div className="flex items-center space-x-2">
            {['ALL', 'RECEIVED', 'SOLD', 'ADJUSTMENT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Product Variant</th>
                  <th className="py-3.5 px-4 text-right">Cases (+/−)</th>
                  <th className="py-3.5 px-4">Reason / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      No stock movement records found.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-400">
                        {formatDate(m.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                            m.type === 'RECEIVED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : m.type === 'SOLD'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}
                        >
                          {m.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {m.product?.flavor || 'Variant'} ({m.product?.bottleSize || '-'})
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-extrabold ${
                          m.cases > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {m.cases > 0 ? `+${m.cases}` : m.cases} Cases
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {m.reason || m.reference || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stock Modal */}
      <StockModal
        mode={modalMode === 'receive' ? 'receive' : 'adjust'}
        products={products}
        isOpen={!!modalMode}
        onClose={() => setModalMode(null)}
        onSubmit={modalMode === 'receive' ? handleReceiveStock : handleAdjustStock}
      />
    </div>
  );
}
