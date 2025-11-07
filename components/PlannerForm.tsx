import React, { useState } from 'react';
import { Protocol, Frequency, DayOfWeek } from '../types';
import { PROTOCOLS, FREQUENCY_OPTIONS, DAYS_OF_WEEK } from '../constants';

interface PlannerFormProps {
    onApplyPlan: (settings: {
        protocol: Protocol;
        frequency: Frequency;
        days: DayOfWeek[];
        time: string;
    }) => void;
    onResetPlan: () => void;
}

type Chronotype = 'Ranný' | 'Denný' | 'Večerný';

const PlannerForm: React.FC<PlannerFormProps> = ({ onApplyPlan, onResetPlan }) => {
    const [protocol, setProtocol] = useState<Protocol>(16);
    const [chronotype, setChronotype] = useState<Chronotype | null>(null);
    const [frequency, setFrequency] = useState<Frequency>('daily');
    const [days, setDays] = useState<DayOfWeek[]>(['Pondelok', 'Streda', 'Piatok']);
    const [time, setTime] = useState('20:00');

    const optimalStartTimes: Record<Protocol, Record<Chronotype, number>> = {
        12: { 'Ranný': 19, 'Denný': 20, 'Večerný': 21 },
        16: { 'Ranný': 15, 'Denný': 18, 'Večerný': 20 },
        24: { 'Ranný': 14, 'Denný': 14, 'Večerný': 15 },
        36: { 'Ranný': 18, 'Denný': 19, 'Večerný': 20 },
        48: { 'Ranný': 14, 'Denný': 14, 'Večerný': 15 },
        72: { 'Ranný': 18, 'Denný': 19, 'Večerný': 20 }
    };

    const handleProtocolSelect = (p: Protocol) => {
        setProtocol(p);
        if (chronotype) {
            const recommendedHour = optimalStartTimes[p][chronotype];
            setTime(`${recommendedHour.toString().padStart(2, '0')}:00`);
        }
    };
    
    const handleChronotypeSelect = (selectedChronotype: Chronotype) => {
        const newChronotype = chronotype === selectedChronotype ? null : selectedChronotype;
        setChronotype(newChronotype);
        if (newChronotype) {
            const recommendedHour = optimalStartTimes[protocol][newChronotype];
            setTime(`${recommendedHour.toString().padStart(2, '0')}:00`);
        }
    };
    
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value);
        setChronotype(null); // Deselect chronotype on manual time change
    };

    const handleDayToggle = (day: DayOfWeek) => {
        const newSelectedDays = days.includes(day)
            ? days.filter(d => d !== day)
            : [...days, day];
        setDays(newSelectedDays);
    };

    const handleApplyClick = () => {
        onApplyPlan({ protocol, frequency, days, time });
    };

    const chronotypeOptions: { type: Chronotype; label: string; icon: string; }[] = [
        { type: 'Ranný', label: 'Ranný vták', icon: '🐦' },
        { type: 'Denný', label: 'Denný typ', icon: '☀️' },
        { type: 'Večerný', label: 'Nočná sova', icon: '🦉' },
    ];

    return (
        <div className="bg-white dark:bg-brand-surface p-6 rounded-xl shadow-lg space-y-8 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b-2 border-brand-primary/20 pb-2">🗓️ Vytvoriť plán</h2>
            <p className="text-sm text-gray-500 dark:text-brand-text-muted -mt-6">Týmto nástrojom vygenerujete opakujúci sa plán od dnešného dňa pre aktuálne zobrazený mesiac.</p>

            {/* Protocol Selection */}
            <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-800 dark:text-brand-text">1. Protokol (dĺžka pôstu)</label>
                <div className="grid grid-cols-3 gap-2">
                    {PROTOCOLS.map((p) => (
                        <button
                            key={p}
                            onClick={() => handleProtocolSelect(p)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 ease-in-out ${
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

             {/* Chronotype Selection */}
            <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-800 dark:text-brand-text">2. Optimalizácia podľa chronotypu <span className="text-sm font-normal text-gray-400">(nepovinné)</span></label>
                <p className="text-xs text-gray-500 dark:text-brand-text-muted -mt-2">Vyberte si svoj typ a my vám odporučíme ideálny čas začiatku pôstu pre váš biorytmus.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {chronotypeOptions.map(({ type, label, icon }) => (
                        <button
                            key={type}
                            onClick={() => handleChronotypeSelect(type)}
                            className={`p-3 text-left rounded-lg transition-all duration-200 ease-in-out flex flex-col items-center text-center ${
                                chronotype === type
                                    ? 'bg-brand-secondary text-white font-semibold'
                                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-brand-text-muted'
                            }`}
                        >
                            <span className="text-2xl mb-1">{icon}</span>
                            <span className="text-sm font-bold">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Frequency Selection */}
            <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-800 dark:text-brand-text">3. Frekvencia</label>
                <div className="flex flex-col space-y-2">
                    {FREQUENCY_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setFrequency(value)}
                            className={`p-3 text-left rounded-lg transition-all duration-200 ease-in-out ${
                                frequency === value
                                    ? 'bg-brand-secondary text-white font-semibold'
                                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-brand-text-muted'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Day Selection */}
            {frequency === 'custom' && (
                <div className="space-y-3 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg transition-all duration-300">
                    <label className="text-md font-semibold text-gray-800 dark:text-brand-text">Vyberte dni v týždni:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                            <button
                                key={day}
                                onClick={() => handleDayToggle(day)}
                                className={`px-2 py-1 text-xs rounded transition-colors duration-200 ease-in-out ${
                                    days.includes(day)
                                        ? 'bg-brand-primary text-white dark:text-brand-bg font-bold'
                                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-brand-text-muted'
                                }`}
                            >
                                {day.substring(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Start Time Selection */}
            <div className="space-y-3">
                <label htmlFor="start-time" className="text-lg font-semibold text-gray-800 dark:text-brand-text">4. Čas začiatku</label>
                <input
                    type="time"
                    id="start-time"
                    value={time}
                    onChange={handleTimeChange}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-brand-text font-mono text-xl w-full p-3 rounded-lg border-2 border-transparent focus:border-brand-primary focus:outline-none focus:ring-0"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleApplyClick}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg text-lg transition-transform hover:scale-105 ease-in-out"
                >
                    Aplikovať na mesiac
                </button>
                 <button
                    onClick={onResetPlan}
                    className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                    title="Vymazať celý plán"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default PlannerForm;