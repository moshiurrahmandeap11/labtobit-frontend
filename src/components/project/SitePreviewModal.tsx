"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface SitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function SitePreviewModal({ isOpen, onClose, url }: SitePreviewModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 lg:p-12 overflow-hidden"
          onClick={onClose}
        >
          {/* External Action Bar */}
          <div className="absolute top-6 right-6 md:top-8 md:right-12 flex items-center gap-6 z-50">
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm font-bold tracking-widest uppercase text-white/70 hover:text-[#2bf066] transition-colors flex items-center gap-2 group"
            >
              <span>Open in New Tab</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ff5f56] text-white flex items-center justify-center transition-colors shadow-lg"
              title="Close Preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Macbook Mockup Container */}
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
            className="relative flex flex-col items-center justify-center w-full max-w-[1300px] max-h-[80vh] aspect-[16/10]"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
          >
            {/* Macbook Screen (Silver Outer Chassis) */}
            <div className="w-full h-full bg-gradient-to-b from-[#e2e3e9] to-[#c2c3c9] rounded-[1.5rem] md:rounded-[2rem] p-1.5 md:p-2.5 shadow-2xl relative shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)]">
              
              {/* Inner Black Bezel */}
              <div className="w-full h-full bg-[#111] rounded-[1.2rem] md:rounded-[1.7rem] relative p-1.5 md:p-2 pb-5 md:pb-7 flex flex-col shadow-[inset_0_0_0_2px_rgba(0,0,0,1)]">
                
                {/* Camera Dot */}
                <div className="absolute top-1.5 md:top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#050505] shadow-[inset_0_0_2px_rgba(255,255,255,0.1)] relative">
                    <div className="absolute inset-0 m-auto w-0.5 h-0.5 bg-blue-600/30 rounded-full" />
                  </div>
                  <div className="w-0.5 h-0.5 rounded-full bg-green-500/80 shadow-[0_0_2px_#22c55e]" /> {/* Active camera light */}
                </div>

                {/* The actual screen content */}
                <div className="flex-1 w-full bg-white rounded-t-sm rounded-b-sm overflow-hidden relative mt-2 md:mt-3 flex flex-col">
                  {/* Fake Browser Toolbar inside the screen */}
                  <div className="w-full h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
                    </div>
                    <div className="flex-1 mx-4 h-5 bg-white rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-mono tracking-wide">
                      {url.replace(/^https?:\/\//, '')}
                    </div>
                    <div className="w-10" /> {/* Spacer to balance the traffic lights */}
                  </div>
                  
                  {/* Iframe */}
                  <div className="flex-1 w-full relative">
                    {/* Loading spinner */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-0">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Connecting...</span>
                      </div>
                    </div>
                    <iframe
                      src={url}
                      className="w-full h-full border-none relative z-10 bg-white"
                      title="Project Live Preview"
                      loading="lazy"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  </div>
                </div>
                
                {/* Macbook Pro Logo at bottom bezel */}
                <div className="absolute bottom-1 md:bottom-1.5 left-1/2 -translate-x-1/2 text-[7px] md:text-[9px] text-white/30 font-semibold tracking-[0.25em]">
                  MACBOOK PRO
                </div>
              </div>
            </div>

            {/* Macbook Base/Bottom */}
            <div className="relative w-[112%] h-3 md:h-5 bg-gradient-to-b from-[#d2d3d9] to-[#a2a3a9] rounded-b-[1.5rem] md:rounded-b-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.8)] flex justify-center -mt-0.5 z-10">
              {/* Thumb Notch */}
              <div className="w-16 md:w-24 h-1.5 md:h-2 bg-[#828389] rounded-b-lg md:rounded-b-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
