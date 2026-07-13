const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Check if videoUrl field exists
    console.log('\n📊 Testing Article schema...');
    const article = await prisma.article.findFirst();
    
    if (article) {
      console.log('✅ Article found:', {
        id: article.id,
        title: article.title,
        hasVideoUrl: 'videoUrl' in article,
        videoUrl: article.videoUrl || 'null'
      });
    } else {
      console.log('ℹ️  No articles in database (this is OK if database is empty)');
    }
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('\nDetails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
