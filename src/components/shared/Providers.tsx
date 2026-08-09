"use client";
import React from 'react';
import { IntroProvider } from '@/context/IntroContext';
import IntroAnimation from './IntroAnimation';
import SmoothScroll from './SmoothScroll';
import ServiceWorkerRegister from './ServiceWorkerRegister';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <IntroProvider>
            <SmoothScroll>
                <ServiceWorkerRegister />
                <IntroAnimation />
                {children}
            </SmoothScroll>
        </IntroProvider>
    );
};
