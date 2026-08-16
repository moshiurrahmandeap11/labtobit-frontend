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
          data-api-key="aiw_live_aa1835ca624a4711c0e0f6400c570d9d37fc9ca1d37866f8"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
