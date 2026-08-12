"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product, PricingTier } from "@/data/products";
import Link from "next/link";

interface ProductDetailContentProps {
  product: Product;
  nextProduct: Product;
}

export const ProductDetailContent: React.FC<ProductDetailContentProps> = ({
  product,
  nextProduct,
}) => {
  // Billing cycle toggle state
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Autoplay video visibility handler
  const [videoIntersecting, setVideoIntersecting] = useState(false);
  const [videoHasLoaded, setVideoHasLoaded] = useState(false);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVideoIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setVideoHasLoaded(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = videoWrapperRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Customizer state
  const [themeColor, setThemeColor] = useState("#2bf066");
  const [widgetTitle, setWidgetTitle] = useState("Labto AI Assistant");
  const [greeting, setGreeting] = useState("Hey! Looking for recommendations?");
  const [copied, setCopied] = useState(false);

  // Widget preview chat conversation mockup
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Hey! Looking for recommendations?" },
    { sender: "user", text: "looking for active headphones" },
    { sender: "bot", text: "Here are some top choices based on catalog embeddings: \n1. SoundCore Peak (similarity: 0.94) \n2. ActiveFit Air (similarity: 0.89) \n\nWould you like me to add one of these to your shopping cart?" }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages: Array<{ sender: "user" | "bot"; text: string }> = [
      ...chatMessages,
      { sender: "user", text: chatInput },
    ];
    setChatMessages(newMessages);
    setChatInput("");

    // Simple bot reply mockup
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Searching store catalog using pgvector... \nMatched "active" vector embeddings at 1536-dimensions. Ready to add item to your cart event bridge!`,
        },
      ]);
    }, 800);
  };

  const widgetScript = `<script 
  src="https://mako-frontend.vercel.app/widget.js" 
  data-api-key="labto_api_live_9f81a7d65b"
  data-theme-color="${themeColor}"
  data-title="${widgetTitle}"
  data-greeting="${greeting}"
></script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(widgetScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pricing math helper
  const getDisplayPrice = (tier: PricingTier) => {
    if (tier.price === "$0" || tier.price === "Custom") return tier.price;
    const base = parseInt(tier.price.replace("$", ""));
    if (billingCycle === "yearly") {
      // 20% discount
      return `$${Math.round(base * 0.8)}`;
    }
    return tier.price;
  };

  return (
    <div className="flex flex-col gap-16 md:gap-24 w-full">
      {/* 1. Header Hero section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-4">
        {/* Left Column Description */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-3.5 py-1 text-[10px] font-bold tracking-widest text-[#2bf066] border border-[#2bf066]/20 rounded-full uppercase bg-[#2bf066]/5">
              Active Staging
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-zinc-400 text-xs font-mono">v0.1.0 Preact Engine</span>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-normal tracking-tight leading-[1.02] text-[#e3f4e5]">
              {product.title}
            </h1>
            <p className="text-xl text-[#2bf066] font-medium leading-tight">
              {product.tagline}
            </p>
          </div>

          <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed">
            {product.whatItIs}
          </p>

          {/* Integration Stack Badges */}
          <div className="flex flex-col gap-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
              Engine Stack
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {product.technicalStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={product.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-all cursor-pointer shadow-xl group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#0b100d] group-hover:scale-125 transition-transform" />
              <span>LAUNCH LIVE APP</span>
            </a>
            <button
              onClick={() => {
                const target = document.getElementById("installation-box");
                if (target) target.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
            >
              GET WIDGET CODE
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="lg:col-span-7 w-full">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 flex items-center gap-3 text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#2bf066] animate-pulse" />
              <span>Real-time SaaS UI</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Streamable Intro Video Showcase Section */}
      <div className="w-full pt-8 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
            See Labto AI in Action
          </h2>
        </div>

        {/* Browser Mock Wrapper for Iframe Video */}
        <div ref={videoWrapperRef} className="w-full max-w-7xl mx-auto rounded-[2rem] border border-[#2bf066]/20 bg-zinc-950/90 shadow-[0_0_60px_-15px_rgba(43,240,102,0.18)] overflow-hidden p-1.5 sm:p-2.5">
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-zinc-900/60 rounded-t-[1.5rem]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[11px] font-mono text-zinc-500 bg-black/40 px-6 py-1 rounded-full border border-white/5 truncate max-w-[200px] sm:max-w-md">
              mako-frontend.vercel.app/demo
            </div>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Video Iframe Container */}
          <div className="relative w-full aspect-video rounded-b-[1.5rem] overflow-hidden bg-black">
            {videoHasLoaded ? (
              <iframe
                src={`${product.videoEmbedUrl}?autoplay=${videoIntersecting ? "1" : "0"}&muted=1&loop=1`}
                allow="fullscreen; autoplay"
                className="absolute top-0 left-0 w-full h-full border-0"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 bg-black flex items-center justify-center text-zinc-600 font-mono text-xs">
                Loading demo player...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Interactive Customizer & Installation Section */}
      <div id="installation-box" className="w-full pt-12 border-t border-white/10 flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
            INTERACTIVE WIDGET SETUP
          </h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
            Customize & Embed in Seconds
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Configure your Brand colors, Chatbot Title, and Greetings, and watch the SDK script and the widget live-preview sync in real time.
          </p>
        </div>

        {/* Live Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Mock Merchant Settings (5 cols) */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/10 pb-4">
                Widget Parameters
              </h3>

              {/* Color Selector */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  Brand Theme Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { label: "Cyan", color: "#00E5FF" },
                    { label: "Electric Blue", color: "#2563eb" },
                    { label: "Labto Green", color: "#2bf066" },
                    { label: "Neon Purple", color: "#a855f7" },
                    { label: "Crimson Red", color: "#ef4444" },
                  ].map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setThemeColor(preset.color)}
                      title={preset.label}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative ${
                        themeColor === preset.color
                          ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0c0c0e]"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: preset.color }}
                    />
                  ))}
                </div>
              </div>

              {/* Header Title Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  Chat Widget Title
                </label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#2bf066] focus:outline-none text-sm text-white"
                  placeholder="e.g. Labto AI Assistant"
                />
              </div>

              {/* Greeting Message Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  Initial Greeting Message
                </label>
                <textarea
                  value={greeting}
                  onChange={(e) => {
                    setGreeting(e.target.value);
                    setChatMessages((prev) => {
                      const next = [...prev];
                      if (next[0]) next[0].text = e.target.value;
                      return next;
                    });
                  }}
                  rows={2}
                  maxLength={80}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#2bf066] focus:outline-none text-sm text-white resize-none"
                  placeholder="e.g. How can I help you today?"
                />
              </div>
            </div>

            {/* SDK Code Output */}
            <div className="flex flex-col gap-3 bg-black/40 border border-white/5 rounded-2xl p-5 font-mono relative group">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">SDK SCRIPT TAG</span>
                <button
                  onClick={handleCopyCode}
                  className="text-[10px] text-[#2bf066] hover:text-[#00E5FF] transition-colors cursor-pointer font-bold uppercase tracking-widest"
                >
                  {copied ? "COPIED" : "COPY CODE"}
                </button>
              </div>
              <pre className="text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                {widgetScript}
              </pre>
            </div>
          </div>

          {/* Right Column: Simulated Website Storefront & Live Chat Widget Preview (7 cols) */}
          <div className="lg:col-span-7 bg-[#111827]/40 border border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[460px]">
            {/* Background Storefront Mockup elements */}
            <div className="absolute inset-x-0 top-0 h-14 border-b border-white/5 bg-[#1f2937]/30 flex items-center justify-between px-6 z-0 pointer-events-none opacity-45">
              <span className="text-xs font-bold font-mono text-zinc-400 tracking-wider">Storefront Sandbox</span>
              <div className="flex gap-4">
                <span className="w-10 h-2 bg-zinc-600 rounded" />
                <span className="w-10 h-2 bg-zinc-600 rounded" />
              </div>
            </div>

            {/* Chatbot Simulated Widget Body */}
            <div className="relative z-10 w-full max-w-[380px] mx-auto mt-16 bg-[#0c0c0e] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-grow">
              {/* Chatbot Header */}
              <div
                className="px-5 py-4 flex items-center justify-between text-white transition-colors duration-500"
                style={{ backgroundColor: themeColor }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span className="font-bold text-xs uppercase tracking-wider text-[#0c0c0e]">
                    {widgetTitle}
                  </span>
                </div>
                <span className="text-xs text-[#0c0c0e] font-bold">● Live</span>
              </div>

              {/* Chatbot History */}
              <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 text-xs min-h-[220px] max-h-[240px]">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-xl leading-relaxed whitespace-pre-wrap ${
                        msg.sender === "user"
                          ? "bg-zinc-800 text-white rounded-tr-none"
                          : "bg-white/10 text-zinc-100 rounded-tl-none border border-white/5"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chatbot Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#2bf066] text-xs text-white"
                  placeholder="Ask the shopping assistant..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold text-xs uppercase cursor-pointer text-[#0c0c0e] hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: themeColor }}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Core Features and pgvector similarity search SQL Showcase */}
      <div className="w-full pt-16 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Features Column (Left - 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">
            UNDER THE HOOD
          </h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
            How pgvector Similarity Matches Work
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            By indexing product descriptions using OpenAI’s 1536-dimensional embeddings, Labto AI can rank products instantly based on their cosine distance from a shopper’s natural language query.
          </p>

          <div className="flex flex-col gap-6 mt-4">
            {product.coreFeatures.map((feat, idx) => (
              <div key={idx} className="flex flex-col gap-1 pt-6 border-t border-white/5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#2bf066]">
                  {feat.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SQL Code Block Column (Right - 7 cols) */}
        <div className="lg:col-span-7 w-full flex flex-col gap-4">
          <div className="w-full rounded-2xl bg-zinc-950 border border-white/10 p-6 font-mono text-xs shadow-2xl relative">
            {/* Code header decoration */}
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">SQL Query (Neon pgvector similarity search)</span>
              <span className="text-[10px] text-zinc-600 font-semibold font-mono">1536-dim embeddings</span>
            </div>

            <pre className="text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre">
              {`-- Rank product matches using Cosine Distance
SELECT 
  id, 
  title, 
  category, 
  price,
  hero_image,
  1 - (embedding <=> :query_embedding) AS similarity
FROM store_products
WHERE merchant_id = :merchant_id
  AND stock_count > 0
ORDER BY similarity DESC
LIMIT 4;`}
            </pre>

            {/* Simulated Query Execution Metrics */}
            <div className="mt-6 border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
              <span>Execution Time: ~4.2ms</span>
              <span className="text-[#2bf066]">Cosine Match Score: 0.945</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#00E5FF]">Real-Time Event Bridging</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The Storefront Cart Event Bridge unifies widget actions with the Shopify or custom React cart context. It dispatches a custom JavaScript event across the frame boundaries to ensure catalog recommendations can trigger direct cart updates without merchant integration friction.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Custom Interactive Pricing Tiers */}
      <div className="w-full pt-16 border-t border-white/10 flex flex-col gap-12 items-center">
        <div className="flex flex-col gap-4 items-center text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#2bf066]">PRICING PLANS</h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">Flexible Plans for Every Scale</h2>

          {/* Toggle Switches */}
          <div className="flex items-center gap-4 bg-white/5 p-1 rounded-full border border-white/10 mt-2">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                billingCycle === "monthly" ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === "yearly" ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Yearly</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-[#2bf066] text-[#0b100d] font-black uppercase tracking-normal">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1500px] pt-4">
          {product.pricing.map((tier) => (
            <div
              key={tier.plan}
              className={`rounded-[2rem] p-8 flex flex-col justify-between relative border transition-all duration-300 ${
                tier.isPopular
                  ? "bg-white/5 border-[#2bf066] shadow-[0_15px_40px_-10px_rgba(43,240,102,0.15)] scale-[1.02]"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#2bf066] text-[#0b100d] shadow-lg">
                  MOST POPULAR
                </span>
              )}

              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">{tier.plan}</h4>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl sm:text-5xl font-medium tracking-tight text-white">
                      {getDisplayPrice(tier)}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">/{tier.period}</span>
                  </div>
                </div>

                <ul className="flex flex-col gap-3.5 text-sm text-zinc-300 border-t border-white/10 pt-6">
                  {tier.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5">
                      <span className="text-[#2bf066] text-xs mt-0.5">✓</span>
                      <span className="text-xs sm:text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href="mailto:hello@labtobit.com?subject=Labto AI Enterprise Inquiry"
                  className={`block w-full py-4 rounded-full font-bold text-xs tracking-wider uppercase text-center cursor-pointer transition-all ${
                    tier.isPopular
                      ? "bg-[#2bf066] text-[#0b100d] hover:bg-[#2bf066]/90 shadow-lg"
                      : "bg-white/5 border border-white/15 text-white hover:bg-white hover:text-[#0b100d] hover:border-transparent"
                  }`}
                >
                  {tier.plan === "Enterprise" ? "Talk to Sales" : "Get Started"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Footer Details navigation link */}
      <div className="w-full pt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            NEXT WORK
          </p>
          <Link
            href={`/projects/${nextProduct.slug}`}
            className="text-3xl sm:text-5xl font-medium tracking-tight hover:text-[#2bf066] text-[#e3f4e5] transition-colors"
          >
            {nextProduct.title} →
          </Link>
        </div>
        <Link
          href="/"
          className="px-8 py-4 rounded-full bg-white text-[#0b100d] font-bold text-xs tracking-wider uppercase hover:bg-[#2bf066] transition-colors"
        >
          BACK TO WORK
        </Link>
      </div>
    </div>
  );
};
