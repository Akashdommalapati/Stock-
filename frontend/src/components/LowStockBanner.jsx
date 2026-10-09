import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LowStockBanner({ lowStockItems = [] }) {
  const navigate = useNavigate();

  if (!lowStockItems || lowStockItems.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-950/80 via-amber-950/40 to-red-950/80 border border-red-500/40 p-4 lg:p-5 shadow-xl shadow-red-950/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-red-200">
              Low Stock Alert ({lowStockItems.length} Variants Below Minimum Limit)
            </h4>
            <p className="text-xs text-red-300/80 mt-0.5">
              Stock levels for{' '}
              <span className="font-semibold text-white">
                {lowStockItems.slice(0, 3).map((item) => `${item.flavor} (${item.bottleSize})`).join(', ')}
                {lowStockItems.length > 3 ? ` and ${lowStockItems.length - 3} more` : ''}
              </span>{' '}
              are critically low. Receive stock intake to avoid delivery delays.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/stock')}
          className="self-start sm:self-center flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all shrink-0"
        >
          <span>Manage Stock</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
