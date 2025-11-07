import React from 'react';
import { Filters, Protocol } from '../types';

interface FilterControlsProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  protocols: Protocol[];
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange, protocols }) => {
  const handleReset = () => {
    onFilterChange({ protocol: 'all', status: 'all' });
  };

  return (
    <div className="bg-white dark:bg-brand-surface p-3 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
            <label htmlFor="protocol-filter" className="text-sm font-medium text-gray-500 dark:text-brand-text-muted">Dĺžka:</label>
            <select
                id="protocol-filter"
                value={filters.protocol}
                onChange={(e) => onFilterChange({ protocol: e.target.value as Filters['protocol'] })}
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-brand-text text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2"
            >
                <option value="all">Všetky</option>
                {protocols.map(p => (
                    <option key={p} value={p}>{p}h</option>
                ))}
            </select>
        </div>
        <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-500 dark:text-brand-text-muted">Stav:</label>
            <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => onFilterChange({ status: e.target.value as Filters['status'] })}
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-brand-text text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2"
            >
                <option value="all">Všetky</option>
                <option value="completed">Splnené</option>
                <option value="uncompleted">Nesplnené</option>
            </select>
        </div>
      </div>
      <button
        onClick={handleReset}
        className="text-sm text-brand-primary hover:text-sky-300 transition-colors font-semibold px-3 py-2"
      >
        Resetovať filtre
      </button>
    </div>
  );
};

export default FilterControls;