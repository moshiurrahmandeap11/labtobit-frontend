import React from 'react';
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, caseStudies } from '@/data/casestudies';
import { CaseStudyHeroMorph } from '@/components/project/CaseStudyHeroMorph';
import { CaseStudyDetailContent } from '@/components/project/CaseStudyDetailContent';

export async function generateStaticParams() {
  return caseStudies.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  // Find next case study for bottom navigation (loop cycle)
  const currentIndex = caseStudies.findIndex((c) => c.slug === slug);
  const nextCaseStudy = caseStudies[(currentIndex + 1) % caseStudies.length];

  return (
    <main className="min-h-screen bg-[#0b100d] text-[#e3f4e5] pt-24 sm:pt-28 pb-16 px-6 sm:px-12 md:px-16 lg:px-20 selection:bg-[#2bf066] selection:text-[#0b100d]">
      <div className="max-w-[1700px] mx-auto w-full">
        <CaseStudyHeroMorph caseStudy={caseStudy}>
          <CaseStudyDetailContent caseStudy={caseStudy} nextCaseStudy={nextCaseStudy} />
        </CaseStudyHeroMorph>
      </div>
    </main>
  );
}
