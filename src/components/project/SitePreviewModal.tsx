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
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8 lg:p-12"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
            className="relative w-full h-full max-w-7xl max-h-[90vh] bg-[#0b100d] rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
          >
            {/* Fake Browser Chrome */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111814] border-b border-white/10 shrink-0">
              {/* Traffic Lights */}
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all flex items-center justify-center group">
                   <span className="opacity-0 group-hover:opacity-100 text-[#4c0000] text-[8px] font-bold leading-none">x</span>
                </button>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>

              {/* URL Bar */}
              <div className="flex-1 max-w-md mx-4 hidden md:flex items-center justify-center px-4 py-1.5 bg-[#0b100d] border border-white/5 rounded-md">
                <span className="text-xs text-white/50 truncate font-mono tracking-wide">{url}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <a 
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/70 hover:text-[#2bf066] transition-colors flex items-center gap-1.5 group"
                >
                  <span className="hidden sm:inline font-medium">Open in New Tab</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            </div>

            {/* Iframe Content */}
            <div className="flex-1 w-full relative bg-white">
              {/* Loading spinner while iframe loads */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#0b100d]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-[#2bf066] rounded-full animate-spin" />
                  <span className="text-xs text-white/50 uppercase tracking-widest font-bold">Loading Preview...</span>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
