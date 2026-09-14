import React from 'react';
import { BRANDING, CONTACT } from '@/constants/theme';

export default function Footer({ onNavigate }) {
  return (
    <footer id="contact" className="bg-gradient-to-b from-[#E8F1FB] via-[#E2EEF9] to-[#D7E8F7] text-[#081426] relative z-20 border-t border-[#1A4C98]/15 pt-16 pb-12">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative">
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
                  Wholesale Food Service · Calicut
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

          {/* Column 2: Exact Location */}
          <div className="lg:col-span-4 space-y-3 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
              Distribution Hub &amp; Office
            </h4>
            
            <div className="font-semibold text-[#081426] leading-relaxed text-sm max-w-sm space-y-0.5">
              {CONTACT.ADDRESS_LINES.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            <div className="pt-1">
              <a
                href={CONTACT.MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1A4C98] hover:text-[#00A3E0] transition-colors underline underline-offset-4"
              >
                <span>View on Google Maps ↗</span>
              </a>
            </div>
          </div>

          {/* Column 3: Contact & Direct B2B Action */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
              Direct Orders &amp; Support
            </h4>

            <div className="space-y-2 text-sm text-[#081426]/85">
              <p>
                <span className="font-bold text-[#081426]">Mobile:</span>{' '}
                <a href={`tel:${CONTACT.PHONE.replace(/\s+/g, '')}`} className="hover:text-[#1A4C98] transition-colors font-bold text-[#1A4C98]">
                  {CONTACT.PHONE}
                </a>
              </p>
              <p>
                <span className="font-bold text-[#081426]">Office:</span>{' '}
                <a href={`tel:${CONTACT.OFFICE_PHONE_RAW}`} className="hover:text-[#1A4C98] transition-colors font-bold text-[#1A4C98]">
                  {CONTACT.OFFICE_PHONE}
                </a>
              </p>
              <p>
                <span className="font-bold text-[#081426]">WhatsApp:</span>{' '}
                <a
                  href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-800 transition-colors font-bold text-emerald-800"
                >
                  {CONTACT.OFFICE_PHONE}
                </a>
              </p>
              <p>
                <span className="font-bold text-[#081426]">Email:</span>{' '}
                <a
                  href={`mailto:${CONTACT.EMAIL}`}
                  className="hover:text-[#1A4C98] transition-colors font-bold text-[#1A4C98]"
                >
                  {CONTACT.EMAIL}
                </a>
              </p>

              {/* Operating Hours Card */}
              <div className="rounded-xl bg-white/80 border border-emerald-700/20 p-2.5 text-xs font-bold text-emerald-950 shadow-sm">
                <span className="block text-[10px] uppercase tracking-wider text-emerald-800">Operating Schedule</span>
                <span>Open: {CONTACT.HOURS}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=Hi%20Global%20Trades,%20I%20would%20like%20to%20place%20an%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-emerald-900/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with perfect horizontal alignment */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs font-semibold text-[#081426]/65">
          <p>© {new Date().getFullYear()} Global Trades. All rights reserved.</p>
          <p>PT Usha Road · Vellayil · Kozhikode</p>
        </div>
      </div>
    </footer>
  );
}
