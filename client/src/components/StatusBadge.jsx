import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  const getBadgeStyle = (currentStatus) => {
    switch (currentStatus) {
      case 'Open':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
          dot: 'bg-blue-500',
        };
      case 'Closed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
          dot: 'bg-emerald-500',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200 ring-gray-500/20',
          dot: 'bg-gray-400',
        };
    }
  };

  const style = getBadgeStyle(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 font-medium ${style.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status || 'Unknown'}
    </span>
  );
}
