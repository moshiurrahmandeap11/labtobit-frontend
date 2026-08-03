"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  // Example text split into lines for reveal
  const lines = [
    "We are a digital",
    "creative studio",
    "blurring the line",
    "between art and",
    "technology."
  ];

  return (
    <section 
      ref={containerRef} 
      className="py-[20vh] px-4 sm:px-12 w-full bg-black text-white min-h-[120vh] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-start gap-4">
        {lines.map((line, i) => {
          // Calculate opacity for each line based on scroll progress
          const start = i * 0.15;
          const end = start + 0.15;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const y = useTransform(scrollYProgress, [start, end], [50, 0]);

          return (
            <div key={i} className="overflow-hidden">
              <motion.h2
                style={{ opacity, y }}
                className="text-[8vw] md:text-[6vw] font-black uppercase leading-[0.85] tracking-tight"
              >
                {line}
              </motion.h2>
            </div>
          );
        })}
      </div>
    </section>
  );
};
