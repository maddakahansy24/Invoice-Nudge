import Invoice from '../models/Invoice.js';

// @desc    Record partial or full payment for an invoice
// @route   POST /api/invoices/:id/payments
export const recordPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, paymentDate, paymentMethod, reference } = req.body;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    const paymentAmount = Number(amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than zero.',
      });
    }

    const currentOutstanding = invoice.outstandingBalance;

    if (paymentAmount > currentOutstanding) {
      return res.status(400).json({
        success: false,
        message: `Payment amount (₹${paymentAmount.toLocaleString('en-IN')}) cannot exceed the current outstanding balance of ₹${currentOutstanding.toLocaleString('en-IN')}.`,
      });
    }

    invoice.payments.push({
      amount: paymentAmount,
      paymentDate: paymentDate || new Date(),
      paymentMethod: paymentMethod || 'UPI',
      reference: reference ? reference.trim() : '',
    });

    const updatedInvoice = await invoice.save();

    res.status(200).json({
      success: true,
      message: `Payment of ₹${paymentAmount.toLocaleString('en-IN')} recorded successfully.`,
      data: updatedInvoice,
    });
  } catch (error) {
    next(error);
  }
};
