import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Calendar, Clock, Eye, Share2, ArrowLeft, Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import ArticleCard from '../../components/ArticleCard';
import VideoEmbed from '../../components/VideoEmbed';
import SeoTags from '../../components/SeoTags';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getImageUrl } from '../../utils/imageResolver';
import { parseEditorJsContent, isEditorJsContent } from '../../utils/editorJsParser';
import { fetchAPI, incrementArticleViews } from '../../utils/api';
import { getAuthorName, getCategoryName, getCategorySlug, getAuthorRole } from '../../utils/articleHelpers';
import { StrapiArticle } from '../../types/api';

export default function ArticleDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [copied, setCopied] = useState(false);
  const [localViews, setLocalViews] = useState(0);
  const [articles, setArticles] = useState<StrapiArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI('/articles', {
      populate: '*',
      sort: 'publishedAt:desc',
      'pagination[limit]': 100
    })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setArticles(data);
        else setArticles([]);
      })
      .catch((err) => {
        console.error('Failed to load articles from API:', err);
        setArticles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (article) {
      setLocalViews(article.views + 1);
      incrementArticleViews(article.id, article.views);
    }
  }, [article]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
          <h2 className="font-headline font-black text-3xl text-brand-dark">
            Article Not Found
          </h2>
          <p className="font-body text-brand-muted">
            The reporting you are looking for may have been archived or moved. Please verify the web address or browse our latest archives.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-6 py-3 bg-brand-blue hover:bg-brand-red text-white font-ui font-bold text-xs uppercase tracking-wider transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Homepage
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const relatedArticles = articles
    .filter((a) => getCategoryName(a) === getCategoryName(article) && a.id !== article.id)
    .slice(0, 3);

  const trendingArticles = [...articles]
    .filter((a) => a.id !== article.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const categoryName = getCategoryName(article);
  const categorySlug = getCategorySlug(article);
  const authorName = getAuthorName(article);
  const authorRole = getAuthorRole(article);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const shareText = encodeURIComponent(`${article.title} - Sudan Times`);
  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';

  const paragraphs = isEditorJsContent(article.content) 
    ? parseEditorJsContent(article.content)
    : article.content.split('\n\n');

  return (
    <>
      <Header />
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-ui">
        <SeoTags
          title={article.title}
          description={article.excerpt}
          image={getImageUrl(article.image, article.videoUrl, article.videoFile)}
          type="article"
          publishedTime={article.publishedAt}
          author={authorName}
        />

        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-muted hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to feed
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            
            <Link 
              href={`/category/${categorySlug}`}
              className="inline-block text-xs font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/5 px-2.5 py-1 rounded hover:bg-brand-red hover:text-white transition-all"
            >
              {categoryName}
            </Link>

            <h1 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl leading-tight text-brand-dark tracking-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-brand-muted font-body leading-relaxed border-l-2 border-brand-red pl-4 italic">
              {article.excerpt}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-brand-border py-4 my-6 gap-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-brand-bgMuted border border-brand-border flex items-center justify-center font-bold text-brand-red">
                  {authorName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-dark">By {authorName}</p>
                  <p className="text-[10px] text-brand-muted">{authorRole}</p>
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

            {(article.videoUrl || article.videoFile) && (
              <div className="space-y-2">
                <VideoEmbed url={article.videoUrl} videoFile={article.videoFile} />
                <p className="text-[11px] text-brand-muted italic font-ui leading-normal text-right">
                  Video content related to {article.title.toLowerCase()} / Embedded Media
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100 border border-brand-border">
                <img
                  src={getImageUrl(article.image, article.videoUrl, article.videoFile)}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] text-brand-muted italic font-ui leading-normal text-right">
                Photo showing aspects of {article.title.toLowerCase()} in Sudan. / Unsplash archive
              </p>
            </div>

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

            <div className="font-body text-base sm:text-lg text-brand-dark leading-relaxed space-y-6 pt-4 max-w-none prose prose-serif">
              {paragraphs.map((para, index) => {
                const isHtml = para.trim().startsWith('<');
                
                if (isHtml) {
                  return (
                    <div 
                      key={index} 
                      dangerouslySetInnerHTML={{ __html: para }}
                      className="text-justify"
                    />
                  );
                }
                
                if (index === 0) {
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

          <div className="space-y-8 lg:pl-6 lg:border-l border-brand-border/60">
            
            <div>
              <h3 className="font-headline font-bold text-lg uppercase border-b-2 border-brand-dark pb-2 mb-4">
                Most Popular
              </h3>
              <div className="divide-y divide-brand-border/60">
                {trendingArticles.map((art) => (
                  <div key={art.id} className="py-3.5 first:pt-0 last:pb-0">
                    <span className="text-[9px] font-ui font-black uppercase text-brand-red tracking-widest block mb-0.5">
                      {getCategoryName(art)}
                    </span>
                    <Link 
                      href={`/article/${art.slug}`} 
                      className="group"
                    >
                      <h4 className="font-headline font-bold text-sm text-brand-dark group-hover:text-brand-red transition-colors leading-snug">
                        {art.title}
                      </h4>
                    </Link>
                    <p className="text-[10px] text-brand-muted mt-1">
                      By {getAuthorName(art)} • {art.views.toLocaleString()} views
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-brand-border p-5 bg-brand-bgMuted text-center space-y-3">
              <h4 className="font-headline font-bold text-base text-brand-dark">Sudan Times Weekly</h4>
              <p className="text-xs text-brand-muted font-ui leading-normal">
                Get an in-depth weekly review of Sudanese politics and trade directly in your inbox.
              </p>
              <Link 
                href="/" 
                className="inline-block w-full py-2 bg-brand-blue hover:bg-brand-red text-white text-xs font-ui font-bold uppercase tracking-wider transition-colors text-center"
              >
                Go to Subscribe
              </Link>
            </div>

          </div>

        </div>
      </article>
      <Footer />
    </>
  );
}
