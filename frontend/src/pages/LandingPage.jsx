import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShieldCheck,
  Boxes,
  Zap,
  BarChart2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const flavorShowcase = [
  { name: 'Dew', color: 'from-cyan-400 to-blue-600', badge: 'Lemon-Lime Surge', sizes: '180ml, 200ml, 600ml' },
  { name: 'Mango', color: 'from-amber-400 to-orange-500', badge: 'Rich Pulp Rush', sizes: '200ml, 600ml, 1000ml' },
  { name: 'Pineapple', color: 'from-yellow-300 to-amber-500', badge: 'Tropical Punch', sizes: '180ml, 200ml, 600ml' },
  { name: 'Guava', color: 'from-pink-400 to-rose-600', badge: 'Sweet Nectar', sizes: '200ml, 600ml' },
  { name: 'Jeera', color: 'from-emerald-500 to-teal-700', badge: 'Spicy Masala Soda', sizes: '200ml, 600ml' },
  { name: 'Grape', color: 'from-purple-500 to-indigo-700', badge: 'Juicy Purple Fizz', sizes: '200ml, 600ml' },
  { name: 'Orange', color: 'from-orange-400 to-red-500', badge: 'Citrus Blast', sizes: '180ml, 200ml, 600ml' },
  { name: 'Lemon', color: 'from-yellow-400 to-lime-500', badge: 'Cloudy Refresh', sizes: '200ml, 600ml' },
  { name: 'Cola', color: 'from-slate-800 to-slate-950 border border-slate-700', badge: 'Classic Spark', sizes: '200ml, 600ml, 1000ml' },
  { name: 'Salt Soda', color: 'from-teal-400 to-cyan-600', badge: 'Sparkling Tonic', sizes: '200ml, 600ml' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      {/* Top Header Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
            🥤
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-wide">GODOWN MANAGER</h1>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Beverage Distribution System</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all transform hover:scale-105"
        >
          <span>Login to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built Specifically for Indian Beverage Wholesale Godowns</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Smart Stock.{' '}
            <span className="beverage-text-gradient">Smarter Profits.</span>
          </h1>

          <p className="text-base lg:text-lg text-slate-400 leading-relaxed font-normal">
            Take full command of your beverage godown. Manage case inventory, daily agency sales, auto-calculated profits per flavor, low-stock alerts, and instant printable GST bills in one seamless workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 font-black text-base shadow-2xl shadow-cyan-500/30 transition-all transform hover:-translate-y-1 text-center"
            >
              Open Owner Dashboard →
            </button>
            <a
              href="#flavors"
              className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm text-center transition-colors"
            >
              Explore Flavors & Sizes
            </a>
          </div>

          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80">
            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-xs text-slate-400">Stock Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">Auto ₹</p>
              <p className="text-xs text-slate-400">Profit Calculation</p>
            </div>
            <div>
              <p className="text-2xl font-black text-cyan-400">Zero</p>
              <p className="text-xs text-slate-400">Negative Stock</p>
            </div>
          </div>
        </div>

        {/* HERO WAREHOUSE SVG & CSS VISUAL */}
        <div className="lg:w-1/2 relative w-full flex justify-center items-center">
          <div className="relative w-full max-w-lg aspect-square rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Ambient Backlight Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Stat Ribbon */}
            <div className="flex justify-between items-center z-10">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Godown Status: Ready</span>
              </span>
              <span className="text-xs text-cyan-400 font-semibold">12 Default Flavors Ready</span>
            </div>

            {/* Warehouse Stack Illustration (SVG) */}
            <div className="my-auto py-6 z-10">
              <svg viewBox="0 0 500 320" className="w-full h-auto drop-shadow-2xl">
                {/* Racks & Shelves */}
                <rect x="20" y="270" width="460" height="15" fill="#334155" rx="4" />
                <rect x="20" y="160" width="460" height="12" fill="#334155" rx="4" />
                <rect x="20" y="50" width="460" height="12" fill="#334155" rx="4" />
                <rect x="40" y="50" width="12" height="235" fill="#475569" />
                <rect x="240" y="50" width="12" height="235" fill="#475569" />
                <rect x="440" y="50" width="12" height="235" fill="#475569" />

                {/* Bottom Pallet with Crates */}
                <rect x="65" y="225" width="70" height="45" rx="6" fill="#06B6D4" />
                <rect x="70" y="230" width="60" height="10" fill="#38BDF8" rx="3" />
                <text x="76" y="258" fill="#FFF" fontSize="12" fontWeight="bold">DEW 200</text>

                <rect x="145" y="225" width="70" height="45" rx="6" fill="#10B981" />
                <rect x="150" y="230" width="60" height="10" fill="#34D399" rx="3" />
                <text x="152" y="258" fill="#FFF" fontSize="12" fontWeight="bold">MANGO</text>

                <rect x="265" y="225" width="70" height="45" rx="6" fill="#EC4899" />
                <text x="272" y="258" fill="#FFF" fontSize="12" fontWeight="bold">GUAVA</text>

                <rect x="345" y="225" width="70" height="45" rx="6" fill="#8B5CF6" />
                <text x="352" y="258" fill="#FFF" fontSize="12" fontWeight="bold">GRAPE</text>

                {/* Middle Shelf Crates */}
                <rect x="65" y="115" width="70" height="45" rx="6" fill="#E5D000" />
                <text x="73" y="148" fill="#1E293B" fontSize="12" fontWeight="bold">LEMON</text>

                <rect x="145" y="115" width="70" height="45" rx="6" fill="#FF6B00" />
                <text x="151" y="148" fill="#FFF" fontSize="12" fontWeight="bold">ORANGE</text>

                <rect x="265" y="115" width="70" height="45" rx="6" fill="#1E1B18" stroke="#475569" strokeWidth="2" />
                <text x="278" y="148" fill="#FFF" fontSize="12" fontWeight="bold">COLA</text>

                <rect x="345" y="115" width="70" height="45" rx="6" fill="#00D26A" />
                <text x="352" y="148" fill="#FFF" fontSize="12" fontWeight="bold">JEERA</text>

                {/* Forklift / Delivery Van Visual Badge */}
                <g transform="translate(320, 275)">
                  <rect x="0" y="0" width="130" height="35" rx="6" fill="#06B6D4" />
                  <circle cx="25" cy="35" r="10" fill="#1E293B" />
                  <circle cx="105" cy="35" r="10" fill="#1E293B" />
                  <text x="15" y="22" fill="#000" fontSize="11" fontWeight="extrabold">DELIVERY TRUCK</text>
                </g>
              </svg>
            </div>

            {/* Bottom Live Metrics Pill */}
            <div className="grid grid-cols-2 gap-3 z-10 border-t border-slate-800/80 pt-4">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Inventory Control</p>
                <p className="text-lg font-bold text-cyan-400">Cases Managed</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Profit Calculations</p>
                <p className="text-lg font-bold text-emerald-400">Auto Computed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLAVOR SHOWCASE SECTION */}
      <section id="flavors" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-3 mb-12">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Beverage Catalog
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-white">
            Supported Flavors & Bottle Sizes
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Manage every variant in your inventory with custom purchase and selling prices per case.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {flavorShowcase.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-xl shadow-md mb-3`}>
                🥤
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-[11px] font-semibold text-cyan-400/90 mt-0.5">{item.badge}</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Sizes: {item.sizes}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION ("What you can do") */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-3 mb-16">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Features Built For Operations
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-white">
            Everything Your Godown Needs
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Stock Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto formula: Current Stock = Opening Stock + Received − Sold ± Adjustments. Green, orange, and red stock status badges give total clarity.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Auto Profit Calculations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Profit per case is automatically computed on every sale (`selling − purchase`). Track total daily, weekly, and monthly net profit live.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Strict Stock Blocking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prevents negative inventory. If an order line exceeds available cases in the godown, saving is blocked with explicit alerts.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Agency & Customer History</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Store agency details by town. View individual agency order history, total spend, and top-purchased beverage flavors over time.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Reports & CSV Exports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate daily, weekly, and monthly sales reports with Recharts trend lines. Export all stock and order metrics to CSV with one click.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Printable Bill Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly preview and print clean, professional delivery invoices for agencies upon saving a sale order.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 Godown Stock & Sales Manager. Designed for Indian Beverage Wholesale & Distribution.</p>
      </footer>
    </div>
  );
}
