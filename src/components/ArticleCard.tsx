import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye } from 'lucide-react';
import { getImageUrl, isVideoFile, hasMediaImage } from '../utils/imageResolver';
import { getAuthorName, getCategoryName } from '../utils/articleHelpers';

import { Article } from '../types/api';

interface ArticleCardProps {
  article: Article;
  layout?: 'vertical' | 'horizontal' | 'minimal' | 'sidebar';
}

export default function ArticleCard({ article, layout = 'vertical' }: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt || new Date()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const categoryName = getCategoryName(article);
  const authorName = getAuthorName(article);

  const metaRow = (
    <div className="flex items-center space-x-3 text-xs font-ui text-gray-500 mt-3 flex-wrap gap-y-1">
      <span className="flex items-center space-x-1">
        <Calendar className="h-3 w-3" />
        <span>{formattedDate}</span>
      </span>
      <span className="text-gray-300">•</span>
      <span className="flex items-center space-x-1">
        <Clock className="h-3 w-3" />
        <span>{article.readTime}</span>
      </span>
      <span className="text-gray-300">•</span>
      <span className="flex items-center space-x-1">
        <Eye className="h-3 w-3" />
        <span>{article.views?.toLocaleString() || 0}</span>
      </span>
    </div>
  );

  if (layout === 'minimal') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="py-3 border-b border-gray-200 last:border-b-0"
      >
        <span className="text-xs font-ui font-bold uppercase text-brand-red tracking-wide block mb-1">
          {categoryName}
        </span>
        <Link 
          to={`/article/${article.slug}`} 
          className="group block"
        >
          <h4 className="font-headline font-bold text-sm sm:text-base text-brand-dark group-hover:text-brand-red transition-colors leading-snug">
            {article.title}
          </h4>
        </Link>
        {metaRow}
      </motion.div>
    );
  }

  if (layout === 'sidebar') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-start py-3 border-b border-gray-200 last:border-b-0 gap-3"
      >
        <span className="font-headline text-2xl font-black text-gray-300 select-none mt-1 min-w-[32px]">
          {String(article.id).padStart(2, '0')}
        </span>
        <div className="flex-1">
          <span className="text-xs font-ui font-bold uppercase text-brand-red tracking-wider block mb-1">
            {categoryName}
          </span>
          <Link 
            href={`/article/${article.slug}`} 
            className="group block"
          >
            <h4 className="font-headline font-bold text-sm text-brand-dark group-hover:text-brand-red transition-colors leading-snug">
              {article.title}
            </h4>
          </Link>
          <div className="flex items-center space-x-2 text-xs font-ui text-gray-500 mt-1.5">
            <span>By {authorName}</span>
            <span>•</span>
            <span className="flex items-center space-x-0.5">
              <Eye className="h-2.5 w-2.5" />
              <span>{article.views?.toLocaleString() || 0}</span>
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (layout === 'horizontal') {
    const hasVideoOnly = !hasMediaImage(article.image) && (article.videoUrl || article.videoFile);
    const isUploadedVideo = article.videoFile && !article.videoUrl;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-200 last:border-b-0 items-start"
      >
        <Link 
          to={`/article/${article.slug}`} 
          className="w-full sm:w-1/3 md:w-1/4 aspect-video overflow-hidden bg-black block shrink-0 relative group"
        >
          {hasVideoOnly && isUploadedVideo ? (
            <video 
              className="w-full h-full object-cover"
              preload="metadata"
            >
              <source src={getImageUrl(article.image, article.videoUrl, article.videoFile)} type="video/mp4" />
              <source src={getImageUrl(article.image, article.videoUrl, article.videoFile)} type="video/webm" />
            </video>
          ) : (
            <img
              src={getImageUrl(article.image, article.videoUrl, article.videoFile)}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-out"
            />
          )}
          {hasVideoOnly && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-brand-red ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </Link>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-ui font-bold uppercase text-white bg-brand-blue px-2 py-1 rounded w-fit">
              {categoryName}
            </span>
            <span className="text-xs font-ui text-gray-500">By {authorName}</span>
          </div>
          <Link 
            href={`/article/${article.slug}`} 
            className="group block"
          >
            <h3 className="font-headline font-bold text-base sm:text-lg text-brand-dark group-hover:text-brand-red transition-colors leading-tight">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl line-clamp-2">
            {article.excerpt}
          </p>
          {metaRow}
        </div>
      </motion.div>
    );
  }

  const hasVideoOnly = !hasMediaImage(article.image) && (article.videoUrl || article.videoFile);
  const isUploadedVideo = article.videoFile && !article.videoUrl;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-all duration-200"
    >
      <Link 
        to={`/article/${article.slug}`} 
        className="w-full aspect-video overflow-hidden bg-black block relative group"
      >
        {hasVideoOnly && isUploadedVideo ? (
          <video 
            className="w-full h-full object-cover"
            preload="metadata"
          >
            <source src={getImageUrl(article.image, article.videoUrl, article.videoFile)} type="video/mp4" />
            <source src={getImageUrl(article.image, article.videoUrl, article.videoFile)} type="video/webm" />
          </video>
        ) : (
          <img
            src={getImageUrl(article.image, article.videoUrl, article.videoFile)}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 ease-out"
          />
        )}
        {hasVideoOnly && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-brand-red ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <span className="text-xs font-bold tracking-wider text-white bg-brand-blue px-2 py-1 rounded inline-block w-fit mb-2">
          {categoryName}
        </span>
        
        <Link 
          href={`/article/${article.slug}`} 
          className="group block mb-2"
        >
          <h3 className="font-headline font-bold text-lg text-brand-dark group-hover:text-brand-red transition-colors leading-snug line-clamp-3">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-3 flex-grow line-clamp-2">
          {article.excerpt}
        </p>
        
        <div className="pt-3 border-t border-gray-100 mt-auto">
          {metaRow}
        </div>
      </div>
    </motion.div>
  );
}
