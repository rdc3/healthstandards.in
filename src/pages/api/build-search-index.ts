/**
 * API route to build search index
 * This can be called during build or manually to regenerate the search index
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { generateSearchIndex } from '../../utils/buildSearchIndex';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Building search index via API...');
    await generateSearchIndex();
    
    res.status(200).json({ 
      success: true, 
      message: 'Search index built successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error building search index:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}