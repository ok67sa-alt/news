/**
 * سكريبت تحويل جميع الصور إلى WebP
 * 
 * التشغيل:
 * 1. npm install sharp
 * 2. node scripts/convert-images-to-webp.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// المجلدات
const uploadsDir = path.join(__dirname, '../backend/public/uploads');
const outputDir = path.join(__dirname, '../backend/public/uploads/webp');

// الإعدادات
const WEBP_QUALITY = 80; // جودة الصورة (0-100)
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

// إنشاء مجلد WebP إذا لم يكن موجودًا
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✅ تم إنشاء مجلد webp');
}

// إحصائيات
let totalProcessed = 0;
let totalSuccess = 0;
let totalErrors = 0;

/**
 * تحويل صورة واحدة إلى WebP
 */
async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
    
    // الحصول على أحجام الملفات
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`   الحجم: ${(originalSize / 1024).toFixed(1)} KB → ${(webpSize / 1024).toFixed(1)} KB (توفير ${savings}%)`);
    
    totalSuccess++;
  } catch (error) {
    console.error(`❌ خطأ في تحويل ${path.basename(inputPath)}:`, error.message);
    totalErrors++;
  }
}

/**
 * معالجة جميع الصور في المجلد
 */
async function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // معالجة المجلدات الفرعية
        await processDirectory(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        
        // تحويل الصور فقط
        if (IMAGE_EXTENSIONS.includes(ext)) {
          totalProcessed++;
          
          // حساب المسار النسبي
          const relativePath = path.relative(uploadsDir, filePath);
          const outputPath = path.join(outputDir, relativePath.replace(ext, '.webp'));
          
          // إنشاء المجلد الفرعي إذا لزم الأمر
          const outputDirPath = path.dirname(outputPath);
          if (!fs.existsSync(outputDirPath)) {
            fs.mkdirSync(outputDirPath, { recursive: true });
          }
          
          await convertToWebP(filePath, outputPath);
        }
      }
    }
  } catch (error) {
    console.error('❌ خطأ في قراءة المجلد:', error.message);
  }
}

/**
 * البدء في المعالجة
 */
async function main() {
  console.log('🚀 بدء تحويل الصور إلى WebP...\n');
  console.log(`📁 المجلد المصدر: ${uploadsDir}`);
  console.log(`📁 مجلد الخرج: ${outputDir}`);
  console.log(`⚙️  جودة WebP: ${WEBP_QUALITY}%\n`);
  
  // التحقق من وجود مجلد الرفع
  if (!fs.existsSync(uploadsDir)) {
    console.error('❌ مجلد uploads غير موجود!');
    console.log('💡 تأكد من وجود المسار: backend/public/uploads');
    return;
  }
  
  const startTime = Date.now();
  
  await processDirectory(uploadsDir);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 النتائج النهائية:');
  console.log('='.repeat(50));
  console.log(`✅ نجح: ${totalSuccess} صورة`);
  console.log(`❌ فشل: ${totalErrors} صورة`);
  console.log(`📁 الإجمالي: ${totalProcessed} صورة`);
  console.log(`⏱️  الوقت المستغرق: ${duration} ثانية`);
  console.log('='.repeat(50));
  
  if (totalSuccess > 0) {
    console.log('\n✅ تم التحويل بنجاح!');
    console.log('💡 الخطوة التالية: قم بتحديث الكود ليستخدم صور WebP');
  }
}

// التشغيل
main().catch(console.error);
