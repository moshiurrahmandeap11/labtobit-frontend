"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntro } from '@/context/IntroContext';
import Image from 'next/image';

const IntroAnimation = () => {
    const { isIntroDone, setIntroDone } = useIntro();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIntroDone(true);
        }, 2000); // 2 seconds animation before navbar transitions
        return () => clearTimeout(timer);
    }, [setIntroDone]);

    return (
        <AnimatePresence>
            {!isIntroDone && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                >
                    <motion.div layoutId="logo" className="relative w-32 h-32">
                        {/* Upper Piece */}
                        <motion.div
                            initial={{ y: "-100vh" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, ease: "anticipate" }}
                            className="absolute inset-0"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 65%)' }}
                        >
                            <Image src="/L-full.png" alt="Logo Top" fill className="object-contain" />
                        </motion.div>

                        {/* Lower Piece */}
                        <motion.div
                            initial={{ y: "100vh" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, ease: "anticipate" }}
                            className="absolute inset-0"
                            style={{ clipPath: 'polygon(0 65%, 100% 45%, 100% 100%, 0 100%)' }}
                        >
                            <Image src="/L-full.png" alt="Logo Bottom" fill className="object-contain" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IntroAnimation;
