'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RevealText } from '@/components/shared/RevealText';

gsap.registerPlugin(ScrollTrigger);

export const CtaSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll Reveal is handled by RevealText
  }, []);

  return (
    <section
      id="cta"
      ref={containerRef}
      className="relative w-full bg-[#0b100d] text-white py-40 px-6 sm:px-12 md:px-16 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background abstract glow */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-40">
        <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-blue-600 rounded-full blur-[120px] mix-blend-screen opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-16">
        <h2
          ref={textRef}
          className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-black uppercase tracking-tighter leading-[0.85] cursor-default group"
        >
          <span className="block text-transparent [-webkit-text-stroke:2px_#3f3f46] group-hover:[-webkit-text-stroke:2px_#2563eb] transition-all duration-700">
            <RevealText>Got a vision?</RevealText>
          </span>
          <span className="block text-white mt-2">
            <RevealText>Let&apos;s build it.</RevealText>
          </span>
        </h2>

        {/* Action Button */}
        <button
          className="relative flex items-center justify-center w-[220px] h-16 rounded-[2rem] bg-[#1a1b1f] text-white font-bold text-sm sm:text-base uppercase tracking-widest group/btn hover:bg-[#1a44ff] transition-colors duration-300 cursor-pointer overflow-hidden border border-transparent hover:border-[#1a44ff]"
        >
          {/* Arrow (left side, slides in on hover) */}
          <div className="absolute left-8 flex items-center justify-center w-5 h-5 opacity-0 -translate-x-6 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/btn:opacity-100 group-hover/btn:translate-x-0">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          {/* Text */}
          <span className="transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/btn:translate-x-4">
            LET&apos;S TALK
          </span>

          {/* Dot (right side, disappears on hover) */}
          <div className="absolute right-8 flex items-center justify-center w-1.5 h-1.5 rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/btn:opacity-0 group-hover/btn:translate-x-4 group-hover/btn:scale-0">
          </div>
        </button>
      </div>
    </section>
  );
};
