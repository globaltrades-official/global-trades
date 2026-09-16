import React, { useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { DEFAULT_TRUSTED_BRANDS } from '@/hooks/useBrandCatalog';
import { CATALOG_BRANDS } from '@/data/catalogProducts';

export default function BrandsShowcase({ brands = DEFAULT_TRUSTED_BRANDS, onNavigate }) {
  const [hoveredBrand, setHoveredBrand] = useState(null);

  const displayBrands = brands && brands.length > 0
    ? brands.filter((b) => b.isFeatured !== false)
    : DEFAULT_TRUSTED_BRANDS;

  const handleBrandClick = (brandName) => {
    if (onNavigate) {
      onNavigate('products', '#products', { brand: brandName });
    }
  };

  const handleExploreAll = () => {
    if (onNavigate) {
      onNavigate('products', '#products');
    }
  };

  const handleAdminAccess = () => {
    if (onNavigate) {
      onNavigate('admin', null, { tab: 'brands' });
    }
  };

  return (
    <section
      id="brands"
      className="relative w-full bg-gradient-to-b from-[#EDF4FC] to-[#F4F8FC] py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#1A4C98]">
              <Sparkles size={14} className="text-[#00A3E0]" />
              <span>Authorized Foodservice Distribution</span>
            </div>

            {/* Admin Quick Option to manage brands directly */}
            {onNavigate && (
              <button
                type="button"
                onClick={handleAdminAccess}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1A4C98]/80 hover:text-[#1A4C98] bg-white hover:bg-[#F4F8FC] border border-[#D0DFEF] px-3 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer"
                title="Manage Brands Trusted by Food Businesses (Admin)"
              >
                <ShieldCheck size={13} className="text-[#1A4C98]" />
                <span>Manage Brands (Admin)</span>
              </button>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Brands Trusted by Food Businesses
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Authorized wholesale supply of renowned international and Indian culinary brands for cafes, restaurants, bakeries, and caterers in Kozhikode.
          </p>
        </div>

        {/* Polished Brand Grid with Logo Support */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {displayBrands.map((brand) => (
            <div
              key={brand.id || brand.name}
              onClick={() => handleBrandClick(brand.name)}
              onMouseEnter={() => setHoveredBrand(brand.name)}
              onMouseLeave={() => setHoveredBrand(null)}
              className="group cursor-pointer rounded-2xl bg-white p-5 sm:p-6 border border-[#D0DFEF] shadow-xs hover:shadow-lg hover:border-[#1A4C98]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Brand Logo Container */}
                {brand.logo ? (
                  <div className="h-16 w-full flex items-center justify-center p-2 rounded-xl bg-[#F8FAFD] border border-[#E2ECF8] mb-3 overflow-hidden group-hover:bg-white group-hover:border-[#1A4C98]/20 transition-colors">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#F0F5FA] to-[#E8F1FB] border border-[#D0DFEF] mb-3 group-hover:from-white group-hover:to-[#F4F8FC] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-lg bg-[#1A4C98] text-white flex items-center justify-center font-black text-sm shadow-2xs">
                        {brand.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-black text-sm text-[#081426] tracking-tight uppercase">
                        {brand.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#00A3E0] bg-white px-2 py-0.5 rounded-md border border-[#D0DFEF]">
                      Official
                    </span>
                  </div>
                )}

                <span className="text-[10px] font-black uppercase tracking-wider text-[#00A3E0] bg-[#00A3E0]/10 px-2 py-0.5 rounded-full inline-block mb-2">
                  {brand.origin}
                </span>

                <h3 className="text-lg sm:text-xl font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors leading-tight">
                  {brand.name}
                </h3>

                <p className="text-xs text-[#081426]/70 mt-1 font-medium leading-snug">
                  {brand.category}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0F5FA] flex items-center justify-between text-xs font-bold text-[#1A4C98] group-hover:text-[#00A3E0]">
                <span>Filter Products</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Brands Ticker / Pill List */}
        <div className="mt-10 rounded-2xl bg-white/80 border border-[#D0DFEF] p-5 backdrop-blur-sm">
          <p className="text-xs font-black uppercase tracking-wider text-[#081426]/60 text-center mb-3">
            More Authorized Brands in Our Catalogue
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {CATALOG_BRANDS.filter(
              (b) => b !== 'All' && !displayBrands.some((fb) => fb.name.toLowerCase() === b.toLowerCase())
            ).map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => handleBrandClick(brand)}
                className="text-xs font-bold text-[#081426]/85 hover:text-[#1A4C98] bg-[#F4F8FC] hover:bg-[#E8F1FB] border border-[#D0DFEF] px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('brands')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1A4C98] hover:bg-[#123873] text-white font-black px-7 py-3.5 text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#1A4C98]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles size={15} />
            <span>View All Trusted Brands</span>
          </button>

          <button
            type="button"
            onClick={handleExploreAll}
            className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-[#F4F8FC] text-[#1A4C98] border border-[#D0DFEF] font-black px-7 py-3.5 text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore Products by Brand</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
