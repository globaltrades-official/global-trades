import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  ShieldCheck,
  Phone,
  CheckCircle2,
  ExternalLink,
  Store,
  Truck,
  FileText,
  BadgeCheck,
  Star,
  Package,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import StoreDeliveryInfoCard from '@/components/StoreDeliveryInfoCard';
import { BRANDING, CONTACT } from '@/constants/theme';
import { DEFAULT_TRUSTED_BRANDS } from '@/hooks/useBrandCatalog';
import { CATALOG_PRODUCTS } from '@/data/catalogProducts';

export default function BrandsPage({
  brands = DEFAULT_TRUSTED_BRANDS,
  onNavigateHome,
  onNavigateProducts,
  onNavigateAdmin,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Filter Categories
  const filterCategories = [
    { id: 'all', label: 'All Brands' },
    { id: 'syrups', label: 'Syrups & Beverages' },
    { id: 'chocolates', label: 'Chocolates & Cocoa' },
    { id: 'sauces', label: 'Sauces & Condiments' },
    { id: 'dairy', label: 'Dairy & Cheese' },
    { id: 'frozen', label: 'Frozen Specialties' },
    { id: 'canned', label: 'Canned Produce' },
  ];

  // Compute product count per brand from catalog
  const brandProductCounts = useMemo(() => {
    const counts = {};
    (CATALOG_PRODUCTS || []).forEach((prod) => {
      const brandKey = (prod.brand || '').toLowerCase().trim();
      counts[brandKey] = (counts[brandKey] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered brands list
  const filteredBrands = useMemo(() => {
    return (brands || []).filter((brand) => {
      // Search matching
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchName = brand.name?.toLowerCase().includes(q);
        const matchCategory = brand.category?.toLowerCase().includes(q);
        const matchOrigin = brand.origin?.toLowerCase().includes(q);
        if (!matchName && !matchCategory && !matchOrigin) return false;
      }

      // Category matching
      if (selectedFilter === 'all') return true;
      const cat = (brand.category || '').toLowerCase();
      if (selectedFilter === 'syrups') {
        return cat.includes('syrup') || cat.includes('puree') || cat.includes('tea') || cat.includes('sachet');
      }
      if (selectedFilter === 'chocolates') {
        return cat.includes('couverture') || cat.includes('cocoa') || cat.includes('chocolate') || cat.includes('bakery');
      }
      if (selectedFilter === 'sauces') {
        return cat.includes('sauce') || cat.includes('dressing') || cat.includes('dip') || cat.includes('mayo');
      }
      if (selectedFilter === 'dairy') {
        return cat.includes('cheese') || cat.includes('dairy');
      }
      if (selectedFilter === 'frozen') {
        return cat.includes('frozen') || cat.includes('fries') || cat.includes('patty') || cat.includes('patties');
      }
      if (selectedFilter === 'canned') {
        return cat.includes('canned') || cat.includes('mushroom') || cat.includes('fruit');
      }

      return true;
    });
  }, [brands, searchQuery, selectedFilter]);

  const handleBrandOrderWhatsApp = (brandName) => {
    const message = `Hi Global Trades, I would like to enquire about wholesale pricing for ${brandName} products for my business in Kozhikode.`;
    const url = `https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-20">
      {/* Top Breadcrumb Navigation Bar */}
      <div className="border-b border-[#D0DFEF] bg-white sticky top-14 md:top-16 z-30 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#081426]/75 hover:text-[#1A4C98] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>
            <span className="text-[#D0DFEF]">/</span>
            <span className="text-xs font-black text-[#1A4C98] uppercase tracking-wider">
              Trusted Brands
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onNavigateAdmin && (
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#1A4C98] bg-[#1A4C98]/10 hover:bg-[#1A4C98]/20 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                title="Manage Brands in Admin Portal"
              >
                <ShieldCheck size={13} />
                <span className="hidden sm:inline">Manage Brands (Admin)</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}

            {onNavigateProducts && (
              <button
                type="button"
                onClick={() => onNavigateProducts()}
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-black uppercase text-white bg-[#1A4C98] hover:bg-[#123873] px-3.5 py-1.5 rounded-full transition-all shadow-xs cursor-pointer"
              >
                <Package size={13} />
                <span>Wholesale Catalog</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0D2B59] via-[#1A4C98] to-[#123873] text-white py-14 sm:py-20">
        {/* Subtle Background Glow Orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-[#00A3E0]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-80 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 mb-5">
            <Sparkles size={14} className="text-emerald-300" />
            <span>Authorized Foodservice Distribution · Kozhikode, Kerala</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Brands Trusted by Food Businesses
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-white/85 font-medium leading-relaxed max-w-3xl mx-auto">
            Global Trades is the premier authorized wholesale distributor and C&amp;F supply partner for renowned international and Indian culinary brands. Supplying specialty cafes, bakeries, restaurants, caterers, and cloud kitchens across Kozhikode.
          </p>

          {/* Key Value Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold text-white/90">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-2 rounded-xl">
              <BadgeCheck size={16} className="text-emerald-400" />
              <span>100% Genuine Authorized Supply</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-2 rounded-xl">
              <FileText size={16} className="text-[#00A3E0]" />
              <span>GST Commercial Invoicing</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-2 rounded-xl">
              <Store size={16} className="text-amber-400" />
              <span>Direct Store Pickup at Vellayil</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-2 rounded-xl">
              <Truck size={16} className="text-emerald-400" />
              <span>Delivery Within Kozhikode</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-10">
        {/* Search & Filter Bar */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-[#D0DFEF] shadow-md mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A4C98]/60" size={19} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brands by name (e.g. Monin, Veeba, Callebaut), specialty, or origin..."
                className="w-full rounded-2xl border border-[#D0DFEF] bg-[#F4F8FC] py-3 pl-12 pr-10 text-sm font-semibold text-[#081426] placeholder:text-[#081426]/45 focus:border-[#1A4C98] focus:bg-white focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#081426]/40 hover:text-[#081426] p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-bold text-[#081426]/70 shrink-0">
              <span className="bg-[#F4F8FC] border border-[#D0DFEF] px-3.5 py-2.5 rounded-xl">
                Showing <strong className="text-[#1A4C98]">{filteredBrands.length}</strong> of {(brands || []).length} Brands
              </span>
            </div>
          </div>

          {/* Filter Category Chips */}
          <div className="mt-4 pt-4 border-t border-[#F0F5FA] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === cat.id
                    ? 'bg-[#1A4C98] text-white shadow-sm'
                    : 'bg-[#F4F8FC] text-[#081426]/75 hover:bg-[#E8F1FB] hover:text-[#1A4C98]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brands Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBrands.map((brand) => {
            const brandKey = (brand.name || '').toLowerCase().trim();
            const productCount = brandProductCounts[brandKey] || 0;

            return (
              <div
                key={brand.id || brand.name}
                className="group rounded-3xl bg-white p-6 border border-[#D0DFEF] shadow-xs hover:shadow-xl hover:border-[#1A4C98]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Brand Logo Box */}
                  <div className="h-28 w-full rounded-2xl bg-[#F8FAFD] border border-[#E2ECF8] flex items-center justify-center p-3 mb-4 relative overflow-hidden group-hover:bg-white group-hover:border-[#1A4C98]/20 transition-all">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={`${brand.name} official logo`}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-[#1A4C98] text-white flex items-center justify-center font-black text-lg shadow-sm">
                          {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <span className="font-black text-base text-[#081426] block leading-tight">
                            {brand.name}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase text-[#00A3E0]">
                            Authorized Partner
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Origin Tag */}
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase tracking-wider text-[#1A4C98] bg-white px-2 py-0.5 rounded-full border border-[#D0DFEF] shadow-2xs">
                      {brand.origin || 'Official'}
                    </span>
                  </div>

                  {/* Brand Details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-xl font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors leading-tight truncate">
                        {brand.name}
                      </h2>
                      {brand.isFeatured !== false && (
                        <span
                          className="size-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"
                          title="Featured in Home Showcase"
                        >
                          <Star size={11} className="fill-amber-500 text-amber-500" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-[#1A4C98]">
                      {brand.category}
                    </p>

                    <p className="text-xs text-[#081426]/75 font-medium leading-relaxed pt-1">
                      Authorized wholesale supply for commercial food businesses in Kozhikode with genuine batch quality.
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-[#F0F5FA] space-y-2.5">
                  {/* Browse Products Button */}
                  <button
                    type="button"
                    onClick={() => onNavigateProducts && onNavigateProducts(brand.name)}
                    className="w-full flex items-center justify-between rounded-xl bg-[#F4F8FC] hover:bg-[#1A4C98] hover:text-white px-3.5 py-2.5 text-xs font-black text-[#1A4C98] transition-all cursor-pointer group/btn"
                  >
                    <span className="flex items-center gap-1.5">
                      <Package size={14} />
                      <span>Explore Products</span>
                    </span>
                    <span className="text-[10px] opacity-80 flex items-center gap-1">
                      {productCount > 0 ? `${productCount} SKUs` : 'Catalog'}
                      <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </button>

                  {/* Direct WhatsApp Ordering */}
                  <button
                    type="button"
                    onClick={() => handleBrandOrderWhatsApp(brand.name)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <WhatsAppIcon size={14} className="text-white" />
                    <span>WhatsApp Pricing</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBrands.length === 0 && (
          <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#D0DFEF] shadow-sm my-6">
            <div className="size-16 rounded-full bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#081426]">No brands found</h3>
            <p className="text-sm text-[#081426]/70 mt-1 max-w-md mx-auto">
              We couldn't find any brands matching "{searchQuery}". Try clearing your search or contact our team directly for custom brand requirements.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1A4C98] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#123873] cursor-pointer"
            >
              <span>Reset Search Filters</span>
            </button>
          </div>
        )}

        {/* Value Proposition Section */}
        <section className="mt-16 rounded-3xl bg-gradient-to-br from-[#081426] via-[#0E2344] to-[#1A4C98] text-white p-8 sm:p-12 shadow-xl border border-[#1A4C98]/30">
          <div className="max-w-3xl mb-10 text-left">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Why Source From Global Trades
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white mt-1">
              Authorized Wholesale Advantage for Kozhikode Businesses
            </h3>
            <p className="text-sm sm:text-base text-white/80 mt-2 font-medium">
              We eliminate supply chain uncertainties with genuine manufacturer supply, reliable stock availability, and transparent wholesale rates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/15">
              <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                <BadgeCheck size={20} />
              </div>
              <h4 className="text-base font-black text-white">Authorized Wholesale Supply</h4>
              <p className="text-xs text-white/75 mt-1 leading-relaxed">
                Direct procurement from company depots ensures 100% genuine products with full batch freshness.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/15">
              <div className="size-10 rounded-xl bg-[#00A3E0]/20 text-[#00A3E0] flex items-center justify-center mb-3">
                <FileText size={20} />
              </div>
              <h4 className="text-base font-black text-white">Bulk Food-Service Rates</h4>
              <p className="text-xs text-white/75 mt-1 leading-relaxed">
                Competitive tiered trade pricing on master cartons and commercial packaging for food businesses.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/15">
              <div className="size-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
                <Store size={20} />
              </div>
              <h4 className="text-base font-black text-white">Store Pickup in Vellayil</h4>
              <p className="text-xs text-white/75 mt-1 leading-relaxed">
                Walk into our PT Usha Road, Vellayil warehouse to physically inspect and collect your orders.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/15">
              <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                <Truck size={20} />
              </div>
              <h4 className="text-base font-black text-white">Delivery Within Kozhikode</h4>
              <p className="text-xs text-white/75 mt-1 leading-relaxed">
                Dedicated local transport dispatch delivering across commercial food hubs in Kozhikode district.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/15">
              <div className="size-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
                <CheckCircle2 size={20} />
              </div>
              <h4 className="text-base font-black text-white">GST Commercial Invoicing</h4>
              <p className="text-xs text-white/75 mt-1 leading-relaxed">
                Legitimate B2B tax invoices with clear HSN codes, enabling complete GST input tax credit for your business.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/15">
              <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                <WhatsAppIcon size={20} className="text-white" />
              </div>
              <h4 className="text-base font-black text-white">Rapid WhatsApp Order Desk</h4>
              <p className="text-xs text-white/75 mt-1 leading-relaxed">
                Send your list to 0495 2765320 for immediate wholesale quotation, stock verification, and fast fulfillment.
              </p>
            </div>
          </div>
        </section>

        {/* Need a Specific Brand? WhatsApp Consultation Card */}
        <section className="mt-12 rounded-3xl bg-white p-6 sm:p-10 border border-[#D0DFEF] shadow-md flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
              Commercial Brand Sourcing Desk
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#081426]">
              Looking for a specific brand or specialty pack size?
            </h3>
            <p className="text-sm text-[#081426]/75 font-medium leading-relaxed">
              If your culinary concept requires a specialized syrup, imported cheese, pastry couverture, or bulk condiment not listed here, get in touch with our procurement team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={`tel:${CONTACT.ENQUIRY_PHONE_RAW}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1A4C98]/30 bg-white hover:bg-[#F4F8FC] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#1A4C98] transition-all cursor-pointer"
            >
              <Phone size={15} />
              <span>Call: {CONTACT.ENQUIRY_PHONE}</span>
            </a>

            <a
              href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Global Trades, I am looking for a specific brand or product for my food business in Kozhikode:')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black px-6 py-3 text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-900/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon size={16} />
              <span>WhatsApp Brand Request</span>
            </a>
          </div>
        </section>

        {/* Store Pickup & Delivery Policy Card */}
        <div className="mt-12">
          <StoreDeliveryInfoCard />
        </div>
      </main>
    </div>
  );
}
