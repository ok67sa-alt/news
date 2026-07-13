const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to generate proper slug from title
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function fixArticle115() {
  try {
    // Get the article
    const article = await prisma.article.findUnique({
      where: { id: 115 }
    });

    if (!article) {
      console.log('Article 115 not found');
      return;
    }

    console.log('Current article 115:');
    console.log('Title:', article.title);
    console.log('Slug:', article.slug);
    console.log('VideoURL:', article.videoUrl);

    // Generate correct slug from title
    const correctSlug = generateSlug(article.title);

    console.log('\nCorrect slug should be:', correctSlug);

    // Update the article
    const updated = await prisma.article.update({
      where: { id: 115 },
      data: {
        slug: correctSlug
      }
    });

    console.log('\n✅ Article 115 fixed successfully!');
    console.log('New slug:', updated.slug);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

fixArticle115();
