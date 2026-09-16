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
      className="relative w-full bg-white py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-4">
            <Sparkles size={14} className="text-[#00A3E0]" />
            <span>Product Taxonomy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Shop by Category
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Browse our core commercial product lines. Click any category to view live inventory in our wholesale catalogue.
          </p>
        </div>

        {/* 7 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            const isLast = index === CATEGORIES.length - 1;

            return (
              <div
                key={cat.title}
                onClick={() => handleCategoryClick(cat.catalogCategory)}
                className={`group cursor-pointer rounded-3xl bg-[#F4F8FC] p-6 border border-[#D0DFEF] hover:border-[#1A4C98]/40 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                  isLast ? 'sm:col-span-2 lg:col-span-3 xl:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 rounded-2xl bg-white text-[#1A4C98] flex items-center justify-center shadow-xs group-hover:bg-[#1A4C98] group-hover:text-white transition-colors duration-200 border border-[#D0DFEF]">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00A3E0] bg-[#00A3E0]/10 px-2.5 py-1 rounded-full">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors mb-1.5 leading-snug">
                    {cat.title}
                  </h3>

                  <p className="text-xs font-bold text-[#1A4C98]/80 mb-2">
                    {cat.brands}
                  </p>

                  <p className="text-sm font-medium text-[#081426]/75 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D0DFEF]/60 flex items-center justify-between text-xs font-black text-[#1A4C98] group-hover:text-[#00A3E0]">
                  <span>Explore Products</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
