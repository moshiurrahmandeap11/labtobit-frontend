import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { FeaturedWorkSection } from "@/components/home/FeaturedWorkSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaSection } from "@/components/home/CtaSection";
import { FooterSection } from "@/components/home/FooterSection";
import { CustomCursor } from "@/components/shared/CustomCursor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black cursor-none overflow-x-hidden">
      <CustomCursor />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <Suspense fallback={null}>
        <FeaturedWorkSection />
      </Suspense>
      <Suspense fallback={null}>
        <ProductsSection />
      </Suspense>
      <Suspense fallback={null}>
        <CaseStudiesSection />
      </Suspense>
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
