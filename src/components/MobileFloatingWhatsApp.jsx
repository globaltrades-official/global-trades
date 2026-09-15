import React from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

export default function MobileFloatingWhatsApp() {
  return (
    <aside aria-label="Quick WhatsApp Ordering" className="md:hidden">
      <a
        href={CONTACT.WHATSAPP_ORDER_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order wholesale on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-4 py-3 shadow-xl shadow-emerald-950/30 border border-white/20 transition-transform cursor-pointer select-none"
      >
        <span className="relative flex size-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
          <span className="relative inline-flex rounded-full size-2.5 bg-white" />
        </span>
        <WhatsAppIcon size={19} className="shrink-0" />
        <span className="text-xs uppercase tracking-wider font-extrabold">WhatsApp Orders</span>
      </a>
    </aside>
  );
}
