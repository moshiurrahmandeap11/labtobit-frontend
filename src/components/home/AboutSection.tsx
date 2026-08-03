"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntro } from "@/context/IntroContext";

gsap.registerPlugin(ScrollTrigger);

export const AboutSection = () => {
  const { isIntroDone } = useIntro();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.play().catch(() => {});
      }
      setIsMuted(nextMuted);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const header = headerRef.current;
    const text = textRef.current;
    const placeholder = placeholderRef.current;
    const videoWrapper = videoWrapperRef.current;

    if (!section || !container || !header || !text || !placeholder || !videoWrapper) return;

    let ctx: gsap.Context;

    const setupAnimation = () => {
      // Use offset relative to container for 100% accurate responsive positioning
      const initialTop = placeholder.offsetTop;
      const initialLeft = placeholder.offsetLeft;
      const initialWidth = placeholder.offsetWidth;
      const initialHeight = placeholder.offsetHeight;

      // Set video wrapper initial bounds matching the placeholder slot
      gsap.set(videoWrapper, {
        top: initialTop,
        left: initialLeft,
        width: initialWidth,
        height: initialHeight,
        borderRadius: "1.5rem",
      });

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=120%",
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 0% -> 30%: Text elements fade out
        tl.to(
          [header, text],
          {
            opacity: 0,
            y: -30,
            duration: 0.3,
            ease: "power1.inOut",
          },
          0
        )
        // 0% -> 70%: Video expands smoothly to 100% of container width (navbar line boundaries)
        .to(
          videoWrapper,
          {
            top: "8%",
            left: "0%",
            width: "100%",
            height: "84%",
            borderRadius: "2rem",
            duration: 0.7,
            ease: "power1.inOut",
          },
          0
        );
        // 70% -> 100%: Holds video scale before unpinning cleanly into FeaturedWorkSection
      }, sectionRef);

      ScrollTrigger.refresh();
    };

    const timer = setTimeout(() => {
      setupAnimation();
    }, 100);

    const handleResize = () => {
      if (placeholder && videoWrapper) {
        gsap.set(videoWrapper, {
          top: placeholder.offsetTop,
          left: placeholder.offsetLeft,
          width: placeholder.offsetWidth,
          height: placeholder.offsetHeight,
        });
      }
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      if (ctx) ctx.revert();
    };
  }, []);

  // Refresh ScrollTrigger when intro completes to ensure perfect trigger positioning
  useEffect(() => {
    if (isIntroDone) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isIntroDone]);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 w-full h-screen bg-[#F3F4F9] text-[#111625] overflow-hidden py-12 sm:py-16 px-6 sm:px-12 md:px-16 lg:px-20 flex flex-col justify-between"
    >
      <div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-between h-full space-y-8 sm:space-y-12"
      >
        {/* Top Headline Section */}
        <div ref={headerRef} className="flex flex-col gap-1 max-w-5xl">
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tight leading-[0.92] text-[#0A0D14]">
            <span className="block">Bold Ideas,</span>
            <span className="block">Brought to Life</span>
          </h2>
        </div>

        {/* Content Section: Placeholder (Left) + Text & Approach Button (Right) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 lg:gap-14 w-full pt-2">
          {/* Video Placeholder Slot for Grid Layout */}
          <div
            ref={placeholderRef}
            className="w-full md:w-[56%] lg:w-[58%] max-w-3xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl opacity-0 pointer-events-none"
          />

          {/* Right Column: Description Paragraph + OUR APPROACH Button */}
          <div ref={textRef} className="w-full md:w-[40%] lg:w-[38%] flex flex-col justify-center items-start gap-8">
            <p className="text-slate-800 text-lg sm:text-xl lg:text-[1.3rem] font-normal leading-relaxed">
              We combine design, motion, 3D, and development to create digital
              experiences that feel visually striking and technically seamless. From
              campaign launches to immersive brand worlds, we build work that captures
              attention and invites interaction.
            </p>

            <button
              type="button"
              className="px-7 py-3.5 rounded-full bg-white text-slate-900 font-semibold text-xs tracking-wider uppercase shadow-md border border-slate-200/80 hover:shadow-lg transition-all flex items-center gap-3 cursor-pointer group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 group-hover:bg-[#2D5BFF] transition-colors" />
              <span>OUR APPROACH</span>
            </button>
          </div>
        </div>

        {/* Floating Animated Video Container - Placed directly inside containerRef */}
        <div
          ref={videoWrapperRef}
          className="absolute z-20 overflow-hidden shadow-2xl bg-slate-900 border border-white/40"
        >
          <video
            ref={videoRef}
            src="/about_video.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover cursor-pointer"
            onClick={toggleMute}
          />

          {/* Mute/Unmute Sound Button Overlay */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
            className="absolute bottom-6 right-6 z-30 px-4 py-2.5 rounded-full bg-black/65 hover:bg-black/85 text-white backdrop-blur-md transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-lg border border-white/20 hover:scale-105"
          >
            {isMuted ? (
              <>
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <span>ENABLE SOUND</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#2D5BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>SOUND ON</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
