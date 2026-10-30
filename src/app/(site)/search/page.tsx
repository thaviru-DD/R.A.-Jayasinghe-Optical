import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { PageHero } from "@/components/PageHero";
import { queryProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Search", description: "Search R.A. Jayasinghe Opticians products by name or brand." };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q?.trim() || "";
  const result = q ? await queryProducts({ q, pageSize: 24 }) : null;
  return (
    <>
      <PageHero eyebrow="Search" title="Find a frame or a brand" text="Search products by name or brand." />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <form action="/search" className="flex gap-3">
          <label className="sr-only" htmlFor="q">Search</label>
          <input id="q" name="q" defaultValue={q} className="flex-1 rounded-full border border-navy/15 px-5 py-3" />
          <button className="rounded-full bg-navy px-6 py-3 font-semibold text-white" type="submit">Search</button>
        </form>
        {result ? (
          result.items.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((product) => <ProductCard key={product.id} product={product} canFavourite={product.category !== "lenses"} />)}
            </div>
          ) : <p className="mt-8 text-lg">Nothing matched “{q}”.</p>
        ) : <p className="mt-8 text-lg">Type a product name or a brand.</p>}
      </div>
    </>
  );
}
