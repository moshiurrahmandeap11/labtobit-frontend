export const FeaturedWorkSection = () => {
  return (
    <section className="relative z-10 w-full bg-gradient-to-b from-[#e3ebf5] via-[#dbe5f2] to-[#d3dfe9] text-[#0A0D14] flex flex-col justify-center items-center py-20 px-6 sm:px-12 md:px-16">
      <div className="relative max-w-7xl mx-auto w-full flex flex-col justify-between items-start space-y-16">
        {/* Massive Typography */}
        <div className="w-full flex flex-col select-none">
          <h1 className="text-[12vw] sm:text-[11vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.85] text-[#0A0D14]">
            FEATURED
          </h1>
          <h1 className="text-[12vw] sm:text-[11vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.85] text-[#0A0D14] sm:ml-[8vw]">
            WORK
          </h1>
        </div>

        {/* Bottom Right Description Paragraph */}
        <div className="w-full flex justify-end pt-8">
          <p className="text-slate-700 font-medium text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm text-left leading-relaxed">
            Award-winning design & development studio building websites, activations,
            and digital experiences that make people stop scrolling.
          </p>
        </div>
      </div>
    </section>
  );
};
