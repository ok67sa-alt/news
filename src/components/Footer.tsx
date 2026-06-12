import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Twitter, Facebook, Linkedin, Rss } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const categories = [
    { name: 'Politics', slug: 'politics' },
    { name: 'Economy', slug: 'economy' },
    { name: 'Humanitarian Affairs', slug: 'humanitarian' },
    { name: 'International Relations', slug: 'international' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Culture', slug: 'culture' },
  ];

  return (
    <footer className="w-full bg-[#111111] text-gray-300 border-t-4 border-brand-red pt-12 pb-8 mt-16 font-ui">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <h3 className="font-headline font-black text-2xl tracking-tight text-white uppercase">
              SUDAN TIMES
            </h3>
            <p className="text-xs leading-relaxed text-gray-400">
              Providing independent, credible, and detailed coverage of Sudanese politics, economy, humanitarian affairs, culture, and development. Based in Khartoum, reporting to the world.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-brand-red transition-colors" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="hover:text-brand-red transition-colors" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="hover:text-brand-red transition-colors" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="hover:text-brand-red transition-colors" aria-label="RSS"><Rss className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4 pb-1.5 border-b border-gray-800">
              NEWS SECTIONS
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="hover:text-white transition-colors duration-200 block py-0.5">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4 pb-1.5 border-b border-gray-800">
              RESOURCES
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/search" className="hover:text-white transition-colors block py-0.5">
                  Search Archive
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block py-0.5">
                  Sitemap
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-white transition-colors block py-0.5">
                  Search Crawlers (robots.txt)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors block py-0.5">
                  Editorial Standards
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors block py-0.5">
                  Contact Newsroom
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase pb-1.5 border-b border-gray-800">
              NEWSLETTER
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Subscribe to the **Sudan Times Briefing** to receive curated daily news reports directly in your inbox.
            </p>
            {subscribed ? (
              <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs p-3 rounded font-medium">
                Thank you! You have subscribed to the Sudan Times Briefing.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center mt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 text-white text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-brand-red pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1 p-1.5 text-brand-red hover:text-white hover:bg-brand-red rounded transition-all duration-200"
                  aria-label="Submit email"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Base Details */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 tracking-wider uppercase">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4 sm:mb-0">
            <span>© {new Date().getFullYear()} Sudan Times. All rights reserved.</span>
            <span>•</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
          <div className="text-center sm:text-right font-medium">
            Published in Khartoum • Powered by Vercel
          </div>
        </div>
      </div>
    </footer>
  );
}
