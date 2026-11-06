import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import PriorityFollowUps from './pages/PriorityFollowUps';

import InvoiceModal from './components/InvoiceModal';
import InvoiceDetailsModal from './components/InvoiceDetailsModal';
import PaymentModal from './components/PaymentModal';
import ConfirmModal from './components/ConfirmModal';

import { invoiceApi } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Core Data States
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [priorityInvoices, setPriorityInvoices] = useState([]);

  // Modal States
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState(null);

  // Fetch all data from backend REST API
  const fetchAllData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setRefreshing(true);

      const [invoicesRes, summaryRes, priorityRes] = await Promise.all([
        invoiceApi.getAll(),
        invoiceApi.getSummary(),
        invoiceApi.getPriorityOverdue(),
      ]);

      setInvoices(invoicesRes.data.data || []);
      setSummary(summaryRes.data.data || null);
      setPriorityInvoices(priorityRes.data.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      // Only toast on manual actions or initial load
      if (!isSilent) {
        toast.error(err.message || 'Could not connect to backend API server.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData(false);
  }, [fetchAllData]);

  // Invoice Handlers
  const handleOpenAddModal = () => {
    setEditingInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenEditModal = (invoice) => {
    setEditingInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleSaveInvoice = async (formData) => {
    try {
      if (editingInvoice) {
        await invoiceApi.update(editingInvoice._id, formData);
        toast.success(`Invoice ${formData.invoiceNumber} updated successfully!`);
      } else {
        await invoiceApi.create(formData);
        toast.success(`Invoice ${formData.invoiceNumber} created successfully!`);
      }
      await fetchAllData(true);
      setIsInvoiceModalOpen(false);
      setEditingInvoice(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save invoice.');
      throw err;
    }
  };

  const handleOpenDeleteModal = (invoice) => {
    setDeletingInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingInvoice) return;
    try {
      await invoiceApi.delete(deletingInvoice._id);
      toast.success(`Invoice ${deletingInvoice.invoiceNumber} deleted.`);
      setIsDeleteModalOpen(false);
      setDeletingInvoice(null);
      await fetchAllData(true);
    } catch (err) {
      toast.error(err.message || 'Failed to delete invoice.');
    }
  };

  // Payment Handlers
  const handleOpenPaymentModal = (invoice) => {
    setPayingInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = async (invoiceId, paymentData) => {
    try {
      const res = await invoiceApi.recordPayment(invoiceId, paymentData);
      const updated = res.data.data;
      toast.success(
        `Payment of ₹${paymentData.amount.toLocaleString('en-IN')} recorded!`
      );
      if (updated.paymentStatus === 'PAID') {
        toast.success(`🎉 Invoice ${updated.invoiceNumber} is now fully PAID!`, {
          icon: '✅',
          duration: 4000,
        });
      }
      await fetchAllData(true);
      setIsPaymentModalOpen(false);
      setPayingInvoice(null);
    } catch (err) {
      toast.error(err.message || 'Failed to record payment.');
      throw err;
    }
  };

  // View Details Modal
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };

  // Sample Data Seeder
  const handleSeedData = async () => {
    try {
      toast.loading('Seeding realistic demo invoices...', { id: 'seed' });
      await invoiceApi.seedData();
      toast.success('Sample academic invoices loaded successfully!', { id: 'seed' });
      await fetchAllData(false);
    } catch (err) {
      toast.error(err.message || 'Failed to seed sample data.', { id: 'seed' });
    }
  };

  const overdueCount = summary?.overdueCount || priorityInvoices?.length || 0;

  return (
    <div className="app-layout">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overdueCount={overdueCount}
        onSeedData={handleSeedData}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          activeTab={activeTab}
          onOpenAddModal={handleOpenAddModal}
          onRefresh={() => fetchAllData(false)}
          isRefreshing={refreshing}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="content-area">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid #e2e8f0',
                  borderTopColor: '#4f46e5',
                  borderRadius: '50%',
                  margin: '0 auto 16px auto',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ fontWeight: 600 }}>Loading Invoice Nudge...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  summary={summary}
                  priorityInvoices={priorityInvoices}
                  recentInvoices={invoices}
                  onViewInvoice={handleViewInvoice}
                  onOpenPayment={handleOpenPaymentModal}
                  onOpenAddModal={handleOpenAddModal}
                  onGoToInvoices={() => setActiveTab('invoices')}
                  onGoToPriority={() => setActiveTab('priority')}
                />
              )}

              {activeTab === 'invoices' && (
                <Invoices
                  invoices={invoices}
                  onViewInvoice={handleViewInvoice}
                  onOpenPayment={handleOpenPaymentModal}
                  onOpenEdit={handleOpenEditModal}
                  onOpenDelete={handleOpenDeleteModal}
                  onOpenAddModal={handleOpenAddModal}
                />
              )}

              {activeTab === 'priority' && (
                <PriorityFollowUps
                  priorityInvoices={priorityInvoices}
                  onViewInvoice={handleViewInvoice}
                  onOpenPayment={handleOpenPaymentModal}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setEditingInvoice(null);
        }}
        onSubmit={handleSaveInvoice}
        initialData={editingInvoice}
      />

      <InvoiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onOpenPayment={handleOpenPaymentModal}
        onOpenEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPayingInvoice(null);
        }}
        invoice={payingInvoice}
        onSubmit={handleRecordPayment}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingInvoice(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${deletingInvoice?.invoiceNumber} (${deletingInvoice?.clientName})? This action cannot be undone.`}
        confirmText="Delete Invoice"
        isDanger={true}
      />
    </div>
  );
}

export default App;
