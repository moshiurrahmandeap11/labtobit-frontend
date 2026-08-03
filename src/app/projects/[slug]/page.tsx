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
    <main className="min-h-screen bg-[#f4f4f6] text-[#0A0D14] py-16 px-6 sm:px-12 md:px-16 lg:px-24 selection:bg-[#0A0D14] selection:text-white">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-16 md:gap-24">
        
        {/* Navigation Bar */}
        <div className="w-full flex justify-between items-center pt-4 pb-8 border-b border-gray-300">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 text-sm font-semibold tracking-wider uppercase text-slate-700 hover:text-black transition-colors group"
          >
            <span className="text-xl transition-transform duration-300 group-hover:-translate-x-1.5">←</span>
            <span>BACK TO HOME</span>
          </Link>
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            PROJECT SHOWCASE
          </span>
        </div>

        {/* Project Header */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-gray-200 text-slate-700 px-3.5 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-medium tracking-tight leading-[0.95] text-[#0A0D14]">
            {project.title}
          </h1>

          <p className="text-lg sm:text-2xl md:text-3xl text-slate-700 max-w-4xl font-normal leading-relaxed">
            {project.subtitle}
          </p>
        </div>

        {/* Project Metadata Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-gray-300">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">CLIENT</h4>
            <p className="text-base sm:text-lg font-medium text-[#0A0D14]">{project.client}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">YEAR</h4>
            <p className="text-base sm:text-lg font-medium text-[#0A0D14]">{project.year}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">SERVICES</h4>
            <p className="text-base sm:text-lg font-medium text-[#0A0D14]">{project.category}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">ROLE</h4>
            <p className="text-base sm:text-lg font-medium text-[#0A0D14]">{project.role}</p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-gray-200 relative shadow-xl">
          <img 
            src={project.heroImage} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overview & Core Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-8">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">Project Summary</h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {project.description}
            </p>

            {project.stats && project.stats.length > 0 && (
              <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-gray-300">
                {project.stats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
                    <span className="text-2xl font-bold text-[#0A0D14]">{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">THE OVERVIEW</h3>
              <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-normal">
                {project.overview}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">THE CHALLENGE</h3>
              <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-normal">
                {project.challenge}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">OUR SOLUTION</h3>
              <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-normal">
                {project.solution}
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">DELIVERABLES</h3>
              <div className="flex flex-wrap gap-3">
                {project.deliverables.map((item, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white rounded-lg text-sm font-semibold border border-gray-200 text-slate-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="flex flex-col gap-8 pt-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">VISUAL GALLERY</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((imgUrl, idx) => (
                <div key={idx} className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-200 shadow-md">
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
        <div className="w-full pt-20 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">NEXT PROJECT</p>
            <Link 
              href={`/projects/${nextProject.slug}`} 
              className="text-4xl sm:text-6xl font-medium tracking-tight hover:underline text-[#0A0D14]"
            >
              {nextProject.title} →
            </Link>
          </div>
          <Link 
            href="/"
            className="px-8 py-4 rounded-full bg-[#0A0D14] text-white font-semibold text-xs tracking-wider uppercase hover:bg-blue-600 transition-colors"
          >
            VIEW ALL WORK
          </Link>
        </div>

      </div>
    </main>
  );
}
