'use client';

import React, { useRef, useState, useEffect, useLayoutEffect, Suspense } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/data/products';

interface ProductHeroMorphProps {
  product: Product;
  children: React.ReactNode;
}

const ProductHeroMorphContent = ({ product, children }: ProductHeroMorphProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromGrid = searchParams.get('fromGrid') === 'true';

  const leftContentRef = useRef<HTMLDivElement>(null);
  const mediaBoxRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isMorphing, setIsMorphing] = useState(fromGrid);

  useLayoutEffect(() => {
    if (!fromGrid || !mediaBoxRef.current) return;

    // Instantly reset scroll position to top 0 on Frame 0 before measuring viewport rect
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).lenis?.scrollTo(0, { immediate: true });
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
          router.replace(`/products/${product.slug}`, { scroll: false });
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
  }, [fromGrid, product.slug, router]);

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

      // Force synchronous React state flush so overlayRef renders immediately
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
            router.replace(`/?backFromProduct=${product.slug}`);
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
  }, [product.slug, router]);

  return (
    <div className="relative w-full">
      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-4">
        {/* Left Column Container */}
        <div ref={leftContentRef} className="lg:col-span-5 flex flex-col justify-between h-full space-y-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3.5 py-1 text-[10px] font-bold tracking-widest text-[#2bf066] border border-[#2bf066]/20 rounded-full uppercase bg-[#2bf066]/5">
                Active Staging
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <span className="text-zinc-400 text-xs font-mono">v0.1.0 Preact Engine</span>
            </div>

            <div className="flex flex-col gap-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-normal tracking-tight leading-[1.02] text-[#e3f4e5]">
                {product.title}
              </h1>
              <p className="text-xl text-[#2bf066] font-medium leading-tight">
                {product.tagline}
              </p>
            </div>

            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed">
              {product.whatItIs}
            </p>

            {/* Integration Stack Badges */}
            <div className="flex flex-col gap-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
                Engine Stack
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {product.technicalStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={product.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-all cursor-pointer shadow-xl group"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#0b100d] group-hover:scale-125 transition-transform" />
                <span>LAUNCH LIVE APP</span>
              </a>
              <button
                onClick={() => {
                  const target = document.getElementById("installation-box");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
              >
                GET WIDGET CODE
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Target Media Box */}
        <div className="lg:col-span-7 w-full">
          <div
            ref={mediaBoxRef}
            className="relative w-full aspect-16/10 sm:aspect-video lg:aspect-4/3 rounded-4xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl group"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className={`w-full h-full object-cover ${
                isMorphing ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 flex items-center gap-3 text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#2bf066] animate-pulse" />
              <span>Real-time SaaS UI</span>
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
          className="fixed inset-0 overflow-hidden bg-zinc-950 pointer-events-none shadow-2xl z-9999"
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export const ProductHeroMorph = (props: ProductHeroMorphProps) => {
  return (
    <Suspense fallback={null}>
      <ProductHeroMorphContent {...props} />
    </Suspense>
  );
};
