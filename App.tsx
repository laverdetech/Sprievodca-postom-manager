import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Protocol, Frequency, DayOfWeek, Plan, FastingData, Filters, Theme, AccentColorName, LifeTimerSettings, AppView, FeelingRecord } from './types';
import { DAYS_OF_WEEK, GOALS, PROTOCOLS } from './constants';
import { formatToYYYYMMDD, getDaysInMonth, formatDateToICS } from './utils/date';
import PlannerForm from './components/PlannerForm';
import CalendarDisplay from './components/CalendarDisplay';
import EditFastModal from './components/EditFastModal';
import Statistics from './components/Statistics';
import CurrentFastTracker from './components/CurrentFastTracker';
import ExportModal from './components/ExportModal';
import FilterControls from './components/FilterControls';
import ThemeCustomizer from './components/ThemeCustomizer';
import FastingHistory from './components/FastingHistory';
import NextFastCountdown from './components/NextFastCountdown';
import ConfirmationModal from './components/ConfirmationModal';
import Header from './components/Header';
import YearlyHeatmap from './components/YearlyHeatmap';
import OnboardingGuide from './components/OnboardingGuide';
import FeelingLogModal from './components/FeelingLogModal';

const ACCENT_COLOR_MAP: Record<AccentColorName, { primary: string; secondary: string }> = {
    sky: { primary: '56 189 248', secondary: '129 140 248' },
    indigo: { primary: '99 102 241', secondary: '165 180 252' },
    emerald: { primary: '16 185 129', secondary: '52 211 153' },
    rose: { primary: '244 63 94', secondary: '251 113 133' },
    amber: { primary: '245 158 11', secondary: '251 191 36' },
    orange: { primary: '249 115 22', secondary: '251 146 60' },
    teal: { primary: '20 184 166', secondary: '45 212 191' },
    fuchsia: { primary: '217 70 239', secondary: '232 121 249' },
};

