/**
 * **Feature: health-standards-website, Property 6: Navigation state indication**
 * **Validates: Requirements 3.3, 3.5**
 * 
 * Property: For any healthcare standard page being viewed, the navigation system should 
 * highlight the current section and show accurate breadcrumb hierarchy
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../helpers/test-utils';
import fc from 'fast-check';
import { MainNavigation } from '../../src/components/navigation/MainNavigation';
import { Breadcrumbs } from '../../src/components/navigation/Breadcrumbs';

describe('Navigation State Indication Property Tests', () => {

  test('Property 6: Navigation should highlight current section for healthcare standard pages', () => {
    fc.assert(
      fc.property(
        // Generate healthcare standard page paths
        fc.oneof(
          fc.constant('/standards/fhir'),
          fc.constant('/standards/hl7'),
          fc.constant('/standards/dicom'),
          fc.constant('/standards'),
          fc.constant('/about'),
          fc.constant('/resources'),
          fc.constant('/')
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

          // Check for active state indication
          const allLinks = screen.getAllByRole('link');
          const allButtons = screen.getAllByRole('button');
          const allInteractiveElements = [...allLinks, ...allButtons];

          // Find elements that should be active based on current path
          let hasActiveIndication = false;

          allInteractiveElements.forEach(element => {
            const href = element.getAttribute('href');
            const className = element.className;
            const textContent = element.textContent?.toLowerCase() || '';

            // Check if this element should be active based on the current path
            let shouldBeActive = false;

            if (currentPath === '/' && (href === '/' || textContent.includes('home'))) {
              shouldBeActive = true;
            } else if (currentPath.startsWith('/standards') && 
                      (href?.startsWith('/standards') || textContent.includes('standards'))) {
              shouldBeActive = true;
            } else if (currentPath.startsWith('/about') && 
                      (href?.startsWith('/about') || textContent.includes('about'))) {
              shouldBeActive = true;
            } else if (currentPath.startsWith('/resources') && 
                      (href?.startsWith('/resources') || textContent.includes('resources'))) {
              shouldBeActive = true;
            }

            // If this element should be active, check for active styling
            if (shouldBeActive) {
              // Look for common active state indicators in the className
              const hasActiveClass = className.includes('text-blue-600') || 
                                   className.includes('bg-blue-50') ||
                                   className.includes('text-blue-800') ||
                                   className.includes('bg-blue-100') ||
                                   className.includes('active');

              if (hasActiveClass) {
                hasActiveIndication = true;
              }
            }
          });

          // For non-homepage paths, there should be some active indication
          if (currentPath !== '/') {
            expect(hasActiveIndication).toBe(true);
          }

          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 6: Breadcrumbs should show accurate hierarchy for healthcare standard pages', () => {
    fc.assert(
      fc.property(
        // Generate healthcare standard page paths with expected breadcrumb structure
        fc.oneof(
          fc.record({
            path: fc.constant('/standards/fhir'),
            expectedBreadcrumbs: fc.constant(['Home', 'Standards', 'HL7 FHIR'])
          }),
          fc.record({
            path: fc.constant('/standards/hl7'),
            expectedBreadcrumbs: fc.constant(['Home', 'Standards', 'HL7 v2'])
          }),
          fc.record({
            path: fc.constant('/standards/dicom'),
            expectedBreadcrumbs: fc.constant(['Home', 'Standards', 'DICOM'])
          }),
          fc.record({
            path: fc.constant('/standards'),
            expectedBreadcrumbs: fc.constant(['Home', 'Standards'])
          }),
          fc.record({
            path: fc.constant('/about'),
            expectedBreadcrumbs: fc.constant(['Home', 'About'])
          }),
          fc.record({
            path: fc.constant('/resources'),
            expectedBreadcrumbs: fc.constant(['Home', 'Resources'])
          })
        ),
        ({ path, expectedBreadcrumbs }) => {
          // Render breadcrumbs component with mock router
          render(<Breadcrumbs />, {
            router: {
              pathname: path,
              asPath: path,
              query: {},
            }
          });

          // Check that breadcrumbs contain expected hierarchy
          const breadcrumbNav = screen.queryByRole('navigation', { name: /breadcrumb/i });
          
          if (breadcrumbNav) {
            const breadcrumbText = breadcrumbNav.textContent || '';
            
            // Verify that all expected breadcrumb items are present
            expectedBreadcrumbs.forEach(breadcrumb => {
              expect(breadcrumbText).toContain(breadcrumb);
            });

            // Verify hierarchical order (each breadcrumb should appear before the next)
            let lastIndex = -1;
            expectedBreadcrumbs.forEach(breadcrumb => {
              const currentIndex = breadcrumbText.indexOf(breadcrumb);
              expect(currentIndex).toBeGreaterThan(lastIndex);
              lastIndex = currentIndex;
            });

            // The last breadcrumb should be marked as current page
            const lastBreadcrumb = expectedBreadcrumbs[expectedBreadcrumbs.length - 1];
            const currentPageElement = screen.queryByText(lastBreadcrumb);
            
            if (currentPageElement) {
              // Should have aria-current="page" or similar indication
              const hasCurrentPageIndication = 
                currentPageElement.getAttribute('aria-current') === 'page' ||
                currentPageElement.className.includes('text-gray-900') ||
                currentPageElement.className.includes('font-medium');
              
              expect(hasCurrentPageIndication).toBe(true);
            }
          }

          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 6: Navigation should provide parent section links in breadcrumbs', () => {
    fc.assert(
      fc.property(
        // Generate deep page paths that should have parent navigation
        fc.oneof(
          fc.constant('/standards/fhir'),
          fc.constant('/standards/hl7'),
          fc.constant('/standards/dicom')
        ),
        (currentPath) => {
          // Render breadcrumbs component with mock router
          render(<Breadcrumbs />, {
            router: {
              pathname: currentPath,
              asPath: currentPath,
              query: {},
            }
          });

          // For healthcare standard pages, should have links back to parent sections
          const homeLink = screen.queryByRole('link', { name: /home/i });
          const standardsLink = screen.queryByRole('link', { name: /standards/i });

          // Should have a link back to home
          expect(homeLink).toBeInTheDocument();
          if (homeLink) {
            expect(homeLink.getAttribute('href')).toBe('/');
          }

          // Should have a link back to standards section
          expect(standardsLink).toBeInTheDocument();
          if (standardsLink) {
            expect(standardsLink.getAttribute('href')).toBe('/standards');
          }

          // Clean up
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 }
    );
  });
});