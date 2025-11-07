import React, { useState, useEffect, useCallback } from 'react';
import { Protocol, FastingData } from '../types';
import { PROTOCOLS, GOALS } from '../constants';

interface EditFastModalProps {
  day: Date;
  data: FastingData | undefined;
  onClose: () => void;
  onSave: (date: Date, data: FastingData) => void;
  onRemove: (date: Date) => void;
}

const EditFastModal: React.FC<EditFastModalProps> = ({ day, data, onClose, onSave, onRemove }) => {
    const [protocol, setProtocol] = useState<Protocol>(data?.fastingLength || 16);
    const [time, setTime] = useState(() => {
        const d = data?.startTime || new Date(day);
        if (!data?.startTime) {
            d.setHours(20, 0, 0, 0);
        }
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    });
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsShowing(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = useCallback(() => {
        setIsShowing(false);
        setTimeout(onClose, 300);
    }, [onClose]);

    const handleSave = () => {
        const [startHour, startMinute] = time.split(':').map(Number);
        const startDate = new Date(day);
        startDate.setHours(startHour, startMinute, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + protocol);

        onSave(day, {
            ...data,
            isFasting: true,
            fastingLength: protocol,
            startTime: startDate,
            endTime: endDate,
            goal: GOALS[protocol],
        });
        handleClose();
    };

    const handleRemove = () => {
        onRemove(day);
        handleClose();
    }
    
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

    const dateLabel = new Intl.DateTimeFormat('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' }).format(day);

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isShowing ? 'opacity-100 bg-black/70' : 'opacity-0 bg-black/0'}`} onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className={`bg-white dark:bg-brand-surface rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out ${isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={e => e.stopPropagation()}>
                <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upraviť pôst</h2>
                <p className="text-gray-500 dark:text-brand-text-muted mb-6">{dateLabel}</p>

                <div className="space-y-6">
                    <div>
                        <label className="text-lg font-semibold text-gray-800 dark:text-brand-text">Protokol (dĺžka pôstu)</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {PROTOCOLS.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setProtocol(p)}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                                        protocol === p
                                            ? 'bg-brand-primary text-white dark:text-brand-bg shadow-md scale-105'
                                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-brand-text-muted'
                                    }`}
                                >
                                    {p}h
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="start-time" className="text-lg font-semibold text-gray-800 dark:text-brand-text">Čas začiatku</label>
                        <input
                            type="time"
                            id="start-time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-brand-text font-mono text-xl w-full p-3 mt-2 rounded-lg border-2 border-transparent focus:border-brand-primary focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button onClick={handleSave} className="flex-1 bg-brand-primary hover:bg-sky-400 text-brand-bg font-bold py-3 px-4 rounded-lg transition-colors">
                        Uložiť zmeny
                    </button>
                    {data?.isFasting && (
                        <button onClick={handleRemove} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                            Zrušiť pôst
                        </button>
                    )}
                </div>
                 <button onClick={handleClose} className="w-full mt-3 text-gray-500 dark:text-brand-text-muted hover:text-gray-800 dark:hover:text-white transition-colors">Zavrieť</button>
            </div>
        </div>
    );
};

export default EditFastModal;