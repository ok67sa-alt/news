/**
 * In-Memory Cache System
 * يقلل من استعلامات قاعدة البيانات عبر تخزين النتائج في الذاكرة
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time To Live in milliseconds
}

class InMemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  
  constructor() {
    this.cache = new Map();
    
    // تنظيف الـ Cache كل 5 دقائق
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }
  
  /**
   * حفظ البيانات في الـ Cache
   */
  set<T>(key: string, data: T, ttl: number = 10 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  
  /**
   * جلب البيانات من الـ Cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // التحقق من انتهاء صلاحية الـ Cache
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  /**
   * حذف مفتاح معين من الـ Cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * حذف جميع المفاتيح التي تبدأ بـ prefix معين
   */
  deleteByPrefix(prefix: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    });
  }
  
  /**
   * مسح كل الـ Cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * تنظيف البيانات المنتهية الصلاحية
   */
  private cleanup(): void {
    const now = Date.now();
    const keys = Array.from(this.cache.keys());
    
    let cleaned = 0;
    keys.forEach(key => {
      const entry = this.cache.get(key);
      if (entry && now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    });
    
    if (cleaned > 0) {
      console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries`);
    }
  }
  
  /**
   * الحصول على إحصائيات الـ Cache
   */
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    return {
      total: entries.length,
      valid: entries.filter(([_, entry]) => now - entry.timestamp <= entry.ttl).length,
      expired: entries.filter(([_, entry]) => now - entry.timestamp > entry.ttl).length,
      size: this.cache.size,
    };
  }
}

// تصدير Instance واحد فقط (Singleton)
const cache = new InMemoryCache();

export default cache;

/**
 * Helper Functions لاستخدام الـ Cache بسهولة
 */

/**
 * Cache Keys Generator
 */
export const CacheKeys = {
  ARTICLES_ALL: 'articles:all',
  ARTICLES_PUBLISHED: 'articles:published',
  ARTICLES_BREAKING: 'articles:breaking',
  ARTICLES_HERO: 'articles:hero',
  ARTICLES_FEATURED: 'articles:featured',
  ARTICLES_BY_CATEGORY: (categoryId: number) => `articles:category:${categoryId}`,
  ARTICLES_BY_SLUG: (slug: string) => `articles:slug:${slug}`,
  CATEGORIES_ALL: 'categories:all',
  CATEGORY_BY_SLUG: (slug: string) => `categories:slug:${slug}`,
};

/**
 * Cache TTL (Time To Live) Constants
 */
export const CacheTTL = {
  VERY_SHORT: 1 * 60 * 1000,      // 1 دقيقة
  SHORT: 5 * 60 * 1000,           // 5 دقائق
  MEDIUM: 10 * 60 * 1000,         // 10 دقائق
  LONG: 30 * 60 * 1000,           // 30 دقيقة
  VERY_LONG: 60 * 60 * 1000,      // 1 ساعة
};

/**
 * Invalidate Cache عند تعديل البيانات
 */
export const invalidateArticleCache = () => {
  cache.deleteByPrefix('articles:');
  console.log('♻️  Article cache invalidated');
};

export const invalidateCategoryCache = () => {
  cache.deleteByPrefix('categories:');
  console.log('♻️  Category cache invalidated');
};
