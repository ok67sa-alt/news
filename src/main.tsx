import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// تسجيل Service Worker للـ Caching (فقط في Production)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration.scope);
        
        // التحقق من وجود تحديثات كل 60 دقيقة
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
        
        // التعامل مع التحديثات
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // إعلام المستخدم بوجود تحديث
                console.log('🔄 New version available! Refresh to update.');
                
                // يمكن إضافة notification هنا للمستخدم
                // أو تحديث تلقائي
                if (confirm('تحديث جديد متاح. هل تريد إعادة تحميل الصفحة؟')) {
                  newWorker.postMessage({ action: 'skipWaiting' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
    
    // إعادة التحميل عند تنشيط Service Worker جديد
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker controller changed, reloading...');
      window.location.reload();
    });
  });
}

// إضافة أزرار للتحكم في الـ Cache (للمطورين فقط)
if (import.meta.env.DEV) {
  // @ts-ignore
  window.clearServiceWorkerCache = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.active?.postMessage({ action: 'clearCache' });
        console.log('🧹 Cache clearing requested');
      }
    }
  };
  
  console.log('🛠️  Dev Mode: Use window.clearServiceWorkerCache() to clear cache');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
