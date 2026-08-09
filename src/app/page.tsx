import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedWorkSection } from "@/components/home/FeaturedWorkSection";
import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { CtaSection } from "@/components/home/CtaSection";
import { FooterSection } from "@/components/home/FooterSection";
import { CustomCursor } from "@/components/shared/CustomCursor";
import IntroAnimation from "@/components/shared/IntroAnimation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black cursor-none overflow-x-hidden">
      <CustomCursor />
      <IntroAnimation />
      <HeroSection />
      <AboutSection />
      <FeaturedWorkSection />
      <CaseStudiesSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
