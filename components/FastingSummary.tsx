import React, { useState, useMemo } from 'react';
import { FastingData, FastingSummaryStats } from '../types';

interface FastingSummaryProps {
  fasts: (FastingData & { dateKey: string })[];
}

const calculateFastingStats = (fasts: (FastingData & { dateKey: string })[], days: number): FastingSummaryStats => {
    const now = new Date();
    const limitDate = new Date();
    limitDate.setDate(now.getDate() - days);

    const relevantFasts = fasts.filter(f => f.startTime && new Date(f.startTime) >= limitDate && f.completed);

    if (relevantFasts.length === 0) {
        return { totalFasts: 0, averageDuration: 0, longestFast: 0, longestStreak: 0 };
    }

    const totalFasts = relevantFasts.length;

    const totalDuration = relevantFasts.reduce((acc, f) => acc + (f.fastingLength || 0), 0);
    const averageDuration = totalFasts > 0 ? totalDuration / totalFasts : 0;

    const longestFast = Math.max(0, ...relevantFasts.map(f => f.fastingLength || 0));

    const sortedDates = relevantFasts
        .map(f => new Date(f.startTime!))
        .sort((a, b) => a.getTime() - b.getTime());

    let longestStreak = 0;
    let currentStreak = 0;

    if (sortedDates.length > 0) {
        longestStreak = 1;
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const diffDays = (sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 3600 * 24);
            if (diffDays <= 1.5) { // Allows for slightly different start times day-to-day
                currentStreak++;
            } else {
                currentStreak = 1;
            }
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
        }
    }
    
    return {
        totalFasts,
        averageDuration: parseFloat(averageDuration.toFixed(1)),
        longestFast,
        longestStreak
    };
};

// FIX: Replaced `JSX.Element` with `React.ReactNode` to fix "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; }> = ({ icon, value, label }) => (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center flex flex-col items-center justify-center animate-scale-in">
        <div className="text-brand-primary mb-2">{icon}</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        <div className="text-xs text-gray-500 dark:text-brand-text-muted uppercase">{label}</div>
    </div>
);

const Badge: React.FC<{ icon: string, name: string, description: string }> = ({ icon, name, description }) => (
    <div className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-lg flex items-center space-x-4 animate-fade-in">
        <div className="text-4xl">{icon}</div>
        <div>
            <div className="font-bold text-amber-800 dark:text-amber-300">{name}</div>
            <div className="text-sm text-amber-600 dark:text-amber-400">{description}</div>
        </div>
    </div>
);


const FastingSummary: React.FC<FastingSummaryProps> = ({ fasts }) => {
    const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

    const stats = useMemo(() => {
        return calculateFastingStats(fasts, timeRange === 'week' ? 7 : 30);
    }, [fasts, timeRange]);

    const badges = useMemo(() => {
        const earned = [];
        if (stats.longestStreak >= 5) {
            earned.push({
                icon: '🔥',
                name: 'Železná Vôľa',
                description: `Udržali ste sériu ${stats.longestStreak} dní pôstu po sebe!`
            });
        }
        if (stats.longestFast >= 36) {
             earned.push({
                icon: '🏃‍♂️',
                name: 'Maratónec',
                description: `Absolvovali ste pôst dlhší ako 36 hodín!`
            });
        }
        return earned;
    }, [stats]);

    const handleShare = async () => {
        const periodText = timeRange === 'week' ? 'posledných 7 dní' : 'posledných 30 dní';
        let report = `📊 Môj Pôstny Report za ${periodText}:\n\n`;
        report += `📅 Dní pôstu: ${stats.totalFasts}\n`;
        report += `⏱️ Priemerná dĺžka: ${stats.averageDuration} h\n`;
        report += `🚀 Najdlhší pôst: ${stats.longestFast} h\n`;
        report += `🔥 Najdlhšia séria: ${stats.longestStreak} dní\n\n`;
        
        if (badges.length > 0) {
            report += "🏆 Získané odznaky:\n";
            badges.forEach(badge => {
                report += `- ${badge.icon} ${badge.name}\n`;
            });
            report += "\n";
        }
    
        report += "Sleduj svoj pokrok s Pôstnym Manažérom!";
    
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Môj Pôstny Report',
                    text: report,
                });
            } else {
                await navigator.clipboard.writeText(report);
                alert('Report bol skopírovaný do schránky!');
            }
        } catch (err) {
            console.error('Chyba pri zdieľaní:', err);
            alert('Nepodarilo sa zdieľať/kopírovať report.');
        }
    };


    return (
        <div className="bg-white dark:bg-brand-surface p-4 sm:p-6 rounded-xl shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Súhrn štatistík</h2>
                <div className="flex-shrink-0 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg self-end sm:self-center">
                    <button 
                        onClick={() => setTimeRange('week')}
                        className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${timeRange === 'week' ? 'bg-white dark:bg-brand-surface shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                        7 Dní
                    </button>
                    <button 
                        onClick={() => setTimeRange('month')}
                        className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${timeRange === 'month' ? 'bg-white dark:bg-brand-surface shadow text-brand-primary' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                        30 Dní
                    </button>
                </div>
            </div>

            {stats.totalFasts > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} value={stats.totalFasts} label="Dní Pôstu" />
                        <StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} value={`${stats.averageDuration} h`} label="Priem. Dĺžka" />
                        <StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} value={`${stats.longestFast} h`} label="Najdlhší Pôst" />
                        <StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z" /></svg>} value={stats.longestStreak} label="Najdlhšia Séria" />
                    </div>
                    {badges.length > 0 && (
                        <div className="space-y-4">
                             <h3 className="text-lg font-bold text-gray-800 dark:text-brand-text">🏆 Získané Odznaky</h3>
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {badges.map(badge => <Badge key={badge.name} {...badge} />)}
                             </div>
                        </div>
                    )}
                    <button
                        onClick={handleShare}
                        className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-transform hover:scale-105"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Zdieľať report
                    </button>
                </>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-brand-text-muted">Žiadne dokončené pôsty v tomto období na zobrazenie štatistík.</p>
                </div>
            )}
        </div>
    );
};

export default FastingSummary;