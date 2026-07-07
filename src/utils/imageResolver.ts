/**
 * Check if a file path is a video
 */
export function isVideoFile(path: string | null | undefined): boolean {
  if (!path) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
}

/**
 * Extract video thumbnail from video URL
 */
export function getVideoThumbnail(videoUrl: string | null | undefined): string | null {
  if (!videoUrl) return null;

  try {
    // YouTube thumbnail
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of youtubePatterns) {
      const match = videoUrl.match(pattern);
      if (match) {
        // Use high quality thumbnail
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
      }
    }

    // Facebook doesn't provide direct thumbnails easily, return null
    // For Facebook videos, we'll use the placeholder
    if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
      return null;
    }

    return null;
  } catch (error) {
    console.error('Error extracting video thumbnail:', error);
    return null;
  }
}

// Map of legacy image filenames to their hashed names in backend/public/assets
const imageMap: Record<string, string> = {
  'gum.jpg': '/assets/gum-BsWUBtpT.jpg',
  'hilal.jpg': '/assets/hilal-DZecT2m-.jpg',
  'pyra.jpg': '/assets/pyra-BW848c_A.jpg',
  'omd.jpg': '/assets/omd-DRhSuUge.jpg',
  'oil.jpg': '/assets/oil-Dbu7mvRR.jpg',
  'sust.jpg': '/assets/sust-BJJ6kvGw.jpg',
  'sust.jpeg': '/assets/sust-BJJ6kvGw.jpg',
  'wrst.jpg': '/assets/wrst-D1T3Nlju.jpg',
  'mrk.jpg': '/assets/mrk-CqISkQd0.jpg',
  'snt.jpeg': '/assets/snt-CzsdgBHm.jpeg',
  'stt.jpg': '/assets/stt-CoTeKEHH.jpg',
  'chs.jpg': '/assets/chs-DLtKLzfb.jpg',
  'bsk.jpeg': '/assets/bsk-BlqnsMzq.jpeg',
  'afu.jpeg': '/assets/afu-Bf4SIFvB.jpeg',
};

/** Extract a media URL from Strapi v5 arrays, objects, or plain strings. */
function extractMediaPath(imageVar: any): string {
  if (!imageVar) return '';
  if (typeof imageVar === 'string') return imageVar;
  if (Array.isArray(imageVar)) return imageVar[0]?.url || '';
  if (typeof imageVar === 'object') {
    if (imageVar.url) return imageVar.url;
    // Handle oddly normalized array-like objects
    if (imageVar[0]?.url) return imageVar[0].url;
  }
  return '';
}

/** Returns true when the article has a usable image (handles Strapi v5 arrays). */
export function hasMediaImage(imageVar: any): boolean {
  return Boolean(extractMediaPath(imageVar));
}

/**
 * Resolves an image path string to either a remote URL or a bundled local image asset.
 * If no image is provided but a video URL exists, tries to get video thumbnail.
 * If video file is uploaded, creates a video thumbnail element.
 * Works with full URLs or relative paths pointing to the files in src (e.g. "gum.jpg", "src/gum.jpg", "/src/gum.jpg").
 */
export function getImageUrl(imageVar: any, videoUrl?: string | null, videoFile?: string | null): string {
  const API_URL = window.location.origin;
  const STRAPI_URL = import.meta.env.VITE_STRAPI_API_URL || '';

  // If no image but video file exists, return the video file path (will be handled by component)
  if (!imageVar && videoFile) {
    return videoFile.startsWith('http') ? videoFile : `${API_URL}${videoFile}`;
  }

  // If no image but video URL exists, try to get video thumbnail
  if (!imageVar && videoUrl) {
    const thumbnail = getVideoThumbnail(videoUrl);
    if (thumbnail) return thumbnail;
  }

  if (!imageVar) {
    // Return placeholder for empty images
    return `${API_URL}/placeholder.svg`;
  }

  const imagePath = extractMediaPath(imageVar);

  if (!imagePath) {
    // Try video file as fallback
    if (videoFile) {
      return videoFile.startsWith('http') ? videoFile : `${API_URL}${videoFile}`;
    }
    // Try video thumbnail as fallback
    if (videoUrl) {
      const thumbnail = getVideoThumbnail(videoUrl);
      if (thumbnail) return thumbnail;
    }
    return `${API_URL}/placeholder.svg`;
  }
  
  if (imagePath.startsWith('http')) return imagePath;

  if (imagePath.startsWith('/uploads')) {
    const mediaBase = STRAPI_URL || API_URL;
    return `${mediaBase}${imagePath}`;
  }

  const filename = imagePath.split('/').pop() || '';

  // Check if filename exists in our image map
  if (imageMap[filename]) {
    return imageMap[filename];
  }

  // If unrecognized, try video file or video thumbnail or return placeholder
  if (videoFile) {
    return videoFile.startsWith('http') ? videoFile : `${API_URL}${videoFile}`;
  }
  if (videoUrl) {
    const thumbnail = getVideoThumbnail(videoUrl);
    if (thumbnail) return thumbnail;
  }
  return `${API_URL}/placeholder.svg`;
}

