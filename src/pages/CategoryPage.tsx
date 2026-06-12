import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowUpDown } from 'lucide-react';
import articlesData from '../data/news.json';
import ArticleCard from '../components/ArticleCard';
import SeoTags from '../components/SeoTags';

export default function CategoryPage() {
  const { name } = useParams();
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'views'>('latest');
  const [filteredArticles, setFilteredArticles] = useState<typeof articlesData>([]);

  // Map route slugs to database category strings
  const getCategoryName = (paramName: string) => {
    const slug = paramName.toLowerCase();
    switch (slug) {
      case 'politics':
        return 'Politics';
      case 'economy':
        return 'Economy';
      case 'humanitarian':
        return 'Humanitarian Affairs';
      case 'international':
        return 'International Relations';
      case 'technology':
        return 'Technology';
      case 'sports':
        return 'Sports';
      case 'culture':
        return 'Culture';
      default:
        return '';
    }
  };

  const dbCategoryName = getCategoryName(name || '');

  // Category descriptive subtitle to give the page a custom editorial vibe
  const getCategorySubtitle = (catName: string) => {
    switch (catName) {
      case 'Politics':
        return 'National governance, policy reforms, legal debates, and regional security reports from Sudan.';
      case 'Economy':
        return 'Trade dynamics, agricultural yields, currency stability, gold mining updates, and investments.';
      case 'Humanitarian Affairs':
        return 'Reports on displacement assistance, health updates, emergency response operations, and aid corridors.';
      case 'International Relations':
        return 'Bilateral treaties, Red Sea security initiatives, AU missions, and global support pacts for Sudan.';
      case 'Technology':
        return 'Fostering digital growth, banking innovations, offline systems, and startup ecosystems in Sudan.';
      case 'Sports':
        return 'CAF Champions League campaigns, athletics development, and traditional Sudanese wrestling.';
      case 'Culture':
        return 'A celebration of Sufi traditions, literary reviews, contemporary art, and archaeological discoveries.';
      default:
        return 'Independent reporting and contextual analysis on the most pressing issues in Sudan.';
    }
  };

  useEffect(() => {
    if (dbCategoryName) {
      let result = articlesData.filter(
        (a) => a.category.toLowerCase() === dbCategoryName.toLowerCase()
      );

      // Apply sorting
      if (sortBy === 'latest') {
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      } else if (sortBy === 'oldest') {
        result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      } else if (sortBy === 'views') {
        result.sort((a, b) => b.views - a.views);
      }

      setFilteredArticles(result);
    } else {
      setFilteredArticles([]);
    }
  }, [dbCategoryName, sortBy]);

  // Sidebar trending articles
  const trendingArticles = [...articlesData]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (!dbCategoryName) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="font-headline font-black text-3xl text-brand-dark">Category Not Found</h2>
        <p className="font-body text-brand-muted">
          The news section you are attempting to view does not exist. Please check the spelling or return to the main lobby.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-brand-red hover:bg-brand-dark text-white font-ui font-bold text-xs uppercase tracking-wider transition-colors duration-200"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dynamic Metadata SEO sync */}
      <SeoTags
        title={`${dbCategoryName} News & Reports`}
        description={getCategorySubtitle(dbCategoryName)}
      />

      {/* Category Header Bar */}
      <div className="border-b-4 border-brand-dark pb-6 mb-8">
        <div className="flex items-center space-x-2 text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
          <Link to="/" className="hover:text-brand-red transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-brand-red">{dbCategoryName}</span>
        </div>
        <h1 className="font-headline font-black text-4xl sm:text-5xl md:text-6xl text-brand-dark uppercase tracking-tight">
          {dbCategoryName}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-brand-muted font-body max-w-4xl">
          {getCategorySubtitle(dbCategoryName)}
        </p>
      </div>

      {/* Main Grid: Articles feed & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Columns (2/3 Width): Sort control & Articles List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sorting panel */}
          <div className="flex justify-between items-center py-2.5 border-b border-brand-border/60 text-xs font-ui">
            <span className="font-bold text-brand-muted uppercase tracking-wider">
              Showing {filteredArticles.length} reports
            </span>
            
            <div className="flex items-center space-x-3">
              <span className="text-brand-muted flex items-center">
                <ArrowUpDown className="h-3 w-3 mr-1" /> Sort:
              </span>
              <button
                onClick={() => setSortBy('latest')}
                className={`font-semibold uppercase tracking-wider hover:text-brand-red transition-colors ${
                  sortBy === 'latest' ? 'text-brand-red underline decoration-2 underline-offset-4' : 'text-brand-dark'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortBy('oldest')}
                className={`font-semibold uppercase tracking-wider hover:text-brand-red transition-colors ${
                  sortBy === 'oldest' ? 'text-brand-red underline decoration-2 underline-offset-4' : 'text-brand-dark'
                }`}
              >
                Oldest
              </button>
              <button
                onClick={() => setSortBy('views')}
                className={`font-semibold uppercase tracking-wider hover:text-brand-red transition-colors ${
                  sortBy === 'views' ? 'text-brand-red underline decoration-2 underline-offset-4' : 'text-brand-dark'
                }`}
              >
                Popularity
              </button>
            </div>
          </div>

          {/* Articles list */}
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-brand-muted font-body">
              There are currently no reports filed under this section. Check back soon for updates.
            </div>
          ) : (
            <div className="divide-y divide-brand-border/60">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} layout="horizontal" />
              ))}
            </div>
          )}

        </div>

        {/* Right Column (1/3 Width): Sidebar */}
        <div className="space-y-8 lg:pl-6 lg:border-l border-brand-border/60">
          
          {/* Section Editors list */}
          <div className="border border-brand-border/80 p-5 bg-brand-bgMuted">
            <h3 className="font-headline font-bold text-base text-brand-dark border-b border-brand-border pb-2 mb-3">
              Section Desk
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed font-ui">
              Our {dbCategoryName} desk is headed by senior foreign correspondents on-site in Khartoum and Port Sudan. Send reporting pitches, letters to the editor, or corrections to the desk email.
            </p>
            <div className="mt-4 text-xs font-bold font-ui text-brand-red">
              <span className="block">Lead: Mohamed El-Fatih</span>
              <span className="text-brand-muted font-normal lowercase">desk.editor@sudantimes.news</span>
            </div>
          </div>

          {/* Sticky Trending Panel */}
          <div className="sticky top-6">
            <h3 className="font-headline font-bold text-lg uppercase border-b-2 border-brand-dark pb-2 mb-4">
              Most Read
            </h3>
            <div className="divide-y divide-brand-border/60">
              {trendingArticles.map((art) => (
                <div key={art.id} className="py-3.5 first:pt-0 last:pb-0">
                  <span className="text-[9px] font-ui font-black uppercase text-brand-red tracking-widest block mb-0.5">
                    {art.category}
                  </span>
                  <Link 
                    to={`/article/${art.slug}`} 
                    className="group"
                  >
                    <h4 className="font-headline font-bold text-sm text-brand-dark group-hover:text-brand-red transition-colors leading-snug">
                      {art.title}
                    </h4>
                  </Link>
                  <p className="text-[10px] text-brand-muted mt-1">
                    {new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {art.views.toLocaleString()} views
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
