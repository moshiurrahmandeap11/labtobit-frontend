"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

export const CustomCursor = () => {
  const [cursorState, setCursorState] = useState<"default" | "hover" | "view" | "drag">("default");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotSpringX = useSpring(mouseX, { stiffness: 600, damping: 30, mass: 0.4 });
  const dotSpringY = useSpring(mouseY, { stiffness: 600, damping: 30, mass: 0.4 });

  const ringSpringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.7 });
  const ringSpringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.7 });

  const offset = cursorState === "default" ? 4 : 32;
  const cursorX = useTransform(dotSpringX, (x) => x - offset);
  const cursorY = useTransform(dotSpringY, (y) => y - offset);

  const ringX = useTransform(ringSpringX, (x) => x - 24);
  const ringY = useTransform(ringSpringY, (y) => y - 24);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024;
      if (isTouch) {
        setIsTouchDevice(true);
        return;
      }
    }

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
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

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none z-9999 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
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
        className="fixed top-0 left-0 w-12 h-12 border border-white/30 rounded-full pointer-events-none z-9998"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
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
