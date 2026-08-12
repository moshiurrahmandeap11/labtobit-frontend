import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { ProductDetailContent } from "@/components/project/ProductDetailContent";
import { ProductHeroMorph } from "@/components/project/ProductHeroMorph";

export async function generateStaticParams() {
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Find next product for footer navigation (cycling)
  const currentIndex = products.findIndex((p) => p.slug === slug);
  const nextProduct = products[(currentIndex + 1) % products.length];

  return (
    <main className="min-h-screen bg-[#0b100d] text-[#e3f4e5] pt-24 sm:pt-28 pb-16 px-6 sm:px-12 md:px-16 lg:px-20 selection:bg-[#2bf066] selection:text-[#0b100d]">
      <div className="max-w-[1700px] mx-auto w-full">
        <ProductHeroMorph product={product}>
          <ProductDetailContent product={product} nextProduct={nextProduct} />
        </ProductHeroMorph>
      </div>
    </main>
  );
}
