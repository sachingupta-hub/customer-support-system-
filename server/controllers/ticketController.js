import Ticket from '../models/Ticket.js';
import Counter from '../models/Counter.js';

// Helper function to get next sequential ticket ID
const getNextTicketId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: 'ticket_id' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `TKT-${String(counter.seq).padStart(3, '0')}`;
};

// @desc    Create a new ticket
// @route   POST /api/tickets
export const createTicket = async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description } = req.body;

    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer_name, customer_email, subject, and description.',
      });
    }

    const ticket_id = await getNextTicketId();

    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
      status: 'Open',
      notes: [],
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating ticket',
    });
  }
};

// @desc    Get all tickets with optional search and status filter
// @route   GET /api/tickets
export const getTickets = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    // Filter by status if provided and not 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Search across ticket_id, customer_name, customer_email, subject, description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { ticket_id: searchRegex },
        { customer_name: searchRegex },
        { customer_email: searchRegex },
        { subject: searchRegex },
        { description: searchRegex },
      ];
    }

    const tickets = await Ticket.find(filter).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching tickets',
    });
  }
};

// @desc    Get single ticket by ticket_id (e.g. TKT-001) or _id
// @route   GET /api/tickets/:ticket_id
export const getTicketById = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    // Search by custom ticket_id or Mongo ObjectId
    const query = {
      $or: [
        { ticket_id: ticket_id.toUpperCase() },
        { ticket_id: ticket_id },
      ],
    };

    if (ticket_id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: ticket_id });
    }

    const ticket = await Ticket.findOne(query);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with ID "${ticket_id}" not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching ticket details',
    });
  }
};

// @desc    Update ticket status and details
// @route   PUT /api/tickets/:ticket_id
export const updateTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status, subject, description, note_text } = req.body;

    const query = {
      $or: [
        { ticket_id: ticket_id.toUpperCase() },
        { ticket_id: ticket_id },
      ],
    };

    if (ticket_id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: ticket_id });
    }

    const ticket = await Ticket.findOne(query);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with ID "${ticket_id}" not found`,
      });
    }

    // Update status if provided and valid
    if (status) {
      if (!['Open', 'In Progress', 'Closed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be Open, In Progress, or Closed',
        });
      }
      ticket.status = status;
    }

    if (subject) ticket.subject = subject;
    if (description) ticket.description = description;

    // If an optional note is supplied in the update payload
    if (note_text && note_text.trim() !== '') {
      ticket.notes.push({
        note_text: note_text.trim(),
        created_at: new Date(),
      });
    }

    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating ticket',
    });
  }
};

// @desc    Add a note/comment to a ticket
// @route   POST /api/tickets/:ticket_id/notes
export const addTicketNote = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { note_text } = req.body;

    if (!note_text || note_text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note text cannot be empty',
      });
    }

    const query = {
      $or: [
        { ticket_id: ticket_id.toUpperCase() },
        { ticket_id: ticket_id },
      ],
    };

    if (ticket_id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: ticket_id });
    }

    const ticket = await Ticket.findOne(query);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with ID "${ticket_id}" not found`,
      });
    }

    const newNote = {
      note_text: note_text.trim(),
      created_at: new Date(),
    };

    ticket.notes.push(newNote);
    await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Error adding note to ticket:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while adding note',
    });
  }
};

// @desc    Get dashboard workload stats (Total, Open, In Progress, Closed)
// @route   GET /api/tickets/stats
export const getTicketStats = async (req, res) => {
  try {
    const [total, open, inProgress, closed] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'Open' }),
      Ticket.countDocuments({ status: 'In Progress' }),
      Ticket.countDocuments({ status: 'Closed' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        open,
        inProgress,
        closed,
      },
    });
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching stats',
    });
  }
};

// @desc    Clear all tickets and reset counter sequence
// @route   DELETE /api/tickets
export const clearAllTickets = async (req, res) => {
  try {
    const deleteResult = await Ticket.deleteMany({});
    await Counter.deleteMany({});

    res.status(200).json({
      success: true,
      message: `Database cleaned successfully. Removed ${deleteResult.deletedCount} tickets. Next ticket will start at TKT-001.`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing tickets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while clearing tickets',
    });
  }
};
