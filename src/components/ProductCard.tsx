import Link from "next/link";
import { FavouriteButton } from "@/components/FavouriteButton";
import { Photo } from "@/components/Photo";
import { PriceTag } from "@/components/Price";
import type { PublicProduct } from "@/lib/products";
import { categoryMeta, labelize } from "@/lib/site";

export function ProductCard({ product, canFavourite = true }: { product: PublicProduct; canFavourite?: boolean }) {
  const image = product.images[0];
  const category = categoryMeta[product.category as keyof typeof categoryMeta];
  const detailLabel = category?.label === "Lenses" ? "Details" : "View";
  const meta = [product.audience ? labelize(product.audience) : null, product.shape ? labelize(product.shape) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-[1.8rem] bg-[#eef5f8]">
        <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
          {image ? (
            <Photo
              src={image}
              alt={`${product.name} by ${product.brand}`}
              className="transition duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent opacity-80 transition duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/50 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        </Link>

        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md ${
              product.inStock ? "bg-white/90 text-navy" : "bg-navy/80 text-white"
            }`}
          >
            {product.inStock ? "In stock" : "Sold out"}
          </span>
          {product.showDiscount ? (
            <span className="rounded-full bg-[#c4a35a] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              Offer
            </span>
          ) : null}
        </div>

        {canFavourite ? (
          <div className="absolute right-3 top-3 z-10">
            <FavouriteButton id={product.id} name={product.name} />
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 opacity-0 transition duration-500 group-hover:opacity-100">
          <span className="inline-flex rounded-full bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-navy shadow-[0_12px_30px_rgba(3,4,94,0.12)] backdrop-blur">
            {detailLabel} →
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c4a35a]">{product.brand}</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-navy">
          <Link href={`/products/${product.slug}`} className="transition hover:text-[#c4a35a]">
            {product.name}
          </Link>
        </h2>
        {meta ? <p className="mt-2 text-sm text-navy/50">{meta}</p> : null}
        <div className="mt-4 h-px w-12 bg-gradient-to-r from-[#c4a35a] to-transparent" />
        <div className="mt-4 flex items-end justify-between gap-3">
          <PriceTag product={product} />
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-semibold uppercase tracking-[0.16em] text-navy transition group-hover:text-[#c4a35a]"
          >
            {detailLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
