"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getProductsByIds } from "@/lib/actions";
import { readFavourites } from "@/lib/favourites";
import type { PublicProduct } from "@/lib/products";

export function FavouritesView() {
  const [items, setItems] = useState<PublicProduct[] | null>(null);

  useEffect(() => {
    const load = () => {
      const ids = readFavourites();
      getProductsByIds(ids).then(setItems).catch(() => setItems([]));
    };
    load();
    window.addEventListener("favourites:changed", load);
    return () => window.removeEventListener("favourites:changed", load);
  }, []);

  if (!items) {
    return (
      <div className="rounded-[1.8rem] border border-navy/8 bg-white px-6 py-10 text-center shadow-[0_16px_40px_rgba(3,4,94,0.04)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Favourites</p>
        <p className="mt-3 text-lg text-navy/70">Loading your saved frames…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[2rem] border border-navy/8 bg-white px-6 py-12 text-center shadow-[0_18px_50px_rgba(3,4,94,0.05)] md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Your list is empty</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight">No frames saved yet</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-navy/70">
          Tap the heart on a product to save it here. Favourites stay in this browser until its data is cleared.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/spectacles"
            className="inline-flex rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-aqua hover:text-navy"
          >
            Browse spectacles
          </Link>
          <Link
            href="/sunglasses"
            className="inline-flex rounded-full border border-navy/15 px-6 py-3 text-sm font-semibold transition hover:border-[#c4a35a]/40"
          >
            Browse sunglasses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-navy/8 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Saved frames</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-navy/55">
            {items.length} {items.length === 1 ? "favourite" : "favourites"}
          </p>
        </div>
        <p className="text-sm text-navy/50">Stored in this browser only</p>
      </div>
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
