import React from 'react';
import { Layers, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function StatsCards({ stats, activeStatus, onSelectStatus }) {
  const cards = [
    {
      label: 'Total Tickets',
      value: stats?.total ?? 0,
      filterKey: 'All',
      icon: Layers,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50/50',
      border: 'border-slate-200',
      ringColor: 'ring-indigo-500',
    },
    {
      label: 'Open',
      value: stats?.open ?? 0,
      filterKey: 'Open',
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50/40',
      border: 'border-amber-100',
      ringColor: 'ring-amber-500',
    },
    {
      label: 'In Progress',
      value: stats?.inProgress ?? 0,
      filterKey: 'In Progress',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50/40',
      border: 'border-blue-100',
      ringColor: 'ring-blue-500',
    },
    {
      label: 'Closed',
      value: stats?.closed ?? 0,
      filterKey: 'Closed',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/40',
      border: 'border-emerald-100',
      ringColor: 'ring-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatus === card.filterKey;

        return (
          <button
            key={card.label}
            type="button"
            onClick={() => onSelectStatus(card.filterKey)}
            className={`flex items-center justify-between p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              card.border
            } ${card.bg} ${
              isSelected
                ? `ring-2 ${card.ringColor} shadow-md shadow-indigo-100 bg-white`
                : 'hover:shadow-sm hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${card.color} bg-white shadow-xs border border-slate-100`}>
              <Icon className="w-5 h-5" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
