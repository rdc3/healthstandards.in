import * as fc from 'fast-check';
import { parseMarkdownContent } from '../../src/utils/contentParser';
import { validateOfficialReferences } from '../../src/utils/contentValidation';

/**
 * **Feature: health-standards-website, Property 11: Official documentation references**
 * **Validates: Requirements 5.3**
 * 
 * Property: For any healthcare standards content page, it should include reminders 
 * to consult official standard documentation for implementation
 */
describe('Official Documentation References Property Tests', () => {
  
  // Simplified generator using predefined content with official references
  const healthcareContentWithReferencesGen = fc.oneof(
    fc.constant({
      markdown: `---
title: "HL7 FHIR Overview"
standard: "FHIR"
category: "messaging"
difficulty: "beginner"
lastUpdated: "2024-01-01"
tags: ["fhir", "api", "rest"]
officialSpec: "https://hl7.org/fhir/"
description: "Modern healthcare interoperability standard"
---

# HL7 FHIR Overview

**Educational Purpose Notice**: This content is for educational and reference purposes only.

## Introduction

FHIR is a modern healthcare interoperability standard.

## Implementation Guidance

For detailed information, refer to the official documentation.
Always consult the official standard documentation for production implementations.
This information should not be used for actual healthcare implementation without proper validation.

For complete specifications, visit: https://hl7.org/fhir/
`,
      hasAllReferences: true
    }),
    fc.constant({
      markdown: `---
title: "DICOM Standard"
standard: "DICOM"
category: "imaging"
difficulty: "intermediate"
lastUpdated: "2024-01-01"
tags: ["dicom", "imaging", "medical"]
officialSpec: "https://www.dicomstandard.org/"
description: "Medical imaging standard"
---

# DICOM Standard

**Educational Purpose Notice**: This content is for educational and reference purposes only.

## Overview

DICOM is the international standard for medical images.

## Implementation Notes

Always consult official standard documentation for production implementations.
For complete specifications, visit: https://www.dicomstandard.org/
`,
      hasAllReferences: true
    }),
    fc.constant({
      markdown: `---
title: "HL7 V2 Messages"
standard: "HL7"
category: "messaging"
difficulty: "beginner"
lastUpdated: "2024-01-01"
tags: ["hl7", "messaging", "v2"]
officialSpec: "https://www.hl7.org/"
description: "HL7 Version 2 messaging standard"
---

# HL7 V2 Messages

**Educational Purpose Notice**: This content is for educational and reference purposes only.

## Message Structure

HL7 V2 messages use pipe-delimited format.

## Official Resources

For implementation details, refer to the official specification: https://www.hl7.org/
`,
      hasAllReferences: true
    })
  );

  test('Property 11: Official documentation references - healthcare content should include reminders to consult official documentation', () => {
    fc.assert(
      fc.asyncProperty(
        healthcareContentWithReferencesGen,
        async (testData) => {
          // Parse the generated markdown content
          const parsedContent = await parseMarkdownContent(testData.markdown);
          
          // Requirement 5.3: Content should remind users to consult official standard documentation
          const content = parsedContent.rawContent.toLowerCase();
          const metadata = parsedContent.metadata;
          
          // Check for various forms of official documentation references
          const hasOfficialMention = content.includes('official') && 
            (content.includes('documentation') || 
             content.includes('specification') ||
             content.includes('standard'));
          
          const hasImplementationGuidance = content.includes('implementation') &&
            (content.includes('consult') || 
             content.includes('refer') ||
             content.includes('official'));
          
          const hasSpecificationUrl = content.includes(metadata.officialSpec.toLowerCase());
          
          const hasProductionWarning = content.includes('production') ||
            content.includes('actual healthcare') ||
            content.includes('implementation');
          
          // Validate using the validation utility
          const validationResult = validateOfficialReferences(parsedContent.rawContent, metadata);
          
          // The content should have at least some form of official reference
          // This is a property that should hold for all healthcare standards content
          const hasAnyOfficialReference = hasOfficialMention || 
            hasImplementationGuidance || 
            hasSpecificationUrl || 
            hasProductionWarning;
          
          // For healthcare standards content with references, we expect official references
          if (testData.hasAllReferences) {
            expect(hasAnyOfficialReference).toBe(true);
          } else {
            // Even without explicit references, the content should at least mention
            // that it's educational or reference the official spec URL
            const hasEducationalNotice = content.includes('educational');
            const hasOfficialSpecUrl = content.includes(metadata.officialSpec.toLowerCase());
            expect(hasEducationalNotice || hasOfficialSpecUrl || hasAnyOfficialReference).toBe(true);
          }
          
          // If the content explicitly includes official references, validate them
          if (testData.hasAllReferences) {
            expect(hasOfficialMention).toBe(true);
            expect(hasImplementationGuidance).toBe(true);
            expect(hasSpecificationUrl).toBe(true);
          }
          
          // Verify that the official specification URL is valid and accessible
          expect(metadata.officialSpec).toBeDefined();
          expect(() => new URL(metadata.officialSpec)).not.toThrow();
          
          // Verify the URL is from a recognized healthcare standards organization
          const recognizedDomains = [
            'hl7.org',
            'dicomstandard.org',
            'ihe.net',
            'snomed.org',
            'nema.org',
            'who.int',
            'iso.org'
          ];
          
          const urlDomain = new URL(metadata.officialSpec).hostname.toLowerCase();
          const isRecognizedDomain = recognizedDomains.some(domain => 
            urlDomain.includes(domain)
          );
          
          expect(isRecognizedDomain).toBe(true);
          
          // The validation should not have critical errors
          expect(validationResult.isValid).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 11: Official documentation URL validation - all official specification URLs should be valid and from recognized sources', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('https://hl7.org/fhir/'),
          fc.constant('https://www.dicomstandard.org/'),
          fc.constant('https://www.hl7.org/'),
          fc.constant('https://www.ihe.net/'),
          fc.constant('https://www.snomed.org/'),
          fc.constant('https://www.nema.org/'),
          fc.constant('https://www.iso.org/'),
          fc.constant('https://www.who.int/')
        ),
        (officialUrl) => {
          // Verify URL is valid
          expect(() => new URL(officialUrl)).not.toThrow();
          
          // Verify URL uses HTTPS for security
          const url = new URL(officialUrl);
          expect(url.protocol).toBe('https:');
          
          // Verify URL is from a recognized healthcare standards organization
          const recognizedDomains = [
            'hl7.org',
            'dicomstandard.org',
            'ihe.net',
            'snomed.org',
            'nema.org',
            'who.int',
            'iso.org'
          ];
          
          const isRecognizedDomain = recognizedDomains.some(domain => 
            url.hostname.toLowerCase().includes(domain)
          );
          
          expect(isRecognizedDomain).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 11: Content validation for official references - content with official references should pass validation', () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          officialSpec: fc.oneof(
            fc.constant('https://hl7.org/fhir/'),
            fc.constant('https://www.dicomstandard.org/'),
            fc.constant('https://www.hl7.org/')
          ),
          contentVariations: fc.oneof(
            fc.constant('For implementation details, refer to the official specification documentation.'),
            fc.constant('Always consult official standard documentation for production implementations.'),
            fc.constant('This information should not be used for actual healthcare implementation without consulting official sources.'),
            fc.constant('For complete specifications and implementation guidance, visit the official documentation.'),
            fc.constant('Refer to official documentation before implementing in production healthcare systems.')
          )
        }),
        async (testData) => {
          const content = `${testData.contentVariations}\n\nOfficial specification: ${testData.officialSpec}`;
          const metadata = {
            title: 'Test Standard',
            standard: 'TEST',
            category: 'messaging' as const,
            difficulty: 'beginner' as const,
            lastUpdated: '2024-01-01',
            tags: ['test'],
            officialSpec: testData.officialSpec,
            description: 'Test description'
          };
          
          // Validate the content with official references
          const validationResult = validateOfficialReferences(content, metadata);
          
          // Content with proper official references should pass validation
          expect(validationResult.isValid).toBe(true);
          
          // Should have minimal or no warnings since it includes official references
          expect(validationResult.errors.length).toBe(0);
          
          // Verify the content includes the expected reference patterns
          const lowerContent = content.toLowerCase();
          const hasOfficialReference = lowerContent.includes('official') && 
            (lowerContent.includes('documentation') || 
             lowerContent.includes('specification'));
          
          expect(hasOfficialReference).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 11: Missing official references detection - content without official references should be flagged', () => {
    fc.assert(
      fc.property(
        fc.record({
          content: fc.string({ minLength: 100, maxLength: 500 }).filter(s => 
            !s.toLowerCase().includes('official') &&
            !s.toLowerCase().includes('specification') &&
            !s.toLowerCase().includes('documentation') &&
            !s.toLowerCase().includes('consult') &&
            !s.toLowerCase().includes('refer')
          ),
          officialSpec: fc.oneof(
            fc.constant('https://hl7.org/fhir/'),
            fc.constant('https://www.dicomstandard.org/')
          )
        }),
        (testData) => {
          const metadata = {
            title: 'Test Standard',
            standard: 'TEST',
            category: 'messaging' as const,
            difficulty: 'beginner' as const,
            lastUpdated: '2024-01-01',
            tags: ['test'],
            officialSpec: testData.officialSpec,
            description: 'Test description'
          };
          
          // Validate content that lacks official references
          const validationResult = validateOfficialReferences(testData.content, metadata);
          
          // Content should still be valid (no errors) but should have warnings
          expect(validationResult.isValid).toBe(true);
          expect(validationResult.warnings.length).toBeGreaterThan(0);
          
          // Should specifically warn about missing official references
          const hasOfficialReferenceWarning = validationResult.warnings.some(warning =>
            warning.message.toLowerCase().includes('official') &&
            warning.message.toLowerCase().includes('documentation')
          );
          
          expect(hasOfficialReferenceWarning).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});