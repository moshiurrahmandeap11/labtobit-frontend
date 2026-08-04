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
    slug: 'oryza-ai',
    title: 'Oryza AI',
    subtitle: 'Next-Generation AI Platform for Enterprise Workflows',
    client: 'Oryza Systems',
    year: '2026',
    role: 'Concept, Web Design, 3D & Frontend Development',
    category: 'AI Platform / Web App',
    tags: ['CONCEPT', 'WEB', 'DESIGN', 'DEVELOPMENT', '3D', 'ANIMATION'],
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    description: 'An immersive digital experience built for Oryza AI, showcasing their suite of predictive AI tools through interactive 3D visualizations and fluid micro-interactions.',
    overview: 'Oryza AI approached us to completely overhaul their brand identity and web presence. They needed a high-performance web application that could explain complex AI model architectures in an intuitive and visually commanding format.',
    challenge: 'Communicating heavy technical concepts like neural network training and multi-agent coordination to non-technical stakeholders without sacrificing depth or design aesthetics.',
    solution: 'We engineered an interactive WebGL showcase featuring realtime 3D graph visualizations, custom GSAP scroll triggers, and a modular layout system that translates raw data into sleek visual stories.',
    deliverables: ['Brand Architecture', 'UI/UX Design', '3D Asset Creation', 'Next.js App Development', 'Design System'],
    stats: [
      { label: 'User Engagement', value: '+140%' },
      { label: 'Conversion Rate', value: '4.8%' },
      { label: 'Page Load Speed', value: '0.6s' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
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
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1600&auto=format&fit=crop',
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
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
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
    heroImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
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
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
