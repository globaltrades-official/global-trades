import React from 'react';
import { Store, Truck, Clock, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

export default function StoreDeliveryInfoCard({ className = '' }) {
  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-[#1A4C98] via-[#143B77] to-[#081426] text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/15 relative overflow-hidden ${className}`}
    >
      {/* Background ambient accents */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#00A3E0]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-emerald-500/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20 mb-4">
          <Store size={14} className="text-emerald-400" />
          <span>Kozhikode Service Information</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight mb-2">
          Store Pickup &amp; Kozhikode Delivery
        </h3>
        <p className="text-sm sm:text-base text-white/85 font-medium max-w-2xl leading-relaxed mb-6">
          Global Trades operates from Vellayil, Kozhikode, serving food service operators, cafes, restaurants, bakeries, and retail partners.
        </p>

        {/* Core details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* 1. Store Pickup */}
          <div className="rounded-2xl bg-white/10 p-4 border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-emerald-300 mb-1.5">
              <Store size={16} />
              <span>Store Pickup</span>
            </div>
            <p className="text-sm font-black text-white">
              PT Usha Road, Vellayil, Kozhikode
            </p>
            <p className="text-xs text-white/75 mt-1 font-medium">
              4th Gate, Zilla Housing Colony (Kerala 673032)
            </p>
          </div>

          {/* 2. Delivery */}
          <div className="rounded-2xl bg-white/10 p-4 border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-[#00A3E0] mb-1.5">
              <Truck size={16} />
              <span>Delivery Area</span>
            </div>
            <p className="text-sm font-black text-white">
              Available Within Kozhikode
            </p>
            <p className="text-xs text-white/75 mt-1 font-medium">
              Direct delivery to commercial kitchens &amp; cafes in Kozhikode
            </p>
          </div>

          {/* 3. Direct Purchase */}
          <div className="rounded-2xl bg-white/10 p-4 border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-amber-300 mb-1.5">
              <CheckCircle2 size={16} />
              <span>Direct Store Purchase</span>
            </div>
            <p className="text-sm font-black text-white">
              Customers Welcome to Visit
            </p>
            <p className="text-xs text-white/75 mt-1 font-medium">
              Walk-in purchase and commercial pickup at our warehouse
            </p>
          </div>

          {/* 4. Hours */}
          <div className="rounded-2xl bg-white/10 p-4 border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-white/80 mb-1.5">
              <Clock size={16} />
              <span>Operating Hours</span>
            </div>
            <p className="text-sm font-black text-white">
              Monday–Saturday, 10:00 AM–6:00 PM
            </p>
            <p className="text-xs text-white/75 mt-1 font-medium">
              Closed on Sundays
            </p>
          </div>

          {/* 5. Call for Enquiries */}
          <div className="rounded-2xl bg-white/10 p-4 border border-white/15 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-white/80 mb-1.5">
              <Phone size={16} />
              <span>Call for Enquiries</span>
            </div>
            <a
              href={`tel:${CONTACT.ENQUIRY_PHONE_RAW}`}
              className="text-sm font-black text-white hover:text-emerald-300 transition-colors block"
            >
              {CONTACT.ENQUIRY_PHONE}
            </a>
            <p className="text-xs text-white/75 mt-1 font-medium">
              General enquiries &amp; product availability
            </p>
          </div>

          {/* 6. WhatsApp Orders */}
          <div className="rounded-2xl bg-emerald-500/20 p-4 border border-emerald-400/30 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-emerald-300 mb-1.5">
              <WhatsAppIcon size={16} />
              <span>WhatsApp Orders</span>
            </div>
            <a
              href={CONTACT.WHATSAPP_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-black text-white hover:text-emerald-200 transition-colors block"
            >
              {CONTACT.WHATSAPP_DISPLAY}
            </a>
            <p className="text-xs text-white/75 mt-1 font-medium">
              Instant B2B wholesale quotes &amp; orders
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={CONTACT.WHATSAPP_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#081426] font-black px-5 py-3 text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon size={16} />
            <span>WhatsApp Orders: {CONTACT.WHATSAPP_DISPLAY}</span>
          </a>

          <a
            href={`tel:${CONTACT.ENQUIRY_PHONE_RAW}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black px-5 py-3 text-xs uppercase tracking-wider border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Phone size={15} />
            <span>Call: {CONTACT.ENQUIRY_PHONE}</span>
          </a>

          <a
            href={CONTACT.MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-transparent hover:bg-white/10 text-white font-bold px-4 py-3 text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
          >
            <MapPin size={15} />
            <span>Open Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}
