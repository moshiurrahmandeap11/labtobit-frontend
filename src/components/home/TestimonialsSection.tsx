'use client';

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { RevealText } from '@/components/shared/RevealText';

const testimonials = [
  // Tier 1 (Upper Row)
  {
    id: 1,
    quote: "Labtobit delivered a stunning digital experience that completely transformed our online presence. Their attention to detail is unmatched.",
    author: "Sarah Jenkins",
    role: "CEO, InnovateTech",
    positionClass: "lg:-translate-y-4 lg:translate-x-2",
  },
  {
    id: 2,
    quote: "The team's ability to blend high-end design with seamless performance is incredible. Our conversion rates have doubled since launch.",
    author: "Marcus Chen",
    role: "Marketing Director, StudioX",
    positionClass: "lg:translate-y-6 lg:-translate-x-4",
  },
  {
    id: 3,
    quote: "Working with them felt like a true partnership. They didn't just build a website; they crafted a brand experience that resonates with our audience.",
    author: "Elena Rodriguez",
    role: "Founder, Aura Lifestyle",
    positionClass: "lg:-translate-y-2 lg:translate-x-4",
  },
  {
    id: 4,
    quote: "Exceptional creativity and bulletproof execution. They brought our vision to life faster than we imagined possible.",
    author: "David Kim",
    role: "CTO, Nexus Labs",
    positionClass: "lg:translate-y-8 lg:-translate-x-2",
  },
  // Tier 2 (Lower Row)
  {
    id: 5,
    quote: "A game-changer for our web app. The animations and UI design received overwhelming praise from our users.",
    author: "Sophia Patel",
    role: "Head of Product, Flow AI",
    positionClass: "lg:translate-y-12 lg:-translate-x-6",
  },
  {
    id: 6,
    quote: "Top tier engineering and flawless communication. They handled our complex requirements effortlessly.",
    author: "James Wilson",
    role: "Founder, Apex Ventures",
    positionClass: "lg:-translate-y-6 lg:translate-x-4",
  },
  {
    id: 7,
    quote: "The user engagement metrics speak for themselves. Labtobit elevated our product to a whole new level.",
    author: "Olivia Taylor",
    role: "VP Design, Echo Creative",
    positionClass: "lg:translate-y-16 lg:translate-x-2",
  },
  {
    id: 8,
    quote: "Consistently delivered beyond our expectations. A highly recommended agency for modern digital products.",
    author: "Liam O'Connor",
    role: "Director, Pulse Media",
    positionClass: "lg:translate-y-4 lg:-translate-x-4",
  },
  {
    id: 9,
    quote: "Innovative design thinking paired with rapid delivery. Labtobit is our go-to digital agency partner.",
    author: "Amara Vance",
    role: "Co-Founder, Synthetix",
    positionClass: "lg:-translate-y-8 lg:translate-x-6",
  },
];

interface PathData {
  id: number;
  d: string;
}

