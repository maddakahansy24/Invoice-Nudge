import React from 'react';
import { Menu, Plus, Calendar, RotateCw } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const Navbar = ({ activeTab, onOpenAddModal, onRefresh, isRefreshing, toggleSidebar }) => {
  const getPageDetails = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Executive Dashboard',
          subtitle: 'Real-time overview of invoices, cash flows, and aging metrics',
        };
      case 'invoices':
        return {
          title: 'Invoice Register',
          subtitle: 'Manage client billing records, track payment statuses, and edit details',
        };
      case 'priority':
        return {
          title: 'Priority Follow-ups',
          subtitle: 'Rule-based aging & balance scoring engine for overdue payment recovery',
        };
      default:
        return {
          title: 'Invoice Nudge',
          subtitle: 'Never Miss a Payment Follow-up Again',
        };
    }
  };

  const { title, subtitle } = getPageDetails();
  const today = new Date().toISOString();

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="page-title">{title}</h2>
          <p style={{ fontSize: '0.75rem', color: '#64748b', display: 'none', md: 'block' }}>
            {subtitle}
          </p>
        </div>
      </div>

      <div className="top-navbar-right">
        <div className="date-badge">
          <Calendar size={14} color="#6366f1" />
          <span>{formatDate(today)}</span>
        </div>

        <button
          className="btn-icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Data"
        >
          <RotateCw size={17} className={isRefreshing ? 'animate-spin' : ''} />
        </button>

        <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add Invoice</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

