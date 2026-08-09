"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type IntroContextType = {
    isIntroDone: boolean;
    setIntroDone: (val: boolean) => void;
};

const IntroContext = createContext<IntroContextType>({
    isIntroDone: false,
    setIntroDone: () => {},
});

export const IntroProvider = ({ children }: { children: React.ReactNode }) => {
    const [isIntroDone, setIntroDone] = useState(false);

    useEffect(() => {
        const prefetchAssets = async () => {
            // High-priority static assets (logo, testimonial avatars)
            const imageUrls = [
                "/labtobit-logo.png",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
            ];

            // 1. Prefetch images in parallel using standard browser preloading
            imageUrls.forEach((url) => {
                const img = new globalThis.Image();
                img.src = url;
            });

            // 2. Prefetch the first 3MB of the core about video to populate Range Cache
            try {
                await fetch("/about_video.mp4", {
                    headers: {
                        Range: "bytes=0-3145728", // First 3MB
                    },
                });
                console.log("Background prefetching for video range 0-3MB completed.");
            } catch (err) {
                console.warn("Unable to prefetch video segment:", err);
            }
        };

        // Delay prefetching slightly to allow primary resources and SW registration to complete
        const timer = setTimeout(prefetchAssets, 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <IntroContext.Provider value={{ isIntroDone, setIntroDone }}>
            {children}
        </IntroContext.Provider>
    );
};

export const useIntro = () => useContext(IntroContext);