const App: React.FC = () => {
    const [plan, setPlan] = useState<Plan>({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [editingDay, setEditingDay] = useState<Date | null>(null);
    const [isPanelVisible, setIsPanelVisible] = useState(true);
    const [activeFast, setActiveFast] = useState<FastingData | null>(null);
    const [nextFast, setNextFast] = useState<FastingData | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({ protocol: 'all', status: 'all' });
    const [theme, setTheme] = useState<Theme>({ mode: 'dark', accent: 'sky' });
    const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [activeView, setActiveView] = useState<AppView>('calendar');
    const [lifeTimerSettings, setLifeTimerSettings] = useState<LifeTimerSettings>({
        dob: null,
        expectancy: 85,
        mode: 'countup',
        size: 'medium',
    });
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [feelingLogTarget, setFeelingLogTarget] = useState<string | null>(null);

    useEffect(() => {
        const onboardingComplete = localStorage.getItem('fasting-manager-onboarding-complete');
        if (!onboardingComplete) {
            setShowOnboarding(true);
        }

        const savedTheme = localStorage.getItem('fasting-manager-theme');
        if (savedTheme) {
            setTheme(JSON.parse(savedTheme));
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(currentTheme => ({ ...currentTheme, mode: prefersDark ? 'dark' : 'light' }));
        }

        const savedLifeTimerSettings = localStorage.getItem('fasting-manager-life-timer');
        if (savedLifeTimerSettings) {
            const parsed = JSON.parse(savedLifeTimerSettings);
            // Merge with defaults to ensure new properties like 'size' are present
            setLifeTimerSettings(prev => ({ ...prev, ...parsed }));
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme.mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        const colors = ACCENT_COLOR_MAP[theme.accent];
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        
        localStorage.setItem('fasting-manager-theme', JSON.stringify(theme));
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('fasting-manager-life-timer', JSON.stringify(lifeTimerSettings));
    }, [lifeTimerSettings]);

    useEffect(() => {
        const checkFasts = () => {
            const now = new Date();
            let currentFast: FastingData | null = null;
            let upcomingFast: FastingData | null = null;
    
            const allFasts = Object.values(plan)
                .filter((p: any): p is (FastingData & { startTime: Date, endTime: Date }) => !!(p && p.isFasting && p.startTime && p.endTime))
                .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
            for (const fast of allFasts) {
                const start = new Date(fast.startTime);
                const end = new Date(fast.endTime);
    
                if (now >= start && now <= end) {
                    currentFast = fast;
                    upcomingFast = null; 
                    break;
                }
    
                if (start > now) {
                    upcomingFast = fast; 
                    break;
                }
            }
    
            setActiveFast(currentFast);
            setNextFast(upcomingFast);
        };
    
        checkFasts();
        const intervalId = setInterval(checkFasts, 1000);
    
        return () => clearInterval(intervalId);
    }, [plan]);

    const handleApplyPlan = useCallback((settings: {
        protocol: Protocol;
        frequency: Frequency;
        days: DayOfWeek[];
        time: string;
    }) => {
        setPlan(currentPlan => {
            const { protocol, frequency, days, time } = settings;
            const [startHour, startMinute] = time.split(':').map(Number);
            
            const newPlanForMonth: Plan = {};
            const monthDays = getDaysInMonth(currentDate);
            const dayOfWeekMap = DAYS_OF_WEEK;

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Porovnávame iba dátum, nie čas

            monthDays.forEach((day) => {
                // Aplikujeme plán iba od dnešného dňa
                if (day < today) {
                    return; // Preskočíme minulé dni
                }
                
                let shouldFast = false;
                const dayOfWeekIndex = day.getDay() === 0 ? 6 : day.getDay() - 1;
                const dayOfWeekName = dayOfWeekMap[dayOfWeekIndex];

                switch (frequency) {
                    case 'daily':
                        shouldFast = true;
                        break;
                    case 'everyOtherDay':
                        shouldFast = (day.getDate() - 1) % 2 === 0;
                        break;
                    case 'weekly':
                        shouldFast = dayOfWeekIndex === 0;
                        break;
                    case 'custom':
                        shouldFast = days.includes(dayOfWeekName);
                        break;
                }

                const dateKey = formatToYYYYMMDD(day);
                if (shouldFast) {
                    const startDate = new Date(day);
                    startDate.setHours(startHour, startMinute, 0, 0);

                    const endDate = new Date(startDate);
                    endDate.setHours(endDate.getHours() + protocol);

                    newPlanForMonth[dateKey] = {
                        isFasting: true,
                        fastingLength: protocol,
                        startTime: startDate,
                        endTime: endDate,
                        goal: GOALS[protocol],
                        completed: false,
                    };
                } else {
                     // Toto zabezpečí, že pre budúce dni, ktoré nespĺňajú kritériá, sa vymaže prípadný existujúci pôst
                    newPlanForMonth[dateKey] = { isFasting: false };
                }
            });
            
            return { ...currentPlan, ...newPlanForMonth };
        });
    }, [currentDate]);

    const handleOnboardingComplete = (settings: {
        protocol: Protocol;
        frequency: Frequency;
        days: DayOfWeek[];
        time: string;
    }) => {
        handleApplyPlan(settings);
        setShowOnboarding(false);
        localStorage.setItem('fasting-manager-onboarding-complete', 'true');
    };

    const handleOnboardingSkip = () => {
        setShowOnboarding(false);
        localStorage.setItem('fasting-manager-onboarding-complete', 'true');
    };

    const handleResetPlan = useCallback(() => {
        setIsResetConfirmOpen(true);
    }, []);

    const handleConfirmReset = () => {
        setPlan({});
        setIsResetConfirmOpen(false);
    };

    const handleChangeMonth = (direction: 'next' | 'prev') => {
        setCurrentDate(current => {
            const newDate = new Date(current);
            newDate.setDate(1);
            newDate.setMonth(current.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };
    
    const handleSaveDay = (date: Date, data: FastingData) => {
        const dateKey = formatToYYYYMMDD(date);
        setPlan(current => {
            const existingData = current[dateKey];
            return { 
                ...current, 
                [dateKey]: { ...(existingData || {}), ...data } 
            };
        });
    };

    const handleRemoveDay = (date: Date) => {
        const dateKey = formatToYYYYMMDD(date);
        setPlan(current => ({ ...current, [dateKey]: { isFasting: false } }));
    };

    const handleToggleCompletion = (dateKey: string) => {
        setPlan(current => {
            const dayData = current[dateKey];
            // This function is now ONLY for un-completing a fast.
            // The calling component's logic should ensure dayData.completed is true.
            if (dayData && dayData.isFasting && dayData.completed) {
                // Also remove the note when un-completing
                const { feelingRecord, note, ...rest } = dayData;
                return {
                    ...current,
                    [dateKey]: { ...rest, completed: false }
                };
            }
            return current;
        });
    };
    
    const handleSaveFeelingRecord = (dateKey: string, record: FeelingRecord, note: string) => {
        setPlan(current => {
            const dayData = current[dateKey];
            if (dayData && dayData.isFasting) {
                return {
                    ...current,
                    [dateKey]: { ...dayData, completed: true, feelingRecord: record, note: note }
                };
            }
            return current;
        });
        setFeelingLogTarget(null); // Close modal after saving
    };

    const handleExportToIcs = () => {
        const monthDays = getDaysInMonth(currentDate);
        const events = monthDays
            .map(day => plan[formatToYYYYMMDD(day)])
            .filter((dayData): dayData is Required<FastingData> => 
                !!(dayData && dayData.isFasting && dayData.startTime && dayData.endTime)
            )
            .map(dayData => {
                const { startTime, endTime, fastingLength, goal } = dayData;
                const uid = `${formatToYYYYMMDD(startTime)}@fasting-manager.com`;
                const dtstamp = formatDateToICS(new Date());
                const dtstart = formatDateToICS(startTime);
                const dtend = formatDateToICS(endTime);
                const summary = `Pôst (${fastingLength}h)`;
                const description = goal || '';

                return [
                    'BEGIN:VEVENT',
                    `UID:${uid}`,
                    `DTSTAMP:${dtstamp}`,
                    `DTSTART:${dtstart}`,
                    `DTEND:${dtend}`,
                    `SUMMARY:${summary}`,
                    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
                    'END:VEVENT'
                ].join('\r\n');
            });

        if (events.length === 0) {
            alert('V tomto mesiaci nemáte naplánované žiadne pôsty na export.');
            return;
        }

        const icsBody = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//FastingManager//SK',
            ...events,
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsBody], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const monthName = new Intl.DateTimeFormat('sk-SK', { month: 'long', year: 'numeric' }).format(currentDate);
        link.download = `plan-postov-${monthName.replace(/\s+/g, '-')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const filteredData = useMemo(() => {
        let dataToFilter: (FastingData & { dateKey: string })[] = [];
        const now = new Date();

        if (activeView === 'calendar') {
            const monthDays = getDaysInMonth(currentDate);
            dataToFilter = monthDays
                .map(day => {
                    const dateKey = formatToYYYYMMDD(day);
                    return plan[dateKey] ? { ...plan[dateKey], dateKey } : null;
                })
                .filter((dayData): dayData is FastingData & { dateKey: string } => !!(dayData && dayData.isFasting));
        } else { // history
            dataToFilter = Object.entries(plan)
                .filter((entry: [string, any]): entry is [string, FastingData & { startTime: Date }] => {
                    const [, data] = entry;
                    return !!(
                        data &&
                        data.isFasting &&
                        data.startTime &&
                        new Date(data.startTime) < now
                    );
                })
                .map(([key, data]) => ({ ...data, dateKey: key }))
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        }

        return dataToFilter.filter(fast => {
            if (!fast.isFasting) return false;
            if (filters.protocol !== 'all' && fast.fastingLength !== Number(filters.protocol)) return false;
            if (filters.status === 'completed' && !fast.completed) return false;
            if (filters.status === 'uncompleted' && fast.completed) return false;
            return true;
        });
    }, [plan, currentDate, filters, activeView]);
    
    const statistics = useMemo(() => {
        const planned = filteredData.length;
        const completed = filteredData.filter(f => f.completed).length;
        const successRate = planned > 0 ? Math.round((completed / planned) * 100) : 0;
        return { planned, completed, successRate };
    }, [filteredData]);

    const handleFilterChange = (newFilters: Partial<Filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const ViewSwitcher: React.FC<{ active: AppView, setActive: (view: AppView) => void }> = ({ active, setActive }) => (
        <div className="flex justify-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <button 
                onClick={() => setActive('calendar')}
                className={`flex-1 px-4 py-2 text-sm font-bold rounded-md transition-colors ${active === 'calendar' ? 'bg-white dark:bg-brand-surface shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
            >
                Kalendár
            </button>
            <button 
                onClick={() => setActive('history')}
                className={`flex-1 px-4 py-2 text-sm font-bold rounded-md transition-colors ${active === 'history' ? 'bg-white dark:bg-brand-surface shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
            >
                História
            </button>
             <button 
                onClick={() => setActive('overview')}
                className={`flex-1 px-4 py-2 text-sm font-bold rounded-md transition-colors ${active === 'overview' ? 'bg-white dark:bg-brand-surface shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
            >
                Prehľad
            </button>
        </div>
    );

    return (
        <div className="min-h-screen font-sans">
             <a
                href="https://sprievodca-postom.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed top-6 right-6 z-50 text-gray-400 dark:text-slate-400 hover:text-brand-primary transition-colors"
                title="Prejsť na hlavnú stránku s časovačom"
                aria-label="Prejsť na hlavnú stránku s časovačom"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" x2="10" y1="2" y2="5"></line>
                    <line x1="14" x2="14" y1="2" y2="5"></line>
                    <circle cx="12" cy="14" r="8"></circle>
                    <path d="M12 14l-4-2.5"></path>
                    <path d="M12 14V9"></path>
                </svg>
            </a>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Header isFastActive={!!activeFast} lifeTimerSettings={lifeTimerSettings} />
                {activeFast && <CurrentFastTracker activeFast={activeFast} />}
                {!activeFast && nextFast && <NextFastCountdown nextFast={nextFast} />}
                <main className={`grid grid-cols-1 lg:grid mt-8 transition-all duration-500 ease-in-out ${isPanelVisible ? 'gap-8 lg:grid-cols-[minmax(350px,1fr)_2fr]' : 'gap-0 lg:grid-cols-[0fr_1fr]'}`}>
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden min-w-0 ${isPanelVisible ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-[2000px] lg:opacity-100'}`}>
                        <PlannerForm onApplyPlan={handleApplyPlan} onResetPlan={handleResetPlan} />
                    </div>
                    <div className="min-w-0">
                        {activeView !== 'overview' && (
                            <div className="mb-4 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <Statistics stats={statistics} />
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setIsExportModalOpen(true)}
                                            className="flex-shrink-0 flex items-center space-x-2 bg-white dark:bg-brand-surface hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-brand-text-muted px-3 py-2 rounded-lg text-sm"
                                            aria-label="Exportovať do kalendára"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm1 3a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 112 0 a1 1 0 01-2 0z" />
                                                <path d="M15 8a1 1 0 100-2 1 1 0 000 2z" />
                                            </svg>
                                            <span className="hidden sm:inline">Export</span>
                                        </button>
                                        <button 
                                            onClick={() => setIsPanelVisible(prev => !prev)}
                                            className="flex-shrink-0 flex items-center space-x-2 bg-white dark:bg-brand-surface hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-brand-text-muted px-3 py-2 rounded-lg text-sm"
                                            aria-label={isPanelVisible ? 'Skryť bočný panel' : 'Zobraziť bočný panel'}
                                            aria-expanded={isPanelVisible}
                                        >
                                            {isPanelVisible ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    <path fillRule="evenodd" d="M7.707 5.293a1 1 0 010 1.414L4.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    <path fillRule="evenodd" d="M12.293 14.707a1 1 0 010-1.414L15.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span className="hidden sm:inline">{isPanelVisible ? 'Skryť panel' : 'Zobraziť panel'}</span>
                                        </button>
                                    </div>
                                </div>
                                <FilterControls 
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                    protocols={PROTOCOLS}
                                />
                            </div>
                        )}
                        <ViewSwitcher active={activeView} setActive={setActiveView} />
                        <div className="mt-4">
                            {activeView === 'calendar' && (
                                <CalendarDisplay
                                    plan={plan}
                                    currentDate={currentDate}
                                    onDateClick={(date) => setEditingDay(date)}
                                    onChangeMonth={handleChangeMonth}
                                    onToggleCompletion={handleToggleCompletion}
                                    onOpenFeelingLog={setFeelingLogTarget}
                                    filters={filters}
                                    activeFast={activeFast}
                                />
                            )}
                            {activeView === 'history' && (
                                <FastingHistory
                                    fasts={filteredData}
                                    onToggleCompletion={handleToggleCompletion}
                                    onOpenFeelingLog={setFeelingLogTarget}
                                    onItemClick={(dateKey) => setEditingDay(new Date(dateKey))}
                                />
                            )}
                            {activeView === 'overview' && (
                                <YearlyHeatmap 
                                    plan={plan}
                                    year={currentDate.getFullYear()}
                                    accent={theme.accent}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <footer className="bg-brand-bg shadow-lg text-center text-slate-500 text-sm mt-16">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <img src="https://res.cloudinary.com/ddqrq1sf6/image/upload/v1757424550/Sprievodca%20P%C3%B4stom%20-%20Logo.png" alt="Logo Sprievodca Pôstom" className="h-20 w-auto mb-4" />
                            <p className="max-w-md">
                                Interaktívny sprievodca pôstom – sledujte fázy pôstu, benefity, fyziologické zmeny a tipy na bezpečné ukončenie. Prehľadne a prakticky.
                            </p>
                        </div>
                        <div className="flex justify-center md:justify-end">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold text-slate-300 mb-4">Projekt</h3>
                                    <ul className="space-y-2">
                                        <li><a href="index.html" className="hover:text-sky-400 transition-colors">Sprievodca</a></li>
                                        <li><a href="https://sprievodca-postom.netlify.app/interaktivna-cesta" className="hover:text-sky-400 transition-colors">Interaktívna cesta</a></li>
                                        <li><a href="o-projekte.html" className="hover:text-sky-400 transition-colors">O Projekte</a></li>
                                        <li><a href="kontakt.html" className="hover:text-sky-400 transition-colors">Kontakt</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-300 mb-4">Právne informácie</h3>
                                    <ul className="space-y-2">
                                        <li><a href="privacy-policy.html" className="hover:text-sky-400 transition-colors">Ochrana osobných údajov</a></li>
                                        <li><a href="cookies.html" className="hover:text-sky-400 transition-colors">Zásady Cookies</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-800">
                        <p className="mb-4">&copy; 2025 Interaktívny Sprievodca Pôstom. Všetky práva vyhradené.</p>
                        <p className="mt-2 max-w-2xl mx-auto">Tento nástroj slúži len na edukačné účely a nenahrádza odborné lekárske poradenstvo. Vždy konzultujte svoje zámery s lekárom.</p>
                    </div>
                </div>
            </footer>
            {isResetConfirmOpen && (
                <ConfirmationModal
                    title="Naozaj vymazať plán?"
                    message="Celý naplánovaný kalendár bude vymazaný. Táto akcia sa nedá vrátiť späť."
                    confirmText="Áno, vymazať"
                    onConfirm={handleConfirmReset}
                    onCancel={() => setIsResetConfirmOpen(false)}
                />
            )}
            {editingDay && (
                <EditFastModal 
                    day={editingDay}
                    data={plan[formatToYYYYMMDD(editingDay)]}
                    onClose={() => setEditingDay(null)}
                    onSave={handleSaveDay}
                    onRemove={handleRemoveDay}
                />
            )}
             {isExportModalOpen && (
                <ExportModal
                    onClose={() => setIsExportModalOpen(false)}
                    onExport={handleExportToIcs}
                />
            )}
            {feelingLogTarget && (
                <FeelingLogModal
                    dateKey={feelingLogTarget}
                    data={plan[feelingLogTarget]}
                    onClose={() => setFeelingLogTarget(null)}
                    onSave={handleSaveFeelingRecord}
                />
            )}
            <button
                onClick={() => setIsThemePanelOpen(true)}
                className="fixed bottom-6 right-6 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 z-30"
                aria-label="Otvoriť nastavenia vzhľadu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            {isThemePanelOpen && (
                <ThemeCustomizer 
                    theme={theme}
                    setTheme={setTheme}
                    lifeTimerSettings={lifeTimerSettings}
                    setLifeTimerSettings={setLifeTimerSettings}
                    onClose={() => setIsThemePanelOpen(false)}
                />
            )}
             {showOnboarding && (
                <OnboardingGuide 
                    onComplete={handleOnboardingComplete}
                    onSkip={handleOnboardingSkip}
                />
            )}
        </div>
    );
};

export default App;
