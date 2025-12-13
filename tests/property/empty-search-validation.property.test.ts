/**
 * Property-based tests for empty search input validation
 * **Feature: health-standards-website, Property 3: Empty search input validation**
 * **Validates: Requirements 2.3**
 */

import fc from 'fast-check';
import { validateSearchQuery, sanitizeSearchQuery } from '../../src/utils/searchValidation';
import { performSearch, buildSearchIndex, createSearchDocuments } from '../../src/utils/searchIndex';
import { ParsedContent } from '../../src/types/content';

// Test data generators
const generateWhitespaceString = (): fc.Arbitrary<string> =>
  fc.oneof(
    fc.constant(''),
    fc.constant(' '),
    fc.constant('  '),
    fc.constant('\t'),
    fc.constant('\n'),
    fc.constant('\r'),
    fc.constant('   \t  \n  \r  '),
    fc.string().filter(s => s.trim().length === 0 && s.length > 0)
  );

const generateEmptyOrWhitespaceQuery = (): fc.Arbitrary<string> =>
  fc.oneof(
    fc.constant(''),
    fc.constant(' '),
    fc.constant('  '),
    fc.constant('\t'),
    fc.constant('\n'),
    fc.constant('\r\n'),
    fc.constant('   '),
    fc.constant('\t\t'),
    fc.constant('\n\n'),
    fc.constant(' \t \n \r '),
    fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length === 0)
  );

const generateValidContent = (): fc.Arbitrary<ParsedContent> =>
  fc.record({
    metadata: fc.record({
      title: fc.constant('Test Healthcare Standard'),
      standard: fc.constant('HL7'),
      category: fc.constant('messaging'),
      tags: fc.constant(['test', 'healthcare'])
    }),
    content: fc.constant('Test content about healthcare standards'),
    rawContent: fc.constant('Test content about healthcare standards'),
    sections: fc.constant([])
  });

describe('Empty Search Input Validation Property Tests', () => {
  /**
   * Property 3: Empty search input validation
   * For any string composed entirely of whitespace, performing a search should be 
   * prevented and the current state should remain unchanged
   */

  test('validateSearchQuery rejects empty and whitespace-only strings', () => {
    fc.assert(
      fc.property(
        generateEmptyOrWhitespaceQuery(),
        (emptyQuery) => {
          const validation = validateSearchQuery(emptyQuery);
          
          // Property: Empty or whitespace queries should be invalid
          expect(validation.isValid).toBe(false);
          expect(validation.error).toBeDefined();
          
          // Should be one of the expected error messages for empty/whitespace queries
          const expectedErrors = ['required', 'empty', 'at least 2 characters'];
          const hasExpectedError = expectedErrors.some(expectedError => 
            validation.error!.toLowerCase().includes(expectedError.toLowerCase())
          );
          expect(hasExpectedError).toBe(true);
          
          // Property: Should provide helpful suggestion
          expect(validation.suggestion).toBeDefined();
          expect(validation.suggestion!.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('sanitizeSearchQuery handles empty and whitespace strings correctly', () => {
    fc.assert(
      fc.property(
        generateWhitespaceString(),
        (whitespaceString) => {
          const sanitized = sanitizeSearchQuery(whitespaceString);
          
          // Property: Sanitized whitespace-only strings should result in empty string
          expect(sanitized).toBe('');
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('performSearch returns empty results for whitespace-only queries', () => {
    fc.assert(
      fc.property(
        fc.array(generateValidContent(), { minLength: 1, maxLength: 5 }),
        generateEmptyOrWhitespaceQuery(),
        (parsedContents, emptyQuery) => {
          // Build search index with valid content
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          // Perform search with empty/whitespace query
          const results = performSearch(searchIndex, emptyQuery);
          
          // Property: Empty or whitespace queries should return no results
          expect(results).toHaveLength(0);
          expect(Array.isArray(results)).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('search validation prevents queries that are too short', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 1 }).filter(s => s.trim().length === 1),
        (shortQuery) => {
          const validation = validateSearchQuery(shortQuery);
          
          // Property: Single character queries should be invalid
          expect(validation.isValid).toBe(false);
          expect(validation.error).toBeDefined();
          expect(validation.error).toContain('at least 2 characters');
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('search validation handles null and undefined inputs', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined)
        ),
        (nullishQuery) => {
          const validation = validateSearchQuery(nullishQuery as any);
          
          // Property: Null/undefined queries should be invalid
          expect(validation.isValid).toBe(false);
          expect(validation.error).toBeDefined();
          expect(validation.error).toContain('required');
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  test('search validation provides consistent error messages for empty inputs', () => {
    fc.assert(
      fc.property(
        generateEmptyOrWhitespaceQuery(),
        (emptyQuery) => {
          const validation = validateSearchQuery(emptyQuery);
          
          // Property: All empty/whitespace queries should have consistent error handling
          expect(validation.isValid).toBe(false);
          expect(validation.error).toBeDefined();
          
          // Should be one of the expected error messages
          const expectedErrors = [
            'Search query is required',
            'Search query cannot be empty',
            'Search query must be at least 2 characters long'
          ];
          
          const hasExpectedError = expectedErrors.some(expectedError => 
            validation.error!.includes(expectedError) || 
            expectedError.includes(validation.error!)
          );
          
          expect(hasExpectedError).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 75 }
    );
  });

  test('search maintains state when empty query is submitted', () => {
    fc.assert(
      fc.property(
        fc.array(generateValidContent(), { minLength: 2, maxLength: 5 }),
        fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
        generateEmptyOrWhitespaceQuery(),
        (parsedContents, validQuery, emptyQuery) => {
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          // First, perform a valid search to establish state
          const validResults = performSearch(searchIndex, validQuery);
          
          // Then perform empty search
          const emptyResults = performSearch(searchIndex, emptyQuery);
          
          // Property: Empty search should return empty results, not affect previous state
          expect(emptyResults).toHaveLength(0);
          
          // Property: Valid search should still work after empty search
          const validResultsAfter = performSearch(searchIndex, validQuery);
          expect(validResultsAfter).toEqual(validResults);
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  test('edge cases with mixed whitespace and special characters', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(' \t '),
          fc.constant('\n\r\n'),
          fc.constant('  \t\n  '),
          fc.constant(' \u00A0 '), // Non-breaking space
          fc.constant(' \u2000 '), // En quad
          fc.constant(' \u2003 '), // Em space
        ),
        (specialWhitespace) => {
          const validation = validateSearchQuery(specialWhitespace);
          
          // Property: All forms of whitespace should be treated as empty
          expect(validation.isValid).toBe(false);
          expect(validation.error).toBeDefined();
          
          // Property: Sanitization should handle special whitespace
          const sanitized = sanitizeSearchQuery(specialWhitespace);
          expect(sanitized).toBe('');
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('boundary conditions for minimum query length', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('a'),
          fc.constant('1'),
          fc.constant(' a'),
          fc.constant('a '),
          fc.constant(' a '),
          fc.constant('\ta'),
          fc.constant('a\n')
        ),
        (boundaryQuery) => {
          const validation = validateSearchQuery(boundaryQuery);
          const trimmed = boundaryQuery.trim();
          
          if (trimmed.length < 2) {
            // Property: Queries shorter than 2 characters should be invalid
            expect(validation.isValid).toBe(false);
            expect(validation.error).toContain('at least 2 characters');
          } else {
            // Property: Queries with 2+ characters should be valid
            expect(validation.isValid).toBe(true);
            expect(validation.sanitizedQuery).toBe(trimmed);
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});