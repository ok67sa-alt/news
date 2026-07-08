const { execSync } = require('child_process');

console.log('🔄 Running database migrations...');

try {
  // Run Prisma migrations
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('✅ Migrations completed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
