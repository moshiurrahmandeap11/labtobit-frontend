export interface PricingTier {
  plan: string;
  price: string;
  period: string;
  highlights: string[];
  isPopular?: boolean;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  thumbnail: string;
  externalLink: string;
  videoEmbedUrl: string;
  description: string;
  whatItIs: string;
  whatItDoes: string;
  technicalStack: string[];
  coreFeatures: ProductFeature[];
  pricing: PricingTier[];
  companyInfo: {
    copyright: string;
    contact: string;
  };
}

export const products: Product[] = [
  {
    slug: "labto-ai",
    title: "Labto AI",
    subtitle: "Intelligent AI Assistant for Storefronts",
    tagline: "Intelligent AI Assistant for your website in 3 simple steps",
    thumbnail: "/products/products-1.png",
    externalLink: "https://mako-frontend.vercel.app",
    videoEmbedUrl: "https://streamable.com/e/7d3wxf",
    description: "An AI-powered shopping assistant widget that e-commerce merchants can embed on their storefronts to guide users, recommend products, and handle cart updates autonomously.",
    whatItIs: "This is a premium AI-powered conversational shopping assistant widget designed to drop into any e-commerce storefront with a single script tag. It functions as a virtual sales assistant, converting casual shoppers into buyers through personalized product recommendations and direct cart interaction.",
    whatItDoes: "Merchants get a lightweight, customizable JavaScript chat widget to drop into their websites. Once active, customers can query the assistant naturally (e.g. 'find some active headphones'), and the widget utilizes semantic vector index matching to retrieve exact catalog catalog matches and bridge cart events.",
    technicalStack: [
      "Neon Serverless Postgres",
      "pgvector similarity indexing",
      "OpenAI Text Embeddings (1536-dim)",
      "Anthropic Claude API model instances",
      "Preact lightweight engine (<50kb gzipped)"
    ],
    coreFeatures: [
      {
        title: "pgvector Semantic Search",
        description: "Matches shopper queries to product catalog items using high-dimensional cosine-distance vector embeddings. Finds relevant products even with typos or descriptive queries."
      },
      {
        title: "Storefront Cart Event Bridge",
        description: "Triggers immediate shopping cart updates via custom JavaScript events, decoupled through a secure iframe communication channel."
      },
      {
        title: "Real-time Live Customizer",
        description: "Configure chatbot headers, greetings, brand theme colors, and position from the merchant dashboard, syncing instantly to active widgets."
      }
    ],
    pricing: [
      {
        plan: "Free",
        price: "$0",
        period: "mo",
        highlights: [
          "100 messages/day limit",
          "1 domain integration",
          "Labto AI branding displayed"
        ]
      },
      {
        plan: "Starter",
        price: "$29",
        period: "mo",
        highlights: [
          "1,000 messages/day limit",
          "2 domains integration",
          "Custom widget appearance config",
          "Basic email support"
        ],
        isPopular: true
      },
      {
        plan: "Pro",
        price: "$79",
        period: "mo",
        highlights: [
          "10,000 messages/day limit",
          "5 domains integration",
          "Storefront cart event bridge access",
          "No Labto AI branding",
          "Priority customer support"
        ]
      },
      {
        plan: "Enterprise",
        price: "Custom",
        period: "contact",
        highlights: [
          "Unlimited message queries",
          "Unlimited domain integrations",
          "Dedicated Anthropic Claude API instances",
          "Dedicated 24/7 account manager",
          "Custom SLA guarantees"
        ]
      }
    ],
    companyInfo: {
      copyright: "© 2026 Labtobit Inc.",
      contact: "hello@labtobit.com"
    }
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
