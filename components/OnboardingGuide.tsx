import React, { useState, useEffect } from 'react';
import { Protocol, Frequency, DayOfWeek } from '../types';
import { PROTOCOLS, GOALS, FREQUENCY_OPTIONS, DAYS_OF_WEEK } from '../constants';

interface OnboardingGuideProps {
    onComplete: (settings: {
        protocol: Protocol;
        frequency: Frequency;
        days: DayOfWeek[];
        time: string;
    }) => void;
    onSkip: () => void;
}

type Chronotype = 'Ranný' | 'Denný' | 'Večerný';

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onComplete, onSkip }) => {
    const [step, setStep] = useState(1);
    const [isShowing, setIsShowing] = useState(false);

    // User selections
    const [protocol, setProtocol] = useState<Protocol | null>(null);
    const [frequency, setFrequency] = useState<Frequency | null>(null);
    const [days, setDays] = useState<DayOfWeek[]>([]);
    const [time, setTime] = useState('20:00');
    const [chronotype, setChronotype] = useState<Chronotype | null>(null);

    const optimalStartTimes: Record<Protocol, Record<Chronotype, number>> = {
        12: { 'Ranný': 19, 'Denný': 20, 'Večerný': 21 },
        16: { 'Ranný': 15, 'Denný': 18, 'Večerný': 20 },
        24: { 'Ranný': 14, 'Denný': 14, 'Večerný': 15 },
        36: { 'Ranný': 18, 'Denný': 19, 'Večerný': 20 },
        48: { 'Ranný': 14, 'Denný': 14, 'Večerný': 15 },
        72: { 'Ranný': 18, 'Denný': 19, 'Večerný': 20 }
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsShowing(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleSkip = () => {
        setIsShowing(false);
        setTimeout(onSkip, 300);
    };

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        }
    };
    
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleFinish = () => {
        if (protocol && frequency) {
            onComplete({ protocol, frequency, days, time });
            setIsShowing(false); // Animate out
        }
    };

    const handleChronotypeSelect = (selectedChronotype: Chronotype) => {
        setChronotype(selectedChronotype);
        if (protocol) {
            const recommendedHour = optimalStartTimes[protocol][selectedChronotype];
            setTime(`${recommendedHour.toString().padStart(2, '0')}:00`);
        }
    };
    
    const handleDayToggle = (day: DayOfWeek) => {
        setDays(currentDays => 
            currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day]
        );
    };

    const isNextDisabled = () => {
        switch (step) {
            case 2: return protocol === null;
            case 3: return frequency === null || (frequency === 'custom' && days.length === 0);
            case 4: return time === '';
            default: return false;
        }
    };

    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Vitajte v Pôstnom Manažéri!</h2>
                        <p className="text-gray-600 dark:text-brand-text-muted mb-8">Poďme spoločne nastaviť váš prvý pôstny plán. Tento sprievodca vám pomôže začať v niekoľkých jednoduchých krokoch.</p>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Vyberte si dĺžku pôstu (Protokol)</h2>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {PROTOCOLS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setProtocol(p)}
                                    className={`px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${protocol === p ? 'bg-brand-primary text-white dark:text-brand-bg shadow-lg scale-105' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    {p} hodín
                                </button>
                            ))}
                        </div>
                        {protocol && (
                            <div className="p-4 bg-sky-100 dark:bg-sky-900/50 rounded-lg text-center text-sky-800 dark:text-sky-300 animate-fade-in">
                                <p className="font-semibold">Váš cieľ:</p>
                                <p>{GOALS[protocol]}</p>
                            </div>
                        )}
                    </div>
                );
            case 3:
                 return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Zvoľte frekvenciu pôstu</h2>
                        <div className="space-y-3">
                            {FREQUENCY_OPTIONS.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => setFrequency(value)}
                                    className={`w-full p-4 text-left rounded-lg transition-colors ${frequency === value ? 'bg-brand-secondary text-white font-semibold' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {frequency === 'custom' && (
                             <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg animate-fade-in">
                                <label className="text-md font-semibold text-gray-800 dark:text-brand-text">Vyberte dni:</label>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {DAYS_OF_WEEK.map(day => (
                                        <button key={day} onClick={() => handleDayToggle(day)} className={`px-2 py-1 text-xs rounded transition-colors ${days.includes(day) ? 'bg-brand-primary text-white font-bold' : 'bg-gray-200 dark:bg-gray-700'}`}>{day.substring(0,3)}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                 );
            case 4:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">3. Nastavte čas začiatku</h2>
                        <p className="text-sm text-gray-500 dark:text-brand-text-muted mb-4">Odporúčame zvoliť čas podľa vášho chronotypu pre lepšie zosúladenie s vaším telom.</p>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {(['Ranný', 'Denný', 'Večerný'] as Chronotype[]).map(type => (
                                <button key={type} onClick={() => handleChronotypeSelect(type)} className={`p-3 rounded-lg transition-colors ${chronotype === type ? 'bg-brand-secondary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    {type} typ
                                </button>
                            ))}
                        </div>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => { setTime(e.target.value); setChronotype(null); }}
                            className="bg-gray-200 dark:bg-gray-700 font-mono text-xl w-full p-3 mt-2 rounded-lg border-2 border-transparent focus:border-brand-primary focus:outline-none focus:ring-0"
                        />
                    </div>
                );
            case 5:
                const freqLabel = FREQUENCY_OPTIONS.find(f => f.value === frequency)?.label;
                return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pripravené na štart!</h2>
                        <p className="text-gray-600 dark:text-brand-text-muted mb-6">Skontrolujte si svoj plán. Po potvrdení sa vygeneruje na aktuálny mesiac.</p>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left space-y-2">
                            <p><strong>Protokol:</strong> {protocol} hodín</p>
                            <p><strong>Frekvencia:</strong> {freqLabel}</p>
                            {frequency === 'custom' && <p><strong>Dni:</strong> {days.join(', ')}</p>}
                            <p><strong>Čas začiatku:</strong> {time}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-[100] transition-opacity duration-300 ${isShowing ? 'opacity-100 bg-black/70' : 'opacity-0 bg-black/0'}`} role="dialog" aria-modal="true">
            <div className={`bg-white dark:bg-brand-surface rounded-xl shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-300 ${isShowing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-4">
                         <div className="w-full">
                            <div className="mb-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div className="h-2.5 rounded-full bg-brand-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-brand-text-muted">Krok {step} z {totalSteps}</p>
                        </div>
                        <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors ml-4 flex-shrink-0">Preskočiť</button>
                    </div>
                    <div className="min-h-[280px] flex flex-col justify-center">
                        {renderStepContent()}
                    </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900/50 px-6 py-4 rounded-b-xl flex justify-between items-center">
                    <button onClick={handleBack} disabled={step === 1} className="font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-brand-text-muted hover:bg-gray-200 dark:hover:bg-gray-700">
                        Späť
                    </button>
                    {step < totalSteps && (
                        <button onClick={handleNext} disabled={isNextDisabled()} className="bg-brand-primary text-white dark:text-brand-bg font-bold py-2 px-6 rounded-lg transition-colors hover:bg-brand-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Ďalej
                        </button>
                    )}
                    {step === totalSteps && (
                        <button onClick={handleFinish} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors hover:bg-green-500">
                            Vytvoriť plán
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingGuide;
