import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Info,
  HelpCircle,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS, CATALOG_BRANDS } from '@/data/catalogProducts';
import { BRANDING, CONTACT } from '@/constants/theme';

export default function ProductsPage({
  onNavigateHome,
  onNavigateAdmin,
  products = CATALOG_PRODUCTS,
  isEmbedded = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Scroll to top on standalone page mount only
  useEffect(() => {
    if (!isEmbedded && window.location.hash !== '#products') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isEmbedded]);

  const dynamicBrands = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort()];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand =
        selectedBrand === 'All' || product.brand === selectedBrand;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.size && product.size.toLowerCase().includes(query));

      return matchesCategory && matchesBrand && matchesSearch;
    });

    if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'brand') {
      result = [...result].sort((a, b) => a.brand.localeCompare(b.brand));
    } else if (sortBy === 'category') {
      result = [...result].sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSortBy('default');
    setCurrentPage(1);
  };

  return (
    <div id="products" className={isEmbedded ? 'w-full bg-transparent text-[#081426] pb-16 pt-6' : 'min-h-screen bg-[#F4F8FC] text-[#081426] pb-24 pt-4'}>
      {/* Top Breadcrumb & Quick Actions Bar (Visible only in standalone view) */}
      {!isEmbedded && (
        <div className="mx-auto max-w-7xl px-4 md:px-8 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#D0DFEF]">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1A4C98] hover:text-[#123873] transition-colors group cursor-pointer"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#081426]/70">
                <span className="size-2 rounded-full bg-emerald-700 animate-pulse" />
                Wholesale C&F Desk Open · PT Usha Rd, Kozhikode
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#1A4C98] via-[#163F7F] to-[#081426] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute top-0 right-0 size-48 sm:size-64 rounded-full bg-[#00A3E0]/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 size-48 sm:size-64 rounded-full bg-[#E52528]/15 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20 mb-4">
              <span>Wholesale C&F Distributor · Kozhikode</span>
              <span>·</span>
              <span>Institutional Food Service Supply</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              Products
            </h1>

            <p className="mt-4 text-base md:text-lg text-white/85 font-medium leading-relaxed">
              Complete inventory of imported syrups, cafe sachets, Belgian chocolates, gourmet purees, sauces, canned fruits, and frozen foods. Every item includes genuine product imagery extracted directly from our official commercial products directory.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold text-white/90">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                ★ 4.6 Google Rating (36 Verified Reviews)
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                🚚 Delivery Across Kozhikode · Store Pickup Welcome
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-400/20 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-400/30">
                💬 Wholesale pricing &amp; live stock availability are shared on WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Content */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Wholesale Price & Live Stock Notice */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 p-4 sm:px-6 sm:py-3.5 shadow-sm text-xs sm:text-sm text-[#081426]">
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <WhatsAppIcon size={18} />
            </span>
            <div>
              <p className="font-bold text-[#081426] leading-tight">
                Wholesale pricing and live stock availability are shared on WhatsApp.
              </p>
              <p className="text-xs text-[#081426]/70 mt-0.5">
                Institutional billing, crate trade discounts &amp; delivery status sent directly by our sales desk.
              </p>
            </div>
          </div>
          <a
            href={CONTACT.WHATSAPP_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider transition-all shadow-sm shadow-emerald-950/20 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Ask for Pricing</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Controls Container */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#D0DFEF] mb-8 space-y-6">
          {/* Search and Brand Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A4C98]/60" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products (e.g., Monin, Callebaut, Veeba, 1kg, sachet)..."
                className="w-full rounded-xl border-2 border-[#D0DFEF] bg-[#F4F8FC] py-3 pl-11 pr-10 text-sm font-semibold text-[#081426] placeholder-[#081426]/45 focus:border-[#1A4C98] focus:bg-white focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#081426]/40 hover:text-[#081426] cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Brand Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by Brand"
                className="w-full rounded-xl border-2 border-[#D0DFEF] bg-[#F4F8FC] py-3 px-4 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none cursor-pointer"
              >
                {dynamicBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand === 'All' ? 'All Brands / Producers' : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="w-full rounded-xl border-2 border-[#D0DFEF] bg-[#F4F8FC] py-3 px-4 text-sm font-semibold text-[#081426] focus:border-[#1A4C98] focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="default">Default Order</option>
                <option value="name-asc">Product Name (A-Z)</option>
                <option value="name-desc">Product Name (Z-A)</option>
                <option value="brand">Brand Name</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#081426]/60 mb-2.5">
              Product Categories:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {CATALOG_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A4C98] text-white shadow-md shadow-[#1A4C98]/30 scale-105'
                        : 'bg-[#F4F8FC] text-[#081426]/80 hover:bg-[#D0DFEF] border border-[#D0DFEF]'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Chips & Clear All */}
          {(searchQuery || selectedCategory !== 'All' || selectedBrand !== 'All' || sortBy !== 'default') && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D0DFEF]/70 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#081426]/60">Active Filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#1A4C98]/10 px-2.5 py-1 font-bold text-[#1A4C98]">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#1A4C98]/10 px-2.5 py-1 font-bold text-[#1A4C98]">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedBrand !== 'All' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#1A4C98]/10 px-2.5 py-1 font-bold text-[#1A4C98]">
                    Brand: {selectedBrand}
                    <button onClick={() => setSelectedBrand('All')} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#E52528] hover:underline cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Wholesale Pricing Notice & Product Help Callout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#1A4C98]/5 border border-[#1A4C98]/15 px-4 py-3 text-xs text-[#081426] font-medium">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-[#1A4C98] shrink-0" />
              <span>
                <strong className="text-[#1A4C98] font-bold">Products Note:</strong> Wholesale prices and stock availability are shared on request.
              </span>
            </div>

            <a
              href={CONTACT.WHATSAPP_HELP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A4C98] hover:text-[#00A3E0] transition-colors self-start sm:self-auto shrink-0 underline underline-offset-2"
            >
              <HelpCircle size={14} />
              <span>Need help choosing products?</span>
            </a>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6 text-sm font-bold text-[#081426]/75">
          <div className="text-[#1A4C98] font-extrabold uppercase tracking-wider text-xs">
            Commercial Wholesale Directory
          </div>
          <div className="text-xs text-[#081426]/60">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-[#D0DFEF] shadow-sm my-8">
            <Package size={48} className="mx-auto text-[#1A4C98]/40 mb-4" />
            <h3 className="text-xl font-bold text-[#081426]">No products matched your criteria</h3>
            <p className="mt-2 text-sm text-[#081426]/65 max-w-md mx-auto">
              We distribute a comprehensive wholesale products range. Try clearing filters or contacting our Kozhikode wholesale procurement desk directly for custom inquiries.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1A4C98] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#123873] cursor-pointer shadow-md transition-all"
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCatalogCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border border-[#D0DFEF] bg-white p-2.5 text-sm font-bold text-[#081426] hover:bg-[#1A4C98] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-sm"
              aria-label="Previous Page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`min-w-10 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNumber
                        ? 'bg-[#1A4C98] text-white shadow-md shadow-[#1A4C98]/20'
                        : 'border border-[#D0DFEF] bg-white text-[#081426] hover:bg-[#F4F8FC]'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 3 ||
                pageNumber === currentPage + 3
              ) {
                return (
                  <span key={pageNumber} className="px-1 text-xs text-[#081426]/40 font-bold">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-[#D0DFEF] bg-white p-2.5 text-sm font-bold text-[#081426] hover:bg-[#1A4C98] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-sm"
              aria-label="Next Page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Bottom Wholesale Guarantee Card */}
        <div className="mt-16 rounded-3xl bg-white border border-[#D0DFEF] p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
                B2B Commercial Procurement Support
              </span>
              <h3 className="text-2xl font-black text-[#081426]">
                Need Bulk Crates, Pallets, or Scheduled Deliveries?
              </h3>
              <p className="text-sm text-[#081426]/75 font-medium max-w-2xl">
                Visit our store for direct purchase or contact us for delivery within Kozhikode. Bulk orders, product availability, and Kozhikode delivery can be confirmed on WhatsApp.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={CONTACT.WHATSAPP_ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-900 shadow-md shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp Orders: 0495 2765320</span>
              </a>
              <a
                href={CONTACT.WHATSAPP_HELP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1A4C98]/30 bg-[#F4F8FC] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#1A4C98] hover:bg-[#1A4C98] hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <HelpCircle size={15} />
                <span>Need Help Choosing Products?</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Product Card Component with Product Image from PDF
function ProductCatalogCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const safeName = (product.name || '').replace(/[^a-zA-Z0-9]/g, '_');
  const imageSrc = product.image || `/catalog_images/${safeName}.jpg`;

  const whatsappMessage = encodeURIComponent(
    `Hello Global Trades, I am interested in wholesale pricing for:\n*${product.name}*\nBrand: ${product.brand}\nPack Size: ${product.size}\nCategory: ${product.category}\nPlease provide commercial rates and availability.`
  );

  return (
    <div className="group flex flex-col justify-between rounded-2xl bg-white p-5 border border-[#D0DFEF] shadow-sm hover:shadow-xl hover:border-[#1A4C98]/40 transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Packshot Image Container */}
        <div className="relative aspect-square w-full rounded-xl bg-[#F8FAFC] p-4 flex items-center justify-center overflow-hidden border border-[#E9EFF6] mb-4 group-hover:bg-white transition-colors">
          {!imageError ? (
            <img
              src={imageSrc}
              alt={product.name}
              onError={() => setImageError(true)}
              className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="size-16 rounded-full bg-[#1A4C98]/10 flex items-center justify-center text-[#1A4C98] font-black text-xl mb-2">
                GT
              </div>
              <span className="text-[11px] font-bold text-[#081426]/50 uppercase tracking-wide">
                {product.brand}
              </span>
            </div>
          )}

          {/* Brand Tag Top Left */}
          <span className="absolute top-2.5 left-2.5 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#1A4C98] shadow-sm border border-[#D0DFEF]">
            {product.brand}
          </span>

          {/* Pack Size Badge Bottom Right */}
          {product.size && (
            <span className="absolute bottom-2.5 right-2.5 rounded-md bg-[#081426]/80 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
              {product.size}
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A3E0]">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
        <h4 className="text-base font-bold text-[#081426] leading-snug group-hover:text-[#1A4C98] transition-colors line-clamp-2">
          {product.name}
        </h4>
      </div>

      {/* Card Action Area */}
      <div className="mt-4 pt-3 border-t border-[#D0DFEF]/70">
        <a
          href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-3.5 py-2.5 text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm shadow-emerald-900/20"
          title={`Order ${product.name} on WhatsApp`}
        >
          <WhatsAppIcon size={14} />
          <span>Request Today's Wholesale Price</span>
        </a>
      </div>
    </div>
  );
}
