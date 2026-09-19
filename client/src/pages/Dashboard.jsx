import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCards from '../components/StatsCards';
import SearchAndFilter from '../components/SearchAndFilter';
import TicketTable from '../components/TicketTable';
import { fetchTickets, fetchTicketStats } from '../services/api';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load ticket statistics
  const loadStats = useCallback(async () => {
    try {
      const data = await fetchTicketStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Load tickets matching search & status
  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTickets({ search, status });
      setTickets(data);
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  }, [search, status]);

  // Load stats once and reload on ticket changes
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Debounced search / status filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTickets();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadTickets]);

  const handleStatusFilterChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
  };

  const handleRefresh = () => {
    loadStats();
    loadTickets();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Support Tickets Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor, track, and resolve customer queries across all channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh Data"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs hover:border-slate-300 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Ticket</span>
          </Link>
        </div>
      </div>

      {/* Bonus Feature: Real-time Workload Statistics */}
      <StatsCards
        stats={stats}
        activeStatus={status}
        onSelectStatus={handleStatusFilterChange}
      />

      {/* Search & Filter Controls */}
      <SearchAndFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        totalCount={tickets.length}
        onReset={handleResetFilters}
      />

      {/* Error alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Error Loading Tickets</h4>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Tickets List Table */}
      <TicketTable tickets={tickets} isLoading={isLoading} />
    </div>
  );
}
