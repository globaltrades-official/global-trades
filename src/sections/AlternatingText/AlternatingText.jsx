import React from 'react';
import clsx from 'clsx';
import { View } from '@react-three/drei';
import AlternatingScene from './AlternatingScene';

const TEXT_GROUP = [
  {
    tag: 'Continental & Beverage Specialization',
    heading: 'One Stop for Continental & Monin Syrups',
    reviewer: 'Irshad Hassan · Google Local Guide',
    reviewQuote: '“One stop for continental food supply syrup and monin syrup”',
    body: 'Complete portfolio of Monin gourmet syrups, fruit purees, cocktail syrups, imported cooking sauces, Italian pasta, and barista ingredients under one roof for quick commercial pickup.',
  },
  {
    tag: 'Institutional Wholesale Value',
    heading: 'Bulk Purchase for Cafes & Restaurants',
    reviewer: 'Irshad Kallan · Google Local Guide',
    reviewQuote: '“Best place to purchase bulk for cafe and restaurant. A lot of products Indian and imported.”',
    body: 'Wholesale crate and carton pricing designed for food service margins. Providing consistent supply to over 500+ premier commercial kitchens, bakeries, and fine-dining establishments.',
  },
  {
    tag: 'Centrally Located in Kozhikode',
    heading: 'PT Usha Road Distribution Center',
    reviewer: 'Shereen Tariq · Google Local Guide',
    reviewQuote: '“One Stop for All Kinds of Cafe, Restaurants Needs...”',
    body: 'Conveniently located at 4th Gate, Zilla Housing Colony, Vellayil, Kozhikode. Fully stocked warehouse ready for instant bulk collection or rapid daily dispatches across Malabar.',
  },
];

export default function AlternatingText() {
  return (
    <section
      id="benefits"
      className="alternating-text-container relative w-full overflow-hidden bg-[#E2ECF8] text-[#081426] transition-colors duration-700"
    >
      <div className="relative w-full">
        <View className="alternating-text-view pointer-events-none absolute left-0 top-0 h-screen w-full">
          <AlternatingScene />
        </View>

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 md:px-8 relative z-10">
          {TEXT_GROUP.map((item, index) => (
            <div
              key={item.heading}
              className="alternating-section grid min-h-[75vh] md:h-screen place-items-center gap-x-8 md:gap-x-12 md:grid-cols-2 py-8 md:py-0 w-full"
            >
              <div
                className={clsx(
                  index % 2 === 0 ? 'col-start-1 md:mr-auto' : 'md:col-start-2 md:ml-auto',
                  'relative z-10 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-md bg-white/90 shadow-2xl border border-white/60 max-w-lg lg:max-w-xl w-full'
                )}
              >
                <span className="inline-block rounded-full bg-emerald-900/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-900 mb-3 border border-emerald-900/15">
                  {item.tag}
                </span>
                
                <h2 className="text-balance text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-sky-950 tracking-tight leading-tight">
                  {item.heading}
                </h2>

                {/* Google Review Quote Highlight */}
                <div className="mt-4 rounded-xl bg-amber-500/15 p-3 border-l-4 border-amber-600">
                  <p className="text-sm font-bold italic text-sky-950">
                    {item.reviewQuote}
                  </p>
                  <span className="block mt-1 text-[11px] font-semibold text-sky-900/80">
                    ★ 5.0 — {item.reviewer}
                  </span>
                </div>

                <div className="mt-4 text-sm sm:text-base md:text-lg font-medium text-sky-900/90 leading-relaxed">
                  <p>{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
