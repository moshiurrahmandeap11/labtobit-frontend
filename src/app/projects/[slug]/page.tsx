import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, projects } from '@/data/projects';

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Find next project for bottom navigation
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main className="min-h-screen bg-[#0b100d] text-[#e3f4e5] pt-24 sm:pt-28 pb-16 px-6 sm:px-12 md:px-16 lg:px-20 selection:bg-[#2bf066] selection:text-[#0b100d]">
      <div className="max-w-[1700px] mx-auto w-full flex flex-col gap-12 md:gap-16">



        {/* Main 2-Column Split Hero Layout (Matching User Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-4">
          
          {/* Left Column: Title, Description, Services & Links, CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-10">
            <div className="flex flex-col gap-8">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-normal tracking-tight leading-[1.02] text-[#e3f4e5]">
                {project.title}
              </h1>

              <div className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed space-y-4">
                <p>
                  <span className="font-semibold text-[#2bf066]">{project.client}</span> approached us to create a digital companion experience. Designed to extend the project beyond standard boundaries, the experience gives visitors an interactive way to engage with the work while making it accessible to global audiences.
                </p>
                <p>
                  {project.description}
                </p>
              </div>

              {/* Dual Column: SERVICES & LINKS */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                {/* SERVICES Column */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
                    SERVICES
                  </h4>
                  <ul className="flex flex-col gap-1.5 text-sm text-slate-200 font-normal">
                    {project.deliverables ? (
                      project.deliverables.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))
                    ) : (
                      <>
                        <li>Web Design</li>
                        <li>Web Development</li>
                        <li>3D Design</li>
                        <li>WebGL</li>
                        <li>Animation</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* LINKS Column */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
                    LINKS
                  </h4>
                  <ul className="flex flex-col gap-1.5 text-sm text-slate-200 font-normal">
                    <li>
                      <a 
                        href="#" 
                        className="hover:text-[#2bf066] transition-colors underline decoration-slate-600 underline-offset-4"
                      >
                        {project.client.toLowerCase().replace(/[^a-z0-9]/g, '')}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Launch Project CTA Button */}
            <div className="pt-4">
              <a 
                href="#"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-all cursor-pointer shadow-xl group"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#0b100d] group-hover:scale-125 transition-transform" />
                <span>LAUNCH PROJECT</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-End Rounded Media Preview Box */}
          <div className="lg:col-span-7 w-full">
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#111814] border border-white/10 relative shadow-2xl group">
              <img 
                src={project.heroImage} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Subtle Overlay Controls inside preview box */}
              <div className="absolute top-6 left-6 flex items-center gap-4 text-xs font-medium text-white/80 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span>Overview</span>
                <span>•</span>
                <span>{project.category}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Extended Project Details & Gallery */}
        <div className="pt-16 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
              THE CHALLENGE
            </h3>
            <p className="text-base text-slate-300 leading-relaxed">
              {project.challenge}
            </p>

            {project.stats && project.stats.length > 0 && (
              <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-white/10">
                {project.stats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</span>
                    <span className="text-xl font-bold text-[#2bf066]">{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
              OUR SOLUTION
            </h3>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Visual Gallery Section */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="flex flex-col gap-8 pt-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
              VISUAL GALLERY
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((imgUrl, idx) => (
                <div key={idx} className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#111814] border border-white/10 shadow-lg">
                  <img 
                    src={imgUrl} 
                    alt={`${project.title} gallery image ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Project Footer */}
        <div className="w-full pt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">NEXT PROJECT</p>
            <Link 
              href={`/projects/${nextProject.slug}`} 
              className="text-3xl sm:text-5xl font-medium tracking-tight hover:text-[#2bf066] text-[#e3f4e5] transition-colors"
            >
              {nextProject.title} →
            </Link>
          </div>
          <Link 
            href="/"
            className="px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-colors"
          >
            VIEW ALL WORK
          </Link>
        </div>

      </div>
    </main>
  );
}

