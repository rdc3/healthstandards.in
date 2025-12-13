/**
 * Unit tests for search result navigation across all result types
 * Tests navigation from search page to standard pages for different result types
 * Validates: Requirements 1.1, 1.2, 1.4
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchResults } from '../../src/components/search/SearchResults';
import { SearchResult } from '../../src/utils/searchIndex';

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    pathname: '/search',
    asPath: '/search',
    query: {},
  }),
}));

// Mock window.location for URL validation
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
  },
  writable: true,
});

describe('Search Result Navigation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockResult = (overrides: Partial<SearchResult> = {}): SearchResult => ({
    id: 'test-result',
    title: 'Test Healthcare Standard',
    excerpt: 'This is a test excerpt for healthcare standards.',
    url: '/standards/fhir',
    relevanceScore: 0.8,
    highlightedText: ['healthcare', 'standard'],
    standard: 'FHIR',
    category: 'Standard',
    type: 'page',
    ...overrides,
  });

  describe('Page Result Navigation', () => {
    test('should navigate to page results successfully', async () => {
      const pageResult = createMockResult({
        type: 'page',
        url: '/standards/fhir',
        title: 'FHIR Standard Overview',
      });

      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[pageResult]}
          query="FHIR"
          onResultClick={mockOnResultClick}
        />
      );

      // Find the result link
      const resultLink = screen.getByRole('link', { name: /FHIR Standard Overview/i });
      expect(resultLink).toBeInTheDocument();
      expect(resultLink).toHaveAttribute('href', '/standards/fhir');

      // Click the result
      fireEvent.click(resultLink);

      // Verify analytics callback was called
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(pageResult);
      });

      // Verify link is still functional after click
      expect(resultLink).toHaveAttribute('href', '/standards/fhir');
    });

    test('should handle HL7 page navigation', async () => {
      const hl7Result = createMockResult({
        type: 'page',
        url: '/standards/hl7',
        title: 'HL7 Standards',
        standard: 'HL7',
      });

      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[hl7Result]}
          query="HL7"
          onResultClick={mockOnResultClick}
        />
      );

      const resultLink = screen.getByRole('link', { name: /HL7 Standards/i });
      expect(resultLink).toHaveAttribute('href', '/standards/hl7');

      fireEvent.click(resultLink);

      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(hl7Result);
      });
    });

    test('should handle DICOM page navigation', async () => {
      const dicomResult = createMockResult({
        type: 'page',
        url: '/standards/dicom',
        title: 'DICOM Imaging Standard',
        standard: 'DICOM',
      });

      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[dicomResult]}
          query="DICOM"
          onResultClick={mockOnResultClick}
        />
      );

      const resultLink = screen.getByRole('link', { name: /DICOM Imaging Standard/i });
      expect(resultLink).toHaveAttribute('href', '/standards/dicom');

      fireEvent.click(resultLink);

      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(dicomResult);
      });
    });
  });

  describe('Section Result Navigation', () => {
    test('should navigate to section results with anchors', async () => {
      const sectionResult = createMockResult({
        type: 'section',
        url: '/standards/fhir#resources',
        title: 'FHIR - Resources Section',
      });

      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[sectionResult]}
          query="FHIR resources"
          onResultClick={mockOnResultClick}
        />
      );

      const resultLink = screen.getByRole('link', { name: /FHIR - Resources Section/i });
      expect(resultLink).toHaveAttribute('href', '/standards/fhir#resources');

      fireEvent.click(resultLink);

      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(sectionResult);
      });
    });

    test('should handle multiple section results', async () => {
      const sectionResults = [
        createMockResult({
          id: 'section-1',
          type: 'section',
          url: '/standards/hl7#messaging',
          title: 'HL7 - Messaging',
        }),
        createMockResult({
          id: 'section-2',
          type: 'section',
          url: '/standards/hl7#terminology',
          title: 'HL7 - Terminology',
        }),
      ];

      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={sectionResults}
          query="HL7"
          onResultClick={mockOnResultClick}
        />
      );

      // Test first section
      const messagingLink = screen.getByRole('link', { name: /HL7 - Messaging/i });
      expect(messagingLink).toHaveAttribute('href', '/standards/hl7#messaging');

      fireEvent.click(messagingLink);

      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(sectionResults[0]);
      });

      // Test second section
      const terminologyLink = screen.getByRole('link', { name: /HL7 - Terminology/i });
      expect(terminologyLink).toHaveAttribute('href', '/standards/hl7#terminology');

      fireEvent.click(terminologyLink);

      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(sectionResults[1]);
      });
    });
  });

  describe('Search Suggestions Navigation', () => {
    test('should handle search suggestion navigation', async () => {
      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[]} // No results to trigger suggestions
          query="invalid query"
          onResultClick={mockOnResultClick}
        />
      );

      // Look for suggestion links (if they exist)
      const suggestionLinks = screen.queryAllByRole('link').filter(link => {
        const href = link.getAttribute('href');
        return href && href.includes('/search?q=');
      });

      // Test suggestion navigation if suggestions exist
      if (suggestionLinks.length > 0) {
        const firstSuggestion = suggestionLinks[0];
        const href = firstSuggestion.getAttribute('href');
        expect(href).toMatch(/^\/search\?q=.+$/);

        fireEvent.click(firstSuggestion);

        // Verify suggestion link remains functional
        expect(firstSuggestion).toHaveAttribute('href', href);
      }
    });
  });

  describe('Mixed Result Types Navigation', () => {
    test('should handle navigation for mixed result types', async () => {
      const mixedResults = [
        createMockResult({
          id: 'page-result',
          type: 'page',
          url: '/standards/fhir',
          title: 'FHIR Overview',
        }),
        createMockResult({
          id: 'section-result',
          type: 'section',
          url: '/standards/fhir#implementation',
          title: 'FHIR - Implementation Guide',
        }),
      ];

      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={mixedResults}
          query="FHIR"
          onResultClick={mockOnResultClick}
        />
      );

      // Test page result navigation
      const pageLink = screen.getByRole('link', { name: /FHIR Overview/i });
      expect(pageLink).toHaveAttribute('href', '/standards/fhir');

      fireEvent.click(pageLink);

      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(mixedResults[0]);
      });

      // Test section result navigation
      const sectionLink = screen.getByRole('link', { name: /FHIR - Implementation Guide/i });
      expect(sectionLink).toHaveAttribute('href', '/standards/fhir#implementation');

      fireEvent.click(sectionLink);

      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(mixedResults[1]);
      });
    });
  });

  describe('Component Loading Validation', () => {
    test('should maintain component state during navigation', async () => {
      const result = createMockResult();
      const mockOnResultClick = jest.fn();

      const { rerender } = render(
        <SearchResults
          results={[result]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      const resultLink = screen.getByRole('link', { name: /Test Healthcare Standard/i });
      
      // Click the result
      fireEvent.click(resultLink);

      // Rerender with same props to simulate component update
      rerender(
        <SearchResults
          results={[result]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      // Verify component still renders correctly
      expect(screen.getByRole('link', { name: /Test Healthcare Standard/i })).toBeInTheDocument();
      expect(mockOnResultClick).toHaveBeenCalledWith(result);
    });

    test('should handle loading state during navigation', async () => {
      const result = createMockResult();

      const { rerender } = render(
        <SearchResults
          results={[result]}
          query="test"
          isLoading={false}
        />
      );

      // Verify normal state
      expect(screen.getByRole('link', { name: /Test Healthcare Standard/i })).toBeInTheDocument();

      // Simulate loading state
      rerender(
        <SearchResults
          results={[]}
          query="test"
          isLoading={true}
        />
      );

      // Verify loading state
      expect(screen.getByText(/Searching.../i)).toBeInTheDocument();

      // Return to normal state
      rerender(
        <SearchResults
          results={[result]}
          query="test"
          isLoading={false}
        />
      );

      // Verify component recovered
      expect(screen.getByRole('link', { name: /Test Healthcare Standard/i })).toBeInTheDocument();
    });
  });

  describe('Error Handling During Navigation', () => {
    test('should handle navigation with invalid URLs gracefully', async () => {
      const invalidResult = createMockResult({
        url: 'invalid-url',
        title: 'Invalid URL Result',
      });

      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[invalidResult]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      const resultLink = screen.getByRole('link', { name: /Invalid URL Result/i });
      expect(resultLink).toHaveAttribute('href', 'invalid-url');

      // Click should not cause errors
      fireEvent.click(resultLink);

      // Component should remain stable
      expect(resultLink).toBeInTheDocument();
    });

    test('should handle navigation errors gracefully', async () => {
      const result = createMockResult();
      const mockOnResultClick = jest.fn().mockImplementation(() => {
        throw new Error('Navigation error');
      });

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <SearchResults
          results={[result]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      const resultLink = screen.getByRole('link', { name: /Test Healthcare Standard/i });
      
      // Click should not crash the component
      expect(() => fireEvent.click(resultLink)).not.toThrow();

      // Component should remain functional
      expect(resultLink).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});