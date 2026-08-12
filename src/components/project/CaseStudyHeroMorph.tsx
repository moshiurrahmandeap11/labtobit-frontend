'use client';

import React, { useRef, useState, useEffect, useLayoutEffect, Suspense } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { useSearchParams, useRouter } from 'next/navigation';
import { CaseStudy } from '@/data/casestudies';

interface CaseStudyHeroMorphProps {
  caseStudy: CaseStudy;
  children: React.ReactNode;
}

const CaseStudyHeroMorphContent = ({ caseStudy, children }: CaseStudyHeroMorphProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromGrid = searchParams.get('fromGrid') === 'true';

  const leftContentRef = useRef<HTMLDivElement>(null);
  const mediaBoxRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isMorphing, setIsMorphing] = useState(fromGrid);

  useLayoutEffect(() => {
    if (!fromGrid || !mediaBoxRef.current) return;

    if (typeof window !== 'undefined') {
      const win = window as unknown as { lenis?: { scrollTo: (target: number, options?: { immediate: boolean }) => void } };
      win.lenis?.scrollTo(0, { immediate: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Lock body background color to dark theme #0b100d
    document.body.style.backgroundColor = '#0b100d';

    const targetRect = mediaBoxRef.current.getBoundingClientRect();

    // Hide left content initially to animate in smoothly
    if (leftContentRef.current) {
      gsap.set(leftContentRef.current, { opacity: 0, y: 25 });
    }

    // Set initial full-screen overlay state immediately on mount
    if (overlayRef.current) {
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
          setIsMorphing(false);
          router.replace(`/casestudies/${caseStudy.slug}`, { scroll: false });
        },
      });

      // 1. Morph full-screen overlay down into the right-column showcase media box
      tl.to(
        overlayRef.current,
        {
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
          borderRadius: '2rem',
          duration: 0.7,
          ease: 'power3.inOut',
        },
        0
      );

      // 2. Fade & slide in left column title and description
      if (leftContentRef.current) {
        tl.to(
          leftContentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
          },
          0.15
        );
      }
    }
  }, [fromGrid, caseStudy.slug, router]);

  // Listen for Reverse Morph trigger from Navbar Back button and Browser Back button
  useEffect(() => {
    let isReversing = false;

    // Push a dummy history state guard to trap browser back gesture on details page
    if (typeof window !== 'undefined') {
      window.history.pushState({ morphGuard: true }, '', window.location.href);
    }

    const handleReverse = () => {
      if (!mediaBoxRef.current || isReversing) return;
      isReversing = true;

      const currentRect = mediaBoxRef.current.getBoundingClientRect();

      // Force synchronous React state flush so overlayRef renders immediately without transition delay
      flushSync(() => {
        setIsMorphing(true);
      });

      requestAnimationFrame(() => {
        if (!overlayRef.current) return;

        gsap.set(overlayRef.current, {
          position: 'fixed',
          top: currentRect.top,
          left: currentRect.left,
          width: currentRect.width,
          height: currentRect.height,
          borderRadius: '2rem',
          zIndex: 9999,
          opacity: 1,
        });

        const tl = gsap.timeline({
          onComplete: () => {
            router.replace(`/?backFrom=${caseStudy.slug}`);
          },
        });

        // 1. Expand showcase media box back to 100vw x 100vh full screen
        tl.to(
          overlayRef.current,
          {
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            borderRadius: '0px',
            duration: 0.55,
            ease: 'power3.inOut',
          },
          0
        );

        // 2. Fade out left column details title and description
        if (leftContentRef.current) {
          tl.to(
            leftContentRef.current,
            {
              opacity: 0,
              y: 15,
              duration: 0.35,
              ease: 'power2.in',
            },
            0
          );
        }
      });
    };

    const handlePopState = () => {
      if (isReversing) return;
      handleReverse();
    };

    window.addEventListener('start-reverse-hero-morph', handleReverse);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('start-reverse-hero-morph', handleReverse);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [caseStudy.slug, router]);

  return (
    <div className="relative w-full">
      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-4">
        {/* Left Column Container */}
        <div ref={leftContentRef} className="lg:col-span-5 flex flex-col justify-between h-full space-y-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3.5 py-1 text-[10px] font-bold tracking-widest text-[#2bf066] border border-[#2bf066]/20 rounded-full uppercase bg-[#2bf066]/5">
                R&D Case Study
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <span className="text-zinc-400 text-xs font-mono">Confidential System Specs</span>
            </div>

            <div className="flex flex-col gap-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.8rem] font-normal tracking-tight leading-[1.02] text-[#e3f4e5]">
                {caseStudy.title}
              </h1>
              <p className="text-xl text-[#2bf066] font-medium leading-tight">
                {caseStudy.subtitle}
              </p>
            </div>

            {/* General Description */}
            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed">
              This case study documents the research methodologies, systems architecture planning, database schema blueprints, and visual layout prototypes developed by the Labtobit R&D team to engineer this high-performance platform.
            </p>

            {/* Launch CTA */}
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const target = document.getElementById("research-docs-section");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-all cursor-pointer shadow-xl group"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#0b100d] group-hover:scale-125 transition-transform" />
                <span>EXPLORE STUDY</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Target Media Box */}
        <div className="lg:col-span-7 w-full">
          <div 
            ref={mediaBoxRef}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl group"
          >
            <img 
              src={caseStudy.heroImage} 
              alt={caseStudy.title}
              className={`w-full h-full object-cover ${
                isMorphing ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* Overlay Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-4 text-xs font-medium text-white/80 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span>R&D Blueprint</span>
              <span>•</span>
              <span>{caseStudy.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render rest of details page children */}
      {children}

      {/* Shared Element Full-Screen Morph Overlay */}
      {isMorphing && (
        <div
          ref={overlayRef}
          className="fixed inset-0 overflow-hidden bg-zinc-950 pointer-events-none shadow-2xl z-[9999]"
        >
          <img
            src={caseStudy.heroImage}
            alt={caseStudy.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export const CaseStudyHeroMorph = (props: CaseStudyHeroMorphProps) => {
  return (
    <Suspense fallback={null}>
      <CaseStudyHeroMorphContent {...props} />
    </Suspense>
  );
};
