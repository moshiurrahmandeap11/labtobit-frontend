'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RevealText } from '@/components/shared/RevealText';
import Button from '@/components/shared/Button';

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
        <div className="w-[60vw] h-[60vw] max-w-150 max-h-150 bg-blue-600 rounded-full blur-[120px] mix-blend-screen opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-16">
        <h2
          ref={textRef}
          className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-medium uppercase tracking-tight leading-[0.85] cursor-default group"
        >
          <span className="block text-transparent [-webkit-text-stroke:1.5px_#3f3f46] group-hover:[-webkit-text-stroke:1.5px_#2563eb] transition-all duration-700">
            <RevealText>Got a vision?</RevealText>
          </span>
          <span className="block text-white mt-2">
            <RevealText>Let&apos;s build it.</RevealText>
          </span>
        </h2>

        {/* Action Button */}
        <Button
          href="mailto:hello@labtobit.com"
          variant="outline"
          animatedHover
          className="px-8 py-4"
        >
          LET&apos;S TALK
        </Button>
      </div>
    </section>
  );
};
