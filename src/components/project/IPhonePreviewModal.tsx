"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Project, projects } from "@/data/projects";

interface IPhonePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlug: string;
}

export function IPhonePreviewModal({ isOpen, onClose, initialSlug }: IPhonePreviewModalProps) {
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
    <div className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      {/* iPhone Hardware Frame */}
      <motion.div 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="relative w-full max-w-90 h-195 max-h-[95vh] bg-black rounded-[44px] border-[6px] border-[#222] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 flex flex-col ring-1 ring-white/10"
      >
        {/* Hardware Buttons */}
        <div className="absolute top-25 -left-1.75 w-1 h-8 bg-[#333] rounded-l-md"></div>
        <div className="absolute top-37.5 -left-1.75 w-1 h-12 bg-[#333] rounded-l-md"></div>
        <div className="absolute top-52.5 -left-1.75 w-1 h-12 bg-[#333] rounded-l-md"></div>
        <div className="absolute top-37.5 -right-1.75 w-1 h-16 bg-[#333] rounded-r-md"></div>

        {/* iOS Full Screen Container */}
        <div 
          className="flex-1 w-full relative overflow-hidden bg-black text-white rounded-[38px]"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* iOS Status Bar */}
        <div className={`absolute top-0 left-0 right-0 h-12 z-150 flex items-center justify-between px-6 pointer-events-none transition-colors ${activeApp && appUrl !== 'terminal' ? 'text-black' : 'text-white'}`}>
          <div className="font-semibold text-sm drop-shadow-md">{time}</div>
          
          {/* Dynamic Island (Fake) */}
          <div className="w-24 h-7 bg-black rounded-full shadow-lg absolute left-1/2 -translate-x-1/2 top-2"></div>
          
          {/* Right Icons */}
          <div className="flex items-center gap-1.5 opacity-90 drop-shadow-md">
            {/* Signal */}
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="10" width="3" height="4" rx="1" fill="currentColor"/>
              <rect x="4" y="7" width="3" height="7" rx="1" fill="currentColor"/>
              <rect x="8" y="4" width="3" height="10" rx="1" fill="currentColor"/>
              <rect x="12" width="3" height="14" rx="1" fill="currentColor"/>
            </svg>
            {/* Wifi */}
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 14C8.82843 14 9.5 13.3284 9.5 12.5C9.5 11.6716 8.82843 11 8 11C7.17157 11 6.5 11.6716 6.5 12.5C6.5 13.3284 7.17157 14 8 14Z" fill="currentColor"/>
              <path d="M3.75736 8.25736C6.10051 5.91421 9.8995 5.91421 12.2426 8.25736" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M0.928932 5.42893C4.83418 1.52369 11.1658 1.52369 15.0711 5.42893" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {/* Battery */}
            <div className="relative flex items-center">
              <div className="w-6 h-3 border border-current rounded-[3px] p-px flex">
                <div className="w-4/5 h-full bg-current rounded-[1px]"></div>
              </div>
              <div className="w-px h-1.5 bg-current rounded-r-sm ml-px"></div>
            </div>
          </div>
        </div>

        {/* Home Screen Grid */}
        <div className="absolute inset-0 pt-20 px-6 pb-28 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            {projects.map((project) => (
              <div key={project.slug} className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => openApp(project.slug)}>
                <div className={`w-15 h-15 bg-[#111814] rounded-2xl shadow-sm overflow-hidden flex items-center justify-center group-active:scale-95 transition-transform border border-white/20`}>
                  <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <span className="text-white text-[11px] font-medium drop-shadow-md truncate w-full text-center">{project.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dock Container */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-max h-24 bg-white/20 backdrop-blur-2xl border border-white/20 rounded-4xl flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onClose}>
            <div className="w-15 h-15 bg-red-500 rounded-2xl shadow-sm overflow-hidden flex items-center justify-center group-active:scale-95 transition-transform relative">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
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
                   {/* Mobile Terminal */}
                   <MobileTerminal />
                </div>
              ) : appUrl === 'safari' || appUrl === '' ? (
                 <div className="flex-1 w-full flex flex-col items-center justify-center bg-gray-100">
                    <span className="text-gray-500">Coming soon...</span>
                 </div>
              ) : (
                <div className="flex-1 w-full bg-white pt-10 relative">
                  <iframe 
                    src={appUrl} 
                    className="w-full h-full border-none"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                  {/* Safari Toolbar at bottom (iOS 15+) */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-t border-gray-200 flex flex-col items-center justify-start pt-3">
                    <div className="w-[90%] h-10 bg-gray-100 rounded-lg flex items-center justify-between px-4 text-sm text-gray-800">
                      <span className="opacity-40">Aa</span>
                      <span className="font-semibold truncate max-w-50 text-center">{appUrl.replace('https://', '')}</span>
                      <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21L21.5 8"></path></svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Home Bar (Swipe up to close) */}
              <div 
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-200 group px-4 py-2"
                onClick={closeApp}
              >
                <span className="text-white text-[10px] font-medium bg-black/60 px-2 py-0.5 rounded-full drop-shadow-md animate-pulse">Click to Home</span>
                <div className="w-32 h-2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] rounded-full group-hover:scale-105 transition-transform" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </motion.div>
    </div>
  );
}

// Simple Mobile Terminal implementation
const MobileTerminal = () => {
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
    if (cmd === 'whoami') output = 'moshiur (mobile)';
    if (cmd === 'clear') { setHistory([]); setInput(''); return; }
    if (cmd === 'ls') output = 'Projects  MobileApp';

    setHistory([...history, { type: 'input', text: input }, { type: 'output', text: output }]);
    setInput('');
  };

  return (
    <div className="w-full h-full text-[#d4d4d4] font-mono text-[11px] p-4 overflow-y-auto pb-10">
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
