import React, { useRef, useState } from 'react';
import { Center, Environment, View } from '@react-three/drei';
import clsx from 'clsx';
import gsap from 'gsap';
import { MessageCircle, CheckCircle2 } from 'lucide-react';

import FloatingCan from '@/components/FloatingCan';
import { ArrowIcon } from './ArrowIcon';
import { WavyCircles } from './WavyCircles';
import { CONTACT } from '@/constants/theme';

const SPINS_ON_CHANGE = 8;

const PRODUCTS = [
  {
    key: 'monin',
    image: '/products/monin-syrup.jpg',
    color: '#1A4C98',
    accentColor: '#00A3E0',
    brand: 'Monin Gourmet Syrups',
    name: 'Monin Vanilla & Caramel Gourmet Syrups',
    pack: 'Case of 6 x 1000ml Bottles · Commercial Barista Crate',
    description: 'Flagship French culinary syrups favored by barista setups, mocktail lounges, and fine-dining cafes.',
    specs: 'Original French Gourmet Infusion · Barista Grade',
  },
  {
    key: 'morton',
    image: '/products/morton-peaches.jpg',
    color: '#B45309',
    accentColor: '#F59E0B',
    brand: 'Morton Choice Foods',
    name: 'Morton Choice Peach Halves in Heavy Syrup',
    pack: 'Case of 12 Cans (850g) · Food Service Master Pack',
    description: 'Tender golden Mediterranean peaches for continental bakeries, dessert buffets, and ice cream parlours.',
    specs: '850g Tins · Heavy Sugar Syrup · High Drain Weight',
  },
  {
    key: 'callebaut',
    image: '/products/callebaut-chocolate.jpg',
    color: '#3B1E08',
    accentColor: '#854D0E',
    brand: 'Barry Callebaut',
    name: 'Barry Callebaut Dark Chocolate Block 54.5%',
    pack: 'Master Carton 5kg Slab · Couverture Block',
    description: 'Finest Belgian chocolate block for artisan patisseries, chocolatiers, and luxury dessert crafting.',
    specs: '5kg Master Slab · Belgian Origin Couverture',
  },
  {
    key: 'goldenCrown',
    image: '/products/goldencrown-mushrooms.jpg',
    color: '#14532D',
    accentColor: '#22C55E',
    brand: 'Golden Crown Premium',
    name: 'Golden Crown Choice Button Mushrooms',
    pack: 'Case of 24 Cans (400g) · Commercial Kitchen Pack',
    description: 'Hand-picked tender whole button mushrooms in brine, ready for high-volume pizza, pasta, and continental curries.',
    specs: '400g Food Service Tins · Whole Buttons in Brine',
  },
  {
    key: 'veeba',
    image: '/products/veeba-mayo.jpg',
    color: '#991B1B',
    accentColor: '#E52528',
    brand: 'Veeba Food Services',
    name: 'Veeba Chef Special Real Mayonnaise 1kg',
    pack: 'Case of 12 Pouches (1kg) · Dispenser Packaging',
    description: 'High-stability rich emulsion crafted for professional burger bars, shawarma counters, and cafe kitchens.',
    specs: '1kg Professional Pouch · Heat Stable Formula',
  },
];

