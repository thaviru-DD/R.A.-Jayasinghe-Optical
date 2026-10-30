import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { PriceTag } from "@/components/Price";
import { prisma } from "@/lib/db";
import { toPublic } from "@/lib/products";

export const metadata: Metadata = {
  title: "Lenses",
  description: "Globle, Novar, and Essilor lenses at R.A. Jayasinghe Opticians. Information only. Lenses are fitted in store.",
};

export default async function Page() {
  const rows = await prisma.product.findMany({ where: { category: "lenses", hidden: false }, orderBy: { brand: "asc" } });
  const products = rows.map(toPublic);
  const brands = [...new Set(products.map((product) => product.brand))];

  return (
    <>
      <PageHero
        eyebrow="Lenses"
        title="Globle, Novar, and Essilor"
        text="This page is for information. Lenses are not ordered online. We fit them in the shop to your prescription."
      />
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12">
        {brands.map((brand) => (
          <section key={brand} id={brand.toLowerCase()}>
            <h2 className="font-heading text-3xl font-semibold">{brand}</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {products.filter((product) => product.brand === brand).map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="grid gap-4 rounded-[1.7rem] border border-navy/10 bg-white p-4 sm:grid-cols-[180px_1fr]">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-ice">
                    {product.images[0] ? <Photo src={product.images[0]} alt={`${product.name} by ${product.brand}`} /> : null}
                  </div>
                  <div className="py-2">
                    <h3 className="font-heading text-2xl font-semibold">{product.name}</h3>
                    <p className="mt-2 leading-7">{product.description}</p>
                    <p className="mt-4"><PriceTag product={product} /></p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
