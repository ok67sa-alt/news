/**
 * Service Worker للـ Caching - استراتيجية محسّنة
 * يخزن فقط الملفات الثابتة (CSS, JS, Images, Fonts)
 * ولا يخزن API أو المحتوى الديناميكي
 */

const CACHE_VERSION = 'v2';
const STATIC_CACHE_NAME = `sudan-news-static-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `sudan-news-images-${CACHE_VERSION}`;

// الملفات الثابتة التي يتم تخزينها عند التثبيت
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
];

// أنماط الملفات التي يجب تخزينها
const CACHEABLE_EXTENSIONS = [
  '.js',
  '.css',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico'
];

// ===== تثبيت Service Worker =====
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// ===== تفعيل Service Worker =====
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => {
            // حذف الـ Cache القديم فقط
            return name.startsWith('sudan-news-') && 
                   name !== STATIC_CACHE_NAME && 
                   name !== IMAGE_CACHE_NAME;
          })
          .map(name => {
            console.log('🗑️  Service Worker: Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// ===== معالجة الطلبات =====
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // ❌ لا تخزن API calls على الإطلاق
  if (url.pathname.startsWith('/api/')) {
    console.log('🔄 API Call (no cache):', url.pathname);
    return; // دع المتصفح يتعامل معها بشكل طبيعي
  }
  
  // ❌ لا تخزن طلبات POST/PUT/DELETE
  if (request.method !== 'GET') {
    return;
  }
  
  // ❌ لا تخزن صفحات المقالات الديناميكية
  if (url.pathname.startsWith('/article/')) {
    console.log('📄 Dynamic Article (no cache):', url.pathname);
    return;
  }
  
  // ✅ تخزين الصور
  if (isImage(url.pathname)) {
    event.respondWith(handleImageRequest(request));
    return;
  }
  
  // ✅ تخزين الملفات الثابتة (CSS, JS, Fonts)
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAssetRequest(request));
    return;
  }
  
  // ✅ تخزين الصفحات الأساسية (Homepage, Categories)
  if (isPageRequest(url.pathname)) {
    event.respondWith(handlePageRequest(request));
    return;
  }
  
  // Default: لا تخزن
  console.log('⏭️  No cache strategy:', url.pathname);
});

// ===== Helpers =====

/**
 * التحقق من كون الطلب صورة
 */
function isImage(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname);
}

/**
 * التحقق من كون الطلب ملف ثابت
 */
function isStaticAsset(pathname) {
  return CACHEABLE_EXTENSIONS.some(ext => pathname.endsWith(ext));
}

/**
 * التحقق من كون الطلب صفحة
 */
function isPageRequest(pathname) {
  // فقط الصفحات الأساسية
  return pathname === '/' || 
         pathname.startsWith('/category/') || 
         pathname === '/search' ||
         pathname === '/privacy' ||
         pathname === '/terms';
}

/**
 * استراتيجية Cache First للصور
 * (الصور نادراً ما تتغير)
 */
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('✅ Image from cache:', request.url);
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // تخزين الصورة للمستقبل
      cache.put(request, response.clone());
      console.log('💾 Image cached:', request.url);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Image fetch failed:', error);
    // إرجاع صورة placeholder إذا فشل التحميل
    return new Response('', { status: 404 });
  }
}

/**
 * استراتيجية Cache First للملفات الثابتة
 * (CSS, JS, Fonts نادراً ما تتغير)
 */
async function handleStaticAssetRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('✅ Static asset from cache:', request.url);
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
      console.log('💾 Static asset cached:', request.url);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Static asset fetch failed:', error);
    return new Response('', { status: 404 });
  }
}

/**
 * استراتيجية Network First للصفحات
 * (نريد أحدث محتوى دائماً، مع fallback للـ cache)
 */
async function handlePageRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  
  try {
    // محاولة جلب أحدث نسخة أولاً
    const response = await fetch(request);
    
    if (response.ok) {
      // تحديث الـ cache بأحدث نسخة
      cache.put(request, response.clone());
      console.log('🔄 Page updated in cache:', request.url);
    }
    
    return response;
  } catch (error) {
    // عند الفشل، استخدم النسخة المخزنة
    console.log('📡 Offline: using cached page:', request.url);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // إذا لم يكن هناك cache، اعرض صفحة offline
    const offlinePage = await cache.match('/offline.html');
    return offlinePage || new Response('Offline', { status: 503 });
  }
}

// ===== رسائل من الصفحة =====
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
      }).then(() => {
        console.log('🧹 All caches cleared');
      })
    );
  }
});
