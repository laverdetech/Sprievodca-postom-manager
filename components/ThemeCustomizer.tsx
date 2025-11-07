import React, { useState, useEffect } from 'react';
import { Theme, AccentColorName, LifeTimerSettings } from '../types';

interface ThemeCustomizerProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  lifeTimerSettings: LifeTimerSettings;
  setLifeTimerSettings: (settings: LifeTimerSettings) => void;
  onClose: () => void;
}

const ACCENT_COLORS: { name: AccentColorName, className: string }[] = [
    { name: 'sky', className: 'bg-sky-500' },
    { name: 'indigo', className: 'bg-indigo-500' },
    { name: 'emerald', className: 'bg-emerald-500' },
    { name: 'rose', className: 'bg-rose-500' },
    { name: 'amber', className: 'bg-amber-500' },
    { name: 'orange', className: 'bg-orange-500' },
    { name: 'teal', className: 'bg-teal-500' },
    { name: 'fuchsia', className: 'bg-fuchsia-500' },
];

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ theme, setTheme, lifeTimerSettings, setLifeTimerSettings, onClose }) => {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShowing(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsShowing(false);
        setTimeout(onClose, 300); 
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
    }, []);

    const handleLifeTimerChange = (updates: Partial<LifeTimerSettings>) => {
        setLifeTimerSettings({ ...lifeTimerSettings, ...updates });
    };

    const handleResetLifeTimer = () => {
        handleLifeTimerChange({ dob: null });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] animate-fade-in" onClick={handleClose} role="dialog" aria-modal="true">
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 shadow-2xl p-6 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isShowing ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nastavenia Vzhľadu</h3>
                    <button onClick={handleClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="space-y-3 mb-8">
                    <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Režim</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
                        <button 
                            onClick={() => setTheme({ ...theme, mode: 'light' })}
                            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${theme.mode === 'light' ? 'bg-white shadow text-sky-600' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                            Svetlý
                        </button>
                        <button 
                            onClick={() => setTheme({ ...theme, mode: 'dark' })}
                            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${theme.mode === 'dark' ? 'bg-gray-900 shadow text-sky-400' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                            Tmavý
                        </button>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Farba zvýraznenia</label>
                    <div className="grid grid-cols-4 gap-3 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
                        {ACCENT_COLORS.map(({ name, className }) => (
                            <button
                                key={name}
                                onClick={() => setTheme({ ...theme, accent: name })}
                                className={`h-10 w-10 rounded-full transition-transform hover:scale-110 ${className} ${theme.accent === name ? 'ring-2 ring-offset-2 ring-offset-gray-200 dark:ring-offset-gray-800 ring-white dark:ring-gray-300' : ''}`}
                                aria-label={`Vybrať farbu ${name}`}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>
                
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Životný Časovač</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Motivačný nástroj na vizualizáciu vášho životného času.</p>
                    
                    <div className="space-y-3">
                        <label htmlFor="dob-input" className="text-md font-semibold text-gray-800 dark:text-gray-200">Dátum Narodenia</label>
                        <input
                            type="date"
                            id="dob-input"
                            value={lifeTimerSettings.dob || ''}
                            onChange={(e) => handleLifeTimerChange({ dob: e.target.value })}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-brand-text w-full p-2 rounded-lg border-2 border-transparent focus:border-brand-primary focus:outline-none focus:ring-0"
                        />
                    </div>

                    {lifeTimerSettings.dob && (
                        <>
                             <div className="space-y-3">
                                <label className="text-md font-semibold text-gray-800 dark:text-gray-200">Režim zobrazenia</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
                                    <button 
                                        onClick={() => handleLifeTimerChange({ mode: 'countup' })}
                                        className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${lifeTimerSettings.mode === 'countup' ? 'bg-white dark:bg-gray-900 shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
                                    >
                                        Počítať hore
                                    </button>
                                    <button 
                                        onClick={() => handleLifeTimerChange({ mode: 'countdown' })}
                                        className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${lifeTimerSettings.mode === 'countdown' ? 'bg-white dark:bg-gray-900 shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
                                    >
                                        Odpočítavanie
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-md font-semibold text-gray-800 dark:text-gray-200">Veľkosť časovača</label>
                                <div className="grid grid-cols-3 gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
                                    <button 
                                        onClick={() => handleLifeTimerChange({ size: 'small' })}
                                        className={`px-2 py-2 text-xs font-bold rounded-md transition-colors ${lifeTimerSettings.size === 'small' ? 'bg-white dark:bg-gray-900 shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
                                    >
                                        Malý
                                    </button>
                                    <button 
                                        onClick={() => handleLifeTimerChange({ size: 'medium' })}
                                        className={`px-2 py-2 text-xs font-bold rounded-md transition-colors ${lifeTimerSettings.size === 'medium' ? 'bg-white dark:bg-gray-900 shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
                                    >
                                        Stredný
                                    </button>
                                     <button 
                                        onClick={() => handleLifeTimerChange({ size: 'large' })}
                                        className={`px-2 py-2 text-xs font-bold rounded-md transition-colors ${lifeTimerSettings.size === 'large' ? 'bg-white dark:bg-gray-900 shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
                                    >
                                        Veľký
                                    </button>
                                </div>
                            </div>

                            {lifeTimerSettings.mode === 'countdown' && (
                                <div className="space-y-3">
                                    <label htmlFor="expectancy-input" className="text-md font-semibold text-gray-800 dark:text-gray-200">Vek Dožitia (roky)</label>
                                    <input
                                        type="number"
                                        id="expectancy-input"
                                        min="1"
                                        max="150"
                                        value={lifeTimerSettings.expectancy}
                                        onChange={(e) => handleLifeTimerChange({ expectancy: parseInt(e.target.value, 10) || 1 })}
                                        className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-brand-text w-full p-2 rounded-lg border-2 border-transparent focus:border-brand-primary focus:outline-none focus:ring-0"
                                    />
                                </div>
                            )}

                             <button
                                onClick={handleResetLifeTimer}
                                className="w-full text-sm text-red-500 hover:text-red-400 transition-colors font-semibold py-2"
                              >
                                Vynulovať časovač
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ThemeCustomizer;