import { CustomScrollbar } from "@/components/shared/CustomScrollbar";
import Navbar from "@/components/shared/Navbar";
import { Providers } from "@/components/shared/Providers";
import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { DisableRightClick } from "@/components/shared/DisableRightClick";
import Script from "next/script";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Labtobit Studio — Web Development Agency",
  description:
    "Custom web development, digital visual storytelling, and high-end agency experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <DisableRightClick />
          <Navbar />
          <CustomScrollbar />
          {children}
        </Providers>
        <Script
          src="https://labto.ahsanul.dev/widget.js"
          data-api-key="aiw_live_0c17c3095b81ffaef09cdbb82ad5267cab95ccee996417b1"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
