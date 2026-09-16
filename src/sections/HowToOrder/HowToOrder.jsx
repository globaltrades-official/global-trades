import React from 'react';
import { Search, MessageSquare, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

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
          <div className="flex items-center justify-between sm:justify-center mb-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1A4C98]">
              <CheckCircle2 size={13} className="text-emerald-700" />
              <span>Ordering Process</span>
            </div>
            <span className="text-[10px] font-bold text-[#1A4C98]/70 md:hidden">
              Swipe Steps →
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            How to Order
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#081426]/80 font-medium leading-relaxed">
            Fast, transparent, and direct B2B wholesale ordering for food businesses in Kozhikode.
          </p>
        </div>

        {/* 3-Step Flow Layout: Horizontal Swipeable on Mobile, 3-Column on Desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8 mb-8 sm:mb-12 overflow-x-auto md:overflow-visible pb-3 md:pb-0 scrollbar-none snap-x snap-mandatory">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-7 md:p-8 border border-[#D0DFEF] shadow-sm hover:shadow-xl hover:border-[#1A4C98]/40 transition-all duration-300 flex flex-col justify-between min-w-[260px] md:min-w-0 snap-center shrink-0 md:shrink"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-4xl font-black text-[#1A4C98]/20">
                      {step.number}
                    </span>
                    <div className="size-11 sm:size-14 rounded-xl sm:rounded-2xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center shadow-xs">
                      <Icon size={22} className="sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-xl font-black text-[#081426] mb-2 sm:mb-3 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-medium text-[#081426]/75 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#F0F5FA]">
                  <span className="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1A4C98] bg-[#F4F8FC] px-2.5 sm:px-3 py-1 rounded-full border border-[#D0DFEF]">
                    {step.tip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Orders CTA Box */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-900 via-[#1A4C98] to-[#081426] text-white p-4 sm:p-8 md:p-10 shadow-xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-emerald-300 border border-emerald-400/30">
              <WhatsAppIcon size={13} />
              <span>WhatsApp Orders: {CONTACT.WHATSAPP_DISPLAY}</span>
            </div>
            <h3 className="text-lg sm:text-2xl md:text-3xl font-black">
              Ready to place or enquire about a wholesale order?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl font-medium">
              Send your order requirements directly to our Kozhikode team for immediate confirmation, trade invoice, and delivery coordination.
            </p>
          </div>

          <a
            href={CONTACT.WHATSAPP_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3 text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
          >
            <WhatsAppIcon size={16} />
            <span>Open WhatsApp Orders</span>
          </a>
        </div>
      </div>
    </section>
  );
}
