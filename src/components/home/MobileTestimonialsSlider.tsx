'use client';

import React from 'react';

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  positionClass?: string;
}

export const MobileTestimonialsSlider = ({ testimonials }: { testimonials: Testimonial[] }) => {
  return (
    <div className="w-full relative pb-4">
      {/* 
        Using -mx-4 to allow the slider to touch the edges on mobile,
        while maintaining the visual padding via px-4 inside the scroll container.
      */}
      <div 
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory px-4 pb-6 scrollbar-hide -mx-4" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((test) => (
          <div
            key={test.id}
            className="snap-center shrink-0 w-[80vw] sm:w-[320px] bg-[#0A0D14]/[0.02] border border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-white">
                <img
                  src={test.avatar}
                  alt={test.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[#0A0D14] font-bold text-[13px]">{test.author}</h4>
                <p className="text-[10px] text-blue-600 uppercase tracking-wider font-semibold mt-0.5">
                  {test.role}
                </p>
              </div>
            </div>
            
            <p className="text-[#0A0D14] font-medium leading-relaxed text-[15px]">
              &ldquo;{test.quote}&rdquo;
            </p>
          </div>
        ))}
      </div>
      
      {/* Subtle Swipe Indicator */}
      <div className="flex justify-center mt-2 opacity-50">
         <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Swipe
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
         </span>
      </div>
      
      {/* Style block to ensure webkit scrollbar is hidden */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </div>
  );
};
