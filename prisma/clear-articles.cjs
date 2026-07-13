const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearArticles() {
  try {
    console.log('🗑️  Starting to clear all articles...');
    
    // Delete all articles
    const deleteResult = await prisma.article.deleteMany({});
    
    console.log(`✅ Successfully deleted ${deleteResult.count} articles`);
    console.log('🎉 Database is now fresh and ready for new content!');
    
  } catch (error) {
    console.error('❌ Error clearing articles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearArticles()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
