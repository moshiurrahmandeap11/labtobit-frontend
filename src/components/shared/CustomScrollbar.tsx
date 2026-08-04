"use client";

import React, { useEffect, useState, useRef } from "react";

export function CustomScrollbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateScrollFromPointer(e.clientY);
  };

  const updateScrollFromPointer = (clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const percentage = Math.min(1, Math.max(0, relativeY / rect.height));
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: percentage * totalHeight,
      behavior: "auto",
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      updateScrollFromPointer(e.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  // Track height (px) and thumb height (px)
  const trackHeight = 240; // 240px track height
  const thumbHeight = 44; // 44px pill height
  const maxTranslate = trackHeight - thumbHeight;
  const thumbY = scrollProgress * maxTranslate;

  return (
    <div 
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[9999] pointer-events-auto flex items-center justify-center select-none"
      style={{ height: `${trackHeight}px` }}
    >
      {/* Scrollbar Track Container */}
      <div 
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="relative w-2 h-full bg-[#E0E3EA] rounded-full cursor-pointer overflow-hidden transition-colors hover:bg-[#D4D8E2]"
      >
        {/* Floating Black Scrollbar Thumb */}
        <div 
          className="absolute left-0 right-0 w-full bg-black rounded-full transition-transform duration-75 ease-out shadow-sm"
          style={{
            height: `${thumbHeight}px`,
            transform: `translateY(${thumbY}px)`,
          }}
        />
      </div>
    </div>
  );
}
