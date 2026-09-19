import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addTicketNote,
  getTicketStats,
  clearAllTickets,
} from '../controllers/ticketController.js';

const router = express.Router();

// Dashboard workload stats
router.get('/stats', getTicketStats);

// Ticket collection routes
router.route('/')
  .get(getTickets)
  .post(createTicket)
  .delete(clearAllTickets);

// Single ticket routes
router.route('/:ticket_id')
  .get(getTicketById)
  .put(updateTicket);

// Ticket notes route
router.post('/:ticket_id/notes', addTicketNote);

export default router;
