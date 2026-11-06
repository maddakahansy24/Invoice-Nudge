import Invoice from '../models/Invoice.js';
import { calculateOverduePriorities } from '../utils/priorityScorer.js';

// @desc    Get all invoices with filtering, searching, and sorting
// @route   GET /api/invoices
export const getInvoices = async (req, res, next) => {
  try {
    const { search, status, sortBy, startDate, endDate } = req.query;

    let query = {};

    // Search by invoiceNumber, clientName, clientEmail
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { invoiceNumber: searchRegex },
        { clientName: searchRegex },
        { clientEmail: searchRegex },
      ];
    }

    // Date range filter on invoiceDate
    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    let invoices = await Invoice.find(query).sort({ createdAt: -1 });

    // Status filter (calculated virtuals)
    if (status && status !== 'ALL') {
      invoices = invoices.filter((inv) => inv.paymentStatus === status);
    }

    // Sorting
    if (sortBy) {
      switch (sortBy) {
        case 'dueDate_asc':
          invoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          break;
        case 'dueDate_desc':
          invoices.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
          break;
        case 'amount_desc':
          invoices.sort((a, b) => b.amount - a.amount);
          break;
        case 'amount_asc':
          invoices.sort((a, b) => a.amount - b.amount);
          break;
        case 'outstanding_desc':
          invoices.sort((a, b) => b.outstandingBalance - a.outstandingBalance);
          break;
        case 'invoiceDate_desc':
        default:
          invoices.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
          break;
      }
    }

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new invoice
// @route   POST /api/invoices
export const createInvoice = async (req, res, next) => {
  try {
    const {
      invoiceNumber,
      clientName,
      clientEmail,
      invoiceDate,
      dueDate,
      amount,
      description,
      notes,
    } = req.body;

    const existing = await Invoice.findOne({ invoiceNumber: invoiceNumber?.trim()?.toUpperCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Invoice number "${invoiceNumber}" is already in use. Please use a unique invoice number.`,
      });
    }

    const invoice = await Invoice.create({
      invoiceNumber: invoiceNumber?.trim()?.toUpperCase(),
      clientName,
      clientEmail,
      invoiceDate,
      dueDate,
      amount,
      description,
      notes,
      payments: [],
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully.',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    const {
      clientName,
      clientEmail,
      invoiceDate,
      dueDate,
      amount,
      description,
      notes,
    } = req.body;

    // Prevent reducing amount below what has already been paid
    if (amount !== undefined && amount < invoice.totalPaid) {
      return res.status(400).json({
        success: false,
        message: `Invoice amount cannot be lower than total payments already received (₹${invoice.totalPaid.toLocaleString('en-IN')}).`,
      });
    }

    if (clientName) invoice.clientName = clientName;
    if (clientEmail) invoice.clientEmail = clientEmail;
    if (invoiceDate) invoice.invoiceDate = invoiceDate;
    if (dueDate) invoice.dueDate = dueDate;
    if (amount !== undefined) invoice.amount = amount;
    if (description) invoice.description = description;
    if (notes !== undefined) invoice.notes = notes;

    const updated = await invoice.save();

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    await invoice.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Overdue Invoices ranked by Priority Score
// @route   GET /api/invoices/overdue/priority
export const getPriorityOverdueInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();
    const prioritized = calculateOverduePriorities(invoices);

    res.status(200).json({
      success: true,
      count: prioritized.length,
      data: prioritized,
    });
  } catch (error) {
    next(error);
  }
};
