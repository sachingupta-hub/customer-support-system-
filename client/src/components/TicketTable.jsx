import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Inbox, Calendar, User, Mail, MessageSquare } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function TicketTable({ tickets, isLoading }) {
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium text-slate-500">Loading tickets...</p>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">No Tickets Found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
          There are no tickets matching your search query or filter. Try clearing filters or create a new ticket.
        </p>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
        >
          Create First Ticket
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Ticket ID</th>
              <th className="py-3.5 px-4 sm:px-6">Customer</th>
              <th className="py-3.5 px-4 sm:px-6">Subject & Issue</th>
              <th className="py-3.5 px-4 sm:px-6">Status</th>
              <th className="py-3.5 px-4 sm:px-6">Date</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.map((ticket) => (
              <tr
                key={ticket._id || ticket.ticket_id}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                {/* Ticket ID */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <Link
                    to={`/tickets/${ticket.ticket_id}`}
                    className="inline-block font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-2.5 py-1 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                  >
                    {ticket.ticket_id}
                  </Link>
                </td>

                {/* Customer */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {ticket.customer_name}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {ticket.customer_email}
                    </span>
                  </div>
                </td>

                {/* Subject & Description Snippet */}
                <td className="py-4 px-4 sm:px-6 max-w-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 line-clamp-1">
                      {ticket.subject}
                    </span>
                    <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {ticket.description}
                    </span>
                    {ticket.notes && ticket.notes.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-indigo-500 font-medium mt-1">
                        <MessageSquare className="w-3 h-3" />
                        {ticket.notes.length} {ticket.notes.length === 1 ? 'note' : 'notes'}
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Date */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>
                </td>

                {/* Action Link */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                  <Link
                    to={`/tickets/${ticket.ticket_id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-indigo-600 hover:underline"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
