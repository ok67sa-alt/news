interface VideoEmbedProps {
  url?: string;
  videoFile?: string;
  className?: string;
}

function isVideoFile(path: string | null | undefined): boolean {
  if (!path) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
}

export default function VideoEmbed({ url, videoFile, className = '' }: VideoEmbedProps) {
  
  // Extract video ID and platform
  const getEmbedUrl = (videoUrl: string): { embedUrl: string; platform: string } | null => {
    try {
      // 1. YouTube
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        let videoId: string | null = null;
        try {
          const urlObj = new URL(videoUrl);
          if (urlObj.hostname.includes('youtu.be')) {
            videoId = urlObj.pathname.slice(1);
          } else if (urlObj.pathname.startsWith('/shorts/')) {
            videoId = urlObj.pathname.split('/')[2];
          } else if (urlObj.pathname.startsWith('/embed/')) {
            videoId = urlObj.pathname.split('/')[2];
          } else {
            videoId = urlObj.searchParams.get('v');
          }
        } catch {
          // fallback to regex
          const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
          if (match) videoId = match[1];
        }

        if (videoId && videoId.length === 11) {
          return {
            embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
            platform: 'youtube'
          };
        }
      }

      // 2. Facebook
      if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch') || videoUrl.includes('fb.com')) {
        return {
          embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=0&width=560`,
          platform: 'facebook'
        };
      }

      // 3. Twitter/X
      const twitterMatch = videoUrl.match(/(?:twitter\.com|x\.com)\/.*\/status\/(\d+)/i);
      if (twitterMatch) {
        return {
          embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${twitterMatch[1]}&theme=light`,
          platform: 'twitter'
        };
      }

      // 4. Direct video files (if they start with http/https and end with video extension)
      const isDirectVideo = isVideoFile(videoUrl);
      if (isDirectVideo) {
        return {
          embedUrl: videoUrl,
          platform: 'direct'
        };
      }

      // 5. Existing embeds
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

  const videoData = url ? getEmbedUrl(url) : null;
  
  // If video file is provided or the URL is a direct video link, use HTML5 video player
  const directVideoUrl = videoFile || (videoData?.platform === 'direct' ? videoData.embedUrl : null);
  
  if (directVideoUrl) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const videoSrc = directVideoUrl.startsWith('http') ? directVideoUrl : `${API_URL}${directVideoUrl}`;
    
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
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (!url) return null;

  if (!videoData) {
    return (
      <div className={`bg-gray-100 border border-gray-300 rounded p-4 text-center ${className}`}>
        <p className="text-sm text-gray-600">
          Invalid video link. Please provide a valid link from YouTube, Facebook, or Twitter/X.
        </p>
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
