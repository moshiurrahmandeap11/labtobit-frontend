'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import gsap from 'gsap';
import { useRouter, useSearchParams } from 'next/navigation';
import { projects, Project } from '@/data/projects';
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

  const [activeCard, setActiveCard] = useState<ActiveCardData | null>(null);
  const sectionContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isExpanding, setIsExpanding] = useState(false);

  const setCardRef = (slug: string, el: HTMLDivElement | null) => {
    cardRefs.current[slug] = el;
  };

  // Reverse Collapse Animation when returning from /projects/[slug] via ?backFrom=...
  useEffect(() => {
    if (!backFrom) return;

    const targetProject = projects.find((p) => p.slug === backFrom);
    if (!targetProject) return;

    const timer = setTimeout(() => {
      const cardEl = cardRefs.current[backFrom];
      if (!cardEl) return;

      // Scroll to target project card position
      cardEl.scrollIntoView({ block: 'center', behavior: 'instant' });

      const rect = cardEl.getBoundingClientRect();
      setActiveCard({
        project: targetProject,
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      });

      // Hide original grid card during reverse collapse animation
      gsap.set(cardEl, { opacity: 0 });

      // Initial section content scale and opacity
      if (sectionContentRef.current) {
        gsap.set(sectionContentRef.current, { opacity: 0, scale: 0.98 });
      }

      requestAnimationFrame(() => {
        if (!overlayRef.current) return;

        // Set overlay starting position as full-screen
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
            duration: 0.75,
            ease: 'power3.inOut',
          },
          0
        );
      });
    }, 50);

    return () => clearTimeout(timer);
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
    <section className="relative z-10 w-full bg-[#f4f4f6] text-[#0A0D14] flex flex-col justify-center items-center py-24 px-6 sm:px-12 md:px-16">
      <div 
        ref={sectionContentRef}
        className="relative max-w-[1600px] mx-auto w-full flex flex-col justify-start items-start"
      >
        {/* Header Section */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 border-b border-gray-300 pb-16">
          <h2 className="text-[12vw] lg:text-[8vw] leading-[0.9] tracking-tight font-medium text-[#0A0D14] whitespace-nowrap">
            Featured Work
          </h2>
          <p className="text-xs sm:text-sm font-semibold tracking-wide max-w-sm uppercase text-slate-700 lg:pb-4 leading-relaxed">
            A SELECTION OF IMMERSIVE DIGITAL EXPERIENCES CREATED FOR AMBITIOUS BRANDS AND FORWARD THINKING TEAMS.
          </p>
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




