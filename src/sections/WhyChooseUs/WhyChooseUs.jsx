import React from 'react';
import {
  ShieldCheck,
  TrendingDown,
  Receipt,
  Globe2,
  Store,
  Truck,
  CheckCircle2,
} from 'lucide-react';

const REASONS = [
  {
    title: 'Authorized Wholesale Supply',
    icon: ShieldCheck,
    description:
      'Direct authorized distribution and C&F channels ensuring authentic, culinary-grade food products.',
  },
  {
    title: 'Bulk Food-Service Rates',
    icon: TrendingDown,
    description:
      'Competitive carton and crate trade pricing engineered to support food-service profit margins.',
  },
  {
    title: 'GST Billing',
    icon: Receipt,
    description:
      'Official commercial GST tax invoices provided with every wholesale order for institutional compliance.',
  },
  {
    title: 'Indian & Imported Products',
    icon: Globe2,
    description:
      'A comprehensive catalogue featuring premier international brands alongside trusted Indian food manufacturers.',
  },
  {
    title: 'Store Pickup in Vellayil',
    icon: Store,
    description:
      'Centrally located distribution center at PT Usha Road, Vellayil, welcoming direct customer store visits and order pickup.',
  },
  {
    title: 'Delivery Within Kozhikode',
    icon: Truck,
    description:
      'Reliable, scheduled route deliveries directly to commercial kitchens, cafes, and bakeries across Kozhikode.',
  },
];

export default function WhyChooseUs({ onNavigate }) {
  return (
    <section
      id="why-global-trades"
      className="relative w-full bg-white py-12 sm:py-16 md:py-20 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-12 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1A4C98] mb-3">
            <CheckCircle2 size={13} className="text-emerald-700" />
            <span>Reliable B2B Partner</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Why Global Trades
          </h2>

          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-[#081426]/75 font-normal leading-relaxed max-w-2xl mx-auto">
            Genuine wholesale supply, transparent trade pricing, and responsive local service for food businesses in Kozhikode.
          </p>
        </div>

        {/* Reasons Grid: Single-column horizontal cards on mobile, 2-3 col on tablet & desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <div
                key={reason.title}
                className="group rounded-2xl sm:rounded-3xl bg-[#F4F8FC] p-4 sm:p-7 border border-[#D0DFEF] hover:border-[#1A4C98]/40 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Horizontal on mobile (icon left, text right), vertical block on tablet & desktop */}
                  <div className="flex items-start gap-3.5 sm:block">
                    <div className="flex items-center justify-between sm:mb-5 shrink-0">
                      <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-white text-[#1A4C98] flex items-center justify-center shadow-2xs group-hover:bg-[#1A4C98] group-hover:text-white transition-colors duration-200 border border-[#D0DFEF]">
                        <Icon size={20} className="sm:w-5 sm:h-5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors leading-snug">
                          {reason.title}
                        </h3>
                        <span className="text-[10px] sm:text-xs font-bold text-[#081426]/35 shrink-0">
                          0{index + 1}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-normal text-[#081426]/75 leading-relaxed mt-1">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
