const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Sudan News Today in production mode...\n');

// Check if unified Next.js build exists
const buildPath = path.join(__dirname, '.next');

if (!fs.existsSync(buildPath)) {
  console.error('❌ Production build not found at .next!');
  console.log('Please run npm run build first.\n');
  process.exit(1);
}

console.log('✅ Next.js build files found');
const port = process.env.PORT || '3000';
console.log(`🌐 Starting Next.js server on port ${port}\n`);

// Start the Next.js production server at the root
const server = spawn('npx', ['next', 'start', '-p', port], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.kill();
  process.exit(0);
});
