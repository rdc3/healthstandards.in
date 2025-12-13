/**
 * Search results display component with highlighting and pagination
 * Shows search results with relevant excerpts and navigation
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SearchResult } from '../../utils/searchIndex';
import { generateNoResultsSuggestions, suggestQueryCorrections } from '../../utils/searchValidation';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  error?: string | null;
  onResultClick?: (result: SearchResult) => void;
  resultsPerPage?: number;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  isLoading = false,
  error = null,
  onResultClick,
  resultsPerPage = 10,
  className = ""
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  // Reset to first page when results change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  // Highlight search terms in text
  const highlightText = useMemo(() => {
    return (text: string, searchQuery: string) => {
      if (!searchQuery.trim()) return text;
      
      const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      
      return parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {part}
          </mark>
        ) : part
      );
    };
  }, []);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
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
            <span className="text-red-800 font-medium">Search Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
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
          <p>Enter a search term to find healthcare standards information</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    const suggestions = generateNoResultsSuggestions(query);
    const corrections = suggestQueryCorrections(query);
    
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 mb-6">
            No healthcare standards information found for "{query}"
          </p>
          
          {/* Query corrections */}
          {corrections.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Did you mean:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {corrections.map((correction) => (
                  <button
                    key={correction}
                    onClick={() => onResultClick?.({ 
                      id: 'correction', 
                      title: correction, 
                      excerpt: '', 
                      url: `/search?q=${encodeURIComponent(correction)}`,
                      relevanceScore: 1,
                      highlightedText: [],
                      standard: '',
                      category: '',
                      type: 'page'
                    })}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {correction}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Suggestions */}
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-3">Try searching for:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onResultClick?.({ 
                    id: 'suggestion', 
                    title: suggestion, 
                    excerpt: '', 
                    url: `/search?q=${encodeURIComponent(suggestion)}`,
                    relevanceScore: 1,
                    highlightedText: [],
                    standard: '',
                    category: '',
                    type: 'page'
                  })}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          {/* Help text */}
          <div className="mt-6 text-xs text-gray-400">
            <p>Search tips:</p>
            <ul className="mt-1 space-y-1">
              <li>• Use specific terms like "HL7 FHIR" or "DICOM imaging"</li>
              <li>• Try broader terms like "healthcare standards" or "interoperability"</li>
              <li>• Check spelling and try alternative terms</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="search-results" className={`${className}`}>
      {/* Results summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "
          <span className="font-medium text-gray-900">{query}</span>"
          {totalPages > 1 && (
            <span className="ml-2">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </p>
      </div>

      {/* Results list */}
      <div className="space-y-6">
        {currentResults.map((result) => (
          <article
            key={result.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <Link
                  href={result.url}
                  onClick={() => handleResultClick(result)}
                  className="block group"
                >
                  <h3 className="text-lg font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                    {highlightText(result.title, query)}
                  </h3>
                </Link>
                
                <div className="flex items-center mt-1 text-sm text-gray-500 space-x-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {result.standard}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {result.category}
                  </span>
                  {result.type === 'section' && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Section
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-4 text-right">
                <div className="text-xs text-gray-400">
                  Relevance: {Math.round(result.relevanceScore * 100)}%
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-gray-700 leading-relaxed mb-3">
              {highlightText(result.excerpt, query)}
            </p>

            {/* Highlighted matches */}
            {result.highlightedText.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500 mb-2">Matching text:</p>
                <div className="space-y-1">
                  {result.highlightedText.slice(0, 2).map((highlight, index) => (
                    <p key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      ...{highlightText(highlight, query)}...
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* URL */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Link
                href={result.url}
                onClick={() => handleResultClick(result)}
                className="text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                {window.location.origin}{result.url}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};