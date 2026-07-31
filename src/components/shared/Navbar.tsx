"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntro } from '@/context/IntroContext';
import Image from 'next/image';

const MatrixText = ({ text }: { text: string }) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const [scrambled, setScrambled] = useState(text);
    const [isHovered, setIsHovered] = useState(false);
    
    useEffect(() => {
        if (!isHovered) {
            setScrambled(text);
            return;
        }
        
        let iteration = 0;
        let interval: NodeJS.Timeout;
        
        const scramble = () => {
            setScrambled(() => 
                text.split("").map((_, index) => {
                    if (index < iteration) return text[index];
                    return letters[Math.floor(Math.random() * letters.length)];
                }).join("")
            );
            
            if (iteration >= text.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3;
        };
        
        interval = setInterval(scramble, 30);
        return () => clearInterval(interval);
    }, [isHovered, text]);

    return (
        <span 
            className="cursor-pointer uppercase tracking-[0.2em] text-sm font-semibold transition-all duration-300 hover:text-cyan-400"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {scrambled}
        </span>
    );
};

const Logo = () => (
    <motion.div layoutId="logo" className="relative w-12 h-12 flex items-center justify-center cursor-pointer group">
        <div 
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-x-1 group-hover:-translate-y-1"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 65%)' }}
        >
            <Image src="/L-full.png" alt="Logo Top" fill className="object-contain" />
        </div>
        <div 
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110 group-hover:translate-x-1 group-hover:translate-y-1"
            style={{ clipPath: 'polygon(0 65%, 100% 45%, 100% 100%, 0 100%)' }}
        >
            <Image src="/L-full.png" alt="Logo Bottom" fill className="object-contain" />
        </div>
    </motion.div>
);

const Navbar: React.FC = () => {
    const { isIntroDone } = useIntro();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-6 bg-transparent text-white mix-blend-difference">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-center gap-16">
                    <AnimatePresence>
                        {isIntroDone && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center gap-12"
                            >
                                <MatrixText text="Home" />
                                <MatrixText text="Works" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Logo in Center */}
                    <div className="px-4 min-w-[48px] flex justify-center">
                        {isIntroDone && <Logo />}
                    </div>

                    <AnimatePresence>
                        {isIntroDone && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center gap-12"
                            >
                                <MatrixText text="Services" />
                                <MatrixText text="About Us" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;