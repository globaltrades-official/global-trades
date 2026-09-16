import React from 'react';
import {
  Utensils,
  Receipt,
  MapPin,
  Truck,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

export default function HowWeServe({ onNavigate }) {
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
      className="relative w-full bg-gradient-to-b from-[#F4F8FC] via-[#EDF4FC] to-[#E3EEFA] py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-4">
            <CheckCircle2 size={14} className="text-emerald-700" />
            <span>Dedicated B2B Food Distribution</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            How We Serve Businesses
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Visit our store for direct purchase or contact us for delivery within Kozhikode.
          </p>
        </div>

        {/* 5-Item Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isSpan = index === 3 || index === 4;

            return (
              <div
                key={step.title}
                className={`group flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-7 border border-[#D0DFEF] shadow-sm hover:shadow-xl hover:border-[#1A4C98]/30 transition-all duration-300 ${
                  index === 4 ? 'lg:col-span-1 md:col-span-2 lg:col-start-auto' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="size-12 rounded-2xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center group-hover:bg-[#1A4C98] group-hover:text-white transition-colors duration-200">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#081426]/40">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#081426] group-hover:text-[#1A4C98] transition-colors leading-snug mb-1">
                    {step.title}
                  </h3>

                  <p className="text-xs font-bold text-[#00A3E0] uppercase tracking-wider mb-3">
                    {step.subtitle}
                  </p>

                  <p className="text-sm font-medium text-[#081426]/75 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E8F1FB]">
                  <span className="text-[11px] font-extrabold text-[#1A4C98] bg-[#F4F8FC] px-3 py-1 rounded-full inline-block border border-[#D0DFEF]">
                    {step.highlight}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Quick Action Card in Grid */}
          <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#1A4C98] via-[#153F80] to-[#081426] p-6 sm:p-7 text-white shadow-lg border border-[#1A4C98]">
            <div>
              <div className="inline-block rounded-lg bg-white/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white mb-4">
                Fast Wholesale Turnaround
              </div>

              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2 leading-snug">
                Ready to Order or Request Volume Rates?
              </h3>

              <p className="text-sm text-white/85 font-medium leading-relaxed">
                Bulk orders, product availability, and Kozhikode delivery can be confirmed on WhatsApp.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 flex flex-col gap-2.5">
              <a
                href={CONTACT.WHATSAPP_ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp Orders: 0495 2765320</span>
              </a>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('products')}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-colors py-1 cursor-pointer"
                >
                  <span>Browse Product Catalogue</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Small "Need help choosing products?" CTA linked to WhatsApp order number */}
        <div className="mt-12 mx-auto max-w-2xl rounded-2xl bg-white/85 border border-[#1A4C98]/20 p-4 sm:p-5 shadow-sm backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="size-10 rounded-xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center shrink-0">
              <HelpCircle size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-[#081426]">
                Need help choosing products for your menu?
              </p>
              <p className="text-xs text-[#081426]/70 font-medium">
                Our food service specialists guide cafes, bakeries, and cloud kitchens on syrups, sauces, and ingredients.
              </p>
            </div>
          </div>

          <a
            href={CONTACT.WHATSAPP_HELP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <WhatsAppIcon size={15} />
            <span>Consult on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
