const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLatestArticles() {
  try {
    console.log('📊 Checking latest articles...\n');
    
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        featured: true,
        image: true,
        videoUrl: true,
        content: true,
        createdAt: true
      }
    });
    
    articles.forEach((article, index) => {
      console.log(`${index + 1}. Article #${article.id}:`);
      console.log(`   Title: ${article.title}`);
      console.log(`   Status: ${article.status}`);
      console.log(`   Featured: ${article.featured}`);
      console.log(`   Image: ${article.image || 'null'}`);
      console.log(`   VideoUrl: ${article.videoUrl || 'null'}`);
      console.log(`   Content length: ${article.content.length} chars`);
      
      // Check if content is valid JSON
      try {
        const contentData = JSON.parse(article.content);
        console.log(`   Content format: Valid JSON`);
        console.log(`   Blocks: ${contentData.blocks ? contentData.blocks.length : 0}`);
      } catch (e) {
        console.log(`   Content format: ❌ Invalid JSON`);
      }
      
      console.log(`   Created: ${article.createdAt}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestArticles();
