import React, { useState } from 'react';
import { BRANDING, CONTACT } from '@/constants/theme';
import { Menu, X, Package, Phone } from 'lucide-react';

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
      <div className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-3">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick('home', '#hero')}
          className="flex items-center gap-3 group text-left cursor-pointer border-none bg-transparent"
        >
          <div className="relative size-11 md:size-13 rounded-full bg-white p-1 shadow-md shadow-[#1A4C98]/20 transition-transform duration-300 group-hover:scale-105 border border-[#00A3E0]/30">
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
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/75 backdrop-blur-md border border-[#1A4C98]/15 shadow-sm">
          <button
            onClick={() => handleNavClick('home', '#hero')}
            className={`transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold ${
              currentPage === 'home' && (activeSection === 'hero' || !activeSection)
                ? 'text-white bg-[#1A4C98] shadow-sm font-black'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#1A4C98]/10'
            }`}
          >
            Home Overview
          </button>

          {/* Dedicated Products Page Tab */}
          <button
            onClick={() => handleNavClick('products')}
            className={`transition-all duration-200 cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold ${
              currentPage === 'products'
                ? 'text-white bg-[#1A4C98] shadow-sm font-black'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#1A4C98]/10'
            }`}
          >
            <Package size={14} />
            <span>Products</span>
          </button>

          <button
            onClick={() => handleNavClick('home', '#carousel')}
            className={`transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold ${
              activeSection === 'showcase' && currentPage !== 'admin'
                ? 'text-white bg-[#1A4C98] shadow-sm font-black'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#1A4C98]/10'
            }`}
          >
            Showcase
          </button>

          <button
            onClick={() => handleNavClick('home', '#contact')}
            className={`transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold ${
              activeSection === 'contact' && currentPage !== 'admin'
                ? 'text-white bg-[#1A4C98] shadow-sm font-black'
                : 'text-[#081426]/75 hover:text-[#1A4C98] hover:bg-[#1A4C98]/10'
            }`}
          >
            Location
          </button>
        </nav>

        {/* Quick Actions / Phone Numbers */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* 1st Number: Mobile */}
          <a
            href={`tel:${CONTACT.PHONE.replace(/\s+/g, '')}`}
            className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-emerald-800 px-2 py-1 sm:px-3 sm:py-1.5 text-white shadow-md shadow-emerald-900/20 transition-all duration-200 hover:bg-emerald-900 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            title={`Call Mobile: ${CONTACT.PHONE}`}
          >
            <Phone size={12} className="shrink-0 text-emerald-300" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] sm:text-[9px] text-emerald-200 font-extrabold tracking-wider uppercase">MOB</span>
              <span className="text-[10px] sm:text-xs font-black tracking-tight whitespace-nowrap mt-0.5">{CONTACT.PHONE}</span>
            </div>
          </a>

          {/* 2nd Number: Office */}
          <a
            href={`tel:${CONTACT.OFFICE_PHONE_RAW}`}
            className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#1A4C98] px-2 py-1 sm:px-3 sm:py-1.5 text-white shadow-md shadow-[#1A4C98]/20 transition-all duration-200 hover:bg-[#123873] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            title={`Call Office: ${CONTACT.OFFICE_PHONE}`}
          >
            <Phone size={12} className="shrink-0 text-sky-300" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] sm:text-[9px] text-sky-200 font-extrabold tracking-wider uppercase">OFFICE</span>
              <span className="text-[10px] sm:text-xs font-black tracking-tight whitespace-nowrap mt-0.5">0495 2765320</span>
            </div>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#081426] hover:text-[#1A4C98] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#D0DFEF] flex flex-col gap-2 pb-2">
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
            className={`text-left py-2.5 px-3 rounded-lg text-sm font-bold flex items-center gap-2.5 ${
              currentPage === 'products' ? 'bg-[#1A4C98] text-white' : 'text-[#1A4C98] bg-[#1A4C98]/10'
            }`}
          >
            <Package size={16} />
            <span>Products</span>
          </button>

          <button
            onClick={() => handleNavClick('home', '#carousel')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold ${
              activeSection === 'showcase' ? 'bg-[#1A4C98] text-white' : 'text-[#081426]'
            }`}
          >
            3D Product Showcase
          </button>

          <button
            onClick={() => handleNavClick('home', '#contact')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold ${
              activeSection === 'contact' ? 'bg-[#1A4C98] text-white' : 'text-[#081426]'
            }`}
          >
            Location & Contact Desk
          </button>

          {/* Direct Contact Buttons in Drawer */}
          <div className="pt-2 mt-1 border-t border-[#D0DFEF] flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#1A4C98] px-1">
              Direct Contact
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${CONTACT.PHONE.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-800 text-white font-bold text-xs shadow-sm hover:bg-emerald-900"
              >
                <Phone size={13} />
                <span>{CONTACT.PHONE}</span>
              </a>
              <a
                href={`tel:${CONTACT.OFFICE_PHONE_RAW}`}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#1A4C98] text-white font-bold text-xs shadow-sm hover:bg-[#123873]"
              >
                <Phone size={13} />
                <span>0495 2765320</span>
              </a>
            </div>
            <a
              href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=Hi%20Global%20Trades,%20I%20would%20like%20to%20place%20an%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>💬 WhatsApp Office: 0495 2765320</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
