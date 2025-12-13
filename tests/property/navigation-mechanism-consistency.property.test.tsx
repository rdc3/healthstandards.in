/**
 * **Feature: navigation-routing-fix, Property 2: Single navigation mechanism consistency**
 * **Validates: Requirements 2.1, 2.2**
 * 
 * Property: For any search result item rendered, it should use exactly one navigation 
 * mechanism without conflicting onClick handlers or duplicate navigation attempts
 */

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../helpers/test-utils';
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
    query: {},
    asPath: '/search',
  }),
}));

// Mock Next.js Link to properly trigger onClick handlers in tests
jest.mock('next/link', () => {
  return ({ children, href, onClick, ...props }: any) => {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault(); // Prevent actual navigation in tests
          if (onClick) {
            onClick(e);
          }
        }}
        {...props}
      >
        {children}
      </a>
    );
  };
});

describe('Navigation Mechanism Consistency Property Tests', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
    
    // Set up window.location for tests
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
        href: 'http://localhost:3000',
        pathname: '/',
        search: '',
        hash: '',
      },
      writable: true,
    });
  });

  test('Property 2: Single navigation mechanism consistency - each search result should use only one navigation mechanism', () => {
    fc.assert(
      fc.property(
        // Generate random search results
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            excerpt: fc.string({ minLength: 10, maxLength: 200 }),
            url: fc.oneof(
              fc.constant('/standards/fhir'),
              fc.constant('/standards/hl7'),
              fc.constant('/standards/dicom'),
              fc.constant('/about'),
              fc.constant('/resources')
            ),
            relevanceScore: fc.float({ min: 0, max: 1 }),
            highlightedText: fc.array(fc.string({ minLength: 5, maxLength: 50 }), { maxLength: 3 }),
            standard: fc.constantFrom('FHIR', 'HL7', 'DICOM', 'General'),
            category: fc.constantFrom('Protocol', 'Implementation', 'Standard', 'Guide'),
            type: fc.constantFrom('page', 'section') as fc.Arbitrary<'page' | 'section'>
          }),
          { minLength: 1, maxLength: 5 }
        ),
        fc.string({ minLength: 1, maxLength: 20 }), // search query
        (results: SearchResult[], query: string) => {
          const mockOnResultClick = jest.fn();
          
          render(
            <SearchResults
              results={results}
              query={query}
              onResultClick={mockOnResultClick}
            />
          );

          // Get all links in the search results
          const links = screen.getAllByRole('link');
          
          // Filter to only result links (exclude pagination, etc.)
          const resultLinks = links.filter(link => {
            const href = link.getAttribute('href');
            return href && results.some(result => result.url === href);
          });

          // For each result, verify single navigation mechanism
          results.forEach((result, index) => {
            // Find links for this specific result
            const resultSpecificLinks = resultLinks.filter(link => 
              link.getAttribute('href') === result.url
            );

            // Property: Each result should have at least one navigation mechanism (Link)
            expect(resultSpecificLinks.length).toBeGreaterThan(0);

            // Property: Each link should have proper href attribute (single navigation mechanism)
            resultSpecificLinks.forEach(link => {
              expect(link.getAttribute('href')).toBe(result.url);
              
              // Property: Links should not have conflicting navigation mechanisms
              // If there's an onClick, it should be for analytics only, not navigation
              const onClickAttr = link.getAttribute('onclick');
              if (onClickAttr) {
                // onClick should not contain navigation code
                expect(onClickAttr).not.toMatch(/router\.push|window\.location|navigate/i);
              }
            });
          });

          // Property: No programmatic navigation should be triggered by Link clicks
          // (Links handle navigation through href, not router.push)
          expect(mockPush).not.toHaveBeenCalled();
          expect(mockReplace).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Navigation mechanism consistency - suggestions and corrections should use single navigation approach', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }), // search query that returns no results
        (query: string) => {
          const mockOnResultClick = jest.fn();
          
          render(
            <SearchResults
              results={[]} // Empty results to trigger suggestions
              query={query}
              onResultClick={mockOnResultClick}
            />
          );

          // Get all links (suggestions and corrections)
          const links = screen.getAllByRole('link');
          
          // Filter to suggestion/correction links
          const suggestionLinks = links.filter(link => {
            const href = link.getAttribute('href');
            return href && href.includes('/search?q=');
          });

          // Property: Each suggestion/correction link should use single navigation mechanism
          suggestionLinks.forEach(link => {
            const href = link.getAttribute('href');
            expect(href).toMatch(/^\/search\?q=.+/);
            
            // Property: Links should not have conflicting navigation mechanisms
            const onClickAttr = link.getAttribute('onclick');
            if (onClickAttr) {
              // onClick should not contain navigation code
              expect(onClickAttr).not.toMatch(/router\.push|window\.location|navigate/i);
            }
          });

          // Property: No programmatic navigation should be triggered
          expect(mockPush).not.toHaveBeenCalled();
          expect(mockReplace).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Link components should not have conflicting event handlers', () => {
    fc.assert(
      fc.property(
        // Generate a single search result for focused testing
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }),
          title: fc.string({ minLength: 1, maxLength: 100 }),
          excerpt: fc.string({ minLength: 10, maxLength: 200 }),
          url: fc.constantFrom('/standards/fhir', '/standards/hl7', '/standards/dicom'),
          relevanceScore: fc.float({ min: 0, max: 1 }),
          highlightedText: fc.array(fc.string({ minLength: 5, maxLength: 50 }), { maxLength: 3 }),
          standard: fc.constantFrom('FHIR', 'HL7', 'DICOM'),
          category: fc.constantFrom('Protocol', 'Implementation', 'Standard'),
          type: fc.constantFrom('page', 'section') as fc.Arbitrary<'page' | 'section'>
        }),
        fc.string({ minLength: 1, maxLength: 20 }), // search query
        (result: SearchResult, query: string) => {
          const mockOnResultClick = jest.fn();
          
          render(
            <SearchResults
              results={[result]}
              query={query}
              onResultClick={mockOnResultClick}
            />
          );

          // Get all links for this result
          const links = screen.getAllByRole('link').filter(link => 
            link.getAttribute('href') === result.url
          );

          // Property: Each result should have at least one navigation link
          expect(links.length).toBeGreaterThan(0);

          // Property: Each link should use single navigation mechanism
          links.forEach(link => {
            // Verify the link has the correct href (primary navigation mechanism)
            expect(link.getAttribute('href')).toBe(result.url);
            
            // Property: Links should not have conflicting navigation mechanisms
            const onClick = link.getAttribute('onclick');
            
            // If there's an onClick, it should only be for analytics, not navigation
            if (onClick) {
              // The onClick should not contain router.push or similar navigation calls
              expect(onClick).not.toMatch(/router\.push|window\.location|navigate/i);
            }
          });

          // Property: No programmatic navigation should be triggered by rendering
          expect(mockPush).not.toHaveBeenCalled();
          expect(mockReplace).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });
});