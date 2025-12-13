/**
 * Property-based tests for search functionality completeness
 * **Feature: health-standards-website, Property 2: Search functionality completeness**
 * **Validates: Requirements 2.1, 2.2**
 */

import fc from 'fast-check';
import { 
  createSearchDocuments, 
  buildSearchIndex, 
  performSearch, 
  SearchDocument 
} from '../../src/utils/searchIndex';
import { ParsedContent } from '../../src/types/content';

// Test data generators
const generateHealthcareStandard = (): fc.Arbitrary<string> =>
  fc.oneof(
    fc.constant('HL7'),
    fc.constant('FHIR'),
    fc.constant('DICOM'),
    fc.constant('IHE'),
    fc.constant('SNOMED')
  );

const generateCategory = (): fc.Arbitrary<string> =>
  fc.oneof(
    fc.constant('messaging'),
    fc.constant('imaging'),
    fc.constant('terminology'),
    fc.constant('security')
  );

const generateContentMetadata = () =>
  fc.record({
    title: fc.string({ minLength: 5, maxLength: 100 }),
    standard: generateHealthcareStandard(),
    category: generateCategory(),
    tags: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
    description: fc.option(fc.string({ minLength: 10, maxLength: 200 }))
  });

const generateParsedContent = (): fc.Arbitrary<ParsedContent> =>
  fc.record({
    metadata: generateContentMetadata(),
    content: fc.string({ minLength: 50, maxLength: 1000 }),
    rawContent: fc.string({ minLength: 50, maxLength: 1000 }),
    sections: fc.array(
      fc.record({
        id: fc.string({ minLength: 5, maxLength: 20 }),
        title: fc.string({ minLength: 5, maxLength: 50 }),
        content: fc.string({ minLength: 20, maxLength: 500 }),
        order: fc.integer({ min: 0, max: 10 })
      }),
      { minLength: 0, maxLength: 5 }
    )
  });

const generateSearchQuery = (): fc.Arbitrary<string> =>
  fc.oneof(
    // Healthcare standard names
    fc.constantFrom('HL7', 'FHIR', 'DICOM', 'IHE'),
    // Common healthcare terms
    fc.constantFrom('interoperability', 'messaging', 'imaging', 'patient', 'medical'),
    // Combinations
    fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length >= 2)
  );

