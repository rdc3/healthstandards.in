/**
 * Search filters component for filtering results by standard and category
 * Provides filtering options to narrow down search results
 */

import React from 'react';

interface SearchFiltersProps {
  standardFilter?: string;
  categoryFilter?: string;
  onStandardFilterChange?: (standard: string | undefined) => void;
  onCategoryFilterChange?: (category: string | undefined) => void;
  availableStandards?: string[];
  availableCategories?: string[];
  className?: string;
}

const DEFAULT_STANDARDS = ['HL7', 'FHIR', 'DICOM'];
const DEFAULT_CATEGORIES = ['messaging', 'imaging', 'terminology', 'security'];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  standardFilter,
  categoryFilter,
  onStandardFilterChange,
  onCategoryFilterChange,
  availableStandards = DEFAULT_STANDARDS,
  availableCategories = DEFAULT_CATEGORIES,
  className = ""
}) => {
  const handleStandardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onStandardFilterChange?.(value === '' ? undefined : value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onCategoryFilterChange?.(value === '' ? undefined : value);
  };

  const clearFilters = () => {
    onStandardFilterChange?.(undefined);
    onCategoryFilterChange?.(undefined);
  };

  const hasActiveFilters = standardFilter || categoryFilter;

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Filter Results</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standard filter */}
        <div>
          <label htmlFor="standard-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Healthcare Standard
          </label>
          <select
            id="standard-filter"
            value={standardFilter || ''}
            onChange={handleStandardChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">All Standards</option>
            {availableStandards.map((standard) => (
              <option key={standard} value={standard}>
                {standard}
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category-filter"
            value={categoryFilter || ''}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {standardFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {standardFilter}
                <button
                  onClick={() => onStandardFilterChange?.(undefined)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  aria-label={`Remove ${standardFilter} filter`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {categoryFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                <button
                  onClick={() => onCategoryFilterChange?.(undefined)}
                  className="ml-1 text-green-600 hover:text-green-800"
                  aria-label={`Remove ${categoryFilter} filter`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};