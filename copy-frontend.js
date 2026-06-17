import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy frontend dist to backend public folder
function copyFrontendAssets() {
  const sourceDist = path.join(__dirname, 'dist');
  const targetPublic = path.join(__dirname, 'backend', 'public');

  // Check if dist folder exists
  if (!fs.existsSync(sourceDist)) {
    console.error('❌ Frontend dist folder not found. Run "npm run build:frontend" first.');
    process.exit(1);
  }

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetPublic)) {
    fs.mkdirSync(targetPublic, { recursive: true });
  }

  // Copy the entire dist folder contents to public
  console.log('📦 Copying frontend build to backend/public...');
  
  // Copy index.html
  const sourceIndex = path.join(sourceDist, 'index.html');
  const targetIndex = path.join(targetPublic, 'index.html');
  if (fs.existsSync(sourceIndex)) {
    fs.copyFileSync(sourceIndex, targetIndex);
    console.log('✅ Copied index.html');
  }

  // Copy assets folder
  const sourceAssets = path.join(sourceDist, 'assets');
  const targetAssets = path.join(targetPublic, 'assets');
  
  // Remove old assets
  if (fs.existsSync(targetAssets)) {
    fs.rmSync(targetAssets, { recursive: true, force: true });
  }
  
  if (fs.existsSync(sourceAssets)) {
    copyRecursive(sourceAssets, targetAssets);
    console.log('✅ Copied assets folder');
  }

  // Copy .vite folder if exists
  const sourceVite = path.join(sourceDist, '.vite');
  const targetVite = path.join(targetPublic, '.vite');
  
  if (fs.existsSync(targetVite)) {
    fs.rmSync(targetVite, { recursive: true, force: true });
  }
  
  if (fs.existsSync(sourceVite)) {
    copyRecursive(sourceVite, targetVite);
    console.log('✅ Copied .vite folder');
  }

  console.log('✅ Frontend build ready for deployment');
}

function copyRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);

  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// Run the copy
copyFrontendAssets();
