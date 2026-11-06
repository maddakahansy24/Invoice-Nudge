import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isDanger = true }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} maxWidth="460px">
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: isDanger ? '#fee2e2' : '#fef3c7',
          color: isDanger ? '#dc2626' : '#d97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={22} />
        </div>
        <div>
          <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>

      <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
        >
          {isDanger && <Trash2 size={16} />}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

