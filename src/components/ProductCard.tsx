import Link from "next/link";
import { FavouriteButton } from "@/components/FavouriteButton";
import { Photo } from "@/components/Photo";
import { PriceTag } from "@/components/Price";
import type { PublicProduct } from "@/lib/products";
import { categoryMeta } from "@/lib/site";

export function ProductCard({ product, canFavourite = true }: { product: PublicProduct; canFavourite?: boolean }) {
  const image = product.images[0];
  const category = categoryMeta[product.category as keyof typeof categoryMeta];
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-navy/10 bg-white shadow-[0_18px_50px_rgba(3,4,94,0.06)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(3,4,94,0.12)]">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-ice">
        {image ? (
          <Photo src={image} alt={`${product.name} by ${product.brand}`} className="transition duration-700 group-hover:scale-105" />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-navy">
          {product.inStock ? "In stock" : "Out of stock"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-navy/60">{product.brand}</p>
            <h2 className="mt-1 font-heading text-xl font-semibold">
              <Link href={`/products/${product.slug}`} className="hover:underline">
                {product.name}
              </Link>
            </h2>
          </div>
          {canFavourite ? <FavouriteButton id={product.id} name={product.name} /> : null}
        </div>
        <p className="line-clamp-2 text-base text-navy/80">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <PriceTag product={product} />
          <Link href={`/products/${product.slug}`} className="text-base font-semibold text-navy underline decoration-aqua decoration-2 underline-offset-4">
            {category?.label === "Lenses" ? "Details" : "View"}
          </Link>
        </div>
      </div>
    </article>
  );
}
