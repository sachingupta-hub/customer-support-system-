import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ticket from '../models/Ticket.js';
import Counter from '../models/Counter.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const cleanData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/datastraw_crm';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB for data cleanup...');

    // Delete all tickets
    const ticketsDeleted = await Ticket.deleteMany({});
    console.log(`🧹 Deleted ${ticketsDeleted.deletedCount} tickets.`);

    // Reset ticket counter sequence to 0
    await Counter.deleteMany({});
    console.log('🔄 Reset Ticket counter sequence to 0.');

    console.log('✨ Database cleaned successfully! Next ticket created will start at TKT-001.');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
};

cleanData();
