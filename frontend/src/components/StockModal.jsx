import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

export default function StockModal({ mode = 'receive', products = [], isOpen, onClose, onSubmit }) {
  const [productId, setProductId] = useState('');
  const [cases, setCases] = useState('');
  const [isAddition, setIsAddition] = useState(mode === 'receive');
  const [reason, setReason] = useState('Damaged');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!productId) {
      setError('Please select a beverage variant.');
      return;
    }
    if (!cases || Number(cases) <= 0) {
      setError('Please enter a valid number of cases.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'receive') {
        await onSubmit({ productId, cases: Number(cases), note });
      } else {
        await onSubmit({ productId, cases: Number(cases), isAddition, reason, note });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p._id === productId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>{mode === 'receive' ? '📦 Receive Stock Intake' : '⚖️ Adjust Product Stock'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
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
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Select Variant
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              required
            >
              <option value="">-- Select Flavor & Bottle Size --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.flavor} ({p.bottleSize}) - Current: {p.currentStock} Cases
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex justify-between items-center text-xs">
              <span className="text-slate-400">Current Stock:</span>
              <span className="font-bold text-cyan-400">{selectedProduct.currentStock} Cases</span>
            </div>
          )}

          {mode === 'adjust' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Adjustment Type
                </label>
                <select
                  value={isAddition ? 'add' : 'deduct'}
                  onChange={(e) => setIsAddition(e.target.value === 'add')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="add">+ Add Stock (Correction)</option>
                  <option value="deduct">- Deduct Stock (Damage/Correction)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="Damaged">Damaged Bottles</option>
                  <option value="Correction">Inventory Correction</option>
                  <option value="Expired">Expired Stock</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Number of Cases
            </label>
            <input
              type="number"
              min="1"
              value={cases}
              onChange={(e) => setCases(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Note / Reference (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={mode === 'receive' ? 'e.g. Truck AP16 XY 1234' : 'e.g. Broken in transport'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
            />
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
              {loading ? 'Saving...' : mode === 'receive' ? 'Receive Stock' : 'Submit Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
