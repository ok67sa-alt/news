import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { parseCookies, verifyToken } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).json({ error: 'Method Not Allowed' });
  }

  // Authentication check
  const cookies = parseCookies(req as any);
  const token = cookies['st_token'];
  const payload = token ? verifyToken(token) : null;
  
  if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'EDITOR')) {
    return res.status(401).json({ error: 'Unauthorized. Admin or Editor role required.' });
  }

  const { id, action = 'publish' } = req.body || {};
  
  if (!id) {
    return res.status(400).json({ error: 'Missing article id' });
  }

  const articleId = Number(id);
  if (isNaN(articleId)) {
    return res.status(400).json({ error: 'Invalid article id format' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Check if article exists
    const existing = await prisma.article.findUnique({ 
      where: { id: articleId } 
    });

    if (!existing) {
      return res.status(404).json({ error: 'Article not found' });
    }

    let updateData: any = {};

    switch (action) {
      case 'publish':
        updateData = { 
          status: 'PUBLISHED', 
          publishedAt: existing.publishedAt || new Date() 
        };
        break;

      case 'unpublish':
        updateData = { 
          status: 'DRAFT', 
          publishedAt: null 
        };
        break;

      case 'toggle-featured':
        updateData = { 
          featured: !existing.featured 
        };
        break;

      case 'toggle-breaking':
        updateData = { 
          breaking: !existing.breaking 
        };
        break;

      case 'set-breaking':
        // Set as breaking news and publish if not already
        updateData = { 
          breaking: true,
          status: 'PUBLISHED',
          publishedAt: existing.publishedAt || new Date()
        };
        break;

      case 'unset-breaking':
        updateData = { 
          breaking: false 
        };
        break;

      default:
        return res.status(400).json({ 
          error: 'Invalid action. Allowed: publish, unpublish, toggle-featured, toggle-breaking, set-breaking, unset-breaking' 
        });
    }

    const updated = await prisma.article.update({ 
      where: { id: articleId }, 
      data: updateData,
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    console.log(`Article ${articleId} - Action: ${action} - Success`);
    return res.status(200).json(updated);
  } catch (err: any) {
    console.error('Publish API error:', err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to update article', 
      details: err.message 
    });
  }
}
