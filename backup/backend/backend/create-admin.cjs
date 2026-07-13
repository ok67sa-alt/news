// Run this script to create an admin user
// Usage: node create-admin.cjs

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@sudannews.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('\n⚠️  Please change this password after first login!');
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('❌ Admin user already exists!');
    } else {
      console.error('Error creating admin:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
