#!/usr/bin/env ts-node

/**
 * Standalone script to generate search index
 * Run with: npx ts-node scripts/generate-search-index.ts
 */

import { generateSearchIndex } from '../src/utils/buildSearchIndex';

async function main() {
  try {
    console.log('🔍 Starting search index generation...');
    await generateSearchIndex();
    console.log('✅ Search index generation completed successfully');
  } catch (error) {
    console.error('❌ Search index generation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();