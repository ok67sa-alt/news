import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Search, Globe, Sun } from 'lucide-react';
import BreakingTicker from './BreakingTicker';
import { fetchAPI } from '../utils/api';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Generate newspaper date header format: "Thursday, June 11, 2026"
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setFormattedDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    fetchAPI('/categories')
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((cat: any) => ({
            name: cat.name,
            slug: cat.slug,
          })));
        }
      })
      .catch((err) => {
        console.error('Failed to load categories from Strapi, using fallback:', err);
        setCategories([
          { name: 'Politics', slug: 'politics' },
          { name: 'Economy', slug: 'economy' },
          { name: 'Humanitarian Affairs', slug: 'humanitarian' },
          { name: 'International Relations', slug: 'international' },
          { name: 'Technology', slug: 'technology' },
          { name: 'Sports', slug: 'sports' },
          { name: 'Culture', slug: 'culture' },
        ]);
      });
  }, []);

  const handleSearchClick = () => {
    router.push('/search');
  };

  return (
    <header className="w-full bg-blue-900 border-b border-gray-200">
      {/* Top Breaking News Bar */}
      <BreakingTicker />

      {/* Utilities Row: Date, Weather, Global Flag */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-xs font-ui tracking-wider text-white flex justify-between items-center border-b border-blue-800">
        <div className="flex items-center space-x-2">
          <Globe className="h-3.5 w-3.5 text-white" />
          <span className="text-white">Khartoum, Sudan</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="hidden sm:inline text-white">{formattedDate}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 hidden md:flex">
            <Sun className="h-3.5 w-3.5 text-white" />
            <span className="text-white">Khartoum 38°C</span>
          </div>
          <span className="hidden md:inline text-gray-300">|</span>
          <button
            onClick={handleSearchClick}
            className="flex items-center space-x-1.5 hover:text-brand-red transition-colors duration-200 text-white hover:text-brand-red px-2 py-1"
            aria-label="Search articles"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="font-semibold text-xs">SEARCH</span>
          </button>
        </div>
      </div>

      {/* Main Newspaper Title Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-center">
        <Link href="/" className="inline-block">
          <h1 className="font-headline font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase hover:opacity-80 transition-opacity leading-tight">
            <span>Sudan News</span>
            <span className="text-white block text-3xl sm:text-4xl md:text-5xl">Today</span>
          </h1>
        </Link>
        <p className="mt-2 text-xs sm:text-sm font-ui tracking-wide text-white font-semibold">
          Independent • Truthful • Journalism
        </p>
      </div>

      {/* Desktop Navigation Row */}
      <div className="border-t border-blue-800 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            {/* Desktop Categories */}
            <nav className="hidden lg:flex space-x-6 text-sm font-ui font-bold tracking-wider uppercase">
              <Link
                href="/"
                className={router.pathname === "/" ? "text-brand-red border-b-2 border-brand-red pb-1" : "text-white hover:text-gray-100 transition-colors pb-1"}
              >
                Home
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={router.pathname === `/category/${cat.slug}` ? "text-brand-red border-b-2 border-brand-red pb-1" : "text-white hover:text-gray-100 transition-colors pb-1"}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Mobile / Tablet Menu Button */}
            <div className="mobile-nav-toggle-wrapper justify-between w-full items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-brand-red hover:bg-blue-800 focus:outline-none ml-auto"
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Animated overlay / drawer) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Drawer Content */}
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-2xl p-6 border-r border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
              <h2 className="font-headline font-bold text-xl text-brand-dark uppercase tracking-tight">
                Sudan News
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-brand-dark hover:text-brand-red hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-3 font-ui font-semibold text-sm uppercase tracking-wider">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-brand-dark hover:text-brand-red border-b border-gray-100 pb-3 transition-colors"
              >
                Home
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="text-brand-dark hover:text-brand-red border-b border-gray-100 pb-3 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/search"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-brand-blue pt-2 hover:text-brand-red transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Search Articles</span>
              </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-brand-border text-xs text-brand-muted space-y-2">
              <p>Khartoum, Sudan</p>
              <p>{formattedDate}</p>
              <p className="font-bold">© {new Date().getFullYear()} Sudan Times</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
