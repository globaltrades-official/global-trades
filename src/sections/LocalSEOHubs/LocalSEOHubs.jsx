import React, { useState } from 'react';
import {
  MapPin,
  Package,
  ArrowRight,
  Sparkles,
  Building2,
  Coffee,
  GlassWater,
  Cake,
  UtensilsCrossed,
  Globe2,
  CheckCircle2,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { CONTACT } from '@/constants/theme';

const SEO_HUBS = [
  {
    id: 'wholesale-food-supplier',
    title: 'Wholesale Food Supplier in Kozhikode',
    shortName: 'Wholesale Food Supplier',
    icon: Building2,
    badge: 'Central B2B Distribution',
    description:
      'Global Trades is an authorized wholesale distributor and C&F agent supplying commercial food businesses across Kozhikode. From our central warehouse at PT Usha Road, Vellayil, we provide restaurants, caterers, hotels, and retail stores with commercial crate and carton quantities, official GST billing, and consistent food-service inventory.',
    keyProducts: [
      'Institutional bulk sauces (1kg - 25kg)',
      'Gourmet culinary pastes & vinegars',
      'Commercial canned fruits & vegetables',
      'Hotel & dining room portion sachets',
    ],
    targetCategory: 'Sauces & Condiments',
    targetBrand: 'All',
    locationDetails:
      'Warehouse pickup at PT Usha Road, Vellayil. Route delivery scheduled throughout Kozhikode.',
    whatsappMessage:
      'Hi Global Trades, I am looking for a reliable wholesale food supplier in Kozhikode for my business.',
  },
  {
    id: 'cafe-supplies',
    title: 'Cafe Supplies in Kozhikode',
    shortName: 'Cafe Supplies',
    icon: Coffee,
    badge: 'Barista & Beverage',
    description:
      'Kozhikode’s booming specialty coffee and cafe culture demands consistent beverage ingredients. Global Trades supplies cafes with barista syrups, fruit smoothie purees, frappe bases, wrapped tea bags, instant coffee sachets, and table condiments, helping baristas craft signature beverages with premium consistency.',
    keyProducts: [
      'Gourmet flavored beverage syrups',
      'Real fruit purees & crushed toppings',
      'Tetley premium tea bags & envelopes',
      'MB portion sugar, salt, and pepper sachets',
    ],
    targetCategory: 'Syrups & Crushes',
    targetBrand: 'Monin',
    locationDetails:
      'Quick restock pickup for cafes in Beach Road, Mavoor Road, Vellayil, and across Kozhikode.',
    whatsappMessage:
      'Hi Global Trades, I need cafe supplies and beverage ingredients in Kozhikode.',
  },
  {
    id: 'monin-syrup-supplier',
    title: 'Monin Syrup Supplier in Kozhikode',
    shortName: 'Monin Syrup Supplier',
    icon: GlassWater,
    badge: 'Authorized Monin Stock',
    description:
      'Global Trades is the recognized local supplier of genuine Monin gourmet syrups and purees in Kozhikode. We maintain continuous stock of high-demand flavors including Vanilla, Caramel, Hazelnut, Blue Curacao, Green Apple, Passion Fruit, Strawberry, and Triple Sec in standard 1-liter foodservice packaging.',
    keyProducts: [
      'Monin Vanilla, Caramel & Hazelnut Syrups (1L)',
      'Monin Blue Curacao & Triple Sec (1L)',
      'Monin Green Apple, Passion Fruit & Strawberry (1L)',
      'Fruit purees & cocktail flavoring bases',
    ],
    targetCategory: 'Syrups & Crushes',
    targetBrand: 'Monin',
    locationDetails:
      'Fresh lot codes available for direct store purchase at Vellayil, Kozhikode, or delivery within Kozhikode.',
    whatsappMessage:
      'Hi Global Trades, I would like to order Monin Syrups wholesale in Kozhikode.',
  },
  {
    id: 'bakery-ingredients-wholesale',
    title: 'Bakery Ingredients Wholesale in Kozhikode',
    shortName: 'Bakery Ingredients Wholesale',
    icon: Cake,
    badge: 'Chocolates & Pastry',
    description:
      'Supplying Kozhikode’s professional bakeries, patisseries, and dessert chefs with premium confectionery ingredients. We stock authentic Callebaut Belgian couverture chocolate, compound chocolate chips, cocoa powder, bakery glazes, fruit fillings, and concentrated food essences in commercial trade packaging.',
    keyProducts: [
      'Callebaut Belgian chocolate & cocoa',
      'Dark, milk, and white compound chocolate chips',
      'Professional baking essences & extracts',
      'Gourmet canned fruit toppings & cherries',
    ],
    targetCategory: 'Chocolates & Bakery',
    targetBrand: 'Callebaut',
    locationDetails:
      'Store pickup at PT Usha Road, Vellayil, or scheduled delivery to bakeries across Kozhikode.',
    whatsappMessage:
      'Hi Global Trades, I am requesting wholesale bakery ingredients and chocolate rates in Kozhikode.',
  },
  {
    id: 'restaurant-supplies',
    title: 'Restaurant Supplies in Kozhikode',
    shortName: 'Restaurant Supplies',
    icon: UtensilsCrossed,
    badge: 'Commercial Kitchens',
    description:
      'Engineered for continental, Asian, Arabian, and multicuisine restaurant kitchens in Kozhikode. Our inventory encompasses Kikkoman naturally brewed soy sauce, Lee Kum Kee culinary seasonings, American Garden hot sauces, bulk mayonnaise, durum semolina pasta, and commercial cooking vinegars.',
    keyProducts: [
      'Kikkoman & Lee Kum Kee Asian sauces',
      'Durum wheat pasta (Penne, Fusilli, Spaghetti)',
      'Bulk mayonnaise, burger sauces & dips',
      'Fruitomans commercial sauces (1kg - 25kg)',
    ],
    targetCategory: 'Sauces & Condiments',
    targetBrand: 'Veeba',
    locationDetails:
      'Regular route deliveries to commercial kitchens across Kozhikode with itemized GST invoices.',
    whatsappMessage:
      'Hi Global Trades, I would like wholesale pricing for restaurant supplies in Kozhikode.',
  },
  {
    id: 'imported-food-products',
    title: 'Imported Food Products in Kozhikode',
    shortName: 'Imported Food Products',
    icon: Globe2,
    badge: 'International Culinary Lines',
    description:
      'Access verified imported food products without supply chain uncertainty. Global Trades stocks authentic imported European pasta, gourmet cheeses (Fortune parmesan, cheddar, and feta), Asian culinary vinegars, American sauces, and specialty canned goods directly for Kozhikode’s culinary community.',
    keyProducts: [
      'Fortune imported parmesan, feta & cheddar',
      'American Garden BBQ, hot sauce & dressings',
      'Imported Thai & Chinese seasoning sauces',
      'Authentic European durum semolina pastas',
    ],
    targetCategory: 'Frozen Foods',
    targetBrand: 'Fortune',
    locationDetails:
      'Authentic imports available for store inspection and purchase at PT Usha Road, Vellayil, Kozhikode.',
    whatsappMessage:
      'Hi Global Trades, I want to inquire about imported food products available in Kozhikode.',
  },
];

export default function LocalSEOHubs({ onNavigate }) {
  const [activeTab, setActiveTab] = useState(SEO_HUBS[0].id);

  const activeHub = SEO_HUBS.find((h) => h.id === activeTab) || SEO_HUBS[0];

  const handleCategoryNav = (cat, brand) => {
    if (onNavigate) {
      onNavigate('products', '#products', { category: cat, brand: brand !== 'All' ? brand : undefined });
    }
  };

  return (
    <section
      id="local-supply-hubs"
      className="relative w-full bg-white py-16 md:py-24 border-t border-[#1A4C98]/15"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A4C98]/10 border border-[#1A4C98]/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#1A4C98] mb-4">
            <MapPin size={14} className="text-[#00A3E0]" />
            <span>Kozhikode B2B Food Distribution</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#081426] leading-tight">
            Local Food Service Distribution
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#081426]/80 font-medium leading-relaxed">
            Targeted culinary supply solutions for cafes, restaurants, bakeries, and food businesses across Kozhikode.
          </p>
        </div>

        {/* Hub Selector Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {SEO_HUBS.map((hub) => {
            const Icon = hub.icon;
            const isSelected = hub.id === activeTab;

            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => setActiveTab(hub.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A4C98] text-white shadow-md shadow-[#1A4C98]/25 scale-105'
                    : 'bg-[#F4F8FC] text-[#081426]/75 hover:bg-[#E8F1FB] hover:text-[#1A4C98] border border-[#D0DFEF]'
                }`}
              >
                <Icon size={16} className={isSelected ? 'text-white' : 'text-[#1A4C98]'} />
                <span>{hub.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Hub Card Showcase */}
        <div className="rounded-3xl bg-[#F4F8FC] border border-[#D0DFEF] p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Descriptive Copy and Key Details (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1A4C98] border border-[#D0DFEF] shadow-2xs">
                <Sparkles size={13} className="text-[#00A3E0]" />
                <span>{activeHub.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#081426] leading-tight">
                {activeHub.title}
              </h3>

              <p className="text-sm sm:text-base font-medium text-[#081426]/80 leading-relaxed">
                {activeHub.description}
              </p>

              {/* Location details card */}
              <div className="rounded-2xl bg-white p-4 border border-[#D0DFEF] flex items-start gap-3">
                <div className="size-9 rounded-xl bg-[#1A4C98]/10 text-[#1A4C98] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#1A4C98]">
                    Kozhikode Service Area
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-[#081426] mt-0.5">
                    {activeHub.locationDetails}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    activeHub.whatsappMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black px-5 py-3 text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <WhatsAppIcon size={16} />
                  <span>Get Wholesale Quote</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCategoryNav(activeHub.targetCategory, activeHub.targetBrand)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1A4C98] hover:bg-[#123873] text-white font-black px-5 py-3 text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Package size={15} />
                  <span>View Products in Catalogue</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Column: Key Products Supplied & Trust Checkmarks (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-white p-6 sm:p-7 border border-[#D0DFEF] shadow-xs space-y-5">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#1A4C98]">
                  Key Product Categories
                </span>
                <h4 className="text-lg font-black text-[#081426] mt-1">
                  Available for Commercial Supply
                </h4>
              </div>

              <div className="space-y-3">
                {activeHub.keyProducts.map((prod, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="size-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#081426]/85 leading-snug">
                      {prod}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#F0F5FA] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#081426]/70">
                  <span>Store Pickup:</span>
                  <span className="text-[#081426] font-extrabold">PT Usha Road, Vellayil</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-[#081426]/70">
                  <span>Delivery Scope:</span>
                  <span className="text-emerald-800 font-extrabold">Within Kozhikode Only</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-[#081426]/70">
                  <span>Billing:</span>
                  <span className="text-[#1A4C98] font-extrabold">GST Invoices Provided</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
