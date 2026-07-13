const { execSync } = require('child_process');
const path = require('path');

function runCommand(command, cwd) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { 
      cwd: cwd || process.cwd(), 
      stdio: 'inherit',
      shell: true 
    });
  } catch (error) {
    console.error(`Failed to run: ${command}`);
    process.exit(1);
  }
}

console.log('📦 Installing root dependencies...');
runCommand('npm install', path.join(__dirname, '..'));

console.log('🎨 Building frontend...');
runCommand('npm run build:frontend', path.join(__dirname, '..'));

console.log('📦 Installing backend dependencies...');
runCommand('npm install', __dirname);

console.log('🗄️ Setting up Prisma...');
runCommand('npx prisma generate', __dirname);

console.log('🚀 Running database migrations...');
runCommand('npx prisma migrate deploy', __dirname);

console.log('🏗️ Building Next.js...');
runCommand('npm run build', __dirname);

console.log('✅ Build complete!');