export default function Carousel() {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const productRef = useRef(null);

  function changeProduct(index) {
    if (!productRef.current) return;

    const nextIndex = (index + PRODUCTS.length) % PRODUCTS.length;

    const tl = gsap.timeline();

    tl.to(
      productRef.current.rotation,
      {
        y:
          index > currentProductIndex
            ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
            : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
        ease: 'power2.inOut',
        duration: 1,
      },
      0
    )
      .to(
        '.carousel-background, .wavy-circles-outer, .wavy-circles-inner',
        {
          backgroundColor: PRODUCTS[nextIndex].color,
          fill: PRODUCTS[nextIndex].color,
          ease: 'power2.inOut',
          duration: 1,
        },
        0
      )
      .to('.text-wrapper', { duration: 0.2, y: -10, opacity: 0 }, 0)
      .to({}, { onStart: () => setCurrentProductIndex(nextIndex) }, 0.5)
      .to('.text-wrapper', { duration: 0.2, y: 0, opacity: 1 }, 0.7);
  }

  const activeProduct = PRODUCTS[currentProductIndex];

  return (
    <section
      id="carousel"
      className="carousel relative min-h-[85vh] overflow-hidden bg-white py-14 md:py-20 text-white w-full"
    >
      <div className="carousel-background pointer-events-none absolute inset-0 bg-[#1A4C98] opacity-85 transition-colors duration-500" />

      <WavyCircles className="absolute left-1/2 top-1/2 h-[130vmin] -translate-x-1/2 -translate-y-1/2 text-[#1A4C98]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-6 md:mb-10">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/25">
            Wholesale Lines &amp; C&amp;F Distribution
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight drop-shadow-md">
            Featured Wholesale Lines
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-medium opacity-90 mt-2 max-w-2xl mx-auto leading-relaxed">
            Spin the 3D product showcase to explore each commercial line supplied directly to Kozhikode cafes and kitchens.
          </p>
        </div>

        {/* 3D Product Showcase Display */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 my-2 w-full max-w-4xl mx-auto">
          {/* Left Arrow */}
          <ArrowButton
            onClick={() => changeProduct(currentProductIndex + 1)}
            direction="left"
            label="Previous Product"
          />

          {/* 3D Product Showcase Display */}
          <View className="aspect-square h-[48vmin] min-h-60 max-h-[400px] w-full max-w-[400px]">
            <Center position={[0, 0, 0]}>
              <FloatingCan
                ref={productRef}
                textureUrl={activeProduct.image}
                floatIntensity={0.3}
                rotationIntensity={1}
                accentColor={activeProduct.accentColor}
                scale={1.05}
              />
            </Center>

            <Environment
              files="/hdr/lobby.hdr"
              environmentIntensity={0.9}
              environmentRotation={[0, 3, 0]}
            />
            <directionalLight intensity={5} position={[0, 1, 1]} />
          </View>

          {/* Right Arrow */}
          <ArrowButton
            onClick={() => changeProduct(currentProductIndex - 1)}
            direction="right"
            label="Next Product"
          />
        </div>

        {/* Product Information & Studio Packshot Card - Full Width 1280px Harmonious Layout */}
        <div className="w-full mt-6">
          <div className="text-wrapper rounded-3xl bg-white/15 backdrop-blur-md p-6 sm:p-8 md:p-10 border border-white/30 shadow-2xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Packshot Studio Display (lg:col-span-3) */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="size-44 sm:size-52 md:size-56 rounded-2xl overflow-hidden bg-white p-3 shadow-xl border-2 border-white/80 flex items-center justify-center">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="size-full object-contain rounded-xl transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Product Specifications & Details (lg:col-span-6) */}
              <div className="lg:col-span-6 text-left space-y-2.5">
                <div className="inline-flex items-center gap-2 rounded-md bg-white/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                  <span>{activeProduct.brand}</span>
                  <span className="opacity-50">·</span>
                  <span className="text-amber-300 font-bold">Authorized Distribution</span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow text-white leading-tight">
                  {activeProduct.name}
                </h3>

                <p className="text-xs sm:text-sm md:text-base font-bold text-amber-200">
                  {activeProduct.specs}
                </p>

                <p className="text-sm sm:text-base font-medium opacity-90 leading-relaxed text-white/95">
                  {activeProduct.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white border border-white/20">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Authorized C&amp;F Supply</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white border border-white/20">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Cold-Chain Maintained</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white border border-white/20">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Direct Malabar Distribution</span>
                  </span>
                </div>
              </div>

              {/* Order & Dispatch Panel (lg:col-span-3) */}
              <div className="lg:col-span-3 flex flex-col justify-center items-center lg:items-end gap-3.5 p-5 sm:p-6 rounded-2xl bg-white/10 border border-white/25 backdrop-blur-sm text-center lg:text-right">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Wholesale Order Desk
                  </span>
                  <p className="text-xs font-medium text-white/80 mt-1">
                    Direct bulk quotes for cafes, bakeries &amp; restaurants
                  </p>
                </div>

                <a
                  href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}?text=Hello%20Global%20Trades,%20I%20am%20interested%20in%20wholesale%20supply%20for%20${encodeURIComponent(activeProduct.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[#1A4C98] shadow-xl transition-all duration-200 hover:bg-amber-300 hover:text-[#081426] hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  <MessageCircle size={16} className="text-emerald-600 shrink-0" />
                  <span>Inquire on WhatsApp</span>
                </a>

                <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Instant Commercial Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail Selector for Instant Switching */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8">
            {PRODUCTS.map((prod, idx) => (
              <button
                key={prod.key}
                onClick={() => changeProduct(idx)}
                className={clsx(
                  'size-14 sm:size-16 md:size-20 rounded-2xl p-1.5 transition-all duration-200 border-2 overflow-hidden bg-white shadow-lg cursor-pointer',
                  idx === currentProductIndex
                    ? 'scale-110 border-amber-300 ring-4 ring-white/50'
                    : 'opacity-65 hover:opacity-100 hover:scale-105 border-white/40'
                )}
                title={prod.name}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="size-full object-contain rounded-xl"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowButton({ label, onClick, direction = 'right' }) {
  return (
    <button
      onClick={onClick}
      className="size-12 rounded-full border-2 border-white bg-white/15 p-3 opacity-85 ring-white transition-all hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20 cursor-pointer flex items-center justify-center backdrop-blur-sm"
      aria-label={label}
    >
      <ArrowIcon className={clsx(direction === 'right' && '-scale-x-100', 'w-full h-full')} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
