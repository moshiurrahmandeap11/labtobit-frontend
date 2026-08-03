"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const projects = [
  { id: 1, title: "LUSION V3", subtitle: "Creative Studio", img: "/lusion-placeholder.jpg" },
  { id: 2, title: "ORYZO AI", subtitle: "Generative Intelligence", img: "/lusion-placeholder.jpg" },
  { id: 3, title: "EVERSWAP", subtitle: "DeFi Reimagined", img: "/lusion-placeholder.jpg" },
  { id: 4, title: "LABS", subtitle: "R&D Experiments", img: "/lusion-placeholder.jpg" },
];

export const ShowcaseSection = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]); // Assuming 4 items, -75% will scroll through 3/4 of the width

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Title overlay fixed on the left */}
        <div className="absolute top-[10%] left-4 md:left-12 z-10 mix-blend-difference text-white pointer-events-none">
          <h2 className="text-[10vw] font-black uppercase leading-none tracking-tighter">
            Selected
          </h2>
          <h2 className="text-[10vw] font-black uppercase leading-none tracking-tighter ml-[10vw] text-transparent [-webkit-text-stroke:2px_white]">
            Works
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-[10vw] px-[10vw] items-center">
          {projects.map((project, index) => {
            return <ProjectCard project={project} key={project.id} index={index} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  return (
    <div 
      className="group relative w-[80vw] sm:w-[60vw] md:w-[45vw] flex-shrink-0 cursor-none"
      data-cursor="view"
    >
      <div className="w-full aspect-[4/5] overflow-hidden bg-zinc-900 border border-zinc-800 rounded-lg relative">
        <div className="absolute inset-0 bg-zinc-800 transition-transform duration-1000 group-hover:scale-110 flex items-center justify-center">
           <div className="text-zinc-600 font-mono text-sm tracking-widest uppercase">
              [ 3D Render Placeholder ]
           </div>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="absolute bottom-[-20%] left-[-10%] flex flex-col z-20 pointer-events-none">
        <h3 className="text-[6vw] font-black uppercase tracking-tighter text-white mix-blend-difference group-hover:-translate-y-4 transition-transform duration-500">
          {project.title}
        </h3>
        <p className="text-zinc-400 font-light tracking-widest uppercase text-sm mt-2 mix-blend-difference group-hover:-translate-y-2 transition-transform duration-500 delay-75">
          {project.subtitle}
        </p>
      </div>
    </div>
  );
};
