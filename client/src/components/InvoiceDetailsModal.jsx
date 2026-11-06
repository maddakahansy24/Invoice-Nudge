import React from 'react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { 
  CreditCard, 
  Calendar, 
  Mail, 
  User, 
  FileText, 
  History, 
  Edit, 
  Trash2 
} from 'lucide-react';

const InvoiceDetailsModal = ({ 
  isOpen, 
  onClose, 
  invoice, 
  onOpenPayment, 
  onOpenEdit, 
  onDelete 
}) => {
  if (!invoice) return null;

  const totalPaid = invoice.totalPaid || 0;
  const outstanding = invoice.outstandingBalance !== undefined 
    ? invoice.outstandingBalance 
    : invoice.amount - totalPaid;
  const percentPaid = Math.min(100, Math.round((totalPaid / invoice.amount) * 100));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice Details: ${invoice.invoiceNumber}`}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                {invoice.invoiceNumber}
              </h2>
              <StatusBadge status={invoice.paymentStatus} />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              Created on {formatDate(invoice.invoiceDate)}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {outstanding > 0 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  onOpenPayment(invoice);
                }}
              >
                <CreditCard size={14} />
                Record Payment
              </button>
            )}
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                onClose();
                onOpenEdit(invoice);
              }}
            >
              <Edit size={14} />
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                onClose();
                onDelete(invoice);
              }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        {/* Client & Billing Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Client Information
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <User size={16} color="#6366f1" />
              <strong style={{ fontSize: '0.92rem' }}>{invoice.clientName}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <Mail size={14} color="#94a3b8" />
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>{invoice.clientEmail}</span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Payment Timeline
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <Calendar size={16} color="#0d9488" />
              <span style={{ fontSize: '0.85rem' }}>Due: <strong>{formatDate(invoice.dueDate)}</strong></span>
            </div>
            {invoice.paymentStatus === 'OVERDUE' && (
              <p style={{ fontSize: '0.78rem', color: '#e11d48', fontWeight: 600, marginTop: '4px' }}>
                Payment deadline has passed
              </p>
            )}
          </div>
        </div>

        {/* Financial Progress Breakdown */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Amount</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatCurrency(invoice.amount)}</h3>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Paid ({percentPaid}%)</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>{formatCurrency(totalPaid)}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Outstanding</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: outstanding > 0 ? '#e11d48' : '#16a34a' }}>
                {formatCurrency(outstanding)}
              </h3>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${percentPaid}%`, 
                height: '100%', 
                background: percentPaid === 100 ? '#16a34a' : 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                transition: 'width 0.4s ease'
              }} 
            />
          </div>
        </div>

        {/* Description & Notes */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Description
          </span>
          <p style={{ fontSize: '0.9rem', color: '#1e293b', marginTop: '4px', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {invoice.description || 'No description provided.'}
          </p>

          {invoice.notes && (
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Internal Notes
              </span>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>
                {invoice.notes}
              </p>
            </div>
          )}
        </div>

        {/* Payment History Ledger */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <History size={16} color="#6366f1" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Payment Ledger ({invoice.payments?.length || 0})</h4>
          </div>

          {!invoice.payments || invoice.payments.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
              No payments recorded yet.
            </p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Reference</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((p, idx) => (
                    <tr key={p._id || idx}>
                      <td>{formatDate(p.paymentDate)}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#475569' }}>{p.paymentMethod}</span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {p.reference || '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>
                        +{formatCurrency(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ margin: '0 -24px -24px -24px' }}>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceDetailsModal;

