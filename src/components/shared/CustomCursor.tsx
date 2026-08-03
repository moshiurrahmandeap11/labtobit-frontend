"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<"default" | "hover" | "view" | "drag">("default");

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='view']")) {
        setCursorState("view");
      } else if (target.closest("[data-cursor='drag']")) {
        setCursorState("drag");
      } else if (target.closest("a, button, [role='button'], .cursor-pointer")) {
        setCursorState("hover");
      } else {
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - (cursorState === "default" ? 4 : 32),
          y: mousePosition.y - (cursorState === "default" ? 4 : 32),
          width: cursorState === "default" ? 8 : 64,
          height: cursorState === "default" ? 8 : 64,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <motion.div 
          className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden"
          animate={{ scale: cursorState === "default" ? 1 : 1 }}
        >
           <AnimatePresence mode="wait">
            {cursorState === "view" && (
              <motion.span
                key="view"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="text-black text-[10px] font-bold uppercase tracking-widest"
              >
                View
              </motion.span>
            )}
            {cursorState === "drag" && (
              <motion.span
                key="drag"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="text-black text-[10px] font-bold uppercase tracking-widest"
              >
                Drag
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-white/30 rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: cursorState === "hover" ? 1.5 : (cursorState !== "default" ? 0 : 1),
          opacity: cursorState === "hover" ? 0.5 : (cursorState !== "default" ? 0 : 1),
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
          mass: 0.8,
        }}
      />
    </>
  );
};
