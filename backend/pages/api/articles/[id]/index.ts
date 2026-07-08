import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import prisma from '../../../../lib/prisma';
import { cleanArticle } from '../../../../lib/cleanApiResponse';

const DATA_PATH = path.resolve(process.cwd(), '..', '..', 'src', 'data', 'news.json');

// Helper function to generate slug from title
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to estimate read time
function estimateReadTime(content: string): string {
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

// Helper function to sanitize update data
function sanitizeUpdateData(payload: any) {
  const data: any = {};

  // Only include fields that are present in the payload
  if (payload.title !== undefined) {
    data.title = payload.title;
    // Auto-update slug if title changed and no explicit slug provided
    if (payload.slug === undefined) {
      data.slug = generateSlug(payload.title);
    }
  }

  if (payload.slug !== undefined) {
    data.slug = payload.slug || generateSlug(payload.title || `article-${Date.now()}`);
  }

  if (payload.excerpt !== undefined) data.excerpt = payload.excerpt;
  if (payload.content !== undefined) {
    data.content = payload.content;
    // Auto-update readTime when content changes
    data.readTime = estimateReadTime(payload.content);
  }

  if (payload.readTime !== undefined) data.readTime = payload.readTime;
  if (payload.image !== undefined) data.image = payload.image;
  if (payload.videoUrl !== undefined) data.videoUrl = payload.videoUrl || null;
  if (payload.hero !== undefined) data.hero = Boolean(payload.hero);
  if (payload.featured !== undefined) data.featured = Boolean(payload.featured);
  if (payload.breaking !== undefined) data.breaking = Boolean(payload.breaking);
  if (payload.status !== undefined) data.status = payload.status;

  // Handle categoryId
  if (payload.categoryId !== undefined) {
    if (payload.categoryId === null || payload.categoryId === '') {
      data.categoryId = null;
    } else {
      const catId = Number(payload.categoryId);
      if (!isNaN(catId) && catId > 0) {
        data.categoryId = catId;
      }
    }
  }

  // Handle authorId
  if (payload.authorId !== undefined) {
    if (payload.authorId === null || payload.authorId === '') {
      data.authorId = null;
    } else {
      const authId = Number(payload.authorId);
      if (!isNaN(authId) && authId > 0) {
        data.authorId = authId;
      }
    }
  }

  // Handle authorRole
  if (payload.authorRole !== undefined) {
    data.authorRole = payload.authorRole;
  }

  // Handle publishedAt
  if (payload.publishedAt !== undefined) {
    if (payload.publishedAt === null || payload.publishedAt === '') {
      data.publishedAt = null;
    } else {
      data.publishedAt = new Date(payload.publishedAt);
    }
  } else if (payload.status === 'PUBLISHED') {
    // Auto-set publishedAt when status changes to PUBLISHED
    data.publishedAt = new Date();
  } else if (payload.status === 'DRAFT' || payload.status === 'REVIEW') {
    // Clear publishedAt when status changes to DRAFT or REVIEW
    data.publishedAt = null;
  }

  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const nid = Number(id);

  if (isNaN(nid)) {
    return res.status(400).json({ error: 'Invalid id format' });
  }

  if (req.method === 'GET') {
    try {
      if (process.env.DATABASE_URL) {
        const article = await prisma.article.findUnique({ 
          where: { id: nid },
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
        if (!article) return res.status(404).json({ error: 'Article not found' });
        
        // Clean article to prevent React rendering errors
        const cleanedArticle = cleanArticle(article);
        return res.status(200).json(cleanedArticle);
      }

      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      const data = JSON.parse(raw);
      const article = data.find((a: any) => a.id === nid);
      if (!article) return res.status(404).json({ error: 'Article not found' });
      return res.status(200).json(article);
    } catch (err) {
      console.error('GET /api/articles/[id] error:', err);
      return res.status(500).json({ error: 'Failed to load article' });
    }
  }

  // Update article (admin)
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const payload = req.body;
      
      // Validation
      if (payload.title !== undefined && (!payload.title || !payload.title.trim())) {
        return res.status(400).json({ error: "Title cannot be empty" });
      }

      const updateData = sanitizeUpdateData(payload);

      if (process.env.DATABASE_URL) {
        // Check if article exists
        const existing = await prisma.article.findUnique({ where: { id: nid } });
        if (!existing) {
          return res.status(404).json({ error: 'Article not found' });
        }

        // Check if slug is being changed and if it's unique
        if (updateData.slug && updateData.slug !== existing.slug) {
          const slugExists = await prisma.article.findFirst({
            where: { 
              slug: updateData.slug,
              NOT: { id: nid }
            }
          });
          if (slugExists) {
            return res.status(400).json({ error: 'An article with this slug already exists' });
          }
        }

        // Validate categoryId if provided
        if (updateData.categoryId && updateData.categoryId !== null) {
          const categoryExists = await prisma.category.findUnique({
            where: { id: updateData.categoryId }
          });
          if (!categoryExists) {
            return res.status(400).json({ error: "Invalid categoryId" });
          }
        }

        // Validate authorId if provided
        if (updateData.authorId && updateData.authorId !== null) {
          const authorExists = await prisma.user.findUnique({
            where: { id: updateData.authorId }
          });
          if (!authorExists) {
            return res.status(400).json({ error: "Invalid authorId" });
          }
        }

        const updated = await prisma.article.update({ 
          where: { id: nid }, 
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
        
        console.log('Article updated:', updated.id);
        // Clean article to prevent React rendering errors
        const cleanedArticle = cleanArticle(updated);
        return res.status(200).json(cleanedArticle);
      }

      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      const data = JSON.parse(raw);
      const idx = data.findIndex((a: any) => a.id === nid);
      if (idx === -1) return res.status(404).json({ error: 'Article not found' });
      
      data[idx] = { 
        ...data[idx], 
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Article updated (JSON):', data[idx].id);
      return res.status(200).json(data[idx]);
    } catch (err: any) {
      console.error('PATCH /api/articles/[id] error:', err);
      
      // Handle Prisma unique constraint errors
      if (err.code === 'P2002') {
        return res.status(400).json({ error: "An article with this slug already exists" });
      }
      
      // Handle Prisma not found errors
      if (err.code === 'P2025') {
        return res.status(404).json({ error: "Article not found" });
      }
      
      return res.status(500).json({ error: 'Failed to update article', details: err.message });
    }
  }

  // Delete article (admin)
  if (req.method === 'DELETE') {
    try {
      if (process.env.DATABASE_URL) {
        const existing = await prisma.article.findUnique({ where: { id: nid } });
        if (!existing) {
          return res.status(404).json({ error: 'Article not found' });
        }

        await prisma.article.delete({ where: { id: nid } });
        console.log('Article deleted:', nid);
        return res.status(200).json({ message: 'Article deleted successfully' });
      }

      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      const data = JSON.parse(raw);
      const idx = data.findIndex((a: any) => a.id === nid);
      if (idx === -1) return res.status(404).json({ error: 'Article not found' });
      
      data.splice(idx, 1);
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Article deleted (JSON):', nid);
      return res.status(200).json({ message: 'Article deleted successfully' });
    } catch (err: any) {
      console.error('DELETE /api/articles/[id] error:', err);
      return res.status(500).json({ error: 'Failed to delete article', details: err.message });
    }
  }

  return res.setHeader('Allow', 'GET,PUT,PATCH,DELETE').status(405).end('Method Not Allowed');
}
