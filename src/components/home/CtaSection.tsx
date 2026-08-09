'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RevealText } from '@/components/shared/RevealText';

gsap.registerPlugin(ScrollTrigger);

export const CtaSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll Reveal is handled by RevealText
    
    // Magnetic Button Logic
    const button = buttonRef.current;
    if (!button) return;

    const xTo = gsap.quickTo(button, "x", {duration: 0.8, ease: "elastic.out(1, 0.3)"});
    const yTo = gsap.quickTo(button, "y", {duration: 0.8, ease: "elastic.out(1, 0.3)"});

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      // Magnetic pull radius
      const distance = Math.sqrt(x*x + y*y);
      if (distance < 200) {
        xTo(x * 0.4);
        yTo(y * 0.4);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section 
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
            <RevealText>Let's build it.</RevealText>
          </span>
        </h2>

        {/* Magnetic Wrapper */}
        <div className="p-10 cursor-pointer">
          <button 
            ref={buttonRef}
            className="relative px-12 py-6 rounded-full bg-blue-600 text-white font-bold text-lg sm:text-xl uppercase tracking-widest overflow-hidden group/btn shadow-[0_0_40px_rgba(37,99,235,0.3)]"
          >
            <span className="relative z-10 transition-colors duration-300">Start a Project</span>
            <div className="absolute inset-0 bg-[#0A0D14] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </button>
        </div>
      </div>
    </section>
  );
};
