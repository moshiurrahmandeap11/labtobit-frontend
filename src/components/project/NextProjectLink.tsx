'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export const NextProjectLink = ({ slug, title }: { slug: string, title: string }) => {
  const router = useRouter();

  const handleNextProject = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Create a split wipe overlay for the exit animation
    let overlay = document.getElementById('next-project-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'next-project-transition-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.zIndex = '10000';
      overlay.style.display = 'flex';
      overlay.style.pointerEvents = 'none';

      // Left Half (L)
      const leftHalf = document.createElement('div');
      leftHalf.id = 'transition-left-half';
      leftHalf.style.width = '50vw';
      leftHalf.style.height = '100vh';
      leftHalf.style.backgroundColor = '#111814';
      leftHalf.style.display = 'flex';
      leftHalf.style.justifyContent = 'flex-end';
      leftHalf.style.alignItems = 'center';
      leftHalf.style.overflow = 'hidden';
      
      const textL = document.createElement('span');
      textL.innerText = 'L';
      textL.style.fontSize = '18vw';
      textL.style.fontWeight = '900';
      textL.style.color = '#e3f4e5';
      textL.style.lineHeight = '1';
      textL.style.transform = 'translateX(50%)';
      leftHalf.appendChild(textL);

      // Right Half (B)
      const rightHalf = document.createElement('div');
      rightHalf.id = 'transition-right-half';
      rightHalf.style.width = '50vw';
      rightHalf.style.height = '100vh';
      rightHalf.style.backgroundColor = '#111814';
      rightHalf.style.display = 'flex';
      rightHalf.style.justifyContent = 'flex-start';
      rightHalf.style.alignItems = 'center';
      rightHalf.style.overflow = 'hidden';

      const textB = document.createElement('span');
      textB.innerText = 'B';
      textB.style.fontSize = '18vw';
      textB.style.fontWeight = '900';
      textB.style.color = '#e3f4e5';
      textB.style.lineHeight = '1';
      textB.style.transform = 'translateX(-50%)';
      rightHalf.appendChild(textB);

      overlay.appendChild(leftHalf);
      overlay.appendChild(rightHalf);
      document.body.appendChild(overlay);
    }

    const leftHalf = document.getElementById('transition-left-half');
    const rightHalf = document.getElementById('transition-right-half');

    // Ensure initial state is below the screen and centered horizontally
    gsap.set([leftHalf, rightHalf], { y: '100vh', x: 0 });

    // Slide up to cover the screen
    gsap.to([leftHalf, rightHalf], {
      y: 0,
      duration: 0.75,
      ease: 'power3.inOut',
      onComplete: () => {
        // Navigate to the next project with the transition flag
        router.push(`/projects/${slug}?fromNext=true`);
        
        // Fallback cleanup in case navigation fails or gets stuck
        setTimeout(() => {
          const el = document.getElementById('next-project-transition-overlay');
          if (el && document.body.contains(el) && !window.location.search.includes('fromNext')) {
             document.body.removeChild(el);
          }
        }, 2000);
      }
    });
  };

  return (
    <a 
      href={`/projects/${slug}`} 
      onClick={handleNextProject}
      className="text-3xl sm:text-5xl font-medium tracking-tight hover:text-[#2bf066] text-[#e3f4e5] transition-colors cursor-pointer"
    >
      {title} →
    </a>
  );
};
