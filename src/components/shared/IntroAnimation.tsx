"use client";

import React, { useEffect } from "react";
import { useIntro } from "@/context/IntroContext";
import { AnimatePresence, motion } from "framer-motion";

const IntroAnimation = () => {
  const { isIntroDone, setIntroDone } = useIntro();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, [setIntroDone]);

  return (
    <AnimatePresence>
      {!isIntroDone && (
        <motion.div
          className="fixed inset-0 z-100 bg-white flex items-center justify-center pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            layoutId="logo"
            className="relative w-64 h-64 md:w-96 md:h-96"
          >
            {/* L Piece (Left) */}
            <motion.div
              initial={{ x: "-100vw" }}
              animate={{ x: 0 }}
              transition={{ duration: 1, ease: "anticipate" }}
              className="absolute inset-0"
            >
              <img
                src="/logo/L.svg"
                alt="Logo L"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* B Piece (Right) */}
            <motion.div
              initial={{ x: "100vw" }}
              animate={{ x: 0 }}
              transition={{ duration: 1, ease: "anticipate" }}
              className="absolute inset-0"
            >
              <img
                src="/logo/B.svg"
                alt="Logo B"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
