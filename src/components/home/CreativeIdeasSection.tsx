"use client";

import React, { useRef } from "react";

export const CreativeIdeasSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative z-10 w-full text-[#0A0D14] pt-24 sm:pt-36 pb-12 overflow-hidden">
      <div className="relative z-10 max-w-[1600px] mx-auto w-full flex flex-col gap-16 sm:gap-24">
        {/* Main Headline */}
        <div className="max-w-5xl">
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
            <div className="relative w-full rounded-[2.5rem] bg-[#16171a] p-3.5 sm:p-5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] border border-[#2b2c32]">
              {/* Tablet Bezel Camera Dot Indicator (Left Side) */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-1.5 z-20 opacity-80">
                <span className="w-2 h-2 rounded-full bg-[#0d0e11] border border-[#33353c]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c1d22]" />
              </div>

              {/* Screen Container with Video */}
              <div className="relative w-full aspect-[16/10] rounded-[1.75rem] overflow-hidden bg-black shadow-inner">
                <video
                  ref={videoRef}
                  src="/about_video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Copy */}
          <div className="w-full lg:w-[42%] flex flex-col gap-8 pt-4 lg:pt-8 text-[#0A0D14]">
            <p className="text-xl sm:text-2xl lg:text-[1.45rem] font-normal leading-relaxed text-[#1a1d24]">
              We do not chase trends or produce work that looks like everyone else. We focus on creating visually distinctive digital experiences that reflect your brand, engage your audience, and make people remember what they saw.
            </p>

            <p className="text-lg sm:text-xl lg:text-[1.25rem] font-normal leading-relaxed text-[#363a45]">
              Our process blends creative direction, 3D craft, and interactive development to build tailored digital journeys that feel original, polished, and built for impact.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
