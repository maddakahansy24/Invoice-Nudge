import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { formatDateForInput } from '../utils/formatters';

const initialFormData = {
  invoiceNumber: '',
  clientName: '',
  clientEmail: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  amount: '',
  description: '',
  notes: '',
};

const InvoiceModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        invoiceNumber: initialData.invoiceNumber || '',
        clientName: initialData.clientName || '',
        clientEmail: initialData.clientEmail || '',
        invoiceDate: formatDateForInput(initialData.invoiceDate) || new Date().toISOString().split('T')[0],
        dueDate: formatDateForInput(initialData.dueDate) || '',
        amount: initialData.amount !== undefined ? initialData.amount : '',
        description: initialData.description || '',
        notes: initialData.notes || '',
      });
    } else {
      // Auto-generate invoice number suggestion e.g. INV-XXXX
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        ...initialFormData,
        invoiceNumber: `INV-${randomSuffix}`,
        invoiceDate: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required.';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Client email is required.';
    } else if (!emailRegex.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address (e.g. name@company.com).';
    }

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required.';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required.';
    } else if (formData.invoiceDate && new Date(formData.dueDate) < new Date(formData.invoiceDate)) {
      newErrors.dueDate = 'Due date cannot be earlier than invoice date.';
    }

    const numAmount = Number(formData.amount);
    if (formData.amount === '' || isNaN(numAmount)) {
      newErrors.amount = 'Invoice amount is required.';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Invoice amount must be greater than zero.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        amount: Number(formData.amount),
      });
      onClose();
    } catch (err) {
      // The parent will handle or set specific server error message
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'Failed to save invoice.',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Invoice (${initialData.invoiceNumber})` : 'Create New Invoice'}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit}>
        {errors.form && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
            {errors.form}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Invoice Number *</label>
            <input
              type="text"
              name="invoiceNumber"
              className={`form-input ${errors.invoiceNumber ? 'error' : ''}`}
              placeholder="e.g. INV-2026-001"
              value={formData.invoiceNumber}
              onChange={handleChange}
              disabled={!!initialData} // Usually immutable or locked on edit
            />
            {errors.invoiceNumber && <p className="form-error">{errors.invoiceNumber}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Invoice Amount (INR ₹) *</label>
            <input
              type="number"
              name="amount"
              min="1"
              step="any"
              className={`form-input ${errors.amount ? 'error' : ''}`}
              placeholder="e.g. 25000"
              value={formData.amount}
              onChange={handleChange}
            />
            {errors.amount && <p className="form-error">{errors.amount}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              name="clientName"
              className={`form-input ${errors.clientName ? 'error' : ''}`}
              placeholder="e.g. Acme Innovations Pvt Ltd"
              value={formData.clientName}
              onChange={handleChange}
            />
            {errors.clientName && <p className="form-error">{errors.clientName}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Client Email *</label>
            <input
              type="email"
              name="clientEmail"
              className={`form-input ${errors.clientEmail ? 'error' : ''}`}
              placeholder="e.g. billing@acme.com"
              value={formData.clientEmail}
              onChange={handleChange}
            />
            {errors.clientEmail && <p className="form-error">{errors.clientEmail}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Invoice Date *</label>
            <input
              type="date"
              name="invoiceDate"
              className={`form-input ${errors.invoiceDate ? 'error' : ''}`}
              value={formData.invoiceDate}
              onChange={handleChange}
            />
            {errors.invoiceDate && <p className="form-error">{errors.invoiceDate}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              className={`form-input ${errors.dueDate ? 'error' : ''}`}
              value={formData.dueDate}
              onChange={handleChange}
            />
            {errors.dueDate && <p className="form-error">{errors.dueDate}</p>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Service / Item Description *</label>
          <input
            type="text"
            name="description"
            className={`form-input ${errors.description ? 'error' : ''}`}
            placeholder="e.g. Full-Stack Web App Development & Cloud Deployment"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="form-error">{errors.description}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Internal Notes (Optional)</label>
          <textarea
            name="notes"
            rows="2"
            className="form-textarea"
            placeholder="e.g. Sent via email on 1st of month. Client promised Net-15 terms."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="modal-footer" style={{ margin: '0 -24px -24px -24px' }}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : initialData ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InvoiceModal;

