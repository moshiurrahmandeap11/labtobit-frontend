'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const RevealText = ({ children, className }: { children: string, className?: string }) => {
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
