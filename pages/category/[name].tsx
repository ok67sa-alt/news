import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronRight, ArrowUpDown } from 'lucide-react';
import ArticleCard from '../../components/ArticleCard';
import SeoTags from '../../components/SeoTags';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { fetchAPI } from '../../utils/api';
import { StrapiArticle, StrapiCategory } from '../../types/api';

export default function CategoryPage() {
  const router = useRouter();
  const { name } = router.query;
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'views'>('latest');
  const [allArticles, setAllArticles] = useState<StrapiArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<StrapiArticle[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<StrapiCategory | null>(null);
  const [loading, setLoading] = useState(true);

  const getCategoryName = (paramName: string) => {
    const slug = paramName.toLowerCase();
    switch (slug) {
      case 'politics': return 'Politics';
      case 'economy': return 'Economy';
      case 'humanitarian': return 'Humanitarian Affairs';
      case 'international': return 'International Relations';
      case 'technology': return 'Technology';
      case 'sports': return 'Sports';
      case 'culture': return 'Culture';
      default: return '';
    }
  };

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
    const loadData = async () => {
      setLoading(true);
      try {
        const articlesResult = await fetchAPI('/articles', {
          populate: '*',
          'pagination[limit]': 100,
        });

        if (Array.isArray(articlesResult) && articlesResult.length > 0) setAllArticles(articlesResult);
        else setAllArticles([]);

        if (name) {
          const catResult = await fetchAPI('/categories');
          if (Array.isArray(catResult) && catResult.length > 0) {
            const found = catResult.find((c: any) => c.slug === name || (c.name && c.name.toLowerCase().split(' ')[0] === name));
            if (found) setCategoryInfo(found);
          }
        }
      } catch (err) {
        console.error('Failed to load from API:', err);
        setAllArticles([]);
      } finally {
        setLoading(false);
      }
    };

    if (name) loadData();
  }, [name]);

  const dbCategoryName = categoryInfo?.name || getCategoryName(name as string || '');
  const categorySubtitle = categoryInfo?.subtitle || getCategorySubtitle(dbCategoryName);
  const deskLead = categoryInfo?.deskLead || 'Mohamed El-Fatih';
  const deskEmail = categoryInfo?.deskEmail || 'desk.editor@sudantimes.news';

  useEffect(() => {
    if (dbCategoryName && allArticles.length > 0) {
      let result = allArticles.filter((a) => {
        const catName = typeof a.category === 'object' && a.category !== null
          ? (a.category as any).name
          : String(a.category || '');
        return catName?.toLowerCase() === dbCategoryName.toLowerCase();
      });

      if (sortBy === 'latest') {
        result.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dateB - dateA;
        });
      } else if (sortBy === 'oldest') {
        result.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dateA - dateB;
        });
      } else if (sortBy === 'views') {
        result.sort((a, b) => b.views - a.views);
      }

      setFilteredArticles(result);
    } else {
      setFilteredArticles([]);
    }
  }, [dbCategoryName, sortBy, allArticles]);

  const trendingArticles = [...allArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!dbCategoryName) {
    return (
      <>
        <Header />
        <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
          <h2 className="font-headline font-black text-3xl text-brand-dark">Category Not Found</h2>
          <p className="font-body text-brand-muted">
            The news section you are attempting to view does not exist. Please check the spelling or return to the main lobby.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-brand-blue hover:bg-brand-red text-white font-ui font-bold text-xs uppercase tracking-wider transition-colors duration-200"
          >
            Return to Homepage
          </Link>
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
          title={`${dbCategoryName} News & Reports`}
          description={categorySubtitle}
        />

        <div className="border-b-4 border-brand-dark pb-6 mb-8">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-brand-red transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-brand-red">{dbCategoryName}</span>
          </div>
          <h1 className="font-headline font-black text-4xl sm:text-5xl md:text-6xl text-brand-dark uppercase tracking-tight">
            {dbCategoryName}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-brand-muted font-body max-w-4xl">
            {categorySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            
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

          <div className="space-y-8 lg:pl-6 lg:border-l border-brand-border/60">
            
            <div className="border border-brand-border/80 p-5 bg-brand-bgMuted">
              <h3 className="font-headline font-bold text-base text-brand-dark border-b border-brand-border pb-2 mb-3">
                Section Desk
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed font-ui">
                Our {dbCategoryName} desk is headed by senior foreign correspondents on-site in Khartoum and Port Sudan. Send reporting pitches, letters to the editor, or corrections to the desk email.
              </p>
              <div className="mt-4 text-xs font-bold font-ui text-brand-red">
                <span className="block">Lead: {deskLead}</span>
                <span className="text-brand-muted font-normal lowercase">{deskEmail}</span>
              </div>
            </div>

            <div className="sticky top-6">
              <h3 className="font-headline font-bold text-lg uppercase border-b-2 border-brand-dark pb-2 mb-4">
                Most Read
              </h3>
              <div className="divide-y divide-brand-border/60">
                {trendingArticles.map((art) => {
                  const artCat = typeof art.category === 'object' && art.category !== null ? (art.category as any).name : String(art.category || '');
                  return (
                    <div key={art.id} className="py-3.5 first:pt-0 last:pb-0">
                      <span className="text-[9px] font-ui font-black uppercase text-brand-red tracking-widest block mb-0.5">
                        {artCat}
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
                        {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'} • {art.views?.toLocaleString() || 0} views
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
      <Footer />
    </>
  );
}
