"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntro } from "@/context/IntroContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { isIntroDone } = useIntro();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLightSection, setIsLightSection] = useState(false);
  const pathname = usePathname();

  // Show Back button when on sub-pages such as project details (/projects/[slug])
  const isSubPage = pathname !== "/" && pathname.length > 1;
  const backSlug = pathname.startsWith("/projects/") ? pathname.replace("/projects/", "") : "";
  const backHref = backSlug ? `/?backFrom=${backSlug}` : "/";

  // Dynamic contrast adjustment based on scroll position over light vs dark sections
  useEffect(() => {
    if (pathname !== "/") {
      setIsLightSection(false);
      return ;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const isNearBottom = scrollY + windowHeight >= docHeight - 400;

      if (scrollY > windowHeight * 0.85 && !isNearBottom) {
        setIsLightSection(true);
      } else {
        setIsLightSection(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleBackClick = (e: React.MouseEvent) => {
    if (pathname.startsWith('/projects/')) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('start-reverse-hero-morph'));
    }
  };

  if (!isIntroDone) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between pointer-events-auto transition-colors duration-300">
        {/* Header Left: Logo */}
        <motion.div 
          layoutId="logo"
          className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer group"
        >
          <Link href="/" className="absolute inset-0 z-10" />
          <div 
            className="absolute inset-0 transition-transform duration-500 -translate-x-[1px] -translate-y-[1px] group-hover:scale-105 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          >
            <Image 
              src="/labtobit-logo.png" 
              alt="Logo Top-Left" 
              fill 
              className={`object-contain transition-all duration-300 ${isLightSection ? 'brightness-0' : 'invert'}`} 
            />
          </div>
          <div 
            className="absolute inset-0 transition-transform duration-500 translate-x-[1px] translate-y-[1px] group-hover:scale-105 group-hover:translate-x-1.5 group-hover:translate-y-1.5"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
          >
            <Image 
              src="/labtobit-logo.png" 
              alt="Logo Bottom-Right" 
              fill 
              className={`object-contain transition-all duration-300 ${isLightSection ? 'brightness-0' : 'invert'}`} 
            />
          </div>
        </motion.div>

        {/* Navbar Center: Conditional Back Button for Sub-pages */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto z-10">
          <AnimatePresence>
            {isSubPage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Link
                  href={backHref}
                  onClick={handleBackClick}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#0b100d] font-semibold text-xs tracking-widest uppercase hover:bg-[#2bf066] transition-all cursor-pointer shadow-xl group border border-slate-200"
                >
                  <span className="text-sm transition-transform duration-300 group-hover:-translate-x-1">←</span>
                  <span>BACK</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Header Controls (Right) */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Sound Toggle */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-10 h-10 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer ${
              isLightSection
                ? "border-slate-900/25 bg-slate-900/5 hover:bg-slate-900 text-slate-900 hover:text-white"
                : "border-white/20 bg-white/5 hover:bg-white/10 text-white"
            }`}
            aria-label="Sound Toggle"
          >
            <div className="flex items-end gap-[2px] h-3">
              <span className={`w-[2px] rounded-full transition-all duration-300 ${!isMuted ? 'h-3 animate-pulse' : 'h-1'} ${isLightSection ? 'bg-current' : 'bg-white'}`} />
              <span className={`w-[2px] rounded-full transition-all duration-300 ${!isMuted ? 'h-2 animate-bounce' : 'h-2'} ${isLightSection ? 'bg-current' : 'bg-white'}`} />
              <span className={`w-[2px] rounded-full transition-all duration-300 ${!isMuted ? 'h-3 animate-pulse' : 'h-1'} ${isLightSection ? 'bg-current' : 'bg-white'}`} />
            </div>
          </button>

          {/* Let's Talk Button */}
          <a
            href="mailto:hello@labtobit.com"
            className={`hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 text-xs font-semibold uppercase tracking-widest cursor-pointer group ${
              isLightSection
                ? "border-slate-900/25 bg-slate-900/5 text-slate-900 hover:bg-slate-900 hover:text-white shadow-sm"
                : "border-white/20 bg-white/5 text-white hover:bg-white hover:text-black"
            }`}
          >
            <span>Let's talk</span>
            <svg 
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 16 16" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.343 8h11.314m0 0-4.984 4.984M13.657 8 8.673 3.016" />
            </svg>
          </a>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`px-5 py-2.5 rounded-full border transition-all duration-300 text-xs font-semibold uppercase tracking-widest cursor-pointer ${
              isLightSection
                ? "border-slate-900/25 bg-slate-900/5 text-slate-900 hover:bg-slate-900 hover:text-white shadow-sm"
                : "border-white/20 bg-white/5 text-white hover:bg-white hover:text-black"
            }`}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>


      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-zinc-950 z-40 flex flex-col justify-between p-8 sm:p-16 text-white"
          >
            <div className="pt-24 flex flex-col gap-6">
              {["Work", "About", "Services", "Experiments", "Contact"].map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx + 0.3, duration: 0.5 }}
                  className="text-5xl sm:text-7xl font-black uppercase tracking-tighter hover:text-cyan-400 transition-colors w-fit"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-white/10 pt-6 text-xs text-zinc-400 font-mono uppercase tracking-widest gap-4">
              <div>Labtobit Studio © 2026</div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}