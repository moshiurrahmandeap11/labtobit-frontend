import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedWorkSection } from "@/components/home/FeaturedWorkSection";
import { CreativeIdeasSection } from "@/components/home/CreativeIdeasSection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { FooterSection } from "@/components/home/FooterSection";
import { CustomCursor } from "@/components/shared/CustomCursor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black cursor-none overflow-x-hidden">
      <CustomCursor />
      <HeroSection />
      <AboutSection />
      <FeaturedWorkSection />
      <CreativeIdeasSection />
      <ShowcaseSection />
      <FooterSection />
    </main>
  );
}
