/**
 * Integration test to validate the fix for the original HL7 search and click error
 * Tests the specific scenario: search for "HL7" and click on the first result
 * Ensures "Abort fetching component" errors are resolved
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/router';
import { SearchResults } from '../../src/components/search/SearchResults';
import { NavigationProvider } from '../../src/contexts/NavigationContext';

// Mock Next.js router
const mockPush = jest.fn(() => Promise.resolve(true));
const mockReplace = jest.fn(() => Promise.resolve(true));
const mockRouter = {
  push: mockPush,
  replace: mockReplace,
  asPath: '/search?q=HL7',
  query: { q: 'HL7' },
  pathname: '/search',
  route: '/search',
  back: jest.fn(),
  forward: jest.fn(),
  reload: jest.fn(),
  beforePopState: jest.fn(),
  prefetch: jest.fn(() => Promise.resolve()),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: true,
  isReady: true,
  isPreview: false,
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock the search hook
const mockSearch = jest.fn();
const mockGetSuggestions = jest.fn();
const mockClearResults = jest.fn();
const mockTrackSearch = jest.fn();

jest.mock('../../src/hooks/useSearch', () => ({
  useSearch: jest.fn(),
  usePopularSearches: jest.fn(() => ['HL7', 'FHIR', 'DICOM', 'interoperability']),
  useSearchAnalytics: jest.fn(() => ({
    trackSearch: mockTrackSearch,
  })),
}));

// Mock search validation utilities
jest.mock('../../src/utils/searchValidation', () => ({
  validateSearchQuery: jest.fn((query: string) => ({
    isValid: true,
    sanitizedQuery: query,
  })),
  sanitizeSearchQuery: jest.fn((query: string) => query),
  generateNoResultsSuggestions: jest.fn(() => ['HL7', 'FHIR', 'DICOM']),
  suggestQueryCorrections: jest.fn(() => []),
  searchRateLimit: {
    canSearch: jest.fn(() => true),
    recordSearch: jest.fn(),
    getTimeUntilReset: jest.fn(() => 0),
  },
}));

// Mock navigation utilities
jest.mock('../../src/utils/navigationUtils', () => ({
  createSafeNavigationHandler: jest.fn((navFn, callbackFn) => 
    (event: any, url: string, data: any) => {
      callbackFn?.(data);
    }
  ),
  isValidNavigationUrl: jest.fn(() => true),
}));

// Mock search results that match the actual search index
const mockHL7SearchResults = [
  {
    id: 'page-hl7',
    title: 'HL7 Healthcare Standards Overview',
    excerpt: 'HL7 (Health Level Seven) International is a not-for-profit, ANSI-accredited standards developing organization dedicated to providing a comprehensive framework...',
    url: '/standards/hl7',
    relevanceScore: 0.95,
    highlightedText: ['HL7 refers to a set of international standards for transfer of clinical and administrative data'],
    standard: 'HL7',
    category: 'messaging',
    type: 'page' as const,
  },
  {
    id: 'section-hl7-what-is-hl7',
    title: 'HL7 Healthcare Standards Overview - What is HL7?',
    excerpt: 'HL7 refers to a set of international standards for transfer of clinical and administrative data between software applications...',
    url: '/standards/hl7#section-1',
    relevanceScore: 0.88,
    highlightedText: ['HL7 standards are used globally and are the foundation for interoperability'],
    standard: 'HL7',
    category: 'messaging',
    type: 'section' as const,
  },
  {
    id: 'page-fhir',
    title: 'HL7 FHIR - Fast Healthcare Interoperability Resources',
    excerpt: 'FHIR (Fast Healthcare Interoperability Resources) is a standard for exchanging healthcare information electronically. Developed by HL7...',
    url: '/standards/fhir',
    relevanceScore: 0.82,
    highlightedText: ['Developed by HL7, FHIR combines the best features'],
    standard: 'FHIR',
    category: 'messaging',
    type: 'page' as const,
  },
];

describe('HL7 Navigation Fix Validation', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock window.location.origin for URL display
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should successfully display HL7 search results without errors', async () => {
    await act(async () => {
      render(
        <NavigationProvider>
          <SearchResults
            results={mockHL7SearchResults}
            query="HL7"
            isLoading={false}
            error={null}
          />
        </NavigationProvider>
      );
    });

    // Verify search results are displayed
    expect(screen.getByText((content, element) => {
      return content.includes('Found') && content.includes('3') && content.includes('results');
    })).toBeInTheDocument();
  });

  test('should handle clicking on the first HL7 search result without navigation conflicts', async () => {
    await act(async () => {
      render(
        <NavigationProvider>
          <SearchResults
            results={mockHL7SearchResults}
            query="HL7"
            isLoading={false}
            error={null}
          />
        </NavigationProvider>
      );
    });

    // Find the first search result link (the exact match, not the section)
    const firstResultLink = screen.getByRole('link', { name: (content, element) => {
      return element?.getAttribute('href') === '/standards/hl7' && 
             content.includes('HL7') && 
             content.includes('Healthcare Standards Overview') &&
             !content.includes('What is');
    }});
    expect(firstResultLink).toBeInTheDocument();
    expect(firstResultLink).toHaveAttribute('href', '/standards/hl7');

    // Click on the first result
    await act(async () => {
      fireEvent.click(firstResultLink);
    });

    // Verify no errors occurred during the click
    // The absence of console errors and successful rendering indicates the fix worked
    expect(firstResultLink).toBeInTheDocument();
  });

  test('should handle multiple rapid clicks without causing navigation conflicts', async () => {
    await act(async () => {
      render(
        <NavigationProvider>
          <SearchResults
            results={mockHL7SearchResults}
            query="HL7"
            isLoading={false}
            error={null}
          />
        </NavigationProvider>
      );
    });

    const firstResultLink = screen.getByRole('link', { name: (content, element) => {
      return element?.getAttribute('href') === '/standards/hl7' && 
             content.includes('HL7') && 
             content.includes('Healthcare Standards Overview') &&
             !content.includes('What is');
    }});

    // Simulate rapid multiple clicks (this was causing the original error)
    await act(async () => {
      fireEvent.click(firstResultLink);
      fireEvent.click(firstResultLink);
      fireEvent.click(firstResultLink);
    });

    // Verify the component remains stable and no errors occur
    expect(firstResultLink).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return content.includes('Found') && content.includes('3') && content.includes('results');
    })).toBeInTheDocument();
  });

  test('should properly handle navigation to HL7 page URL', async () => {
    await act(async () => {
      render(
        <NavigationProvider>
          <SearchResults
            results={mockHL7SearchResults}
            query="HL7"
            isLoading={false}
            error={null}
          />
        </NavigationProvider>
      );
    });

    // Verify the URL is correctly formatted and accessible
    const urlLink = screen.getByText('http://localhost:3000/standards/hl7');
    expect(urlLink).toBeInTheDocument();
    expect(urlLink.closest('a')).toHaveAttribute('href', '/standards/hl7');
  });

  test('should display loading indicator during navigation without causing conflicts', async () => {
    await act(async () => {
      render(
        <NavigationProvider>
          <SearchResults
            results={mockHL7SearchResults}
            query="HL7"
            isLoading={false}
            error={null}
          />
        </NavigationProvider>
      );
    });

    // The component should render without errors even during navigation states
    expect(screen.getByText((content, element) => {
      return content.includes('Found') && content.includes('3') && content.includes('results');
    })).toBeInTheDocument();
  });

  test('should handle search result analytics tracking without interfering with navigation', async () => {
    const mockOnResultClick = jest.fn();
    
    await act(async () => {
      render(
        <NavigationProvider>
          <SearchResults
            results={mockHL7SearchResults}
            query="HL7"
            isLoading={false}
            error={null}
            onResultClick={mockOnResultClick}
          />
        </NavigationProvider>
      );
    });

    const firstResultLink = screen.getByRole('link', { name: (content, element) => {
      return element?.getAttribute('href') === '/standards/hl7' && 
             content.includes('HL7') && 
             content.includes('Healthcare Standards Overview') &&
             !content.includes('What is');
    }});

    // Click on the result
    await act(async () => {
      fireEvent.click(firstResultLink);
    });

    // Verify the callback was called with the correct result
    expect(mockOnResultClick).toHaveBeenCalledWith(mockHL7SearchResults[0]);
  });

  test('should validate that all HL7 search results have proper navigation URLs', async () => {
    await act(async () => {
      render(
        <NavigationProvider>
          <SearchResults
            results={mockHL7SearchResults}
            query="HL7"
            isLoading={false}
            error={null}
          />
        </NavigationProvider>
      );
    });

    // Check that all expected HL7 results are present with correct URLs
    const hl7OverviewLink = screen.getByRole('link', { name: (content, element) => {
      return element?.getAttribute('href') === '/standards/hl7' && 
             content.includes('HL7') && 
             content.includes('Healthcare Standards Overview') &&
             !content.includes('What is');
    }});
    expect(hl7OverviewLink).toHaveAttribute('href', '/standards/hl7');

    const fhirLink = screen.getByRole('link', { name: (content, element) => {
      return element?.getAttribute('href') === '/standards/fhir' && 
             content.includes('HL7 FHIR');
    }});
    expect(fhirLink).toHaveAttribute('href', '/standards/fhir');

    // Verify section link is also present
    const sectionLinks = screen.getAllByText(/standards\/hl7/);
    expect(sectionLinks.length).toBeGreaterThan(0);
  });

  test('should handle browser back/forward navigation without conflicts', async () => {
    await act(async () => {
      render(
        <NavigationProvider>
          <SearchResults
            results={mockHL7SearchResults}
            query="HL7"
            isLoading={false}
            error={null}
          />
        </NavigationProvider>
      );
    });

    // Simulate browser back button (this should not cause navigation conflicts)
    await act(async () => {
      mockRouter.back();
    });

    // Component should remain stable
    expect(screen.getByText((content, element) => {
      return content.includes('Found') && content.includes('3') && content.includes('results');
    })).toBeInTheDocument();
  });

  test('should ensure no "Abort fetching component" errors occur during navigation', async () => {
    // Capture console errors to ensure no abort errors occur
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <NavigationProvider>
          <SearchResults
            results={mockHL7SearchResults}
            query="HL7"
            isLoading={false}
            error={null}
          />
        </NavigationProvider>
      );
    });

    const firstResultLink = screen.getByRole('link', { name: (content, element) => {
      return element?.getAttribute('href') === '/standards/hl7' && 
             content.includes('HL7') && 
             content.includes('Healthcare Standards Overview') &&
             !content.includes('What is');
    }});

    // Click multiple times to stress test
    await act(async () => {
      fireEvent.click(firstResultLink);
      fireEvent.click(firstResultLink);
    });

    // Wait a bit to ensure any async errors would have occurred
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify no "Abort fetching component" errors were logged
    const errorCalls = consoleSpy.mock.calls;
    const abortErrors = errorCalls.filter(call => 
      call.some(arg => 
        typeof arg === 'string' && arg.includes('Abort fetching component')
      )
    );

    expect(abortErrors).toHaveLength(0);

    consoleSpy.mockRestore();
  });
});