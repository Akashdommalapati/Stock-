import React from 'react';
import { Menu, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuClick, title }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-white tracking-wide">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/new-sale')}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>New Sale</span>
        </button>
      </div>
    </header>
  );
}
