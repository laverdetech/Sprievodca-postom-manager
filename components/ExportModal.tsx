import React, { useState, useEffect, useCallback } from 'react';

interface ExportModalProps {
  onClose: () => void;
  onExport: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, onExport }) => {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsShowing(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = useCallback(() => {
        setIsShowing(false);
        setTimeout(onClose, 300);
    }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);

    const handleExport = () => {
        onExport();
        handleClose();
    };

  return (
    <div 
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isShowing ? 'opacity-100 bg-black/70' : 'opacity-0 bg-black/0'}`} 
        onClick={handleClose} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="export-modal-title"
    >
      <div 
        className={`bg-white dark:bg-brand-surface rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 transform transition-all duration-300 ease-in-out ${isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
        onClick={e => e.stopPropagation()}
      >
        <h2 id="export-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Exportovať kalendár</h2>
        <p className="text-gray-500 dark:text-brand-text-muted mb-6">Vyberte si preferovanú kalendárovú službu. Obe možnosti stiahnu univerzálny súbor `.ics`.</p>

        <div className="space-y-4">
            <button 
                onClick={handleExport}
                className="w-full flex items-center justify-center space-x-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                <img src="https://www.google.com/calendar/images/favicon_v2014_16.ico" alt="Google Calendar icon" className="h-5 w-5" />
                <span>Google Kalendár</span>
            </button>
            <button 
                onClick={handleExport}
                className="w-full flex items-center justify-center space-x-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.338 4.647a.64.64 0 0 0-.646-.653.64.64 0 0 0-.648.64v.015c.002.345.289.625.64.625a.63.63 0 0 0 .654-.627z"/>
                    <path d="M11.184 6.838a.644.644 0 0 1-1.085.586c-1.353-1.46-3.138-1.46-4.502 0a.644.644 0 0 1-1.086-.586C6.208 4.983 8.163 4.2 9.97 5.252c1.782 1.036 2.45 3.11 1.213 1.586z"/>
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m0 1.5a6.5 6.5 0 1 1 0 13A6.5 6.5 0 0 1 8 1.5"/>
                </svg>
                <span>Apple Kalendár / Iné (.ics)</span>
            </button>
        </div>

        <button onClick={handleClose} className="w-full mt-6 text-gray-500 dark:text-brand-text-muted hover:text-gray-800 dark:hover:text-white transition-colors">Zavrieť</button>
      </div>
    </div>
  );
};

export default ExportModal;