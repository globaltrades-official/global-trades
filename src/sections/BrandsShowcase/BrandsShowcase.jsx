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
    <section className="relative w-full bg-gradient-to-b from-[#F4F8FC] via-white to-[#F4F8FC] py-12 md:py-16 border-y border-[#D0DFEF]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Subtle Eyebrow Title */}
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-block text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#1A4C98] bg-[#1A4C98]/10 px-4 py-1.5 rounded-full border border-[#1A4C98]/15">
            Brands Trusted by Food Businesses
          </span>
        </div>

        {/* Pure Logo Grid — Logo Only, No Company Name or Clutter */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 items-center justify-items-center">
          {displayBrands.map((brand) => (
            <div
              key={brand.id || brand.name}
              onClick={() => handleBrandClick(brand.name)}
              className="h-20 sm:h-24 w-full rounded-2xl bg-white border border-[#D0DFEF] shadow-2xs hover:shadow-lg hover:border-[#1A4C98]/40 hover:-translate-y-1 transition-all duration-300 p-3.5 flex items-center justify-center cursor-pointer group"
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
