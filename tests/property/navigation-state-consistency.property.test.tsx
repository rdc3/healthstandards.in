/**
 * **Feature: navigation-routing-fix, Property 4: Navigation state consistency**
 * **Validates: Requirements 2.4, 3.2**
 * 
 * Property: For any navigation event, URL parameters should update correctly 
 * and browser history should be managed properly without conflicts
 */

import fc from 'fast-check';
import { updateUrlParameters, extractUrlParameters, isValidNavigationUrl } from '../../src/utils/navigationUtils';

// Mock window.location for URL validation
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000/',
  },
  writable: true,
});

// Helper to generate safe parameter names
const safeParamName = fc.string({ minLength: 1, maxLength: 20 }).filter(s => 
  /^[a-zA-Z][a-zA-Z0-9]*$/.test(s) && 
  !['constructor', 'valueOf', 'toString', 'hasOwnProperty', 'prototype', '__proto__', 'length'].includes(s)
);

const safeParamValue = fc.string({ minLength: 1, maxLength: 50 }).filter(s => !/[&=]/.test(s));

describe('Navigation State Consistency Property Tests', () => {
  beforeEach(() => {
    // Reset window.location
    window.location.href = 'http://localhost:3000/';
  });

  test('Property 4: URL parameter updates should maintain consistency', () => {
    fc.assert(
      fc.property(
        fc.record({
          basePath: fc.oneof(
            fc.constant('/search'),
            fc.constant('/standards'),
            fc.constant('/about')
          ),
          initialParams: fc.dictionary(safeParamName, safeParamValue),
          newParams: fc.dictionary(safeParamName, safeParamValue)
        }),
        ({ basePath, initialParams, newParams }) => {
          // Build initial URL with parameters
          const initialUrlParams = new URLSearchParams();
          Object.entries(initialParams).forEach(([key, value]) => {
            initialUrlParams.set(key, value);
          });
          
          const initialUrl = initialUrlParams.toString() ? 
            `${basePath}?${initialUrlParams.toString()}` : basePath;
          
          // Update URL parameters
          const updatedUrl = updateUrlParameters(initialUrl, newParams);
          
          // Verify consistency
          expect(isValidNavigationUrl(updatedUrl)).toBe(true);
          
          // Extract parameters from updated URL
          const extractedParams = extractUrlParameters(updatedUrl);
          
          // Verify new parameters are included
          Object.entries(newParams).forEach(([key, expectedValue]) => {
            expect(extractedParams[key]).toBe(expectedValue);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 4: URL parameter extraction should be consistent', () => {
    fc.assert(
      fc.property(
        fc.record({
          path: fc.oneof(
            fc.constant('/search'),
            fc.constant('/standards'),
            fc.constant('/about')
          ),
          params: fc.dictionary(safeParamName, safeParamValue)
        }),
        ({ path, params }) => {
          // Build URL with parameters
          const urlParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            urlParams.set(key, value);
          });
          
          const fullUrl = urlParams.toString() ? `${path}?${urlParams.toString()}` : path;
          
          // Test URL parameter extraction
          const extractedParams = extractUrlParameters(fullUrl);
          
          // Verify consistency
          Object.entries(params).forEach(([key, expectedValue]) => {
            expect(extractedParams[key]).toBe(expectedValue);
          });
          
          // Test URL parameter updating
          const newParams = { testParam: 'testValue' };
          const updatedUrl = updateUrlParameters(fullUrl, newParams);
          
          // Verify updated URL is valid
          expect(isValidNavigationUrl(updatedUrl)).toBe(true);
          
          // Verify new parameters are included
          const finalParams = extractUrlParameters(updatedUrl);
          expect(finalParams.testParam).toBe('testValue');
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 4: URL validation should be consistent', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Valid URLs
          fc.record({
            path: fc.oneof(
              fc.constant('/'),
              fc.constant('/standards'),
              fc.constant('/standards/fhir'),
              fc.constant('/about'),
              fc.constant('/resources')
            ),
            params: fc.dictionary(safeParamName, safeParamValue),
            isValid: fc.constant(true)
          }),
          // Invalid URLs
          fc.record({
            path: fc.oneof(
              fc.constant('javascript:alert(1)'),
              fc.constant('http://external.com/path'),
              fc.constant('//external.com/path'),
              fc.constant('/path with spaces'),
              fc.constant('/path<script>')
            ),
            params: fc.constant({}),
            isValid: fc.constant(false)
          })
        ),
        ({ path, params, isValid }) => {
          // Build URL with parameters
          const urlParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            urlParams.set(key, value);
          });
          
          const fullUrl = urlParams.toString() ? `${path}?${urlParams.toString()}` : path;
          
          // Test URL validation
          const validationResult = isValidNavigationUrl(fullUrl);
          
          // Verify validation is consistent with expectation
          expect(validationResult).toBe(isValid);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 4: Parameter extraction and updating should be round-trip consistent', () => {
    fc.assert(
      fc.property(
        fc.record({
          path: fc.oneof(
            fc.constant('/search'),
            fc.constant('/standards'),
            fc.constant('/about')
          ),
          params: fc.dictionary(safeParamName, safeParamValue)
        }),
        ({ path, params }) => {
          // Build URL with parameters
          const urlParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            urlParams.set(key, value);
          });
          
          const originalUrl = urlParams.toString() ? `${path}?${urlParams.toString()}` : path;
          
          // Extract parameters
          const extractedParams = extractUrlParameters(originalUrl);
          
          // Update with the same parameters
          const updatedUrl = updateUrlParameters(originalUrl, extractedParams);
          
          // Extract parameters again
          const reExtractedParams = extractUrlParameters(updatedUrl);
          
          // Verify round-trip consistency
          Object.entries(params).forEach(([key, expectedValue]) => {
            expect(extractedParams[key]).toBe(expectedValue);
            expect(reExtractedParams[key]).toBe(expectedValue);
          });
          
          // Verify URLs are valid
          expect(isValidNavigationUrl(originalUrl)).toBe(true);
          expect(isValidNavigationUrl(updatedUrl)).toBe(true);
        }
      ),
      { numRuns: 50 }
    );
  });
});