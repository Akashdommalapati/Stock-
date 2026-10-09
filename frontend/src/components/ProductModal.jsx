import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  flavors = [],
  bottleSizes = [],
  onAddFlavor,
  onAddBottleSize,
}) {
  const [flavor, setFlavor] = useState('');
  const [bottleSize, setBottleSize] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [minStock, setMinStock] = useState('10');
  const [openingStock, setOpeningStock] = useState('0');
  const [newFlavorInput, setNewFlavorInput] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [showAddFlavor, setShowAddFlavor] = useState(false);
  const [showAddSize, setShowAddSize] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFlavor(product.flavor || '');
      setBottleSize(product.bottleSize || '');
      setPurchasePrice(product.purchasePricePerCase || '');
      setSellingPrice(product.sellingPricePerCase || '');
      setMinStock(product.minStockCases || '10');
      setOpeningStock(product.openingStock || '0');
    } else {
      setFlavor(flavors[0] || 'Dew');
      setBottleSize(bottleSizes[0] || '200 ml');
      setPurchasePrice('');
      setSellingPrice('');
      setMinStock('10');
      setOpeningStock('0');
    }
  }, [product, flavors, bottleSizes, isOpen]);

  if (!isOpen) return null;

  const liveProfit = (Number(sellingPrice) || 0) - (Number(purchasePrice) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!flavor || !bottleSize) {
      setError('Flavor and bottle size are required.');
      return;
    }
    if (Number(purchasePrice) < 0 || Number(sellingPrice) < 0) {
      setError('Prices cannot be negative.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        flavor,
        bottleSize,
        purchasePricePerCase: Number(purchasePrice),
        sellingPricePerCase: Number(sellingPrice),
        minStockCases: Number(minStock) || 10,
        openingStock: Number(openingStock) || 0,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Saving product failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewFlavor = async () => {
    if (!newFlavorInput.trim()) return;
    await onAddFlavor(newFlavorInput.trim());
    setFlavor(newFlavorInput.trim());
    setNewFlavorInput('');
    setShowAddFlavor(false);
  };

  const handleAddNewSize = async () => {
    if (!newSizeInput.trim()) return;
    await onAddBottleSize(newSizeInput.trim());
    setBottleSize(newSizeInput.trim());
    setNewSizeInput('');
    setShowAddSize(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white">
            {product ? '✏️ Edit Product Pricing' : '✨ Add New Product Variant'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Flavor Selection */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Beverage Flavor
              </label>
              {!product && (
                <button
                  type="button"
                  onClick={() => setShowAddFlavor(!showAddFlavor)}
                  className="text-xs text-cyan-400 font-semibold hover:underline"
                >
                  + Add New Flavor
                </button>
              )}
            </div>

            {showAddFlavor ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFlavorInput}
                  onChange={(e) => setNewFlavorInput(e.target.value)}
                  placeholder="e.g. Lychee"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddNewFlavor}
                  className="px-3 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Add
                </button>
              </div>
            ) : (
              <select
                value={flavor}
                disabled={!!product}
                onChange={(e) => setFlavor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-60"
              >
                {flavors.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Bottle Size */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Bottle Size (Volume)
              </label>
              {!product && (
                <button
                  type="button"
                  onClick={() => setShowAddSize(!showAddSize)}
                  className="text-xs text-cyan-400 font-semibold hover:underline"
                >
                  + Add New Size
                </button>
              )}
            </div>

            {showAddSize ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSizeInput}
                  onChange={(e) => setNewSizeInput(e.target.value)}
                  placeholder="e.g. 1250 ml"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddNewSize}
                  className="px-3 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Add
                </button>
              </div>
            ) : (
              <select
                value={bottleSize}
                disabled={!!product}
                onChange={(e) => setBottleSize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-60"
              >
                {bottleSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Purchase Price (₹/Case)
              </label>
              <input
                type="number"
                min="0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="e.g. 400"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Selling Price (₹/Case)
              </label>
              <input
                type="number"
                min="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="e.g. 420"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Live Profit Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-600/5 to-slate-800 border border-emerald-500/30 flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-400">Auto Profit Per Case:</span>
            <span className={`text-base font-extrabold ${liveProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(liveProfit)}
            </span>
          </div>

          {/* Min Stock & Opening Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Min Stock Limit (Cases)
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {!product && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Opening Stock (Cases)
                </label>
                <input
                  type="number"
                  min="0"
                  value={openingStock}
                  onChange={(e) => setOpeningStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? 'Saving...' : product ? 'Update Variant' : 'Create Variant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
