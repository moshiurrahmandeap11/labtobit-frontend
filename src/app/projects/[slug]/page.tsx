import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, projects } from '@/data/projects';
import { ProjectHeroMorph } from '@/components/project/ProjectHeroMorph';
import { NextProjectLink } from '@/components/project/NextProjectLink';

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

        {/* Shared Element Hero Morph Container */}
        <ProjectHeroMorph project={project}>
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

          {/* Next Project Footer */}
          <div className="w-full pt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">NEXT PROJECT</p>
              <NextProjectLink slug={nextProject.slug} title={nextProject.title} />
            </div>
            <Link 
              href="/"
              className="px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-colors"
            >
              VIEW ALL WORK
            </Link>
          </div>
        </ProjectHeroMorph>

      </div>
    </main>
  );
}


