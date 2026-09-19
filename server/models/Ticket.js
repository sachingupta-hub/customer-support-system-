import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    note_text: {
      type: String,
      required: [true, 'Note text is required'],
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer_name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customer_email: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    subject: {
      type: String,
      required: [true, 'Subject/Issue title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open',
      index: true,
    },
    notes: [noteSchema],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Search text index for full-text search fallback / high performance
ticketSchema.index({
  customer_name: 'text',
  ticket_id: 'text',
  customer_email: 'text',
  subject: 'text',
  description: 'text',
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
