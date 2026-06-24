import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin authentication
  const authResult = verifyAuth(req);
  if (!authResult.valid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all articles
    const articles = await prisma.article.findMany({
      include: {
        category: true,
        author: true,
      },
    });

    // Calculate total views across all articles
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);

    // Get most viewed articles (top 10)
    const topArticles = articles
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)
      .map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        views: article.views || 0,
        category: article.category?.name || 'Uncategorized',
        publishedAt: article.publishedAt,
      }));

    // Get articles by status
    const statusCounts = {
      published: articles.filter(a => a.status === 'PUBLISHED').length,
      draft: articles.filter(a => a.status === 'DRAFT').length,
      review: articles.filter(a => a.status === 'REVIEW').length,
    };

    // Get articles by category with view counts
    const categoryStats: Record<string, { count: number; views: number }> = {};
    articles.forEach(article => {
      const categoryName = article.category?.name || 'Uncategorized';
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = { count: 0, views: 0 };
      }
      categoryStats[categoryName].count++;
      categoryStats[categoryName].views += article.views || 0;
    });

    // Get recent articles (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentArticles = articles.filter(
      a => a.createdAt && new Date(a.createdAt) >= sevenDaysAgo
    );

    // Get featured and breaking counts
    const featuredCount = articles.filter(a => a.featured).length;
    const breakingCount = articles.filter(a => a.breaking).length;

    // Calculate average views per article
    const avgViews = articles.length > 0 
      ? Math.round(totalViews / articles.length) 
      : 0;

    // Get articles published in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPublished = articles.filter(
      a => a.publishedAt && new Date(a.publishedAt) >= thirtyDaysAgo
    ).length;

    // Get trending articles (high views in recent articles)
    const trendingArticles = articles
      .filter(a => a.publishedAt && new Date(a.publishedAt) >= sevenDaysAgo)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        views: article.views || 0,
        publishedAt: article.publishedAt,
      }));

    // Get daily views for last 7 days (simplified - based on published date)
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayArticles = articles.filter(a => {
        if (!a.publishedAt) return false;
        const pubDate = new Date(a.publishedAt);
        return pubDate >= date && pubDate < nextDate;
      });
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        articles: dayArticles.length,
        views: dayArticles.reduce((sum, a) => sum + (a.views || 0), 0),
      });
    }

    const stats = {
      overview: {
        totalArticles: articles.length,
        totalViews,
        avgViews,
        publishedArticles: statusCounts.published,
        draftArticles: statusCounts.draft,
        reviewArticles: statusCounts.review,
        featuredArticles: featuredCount,
        breakingNews: breakingCount,
        recentArticles: recentArticles.length,
        recentPublished,
      },
      topArticles,
      trendingArticles,
      categoryStats: Object.entries(categoryStats).map(([name, data]) => ({
        category: name,
        count: data.count,
        views: data.views,
        avgViews: Math.round(data.views / data.count),
      })).sort((a, b) => b.views - a.views),
      statusCounts,
      dailyStats,
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}
