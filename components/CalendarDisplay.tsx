import React, { useState } from 'react';
import { Plan, FastingData, Filters, Protocol } from '../types';
import { getCalendarGridDays, isSameDay, formatToYYYYMMDD } from '../utils/date';
import { PROTOCOL_GUIDES, PROTOCOLS } from '../constants';

interface CalendarDisplayProps {
  plan: Plan;
  currentDate: Date;
  onDateClick: (date: Date) => void;
  onChangeMonth: (direction: 'next' | 'prev') => void;
  onToggleCompletion: (dateKey: string) => void;
  onOpenFeelingLog: (dateKey: string) => void;
  filters: Filters;
  activeFast: FastingData | null;
}

const CircadianGuide: React.FC = () => {
    const [selectedProtocol, setSelectedProtocol] = useState<Protocol>(16);
    const guideData = PROTOCOL_GUIDES[selectedProtocol];

    return (
        <div className="bg-white dark:bg-brand-surface p-6 rounded-xl shadow-lg mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Sprievodca Fázami Pôstu
                </h3>
                <div className="flex-shrink-0">
                    <label htmlFor="protocol-guide-select" className="sr-only">Vyberte protokol</label>
                    <select
                        id="protocol-guide-select"
                        value={selectedProtocol}
                        onChange={(e) => setSelectedProtocol(Number(e.target.value) as Protocol)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-brand-text text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full sm:w-auto p-2 font-semibold"
                    >
                        {PROTOCOLS.map(p => (
                            <option key={p} value={p}>{p}-hodinový pôst</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="space-y-4">
                {guideData.map(item => (
                    <div key={item.title} className="flex items-start space-x-4 animate-fade-in">
                        <span className="text-2xl pt-1">{item.emoji}</span>
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-brand-text">{item.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-brand-text-muted">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const CalendarDisplay: React.FC<CalendarDisplayProps> = ({ plan, currentDate, onDateClick, onChangeMonth, onToggleCompletion, onOpenFeelingLog, filters, activeFast }) => {
  const calendarDays = getCalendarGridDays(currentDate);
  const weekDays = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const monthName = new Intl.DateTimeFormat('sk-SK', { month: 'long', year: 'numeric' }).format(currentDate);
  
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-white dark:bg-brand-surface p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => onChangeMonth('prev')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize text-center">{monthName}</h2>
                <button onClick={() => onChangeMonth('next')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-sm text-gray-500 dark:text-brand-text-muted mb-2">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarDays.map((day, index) => {
                    const dateKey = formatToYYYYMMDD(day);
                    const dayData = plan[dateKey];

                    // --- Find all relevant fasts for this day ---
                    const startingFast = dayData?.isFasting ? { data: dayData, sourceDate: day } : null;

                    let endingFast: { data: FastingData, sourceDate: Date } | null = null;
                    let progressingFast: { data: FastingData, sourceDate: Date } | null = null;

                    for (let i = 1; i <= 3; i++) { // Look back up to 3 days (for 72h fast)
                        const prevDate = new Date(day);
                        prevDate.setDate(day.getDate() - i);
                        const prevDateKey = formatToYYYYMMDD(prevDate);
                        const prevDayFastData = plan[prevDateKey];

                        if (prevDayFastData?.isFasting && prevDayFastData.startTime && prevDayFastData.endTime) {
                            const dayTime = day.getTime();
                            const startTime = prevDayFastData.startTime.getTime();
                            const endTime = prevDayFastData.endTime.getTime();

                            if (dayTime >= startTime && dayTime <= endTime) {
                                if (isSameDay(day, prevDayFastData.endTime)) {
                                    endingFast = { data: prevDayFastData, sourceDate: prevDate };
                                } else if (dayTime < endTime) {
                                    progressingFast = { data: prevDayFastData, sourceDate: prevDate };
                                }
                                break;
                            }
                        }
                    }
                    
                    const primaryFastForDay = startingFast || progressingFast || endingFast;

                    // --- Filtering logic ---
                    let isVisible = true;
                    if (primaryFastForDay) {
                        const { data: fastData, sourceDate } = primaryFastForDay;
                        const sourceKey = formatToYYYYMMDD(sourceDate);
                        const isFastCompleted = plan[sourceKey]?.completed ?? false;

                        if (filters.protocol !== 'all' && fastData.fastingLength !== Number(filters.protocol)) {
                            isVisible = false;
                        }
                        if (filters.status === 'completed' && !isFastCompleted) {
                            isVisible = false;
                        }
                        if (filters.status === 'uncompleted' && isFastCompleted) {
                            isVisible = false;
                        }
                    }

                    // --- Determine cell state and styles ---
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const today = new Date();
                    const isToday = isSameDay(day, today);

                    let isActiveFastDay = false;
                    if (activeFast?.startTime && activeFast.endTime && isCurrentMonth) {
                        const fastStart = new Date(activeFast.startTime).getTime();
                        const fastEnd = new Date(activeFast.endTime).getTime();
                        const dayStart = new Date(day).setHours(0, 0, 0, 0);
                        const dayEnd = new Date(day).setHours(23, 59, 59, 999);
                        if (dayStart <= fastEnd && dayEnd >= fastStart) {
                            isActiveFastDay = true;
                        }
                    }

                    const isCompleted = primaryFastForDay ? plan[formatToYYYYMMDD(primaryFastForDay.sourceDate)]?.completed ?? false : false;
                    const feelingRecord = primaryFastForDay ? plan[formatToYYYYMMDD(primaryFastForDay.sourceDate)]?.feelingRecord : undefined;
                    const isFilteredOut = primaryFastForDay && !isVisible;
                    
                    let backgroundClass = 'bg-gray-100 dark:bg-gray-800';
                    if (isCurrentMonth) {
                        if (startingFast) backgroundClass = 'bg-brand-primary/20';
                        else if (progressingFast) backgroundClass = 'bg-amber-500/20';
                        else if (endingFast) backgroundClass = 'bg-green-500/20';
                    } else {
                        backgroundClass = 'bg-gray-200/50 dark:bg-gray-900/50 text-gray-400 dark:text-brand-text-muted';
                    }

                    const cellClasses = [
                        'relative p-2 h-28 sm:h-36 rounded-lg transition-all duration-200 ease-in-out flex flex-col cursor-pointer border-2',
                        backgroundClass,
                        isToday ? 'border-brand-primary' : 'border-transparent',
                        isActiveFastDay ? 'ring-2 ring-brand-secondary' : '',
                        isCurrentMonth ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : 'hover:bg-gray-300/50 dark:hover:bg-gray-800/60',
                        isCompleted && !isFilteredOut ? 'opacity-60' : '',
                        isFilteredOut ? 'opacity-30' : ''
                    ].join(' ');
                    
                    const canToggleCompletion = primaryFastForDay && isCurrentMonth;
                    const sourceDateForToggle = primaryFastForDay?.sourceDate;

                    return (
                        <div key={index} className={cellClasses} onClick={() => onDateClick(day)}>
                            <div className="flex justify-between items-start">
                                <span className={`font-bold ${isToday ? 'text-brand-primary' : ''}`}>{day.getDate()}</span>
                                {isCompleted && feelingRecord && !isFilteredOut && (
                                    <span className="text-lg animate-scale-in">{feelingRecord.feeling}</span>
                                )}
                            </div>
                            
                            {canToggleCompletion && sourceDateForToggle && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const sourceKey = formatToYYYYMMDD(sourceDateForToggle);
                                        if (plan[sourceKey]?.completed) {
                                            onToggleCompletion(sourceKey); // Un-checks
                                        } else {
                                            onOpenFeelingLog(sourceKey); // Opens modal to check
                                        }
                                    }}
                                    className="absolute top-2 right-2 p-1 rounded-full group focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
                                    aria-label="Označiť ako splnené"
                                    disabled={isFilteredOut}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isCompleted ? 'text-green-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            )}
                            
                            {/* Info Blocks */}
                           {!isFilteredOut && (
                                <div className="absolute bottom-2 left-2 right-2 space-y-1 text-xs overflow-hidden mt-auto flex flex-col-reverse">
                                    {startingFast && isCurrentMonth && startingFast.data.startTime && (
                                         <div className="bg-sky-100 dark:bg-sky-600/30 text-sky-800 dark:text-sky-300 rounded px-1.5 py-1 text-center animate-fade-in">
                                             <p className="font-semibold text-[10px] sm:text-xs leading-tight">{startingFast.data.fastingLength}h ŠTART</p>
                                             <p className="font-mono text-[11px] sm:text-sm font-bold">
                                                 {new Intl.DateTimeFormat('sk-SK', { hour: '2-digit', minute: '2-digit' }).format(startingFast.data.startTime)}
                                             </p>
                                         </div>
                                    )}
                                    {progressingFast && isCurrentMonth && progressingFast.data.fastingLength && (
                                        <div className="bg-amber-100 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 rounded px-1.5 py-1 text-center animate-fade-in">
                                            <p className="font-semibold text-[10px] sm:text-xs leading-tight">{progressingFast.data.fastingLength}h PRIEBEH</p>
                                        </div>
                                    )}
                                    {endingFast && isCurrentMonth && endingFast.data.endTime && endingFast.data.fastingLength && (
                                        <div className="bg-green-100 dark:bg-green-600/30 text-green-800 dark:text-green-300 rounded px-1.5 py-1 text-center animate-fade-in">
                                            <p className="font-semibold text-[10px] sm:text-xs leading-tight">{endingFast.data.fastingLength}h KONIEC</p>
                                            <p className="font-mono text-[11px] sm:text-sm font-bold">
                                                {new Intl.DateTimeFormat('sk-SK', { hour: '2-digit', minute: '2-digit' }).format(endingFast.data.endTime)}
                                             </p>
                                        </div>
                                    )}
                                </div>
                           )}
                        </div>
                    );
                })}
            </div>
        </div>
        <CircadianGuide />
    </div>
  );
};

export default CalendarDisplay;
