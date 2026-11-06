import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  CreditCard, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  FileSpreadsheet,
  XCircle
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

const Invoices = ({ 
  invoices, 
  onViewInvoice, 
  onOpenPayment, 
  onOpenEdit, 
  onOpenDelete, 
  onOpenAddModal 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate_asc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtering & Sorting Logic
  const filteredInvoices = useMemo(() => {
    let list = [...(invoices || [])];

    // Search by client name or invoice number
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (inv) =>
          inv.invoiceNumber?.toLowerCase().includes(q) ||
          inv.clientName?.toLowerCase().includes(q) ||
          inv.clientEmail?.toLowerCase().includes(q)
      );
    }

    // Filter by payment status
    if (statusFilter !== 'ALL') {
      list = list.filter((inv) => inv.paymentStatus === statusFilter);
    }

    // Filter by Date Range (Invoice Date)
    if (startDate) {
      list = list.filter((inv) => new Date(inv.invoiceDate) >= new Date(startDate));
    }
    if (endDate) {
      list = list.filter((inv) => new Date(inv.invoiceDate) <= new Date(endDate + 'T23:59:59'));
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate_asc':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'dueDate_desc':
          return new Date(b.dueDate) - new Date(a.dueDate);
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        case 'outstanding_desc':
          return (b.outstandingBalance || 0) - (a.outstandingBalance || 0);
        case 'invoiceDate_desc':
        default:
          return new Date(b.invoiceDate) - new Date(a.invoiceDate);
      }
    });

    return list;
  }, [invoices, searchQuery, statusFilter, sortBy, startDate, endDate]);

  const hasActiveFilters = searchQuery || statusFilter !== 'ALL' || startDate || endDate;

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSortBy('dueDate_asc');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Invoice Register</h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Showing {filteredInvoices.length} of {invoices.length} total records
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          Create New Invoice
        </button>
      </div>

      {/* Search, Filter & Sort Controls Card */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              placeholder="Search by invoice #, client name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} color="#64748b" />
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={15} color="#64748b" />
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate_asc">Due Date: Earliest First</option>
              <option value="dueDate_desc">Due Date: Latest First</option>
              <option value="outstanding_desc">Highest Outstanding Balance</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
              <option value="invoiceDate_desc">Newest Created First</option>
            </select>
          </div>

          {/* Date Range Inputs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="date"
              className="form-input"
              style={{ width: '135px', padding: '8px 10px', fontSize: '0.8rem' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="From date"
            />
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>to</span>
            <input
              type="date"
              className="form-input"
              style={{ width: '135px', padding: '8px 10px', fontSize: '0.8rem' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="To date"
            />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              <XCircle size={14} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client Name</th>
              <th>Client Email</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'right' }}>Paid</th>
              <th style={{ textAlign: 'right' }}>Outstanding</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((inv) => (
                <tr key={inv._id}>
                  <td>
                    <span 
                      style={{ fontWeight: 700, color: '#4f46e5', cursor: 'pointer' }}
                      onClick={() => onViewInvoice(inv)}
                      title="Click to view details"
                    >
                      {inv.invoiceNumber}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inv.clientName}</div>
                  </td>
                  <td>
                    <span style={{ color: '#64748b', fontSize: '0.82rem' }}>{inv.clientEmail}</span>
                  </td>
                  <td>{formatDate(inv.invoiceDate)}</td>
                  <td>
                    <span style={{
                      fontWeight: inv.paymentStatus === 'OVERDUE' ? 700 : 500,
                      color: inv.paymentStatus === 'OVERDUE' ? '#e11d48' : 'inherit'
                    }}>
                      {formatDate(inv.dueDate)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    {formatCurrency(inv.amount)}
                  </td>
                  <td style={{ textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                    {formatCurrency(inv.totalPaid || 0)}
                  </td>
                  <td style={{
                    textAlign: 'right',
                    fontWeight: 800,
                    color: (inv.outstandingBalance || 0) > 0 ? '#e11d48' : '#16a34a'
                  }}>
                    {formatCurrency(inv.outstandingBalance)}
                  </td>
                  <td>
                    <StatusBadge status={inv.paymentStatus} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                      <button
                        className="btn-icon"
                        onClick={() => onViewInvoice(inv)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>

                      {inv.outstandingBalance > 0 && (
                        <button
                          className="btn-icon"
                          style={{ color: '#16a34a' }}
                          onClick={() => onOpenPayment(inv)}
                          title="Record Payment"
                        >
                          <CreditCard size={16} />
                        </button>
                      )}

                      <button
                        className="btn-icon"
                        style={{ color: '#6366f1' }}
                        onClick={() => onOpenEdit(inv)}
                        title="Edit Invoice"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        className="btn-icon"
                        style={{ color: '#dc2626' }}
                        onClick={() => onOpenDelete(inv)}
                        title="Delete Invoice"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <FileSpreadsheet size={36} color="#94a3b8" style={{ margin: '0 auto 12px auto', display: 'block' }} />
                  <p style={{ fontWeight: 600, color: '#334155', fontSize: '1rem' }}>No invoices found</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
                    {hasActiveFilters
                      ? 'Try clearing or modifying your search or filter settings.'
                      : 'Get started by creating your first invoice or loading sample data.'}
                  </p>
                  {hasActiveFilters && (
                    <button className="btn btn-outline btn-sm" style={{ marginTop: '12px' }} onClick={resetFilters}>
                      Clear All Filters
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;

