import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAPI } from '../utils/api';
import { StrapiArticle } from '../types/api';

export default function BreakingTicker() {
  const [breakingArticles, setBreakingArticles] = useState<StrapiArticle[]>([]);

  useEffect(() => {
    fetchAPI('/articles', {
      'filters[breaking][$eq]': true,
      'populate': '*',
    })
      .then((data) => {
        if (Array.isArray(data)) {
          setBreakingArticles(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load breaking articles:', err);
      });
  }, []);

  if (breakingArticles.length === 0) return null;

  // Duplicate the array to ensure seamless infinite looping when moving across the screen
  const doubledArticles = [...breakingArticles, ...breakingArticles, ...breakingArticles];

  return (
    <div className="w-full bg-white text-brand-red border-b-2 border-gray-200 flex items-center h-8 overflow-hidden select-none">
      {/* High-visibility blinking badge */}
      <div className="bg-brand-red text-white text-[10px] font-ui font-black px-3 py-1.5 uppercase tracking-wider z-10 flex items-center shrink-0 h-full border-r-2 border-gray-200">
        <span className="animate-pulse mr-1">●</span> BREAKING
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative flex items-center overflow-hidden w-full h-full text-xs font-ui tracking-wide pl-4">
        <div className="animate-ticker flex items-center space-x-8">
          {doubledArticles.map((article, idx) => (
            <Link
              key={`${article.id}-${idx}`}
              to={`/article/${article.slug}`}
              className="hover:underline transition-colors flex items-center space-x-1 shrink-0 font-semibold text-brand-red hover:text-brand-dark"
            >
              <span className="font-black">›</span>
              <span className="whitespace-nowrap">{article.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
