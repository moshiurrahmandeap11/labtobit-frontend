'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';

const projects = [
  {
    title: 'Oryza AI',
    tags: 'CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Of The Oak',
    tags: 'WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Lusion Studio',
    tags: 'ART DIRECTION • DESIGN • DEVELOPMENT',
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Echo Platform',
    tags: 'UI/UX • PRODUCT DESIGN • FRONTEND',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
  },
];

import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
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
  }, []);

  const handleMouseEnter = () => {
    // Animate arrow in
    gsap.to(arrowRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Move title slightly to the right to make room for arrow
    gsap.to(titleRef.current, {
      x: 48,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    // Animate arrow out
    gsap.to(arrowRef.current, {
      x: -20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Revert title position
    gsap.to(titleRef.current, {
      x: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  return (
    <div 
      className="flex flex-col group cursor-pointer w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div 
        ref={containerRef}
        className="w-full aspect-[4/3] sm:aspect-[16/11] rounded-[2rem] overflow-hidden mb-6 relative bg-gray-200"
      >
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      {/* Project Info */}
      <div className="flex flex-col gap-3 px-2">
        <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-slate-600 uppercase">
          {project.tags}
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
  );
};

export const FeaturedWorkSection = () => {
  return (
    <section className="relative z-10 w-full bg-[#f4f4f6] text-[#0A0D14] flex flex-col justify-center items-center py-24 px-6 sm:px-12 md:px-16">
      <div className="relative max-w-[1600px] mx-auto w-full flex flex-col justify-start items-start">
        
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
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};
