import gumImg from '../gum.jpg';
import hilalImg from '../hilal.jpg';
import pyraImg from '../pyra.jpg';
import omdImg from '../omd.jpg';
import oilImg from '../oil.jpg';
import sustImg from '../sust.jpg';
import wrstImg from '../wrst.jpg';
import mrkImg from '../mrk.jpg';
import sntImg from '../snt.jpeg';
import sttImg from '../stt.jpg';
import chsImg from '../chs.jpg';
import bskImg from '../bsk.jpeg';
import afuImg from '../afu.jpeg';

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

/**
 * Resolves an image path string to either a remote URL or a bundled local image asset.
 * If no image is provided but a video URL exists, tries to get video thumbnail.
 * If video file is uploaded, creates a video thumbnail element.
 * Works with full URLs or relative paths pointing to the files in src (e.g. "gum.jpg", "src/gum.jpg", "/src/gum.jpg").
 */
export function getImageUrl(imageVar: any, videoUrl?: string | null, videoFile?: string | null): string {
  // If no image but video file exists, return the video file path (will be handled by component)
  if (!imageVar && videoFile) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return videoFile.startsWith('http') ? videoFile : `${API_URL}${videoFile}`;
  }

  // If no image but video URL exists, try to get video thumbnail
  if (!imageVar && videoUrl) {
    const thumbnail = getVideoThumbnail(videoUrl);
    if (thumbnail) return thumbnail;
  }

  if (!imageVar) {
    // Return placeholder for empty images
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${API_URL}/placeholder.svg`;
  }

  let imagePath = '';
  if (typeof imageVar === 'string') {
    imagePath = imageVar;
  } else if (imageVar && typeof imageVar === 'object') {
    imagePath = imageVar.url || '';
  }

  if (!imagePath) {
    // Try video file as fallback
    if (videoFile) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      return videoFile.startsWith('http') ? videoFile : `${API_URL}${videoFile}`;
    }
    // Try video thumbnail as fallback
    if (videoUrl) {
      const thumbnail = getVideoThumbnail(videoUrl);
      if (thumbnail) return thumbnail;
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${API_URL}/placeholder.svg`;
  }
  
  if (imagePath.startsWith('http')) return imagePath;

  if (imagePath.startsWith('/uploads')) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${API_URL}${imagePath}`;
  }

  const filename = imagePath.split('/').pop() || '';

  switch (filename) {
    case 'gum.jpg':
      return gumImg;
    case 'hilal.jpg':
      return hilalImg;
    case 'pyra.jpg':
      return pyraImg;
    case 'omd.jpg':
      return omdImg;
    case 'oil.jpg':
      return oilImg;
    case 'sust.jpg':
    case 'sust.jpeg':
      return sustImg;
    case 'wrst.jpg':
      return wrstImg;
    case 'mrk.jpg':
      return mrkImg;
    case 'snt.jpeg':
      return sntImg;
    case 'stt.jpg':
      return sttImg;
    case 'chs.jpg':
      return chsImg;
    case 'bsk.jpeg':
      return bskImg;
    case 'afu.jpeg':
      return afuImg;
    default:
      // If unrecognized, try video file or video thumbnail or return placeholder
      if (videoFile) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        return videoFile.startsWith('http') ? videoFile : `${API_URL}${videoFile}`;
      }
      if (videoUrl) {
        const thumbnail = getVideoThumbnail(videoUrl);
        if (thumbnail) return thumbnail;
      }
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      return `${API_URL}/placeholder.svg`;
  }
}

