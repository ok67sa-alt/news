import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";
import { cleanArticles, cleanArticle } from "../../../lib/cleanApiResponse";
import cache, { CacheKeys, CacheTTL, invalidateArticleCache } from "../../../lib/cache";

const DATA_PATH = path.resolve(process.cwd(), '..', 'src', 'data', 'news.json');

// CORS headers middleware
const setCorsHeaders = (res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
};

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

// Helper function to sanitize article data
function sanitizeArticleData(payload: any) {
  const data: any = {
    title: payload.title || 'Untitled',
    slug: payload.slug || generateSlug(payload.title || `article-${Date.now()}`),
    excerpt: payload.excerpt || '',
    content: payload.content || '',
    readTime: payload.readTime || estimateReadTime(payload.content || ''),
    image: payload.image || null, // Allow null for video-only articles
    videoUrl: payload.videoUrl || null,
    videoFile: payload.videoFile || null,
    hero: Boolean(payload.hero),
    featured: Boolean(payload.featured),
    breaking: Boolean(payload.breaking),
    status: payload.status || 'DRAFT',
  };

  // Handle categoryId
  if (payload.categoryId) {
    const catId = Number(payload.categoryId);
    if (!isNaN(catId) && catId > 0) {
      data.categoryId = catId;
    }
  }

  // Handle authorId
  if (payload.authorId) {
    const authId = Number(payload.authorId);
    if (!isNaN(authId) && authId > 0) {
      data.authorId = authId;
    }
  }

  // Handle authorRole
  if (payload.authorRole) {
    data.authorRole = payload.authorRole;
  }

  // Handle publishedAt
  if (payload.publishedAt) {
    data.publishedAt = new Date(payload.publishedAt);
  } else if (data.status === 'PUBLISHED' && !payload.id) {
    // Auto-set publishedAt for new published articles
    data.publishedAt = new Date();
  }

  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    try {
      if (process.env.DATABASE_URL) {
        // Support pagination via query params
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        // Check if we need category filtering
        const categorySlug = req.query.category as string;
        
        // إنشاء Cache Key فريد بناءً على المعاملات
        const cacheKey = categorySlug 
          ? `${CacheKeys.ARTICLES_BY_CATEGORY(0)}:${categorySlug}:page:${page}:limit:${limit}`
          : `${CacheKeys.ARTICLES_PUBLISHED}:page:${page}:limit:${limit}`;
        
        // محاولة جلب البيانات من الـ Cache أولاً
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
          console.log(`✅ Cache HIT: ${cacheKey}`);
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
          return res.status(200).json(cachedData);
        }
        
        console.log(`❌ Cache MISS: ${cacheKey}`);
        
        const whereClause: any = {
          status: 'PUBLISHED'
        };

        if (categorySlug) {
          // Find category by slug first
          const category = await prisma.category.findUnique({
            where: { slug: categorySlug }
          });
          if (category) {
            whereClause.categoryId = category.id;
          }
        }

        // Fetch articles with pagination
        const articles = await prisma.article.findMany({ 
          where: whereClause,
          orderBy: { publishedAt: "desc" },
          skip,
          take: limit,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            },
            author: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          }
        });
        
        // Get total count for pagination metadata
        const total = await prisma.article.count({ where: whereClause });
        
        // Clean articles to prevent React rendering errors
        const cleanedArticles = cleanArticles(articles);
        
        const responseData = {
          data: cleanedArticles,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        };
        
        // حفظ النتيجة في الـ Cache لمدة 10 دقائق
        cache.set(cacheKey, responseData, CacheTTL.MEDIUM);
        
        // Set cache headers (10 minutes for homepage)
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
        
        res.status(200).json(responseData);
        return;
      }

      const raw = fs.readFileSync(DATA_PATH, "utf-8");
      const data = JSON.parse(raw);
      res.status(200).json(data);
      return;
    } catch (err) {
      console.error('GET /api/articles error:', err);
      res.status(500).json({ error: "Failed to load articles" });
      return;
    }
  }

  // Admin: Create new article
  if (req.method === "POST") {
    try {
      const payload = req.body;
      
      // Validation
      if (!payload.title || !payload.title.trim()) {
        return res.status(400).json({ error: "Title is required" });
      }

      if (!payload.content || !payload.content.trim()) {
        return res.status(400).json({ error: "Content is required" });
      }

      const sanitizedData = sanitizeArticleData(payload);

      if (process.env.DATABASE_URL) {
        // Check if slug already exists
        const existing = await prisma.article.findUnique({
          where: { slug: sanitizedData.slug }
        });

        if (existing) {
          // Make slug unique by appending timestamp
          sanitizedData.slug = `${sanitizedData.slug}-${Date.now()}`;
        }

        // Validate categoryId if provided
        if (sanitizedData.categoryId) {
          const categoryExists = await prisma.category.findUnique({
            where: { id: sanitizedData.categoryId }
          });
          if (!categoryExists) {
            return res.status(400).json({ error: "Invalid categoryId" });
          }
        }

        // Validate authorId if provided
        if (sanitizedData.authorId) {
          const authorExists = await prisma.user.findUnique({
            where: { id: sanitizedData.authorId }
          });
          if (!authorExists) {
            return res.status(400).json({ error: "Invalid authorId" });
          }
        }

        const created = await prisma.article.create({ 
          data: sanitizedData,
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
        
        // إزالة الـ Cache بعد إنشاء مقال جديد
        invalidateArticleCache();
        
        console.log('Article created:', created.id);
        // Clean article to prevent React rendering errors
        const cleanedArticle = cleanArticle(created);
        return res.status(201).json(cleanedArticle);
      }

      // Fallback: append to JSON file (non-atomic, convenience only)
      const raw = fs.readFileSync(DATA_PATH, "utf-8");
      const data = JSON.parse(raw);
      const nextId = data.reduce((max: number, a: any) => Math.max(max, a.id), 0) + 1;
      const article = { 
        id: nextId, 
        ...sanitizedData,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.unshift(article);
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
      
      console.log('Article created (JSON):', article.id);
      return res.status(201).json(article);
    } catch (err: any) {
      console.error('POST /api/articles error:', err);
      
      // Handle Prisma unique constraint errors
      if (err.code === 'P2002') {
        return res.status(400).json({ error: "An article with this slug already exists" });
      }
      
      return res.status(500).json({ error: "Failed to create article", details: err.message });
    }
  }

  res.setHeader("Allow", "GET,POST,OPTIONS");
  res.status(405).json({ error: "Method Not Allowed" });
}
