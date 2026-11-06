import React, { useState } from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  CreditCard, 
  Eye, 
  Send, 
  Check, 
  Clock, 
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const PriorityFollowUps = ({ 
  priorityInvoices, 
  onViewInvoice, 
  onOpenPayment 
}) => {
  const [copiedInvoiceId, setCopiedInvoiceId] = useState(null);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const copyReminderMessage = (inv) => {
    const text = `Dear ${inv.clientName},\n\nThis is a polite reminder from Invoice Nudge regarding overdue invoice ${inv.invoiceNumber} for ${formatCurrency(inv.outstandingBalance)}, which was due on ${formatDate(inv.dueDate)} (${inv.daysOverdue} days ago).\n\nPlease let us know when we can expect settlement or reach out if you require any assistance.\n\nThank you!`;
    navigator.clipboard.writeText(text);
    setCopiedInvoiceId(inv._id);
    toast.success(`Copied payment reminder template for ${inv.clientName}!`);
    setTimeout(() => setCopiedInvoiceId(null), 3000);
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('immediately')) return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' };
    if (action.includes('reminder')) return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
    return { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Feature Explanation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Priority Follow-ups Engine
            </h2>
            <span className="badge badge-priority-high">Differentiating Feature</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Intelligent rule-based follow-up ranking combining overdue age and outstanding capital.
          </p>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
        >
          <HelpCircle size={15} color="#4f46e5" />
          <span>{showFormulaDetails ? 'Hide Algorithm Details' : 'How Prioritisation Works'}</span>
        </button>
      </div>

      {/* Transparent Algorithm Explanation Card */}
      {showFormulaDetails && (
        <div className="card" style={{ background: '#f8fafc', borderLeft: '4px solid #4f46e5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={18} color="#4f46e5" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              Transparent Rule-Based Prioritization Formula (Deterministic Algorithm)
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
            Unlike black-box AI claims, Invoice Nudge uses a verified, transparent <strong>60% Overdue Age / 40% Outstanding Amount</strong> multi-criteria decision algorithm. Every overdue invoice with an unpaid balance is scored and ranked on a scale from 0 to 100:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            margin: '14px 0'
          }}>
            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5' }}>AGE SCORE (60% Weight)</div>
              <code style={{ fontSize: '0.8rem', display: 'block', marginTop: '4px', color: '#0f172a' }}>
                (Days Overdue / Max Overdue Days) × 100
              </code>
              <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                Penalizes chronic delinquency regardless of size.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed' }}>AMOUNT SCORE (40% Weight)</div>
              <code style={{ fontSize: '0.8rem', display: 'block', marginTop: '4px', color: '#0f172a' }}>
                (Outstanding Balance / Max Outstanding) × 100
              </code>
              <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                Protects company liquidity by flagging high-value capital.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>FINAL COMPOSITE SCORE</div>
              <code style={{ fontSize: '0.8rem', display: 'block', marginTop: '4px', color: '#0f172a' }}>
                (Age Score × 0.60) + (Amount Score × 0.40)
              </code>
              <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                High (≥70) | Medium (40-69) | Low (&lt;40)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Priority Invoices Table */}
      {priorityInvoices && priorityInvoices.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Invoice #</th>
                <th>Client Name</th>
                <th style={{ textAlign: 'right' }}>Outstanding Amount</th>
                <th>Due Date</th>
                <th>Days Overdue</th>
                <th style={{ textAlign: 'center' }}>Score Breakdown</th>
                <th>Priority Level</th>
                <th>Suggested Next Action</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {priorityInvoices.map((inv, index) => {
                const actionColors = getActionBadgeColor(inv.suggestedAction);
                const isCopied = copiedInvoiceId === inv._id;

                return (
                  <tr key={inv._id}>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: index === 0 ? '#fee2e2' : index === 1 ? '#fef3c7' : '#f1f5f9',
                        color: index === 0 ? '#b91c1c' : index === 1 ? '#b45309' : '#475569',
                        fontWeight: 800,
                        fontSize: '0.82rem'
                      }}>
                        #{index + 1}
                      </span>
                    </td>
                    <td>
                      <strong 
                        style={{ color: '#4f46e5', cursor: 'pointer' }}
                        onClick={() => onViewInvoice(inv)}
                        title="View details"
                      >
                        {inv.invoiceNumber}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inv.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{inv.clientEmail}</div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#e11d48', fontSize: '0.95rem' }}>
                      {formatCurrency(inv.outstandingBalance)}
                    </td>
                    <td>{formatDate(inv.dueDate)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#e11d48" />
                        <span style={{ fontWeight: 700, color: '#e11d48' }}>
                          {inv.daysOverdue} days
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                        Age: <strong>{inv.ageScore}</strong> | Amt: <strong>{inv.amountScore}</strong>
                      </div>
                      <div style={{
                        width: '90px',
                        height: '6px',
                        background: '#e2e8f0',
                        borderRadius: '999px',
                        margin: '4px auto 0 auto',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            width: `${inv.priorityScore}%`,
                            height: '100%',
                            background: inv.priorityScore >= 70 ? '#e11d48' : inv.priorityScore >= 40 ? '#d97706' : '#0d9488'
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <PriorityBadge level={inv.priorityLevel} score={inv.priorityScore} />
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: actionColors.bg,
                        color: actionColors.color,
                        border: `1px solid ${actionColors.border}`
                      }}>
                        {inv.suggestedAction}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 8px' }}
                          onClick={() => copyReminderMessage(inv)}
                          title="Copy Polite Payment Reminder Message"
                        >
                          {isCopied ? <Check size={14} color="#16a34a" /> : <Send size={14} />}
                          <span style={{ fontSize: '0.75rem' }}>{isCopied ? 'Copied' : 'Nudge'}</span>
                        </button>

                        <button
                          className="btn btn-primary btn-sm"
                          style={{ padding: '6px 8px' }}
                          onClick={() => onOpenPayment(inv)}
                          title="Record Payment"
                        >
                          <CreditCard size={14} />
                          <span style={{ fontSize: '0.75rem' }}>Pay</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <ShieldCheck size={36} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Zero Overdue Invoices</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '480px', margin: '8px auto 0 auto' }}>
            All active invoices are either settled in full or are comfortably within their due dates. No follow-up nudges are required at this time.
          </p>
        </div>
      )}
    </div>
  );
};

export default PriorityFollowUps;

