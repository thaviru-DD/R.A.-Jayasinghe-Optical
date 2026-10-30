import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { prisma } from "@/lib/db";
import { toPublic } from "@/lib/products";

export const metadata: Metadata = {
  title: "Lenses",
  description: "Globle, Novar, and Essilor lenses at R.A. Jayasinghe Opticians. Information only. Lenses are fitted in store.",
};

export default async function Page() {
  const rows = await prisma.product.findMany({
    where: { category: "lenses", hidden: false },
    orderBy: { brand: "asc" },
  });
  const products = rows.map(toPublic);
  const brands = [...new Set(products.map((product) => product.brand))];

  return (
    <>
      <PageHero
        variant="luxury"
        eyebrow="Lenses"
        title="Globle, Novar, and Essilor"
        text="This page is for information. Lenses are not ordered online. We fit them in the shop to your prescription."
      />
      <section className="relative overflow-hidden bg-[#f7fbfd]">
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#c4a35a]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl space-y-16 px-4 py-16 md:py-20">
          <div className="rounded-[1.8rem] border border-[#c4a35a]/25 bg-white px-5 py-4 text-sm leading-7 text-navy/70 shadow-[0_16px_40px_rgba(3,4,94,0.04)] md:px-6">
            Visit us in Ratmalana for a precise fit. Online browsing is for guidance only.
          </div>
          {brands.map((brand) => (
            <section key={brand} id={brand.toLowerCase()}>
              <div className="flex items-end justify-between gap-4 border-b border-navy/8 pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Lens brand</p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl">{brand}</h2>
                </div>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {products
                  .filter((product) => product.brand === brand)
                  .map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group grid gap-4 overflow-hidden rounded-[1.8rem] border border-navy/8 bg-white p-4 shadow-[0_18px_50px_rgba(3,4,94,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(3,4,94,0.1)] sm:grid-cols-[180px_1fr]"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-[1.3rem] bg-ice">
                        {product.images[0] ? (
                          <Photo
                            src={product.images[0]}
                            alt={`${product.name} by ${product.brand}`}
                            className="transition duration-700 group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-col py-2 pr-2">
                        <h3 className="font-heading text-2xl font-semibold tracking-tight">{product.name}</h3>
                        <p className="mt-2 flex-1 leading-7 text-navy/70">{product.description}</p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy transition group-hover:text-[#c4a35a]">
                          View details
                          <span aria-hidden className="transition group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
