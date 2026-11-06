import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { seedSampleInvoices } from './utils/seeder.js';
import Invoice from './models/Invoice.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Invoice Nudge REST API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Connect to DB and Start Server
const startServer = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    try {
      const count = await Invoice.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding initial sample academic invoices...');
        await seedSampleInvoices();
        console.log('✅ Sample invoices seeded successfully.');
      }
    } catch (e) {
      console.warn('Initial seeding note:', e.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Invoice Nudge Server running on http://localhost:${PORT}`);
  });
};

startServer();
