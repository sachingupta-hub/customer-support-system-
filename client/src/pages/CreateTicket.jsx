import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { createTicket } from '../services/api';

export default function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic frontend validations
    if (!formData.customer_name.trim()) {
      setErrorMessage('Please enter the customer name.');
      return;
    }
    if (!formData.customer_email.trim() || !formData.customer_email.includes('@')) {
      setErrorMessage('Please provide a valid customer email address.');
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage('Please enter an issue title/subject.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Please provide a description of the issue.');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await createTicket(formData);
      setSuccessInfo(created);

      // Auto redirect after 1.5 seconds to newly created ticket
      setTimeout(() => {
        navigate(`/tickets/${created.ticket_id}`);
      }, 1400);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-100 p-6 sm:p-8 bg-gradient-to-r from-slate-50 to-indigo-50/20">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Create Support Ticket
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the customer information and incident details. A sequential Ticket ID (e.g. TKT-001) will be generated automatically.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold">Submission Failed:</span> {errorMessage}
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successInfo && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">
                  Ticket <span className="font-mono underline">{successInfo.ticket_id}</span> generated successfully!
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Redirecting to ticket details...
                </p>
              </div>
            </div>
          )}

          {/* Customer Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="customer_name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                required
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="customer_email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Customer Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="customer_email"
                name="customer_email"
                type="email"
                required
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="e.g. rahul@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Issue Title / Subject */}
          <div>
            <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Issue Title / Subject <span className="text-rose-500">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Payment Failed, Login Error, Delivery Delay"
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Issue Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what the customer reported in detail..."
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
            />
          </div>

          {/* Information Notice */}
          <div className="flex items-center gap-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs text-indigo-700">
            <HelpCircle className="w-4 h-4 shrink-0 text-indigo-500" />
            <span>
              Initial status will automatically be set to <strong>Open</strong>. You can update status and add notes after creation.
            </span>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/"
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-95 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Create Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
