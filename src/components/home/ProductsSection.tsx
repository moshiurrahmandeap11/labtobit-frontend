"use client";

import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, Product } from "@/data/products";
import { RevealText } from "@/components/shared/RevealText";
import { useRouter, useSearchParams } from "next/navigation";
import LiquidHoverWrapper from "@/components/shared/LiquidHoverWrapper";

gsap.registerPlugin(ScrollTrigger);

export const ProductsSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sectionRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const sectionContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [activeCard, setActiveCard] = useState<{
    product: Product;
    rect: {
      top: number;
      left: number;
      width: number;
      height: number;
    };
  } | null>(null);

  const [isExpanding, setIsExpanding] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setCardRef = (slug: string, el: HTMLDivElement | null) => {
    cardRefs.current[slug] = el;
  };

  // Reset expanding lock
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsExpanding(false);
  }, []);

  // GSAP Scroll Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate subtle glow movement in background based on scroll
      const glow = bgGlowRef.current;
      if (glow) {
        gsap.to(glow, {
          y: 100,
          x: -50,
          opacity: 0.15,
          duration: 2,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Stagger fade up items
      const fadeUpItems = sectionRef.current.querySelectorAll(".product-fade-up");
      fadeUpItems.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [effectiveBackFrom, setEffectiveBackFrom] = useState<string | null>(null);

  // Sync backFrom query parameter or sessionStorage
  useEffect(() => {
    const fromQuery = searchParams.get('backFrom');
    const fromSession = typeof window !== 'undefined' ? sessionStorage.getItem('activeProductSlug') : null;
    const targetSlug = fromQuery || fromSession;

    if (targetSlug && products.some(p => p.slug === targetSlug)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEffectiveBackFrom(targetSlug);
      if (fromSession) {
        sessionStorage.removeItem('activeProductSlug');
      }
    }
  }, [searchParams]);

  // Reverse Collapse Animation
  useLayoutEffect(() => {
    if (!effectiveBackFrom) return;

    const targetProduct = products.find((p) => p.slug === effectiveBackFrom);
    if (!targetProduct) return;

    // Immediately render full viewport overlay
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveCard({
      product: targetProduct,
      rect: {
        top: 0,
        left: 0,
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080,
      },
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      const cardEl = cardRefs.current[effectiveBackFrom];
      if (!cardEl) return;

      const cardRectInitial = cardEl.getBoundingClientRect();
      const targetY = window.scrollY + cardRectInitial.top - (window.innerHeight - cardRectInitial.height) / 2;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' });

      const rect = cardEl.getBoundingClientRect();
      gsap.set(cardEl, { opacity: 0 });

      if (sectionContentRef.current) {
        gsap.set(sectionContentRef.current, { opacity: 0, scale: 0.98 });
      }

      if (!overlayRef.current) return;

      gsap.set(overlayRef.current, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        zIndex: 9999,
        opacity: 1,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(cardEl, { opacity: 1 });
          setActiveCard(null);
          setIsExpanding(false);
          setEffectiveBackFrom(null);
          if (searchParams.get('backFrom')) {
            router.replace('/', { scroll: false });
          }
        },
      });

      if (sectionContentRef.current) {
        tl.to(
          sectionContentRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          0
        );
      }

      tl.to(
        overlayRef.current,
        {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: '2rem',
          duration: 0.7,
          ease: 'power3.inOut',
        },
        0
      );

      tl.to(
        cardEl,
        {
          opacity: 1,
          duration: 0.15,
          ease: 'power1.out',
        },
        '-=0.15'
      );
    });
  }, [effectiveBackFrom, router, searchParams]);

  const handleCardClick = (product: Product, containerEl: HTMLDivElement) => {
    if (isExpanding) return;
    setIsExpanding(true);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('activeProductSlug', product.slug);
    }

    const rect = containerEl.getBoundingClientRect();
    setActiveCard({
      product,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    });

    gsap.set(containerEl, { opacity: 0 });

    if (sectionContentRef.current) {
      gsap.to(sectionContentRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    requestAnimationFrame(() => {
      if (!overlayRef.current) return;

      gsap.set(overlayRef.current, {
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: '2rem',
        zIndex: 9999,
        opacity: 1,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          router.push(`/products/${product.slug}?fromGrid=true`);
        },
      });

      tl.to(overlayRef.current, {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        duration: 0.7,
        ease: 'power3.inOut',
      });
    });
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative z-10 w-full bg-white text-[#0A0D14] py-28 px-6 sm:px-12 md:px-16 overflow-hidden border-b border-gray-200"
    >
      {/* Background neon organic glows */}
      <div
        ref={bgGlowRef}
        className="absolute top-1/4 right-0 w-[50vw] h-[50vw] rounded-full bg-[#00E5FF] opacity-[0.06] blur-[120px] mix-blend-multiply pointer-events-none z-0"
      />
      <div className="absolute bottom-12 left-12 w-[35vw] h-[35vw] rounded-full bg-[#2D5BFF] opacity-[0.03] blur-[100px] mix-blend-multiply pointer-events-none z-0" />

      <div ref={sectionContentRef} className="relative z-10 max-w-[1600px] mx-auto w-full flex flex-col">
        {/* Section Header */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 border-b border-gray-300 pb-16">
          <h2 className="text-[12vw] lg:text-[8vw] leading-[0.9] tracking-tight font-medium text-[#0A0D14] whitespace-nowrap">
            <RevealText>Our Products</RevealText>
          </h2>
          <div className="text-xs sm:text-sm font-semibold tracking-wide max-w-sm uppercase text-slate-700 lg:pb-4 leading-relaxed">
            <RevealText>
              PROPRIETARY SAAS ENGINE PROJECTS AND PLUGINS ENGINEERED BY OUR R&D LAB FOR HIGH-GROWTH BRAND OPERATIONS.
            </RevealText>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full flex flex-col gap-16">
          {products.map((product) => (
            <div
              key={product.slug}
              className="product-fade-up grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Product Visual Mockup Container (Left - 7 columns) */}
              <div className="lg:col-span-7 w-full">
                <a
                  href={`/products/${product.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const cardEl = cardRefs.current[product.slug];
                    if (cardEl) {
                      handleCardClick(product, cardEl);
                    }
                  }}
                  className="block w-full focus:outline-none cursor-pointer"
                >
                  <div 
                    ref={(el) => setCardRef(product.slug, el)}
                    className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[2rem] overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl group"
                  >
                    <LiquidHoverWrapper
                      imageSrc={product.thumbnail}
                      intensity={45}
                      className="w-full h-full"
                    >
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-10" />
                    </LiquidHoverWrapper>

                    {/* Floating Status Tag */}
                    <div className="absolute top-6 left-6 z-30 flex items-center gap-2 text-xs font-semibold text-[#0c0c0e] bg-[#2bf066] px-4 py-1.5 rounded-full shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-[#0c0c0e] animate-ping" />
                      <span>BETA STAGING</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Product Info Description (Right - 5 columns) */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-4">
                <div className="flex flex-wrap gap-2">
                  {product.technicalStack.slice(0, 3).map((stack) => (
                    <span
                      key={stack}
                      className="px-3.5 py-1 text-[10px] font-bold tracking-widest text-[#2D5BFF] border border-[#2D5BFF]/15 rounded-full uppercase bg-[#2D5BFF]/5"
                    >
                      {stack.split(" ")[0]} {/* First word for badge brevity */}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#0A0D14]">
                    {product.title}
                  </h3>
                  <p className="text-sm font-semibold tracking-wider text-[#2D5BFF] uppercase">
                    {product.subtitle}
                  </p>
                </div>

                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                  {product.description}
                </p>

                {/* Dual Column Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
                  {product.coreFeatures.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0D14] flex items-center">
                        <span className="text-[#2D5BFF] mr-1.5 font-bold">✓</span>
                        {feat.title.split(" ")[0] || "Feature"}
                      </h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        {feat.description.slice(0, 75)}...
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href={`/products/${product.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const cardEl = cardRefs.current[product.slug];
                      if (cardEl) {
                        handleCardClick(product, cardEl);
                      }
                    }}
                    className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0A0D14] text-white font-bold text-xs tracking-wider uppercase hover:bg-[#2D5BFF] transition-all cursor-pointer shadow-md group"
                  >
                    <span>EXPLORE DETAILS</span>
                    <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>

                  <a
                    href={product.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-all text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-sm"
                  >
                    <span>LAUNCH WEB APP</span>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 16 16"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.667 11.333 11.333 4.667m0 0h-5.5m5.5 0v5.5"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Full Screen Overlay */}
      {activeCard && (
        <div
          ref={overlayRef}
          className="fixed overflow-hidden bg-zinc-950 pointer-events-none shadow-2xl"
          style={{
            top: activeCard.rect.top,
            left: activeCard.rect.left,
            width: activeCard.rect.width,
            height: activeCard.rect.height,
            borderRadius: '2rem',
            zIndex: 9999,
          }}
        >
          <img
            src={activeCard.product.thumbnail}
            alt={activeCard.product.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
