import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Eye, Share2, ArrowLeft, Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import articlesData from '../data/news.json';
import ArticleCard from '../components/ArticleCard';
import SeoTags from '../components/SeoTags';
import { getImageUrl } from '../utils/imageResolver';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [localViews, setLocalViews] = useState(0);

  // Find the current article
  const article = articlesData.find((a) => a.slug === slug);

  useEffect(() => {
    if (article) {
      // Simulate incrementing views locally for visual realism
      setLocalViews(article.views + 1);
    }
  }, [article]);

  if (!article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="font-headline font-black text-3xl text-brand-dark">
          Article Not Found
        </h2>
        <p className="font-body text-brand-muted">
          The reporting you are looking for may have been archived or moved. Please verify the web address or browse our latest archives.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 bg-brand-red hover:bg-brand-dark text-white font-ui font-bold text-xs uppercase tracking-wider transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Return to Homepage
        </button>
      </div>
    );
  }

  // Get related articles (same category, excluding this one)
  const relatedArticles = articlesData
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  // Get trending articles (most read, excluding this one)
  const trendingArticles = [...articlesData]
    .filter((a) => a.id !== article.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareText = encodeURIComponent(`${article.title} - Sudan Times`);
  const shareUrl = encodeURIComponent(window.location.href);

  // Split content by newline to render separate editorial paragraphs
  const paragraphs = article.content.split('\n\n');

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-ui">
      {/* Seo Header Sync */}
      <SeoTags
        title={article.title}
        description={article.excerpt}
        image={getImageUrl(article.image)}
        type="article"
        publishedTime={article.publishedAt}
        author={article.author}
      />

      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-muted hover:text-brand-red transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to feed
        </button>
      </div>

      {/* Main Grid: Article Column (Left) & Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column (2/3 Width): Article Body */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Category Tag */}
          <Link 
            to={`/category/${article.category.toLowerCase().split(' ')[0]}`}
            className="inline-block text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-red/5 px-2.5 py-1 rounded hover:bg-brand-red hover:text-white transition-all"
          >
            {article.category}
          </Link>

          {/* Headline */}
          <h1 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl leading-tight text-brand-dark tracking-tight">
            {article.title}
          </h1>

          {/* Excerpt/Sub-headline */}
          <p className="text-base sm:text-lg text-brand-muted font-body leading-relaxed border-l-2 border-brand-red pl-4 italic">
            {article.excerpt}
          </p>

          {/* Article Meta / Bylines */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-brand-border py-4 my-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-brand-bgMuted border border-brand-border flex items-center justify-center font-bold text-brand-red">
                {article.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-bold text-brand-dark">By {article.author}</p>
                <p className="text-[10px] text-brand-muted">Special Correspondent, Khartoum</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs text-brand-muted">
              <span className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1.5">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1.5">
                <Eye className="h-4 w-4" />
                <span>{localViews.toLocaleString()} views</span>
              </span>
            </div>
          </div>

          {/* Hero Editorial Photography */}
          <div className="space-y-2">
            <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100 border border-brand-border">
              <img
                src={getImageUrl(article.image)}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-brand-muted italic font-ui leading-normal text-right">
              Photo showing aspects of {article.title.toLowerCase()} in Sudan. / Unsplash archive
            </p>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-3 py-2 border-b border-brand-border/60">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider flex items-center mr-2">
              <Share2 className="h-3.5 w-3.5 mr-1" /> Share Story:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-gray-100 hover:bg-sky-500 hover:text-white rounded-full text-brand-dark transition-all duration-200"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full text-brand-dark transition-all duration-200"
              aria-label="Share on Facebook"
            >
              <Facebook className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                copied ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-brand-red hover:text-white text-brand-dark'
              }`}
              aria-label="Copy link to clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
            </button>
            {copied && (
              <span className="text-xs font-bold text-green-600 animate-fade-in">Link copied!</span>
            )}
          </div>

          {/* Article Paragraphs with drop cap formatting */}
          <div className="font-body text-base sm:text-lg text-brand-dark leading-relaxed space-y-6 pt-4 max-w-none prose prose-serif">
            {paragraphs.map((para, index) => {
              if (index === 0) {
                // Apply Drop Cap style to the first paragraph
                return (
                  <p key={index} className="drop-cap text-justify first-line:tracking-normal">
                    {para}
                  </p>
                );
              }
              return (
                <p key={index} className="text-justify">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Related Stories Widget */}
          {relatedArticles.length > 0 && (
            <div className="pt-10 mt-12 border-t border-brand-border">
              <h3 className="font-headline font-bold text-xl uppercase border-b border-brand-dark pb-2 mb-6">
                Related Coverage
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} layout="vertical" />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (1/3 Width): Sidebar */}
        <div className="space-y-8 lg:pl-6 lg:border-l border-brand-border/60">
          
          {/* Trending Panel */}
          <div>
            <h3 className="font-headline font-bold text-lg uppercase border-b-2 border-brand-dark pb-2 mb-4">
              Most Popular
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
                    By {art.author} • {art.views.toLocaleString()} views
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Newsletter panel in sidebar */}
          <div className="border border-brand-border p-5 bg-brand-bgMuted text-center space-y-3">
            <h4 className="font-headline font-bold text-base text-brand-dark">Sudan Times Weekly</h4>
            <p className="text-xs text-brand-muted font-ui leading-normal">
              Get an in-depth weekly review of Sudanese politics and trade directly in your inbox.
            </p>
            <Link 
              to="/" 
              className="inline-block w-full py-2 bg-brand-dark hover:bg-brand-red text-white text-xs font-ui font-bold uppercase tracking-wider transition-colors text-center"
            >
              Go to Subscribe
            </Link>
          </div>

        </div>

      </div>
    </article>
  );
}
