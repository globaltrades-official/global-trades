import React from 'react';
import {
  Coffee,
  UtensilsCrossed,
  Cake,
  ChefHat,
  Flame,
  Building,
  Store,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

const INDUSTRIES = [
  {
    id: 'cafes',
    name: 'Cafes',
    icon: Coffee,
    tag: 'Beverages & Syrups',
    description:
      'Monin gourmet syrups, fruit purees, frappe bases, coffee sachets, and barista essentials with swift Kozhikode replenishment.',
    recommendedCategory: 'Syrups & Crushes',
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: UtensilsCrossed,
    tag: 'Culinary Ingredients',
    description:
      'Continental sauces, Kikkoman soy sauce, gourmet pastas, chef-grade vinegars, culinary pastes, and bulk mayonnaise.',
    recommendedCategory: 'Sauces & Condiments',
  },
  {
    id: 'bakeries',
    name: 'Bakeries',
    icon: Cake,
    tag: 'Chocolates & Pastry',
    description:
      'Callebaut Belgian chocolate, compound chocolate chips, cocoa powder, food essences, and specialized pastry ingredients.',
    recommendedCategory: 'Chocolates & Bakery',
  },
  {
    id: 'caterers',
    name: 'Caterers',
    icon: ChefHat,
    tag: 'Commercial Bulk Cans',
    description:
      'Institutional bulk cans of mushrooms, sweet corn, canned fruit cocktail, and 5kg to 25kg bulk sauce packs for large events.',
    recommendedCategory: 'Vegetables & Canned',
  },
  {
    id: 'cloud-kitchens',
    name: 'Cloud Kitchens',
    icon: Flame,
    tag: 'Fast-Prep & Frozen',
    description:
      'HyFun frozen fries, veg/chicken patties, chicken nuggets, portion sachets, dips, and high-turnover frying essentials.',
    recommendedCategory: 'Frozen Foods',
  },
  {
    id: 'hotels',
    name: 'Hotels',
    icon: Building,
    tag: 'Institutional Dining',
    description:
      'Portion-pack tea bags, coffee & sugar sachets, breakfast jams, gourmet canned fruits, and cheese blocks for buffet service.',
    recommendedCategory: 'Sachets',
  },
  {
    id: 'retail-stores',
    name: 'Retail Stores',
    icon: Store,
    tag: 'Authorized Packs',
    description:
      'Fast-moving packaged sauces, imported spreads, canned specialties, and gourmet retail products with competitive wholesale trade margins.',
    recommendedCategory: 'Sauces & Condiments',
  },
];

export default function IndustriesWeServe({ onNavigate }) {
  const handleIndustryClick = (category) => {
    if (onNavigate) {
      onNavigate('products', '#products', { category });
    }
  };

  return (
    <section
      id="industries"
      className="relative w-full bg-[#F4F8FC] py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-4">
            <CheckCircle2 size={14} className="text-emerald-700" />
            <span>Food Service Sectors</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Industries We Serve
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Reliable wholesale food-service supply customized for hospitality, dining, and commercial kitchens across Kozhikode.
          </p>
        </div>

        {/* 7-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {INDUSTRIES.map((industry, index) => {
            const Icon = industry.icon;
            const isLast = index === INDUSTRIES.length - 1;

            return (
              <div
                key={industry.id}
                className={`group flex flex-col justify-between rounded-3xl bg-white p-6 border border-[#D0DFEF] shadow-sm hover:shadow-xl hover:border-[#1A4C98]/40 hover:-translate-y-1 transition-all duration-300 ${
                  isLast ? 'sm:col-span-2 lg:col-span-3 xl:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 rounded-2xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center group-hover:bg-[#1A4C98] group-hover:text-white transition-colors duration-200">
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#00A3E0] bg-[#00A3E0]/10 px-2.5 py-1 rounded-full">
                      {industry.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors mb-2">
                    {industry.name}
                  </h3>

                  <p className="text-sm font-medium text-[#081426]/75 leading-relaxed">
                    {industry.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F0F5FA] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleIndustryClick(industry.recommendedCategory)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A4C98] hover:text-[#00A3E0] transition-colors cursor-pointer"
                  >
                    <span>View Catalogue</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </button>

                  <a
                    href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hi Global Trades, I run a ${industry.name.toLowerCase()} in Kozhikode and would like wholesale pricing for ${industry.tag.toLowerCase()}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/60 transition-colors"
                  >
                    <WhatsAppIcon size={12} />
                    <span>Quote</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
