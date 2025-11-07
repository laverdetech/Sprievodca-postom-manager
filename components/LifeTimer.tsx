import React, { useState, useEffect, useMemo } from 'react';
import { LifeTimerSettings } from '../types';

interface LifeTimerProps {
    settings: LifeTimerSettings;
}

const calculateTimeParts = (totalMilliseconds: number) => {
    if (totalMilliseconds < 0) totalMilliseconds = 0;
    
    const totalSeconds = totalMilliseconds / 1000;
    const totalMinutes = totalSeconds / 60;
    const totalHours = totalMinutes / 60;
    const totalDays = totalHours / 24;

    const years = Math.floor(totalDays / 365.25);
    const days = Math.floor(totalDays % 365.25);
    const hours = Math.floor(totalHours % 24);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor(totalMilliseconds % 1000);

    return {
        years: years.toString().padStart(2, '0'),
        days: days.toString().padStart(3, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        milliseconds: milliseconds.toString().padStart(3, '0'),
    };
};

const TimeUnit: React.FC<{ value: string; label: string; valueClass: string; labelClass: string }> = ({ value, label, valueClass, labelClass }) => (
    <div className="flex flex-col items-center">
        <span className={`font-bold tabular-nums ${valueClass}`}>{value}</span>
        <span className={`text-gray-500 dark:text-brand-text-muted uppercase tracking-widest ${labelClass}`}>{label}</span>
    </div>
);

const LifeTimer: React.FC<LifeTimerProps> = ({ settings }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        let animationFrameId: number;
        const update = () => {
            setCurrentTime(new Date());
            animationFrameId = requestAnimationFrame(update);
        };
        animationFrameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const timeParts = useMemo(() => {
        if (!settings.dob) {
            return calculateTimeParts(-1); // Return all zeros
        }
        
        const dobDate = new Date(settings.dob);
        
        if (settings.mode === 'countdown') {
            const endDate = new Date(dobDate);
            endDate.setFullYear(endDate.getFullYear() + settings.expectancy);
            const diff = endDate.getTime() - currentTime.getTime();
            return calculateTimeParts(diff);
        } else { // countup
            const diff = currentTime.getTime() - dobDate.getTime();
            return calculateTimeParts(diff);
        }
    }, [currentTime, settings]);

    const sizeClasses = useMemo(() => {
        switch (settings.size) {
            case 'small': return {
                container: 'p-1.5',
                wrapper: 'gap-1.5',
                icon: 'h-3.5 w-3.5',
                value: 'text-xs',
                label: 'text-[7px]',
            };
            case 'large': return {
                container: 'p-2.5',
                wrapper: 'gap-2.5',
                icon: 'h-5 w-5',
                value: 'text-base',
                label: 'text-[9px]',
            };
            case 'medium':
            default: return {
                container: 'p-2',
                wrapper: 'gap-1.5',
                icon: 'h-4 w-4',
                value: 'text-xs',
                label: 'text-[8px]',
            };
        }
    }, [settings.size]);
    
    const isConfigured = !!settings.dob;

    return (
        <div className={`flex items-center justify-center font-mono bg-white/50 dark:bg-brand-surface/50 rounded-xl backdrop-blur-sm transition-all duration-300 ${isConfigured ? 'opacity-100' : 'opacity-50'} ${sizeClasses.container}`}>
            <div className={`flex items-center text-brand-primary ${sizeClasses.wrapper}`}>
                {settings.mode === 'countup' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className={sizeClasses.icon} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className={sizeClasses.icon} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" /></svg>
                )}
                
                <div className={`flex items-baseline ${sizeClasses.wrapper}`}>
                    <TimeUnit value={timeParts.years} label="Rok" valueClass={sizeClasses.value} labelClass={sizeClasses.label} />
                    <TimeUnit value={timeParts.days} label="Deň" valueClass={sizeClasses.value} labelClass={sizeClasses.label} />
                    <TimeUnit value={timeParts.hours} label="Hod" valueClass={sizeClasses.value} labelClass={sizeClasses.label} />
                    <TimeUnit value={timeParts.minutes} label="Min" valueClass={sizeClasses.value} labelClass={sizeClasses.label} />
                    <TimeUnit value={timeParts.seconds} label="Sek" valueClass={sizeClasses.value} labelClass={sizeClasses.label} />
                    <TimeUnit value={timeParts.milliseconds} label="Ms" valueClass={sizeClasses.value} labelClass={sizeClasses.label} />
                </div>
            </div>
        </div>
    );
};

export default LifeTimer;