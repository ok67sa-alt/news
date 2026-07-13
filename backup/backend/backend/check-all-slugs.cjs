const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllSlugs() {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        videoUrl: true
      },
      orderBy: { id: 'desc' },
      take: 20
    });

    console.log(`Found ${articles.length} articles (last 20):\n`);

    const problematic = [];

    articles.forEach(article => {
      // Check if slug contains 'http' or 'www' which indicates it might be a URL
      const isSlugUrl = article.slug && (
        article.slug.includes('http') || 
        article.slug.includes('www') ||
        article.slug.includes('://') ||
        article.slug.includes('facebook') ||
        article.slug.includes('youtube')
      );

      if (isSlugUrl) {
        problematic.push(article);
        console.log(`❌ Article ${article.id}: "${article.title}"`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   VideoURL: ${article.videoUrl || 'none'}`);
        console.log('');
      } else {
        console.log(`✅ Article ${article.id}: "${article.title}" - slug: ${article.slug}`);
      }
    });

    if (problematic.length > 0) {
      console.log(`\n⚠️  Found ${problematic.length} articles with problematic slugs`);
    } else {
      console.log('\n✅ All slugs look good!');
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllSlugs();
