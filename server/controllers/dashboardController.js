import Invoice from '../models/Invoice.js';

// @desc    Get dashboard summary metrics and analytics
// @route   GET /api/dashboard/summary
export const getDashboardSummary = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();

    let totalInvoices = invoices.length;
    let totalInvoicedAmount = 0;
    let totalReceivedAmount = 0;
    let totalOutstandingAmount = 0;
    let totalOverdueAmount = 0;

    let paidCount = 0;
    let pendingCount = 0;
    let partiallyPaidCount = 0;
    let overdueCount = 0;

    const monthlyCollectionsMap = {};

    // Initialize last 6 months in chronological order
    const monthsArr = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mKey = d.toLocaleString('en-US', { month: 'short' });
      monthlyCollectionsMap[mKey] = 0;
      monthsArr.push(mKey);
    }

    const upcomingInvoices = [];

    invoices.forEach((inv) => {
      const amount = Number(inv.amount) || 0;
      const paid = inv.totalPaid || 0;
      const outstanding = inv.outstandingBalance || 0;
      const status = inv.paymentStatus;

      totalInvoicedAmount += amount;
      totalReceivedAmount += paid;
      totalOutstandingAmount += outstanding;

      if (status === 'PAID') {
        paidCount++;
      } else if (status === 'OVERDUE') {
        overdueCount++;
        totalOverdueAmount += outstanding;
      } else if (status === 'PARTIALLY_PAID') {
        partiallyPaidCount++;
      } else {
        pendingCount++;
      }

      // Collect payments for monthly trends
      if (inv.payments && inv.payments.length > 0) {
        inv.payments.forEach((p) => {
          const pDate = new Date(p.paymentDate);
          const pMonth = pDate.toLocaleString('en-US', { month: 'short' });
          if (monthlyCollectionsMap[pMonth] !== undefined) {
            monthlyCollectionsMap[pMonth] += Number(p.amount) || 0;
          }
        });
      }

      // Track upcoming pending deadlines (within next 30 days and not overdue)
      if ((status === 'PENDING' || status === 'PARTIALLY_PAID') && outstanding > 0) {
        upcomingInvoices.push(inv);
      }
    });

    upcomingInvoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const monthlyOverview = monthsArr.map((m) => ({
      month: m,
      amount: Math.round(monthlyCollectionsMap[m] || 0),
    }));

    res.status(200).json({
      success: true,
      data: {
        totalInvoices,
        totalInvoicedAmount: Math.round(totalInvoicedAmount),
        totalReceivedAmount: Math.round(totalReceivedAmount),
        totalOutstandingAmount: Math.round(totalOutstandingAmount),
        totalOverdueAmount: Math.round(totalOverdueAmount),
        paidCount,
        pendingCount,
        partiallyPaidCount,
        overdueCount,
        statusBreakdown: {
          PAID: paidCount,
          PENDING: pendingCount,
          PARTIALLY_PAID: partiallyPaidCount,
          OVERDUE: overdueCount,
        },
        monthlyOverview,
        upcomingDeadlines: upcomingInvoices.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};
