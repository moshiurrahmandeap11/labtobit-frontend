"use client";
import React, { useState, useEffect } from 'react';

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
    <div className="flex items-center justify-center cursor-pointer group">
        <svg 
            width="48" 
            height="48" 
            viewBox="0 0 40 40" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-500 group-hover:scale-110 group-hover:text-cyan-400"
        >
            {/* Top part of vertical stem */}
            <rect x="12" y="4" width="8" height="12" />
            
            {/* Bottom part of vertical stem + horizontal arm */}
            {/* Creates a horizontal cut between y=16 and y=22 */}
            <path d="M12 22 v 14 h 20 v -8 H20 v -6 Z" />
        </svg>
    </div>
);

const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-6 bg-transparent text-white mix-blend-difference">
            <div className="max-w-7xl mx-auto px-6">
                {/* Navbar Container */}
                <div className="flex items-center justify-center gap-16">
                    {/* Left Links */}
                    <div className="flex items-center gap-12">
                        <MatrixText text="Home" />
                        <MatrixText text="Works" />
                    </div>

                    {/* Logo in Center */}
                    <div className="px-4">
                        <Logo />
                    </div>

                    {/* Right Links */}
                    <div className="flex items-center gap-12">
                        <MatrixText text="Services" />
                        <MatrixText text="About Us" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;