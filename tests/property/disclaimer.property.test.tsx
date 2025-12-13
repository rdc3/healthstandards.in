import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../helpers/test-utils';
import * as fc from 'fast-check';
import { Layout } from '../../src/components/layout/Layout';

/**
 * **Feature: health-standards-website, Property 10: Universal disclaimer presence**
 * **Validates: Requirements 5.1, 5.2**
 * 
 * Property: For any page content, the website should display a prominent educational 
 * disclaimer stating the content is for educational purposes only and should not be 
 * used for actual healthcare implementation.
 */
describe('Disclaimer Presence Property Tests', () => {
  test('Property 10: Universal disclaimer presence - any page content should display educational disclaimer', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary page content
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          content: fc.string({ minLength: 0, maxLength: 1000 }),
          hasHeading: fc.boolean(),
          hasLinks: fc.boolean(),
          hasList: fc.boolean(),
        }),
        (pageData) => {
          // Create mock page content based on generated data
          const MockPageContent = () => (
            <div>
              {pageData.hasHeading && <h1>{pageData.title}</h1>}
              <p>{pageData.content}</p>
              {pageData.hasLinks && (
                <a href="/test">Test Link</a>
              )}
              {pageData.hasList && (
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
              )}
            </div>
          );

          // Render the page within the Layout component
          const { unmount } = render(
            <Layout>
              <MockPageContent />
            </Layout>
          );

          try {
            // Verify that the educational disclaimer is present
            // Requirements 5.1: Display prominent educational disclaimer
            const disclaimerHeading = screen.getAllByText('Educational Purpose Only')[0];
            expect(disclaimerHeading).toBeInTheDocument();

            // Requirements 5.2: State content is for educational purposes only and not for healthcare implementation
            const disclaimerText = screen.getByText(/This website is designed for educational purposes only/i);
            expect(disclaimerText).toBeInTheDocument();

            const implementationWarning = screen.getByText(/should not be used for actual healthcare implementation/i);
            expect(implementationWarning).toBeInTheDocument();

            // Verify the disclaimer is prominent (has warning styling)
            // Find the disclaimer container with the yellow background
            const disclaimerContainer = disclaimerHeading.closest('.bg-yellow-50');
            expect(disclaimerContainer).toBeInTheDocument();
            expect(disclaimerContainer).toHaveClass('bg-yellow-50');
            expect(disclaimerContainer).toHaveClass('border-yellow-400');

            // Verify disclaimer contains legal language about implementation decisions
            const legalDisclaimer = screen.getByText(/disclaim any responsibility for implementation decisions/i);
            expect(legalDisclaimer).toBeInTheDocument();
          } finally {
            // Clean up after each property test run
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 10: Disclaimer visibility - disclaimer should be visible and non-dismissible', () => {
    fc.assert(
      fc.property(
        // Generate different types of page content
        fc.oneof(
          fc.constant(<div><h1>Homepage</h1><p>Welcome to Health Standards</p></div>),
          fc.constant(<div><h2>HL7 FHIR</h2><p>FHIR standard information</p></div>),
          fc.constant(<div><h2>DICOM</h2><p>DICOM standard information</p></div>),
          fc.constant(<div><p>Empty page content</p></div>),
          fc.constant(<div></div>) // Empty content
        ),
        (pageContent) => {
          // Render any page content within Layout
          const { unmount } = render(
            <Layout>
              {pageContent}
            </Layout>
          );

          try {
            // The disclaimer should always be present regardless of page content
            const disclaimer = screen.getAllByText('Educational Purpose Only')[0];
            expect(disclaimer).toBeInTheDocument();
            expect(disclaimer).toBeVisible();

            // Verify there's no dismiss button or close functionality
            const dismissButton = screen.queryByRole('button', { name: /close|dismiss|hide/i });
            expect(dismissButton).not.toBeInTheDocument();

            // Verify the disclaimer is in the footer (always visible)
            const footers = screen.getAllByRole('contentinfo');
            const footer = footers[0]; // Get the first footer
            expect(footer).toContainElement(disclaimer);
          } finally {
            // Clean up after each property test run
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: health-standards-website, Property 12: Disclaimer persistence**
   * **Validates: Requirements 5.4, 5.5**
   * 
   * Property: For any page displaying the educational disclaimer, it should be easily 
   * readable and not dismissible to ensure legal compliance, and include appropriate 
   * legal language disclaiming responsibility for implementation decisions.
   */
  test('Property 12: Disclaimer persistence - disclaimer should be easily readable, non-dismissible, and include legal language', () => {
    fc.assert(
      fc.property(
        // Generate various page scenarios and user interaction attempts
        fc.record({
          pageContent: fc.oneof(
            fc.constant(<div><h1>HL7 FHIR Standard</h1><p>FHIR implementation guide</p></div>),
            fc.constant(<div><h1>DICOM Overview</h1><p>Medical imaging standard</p></div>),
            fc.constant(<div><h1>Healthcare Standards</h1><p>Comprehensive guide</p></div>),
            fc.constant(<div><p>Any healthcare content</p></div>),
            fc.constant(<div></div>) // Empty content
          ),
          // Simulate different viewport sizes to test readability
          viewportWidth: fc.integer({ min: 320, max: 1920 }),
          // Simulate different user interaction attempts
          interactionAttempts: fc.array(
            fc.oneof(
              fc.constant('click_outside_disclaimer'),
              fc.constant('keyboard_escape'),
              fc.constant('scroll_past_disclaimer'),
              fc.constant('focus_other_element')
            ),
            { minLength: 0, maxLength: 3 }
          )
        }),
        (testData) => {
          // Mock window dimensions for responsive testing
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: testData.viewportWidth,
          });

          // Render the page within Layout
          const { unmount, container } = render(
            <Layout>
              {testData.pageContent}
            </Layout>
          );

          try {
            // Requirement 5.4: Disclaimer should be easily readable
            const disclaimerHeading = screen.getAllByText('Educational Purpose Only')[0];
            expect(disclaimerHeading).toBeInTheDocument();
            expect(disclaimerHeading).toBeVisible();

            // Verify disclaimer has readable styling (yellow background for prominence)
            const disclaimerContainer = disclaimerHeading.closest('.bg-yellow-50');
            expect(disclaimerContainer).toBeInTheDocument();
            expect(disclaimerContainer).toHaveClass('bg-yellow-50');
            expect(disclaimerContainer).toHaveClass('border-yellow-400');

            // Verify disclaimer text is easily readable with proper contrast
            const disclaimerText = screen.getByText(/This website is designed for educational purposes only/i);
            expect(disclaimerText).toBeInTheDocument();
            expect(disclaimerText).toBeVisible();

            // Requirement 5.4: Disclaimer should not be dismissible
            // Verify there are no close/dismiss buttons anywhere in the disclaimer
            const dismissButtons = container.querySelectorAll('button[aria-label*="close"], button[aria-label*="dismiss"], button[title*="close"], button[title*="dismiss"]');
            const disclaimerSection = disclaimerHeading.closest('.bg-yellow-50');
            
            // Check if any dismiss buttons are within the disclaimer section
            let dismissButtonInDisclaimer = false;
            dismissButtons.forEach(button => {
              if (disclaimerSection?.contains(button)) {
                dismissButtonInDisclaimer = true;
              }
            });
            expect(dismissButtonInDisclaimer).toBe(false);

            // Verify no X or close icons in disclaimer
            const closeIcons = disclaimerSection?.querySelectorAll('svg[data-testid*="close"], svg[aria-label*="close"], .close-icon, .dismiss-icon');
            expect(closeIcons?.length || 0).toBe(0);

            // Requirement 5.5: Include appropriate legal language disclaiming responsibility
            const legalDisclaimer = screen.getByText(/disclaim any responsibility for implementation decisions/i);
            expect(legalDisclaimer).toBeInTheDocument();
            expect(legalDisclaimer).toBeVisible();

            // Verify comprehensive legal language is present
            const implementationWarning = screen.getByText(/should not be used for actual healthcare implementation/i);
            expect(implementationWarning).toBeInTheDocument();

            const consultationAdvice = screen.getByText(/consult the official standard documentation/i);
            expect(consultationAdvice).toBeInTheDocument();

            // Simulate user interaction attempts - disclaimer should persist
            testData.interactionAttempts.forEach(attempt => {
              switch (attempt) {
                case 'click_outside_disclaimer':
                  // Click outside disclaimer area
                  const mainContent = container.querySelector('main');
                  if (mainContent) {
                    mainContent.click();
                  }
                  break;
                case 'keyboard_escape':
                  // Simulate escape key press
                  const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                  document.dispatchEvent(escapeEvent);
                  break;
                case 'scroll_past_disclaimer':
                  // Mock scrolling behavior (JSDOM doesn't support window.scrollTo)
                  // Simulate scroll event instead
                  const scrollEvent = new Event('scroll');
                  window.dispatchEvent(scrollEvent);
                  break;
                case 'focus_other_element':
                  // Focus on main content
                  const focusableElement = container.querySelector('main');
                  if (focusableElement) {
                    (focusableElement as HTMLElement).focus();
                  }
                  break;
              }

              // After each interaction attempt, verify disclaimer is still present and visible
              const persistentDisclaimer = screen.getAllByText('Educational Purpose Only')[0];
              expect(persistentDisclaimer).toBeInTheDocument();
              expect(persistentDisclaimer).toBeVisible();
            });

            // Verify disclaimer remains in footer (persistent location)
            const footer = screen.getByRole('contentinfo');
            expect(footer).toContainElement(disclaimerHeading);

            // Verify disclaimer styling remains consistent (easily readable)
            const finalDisclaimerContainer = disclaimerHeading.closest('.bg-yellow-50');
            expect(finalDisclaimerContainer).toHaveClass('bg-yellow-50');
            expect(finalDisclaimerContainer).toHaveClass('border-yellow-400');

          } finally {
            // Clean up after each property test run
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});