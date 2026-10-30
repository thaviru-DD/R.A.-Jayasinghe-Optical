"use client";

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

  if (!items) return <p className="text-lg">Loading your saved frames…</p>;
  if (!items.length) return <p className="rounded-[1.5rem] bg-ice p-6 text-lg">You have not saved any frames on this device yet. Favourites stay in this browser until its data is cleared.</p>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
