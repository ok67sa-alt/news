import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, ChevronRight, TrendingUp } from 'lucide-react';
// Front-end now reads articles from backend via `fetchAPI`
import ArticleCard from '../components/ArticleCard';
import VideoSection from '../components/VideoSection';
import SeoTags from '../components/SeoTags';
import { getImageUrl } from '../utils/imageResolver';
import { fetchAPI } from '../utils/api';
import { StrapiArticle } from '../types/api';

export default function Home() {
  const [articles, setArticles] = useState<StrapiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleLatestCount, setVisibleLatestCount] = useState(8);

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

  // 2. Identify the Main Hero Story (Highest views among featured regular articles)
  const featuredArticles = regularArticles.filter((a) => a.featured);
  const heroArticle = [...featuredArticles].sort((a, b) => b.views - a.views)[0];

  // 3. Identify Top Stories (Next 6 featured articles, sorted by views descending)
  const topStories = heroArticle
    ? [...featuredArticles]
        .filter((a) => a.id !== heroArticle.id)
        .sort((a, b) => b.views - a.views)
        .slice(0, 6)
    : [];

  // 4. Trending News (Top 10 most viewed regular articles)
  const trendingArticles = [...regularArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // 5. Retrieve latest 4 articles for specific categories (excluding videos)
  const getCategoryArticles = (catName: string) => {
    return [...regularArticles]
      .filter((a) => {
        const categoryName = typeof a.category === 'object' && a.category !== null ? a.category.name : a.category;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SeoTags 
        title="Sudan Times | Independent Sudanese News & Analysis" 
        description="Breaking news, in-depth reports, political analysis, economic briefs, humanitarian updates, culture, and sports coverage from Sudan."
      />

      {/* ================= HERO SECTION ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 border-b border-brand-border">
        {/* Left & Center: Main Hero Story */}
        <div className="lg:col-span-2 space-y-4 lg:pr-6 lg:border-r border-brand-border/60">
          <span className="text-xs font-ui font-black uppercase text-brand-blue tracking-widest bg-brand-blue/5 px-2.5 py-1 rounded inline-block">
            Featured Coverage
          </span>
          <Link to={`/article/${heroArticle.slug}`} className="group block space-y-4">
            <div className="w-full aspect-[16/9] overflow-hidden bg-black border border-brand-border relative">
              {!heroArticle.image && heroArticle.videoFile && !heroArticle.videoUrl ? (
                // Show actual video player for uploaded videos
                <video 
                  className="w-full h-full object-cover"
                  preload="metadata"
                  poster=""
                >
                  <source src={getImageUrl(heroArticle.image, heroArticle.videoUrl, heroArticle.videoFile)} type="video/mp4" />
                  <source src={getImageUrl(heroArticle.image, heroArticle.videoUrl, heroArticle.videoFile)} type="video/webm" />
                </video>
              ) : (
                // Show image or YouTube thumbnail
                <img
                  src={getImageUrl(heroArticle.image, heroArticle.videoUrl, heroArticle.videoFile)}
                  alt={heroArticle.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              )}
              {/* Video indicator overlay */}
              {!heroArticle.image && (heroArticle.videoUrl || heroArticle.videoFile) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-brand-red ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <h2 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl text-brand-dark group-hover:text-brand-red transition-colors leading-tight tracking-tight">
              {heroArticle.title}
            </h2>
          </Link>
          <p className="text-sm sm:text-base text-brand-muted font-body leading-relaxed">
            {heroArticle.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs font-ui text-brand-muted pt-2 flex-wrap gap-2">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-brand-dark">By {typeof heroArticle.author === 'object' && heroArticle.author !== null ? heroArticle.author.name : (heroArticle.author || 'Sudan News')}</span>
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
            <Link 
              to={`/article/${heroArticle.slug}`}
              className="inline-flex items-center px-4 py-2 bg-brand-blue hover:bg-brand-red text-white font-ui font-bold text-xs uppercase tracking-wider transition-colors duration-200"
            >
              Read Full Article <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Right side: Editor's Choices (Vertical text widgets) */}
        <div className="space-y-6">
          <h3 className="font-headline font-bold text-xl uppercase border-b-2 border-brand-dark pb-2">
            Editor's Picks
          </h3>
          <div className="divide-y divide-brand-border/60">
              {articles
                .filter((a) => a.featured && a.id !== heroArticle.id)
                .slice(0, 4)
                .map((article) => (
                <div key={article.id} className="py-4 first:pt-0 last:pb-0">
                  <span className="text-[10px] font-ui font-black uppercase text-brand-red tracking-widest block mb-1">
                    {typeof article.category === 'object' && article.category !== null ? article.category.name : (article.category || '')}
                  </span>
                  <Link 
                    to={`/article/${article.slug}`} 
                    className="group"
                  >
                    <h4 className="font-headline font-bold text-base text-brand-dark group-hover:text-brand-red transition-colors leading-snug">
                      {article.title}
                    </h4>
                  </Link>
                  <div className="flex items-center space-x-3 text-[10px] font-ui text-brand-muted mt-2">
                    <span>By {typeof article.author === 'object' && article.author !== null ? article.author.name : (article.author || 'Sudan News')}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-0.5">
                      <Eye className="h-3 w-3" />
                      <span>{article.views.toLocaleString()} views</span>
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {/* Quick Ad/Highlight slot */}
          <div className="bg-brand-bgMuted border border-brand-border p-4 text-center mt-6">
            <h5 className="font-headline font-bold text-sm tracking-tight text-brand-red">SUPPORT INDEPENDENT JOURNALISM</h5>
            <p className="text-[11px] font-ui text-brand-muted mt-1 leading-normal">
              Sudan Times delivers impartial news from the ground. Support our editorial team by sharing our reporting.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TOP STORIES SECTION ================= */}
      <section className="py-10 border-b border-brand-border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-black text-2xl tracking-tight text-brand-dark uppercase">
            Top Stories
          </h3>
          <div className="h-0.5 bg-brand-border flex-grow mx-4 hidden sm:block"></div>
          <span className="text-xs font-ui font-bold text-brand-muted uppercase tracking-wider">
            Prioritized by reader interest
          </span>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10">
        
        {/* Left Column (2/3 Width): Category Blocks and Latest Feed */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* 1. Politics Block */}
          <div>
            <div className="flex justify-between items-end border-b-2 border-brand-dark pb-2 mb-4">
              <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-brand-dark">
                Politics
              </h3>
              <Link to="/category/politics" className="text-xs font-ui font-bold text-brand-red hover:underline uppercase flex items-center">
                All Politics <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {politicsArticles.slice(0, 2).map(art => (
                <ArticleCard key={art.id} article={art} layout="vertical" />
              ))}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-border/60 pt-4">
                {politicsArticles.slice(2, 4).map(art => (
                  <ArticleCard key={art.id} article={art} layout="minimal" />
                ))}
              </div>
            </div>
          </div>

          {/* 2. Economy Block */}
          <div>
            <div className="flex justify-between items-end border-b-2 border-brand-dark pb-2 mb-4">
              <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-brand-dark">
                Economy
              </h3>
              <Link to="/category/economy" className="text-xs font-ui font-bold text-brand-red hover:underline uppercase flex items-center">
                All Economy <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {economyArticles.slice(0, 2).map(art => (
                <ArticleCard key={art.id} article={art} layout="vertical" />
              ))}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-border/60 pt-4">
                {economyArticles.slice(2, 4).map(art => (
                  <ArticleCard key={art.id} article={art} layout="minimal" />
                ))}
              </div>
            </div>
          </div>

          {/* 3. Technology Block */}
          <div>
            <div className="flex justify-between items-end border-b-2 border-brand-dark pb-2 mb-4">
              <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-brand-dark">
                Technology
              </h3>
              <Link to="/category/technology" className="text-xs font-ui font-bold text-brand-red hover:underline uppercase flex items-center">
                All Tech <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techArticles.slice(0, 2).map(art => (
                <ArticleCard key={art.id} article={art} layout="vertical" />
              ))}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-border/60 pt-4">
                {techArticles.slice(2, 4).map(art => (
                  <ArticleCard key={art.id} article={art} layout="minimal" />
                ))}
              </div>
            </div>
          </div>

          {/* 4. Sports & Culture Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sports Column */}
            <div>
              <div className="flex justify-between items-end border-b-2 border-brand-dark pb-2 mb-4">
                <h3 className="font-headline font-bold text-lg uppercase tracking-tight text-brand-dark">
                  Sports
                </h3>
                <Link to="/category/sports" className="text-xs font-ui font-bold text-brand-red hover:underline uppercase">
                  More
                </Link>
              </div>
              <div className="space-y-4">
                {sportsArticles.slice(0, 1).map(art => (
                  <ArticleCard key={art.id} article={art} layout="vertical" />
                ))}
                <div className="divide-y divide-brand-border/60">
                  {sportsArticles.slice(1, 4).map(art => (
                    <ArticleCard key={art.id} article={art} layout="minimal" />
                  ))}
                </div>
              </div>
            </div>

            {/* Culture Column */}
            <div>
              <div className="flex justify-between items-end border-b-2 border-brand-dark pb-2 mb-4">
                <h3 className="font-headline font-bold text-lg uppercase tracking-tight text-brand-dark">
                  Culture
                </h3>
                <Link to="/category/culture" className="text-xs font-ui font-bold text-brand-red hover:underline uppercase">
                  More
                </Link>
              </div>
              <div className="space-y-4">
                {cultureArticles.slice(0, 1).map(art => (
                  <ArticleCard key={art.id} article={art} layout="vertical" />
                ))}
                <div className="divide-y divide-brand-border/60">
                  {cultureArticles.slice(1, 4).map(art => (
                    <ArticleCard key={art.id} article={art} layout="minimal" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Latest News Feed */}
          <div className="pt-8 border-t border-brand-border">
            <h3 className="font-headline font-black text-2xl uppercase border-b-2 border-brand-dark pb-2 mb-6">
              Latest Reporting
            </h3>
            <div className="space-y-2">
              {displayedLatest.map((art) => (
                <ArticleCard key={art.id} article={art} layout="horizontal" />
              ))}
            </div>

            {visibleLatestCount < latestArticles.length && (
              <div className="text-center pt-8">
                <button
                  onClick={loadMoreLatest}
                  className="px-6 py-3 border border-brand-dark hover:bg-brand-dark hover:text-white font-ui font-bold text-xs uppercase tracking-wider transition-colors duration-200"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1/3 Width): Sticky Trending Sidebar */}
        <div className="space-y-8">
          <div className="sticky top-6">
            <div className="flex items-center space-x-2 border-b-2 border-brand-dark pb-2 mb-4">
              <TrendingUp className="h-5 w-5 text-brand-red" />
              <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-brand-dark">
                Trending Stories
              </h3>
            </div>
            
            <p className="text-[11px] font-ui text-brand-muted mb-4 leading-normal">
              Most read reports in Sudan over the past 24 hours.
            </p>

            <div className="border border-brand-border/80 p-4 bg-white divide-y divide-brand-border/60">
              {trendingArticles.map((article, idx) => (
                <ArticleCard 
                  key={article.id} 
                  article={{...article, id: idx + 1}} // override id for numbering (1 to 10)
                  layout="sidebar" 
                />
              ))}
            </div>

            <div className="mt-8 bg-brand-blue text-white p-6 text-center space-y-4">
              <h4 className="font-headline text-lg font-bold uppercase tracking-tight">SUDAN TIMES APP</h4>
              <p className="text-xs leading-relaxed opacity-90 font-ui">
                Read breaking reports on-the-go. Secure connection, custom bookmarks, and offline database reading.
              </p>
              <button className="w-full py-2.5 bg-white text-brand-dark font-ui font-black text-[11px] uppercase tracking-wider hover:bg-gray-100 transition-colors">
                Coming Soon to App Stores
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
