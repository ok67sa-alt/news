import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronRight, TrendingUp } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import VideoSection from '../components/VideoSection';
import SeoTags from '../components/SeoTags';
import Header from '../components/Header';
import Footer from '../components/Footer';
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

  const videoArticles = articles.filter((a) => a.videoUrl || a.videoFile);
  const regularArticles = articles.filter((a) => !a.videoUrl && !a.videoFile);

  const heroArticles = [...regularArticles]
    .filter((a) => a.hero === true)
    .sort((a, b) => new Date(b.publishedAt || Date.now()).getTime() - new Date(a.publishedAt || Date.now()).getTime());
  
  const fallbackHero = heroArticles.length === 0 
    ? [...regularArticles].filter((a) => a.featured).sort((a, b) => b.views - a.views)[0]
    : null;
  
  const heroArticle = heroArticles[currentHeroIndex] || fallbackHero;
  
  useEffect(() => {
    if (heroArticles.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroArticles.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [heroArticles.length]);

  const topStories = [...regularArticles]
    .filter((a) => a.id !== heroArticle?.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const trendingArticles = [...regularArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

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

  const latestArticles = [...regularArticles]
    .sort((a, b) => new Date(b.publishedAt || Date.now()).getTime() - new Date(a.publishedAt || Date.now()).getTime());

  const displayedLatest = latestArticles.slice(0, visibleLatestCount);

  const loadMoreLatest = () => {
    setVisibleLatestCount((prev) => Math.min(prev + 8, latestArticles.length));
  };

  if (loading) {
    return (
      <>
        <Header />
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
        <Footer />
      </>
    );
  }

  if (!heroArticle) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center font-ui">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Welcome to Sudan Times</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            We are currently updating our database for deployment. No articles have been published yet. Please check back soon or log in to the admin panel to publish content.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SeoTags 
          title="Sudan Times | Independent Sudanese News & Analysis" 
          description="Breaking news, in-depth reports, political analysis, economic briefs, humanitarian updates, culture, and sports coverage from Sudan."
        />

        {/* HERO SECTION */}
        <section className="pb-10 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-8">
            <div className="overflow-hidden bg-white">
              <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-ui font-black uppercase text-brand-dark tracking-widest">
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
                            ? 'w-8 bg-brand-dark' 
                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to hero article ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <Link href={`/article/${heroArticle.slug}`} className="group block">
                <div className="w-full aspect-[21/9] overflow-hidden bg-black relative">
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
                <div className="p-6 bg-white">
                  <h2 className="font-headline font-black text-3xl sm:text-4xl text-brand-dark group-hover:text-brand-red transition-colors leading-tight mb-3">
                    {heroArticle.title}
                  </h2>
                  <p className="text-base text-gray-600 font-body leading-relaxed">
                    {heroArticle.excerpt}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* EDITOR'S PICKS SECTION */}
        <section className="py-12">
          <div className="border-b border-gray-200 pb-3 mb-8">
            <h3 className="font-headline font-black text-3xl tracking-tight text-brand-dark uppercase">
              Editor's Picks
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles
              .filter((a) => a.featured && !a.hero)
              .slice(0, 4)
              .map((article) => (
                <ArticleCard key={article.id} article={article} layout="vertical" />
              ))}
          </div>
        </section>

        {/* TRENDING STORIES SECTION */}
        <section className="py-12 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="border-b border-gray-200 pb-3 mb-8">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-7 w-7 text-brand-red" />
                <h3 className="font-headline font-black text-3xl tracking-tight text-brand-dark uppercase">
                  Trending Stories
                </h3>
              </div>
              <span className="text-xs font-ui text-gray-500 uppercase tracking-wider mt-1 block">
                Most read reports in Sudan over the past 24 hours
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topStories.map((article, idx) => (
                <div key={article.id} className="relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-brand-red text-white font-headline font-black text-xl flex items-center justify-center rounded-full shadow-lg z-10">
                    {idx + 1}
                  </div>
                  <ArticleCard article={article} layout="vertical" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VIDEO SECTION */}
        {videoArticles.length > 0 && <VideoSection videos={videoArticles} />}

        {/* MULTI-COLUMN CONTENT FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-12 border-t border-gray-200">
          
          <div className="lg:col-span-2 space-y-12">
            
            {politicsArticles.length > 0 && (
              <div className="bg-white">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                    Politics
                  </h3>
                  <Link href="/category/politics" className="text-xs font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                    All Politics <ChevronRight className="h-4 w-4 ml-0.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                  {politicsArticles.slice(0, 4).map((art) => (
                    <ArticleCard key={art.id} article={art} layout="vertical" />
                  ))}
                </div>
              </div>
            )}

            {economyArticles.length > 0 && (
              <div className="bg-white">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                    Economy
                  </h3>
                  <Link href="/category/economy" className="text-xs font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                    All Economy <ChevronRight className="h-4 w-4 ml-0.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                  {economyArticles.slice(0, 4).map((art) => (
                    <ArticleCard key={art.id} article={art} layout="vertical" />
                  ))}
                </div>
              </div>
            )}

            {techArticles.length > 0 && (
              <div className="bg-white">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                    Technology
                  </h3>
                  <Link href="/category/technology" className="text-xs font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                    All Tech <ChevronRight className="h-4 w-4 ml-0.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                  {techArticles.slice(0, 4).map((art) => (
                    <ArticleCard key={art.id} article={art} layout="vertical" />
                  ))}
                </div>
              </div>
            )}

            {sportsArticles.length > 0 && (
              <div className="bg-white">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                    Sports
                  </h3>
                  <Link href="/category/sports" className="text-xs font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                    All Sports <ChevronRight className="h-4 w-4 ml-0.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                  {sportsArticles.slice(0, 4).map((art) => (
                    <ArticleCard key={art.id} article={art} layout="vertical" />
                  ))}
                </div>
              </div>
            )}

            {cultureArticles.length > 0 && (
              <div className="bg-white">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-brand-dark">
                    Culture
                  </h3>
                  <Link href="/category/culture" className="text-xs font-ui font-bold text-brand-red hover:text-brand-dark uppercase flex items-center transition-colors">
                    All Culture <ChevronRight className="h-4 w-4 ml-0.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                  {cultureArticles.slice(0, 4).map((art) => (
                    <ArticleCard key={art.id} article={art} layout="vertical" />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-headline font-black text-2xl uppercase text-brand-dark">
                  Latest Reporting
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-6 p-6">
                {displayedLatest.map((art) => (
                  <div key={art.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href={`/article/${art.slug}`} 
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
                        <span className="text-xs font-ui font-bold uppercase text-brand-red">
                          {getCategoryName(art)}
                        </span>
                        <Link 
                          href={`/article/${art.slug}`} 
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
                    className="px-8 py-3 border border-brand-dark hover:bg-brand-dark hover:text-white font-ui font-bold text-xs uppercase tracking-wider transition-all duration-200"
                  >
                    Load More Articles
                  </button>
                </div>
              )}
            </div>

          </div>

          <div className="space-y-8">
            <div className="sticky top-6 space-y-8">
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
                          href={`/article/${article.slug}`} 
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

              <div className="bg-white shadow-sm">
                <div className="p-4 bg-brand-blue border-b border-gray-200">
                  <h3 className="font-headline font-black text-xl uppercase tracking-tight text-white">
                    What to Read Today?
                  </h3>
                </div>
                
                <div className="p-4 text-xs font-ui text-gray-600 leading-relaxed border-b border-gray-200">
                  Discover hidden stories you might have missed.
                </div>

                <div className="divide-y divide-gray-200">
                  {[...regularArticles]
                    .filter((a) => !a.hero && !a.featured)
                    .sort((a, b) => a.views - b.views)
                    .slice(0, 5)
                    .map((article) => (
                      <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <span className="text-xs font-ui font-bold uppercase text-brand-red tracking-wider block mb-2">
                          {getCategoryName(article)}
                        </span>
                        <Link 
                          href={`/article/${article.slug}`} 
                          className="group block"
                        >
                          <h4 className="font-headline font-bold text-sm text-brand-dark group-hover:text-brand-red transition-colors leading-snug mb-2">
                            {article.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center space-x-2 text-xs font-ui text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-2.5 w-2.5" />
                            <span>{article.readTime}</span>
                          </span>
                          <span>•</span>
                          <span>By {getAuthorName(article)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </>
  );
}
