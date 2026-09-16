import React, { useMemo, useState } from 'react';
import { DEFAULT_TRUSTED_BRANDS } from '@/hooks/useBrandCatalog';

export default function BrandsShowcase({
  brands = DEFAULT_TRUSTED_BRANDS,
  products = [],
  onNavigate,
}) {
  const [failedImages, setFailedImages] = useState({});

  // Dynamic brand logos derived directly from featured products in Admin
  const displayBrands = useMemo(() => {
    // 1. Get products marked as featured in the Admin portal
    const featuredProducts = (products || []).filter((p) => Boolean(p.isFeatured));

    if (featuredProducts.length > 0) {
      const brandMap = new Map();

      featuredProducts.forEach((p) => {
        const brandName = (p.brand || '').trim();
        if (!brandName) return;
        const brandKey = brandName.toLowerCase();

        if (!brandMap.has(brandKey)) {
          // Look up brand in brands catalog (preserves custom logos & metadata from admin)
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
            // Standard slug path for known catalogue brands
            const slug = brandKey.replace(/['\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
            brandMap.set(brandKey, {
              id: `brand-${slug}`,
              name: brandName,
              logo: `/assets/images/brands/${slug}.png`,
            });
          }
        }
      });

      const list = Array.from(brandMap.values());
      if (list.length > 0) {
        return list;
      }
    }

    // Fallback: If no products are marked featured, display active brands from brand catalog
    const fallback = (brands || []).filter((b) => b.isFeatured !== false && b.logo);
    return fallback.length > 0
      ? fallback
      : (DEFAULT_TRUSTED_BRANDS || []).filter((b) => b.isFeatured !== false && b.logo);
  }, [products, brands]);

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
          {displayBrands.map((brand) => {
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
