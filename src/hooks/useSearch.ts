/**
 * React hook for client-side search functionality
 * Loads search index and provides search capabilities
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { buildSearchIndex, performSearch, getSearchSuggestions, SearchIndex, SearchResult, SearchDocument } from '../utils/searchIndex';

interface UseSearchOptions {
  limit?: number;
  standardFilter?: string;
  categoryFilter?: string;
}

interface UseSearchReturn {
  searchResults: SearchResult[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  search: (query: string, options?: UseSearchOptions) => void;
  getSuggestions: (partialQuery: string) => void;
  clearResults: () => void;
}

/**
 * Custom hook for search functionality
 */
export function useSearch(): UseSearchReturn {
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load search index on mount
  useEffect(() => {
    loadSearchIndex();
  }, []);

  /**
   * Loads the search index from the public directory
   */
  const loadSearchIndex = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch search index from public directory
      const response = await fetch('/search-index.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load search index: ${response.status}`);
      }

      const indexData = await response.json();
      
      if (!indexData.documents || !Array.isArray(indexData.documents)) {
        throw new Error('Invalid search index format');
      }

      // Build Fuse index from loaded documents
      const index = buildSearchIndex(indexData.documents);
      setSearchIndex(index);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load search index';
      setError(errorMessage);
      console.error('Error loading search index:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Performs search with the given query
   */
  const search = useCallback((query: string, options?: UseSearchOptions) => {
    if (!searchIndex) {
      setError('Search index not loaded');
      return;
    }

    if (!query || query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      const results = performSearch(searchIndex, query.trim(), options);
      setSearchResults(results);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
    }
  }, [searchIndex]);

  /**
   * Gets search suggestions for partial query
   */
  const getSuggestions = useCallback((partialQuery: string) => {
    if (!searchIndex) {
      setSuggestions([]);
      return;
    }

    if (!partialQuery || partialQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const newSuggestions = getSearchSuggestions(searchIndex, partialQuery.trim());
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Error getting suggestions:', err);
      setSuggestions([]);
    }
  }, [searchIndex]);

  /**
   * Clears search results and suggestions
   */
  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    searchResults,
    suggestions,
    isLoading,
    error,
    search,
    getSuggestions,
    clearResults
  };
}

/**
 * Hook for getting popular search terms or recent searches
 */
export function usePopularSearches(): string[] {
  // This could be enhanced to track popular searches
  // For now, return some common healthcare standard terms
  return useMemo(() => [
    'HL7',
    'FHIR',
    'DICOM',
    'interoperability',
    'messaging',
    'imaging',
    'patient data',
    'medical records'
  ], []);
}

/**
 * Hook for search analytics (placeholder for future implementation)
 */
export function useSearchAnalytics() {
  const trackSearch = useCallback((query: string, resultCount: number) => {
    // Placeholder for search analytics
    // Could track popular searches, no-result queries, etc.
    console.log(`Search: "${query}" returned ${resultCount} results`);
  }, []);

  return { trackSearch };
}