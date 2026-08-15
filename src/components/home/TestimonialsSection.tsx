'use client';

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { RevealText } from '@/components/shared/RevealText';
import { MobileTestimonialsSlider } from './MobileTestimonialsSlider';

const testimonials = [
  // Tier 1 (Upper Row)
  {
    id: 1,
    quote: "Stunning experience, completely transformed our brand.",
    author: "Sarah Jenkins",
    role: "CEO, InnovateTech",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    positionClass: "lg:-translate-y-4 lg:translate-x-2",
  },
  {
    id: 2,
    quote: "Seamless performance that doubled our conversion rate.",
    author: "Marcus Chen",
    role: "Marketing Director, StudioX",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    positionClass: "lg:translate-y-6 lg:-translate-x-4",
  },
  {
    id: 3,
    quote: "Crafted a true, high-impact partner brand experience.",
    author: "Elena Rodriguez",
    role: "Founder, Aura Lifestyle",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    positionClass: "lg:-translate-y-2 lg:translate-x-4",
  },
  {
    id: 4,
    quote: "Exceptional creativity and bulletproof execution.",
    author: "David Kim",
    role: "CTO, Nexus Labs",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    positionClass: "lg:translate-y-8 lg:-translate-x-2",
  },
  // Tier 2 (Lower Row)
  {
    id: 5,
    quote: "A game-changer UI for our web application.",
    author: "Sophia Patel",
    role: "Head of Product, Flow AI",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    positionClass: "lg:translate-y-12 lg:-translate-x-6",
  },
  {
    id: 6,
    quote: "Top tier engineering & flawless communication.",
    author: "James Wilson",
    role: "Founder, Apex Ventures",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    positionClass: "lg:-translate-y-6 lg:translate-x-4",
  },
  {
    id: 7,
    quote: "Elevated our product to a whole new level.",
    author: "Olivia Taylor",
    role: "VP Design, Echo Creative",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    positionClass: "lg:translate-y-16 lg:translate-x-2",
  },
  {
    id: 8,
    quote: "Consistently delivered far beyond our expectations.",
    author: "Liam O'Connor",
    role: "Director, Pulse Media",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    positionClass: "lg:translate-y-4 lg:-translate-x-4",
  },
  {
    id: 9,
    quote: "Rapid delivery paired with innovative design thinking.",
    author: "Amara Vance",
    role: "Co-Founder, Synthetix",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    positionClass: "lg:-translate-y-8 lg:translate-x-6",
  },
];

interface PathData {
  id: number;
  d: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  positionClass: string;
}

