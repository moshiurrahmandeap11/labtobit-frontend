import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Providers } from "@/components/shared/Providers";
import { CustomScrollbar } from "@/components/shared/CustomScrollbar";

import { DisableRightClick } from "@/components/shared/DisableRightClick";

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
  title: "Labtobit Studio — Award Winning 3D & Web Agency",
  description: "Immersive 3D web development, digital visual storytelling, and high-end agency experiences.",
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
      </body>
    </html>
  );
}
