import React from 'react';
import { useModal } from '../context/ModalContext';

export default function Modal() {
  const { modalConfig, hideModal } = useModal();

  if (!modalConfig) return null;

  const { type, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' } = modalConfig;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    hideModal();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    hideModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="retro-card p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
        <div className="mb-6">
          <h3 className="text-xl font-black uppercase tracking-widest text-[var(--color-fin-text)] mb-2">
            {type === 'confirm' ? 'Confirm Action' : 'Alert'}
          </h3>
          <p className="text-[var(--color-fin-muted)] leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="px-6 py-3 border border-[var(--color-fin-border)] text-[var(--color-fin-muted)] hover:text-[var(--color-fin-text)] hover:border-[var(--color-fin-accent)] font-bold uppercase tracking-wider transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="retro-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
