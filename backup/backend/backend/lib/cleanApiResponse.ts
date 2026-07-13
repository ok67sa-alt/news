/**
 * Helper utilities to clean API responses and prevent React object rendering errors
 * 
 * These functions extract nested objects into flat properties to avoid
 * the common React error: "Objects are not valid as a React child"
 */

/**
 * Clean a single article object by extracting nested relations
 */
export function cleanArticle(article: any) {
  if (!article) return null;

  return {
    ...article,
    // Extract IDs from nested objects
    categoryId: article.category?.id || article.categoryId || null,
    categoryName: article.category?.name || null,
    categorySlug: article.category?.slug || null,
    
    authorId: article.author?.id || article.authorId || null,
    authorName: article.author?.name || article.author?.email || null,
    authorEmail: article.author?.email || null,
    authorRole: article.author?.role || article.authorRole || null,
    
    // Remove nested objects to prevent React errors
    category: undefined,
    author: undefined
  };
}

/**
 * Clean an array of articles
 */
export function cleanArticles(articles: any[]) {
  if (!Array.isArray(articles)) return [];
  return articles.map(cleanArticle);
}

/**
 * Clean a user object by extracting only safe properties
 */
export function cleanUser(user: any) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name || null,
    role: user.role || 'EDITOR',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

/**
 * Clean an array of users
 */
export function cleanUsers(users: any[]) {
  if (!Array.isArray(users)) return [];
  return users.map(cleanUser);
}

/**
 * Clean a category object
 */
export function cleanCategory(category: any) {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    subtitle: category.subtitle || null,
    deskLead: category.deskLead || null,
    deskEmail: category.deskEmail || null
  };
}

/**
 * Clean an array of categories
 */
export function cleanCategories(categories: any[]) {
  if (!Array.isArray(categories)) return [];
  return categories.map(cleanCategory);
}

/**
 * Prepare article data for API submission (remove undefined and nested objects)
 */
export function prepareArticleForSubmission(article: any) {
  const payload: any = {};

  // Only include defined primitive values
  if (article.title !== undefined) payload.title = article.title;
  if (article.slug !== undefined) payload.slug = article.slug;
  if (article.excerpt !== undefined) payload.excerpt = article.excerpt;
  if (article.content !== undefined) payload.content = article.content;
  if (article.image !== undefined) payload.image = article.image;
  if (article.videoUrl !== undefined) payload.videoUrl = article.videoUrl || null;
  if (article.videoFile !== undefined) payload.videoFile = article.videoFile || null;
  if (article.readTime !== undefined) payload.readTime = article.readTime;
  if (article.hero !== undefined) payload.hero = Boolean(article.hero);
  if (article.featured !== undefined) payload.featured = Boolean(article.featured);
  if (article.breaking !== undefined) payload.breaking = Boolean(article.breaking);
  if (article.status !== undefined) payload.status = article.status;
  
  // Handle IDs (can be null)
  if (article.categoryId !== undefined) {
    payload.categoryId = article.categoryId ? Number(article.categoryId) : null;
  }
  if (article.authorId !== undefined) {
    payload.authorId = article.authorId ? Number(article.authorId) : null;
  }
  if (article.authorRole !== undefined) {
    payload.authorRole = article.authorRole;
  }
  
  // Handle publishedAt
  if (article.publishedAt !== undefined) {
    payload.publishedAt = article.publishedAt;
  }

  return payload;
}
