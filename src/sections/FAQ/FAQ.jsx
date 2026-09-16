import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

const FAQS = [
  {
    q: 'Do you deliver outside Kozhikode?',
    a: 'Delivery is available strictly within Kozhikode only. Customers and food businesses located outside Kozhikode are welcome to visit our Vellayil store for direct store pickup.',
  },
  {
    q: 'Can I purchase directly from the store?',
    a: 'Yes. Direct store purchase is available at our PT Usha Road, Vellayil store in Kozhikode. Customers and food businesses are welcome to visit and collect products directly.',
  },
  {
    q: 'How do I get wholesale prices?',
    a: 'Wholesale prices and commercial rates are confirmed on WhatsApp (0495 2765320). Share your required products and quantities with our sales desk for instant trade pricing.',
  },
  {
    q: 'Do you provide GST invoices?',
    a: 'Yes, GST billing is available for all commercial purchases. We provide official itemized GST tax invoices for your business records and tax compliance.',
  },
  {
    q: 'How can I check product availability?',
    a: 'Product availability is confirmed on WhatsApp at 0495 2765320 or by phone at 94479 31507. Please confirm availability before visiting for direct purchase.',
  },
  {
    q: 'What are store timings?',
    a: 'Our store in Vellayil, Kozhikode is open Monday through Saturday, from 10:00 AM to 6:00 PM. We are closed on Sundays.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-[#F4F8FC] py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-4xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-4">
            <HelpCircle size={14} className="text-[#00A3E0]" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Essential information on wholesale pricing, store pickup in Vellayil, and Kozhikode delivery.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-white border border-[#D0DFEF] shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFD] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-black text-[#081426] leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-[#1A4C98] text-white'
                        : 'bg-[#F4F8FC] text-[#1A4C98] border border-[#D0DFEF]'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#081426]/80 font-medium leading-relaxed border-t border-[#F0F5FA]">
                    <p className="pt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Questions Card */}
        <div className="mt-12 rounded-2xl bg-white p-6 border border-[#D0DFEF] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-[#081426]">
              Have a question about products or pricing?
            </h3>
            <p className="text-xs text-[#081426]/70 mt-0.5">
              Contact our sales desk on WhatsApp or call our office.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={CONTACT.WHATSAPP_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black px-4 py-2.5 text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon size={14} />
              <span>WhatsApp: {CONTACT.WHATSAPP_DISPLAY}</span>
            </a>

            <a
              href={`tel:${CONTACT.ENQUIRY_PHONE_RAW}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1A4C98] hover:bg-[#123873] text-white font-black px-4 py-2.5 text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Phone size={13} />
              <span>Call: {CONTACT.ENQUIRY_PHONE}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
