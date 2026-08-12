"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { projects } from "@/data/projects";

interface IPadPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlug: string;
}

export function IPadPreviewModal({ isOpen, onClose, initialSlug }: IPadPreviewModalProps) {
  const [time, setTime] = useState("");
  const [activeApp, setActiveApp] = useState<string | null>(initialSlug);
  const [appUrl, setAppUrl] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initialSlug) {
      if (initialSlug === 'terminal') {
        setAppUrl('terminal');
      } else {
        const p = projects.find(p => p.slug === initialSlug);
        setAppUrl(p?.liveLink || "");
      }
      setActiveApp(initialSlug);
    }
  }, [initialSlug]);

  const openApp = (slug: string) => {
    if (slug === 'terminal') {
      setAppUrl('terminal');
    } else {
      const p = projects.find(p => p.slug === slug);
      setAppUrl(p?.liveLink || "");
    }
    setActiveApp(slug);
  };

  const closeApp = () => {
    setActiveApp(null);
    setAppUrl("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 md:p-10" onClick={onClose}>
      {/* iPad Hardware Frame (Landscape) */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="relative w-full max-w-5xl aspect-4/3 bg-black rounded-4xl md:rounded-5xl border-10 md:border-16 border-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden shrink-0 flex flex-col ring-1 ring-white/10"
      >
        {/* Hardware Buttons */}
        <div className="absolute top-20 -left-2.5 md:-left-4 w-1 h-12 bg-[#2a2a2a] rounded-l-md"></div>
        <div className="absolute top-35 -left-2.5 md:-left-4 w-1 h-12 bg-[#2a2a2a] rounded-l-md"></div>
        <div className="absolute top-20 -right-2.5 md:-right-4 w-1 h-16 bg-[#2a2a2a] rounded-r-md"></div>

        {/* Camera Dot (Landscape Top Center) */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#050505] shadow-[inset_0_0_2px_rgba(255,255,255,0.1)] z-200">
          <div className="absolute inset-0 m-auto w-0.5 h-0.5 bg-blue-600/30 rounded-full" />
        </div>

        {/* iPadOS Full Screen Container */}
        <div
          className="flex-1 w-full relative overflow-hidden bg-black text-white rounded-[22px] md:rounded-4xl"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* iPadOS Status Bar */}
          <div className={`absolute top-0 left-0 right-0 h-8 z-150 flex items-center justify-between px-6 pointer-events-none transition-colors ${activeApp && appUrl !== 'terminal' ? 'text-black' : 'text-white'}`}>
            <div className="font-semibold text-sm drop-shadow-md">{time}</div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 opacity-90 drop-shadow-md">
              {/* Wifi */}
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 14C8.82843 14 9.5 13.3284 9.5 12.5C9.5 11.6716 8.82843 11 8 11C7.17157 11 6.5 11.6716 6.5 12.5C6.5 13.3284 7.17157 14 8 14Z" fill="currentColor" />
                <path d="M3.75736 8.25736C6.10051 5.91421 9.8995 5.91421 12.2426 8.25736" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M0.928932 5.42893C4.83418 1.52369 11.1658 1.52369 15.0711 5.42893" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {/* Battery */}
              <div className="relative flex items-center">
                <div className="w-7 h-3.5 border border-current rounded-sm p-px flex">
                  <div className="w-4/5 h-full bg-current rounded-[1.5px]"></div>
                </div>
                <div className="w-[1.5px] h-2 bg-current rounded-r-sm ml-px"></div>
              </div>
            </div>
          </div>

          {/* Home Screen Grid */}
          <div className="absolute inset-0 pt-16 px-12 pb-32 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-x-6 gap-y-10">
              {projects.map((project) => (
                <div key={project.slug} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => openApp(project.slug)}>
                  <div className={`w-18 h-18 md:w-21 md:h-21 rounded-[20px] md:rounded-3xl shadow-sm overflow-hidden flex items-center justify-center group-active:scale-95 transition-transform bg-[#111814] border border-white/20`}>
                    <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-xs md:text-sm font-medium drop-shadow-md truncate w-full text-center">{project.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Dock */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 h-24 bg-white/20 backdrop-blur-2xl border border-white/20 rounded-4xl flex items-center justify-center gap-4 px-6 shadow-2xl">
            {/* Close Button */}
            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onClose}>
              <div className="w-18 h-18 bg-red-500 rounded-[20px] shadow-sm overflow-hidden flex items-center justify-center group-active:scale-95 transition-transform relative">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
              </div>
            </div>
          </div>

          {/* Active App Full Screen overlay */}
          <AnimatePresence>
            {activeApp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute inset-0 z-100 bg-white flex flex-col"
              >
                {appUrl === 'terminal' ? (
                  <div className="flex-1 w-full bg-[#1e1e1e] pt-12">
                    <IPadTerminal />
                  </div>
                ) : (
                  <div className="flex-1 w-full bg-white pt-8 relative">
                    <iframe
                      src={appUrl}
                      className="w-full h-full border-none"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  </div>
                )}

                {/* Home Indicator (Swipe up to close) */}
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-200 group px-4 py-2"
                  onClick={closeApp}
                >
                  <span className="text-white text-[12px] font-medium bg-black/60 px-3 py-1 rounded-full drop-shadow-md animate-pulse">Click to Home</span>
                  <div className="w-48 h-2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] rounded-full group-hover:scale-105 transition-transform" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Simple iPad Terminal implementation
const IPadTerminal = () => {
  const [history, setHistory] = useState<{ type: 'input' | 'output', text: string }[]>([
    { type: 'output', text: 'Last login: ' + new Date().toString().split(' GMT')[0] + ' on ttys000' }
  ]);
  const [input, setInput] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    let output = `zsh: command not found: ${cmd}`;
    if (cmd === 'help') output = 'Commands: help, whoami, clear, ls';
    if (cmd === 'whoami') output = 'moshiur (ipad)';
    if (cmd === 'clear') { setHistory([]); setInput(''); return; }
    if (cmd === 'ls') output = 'Projects  Desktop  Documents';

    setHistory([...history, { type: 'input', text: input }, { type: 'output', text: output }]);
    setInput('');
  };

  return (
    <div className="w-full h-full text-[#d4d4d4] font-mono text-base p-6 overflow-y-auto pb-10">
      {history.map((line, i) => (
        <div key={i} className="mb-2">
          {line.type === 'input' ? (
            <div className="flex gap-2 text-green-400">
              <span>%</span><span className="text-white">{line.text}</span>
            </div>
          ) : (
            <div className="text-gray-300">{line.text}</div>
          )}
        </div>
      ))}
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-green-400">%</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white p-0 m-0"
          autoFocus
        />
      </form>
    </div>
  );
};
