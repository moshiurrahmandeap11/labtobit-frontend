const projects = [
  { id: 1, title: "LUSION V3", subtitle: "Creative Studio" },
  { id: 2, title: "ORYZO AI", subtitle: "Generative Intelligence" },
  { id: 3, title: "EVERSWAP", subtitle: "DeFi Reimagined" },
  { id: 4, title: "LABS", subtitle: "R&D Experiments" },
];

export const ShowcaseSection = () => {
  return (
    <section className="relative w-full bg-black text-white py-24 px-6 sm:px-12 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col space-y-16">
        {/* Section Header */}
        <div className="flex flex-col">
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Selected
          </h2>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none text-transparent [-webkit-text-stroke:2px_white] sm:ml-20">
            Works
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col space-y-4">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <span className="text-zinc-600 font-mono text-xs sm:text-sm tracking-widest uppercase">
                  [ {project.title} ]
                </span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                  {project.title}
                </h3>
                <p className="text-zinc-400 font-light tracking-widest uppercase text-xs sm:text-sm mt-1">
                  {project.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
