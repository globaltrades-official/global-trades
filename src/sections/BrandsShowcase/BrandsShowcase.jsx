import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { CATALOG_BRANDS } from '@/data/catalogProducts';

const FEATURED_BRANDS = [
  { name: 'Monin', category: 'Syrups, Purees & Frappes', origin: 'Imported (France)' },
  { name: 'Callebaut', category: 'Belgian Couverture & Cocoa', origin: 'Imported (Belgium)' },
  { name: 'Veeba', category: 'Sauces, Dressings & Dips', origin: 'Institutional Foodservice' },
  { name: 'Del Monte', category: 'Canned Fruits & Condiments', origin: 'Commercial Packs' },
  { name: 'American Garden', category: 'Hot Sauces, BBQ & Dressings', origin: 'Imported' },
  { name: 'Kikkoman', category: 'Naturally Brewed Soy Sauces', origin: 'Imported' },
  { name: 'Lee Kum Kee', category: 'Asian Sauces & Seasonings', origin: 'Imported' },
  { name: 'Fruitomans', category: 'Bulk Sauces (1kg - 25kg)', origin: 'Institutional Supply' },
  { name: 'Morton', category: 'Canned Mushrooms & Produce', origin: 'Commercial Cans' },
  { name: 'Golden Crown', category: 'Gourmet Canned Fruits', origin: 'Hotel & Cafe Supply' },
  { name: "D'lecta", category: 'Cheese Slices & Dairy', origin: 'Foodservice Dairy' },
  { name: 'HyFun Foods', category: 'Frozen Fries & Burger Patties', origin: 'Commercial Frozen' },
  { name: 'Amul', category: 'Cheese Blocks & Dairy', origin: 'Bulk Dairy' },
  { name: 'Western', category: 'Frozen Chicken Nuggets & Patties', origin: 'Foodservice Line' },
  { name: 'Fortune', category: 'Imported Specialty Cheeses', origin: 'Gourmet Kitchens' },
  { name: 'Tetley', category: 'Tea Bags & Envelopes', origin: 'Hotel & Cafe Sachets' },
];

export default function BrandsShowcase({ onNavigate }) {
  const [hoveredBrand, setHoveredBrand] = useState(null);

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

  return (
    <section
      id="brands"
      className="relative w-full bg-gradient-to-b from-[#EDF4FC] to-[#F4F8FC] py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-4">
            <Sparkles size={14} className="text-[#00A3E0]" />
            <span>Authorized Foodservice Distribution</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Brands Trusted by Food Businesses
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Authorized wholesale supply of renowned international and Indian culinary brands for cafes, restaurants, bakeries, and caterers in Kozhikode.
          </p>
        </div>

        {/* Polished Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {FEATURED_BRANDS.map((brand) => (
            <div
              key={brand.name}
              onClick={() => handleBrandClick(brand.name)}
              onMouseEnter={() => setHoveredBrand(brand.name)}
              onMouseLeave={() => setHoveredBrand(null)}
              className="group cursor-pointer rounded-2xl bg-white p-5 sm:p-6 border border-[#D0DFEF] shadow-xs hover:shadow-lg hover:border-[#1A4C98]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00A3E0] bg-[#00A3E0]/10 px-2 py-0.5 rounded-full inline-block mb-3">
                  {brand.origin}
                </span>

                <h3 className="text-lg sm:text-xl font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors leading-tight">
                  {brand.name}
                </h3>

                <p className="text-xs text-[#081426]/70 mt-1.5 font-medium leading-snug">
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
              (b) => b !== 'All' && !FEATURED_BRANDS.some((fb) => fb.name === b)
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

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleExploreAll}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1A4C98] hover:bg-[#123873] text-white font-black px-7 py-3.5 text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#1A4C98]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore Products by Brand</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
