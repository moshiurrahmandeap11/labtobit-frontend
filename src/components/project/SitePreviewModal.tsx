"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Project, projects } from "@/data/projects";

interface SitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlug: string; // Used to open the current project automatically
}

type WindowState = {
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  currentUrl: string; // Track custom URLs for the browser feature
  refreshKey: number; // Used to force iframe reload
  isLoading: boolean; // Track if the iframe is currently loading
};

export function SitePreviewModal({ isOpen, onClose, initialSlug }: SitePreviewModalProps) {
  const [openWindows, setOpenWindows] = useState<Record<string, WindowState>>({});
  const [topZIndex, setTopZIndex] = useState(10);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Find initial project link
      const initialProject = projects.find(p => p.slug === initialSlug);
      const initialUrl = initialProject?.liveLink || "https://example.com";
      
      // Open the initial window
      setOpenWindows({
        [initialSlug]: { isMinimized: false, isMaximized: true, zIndex: 10, currentUrl: initialUrl, refreshKey: 0, isLoading: true }
      });
      setTopZIndex(10);
    } else {
      document.body.style.overflow = '';
      setOpenWindows({});
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialSlug]);

  const bringToFront = (slug: string) => {
    setTopZIndex(z => z + 1);
    setOpenWindows(prev => ({
      ...prev,
      [slug]: { ...prev[slug], zIndex: topZIndex + 1 }
    }));
  };

  const toggleMinimize = (slug: string) => {
    setOpenWindows(prev => {
      const isMin = prev[slug].isMinimized;
      if (!isMin) {
         return { ...prev, [slug]: { ...prev[slug], isMinimized: true } };
      } else {
         setTopZIndex(z => z + 1);
         return { ...prev, [slug]: { ...prev[slug], isMinimized: false, zIndex: topZIndex + 1 } };
      }
    });
  };

  const toggleMaximize = (slug: string) => {
    bringToFront(slug);
    setOpenWindows(prev => ({
      ...prev,
      [slug]: { ...prev[slug], isMaximized: !prev[slug].isMaximized }
    }));
  };

  const closeWindow = (slug: string) => {
    setOpenWindows(prev => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  };

  const openFromDock = (slug: string) => {
    if (!openWindows[slug]) {
      const project = projects.find(p => p.slug === slug);
      setTopZIndex(z => z + 1);
      setOpenWindows(prev => ({
        ...prev,
        [slug]: { 
          isMinimized: false, 
          isMaximized: false, 
          zIndex: topZIndex + 1, 
          currentUrl: project?.liveLink || "https://example.com",
          refreshKey: 0,
          isLoading: true
        }
      }));
    } else {
      toggleMinimize(slug);
    }
  };

  const handleUrlChange = (slug: string, newUrl: string) => {
    setOpenWindows(prev => ({
      ...prev,
      [slug]: { ...prev[slug], currentUrl: newUrl, isLoading: true }
    }));
  };

  const handleRefresh = (slug: string) => {
    setOpenWindows(prev => ({
      ...prev,
      [slug]: { ...prev[slug], refreshKey: (prev[slug].refreshKey || 0) + 1, isLoading: true }
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/20 backdrop-blur-md p-2 md:p-6 lg:p-10 overflow-hidden"
        >
          {/* External Action Bar */}
          <div className="absolute top-4 right-4 md:top-8 md:right-12 flex items-center gap-6 z-50">
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#ff5f56] text-white flex items-center justify-center transition-colors shadow-lg"
              title="Close Preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {/* Macbook Mockup Container - Made significantly larger and more responsive */}
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
            className="relative flex flex-col items-center justify-center w-[98vw] max-w-[1600px] max-h-[85vh] aspect-[16/10]"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Macbook Screen (Silver Outer Chassis) */}
            <div className="w-full h-full bg-gradient-to-b from-[#e2e3e9] to-[#c2c3c9] rounded-[1rem] md:rounded-[2rem] p-1.5 md:p-2.5 shadow-2xl relative shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)]">
              
              {/* Inner Black Bezel */}
              <div className="w-full h-full bg-[#111] rounded-[0.8rem] md:rounded-[1.7rem] relative p-1.5 md:p-2 pb-5 md:pb-7 flex flex-col shadow-[inset_0_0_0_2px_rgba(0,0,0,1)]">
                
                {/* Camera Dot */}
                <div className="absolute top-1.5 md:top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-50">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#050505] shadow-[inset_0_0_2px_rgba(255,255,255,0.1)] relative">
                    <div className="absolute inset-0 m-auto w-0.5 h-0.5 bg-blue-600/30 rounded-full" />
                  </div>
                  <div className="w-0.5 h-0.5 rounded-full bg-green-500/80 shadow-[0_0_2px_#22c55e]" />
                </div>

                {/* Desktop Screen Content */}
                <div 
                  ref={desktopRef}
                  className="flex-1 w-full bg-cover bg-center rounded-t-sm rounded-b-sm overflow-hidden relative mt-2 md:mt-3 flex flex-col bg-gray-900"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')" }}
                >
                  
              {/* Floating Windows */}
              {Object.entries(openWindows).map(([slug, state]) => {
                const project = projects.find(p => p.slug === slug);
                if (!project || !project.liveLink) return null;

                return (
                  <motion.div
                    key={slug}
                    drag={!state.isMaximized}
                    // No constraints to allow out-of-bounds drag
                    dragMomentum={false}
                    dragElastic={0}
                    onMouseDown={() => bringToFront(slug)}
                    initial={
                      state.isMaximized
                        ? { opacity: 0, width: '100%', height: '100%', top: '0%', left: '0%', scale: 0.95, x: 0, y: 0 }
                        : { opacity: 0, width: '75%', height: '80%', top: '10%', left: '12.5%', scale: 0.5, x: 0, y: 0 }
                    }
                    animate={
                      state.isMinimized
                        ? { opacity: 0, scale: 0.2, y: 300, pointerEvents: 'none' }
                        : state.isMaximized
                        ? { opacity: 1, scale: 1, width: '100%', height: '100%', top: '0%', left: '0%', x: 0, y: 0, pointerEvents: 'auto' }
                        : { opacity: 1, scale: 1, width: '75%', height: '80%', top: '10%', left: '12.5%', pointerEvents: 'auto' }
                    }
                    transition={{ type: "spring", damping: 25, stiffness: 200, delay: state.isMaximized ? 0.2 : 0 }}
                    style={{ 
                      zIndex: state.zIndex, 
                      position: 'absolute',
                      resize: state.isMaximized ? 'none' : 'both',
                      minWidth: '300px',
                      minHeight: '200px'
                    }}
                    className="flex flex-col bg-white rounded-lg md:rounded-xl shadow-2xl overflow-hidden border border-gray-300/50 backdrop-blur-sm"
                  >
                    {/* Browser Toolbar */}
                    <div className="w-full h-10 bg-gray-100/95 backdrop-blur-md border-b border-gray-200/80 flex items-center px-3 gap-3 shrink-0 cursor-grab active:cursor-grabbing">
                      <div className="flex gap-1.5 group/traffic relative z-10 shrink-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); closeWindow(slug); }} 
                          className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] flex items-center justify-center hover:brightness-110"
                        >
                           <span className="opacity-0 group-hover/traffic:opacity-100 text-[#4c0000] text-[7px] font-bold leading-none">x</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleMinimize(slug); }} 
                          className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] flex items-center justify-center hover:brightness-110"
                        >
                           <span className="opacity-0 group-hover/traffic:opacity-100 text-[#8a6109] text-[7px] font-bold leading-none">-</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleMaximize(slug); }} 
                          className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] flex items-center justify-center hover:brightness-110"
                        >
                           <span className="opacity-0 group-hover/traffic:opacity-100 text-[#0d5918] text-[7px] font-bold leading-none">+</span>
                        </button>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRefresh(slug); }}
                        className="ml-2 text-gray-400 hover:text-gray-700 transition-colors pointer-events-auto flex items-center justify-center w-5 h-5 rounded hover:bg-gray-200/50"
                        title="Reload page"
                        onMouseDown={(e) => e.stopPropagation()} 
                      >
                        <svg className={state.isLoading ? "animate-spin text-gray-600" : ""} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M21 13a9 9 0 1 1-3-7.7L21 8"></path></svg>
                      </button>
                      
                      {/* Interactive URL Bar */}
                      <div 
                        className="flex-1 mx-2 h-6 bg-white rounded border border-gray-200 shadow-inner flex items-center px-2 cursor-text"
                        onMouseDown={(e) => e.stopPropagation()} 
                      >
                        <input 
                          type="text"
                          defaultValue={state.currentUrl}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = e.currentTarget.value;
                              const newUrl = val.startsWith('http') ? val : `https://${val}`;
                              handleUrlChange(slug, newUrl);
                              e.currentTarget.value = newUrl;
                            }
                          }}
                          className="w-full bg-transparent outline-none text-xs text-gray-700 font-mono"
                          placeholder="Enter URL and press Enter..."
                        />
                      </div>

                      <div className="shrink-0 relative z-10">
                        <a 
                          href={state.currentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-700 pointer-events-auto flex items-center p-1"
                          title="Open in new tab"
                          onMouseDown={(e) => e.stopPropagation()} 
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                      </div>
                    </div>
                    
                    {/* Iframe */}
                    <div className="flex-1 w-full relative bg-white">
                      <iframe
                        key={state.refreshKey}
                        src={state.currentUrl}
                        className="w-full h-full border-none relative z-10 bg-white"
                        title={project.title}
                        loading="lazy"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        onLoad={() => {
                          setOpenWindows(prev => ({
                            ...prev,
                            [slug]: { ...prev[slug], isLoading: false }
                          }));
                        }}
                      />
                    </div>
                    
                    {!state.isMaximized && (
                      <div className="absolute bottom-1 right-1 w-3 h-3 pointer-events-none opacity-30 z-20" style={{ backgroundImage: 'linear-gradient(135deg, transparent 50%, #000 50%)', backgroundSize: '4px 4px' }} />
                    )}
                  </motion.div>
                );
              })}

              {/* MacOS Dock */}
              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center gap-2 md:gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[9999]">
                {projects.slice(0, 4).map(project => {
                  const isOpen = !!openWindows[project.slug];
                  const isMinimized = openWindows[project.slug]?.isMinimized;
                  
                  return (
                    <button
                      key={project.slug}
                      onClick={() => openFromDock(project.slug)}
                      className="relative group flex flex-col items-center justify-end w-8 h-8 md:w-14 md:h-14 rounded-xl hover:scale-125 hover:-translate-y-2 transition-all origin-bottom"
                    >
                      <img 
                        src={project.heroImage} 
                        alt={project.title}
                        className="w-full h-full object-cover rounded-xl shadow-lg border border-white/20 bg-[#111814]"
                      />
                      {isOpen && (
                        <div className="absolute -bottom-2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                      )}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-gray-900/80 backdrop-blur-md text-white text-[10px] rounded-md whitespace-nowrap border border-white/10 pointer-events-none">
                        {project.title}
                      </div>
                    </button>
                  );
                })}
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
