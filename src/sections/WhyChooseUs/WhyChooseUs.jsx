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
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

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
      className="relative w-full bg-white py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-4">
            <CheckCircle2 size={14} className="text-emerald-700" />
            <span>Reliable B2B Partner</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Why Global Trades
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Genuine wholesale supply, transparent trade pricing, and responsive local service for food businesses in Kozhikode.
          </p>
        </div>

        {/* 6 Simple Cards in 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <div
                key={reason.title}
                className="group rounded-3xl bg-[#F4F8FC] p-6 sm:p-7 border border-[#D0DFEF] hover:border-[#1A4C98]/40 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="size-12 rounded-2xl bg-white text-[#1A4C98] flex items-center justify-center shadow-xs group-hover:bg-[#1A4C98] group-hover:text-white transition-colors duration-200 border border-[#D0DFEF]">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-black text-[#081426]/30">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors mb-2 leading-snug">
                    {reason.title}
                  </h3>

                  <p className="text-sm font-medium text-[#081426]/75 leading-relaxed">
                    {reason.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#D0DFEF]/60">
                  <span className="text-[11px] font-extrabold text-[#1A4C98] uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>Verified Food Service Supply</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Service Visibility Callout */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#1A4C98]/5 via-[#00A3E0]/10 to-emerald-500/10 border border-[#1A4C98]/15 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-black text-[#081426]">
              Store Pickup in Vellayil &amp; Delivery Within Kozhikode
            </p>
            <p className="text-xs text-[#081426]/70 mt-0.5">
              PT Usha Road, Vellayil, Kozhikode · Direct store visits welcome Mon–Sat 10:00 AM–6:00 PM.
            </p>
          </div>

          <a
            href={CONTACT.WHATSAPP_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-4 py-2.5 text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <WhatsAppIcon size={14} />
            <span>Order on WhatsApp: 0495 2765320</span>
          </a>
        </div>
      </div>
    </section>
  );
}
