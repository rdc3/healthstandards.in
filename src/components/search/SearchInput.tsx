/**
 * Search input component with real-time suggestions
 * Provides search functionality with autocomplete and validation
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearch, usePopularSearches } from '../../hooks/useSearch';
import { validateSearchQuery, sanitizeSearchQuery, searchRateLimit } from '../../utils/searchValidation';

interface SearchInputProps {
  onSearch?: (query: string) => void;
  onSuggestionSelect?: (suggestion: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onSuggestionSelect,
  placeholder = "Search healthcare standards...",
  className = "",
  autoFocus = false
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  
  const { suggestions, getSuggestions, clearResults } = useSearch();
  const popularSearches = usePopularSearches();

  // Get suggestions when query changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      getSuggestions(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);
  }, [query, getSuggestions]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    
    // Clear previous errors
    setValidationError(null);
    setRateLimitError(null);
    
    // Sanitize input
    const sanitized = sanitizeSearchQuery(newQuery);
    setQuery(sanitized);
    
    // Show validation feedback for real-time validation
    if (newQuery.trim().length > 0) {
      const validation = validateSearchQuery(sanitized);
      if (!validation.isValid && validation.error) {
        setValidationError(validation.error);
      }
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationError(null);
    setRateLimitError(null);
    
    // Validate query
    const validation = validateSearchQuery(query);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid search query');
      return;
    }
    
    // Check rate limiting
    if (!searchRateLimit.canSearch()) {
      const timeUntilReset = Math.ceil(searchRateLimit.getTimeUntilReset() / 1000);
      setRateLimitError(`Too many searches. Please wait ${timeUntilReset} seconds before searching again.`);
      return;
    }
    
    // Record search and proceed
    searchRateLimit.recordSearch();
    setShowSuggestions(false);
    
    const finalQuery = validation.sanitizedQuery || query.trim();
    onSearch?.(finalQuery);
  }, [query, onSearch]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    // Clear errors
    setValidationError(null);
    setRateLimitError(null);
    
    setQuery(suggestion);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
    
    // Check rate limiting before searching
    if (!searchRateLimit.canSearch()) {
      const timeUntilReset = Math.ceil(searchRateLimit.getTimeUntilReset() / 1000);
      setRateLimitError(`Too many searches. Please wait ${timeUntilReset} seconds.`);
      return;
    }
    
    searchRateLimit.recordSearch();
    onSearch?.(suggestion);
  }, [onSearch, onSuggestionSelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const suggestionCount = suggestions.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestionCount - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestionCount - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestionCount) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else {
          handleSubmit(e);
        }
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [showSuggestions, suggestions, selectedSuggestionIndex, handleSuggestionSelect, handleSubmit]);

  // Handle input focus
  const handleFocus = useCallback(() => {
    if (query.trim().length >= 2) {
      setShowSuggestions(true);
    }
  }, [query]);

  // Handle input blur (with delay to allow suggestion clicks)
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
  }, []);

  // Clear search
  const handleClear = useCallback(() => {
    setQuery('');
    setShowSuggestions(false);
    setValidationError(null);
    setRateLimitError(null);
    clearResults();
    inputRef.current?.focus();
  }, [clearResults]);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`w-full px-4 py-2 pl-10 pr-10 text-gray-900 bg-white border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition-colors ${
              validationError || rateLimitError 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            aria-label="Search healthcare standards"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            role="combobox"
            autoComplete="off"
            aria-invalid={!!(validationError || rateLimitError)}
            aria-describedby={validationError || rateLimitError ? 'search-error' : undefined}
          />
          
          {/* Search icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Error messages */}
      {(validationError || rateLimitError) && (
        <div id="search-error" className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="text-red-800 font-medium">
                {validationError || rateLimitError}
              </p>
              {validationError && (
                <p className="text-red-700 mt-1">
                  Try searching for "HL7", "FHIR", "DICOM", or "interoperability"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || query.trim().length < 2) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <ul
            ref={suggestionsRef}
            role="listbox"
            aria-label="Search suggestions"
            className="py-1"
          >
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  role="option"
                  aria-selected={index === selectedSuggestionIndex}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    index === selectedSuggestionIndex
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {suggestion}
                  </div>
                </li>
              ))
            ) : query.trim().length < 2 && popularSearches.length > 0 ? (
              <>
                <li className="px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-100">
                  Popular searches
                </li>
                {popularSearches.slice(0, 5).map((search, index) => (
                  <li
                    key={search}
                    role="option"
                    aria-selected={false}
                    className="px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => handleSuggestionSelect(search)}
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      {search}
                    </div>
                  </li>
                ))}
              </>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
};