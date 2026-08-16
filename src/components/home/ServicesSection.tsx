"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/shared/RevealText";
import Button from "@/components/shared/Button";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
}

const servicesData: Service[] = [
  {
    id: "web-development",
    number: "01",
    title: "Web Development",
    description:
      "We architect high-performance, scalable web applications and SaaS platforms. Utilizing React, Next.js, Express, and NestJS, we build rapid, responsive digital solutions designed for longevity.",
  },
  {
    id: "dashboards-erp",
    number: "02",
    title: "Dashboards & ERP Systems",
    description:
      "Tailored administrative dashboards, automated ERP software, and high-density analytics platforms. We translate complex data streams into intuitive operational tools for real-time decision making.",
  },
  {
    id: "saas-products",
    number: "03",
    title: "SaaS Products",
    description:
      "End-to-end multi-tenant SaaS architecture, subscription workflows, and cloud-native backend systems. We turn software concepts into market-ready, revenue-generating SaaS platforms.",
  },
  {
    id: "ecommerce-solutions",
    number: "04",
    title: "E-Commerce & Digital Commerce",
    description:
      "High-converting headless storefronts, custom checkout integration, and automated inventory pipelines. Engineered for lightning-fast page speeds and seamless multi-channel selling.",
  },
];

const ServiceCard = ({ service }: { service: Service }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only enable mouse entry hover effect on devices supporting hover pointers
    if (typeof window !== "undefined" && window.matchMedia && !window.matchMedia("(hover: hover)").matches) {
      return;
    }
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`service-card-item relative bg-white border rounded-3xl sm:rounded-4xl p-8 sm:p-12 flex flex-col justify-between overflow-hidden cursor-default transition-[border-color] duration-500 ${
        isHovered ? "border-[#0A0D14]" : "border-slate-200/80"
      }`}
    >
      {/* Perfect Round Circle Expansion from Cursor Entry Point */}
      <div
        className="pointer-events-none absolute w-[2400px] h-[2400px] rounded-full bg-[#0A0D14] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] z-0"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovered ? 1 : 0})`,
        }}
      />

      {/* Relative z-10 Content Layer */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        {/* Top Row: Large Soft Index Number */}
        <div className="flex items-center w-full mb-10">
          <span
            className={`text-5xl sm:text-6xl md:text-7xl font-mono font-extralight transition-colors duration-500 tracking-tighter select-none ${
              isHovered ? "text-zinc-600" : "text-slate-300/80"
            }`}
          >
            {service.number}
          </span>
        </div>

        {/* Title & Body Description */}
        <div className="flex flex-col gap-4">
          <h3
            className={`text-3xl sm:text-4xl font-medium tracking-tight transition-colors duration-500 ${
              isHovered ? "text-white" : "text-[#0A0D14]"
            }`}
          >
            {service.title}
          </h3>
          <p
            className={`text-base sm:text-lg leading-relaxed font-normal transition-colors duration-500 ${
              isHovered ? "text-zinc-300" : "text-slate-600"
            }`}
          >
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ServicesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".service-card-item");
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power2.out",
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative w-full bg-[#F3F4F9] text-[#0A0D14] py-28 sm:py-36 px-6 sm:px-12 md:px-16 lg:px-20 overflow-hidden border-b border-gray-200"
    >
      <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-16 sm:gap-24">
        {/* Section Header */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-300 pb-16">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest text-slate-500 uppercase">
              Capabilities & Offerings
            </span>
            <h2 className="text-[12vw] lg:text-[7vw] leading-[0.9] tracking-tight font-medium text-[#0A0D14] whitespace-nowrap">
              <RevealText>Our Services</RevealText>
            </h2>
          </div>

          <div className="text-sm sm:text-base text-slate-700 max-w-md font-normal leading-relaxed">
            <RevealText>
              End-to-end digital engineering and interactive design services designed to transform business vision into high-performing custom web products.
            </RevealText>
          </div>
        </div>

        {/* Directional Wave Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="w-full bg-[#0A0D14] text-white rounded-3xl sm:rounded-4xl p-10 sm:p-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">
              Need a custom tailored solution?
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base">
              Whether building an enterprise dashboard or a custom web app from scratch, our agency experts are ready to engineer it.
            </p>
          </div>

          <Button
            href="mailto:hello@labtobit.com"
            variant="outline"
            animatedHover
            className="px-7 py-3.5 text-white border-white/20 hover:bg-white hover:text-[#0A0D14]"
          >
            START A PROJECT
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
