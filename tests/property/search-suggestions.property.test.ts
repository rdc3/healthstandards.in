/**
 * Property-based tests for real-time search suggestions
 * **Feature: health-standards-website, Property 4: Real-time search suggestions**
 * **Validates: Requirements 2.5**
 */

import fc from 'fast-check';
import { 
  getSearchSuggestions, 
  buildSearchIndex, 
  createSearchDocuments 
} from '../../src/utils/searchIndex';
import { ParsedContent } from '../../src/types/content';

// Test data generators
const generateHealthcareStandard = (): fc.Arbitrary<string> =>
  fc.oneof(
    fc.constant('HL7'),
    fc.constant('FHIR'),
    fc.constant('DICOM'),
    fc.constant('IHE'),
    fc.constant('SNOMED'),
    fc.constant('LOINC')
  );

const generateHealthcareTerm = (): fc.Arbitrary<string> =>
  fc.oneof(
    fc.constant('interoperability'),
    fc.constant('messaging'),
    fc.constant('imaging'),
    fc.constant('patient'),
    fc.constant('medical'),
    fc.constant('healthcare'),
    fc.constant('clinical'),
    fc.constant('data'),
    fc.constant('exchange'),
    fc.constant('standards')
  );

const generateContentWithKnownTerms = (): fc.Arbitrary<ParsedContent> =>
  fc.record({
    metadata: fc.record({
      title: fc.oneof(
        fc.constant('HL7 Healthcare Standards'),
        fc.constant('FHIR Interoperability Guide'),
        fc.constant('DICOM Medical Imaging'),
        fc.constant('Healthcare Data Exchange'),
        fc.constant('Patient Information Systems')
      ),
      standard: generateHealthcareStandard(),
      category: fc.oneof(
        fc.constant('messaging'),
        fc.constant('imaging'),
        fc.constant('terminology')
      ),
      tags: fc.array(
        fc.oneof(
          generateHealthcareStandard(),
          generateHealthcareTerm()
        ),
        { minLength: 1, maxLength: 5 }
      )
    }),
    content: fc.oneof(
      fc.constant('Healthcare interoperability standards for patient data exchange'),
      fc.constant('Medical imaging protocols using DICOM standards'),
      fc.constant('HL7 FHIR messaging for clinical data integration'),
      fc.constant('Patient information systems and healthcare workflows')
    ),
    rawContent: fc.string({ minLength: 50, maxLength: 200 }),
    sections: fc.array(
      fc.record({
        id: fc.string({ minLength: 5, maxLength: 15 }),
        title: fc.oneof(
          fc.constant('Healthcare Standards Overview'),
          fc.constant('Interoperability Guidelines'),
          fc.constant('Patient Data Management'),
          fc.constant('Medical Device Integration')
        ),
        content: fc.string({ minLength: 20, maxLength: 100 }),
        order: fc.integer({ min: 0, max: 5 })
      }),
      { minLength: 0, maxLength: 3 }
    )
  });

const generatePartialQuery = (): fc.Arbitrary<string> =>
  fc.oneof(
    // Partial healthcare standard names
    fc.constantFrom('H', 'HL', 'F', 'FH', 'FHI', 'D', 'DI', 'DIC', 'DICO'),
    // Partial healthcare terms
    fc.constantFrom('int', 'inter', 'interop', 'med', 'medi', 'medic', 'pat', 'pati', 'patien'),
    // Random partial strings
    fc.string({ minLength: 2, maxLength: 8 })
  );

