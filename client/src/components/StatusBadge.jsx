import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, PieChart } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toUpperCase();

  switch (normalized) {
    case 'PAID':
      return (
        <span className="badge badge-paid">
          <CheckCircle2 size={13} />
          Paid
        </span>
      );
    case 'OVERDUE':
      return (
        <span className="badge badge-overdue">
          <AlertTriangle size={13} />
          Overdue
        </span>
      );
    case 'PARTIALLY_PAID':
      return (
        <span className="badge badge-partially_paid">
          <PieChart size={13} />
          Partially Paid
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="badge badge-pending">
          <Clock size={13} />
          Pending
        </span>
      );
  }
};

export default StatusBadge;

