const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCreateArticle() {
  try {
    console.log('🧪 Testing article creation with null image...');
    
    const article = await prisma.article.create({
      data: {
        title: 'Test Video Article',
        slug: `test-video-${Date.now()}`,
        excerpt: 'Test excerpt',
        content: JSON.stringify({
          time: Date.now(),
          blocks: [{
            type: 'paragraph',
            data: { text: 'Test content' }
          }],
          version: '2.28.0'
        }),
        readTime: '1 min read',
        image: null, // Testing null image
        videoUrl: 'https://youtube.com/watch?v=test123',
        featured: true,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        categoryId: 1 // Adjust if needed
      }
    });
    
    console.log('✅ Article created successfully:', {
      id: article.id,
      title: article.title,
      image: article.image,
      videoUrl: article.videoUrl
    });
    
    // Clean up test article
    await prisma.article.delete({ where: { id: article.id } });
    console.log('🗑️  Test article deleted');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateArticle();
