'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { caseStudies, CaseStudy } from '@/data/casestudies';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { RevealText } from '@/components/shared/RevealText';

gsap.registerPlugin(ScrollTrigger);

export const CaseStudiesSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = ["All", "E-Commerce", "Website Design", "Digital Products", "Brand Identities"];
  const [activeFilter, setActiveFilter] = useState("All");
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setCardRef = (slug: string, el: HTMLDivElement | null) => {
    cardRefs.current[slug] = el;
  };

  const [activeCard, setActiveCard] = useState<{
    caseStudy: CaseStudy;
    rect: {
      top: number;
      left: number;
      width: number;
      height: number;
    };
  } | null>(null);

  const [isExpanding, setIsExpanding] = useState(false);

  const [effectiveBackFrom, setEffectiveBackFrom] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const fromQuery = new URLSearchParams(window.location.search).get('backFromCaseStudy');
    const fromSession = sessionStorage.getItem('activeCaseStudySlug');
    const targetSlug = fromQuery || fromSession;
    return targetSlug && caseStudies.some(c => c.slug === targetSlug) ? targetSlug : null;
  });

  // Clean up session storage only
  useEffect(() => {
    if (typeof window !== 'undefined' && effectiveBackFrom) {
      sessionStorage.removeItem('activeCaseStudySlug');
    }
  }, [effectiveBackFrom]);

  // Initial Entrance Animations
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const elementsToFadeUp = sectionRef.current.querySelectorAll('.fade-up-element');
    elementsToFadeUp.forEach((el) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    });
    
    const cards = sectionRef.current.querySelectorAll('.project-card');
    if (cards.length > 0) {
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%',
          }
        }
      );
    }
  }, []);

  // Forward transition triggers
  const handleCardClick = (e: React.MouseEvent, caseStudy: CaseStudy) => {
    e.preventDefault();
    if (isExpanding) return;

    const cardEl = cardRefs.current[caseStudy.slug];
    if (!cardEl) return;

    setIsExpanding(true);
    sessionStorage.setItem('activeCaseStudySlug', caseStudy.slug);

    const rect = cardEl.getBoundingClientRect();
    setActiveCard({
      caseStudy,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    });

    requestAnimationFrame(() => {
      if (!overlayRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => {
          router.push(`/casestudies/${caseStudy.slug}?fromGrid=true`);
        },
      });

      tl.to(
        overlayRef.current,
        {
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          borderRadius: '0px',
          duration: 0.65,
          ease: 'power3.inOut',
        },
        0
      );
    });
  };

  // Reverse Transition Trigger (Back Collapse)
  useLayoutEffect(() => {
    if (!effectiveBackFrom) return;

    const targetCaseStudy = caseStudies.find((c) => c.slug === effectiveBackFrom);
    if (!targetCaseStudy) return;

    setActiveCard({
      caseStudy: targetCaseStudy,
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
          if (searchParams.get('backFromCaseStudy')) {
            router.replace('/', { scroll: false });
          }
        },
      });

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

  // Client filtering
  const filteredCaseStudies = caseStudies.filter((cs) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "E-Commerce") return cs.category.includes("E-Commerce");
    if (activeFilter === "Website Design") return cs.category.includes("Digital Art");
    if (activeFilter === "Digital Products") return cs.category.includes("SaaS") || cs.category.includes("Platform");
    if (activeFilter === "Brand Identities") return cs.slug === "aeshut";
    return true;
  });

  return (
    <section 
      id="casestudies" 
      ref={sectionRef} 
      className={`relative w-full bg-white text-[#0A0D14] py-24 px-6 sm:px-12 md:px-16 flex justify-center overflow-hidden transition-all duration-300 ${
        activeCard ? 'z-50' : 'z-10'
      }`}
    >
      <div className="w-full max-w-[1600px]">
        
        {/* Title */}
        <h2 className="text-[14vw] sm:text-[12vw] lg:text-[9vw] font-medium tracking-tight leading-[0.9] mb-20 md:mb-32">
          <RevealText>Case Studies</RevealText>
        </h2>

        {/* Stats & Description */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-20 md:mb-32">
          <div className="flex items-center gap-5 lg:w-1/3 fade-up-element">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-[#0A0D14] text-white flex items-center justify-center font-medium text-xl sm:text-2xl">
              50+
            </div>
            <span className="text-slate-500 font-medium text-sm sm:text-base max-w-[120px] leading-tight">
              Websites Completed
            </span>
          </div>
          
          <div className="lg:w-2/3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-[#0A0D14]">
            <RevealText>
Explore a selection of projects built end-to-end — from concept to deployment. We combine modern technology with clean design to create SaaS platforms, e-commerce stores, and fintech solutions that drive real growth.
            </RevealText>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-12 md:mb-16 fade-up-element relative">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative px-6 py-3 rounded-full border text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors duration-300 ${
                activeFilter === filter
                  ? 'border-transparent text-white'
                  : 'border-slate-300 text-[#0A0D14] hover:border-[#0A0D14]'
              }`}
            >
              {activeFilter === filter && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-[#0A0D14] rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <span className="relative z-10 flex items-center">
                <AnimatePresence>
                  {activeFilter === filter && (
                    <motion.span
                      initial={{ width: 0, scale: 0, opacity: 0, marginRight: 0 }}
                      animate={{ width: 8, scale: 1, opacity: 1, marginRight: 8 }}
                      exit={{ width: 0, scale: 0, opacity: 0, marginRight: 0 }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                      className="h-2 rounded-full bg-[#2bf066] flex-shrink-0"
                    ></motion.span>
                  )}
                </AnimatePresence>
                {filter}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
          >
            {filteredCaseStudies.slice(0, 2).map((cs, idx) => (
              <a
                href={`/casestudies/${cs.slug}`}
                key={`${idx}-${activeFilter}`} 
                onClick={(e) => handleCardClick(e, cs)}
                className="project-card relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden group cursor-pointer bg-gray-200 block"
              >
                <div
                  ref={(el) => setCardRef(cs.slug, el)}
                  className="w-full h-full"
                >
                  <img
                    src={cs.heroImage}
                    alt={cs.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {idx === 0 && (
                    <div className="absolute top-6 right-6 px-6 py-2 bg-[#5252FF] text-white text-xs font-medium tracking-wide rounded-full z-10">
                      Latest
                    </div>
                  )}
                </div>
              </a>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Shared Element Hero Morph Overlay */}
      {activeCard && (
        <div
          ref={overlayRef}
          className="fixed overflow-hidden bg-zinc-950 pointer-events-none shadow-2xl z-[9999]"
          style={{
            top: activeCard.rect.top,
            left: activeCard.rect.left,
            width: activeCard.rect.width,
            height: activeCard.rect.height,
            borderRadius: '2rem',
          }}
        >
          <img
            src={activeCard.caseStudy.heroImage}
            alt={activeCard.caseStudy.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </section>
  );
};
