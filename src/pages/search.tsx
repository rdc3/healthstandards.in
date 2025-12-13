/**
 * Search page component
 * Main search interface combining input, filters, and results
 */

import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { SearchInput, SearchResults, SearchFilters } from '../components/search';
import { useSearch, useSearchAnalytics } from '../hooks/useSearch';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { q: initialQuery, standard, category } = router.query;
  
  const [query, setQuery] = useState('');
  const [standardFilter, setStandardFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  
  const { searchResults, isLoading, error, search } = useSearch();
  const { trackSearch } = useSearchAnalytics();

  // Initialize from URL parameters
  useEffect(() => {
    if (typeof initialQuery === 'string') {
      setQuery(initialQuery);
    }
    if (typeof standard === 'string') {
      setStandardFilter(standard);
    }
    if (typeof category === 'string') {
      setCategoryFilter(category);
    }
  }, [initialQuery, standard, category]);

  // Perform search when query or filters change
  useEffect(() => {
    if (query.trim()) {
      search(query, {
        standardFilter,
        categoryFilter,
        limit: 20
      });
      trackSearch(query, searchResults.length);
    }
  }, [query, standardFilter, categoryFilter, search, trackSearch, searchResults.length]);

  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (standardFilter) params.set('standard', standardFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    
    const newUrl = params.toString() ? `/search?${params.toString()}` : '/search';
    if (router.asPath !== newUrl) {
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [query, standardFilter, categoryFilter, router]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const handleStandardFilterChange = useCallback((standard: string | undefined) => {
    setStandardFilter(standard);
  }, []);

  const handleCategoryFilterChange = useCallback((category: string | undefined) => {
    setCategoryFilter(category);
  }, []);

  return (
    <>
      <Head>
        <title>
          {query ? `Search: ${query} - Healthcare Standards` : 'Search Healthcare Standards'}
        </title>
        <meta
          name="description"
          content="Search comprehensive healthcare standards information including HL7, FHIR, DICOM, and other interoperability standards."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Healthcare Standards
            </h1>
            <p className="text-gray-600">
              Find information about HL7, FHIR, DICOM, and other healthcare interoperability standards
            </p>
          </div>

          {/* Search input */}
          <div className="mb-6">
            <SearchInput
              onSearch={handleSearch}
              placeholder="Search for healthcare standards, protocols, or concepts..."
              className="w-full"
              autoFocus={!query}
            />
          </div>

          {/* Search filters */}
          <div className="mb-6">
            <SearchFilters
              standardFilter={standardFilter}
              categoryFilter={categoryFilter}
              onStandardFilterChange={handleStandardFilterChange}
              onCategoryFilterChange={handleCategoryFilterChange}
            />
          </div>

          {/* Search results */}
          <SearchResults
            results={searchResults}
            query={query}
            isLoading={isLoading}
            error={error}
            onResultClick={(result) => {
              // Track result clicks for analytics
              console.log('Result clicked:', result.title);
            }}
          />

          {/* Educational disclaimer */}
          {searchResults.length > 0 && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Educational Content Notice</p>
                  <p>
                    This information is provided for educational purposes only. For actual healthcare 
                    system implementation, always consult official standard documentation and work 
                    with certified specialists.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default SearchPage;