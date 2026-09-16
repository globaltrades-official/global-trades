import React from 'react';
import { Search, MessageSquare, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

export default function HowToOrder({ onNavigate }) {
  const steps = [
    {
      number: '01',
      title: 'Browse products or send your requirement',
      icon: Search,
      description:
        'Explore our catalogue by category or brand, or compile your kitchen supply list to send directly to us.',
      tip: 'Browse 200+ commercial food service items',
    },
    {
      number: '02',
      title: 'Request wholesale pricing on WhatsApp',
      icon: WhatsAppIcon,
      description:
        'Share your item requirements and quantities with our dedicated order desk for live stock status and bulk trade quotes.',
      tip: 'Dedicated Order Desk: 0495 2765320',
    },
    {
      number: '03',
      title: 'Collect from our Vellayil store or arrange Kozhikode delivery',
      icon: Truck,
      description:
        'Pick up your order directly from our PT Usha Road store in Vellayil, or schedule local delivery within Kozhikode.',
      tip: 'Store Pickup or Delivery Across Kozhikode',
    },
  ];

  return (
    <section
      id="how-to-order"
      className="relative w-full bg-[#F4F8FC] py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-4">
            <CheckCircle2 size={14} className="text-emerald-700" />
            <span>Simple 3-Step Ordering</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            How to Order
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Fast, transparent, and direct B2B wholesale ordering for food businesses in Kozhikode.
          </p>
        </div>

        {/* 3-Step Flow Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-3xl bg-white p-6 sm:p-8 border border-[#D0DFEF] shadow-sm hover:shadow-xl hover:border-[#1A4C98]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-black text-[#1A4C98]/20">
                      {step.number}
                    </span>
                    <div className="size-14 rounded-2xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center shadow-xs">
                      <Icon size={26} />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[#081426] mb-3 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-sm font-medium text-[#081426]/75 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F0F5FA]">
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#1A4C98] bg-[#F4F8FC] px-3 py-1 rounded-full border border-[#D0DFEF]">
                    {step.tip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Orders Highlight Box with Prominent CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-[#1A4C98] to-[#081426] text-white p-6 sm:p-10 shadow-xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30">
              <WhatsAppIcon size={14} />
              <span>WhatsApp Orders: {CONTACT.WHATSAPP_DISPLAY}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Ready to request wholesale pricing?
            </h3>
            <p className="text-sm sm:text-base text-white/80 font-medium max-w-xl">
              Send your item list directly to our sales desk. We respond promptly with live availability, institutional pricing, and delivery options.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={CONTACT.WHATSAPP_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#081426] font-black px-6 py-4 text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/30 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <WhatsAppIcon size={18} />
              <span>Get Wholesale Quote</span>
            </a>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-4 text-xs sm:text-sm uppercase tracking-wider border border-white/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Browse Catalogue</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
