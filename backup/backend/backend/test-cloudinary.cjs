// Test script to verify Cloudinary configuration
// Run with: node test-cloudinary.cjs

require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');

console.log('\n🔍 Checking Cloudinary Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('---------------------');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_FOLDER:', process.env.CLOUDINARY_FOLDER || '(not set - will use root)');

// Check if all required variables are present
const hasAllVars = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

console.log('\n📦 Configuration Status:', hasAllVars ? '✅ COMPLETE' : '❌ INCOMPLETE\n');

if (!hasAllVars) {
  console.log('⚠️  Missing variables! Upload will fall back to local filesystem.\n');
  console.log('To fix:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Add your Cloudinary credentials');
  console.log('3. Restart the backend server\n');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('\n☁️  Testing Cloudinary Connection...\n');

// Test API connection
cloudinary.api.ping()
  .then((result) => {
    console.log('✅ Cloudinary API: CONNECTED');
    console.log('📊 Response:', result);
    
    // Get account details
    return cloudinary.api.usage();
  })
  .then((usage) => {
    console.log('\n📈 Account Usage:');
    console.log('   Storage:', (usage.storage.usage / 1024 / 1024).toFixed(2), 'MB used');
    console.log('   Bandwidth:', (usage.bandwidth.usage / 1024 / 1024).toFixed(2), 'MB used this month');
    console.log('   Transformations:', usage.transformations.usage, 'used this month');
    console.log('\n✅ CLOUDINARY IS READY TO USE!\n');
  })
  .catch((error) => {
    console.error('\n❌ Cloudinary Connection FAILED:');
    console.error('   Error:', error.message);
    
    if (error.http_code === 401) {
      console.error('\n⚠️  Authentication error! Check your credentials:');
      console.error('   - Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
      console.error('   - API Key:', process.env.CLOUDINARY_API_KEY);
      console.error('   - API Secret:', process.env.CLOUDINARY_API_SECRET ? '(set)' : '(missing)');
    }
    
    console.log('\n');
    process.exit(1);
  });
