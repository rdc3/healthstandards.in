/**
 * Client-side search index utilities using Fuse.js
 * Builds search index from healthcare standards content for fast client-side search
 */

import Fuse from 'fuse.js';
import { ContentMetadata, ParsedContent, ContentSection } from '../types/content';

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  standard: string;
  category: string;
  url: string;
  tags: string[];
  description?: string;
  section?: string;
  type: 'page' | 'section';
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  relevanceScore: number;
  highlightedText: string[];
  standard: string;
  category: string;
  type: 'page' | 'section';
}

export interface SearchIndex {
  documents: SearchDocument[];
  fuse: Fuse<SearchDocument>;
}

/**
 * Fuse.js configuration for healthcare standards search
 */
const FUSE_OPTIONS: Fuse.IFuseOptions<SearchDocument> = {
  keys: [
    { name: 'title', weight: 0.3 },
    { name: 'content', weight: 0.4 },
    { name: 'tags', weight: 0.2 },
    { name: 'description', weight: 0.1 }
  ],
  threshold: 0.4, // Lower = more strict matching
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true
};

/**
 * Creates search documents from parsed content
 */
export function createSearchDocuments(parsedContents: ParsedContent[]): SearchDocument[] {
  const documents: SearchDocument[] = [];

  for (const content of parsedContents) {
    const { metadata, rawContent, sections } = content;
    
    // Create main page document
    const pageDoc: SearchDocument = {
      id: `page-${metadata.standard?.toLowerCase() || 'unknown'}`,
      title: metadata.title || 'Untitled',
      content: stripMarkdown(rawContent),
      standard: metadata.standard || 'Unknown',
      category: metadata.category || 'general',
      url: generateUrl(metadata),
      tags: metadata.tags || [],
      description: metadata.description,
      type: 'page'
    };
    documents.push(pageDoc);

    // Create section documents for better granular search
    if (sections && sections.length > 0) {
      for (const section of sections) {
        const sectionDoc: SearchDocument = {
          id: `section-${metadata.standard?.toLowerCase() || 'unknown'}-${section.id}`,
          title: `${metadata.title} - ${section.title}`,
          content: stripMarkdown(section.content),
          standard: metadata.standard || 'Unknown',
          category: metadata.category || 'general',
          url: `${generateUrl(metadata)}#${section.id}`,
          tags: metadata.tags || [],
          description: metadata.description,
          section: section.title,
          type: 'section'
        };
        documents.push(sectionDoc);
      }
    }
  }

  return documents;
}

/**
 * Builds the search index from documents
 */
export function buildSearchIndex(documents: SearchDocument[]): SearchIndex {
  const fuse = new Fuse(documents, FUSE_OPTIONS);
  
  return {
    documents,
    fuse
  };
}

/**
 * Performs search using the index
 */
export function performSearch(
  searchIndex: SearchIndex, 
  query: string, 
  options?: {
    limit?: number;
    standardFilter?: string;
    categoryFilter?: string;
  }
): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const { limit = 10, standardFilter, categoryFilter } = options || {};
  
  // Perform the search
  const fuseResults = searchIndex.fuse.search(query, { limit: limit * 2 }); // Get more results for filtering
  
  // Convert Fuse results to SearchResult format
  let results: SearchResult[] = fuseResults.map(result => {
    const { item, score = 1, matches = [] } = result;
    
    // Extract highlighted text from matches
    const highlightedText = extractHighlightedText(matches);
    
    // Generate excerpt from content
    const excerpt = generateExcerpt(item.content, query);
    
    return {
      id: item.id,
      title: item.title,
      excerpt,
      url: item.url,
      relevanceScore: 1 - score, // Invert score so higher is better
      highlightedText,
      standard: item.standard,
      category: item.category,
      type: item.type
    };
  });

  // Apply filters
  if (standardFilter) {
    results = results.filter(result => 
      result.standard.toLowerCase() === standardFilter.toLowerCase()
    );
  }
  
  if (categoryFilter) {
    results = results.filter(result => 
      result.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  // Return limited results
  return results.slice(0, limit);
}

/**
 * Gets search suggestions based on partial input
 */
export function getSearchSuggestions(
  searchIndex: SearchIndex, 
  partialQuery: string,
  limit: number = 5
): string[] {
  if (!partialQuery || partialQuery.trim().length < 2) {
    return [];
  }

  // Search for matches and extract unique terms
  const results = searchIndex.fuse.search(partialQuery, { limit: limit * 3 });
  const suggestions = new Set<string>();

  for (const result of results) {
    const { item } = result;
    
    // Add title words that start with the query
    const titleWords = item.title.toLowerCase().split(/\s+/);
    for (const word of titleWords) {
      if (word.startsWith(partialQuery.toLowerCase()) && word.length > partialQuery.length) {
        suggestions.add(word);
      }
    }
    
    // Add tags that start with the query
    for (const tag of item.tags) {
      if (tag.toLowerCase().startsWith(partialQuery.toLowerCase()) && tag.length > partialQuery.length) {
        suggestions.add(tag);
      }
    }
    
    if (suggestions.size >= limit) break;
  }

  return Array.from(suggestions).slice(0, limit);
}

/**
 * Strips markdown formatting from text
 */
function stripMarkdown(text: string): string {
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates URL from content metadata
 */
function generateUrl(metadata: ContentMetadata): string {
  const standard = metadata.standard?.toLowerCase() || 'unknown';
  return `/standards/${standard}`;
}

/**
 * Extracts highlighted text from Fuse.js matches
 */
function extractHighlightedText(matches: readonly Fuse.FuseResultMatch[]): string[] {
  const highlighted: string[] = [];
  
  for (const match of matches) {
    if (match.indices && match.value) {
      for (const [start, end] of match.indices) {
        const text = match.value.substring(Math.max(0, start - 20), Math.min(match.value.length, end + 20));
        highlighted.push(text);
      }
    }
  }
  
  return highlighted.slice(0, 3); // Limit to 3 highlights
}

/**
 * Generates excerpt from content around search query
 */
function generateExcerpt(content: string, query: string, maxLength: number = 200): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  const index = lowerContent.indexOf(lowerQuery);
  if (index === -1) {
    // If query not found, return beginning of content
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
  }
  
  // Extract text around the query
  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 50);
  
  let excerpt = content.substring(start, end);
  
  // Add ellipsis if needed
  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';
  
  // Truncate if still too long
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength) + '...';
  }
  
  return excerpt;
}

/**
 * Builds search index from content directory during build process
 */
export async function buildSearchIndexFromContent(): Promise<SearchIndex> {
  // This would typically be called during the build process
  // For now, we'll create a placeholder that can be populated with actual content
  const documents: SearchDocument[] = [];
  
  // In a real implementation, this would:
  // 1. Read all content files from the content directory
  // 2. Parse each file using contentParser
  // 3. Create search documents
  // 4. Build and return the index
  
  return buildSearchIndex(documents);
}