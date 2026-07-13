/** Backend type definitions - connected to Next.js + Prisma backend (not Strapi) */

export interface Category {
  id: number;
  name: string;
  slug: string;
  subtitle?: string;
  deskLead?: string;
  deskEmail?: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readTime: string;
  featured: boolean;
  breaking: boolean;
  hero: boolean;
  views: number;
  image?: string | null; // Made optional for video-only articles
  videoUrl?: string | null; // URL for embedded videos (YouTube, Twitter/X, Facebook)
  videoFile?: string | null; // Path to uploaded video file
  categoryId?: number | null;
  category?: Category;
  authorId?: number | null;
  author?: User;
  publishedAt?: string | null;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
}

/** Deprecated: Use Article, User, Category instead (Strapi types kept for reference) */
export type StrapiArticle = Article;
export type StrapiCategory = Category;
export type StrapiAuthor = User;
