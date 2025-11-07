import React, { useState, useEffect, useCallback } from 'react';
import { FeelingRecord, FastingData } from '../types';

interface FeelingLogModalProps {
    dateKey: string;
    data: FastingData | undefined;
    onClose: () => void;
    onSave: (dateKey: string, record: FeelingRecord, note: string) => void;
}

const FEELINGS: { emoji: string; label: string }[] = [
    { emoji: '💪', label: 'Energický' },
    { emoji: '🧠', label: 'Sústredený' },
    { emoji: '😊', label: 'Dobre' },
    { emoji: '🥱', label: 'Unavený' },
    { emoji: '🍽️', label: 'Hladný' },
    { emoji: '🎉', label: 'Hrdý' },
];

const DIFFICULTIES: { level: number; label: string }[] = [
    { level: 1, label: 'Veľmi ľahký' },
    { level: 2, label: 'Ľahký' },
    { level: 3, label: 'Stredný' },
    { level: 4, label: 'Ťažký' },
    { level: 5, label: 'Veľmi ťažký' },
];

const DifficultyRater: React.FC<{ selected: number; onSelect: (level: number) => void }> = ({ selected, onSelect }) => (
    <div className="flex justify-center items-center space-x-2">
        {DIFFICULTIES.map(({ level, label }) => (
            <button
                key={level}
                title={label}
                onClick={() => onSelect(level)}
                className="group focus:outline-none"
            >
                <svg
                    className={`h-8 w-8 transition-colors duration-200 ${selected >= level ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600 group-hover:text-amber-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </button>
        ))}
    </div>
);


const FeelingLogModal: React.FC<FeelingLogModalProps> = ({ dateKey, data, onClose, onSave }) => {
    const [difficulty, setDifficulty] = useState<number | null>(data?.feelingRecord?.difficulty || null);
    const [feeling, setFeeling] = useState<string | null>(data?.feelingRecord?.feeling || null);
    const [note, setNote] = useState(data?.note || '');
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
        if (difficulty && feeling) {
            onSave(dateKey, { difficulty, feeling }, note);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);

    const dateLabel = new Date(dateKey).toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div 
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isShowing ? 'opacity-100 bg-black/70' : 'opacity-0 bg-black/0'}`} 
            onClick={handleClose} 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="feeling-modal-title"
        >
            <div 
                className={`bg-white dark:bg-brand-surface rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out ${isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
                onClick={e => e.stopPropagation()}
            >
                <h2 id="feeling-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ako ste sa cítili?</h2>
                <p className="text-gray-500 dark:text-brand-text-muted mb-6">Zaznamenajte si pocity pre pôst zo dňa {dateLabel}.</p>

                <div className="space-y-6">
                    <div>
                        <label className="text-lg font-semibold text-gray-800 dark:text-brand-text block text-center mb-2">1. Aký náročný bol pôst?</label>
                        <DifficultyRater selected={difficulty || 0} onSelect={setDifficulty} />
                         <p className="text-center text-sm text-gray-500 dark:text-brand-text-muted mt-2 h-5">
                            {difficulty ? DIFFICULTIES[difficulty - 1].label : ''}
                        </p>
                    </div>
                    <div>
                        <label className="text-lg font-semibold text-gray-800 dark:text-brand-text block text-center mb-3">2. Čo ste prevažne cítili?</label>
                        <div className="grid grid-cols-3 gap-3">
                            {FEELINGS.map(({ emoji, label }) => (
                                <button
                                    key={emoji}
                                    onClick={() => setFeeling(emoji)}
                                    className={`p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-200 ${feeling === emoji ? 'bg-brand-primary text-white scale-105 shadow-lg' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    <span className="text-3xl">{emoji}</span>
                                    <span className="text-xs font-bold">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="feeling-note-input" className="text-lg font-semibold text-gray-800 dark:text-brand-text block text-center mb-2">3. Poznámka (nepovinné)</label>
                        <textarea
                            id="feeling-note-input"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-brand-text w-full p-3 rounded-lg border-2 border-transparent focus:border-brand-primary focus:outline-none focus:ring-0"
                            placeholder="Napr. 'Dnes som mal veľa energie', 'Bolela ma hlava'..."
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={handleSave} 
                        disabled={!difficulty || !feeling}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Uložiť a označiť ako splnené
                    </button>
                    <button onClick={handleClose} className="w-full mt-3 text-gray-500 dark:text-brand-text-muted hover:text-gray-800 dark:hover:text-white transition-colors">Zrušiť</button>
                </div>
            </div>
        </div>
    );
};

export default FeelingLogModal;