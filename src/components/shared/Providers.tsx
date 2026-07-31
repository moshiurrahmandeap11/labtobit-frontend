"use client";
import React from 'react';
import { IntroProvider } from '@/context/IntroContext';
import IntroAnimation from './IntroAnimation';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <IntroProvider>
            <IntroAnimation />
            {children}
        </IntroProvider>
    );
};
