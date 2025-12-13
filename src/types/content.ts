/**
 * TypeScript interfaces for healthcare standards content management
 * Supports structured content with frontmatter metadata
 */

export type StandardCategory = 'messaging' | 'imaging' | 'terminology' | 'security';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Frontmatter metadata structure for content files
 */
export interface ContentMetadata {
  title: string;
  standard: string;
  version?: string;
  category: StandardCategory;
  difficulty: DifficultyLevel;
  lastUpdated: string; // ISO date string
  tags: string[];
  officialSpec: string; // URL to official specification
  description?: string;
  author?: string;
}

/**
 * Code example with syntax highlighting support
 */
export interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  description?: string;
  filename?: string;
}

/**
 * Reference to diagrams and visual content
 */
export interface DiagramReference {
  id: string;
  title: string;
  type: 'image' | 'mermaid' | 'svg';
  source: string; // URL or inline content
  altText: string;
  caption?: string;
}

/**
 * Hierarchical content section structure
 */
export interface ContentSection {
  id: string;
  title: string;
  content: string; // Markdown content
  examples?: CodeExample[];
  diagrams?: DiagramReference[];
  subsections?: ContentSection[];
  order?: number; // For explicit ordering
}

/**
 * Main healthcare standard content structure
 */
export interface HealthcareStandard {
  id: string;
  name: string;
  version: string;
  description: string;
  category: StandardCategory;
  content: ContentSection[];
  lastUpdated: Date;
  officialUrl: string;
  metadata: ContentMetadata;
  slug: string; // URL-friendly identifier
}

/**
 * Parsed content file structure
 */
export interface ParsedContent {
  metadata: ContentMetadata;
  content: string;
  sections: ContentSection[];
  rawContent: string;
}

/**
 * Content validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

/**
 * Content file reference for build system
 */
export interface ContentFile {
  path: string;
  slug: string;
  metadata: ContentMetadata;
  lastModified: Date;
}