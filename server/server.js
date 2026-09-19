import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import ticketRoutes from './routes/ticketRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Datastraw Customer Support CRM API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Mount Ticket Routes
app.use('/api/tickets', ticketRoutes);

// Root greeting endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Datastraw Customer Support Ticketing CRM API',
    endpoints: {
      health: 'GET /api/health',
      tickets: 'GET /api/tickets',
      createTicket: 'POST /api/tickets',
      ticketDetails: 'GET /api/tickets/:ticket_id',
      updateTicket: 'PUT /api/tickets/:ticket_id',
      addNote: 'POST /api/tickets/:ticket_id/notes',
      stats: 'GET /api/tickets/stats',
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Datastraw CRM Server running on port ${PORT}`);
  console.log(`📍 API Base: http://localhost:${PORT}/api/tickets`);
});
