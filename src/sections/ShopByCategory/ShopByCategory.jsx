import React from 'react';
import {
  GlassWater,
  CakeSlice,
  Soup,
  Snowflake,
  Utensils,
  Apple,
  Boxes,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  {
    title: 'Syrups & Beverages',
    catalogCategory: 'Syrups & Crushes',
    icon: GlassWater,
    tag: 'Barista & Mocktail',
    brands: 'Monin · Fruitomans',
    description: 'Flavored syrups, fruit purees, cocktail syrups, frappe essentials, and barista beverage solutions.',
  },
  {
    title: 'Chocolates & Bakery Ingredients',
    catalogCategory: 'Chocolates & Bakery',
    icon: CakeSlice,
    tag: 'Pastry & Confectionery',
    brands: 'Callebaut · Cocoa · Glazes',
    description: 'Belgian couverture chocolate, compound drops, dark/milk/white chips, glazes, and bakery essences.',
  },
  {
    title: 'Sauces & Condiments',
    catalogCategory: 'Sauces & Condiments',
    icon: Soup,
    tag: 'Continental & Asian',
    brands: 'Veeba · Kikkoman · Lee Kum Kee',
    description: 'Soya sauce, chilly sauce, hot sauce, barbecue sauce, culinary pastes, mayonnaise, and seasonings.',
  },
  {
    title: 'Frozen Foods',
    catalogCategory: 'Frozen Foods',
    icon: Snowflake,
    tag: 'Appetizers & Dairy',
    brands: 'HyFun Foods · D\'lecta · Amul',
    description: 'Crispy french fries, potato shots, burger patties, cheese blocks, mozzarella, and chicken nuggets.',
  },
  {
    title: 'Pasta & Imported Foods',
    catalogCategory: 'Pasta & Noodles',
    icon: Utensils,
    tag: 'Gourmet Culinary',
    brands: 'Penne · Fusilli · Spaghetti',
    description: 'Durum wheat semolina pastas, authentic Asian noodles, imported culinary vinegars, and cooking oils.',
  },
  {
    title: 'Canned Fruits & Vegetables',
    catalogCategory: 'Vegetables & Canned',
    icon: Apple,
    tag: 'Commercial Cans',
    brands: 'Del Monte · Morton · Golden Crown',
    description: 'Button mushrooms, sweet corn, baby corn, pineapple slices, fruit cocktail, and cherries in syrup.',
  },
  {
    title: 'Café Sachets & Consumables',
    catalogCategory: 'Sachets',
    icon: Boxes,
    tag: 'Portion Packs',
    brands: 'Tetley · Bru · Nestle · MB',
    description: 'Portion-pack tomato sachets, salt/pepper, sugar, dairy creamer, instant coffee, and wrapped tea bags.',
  },
];

export default function ShopByCategory({ onNavigate }) {
  const handleCategoryClick = (category) => {
    if (onNavigate) {
      onNavigate('products', '#products', { category });
    }
  };

  return (
    <section
      id="shop-by-category"
      className="relative w-full bg-white py-8 sm:py-12 md:py-20 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-10 md:mb-14">
          <div className="flex items-center justify-between sm:justify-center mb-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1A4C98]">
              <Sparkles size={13} className="text-[#00A3E0]" />
              <span>Product Taxonomy</span>
            </div>
            <span className="text-[10px] font-bold text-[#1A4C98]/70 sm:hidden">
              Swipe Categories →
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Shop by Category
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#081426]/80 font-medium leading-relaxed">
            Browse our core commercial product lines. Click any category to view live inventory in our wholesale catalogue.
          </p>
        </div>

        {/* 7 Category Cards: Swipeable horizontal carousel on mobile, grid on sm+ */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            const isLast = index === CATEGORIES.length - 1;

            return (
              <div
                key={cat.title}
                onClick={() => handleCategoryClick(cat.catalogCategory)}
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl bg-[#F4F8FC] p-4 sm:p-6 border border-[#D0DFEF] hover:border-[#1A4C98]/40 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-w-[260px] sm:min-w-0 snap-center shrink-0 sm:shrink ${
                  isLast ? 'sm:col-span-2 lg:col-span-3 xl:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-white text-[#1A4C98] flex items-center justify-center shadow-xs group-hover:bg-[#1A4C98] group-hover:text-white transition-colors duration-200 border border-[#D0DFEF]">
                      <Icon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#00A3E0] bg-[#00A3E0]/10 px-2.5 py-0.5 rounded-full">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors mb-1 leading-snug">
                    {cat.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs font-bold text-[#1A4C98]/80 mb-1.5 line-clamp-1">
                    {cat.brands}
                  </p>

                  <p className="text-xs sm:text-sm font-medium text-[#081426]/75 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#D0DFEF]/60 flex items-center justify-between text-xs font-black text-[#1A4C98] group-hover:text-[#00A3E0]">
                  <span>Explore Products</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
