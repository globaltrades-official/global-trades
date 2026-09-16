import React from 'react';
import {
  ShieldCheck,
  Boxes,
  Receipt,
  MessageSquareCheck,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

const PROMISES = [
  {
    title: 'Genuine, Authorized Products',
    icon: ShieldCheck,
    description: 'Authentic food-service stock sourced directly from verified authorized manufacturers and brand partners.',
  },
  {
    title: 'Commercial Bulk Supply',
    icon: Boxes,
    description: 'Institutional cartons, crate quantities, and bulk food-service sizes tailored for hospitality operators.',
  },
  {
    title: 'GST-Compliant Billing',
    icon: Receipt,
    description: '100% official tax invoicing with complete GST breakdown for proper commercial bookkeeping.',
  },
  {
    title: 'Quick WhatsApp Availability Confirmation',
    icon: WhatsAppIcon,
    description: 'Instant response on stock availability, batches, and volume quotations via WhatsApp (0495 2765320).',
  },
  {
    title: 'Kozhikode Delivery & Store Pickup',
    icon: Truck,
    description: 'Prompt delivery across Kozhikode or direct store pickup at our PT Usha Road, Vellayil warehouse.',
  },
];

export default function SupplyPromise() {
  return (
    <section
      id="supply-promise"
      className="relative w-full bg-white py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 mb-4">
            <CheckCircle2 size={14} className="text-emerald-700" />
            <span>Our Commitment to Food Businesses</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Our Supply Promise
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Five core pillars upholding our wholesale partnership with cafes, restaurants, bakeries, and caterers.
          </p>
        </div>

        {/* 5 Trust Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {PROMISES.map((promise, index) => {
            const Icon = promise.icon;

            return (
              <div
                key={promise.title}
                className="group rounded-3xl bg-[#F4F8FC] p-6 border border-[#D0DFEF] hover:border-emerald-600/40 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="size-12 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shadow-xs mb-5 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-200 border border-[#D0DFEF]">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-base font-black text-[#081426] group-hover:text-emerald-900 transition-colors mb-2 leading-snug">
                    {promise.title}
                  </h3>

                  <p className="text-xs font-medium text-[#081426]/75 leading-relaxed">
                    {promise.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#D0DFEF]/60">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>Guaranteed</span>
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
