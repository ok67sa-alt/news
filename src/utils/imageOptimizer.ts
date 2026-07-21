/**
 * Image Optimizer Utility
 * يوفر وظائف لتحسين تحميل الصور واستخدام WebP
 */

/**
 * التحقق من دعم المتصفح لـ WebP
 */
export const isWebPSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * تحويل مسار الصورة إلى WebP إذا كان مدعومًا
 */
export const getOptimizedImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '/placeholder.jpg';
  
  // إذا كانت الصورة من Cloudinary، استخدم التحويل التلقائي
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  
  // إذا كان المتصفح يدعم WebP، استخدم نسخة WebP
  if (isWebPSupported() && !imageUrl.endsWith('.webp')) {
    const webpUrl = imageUrl.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
    return webpUrl;
  }
  
  return imageUrl;
};

/**
 * الحصول على URL للصورة مع حجم محدد (responsive)
 */
export const getResponsiveImageUrl = (
  imageUrl: string | null | undefined,
  width: number
): string => {
  const optimizedUrl = getOptimizedImageUrl(imageUrl);
  
  // إذا كانت الصورة من Cloudinary
  if (optimizedUrl.includes('cloudinary.com')) {
    return optimizedUrl.replace('/upload/', `/upload/w_${width},c_scale/`);
  }
  
  return optimizedUrl;
};

/**
 * إنشاء srcset للصور المتجاوبة
 */
export const getImageSrcSet = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '';
  
  const widths = [320, 640, 960, 1280, 1920];
  
  return widths
    .map(width => `${getResponsiveImageUrl(imageUrl, width)} ${width}w`)
    .join(', ');
};

/**
 * Lazy load صورة مع placeholder
 */
export const lazyLoadImage = (
  imgElement: HTMLImageElement,
  src: string,
  placeholder: string = '/placeholder.jpg'
) => {
  imgElement.src = placeholder;
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = src;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );
    
    observer.observe(imgElement);
  } else {
    // Fallback للمتصفحات القديمة
    imgElement.src = src;
  }
};

/**
 * حساب حجم الصورة المناسب بناءً على حجم الشاشة
 */
export const getOptimalImageSize = (): number => {
  if (typeof window === 'undefined') return 1280;
  
  const width = window.innerWidth;
  
  if (width <= 640) return 640;
  if (width <= 960) return 960;
  if (width <= 1280) return 1280;
  return 1920;
};

/**
 * Preload صورة مهمة
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Preload مجموعة صور
 */
export const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(url => preloadImage(url)));
};

/**
 * ضغط الصورة قبل الرفع (للمحرر)
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
