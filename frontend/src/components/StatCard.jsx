import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = 'cyan' }) {
  const colorStyles = {
    cyan: {
      bg: 'from-cyan-500/10 to-blue-600/5',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
    },
    emerald: {
      bg: 'from-emerald-500/10 to-teal-600/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
    blue: {
      bg: 'from-blue-500/10 to-indigo-600/5',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20 text-blue-400',
    },
    purple: {
      bg: 'from-purple-500/10 to-fuchsia-600/5',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      iconBg: 'bg-purple-500/20 text-purple-400',
    },
  };

  const style = colorStyles[color] || colorStyles.cyan;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${style.bg} border ${style.border} shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className={`text-2xl lg:text-3xl font-extrabold mt-1 tracking-tight text-white`}>
            {value}
          </h3>
          {subtext && (
            <p className="text-xs font-medium text-slate-400 mt-1">
              {subtext}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
