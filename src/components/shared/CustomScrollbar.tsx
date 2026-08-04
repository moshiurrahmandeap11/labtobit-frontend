"use client";

import React, { useEffect, useState, useRef } from "react";

export function CustomScrollbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const triggerVisibility = () => {
    setIsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1200);
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }
      triggerVisibility();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setIsVisible(true);
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
      triggerVisibility();
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      triggerVisibility();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  // Track height (px) and thumb height (px)
  const trackHeight = 240;
  const thumbHeight = 44;
  const maxTranslate = trackHeight - thumbHeight;
  const thumbY = scrollProgress * maxTranslate;

  const show = isVisible || isDragging || isHovered;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-[9999] flex items-center justify-center select-none transition-opacity duration-300 ${
        show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
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
