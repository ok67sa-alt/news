/**
 * سكريبت اختبار التحسينات
 * يختبر جميع التحسينات المطبقة على الموقع
 */

const http = require('http');
const https = require('https');

const API_URL = process.env.API_URL || 'http://localhost:3000';

// ألوان للـ Console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, message = '') {
  const icon = passed ? '✅' : '❌';
  const color = passed ? 'green' : 'red';
  log(`${icon} ${name}${message ? ': ' + message : ''}`, color);
}

// Helper لعمل HTTP Request
function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'User-Agent': 'Test-Script',
      }
    };
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// الاختبارات
async function runTests() {
  log('\n🚀 بدء اختبار التحسينات...\n', 'cyan');
  
  let passedTests = 0;
  let failedTests = 0;
  
  // ==================== اختبار 1: API متاح ====================
  log('\n📊 اختبار 1: توفر API', 'blue');
  try {
    const response = await makeRequest('/api/articles?limit=5');
    
    if (response.statusCode === 200) {
      logTest('API متاح ويستجيب', true);
      passedTests++;
    } else {
      logTest('API متاح', false, `Status Code: ${response.statusCode}, Error: ${response.data.substring(0, 100)}`);
      failedTests++;
    }
  } catch (error) {
    logTest('API متاح', false, error.message);
    log(`   تفاصيل: تأكد من تشغيل Backend على port ${new URL(API_URL).port}`, 'yellow');
    failedTests++;
  }
  
  // ==================== اختبار 2: Cache Headers ====================
  log('\n💾 اختبار 2: Cache Headers', 'blue');
  try {
    const response = await makeRequest('/api/articles');
    
    if (response.headers['cache-control']) {
      const cacheControl = response.headers['cache-control'];
      const hasMaxAge = cacheControl.includes('s-maxage');
      const hasRevalidate = cacheControl.includes('stale-while-revalidate');
      
      if (hasMaxAge && hasRevalidate) {
        logTest('Cache Headers صحيحة', true, cacheControl);
        passedTests++;
      } else {
        logTest('Cache Headers', false, 'مفقودة بعض القيم');
        failedTests++;
      }
    } else {
      logTest('Cache Headers', false, 'غير موجودة');
      failedTests++;
    }
  } catch (error) {
    logTest('Cache Headers', false, error.message);
    failedTests++;
  }
  
  // ==================== اختبار 3: In-Memory Cache ====================
  log('\n🔄 اختبار 3: In-Memory Cache', 'blue');
  try {
    // الطلب الأول (Cache Miss)
    const response1 = await makeRequest('/api/articles?limit=10');
    const xCache1 = response1.headers['x-cache'];
    
    // الطلب الثاني (Cache Hit)
    const response2 = await makeRequest('/api/articles?limit=10');
    const xCache2 = response2.headers['x-cache'];
    
    if (xCache1 === 'MISS' && xCache2 === 'HIT') {
      logTest('Cache يعمل بشكل صحيح', true, 'MISS → HIT');
      passedTests++;
    } else {
      logTest('Cache', false, `First: ${xCache1}, Second: ${xCache2}`);
      failedTests++;
    }
  } catch (error) {
    logTest('Cache', false, error.message);
    failedTests++;
  }
  
  // ==================== اختبار 4: Pagination ====================
  log('\n📄 اختبار 4: Pagination', 'blue');
  try {
    const response = await makeRequest('/api/articles?page=1&limit=5');
    const data = JSON.parse(response.data);
    
    if (data.pagination && data.data) {
      const hasPageInfo = data.pagination.page && data.pagination.limit && data.pagination.total;
      const correctLimit = data.data.length <= 5;
      
      if (hasPageInfo && correctLimit) {
        logTest('Pagination يعمل', true, `Page: ${data.pagination.page}, Limit: ${data.pagination.limit}`);
        passedTests++;
      } else {
        logTest('Pagination', false, 'بيانات ناقصة');
        failedTests++;
      }
    } else {
      logTest('Pagination', false, 'الهيكل غير صحيح');
      failedTests++;
    }
  } catch (error) {
    logTest('Pagination', false, error.message);
    failedTests++;
  }
  
  // ==================== اختبار 5: Categories Cache ====================
  log('\n🏷️  اختبار 5: Categories Cache', 'blue');
  try {
    // الطلب الأول
    const response1 = await makeRequest('/api/categories');
    const xCache1 = response1.headers['x-cache'];
    
    // الطلب الثاني
    const response2 = await makeRequest('/api/categories');
    const xCache2 = response2.headers['x-cache'];
    
    if (xCache1 === 'MISS' && xCache2 === 'HIT') {
      logTest('Categories Cache يعمل', true);
      passedTests++;
    } else {
      logTest('Categories Cache', false, `${xCache1} → ${xCache2}`);
      failedTests++;
    }
  } catch (error) {
    logTest('Categories Cache', false, error.message);
    failedTests++;
  }
  
  // ==================== اختبار 6: Response Time ====================
  log('\n⚡ اختبار 6: Response Time', 'blue');
  try {
    // الطلب الأول (من Database)
    const start1 = Date.now();
    await makeRequest('/api/articles?test=1');
    const time1 = Date.now() - start1;
    
    // الطلب الثاني (من Cache)
    const start2 = Date.now();
    await makeRequest('/api/articles?test=1');
    const time2 = Date.now() - start2;
    
    const improvement = ((time1 - time2) / time1 * 100).toFixed(1);
    
    if (time2 < time1) {
      logTest('Response Time محسّن', true, `${time1}ms → ${time2}ms (${improvement}% أسرع)`);
      passedTests++;
    } else {
      logTest('Response Time', false, `لا تحسن: ${time1}ms → ${time2}ms`);
      failedTests++;
    }
  } catch (error) {
    logTest('Response Time', false, error.message);
    failedTests++;
  }
  
  // ==================== اختبار 7: Cache Admin API ====================
  log('\n🛠️  اختبار 7: Cache Admin API', 'blue');
  try {
    const response = await makeRequest('/api/admin/cache');
    const data = JSON.parse(response.data);
    
    if (data.success && data.stats) {
      logTest('Cache Admin API يعمل', true, `Total: ${data.stats.total}, Valid: ${data.stats.valid}`);
      passedTests++;
    } else {
      logTest('Cache Admin API', false, 'بيانات ناقصة');
      failedTests++;
    }
  } catch (error) {
    logTest('Cache Admin API', false, error.message);
    failedTests++;
  }
  
  // ==================== اختبار 8: Files موجودة ====================
  log('\n📁 اختبار 8: ملفات التحسينات', 'blue');
  const fs = require('fs');
  const path = require('path');
  
  const files = [
    'backend/lib/cache.ts',
    'backend/pages/api/admin/cache.ts',
    'public/sw.js',
    'public/offline.html',
    'public/manifest.json',
    'scripts/convert-images-to-webp.js',
    'scripts/apply-performance-migration.js',
  ];
  
  let filesExist = true;
  files.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
      logTest(`${file}`, true);
    } else {
      logTest(`${file}`, false, 'غير موجود');
      filesExist = false;
    }
  });
  
  if (filesExist) {
    passedTests++;
  } else {
    failedTests++;
  }
  
  // ==================== النتيجة النهائية ====================
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 النتيجة النهائية', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const total = passedTests + failedTests;
  const percentage = ((passedTests / total) * 100).toFixed(1);
  
  log(`\n✅ نجح: ${passedTests} اختبار`, 'green');
  log(`❌ فشل: ${failedTests} اختبار`, 'red');
  log(`📈 النسبة: ${percentage}%\n`, percentage >= 80 ? 'green' : 'yellow');
  
  if (failedTests === 0) {
    log('🎉 رائع! جميع الاختبارات نجحت!', 'green');
    log('الموقع جاهز للإنتاج.\n', 'green');
  } else if (percentage >= 80) {
    log('⚠️  معظم الاختبارات نجحت، لكن هناك بعض المشاكل.', 'yellow');
    log('راجع الاختبارات الفاشلة أعلاه.\n', 'yellow');
  } else {
    log('❌ هناك مشاكل كبيرة تحتاج للإصلاح.', 'red');
    log('راجع الاختبارات الفاشلة أعلاه.\n', 'red');
  }
  
  process.exit(failedTests > 0 ? 1 : 0);
}

// تشغيل الاختبارات
log('🧪 سكريبت اختبار التحسينات', 'cyan');
log(`🌐 API URL: ${API_URL}\n`, 'cyan');

runTests().catch(error => {
  log('\n❌ خطأ في تشغيل الاختبارات:', 'red');
  console.error(error);
  process.exit(1);
});
