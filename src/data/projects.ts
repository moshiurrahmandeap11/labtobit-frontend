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
    slug: 'of-the-oak',
    title: 'Of The Oak',
    subtitle: 'Sustainable Craftsmanship Meets Immersive Digital Architecture',
    client: 'Of The Oak Design Co.',
    year: '2025',
    role: 'Web Design, 3D Visualization & Brand Identity',
    category: 'E-Commerce & Digital Experience',
    tags: ['WEB', 'DESIGN', 'DEVELOPMENT', '3D', 'ANIMATION'],
    heroImage: '/projects/projects-2.png',
    description: 'A tactile, organic digital storefront designed for a luxury sustainable furniture studio, focusing on craftsmanship, material origins, and interactive product exploration.',
    overview: 'Of The Oak creates bespoke architectural furniture from ethically sourced timbers. We designed a web experience that reflects the organic warmth of wood alongside contemporary minimal digital aesthetics.',
    challenge: 'Bringing the tactile feeling of physical woodwork into a digital browser environment while ensuring fast load times and seamless checkout flows.',
    solution: 'Utilizing high-fidelity 3D model viewers and progressive image loading, we built a digital showroom where customers can inspect grain textures, preview pieces in AR, and order custom builds.',
    deliverables: ['E-Commerce Strategy', 'Web Design', '3D Product Rendering', 'Shopify & Next.js Integration'],
    stats: [
      { label: 'Average Order Value', value: '+35%' },
      { label: 'Session Duration', value: '4m 12s' },
      { label: 'Customer Retention', value: '62%' },
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
