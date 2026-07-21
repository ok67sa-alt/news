/**
 * سكريبت تطبيق Indexes للأداء
 * 
 * التشغيل:
 * node scripts/apply-performance-migration.js
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 بدء تطبيق Prisma Migration للأداء...\n');

// الانتقال إلى مجلد backend
const backendDir = path.join(__dirname, '../backend');

console.log('📁 المجلد: ' + backendDir);
console.log('⚙️  تطبيق Migration...\n');

// تشغيل Prisma Migrate
exec('npx prisma migrate dev --name add_performance_indexes', 
  { cwd: backendDir },
  (error, stdout, stderr) => {
    if (error) {
      console.error('❌ خطأ في تطبيق Migration:');
      console.error(stderr);
      return;
    }
    
    console.log(stdout);
    console.log('\n✅ تم تطبيق Indexes بنجاح!');
    console.log('\n📊 الـ Indexes المضافة:');
    console.log('  - publishedAt');
    console.log('  - status, publishedAt (مركب)');
    console.log('  - categoryId, status, publishedAt (مركب)');
    console.log('\n💡 الآن قم بإعادة تشغيل السيرفر لتطبيق التحسينات');
  }
);
