import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileFloatingWhatsApp from './components/MobileFloatingWhatsApp';
import Hero from './sections/Hero/Hero';
import Carousel from './sections/Carousel/Carousel';
import AlternatingText from './sections/AlternatingText/AlternatingText';
import HowWeServe from './sections/HowWeServe/HowWeServe';
import BigText from './sections/BigText/BigText';
import { useProductCatalog } from './hooks/useProductCatalog';
import { useMediaQuery } from './hooks/useMediaQuery';

// Code-split pages so initial load is feather-light (< 200KB)
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Lazy load 3D canvas only for desktop viewports
const ViewCanvas = lazy(() => import('./components/ViewCanvas'));

function PageFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F4F8FC]">
      <div className="size-10 rounded-full border-3 border-[#1A4C98]/20 border-t-[#1A4C98] animate-spin" />
    </div>
  );
}

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
    if (hash.includes('contact') || path.includes('/contact')) return 'contact';
    return 'home';
  }, []);

  const isDesktop = useMediaQuery('(min-width: 768px)', true);
  const [currentPage, setCurrentPage] = useState(getPageFromLocation);
  const [activeSection, setActiveSection] = useState('hero');

  const navigateTo = useCallback((page, anchor) => {
    let targetHash = '#';
    if (page === 'admin') {
      targetHash = '#admin';
    } else if (page === 'products') {
      targetHash = '#products';
    } else if (page === 'contact') {
      targetHash = '#contact';
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
      } else if (href === '#contact' || href === '/contact' || href === '#contact-us') {
        e.preventDefault();
        navigateTo('contact');
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
      const howWeServeEl = document.getElementById('how-we-serve');
      const contactEl = document.getElementById('contact');

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveSection('contact');
      } else if (howWeServeEl && scrollPos >= howWeServeEl.offsetTop) {
        setActiveSection('how-we-serve');
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
          <Suspense fallback={<PageFallback />}>
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
          </Suspense>
        </main>
      ) : currentPage === 'products' ? (
        <main className="relative z-10">
          <Suspense fallback={<PageFallback />}>
            <ProductsPage
              products={products}
              isEmbedded={false}
              onNavigateHome={() => navigateTo('home')}
              onNavigateAdmin={() => navigateTo('admin')}
            />
          </Suspense>
        </main>
      ) : currentPage === 'contact' ? (
        <main className="relative z-10">
          <Suspense fallback={<PageFallback />}>
            <ContactPage
              onNavigateHome={() => navigateTo('home')}
              onNavigateProducts={() => navigateTo('products')}
            />
          </Suspense>
        </main>
      ) : (
        <main className="relative">
          {/* 3D Animated Background Logo Canvas: Desktop only, asynchronously loaded */}
          {isDesktop && (
            <Suspense fallback={null}>
              <ViewCanvas />
            </Suspense>
          )}

          {/* 1. Hero Section */}
          <Hero onNavigate={navigateTo} />

          {/* 2. 3D Product Carousel Showcase */}
          <Carousel products={products} onNavigate={navigateTo} />

          {/* 3. Social Proof & Institutional Strengths (Google Reviews) */}
          <AlternatingText />

          {/* 4. How We Serve Businesses */}
          <HowWeServe onNavigate={navigateTo} />

          {/* 5. Brand Statement */}
          <BigText />
        </main>
      )}

      <Footer onNavigate={navigateTo} />
      <MobileFloatingWhatsApp />
    </div>
  );
}
