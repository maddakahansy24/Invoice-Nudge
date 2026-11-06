import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  AlertTriangle, 
  ReceiptText, 
  Database,
  X
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, overdueCount, onSeedData, isOpen, setIsOpen }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'invoices',
      label: 'Invoice Register',
      icon: FileSpreadsheet,
    },
    {
      id: 'priority',
      label: 'Priority Follow-ups',
      icon: AlertTriangle,
      badge: overdueCount > 0 ? overdueCount : null,
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-icon">
          <ReceiptText size={22} />
        </div>
        <div className="brand-info">
          <h1>Invoice Nudge</h1>
          <p>Payment Follow-up Assistant</p>
        </div>
        {isOpen && (
          <button 
            className="btn-icon" 
            style={{ marginLeft: 'auto', color: '#94a3b8' }} 
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge !== null && item.badge !== undefined && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="btn btn-outline btn-sm" 
          style={{ width: '100%', borderColor: 'rgba(255,255,255,0.15)', color: '#cbd5e1' }}
          onClick={onSeedData}
          title="Seed realistic academic demonstration data"
        >
          <Database size={14} />
          Load Sample Data
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

