interface VideoEmbedProps {
  url?: string;
  videoFile?: string;
  className?: string;
}

export default function VideoEmbed({ url, videoFile, className = '' }: VideoEmbedProps) {
  // If video file is provided, use HTML5 video player
  if (videoFile) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const videoSrc = videoFile.startsWith('http') ? videoFile : `${API_URL}${videoFile}`;
    
    return (
      <div className={`relative w-full ${className}`}>
        <video 
          controls 
          className="w-full h-full rounded"
          style={{ maxHeight: '600px', backgroundColor: '#000' }}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc} type="video/webm" />
          <source src={videoSrc} type="video/ogg" />
          متصفحك لا يدعم تشغيل الفيديو
        </video>
      </div>
    );
  }

  if (!url) return null;

  // Extract video ID and platform
  const getEmbedUrl = (videoUrl: string): { embedUrl: string; platform: string } | null => {
    try {
      // YouTube patterns
      const youtubePatterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
      ];
      
      for (const pattern of youtubePatterns) {
        const match = videoUrl.match(pattern);
        if (match) {
          return {
            embedUrl: `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`,
            platform: 'youtube'
          };
        }
      }

      // Twitter/X video patterns
      const twitterPatterns = [
        /twitter\.com\/.*\/status\/(\d+)/,
        /x\.com\/.*\/status\/(\d+)/
      ];
      
      for (const pattern of twitterPatterns) {
        const match = videoUrl.match(pattern);
        if (match) {
          return {
            embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}&theme=light`,
            platform: 'twitter'
          };
        }
      }

      // Facebook video patterns - check if URL contains facebook.com or fb.watch
      if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch') || videoUrl.includes('fb.com')) {
        // Show a message instead of trying to embed (many FB videos can't be embedded)
        return {
          embedUrl: videoUrl, // We'll handle this specially
          platform: 'facebook-link'
        };
      }

      // If URL is already an embed URL, use it directly
      if (videoUrl.includes('youtube.com/embed/') || videoUrl.includes('facebook.com/plugins/video.php')) {
        return {
          embedUrl: videoUrl,
          platform: videoUrl.includes('youtube') ? 'youtube' : 'facebook'
        };
      }

      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };

  const videoData = getEmbedUrl(url);

  if (!videoData) {
    return (
      <div className={`bg-gray-100 border border-gray-300 rounded p-4 text-center ${className}`}>
        <p className="text-sm text-gray-600">
          رابط فيديو غير صالح. يرجى تقديم رابط صالح من YouTube أو Twitter/X.
        </p>
      </div>
    );
  }

  // Special handling for Facebook videos (show link instead of embed)
  if (videoData.platform === 'facebook-link') {
    return (
      <div className={`bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center ${className}`}>
        <div className="mb-3">
          <svg className="w-12 h-12 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        <p className="text-gray-700 mb-3 font-medium">
          فيديو Facebook - بعض الفيديوهات لا يمكن تضمينها بسبب إعدادات الخصوصية
        </p>
        <a 
          href={videoData.embedUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          مشاهدة على Facebook
        </a>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={videoData.embedUrl}
        className="absolute top-0 left-0 w-full h-full rounded border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title="Embedded video"
        scrolling="no"
        frameBorder="0"
        style={{ border: 'none', overflow: 'hidden' }}
      />
    </div>
  );
}
