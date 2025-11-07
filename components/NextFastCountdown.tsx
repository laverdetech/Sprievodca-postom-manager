import React, { useState, useEffect, useMemo } from 'react';
import { FastingData } from '../types';

interface NextFastCountdownProps {
  nextFast: FastingData;
}

const formatCountdown = (totalSeconds: number): { days: string, hours: string, minutes: string, seconds: string } => {
    if (totalSeconds < 0) totalSeconds = 0;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return { 
        days: String(days), 
        hours: String(hours).padStart(2, '0'), 
        minutes: String(minutes).padStart(2, '0'), 
        seconds: String(seconds).padStart(2, '0') 
    };
}


const NextFastCountdown: React.FC<NextFastCountdownProps> = ({ nextFast }) => {
    const { startTime, fastingLength } = nextFast;
    
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const remainingSeconds = useMemo(() => {
        if (!startTime) return 0;
        const start = new Date(startTime).getTime();
        const currentTime = now.getTime();
        return Math.round((start - currentTime) / 1000);
    }, [now, startTime]);
    
    const timeParts = formatCountdown(remainingSeconds);

    if (!startTime || remainingSeconds < 0) return null;

    return (
        <div className="bg-white dark:bg-brand-surface p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in border-l-4 border-brand-secondary">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-grow w-full">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Odpočítavanie do ďalšieho pôstu ({fastingLength}h)
                    </h3>
                    
                    <div className="flex items-baseline justify-center sm:justify-start gap-2 sm:gap-4">
                         {timeParts.days !== '0' && (
                            <div className="text-center">
                                <span className="text-4xl font-bold text-brand-secondary tabular-nums">{timeParts.days}</span>
                                <span className="text-xs block text-gray-500 dark:text-brand-text-muted">dní</span>
                            </div>
                         )}
                         <div className="text-center">
                            <span className="text-4xl font-bold text-brand-secondary tabular-nums">{timeParts.hours}</span>
                            <span className="text-xs block text-gray-500 dark:text-brand-text-muted">hodín</span>
                         </div>
                         <div className="text-center">
                            <span className="text-4xl font-bold text-brand-secondary tabular-nums">{timeParts.minutes}</span>
                            <span className="text-xs block text-gray-500 dark:text-brand-text-muted">minút</span>
                         </div>
                         <div className="text-center">
                            <span className="text-4xl font-bold text-brand-secondary tabular-nums">{timeParts.seconds}</span>
                            <span className="text-xs block text-gray-500 dark:text-brand-text-muted">sekúnd</span>
                         </div>
                    </div>

                     <div className="text-xs text-gray-500 dark:text-brand-text-muted mt-2 font-mono text-center sm:text-left">
                        <span>Plánovaný štart: {new Date(startTime).toLocaleString('sk-SK', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                 <div className="text-center flex-shrink-0 hidden sm:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-secondary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default NextFastCountdown;
