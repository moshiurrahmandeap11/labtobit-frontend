"use client";

import React, { createContext, useContext, useState } from "react";

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

    return (
        <IntroContext.Provider value={{ isIntroDone, setIntroDone }}>
            {children}
        </IntroContext.Provider>
    );
};

export const useIntro = () => useContext(IntroContext);
