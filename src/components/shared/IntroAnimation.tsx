"use client";
import { useIntro } from "@/context/IntroContext";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

const IntroAnimation = () => {
  const { isIntroDone, setIntroDone } = useIntro();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 2000); //
    // 2 seconds animation before navbar transitions
    return () => clearTimeout(timer);
  }, [setIntroDone]);

  return (
    <AnimatePresence>
      {!isIntroDone && (
        <motion.div
          className="fixed inset-0 z-100 bg-white flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
        >
          <motion.div
            layoutId="logo"
            className="relative w-64 h-64 md:w-96 md:h-96"
          >
            {/* Top-Left Piece */}
            <motion.div
              initial={{ x: "-100vw", y: "-100vh" }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 1, ease: "anticipate" }}
              className="absolute inset-0"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            >
              <Image
                src="/labtobit-logo.png"
                alt="Logo Top-Left"
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Bottom-Right Piece */}
            <motion.div
              initial={{ x: "100vw", y: "100vh" }}
              animate={{ x: 0, y: 0 }}
              transition={{ duration: 1, ease: "anticipate" }}
              className="absolute inset-0"
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              }}
            >
              <Image
                src="/labtobit-logo.png"
                alt="Logo Bottom-Right"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
