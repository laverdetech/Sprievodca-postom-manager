import React, { useState, useEffect, useCallback } from 'react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  confirmText = 'Potvrdiť',
  cancelText = 'Zrušiť',
  onConfirm,
  onCancel,
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // Animate in on mount
    const timer = setTimeout(() => setIsShowing(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsShowing(false);
    setTimeout(onCancel, 300); // Allow animation to finish before unmounting
  }, [onCancel]);

  const handleConfirmAction = () => {
    onConfirm();
    // Parent is responsible for closing the modal by unmounting it
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isShowing ? 'opacity-100 bg-black/70' : 'opacity-0 bg-black/0'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className={`bg-white dark:bg-brand-surface rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out ${isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-gray-500 dark:text-brand-text-muted mb-6">{message}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConfirmAction}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
