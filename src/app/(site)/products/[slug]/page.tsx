import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { FavouriteButton } from "@/components/FavouriteButton";
import { Gallery } from "@/components/Gallery";
import { PriceTag } from "@/components/Price";
import { ProductCard } from "@/components/ProductCard";
import { buyMessage, getProduct, relatedProducts } from "@/lib/products";
import { categoryMeta, labelize, shop, siteUrl, whatsappLink } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Product" };
  return { title: `${product.name} · ${product.brand}`, description: product.description };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const related = await relatedProducts(product);
  const meta = categoryMeta[product.category as keyof typeof categoryMeta];
  const sellable = product.category !== "lenses";
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") || "http";
  const origin = host ? `${proto}://${host}` : siteUrl;
  const message = buyMessage(product, `/products/${product.slug}`, origin);

  return (
    <article className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em]">
        <Link href={meta?.href || "/"} className="hover:underline">{meta?.label}</Link>
        {product.audience ? ` · ${labelize(product.audience)}` : ""}
      </p>
      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
        <Gallery images={product.images} name={product.name} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy/60">{product.brand}</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="font-heading text-4xl font-semibold">{product.name}</h1>
            {sellable ? <FavouriteButton id={product.id} name={product.name} /> : null}
          </div>
          <p className="mt-4 text-lg"><PriceTag product={product} /></p>
          <p className="mt-3 inline-flex rounded-full bg-ice px-3 py-1 font-semibold">{product.inStock ? "In stock" : "Out of stock"}</p>
          <p className="mt-6 text-lg leading-8">{product.description}</p>
          {sellable ? (
            <>
              <a href={whatsappLink(message)} className="mt-8 inline-flex rounded-full bg-navy px-6 py-3 font-semibold text-white">Buy on WhatsApp</a>
              <p className="mt-4 leading-7">
                Delivery is available island-wide. You pay a delivery charge, which the shop confirms on WhatsApp. This website does not take payment, and returns are not accepted.
              </p>
            </>
          ) : (
            <p className="mt-8 rounded-[1.4rem] bg-ice p-5 leading-7">
              Lenses are for information only. They are not ordered online. Visit {shop.address} or message us and we will fit them to your prescription.
            </p>
          )}
        </div>
      </div>
      {related.length ? (
        <section className="mt-16">
          <h2 className="font-heading text-3xl font-semibold">More from {meta?.label.toLowerCase()}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => <ProductCard key={item.id} product={item} canFavourite={item.category !== "lenses"} />)}
          </div>
        </section>
      ) : null}
    </article>
  );
}
