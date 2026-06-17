const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.resolve(process.cwd(), 'src', 'data', 'news.json');
  if (!fs.existsSync(dataPath)) {
    console.error('news.json not found at', dataPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const articles = JSON.parse(raw);

  // Basic import: categories, users (anonymous), articles
  const categoryMap = {};

  for (const a of articles) {
    const catName = a.category || 'Uncategorized';
    if (!categoryMap[catName]) {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'uncategorized';
      categoryMap[catName] = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name: catName, slug }
      });
    }
  }

  // single default user (ensure password is hashed)
  let defaultUser = await prisma.user.findUnique({ where: { email: 'admin@local' } });
  const plainPassword = 'changeme';
  if (!defaultUser) {
    const hashed = await bcrypt.hash(plainPassword, 10);
    defaultUser = await prisma.user.create({ data: { email: 'admin@local', password: hashed, name: 'Admin', role: 'ADMIN' } });
  } else {
    // If the stored password looks unhashed, replace it with a hashed default password
    if (!defaultUser.password || !defaultUser.password.startsWith('$2')) {
      const hashed = await bcrypt.hash(plainPassword, 10);
      await prisma.user.update({ where: { id: defaultUser.id }, data: { password: hashed } });
      defaultUser = await prisma.user.findUnique({ where: { id: defaultUser.id } });
    }
  }

  for (const a of articles) {
    const slug = a.slug || a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const readTime = estimateReadTime(a.content || '')
    await prisma.article.upsert({
      where: { slug },
      update: {
        title: a.title,
        excerpt: a.excerpt || '',
        content: a.content || a.body || '',
        readTime,
        featured: !!a.featured,
        breaking: !!a.breaking,
        views: a.views || 0,
        image: a.image || '',
        categoryId: categoryMap[a.category || 'Uncategorized'].id,
        authorId: defaultUser.id,
        publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
        status: a.status || 'PUBLISHED'
      },
      create: {
        title: a.title,
        slug,
        excerpt: a.excerpt || '',
        content: a.content || a.body || '',
        readTime,
        featured: !!a.featured,
        breaking: !!a.breaking,
        views: a.views || 0,
        image: a.image || '',
        categoryId: categoryMap[a.category || 'Uncategorized'].id,
        authorId: defaultUser.id,
        publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
        status: a.status || 'PUBLISHED'
      }
    });
  }
  console.log('Seed complete');
}

function estimateReadTime(text) {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
