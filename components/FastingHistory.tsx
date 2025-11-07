import React, { useMemo } from 'react';
import { FastingData } from '../types';
import FastingSummary from './FastingSummary';

interface FastingHistoryProps {
  fasts: (FastingData & { dateKey: string })[];
  onToggleCompletion: (dateKey: string) => void;
  onOpenFeelingLog: (dateKey: string) => void;
  onItemClick: (dateKey: string) => void;
}

const DifficultyStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
            <svg
                key={index}
                className={`h-4 w-4 ${index < rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const FeelingChart: React.FC<{ fasts: (FastingData & { dateKey: string })[] }> = ({ fasts }) => {
    const feelingCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        fasts.forEach(fast => {
            if (fast.completed && fast.feelingRecord) {
                const feeling = fast.feelingRecord.feeling;
                counts[feeling] = (counts[feeling] || 0) + 1;
            }
        });
        return Object.entries(counts).sort(([, a], [, b]) => b - a);
    }, [fasts]);

    if (feelingCounts.length === 0) return null;

    const maxCount = Math.max(...feelingCounts.map(([, count]) => count));

    return (
        <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl">
            <h4 className="font-bold text-gray-800 dark:text-brand-text mb-4">Prehľad nálad</h4>
            <div className="space-y-2">
                {feelingCounts.map(([feeling, count]) => (
                    <div key={feeling} className="flex items-center gap-4">
                        <span className="text-2xl w-8 text-center">{feeling}</span>
                        <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                            <div
                                className="bg-gradient-to-r from-brand-secondary to-brand-primary h-6 rounded-full flex items-center justify-end pr-2 text-white font-bold text-sm"
                                style={{ width: `${(count / maxCount) * 100}%` }}
                            >
                                {count}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FastingHistory: React.FC<FastingHistoryProps> = ({ fasts, onToggleCompletion, onOpenFeelingLog, onItemClick }) => {

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <FastingSummary fasts={fasts} />

      {fasts.length === 0 ? (
        <div className="bg-white dark:bg-brand-surface p-8 rounded-xl shadow-lg text-center animate-fade-in mt-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Žiadna história</h3>
          <p className="text-gray-500 dark:text-brand-text-muted">
            Zatiaľ nemáte žiadne zaznamenané minulé pôsty. Keď nejaké dokončíte, zobrazia sa tu.
          </p>
        </div>
       ) : (
        <div className="space-y-4">
          <FeelingChart fasts={fasts} />
          <h3 className="text-xl font-bold text-gray-800 dark:text-brand-text px-2 pt-4">Detailný zoznam</h3>
          {fasts.map((fast) => {
            const isEditable = !fast.completed;
            return (
              <div
                key={fast.dateKey}
                className={`bg-white dark:bg-brand-surface p-4 rounded-xl shadow-lg flex flex-col transition-all duration-200 ${
                  isEditable ? 'cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-brand-primary/50' : ''
                } ${
                  fast.completed ? 'opacity-90' : ''
                }`}
                onClick={isEditable ? () => onItemClick(fast.dateKey) : undefined}
              >
                <div className="flex items-start justify-between w-full">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                              {fast.fastingLength}h Pôst
                          </h3>
                          {fast.completed && fast.feelingRecord && (
                              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                                  <span className="text-xl">{fast.feelingRecord.feeling}</span>
                                  <DifficultyStars rating={fast.feelingRecord.difficulty} />
                              </div>
                          )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-brand-text-muted mt-1 space-y-1 font-mono">
                        <p>
                          <span className="font-semibold">Štart:</span> {formatDate(fast.startTime)}
                        </p>
                        <p>
                          <span className="font-semibold">Koniec:</span> {formatDate(fast.endTime)}
                        </p>
                      </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (fast.completed) {
                              onToggleCompletion(fast.dateKey);
                          } else {
                              onOpenFeelingLog(fast.dateKey);
                          }
                        }}
                        className="p-2 rounded-full group focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-surface focus:ring-brand-primary"
                        aria-label={fast.completed ? 'Označiť ako nesplnené' : 'Zaznamenať pocity a označiť ako splnené'}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-8 w-8 transition-colors ${
                            fast.completed
                              ? 'text-green-400'
                              : 'text-gray-400 dark:text-gray-500 group-hover:text-green-500'
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                  </div>
                </div>
                {fast.note && (
                  <blockquote className="mt-4 p-3 w-full bg-gray-100 dark:bg-gray-800/50 border-l-4 border-brand-secondary rounded-r-lg text-sm text-gray-600 dark:text-brand-text-muted italic">
                      {fast.note}
                  </blockquote>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FastingHistory;
