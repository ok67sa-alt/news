const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production database seed...');

  // 1. Create essential categories
  const categories = [
    { name: 'Politics', slug: 'politics', subtitle: 'Political News & Analysis' },
    { name: 'Economy', slug: 'economy', subtitle: 'Economic Updates & Business' },
    { name: 'Technology', slug: 'technology', subtitle: 'Tech News & Innovation' },
    { name: 'Sports', slug: 'sports', subtitle: 'Sports Coverage' },
    { name: 'Culture', slug: 'culture', subtitle: 'Arts & Culture' },
    { name: 'Health', slug: 'health', subtitle: 'Health & Wellness' },
    { name: 'Education', slug: 'education', subtitle: 'Education News' },
  ];

  console.log('📁 Creating categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log(`  ✓ ${cat.name}`);
  }

  // 2. Create admin user
  console.log('👤 Creating admin user...');
  const adminEmail = 'admin@sudantimes.com';
  const adminPassword = 'SudanTimes2024!'; // CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN!
  
  const existingAdmin = await prisma.user.findUnique({ 
    where: { email: adminEmail } 
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log('  ✓ Admin user created');
    console.log('  📧 Email:', adminEmail);
    console.log('  🔑 Password:', adminPassword);
    console.log('  ⚠️  IMPORTANT: Change password immediately after first login!');
  } else {
    console.log('  ℹ️  Admin user already exists');
  }

  console.log('\n✅ Production seed completed successfully!');
  console.log('🚀 You can now start creating articles via the admin panel.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
