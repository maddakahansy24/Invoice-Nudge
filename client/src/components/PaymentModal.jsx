import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { formatCurrency } from '../utils/formatters';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, invoice, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (invoice) {
      setAmount('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setReference('');
      setError('');
    }
  }, [invoice, isOpen]);

  if (!invoice) return null;

  const outstanding = invoice.outstandingBalance !== undefined 
    ? invoice.outstandingBalance 
    : invoice.amount - (invoice.totalPaid || 0);

  const numAmount = Number(amount);
  const remainingAfterPayment = outstanding - (numAmount || 0);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(numAmount)) {
      setError('Please enter a valid payment amount.');
      return;
    }
    if (numAmount <= 0) {
      setError('Payment amount must be greater than zero.');
      return;
    }
    if (numAmount > outstanding) {
      setError(`Payment cannot exceed the outstanding balance of ${formatCurrency(outstanding)}.`);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(invoice._id, {
        amount: numAmount,
        paymentDate,
        paymentMethod,
        reference: reference.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record payment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Payment for ${invoice.invoiceNumber}`}
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit}>
        {/* Invoice Summary Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Client:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{invoice.clientName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Total Invoiced:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatCurrency(invoice.amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Total Paid So Far:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#16a34a' }}>
              {formatCurrency(invoice.totalPaid || 0)}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Current Outstanding:</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#e11d48' }}>
              {formatCurrency(outstanding)}
            </span>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Payment Amount (INR ₹) *</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              min="1"
              max={outstanding}
              step="any"
              className="form-input"
              placeholder={`Up to ${outstanding}`}
              value={amount}
              onChange={handleAmountChange}
              required
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setAmount(outstanding.toString())}
              title="Fill full remaining amount"
            >
              Pay Full
            </button>
          </div>
          {numAmount > 0 && numAmount <= outstanding && (
            <div style={{
              marginTop: '6px',
              fontSize: '0.78rem',
              color: remainingAfterPayment === 0 ? '#16a34a' : '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle size={14} />
              Remaining balance after this payment: <strong>{formatCurrency(remainingAfterPayment)}</strong>
              {remainingAfterPayment === 0 && ' (Will be marked as PAID)'}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Payment Date *</label>
            <input
              type="date"
              className="form-input"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method *</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
              <option value="Bank Transfer">Bank Transfer (NEFT / IMPS / RTGS)</option>
              <option value="Cash">Cash</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Transaction / Reference ID (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. UPI Ref: 312891929381 or Cheque #00412"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>

        <div className="modal-footer" style={{ margin: '0 -24px -24px -24px' }}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <CreditCard size={16} />
            {submitting ? 'Recording...' : 'Confirm Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;

