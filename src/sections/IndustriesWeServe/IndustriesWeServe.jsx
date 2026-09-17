import React, { useState } from 'react';
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
  ChevronDown,
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
      className="relative w-full bg-[#F4F8FC] py-12 sm:py-16 md:py-20 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1A4C98] mb-3">
            <CheckCircle2 size={13} className="text-emerald-700" />
            <span>Food Service Sectors</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Industries We Serve
          </h2>

          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-[#081426]/75 font-normal leading-relaxed max-w-2xl mx-auto">
            Reliable wholesale food-service supply customized for hospitality, dining, and commercial kitchens across Kozhikode.
          </p>
        </div>

        {/* 7-Card Grid: First 4 on mobile by default, all 7 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
          {INDUSTRIES.map((industry, index) => {
            const Icon = industry.icon;
            const isLast = index === INDUSTRIES.length - 1;

            return (
              <div
                key={industry.id}
                className={`group flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white p-3.5 sm:p-6 border border-[#D0DFEF] shadow-2xs hover:shadow-lg hover:border-[#1A4C98]/40 hover:-translate-y-0.5 transition-all duration-300 ${
                  isLast ? 'col-span-2 sm:col-span-2 lg:col-span-3 xl:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <div className="size-9 sm:size-12 rounded-xl sm:rounded-2xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center group-hover:bg-[#1A4C98] group-hover:text-white transition-colors duration-200">
                      <Icon size={17} className="sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#00A3E0] bg-[#00A3E0]/10 px-2 py-0.5 rounded-full">
                      {industry.tag}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-lg md:text-xl font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors mb-1 leading-snug">
                    {industry.name}
                  </h3>

                  <p className="text-[11px] sm:text-sm font-normal text-[#081426]/75 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {industry.description}
                  </p>
                </div>

                <div className="mt-3 sm:mt-5 pt-2.5 sm:pt-4 border-t border-[#D0DFEF]/60 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => handleIndustryClick(industry.recommendedCategory)}
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#1A4C98] hover:text-[#00A3E0] transition-colors cursor-pointer"
                  >
                    <span>Catalogue</span>
                    <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                  </button>

                  <a
                    href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hi Global Trades, I run a ${industry.name.toLowerCase()} in Kozhikode and would like wholesale pricing for ${industry.tag.toLowerCase()}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200/60 transition-colors"
                  >
                    <WhatsAppIcon size={11} />
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
