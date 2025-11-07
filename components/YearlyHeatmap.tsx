import React from 'react';
import { Plan, FastingData, AccentColorName } from '../types';
import { formatToYYYYMMDD } from '../utils/date';

interface YearlyHeatmapProps {
    plan: Plan;
    year: number;
    accent: AccentColorName;
}

const ACCENT_COLOR_HEATMAP_CLASSES: Record<AccentColorName, string[]> = {
    sky: ['bg-sky-200 dark:bg-sky-900', 'bg-sky-300 dark:bg-sky-800', 'bg-sky-400 dark:bg-sky-700', 'bg-sky-500 dark:bg-sky-600', 'bg-sky-600 dark:bg-sky-500', 'bg-sky-700 dark:bg-sky-400'],
    indigo: ['bg-indigo-200 dark:bg-indigo-900', 'bg-indigo-300 dark:bg-indigo-800', 'bg-indigo-400 dark:bg-indigo-700', 'bg-indigo-500 dark:bg-indigo-600', 'bg-indigo-600 dark:bg-indigo-500', 'bg-indigo-700 dark:bg-indigo-400'],
    emerald: ['bg-emerald-200 dark:bg-emerald-900', 'bg-emerald-300 dark:bg-emerald-800', 'bg-emerald-400 dark:bg-emerald-700', 'bg-emerald-500 dark:bg-emerald-600', 'bg-emerald-600 dark:bg-emerald-500', 'bg-emerald-700 dark:bg-emerald-400'],
    rose: ['bg-rose-200 dark:bg-rose-900', 'bg-rose-300 dark:bg-rose-800', 'bg-rose-400 dark:bg-rose-700', 'bg-rose-500 dark:bg-rose-600', 'bg-rose-600 dark:bg-rose-500', 'bg-rose-700 dark:bg-rose-400'],
    amber: ['bg-amber-200 dark:bg-amber-900', 'bg-amber-300 dark:bg-amber-800', 'bg-amber-400 dark:bg-amber-700', 'bg-amber-500 dark:bg-amber-600', 'bg-amber-600 dark:bg-amber-500', 'bg-amber-700 dark:bg-amber-400'],
    orange: ['bg-orange-200 dark:bg-orange-900', 'bg-orange-300 dark:bg-orange-800', 'bg-orange-400 dark:bg-orange-700', 'bg-orange-500 dark:bg-orange-600', 'bg-orange-600 dark:bg-orange-500', 'bg-orange-700 dark:bg-orange-400'],
    teal: ['bg-teal-200 dark:bg-teal-900', 'bg-teal-300 dark:bg-teal-800', 'bg-teal-400 dark:bg-teal-700', 'bg-teal-500 dark:bg-teal-600', 'bg-teal-600 dark:bg-teal-500', 'bg-teal-700 dark:bg-teal-400'],
    fuchsia: ['bg-fuchsia-200 dark:bg-fuchsia-900', 'bg-fuchsia-300 dark:bg-fuchsia-800', 'bg-fuchsia-400 dark:bg-fuchsia-700', 'bg-fuchsia-500 dark:bg-fuchsia-600', 'bg-fuchsia-600 dark:bg-fuchsia-500', 'bg-fuchsia-700 dark:bg-fuchsia-400'],
};

const YearlyHeatmap: React.FC<YearlyHeatmapProps> = ({ plan, year, accent }) => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const colorShades = ACCENT_COLOR_HEATMAP_CLASSES[accent];

    const getDayColor = (dayData: FastingData | undefined): string => {
        if (!dayData || !dayData.isFasting) {
            return 'bg-gray-200 dark:bg-gray-800/50';
        }
        
        const protocol = dayData.fastingLength || 12;
        let colorClass = '';
        if (protocol <= 12) colorClass = colorShades[0];
        else if (protocol <= 16) colorClass = colorShades[1];
        else if (protocol <= 24) colorClass = colorShades[2];
        else if (protocol <= 36) colorClass = colorShades[3];
        else if (protocol <= 48) colorClass = colorShades[4];
        else colorClass = colorShades[5];

        const opacityClass = dayData.completed ? 'opacity-100' : 'opacity-60';

        return `${colorClass} ${opacityClass}`;
    };

    const getTooltipText = (day: Date, dayData: FastingData | undefined): string => {
        const dateString = day.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' });
        if (!dayData || !dayData.isFasting) {
            return dateString;
        }
        const status = dayData.completed ? 'Splnený' : 'Naplánovaný';
        return `${dateString} - ${dayData.fastingLength}h pôst (${status})`;
    };
    
    return (
        <div className="bg-white dark:bg-brand-surface p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ročný Prehľad Pôstov - {year}
            </h2>

            <div className="flex flex-wrap gap-x-4 gap-y-1 items-center mb-6 text-xs text-gray-600 dark:text-gray-400">
                <span>Menej</span>
                <div className="flex gap-1 items-center">
                    {colorShades.slice(0, 5).map((colorClass, index) => (
                         <div key={index} className={`w-3 h-3 rounded-sm ${colorClass}`}></div>
                    ))}
                </div>
                <span>Viac</span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-gray-400 opacity-60"></div>
                    <span>Naplánované</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-gray-400"></div>
                    <span>Splnené</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                {months.map(monthIndex => {
                    const monthDate = new Date(year, monthIndex, 1);
                    const monthName = monthDate.toLocaleString('sk-SK', { month: 'long' });
                    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
                    const firstDayOfWeek = (new Date(year, monthIndex, 1).getDay() + 6) % 7; // Pondelok je 0

                    const monthDays = Array.from({ length: daysInMonth }, (_, i) => new Date(year, monthIndex, i + 1));

                    return (
                        <div key={monthIndex}>
                            <h3 className="font-bold text-md sm:text-lg text-gray-800 dark:text-brand-text mb-2 capitalize">{monthName}</h3>
                             <div className="grid grid-cols-7 gap-px text-center text-xs text-gray-400 mb-1">
                                <span>P</span><span>U</span><span>S</span><span>Š</span><span>P</span><span>S</span><span>N</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`}></div>)}
                                {monthDays.map(day => {
                                    const dateKey = formatToYYYYMMDD(day);
                                    const dayData = plan[dateKey];
                                    return (
                                        <div 
                                            key={dateKey} 
                                            className={`aspect-square w-full rounded-sm transition-transform hover:scale-125 ${getDayColor(dayData)}`}
                                            title={getTooltipText(day, dayData)}
                                        ></div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default YearlyHeatmap;