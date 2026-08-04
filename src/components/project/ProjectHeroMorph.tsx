'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import gsap from 'gsap';
import { useSearchParams, useRouter } from 'next/navigation';
import { Project } from '@/data/projects';

interface ProjectHeroMorphProps {
  project: Project;
  children: React.ReactNode;
}

const ProjectHeroMorphContent = ({ project, children }: ProjectHeroMorphProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromGrid = searchParams.get('fromGrid') === 'true';

  const leftContentRef = useRef<HTMLDivElement>(null);
  const mediaBoxRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isMorphing, setIsMorphing] = useState(fromGrid);
  const [overlayRect, setOverlayRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!fromGrid || !mediaBoxRef.current) return;

    // Lock body background color to dark theme #0b100d
    document.body.style.backgroundColor = '#0b100d';

    const timer = setTimeout(() => {
      if (!mediaBoxRef.current) return;

      const targetRect = mediaBoxRef.current.getBoundingClientRect();
      setOverlayRect({
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      });

      // Initially hide text content to animate in smoothly during morph
      if (leftContentRef.current) {
        gsap.set(leftContentRef.current, { opacity: 0, y: 25 });
      }

      requestAnimationFrame(() => {
        if (!overlayRef.current) return;

        // Set initial full-screen overlay state
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
            duration: 0.75,
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
              duration: 0.5,
              ease: 'power2.out',
            },
            0.2
          );
        }
      });
    }, 40);

    return () => clearTimeout(timer);
  }, [fromGrid, project.slug, router]);

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
              <div className="flex flex-col gap-3">
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
              </div>
            </div>
          </div>

          {/* Launch Project CTA Button */}
          <div className="pt-4">
            <a 
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-all cursor-pointer shadow-xl group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#0b100d] group-hover:scale-125 transition-transform" />
              <span>LAUNCH PROJECT</span>
            </a>
          </div>
        </div>

        {/* Right Column: Target Media Box */}
        <div className="lg:col-span-7 w-full">
          <div 
            ref={mediaBoxRef}
            className="w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#111814] border border-white/10 relative shadow-2xl group"
          >
            <img 
              src={project.heroImage} 
              alt={project.title}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                isMorphing ? 'opacity-0' : 'opacity-100'
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

      {/* Shared Element Full-Screen Morph Overlay */}
      {isMorphing && overlayRect && (
        <div
          ref={overlayRef}
          className="fixed overflow-hidden bg-gray-900 pointer-events-none shadow-2xl"
          style={{
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            borderRadius: '0px',
            zIndex: 9999,
          }}
        >
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
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