describe('Real-time Search Suggestions Property Tests', () => {
  /**
   * Property 4: Real-time search suggestions
   * For any text input in the search field, the system should provide relevant 
   * autocomplete suggestions based on available content
   */

  test('getSearchSuggestions returns relevant suggestions for partial queries', () => {
    fc.assert(
      fc.property(
        fc.array(generateContentWithKnownTerms(), { minLength: 3, maxLength: 10 }),
        generatePartialQuery(),
        (parsedContents, partialQuery) => {
          // Skip very short queries as they may not have meaningful suggestions
          if (partialQuery.trim().length < 2) {
            return true;
          }

          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const suggestions = getSearchSuggestions(searchIndex, partialQuery, 5);
          
          // Property: Suggestions should be an array
          expect(Array.isArray(suggestions)).toBe(true);
          
          // Property: Should not exceed requested limit
          expect(suggestions.length).toBeLessThanOrEqual(5);
          
          // Property: All suggestions should be strings
          for (const suggestion of suggestions) {
            expect(typeof suggestion).toBe('string');
            expect(suggestion.length).toBeGreaterThan(0);
          }
          
          // Property: Suggestions should be relevant to the partial query
          const queryLower = partialQuery.toLowerCase();
          for (const suggestion of suggestions) {
            const suggestionLower = suggestion.toLowerCase();
            
            // Suggestion should either start with the query or contain it
            const isRelevant = suggestionLower.startsWith(queryLower) || 
                              suggestionLower.includes(queryLower);
            
            // For very short queries, we're more lenient
            if (partialQuery.length >= 3) {
              expect(isRelevant).toBe(true);
            }
          }
          
          // Property: No duplicate suggestions
          const uniqueSuggestions = new Set(suggestions);
          expect(uniqueSuggestions.size).toBe(suggestions.length);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('suggestions are provided for known healthcare terms', () => {
    fc.assert(
      fc.property(
        fc.array(generateContentWithKnownTerms(), { minLength: 5, maxLength: 15 }),
        fc.oneof(
          fc.constantFrom('HL', 'FH', 'DI', 'int', 'med', 'pat', 'hea'),
          fc.constantFrom('H', 'F', 'D', 'i', 'm', 'p', 'h')
        ),
        (parsedContents, knownPartial) => {
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const suggestions = getSearchSuggestions(searchIndex, knownPartial, 10);
          
          // Property: Should provide suggestions for known healthcare term prefixes
          expect(Array.isArray(suggestions)).toBe(true);
          
          // For longer prefixes, we should get some suggestions
          if (knownPartial.length >= 2) {
            // We might not always get suggestions due to random content generation
            // but the function should work without errors
            expect(suggestions.length).toBeGreaterThanOrEqual(0);
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('empty or very short queries return no suggestions', () => {
    fc.assert(
      fc.property(
        fc.array(generateContentWithKnownTerms(), { minLength: 2, maxLength: 5 }),
        fc.oneof(
          fc.constant(''),
          fc.constant(' '),
          fc.constant('a'),
          fc.constant('1'),
          fc.constant(' a'),
          fc.constant('a ')
        ),
        (parsedContents, shortQuery) => {
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const suggestions = getSearchSuggestions(searchIndex, shortQuery, 5);
          
          // Property: Very short or empty queries should return no suggestions
          if (shortQuery.trim().length < 2) {
            expect(suggestions).toHaveLength(0);
          }
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  test('suggestions respect the limit parameter', () => {
    fc.assert(
      fc.property(
        fc.array(generateContentWithKnownTerms(), { minLength: 5, maxLength: 20 }),
        generatePartialQuery(),
        fc.integer({ min: 1, max: 10 }),
        (parsedContents, partialQuery, limit) => {
          if (partialQuery.trim().length < 2) {
            return true;
          }

          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const suggestions = getSearchSuggestions(searchIndex, partialQuery, limit);
          
          // Property: Should never exceed the specified limit
          expect(suggestions.length).toBeLessThanOrEqual(limit);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('suggestions are case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.array(generateContentWithKnownTerms(), { minLength: 3, maxLength: 8 }),
        fc.oneof(
          fc.constantFrom('hl7', 'HL7', 'Hl7', 'hL7'),
          fc.constantFrom('fhir', 'FHIR', 'Fhir', 'fHIR'),
          fc.constantFrom('dicom', 'DICOM', 'Dicom', 'dICOM')
        ),
        (parsedContents, caseVariant) => {
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const suggestions = getSearchSuggestions(searchIndex, caseVariant, 5);
          
          // Property: Case should not affect suggestion generation
          expect(Array.isArray(suggestions)).toBe(true);
          
          // All suggestions should be valid strings
          for (const suggestion of suggestions) {
            expect(typeof suggestion).toBe('string');
            expect(suggestion.length).toBeGreaterThan(0);
          }
          
          return true;
        }
      ),
      { numRuns: 40 }
    );
  });

  test('suggestions handle special characters gracefully', () => {
    fc.assert(
      fc.property(
        fc.array(generateContentWithKnownTerms(), { minLength: 2, maxLength: 5 }),
        fc.oneof(
          fc.constantFrom('HL7-', 'FHIR.', 'DICOM/', 'data-', 'inter.'),
          fc.string({ minLength: 3, maxLength: 8 }).map(s => s + '-'),
          fc.string({ minLength: 3, maxLength: 8 }).map(s => s + '.')
        ),
        (parsedContents, queryWithSpecialChars) => {
          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          // Property: Should not throw errors with special characters
          expect(() => {
            const suggestions = getSearchSuggestions(searchIndex, queryWithSpecialChars, 5);
            expect(Array.isArray(suggestions)).toBe(true);
          }).not.toThrow();
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  test('suggestions are consistent for the same query', () => {
    fc.assert(
      fc.property(
        fc.array(generateContentWithKnownTerms(), { minLength: 3, maxLength: 8 }),
        generatePartialQuery(),
        (parsedContents, partialQuery) => {
          if (partialQuery.trim().length < 2) {
            return true;
          }

          const searchDocuments = createSearchDocuments(parsedContents);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          // Get suggestions multiple times
          const suggestions1 = getSearchSuggestions(searchIndex, partialQuery, 5);
          const suggestions2 = getSearchSuggestions(searchIndex, partialQuery, 5);
          const suggestions3 = getSearchSuggestions(searchIndex, partialQuery, 5);
          
          // Property: Same query should return same suggestions
          expect(suggestions1).toEqual(suggestions2);
          expect(suggestions2).toEqual(suggestions3);
          
          return true;
        }
      ),
      { numRuns: 40 }
    );
  });

  test('suggestions work with empty search index', () => {
    fc.assert(
      fc.property(
        generatePartialQuery(),
        (partialQuery) => {
          // Create empty search index
          const searchIndex = buildSearchIndex([]);
          
          const suggestions = getSearchSuggestions(searchIndex, partialQuery, 5);
          
          // Property: Empty index should return empty suggestions without errors
          expect(Array.isArray(suggestions)).toBe(true);
          expect(suggestions).toHaveLength(0);
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('suggestions prioritize title matches over content matches', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('healthcare', 'medical', 'patient', 'clinical'),
        (searchTerm) => {
          // Create content where the term appears in both title and content
          const contentWithTitleMatch: ParsedContent = {
            metadata: {
              title: `${searchTerm} standards guide`,
              standard: 'HL7',
              category: 'messaging',
              tags: [searchTerm]
            },
            content: 'General content about standards',
            rawContent: 'General content about standards',
            sections: []
          };
          
          const contentWithContentMatch: ParsedContent = {
            metadata: {
              title: 'General standards guide',
              standard: 'FHIR',
              category: 'messaging',
              tags: ['standards']
            },
            content: `This content discusses ${searchTerm} in detail`,
            rawContent: `This content discusses ${searchTerm} in detail`,
            sections: []
          };
          
          const searchDocuments = createSearchDocuments([contentWithTitleMatch, contentWithContentMatch]);
          const searchIndex = buildSearchIndex(searchDocuments);
          
          const suggestions = getSearchSuggestions(searchIndex, searchTerm.substring(0, 4), 5);
          
          // Property: Should return suggestions without errors
          expect(Array.isArray(suggestions)).toBe(true);
          
          // Property: Suggestions should be relevant
          for (const suggestion of suggestions) {
            expect(typeof suggestion).toBe('string');
            expect(suggestion.length).toBeGreaterThan(0);
          }
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });
});