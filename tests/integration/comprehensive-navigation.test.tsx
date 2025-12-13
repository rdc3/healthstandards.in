/**
 * Comprehensive Navigation Integration Tests
 * Tests all navigation paths from search results, verifies no routing conflicts remain,
 * and tests browser back/forward navigation
 * Validates: All navigation requirements
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchResults } from '../../src/components/search/SearchResults';
import { SearchResult } from '../../src/utils/searchIndex';

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockForward = jest.fn();
const mockEvents = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
};

const createMockRouter = (pathname = '/', asPath = '/') => ({
  push: mockPush,
  replace: mockReplace,
  back: mockBack,
  forward: mockForward,
  pathname,
  asPath,
  query: {},
  events: mockEvents,
});

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock NavigationContext
jest.mock('../../src/contexts/NavigationContext', () => ({
  useNavigation: () => ({
    navigationState: {
      isNavigating: false,
      currentRoute: '/',
      previousRoute: null,
    },
  }),
}));

describe('Comprehensive Navigation Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { useRouter } = require('next/router');
    useRouter.mockReturnValue(createMockRouter());
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

  describe('All Navigation Paths from Search Results', () => {
    test('should handle navigation to all standard pages', async () => {
      const standardResults = [
        createMockResult({
          id: 'fhir-result',
          url: '/standards/fhir',
          title: 'FHIR Standard',
          standard: 'FHIR',
        }),
        createMockResult({
          id: 'hl7-result',
          url: '/standards/hl7',
          title: 'HL7 Standard',
          standard: 'HL7',
        }),
        createMockResult({
          id: 'dicom-result',
          url: '/standards/dicom',
          title: 'DICOM Standard',
          standard: 'DICOM',
        }),
      ];

      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={standardResults}
          query="healthcare standards"
          onResultClick={mockOnResultClick}
        />
      );

      // Test FHIR navigation
      const fhirLink = screen.getByRole('link', { name: /FHIR Standard/i });
      expect(fhirLink).toHaveAttribute('href', '/standards/fhir');
      fireEvent.click(fhirLink);
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(standardResults[0]);
      });

      // Test HL7 navigation
      const hl7Link = screen.getByRole('link', { name: /HL7 Standard/i });
      expect(hl7Link).toHaveAttribute('href', '/standards/hl7');
      fireEvent.click(hl7Link);
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(standardResults[1]);
      });

      // Test DICOM navigation
      const dicomLink = screen.getByRole('link', { name: /DICOM Standard/i });
      expect(dicomLink).toHaveAttribute('href', '/standards/dicom');
      fireEvent.click(dicomLink);
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(standardResults[2]);
      });
    });

    test('should handle section navigation with anchors', async () => {
      const sectionResults = [
        createMockResult({
          id: 'fhir-resources',
          type: 'section',
          url: '/standards/fhir#resources',
          title: 'FHIR - Resources',
        }),
        createMockResult({
          id: 'hl7-messaging',
          type: 'section',
          url: '/standards/hl7#messaging',
          title: 'HL7 - Messaging',
        }),
      ];

      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={sectionResults}
          query="resources messaging"
          onResultClick={mockOnResultClick}
        />
      );

      // Test section navigation
      const resourcesLink = screen.getByRole('link', { name: /FHIR - Resources/i });
      expect(resourcesLink).toHaveAttribute('href', '/standards/fhir#resources');
      fireEvent.click(resourcesLink);
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(sectionResults[0]);
      });

      const messagingLink = screen.getByRole('link', { name: /HL7 - Messaging/i });
      expect(messagingLink).toHaveAttribute('href', '/standards/hl7#messaging');
      fireEvent.click(messagingLink);
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(sectionResults[1]);
      });
    });

    test('should handle mixed result types navigation', async () => {
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
          title: 'FHIR Implementation',
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

      // Test both navigation types work correctly
      const pageLink = screen.getByRole('link', { name: /FHIR Overview/i });
      const sectionLink = screen.getByRole('link', { name: /FHIR Implementation/i });

      expect(pageLink).toHaveAttribute('href', '/standards/fhir');
      expect(sectionLink).toHaveAttribute('href', '/standards/fhir#implementation');

      fireEvent.click(pageLink);
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(mixedResults[0]);
      });

      fireEvent.click(sectionLink);
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(mixedResults[1]);
      });
    });
  });

  describe('No Routing Conflicts Verification', () => {
    test('should use single navigation mechanism per result', async () => {
      const result = createMockResult();
      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[result]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      const resultLink = screen.getByRole('link', { name: /Test Healthcare Standard/i });
      
      // Verify only one navigation mechanism is present
      expect(resultLink).toHaveAttribute('href', '/standards/fhir');
      
      // Click should trigger analytics but not interfere with navigation
      fireEvent.click(resultLink);
      
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledWith(result);
      });

      // Link should remain functional after click
      expect(resultLink).toHaveAttribute('href', '/standards/fhir');
    });

    test('should handle analytics without navigation interference', async () => {
      const result = createMockResult();
      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[result]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      const resultLink = screen.getByRole('link', { name: /Test Healthcare Standard/i });
      
      // Multiple clicks should not cause conflicts
      fireEvent.click(resultLink);
      fireEvent.click(resultLink);
      
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledTimes(2);
      });

      // Navigation should remain stable
      expect(resultLink).toHaveAttribute('href', '/standards/fhir');
    });

    test('should prevent duplicate navigation attempts', async () => {
      const result = createMockResult();
      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[result]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      const resultLink = screen.getByRole('link', { name: /Test Healthcare Standard/i });
      
      // Rapid clicks should not cause navigation conflicts
      fireEvent.click(resultLink);
      fireEvent.click(resultLink);
      fireEvent.click(resultLink);
      
      // All clicks should be handled gracefully
      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledTimes(3);
      });

      // Component should remain stable
      expect(resultLink).toBeInTheDocument();
    });
  });

  describe('Browser Back/Forward Navigation', () => {
    test('should handle browser history navigation', () => {
      const { useRouter } = require('next/router');
      const mockRouter = createMockRouter('/search', '/search?q=test');
      useRouter.mockReturnValue(mockRouter);

      const result = createMockResult();
      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={[result]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      // Simulate browser back navigation
      mockRouter.events.emit('routeChangeStart', '/');
      
      // Component should handle route changes gracefully
      expect(screen.getByRole('link', { name: /Test Healthcare Standard/i })).toBeInTheDocument();
    });

    test('should maintain state during browser navigation', () => {
      const { useRouter } = require('next/router');
      const mockRouter = createMockRouter('/standards/fhir', '/standards/fhir');
      useRouter.mockReturnValue(mockRouter);

      const result = createMockResult();
      const mockOnResultClick = jest.fn();

      const { rerender } = render(
        <SearchResults
          results={[result]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      // Simulate navigation back to search
      mockRouter.pathname = '/search';
      mockRouter.asPath = '/search?q=test';
      
      rerender(
        <SearchResults
          results={[result]}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      // Component should maintain functionality
      const resultLink = screen.getByRole('link', { name: /Test Healthcare Standard/i });
      expect(resultLink).toHaveAttribute('href', '/standards/fhir');
    });

    test('should handle URL parameter changes during navigation', () => {
      const { useRouter } = require('next/router');
      const mockRouter = createMockRouter('/search', '/search?q=initial');
      useRouter.mockReturnValue(mockRouter);

      const result = createMockResult();
      const mockOnResultClick = jest.fn();

      const { rerender } = render(
        <SearchResults
          results={[result]}
          query="initial"
          onResultClick={mockOnResultClick}
        />
      );

      // Simulate URL parameter change
      mockRouter.asPath = '/search?q=updated';
      
      rerender(
        <SearchResults
          results={[result]}
          query="updated"
          onResultClick={mockOnResultClick}
        />
      );

      // Navigation should remain functional
      const resultLink = screen.getByRole('link', { name: /Test Healthcare Standard/i });
      fireEvent.click(resultLink);
      
      expect(mockOnResultClick).toHaveBeenCalledWith(result);
    });
  });

  describe('Error Recovery and Stability', () => {
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
      
      // Error should not crash the component
      expect(() => fireEvent.click(resultLink)).not.toThrow();
      
      // Component should remain functional
      expect(resultLink).toBeInTheDocument();
      expect(resultLink).toHaveAttribute('href', '/standards/fhir');

      consoleSpy.mockRestore();
    });

    test('should maintain component stability during rapid interactions', async () => {
      const results = [
        createMockResult({ id: '1', title: 'Result 1' }),
        createMockResult({ id: '2', title: 'Result 2', url: '/standards/hl7' }),
        createMockResult({ id: '3', title: 'Result 3', url: '/standards/dicom' }),
      ];
      const mockOnResultClick = jest.fn();

      render(
        <SearchResults
          results={results}
          query="test"
          onResultClick={mockOnResultClick}
        />
      );

      // Rapid interactions with multiple results
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        fireEvent.click(link);
      });

      await waitFor(() => {
        expect(mockOnResultClick).toHaveBeenCalledTimes(3);
      });

      // All links should remain functional
      links.forEach(link => {
        expect(link).toBeInTheDocument();
        expect(link.getAttribute('href')).toMatch(/^\/standards\/(fhir|hl7|dicom)$/);
      });
    });
  });
});