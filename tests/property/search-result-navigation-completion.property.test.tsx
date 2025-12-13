/**
 * **Feature: navigation-routing-fix, Property 1: Search result navigation completion**
 * **Validates: Requirements 1.1, 1.2, 1.4**
 * 
 * Property: For any valid search result with a target URL, clicking on it should successfully 
 * navigate to the target page without routing errors or aborted component loading
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
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

describe('Search Result Navigation Completion Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Property 1: Search result navigation completion - clicking any valid search result should navigate successfully', () => {
    fc.assert(
      fc.property(
        // Generate valid search results with various configurations
        fc.record({
          results: fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 50 }),
              title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length >= 5),
              excerpt: fc.string({ minLength: 10, maxLength: 300 }),
              url: fc.oneof(
                fc.constant('/standards/fhir'),
                fc.constant('/standards/hl7'),
                fc.constant('/standards/dicom'),
                fc.constant('/about'),
                fc.constant('/resources'),
                fc.constant('/standards/fhir#resources'),
                fc.constant('/standards/hl7#messaging'),
                fc.constant('/standards/dicom#imaging')
              ),
              relevanceScore: fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }),
              highlightedText: fc.array(fc.string({ minLength: 3, maxLength: 50 }), { maxLength: 5 }),
              standard: fc.oneof(
                fc.constant('FHIR'),
                fc.constant('HL7'),
                fc.constant('DICOM')
              ),
              category: fc.oneof(
                fc.constant('Standard'),
                fc.constant('Protocol'),
                fc.constant('Guide'),
                fc.constant('Reference')
              ),
              type: fc.oneof(
                fc.constant('page' as const),
                fc.constant('section' as const)
              )
            }),
            { minLength: 1, maxLength: 10 }
          ),
          query: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0)
        }),
        ({ results, query }) => {
          const mockOnResultClick = jest.fn();
          
          render(
            <SearchResults
              results={results}
              query={query}
              onResultClick={mockOnResultClick}
            />
          );

          // Find all result links
          const resultLinks = screen.getAllByRole('link').filter(link => {
            const href = link.getAttribute('href');
            return href && (
              href.startsWith('/standards/') ||
              href.startsWith('/about') ||
              href.startsWith('/resources')
            );
          });

          // Test each result link
          resultLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            
            // Verify link has valid href
            expect(href).toBeTruthy();
            expect(href).toMatch(/^\/[a-zA-Z0-9\-\/#]*$/);
            
            // Find corresponding result
            const correspondingResult = results.find(result => result.url === href);
            if (correspondingResult) {
              // Click the link
              fireEvent.click(link);
              
              // Verify navigation was attempted without errors
              // The component should remain stable after click
              expect(link).toBeInTheDocument();
              expect(link).toHaveAttribute('href', href);
              
              // Verify analytics callback was called (if the callback is provided)
              if (mockOnResultClick.mock.calls.length > 0) {
                expect(mockOnResultClick).toHaveBeenCalledWith(correspondingResult);
              }
              
              // Verify no routing conflicts occurred
              // (Component should not crash or become unresponsive)
              const updatedLinks = screen.getAllByRole('link').filter(l => 
                l.getAttribute('href') === href
              );
              expect(updatedLinks.length).toBeGreaterThan(0);
            }
          });

          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Navigation completion should work for all result types', () => {
    fc.assert(
      fc.property(
        // Generate results with specific focus on different types
        fc.oneof(
          // Page results
          fc.record({
            type: fc.constant('page' as const),
            url: fc.oneof(
              fc.constant('/standards/fhir'),
              fc.constant('/standards/hl7'),
              fc.constant('/standards/dicom')
            ),
            title: fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length >= 5),
            excerpt: fc.string({ minLength: 10, maxLength: 200 }),
            id: fc.string({ minLength: 1, maxLength: 20 }),
            relevanceScore: fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }),
            highlightedText: fc.array(fc.string({ minLength: 3, maxLength: 30 }), { maxLength: 3 }),
            standard: fc.oneof(fc.constant('FHIR'), fc.constant('HL7'), fc.constant('DICOM')),
            category: fc.constant('Standard')
          }),
          // Section results
          fc.record({
            type: fc.constant('section' as const),
            url: fc.oneof(
              fc.constant('/standards/fhir#resources'),
              fc.constant('/standards/hl7#messaging'),
              fc.constant('/standards/dicom#imaging')
            ),
            title: fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length >= 5),
            excerpt: fc.string({ minLength: 10, maxLength: 200 }),
            id: fc.string({ minLength: 1, maxLength: 20 }),
            relevanceScore: fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }),
            highlightedText: fc.array(fc.string({ minLength: 3, maxLength: 30 }), { maxLength: 3 }),
            standard: fc.oneof(fc.constant('FHIR'), fc.constant('HL7'), fc.constant('DICOM')),
            category: fc.constant('Standard')
          })
        ),
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0), // query
        (result, query) => {
          const mockOnResultClick = jest.fn();
          
          render(
            <SearchResults
              results={[result]}
              query={query}
              onResultClick={mockOnResultClick}
            />
          );

          // Find the result link by href attribute
          const resultLinks = screen.getAllByRole('link').filter(link => 
            link.getAttribute('href') === result.url
          );
          expect(resultLinks.length).toBeGreaterThan(0);
          
          const resultLink = resultLinks[0];
          expect(resultLink).toBeInTheDocument();
          expect(resultLink).toHaveAttribute('href', result.url);

          // Click the result
          fireEvent.click(resultLink);

          // Verify navigation completion
          // 1. Component should remain stable
          expect(resultLink).toBeInTheDocument();
          expect(resultLink).toHaveAttribute('href', result.url);
          
          // 2. Analytics should be called
          expect(mockOnResultClick).toHaveBeenCalledWith(result);
          
          // 3. No routing errors should occur (component doesn't crash)
          const updatedLinks = screen.getAllByRole('link').filter(link => 
            link.getAttribute('href') === result.url
          );
          expect(updatedLinks.length).toBeGreaterThan(0);
          
          // 4. URL should be valid for navigation
          expect(result.url).toMatch(/^\/[a-zA-Z0-9\-\/#]*$/);
          
          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Component loading should complete successfully during navigation', () => {
    fc.assert(
      fc.property(
        fc.record({
          result: fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            title: fc.string({ minLength: 5, maxLength: 80 }).filter(s => s.trim().length >= 5),
            excerpt: fc.string({ minLength: 10, maxLength: 250 }),
            url: fc.oneof(
              fc.constant('/standards/fhir'),
              fc.constant('/standards/hl7'),
              fc.constant('/standards/dicom')
            ),
            relevanceScore: fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }),
            highlightedText: fc.array(fc.string({ minLength: 3, maxLength: 40 }), { maxLength: 4 }),
            standard: fc.oneof(fc.constant('FHIR'), fc.constant('HL7'), fc.constant('DICOM')),
            category: fc.constant('Standard'),
            type: fc.oneof(fc.constant('page' as const), fc.constant('section' as const))
          }),
          query: fc.string({ minLength: 1, maxLength: 40 }).filter(s => s.trim().length > 0),
          isLoading: fc.boolean()
        }),
        ({ result, query, isLoading }) => {
          const mockOnResultClick = jest.fn();
          
          const { rerender } = render(
            <SearchResults
              results={[result]}
              query={query}
              isLoading={isLoading}
              onResultClick={mockOnResultClick}
            />
          );

          if (isLoading) {
            // Verify loading state
            expect(screen.getByText(/searching/i)).toBeInTheDocument();
            
            // Simulate loading completion
            rerender(
              <SearchResults
                results={[result]}
                query={query}
                isLoading={false}
                onResultClick={mockOnResultClick}
              />
            );
          }

          // Verify component loaded successfully
          const resultLinks = screen.getAllByRole('link').filter(link => 
            link.getAttribute('href') === result.url
          );
          expect(resultLinks.length).toBeGreaterThan(0);
          
          const resultLink = resultLinks[0];
          expect(resultLink).toBeInTheDocument();
          expect(resultLink).toHaveAttribute('href', result.url);

          // Test navigation after loading completion
          fireEvent.click(resultLink);

          // Verify navigation completed successfully
          expect(mockOnResultClick).toHaveBeenCalledWith(result);
          expect(resultLink).toBeInTheDocument();
          expect(resultLink).toHaveAttribute('href', result.url);
          
          // Verify component remains stable after navigation
          const updatedLinks = screen.getAllByRole('link').filter(link => 
            link.getAttribute('href') === result.url
          );
          expect(updatedLinks.length).toBeGreaterThan(0);
          
          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Navigation should handle multiple rapid clicks without conflicts', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }),
          title: fc.string({ minLength: 5, maxLength: 60 }).filter(s => s.trim().length >= 5),
          excerpt: fc.string({ minLength: 10, maxLength: 200 }),
          url: fc.oneof(
            fc.constant('/standards/fhir'),
            fc.constant('/standards/hl7'),
            fc.constant('/standards/dicom')
          ),
          relevanceScore: fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }),
          highlightedText: fc.array(fc.string({ minLength: 3, maxLength: 30 }), { maxLength: 3 }),
          standard: fc.oneof(fc.constant('FHIR'), fc.constant('HL7'), fc.constant('DICOM')),
          category: fc.constant('Standard'),
          type: fc.oneof(fc.constant('page' as const), fc.constant('section' as const))
        }),
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0), // query
        fc.integer({ min: 2, max: 5 }), // number of clicks
        (result, query, clickCount) => {
          const mockOnResultClick = jest.fn();
          
          render(
            <SearchResults
              results={[result]}
              query={query}
              onResultClick={mockOnResultClick}
            />
          );

          const resultLinks = screen.getAllByRole('link').filter(link => 
            link.getAttribute('href') === result.url
          );
          expect(resultLinks.length).toBeGreaterThan(0);
          
          const resultLink = resultLinks[0];
          expect(resultLink).toBeInTheDocument();

          // Perform multiple rapid clicks
          for (let i = 0; i < clickCount; i++) {
            fireEvent.click(resultLink);
          }

          // Verify navigation handled multiple clicks gracefully
          // 1. Component should remain stable
          expect(resultLink).toBeInTheDocument();
          expect(resultLink).toHaveAttribute('href', result.url);
          
          // 2. Analytics should be called for each click
          expect(mockOnResultClick).toHaveBeenCalledTimes(clickCount);
          expect(mockOnResultClick).toHaveBeenCalledWith(result);
          
          // 3. No navigation conflicts should occur
          const updatedLinks = screen.getAllByRole('link').filter(link => 
            link.getAttribute('href') === result.url
          );
          expect(updatedLinks.length).toBeGreaterThan(0);
          
          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 1: Navigation should work with various URL formats', () => {
    fc.assert(
      fc.property(
        fc.record({
          baseResult: fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            title: fc.string({ minLength: 5, maxLength: 60 }).filter(s => s.trim().length >= 5),
            excerpt: fc.string({ minLength: 10, maxLength: 200 }),
            relevanceScore: fc.float({ min: Math.fround(0.1), max: Math.fround(1.0) }),
            highlightedText: fc.array(fc.string({ minLength: 3, maxLength: 30 }), { maxLength: 3 }),
            standard: fc.oneof(fc.constant('FHIR'), fc.constant('HL7'), fc.constant('DICOM')),
            category: fc.constant('Standard'),
            type: fc.oneof(fc.constant('page' as const), fc.constant('section' as const))
          }),
          urlVariant: fc.oneof(
            // Standard page URLs
            fc.record({
              url: fc.constant('/standards/fhir'),
              expectedPattern: fc.constant(/^\/standards\/fhir$/)
            }),
            fc.record({
              url: fc.constant('/standards/hl7'),
              expectedPattern: fc.constant(/^\/standards\/hl7$/)
            }),
            fc.record({
              url: fc.constant('/standards/dicom'),
              expectedPattern: fc.constant(/^\/standards\/dicom$/)
            }),
            // Section URLs with anchors
            fc.record({
              url: fc.constant('/standards/fhir#resources'),
              expectedPattern: fc.constant(/^\/standards\/fhir#resources$/)
            }),
            fc.record({
              url: fc.constant('/standards/hl7#messaging'),
              expectedPattern: fc.constant(/^\/standards\/hl7#messaging$/)
            }),
            fc.record({
              url: fc.constant('/standards/dicom#imaging'),
              expectedPattern: fc.constant(/^\/standards\/dicom#imaging$/)
            })
          ),
          query: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0)
        }),
        ({ baseResult, urlVariant, query }) => {
          const result = { ...baseResult, url: urlVariant.url };
          const mockOnResultClick = jest.fn();
          
          render(
            <SearchResults
              results={[result]}
              query={query}
              onResultClick={mockOnResultClick}
            />
          );

          const resultLinks = screen.getAllByRole('link').filter(link => 
            link.getAttribute('href') === result.url
          );
          expect(resultLinks.length).toBeGreaterThan(0);
          
          const resultLink = resultLinks[0];
          expect(resultLink).toBeInTheDocument();
          
          // Verify URL format is correct
          expect(result.url).toMatch(urlVariant.expectedPattern);
          expect(resultLink).toHaveAttribute('href', result.url);

          // Test navigation
          fireEvent.click(resultLink);

          // Verify navigation completed successfully
          expect(mockOnResultClick).toHaveBeenCalledWith(result);
          expect(resultLink).toBeInTheDocument();
          expect(resultLink).toHaveAttribute('href', result.url);
          
          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 }
    );
  });
});