export const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootNodeRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [paths, setPaths] = useState<PathData[]>([]);
  const [activeHoverId, setActiveHoverId] = useState<number | null>(null);
  const [autoHighlightId, setAutoHighlightId] = useState<number | null>(1);
  const [isUserHovering, setIsUserHovering] = useState<boolean>(false);

  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Auto rotate random testimonials every 3.5 seconds when not user-hovering
  useEffect(() => {
    if (!isInView || isUserHovering) return;

    const interval = setInterval(() => {
      setAutoHighlightId((prev) => {
        const availableIds = testimonials.map(t => t.id).filter(id => id !== prev);
        const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
        return randomId;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isInView, isUserHovering]);

  const activeId = activeHoverId !== null ? activeHoverId : autoHighlightId;

  const updateConnections = () => {
    if (!containerRef.current || !rootNodeRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const rootRect = rootNodeRef.current.getBoundingClientRect();

    // Start point: bottom-center of the Labtobit logo node
    const startX = rootRect.left + rootRect.width / 2 - containerRect.left;
    const startY = rootRect.bottom - containerRect.top;

    const calculatedPaths: PathData[] = [];

    testimonials.forEach((item, index) => {
      const nodeEl = nodeRefs.current[index];
      if (nodeEl) {
        const nodeRect = nodeEl.getBoundingClientRect();
        // End point: top-center of the avatar circle node
        const endX = nodeRect.left + nodeRect.width / 2 - containerRect.left;
        const endY = nodeRect.top - containerRect.top;

        // Calculate smooth cubic bezier path
        const deltaY = endY - startY;
        const controlY1 = startY + deltaY * 0.5;
        const controlY2 = startY + deltaY * 0.5;

        const pathD = `M ${startX} ${startY} C ${startX} ${controlY1}, ${endX} ${controlY2}, ${endX} ${endY}`;
        calculatedPaths.push({ id: item.id, d: pathD });
      }
    });

    setPaths(calculatedPaths);
  };

  useLayoutEffect(() => {
    updateConnections();
  }, []);

  useEffect(() => {
    updateConnections();

    const handleResize = () => updateConnections();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    // Additional calculation after animations settle
    const timer = setTimeout(updateConnections, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      clearTimeout(timer);
    };
  }, [isInView]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-white text-[#0A0D14] pt-32 sm:pt-40 pb-56 sm:pb-72 md:pb-80 px-4 sm:px-12 md:px-16"
    >
      {/* SVG Overlay for Dynamic Line Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {paths.map((path) => {
          const isActive = activeId === path.id;
          return (
            <motion.path
              key={path.id}
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              d={path.d}
              fill="none"
              stroke={isActive ? "#2563eb" : "#e2e8f0"}
              strokeWidth={isActive ? 3 : 2}
              className="transition-colors duration-500"
            />
          );
        })}
      </svg>

      <div className="max-w-[1600px] mx-auto flex flex-col w-full relative z-20">
        
        {/* Title */}
        <h2 className="text-[14vw] sm:text-[12vw] lg:text-[9vw] font-medium tracking-tight leading-[0.9] text-[#0A0D14] mb-20 md:mb-32 text-left">
          <RevealText>Client Network</RevealText>
        </h2>

        {/* Sub-Header & Description */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-20 md:mb-32 w-full text-left">
          <div className="flex items-center gap-5 lg:w-1/3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-[#0A0D14] text-white flex items-center justify-center font-bold text-xl sm:text-2xl">
              100%
            </div>
            <span className="text-slate-500 font-medium text-sm sm:text-base max-w-[140px] leading-tight">
              Satisfaction Guaranteed
            </span>
          </div>
          
          <div className="lg:w-2/3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-[#0A0D14]">
            <RevealText>
              See how our intelligent solutions connect with partners across the globe to craft high-impact digital experiences and drive growth.
            </RevealText>
          </div>
        </div>

        {/* --- TREE DIAGRAM CONTAINER --- */}
        <div className="w-full flex flex-col items-center relative gap-24 sm:gap-32">
          
          {/* Root Node (Labtobit Logo) */}
          <motion.div 
            ref={rootNodeRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="z-20 bg-slate-50 border border-slate-200 rounded-2xl px-8 py-5 flex items-center justify-center shadow-md cursor-default"
          >
            <Image 
              src="/labtobit-logo.png" 
              alt="Labtobit Logo" 
              width={140} 
              height={45} 
              className="object-contain" 
            />
          </motion.div>

          {/* Scattered Avatar Nodes Network */}
          <div className="w-full flex flex-wrap justify-center gap-x-10 sm:gap-x-16 gap-y-12 sm:gap-y-16 max-w-6xl mx-auto items-start pt-4">
            {testimonials.map((test, index) => {
              const isActive = activeId === test.id;
              return (
                <div 
                  key={test.id} 
                  className={`flex flex-col items-center group relative ${test.positionClass}`}
                  onMouseEnter={() => {
                    setIsUserHovering(true);
                    setActiveHoverId(test.id);
                  }}
                  onMouseLeave={() => {
                    setIsUserHovering(false);
                    setActiveHoverId(null);
                  }}
                >
                  {/* Avatar Node */}
                  <motion.div 
                    ref={(el) => { nodeRefs.current[index] = el; }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: 0.8 + index * 0.15 }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] flex items-center justify-center font-bold text-xl relative z-20 transition-all duration-300 cursor-pointer select-none ${
                      isActive 
                        ? 'scale-110 bg-[#0A0D14] text-white border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                        : 'bg-slate-100 text-slate-800 border-slate-300 hover:scale-110 hover:border-slate-400'
                    }`}
                  >
                    {test.author.charAt(0)}
                  </motion.div>

                  {/* Author Name Tag */}
                  <span className={`mt-3 text-xs font-semibold transition-colors duration-300 ${
                    isActive ? 'text-[#0A0D14] font-bold' : 'text-slate-500 group-hover:text-slate-900'
                  }`}>
                    {test.author.split(' ')[0]}
                  </span>

                  {/* Hover / Auto-Active Quote Card (Tooltip Popover) */}
                  <div 
                    className={`absolute top-20 left-1/2 -translate-x-1/2 w-[260px] sm:w-[300px] bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl transition-all duration-500 z-50 ${
                      isActive 
                        ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                        : 'opacity-0 invisible translate-y-4 pointer-events-none'
                    }`}
                  >
                    {/* Pointer Triangle */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45"></div>
                    
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-1">"{test.quote}"</p>
                    <div className="flex flex-col mt-4">
                      <h4 className="text-[#0A0D14] font-bold text-sm">{test.author}</h4>
                      <p className="text-[10px] text-blue-600 mt-1 uppercase tracking-wider font-semibold">{test.role}</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