export const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootNodeRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [paths, setPaths] = useState<PathData[]>([]);
  const [activeHoverId, setActiveHoverId] = useState<number | null>(null);
  const [autoHighlightId, setAutoHighlightId] = useState<number | null>(1);
  const [isUserHovering, setIsUserHovering] = useState<boolean>(false);
  const [cardPos, setCardPos] = useState<{ x: number; y: number } | null>(null);

  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const activeId = activeHoverId !== null ? activeHoverId : autoHighlightId;
  const activeTestimonial = testimonials.find(t => t.id === activeId) || testimonials[0];
  const activeIndex = testimonials.findIndex(t => t.id === activeId);

  // Auto-rotate testimonials every 3.5 seconds when user isn't hovering
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

  const handleNodeMouseEnter = (id: number) => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsUserHovering(true);
    setActiveHoverId(id);
  };

  const handleNodeMouseLeave = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    // Wait 5 seconds after user moves out before resuming autoplay
    pauseTimerRef.current = setTimeout(() => {
      setActiveHoverId(null);
      setIsUserHovering(false);
    }, 5000);
  };

  const updateConnections = () => {
    if (!containerRef.current || !rootNodeRef.current) return;

    // Skip recalculating SVG paths and card positions on mobile (hidden elements)
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

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

    // Update active gliding card position
    if (activeIndex !== -1 && nodeRefs.current[activeIndex]) {
      const activeNodeRect = nodeRefs.current[activeIndex]!.getBoundingClientRect();
      const x = activeNodeRect.left + activeNodeRect.width / 2 - containerRect.left;
      const y = activeNodeRect.top - containerRect.top + activeNodeRect.height + 24;
      setCardPos({ x, y });
    }
  };

  useLayoutEffect(() => {
    updateConnections();
  }, [activeId]);

  useEffect(() => {
    updateConnections();

    let rafId: number | null = null;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateConnections);
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(updateConnections, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="clientnetwork"
      ref={containerRef}
      className="relative w-full bg-white text-[#0A0D14] pt-32 sm:pt-40 pb-56 sm:pb-72 md:pb-80 px-4 sm:px-12 md:px-16 overflow-hidden"
    >
      {/* SVG Overlay for Dynamic Line Connections - Desktop Only */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block">
        {paths.map((path) => {
          const isActive = activeId === path.id;
          return (
            <g key={path.id}>
              {/* Base Inactive Wire */}
              <path
                d={path.d}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={2}
              />
              {/* Active Fill Line Animation */}
              {isActive && (
                <motion.path
                  key={`active-wire-${path.id}`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  d={path.d}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* --- SINGLE FLOATING GLIDING REVIEW CARD --- */}
      {cardPos && (
        <motion.div
          initial={false}
          animate={{
            x: cardPos.x,
            y: cardPos.y,
          }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 24,
            mass: 0.8,
          }}
          className="hidden md:flex absolute top-0 left-0 -translate-x-1/2 w-70 sm:w-85 bg-[#0A0D14]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-7 flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.35)] z-100 pointer-events-auto cursor-default"
        >
          {/* Top Blue Indicator Dot */}
          <div className="w-2 h-2 rounded-full bg-blue-500 mb-3 shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>

          {/* Quote Content Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >
              <p className="text-base sm:text-lg text-white font-medium leading-snug tracking-tight">
                &ldquo;{activeTestimonial.quote}&rdquo;
              </p>

              <div className="w-full border-t border-white/10 mt-4 pt-4 flex flex-col items-center">
                <h4 className="text-zinc-300 font-semibold text-xs sm:text-sm">{activeTestimonial.author}</h4>
                <p className="text-[10px] text-blue-400 mt-1 uppercase tracking-widest font-medium">{activeTestimonial.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

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
            <span className="text-slate-500 font-medium text-sm sm:text-base max-w-35 leading-tight">
              Satisfaction Guaranteed
            </span>
          </div>

          <div className="lg:w-2/3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-[#0A0D14]">
            <RevealText>
              A growing network of businesses who trust us to build their websites, SaaS platforms, and digital products with modern technology.
            </RevealText>
          </div>
        </div>

        {/* --- MOBILE SLIDER CONTAINER --- */}
        <div className="w-full block md:hidden mt-8">
          <MobileTestimonialsSlider testimonials={testimonials} />
        </div>

        {/* --- DESKTOP TREE DIAGRAM CONTAINER --- */}
        <div className="w-full hidden md:flex flex-col items-center relative gap-24 sm:gap-32">

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

          {/* Geometrically Calculated Radial Arc Network */}
          <div className="w-full flex flex-wrap lg:flex-nowrap justify-between items-start max-w-6xl mx-auto pt-4 gap-y-12 sm:gap-y-16">
            {testimonials.map((test, index) => {
              const isActive = activeId === test.id;

              // Parabolic arch math + randomized vertical up/down offsets
              const randomYOffsets = [-28, 32, -18, 40, -22, 30, -35, 20, -25];
              const t = (index - 4) / 4;
              const baseArcY = (1 - Math.pow(t, 2)) * 90;
              const arcYOffset = baseArcY + randomYOffsets[index % randomYOffsets.length];

              return (
                <div
                  key={test.id}
                  style={{ transform: `translateY(${arcYOffset}px)` }}
                  className={`flex flex-col items-center group relative transition-all duration-300 ${isActive ? 'z-40' : 'z-10'}`}
                  onMouseEnter={() => handleNodeMouseEnter(test.id)}
                  onMouseLeave={handleNodeMouseLeave}
                >
                  {/* Avatar Node */}
                  <motion.div
                    ref={(el) => { nodeRefs.current[index] = el; }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: 0.8 + index * 0.1 }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] overflow-hidden flex items-center justify-center relative z-20 transition-all duration-300 cursor-pointer select-none ${isActive
                      ? 'scale-110 border-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.6)]'
                      : 'border-slate-200 hover:scale-110 hover:border-slate-400'
                      }`}
                  >
                    <img
                      src={test.avatar}
                      alt={test.author}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </motion.div>

                  {/* Author Name Tag */}
                  <span className={`mt-3 text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-[#0A0D14] font-bold' : 'text-slate-500 group-hover:text-slate-900'
                    }`}>
                    {test.author.split(' ')[0]}
                  </span>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
