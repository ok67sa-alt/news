import { Link } from 'react-router-dom';
import articlesData from '../data/news.json';

export default function BreakingTicker() {
  // Filter for breaking news articles
  const breakingArticles = articlesData.filter((article) => article.breaking);

  if (breakingArticles.length === 0) return null;

  // Duplicate the array to ensure seamless infinite looping when moving across the screen
  const doubledArticles = [...breakingArticles, ...breakingArticles, ...breakingArticles];

  return (
    <div className="w-full bg-brand-dark text-white border-b border-brand-dark flex items-center h-9 overflow-hidden select-none">
      {/* High-visibility blinking red badge */}
      <div className="bg-brand-red text-white text-[10px] font-ui font-black px-4 py-2 uppercase tracking-widest z-10 flex items-center shrink-0 h-full border-r border-brand-red relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-4 after:bg-brand-red after:rotate-12 after:translate-x-2">
        <span className="animate-pulse mr-1">●</span> Breaking News
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative flex items-center overflow-hidden w-full h-full text-[13px] font-ui tracking-wide">
        <div className="animate-ticker flex items-center space-x-16">
          {doubledArticles.map((article, idx) => (
            <Link
              key={`${article.id}-${idx}`}
              to={`/article/${article.slug}`}
              className="hover:text-brand-red hover:underline transition-colors flex items-center space-x-2 shrink-0 font-medium"
            >
              <span className="text-brand-red font-black text-sm">/</span>
              <span>{article.title}</span>
              <span className="text-xs text-gray-400 font-normal">({article.readTime})</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
