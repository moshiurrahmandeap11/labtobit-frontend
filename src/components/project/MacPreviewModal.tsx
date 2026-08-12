"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Project, projects } from "@/data/projects";

interface SitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlug: string;
}

type Tab = {
  id: string;
  url: string;
  title: string;
  refreshKey: number;
  isLoading: boolean;
};

type WindowState = {
  type?: 'browser' | 'terminal';
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  tabs: Tab[];
  activeTabId: string;
};

const WALLPAPERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", // Abstract Flow
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2564&auto=format&fit=crop", // Colorful Abstract
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop", // Dark Neon
];

const StartPage = ({ onNavigate }: { onNavigate: (url: string) => void }) => (
  <div className="w-full h-full bg-white dark:bg-[#1c1c1e] flex flex-col items-center justify-center relative">
    <div className="absolute top-6 right-8 flex items-center gap-3">
      <span className="text-gray-800 dark:text-gray-200 font-semibold tracking-wide">Labtobit Inc.</span>
    </div>
    <div className="flex flex-col items-center gap-6 w-full max-w-md px-6">
      <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
      <h2 className="text-xl font-light text-gray-500 dark:text-gray-400">Where would you like to go?</h2>
      
      <form 
        className="w-full relative flex items-center mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          const val = new FormData(e.currentTarget).get('url') as string;
          if (val) {
            onNavigate(val.startsWith('http') ? val : `https://${val}`);
          }
        }}
      >
        <svg className="w-5 h-5 text-gray-400 absolute left-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          name="url"
          type="text"
          placeholder="Search or enter website name..."
          className="w-full h-12 pl-12 pr-4 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 dark:text-gray-200 transition-shadow text-sm"
          autoFocus
        />
      </form>
    </div>
  </div>
);

