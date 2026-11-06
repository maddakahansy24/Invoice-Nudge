import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0.01, 'Payment amount must be greater than zero'],
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['UPI', 'Bank Transfer', 'Cash', 'Other'],
        message: '{VALUE} is not a supported payment method',
      },
      default: 'UPI',
    },
    reference: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: true, timestamps: true }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid client email address',
      ],
    },
    invoiceDate: {
      type: Date,
      required: [true, 'Invoice date is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      validate: {
        validator: function (value) {
          if (!this.invoiceDate || !value) return true;
          // Compare dates at midnight to avoid timezone jitter
          const invD = new Date(this.invoiceDate);
          const dueD = new Date(value);
          const invMid = new Date(invD.getFullYear(), invD.getMonth(), invD.getDate());
          const dueMid = new Date(dueD.getFullYear(), dueD.getMonth(), dueD.getDate());
          return dueMid >= invMid;
        },
        message: 'Due date cannot be earlier than invoice date',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Invoice amount is required'],
      min: [0.01, 'Invoice amount must be greater than zero'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    payments: [paymentSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: totalPaid
invoiceSchema.virtual('totalPaid').get(function () {
  if (!this.payments || !this.payments.length) return 0;
  return this.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
});

// Virtual: outstandingBalance
invoiceSchema.virtual('outstandingBalance').get(function () {
  const totalPaid = this.totalPaid || 0;
  const balance = (Number(this.amount) || 0) - totalPaid;
  return balance <= 0 ? 0 : Math.round(balance * 100) / 100;
});

// Virtual: paymentStatus
invoiceSchema.virtual('paymentStatus').get(function () {
  const outstanding = this.outstandingBalance;
  const totalPaid = this.totalPaid;

  if (outstanding <= 0) {
    return 'PAID';
  }

  // Compare due date against current date at midnight
  const now = new Date();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const due = new Date(this.dueDate);
  const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  if (nowMidnight.getTime() > dueMidnight.getTime()) {
    return 'OVERDUE';
  }

  if (totalPaid > 0) {
    return 'PARTIALLY_PAID';
  }

  return 'PENDING';
});

// Virtual: daysOverdue
invoiceSchema.virtual('daysOverdue').get(function () {
  const now = new Date();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const due = new Date(this.dueDate);
  const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffTime = nowMidnight.getTime() - dueMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
