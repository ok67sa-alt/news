const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Sudan News Today in production mode...\n');

// Check if build exists
const fs = require('fs');
const distPath = path.join(__dirname, 'dist');
const backendBuildPath = path.join(__dirname, 'backend', '.next');

if (!fs.existsSync(distPath)) {
  console.error('❌ Frontend build not found!');
  console.log('Run: npm run build:frontend\n');
  process.exit(1);
}

if (!fs.existsSync(backendBuildPath)) {
  console.error('❌ Backend build not found!');
  console.log('Run: npm run build:backend\n');
  process.exit(1);
}

console.log('✅ Build files found');
console.log('🌐 Starting server on http://localhost:3000\n');
console.log('   Frontend: http://localhost:3000');
console.log('   Admin:    http://localhost:3000/admin');
console.log('   API:      http://localhost:3000/api\n');

// Start the Next.js production server
const server = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
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
