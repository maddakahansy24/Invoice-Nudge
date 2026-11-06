import React from 'react';
import { 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar,
  CreditCard,
  Eye,
  Plus
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = ({ 
  summary, 
  priorityInvoices, 
  recentInvoices, 
  onViewInvoice, 
  onOpenPayment, 
  onOpenAddModal, 
  onGoToInvoices, 
  onGoToPriority 
}) => {
  const metrics = summary || {
    totalInvoices: 0,
    totalInvoicedAmount: 0,
    totalReceivedAmount: 0,
    totalOutstandingAmount: 0,
    totalOverdueAmount: 0,
    paidCount: 0,
    pendingCount: 0,
    partiallyPaidCount: 0,
    overdueCount: 0,
    statusBreakdown: { PAID: 0, PENDING: 0, PARTIALLY_PAID: 0, OVERDUE: 0 },
    monthlyOverview: [],
    upcomingDeadlines: [],
  };

  const statusPercentages = {
    paid: metrics.totalInvoices > 0 ? Math.round((metrics.paidCount / metrics.totalInvoices) * 100) : 0,
    pending: metrics.totalInvoices > 0 ? Math.round((metrics.pendingCount / metrics.totalInvoices) * 100) : 0,
    partiallyPaid: metrics.totalInvoices > 0 ? Math.round(((metrics.partiallyPaidCount || 0) / metrics.totalInvoices) * 100) : 0,
    overdue: metrics.totalInvoices > 0 ? Math.round((metrics.overdueCount / metrics.totalInvoices) * 100) : 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 8 Metric Summary Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Financial Health & Aging Metrics</h3>
          <button className="btn btn-outline btn-sm" onClick={onOpenAddModal}>
            <Plus size={15} />
            Quick Add Invoice
          </button>
        </div>

        <div className="stats-grid">
          {/* 1. Total Invoices */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Invoices</div>
              <div className="stat-value">{metrics.totalInvoices}</div>
              <div className="stat-sub">All registered billings</div>
            </div>
            <div className="stat-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              <FileText size={22} />
            </div>
          </div>

          {/* 2. Total Invoiced Amount */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Invoiced</div>
              <div className="stat-value">{formatCurrency(metrics.totalInvoicedAmount)}</div>
              <div className="stat-sub">Gross billing value</div>
            </div>
            <div className="stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <DollarSign size={22} />
            </div>
          </div>

          {/* 3. Total Received Amount */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Received</div>
              <div className="stat-value" style={{ color: '#16a34a' }}>
                {formatCurrency(metrics.totalReceivedAmount)}
              </div>
              <div className="stat-sub">Realized cash in bank</div>
            </div>
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#16a34a' }}>
              <TrendingUp size={22} />
            </div>
          </div>

          {/* 4. Total Outstanding Amount */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Outstanding</div>
              <div className="stat-value" style={{ color: '#4f46e5' }}>
                {formatCurrency(metrics.totalOutstandingAmount)}
              </div>
              <div className="stat-sub">Accounts receivable</div>
            </div>
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Clock size={22} />
            </div>
          </div>

          {/* 5. Total Overdue Amount */}
          <div className="stat-card" style={{ borderColor: metrics.totalOverdueAmount > 0 ? '#fecdd3' : '#e2e8f0' }}>
            <div className="stat-info">
              <div className="stat-label">Overdue Amount</div>
              <div className="stat-value" style={{ color: '#e11d48' }}>
                {formatCurrency(metrics.totalOverdueAmount)}
              </div>
              <div className="stat-sub">Past due balance</div>
            </div>
            <div className="stat-icon" style={{ background: '#ffe4e6', color: '#e11d48' }}>
              <AlertTriangle size={22} />
            </div>
          </div>

          {/* 6. Paid Invoice Count */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Paid Invoices</div>
              <div className="stat-value" style={{ color: '#15803d' }}>{metrics.paidCount}</div>
              <div className="stat-sub">Fully settled invoices</div>
            </div>
            <div className="stat-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>

          {/* 7. Pending Invoice Count */}
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Pending Invoices</div>
              <div className="stat-value" style={{ color: '#d97706' }}>{metrics.pendingCount}</div>
              <div className="stat-sub">Within due date window</div>
            </div>
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Clock size={22} />
            </div>
          </div>

          {/* 8. Overdue Invoice Count */}
          <div className="stat-card" style={{ borderColor: metrics.overdueCount > 0 ? '#fecdd3' : '#e2e8f0' }}>
            <div className="stat-info">
              <div className="stat-label">Overdue Count</div>
              <div className="stat-value" style={{ color: '#dc2626' }}>{metrics.overdueCount}</div>
              <div className="stat-sub">Action required immediately</div>
            </div>
            <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <AlertTriangle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Status Breakdown & Monthly Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Status Distribution */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Invoice Status Distribution</h4>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{metrics.totalInvoices} Total</span>
          </div>

          {/* Multi-segment Progress Bar */}
          <div style={{
            height: '14px',
            width: '100%',
            background: '#e2e8f0',
            borderRadius: '999px',
            display: 'flex',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <div style={{ width: `${statusPercentages.paid}%`, background: '#10b981', title: 'Paid' }} />
            <div style={{ width: `${statusPercentages.pending}%`, background: '#f59e0b', title: 'Pending' }} />
            <div style={{ width: `${statusPercentages.partiallyPaid}%`, background: '#3b82f6', title: 'Partially Paid' }} />
            <div style={{ width: `${statusPercentages.overdue}%`, background: '#ef4444', title: 'Overdue' }} />
          </div>

          {/* Legend Items */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>Paid:</span>
              <strong style={{ fontSize: '0.85rem', marginLeft: 'auto' }}>{metrics.paidCount} ({statusPercentages.paid}%)</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>Pending:</span>
              <strong style={{ fontSize: '0.85rem', marginLeft: 'auto' }}>{metrics.pendingCount} ({statusPercentages.pending}%)</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>Partial:</span>
              <strong style={{ fontSize: '0.85rem', marginLeft: 'auto' }}>{metrics.partiallyPaidCount || 0} ({statusPercentages.partiallyPaid}%)</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>Overdue:</span>
              <strong style={{ fontSize: '0.85rem', marginLeft: 'auto', color: '#dc2626' }}>
                {metrics.overdueCount} ({statusPercentages.overdue}%)
              </strong>
            </div>
          </div>
        </div>

        {/* Monthly Payment Overview (Bar Chart) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Monthly Collections Overview</h4>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Recent Activity</span>
          </div>

          {metrics.monthlyOverview && metrics.monthlyOverview.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '20px' }}>
              {(() => {
                const maxVal = Math.max(...metrics.monthlyOverview.map((m) => m.amount), 1);
                return metrics.monthlyOverview.map((item, idx) => {
                  const heightPercent = Math.max(8, Math.round((item.amount / maxVal) * 100));
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                        {item.amount > 0 ? `${Math.round(item.amount / 1000)}k` : '0'}
                      </span>
                      <div
                        style={{
                          width: '28px',
                          height: `${heightPercent}%`,
                          background: 'linear-gradient(180deg, #4f46e5 0%, #818cf8 100%)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.4s ease'
                        }}
                        title={`${item.month}: ${formatCurrency(item.amount)}`}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 500 }}>
                        {item.month}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              No monthly collection history recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Differentiating Feature Snippet: Top Priority Overdue Invoices */}
      <div className="card" style={{ borderLeft: '4px solid #e11d48' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                Top Priority Overdue Invoices (Differentiating Engine)
              </h4>
              <span className="badge badge-priority-high">60% Age / 40% Amount</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              Invoices ranked using the weighted prioritization algorithm for immediate collection follow-up
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onGoToPriority}>
            <span>View All Follow-ups</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {priorityInvoices && priorityInvoices.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Days Overdue</th>
                  <th>Outstanding</th>
                  <th>Priority Score</th>
                  <th>Action Needed</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {priorityInvoices.slice(0, 4).map((inv) => (
                  <tr key={inv._id}>
                    <td>
                      <strong>{inv.invoiceNumber}</strong>
                    </td>
                    <td>{inv.clientName}</td>
                    <td>
                      <span style={{ color: '#e11d48', fontWeight: 700 }}>
                        {inv.daysOverdue} days
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      {formatCurrency(inv.outstandingBalance)}
                    </td>
                    <td>
                      <PriorityBadge level={inv.priorityLevel} score={inv.priorityScore} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                        {inv.suggestedAction}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => onViewInvoice(inv)}
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onOpenPayment(inv)}
                          title="Record Payment"
                        >
                          <CreditCard size={13} />
                          Pay
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#16a34a', fontSize: '0.88rem' }}>
            <CheckCircle2 size={24} style={{ margin: '0 auto 8px auto', display: 'block' }} />
            Great job! No overdue invoices currently require immediate follow-up.
          </div>
        )}
      </div>

      {/* Bottom Grid: Recent Invoices Table & Upcoming Payment Deadlines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Recent Invoices */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Recent Invoices</h4>
            <button className="btn btn-outline btn-sm" onClick={onGoToInvoices}>
              View All
            </button>
          </div>

          {recentInvoices && recentInvoices.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.slice(0, 5).map((inv) => (
                    <tr
                      key={inv._id}
                      onClick={() => onViewInvoice(inv)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td><strong>{inv.invoiceNumber}</strong></td>
                      <td>{inv.clientName}</td>
                      <td>{formatDate(inv.dueDate)}</td>
                      <td><StatusBadge status={inv.paymentStatus} /></td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>
                        {formatCurrency(inv.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              No invoices created yet.
            </p>
          )}
        </div>

        {/* Upcoming Payment Deadlines */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Upcoming Payment Deadlines</h4>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Due Next</span>
          </div>

          {metrics.upcomingDeadlines && metrics.upcomingDeadlines.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {metrics.upcomingDeadlines.slice(0, 4).map((inv) => (
                <div
                  key={inv._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}
                  onClick={() => onViewInvoice(inv)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      padding: '8px',
                      borderRadius: '6px',
                      background: '#eff6ff',
                      color: '#3b82f6'
                    }}>
                      <Calendar size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{inv.invoiceNumber} — {inv.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Due on {formatDate(inv.dueDate)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>{formatCurrency(inv.outstandingBalance)}</div>
                    <StatusBadge status={inv.paymentStatus} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              No upcoming pending deadlines.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

