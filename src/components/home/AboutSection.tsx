"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntro } from "@/context/IntroContext";
import { RevealText } from "@/components/shared/RevealText";
import Button from "@/components/shared/Button";

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

    let mm: gsap.MatchMedia;

    const setupAnimation = () => {
      // 1. Initial bounds (matching layout placeholder slot in px)
      const initialTop = placeholder.offsetTop;
      const initialLeft = placeholder.offsetLeft;
      const initialWidth = placeholder.offsetWidth;
      const initialHeight = placeholder.offsetHeight;

      // 2. Target bounds (matching navbar container width in px)
      const targetLeft = 0;
      const targetWidth = container.offsetWidth;
      const targetHeight = container.offsetHeight * 0.82;
      const targetTop = (container.offsetHeight - targetHeight) / 2;

      mm = gsap.matchMedia();

      // Responsive Desktop (>= 1024px): Pin section and expand video on scroll
      mm.add("(min-width: 1024px)", () => {
        gsap.set(videoWrapper, {
          top: initialTop,
          left: initialLeft,
          width: initialWidth,
          height: initialHeight,
          borderRadius: "0.75rem",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=140%",
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          container,
          {
            y: -35,
            duration: 0.7,
            ease: "power1.inOut",
          },
          0.15
        )
        .to(
          [header, text],
          {
            opacity: 0,
            y: -25,
            duration: 0.35,
            ease: "power1.inOut",
          },
          0.15
        )
        .to(
          videoWrapper,
          {
            top: targetTop,
            left: targetLeft,
            width: targetWidth,
            height: targetHeight,
            borderRadius: "0.75rem",
            duration: 0.7,
            ease: "power1.inOut",
          },
          0.15
        );
      });

      // Responsive Mobile & Tablet (< 1024px): Keep video inside slot without pinning/expansion
      mm.add("(max-width: 1023px)", () => {
        gsap.set(videoWrapper, {
          top: placeholder.offsetTop,
          left: placeholder.offsetLeft,
          width: placeholder.offsetWidth,
          height: placeholder.offsetHeight,
          borderRadius: "0.75rem",
        });
        gsap.set([container, header, text], { clearProps: "all" });
      });

      ScrollTrigger.refresh();
    };

    setupAnimation();

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
      window.removeEventListener("resize", handleResize);
      if (mm) mm.revert();
    };

  }, []);

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
      id="about"
      ref={sectionRef}
      className="relative z-30 w-full h-screen bg-[#F3F4F9] text-[#111625] overflow-hidden py-12 sm:py-16 px-6 sm:px-12 md:px-16 lg:px-20 flex flex-col justify-between"
    >
      <div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-between h-full space-y-8 sm:space-y-12"
      >
        {/* Top Headline Section */}
        <div ref={headerRef} className="flex flex-col gap-1 w-full">
          <h2 className="text-[12vw] lg:text-[8vw] leading-[0.9] tracking-tight font-medium text-[#0A0D14] whitespace-nowrap">
            <span className="block"><RevealText>Bold Ideas,</RevealText></span>
            <span className="block"><RevealText>Brought to Life</RevealText></span>
          </h2>
        </div>

        {/* Content Section: Placeholder (Left) + Text & Approach Button (Right) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 lg:gap-14 w-full pt-2">
          {/* Video Placeholder Slot for Grid Layout */}
          <div
            ref={placeholderRef}
            className="w-full md:w-[56%] lg:w-[58%] max-w-3xl aspect-16/10 sm:aspect-video rounded-xl opacity-0 pointer-events-none"
          />

          {/* Right Column: Description Paragraph + OUR APPROACH Button */}
          <div ref={textRef} className="w-full md:w-[40%] lg:w-[38%] flex flex-col justify-center items-start gap-8">
            <div className="text-slate-800 text-lg sm:text-xl lg:text-[1.3rem] font-normal leading-relaxed">
              <RevealText>
                We are a forward-thinking digital agency specializing in architecting custom web applications, complex dashboards, and scalable ERP solutions. By combining intuitive design with robust engineering, we transform ambitious ideas into high-performance digital products that drive business growth.
              </RevealText>
            </div>

            <Button
              variant="white"
              animatedHover
              onClick={() => document.getElementById("casestudies")?.scrollIntoView({ behavior: "smooth" })}
            >
              OUR APPROACH
            </Button>
          </div>
        </div>

        {/* Floating Animated Video Container - Placed directly inside containerRef */}
        <div
          ref={videoWrapperRef}
          className="absolute z-20 overflow-hidden bg-slate-900"
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
