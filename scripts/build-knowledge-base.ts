#!/usr/bin/env node
/**
 * Build the vector index from the markdown knowledge base.
 *
 * Used by:
 * - local maintenance: npm run build:kb
 * - Vercel build: npm run vercel-build
 */

import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

console.log('========================================');
console.log('  Knowledge base index builder');
console.log('========================================\n');
console.log('Environment check:');
console.log('  GLM_API_KEY:', process.env.GLM_API_KEY ? 'set' : 'missing');
console.log('  ZHIPU_API_KEY:', process.env.ZHIPU_API_KEY ? 'set' : 'missing');
console.log('');

if (!process.env.GLM_API_KEY && !process.env.ZHIPU_API_KEY) {
  console.error('Error: API key is not configured.');
  process.exit(1);
}

const { ragService } = await import('../utils/ragService.js');

try {
  await ragService.buildIndex();
  console.log('\n========================================');
  console.log('  Vector index build complete');
  console.log('========================================');
  console.log('\nOutput: public/vector-index.json');
} catch (error: any) {
  console.error('\nBuild failed:', error?.message || error);

  if (fs.existsSync('public/vector-index.json')) {
    console.warn('Existing vector index found; continuing with the committed fallback.');
    process.exit(0);
  }

  process.exit(1);
}
