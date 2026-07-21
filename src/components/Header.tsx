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
    <header className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg">
      {/* Top Breaking News Bar */}
      <BreakingTicker />

      {/* Utilities Row: Date, Weather, Search */}
      <div className="bg-blue-950 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex justify-between items-center text-xs font-ui">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-300" />
                <span className="text-blue-100 font-medium">Khartoum, Sudan</span>
              </div>
              <span className="hidden sm:inline text-blue-500">|</span>
              <span className="hidden sm:inline text-blue-200 font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-1.5">
                <Sun className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-blue-100 font-medium">38°C</span>
              </div>
              <span className="hidden md:inline text-blue-500">|</span>
              <button
                onClick={handleSearchClick}
                className="flex items-center space-x-1.5 text-blue-100 hover:text-yellow-400 transition-all duration-200 px-3 py-1 rounded-md hover:bg-blue-900"
                aria-label="Search articles"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="font-bold text-xs tracking-wider">SEARCH</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Newspaper Title Banner */}
      <div className="border-b border-blue-800 bg-gradient-to-b from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
          <Link href="/" className="inline-block group">
            <h1 className="font-headline font-black text-5xl sm:text-6xl md:text-7xl tracking-tight text-white uppercase transition-all duration-300 group-hover:scale-105 leading-none">
              <span className="block drop-shadow-2xl">Sudan News</span>
              <span className="block text-yellow-400 text-4xl sm:text-5xl md:text-6xl mt-1 drop-shadow-2xl">Today</span>
            </h1>
          </Link>
          <p className="mt-3 text-sm sm:text-base font-ui tracking-widest text-blue-100 font-semibold uppercase">
            Independent • Truthful • Journalism
          </p>
        </div>
      </div>

      {/* Desktop Navigation Row - Centered */}
      <div className="bg-blue-950 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-3">
            {/* Desktop Categories - Centered */}
            <nav className="hidden lg:flex justify-center items-center space-x-8 text-sm font-ui font-bold tracking-wider uppercase">
              <Link
                href="/"
                className={`${
                  router.pathname === "/" 
                    ? "text-yellow-400 border-b-2 border-yellow-400 pb-2" 
                    : "text-blue-100 hover:text-yellow-400 transition-all duration-200 pb-2 hover:border-b-2 hover:border-yellow-400"
                }`}
              >
                Home
              </Link>
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`${
                    router.pathname === `/category/${cat.slug}` 
                      ? "text-yellow-400 border-b-2 border-yellow-400 pb-2" 
                      : "text-blue-100 hover:text-yellow-400 transition-all duration-200 pb-2 hover:border-b-2 hover:border-yellow-400"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-blue-100 hover:text-yellow-400 hover:bg-blue-900 focus:outline-none transition-all duration-200"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60 transition-opacity backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Drawer Content */}
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 p-6 border-b border-blue-700">
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-black text-2xl text-white uppercase tracking-tight">
                  Sudan News
                  <span className="block text-yellow-400 text-xl">Today</span>
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-white hover:text-yellow-400 hover:bg-blue-800 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col p-6 space-y-1 font-ui font-semibold text-base uppercase tracking-wider">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`${
                  router.pathname === "/" 
                    ? "text-blue-900 bg-blue-50 border-l-4 border-blue-900" 
                    : "text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                } px-4 py-3 rounded-r-lg transition-all duration-200`}
              >
                Home
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`${
                    router.pathname === `/category/${cat.slug}` 
                      ? "text-blue-900 bg-blue-50 border-l-4 border-blue-900" 
                      : "text-gray-700 hover:text-blue-900 hover:bg-gray-50"
                  } px-4 py-3 rounded-r-lg transition-all duration-200`}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/search"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-blue-900 px-4 py-3 mt-4 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-all duration-200 font-bold"
              >
                <Search className="h-5 w-5" />
                <span>Search Articles</span>
              </Link>
            </nav>

            {/* Footer Info */}
            <div className="mt-auto p-6 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 space-y-2">
              <p className="font-semibold text-gray-800">Khartoum, Sudan</p>
              <p className="text-gray-600">{formattedDate}</p>
              <p className="font-bold text-gray-800">© {new Date().getFullYear()} Sudan News Today</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
