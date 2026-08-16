'use client';

import React, { useRef, useState, useEffect, useLayoutEffect, Suspense } from 'react';

import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { useSearchParams, useRouter } from 'next/navigation';
import { Project } from '@/data/projects';
import { SitePreviewModal } from './SitePreviewModal';

interface ProjectHeroMorphProps {
  project: Project;
  children: React.ReactNode;
}

const ProjectHeroMorphContent = ({ project, children }: ProjectHeroMorphProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromGrid = searchParams.get('fromGrid') === 'true';
  const fromNext = searchParams.get('fromNext') === 'true';
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const leftContentRef = useRef<HTMLDivElement>(null);
  const mediaBoxRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isMorphing, setIsMorphing] = useState(fromGrid);

  useLayoutEffect(() => {
    if (!fromNext) return;

    // Entrance wipe animation from next project
    let overlay = document.getElementById('next-project-transition-overlay');
    let leftHalf = document.getElementById('transition-left-half');
    let rightHalf = document.getElementById('transition-right-half');

    if (!overlay || !leftHalf || !rightHalf) {
      overlay = document.createElement('div');
      overlay.id = 'next-project-transition-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = '#0b100d';
      overlay.style.zIndex = '10000';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '1';

      const logoContainer = document.createElement('div');
      logoContainer.style.position = 'relative';
      logoContainer.style.width = '300px';
      logoContainer.style.height = '300px';

      leftHalf = document.createElement('div');
      leftHalf.id = 'transition-left-half';
      leftHalf.style.position = 'absolute';
      leftHalf.style.inset = '0';

      const img1 = document.createElement('img');
      img1.src = '/logo/L.svg';
      img1.style.width = '100%';
      img1.style.height = '100%';
      img1.style.objectFit = 'contain';
      img1.style.filter = 'invert(1)';
      leftHalf.appendChild(img1);

      rightHalf = document.createElement('div');
      rightHalf.id = 'transition-right-half';
      rightHalf.style.position = 'absolute';
      rightHalf.style.inset = '0';

      const img2 = document.createElement('img');
      img2.src = '/logo/B.svg';
      img2.style.width = '100%';
      img2.style.height = '100%';
      img2.style.objectFit = 'contain';
      img2.style.filter = 'invert(1)';
      rightHalf.appendChild(img2);

      logoContainer.appendChild(leftHalf);
      logoContainer.appendChild(rightHalf);
      overlay.appendChild(logoContainer);
      document.body.appendChild(overlay);
    }

    // Ensure we start at the top of the new page
    window.scrollTo(0, 0);

    // Animate splitting apart horizontally
    gsap.to(leftHalf, {
      x: '-100vw',
      y: 0,
      duration: 1,
      ease: 'power3.inOut',
      delay: 0.05,
    });

    gsap.to(rightHalf, {
      x: '100vw',
      y: 0,
      duration: 1,
      ease: 'power3.inOut',
      delay: 0.05,
    });

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        if (overlay && document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        router.replace(`/projects/${project.slug}`, { scroll: false });
      }
    });
  }, [fromNext, project.slug, router]);

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
          router.replace(`/projects/${project.slug}`, { scroll: false });
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
  }, [fromGrid, project.slug, router]);


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
            router.replace(`/?backFromProject=${project.slug}`);
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
  }, [project.slug, router]);


  return (
    <div className="relative w-full">
      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-4">
        {/* Left Column Container */}
        <div ref={leftContentRef} className="lg:col-span-5 flex flex-col justify-between h-full space-y-10">
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-normal tracking-tight leading-[1.02] text-[#e3f4e5]">
              {project.title}
            </h1>

            <div className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed space-y-4">
              <p>
                <span className="font-semibold text-[#2bf066]">{project.client}</span> approached us to create a digital companion experience. Designed to extend the project beyond standard boundaries, the experience gives visitors an interactive way to engage with the work while making it accessible to global audiences.
              </p>
              <p>
                {project.description}
              </p>
            </div>

            {/* Dual Column: SERVICES & LINKS */}
            <div className="grid grid-cols-2 gap-8 pt-4">
              {/* SERVICES Column */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
                  SERVICES
                </h4>
                <ul className="flex flex-col gap-1.5 text-sm text-slate-200 font-normal">
                  {project.deliverables ? (
                    project.deliverables.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                  ) : (
                    <>
                      <li>Web Design</li>
                      <li>Web Development</li>
                      <li>3D Design</li>
                      <li>WebGL</li>
                      <li>Animation</li>
                    </>
                  )}
                </ul>
              </div>

              {/* LINKS Column */}
              {/* <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
                  LINKS
                </h4>
                <ul className="flex flex-col gap-1.5 text-sm text-slate-200 font-normal">
                  <li>
                    <a 
                      href="#" 
                      className="hover:text-[#2bf066] transition-colors underline decoration-slate-600 underline-offset-4"
                    >
                      {project.client.toLowerCase().replace(/[^a-z0-9]/g, '')}
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>

          {/* Launch Project CTA Button */}
          {project.liveLink && (
            <div className="pt-4">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-all cursor-pointer shadow-xl group"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#0b100d] group-hover:scale-125 transition-transform" />
                <span>LAUNCH PROJECT</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Target Media Box */}
        <div className="lg:col-span-7 w-full">
          <div
            ref={mediaBoxRef}
            className="w-full aspect-16/10 sm:aspect-video lg:aspect-4/3 rounded-4xl overflow-hidden bg-[#111814] border border-white/10 relative shadow-2xl group"
          >
            <img
              src={project.heroImage}
              alt={project.title}
              className={`w-full h-full object-cover ${isMorphing ? 'opacity-0' : 'opacity-100'
                }`}
            />

            {/* Overlay Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-4 text-xs font-medium text-white/80 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span>Overview</span>
              <span>•</span>
              <span>{project.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render rest of details page children (Challenge, Solution, Gallery, Footer) */}
      {children}

      {/* Shared Element Full-Screen Morph Overlay (Rendered directly on Frame 0) */}
      {isMorphing && (
        <div
          ref={overlayRef}
          className="fixed inset-0 overflow-hidden bg-gray-900 pointer-events-none shadow-2xl z-9999"
        >
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {/* Site Preview Modal */}
      {project.liveLink && (
        <SitePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          initialSlug={project.slug}
        />
      )}
    </div>
  );
};

export const ProjectHeroMorph = (props: ProjectHeroMorphProps) => {
  return (
    <Suspense fallback={null}>
      <ProjectHeroMorphContent {...props} />
    </Suspense>
  );
};

