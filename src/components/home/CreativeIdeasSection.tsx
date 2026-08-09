"use client";

import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const CreativeIdeasSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const tabletOuterRef = useRef<HTMLDivElement>(null);
  const cameraDotsRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fixed overlay refs for the fullscreen expansion
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayVideoRef = useRef<HTMLVideoElement>(null);

  // Store calculated animation values
  const animVals = useRef<{
    scaleX: number;
    scaleY: number;
    translateX: number;
    translateY: number;
  }>({ scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 });

  const calculateExpansionValues = useCallback(() => {
    const screen = screenRef.current;
    const section = sectionRef.current;
    if (!screen || !section) return;

    const screenRect = screen.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Scale needed to cover entire viewport
    const scaleX = vw / screenRect.width;
    const scaleY = vh / screenRect.height;

    // Current center of the screen element in viewport coords
    const screenCenterX = screenRect.left + screenRect.width / 2;
    const screenCenterY = screenRect.top + screenRect.height / 2;

    // Viewport center
    const vpCenterX = vw / 2;
    const vpCenterY = vh / 2;

    // Translation needed (in pre-scale coords, so divide by scale)
    animVals.current = {
      scaleX,
      scaleY,
      translateX: (vpCenterX - screenCenterX),
      translateY: (vpCenterY - screenCenterY),
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const textCol = textColumnRef.current;
    const tabletOuter = tabletOuterRef.current;
    const cameraDots = cameraDotsRef.current;
    const screen = screenRef.current;
    const overlay = overlayRef.current;
    const overlayVideo = overlayVideoRef.current;

    if (!section || !headline || !textCol || !tabletOuter || !cameraDots || !screen || !overlay) return;

    // Initial state: overlay hidden
    gsap.set(overlay, {
      opacity: 0,
      visibility: "hidden",
      borderRadius: "1.75rem",
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onRefresh: () => {
            // Recalculate on resize/refresh
            calculateExpansionValues();
          },
          onEnter: () => {
            // Sync overlay video time with original video
            if (videoRef.current && overlayVideo) {
              overlayVideo.currentTime = videoRef.current.currentTime;
            }
          },

        },
      });

      // ═══════════════════════════════════════════
      // PHASE 1 (0% – 15%): Camera dots disappear & tablet bezel starts dissolving
      // ═══════════════════════════════════════════

      // 1a. Fade out camera dots early
      tl.to(
        cameraDots,
        {
          opacity: 0,
          duration: 0.1,
          ease: "power1.in",
        },
        0
      );

      // 1b. Begin dissolving tablet bezel (padding, border, shadow, bg)
      tl.to(
        tabletOuter,
        {
          padding: 0,
          borderColor: "transparent",
          boxShadow: "0 0 0 0 rgba(0,0,0,0)",
          backgroundColor: "transparent",
          duration: 0.2,
          ease: "power2.inOut",
        },
        0.05
      );

      // ═══════════════════════════════════════════
      // PHASE 2 (15% – 70%): Video expands to fullscreen
      //   — Text fades out SIMULTANEOUSLY, synced with expansion
      // ═══════════════════════════════════════════

      // 2a. Show the fixed overlay (crossfade from original tablet)
      tl.to(
        overlay,
        {
          opacity: 1,
          visibility: "visible",
          duration: 0.06,
          ease: "none",
        },
        0.12
      );

      // 2b. Fade out original tablet as overlay takes over
      tl.to(
        tabletOuter,
        {
          opacity: 0,
          duration: 0.06,
          ease: "none",
        },
        0.12
      );

      // 2c. Expand overlay from tablet rect to fullscreen
      tl.to(
        overlay,
        {
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          duration: 0.55,
          ease: "power2.inOut",
        },
        0.15
      );

      // 2d. Headline fades out IN SYNC with the expansion (same start, same duration)
      tl.to(
        headline,
        {
          opacity: 0,
          y: -50,
          scale: 0.97,
          duration: 0.55,
          ease: "power2.in",
        },
        0.15
      );

      // 2e. Right-column text fades out IN SYNC with the expansion
      tl.to(
        textCol,
        {
          opacity: 0,
          y: -35,
          scale: 0.97,
          duration: 0.55,
          ease: "power2.in",
        },
        0.15
      );

      // ═══════════════════════════════════════════
      // PHASE 3 (70% – 100%): Hold at fullscreen
      // ═══════════════════════════════════════════

      tl.to({}, { duration: 0.3 });
    }, section);

    // Handle resize: recalculate + update overlay start position
    const handleResize = () => {
      calculateExpansionValues();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateExpansionValues]);

  // Sync overlay initial position to match the tablet screen
  useEffect(() => {
    const screen = screenRef.current;
    const overlay = overlayRef.current;
    if (!screen || !overlay) return;

    const syncPosition = () => {
      const rect = screen.getBoundingClientRect();
      gsap.set(overlay, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    syncPosition();

    // Create a ScrollTrigger just to keep the overlay in sync before animation starts
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "top top",
      onUpdate: syncPosition,
      onRefresh: syncPosition,
    });

    return () => st.kill();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative z-10 w-full text-[#0A0D14] pt-24 sm:pt-36 pb-12 bg-[#f4f4f6]"
      >
        <div className="relative z-10 max-w-[1600px] mx-auto w-full flex flex-col gap-16 sm:gap-24 px-6 sm:px-12 md:px-16">
          {/* Main Headline */}
          <div ref={headlineRef} className="max-w-5xl">
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-[450] tracking-tight leading-[1.02] text-[#0A0D14]">
              <span className="block">Where Creative Ideas</span>
              <span className="block">Become Immersive</span>
              <span className="block">Experiences</span>
            </h2>
          </div>

          {/* Content Layout: iPad Mockup (Left) & Narrative Text (Right) */}
          <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-20 pt-4">

            {/* Left Column: Realistic Tablet / iPad Mockup Device */}
            <div className="w-full lg:w-[55%] max-w-3xl">
              <div
                ref={tabletOuterRef}
                className="relative w-full rounded-[2.5rem] bg-[#16171a] p-3.5 sm:p-5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] border border-[#2b2c32]"
              >
                {/* Tablet Bezel Camera Dot Indicator */}
                <div
                  ref={cameraDotsRef}
                  className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-1.5 z-20 opacity-80"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0d0e11] border border-[#33353c]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1c1d22]" />
                </div>

                {/* Screen Container with Video */}
                <div
                  ref={screenRef}
                  className="relative w-full aspect-[16/10] rounded-[1.75rem] overflow-hidden bg-black shadow-inner"
                >
                  <video
                    ref={videoRef}
                    src="/about_video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/about_video_poster.jpg"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Copy */}
            <div
              ref={textColumnRef}
              className="w-full lg:w-[42%] flex flex-col gap-8 pt-4 lg:pt-8 text-[#0A0D14]"
            >
              <p className="text-xl sm:text-2xl lg:text-[1.45rem] font-normal leading-relaxed text-[#1a1d24]">
                We do not chase trends or produce work that looks like everyone
                else. We focus on creating visually distinctive digital
                experiences that reflect your brand, engage your audience, and
                make people remember what they saw.
              </p>

              <p className="text-lg sm:text-xl lg:text-[1.25rem] font-normal leading-relaxed text-[#363a45]">
                Our process blends creative direction, 3D craft, and interactive
                development to build tailored digital journeys that feel
                original, polished, and built for impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FIXED FULLSCREEN VIDEO OVERLAY
          Starts positioned exactly over the tablet screen, then 
          GSAP ScrollTrigger expands it to cover the entire viewport.
          Rendered outside the pinned section to avoid transform 
          containment issues with position:fixed.
         ═══════════════════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="fixed overflow-hidden pointer-events-none"
        style={{
          zIndex: 40,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: 0,
          visibility: "hidden",
        }}
      >
        <video
          ref={overlayVideoRef}
          src="/about_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
};
