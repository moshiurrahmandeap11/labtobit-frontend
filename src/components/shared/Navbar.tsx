"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntro } from "@/context/IntroContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/shared/Button";

export default function Navbar() {
  const { isIntroDone } = useIntro();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLightSection, setIsLightSection] = useState(false);
  const pathname = usePathname();
  const isLight = pathname === "/" && isLightSection;

  const isSubPage = pathname !== "/" && pathname.length > 1;
  let backHref = "/";
  if (pathname.startsWith("/projects/")) {
    const slug = pathname.replace("/projects/", "");
    backHref = `/?backFromProject=${slug}`;
  } else if (pathname.startsWith("/products/")) {
    const slug = pathname.replace("/products/", "");
    backHref = `/?backFromProduct=${slug}`;
  } else if (pathname.startsWith("/casestudies/")) {
    const slug = pathname.replace("/casestudies/", "");
    backHref = `/?backFromCaseStudy=${slug}`;
  }

  // Dynamic contrast adjustment based on scroll position over light vs dark sections
  useEffect(() => {
    if (pathname !== "/") return;

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
    if (pathname.startsWith('/projects/') || pathname.startsWith('/products/') || pathname.startsWith('/casestudies/')) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('start-reverse-hero-morph'));
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      const win = window as unknown as { lenis?: { scrollTo: (target: number | HTMLElement, options?: { duration: number }) => void } };
      if (win.lenis) {
        win.lenis.scrollTo(0, { duration: 0.8 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleMenuLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, "", `#${targetId}`);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const win = window as unknown as { lenis?: { scrollTo: (target: number | HTMLElement, options?: { duration: number }) => void } };
        if (win.lenis) {
          win.lenis.scrollTo(targetElement, { duration: 0.8 });
        }
      }
    }
  };

  if (!isIntroDone) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between pointer-events-auto transition-colors duration-300">
        {/* Header Left: Logo */}
        <motion.div
          layoutId="logo"
          className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center cursor-pointer group"
        >
          <Link href="/" onClick={handleLogoClick} className="absolute inset-0 z-10" />
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:-translate-x-1"
          >
            <Image
              src="/logo/L.svg"
              alt="Logo L"
              fill
              className={`object-contain transition-all duration-300 ${isLight ? 'brightness-0' : 'invert'}`}
            />
          </div>
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-1"
          >
            <Image
              src="/logo/B.svg"
              alt="Logo B"
              fill
              className={`object-contain transition-all duration-300 ${isLight ? 'brightness-0' : 'invert'}`}
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
            className={`w-[46px] h-[46px] rounded-full border transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center cursor-pointer ${isLight
                ? "border-slate-900/25 bg-slate-900/5 hover:bg-[#0c0c0e] text-slate-900 hover:text-white"
                : "border-white/25 bg-white/5 hover:bg-white text-white hover:text-[#0c0c0e]"
              }`}
            aria-label="Sound Toggle"
          >
            <div className="flex items-end gap-0.5 h-3">
              <span className={`w-0.5 bg-current rounded-full transition-all duration-300 ${!isMuted ? 'h-3 animate-pulse' : 'h-1'}`} />
              <span className={`w-0.5 bg-current rounded-full transition-all duration-300 ${!isMuted ? 'h-2 animate-bounce' : 'h-2'}`} />
              <span className={`w-0.5 bg-current rounded-full transition-all duration-300 ${!isMuted ? 'h-3 animate-pulse' : 'h-1'}`} />
            </div>
          </button>

          {/* Let's Talk Button */}
          <Button
            href="mailto:hello@labtobit.com"
            isLight={isLight}
            animatedHover
            className="hidden sm:inline-flex"
          >
            Let&apos;s talk
          </Button>

          {/* Menu Button */}
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            isLight={isLight}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </Button>
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
              {["About", "Services", "Work", "Products", "Case Studies", "Client Network", "CTA"].map((item, idx) => {
                const targetId = item.toLowerCase().replace(/\s+/g, "");
                return (
                  <motion.a
                    key={item}
                    href={`/#${targetId}`}
                    onClick={(e) => handleMenuLinkClick(e, targetId)}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx + 0.3, duration: 0.5 }}
                    className="text-5xl sm:text-7xl font-black uppercase tracking-tighter hover:text-cyan-400 transition-colors w-fit"
                  >
                    {item}
                  </motion.a>
                );
              })}
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