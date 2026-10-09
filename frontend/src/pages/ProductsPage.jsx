import React, { useState, useEffect } from 'react';
import ProductModal from '../components/ProductModal';
import { api } from '../api/axiosInstance';
import { formatCurrency, getStockBadge } from '../utils/formatters';
import { Plus, Search, Edit2, RefreshCw, Package } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ flavors: [], bottleSizes: [] });
  const [search, setSearch] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, settData] = await Promise.all([
        api.get('/products'),
        api.get('/products/settings'),
      ]);
      setProducts(prodData);
      setSettings(settData);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (formData) => {
    if (editingProduct) {
      await api.put(`/products/${editingProduct._id}`, formData);
    } else {
      await api.post('/products', formData);
    }
    await fetchData();
  };

  const handleAddFlavor = async (flavorName) => {
    await api.post('/products/flavors', { flavor: flavorName });
    const settData = await api.get('/products/settings');
    setSettings(settData);
  };

  const handleAddBottleSize = async (sizeName) => {
    await api.post('/products/bottle-sizes', { bottleSize: sizeName });
    const settData = await api.get('/products/settings');
    setSettings(settData);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.flavor.toLowerCase().includes(search.toLowerCase()) ||
      p.bottleSize.toLowerCase().includes(search.toLowerCase());
    const matchesFlavor = selectedFlavor === 'All' || p.flavor === selectedFlavor;
    return matchesSearch && matchesFlavor;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Beverage Product Master & Pricing</h2>
          <p className="text-xs text-slate-400">Manage case prices and profit margins per variant</p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Variant</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flavor or size..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedFlavor}
          onChange={(e) => setSelectedFlavor(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="All">All Flavors</option>
          {settings.flavors.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Product Variants Table */}
      {loading ? (
        <div className="flex justify-center p-12 text-slate-400 space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
          <span>Loading Variants...</span>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Variant (Flavor & Size)</th>
                  <th className="py-3.5 px-4 text-right">Purchase Price (₹/Case)</th>
                  <th className="py-3.5 px-4 text-right">Selling Price (₹/Case)</th>
                  <th className="py-3.5 px-4 text-right">Profit / Case</th>
                  <th className="py-3.5 px-4 text-center">Current Stock</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredProducts.map((p) => {
                  const badge = getStockBadge(p.currentStock, p.minStockCases);
                  const profit = p.profitPerCase ?? (p.sellingPricePerCase - p.purchasePricePerCase);

                  return (
                    <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-bold text-white flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm">
                          🥤
                        </div>
                        <div>
                          <p>{p.flavor}</p>
                          <p className="text-xs text-slate-400 font-normal">{p.bottleSize}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-slate-300">
                        {formatCurrency(p.purchasePricePerCase)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-amber-400">
                        {formatCurrency(p.sellingPricePerCase)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-emerald-400">
                        +{formatCurrency(profit)}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-white">
                        {p.currentStock} <span className="text-xs font-normal text-slate-400">Cases</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          title="Edit Pricing & Limits"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        product={editingProduct}
        flavors={settings.flavors}
        bottleSizes={settings.bottleSizes}
        onAddFlavor={handleAddFlavor}
        onAddBottleSize={handleAddBottleSize}
      />
    </div>
  );
}
