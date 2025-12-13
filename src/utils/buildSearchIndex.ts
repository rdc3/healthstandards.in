/**
 * Build-time utility to generate search index from content files
 * This runs during the build process to create a static search index
 */

import fs from 'fs';
import path from 'path';
import { parseMarkdownContent } from './contentParser';
import { createSearchDocuments, buildSearchIndex, SearchIndex } from './searchIndex';
import { ParsedContent } from '../types/content';

/**
 * Recursively finds all markdown files in a directory
 */
function findMarkdownFiles(dir: string, files: string[] = []): string[] {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Builds search index from all content files
 */
export async function buildSearchIndexFromFiles(): Promise<SearchIndex> {
  const contentDir = path.join(process.cwd(), 'content');
  
  if (!fs.existsSync(contentDir)) {
    console.warn('Content directory not found, creating empty search index');
    return buildSearchIndex([]);
  }
  
  // Find all markdown files
  const markdownFiles = findMarkdownFiles(contentDir);
  console.log(`Found ${markdownFiles.length} content files`);
  
  // Parse all content files
  const parsedContents: ParsedContent[] = [];
  
  for (const filePath of markdownFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = await parseMarkdownContent(fileContent);
      parsedContents.push(parsed);
      console.log(`Parsed: ${parsed.metadata.title || filePath}`);
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      // Continue with other files
    }
  }
  
  // Create search documents
  const searchDocuments = createSearchDocuments(parsedContents);
  console.log(`Created ${searchDocuments.length} search documents`);
  
  // Build and return search index
  const searchIndex = buildSearchIndex(searchDocuments);
  console.log('Search index built successfully');
  
  return searchIndex;
}

/**
 * Saves search index to a JSON file for client-side use
 */
export async function saveSearchIndexToFile(searchIndex: SearchIndex, outputPath: string): Promise<void> {
  // We only save the documents, not the Fuse instance
  const indexData = {
    documents: searchIndex.documents,
    timestamp: new Date().toISOString()
  };
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write index to file
  fs.writeFileSync(outputPath, JSON.stringify(indexData, null, 2));
  console.log(`Search index saved to ${outputPath}`);
}

/**
 * Loads search index from JSON file
 */
export async function loadSearchIndexFromFile(filePath: string): Promise<SearchIndex | null> {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Search index file not found: ${filePath}`);
      return null;
    }
    
    const indexData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!indexData.documents || !Array.isArray(indexData.documents)) {
      console.error('Invalid search index format');
      return null;
    }
    
    // Rebuild Fuse index from documents
    const searchIndex = buildSearchIndex(indexData.documents);
    console.log(`Loaded search index with ${indexData.documents.length} documents`);
    
    return searchIndex;
  } catch (error) {
    console.error('Error loading search index:', error);
    return null;
  }
}

/**
 * Main function to build and save search index
 * This would typically be called during the build process
 */
export async function generateSearchIndex(): Promise<void> {
  try {
    console.log('Building search index...');
    
    // Build index from content files
    const searchIndex = await buildSearchIndexFromFiles();
    
    // Save to public directory for client-side access
    const outputPath = path.join(process.cwd(), 'public', 'search-index.json');
    await saveSearchIndexToFile(searchIndex, outputPath);
    
    console.log('Search index generation complete');
  } catch (error) {
    console.error('Error generating search index:', error);
    throw error;
  }
}