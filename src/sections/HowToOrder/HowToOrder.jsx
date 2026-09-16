import React from 'react';
import { Search, Truck, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function HowToOrder({ onNavigate }) {
  const steps = [
    {
      number: '01',
      title: 'Browse products or send requirements',
      icon: Search,
      description:
        'Explore our catalogue by category or brand, or send your kitchen supply list directly to our team.',
      tip: 'Browse Products & Commercial Brands',
    },
    {
      number: '02',
      title: 'Get wholesale pricing on WhatsApp',
      icon: WhatsAppIcon,
      description:
        'Share your item list and quantities on WhatsApp for live stock availability, batch confirmation, and bulk trade rates.',
      tip: 'WhatsApp Desk: 0495 2765320',
    },
    {
      number: '03',
      title: 'Collect from Vellayil store or arrange Kozhikode delivery',
      icon: Truck,
      description:
        'Pick up your order directly from our PT Usha Road store in Vellayil, or arrange delivery across Kozhikode.',
      tip: 'Store Pickup or Kozhikode Delivery',
    },
  ];

  return (
    <section
      id="how-to-order"
      className="relative w-full bg-[#F4F8FC] py-8 sm:py-12 md:py-20 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-3">
            <CheckCircle2 size={13} className="text-emerald-700" />
            <span>Ordering Process</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            How to Order
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#081426]/80 font-medium leading-relaxed">
            Fast, transparent, and direct B2B wholesale ordering for food businesses in Kozhikode.
          </p>
        </div>

        {/* 3-Step Grid: 2-Column on Mobile matching Why Global Trades, 3-Column on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 mb-8 sm:mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.number}
                className={`relative rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-7 border border-[#D0DFEF] shadow-2xs hover:shadow-lg hover:border-[#1A4C98]/40 transition-all duration-300 flex flex-col justify-between ${
                  isLast ? 'col-span-2 sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-6">
                    <span className="text-xl sm:text-4xl font-black text-[#1A4C98]/20">
                      {step.number}
                    </span>
                    <div className="size-8 sm:size-14 rounded-xl sm:rounded-2xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center shadow-xs">
                      <Icon size={16} className="sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-xl font-black text-[#081426] mb-1 sm:mb-3 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-[11px] sm:text-sm font-medium text-[#081426]/75 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {step.description}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-6 pt-2 sm:pt-4 border-t border-[#F0F5FA]">
                  <span className="inline-block text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1A4C98] bg-[#F4F8FC] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#D0DFEF] line-clamp-1">
                    {step.tip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
