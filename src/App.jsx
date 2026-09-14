import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ViewCanvas from './components/ViewCanvas';
import Hero from './sections/Hero/Hero';
import Carousel from './sections/Carousel/Carousel';
import AlternatingText from './sections/AlternatingText/AlternatingText';
import BigText from './sections/BigText/BigText';
import ProductsPage from './pages/ProductsPage';
import AdminPage from './pages/AdminPage';
import { useProductCatalog } from './hooks/useProductCatalog';

export default function App() {
  const {
    products,
    addProduct,
    updateProduct,
    toggleFeatured,
    deleteProduct,
    resetToDefaultCatalog,
  } = useProductCatalog();

  const getPageFromLocation = useCallback(() => {
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase();

    if (hash.includes('admin') || path.includes('/admin')) return 'admin';
    if (hash.includes('products') || path.includes('/products')) return 'products';
    return 'home';
  }, []);

  const [currentPage, setCurrentPage] = useState(getPageFromLocation);
  const [activeSection, setActiveSection] = useState('hero');

  const navigateTo = useCallback((page, anchor) => {
    let targetHash = '#';
    if (page === 'admin') {
      targetHash = '#admin';
    } else if (page === 'products') {
      targetHash = '#products';
    } else if (anchor && anchor !== '#') {
      targetHash = anchor;
    }

    if (window.location.hash !== targetHash) {
      window.history.pushState(
        null,
        '',
        targetHash === '#' ? window.location.pathname : targetHash
      );
    }

    setCurrentPage(page);

    if (page === 'home' && anchor && anchor !== '#' && anchor !== '#hero') {
      setTimeout(() => {
        const el = document.querySelector(anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    if (page === 'home' && typeof window !== 'undefined' && window.ScrollTrigger) {
      setTimeout(() => {
        window.ScrollTrigger.refresh();
      }, 100);
    }
  }, []);

  // Synchronize route state with URL hash and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const page = getPageFromLocation();
      setCurrentPage(page);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    // Intercept internal link clicks to ensure instantaneous page transitions
    const handleGlobalClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      if (href === '#products' || href === '/products') {
        e.preventDefault();
        navigateTo('products');
      } else if (href === '#admin' || href === '/admin') {
        e.preventDefault();
        navigateTo('admin');
      } else if (href === '#' || href === '#hero' || href === '/' || href === '/home') {
        e.preventDefault();
        navigateTo('home', '#hero');
      } else if (href.startsWith('#')) {
        e.preventDefault();
        navigateTo('home', href);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [getPageFromLocation, navigateTo]);

  // Track active section for header indicators as user scrolls through the home page
  useEffect(() => {
    if (currentPage !== 'home') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      const heroEl = document.getElementById('hero');
      const carouselEl = document.getElementById('carousel');
      const benefitsEl = document.getElementById('benefits');
      const contactEl = document.getElementById('contact');

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveSection('contact');
      } else if (benefitsEl && scrollPos >= benefitsEl.offsetTop) {
        setActiveSection('benefits');
      } else if (carouselEl && scrollPos >= carouselEl.offsetTop) {
        setActiveSection('showcase');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans bg-[#F4F8FC]">
      <Header
        currentPage={currentPage}
        activeSection={activeSection}
        onNavigate={navigateTo}
      />

      {currentPage === 'admin' ? (
        <main className="relative z-10">
          <AdminPage
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            toggleFeatured={toggleFeatured}
            deleteProduct={deleteProduct}
            resetCatalog={resetToDefaultCatalog}
            onNavigateHome={() => navigateTo('home')}
            onNavigateProducts={() => navigateTo('products')}
          />
        </main>
      ) : currentPage === 'products' ? (
        <main className="relative z-10">
          <ProductsPage
            products={products}
            isEmbedded={false}
            onNavigateHome={() => navigateTo('home')}
            onNavigateAdmin={() => navigateTo('admin')}
          />
        </main>
      ) : (
        <main className="relative">
          {/* 3D Animated Background Logo Canvas */}
          <ViewCanvas />

          {/* 1. Hero Section */}
          <Hero onNavigate={navigateTo} />

          {/* 2. 3D Product Carousel Showcase */}
          <Carousel />

          {/* 3. Social Proof & Institutional Strengths (Google Reviews) */}
          <AlternatingText />

          {/* 4. Brand Statement */}
          <BigText />
        </main>
      )}

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
