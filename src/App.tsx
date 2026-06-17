import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';

// Helper to scroll to the top of the page on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white text-brand-dark selection:bg-brand-blue selection:text-white">
        {/* Header containing masthead & navigation */}
        <Header />
        
        {/* Main page content area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        
        {/* Site footer */}
        <Footer />
      </div>
    </Router>
  );
}
