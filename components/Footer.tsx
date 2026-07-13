import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Facebook } from 'lucide-react';
import { fetchAPI } from '../utils/api';
import { StrapiCategory } from '../types/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [categories, setCategories] = useState<StrapiCategory[]>([]);

  useEffect(() => {
    // Fetch categories dynamically from Strapi with fallback
    fetchAPI('/categories')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setCategories([
            { id: 1, name: 'Politics', slug: 'politics' },
            { id: 2, name: 'Economy', slug: 'economy' },
            { id: 3, name: 'Humanitarian Affairs', slug: 'humanitarian' },
            { id: 4, name: 'International Relations', slug: 'international' },
            { id: 5, name: 'Technology', slug: 'technology' },
            { id: 6, name: 'Sports', slug: 'sports' },
            { id: 7, name: 'Culture', slug: 'culture' },
          ] as any);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch categories for footer:', err);
        setCategories([
          { id: 1, name: 'Politics', slug: 'politics' },
          { id: 2, name: 'Economy', slug: 'economy' },
          { id: 3, name: 'Humanitarian Affairs', slug: 'humanitarian' },
          { id: 4, name: 'International Relations', slug: 'international' },
          { id: 5, name: 'Technology', slug: 'technology' },
          { id: 6, name: 'Sports', slug: 'sports' },
          { id: 7, name: 'Culture', slug: 'culture' },
        ] as any);
      });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-blue-900 text-white border-t-4 border-brand-red pt-12 pb-8 mt-16 font-ui">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-blue-800">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <h3 className="font-headline font-black text-2xl tracking-tight text-white uppercase">
              SUDAN NEWS
            </h3>
            <p className="text-xs leading-relaxed text-gray-200">
              Independent news covering politics, economy, humanitarian affairs, culture, and development in Sudan. Based in Khartoum, reporting to the world.
            </p>
            <div className="flex space-x-4 pt-3">
              <a href="https://www.facebook.com/share/18bTgrtnqB/" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-brand-red transition-colors" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4 pb-1.5 border-b border-blue-800">
              NEWS SECTIONS
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.map((cat) => (
                <li key={cat.id || cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-gray-200 hover:text-brand-red transition-colors duration-200">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4 pb-1.5 border-b border-blue-800">
              RESOURCES
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/search" className="text-gray-200 hover:text-brand-red transition-colors">
                  Search Archive
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-gray-200 hover:text-brand-red transition-colors">
                  Sitemap
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noreferrer" className="text-gray-200 hover:text-brand-red transition-colors">
                  Search Robots
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-brand-red transition-colors">
                  Editorial Standards
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-brand-red transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase pb-1.5 border-b border-blue-800">
              NEWSLETTER
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed">
              Get daily news updates delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="bg-green-900/30 border border-green-700 text-green-300 text-xs p-3 rounded font-medium">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-blue-800 border border-blue-700 text-white text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-brand-red placeholder-gray-300 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1 p-1.5 text-white hover:text-brand-red hover:bg-blue-700/50 rounded transition-all duration-200"
                  aria-label="Submit email"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Base Details */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-200 tracking-wider">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4 sm:mb-0">
            <span>© {new Date().getFullYear()} Sudan News. All rights reserved.</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <div className="text-center sm:text-right text-xs">
            Khartoum, Sudan • Powered by CeraByte
          </div>
        </div>
      </div>
    </footer>
  );
}
