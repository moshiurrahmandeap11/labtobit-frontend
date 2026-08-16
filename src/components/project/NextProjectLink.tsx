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
      overlay.style.inset = '0';
      overlay.style.backgroundColor = '#0b100d';
      overlay.style.zIndex = '10000';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '0';

      const logoContainer = document.createElement('div');
      logoContainer.style.position = 'relative';
      logoContainer.style.width = '300px';
      logoContainer.style.height = '300px';

      // Left Half (L.svg)
      const leftHalf = document.createElement('div');
      leftHalf.id = 'transition-left-half';
      leftHalf.style.position = 'absolute';
      leftHalf.style.inset = '0';
      
      const img1 = document.createElement('img');
      img1.src = '/logo/L.svg';
      img1.style.width = '100%';
      img1.style.height = '100%';
      img1.style.objectFit = 'contain';
      img1.style.filter = 'invert(1)'; // Make black logo white for dark theme
      leftHalf.appendChild(img1);

      // Right Half (B.svg)
      const rightHalf = document.createElement('div');
      rightHalf.id = 'transition-right-half';
      rightHalf.style.position = 'absolute';
      rightHalf.style.inset = '0';

      const img2 = document.createElement('img');
      img2.src = '/logo/B.svg';
      img2.style.width = '100%';
      img2.style.height = '100%';
      img2.style.objectFit = 'contain';
      img2.style.filter = 'invert(1)'; // Make black logo white for dark theme
      rightHalf.appendChild(img2);

      logoContainer.appendChild(leftHalf);
      logoContainer.appendChild(rightHalf);
      overlay.appendChild(logoContainer);
      document.body.appendChild(overlay);
    }

    const leftHalf = document.getElementById('transition-left-half');
    const rightHalf = document.getElementById('transition-right-half');

    // Ensure initial state
    gsap.set(overlay, { opacity: 0 });
    gsap.set(leftHalf, { x: '-100vw', y: 0 });
    gsap.set(rightHalf, { x: '100vw', y: 0 });

    // Fade in background, slide in logos
    gsap.to(overlay, { opacity: 1, duration: 0.4 });
    gsap.to([leftHalf, rightHalf], {
      x: 0,
      y: 0,
      duration: 0.8,
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
