'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

const RevealText = ({ children, className }: { children: string, className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const words = containerRef.current.querySelectorAll('.word-inner');
    
    gsap.fromTo(words, 
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.015,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        }
      }
    );
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-wrap gap-x-[0.25em] gap-y-1 ${className || ''}`}>
      {children.split(' ').map((word, i) => (
        <span key={i} className="overflow-hidden inline-flex">
          <span className="word-inner inline-block">{word}</span>
        </span>
      ))}
    </div>
  );
};

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
    <section ref={sectionRef} className="relative w-full bg-white text-[#0A0D14] py-24 px-6 sm:px-12 md:px-16 flex justify-center z-10 overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem]">
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
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-12 md:mb-16 fade-up-element">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full border transition-all duration-300 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 ${
                activeFilter === filter
                  ? 'bg-[#0A0D14] text-white border-[#0A0D14]'
                  : 'bg-transparent text-[#0A0D14] border-slate-300 hover:border-[#0A0D14]'
              }`}
            >
              {activeFilter === filter && (
                <span className="w-2 h-2 rounded-full bg-[#2bf066]"></span>
              )}
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {projects.slice(0, 2).map((project, idx) => (
            <div key={idx} className="project-card relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden group cursor-pointer bg-gray-200">
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
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
