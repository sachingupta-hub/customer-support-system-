import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  FileText,
  MessageSquare,
  Plus,
  Check,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { fetchTicketById, updateTicket, addTicketNote } from '../services/api';

export default function TicketDetails() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status update state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  // Notes state
  const [noteText, setNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteError, setNoteError] = useState(null);

  const loadTicket = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTicketById(ticketId);
      setTicket(data);
      setSelectedStatus(data.status);
    } catch (err) {
      setError(err.message || `Could not find ticket ${ticketId}`);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  // Handle changing ticket status
  const handleStatusChange = async (newStatus) => {
    if (newStatus === ticket.status) return;
    try {
      setIsUpdatingStatus(true);
      setStatusSuccess(false);
      const updated = await updateTicket(ticketId, { status: newStatus });
      setTicket(updated);
      setSelectedStatus(updated.status);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 2500);
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle adding a new internal note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      setIsSubmittingNote(true);
      setNoteError(null);
      const updated = await addTicketNote(ticketId, noteText.trim());
      setTicket(updated);
      setNoteText('');
    } catch (err) {
      setNoteError(err.message || 'Failed to add note');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoString));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Ticket Not Found</h3>
          <p className="text-sm text-slate-500 mb-6">{error || 'The requested ticket does not exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Created on {formatDate(ticket.created_at)}</span>
        </div>
      </div>

      {/* Main Ticket Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-base font-extrabold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg tracking-wide">
                {ticket.ticket_id}
              </span>
              <StatusBadge status={ticket.status} size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {ticket.subject}
            </h1>
          </div>

          {/* Interactive Status Changer */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-2 min-w-[240px]">
            <div className="flex items-center justify-between">
              <label htmlFor="status-select" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Update Status
              </label>
              {statusSuccess && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold animate-fade-in">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <div className="relative">
              <select
                id="status-select"
                value={selectedStatus}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 appearance-none pr-8"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400 text-xs">▼</div>
            </div>
          </div>
        </div>

        {/* Info Grid: Customer Details & Issue Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Customer Profile */}
          <div className="md:col-span-1 bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Customer Name</p>
                  <p className="text-sm font-semibold text-slate-900">{ticket.customer_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Email Address</p>
                  <a
                    href={`mailto:${ticket.customer_email}`}
                    className="text-sm font-medium text-indigo-600 hover:underline break-all"
                  >
                    {ticket.customer_email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Last Activity</p>
                  <p className="text-xs font-medium text-slate-700">{formatDate(ticket.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Full Issue Description</span>
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Activity Log Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Support Notes & Updates
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {ticket.notes?.length || 0} {ticket.notes?.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {/* Notes Timeline List */}
        {ticket.notes && ticket.notes.length > 0 ? (
          <div className="space-y-4">
            {ticket.notes.map((note, index) => (
              <div
                key={note._id || index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    Support Team Agent
                  </span>
                  <span>{formatDate(note.created_at)}</span>
                </div>
                <p className="text-sm text-slate-800 whitespace-pre-wrap">{note.note_text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
            <p className="text-xs font-medium text-slate-400">
              No notes added yet. Add internal remarks or updates below.
            </p>
          </div>
        )}

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="pt-2 space-y-3">
          <label htmlFor="note_input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Add New Note / Comment
          </label>

          {noteError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {noteError}
            </div>
          )}

          <div className="space-y-3">
            <textarea
              id="note_input"
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Customer contacted via phone, refund initiated, pending payment gateway confirmation..."
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingNote || !noteText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {isSubmittingNote ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding Note...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
