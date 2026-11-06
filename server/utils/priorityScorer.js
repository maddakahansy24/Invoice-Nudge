/**
 * Priority Scoring Engine for Overdue Invoices
 * Transparent Multi-Criteria Weighted Decision Algorithm
 * Weights: 60% Overdue Delinquency Age, 40% Outstanding Capital Exposure
 */

export const calculateOverduePriorities = (invoices) => {
  // 1. Filter only genuine overdue invoices with a positive outstanding balance
  const overdueInvoices = invoices.filter((inv) => {
    const isOverdue = inv.paymentStatus === 'OVERDUE';
    const hasBalance = (inv.outstandingBalance || 0) > 0;
    const days = inv.daysOverdue || 0;
    return isOverdue && hasBalance && days > 0;
  });

  if (overdueInvoices.length === 0) {
    return [];
  }

  // 2. Find Maximum Overdue Days and Maximum Outstanding Amount
  const maxDays = Math.max(...overdueInvoices.map((inv) => inv.daysOverdue || 1), 1);
  const maxAmount = Math.max(...overdueInvoices.map((inv) => inv.outstandingBalance || 1), 1);

  // 3. Score each invoice
  const scoredInvoices = overdueInvoices.map((inv) => {
    const overdueDays = inv.daysOverdue || 0;
    const balance = inv.outstandingBalance || 0;

    // Normalization with safe division guards
    const ageScore = maxDays > 0 ? (overdueDays / maxDays) * 100 : 0;
    const amountScore = maxAmount > 0 ? (balance / maxAmount) * 100 : 0;

    // Composite Weighted Score: 60% Age + 40% Amount
    const compositeScore = Math.round((ageScore * 0.60) + (amountScore * 0.40));
    const clampedScore = Math.min(100, Math.max(0, compositeScore));

    // Priority Categorization
    let priorityLevel = 'LOW';
    let suggestedAction = 'Monitor and schedule follow-up';

    if (clampedScore >= 70) {
      priorityLevel = 'HIGH';
      suggestedAction = 'Follow up immediately';
    } else if (clampedScore >= 40) {
      priorityLevel = 'MEDIUM';
      suggestedAction = 'Send a payment reminder';
    }

    const invObj = inv.toObject ? inv.toObject() : { ...inv };

    return {
      ...invObj,
      daysOverdue: overdueDays,
      ageScore: Math.round(ageScore),
      amountScore: Math.round(amountScore),
      priorityScore: clampedScore,
      priorityLevel,
      suggestedAction,
    };
  });

  // 4. Sort descending by Priority Score
  scoredInvoices.sort((a, b) => b.priorityScore - a.priorityScore);

  return scoredInvoices;
};
