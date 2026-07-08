import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ChevronRight, TrendingUp } from 'lucide-react';
// Front-end now reads articles from backend via `fetchAPI`
import ArticleCard from '../components/ArticleCard';
import VideoSection from '../components/VideoSection';
import SeoTags from '../components/SeoTags';
import { getImageUrl, hasMediaImage } from '../utils/imageResolver';
import { fetchAPI } from '../utils/api';
import { getAuthorName, getCategoryName } from '../utils/articleHelpers';
import { StrapiArticle } from '../types/api';

export default function Home() {
  const [articles, setArticles] = useState<StrapiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleLatestCount, setVisibleLatestCount] = useState(8);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    fetchAPI('/articles', {
      populate: '*',
      sort: 'publishedAt:desc',
      'pagination[limit]': 100,
    })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setArticles(data);
        else setArticles([]);
      })
      .catch((err) => {
        console.error('Failed to load articles from API:', err);
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 1. Separate videos from regular articles
  const videoArticles = articles.filter((a) => a.videoUrl || a.videoFile);
  const regularArticles = articles.filter((a) => !a.videoUrl && !a.videoFile);

  // 2. Get all hero articles (sorted by most recent)
  const heroArticles = [...regularArticles]
    .filter((a) => a.hero === true) // Only articles explicitly marked as hero
    .sort((a, b) => new Date(b.publishedAt || Date.now()).getTime() - new Date(a.publishedAt || Date.now()).getTime());
  
  // Fallback: if no hero articles, use the most viewed featured article
  const fallbackHero = heroArticles.length === 0 
    ? [...regularArticles].filter((a) => a.featured).sort((a, b) => b.views - a.views)[0]
    : null;
  
  // Current hero article for display
  const heroArticle = heroArticles[currentHeroIndex] || fallbackHero;
  
  // Auto-rotate hero carousel every 2 seconds
  useEffect(() => {
    if (heroArticles.length <= 1) return; // No need to rotate if only one hero
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroArticles.length);
    }, 2000); // 2 seconds
    
    return () => clearInterval(interval);
  }, [heroArticles.length]);
  
  console.log('🎯 Hero Articles:', heroArticles.length, heroArticles.map(a => a.title));
  console.log('🎯 Fallback Hero:', fallbackHero?.title || 'None');

  // 3. Top Stories (Most read articles excluding the hero, sorted by views descending)
  const topStories = [...regularArticles]
    .filter((a) => a.id !== heroArticle?.id) // Exclude hero article
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);
  
  console.log('📊 Top Stories (6 most viewed):', topStories.map(a => ({ 
    id: a.id, 
    title: a.title.substring(0, 40), 
    views: a.views 
  })));

  // 4. Trending News (Top 10 most viewed regular articles)
  const trendingArticles = [...regularArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  console.log('📈 Trending (10 most viewed):', trendingArticles.map(a => ({ 
    id: a.id, 
    title: a.title.substring(0, 40), 
    views: a.views 
  })));

  // 5. Retrieve latest 4 articles for specific categories (excluding videos)
  const getCategoryArticles = (catName: string) => {
    return [...regularArticles]
      .filter((a) => {
        const categoryName = getCategoryName(a);
        return categoryName?.toLowerCase() === catName.toLowerCase();
      })
      .sort((a, b) => new Date(b.publishedAt || Date.now()).getTime() - new Date(a.publishedAt || Date.now()).getTime())
      .slice(0, 4);
  };

  const politicsArticles = getCategoryArticles('Politics');
  const economyArticles = getCategoryArticles('Economy');
  const techArticles = getCategoryArticles('Technology');
  const sportsArticles = getCategoryArticles('Sports');
  const cultureArticles = getCategoryArticles('Culture');

  // 5. Latest News (All regular articles sorted by date descending)
  const latestArticles = [...regularArticles]
    .sort((a, b) => new Date(b.publishedAt || Date.now()).getTime() - new Date(a.publishedAt || Date.now()).getTime());

  const displayedLatest = latestArticles.slice(0, visibleLatestCount);

  const loadMoreLatest = () => {
    setVisibleLatestCount((prev) => Math.min(prev + 8, latestArticles.length));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-gray-200 rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!heroArticle) return null;

  const formattedHeroDate = new Date(heroArticle.publishedAt || Date.now()).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SeoTags 
        title="Sudan Times | Independent Sudanese News & Analysis" 
        description="Breaking news, in-depth reports, political analysis, economic briefs, humanitarian updates, culture, and sports coverage from Sudan."
      />

      {/* ================= HERO SECTION ================= */}
      <section className="pb-10 border-b border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left & Center: Main Hero Story with Carousel */}
          <div className="lg:col-span-2 overflow-hidden bg-white shadow-sm">
            <div className="flex items-center justify-between p-4 bg-brand-blue border-b border-gray-200">
              <span className="text-xs font-ui font-black uppercase text-white tracking-widest">
                FEATURED COVERAGE
              </span>
              {heroArticles.length > 1 && (
                <div className="flex items-center space-x-2">
                  {heroArticles.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentHeroIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentHeroIndex 
                          ? 'w-8 bg-white' 
                          : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to hero article ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <Link to={`/article/${heroArticle.slug}`} className="group block">
              <div className="w-full aspect-[16/9] overflow-hidden bg-black relative border-b border-gray-200">
                {!hasMediaImage(heroArticle.image) && heroArticle.videoFile && !heroArticle.videoUrl ? (
                  <video 
                    className="w-full h-full object-cover transition-opacity duration-500"
                    preload="metadata"
                    key={heroArticle.id}
                  >
                    <source src={getImageUrl(heroArticle.image, heroArticle.videoUrl, heroArticle.videoFile)} type="video/mp4" />
                    <source src={getImageUrl(heroArticle.image, heroArticle.videoUrl, heroArticle.videoFile)} type="video/webm" />
                  </video>
                ) : (
                  <img
                    key={heroArticle.id}
                    src={getImageUrl(heroArticle.image, heroArticle.videoUrl, heroArticle.videoFile)}
                    alt={heroArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                )}
                {!hasMediaImage(heroArticle.image) && (heroArticle.videoUrl || heroArticle.videoFile) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                      <svg className="w-10 h-10 text-brand-red ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                {heroArticles.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-ui font-bold">
                    {currentHeroIndex + 1} / {heroArticles.length}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="font-headline font-black text-3xl sm:text-4xl text-brand-dark group-hover:text-brand-red transition-colors leading-tight mb-4">
                  {heroArticle.title}
                </h2>
                <p className="text-base text-gray-600 font-body leading-relaxed mb-4">
                  {heroArticle.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs font-ui text-gray-500 pt-3 border-t border-gray-200 flex-wrap gap-3">
                  <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                    <span className="font-bold text-brand-dark">By {getAuthorName(heroArticle)}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formattedHeroDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{heroArticle.readTime}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right side: Editor's Picks */}
          <div className="bg-white shadow-sm">
            <div className="p-4 bg-brand-red border-b border-gray-200">
              <h3 className="font-headline font-bold text-xl uppercase text-white tracking-tight">
                Editor's Picks
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {articles
                .filter((a) => a.featured && !a.hero)
                .slice(0, 4)
                .map((article) => (
                  <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <span className="text-[10px] font-ui font-black uppercase text-white bg-brand-red px-2 py-0.5 tracking-widest">
                      {getCategoryName(article)}
                    </span>
                    <Link 
                      to={`/article/${article.slug}`} 
                      className="group block mt-2"
                    >
                      <h4 className="font-headline font-bold text-base text-brand-dark group-hover:text-brand-red transition-colors leading-tight">
                        {article.title}
                      </h4>
                    </Link>
                    <div className="flex items-center space-x-3 text-[11px] font-ui text-gray-500 mt-2">
                      <span>By {getAuthorName(article)}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-0.5">
                        <Eye className="h-3 w-3" />
                        <span>{article.views.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="p-5 bg-brand-blue text-white text-center border-t border-gray-200">
              <h5 className="font-headline font-bold text-sm tracking-tight uppercase mb-2">Support Independent Journalism</h5>
              <p className="text-xs leading-relaxed opacity-90">
                Sudan Times delivers impartial news from the ground.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TOP STORIES SECTION ================= */}
      <section className="py-12">
        <div className="border-b-2 border-brand-dark pb-3 mb-8">
          <div className="flex items-end justify-between">
            <h3 className="font-headline font-black text-3xl tracking-tight text-brand-dark uppercase">
              Top Stories
            </h3>
            <span className="text-[10px] font-ui font-bold text-gray-500 uppercase tracking-wider mb-1">
              Most Viewed
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topStories.map((article) => (
            <ArticleCard key={article.id} article={article} layout="vertical" />
          ))}
        </div>
      </section>

      {/* ================= VIDEO SECTION ================= */}
      {videoArticles.length > 0 && <VideoSection videos={videoArticles} />}

      {/* ================= MULTI-COLUMN CONTENT FEED ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-12 border-t border-gray-200">
        
        {/* Left Column (2/3 Width): Category Blocks and Latest Feed */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* 1. Politics Block */}
          {politicsArticles.length > 0 && (
            <div className="bg-white shadow-sm">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b-2 border-brand-dark">
                <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                  Politics
                </h3>
                <Link to="/category/politics" className="text-[11px] font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                  All Politics <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-gray-200">
                {politicsArticles.slice(0, 4).map((art, idx) => (
                  <div key={art.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <Link to={`/article/${art.slug}`} className="group block space-y-3">
                      <div className="w-full aspect-video overflow-hidden bg-black">
                        <img
                          src={getImageUrl(art.image, art.videoUrl, art.videoFile)}
                          alt={art.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-headline font-bold text-base text-brand-dark group-hover:text-brand-red transition-colors leading-tight line-clamp-3">
                        {art.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] font-ui text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{art.readTime}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{art.views?.toLocaleString() || 0}</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Economy Block */}
          {economyArticles.length > 0 && (
            <div className="bg-white shadow-sm">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b-2 border-brand-dark">
                <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                  Economy
                </h3>
                <Link to="/category/economy" className="text-[11px] font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                  All Economy <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-gray-200">
                {economyArticles.slice(0, 4).map((art) => (
                  <div key={art.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <Link to={`/article/${art.slug}`} className="group block space-y-3">
                      <div className="w-full aspect-video overflow-hidden bg-black">
                        <img
                          src={getImageUrl(art.image, art.videoUrl, art.videoFile)}
                          alt={art.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-headline font-bold text-base text-brand-dark group-hover:text-brand-red transition-colors leading-tight line-clamp-3">
                        {art.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] font-ui text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{art.readTime}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{art.views?.toLocaleString() || 0}</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Technology Block */}
          {techArticles.length > 0 && (
            <div className="bg-white shadow-sm">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b-2 border-brand-dark">
                <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                  Technology
                </h3>
                <Link to="/category/technology" className="text-[11px] font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                  All Tech <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-gray-200">
                {techArticles.slice(0, 4).map((art) => (
                  <div key={art.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <Link to={`/article/${art.slug}`} className="group block space-y-3">
                      <div className="w-full aspect-video overflow-hidden bg-black">
                        <img
                          src={getImageUrl(art.image, art.videoUrl, art.videoFile)}
                          alt={art.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-headline font-bold text-base text-brand-dark group-hover:text-brand-red transition-colors leading-tight line-clamp-3">
                        {art.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] font-ui text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{art.readTime}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{art.views?.toLocaleString() || 0}</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Sports Block */}
          {sportsArticles.length > 0 && (
            <div className="bg-white shadow-sm">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b-2 border-brand-dark">
                <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                  Sports
                </h3>
                <Link to="/category/sports" className="text-[11px] font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                  All Sports <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-gray-200">
                {sportsArticles.slice(0, 4).map((art) => (
                  <div key={art.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <Link to={`/article/${art.slug}`} className="group block space-y-3">
                      <div className="w-full aspect-video overflow-hidden bg-black">
                        <img
                          src={getImageUrl(art.image, art.videoUrl, art.videoFile)}
                          alt={art.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-headline font-bold text-base text-brand-dark group-hover:text-brand-red transition-colors leading-tight line-clamp-3">
                        {art.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] font-ui text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{art.readTime}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{art.views?.toLocaleString() || 0}</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Culture Block */}
          {cultureArticles.length > 0 && (
            <div className="bg-white shadow-sm">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b-2 border-brand-dark">
                <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                  Culture
                </h3>
                <Link to="/category/culture" className="text-[11px] font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                  All Culture <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-gray-200">
                {cultureArticles.slice(0, 4).map((art) => (
                  <div key={art.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <Link to={`/article/${art.slug}`} className="group block space-y-3">
                      <div className="w-full aspect-video overflow-hidden bg-black">
                        <img
                          src={getImageUrl(art.image, art.videoUrl, art.videoFile)}
                          alt={art.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-headline font-bold text-base text-brand-dark group-hover:text-brand-red transition-colors leading-tight line-clamp-3">
                        {art.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] font-ui text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{art.readTime}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{art.views?.toLocaleString() || 0}</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Latest News Feed */}
          <div className="bg-white shadow-sm">
            <div className="p-4 bg-gray-50 border-b-2 border-brand-dark">
              <h3 className="font-headline font-black text-2xl uppercase text-brand-dark">
                Latest Reporting
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {displayedLatest.map((art) => (
                <div key={art.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      to={`/article/${art.slug}`} 
                      className="w-full sm:w-1/3 aspect-video overflow-hidden bg-black block shrink-0 group"
                    >
                      <img
                        src={getImageUrl(art.image, art.videoUrl, art.videoFile)}
                        alt={art.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="flex-1 space-y-2">
                      <span className="text-xs font-ui font-bold uppercase text-white bg-brand-blue px-2 py-1 rounded inline-block">
                        {getCategoryName(art)}
                      </span>
                      <Link 
                        to={`/article/${art.slug}`} 
                        className="group block"
                      >
                        <h4 className="font-headline font-bold text-lg text-brand-dark group-hover:text-brand-red transition-colors leading-tight">
                          {art.title}
                        </h4>
                      </Link>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {art.excerpt}
                      </p>
                      <div className="flex items-center space-x-3 text-xs font-ui text-gray-500 pt-2">
                        <span>By {getAuthorName(art)}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(art.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{art.views?.toLocaleString() || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleLatestCount < latestArticles.length && (
              <div className="p-6 text-center border-t border-gray-200 bg-gray-50">
                <button
                  onClick={loadMoreLatest}
                  className="px-8 py-3 border-2 border-brand-dark hover:bg-brand-dark hover:text-white font-ui font-bold text-xs uppercase tracking-wider transition-all duration-200"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1/3 Width): Sticky Trending Sidebar */}
        <div className="space-y-8">
          <div className="sticky top-6 space-y-8">
            {/* Trending Articles */}
            <div className="bg-white shadow-sm">
              <div className="flex items-center space-x-2 p-4 bg-brand-red border-b border-gray-200">
                <TrendingUp className="h-6 w-6 text-white" />
                <h3 className="font-headline font-black text-xl uppercase tracking-tight text-white">
                  Trending
                </h3>
              </div>
              
              <div className="p-4 text-xs font-ui text-gray-600 leading-relaxed border-b border-gray-200">
                Most read reports in Sudan over the past 24 hours.
              </div>

              <div className="divide-y divide-gray-200">
                {trendingArticles.map((article, idx) => (
                  <div key={article.id} className="flex items-start p-4 hover:bg-gray-50 transition-colors gap-3">
                    <span className="font-headline text-2xl font-black text-gray-300 select-none mt-1 min-w-[32px]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs font-ui font-bold uppercase text-brand-red tracking-wider block mb-1">
                        {getCategoryName(article)}
                      </span>
                      <Link 
                        to={`/article/${article.slug}`} 
                        className="group block"
                      >
                        <h4 className="font-headline font-bold text-sm text-brand-dark group-hover:text-brand-red transition-colors leading-snug">
                          {article.title}
                        </h4>
                      </Link>
                      <div className="flex items-center space-x-2 text-xs font-ui text-gray-500 mt-1.5">
                        <span>By {getAuthorName(article)}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-0.5">
                          <Eye className="h-2.5 w-2.5" />
                          <span>{article.views?.toLocaleString() || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* App Promo */}
            <div className="bg-brand-blue text-white overflow-hidden shadow-sm">
              <div className="p-6 text-center space-y-4">
                <h4 className="font-headline text-xl font-bold uppercase tracking-tight">Sudan Times App</h4>
                <p className="text-xs leading-relaxed opacity-90 font-ui">
                  Read breaking reports on-the-go. Secure connection, custom bookmarks, and offline database reading.
                </p>
                <button className="w-full py-3 bg-white text-brand-dark font-ui font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors">
                  Coming Soon to App Stores
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
