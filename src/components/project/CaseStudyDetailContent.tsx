'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CaseStudy } from '@/data/casestudies';

interface CaseStudyDetailContentProps {
  caseStudy: CaseStudy;
  nextCaseStudy: CaseStudy;
}

export const CaseStudyDetailContent: React.FC<CaseStudyDetailContentProps> = ({
  caseStudy,
  nextCaseStudy,
}) => {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const handleDownload = (fileName: string) => {
    setDownloadingFile(fileName);
    setTimeout(() => {
      setDownloadingFile(null);
      alert(`Secure download initialized for: ${fileName} (Mock Download Link)`);
    }, 1500);
  };

  return (
    <div id="research-docs-section" className="flex flex-col gap-16 md:gap-24 w-full pt-16 border-t border-white/10">
      
      {/* 1. Research & Discovery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
            Phase 1: Research & Discovery
          </h3>
          <p className="text-base text-slate-300 leading-relaxed">
            {caseStudy.researchNotes}
          </p>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* User Personas */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
              Target User Personas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.userPersonas.map((persona, index) => (
                <div 
                  key={index}
                  className="bg-zinc-950/80 border border-white/10 p-6 rounded-2xl flex flex-col gap-4 shadow-lg"
                >
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-900 border border-white/10 relative">
                      <img 
                        src={persona.avatar} 
                        alt={persona.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-md font-semibold text-white">{persona.name}</h5>
                      <p className="text-xs text-[#2bf066] font-mono">{persona.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">User Needs</span>
                      <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                        {persona.needs.map((need, idx) => <li key={idx}>{need}</li>)}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pain Points</span>
                      <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                        {persona.painPoints.map((pain, idx) => <li key={idx}>{pain}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Analysis Table */}
          <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
            <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
              Competitor Market Analysis
            </h4>
            <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/40">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-zinc-950">
                    <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider">Competitor</th>
                    <th className="p-4 font-semibold text-[#2bf066] uppercase tracking-wider">Unfair Advantage</th>
                    <th className="p-4 font-semibold text-red-400 uppercase tracking-wider">Discovered Weakness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {caseStudy.competitorAnalysis.map((item, index) => (
                    <tr key={index} className="hover:bg-white/2 transition-colors">
                      <td className="p-4 font-medium text-white">{item.competitor}</td>
                      <td className="p-4 text-slate-300 leading-relaxed">{item.advantage}</td>
                      <td className="p-4 text-slate-400 leading-relaxed">{item.weakness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 2. System Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-12 border-t border-white/10">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
            Phase 2: Tech Architecture
          </h3>
          <p className="text-base text-slate-300 leading-relaxed">
            {caseStudy.architectureOverview}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed pt-2">
            <strong>Tech Stack Decisions:</strong> {caseStudy.techStackReasoning}
          </p>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
            Platform System Nodes
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudy.systemNodes.map((node, index) => (
              <div 
                key={index} 
                className="bg-zinc-900/60 border border-white/10 p-5 rounded-2xl flex flex-col gap-3 shadow-md relative group hover:border-[#2bf066]/30 transition-colors"
              >
                <div className="absolute top-4 right-4 text-[10px] font-mono text-[#2bf066] bg-[#2bf066]/10 px-2 py-0.5 rounded border border-[#2bf066]/20">
                  Node 0{index + 1}
                </div>
                <h5 className="text-md font-semibold text-white pr-10">{node.name}</h5>
                <p className="text-xs text-slate-400 leading-normal">{node.description}</p>
                <div className="text-[10px] font-mono text-zinc-500 mt-2 pt-2 border-t border-white/5">
                  Tech: {node.technology}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Wireframes & Visual Blueprints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-12 border-t border-white/10">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
            Phase 3: Design wireframes
          </h3>
          <p className="text-base text-slate-300 leading-relaxed">
            {caseStudy.wireframeOverview}
          </p>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {caseStudy.wireframes.map((imgUrl, index) => (
              <div 
                key={index}
                className="w-full aspect-4/3 rounded-4xl overflow-hidden bg-zinc-950 border border-white/10 shadow-lg relative group"
              >
                <img 
                  src={imgUrl} 
                  alt={`${caseStudy.title} layout blueprint ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  Blueprint {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Timeline & File Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-12 border-t border-white/10">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
            Phase 4: Timeline & Deliverables
          </h3>
          <p className="text-base text-slate-300 leading-relaxed">
            Attached below are the operational plans, database schemas, and Figma prototypes generated during this case study.
          </p>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Gantt Timeline Checklist */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
              Gantt Implementation Progress
            </h4>
            <div className="flex flex-col gap-3.5">
              {caseStudy.ganttTimeline.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between border-b border-white/5 pb-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === "Completed" ? "bg-[#2bf066]" : (item.status === "In Progress" ? "bg-amber-400" : "bg-zinc-600")
                    }`} />
                    <span className="font-medium text-white">{item.phase}</span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-400 font-mono">
                    <span>{item.duration}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${
                      item.status === "Completed" ? "bg-[#2bf066]/10 text-[#2bf066] border border-[#2bf066]/20" : (item.status === "In Progress" ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700/50")
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure File Downloads */}
          <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
            <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
              Secure Document Attachments
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudy.attachments.map((file, index) => {
                const isThisDownloading = downloadingFile === file.name;
                return (
                  <div 
                    key={index}
                    className="p-5 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col gap-4 hover:border-white/20 transition-colors shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold tracking-widest text-[#2bf066] uppercase bg-[#2bf066]/5 px-2 py-0.5 rounded border border-[#2bf066]/10 self-start">
                          {file.type}
                        </span>
                        <h5 className="text-sm font-semibold text-white mt-1.5">{file.name}</h5>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">{file.size}</span>
                    </div>

                    <button
                      onClick={() => handleDownload(file.name)}
                      disabled={downloadingFile !== null}
                      className={`w-full py-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all ${
                        isThisDownloading
                          ? "border-[#2bf066] bg-[#2bf066]/10 text-[#2bf066] cursor-wait"
                          : "border-white/20 hover:border-white hover:bg-white/5 text-white cursor-pointer"
                      }`}
                    >
                      {isThisDownloading ? (
                        <>
                          <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                          <span>Initiating Download...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9m8-1-4 4m0 0L4 8m4 4V2"/>
                          </svg>
                          <span>SECURE DOWNLOAD</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Next Case Study Navigation Footer */}
      <div className="w-full pt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            NEXT CASE STUDY
          </p>
          <Link
            href={`/casestudies/${nextCaseStudy.slug}`}
            className="text-3xl sm:text-5xl font-medium tracking-tight hover:text-[#2bf066] text-[#e3f4e5] transition-colors"
          >
            {nextCaseStudy.title} →
          </Link>
        </div>
        
        <Link
          href="/"
          className="px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-all cursor-pointer shadow-xl"
        >
          VIEW ALL CASES
        </Link>
      </div>
    </div>
  );
};
