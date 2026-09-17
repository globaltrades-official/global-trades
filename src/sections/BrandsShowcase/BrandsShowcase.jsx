import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DEFAULT_TRUSTED_BRANDS } from '@/hooks/useBrandCatalog';

export default function BrandsShowcase({
  brands = DEFAULT_TRUSTED_BRANDS,
  products = [],
  onNavigate,
}) {
  const [failedImages, setFailedImages] = useState({});

  // Display brands that are actively featured in Admin
  const displayBrands = useMemo(() => {
    // 1. Brands directly featured in Admin Brands tab
    const explicitlyFeaturedBrands = (brands || []).filter(
      (b) => Boolean(b.isFeatured) && b.logo
    );

    // 2. Brands from products explicitly featured in Admin
    const featuredProducts = (products || []).filter(
      (p) => Boolean(p.isFeatured)
    );

    const brandMap = new Map();

    // Prioritize explicitly featured brands from the Brands tab
    explicitlyFeaturedBrands.forEach((b) => {
      const key = (b.name || '').toLowerCase().trim();
      if (key && !brandMap.has(key)) {
        brandMap.set(key, b);
      }
    });

    // Also include any brands from active user-featured products
    featuredProducts.forEach((p) => {
      const brandName = (p.brand || '').trim();
      if (!brandName) return;
      const brandKey = brandName.toLowerCase();

      if (!brandMap.has(brandKey)) {
        const matched =
          (brands || []).find(
            (b) => (b.name || '').toLowerCase().trim() === brandKey
          ) ||
          (DEFAULT_TRUSTED_BRANDS || []).find(
            (b) => (b.name || '').toLowerCase().trim() === brandKey
          );

        if (matched && matched.logo) {
          brandMap.set(brandKey, {
            id: matched.id || `brand-${brandKey}`,
            name: matched.name || brandName,
            logo: matched.logo,
            origin: matched.origin,
          });
        } else {
          const slug = brandKey.replace(/['\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
          brandMap.set(brandKey, {
            id: `brand-${slug}`,
            name: brandName,
            logo: `/assets/images/brands/${slug}.png`,
          });
        }
      }
    });

    return Array.from(brandMap.values());
  }, [products, brands]);

  // If 0 featured brands in Admin, do not display the section
  if (displayBrands.length === 0) {
    return null;
  }

  const handleBrandClick = (brandName) => {
    if (onNavigate) {
      onNavigate('products', '#products', { brand: brandName });
    }
  };

  const handleImageError = (brandKey, logo) => {
    if (logo && logo.endsWith('.png') && !failedImages[`${brandKey}_svg`]) {
      setFailedImages((prev) => ({ ...prev, [`${brandKey}_svg`]: true }));
    } else {
      setFailedImages((prev) => ({ ...prev, [brandKey]: true }));
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#F4F8FC] via-white to-[#F4F8FC] py-10 sm:py-12 md:py-16 border-y border-[#D0DFEF]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Subtle Eyebrow Title */}
        <div className="text-center mb-5 sm:mb-8">
          <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#1A4C98] bg-[#1A4C98]/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-[#1A4C98]/15">
            Brands Trusted by Food Businesses
          </span>
        </div>

        {/* Pure Logo Grid — Responsive Multi-Column Grid (first 6 on mobile by default) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3 md:gap-4">
          {displayBrands.map((brand, index) => {
            const brandKey = (brand.name || '').toLowerCase().trim();
            const isFailed = failedImages[brandKey];
            const useSvg = failedImages[`${brandKey}_svg`];
            const currentSrc =
              useSvg && brand.logo && brand.logo.endsWith('.png')
                ? brand.logo.replace(/\.png$/, '.svg')
                : brand.logo;

            return (
              <div
                key={brand.id || brand.name}
                onClick={() => handleBrandClick(brand.name)}
                className="h-16 sm:h-20 md:h-24 w-full rounded-xl sm:rounded-2xl bg-white border border-[#D0DFEF] shadow-2xs hover:shadow-md hover:border-[#1A4C98]/40 hover:-translate-y-0.5 transition-all duration-300 p-2 sm:p-3 flex items-center justify-center cursor-pointer group"
                title={`View ${brand.name} Products in Wholesale Catalogue`}
              >
                {!isFailed && currentSrc ? (
                  <img
                    src={currentSrc}
                    alt={`${brand.name} logo`}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={() => handleImageError(brandKey, brand.logo)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-1">
                    <span className="text-xs sm:text-sm font-black text-[#1A4C98] tracking-tight line-clamp-1">
                      {brand.name}
                    </span>
                    <span className="text-[9px] font-bold text-[#081426]/50 uppercase tracking-wider">
                      Verified Brand
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
