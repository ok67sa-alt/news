import type { NextApiRequest, NextApiResponse } from "next";
import cache, { invalidateArticleCache, invalidateCategoryCache } from "../../../lib/cache";

/**
 * API لإدارة الـ Cache
 * GET /api/admin/cache - إحصائيات الـ Cache
 * POST /api/admin/cache - تنظيف الـ Cache
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // الحصول على إحصائيات الـ Cache
  if (req.method === "GET") {
    try {
      const stats = cache.getStats();
      
      return res.status(200).json({
        success: true,
        stats,
        message: `Cache has ${stats.total} entries (${stats.valid} valid, ${stats.expired} expired)`
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "Failed to get cache stats",
        details: error.message
      });
    }
  }

  // تنظيف الـ Cache
  if (req.method === "POST") {
    try {
      const { action, type } = req.body;

      switch (action) {
        case "clear":
          cache.clear();
          return res.status(200).json({
            success: true,
            message: "All cache cleared successfully"
          });

        case "invalidate":
          if (type === "articles") {
            invalidateArticleCache();
            return res.status(200).json({
              success: true,
              message: "Articles cache invalidated"
            });
          } else if (type === "categories") {
            invalidateCategoryCache();
            return res.status(200).json({
              success: true,
              message: "Categories cache invalidated"
            });
          } else {
            return res.status(400).json({
              success: false,
              error: "Invalid type. Use 'articles' or 'categories'"
            });
          }

        default:
          return res.status(400).json({
            success: false,
            error: "Invalid action. Use 'clear' or 'invalidate'"
          });
      }
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "Failed to manage cache",
        details: error.message
      });
    }
  }

  res.setHeader("Allow", "GET,POST,OPTIONS");
  res.status(405).json({ error: "Method Not Allowed" });
}
