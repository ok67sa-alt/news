const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const DATA_PATH = path.resolve(__dirname, '..', 'data', 'news.json');

async function main() {
  console.log('🌱 Starting database article seed from news.json...');

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Error: news.json not found at ${DATA_PATH}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
  const articles = JSON.parse(rawData);

  // 1. Get default admin author
  const author = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!author) {
    console.error('Error: Admin user not found. Please run prisma/seed.cjs first!');
    process.exit(1);
  }

  console.log(`👤 Found author: ${author.name || author.email} (ID: ${author.id})`);

  // 2. Loop and import articles
  let count = 0;
  for (const art of articles) {
    // Resolve category
    let category = await prisma.category.findUnique({
      where: { name: art.category }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: art.category,
          slug: art.category.toLowerCase().replace(/[\s\W]+/g, '-')
        }
      });
      console.log(`📁 Created missing category: ${art.category}`);
    }

    // Check if slug exists
    const existing = await prisma.article.findUnique({
      where: { slug: art.slug }
    });

    if (existing) {
      // Skip if already imported
      continue;
    }

    // Insert article
    await prisma.article.create({
      data: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        readTime: art.readTime,
        featured: Boolean(art.featured),
        breaking: Boolean(art.breaking),
        views: Number(art.views) || 0,
        image: art.image || null,
        videoUrl: art.videoUrl || null,
        videoFile: art.videoFile || null,
        hero: art.hero !== undefined ? Boolean(art.hero) : false,
        status: 'PUBLISHED',
        publishedAt: art.publishedAt ? new Date(art.publishedAt) : new Date(),
        categoryId: category.id,
        authorId: author.id,
        authorRole: art.authorRole || 'Special Correspondent'
      }
    });

    count++;
  }

  console.log(`\n✅ Seeding complete! Imported ${count} articles.`);
}

main()
  .catch((e) => {
    console.error('❌ Articles seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
