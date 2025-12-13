/**
 * **Feature: health-standards-website, Property 5: Universal navigation presence**
 * **Validates: Requirements 3.1, 3.4**
 * 
 * Property: For any page on the website, it should display a consistent navigation system 
 * with all available healthcare standards and a clear path back to the homepage
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../helpers/test-utils';
import fc from 'fast-check';
import { MainNavigation } from '../../src/components/navigation/MainNavigation';

describe('Navigation Consistency Property Tests', () => {
  test('Property 5: Universal navigation presence - navigation should be consistent across all pages', () => {
    fc.assert(
      fc.property(
        // Generate various page paths that could exist on the website
        fc.oneof(
          fc.constant('/'),
          fc.constant('/standards'),
          fc.constant('/standards/fhir'),
          fc.constant('/standards/hl7'),
          fc.constant('/standards/dicom'),
          fc.constant('/about'),
          fc.constant('/resources'),
          fc.string({ minLength: 1, maxLength: 20 })
        ),
        (currentPath) => {
          // Render navigation component with mock router
          render(<MainNavigation />, {
            router: {
              pathname: currentPath,
              asPath: currentPath,
              query: {},
            }
          });

          // Verify that essential navigation elements are present
          // 1. Home link should always be present
          const homeLink = screen.getByRole('link', { name: /home/i });
          expect(homeLink).toBeInTheDocument();
          expect(homeLink).toHaveAttribute('href', '/');

          // 2. Standards navigation should be present
          const standardsNavigation = screen.getByText(/standards/i);
          expect(standardsNavigation).toBeInTheDocument();

          // 3. About link should be present
          const aboutLink = screen.getByRole('link', { name: /about/i });
          expect(aboutLink).toBeInTheDocument();
          expect(aboutLink).toHaveAttribute('href', '/about');

          // 4. Resources link should be present
          const resourcesLink = screen.getByRole('link', { name: /resources/i });
          expect(resourcesLink).toBeInTheDocument();
          expect(resourcesLink).toHaveAttribute('href', '/resources');

          // 5. Healthcare standards should be accessible (either directly visible or in dropdown)
          // We check for the presence of standard names in the document
          const documentText = document.body.textContent || '';
          
          // At minimum, the navigation should provide access to major healthcare standards
          // This could be through dropdown menus or direct links
          const hasStandardsAccess = 
            documentText.includes('FHIR') || 
            documentText.includes('HL7') || 
            documentText.includes('DICOM') ||
            documentText.includes('Standards'); // At minimum, a Standards section should exist

          expect(hasStandardsAccess).toBe(true);

          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Navigation should provide clear path back to homepage from any page', () => {
    fc.assert(
      fc.property(
        // Generate various deep page paths
        fc.oneof(
          fc.constant('/standards/fhir'),
          fc.constant('/standards/hl7'),
          fc.constant('/standards/dicom'),
          fc.constant('/about'),
          fc.constant('/resources'),
          // Generate some nested paths
          fc.tuple(
            fc.constantFrom('standards', 'resources', 'about'),
            fc.string({ minLength: 1, maxLength: 10 })
          ).map(([base, sub]) => `/${base}/${sub}`)
        ),
        (currentPath) => {
          // Render navigation component with mock router
          render(<MainNavigation />, {
            router: {
              pathname: currentPath,
              asPath: currentPath,
              query: {},
            }
          });

          // Verify that there's always a clear path back to homepage
          const homeLinks = screen.getAllByRole('link').filter(link => 
            link.getAttribute('href') === '/' || 
            link.textContent?.toLowerCase().includes('home')
          );

          // There should be at least one way to get back to the homepage
          expect(homeLinks.length).toBeGreaterThan(0);

          // At least one home link should be clearly identifiable
          const clearHomeLink = homeLinks.find(link => 
            link.textContent?.toLowerCase().includes('home') ||
            link.getAttribute('aria-label')?.toLowerCase().includes('home')
          );

          expect(clearHomeLink).toBeDefined();

          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 }
    );
  });
});