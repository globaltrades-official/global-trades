import React from 'react';
import {
  Utensils,
  Receipt,
  MapPin,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function HowWeServe() {
  const steps = [
    {
      icon: Utensils,
      title: 'Wholesale Food Service Supply',
      subtitle: 'Engineered for Commercial Operators',
      description:
        'Dedicated bulk supply for cafes, restaurants, bakeries, caterers, and cloud kitchens with consistent culinary-grade quality.',
      highlight: 'Cafes · Bakeries · Cloud Kitchens · Hotels',
    },
    {
      icon: WhatsAppIcon,
      title: 'Bulk Quotation on WhatsApp',
      subtitle: 'Instant Spot Volume Pricing',
      description:
        'Send your item list or commercial requirements directly to our dedicated WhatsApp order desk (0495 2765320) for immediate wholesale quotes.',
      highlight: 'Direct Order Desk: 0495 2765320',
    },
    {
      icon: Receipt,
      title: '100% Compliant GST Invoices',
      subtitle: 'Official Commercial Billing',
      description:
        'Full B2B tax compliance with clear GST billing, itemized invoices, and official business accounts for institutional bookkeeping.',
      highlight: 'GST Registered Commercial Invoicing',
    },
    {
      icon: MapPin,
      title: 'Pickup from PT Usha Road',
      subtitle: 'Central Kozhikode Distribution Hub',
      description:
        'Customers are welcome to visit our PT Usha Road, Vellayil store for direct purchase and product collection.',
      highlight: 'Direct Store Pickup for All Customers',
    },
    {
      icon: Truck,
      title: 'Delivery Across Kozhikode',
      subtitle: 'Local Food Service Distribution',
      description:
        'Delivery available across Kozhikode. Scheduled route deliveries for cafes, restaurants, bakeries, and commercial kitchens.',
      highlight: 'Delivery Within Kozhikode Only',
    },
  ];

  return (
    <section
      id="how-we-serve"
      className="relative w-full bg-gradient-to-b from-[#F4F8FC] via-[#EDF4FC] to-[#E3EEFA] py-8 sm:py-12 md:py-20 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-3">
            <CheckCircle2 size={13} className="text-emerald-700" />
            <span>Dedicated B2B Food Distribution</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            How We Serve Businesses
          </h2>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-[#081426]/80 font-medium leading-relaxed">
            Visit our store for direct purchase or contact us for delivery within Kozhikode.
          </p>
        </div>

        {/* 5 Cards: 2-Column Grid on Mobile matching Why Global Trades, 3-Column on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.title}
                className={`group flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-7 border border-[#D0DFEF] shadow-2xs hover:shadow-lg hover:border-[#1A4C98]/30 transition-all duration-300 ${
                  isLast ? 'col-span-2 sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-5">
                    <div className="size-8 sm:size-12 rounded-xl sm:rounded-2xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center group-hover:bg-[#1A4C98] group-hover:text-white transition-colors duration-200">
                      <Icon size={16} className="sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#081426]/40">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-lg font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors leading-snug mb-0.5 sm:mb-1">
                    {step.title}
                  </h3>

                  <p className="text-[9px] sm:text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-1 sm:mb-3">
                    {step.subtitle}
                  </p>

                  <p className="text-[11px] sm:text-sm font-medium text-[#081426]/75 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {step.description}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-5 pt-2 sm:pt-4 border-t border-[#E8F1FB]">
                  <span className="text-[9px] sm:text-[11px] font-extrabold text-[#1A4C98] bg-[#F4F8FC] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full inline-block border border-[#D0DFEF] line-clamp-1">
                    {step.highlight}
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
