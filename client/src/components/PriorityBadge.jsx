import React from 'react';
import { AlertOctagon, AlertCircle, Info } from 'lucide-react';

const PriorityBadge = ({ level, score }) => {
  const normalized = (level || '').toUpperCase();

  if (normalized === 'HIGH') {
    return (
      <span className="badge badge-priority-high" title={`Priority Score: ${score}`}>
        <AlertOctagon size={13} />
        High Priority {score !== undefined && `(${score})`}
      </span>
    );
  }

  if (normalized === 'MEDIUM') {
    return (
      <span className="badge badge-priority-medium" title={`Priority Score: ${score}`}>
        <AlertCircle size={13} />
        Medium Priority {score !== undefined && `(${score})`}
      </span>
    );
  }

  return (
    <span className="badge badge-priority-low" title={`Priority Score: ${score}`}>
      <Info size={13} />
      Low Priority {score !== undefined && `(${score})`}
    </span>
  );
};

export default PriorityBadge;

