import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { getImageUrl } from '../utils/imageResolver';
import { StrapiArticle } from '../types/api';

interface VideoCardProps {
  article: StrapiArticle;
}

export default function VideoCard({ article }: VideoCardProps) {
  const thumbnail = getImageUrl(article.image, article.videoUrl, article.videoFile);
  
  // Extract video duration from article if available (you can add this field)
  const duration = article.readTime || '2:47'; // Default placeholder

  return (
    <Link 
      href={`/article/${article.slug}`} 
      className="video-card"
    >
      <div className="video-thumbnail-wrapper">
        <img 
          src={thumbnail} 
          alt={article.title}
          className="video-thumbnail"
        />
        <div className="video-overlay">
          <button className="video-play-button" aria-label="Play video">
            <Play size={32} fill="white" />
          </button>
        </div>
        <div className="video-duration-badge">
          <Clock size={12} />
          <span>{duration}</span>
        </div>
        {article.breaking && (
          <div className="video-live-badge">
            LIVE
          </div>
        )}
      </div>
      <div className="video-card-content">
        <h3 className="video-card-title">{article.title}</h3>
        <p className="video-card-category">
          {typeof article.category === 'object' && article.category !== null 
            ? (article.category as any).name 
            : String(article.category || 'Video')}
        </p>
      </div>
    </Link>
  );
}
