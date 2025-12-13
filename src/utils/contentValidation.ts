/**
 * Content validation utilities for healthcare standards content
 */

import { ContentMetadata, ValidationResult, ValidationError, ValidationWarning, StandardCategory, DifficultyLevel } from '../types/content';

const VALID_CATEGORIES: StandardCategory[] = ['messaging', 'imaging', 'terminology', 'security'];
const VALID_DIFFICULTIES: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

/**
 * Validates content metadata structure and required fields
 */
export function validateContentMetadata(metadata: Partial<ContentMetadata>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required field validation
  if (!metadata.title || metadata.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Title is required and cannot be empty',
      severity: 'error'
    });
  }

  if (!metadata.standard || metadata.standard.trim().length === 0) {
    errors.push({
      field: 'standard',
      message: 'Standard name is required',
      severity: 'error'
    });
  }

  if (!metadata.category) {
    errors.push({
      field: 'category',
      message: 'Category is required',
      severity: 'error'
    });
  } else if (!VALID_CATEGORIES.includes(metadata.category)) {
    errors.push({
      field: 'category',
      message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      severity: 'error'
    });
  }

  if (!metadata.difficulty) {
    errors.push({
      field: 'difficulty',
      message: 'Difficulty level is required',
      severity: 'error'
    });
  } else if (!VALID_DIFFICULTIES.includes(metadata.difficulty)) {
    errors.push({
      field: 'difficulty',
      message: `Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`,
      severity: 'error'
    });
  }

  if (!metadata.officialSpec) {
    errors.push({
      field: 'officialSpec',
      message: 'Official specification URL is required',
      severity: 'error'
    });
  } else if (!isValidUrl(metadata.officialSpec)) {
    errors.push({
      field: 'officialSpec',
      message: 'Official specification must be a valid URL',
      severity: 'error'
    });
  }

  if (!metadata.lastUpdated) {
    warnings.push({
      field: 'lastUpdated',
      message: 'Last updated date is recommended',
      suggestion: 'Add lastUpdated field with ISO date string'
    });
  } else if (!isValidISODate(metadata.lastUpdated)) {
    errors.push({
      field: 'lastUpdated',
      message: 'Last updated must be a valid ISO date string (YYYY-MM-DD)',
      severity: 'error'
    });
  }

  // Tags validation
  if (!metadata.tags || !Array.isArray(metadata.tags)) {
    warnings.push({
      field: 'tags',
      message: 'Tags array is recommended for better searchability',
      suggestion: 'Add tags array with relevant keywords'
    });
  } else if (metadata.tags.length === 0) {
    warnings.push({
      field: 'tags',
      message: 'At least one tag is recommended',
      suggestion: 'Add relevant tags for better content discovery'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates that content includes official documentation references
 */
export function validateOfficialReferences(content: string, metadata: ContentMetadata): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check if content mentions official documentation
  const hasOfficialReference = content.toLowerCase().includes('official') && 
    (content.toLowerCase().includes('documentation') || 
     content.toLowerCase().includes('specification') ||
     content.toLowerCase().includes('standard'));

  if (!hasOfficialReference) {
    warnings.push({
      field: 'content',
      message: 'Content should reference official documentation',
      suggestion: 'Add references to official standard documentation for implementation guidance'
    });
  }

  // Check if official URL is mentioned in content
  if (metadata.officialSpec && !content.includes(metadata.officialSpec)) {
    warnings.push({
      field: 'content',
      message: 'Consider including the official specification URL in the content',
      suggestion: `Add reference to ${metadata.officialSpec} in the content`
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates content structure for educational purposes
 */
export function validateEducationalContent(content: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check for educational disclaimer language
  const hasEducationalDisclaimer = content.toLowerCase().includes('educational') ||
    content.toLowerCase().includes('learning') ||
    content.toLowerCase().includes('reference');

  if (!hasEducationalDisclaimer) {
    warnings.push({
      field: 'content',
      message: 'Content should emphasize educational purpose',
      suggestion: 'Add language indicating this is for educational/reference purposes'
    });
  }

  // Check content length - should be substantial for educational value
  if (content.trim().length < 100) {
    warnings.push({
      field: 'content',
      message: 'Content appears to be very short',
      suggestion: 'Consider adding more detailed explanations and examples'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Helper function to validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Helper function to validate ISO date format
 */
function isValidISODate(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Comprehensive content validation combining all checks
 */
export function validateContent(metadata: Partial<ContentMetadata>, content: string): ValidationResult {
  const metadataValidation = validateContentMetadata(metadata);
  const referencesValidation = validateOfficialReferences(content, metadata as ContentMetadata);
  const educationalValidation = validateEducationalContent(content);

  return {
    isValid: metadataValidation.isValid && referencesValidation.isValid && educationalValidation.isValid,
    errors: [
      ...metadataValidation.errors,
      ...referencesValidation.errors,
      ...educationalValidation.errors
    ],
    warnings: [
      ...metadataValidation.warnings,
      ...referencesValidation.warnings,
      ...educationalValidation.warnings
    ]
  };
}