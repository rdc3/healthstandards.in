/**
 * Search input validation utilities
 * Validates search queries and provides helpful error messages
 */

export interface SearchValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
  sanitizedQuery?: string;
}

/**
 * Validates search query input
 */
export function validateSearchQuery(query: string): SearchValidationResult {
  // Handle null/undefined
  if (!query) {
    return {
      isValid: false,
      error: 'Search query is required',
      suggestion: 'Enter a search term to find healthcare standards information'
    };
  }

  // Convert to string and trim
  const trimmedQuery = String(query).trim();

  // Check for empty or whitespace-only queries
  if (trimmedQuery.length === 0) {
    return {
      isValid: false,
      error: 'Search query cannot be empty',
      suggestion: 'Try searching for "HL7", "FHIR", "DICOM", or "interoperability"'
    };
  }

  // Check minimum length
  if (trimmedQuery.length < 2) {
    return {
      isValid: false,
      error: 'Search query must be at least 2 characters long',
      suggestion: 'Enter a longer search term for better results'
    };
  }

  // Check maximum length
  if (trimmedQuery.length > 100) {
    return {
      isValid: false,
      error: 'Search query is too long (maximum 100 characters)',
      suggestion: 'Try a shorter, more specific search term',
      sanitizedQuery: trimmedQuery.substring(0, 100)
    };
  }

  // Check for potentially problematic characters
  const problematicChars = /[<>{}[\]\\]/g;
  if (problematicChars.test(trimmedQuery)) {
    const sanitized = trimmedQuery.replace(problematicChars, '');
    return {
      isValid: true,
      sanitizedQuery: sanitized,
      suggestion: 'Special characters have been removed from your search'
    };
  }

  // Check for excessive special characters
  const specialCharCount = (trimmedQuery.match(/[^a-zA-Z0-9\s\-_.]/g) || []).length;
  if (specialCharCount > trimmedQuery.length * 0.3) {
    return {
      isValid: false,
      error: 'Search query contains too many special characters',
      suggestion: 'Use letters, numbers, and common punctuation for better results'
    };
  }

  // Valid query
  return {
    isValid: true,
    sanitizedQuery: trimmedQuery
  };
}

/**
 * Sanitizes search query by removing or replacing problematic characters
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  
  return String(query)
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove problematic characters
    .replace(/[<>{}[\]\\]/g, '')
    // Limit length
    .substring(0, 100)
    .trim();
}

/**
 * Generates search suggestions when no results are found
 */
export function generateNoResultsSuggestions(query: string): string[] {
  const suggestions: string[] = [];
  const lowerQuery = query.toLowerCase();

  // Common healthcare standards
  const standards = ['HL7', 'FHIR', 'DICOM', 'IHE', 'SNOMED', 'LOINC'];
  
  // Suggest similar standards
  for (const standard of standards) {
    if (!lowerQuery.includes(standard.toLowerCase())) {
      suggestions.push(standard);
    }
  }

  // Common healthcare concepts
  const concepts = [
    'interoperability',
    'patient data',
    'medical records',
    'healthcare messaging',
    'medical imaging',
    'clinical data exchange'
  ];

  // Suggest related concepts
  for (const concept of concepts) {
    if (!lowerQuery.includes(concept.toLowerCase()) && suggestions.length < 6) {
      suggestions.push(concept);
    }
  }

  // If query seems to be about a specific topic, suggest related terms
  if (lowerQuery.includes('image') || lowerQuery.includes('picture')) {
    suggestions.unshift('DICOM', 'medical imaging', 'radiology');
  } else if (lowerQuery.includes('message') || lowerQuery.includes('data')) {
    suggestions.unshift('HL7', 'FHIR', 'healthcare messaging');
  } else if (lowerQuery.includes('api') || lowerQuery.includes('rest')) {
    suggestions.unshift('FHIR', 'REST API', 'healthcare API');
  }

  // Remove duplicates and limit to 5 suggestions
  return [...new Set(suggestions)].slice(0, 5);
}

/**
 * Checks if a query might be a typo and suggests corrections
 */
export function suggestQueryCorrections(query: string): string[] {
  const corrections: string[] = [];
  const lowerQuery = query.toLowerCase();

  // Common typos for healthcare standards
  const typoMap: Record<string, string> = {
    'hl7': 'HL7',
    'fhir': 'FHIR',
    'dicom': 'DICOM',
    'fhier': 'FHIR',
    'fhire': 'FHIR',
    'dicome': 'DICOM',
    'dicam': 'DICOM',
    'interop': 'interoperability',
    'interoperabilty': 'interoperability',
    'healthcar': 'healthcare',
    'medica': 'medical',
    'imagin': 'imaging',
    'messag': 'messaging'
  };

  // Check for exact matches
  if (typoMap[lowerQuery]) {
    corrections.push(typoMap[lowerQuery]);
  }

  // Check for partial matches
  for (const [typo, correction] of Object.entries(typoMap)) {
    if (lowerQuery.includes(typo) && !corrections.includes(correction)) {
      corrections.push(correction);
    }
  }

  return corrections.slice(0, 3);
}

/**
 * Validates search filters
 */
export function validateSearchFilters(filters: {
  standard?: string;
  category?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const validStandards = ['HL7', 'FHIR', 'DICOM', 'IHE', 'SNOMED', 'LOINC'];
  const validCategories = ['messaging', 'imaging', 'terminology', 'security', 'workflow'];

  if (filters.standard && !validStandards.includes(filters.standard)) {
    errors.push(`Invalid standard: ${filters.standard}`);
  }

  if (filters.category && !validCategories.includes(filters.category)) {
    errors.push(`Invalid category: ${filters.category}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Rate limiting for search queries
 */
class SearchRateLimit {
  private queries: number[] = [];
  private readonly maxQueries: number;
  private readonly timeWindow: number;

  constructor(maxQueries: number = 10, timeWindowMs: number = 60000) {
    this.maxQueries = maxQueries;
    this.timeWindow = timeWindowMs;
  }

  canSearch(): boolean {
    const now = Date.now();
    
    // Remove old queries outside the time window
    this.queries = this.queries.filter(time => now - time < this.timeWindow);
    
    // Check if under the limit
    return this.queries.length < this.maxQueries;
  }

  recordSearch(): void {
    this.queries.push(Date.now());
  }

  getTimeUntilReset(): number {
    if (this.queries.length === 0) return 0;
    
    const oldestQuery = Math.min(...this.queries);
    const timeUntilReset = this.timeWindow - (Date.now() - oldestQuery);
    
    return Math.max(0, timeUntilReset);
  }
}

// Global rate limiter instance
export const searchRateLimit = new SearchRateLimit();