const TerminalApp = () => {
  const [history, setHistory] = useState<{ type: 'input' | 'output', text: string }[]>([
    { type: 'output', text: 'Last login: ' + new Date().toString().split(' GMT')[0] + ' on ttys000' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setHistory(prev => [...prev, { type: 'input', text: input }]);
      setInput('');
      return;
    }

    const newHistory = [...history, { type: 'input', text: input }];
    const args = input.trim().split(' ');
    const cmd = args[0].toLowerCase();
    
    let output = '';

    switch (cmd) {
      case 'help':
        output = 'Available commands: help, echo, clear, date, whoami, ls, pwd, cd, sudo';
        break;
      case 'echo':
        output = args.slice(1).join(' ');
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'whoami':
        output = 'moshiur';
        break;
      case 'pwd':
        output = '/Users/moshiur';
        break;
      case 'ls':
        output = 'Desktop\tDocuments\tDownloads\tProjects';
        break;
      case 'cd':
        output = args[1] ? `cd: no such file or directory: ${args[1]}` : '';
        break;
      case 'sudo':
        output = 'moshiur is not in the sudoers file. This incident will be reported.';
        break;
      default:
        output = `zsh: command not found: ${cmd}`;
    }

    if (output) {
      newHistory.push({ type: 'output', text: output });
    }
    
    setHistory(newHistory as any);
    setInput('');
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] p-2 overflow-y-auto rounded-b-lg md:rounded-b-xl pb-6 text-left cursor-text" onClick={() => document.getElementById('term-input')?.focus()}>
      {history.map((line, i) => (
        <div key={i} className="mb-1 leading-relaxed break-words whitespace-pre-wrap flex flex-col md:flex-row md:items-start md:gap-2">
          {line.type === 'input' ? (
            <>
              <div className="shrink-0 flex gap-2">
                <span className="text-green-400">moshiur@MacBook-Pro</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-400">%</span>
              </div>
              <span className="text-white mt-1 md:mt-0 break-all">{line.text}</span>
            </>
          ) : (
            <div className="text-gray-300 w-full">{line.text}</div>
          )}
        </div>
      ))}
      <form onSubmit={handleCommand} className="flex flex-col md:flex-row md:items-start md:gap-2 mt-1">
        <div className="shrink-0 flex gap-2">
          <span className="text-green-400">moshiur@MacBook-Pro</span>
          <span className="text-blue-400">~</span>
          <span className="text-gray-400">%</span>
        </div>
        <input 
          id="term-input"
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white border-none focus:ring-0 p-0 m-0 mt-1 md:mt-0 w-full"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </form>
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

export function MacPreviewModal({ isOpen, onClose, initialSlug }: SitePreviewModalProps) {
  const [openWindows, setOpenWindows] = useState<Record<string, WindowState>>({});
  const [topZIndex, setTopZIndex] = useState(10);
  const desktopRef = useRef<HTMLDivElement>(null);

  // New States for Premium Features
  const [bootState, setBootState] = useState<'booting' | 'desktop'>('booting');
  const [time, setTime] = useState("");
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsZIndex, setSettingsZIndex] = useState(5);
  const [bouncingIcon, setBouncingIcon] = useState<string | null>(null);
  
  // Interactive Widgets States
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Time effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleDateString('en-US', { weekday: 'short' }) + " " + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  // Modal logic
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setBootState('booting');
      
      const bootTimer = setTimeout(() => {
        setBootState('desktop');
        
        // Open initial window AFTER boot
        const initialProject = projects.find(p => p.slug === initialSlug);
        const initialUrl = initialProject?.liveLink || "https://example.com";
        const initialTabId = Math.random().toString(36).substring(2, 9);

        setOpenWindows({
          [initialSlug]: { 
            type: 'browser',
            isMinimized: false, 
            isMaximized: true, 
            zIndex: 10, 
            tabs: [{
              id: initialTabId,
              url: initialUrl,
              title: initialProject?.title || "New Tab",
              refreshKey: 0,
              isLoading: true
            }],
            activeTabId: initialTabId
          }
        });
        setTopZIndex(10);
      }, 1500);

      return () => clearTimeout(bootTimer);
    } else {
      document.body.style.overflow = '';
      setOpenWindows({});
      setIsSettingsOpen(false);
      setIsCalendarOpen(false);
      setActiveMenu(null);
    }
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
      setBouncingIcon(slug);
      
      setTimeout(() => {
        setBouncingIcon(null);
        const project = projects.find(p => p.slug === slug);
        setTopZIndex(z => z + 1);
        const initialTabId = Math.random().toString(36).substring(2, 9);
        
        setOpenWindows(prev => ({
          ...prev,
          [slug]: { 
            type: slug === 'terminal' ? 'terminal' : 'browser',
            isMinimized: false, 
            isMaximized: false, 
            zIndex: topZIndex + 1, 
            tabs: [{
              id: initialTabId,
              url: project?.liveLink || "",
              title: project?.title || (slug === 'terminal' ? 'Terminal' : 'New Tab'),
              refreshKey: 0,
              isLoading: !!project?.liveLink
            }],
            activeTabId: initialTabId
          }
        }));
      }, 600); // Wait for bounce animation
    } else {
      toggleMinimize(slug);
    }
  };

  // Tab Handlers
  const handleAddTab = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabId = Math.random().toString(36).substring(2, 9);
    setOpenWindows(prev => {
      const window = prev[slug];
      return {
        ...prev,
        [slug]: {
          ...window,
          tabs: [...window.tabs, {
            id: newTabId,
            url: "", // Empty URL for start page
            title: "New Tab",
            refreshKey: 0,
            isLoading: false
          }],
          activeTabId: newTabId
        }
      };
    });
  };

  const handleCloseTab = (slug: string, tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenWindows(prev => {
      const window = prev[slug];
      const newTabs = window.tabs.filter(t => t.id !== tabId);
      
      if (newTabs.length === 0) {
        // If last tab is closed, close the window
        const next = { ...prev };
        delete next[slug];
        return next;
      }
      
      return {
        ...prev,
        [slug]: {
          ...window,
          tabs: newTabs,
          activeTabId: window.activeTabId === tabId ? newTabs[newTabs.length - 1].id : window.activeTabId
        }
      };
    });
  };

  const handleSwitchTab = (slug: string, tabId: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setOpenWindows(prev => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        activeTabId: tabId
      }
    }));
  };

  const updateActiveTab = (slug: string, updates: Partial<Tab>) => {
    setOpenWindows(prev => {
      const window = prev[slug];
      return {
        ...prev,
        [slug]: {
          ...window,
          tabs: window.tabs.map(t => t.id === window.activeTabId ? { ...t, ...updates } : t)
        }
      };
    });
  };

  const openSettings = () => {
    setBouncingIcon('settings');
    setTimeout(() => {
      setBouncingIcon(null);
      setIsSettingsOpen(true);
      setTopZIndex(z => z + 1);
      setSettingsZIndex(topZIndex + 1);
    }, 600);
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
          onClick={() => {
            setActiveMenu(null);
            setIsCalendarOpen(false);
          }}
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

          {/* Macbook Mockup Container */}
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
            className="relative flex flex-col items-center justify-center w-[98vw] max-w-[1600px] max-h-[85vh] aspect-[16/10]"
            onClick={(e) => { e.stopPropagation(); setActiveMenu(null); setIsCalendarOpen(false); }} 
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
                  className="flex-1 w-full bg-cover bg-center rounded-t-sm rounded-b-sm overflow-hidden relative mt-2 md:mt-3 flex flex-col bg-gray-900 transition-all duration-1000"
                  style={{ backgroundImage: `url('${wallpaper}')` }}
                >
                  
                  {/* Boot-up Sequence */}
                  <AnimatePresence>
                    {bootState === 'booting' && (
                      <motion.div 
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-black z-[999999] flex flex-col items-center justify-center"
                      >
                        <svg className="w-16 h-16 md:w-24 md:h-24 text-white mb-8" fill="currentColor" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.92.21-9.84-1.96-14.74-6.53-3.13-2.73-7.1-7.43-11.87-14.09-5.08-7.14-9.37-15.22-12.88-24.23-3.5-9.02-5.26-17.65-5.26-25.87 0-11.4 3.17-20.94 9.53-28.61 5.96-7.18 13.55-10.86 22.78-11.04 4.54.08 9.56 1.15 15.06 3.2 5.51 2.05 9.17 3.12 11 3.24 1.57-.12 5.56-1.32 11.96-3.6 6.4-2.29 12.02-3.32 16.89-3.08 7.37.45 13.62 2.62 18.77 6.49 4.3 3.17 7.78 7.3 10.42 12.39-9.15 5.6-13.68 12.8-13.58 21.6.1 7.6 3.13 13.9 9.09 18.9 4.36 3.65 9.5 5.94 15.42 6.87-1.4 4.34-3.23 8.52-5.49 12.51zM119.11 7.24c0 8.1-2.96 15.66-8.86 22.66-7.12 8.32-15.73 12.6-25.85 12.85-.22-7.85 2.68-15.34 8.71-22.48 6.94-8.07 15.3-12.39 25.1-12.98.05.7.08 1.34.08 1.95z"/>
                        </svg>
                        <div className="w-32 md:w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="h-full bg-white"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* MacOS Top Menu Bar */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-white/30 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-3 text-[10px] text-white font-medium z-[9000]">
                    <div className="flex items-center gap-4 relative">
                      <svg className="w-3 h-3 hover:opacity-70 cursor-pointer" fill="currentColor" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.92.21-9.84-1.96-14.74-6.53-3.13-2.73-7.1-7.43-11.87-14.09-5.08-7.14-9.37-15.22-12.88-24.23-3.5-9.02-5.26-17.65-5.26-25.87 0-11.4 3.17-20.94 9.53-28.61 5.96-7.18 13.55-10.86 22.78-11.04 4.54.08 9.56 1.15 15.06 3.2 5.51 2.05 9.17 3.12 11 3.24 1.57-.12 5.56-1.32 11.96-3.6 6.4-2.29 12.02-3.32 16.89-3.08 7.37.45 13.62 2.62 18.77 6.49 4.3 3.17 7.78 7.3 10.42 12.39-9.15 5.6-13.68 12.8-13.58 21.6.1 7.6 3.13 13.9 9.09 18.9 4.36 3.65 9.5 5.94 15.42 6.87-1.4 4.34-3.23 8.52-5.49 12.51zM119.11 7.24c0 8.1-2.96 15.66-8.86 22.66-7.12 8.32-15.73 12.6-25.85 12.85-.22-7.85 2.68-15.34 8.71-22.48 6.94-8.07 15.3-12.39 25.1-12.98.05.7.08 1.34.08 1.95z"/>
                      </svg>
                    </div>

                    <div className="flex items-center gap-3 relative">
                      <svg className="w-3 h-3 hover:opacity-70 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                      <svg className="w-4 h-4 hover:opacity-70 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>
                      
                      {/* Interactive Clock / Calendar */}
                      <span onClick={(e) => { e.stopPropagation(); setIsCalendarOpen(!isCalendarOpen); setActiveMenu(null); }} className={`cursor-pointer px-2 rounded ${isCalendarOpen ? 'bg-white/30' : 'hover:bg-white/20'}`}>
                        {time}
                      </span>

                      <AnimatePresence>
                        {isCalendarOpen && (
                          <motion.div 
                            initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} transition={{type: "spring", damping: 20, stiffness: 300}}
                            className="absolute top-full right-0 mt-2 w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl p-4 text-gray-800 dark:text-gray-200 z-50 font-normal"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="font-bold text-sm mb-4">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                              {['S','M','T','W','T','F','S'].map((d, idx) => <div key={idx} className="font-semibold opacity-50 mb-1">{d}</div>)}
                              {/* Simple dummy calendar layout */}
                              {Array.from({length: 31}).map((_, i) => (
                                <div key={i} className={`p-1 rounded-full w-6 h-6 mx-auto flex items-center justify-center ${i+1 === new Date().getDate() ? 'bg-red-500 text-white font-bold shadow-md' : 'hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer'}`}>{i+1}</div>
                              ))}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-300/50 dark:border-gray-600/50">
                              <h4 className="text-[10px] font-semibold opacity-50 uppercase tracking-wider mb-2">Notifications</h4>
                              <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg backdrop-blur-md">
                                <div className="text-[11px] font-bold">System Update</div>
                                <div className="text-[9px] opacity-70">macOS is up to date.</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>
                  
                  {/* Floating Settings Window */}
                  <AnimatePresence>
                    {isSettingsOpen && (
                      <motion.div
                        drag
                        dragMomentum={false}
                        dragElastic={0}
                        onMouseDown={() => {
                          setTopZIndex(z => z + 1);
                          setSettingsZIndex(topZIndex + 1);
                        }}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        style={{ zIndex: settingsZIndex, position: 'absolute', top: '15%', left: '30%', minWidth: '350px' }}
                        className="bg-gray-100/90 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-gray-300/50 flex flex-col"
                      >
                        <div className="w-full h-10 bg-gray-200/50 flex items-center px-3 gap-3 shrink-0 cursor-grab active:cursor-grabbing border-b border-gray-300/50">
                          <div className="flex gap-1.5 group/traffic relative z-10 shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(false); }} className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center hover:brightness-110 shadow-sm"><span className="opacity-0 group-hover/traffic:opacity-100 text-[#4c0000] text-[7px] font-bold leading-none">x</span></button>
                            <button className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center hover:brightness-110 shadow-sm"><span className="opacity-0 group-hover/traffic:opacity-100 text-[#8a6109] text-[7px] font-bold leading-none">-</span></button>
                            <button className="w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center hover:brightness-110 shadow-sm"><span className="opacity-0 group-hover/traffic:opacity-100 text-[#0d5918] text-[7px] font-bold leading-none">+</span></button>
                          </div>
                          <div className="flex-1 text-center text-xs font-semibold text-gray-700 mr-10">System Settings</div>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Wallpaper</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {WALLPAPERS.map((wp, idx) => (
                              <button 
                                key={idx}
                                onClick={() => setWallpaper(wp)}
                                className={`w-full h-16 rounded-md overflow-hidden border-2 transition-all ${wallpaper === wp ? 'border-blue-500 shadow-md scale-105' : 'border-transparent hover:border-gray-300'}`}
                              >
                                <img src={wp} alt={`Wallpaper ${idx}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Floating Windows (Browsers with Tabs) */}
                  {Object.entries(openWindows).map(([slug, state]) => {
                    const activeTab = state.tabs.find(t => t.id === state.activeTabId) || state.tabs[0];
                    if (!activeTab) return null;

                    return (
                      <motion.div
                        key={slug}
                        drag={!state.isMaximized}
                        dragMomentum={false}
                        dragElastic={0}
                        onMouseDown={() => bringToFront(slug)}
                        initial={
                          state.isMaximized
                            ? { opacity: 0, width: '100%', height: 'calc(100% - 24px)', top: '24px', left: '0%', scale: 0.95, x: 0, y: 0 }
                            : { opacity: 0, width: '75%', height: '80%', top: '10%', left: '12.5%', scale: 0.5, x: 0, y: 0 }
                        }
                        animate={
                          state.isMinimized
                            ? { opacity: 0, scale: 0.1, y: 450, x: 0, rotateZ: 5, scaleX: 0.3, pointerEvents: 'none' }
                            : state.isMaximized
                            ? { opacity: 1, scale: 1, width: '100%', height: 'calc(100% - 24px)', top: '24px', left: '0%', x: 0, y: 0, rotateZ: 0, scaleX: 1, pointerEvents: 'auto' }
                            : { opacity: 1, scale: 1, width: '75%', height: '80%', top: '10%', left: '12.5%', rotateZ: 0, scaleX: 1, pointerEvents: 'auto' }
                        }
                        transition={{ type: "spring", damping: 25, stiffness: 200, delay: state.isMaximized ? 0.2 : 0 }}
                        style={{ 
                          zIndex: state.zIndex, 
                          position: 'absolute',
                          resize: state.isMaximized ? 'none' : 'both',
                          minWidth: '300px',
                          minHeight: '200px'
                        }}
                        className={`flex flex-col bg-white/90 rounded-lg md:rounded-xl shadow-2xl overflow-hidden backdrop-blur-md ${state.type === 'terminal' ? 'border border-[#333]' : 'border border-gray-300/50'}`}
                      >
                        {/* Terminal Header */}
                        {state.type === 'terminal' ? (
                          <div className="w-full pt-2 px-2 bg-[#2d2d2d] border-b border-[#1e1e1e] flex items-end gap-1 shrink-0 cursor-grab active:cursor-grabbing rounded-t-lg md:rounded-t-xl pb-2 relative">
                             <div className="flex gap-1.5 group/traffic relative z-10 shrink-0 mb-1 ml-1">
                               <button onClick={(e) => { e.stopPropagation(); closeWindow(slug); }} className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm flex items-center justify-center hover:brightness-110">
                                 <span className="opacity-0 group-hover/traffic:opacity-100 text-[#4c0000] text-[7px] font-bold leading-none">x</span>
                               </button>
                               <button onClick={(e) => { e.stopPropagation(); toggleMinimize(slug); }} className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm flex items-center justify-center hover:brightness-110">
                                 <span className="opacity-0 group-hover/traffic:opacity-100 text-[#8a6109] text-[7px] font-bold leading-none">-</span>
                               </button>
                               <button onClick={(e) => { e.stopPropagation(); toggleMaximize(slug); }} className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm flex items-center justify-center hover:brightness-110">
                                 <span className="opacity-0 group-hover/traffic:opacity-100 text-[#0d5918] text-[7px] font-bold leading-none">+</span>
                               </button>
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                               <span className="text-[#9ca3af] text-[11px] font-semibold mt-1">moshiur@MacBook-Pro — -zsh</span>
                             </div>
                          </div>
                        ) : (
                          /* Browser Tabs Header (Glassmorphism) */
                          <div className="w-full pt-2 px-2 bg-white/50 backdrop-blur-xl border-b border-gray-200/80 flex items-end gap-1 shrink-0 cursor-grab active:cursor-grabbing">
                            <div className="flex gap-1.5 group/traffic relative z-10 shrink-0 mb-2 ml-1">
                              <button onClick={(e) => { e.stopPropagation(); closeWindow(slug); }} className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm flex items-center justify-center hover:brightness-110">
                                 <span className="opacity-0 group-hover/traffic:opacity-100 text-[#4c0000] text-[7px] font-bold leading-none">x</span>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); toggleMinimize(slug); }} className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm flex items-center justify-center hover:brightness-110">
                                 <span className="opacity-0 group-hover/traffic:opacity-100 text-[#8a6109] text-[7px] font-bold leading-none">-</span>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); toggleMaximize(slug); }} className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm flex items-center justify-center hover:brightness-110">
                                 <span className="opacity-0 group-hover/traffic:opacity-100 text-[#0d5918] text-[7px] font-bold leading-none">+</span>
                              </button>
                            </div>
                            
                            {/* Safari Tabs Layout */}
                            <div className="ml-4 flex items-end gap-1 overflow-x-auto no-scrollbar w-full relative">
                              {state.tabs.map((tab) => (
                                <div 
                                  key={tab.id}
                                  onClick={(e) => handleSwitchTab(slug, tab.id, e)}
                                  className={`group px-3 py-1.5 rounded-t-lg border-t border-l border-r text-[10px] font-medium flex items-center gap-2 max-w-[150px] min-w-[100px] cursor-pointer transition-all ${
                                    state.activeTabId === tab.id 
                                      ? 'bg-white border-gray-200/80 text-gray-700 shadow-sm z-10' 
                                      : 'bg-white/30 border-transparent text-gray-500 hover:bg-white/50'
                                  }`}
                                >
                                   <span className={`w-2 h-2 rounded-full shrink-0 ${tab.url ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                                   <span className="truncate flex-1">{tab.title}</span>
                                   
                                   {/* Close Tab Button */}
                                   <button 
                                    onClick={(e) => handleCloseTab(slug, tab.id, e)}
                                    className={`w-3 h-3 rounded-full flex items-center justify-center hover:bg-gray-200 ${state.activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                   >
                                     <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                   </button>
                                </div>
                              ))}
                              
                              {/* Add Tab Button */}
                              <div 
                                onClick={(e) => handleAddTab(slug, e)}
                                className="w-6 h-6 mb-1 ml-1 rounded flex items-center justify-center hover:bg-gray-200/50 cursor-pointer text-gray-500 shrink-0"
                              >
                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Content Area */}
                        {state.type === 'terminal' ? (
                          <TerminalApp />
                        ) : (
                          <>
                            {/* Browser Toolbar */}
                        <div className="w-full h-10 bg-white/70 backdrop-blur-xl border-b border-gray-200/80 flex items-center px-3 gap-3 shrink-0">
                          
                          {/* Navigation Buttons */}
                          <div className="flex gap-2 text-gray-400">
                            <svg className="w-4 h-4 hover:text-gray-600 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                            <svg className="w-4 h-4 hover:text-gray-600 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                          </div>

                          <button 
                            onClick={(e) => { e.stopPropagation(); updateActiveTab(slug, { refreshKey: activeTab.refreshKey + 1, isLoading: true }); }}
                            className="text-gray-400 hover:text-gray-700 transition-colors pointer-events-auto flex items-center justify-center w-5 h-5 rounded hover:bg-gray-200/50"
                            title="Reload page"
                            onMouseDown={(e) => e.stopPropagation()} 
                          >
                            <svg className={activeTab.isLoading ? "animate-spin text-gray-600" : ""} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M21 13a9 9 0 1 1-3-7.7L21 8"></path></svg>
                          </button>
                          
                          {/* Interactive URL Bar */}
                          <div 
                            className="flex-1 mx-2 h-6 bg-white/80 rounded border border-gray-200 shadow-inner flex items-center px-2 cursor-text"
                            onMouseDown={(e) => e.stopPropagation()} 
                          >
                            <svg className="w-3 h-3 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            <input 
                              type="text"
                              value={activeTab.url}
                              onChange={(e) => updateActiveTab(slug, { url: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = e.currentTarget.value;
                                  if (!val) return;
                                  const newUrl = val.startsWith('http') ? val : `https://${val}`;
                                  updateActiveTab(slug, { url: newUrl, isLoading: true, title: newUrl.replace('https://', '') });
                                }
                              }}
                              className="w-full bg-transparent outline-none text-xs text-gray-700 font-mono"
                              placeholder="Search or enter website name"
                            />
                          </div>

                          <div className="shrink-0 relative z-10">
                            {activeTab.url && (
                              <a 
                                href={activeTab.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-700 pointer-events-auto flex items-center p-1"
                                title="Open in new tab"
                                onMouseDown={(e) => e.stopPropagation()} 
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                              </a>
                            )}
                          </div>
                        </div>
                        
                        {/* Browser Content Area (Iframe or Start Page) */}
                        <div className="flex-1 w-full relative bg-white">
                          {activeTab.url ? (
                            <iframe
                              key={`${activeTab.id}-${activeTab.refreshKey}`}
                              src={activeTab.url}
                              className="w-full h-full border-none relative z-10 bg-white"
                              title={activeTab.title}
                              loading="lazy"
                              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                              onLoad={() => updateActiveTab(slug, { isLoading: false })}
                            />
                          ) : (
                            <StartPage 
                              onNavigate={(url) => updateActiveTab(slug, { url, isLoading: true, title: url.replace('https://', '') })} 
                            />
                          )}
                        </div>
                        </>
                        )}
                        
                        {!state.isMaximized && (
                          <div className="absolute bottom-1 right-1 w-3 h-3 pointer-events-none opacity-30 z-20" style={{ backgroundImage: 'linear-gradient(135deg, transparent 50%, #000 50%)', backgroundSize: '4px 4px' }} />
                        )}
                      </motion.div>
                    );
                  })}

                  {/* MacOS Dock */}
                  <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center gap-2 md:gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[9999]">
                    {/* Settings Icon */}
                    <button
                      onClick={(e) => { e.stopPropagation(); openSettings(); }}
                      className={`relative group flex flex-col items-center justify-end w-8 h-8 md:w-14 md:h-14 rounded-xl hover:scale-125 hover:-translate-y-2 transition-all origin-bottom ${bouncingIcon === 'settings' ? 'animate-bounce' : ''}`}
                    >
                      <div className="w-full h-full rounded-xl shadow-lg border border-white/20 bg-gray-200 flex items-center justify-center overflow-hidden">
                        <svg className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                      </div>
                      {isSettingsOpen && <div className="absolute -bottom-2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-gray-900/80 backdrop-blur-md text-white text-[10px] rounded-md whitespace-nowrap border border-white/10 pointer-events-none z-50">Settings</div>
                    </button>
                    <div className="w-[1px] h-8 bg-white/20 mx-1"></div>

                    {/* Terminal Icon */}
                    <button
                      onClick={(e) => { e.stopPropagation(); openFromDock('terminal'); }}
                      className={`relative group flex flex-col items-center justify-end w-8 h-8 md:w-14 md:h-14 rounded-xl hover:scale-125 hover:-translate-y-2 transition-all origin-bottom ${bouncingIcon === 'terminal' ? 'animate-bounce' : ''}`}
                    >
                      <div className="w-full h-full rounded-xl shadow-lg border border-white/20 bg-[#1e1e1e] flex items-center justify-center overflow-hidden">
                        <span className="text-green-400 font-mono text-[10px] md:text-sm font-bold">&gt;_</span>
                      </div>
                      {openWindows['terminal'] && (
                        <div className="absolute -bottom-2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                      )}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-gray-900/80 backdrop-blur-md text-white text-[10px] rounded-md whitespace-nowrap border border-white/10 pointer-events-none z-50">
                        Terminal
                      </div>
                    </button>
                    <div className="w-[1px] h-8 bg-white/20 mx-1"></div>

                    {projects.slice(0, 4).map(project => {
                      const isOpen = !!openWindows[project.slug];
                      const isMinimized = openWindows[project.slug]?.isMinimized;
                      
                      return (
                        <button
                          key={project.slug}
                          onClick={(e) => { e.stopPropagation(); openFromDock(project.slug); }}
                          className={`relative group flex flex-col items-center justify-end w-8 h-8 md:w-14 md:h-14 rounded-xl hover:scale-125 hover:-translate-y-2 transition-all origin-bottom ${bouncingIcon === project.slug ? 'animate-bounce' : ''}`}
                        >
                          <img 
                            src={project.heroImage} 
                            alt={project.title}
                            className="w-full h-full object-cover rounded-xl shadow-lg border border-white/20 bg-[#111814]"
                          />
                          {isOpen && (
                            <div className="absolute -bottom-2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                          )}
                          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-gray-900/80 backdrop-blur-md text-white text-[10px] rounded-md whitespace-nowrap border border-white/10 pointer-events-none z-50">
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
