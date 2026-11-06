import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getPriorityOverdueInvoices,
} from '../controllers/invoiceController.js';
import { recordPayment } from '../controllers/paymentController.js';
import { seedSampleInvoices } from '../utils/seeder.js';

const router = express.Router();

// Specific routes first to prevent collision with /:id
router.get('/overdue/priority', getPriorityOverdueInvoices);

router.post('/seed', async (req, res, next) => {
  try {
    const result = await seedSampleInvoices();
    res.status(200).json({
      success: true,
      message: `Sample invoices seeded successfully (${result.totalSeeded} verified).`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Invoices CRUD
router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.route('/:id')
  .get(getInvoiceById)
  .put(updateInvoice)
  .delete(deleteInvoice);

// Payment Recording
router.post('/:id/payments', recordPayment);

export default router;
