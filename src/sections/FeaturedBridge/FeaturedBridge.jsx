import React from 'react';
import {
  Truck,
  PackageCheck,
  ReceiptText,
  Store,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CONTACT } from '@/constants/theme';

const PILLARS = [
  {
    icon: Truck,
    title: 'Daily Route Delivery',
    subtitle: 'Across Kozhikode',
    desc: 'Prompt scheduled dispatches direct to cafes, bakeries, cloud kitchens & restaurants.',
    badge: 'Same-Day / Next-Day',
    accent: '#00A3E0',
  },
  {
    icon: PackageCheck,
    title: 'Commercial Pack Sizes',
    subtitle: 'Bulk Foodservice Lines',
    desc: 'Bulk institutional packs (1kg – 25kg), carton master cases & barista essentials.',
    badge: 'Culinary Grade',
    accent: '#10B981',
  },
  {
    icon: ReceiptText,
    title: 'Official GST Invoicing',
    subtitle: 'Institutional Compliance',
    desc: '100% compliant B2B tax invoices with clear batch traceability on every dispatch.',
    badge: '100% Tax Billing',
    accent: '#F59E0B',
  },
  {
    icon: Store,
    title: 'Vellayil Trade Counter',
    subtitle: 'Walk-in Store Pickup',
    desc: 'Central warehouse on PT Usha Road, Vellayil for instant order collections & sampling.',
    badge: 'Open Mon – Sat',
    accent: '#8B5CF6',
  },
];

export default function FeaturedBridge({ onNavigate }) {
  const scrollToCarousel = () => {
    const el = document.getElementById('carousel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#081426] via-[#0C2142] to-[#081426] py-10 sm:py-14 md:py-16 text-white overflow-hidden border-y border-[#1A4C98]/30 shadow-2xl">
      {/* Background Decorative Ambient Radial Glows */}
      <div className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 size-96 rounded-full bg-[#00A3E0]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 size-96 rounded-full bg-[#1A4C98]/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#00A3E0]/50 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Header Ribbon */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#00A3E0] backdrop-blur-md mb-3 shadow-inner">
            <ShieldCheck size={13} className="text-[#00A3E0]" />
            <span>Kozhikode Authorized Wholesale Distribution</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-sm">
            From Verified Global Brands to Your Kitchen
          </h2>

          <p className="mt-2 text-xs sm:text-sm md:text-base text-white/75 max-w-2xl leading-relaxed">
            Direct C&amp;F and wholesale supply channels engineered specifically for food businesses, cafes, hotels, and bakeries across Malabar.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 backdrop-blur-md p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                {/* Top Row: Icon + Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="size-10 sm:size-11 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${item.accent}20`,
                        border: `1px solid ${item.accent}40`,
                      }}
                    >
                      <Icon size={20} style={{ color: item.accent }} />
                    </div>

                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${item.accent}25`,
                        color: item.accent,
                        border: `1px solid ${item.accent}40`,
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-[#00A3E0] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <span className="text-[10px] sm:text-xs font-bold text-white/60 block mt-0.5 mb-2">
                    {item.subtitle}
                  </span>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Micro accent line */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-bold text-white/50">
                  <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                  <span className="truncate">Global Trades Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transition Connector leading to Carousel below */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <button
            onClick={scrollToCarousel}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00A3E0] to-[#1A4C98] hover:from-[#1A4C98] hover:to-[#00A3E0] px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#00A3E0]/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
          >
            <span>Explore Flagship In-Stock Wholesale Lines</span>
            <ArrowDown
              size={15}
              className="animate-bounce transition-transform group-hover:translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
