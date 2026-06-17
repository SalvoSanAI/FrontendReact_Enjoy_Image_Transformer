import React, { useEffect } from 'react';
import './ErrorModal.css';

function ErrorModal({ message, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">⚠️</div>
        <h2 className="modal-title">Ops! Qualcosa non va</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-close-btn" onClick={onClose}>
          Chiudi
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
