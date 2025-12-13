/**
 * Build script to generate search index from content files
 * This script runs during the build process to create a static search index
 */

// Use dynamic import for ES modules
async function main() {
  try {
    console.log('Starting search index generation...');
    
    // Dynamic import of the TypeScript module
    const { generateSearchIndex } = await import('../src/utils/buildSearchIndex.js');
    await generateSearchIndex();
    
    console.log('Search index generation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Search index generation failed:', error);
    process.exit(1);
  }
}

main();