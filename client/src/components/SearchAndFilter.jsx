import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

export default function SearchAndFilter({
  search,
  setSearch,
  status,
  setStatus,
  totalCount,
  onReset,
}) {
  const isFiltered = search.trim() !== '' || status !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search Box */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ticket ID, customer name, email, or issue..."
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter and Count Row */}
      <div className="flex items-center gap-3">
        {/* Status Dropdown */}
        <div className="relative flex items-center min-w-[150px]">
          <div className="absolute left-3 pointer-events-none text-slate-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer transition-all appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            title="Reset Filters"
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {/* Count Pill */}
        <div className="px-3 py-2 text-xs font-medium text-slate-500 bg-slate-100 rounded-lg whitespace-nowrap">
          <span className="font-bold text-slate-800">{totalCount}</span> {totalCount === 1 ? 'ticket' : 'tickets'}
        </div>
      </div>
    </div>
  );
}
