/** Safely extract display strings from article relations (Strapi v5, Prisma backend, or JSON fallback). */

export function getAuthorName(article: any): string {
  if (!article) return 'Sudan News';
  if (article.authorName) return article.authorName;
  if (typeof article.author === 'string') return article.author;
  if (article.author && typeof article.author === 'object') return article.author.name || 'Sudan News';
  return 'Sudan News';
}

export function getAuthorRole(article: any, fallback = 'Special Correspondent, Khartoum'): string {
  if (!article) return fallback;
  if (article.authorRole) return article.authorRole;
  if (article.author && typeof article.author === 'object' && article.author.role) return article.author.role;
  return fallback;
}

export function getCategoryName(article: any): string {
  if (!article) return '';
  if (article.categoryName) return article.categoryName;
  if (typeof article.category === 'string') return article.category;
  if (Array.isArray(article.category)) return article.category[0]?.name || '';
  if (article.category && typeof article.category === 'object') return article.category.name || '';
  return '';
}

export function getCategorySlug(article: any): string {
  if (!article) return '';
  if (article.categorySlug) return article.categorySlug;
  if (Array.isArray(article.category)) return article.category[0]?.slug || '';
  if (article.category && typeof article.category === 'object') return article.category.slug || '';
  const name = getCategoryName(article);
  return name.toLowerCase().split(' ')[0] || '';
}
