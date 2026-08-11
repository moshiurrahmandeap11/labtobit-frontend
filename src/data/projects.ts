export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  role: string;
  category: string;
  tags: string[];
  heroImage: string;
  description: string;
  overview: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  gallery: string[];
  stats?: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    slug: 'aeshut',
    title: 'AESHUT',
    subtitle: 'UK AI-led FMCG Trade Supplier Platform',
    client: 'AESHUT',
    year: '2026',
    role: 'Web Design, E-commerce & Frontend Development',
    category: 'B2B E-commerce / Data Platform',
    tags: ['E-COMMERCE', 'WEB', 'DESIGN', 'AI', 'DEVELOPMENT', 'B2B'],
    heroImage: '/projects/projects-1.png',
    description: 'A modern B2B e-commerce platform for AESHUT, a UK AI-led FMCG trade supplier, integrating physical product sales with premium AI-driven Product Insight Reports.',
    overview: 'AESHUT is redefining the FMCG trade by combining traditional B2B purchasing with advanced artificial intelligence. Customers can seamlessly buy physical FMCG products through normal trade accounts while accessing paid Product Insight Reports to make smarter buying decisions.',
    challenge: 'Integrating a traditional B2B e-commerce flow with a premium digital insights subscription model, ensuring that the AI-driven analytics are presented intuitively alongside physical product catalogs.',
    solution: 'We built a robust, high-performance trade portal that unifies the FMCG product catalog with data-rich insight dashboards. The interface provides a streamlined purchasing experience while upselling value-add AI reports seamlessly.',
    deliverables: ['B2B Portal Design', 'UI/UX Design', 'Next.js E-commerce', 'Data Dashboard', 'Design System'],
    stats: [
      { label: 'Trade Accounts', value: '+200%' },
      { label: 'Report Upsell Rate', value: '34%' },
      { label: 'Platform Uptime', value: '99.9%' },
    ],
    gallery: [
      '/projects/projects-2.png',
      '/projects/projects-3.png',
      '/projects/projects-4.png',
    ],
  },
  {
    slug: 'regar',
    title: 'Regar',
    subtitle: 'Raffle-Based Streetwear & Luxury Goods Platform',
    client: 'Regar.ch',
    year: '2026',
    role: 'Web Design, Frontend Development & Brand Experience',
    category: 'Interactive E-Commerce / Raffle Platform',
    tags: ['WEB', 'DESIGN', 'STREETWEAR', 'RAFFLE', 'SWITZERLAND', 'LUXURY'],
    heroImage: '/projects/projects-2.png',
    description: 'A premium raffle-based platform targeting French-speaking Switzerland, allowing users to enter draws for a chance to win or purchase limited, hyped streetwear and luxury accessories.',
    overview: 'Regar is a specialized streetwear and luxury raffle platform built specifically for the Swiss market. Because hyped releases sell out almost instantly, Regar uses randomized draws to distribute limited sneakers, caps, and luxury accessories fairly to its users.',
    challenge: 'Designing a trustworthy, engaging experience in French that manages high-concurrency traffic during release drops, while clearly communicating raffle entry statuses and draw transparency.',
    solution: 'We created a high-fidelity web platform with a sleek, minimalist aesthetic tailored for Swiss consumers. It features real-time countdowns, secure member registration for draws, and transparent visual feedback on raffle outcomes.',
    deliverables: ['Product Design', 'UI/UX Design', 'Next.js Frontend', 'Brand Strategy', 'Visual Identity'],
    stats: [
      { label: 'Average Draw Entries', value: '+450%' },
      { label: 'Geneva & Lausanne Reach', value: '65%' },
      { label: 'Drop Transaction Load', value: '< 12ms' },
    ],
    gallery: [
      '/projects/projects-1.png',
      '/projects/projects-3.png',
    ],
  },
  {
    slug: 'lusion-studio',
    title: 'Lusion Studio',
    subtitle: 'Interactive Agency Portfolio & Digital Art Showcase',
    client: 'Lusion Ltd',
    year: '2025',
    role: 'Art Direction, Web Development & Motion',
    category: 'Agency Portfolio',
    tags: ['ART DIRECTION', 'DESIGN', 'DEVELOPMENT'],
    heroImage: '/projects/projects-3.png',
    description: 'An experimental agency site showcasing high-end motion graphics, WebGL shaders, and award-winning interactive digital campaigns.',
    overview: 'We collaborated with Lusion Studio to craft a portfolio that highlights their cutting-edge work in digital art, commercial visual effects, and real-time interactive web experiences.',
    challenge: 'Designing a site that stands out in the creative tech space without overwhelming the visitor or cluttering content presentation.',
    solution: 'A minimalist grey canvas paired with fluid page transitions, dynamic typography scaling, and smooth physics-driven scroll effects.',
    deliverables: ['Art Direction', 'Custom Shader Engine', 'Web Architecture', 'Portfolio CMS'],
    stats: [
      { label: 'Awwwards Site of the Day', value: 'Winner' },
      { label: 'Global Traffic', value: '250K+' },
    ],
    gallery: [
      '/projects/projects-4.png',
      '/projects/projects-1.png',
    ],
  },
  {
    slug: 'echo-platform',
    title: 'Echo Platform',
    subtitle: 'Audio Engineering & Realtime Voice Analytics Dashboard',
    client: 'Echo Technologies',
    year: '2026',
    role: 'UI/UX Design & Frontend Development',
    category: 'SaaS Dashboard',
    tags: ['UI/UX', 'PRODUCT DESIGN', 'FRONTEND'],
    heroImage: '/projects/projects-4.png',
    description: 'A real-time audio analytics and voice synthesis dashboard designed for audio engineers and content creators.',
    overview: 'Echo Platform provides complex waveform processing and AI voice analysis in the cloud. We built a high-density, dark-mode user interface designed for speed and clarity.',
    challenge: 'Rendering high-frequency audio waveforms and data streams smoothly at 60 FPS without dropping frames on client devices.',
    solution: 'Implemented HTML5 Canvas and WebGL rendering for waveform displays, wrapped in a sleek Next.js application with modular dashboard widgets.',
    deliverables: ['Product Strategy', 'UI Component Library', 'Dashboard Development', 'Performance Optimization'],
    stats: [
      { label: 'Active Users', value: '85,000+' },
      { label: 'Latency', value: '< 15ms' },
    ],
    gallery: [
      '/projects/projects-2.png',
      '/projects/projects-3.png',
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
