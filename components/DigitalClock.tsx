import React, { useState, useEffect, useRef } from 'react';

interface DigitalClockProps {
  isFastActive: boolean;
}

/**
 * A digital clock component that displays the current date and time.
 * It also provides visual feedback when a fast starts or ends.
 */
const DigitalClock: React.FC<DigitalClockProps> = ({ isFastActive }) => {
  const [time, setTime] = useState(new Date());
  const [flash, setFlash] = useState(false);
  const prevIsFastActive = useRef(isFastActive);

  // Effect to update the time every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Effect to trigger a flash animation when fasting state changes
  useEffect(() => {
    if (prevIsFastActive.current !== isFastActive) {
      setFlash(true);
      // Reset the flash state after the animation duration (700ms)
      const flashTimer = setTimeout(() => setFlash(false), 700);
      prevIsFastActive.current = isFastActive;
      return () => clearTimeout(flashTimer);
    }
  }, [isFastActive]);

  const dateString = new Intl.DateTimeFormat('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(time);

  const timeString = new Intl.DateTimeFormat('sk-SK', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(time);

  // Apply animation class based on flash state and whether fast is starting or ending
  const flashClass = flash ? (isFastActive ? 'animate-flash-start' : 'animate-flash-end') : '';

  return (
    <div className="flex items-center justify-center gap-4 font-mono bg-white/50 dark:bg-brand-surface/50 p-3 rounded-xl backdrop-blur-sm">
      {/* Date Display */}
      <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-500 dark:text-brand-text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{dateString}</span>
      </div>

      {/* Time Display */}
      <div className={`relative flex items-center gap-2 text-lg sm:text-xl font-bold text-brand-primary p-2 rounded-lg transition-colors ${flashClass}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="tracking-widest">{timeString.replace(/:/g, ' : ')}</span>
      </div>
    </div>
  );
};

export default DigitalClock;
