const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all tickets with optional search query and status filter
 * @param {Object} params
 * @param {string} params.search - Search string for ticket ID, customer, email, subject, description
 * @param {string} params.status - 'All' | 'Open' | 'In Progress' | 'Closed'
 */
export async function fetchTickets({ search = '', status = 'All' } = {}) {
  const query = new URLSearchParams();
  if (search.trim()) query.append('search', search.trim());
  if (status && status !== 'All') query.append('status', status);

  const res = await fetch(`${API_BASE_URL}/tickets?${query.toString()}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch tickets');
  }
  return json.data || [];
}

/**
 * Fetch dashboard workload statistics (Total, Open, In Progress, Closed)
 */
export async function fetchTicketStats() {
  const res = await fetch(`${API_BASE_URL}/tickets/stats`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch ticket stats');
  }
  return json.data;
}

/**
 * Fetch single ticket details by ticket_id (e.g. TKT-001)
 * @param {string} ticketId
 */
export async function fetchTicketById(ticketId) {
  const res = await fetch(`${API_BASE_URL}/tickets/${encodeURIComponent(ticketId)}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Failed to fetch ticket ${ticketId}`);
  }
  return json.data;
}

/**
 * Create a new customer support ticket
 * @param {Object} ticketData
 * @param {string} ticketData.customer_name
 * @param {string} ticketData.customer_email
 * @param {string} ticketData.subject
 * @param {string} ticketData.description
 */
export async function createTicket(ticketData) {
  const res = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to create ticket');
  }
  return json.data;
}

/**
 * Update ticket status or other details
 * @param {string} ticketId
 * @param {Object} updateData
 * @param {string} [updateData.status] - 'Open' | 'In Progress' | 'Closed'
 * @param {string} [updateData.note_text] - optional note to add concurrently
 */
export async function updateTicket(ticketId, updateData) {
  const res = await fetch(`${API_BASE_URL}/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to update ticket');
  }
  return json.data;
}

/**
 * Add a new internal support note to a ticket
 * @param {string} ticketId
 * @param {string} noteText
 */
export async function addTicketNote(ticketId, noteText) {
  const res = await fetch(`${API_BASE_URL}/tickets/${encodeURIComponent(ticketId)}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note_text: noteText }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to add note');
  }
  return json.data;
}
