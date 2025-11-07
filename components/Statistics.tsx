import React from 'react';

interface StatisticsProps {
  stats: {
    planned: number;
    completed: number;
    successRate: number;
  };
}

const StatCard: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
    <div className={`text-center ${className}`}>
        <span className="text-2xl font-bold text-brand-primary">{value}</span>
        <p className="text-xs text-gray-500 dark:text-brand-text-muted uppercase tracking-wider">{label}</p>
    </div>
);

const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  const { planned, completed, successRate } = stats;

  return (
    <div className="bg-white dark:bg-brand-surface p-4 rounded-xl shadow-lg w-full">
        <div className="flex items-center justify-around divide-x divide-gray-200 dark:divide-gray-700">
             <StatCard label="Naplánované" value={planned} />
             <StatCard label="Splnené" value={completed} className="px-4" />
             <StatCard label="Úspešnosť" value={`${successRate}%`} />
        </div>
        {planned > 0 && (
             <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                        className="bg-gradient-to-r from-brand-secondary to-brand-primary h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${successRate}%` }}
                    ></div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Statistics;