import { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import VideoCard from './VideoCard';
import { StrapiArticle } from '../types/api';

interface VideoSectionProps {
  videos: StrapiArticle[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!videos || videos.length === 0) return null;

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="video-section">
      <div className="video-section-container">
        <div className="video-header">
          <h2>Watch</h2>
          <ChevronRight size={32} />
        </div>
        
        <div className="video-carousel-wrapper">
          {videos.length > 3 && (
            <>
              <button 
                className="video-nav-button prev" 
                onClick={scrollLeft}
                aria-label="Previous videos"
              >
                <ChevronRight size={24} />
              </button>
              <button 
                className="video-nav-button next" 
                onClick={scrollRight}
                aria-label="Next videos"
              >
                <ChevronLeft size={24} />
              </button>
            </>
          )}
          
          <div className="video-carousel" ref={carouselRef}>
            {videos.map((video) => (
              <VideoCard key={video.id} article={video} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
