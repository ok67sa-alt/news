const fs = require('fs');
const path = require('path');

/**
 * Ensures the uploads directory exists
 * Run this during build to create the directory structure
 */
const uploadsDir = path.resolve(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created');
} else {
  console.log('✅ Uploads directory already exists');
}

// Create a .gitkeep file to preserve the directory in git
const gitkeepPath = path.join(uploadsDir, '.gitkeep');
if (!fs.existsSync(gitkeepPath)) {
  fs.writeFileSync(gitkeepPath, '# This file ensures the uploads directory exists in git\n');
  console.log('✅ Created .gitkeep file');
}
