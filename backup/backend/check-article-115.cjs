const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkArticle() {
  try {
    const article = await prisma.article.findUnique({
      where: { id: 115 },
      select: {
        id: true,
        title: true,
        slug: true,
        videoUrl: true,
        image: true
      }
    });

    console.log('Article 115:');
    console.log(JSON.stringify(article, null, 2));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticle();
