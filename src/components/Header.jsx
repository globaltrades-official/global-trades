import React, { useState } from 'react';
import { BRANDING, CONTACT } from '@/constants/theme';
import { Menu, X, Phone } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export default function Header({ currentPage = 'home', activeSection = 'hero', onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page, anchor) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(page, anchor);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#1A4C98]/15 shadow-sm">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-2.5">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick('home', '#hero')}
          className="flex items-center gap-3 group text-left cursor-pointer border-none bg-transparent"
        >
          <div className="relative size-11 md:size-12 rounded-full bg-white p-1 shadow-md shadow-[#1A4C98]/20 transition-transform duration-300 group-hover:scale-105 border border-[#00A3E0]/30">
            <img
              src={BRANDING.LOGO_PATH}
              alt="Global Trades Logo"
              className="size-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-tight text-[#1A4C98] uppercase leading-none">
              {BRANDING.COMPANY_NAME}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold text-[#E52528] tracking-wide uppercase">
                Kozhikode
              </span>
            </div>
          </div>
        </button>

        {/* Unified Glass Model Desktop Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-1 p-1 rounded-full bg-white/75 backdrop-blur-md border border-[#1A4C98]/15 shadow-sm">
          <button
            onClick={() => handleNavClick('home', '#hero')}
            className={`transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold ${
              currentPage === 'home' && (activeSection === 'hero' || !activeSection)
                ? 'text-white bg-[#1A4C98] shadow-sm font-black'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#1A4C98]/10'
            }`}
          >
            Home
          </button>

          {/* Dedicated Products Page Tab */}
          <button
            onClick={() => handleNavClick('products')}
            className={`transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold ${
              currentPage === 'products'
                ? 'text-white bg-[#1A4C98] shadow-sm font-black'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#1A4C98]/10'
            }`}
          >
            Products
          </button>

          <button
            onClick={() => handleNavClick('home', '#carousel')}
            className={`transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold ${
              activeSection === 'showcase' && currentPage === 'home'
                ? 'text-white bg-[#1A4C98] shadow-sm font-black'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#1A4C98]/10'
            }`}
          >
            Showcase
          </button>

          {/* Dedicated Brands Page Tab */}
          <button
            onClick={() => handleNavClick('brands')}
            className={`transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold ${
              currentPage === 'brands'
                ? 'text-white bg-[#1A4C98] shadow-sm font-black'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#1A4C98]/10'
            }`}
          >
            Brands
          </button>

          {/* Dedicated Contact Page Tab */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold ${
              currentPage === 'contact'
                ? 'text-white bg-[#1A4C98] shadow-sm font-black'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#1A4C98]/10'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Quick Actions / Dedicated Unmistakable Contact Channels */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Call for Enquiries: 94479 31507 */}
          <a
            href={`tel:${CONTACT.ENQUIRY_PHONE_RAW}`}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#1A4C98]/20 bg-white/80 px-2.5 py-1.5 text-[#1A4C98] shadow-sm transition-all duration-200 hover:bg-[#1A4C98] hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
            title="Call for Enquiries: 94479 31507"
          >
            <div className="size-6 rounded-lg bg-[#1A4C98]/10 flex items-center justify-center shrink-0">
              <Phone size={12} className="text-[#1A4C98]" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[9px] uppercase font-bold text-[#081426]/60 tracking-wider">
                Call for Enquiries
              </span>
              <span className="text-xs font-black tracking-tight whitespace-nowrap">
                {CONTACT.ENQUIRY_PHONE}
              </span>
            </div>
          </a>

          {/* WhatsApp Orders: 0495 2765320 */}
          <a
            href={CONTACT.WHATSAPP_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-2.5 sm:px-3 py-1.5 text-white shadow-md shadow-emerald-900/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            title="WhatsApp Orders: 0495 2765320"
          >
            <div className="size-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <WhatsAppIcon size={14} className="text-white" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[9px] uppercase font-extrabold text-emerald-200 tracking-wider">
                WhatsApp Orders
              </span>
              <span className="text-xs font-black tracking-tight whitespace-nowrap">
                {CONTACT.WHATSAPP_DISPLAY}
              </span>
            </div>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-[#081426] hover:text-[#1A4C98] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden px-4 pt-2 pb-4 border-t border-[#D0DFEF] bg-white/95 backdrop-blur-md flex flex-col gap-2">
          <button
            onClick={() => handleNavClick('home', '#hero')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold ${
              currentPage === 'home' ? 'bg-[#1A4C98] text-white' : 'text-[#081426]'
            }`}
          >
            Home Overview
          </button>

          <button
            onClick={() => handleNavClick('products')}
            className={`text-left py-2.5 px-3 rounded-lg text-sm font-bold ${
              currentPage === 'products' ? 'bg-[#1A4C98] text-white' : 'text-[#1A4C98] bg-[#1A4C98]/10'
            }`}
          >
            Products
          </button>

          <button
            onClick={() => handleNavClick('home', '#carousel')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold ${
              activeSection === 'showcase' && currentPage === 'home' ? 'bg-[#1A4C98] text-white' : 'text-[#081426]'
            }`}
          >
            Featured Showcase
          </button>

          <button
            onClick={() => handleNavClick('brands')}
            className={`text-left py-2.5 px-3 rounded-lg text-sm font-bold ${
              currentPage === 'brands' ? 'bg-[#1A4C98] text-white' : 'text-[#1A4C98] bg-[#1A4C98]/10'
            }`}
          >
            Trusted Brands
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`text-left py-2.5 px-3 rounded-lg text-sm font-bold ${
              currentPage === 'contact' ? 'bg-[#1A4C98] text-white' : 'text-[#081426]'
            }`}
          >
            Contact Global Trades
          </button>

          {/* Direct Contact Channels in Drawer */}
          <div className="pt-3 mt-1 border-t border-[#D0DFEF] flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#1A4C98] px-1">
              Direct B2B Contacts
            </span>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${CONTACT.ENQUIRY_PHONE_RAW}`}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#1A4C98]/20 bg-white text-[#1A4C98] font-bold text-xs shadow-sm hover:bg-[#1A4C98] hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>Call for Enquiries:</span>
                </div>
                <span className="font-black text-sm">{CONTACT.ENQUIRY_PHONE}</span>
              </a>
              <a
                href={CONTACT.WHATSAPP_ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  <WhatsAppIcon size={16} />
                  <span>WhatsApp Orders:</span>
                </div>
                <span className="font-black text-sm">{CONTACT.WHATSAPP_DISPLAY}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
