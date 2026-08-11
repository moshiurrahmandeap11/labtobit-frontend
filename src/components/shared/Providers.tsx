"use client";
import React from 'react';
import { IntroProvider } from '@/context/IntroContext';
import IntroAnimation from './IntroAnimation';
import SmoothScroll from './SmoothScroll';


export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <IntroProvider>
            <SmoothScroll>

                <IntroAnimation />
                {children}
            </SmoothScroll>
        </IntroProvider>
    );
};
