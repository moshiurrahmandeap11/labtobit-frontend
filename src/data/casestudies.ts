export interface UserPersona {
  name: string;
  role: string;
  avatar: string;
  needs: string[];
  painPoints: string[];
}

export interface CompetitorItem {
  competitor: string;
  advantage: string;
  weakness: string;
}

export interface SystemNode {
  name: string;
  description: string;
  technology: string;
}

export interface GanttTask {
  phase: string;
  duration: string;
  status: "Completed" | "In Progress" | "Planned";
}

export interface AttachmentItem {
  name: string;
  type: "PDF Document" | "Figma File" | "System Architecture Document" | "JSON Dataset Schema";
  size: string;
  downloadUrl: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  subtitle: string;
  category: string;
  heroImage: string;
  stats?: { label: string; value: string }[];
  
  // Phase 1: Research & Discovery
  researchNotes: string;
  userPersonas: UserPersona[];
  competitorAnalysis: CompetitorItem[];

  // Phase 2: System Architecture
  architectureOverview: string;
  techStackReasoning: string;
  systemNodes: SystemNode[];

  // Phase 3: Wireframes & Blueprints
  wireframeOverview: string;
  wireframes: string[];
  
  // Phase 4: Project Deliverables & Attachments (Download files)
  ganttTimeline: GanttTask[];
  attachments: AttachmentItem[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'aeshut',
    title: 'AESHUT Research',
    client: 'AESHUT',
    subtitle: 'B2B AI FMCG Procurement Journey & Platform Architecture Case Study',
    category: 'E-Commerce / B2B AI Platform Research',
    heroImage: '/projects/projects-1.png',
    stats: [
      { label: 'Research Participants', value: '45 Trade Buyers' },
      { label: 'Insights Discovered', value: '18 Unique Factors' },
      { label: 'Architecture Nodes', value: '6 Microservices' },
    ],
    researchNotes: 'Our UX research phase focused on understanding the friction trade buyers experience in FMCG procurement. Through user interviews, we discovered that buyers lose hours verifying product authenticity, price trends, and stock allocations. The introduction of AI Product Insight Reports was validated as a key buying driver to help buyers optimize order timing.',
    userPersonas: [
      {
        name: 'Richard Henderson',
        role: 'FMCG Procurement Director',
        avatar: '/testimonials/avatar-1.png',
        needs: [
          'Immediate stock availability verification',
          'Access to historic supplier price trends to negotiate bulk discounts',
          'AI insights on upcoming consumer demand'
        ],
        painPoints: [
          'Supplier portals frequently crash during flash drops',
          'Hidden transport charges and delivery delays',
          'Unstructured PDF spec sheets that are hard to verify'
        ]
      },
      {
        name: 'Sarah Jenkins',
        role: 'Retail Inventory Manager',
        avatar: '/testimonials/avatar-2.png',
        needs: [
          'Seamless sync of trade catalogs with internal ERPs',
          'One-click download of item specifications',
          'Quick AI validation of batch expiration dates'
        ],
        painPoints: [
          'Duplicate data entry for over 2,000 SKUs',
          'Slow loading catalog tables on older warehouse tablets',
          'Lack of batch-level visibility'
        ]
      }
    ],
    competitorAnalysis: [
      {
        competitor: 'Traditional Wholesalers',
        advantage: 'Established long-term trade relations and offline credit options.',
        weakness: 'Manual phone/email ordering system, complete lack of live data integrations.'
      },
      {
        competitor: 'Global B2B Marketplaces',
        advantage: 'Massive catalog diversity and global shipping logistics.',
        weakness: 'High shipping latency, untrustworthy vendor verification, and zero AI insights.'
      }
    ],
    architectureOverview: 'The AESHUT platform is built on a split headless commerce architecture. The frontend is powered by a Next.js App Router app deployed on Vercel, which connects asynchronously to a Django REST trade catalog database and a dedicated FastAPI service for calculating live AI pricing predictions.',
    techStackReasoning: 'We chose Next.js for its React Server Components, which allow us to pre-render heavy database tables (such as 2,000+ FMCG bulk items) on the server, ensuring sub-second initial load speeds on warehouse tablets. TailwindCSS provides lightweight responsive styling, and GSAP handles visual transition morphs.',
    systemNodes: [
      {
        name: 'NextJS Headless Storefront',
        description: 'Handles server-rendered trade catalog pages, live pricing filters, and user account portals.',
        technology: 'Next.js, TypeScript, React Server Components'
      },
      {
        name: 'AI Insights Engine (FastAPI)',
        description: 'Queries historic catalog purchasing patterns to generate Product Insight Reports.',
        technology: 'Python, FastAPI, Scikit-Learn'
      },
      {
        name: 'Headless Commerce API',
        description: 'Processes credit-checked checkout balances, inventory levels, and batch records.',
        technology: 'Django REST Framework, PostgreSQL'
      }
    ],
    wireframeOverview: 'Initial blueprints mapped out the transition between the physical FMCG shopping cart and the checkout upsell modal offering premium AI reports. Wireframes were designed using a high-density 12-column dashboard layout to present statistics clearly.',
    wireframes: [
      '/projects/projects-2.png',
      '/projects/projects-3.png',
      '/projects/projects-4.png'
    ],
    ganttTimeline: [
      { phase: 'Discovery & User Persona Interviews', duration: '3 Weeks', status: 'Completed' },
      { phase: 'Headless Schema Design & DB Modeling', duration: '2 Weeks', status: 'Completed' },
      { phase: 'GSAP UI Prototyping & Flow Mapping', duration: '3 Weeks', status: 'Completed' },
      { phase: 'AI FastAPI Service Integration', duration: '4 Weeks', status: 'In Progress' },
      { phase: 'Staging Audit & Security Penetration Testing', duration: '2 Weeks', status: 'Planned' }
    ],
    attachments: [
      {
        name: 'AESHUT B2B User Journey Report',
        type: 'PDF Document',
        size: '4.2 MB',
        downloadUrl: '#'
      },
      {
        name: 'FastAPI AI Engine System Blueprint',
        type: 'System Architecture Document',
        size: '12.8 MB',
        downloadUrl: '#'
      },
      {
        name: 'Header & Catalog Design Wireframes',
        type: 'Figma File',
        size: '85 MB',
        downloadUrl: '#'
      }
    ]
  },
  {
    slug: 'regar',
    title: 'Regar.ch Research',
    client: 'Regar.ch',
    subtitle: 'Raffle Platform High-Concurrency Design System & Scaling Case Study',
    category: 'Interactive E-Commerce Architecture Research',
    heroImage: '/projects/projects-2.png',
    stats: [
      { label: 'Drop Testing Concurrency', value: '50,000 RPS' },
      { label: 'Swiss User Surveys', value: '180 Respondents' },
      { label: 'Average Database Sync', value: '< 8ms' },
    ],
    researchNotes: 'Raffle platforms suffer extreme traffic spikes (hype drops) that cause standard websites to crash. Our research focused on defining a zero-lock ticketing structure that distributes raffle slots instantly, preventing race conditions when two users enter the draw at the exact same millisecond.',
    userPersonas: [
      {
        name: 'Pierre Laurent',
        role: 'Sneaker & Luxury Collector',
        avatar: '/testimonials/avatar-3.png',
        needs: [
          'Guaranteed draw transparency and fair lottery selection',
          'Instant push notifications for raffle outcomes',
          'Secure Swiss payment gateway integrations (TWINT)'
        ],
        painPoints: [
          'Bot networks sweeping raffle inventory',
          'Slow loading checkout forms causing draw expiration',
          'Lack of local French customer support'
        ]
      }
    ],
    competitorAnalysis: [
      {
        competitor: 'Nike SNKRS App',
        advantage: 'Unrivaled stock access and massive global brand cachet.',
        weakness: 'Poor bot detection, frequent user login crashes, and zero Swiss-localized support.'
      }
    ],
    architectureOverview: 'To process thousands of raffle ticket transactions per second during drops, we decoupled the raffle entry process from the checkout database by introducing a Redis-backed queues cluster. Live countdown triggers are broadcast to client browsers using WebSockets.',
    techStackReasoning: 'Next.js App Router on Vercel acts as the static frontend shell. Vercel Edge Middleware intercepts incoming draw entries and queues them into a Serverless Redis instance, protecting the primary PostgreSQL transactional database from request spikes.',
    systemNodes: [
      {
        name: 'Vercel Edge Middlewares',
        description: 'Validates draw eligibility and filters automated bot signatures at the edge.',
        technology: 'Next.js Edge Runtime, Geolocation APIs'
      },
      {
        name: 'Redis Drop Queue Queue Manager',
        description: 'Buffers entry allocations and resolves slot tickets in strict FIFO order.',
        technology: 'Upstash Redis, BullMQ'
      },
      {
        name: 'PostgreSQL Core DB',
        description: 'Stores permanent client information, completed orders, and raffle history logs.',
        technology: 'Supabase Postgres, Prisma ORM'
      }
    ],
    wireframeOverview: 'Wireframes focused on the live drop countdown clock and the multi-step Swiss raffle registration flow. The checkout form was optimized to fit on a single screen without vertical scrolling to boost conversion speed.',
    wireframes: [
      '/projects/projects-1.png',
      '/projects/projects-3.png'
    ],
    ganttTimeline: [
      { phase: 'Bot Signature Research & Blocking Strategy', duration: '2 Weeks', status: 'Completed' },
      { phase: 'Edge Queue Logic Implementation', duration: '3 Weeks', status: 'Completed' },
      { phase: 'TWINT Swiss Payment Gateway Integration', duration: '2 Weeks', status: 'Completed' },
      { phase: 'High-Load Concurrency Simulation (Load Testing)', duration: '2 Weeks', status: 'In Progress' },
      { phase: 'Production Mainnet Launch', duration: '1 Week', status: 'Planned' }
    ],
    attachments: [
      {
        name: 'Raffle Bot Protection Whitepaper',
        type: 'PDF Document',
        size: '2.5 MB',
        downloadUrl: '#'
      },
      {
        name: 'Geneva Streetwear Drop User Metrics',
        type: 'JSON Dataset Schema',
        size: '1.2 MB',
        downloadUrl: '#'
      },
      {
        name: 'Regar.ch Complete Figma UI Kit',
        type: 'Figma File',
        size: '42 MB',
        downloadUrl: '#'
      }
    ]
  },
  {
    slug: 'lusion-studio',
    title: 'Lusion Studio Research',
    client: 'Lusion Ltd',
    subtitle: 'High-Performance WebGL Shaders & Animation Optimization Case Study',
    category: 'Digital Art & Animation Engineering',
    heroImage: '/projects/projects-3.png',
    stats: [
      { label: 'Target Frame Rate', value: '120 FPS' },
      { label: 'GPU Memory Footprint', value: '< 45MB' },
      { label: 'Asset Compress Ratio', value: '78%' },
    ],
    researchNotes: 'Creative portfolios are notoriously slow and resource-heavy. Our research focused on reducing shader compile latency and optimizing GPU memory buffers. By utilizing custom binary compression and GLSL math simplifies, we managed to support high-fidelity graphics on low-end smartphones.',
    userPersonas: [
      {
        name: 'Elena Rostova',
        role: 'Creative Agency Talent Scout',
        avatar: '/testimonials/avatar-1.png',
        needs: [
          'Fast loading interactive visual graphics on mobile 3G networks',
          'Clean, readable client deliverables presentation',
          'Responsive navigation to book artists instantly'
        ],
        painPoints: [
          'Interactive WebGL portfolios that overheat mobile phones',
          'Laggy scroll triggers that make UI elements unclickable',
          'Unresponsive layout scaling on folding smartphones'
        ]
      }
    ],
    competitorAnalysis: [
      {
        competitor: 'Standard Agency Sites',
        advantage: 'Highly reliable, fast load times, and simple CMS administration.',
        weakness: 'Extremely boring layout, lack of interactive visuals, and low brand impact.'
      }
    ],
    architectureOverview: 'The visual portfolio runs inside a WebGL context canvas mapped on top of a React Server Components layout. Shaders are compiled asynchronously during the loader intro sequence using Web Workers.',
    techStackReasoning: 'Three.js (R3F) handles scene node updates, while custom GLSL fragment shaders are loaded as compiled modules. GSAP pins layouts and synchronizes scroll delta directly with GPU shader uniform parameters.',
    systemNodes: [
      {
        name: 'Shader Compilation Pipeline',
        description: 'Compiles raw GLSL code in worker threads to prevent main thread blocking.',
        technology: 'Web Workers, WebGL2 Context'
      },
      {
        name: 'GSAP Motion Sync Engine',
        description: 'Maps ScrollTrigger position values directly to fragment shader time uniforms.',
        technology: 'GSAP ScrollTrigger, Custom Easing Math'
      }
    ],
    wireframeOverview: 'Designed layout grids using a 4-column canvas blueprint. Scroll markers were mapped visually to show where key WebGL mesh transitions happen as the user scrolls.',
    wireframes: [
      '/projects/projects-4.png',
      '/projects/projects-1.png'
    ],
    ganttTimeline: [
      { phase: 'Vertex & Fragment Shader Prototyping', duration: '4 Weeks', status: 'Completed' },
      { phase: 'Mesh Compression & Draco Buffer Testing', duration: '2 Weeks', status: 'Completed' },
      { phase: 'NextJS Static Layout Embedding', duration: '2 Weeks', status: 'Completed' },
      { phase: 'Mobile FPS & Thermal Profiling', duration: '2 Weeks', status: 'In Progress' }
    ],
    attachments: [
      {
        name: 'WebGL Memory Management Guide',
        type: 'PDF Document',
        size: '5.1 MB',
        downloadUrl: '#'
      },
      {
        name: 'Compiled GLSL Shader Packages',
        type: 'JSON Dataset Schema',
        size: '340 KB',
        downloadUrl: '#'
      }
    ]
  },
  {
    slug: 'echo-platform',
    title: 'Echo Platform Research ',
    client: 'Echo Technologies',
    subtitle: 'Real-time Audio Processing & High-Frequency Rendering Case Study',
    category: 'Audio SaaS Product Research',
    heroImage: '/projects/projects-4.png',
    stats: [
      { label: 'Waveform Render Latency', value: '4ms' },
      { label: 'Sample Frequency Cache', value: '48 KHz' },
      { label: 'CPU Usage Limit', value: '< 2.5%' },
    ],
    researchNotes: 'High-frequency audio analysis requires real-time computations on huge numerical arrays. Our research was directed at building a Web Audio API worker context that decodes live voice feeds and renders high-density waveforms at a consistent 60 FPS.',
    userPersonas: [
      {
        name: 'Marcus Miller',
        role: 'Broadcast Audio Engineer',
        avatar: '/testimonials/avatar-2.png',
        needs: [
          'Live visual updates of frequency spectrum levels',
          'Zero-latency controls to toggle audio channels',
          'High contrast UI text readable in dark broadcast booths'
        ],
        painPoints: [
          'Laggy dashboard widgets that hide volume spikes',
          'Audio processing crashes when switching input devices',
          'Too many nested sub-menus for basic channel controls'
        ]
      }
    ],
    competitorAnalysis: [
      {
        competitor: 'Desktop Audio Software',
        advantage: 'Highly optimized desktop hardware utilization, zero browser lag.',
        weakness: 'Complex installation process, lack of cloud share options, and zero web exports.'
      }
    ],
    architectureOverview: 'The dashboard runs a background Web Audio Node connected to a Web Assembly (Wasm) audio compiler. The visual waveform charts are rendered directly on an HTML5 canvas element inside a Next.js client component.',
    techStackReasoning: 'We utilized Web Assembly (compiled from Rust) for the audio decoding math because JavaScript is too slow for processing 48 KHz audio streams without dropping frames. Canvas is used for visual rendering to bypass React state cycles.',
    systemNodes: [
      {
        name: 'Wasm Audio Processor Node',
        description: 'Decodes voice input streams and computes FFT frequency arrays in real time.',
        technology: 'WebAssembly, Rust, Web Audio API'
      },
      {
        name: 'Canvas Waveform Renderer',
        description: 'Draws voice amplitudes directly to visual canvas buffers using RequestAnimationFrame.',
        technology: 'HTML5 Canvas API, WebGL fallback'
      }
    ],
    wireframeOverview: 'Designed layout specs for high-density, multi-channel dashboard widgets. Wireframes prioritized audio track level sliders and spectrogram displays on the main viewport grid.',
    wireframes: [
      '/projects/projects-2.png',
      '/projects/projects-3.png'
    ],
    ganttTimeline: [
      { phase: 'Rust Audio Decoder Compiling', duration: '5 Weeks', status: 'Completed' },
      { phase: 'Spectrogram Canvas Rendering Development', duration: '3 Weeks', status: 'Completed' },
      { phase: 'Dashboard State Flow Modeling', duration: '2 Weeks', status: 'Completed' },
      { phase: 'Multi-browser Audio Latency Audit', duration: '2 Weeks', status: 'In Progress' }
    ],
    attachments: [
      {
        name: 'Rust Wasm Audio Engine Design PDF',
        type: 'PDF Document',
        size: '8.4 MB',
        downloadUrl: '#'
      },
      {
        name: 'Spectrum FFT Math Library Blueprint',
        type: 'System Architecture Document',
        size: '4.6 MB',
        downloadUrl: '#'
      }
    ]
  }
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
