import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Globe, Sun } from 'lucide-react';
import BreakingTicker from './BreakingTicker';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const navigate = useNavigate();

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

  const categories = [
    { name: 'Politics', slug: 'politics' },
    { name: 'Economy', slug: 'economy' },
    { name: 'Humanitarian Affairs', slug: 'humanitarian' },
    { name: 'International Relations', slug: 'international' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Culture', slug: 'culture' },
  ];

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <header className="w-full bg-white border-b border-brand-border">
      {/* Top Breaking News Bar */}
      <BreakingTicker />

      {/* Utilities Row: Date, Weather, Global Flag */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-xs font-ui tracking-wider text-brand-muted flex justify-between items-center border-b border-brand-border/60">
        <div className="flex items-center space-x-2">
          <Globe className="h-3.5 w-3.5 text-brand-red" />
          <span>Khartoum, Sudan</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">{formattedDate}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 hidden md:flex">
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span>Khartoum 38°C</span>
          </div>
          <span className="hidden md:inline text-brand-border">|</span>
          <button 
            onClick={handleSearchClick}
            className="flex items-center space-x-1.5 hover:text-brand-red transition-colors duration-200"
            aria-label="Search articles"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="font-semibold">SEARCH</span>
          </button>
        </div>
      </div>

      {/* Main Newspaper Title Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
        <Link to="/" className="inline-block">
          <h1 className="font-headline font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter text-brand-dark uppercase hover:opacity-90 transition-opacity">
            Sudan Times
          </h1>
        </Link>
        <p className="mt-1 text-[10px] sm:text-xs font-ui tracking-[0.25em] uppercase text-brand-muted font-bold">
          The Pulse of the Nation • Independent & Truthful Journalism
        </p>
      </div>

      {/* Desktop Navigation Row (Double Borders for Newspaper Style) */}
      <div className="border-t-2 border-b border-brand-dark py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Desktop Categories */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 text-[13px] font-ui font-bold tracking-wider uppercase mx-auto">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive ? "text-brand-red" : "text-brand-dark hover:text-brand-red transition-colors"
                }
              >
                Home
              </NavLink>
              {categories.map((cat) => (
                <NavLink
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className={({ isActive }) =>
                    isActive ? "text-brand-red" : "text-brand-dark hover:text-brand-red transition-colors"
                  }
                >
                  {cat.name}
                </NavLink>
              ))}
            </nav>

            {/* Mobile / Tablet Menu Button */}
            <div className="flex lg:hidden justify-between w-full items-center">
              <div className="text-xs font-bold font-ui text-brand-muted sm:hidden">
                {formattedDate}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-brand-muted font-ui">
                Independent Sudanese Journalism
              </span>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-brand-dark hover:text-brand-red hover:bg-gray-100 focus:outline-none"
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
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-2xl p-6 border-r border-brand-border">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
              <h2 className="font-headline font-bold text-2xl text-brand-dark uppercase tracking-tight">
                Sudan Times
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-brand-dark hover:text-brand-red hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 font-ui font-semibold text-base uppercase tracking-wider">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="hover:text-brand-red border-b border-brand-border pb-2"
              >
                Home
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-brand-red border-b border-brand-border pb-2"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/search"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-brand-red pt-4"
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
