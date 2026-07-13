import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import SeoTags from '../components/SeoTags';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchAPI } from '../utils/api';
import { StrapiArticle } from '../types/api';

export default function SearchPage() {
  const router = useRouter();
  const queryParam = (router.query.q as string) || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');
  const [allArticles, setAllArticles] = useState<StrapiArticle[]>([]);
  const [results, setResults] = useState<StrapiArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    fetchAPI('/articles', {
      populate: '*',
      'pagination[limit]': 100,
    })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAllArticles(data);
        else setAllArticles([]);
      })
      .catch((err) => {
        console.error('Failed to load articles from API:', err);
        setAllArticles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categoriesList = ['All', ...Array.from(new Set(allArticles.map((a) => {
    return typeof a.category === 'object' && a.category !== null ? (a.category as any).name : String(a.category || '');
  })))];

  useEffect(() => {
    let tempResults = [...allArticles];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      tempResults = tempResults.filter((article) => {
        const authorName = typeof article.author === 'object' && article.author !== null
          ? (article.author as any).name
          : String(article.author || '');
        return (
          article.title.toLowerCase().includes(q) ||
          (typeof article.category === 'object' && article.category !== null
            ? article.category.name.toLowerCase().includes(q)
            : String(article.category || '').toLowerCase().includes(q)) ||
          String(authorName).toLowerCase().includes(q) ||
          article.content.toLowerCase().includes(q) ||
          article.excerpt.toLowerCase().includes(q)
        );
      });
    }

    if (selectedCategory !== 'All') {
      tempResults = tempResults.filter((article) => {
        const catName = typeof article.category === 'object' && article.category !== null
          ? (article.category as any).name
          : String(article.category || '');
        return catName === selectedCategory;
      });
    }

    if (sortBy === 'latest') {
      tempResults.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'views') {
      tempResults.sort((a, b) => b.views - a.views);
    }

    setResults(tempResults);
  }, [searchQuery, selectedCategory, sortBy, allArticles]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchQuery.trim() ? `/search?q=${searchQuery.trim()}` : '/search', undefined, { shallow: true });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    router.push('/search', undefined, { shallow: true });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-ui">
        <SeoTags
          title={`Search Archive: "${searchQuery || 'All Articles'}"`}
          description="Search through the Sudan Times comprehensive archives for politics, economy, humanitarian developments, technology, and sports."
        />

        <div className="border-b border-brand-border/60 pb-6 mb-8">
          <h1 className="font-headline font-black text-3xl sm:text-4xl text-brand-dark uppercase tracking-tight">
            Archive Search Desk
          </h1>
          <p className="mt-1 text-xs text-brand-muted uppercase tracking-wider font-semibold">
            Search the entire collection of published Sudanese articles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-sm">
              <input
                type="text"
                placeholder="Search by keywords, title, author, or category..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  router.push(e.target.value.trim() ? `/search?q=${e.target.value.trim()}` : '/search', undefined, { shallow: true });
                }}
                className="w-full border-2 border-brand-dark text-brand-dark text-sm px-4 py-3.5 pl-11 pr-10 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red font-semibold bg-white"
              />
              <Search className="absolute left-4 h-5 w-5 text-brand-muted" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-4 p-1 text-brand-muted hover:text-brand-red transition-colors"
                  aria-label="Clear query text"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                <SlidersHorizontal className="h-3.5 w-3.5 text-brand-red" />
                <span>Filter by News Desk:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border rounded transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                        : 'bg-white text-brand-dark border-brand-border hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-brand-border/60 text-xs font-ui mt-4">
              <span className="font-bold text-brand-muted uppercase tracking-wider">
                Found {results.length} matching entries
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-brand-muted">Sort by:</span>
                <button
                  onClick={() => setSortBy('latest')}
                  className={`font-semibold uppercase tracking-wider hover:text-brand-red transition-colors ${
                    sortBy === 'latest' ? 'text-brand-red underline decoration-2 underline-offset-4' : 'text-brand-dark'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('views')}
                  className={`font-semibold uppercase tracking-wider hover:text-brand-red transition-colors ${
                    sortBy === 'views' ? 'text-brand-red underline decoration-2 underline-offset-4' : 'text-brand-dark'
                  }`}
                >
                  Views
                </button>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16 bg-brand-bgMuted border border-brand-border p-6 rounded space-y-4">
                <h3 className="font-headline font-bold text-lg text-brand-dark">No Articles Found</h3>
                <p className="font-body text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
                  We couldn't find any articles matching your search query. Check for spelling errors, use fewer keywords, or browse complete sections using our top navigation bar.
                </p>
                <button
                  onClick={handleClearSearch}
                  className="px-5 py-2.5 bg-brand-blue hover:bg-brand-red text-white text-xs font-ui font-bold uppercase tracking-wider transition-colors duration-200"
                >
                  Clear Search Queries
                </button>
              </div>
            ) : (
              <div className="divide-y divide-brand-border/60">
                {results.map((article) => (
                  <ArticleCard key={article.id} article={article} layout="horizontal" />
                ))}
              </div>
            )}

          </div>

          <div className="space-y-6 lg:pl-4">
            <div className="border border-brand-border p-5 space-y-4 bg-brand-bgMuted">
              <h3 className="font-headline font-bold text-sm text-brand-dark border-b border-brand-border pb-1.5">
                SEARCH TIPS
              </h3>
              <ul className="text-xs text-brand-muted space-y-2.5 font-ui list-disc list-inside">
                <li>Use specific keywords like <span className="font-bold text-brand-dark">Khartoum</span> or <span className="font-bold text-brand-dark">Nile</span>.</li>
                <li>Filter by a single news desk to refine categories quickly.</li>
                <li>You can search by author names, e.g., <span className="font-bold text-brand-dark">Zeinab Salih</span>.</li>
                <li>Use the sort filter to display the most viewed articles first.</li>
              </ul>
            </div>

            <div className="border border-brand-blue/20 p-5 bg-brand-blue/5 space-y-2 text-center">
              <h4 className="font-headline font-bold text-sm text-brand-blue uppercase">Official Press Portal</h4>
              <p className="text-[11px] text-brand-muted leading-relaxed font-ui">
                Are you a diplomat, researcher, or NGO worker looking for high-resolution datasets? Contact our Sudan Times research department.
              </p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
