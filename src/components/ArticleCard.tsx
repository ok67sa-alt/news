import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye } from 'lucide-react';
import { getImageUrl } from '../utils/imageResolver';

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  views: number;
  image: string;
}

interface ArticleCardProps {
  article: Article;
  layout?: 'vertical' | 'horizontal' | 'minimal' | 'sidebar';
}

export default function ArticleCard({ article, layout = 'vertical' }: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Common metadata row
  const metaRow = (
    <div className="flex items-center space-x-3 text-[11px] font-ui text-brand-muted mt-1.5 flex-wrap gap-y-1">
      <span className="flex items-center space-x-1">
        <Calendar className="h-3 w-3" />
        <span>{formattedDate}</span>
      </span>
      <span>•</span>
      <span className="flex items-center space-x-1">
        <Clock className="h-3 w-3" />
        <span>{article.readTime}</span>
      </span>
      <span>•</span>
      <span className="flex items-center space-x-1">
        <Eye className="h-3 w-3" />
        <span>{article.views.toLocaleString()}</span>
      </span>
    </div>
  );

  // Minimal layout (text-only, compact)
  if (layout === 'minimal') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="py-3.5 border-b border-brand-border/60 last:border-b-0"
      >
        <span className="text-[10px] font-ui font-black uppercase text-brand-red tracking-widest block mb-1">
          {article.category}
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

  // Sidebar numbered list layout
  if (layout === 'sidebar') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-start py-3.5 border-b border-brand-border/60 last:border-b-0 gap-3"
      >
        <span className="font-headline text-2xl font-black text-brand-border select-none mt-1 min-w-[24px]">
          {String(article.id).padStart(2, '0')}
        </span>
        <div className="flex-1">
          <span className="text-[9px] font-ui font-bold uppercase text-brand-red tracking-wider block mb-0.5">
            {article.category}
          </span>
          <Link 
            to={`/article/${article.slug}`} 
            className="group block"
          >
            <h4 className="font-headline font-bold text-sm text-brand-dark group-hover:text-brand-red transition-colors leading-snug">
              {article.title}
            </h4>
          </Link>
          <div className="flex items-center space-x-2 text-[10px] font-ui text-brand-muted mt-1">
            <span>By {article.author}</span>
            <span>•</span>
            <span className="flex items-center space-x-0.5">
              <Eye className="h-2.5 w-2.5" />
              <span>{article.views.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Horizontal row layout
  if (layout === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 py-5 border-b border-brand-border/80 last:border-b-0 items-start"
      >
        {/* Thumbnail Image */}
        <Link 
          to={`/article/${article.slug}`} 
          className="w-full sm:w-1/3 md:w-1/4 aspect-[3/2] overflow-hidden bg-gray-100 block shrink-0 border border-brand-border"
        >
          <img
            src={getImageUrl(article.image)}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Content details */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-ui font-black uppercase text-brand-red tracking-widest">
              {article.category}
            </span>
            <span className="text-[10px] font-ui text-brand-muted">By {article.author}</span>
          </div>
          <Link 
            to={`/article/${article.slug}`} 
            className="group block"
          >
            <h3 className="font-headline font-bold text-lg sm:text-xl text-brand-dark group-hover:text-brand-red transition-colors leading-tight">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-brand-muted font-body leading-relaxed max-w-2xl">
            {article.excerpt}
          </p>
          {metaRow}
        </div>
      </motion.div>
    );
  }

  // Default Vertical block layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full bg-white border border-brand-border/40 hover:border-brand-border/80 transition-all p-3 sm:p-4 shadow-sm hover:shadow"
    >
      {/* Image Container */}
      <Link 
        to={`/article/${article.slug}`} 
        className="w-full aspect-[16/10] overflow-hidden bg-gray-100 block border border-brand-border/60"
      >
        <img
          src={getImageUrl(article.image)}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* Card Content details */}
      <div className="flex flex-col flex-1 pt-3">
        <div className="flex justify-between items-center text-[10px] font-ui font-bold tracking-widest text-brand-red uppercase mb-1">
          <span>{article.category}</span>
          <span className="text-brand-muted font-normal lowercase">by {article.author}</span>
        </div>
        <Link 
          to={`/article/${article.slug}`} 
          className="group block mb-1.5"
        >
          <h3 className="font-headline font-bold text-base sm:text-lg text-brand-dark group-hover:text-brand-red transition-colors leading-snug">
            {article.title}
          </h3>
        </Link>
        <p className="text-xs text-brand-muted font-body leading-relaxed mb-4 flex-grow line-clamp-3">
          {article.excerpt}
        </p>
        
        {/* Footer row metadata */}
        <div className="pt-2 border-t border-brand-border/50 mt-auto">
          {metaRow}
        </div>
      </div>
    </motion.div>
  );
}
