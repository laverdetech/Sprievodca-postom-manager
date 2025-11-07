import React, { useState, useEffect, useMemo } from 'react';
import { FastingData } from '../types';
import { FASTING_STAGES } from '../constants';

interface CurrentFastTrackerProps {
  activeFast: FastingData;
}

const formatTime = (totalSeconds: number): string => {
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const CurrentFastTracker: React.FC<CurrentFastTrackerProps> = ({ activeFast }) => {
    const { startTime, endTime, fastingLength } = activeFast;
    
    const [now, setNow] = useState(new Date());
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { remainingSeconds, progress } = useMemo(() => {
        if (!startTime || !endTime) return { remainingSeconds: 0, progress: 0 };
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const currentTime = now.getTime();
        
        const totalDuration = end - start;
        const elapsed = currentTime - start;
        
        let calculatedProgress = (elapsed / totalDuration) * 100;
        if (calculatedProgress > 100) calculatedProgress = 100;
        if (calculatedProgress < 0) calculatedProgress = 0;

        const remaining = Math.round((end - currentTime) / 1000);

        return { remainingSeconds: remaining, progress: calculatedProgress };
    }, [now, startTime, endTime]);

    const currentStage = useMemo(() => {
        if (!startTime) return null;
        const start = new Date(startTime).getTime();
        const currentTime = now.getTime();
        const elapsedMilliseconds = currentTime - start;

        if (elapsedMilliseconds < 0) {
            return null;
        }

        const hoursElapsed = elapsedMilliseconds / (1000 * 60 * 60);
        
        return [...FASTING_STAGES].reverse().find(stage => hoursElapsed >= stage.minHours) || null;
    }, [now, startTime]);

    if (!startTime || !endTime) return null;

    return (
        <div className="bg-white dark:bg-brand-surface p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in border-l-4 border-brand-primary">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-grow w-full">
                     <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Aktuálny Pôst: <span className="text-brand-primary">{fastingLength}h</span>
                        </h3>
                        <p className="text-sm font-mono text-gray-500 dark:text-brand-text-muted">
                           Zostáva: <span className="text-gray-800 dark:text-brand-text font-semibold">{formatTime(remainingSeconds)}</span>
                        </p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div 
                            className="bg-gradient-to-r from-brand-secondary to-brand-primary h-4 rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                     <div className="flex justify-between text-xs text-gray-500 dark:text-brand-text-muted mt-1 font-mono">
                        <span>Štart: {new Date(startTime).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>Koniec: {new Date(endTime).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                 <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold text-brand-primary tabular-nums">
                        {progress.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-brand-text-muted uppercase tracking-wider">Hotovo</p>
                </div>
            </div>
            {currentStage && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                    <div 
                        className="flex items-start sm:items-center gap-4 cursor-pointer group"
                        onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                        role="button"
                        aria-expanded={isDetailsVisible}
                        aria-controls="fasting-stage-details"
                    >
                        <div className="flex-shrink-0 bg-brand-secondary/10 dark:bg-brand-secondary/20 text-brand-secondary p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1h-6l-1-1z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.884 6.116l.258.258a2 2 0 010 2.828l-2.02 2.02a2 2 0 01-2.828 0l-.258-.258a2 2 0 010-2.828l2.02-2.02a2 2 0 012.828 0zM5.116 6.116l-.258.258a2 2 0 000 2.828l2.02 2.02a2 2 0 002.828 0l.258-.258a2 2 0 000-2.828l-2.02-2.02a2 2 0 00-2.828 0z" />
                            </svg>
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-semibold text-gray-500 dark:text-brand-text-muted">Aktuálna fáza v tele:</p>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{currentStage.stage}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{currentStage.tip}</p>
                        </div>
                        <div className="flex-shrink-0 pr-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform duration-300 ${isDetailsVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                             </svg>
                        </div>
                    </div>
                    <div
                        id="fasting-stage-details"
                        className={`grid transition-all duration-500 ease-in-out ${isDetailsVisible ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}
                    >
                       <div className="overflow-hidden">
                            <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg ml-2">
                                <div>
                                    <h5 className="font-bold text-md text-gray-800 dark:text-brand-text">Čo sa deje v tele?</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{currentStage.process}</p>
                                </div>
                                <div>
                                    <h5 className="font-bold text-md text-gray-800 dark:text-brand-text">Ako sa môžete cítiť?</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{currentStage.feeling}</p>
                                </div>
                            </div>
                       </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentFastTracker;