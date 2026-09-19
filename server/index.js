const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  issueTitle: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  notes: [{ body: String, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true })
const Ticket = mongoose.model('Ticket', ticketSchema)
let memoryTickets = []

app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'customer-support-ticketing-crm' }))

app.get('/api/tickets', async (_request, response) => {
  if (mongoose.connection.readyState === 1) return response.json(await Ticket.find().sort({ createdAt: -1 }))
  response.json(memoryTickets)
})

app.post('/api/tickets', async (request, response) => {
  const { customerName, customerEmail, issueTitle, description } = request.body
  if (!customerName || !customerEmail || !issueTitle) return response.status(400).json({ message: 'Customer name, email, and issue title are required.' })
  const nextId = `TKT-${String((mongoose.connection.readyState === 1 ? await Ticket.countDocuments() : memoryTickets.length) + 1).padStart(3, '0')}`
  const data = { ticketId: nextId, customerName, customerEmail, issueTitle, description, status: 'Open', notes: [] }
  const ticket = mongoose.connection.readyState === 1 ? await Ticket.create(data) : data
  if (mongoose.connection.readyState !== 1) memoryTickets.unshift(ticket)
  response.status(201).json(ticket)
})

app.patch('/api/tickets/:id', async (request, response) => {
  const { status, note } = request.body
  if (mongoose.connection.readyState === 1) {
    const ticket = await Ticket.findOneAndUpdate({ ticketId: request.params.id }, { ...(status && { status }), ...(note && { $push: { notes: { body: note } } }) }, { new: true })
    return ticket ? response.json(ticket) : response.status(404).json({ message: 'Ticket not found.' })
  }
  const ticket = memoryTickets.find((item) => item.ticketId === request.params.id)
  if (!ticket) return response.status(404).json({ message: 'Ticket not found.' })
  if (status) ticket.status = status
  if (note) ticket.notes.push({ body: note, createdAt: new Date() })
  response.json(ticket)
})

async function start() {
  if (process.env.MONGODB_URI) {
    try { await mongoose.connect(process.env.MONGODB_URI); console.log('MongoDB connected') } catch (error) { console.warn('MongoDB unavailable; using in-memory tickets.', error.message) }
  } else console.warn('MONGODB_URI not set; using in-memory tickets.')
  app.listen(port, () => console.log(`API running at http://localhost:${port}`))
}

start()
