import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  Send,
  ArrowLeft,
  Store,
  Truck,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import StoreDeliveryInfoCard from '@/components/StoreDeliveryInfoCard';
import { BRANDING, CONTACT } from '@/constants/theme';

export default function ContactPage({ onNavigateHome, onNavigateProducts }) {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    requirement: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Please enter your contact phone number.');
      return;
    }
    if (!formData.requirement.trim()) {
      setFormError('Please specify the products or requirements you are interested in.');
      return;
    }

    // Generate formatted WhatsApp message
    const lines = [
      'Hello Global Trades, I would like to request a wholesale quote:',
      `*Name:* ${formData.name.trim()}`,
      formData.businessName.trim() ? `*Business Name:* ${formData.businessName.trim()}` : null,
      `*Phone:* ${formData.phone.trim()}`,
      `*Product / Requirement:* ${formData.requirement.trim()}`,
      formData.message.trim() ? `*Additional Details:* ${formData.message.trim()}` : null,
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#081426] pb-24 pt-4">
      {/* Top Breadcrumb Bar */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#D0DFEF]">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1A4C98] hover:text-[#123873] transition-colors group cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-[#081426]/70">
            <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Wholesale Desk Open · PT Usha Rd, Kozhikode</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#1A4C98] via-[#163F7F] to-[#081426] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute top-0 right-0 size-64 rounded-full bg-[#00A3E0]/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 size-64 rounded-full bg-emerald-500/15 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20 mb-4">
              <Store size={14} className="text-emerald-400" />
              <span>Direct Store Purchase · Kozhikode Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              Contact Global Trades
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-xl text-white/90 font-medium leading-relaxed">
              For wholesale enquiries, bulk orders, product availability, and commercial supply support.
            </p>

            {/* Delivery Notice Callout */}
            <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-xs md:text-sm font-semibold text-white backdrop-blur-sm">
              <Truck size={18} className="text-amber-300 shrink-0" />
              <span>
                <strong>Service Area:</strong> Visit our store for direct purchase or contact us for delivery within Kozhikode.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 6 Core Contact Channels (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Action Row: WhatsApp & Enquiry Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Channel 1: WhatsApp Orders & Bulk Quotes (Primary Green CTA) */}
              <div className="rounded-2xl bg-white p-6 border-2 border-emerald-600/30 shadow-md flex flex-col justify-between hover:border-emerald-600 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <WhatsAppIcon size={24} />
                    </div>
                    <span className="rounded-full bg-emerald-800 text-white text-[10px] font-black uppercase px-2.5 py-0.5 tracking-wider">
                      Primary Orders
                    </span>
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-emerald-800">
                    WhatsApp for Orders &amp; Bulk Quotes
                  </h2>
                  <p className="text-xl sm:text-2xl font-black text-[#081426] mt-1">
                    {CONTACT.WHATSAPP_DISPLAY}
                  </p>
                  <p className="text-xs text-[#081426]/70 mt-2 font-medium">
                    Fastest response for instant volume quotes, stock checks, and commercial purchase orders.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#D0DFEF]">
                  <a
                    href={CONTACT.WHATSAPP_ORDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <WhatsAppIcon size={16} />
                    <span>Order on WhatsApp: 0495 2765320</span>
                  </a>
                </div>
              </div>

              {/* Channel 2: Call for General Enquiries (Separate Phone Line) */}
              <div className="rounded-2xl bg-white p-6 border border-[#D0DFEF] shadow-sm flex flex-col justify-between hover:border-[#1A4C98]/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-11 rounded-xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center">
                      <Phone size={22} />
                    </div>
                    <span className="rounded-full bg-[#1A4C98]/10 text-[#1A4C98] text-[10px] font-black uppercase px-2.5 py-0.5 tracking-wider">
                      Phone Line
                    </span>
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
                    Call for General Enquiries
                  </h2>
                  <p className="text-xl sm:text-2xl font-black text-[#081426] mt-1">
                    {CONTACT.ENQUIRY_PHONE}
                  </p>
                  <p className="text-xs text-[#081426]/70 mt-2 font-medium">
                    Dedicated line for general questions, brand inquiries, and product guidance.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#D0DFEF]">
                  <a
                    href={`tel:${CONTACT.ENQUIRY_PHONE_RAW}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A4C98] hover:bg-[#123873] px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Phone size={15} />
                    <span>Call General Enquiries: 94479 31507</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Office Contact & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Channel 3: Office Contact */}
              <div className="rounded-2xl bg-white p-5 border border-[#D0DFEF] shadow-sm flex items-start gap-4">
                <div className="size-10 rounded-xl bg-[#00A3E0]/10 text-[#00A3E0] flex items-center justify-center shrink-0 mt-1">
                  <Building2 size={20} />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#081426]/60">
                    Office
                  </span>
                  <p className="text-base font-black text-[#081426]">
                    <a
                      href={`tel:${CONTACT.OFFICE_PHONE_RAW}`}
                      className="hover:text-[#1A4C98] transition-colors"
                    >
                      {CONTACT.OFFICE_PHONE}
                    </a>
                  </p>
                  <p className="text-xs text-[#081426]/70 font-medium">
                    Administrative desk &amp; distribution center line.
                  </p>
                </div>
              </div>

              {/* Channel 4: Email */}
              <div className="rounded-2xl bg-white p-5 border border-[#D0DFEF] shadow-sm flex items-start gap-4">
                <div className="size-10 rounded-xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center shrink-0 mt-1">
                  <Mail size={20} />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#081426]/60">
                    Official Email
                  </span>
                  <p className="text-sm font-black text-[#081426] break-all">
                    <a
                      href={`mailto:${CONTACT.EMAIL}`}
                      className="hover:text-[#1A4C98] transition-colors"
                    >
                      {CONTACT.EMAIL}
                    </a>
                  </p>
                  <p className="text-xs text-[#081426]/70 font-medium">
                    Corporate correspondence and formal inquiries.
                  </p>
                </div>
              </div>
            </div>

            {/* Channel 5: Address and Location with Embedded Map */}
            <div className="rounded-3xl bg-white p-6 md:p-8 border border-[#D0DFEF] shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
                      Address &amp; Distribution Hub
                    </span>
                    <h3 className="text-lg font-black text-[#081426] leading-snug mt-0.5">
                      PT Usha Road, 4th Gate, Vellayil, Kozhikode
                    </h3>
                    <p className="text-xs text-[#081426]/75 font-medium mt-1">
                      {CONTACT.ADDRESS}
                    </p>
                  </div>
                </div>

                <a
                  href={CONTACT.MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1A4C98] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#1A4C98] hover:bg-[#1A4C98] hover:text-white transition-all self-start sm:self-auto shrink-0 shadow-sm"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Store Pickup Notice */}
              <div className="rounded-xl bg-[#F4F8FC] border border-[#D0DFEF] p-3 text-xs font-semibold text-[#081426] flex items-center gap-2">
                <Store size={16} className="text-emerald-700 shrink-0" />
                <span>
                  <strong>Store Purchase:</strong> Customers are welcome to visit our PT Usha Road, Vellayil store for direct purchase and product collection.
                </span>
              </div>

              {/* Embedded Google Maps View (Lazy Loaded) */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#D0DFEF] shadow-inner bg-[#E2ECF8]">
                <iframe
                  title="Global Trades Kozhikode Location"
                  src="https://maps.google.com/maps?q=Global+Trades+PT+Usha+Road+Kozhikode&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="size-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Channel 6: Business Hours Card */}
            <div className="rounded-2xl bg-white p-6 border border-[#D0DFEF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
                    Operating Schedule
                  </span>
                  <p className="text-sm font-black text-[#081426] mt-0.5">
                    Monday–Saturday: 10:00 AM–6:00 PM
                  </p>
                  <p className="text-xs text-[#081426]/60 font-semibold">
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 shrink-0 self-start sm:self-auto">
                <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Working Mon–Sat</span>
              </div>
            </div>
          </div>

          {/* Right Column: "Request a Wholesale Quote" Form (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 rounded-3xl bg-white p-6 sm:p-8 border border-[#D0DFEF] shadow-lg">
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1A4C98]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#1A4C98] mb-2">
                  <ShieldCheck size={13} />
                  <span>Commercial Procurement</span>
                </div>
                <h2 className="text-2xl font-black text-[#081426]">
                  Request a Wholesale Quote
                </h2>
                <p className="text-xs text-[#081426]/70 mt-1 font-medium leading-relaxed">
                  Fill out your requirements below. Your enquiry will open directly on our dedicated WhatsApp order desk (0495 2765320) for rapid confirmation.
                </p>
              </div>

              {formSubmitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-4">
                  <div className="size-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-emerald-900">
                      Enquiry Form Prepared!
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1 font-medium">
                      If WhatsApp did not open automatically, click the button below to send your quotation request directly.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={handleFormSubmit}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md cursor-pointer"
                    >
                      <WhatsAppIcon size={16} />
                      <span>Open WhatsApp Enquiry</span>
                    </button>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({
                          name: '',
                          businessName: '',
                          phone: '',
                          requirement: '',
                          message: '',
                        });
                      }}
                      className="text-xs font-bold text-[#1A4C98] hover:underline py-1 cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700">
                      {formError}
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="quote-name"
                      className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1.5"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="quote-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Mohammed Irshad"
                      className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-3 text-sm font-semibold text-[#081426] placeholder-[#081426]/40 focus:border-[#1A4C98] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Business Name Input */}
                  <div>
                    <label
                      htmlFor="quote-business"
                      className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1.5"
                    >
                      Business / Kitchen Name
                    </label>
                    <input
                      id="quote-business"
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g., Beach Road Cafe / Gourmet Patisserie"
                      className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-3 text-sm font-semibold text-[#081426] placeholder-[#081426]/40 focus:border-[#1A4C98] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label
                      htmlFor="quote-phone"
                      className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1.5"
                    >
                      Contact Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="quote-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., 98470 12345"
                      className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-3 text-sm font-semibold text-[#081426] placeholder-[#081426]/40 focus:border-[#1A4C98] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Product / Requirement Input */}
                  <div>
                    <label
                      htmlFor="quote-requirement"
                      className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1.5"
                    >
                      Product / Requirement <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="quote-requirement"
                      name="requirement"
                      type="text"
                      required
                      value={formData.requirement}
                      onChange={handleInputChange}
                      placeholder="e.g., Monin Vanilla Syrups, Callebaut 5kg, Mayonnaise"
                      className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-3 text-sm font-semibold text-[#081426] placeholder-[#081426]/40 focus:border-[#1A4C98] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <label
                      htmlFor="quote-message"
                      className="block text-xs font-bold uppercase tracking-wider text-[#081426]/70 mb-1.5"
                    >
                      Message / Quantity Details
                    </label>
                    <textarea
                      id="quote-message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Specify carton quantities, delivery requirement in Kozhikode, or store pickup date..."
                      className="w-full rounded-xl border border-[#D0DFEF] bg-[#F4F8FC] px-4 py-3 text-sm font-semibold text-[#081426] placeholder-[#081426]/40 focus:border-[#1A4C98] focus:bg-white focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-900/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <WhatsAppIcon size={18} />
                    <span>Send Wholesale Enquiry on WhatsApp</span>
                  </button>

                  {/* WhatsApp Note */}
                  <p className="text-center text-[11px] font-semibold text-[#081426]/60">
                    ℹ️ Your enquiry will open in WhatsApp for faster response.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Store Pickup & Kozhikode Delivery Information Card */}
        <div className="mt-12">
          <StoreDeliveryInfoCard />
        </div>
      </div>
    </div>
  );
}
