// Quick script to mark some articles as hero
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking articles...\n');
  
  // Get all published articles
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { views: 'desc' },
    take: 10,
  });
  
  console.log(`Found ${articles.length} published articles\n`);
  
  if (articles.length === 0) {
    console.log('❌ No articles found! You need to create some articles first.');
    console.log('\nCreate articles at: https://news-production-a6e2.up.railway.app/admin/articles/new\n');
    return;
  }
  
  // Mark top 3 most viewed as hero
  const topArticles = articles.slice(0, 3);
  
  console.log('🎯 Marking these as HERO articles:\n');
  for (const article of topArticles) {
    await prisma.article.update({
      where: { id: article.id },
      data: { 
        hero: true,
        featured: true // Also mark as featured
      },
    });
    console.log(`✅ ${article.id}. ${article.title.substring(0, 60)}...`);
    console.log(`   Views: ${article.views}, Category: ${article.categoryId}\n`);
  }
  
  // Mark next 5 as featured (Editor's Picks)
  const featuredArticles = articles.slice(3, 8);
  if (featuredArticles.length > 0) {
    console.log('📌 Marking these as FEATURED (Editor\'s Picks):\n');
    for (const article of featuredArticles) {
      await prisma.article.update({
        where: { id: article.id },
        data: { 
          hero: false,
          featured: true
        },
      });
      console.log(`✅ ${article.id}. ${article.title.substring(0, 60)}...`);
    }
  }
  
  console.log('\n✅ Done! Refresh your homepage to see the changes.\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