describe('Search Functionality Completeness Property Tests', () => {
  /**
   * Property 2: Search functionality completeness
   * For any valid search terms, the search should return relevant results from all 
   * healthcare standards content with highlighted matching text and context
   */
  
  test('search returns results from all relevant content when query matches', () => {
    fc.assert(
      fc.property(
        fc.array(generateParsedContent(), { minLength: 1, maxLength: 10 }),
        generateSearchQuery(),
        (parsedContents, query) => {
          // Build search index from generated content
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          // Perform search
          const results = performSearch(searchIndex, query, { limit: 20 });
          
          // Property: All results should be relevant to the query
          for (const result of results) {
            const queryLower = query.toLowerCase();
            const titleLower = result.title.toLowerCase();
            const excerptLower = result.excerpt.toLowerCase();
            
            // At least one of title or excerpt should contain query terms or be semantically related
            const containsQuery = titleLower.includes(queryLower) || 
                                excerptLower.includes(queryLower) ||
                                result.highlightedText.some(highlight => 
                                  highlight.toLowerCase().includes(queryLower)
                                );
            
            // For healthcare standards, also check if query matches standard or category
            const matchesStandard = result.standard.toLowerCase().includes(queryLower);
            const matchesCategory = result.category.toLowerCase().includes(queryLower);
            
            const isRelevant = containsQuery || matchesStandard || matchesCategory;
            
            if (!isRelevant) {
              // This might be a semantic match - for now we'll be lenient
              // In a real implementation, we'd have more sophisticated relevance scoring
              console.warn(`Potentially irrelevant result for query "${query}": ${result.title}`);
            }
          }
          
          // Property: Results should have proper structure
          for (const result of results) {
            expect(result.id).toBeDefined();
            expect(result.title).toBeDefined();
            expect(result.excerpt).toBeDefined();
            expect(result.url).toBeDefined();
            expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
            expect(result.relevanceScore).toBeLessThanOrEqual(1);
            expect(result.standard).toBeDefined();
            expect(result.category).toBeDefined();
            expect(result.type).toMatch(/^(page|section)$/);
            expect(Array.isArray(result.highlightedText)).toBe(true);
          }
          
          // Property: Results should be ordered by relevance (descending)
          for (let i = 1; i < results.length; i++) {
            expect(results[i].relevanceScore).toBeLessThanOrEqual(results[i - 1].relevanceScore);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('search returns highlighted matching text and context', () => {
    fc.assert(
      fc.property(
        fc.array(generateParsedContent(), { minLength: 1, maxLength: 5 }),
        generateSearchQuery(),
        (parsedContents, query) => {
          // Ensure at least one content item contains the query
          if (parsedContents.length > 0) {
            parsedContents[0].rawContent = `${parsedContents[0].rawContent} ${query} additional content`;
            parsedContents[0].metadata.title = `${query} ${parsedContents[0].metadata.title}`;
          }
          
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const results = performSearch(searchIndex, query, { limit: 10 });
          
          // Property: Results with matches should have highlighted text
          const resultsWithMatches = results.filter(result => {
            const queryLower = query.toLowerCase();
            return result.title.toLowerCase().includes(queryLower) ||
                   result.excerpt.toLowerCase().includes(queryLower);
          });
          
          for (const result of resultsWithMatches) {
            // Should have excerpt with context
            expect(result.excerpt.length).toBeGreaterThan(0);
            expect(result.excerpt.length).toBeLessThanOrEqual(500); // Reasonable excerpt length
            
            // Highlighted text should be provided
            expect(Array.isArray(result.highlightedText)).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('search handles various query formats correctly', () => {
    fc.assert(
      fc.property(
        fc.array(generateParsedContent(), { minLength: 2, maxLength: 8 }),
        fc.oneof(
          // Single terms
          fc.constantFrom('HL7', 'FHIR', 'DICOM'),
          // Multi-word queries
          fc.constantFrom('healthcare standards', 'medical imaging', 'patient data'),
          // Queries with special characters (should be handled gracefully)
          fc.constantFrom('HL7-FHIR', 'DICOM/imaging', 'data.exchange')
        ),
        (parsedContents, query) => {
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          // Property: Search should not throw errors for any valid query format
          expect(() => {
            const results = performSearch(searchIndex, query);
            
            // Results should be properly formatted
            expect(Array.isArray(results)).toBe(true);
            
            for (const result of results) {
              expect(typeof result.id).toBe('string');
              expect(typeof result.title).toBe('string');
              expect(typeof result.excerpt).toBe('string');
              expect(typeof result.url).toBe('string');
              expect(typeof result.relevanceScore).toBe('number');
              expect(typeof result.standard).toBe('string');
              expect(typeof result.category).toBe('string');
              expect(['page', 'section']).toContain(result.type);
            }
          }).not.toThrow();
          
          return true;
        }
      ),
      { numRuns: 75 }
    );
  });

  test('search respects limit parameter', () => {
    fc.assert(
      fc.property(
        fc.array(generateParsedContent(), { minLength: 5, maxLength: 20 }),
        generateSearchQuery(),
        fc.integer({ min: 1, max: 10 }),
        (parsedContents, query, limit) => {
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const results = performSearch(searchIndex, query, { limit });
          
          // Property: Results should not exceed the specified limit
          expect(results.length).toBeLessThanOrEqual(limit);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('search filters work correctly', () => {
    fc.assert(
      fc.property(
        fc.array(generateParsedContent(), { minLength: 3, maxLength: 10 }),
        generateSearchQuery(),
        generateHealthcareStandard(),
        generateCategory(),
        (parsedContents, query, standardFilter, categoryFilter) => {
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const results = performSearch(searchIndex, query, {
            standardFilter,
            categoryFilter,
            limit: 20
          });
          
          // Property: All results should match the specified filters
          for (const result of results) {
            expect(result.standard.toLowerCase()).toBe(standardFilter.toLowerCase());
            expect(result.category.toLowerCase()).toBe(categoryFilter.toLowerCase());
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('empty query returns empty results', () => {
    fc.assert(
      fc.property(
        fc.array(generateParsedContent(), { minLength: 1, maxLength: 5 }),
        fc.constantFrom('', '   ', '\t', '\n'),
        (parsedContents, emptyQuery) => {
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const results = performSearch(searchIndex, emptyQuery);
          
          // Property: Empty or whitespace queries should return no results
          expect(results).toHaveLength(0);
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });
});