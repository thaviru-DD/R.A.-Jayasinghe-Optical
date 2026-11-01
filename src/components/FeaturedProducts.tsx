"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, RevealText, Stagger, StaggerItem } from "@/components/motion";
import type { PublicProduct } from "@/lib/products";

export function FeaturedProducts({ products }: { products: PublicProduct[] }) {
  if (!products.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#f7fbfd]">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#c4a35a]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24">
        <div className="max-w-3xl">
          <RevealText>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-navy/55">From the shop</p>
          </RevealText>
          <RevealText delay={0.08}>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">
              Featured frames & sunglasses
            </h2>
          </RevealText>
          <Reveal delay={0.14}>
            <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#c4a35a] to-transparent" />
          </Reveal>
          <RevealText delay={0.18}>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-navy/70">
              A short edit chosen by the shop. Browse the details, then message us on WhatsApp to buy.
            </p>
          </RevealText>
        </div>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/spectacles"
            className="inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-aqua hover:text-navy"
          >
            All spectacles
          </Link>
          <Link
            href="/sunglasses"
            className="inline-flex rounded-full border border-navy/15 px-5 py-3 text-sm font-semibold transition hover:border-[#c4a35a]/40"
          >
            All sunglasses
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
