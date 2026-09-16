import React from 'react';
import { DEFAULT_TRUSTED_BRANDS } from '@/hooks/useBrandCatalog';

export default function BrandsShowcase({ brands = DEFAULT_TRUSTED_BRANDS, onNavigate }) {
  // Only display brands marked as featured in the Admin portal that have an active logo
  const featuredBrands = (brands || []).filter(
    (b) => b.isFeatured !== false && b.logo
  );

  const displayBrands = featuredBrands.length > 0
    ? featuredBrands
    : (DEFAULT_TRUSTED_BRANDS || []).filter((b) => b.isFeatured !== false && b.logo);

  if (displayBrands.length === 0) {
    return null;
  }

  const handleBrandClick = (brandName) => {
    if (onNavigate) {
      onNavigate('products', '#products', { brand: brandName });
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#F4F8FC] via-white to-[#F4F8FC] py-8 sm:py-12 md:py-16 border-y border-[#D0DFEF]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Subtle Eyebrow Title */}
        <div className="text-center mb-4 sm:mb-8">
          <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#1A4C98] bg-[#1A4C98]/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-[#1A4C98]/15">
            Brands Trusted by Food Businesses
          </span>
        </div>

        {/* Pure Logo Grid — Responsive Multi-Column Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {displayBrands.map((brand) => (
            <div
              key={brand.id || brand.name}
              onClick={() => handleBrandClick(brand.name)}
              className="h-16 sm:h-20 md:h-24 w-full rounded-xl sm:rounded-2xl bg-white border border-[#D0DFEF] shadow-2xs hover:shadow-md hover:border-[#1A4C98]/40 hover:-translate-y-0.5 transition-all duration-300 p-2 sm:p-3 flex items-center justify-center cursor-pointer group"
              title={`View ${brand.name} Products`}
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  if (brand.logo && brand.logo.endsWith('.png')) {
                    e.currentTarget.src = brand.logo.replace(/\.png$/, '.svg');
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
