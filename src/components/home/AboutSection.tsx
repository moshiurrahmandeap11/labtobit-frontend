"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Track scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  // Smooth scroll spring for fluid SVG animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001
  });

  // Animate SVG line draw length from 0 to 1 on scroll
  const pathLength = useTransform(smoothProgress, [0, 0.85], [0, 1]);

  // Entrance animations for content elements
  const titleY = useTransform(smoothProgress, [0, 0.4], [50, 0]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.3], [0, 1]);

  const contentY = useTransform(smoothProgress, [0.15, 0.55], [40, 0]);
  const contentOpacity = useTransform(smoothProgress, [0.15, 0.45], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#F3F4F9] text-[#111625] overflow-hidden py-16 sm:py-20 px-6 sm:px-12 md:px-16 lg:px-20 min-h-[95vh] flex flex-col justify-between"
    >
      {/* Background Looping SVG Curve (Lusion style matching screenshot) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M -80 180 C 140 220, 260 380, 160 520 C 80 640, 400 580, 750 560 C 980 540, 1180 640, 1350 780 C 1420 840, 1480 880, 1540 920"
          stroke="#2D5BFF"
          strokeWidth="20"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-between h-full space-y-10 sm:space-y-14 lg:space-y-16">
        {/* Top Headline Section */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="flex flex-col gap-1 max-w-5xl"
        >
          <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tight leading-[0.92] text-[#0A0D14]">
            <span className="block">Bold Ideas,</span>
            <span className="block">Brought to Life</span>
          </h2>
        </motion.div>

        {/* Content Section: Side-by-Side Video Box (Left) + Text & Approach Button (Right) */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 lg:gap-14 w-full pt-2"
        >
          {/* Video Container (Left) - Clean & Made Larger */}
          <div className="w-full md:w-[56%] lg:w-[58%] max-w-3xl">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-200 aspect-[16/10] sm:aspect-[16/9] border border-white/60 group">
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
                className="absolute bottom-4 right-4 z-10 px-3.5 py-2 rounded-full bg-black/65 hover:bg-black/85 text-white backdrop-blur-md transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-lg border border-white/20 hover:scale-105"
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
                    <svg className="w-4 h-4 text-[#2D5BFF] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span>SOUND ON</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Description Paragraph + OUR APPROACH Button directly underneath */}
          <div className="w-full md:w-[40%] lg:w-[38%] flex flex-col justify-center items-start gap-8">
            <p className="text-slate-800 text-lg sm:text-xl lg:text-[1.3rem] font-normal leading-relaxed">
              We combine design, motion, 3D, and development to create digital
              experiences that feel visually striking and technically seamless. From
              campaign launches to immersive brand worlds, we build work that captures
              attention and invites interaction.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-7 py-3.5 rounded-full bg-white text-slate-900 font-semibold text-xs tracking-wider uppercase shadow-md border border-slate-200/80 hover:shadow-lg transition-all flex items-center gap-3 cursor-pointer group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 group-hover:bg-[#2D5BFF] transition-colors" />
              <span>OUR APPROACH</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


