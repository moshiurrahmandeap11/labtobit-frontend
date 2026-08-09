'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

import { RevealText } from '@/components/shared/RevealText';

export const CaseStudiesSection = () => {
  const filters = ["All", "E-Commerce", "Website Design", "Digital Products", "Brand Identities"];
  const [activeFilter, setActiveFilter] = useState("All");
  
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Animate stats and filters
    const elementsToFadeUp = sectionRef.current.querySelectorAll('.fade-up-element');
    
    elementsToFadeUp.forEach((el, index) => {
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
    
    // Animate cards staggering
    const cards = sectionRef.current.querySelectorAll('.project-card');
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
  }, []);

  return (
    <section id="casestudies" ref={sectionRef} className="relative w-full bg-white text-[#0A0D14] py-24 px-6 sm:px-12 md:px-16 flex justify-center z-10 overflow-hidden">
      <div className="w-full max-w-[1600px]">
        
        {/* Title */}
        <h2 className="text-[14vw] sm:text-[12vw] lg:text-[9vw] font-medium tracking-tight leading-[0.9] mb-20 md:mb-32">
          <RevealText>Case Studies</RevealText>
        </h2>

        {/* Stats & Description */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-20 md:mb-32">
          <div className="flex items-center gap-5 lg:w-1/3 fade-up-element">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-[#0A0D14] text-white flex items-center justify-center font-medium text-xl sm:text-2xl">
              300
            </div>
            <span className="text-slate-500 font-medium text-sm sm:text-base max-w-[120px] leading-tight">
              Websites Completed
            </span>
          </div>
          
          <div className="lg:w-2/3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-[#0A0D14]">
            <RevealText>
              Explore a selection of our crafted work combining unique designs and rich technology. We always build from scratch, creating memorable brands, engaging websites and digital products.
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
            {projects.slice(0, 2).map((project, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
                key={`${idx}-${activeFilter}`} 
                className="project-card relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden group cursor-pointer bg-gray-200"
              >
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {idx === 0 && (
                  <div className="absolute top-6 right-6 px-6 py-2 bg-[#5252FF] text-white text-xs font-medium tracking-wide rounded-full">
                    Latest
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
