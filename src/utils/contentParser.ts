/**
 * Markdown content parser and processor for healthcare standards content
 * Supports frontmatter parsing, content structure validation, and code examples
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { ContentMetadata, ParsedContent, ContentSection, CodeExample, DiagramReference, ValidationResult } from '../types/content';
import { validateContent } from './contentValidation';

/**
 * Reads and parses markdown file from filesystem
 */
export async function getContentByPath(filePath: string): Promise<ParsedContent> {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  return parseMarkdownContent(fileContent);
}

/**
 * Parses markdown file with frontmatter
 */
export async function parseMarkdownContent(markdownContent: string): Promise<ParsedContent> {
  // Parse frontmatter and content
  const { data, content } = matter(markdownContent);
  
  // Validate and cast metadata
  const metadata = data as ContentMetadata;
  
  // Convert markdown to HTML using remark
  const htmlContent = await convertMarkdownToHtml(content);

  // Extract sections from content
  const sections = extractContentSections(content);

  return {
    metadata,
    content: htmlContent,
    sections,
    rawContent: content
  };
}

/**
 * Converts markdown to HTML using remark
 */
async function convertMarkdownToHtml(markdown: string): Promise<string> {
  // Process relative image paths to absolute paths
  const processedMarkdown = processImagePaths(markdown);
  
  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown support
    .use(remarkHtml, { sanitize: false }) // Allow HTML in markdown
    .process(processedMarkdown);
  
  return result.toString();
}

/**
 * Processes relative image paths in markdown to absolute paths
 */
function processImagePaths(markdown: string): string {
  // Replace relative image paths (./image.png) with absolute paths (/image.png)
  let processedMarkdown = markdown.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, '![$1](/$2)');
  
  // Also handle paths that might already be relative without ./
  // This ensures consistency for all image references
  processedMarkdown = processedMarkdown.replace(/!\[([^\]]*)\]\(([^/][^)]+\.(png|jpg|jpeg|gif|svg|webp))\)/gi, '![$1](/$2)');
  
  return processedMarkdown;
}

/**
 * Extracts structured sections from markdown content
 */
export function extractContentSections(content: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const lines = content.split('\n');
  
  let currentSection: Partial<ContentSection> | null = null;
  let currentContent: string[] = [];
  let sectionId = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for section headers (## or ###)
    const headerMatch = line.match(/^(#{2,3})\s+(.+)$/);
    
    if (headerMatch) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          id: currentSection.id!,
          title: currentSection.title!,
          content: currentContent.join('\n').trim(),
          examples: extractCodeExamples(currentContent.join('\n')),
          diagrams: extractDiagramReferences(currentContent.join('\n')),
          order: sections.length
        });
      }
      
      // Start new section
      sectionId++;
      currentSection = {
        id: `section-${sectionId}`,
        title: headerMatch[2] // Don't trim here to preserve original title
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  
  // Add final section
  if (currentSection) {
    sections.push({
      id: currentSection.id!,
      title: currentSection.title!,
      content: currentContent.join('\n').trim(),
      examples: extractCodeExamples(currentContent.join('\n')),
      diagrams: extractDiagramReferences(currentContent.join('\n')),
      order: sections.length
    });
  }

  return sections;
}

/**
 * Extracts code examples from markdown content
 */
export function extractCodeExamples(content: string): CodeExample[] {
  const examples: CodeExample[] = [];
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)\n```/g;
  let match;
  let exampleId = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    exampleId++;
    const language = match[1] || 'text';
    const code = match[2]; // Don't trim to preserve original code
    
    // Try to extract title from preceding comment or text
    const beforeCode = content.substring(0, match.index);
    const lines = beforeCode.split('\n');
    const lastLine = lines[lines.length - 1]?.trim();
    
    let title = `Code Example ${exampleId}`;
    if (lastLine && lastLine.length > 0 && !lastLine.startsWith('```')) {
      title = lastLine.replace(/^[#*\->\s]+/, '').trim() || title;
    }

    examples.push({
      id: `example-${exampleId}`,
      title,
      language,
      code,
      description: extractCodeDescription(content, match.index)
    });
  }

  return examples;
}

/**
 * Extracts diagram references from markdown content
 */
export function extractDiagramReferences(content: string): DiagramReference[] {
  const diagrams: DiagramReference[] = [];
  let diagramId = 0;

  // Extract image references
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    diagramId++;
    const altText = match[1] || `Diagram ${diagramId}`;
    const source = match[2];
    
    // Only add if source is a valid URL or path
    if (source && source.trim().length > 0) {
      diagrams.push({
        id: `diagram-${diagramId}`,
        title: altText,
        type: 'image',
        source,
        altText,
        caption: extractImageCaption(content, match.index)
      });
    }
  }

  // Extract Mermaid diagrams
  const mermaidRegex = /```mermaid\s*\n([\s\S]*?)\n```/g;
  while ((match = mermaidRegex.exec(content)) !== null) {
    diagramId++;
    const mermaidCode = match[1].trim();
    
    diagrams.push({
      id: `mermaid-${diagramId}`,
      title: `Mermaid Diagram ${diagramId}`,
      type: 'mermaid',
      source: mermaidCode,
      altText: `Mermaid diagram showing healthcare standard workflow`
    });
  }

  return diagrams;
}

/**
 * Validates parsed content structure
 */
export function validateParsedContent(parsedContent: ParsedContent): ValidationResult {
  return validateContent(parsedContent.metadata, parsedContent.rawContent);
}

/**
 * Processes multiple markdown files for batch processing
 */
export async function processMarkdownFiles(files: { path: string; content: string }[]): Promise<ParsedContent[]> {
  const results: ParsedContent[] = [];
  
  for (const file of files) {
    try {
      const parsed = await parseMarkdownContent(file.content);
      results.push(parsed);
    } catch (error) {
      console.error(`Error processing file ${file.path}:`, error);
      // Continue processing other files
    }
  }
  
  return results;
}

/**
 * Helper function to extract code description from surrounding context
 */
function extractCodeDescription(content: string, codeIndex: number): string | undefined {
  const beforeCode = content.substring(0, codeIndex);
  const lines = beforeCode.split('\n');
  
  // Look for description in the 2-3 lines before the code block
  for (let i = lines.length - 2; i >= Math.max(0, lines.length - 4); i--) {
    const line = lines[i]?.trim();
    if (line && line.length > 20 && !line.startsWith('#') && !line.startsWith('```')) {
      return line;
    }
  }
  
  return undefined;
}

/**
 * Helper function to extract image caption from surrounding context
 */
function extractImageCaption(content: string, imageIndex: number): string | undefined {
  const afterImage = content.substring(imageIndex);
  const lines = afterImage.split('\n');
  
  // Look for caption in the next line
  if (lines.length > 1) {
    const nextLine = lines[1]?.trim();
    if (nextLine && nextLine.startsWith('*') && nextLine.endsWith('*') && !nextLine.includes('![')) {
      return nextLine.slice(1, -1).trim();
    }
  }
  
  return undefined;
}

/**
 * Utility to create content slug from title
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Utility to extract table of contents from sections
 */
export function generateTableOfContents(sections: ContentSection[]): { id: string; title: string; level: number }[] {
  return sections.map(section => ({
    id: section.id,
    title: section.title,
    level: 2 // Assuming all sections are level 2 for now
  }));
}