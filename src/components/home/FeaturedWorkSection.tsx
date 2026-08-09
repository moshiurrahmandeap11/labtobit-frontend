'use client';

import React, { useRef, useState, useEffect, useLayoutEffect, Suspense } from 'react';

import gsap from 'gsap';
import { useRouter, useSearchParams } from 'next/navigation';
import { projects, Project } from '@/data/projects';
import { RevealText } from '@/components/shared/RevealText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

interface ActiveCardData {
  project: Project;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const ProjectCard = ({ 
  project, 
  onCardClick,
  isAnyExpanding,
  setCardRef,
}: { 
  project: Project; 
  onCardClick: (project: Project, containerEl: HTMLDivElement) => void;
  isAnyExpanding: boolean;
  setCardRef: (slug: string, el: HTMLDivElement | null) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    // Prefetch project details route for instant transition upon animation completion
    router.prefetch(`/projects/${project.slug}`);

    // Set transform origin to the middle (belly) of each individual card box
    gsap.set(containerRef.current, { transformOrigin: "center center", force3D: true });

    let clampRot = gsap.utils.clamp(-25, 25); // Max bend angle

    // Smooth quickTo animation for rotationX
    const rotateXTo = gsap.quickTo(containerRef.current, "rotationX", {
      duration: 0.6,
      ease: "power2.out"
    });

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        let vel = self.getVelocity();
        // Every box bends across its own center when scrolling
        let targetRot = clampRot(vel / 50);
        rotateXTo(targetRot);
      }
    });

    return () => {
      st.kill();
    };
  }, [project.slug, router]);

  const handleMouseEnter = () => {
    if (isAnyExpanding) return;
    gsap.to(arrowRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(titleRef.current, {
      x: 48,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (isAnyExpanding) return;
    gsap.to(arrowRef.current, {
      x: -20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    gsap.to(titleRef.current, {
      x: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAnyExpanding || !containerRef.current) return;
    onCardClick(project, containerRef.current);
  };

  return (
    <a 
      href={`/projects/${project.slug}`} 
      onClick={handleClick} 
      className="block w-full text-left focus:outline-none cursor-pointer"
    >
      <div 
        className="flex flex-col group cursor-pointer w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Container */}
        <div 
          ref={(el) => {
            containerRef.current = el;
            setCardRef(project.slug, el);
          }}
          className="w-full aspect-[4/3] sm:aspect-[16/11] rounded-[2rem] overflow-hidden mb-6 relative bg-gray-200 shadow-sm"
        >
          <img 
            src={project.heroImage} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        {/* Project Info */}
        <div className="flex flex-col gap-3 px-2">
          <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-600 uppercase">
            {project.tags.join(' • ')}
          </p>
          <div className="flex items-center relative overflow-visible">
            <span 
              ref={arrowRef} 
              className="absolute left-0 opacity-0 -translate-x-5 text-3xl sm:text-4xl md:text-5xl font-light text-[#0A0D14]"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              →
            </span>
            <h3 
              ref={titleRef}
              className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0A0D14]"
            >
              {project.title}
            </h3>
          </div>
        </div>
      </div>
    </a>
  );
};

const FeaturedWorkContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const backFrom = searchParams.get('backFrom');

  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const [activeCard, setActiveCard] = useState<ActiveCardData | null>(null);
  const sectionContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isExpanding, setIsExpanding] = useState(false);

  const setCardRef = (slug: string, el: HTMLDivElement | null) => {
    cardRefs.current[slug] = el;
  };

  // Reset expansion state lock on mount
  useEffect(() => {
    setIsExpanding(false);
  }, []);

  // GSAP ScrollTrigger Scrub Animation for SVG Curved Ribbon & Badge
  useEffect(() => {
    const path = pathRef.current;
    const section = sectionRef.current;
    if (!path || !section) return;

    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 30%",
          scrub: 1.4,
        },
      });

      // 1. Draw SVG curved ribbon path from left to right
      tl.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        duration: 1,
      });

      // 2. Animate floating pill badge along the crest of the curve
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.8, y: 15 },
          { opacity: 1, scale: 1, y: 0, ease: "power2.out", duration: 0.4 },
          0.25
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);



  // Reverse Collapse Animation when returning from /projects/[slug] via ?backFrom=...
  useLayoutEffect(() => {
    if (!backFrom) {
      setIsExpanding(false);
      return;
    }

    const targetProject = projects.find((p) => p.slug === backFrom);
    if (!targetProject) return;

    // 1. Immediately set active card on Frame 0 so full-screen overlay renders with ZERO delay/blinking
    setActiveCard({
      project: targetProject,
      rect: {
        top: 0,
        left: 0,
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080,
      },
    });

    // 2. Next animation frame: align scroll & collapse overlay down to the grid card slot
    requestAnimationFrame(() => {
      // Force ScrollTrigger to refresh so all pinned section spacers are accurately calculated
      ScrollTrigger.refresh();

      const cardEl = cardRefs.current[backFrom];
      if (!cardEl) return;

      // Calculate absolute document Y coordinate of cardEl
      const cardRectInitial = cardEl.getBoundingClientRect();
      const targetY = window.scrollY + cardRectInitial.top - (window.innerHeight - cardRectInitial.height) / 2;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' });

      // Measure exact viewport rect after scroll position is aligned
      const rect = cardEl.getBoundingClientRect();

      // Hide original grid card during reverse collapse animation
      gsap.set(cardEl, { opacity: 0 });

      // Initial section content scale and opacity
      if (sectionContentRef.current) {
        gsap.set(sectionContentRef.current, { opacity: 0, scale: 0.98 });
      }

      if (!overlayRef.current) return;

      // Ensure overlay starts at 100vw x 100vh full screen
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
          router.replace('/', { scroll: false });
        },
      });

      // 1. Fade & scale in background grid content
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

      // 2. Collapse full-screen overlay back into the target card grid slot
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
    });
  }, [backFrom, router]);



  const handleCardClick = (project: Project, containerEl: HTMLDivElement) => {

    if (isExpanding) return;
    setIsExpanding(true);

    const rect = containerEl.getBoundingClientRect();
    setActiveCard({
      project,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    });

    // Fade out original container to avoid ghosting behind fixed overlay
    gsap.set(containerEl, { opacity: 0 });

    // Fade and scale background content slightly
    if (sectionContentRef.current) {
      gsap.to(sectionContentRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    // Trigger overlay full-screen expansion animation on next frame
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
          router.push(`/projects/${project.slug}?fromGrid=true`);
        },
      });


      // 1. Expand thumbnail to 100vw x 100vh
      tl.to(overlayRef.current, {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        duration: 0.7,
        ease: 'power3.inOut',
      });

      // 2. Smooth flash/fade overlay right as expansion reaches 100% full screen
      if (flashRef.current) {
        tl.to(
          flashRef.current,
          {
            opacity: 1,
            duration: 0.25,
            ease: 'power2.inOut',
          },
          '-=0.2'
        );
      }
    });
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative z-10 w-full bg-[#f4f4f6] text-[#0A0D14] flex flex-col justify-center items-center py-24 px-6 sm:px-12 md:px-16 overflow-hidden"
    >
      {/* Background Animated Curved SVG Ribbon & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg 
          className="w-full h-full min-h-[2800px]" 
          viewBox="0 0 1000 2800" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#2D5BFF" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
          </defs>

          {/* Single Continuous 1-Line Expanding SVG Ribbon Path */}
          <path
            ref={pathRef}
            d="M -20 20 C 120 180 180 320 80 480 C -20 640 80 820 480 840 C 880 860 1020 620 980 420 C 940 220 720 300 480 480 C 240 660 80 920 60 1180 C 40 1440 120 1680 480 1690 C 840 1700 1020 1480 980 1750 C 940 1980 180 1880 180 2080 C 160 2280 800 2220 660 2480 C 580 2640 780 2740 1020 2810"
            stroke="url(#ribbonGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            className="opacity-90"
          />
        </svg>

        {/* Floating Pill Badge: SEE ALL PROJECTS */}
        <div 
          ref={badgeRef}
          className="absolute top-[4%] left-[46%] -translate-x-1/2 -translate-y-1/2 z-10 px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 font-bold text-xs tracking-wider uppercase shadow-xl border border-slate-200/80 flex items-center gap-2.5 hover:scale-105 transition-all pointer-events-auto cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
          <span>SEE ALL PROJECTS</span>
        </div>
      </div>




      <div 
        ref={sectionContentRef}
        className="relative z-10 max-w-[1600px] mx-auto w-full flex flex-col justify-start items-start"
      >

        {/* Header Section */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 border-b border-gray-300 pb-16">
          <h2 className="text-[12vw] lg:text-[8vw] leading-[0.9] tracking-tight font-medium text-[#0A0D14] whitespace-nowrap">
            <RevealText>Featured Work</RevealText>
          </h2>
          <div className="text-xs sm:text-sm font-semibold tracking-wide max-w-sm uppercase text-slate-700 lg:pb-4 leading-relaxed">
            <RevealText>
              A SELECTION OF IMMERSIVE DIGITAL EXPERIENCES CREATED FOR AMBITIOUS BRANDS AND FORWARD THINKING TEAMS.
            </RevealText>
          </div>
        </div>

        {/* Projects Grid */}
        <div 
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20"
          style={{ perspective: "2000px" }}
        >
          {projects.map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project} 
              onCardClick={handleCardClick}
              isAnyExpanding={isExpanding}
              setCardRef={setCardRef}
            />
          ))}
        </div>

      </div>

      {/* Fixed Full Screen Overlay */}
      {activeCard && (
        <div
          ref={overlayRef}
          className="fixed overflow-hidden bg-gray-200 pointer-events-none shadow-2xl"
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
            src={activeCard.project.heroImage}
            alt={activeCard.project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Camera Shutter / Black Flash Transition Overlay */}
      <div 
        ref={flashRef}
        className="fixed inset-0 bg-[#0a0e0c] pointer-events-none opacity-0 z-[10000]"
      />
    </section>
  );
};

export const FeaturedWorkSection = () => {
  return (
    <Suspense fallback={null}>
      <FeaturedWorkContent />
    </Suspense>
  );
};




