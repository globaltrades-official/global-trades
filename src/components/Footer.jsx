import React from 'react';
import { BRANDING, CONTACT } from '@/constants/theme';
import { Phone, ArrowRight, MapPin, Mail, Clock } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export default function Footer({ onNavigate }) {
  return (
    <footer id="contact-footer" className="bg-gradient-to-b from-[#E8F1FB] via-[#E2EEF9] to-[#D7E8F7] text-[#081426] relative z-20 border-t border-[#1A4C98]/15 pt-14 pb-12">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative">
        {/* Top Standout Wholesale CTA Banner */}
        <div className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A4C98] via-[#123670] to-[#0A1D3D] text-white p-6 sm:p-8 lg:p-10 shadow-2xl shadow-[#1A4C98]/20 border border-white/10">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00A3E0]/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Delivery within Kozhikode &amp; Direct Store Pickup</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Need wholesale supply? Contact Global Trades.
              </h3>
              <p className="text-sm sm:text-base font-medium text-white/80 leading-relaxed">
                Visit our store for direct purchase or contact us for delivery within Kozhikode. Get institutional GST billing, bulk trade rates, and authorized brand freshness for your business.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={CONTACT.WHATSAPP_ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#081426] font-black px-5 py-3.5 text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp Orders: 0495 2765320</span>
              </a>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('contact')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black px-5 py-3.5 text-xs sm:text-sm uppercase tracking-wider border border-white/20 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Contact Us</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Balanced, Left-Aligned Columns */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 items-start pb-12 border-b border-[#1A4C98]/15">
          {/* Column 1: Brand & Ratings */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-4">
              <div className="size-14 md:size-16 shrink-0 rounded-full bg-white p-1.5 shadow-md shadow-[#1A4C98]/15 border border-[#1A4C98]/20">
                <img
                  src={BRANDING.LOGO_PATH}
                  alt="Global Trades Logo"
                  className="size-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-[#1A4C98] uppercase">
                  {BRANDING.COMPANY_NAME}
                </h3>
                <p className="text-xs font-black text-[#00A3E0] uppercase tracking-wider mt-0.5">
                  Wholesale Food Service · Based in Vellayil, Kozhikode
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-[#081426]/80 max-w-md leading-relaxed">
              Authorized Distributors, Dealers &amp; C&amp;F Agents of Processed Foods, Monin Gourmet Syrups, Continental Cafe Supplies &amp; Commercial Bakery Ingredients.
            </p>

            <div className="inline-flex items-center gap-2 rounded-xl bg-white/90 border border-[#1A4C98]/20 px-3.5 py-2 text-xs font-bold text-[#1A4C98] shadow-sm">
              <span className="text-amber-600 font-extrabold">★ 4.6 on Google Maps</span>
              <span className="text-gray-300">|</span>
              <span className="text-[#081426]/80">36 Verified Reviews</span>
            </div>
          </div>

          {/* Column 2: Exact Location & Store Pickup */}
          <div className="lg:col-span-4 space-y-3 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
              Distribution Hub &amp; Store
            </h4>
            
            <div className="font-semibold text-[#081426] leading-relaxed text-sm max-w-sm space-y-0.5">
              {CONTACT.ADDRESS_LINES.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            <p className="text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5 max-w-sm">
              🏬 <strong className="font-bold">Store Pickup:</strong> Customers are welcome to visit our PT Usha Road, Vellayil store for direct purchase. Delivery available across Kozhikode.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <a
                href={CONTACT.MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1A4C98] hover:text-[#00A3E0] transition-colors underline underline-offset-4"
              >
                <MapPin size={13} />
                <span>View on Google Maps ↗</span>
              </a>
              <span className="text-gray-300">·</span>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('contact')}
                className="text-xs font-extrabold uppercase tracking-wider text-[#1A4C98] hover:text-[#00A3E0] transition-colors underline underline-offset-4 cursor-pointer"
              >
                Directions &amp; Hours
              </button>
            </div>
          </div>

          {/* Column 3: Contact & Direct B2B Action */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
              Direct Orders &amp; Support
            </h4>

            <div className="space-y-2.5 text-sm text-[#081426]/85">
              <div>
                <span className="block text-[11px] font-bold text-[#081426]/60 uppercase tracking-wider">
                  Phone Enquiries
                </span>
                <a
                  href={`tel:${CONTACT.ENQUIRY_PHONE_RAW}`}
                  className="hover:text-[#00A3E0] transition-colors font-black text-[#1A4C98] inline-flex items-center gap-1.5"
                >
                  <Phone size={13} />
                  <span>Call for Enquiries: {CONTACT.ENQUIRY_PHONE}</span>
                </a>
              </div>

              <div>
                <span className="block text-[11px] font-bold text-[#081426]/60 uppercase tracking-wider">
                  WhatsApp Orders Desk
                </span>
                <a
                  href={CONTACT.WHATSAPP_ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors font-black text-emerald-800 inline-flex items-center gap-1.5"
                >
                  <WhatsAppIcon size={14} />
                  <span>WhatsApp Orders: {CONTACT.WHATSAPP_DISPLAY}</span>
                </a>
              </div>

              <div>
                <span className="block text-[11px] font-bold text-[#081426]/60 uppercase tracking-wider">
                  Office Desk
                </span>
                <a
                  href={`tel:${CONTACT.OFFICE_PHONE_RAW}`}
                  className="hover:text-[#1A4C98] transition-colors font-bold text-[#081426]/80 text-xs inline-flex items-center gap-1.5"
                >
                  <Phone size={12} />
                  <span>Office: {CONTACT.OFFICE_PHONE}</span>
                </a>
              </div>

              <div>
                <span className="block text-[11px] font-bold text-[#081426]/60 uppercase tracking-wider">
                  Official Email
                </span>
                <a
                  href={`mailto:${CONTACT.EMAIL}`}
                  className="hover:text-[#1A4C98] transition-colors font-semibold text-[#081426]/80 text-xs inline-flex items-center gap-1.5"
                >
                  <Mail size={12} />
                  <span>{CONTACT.EMAIL}</span>
                </a>
              </div>

              {/* Operating Hours Card */}
              <div className="rounded-xl bg-white/80 border border-emerald-700/20 p-2.5 text-xs font-bold text-emerald-950 shadow-sm">
                <span className="block text-[10px] uppercase tracking-wider text-emerald-800">Operating Schedule</span>
                <span className="flex items-center gap-1 text-[11px] text-[#081426]/80 mt-0.5">
                  <Clock size={11} className="text-emerald-700" />
                  <span>Open: {CONTACT.HOURS}</span>
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={CONTACT.WHATSAPP_ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-emerald-900/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp Orders: 0495 2765320</span>
              </a>
            </div>
          </div>
        </div>

        {/* B2B Navigation Quick Links */}
        <div className="py-6 border-b border-[#1A4C98]/15 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-[#081426]/75">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home', '#shop-by-category')}
            className="hover:text-[#1A4C98] transition-colors cursor-pointer"
          >
            Shop by Category
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home', '#why-choose-us')}
            className="hover:text-[#1A4C98] transition-colors cursor-pointer"
          >
            Why Choose Us
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home', '#brands')}
            className="hover:text-[#1A4C98] transition-colors cursor-pointer"
          >
            Our Brands
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home', '#industries')}
            className="hover:text-[#1A4C98] transition-colors cursor-pointer"
          >
            Industries We Serve
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home', '#how-to-order')}
            className="hover:text-[#1A4C98] transition-colors cursor-pointer"
          >
            How to Order
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home', '#benefits')}
            className="hover:text-[#1A4C98] transition-colors cursor-pointer"
          >
            Reviews
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home', '#supply-promise')}
            className="hover:text-[#1A4C98] transition-colors cursor-pointer"
          >
            Our Supply Promise
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home', '#faq')}
            className="hover:text-[#1A4C98] transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home', '#local-supply-hubs')}
            className="hover:text-[#1A4C98] transition-colors cursor-pointer"
          >
            Kozhikode Supply Hubs
          </button>
        </div>

        {/* Bottom Bar with perfect horizontal alignment */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs font-semibold text-[#081426]/65">
          <p>© {new Date().getFullYear()} Global Trades. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('contact')}
              className="hover:text-[#1A4C98] transition-colors"
            >
              Contact Page
            </button>
            <span>·</span>
            <span>PT Usha Road · Vellayil · Kozhikode</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
