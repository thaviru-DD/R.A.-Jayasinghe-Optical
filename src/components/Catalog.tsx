import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PageHero } from "@/components/PageHero";
import { queryProducts } from "@/lib/products";
import { audiences, frameTypes, labelize, shapes } from "@/lib/site";

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function Catalog({
  category,
  audience,
  basePath,
  title,
  eyebrow,
  intro,
  searchParams,
}: {
  category: string;
  audience?: string;
  basePath: string;
  title: string;
  eyebrow: string;
  intro: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const frameType = one(searchParams.frame) || "";
  const shape = one(searchParams.shape) || "";
  const brand = one(searchParams.brand) || "";
  const min = Number(one(searchParams.min) || "");
  const max = Number(one(searchParams.max) || "");
  const page = Number(one(searchParams.page) || "1");
  const framed = category === "spectacles" || category === "sunglasses";
  const result = await queryProducts({
    category,
    audience,
    frameType: frameType || undefined,
    shape: shape || undefined,
    brand: brand || undefined,
    min: Number.isFinite(min) && one(searchParams.min) ? min : undefined,
    max: Number.isFinite(max) && one(searchParams.max) ? max : undefined,
    page: Number.isFinite(page) ? page : 1,
  });

  const params = new URLSearchParams();
  if (frameType) params.set("frame", frameType);
  if (shape) params.set("shape", shape);
  if (brand) params.set("brand", brand);
  if (one(searchParams.min)) params.set("min", String(min));
  if (one(searchParams.max)) params.set("max", String(max));

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={intro} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        {framed ? (
          <div className="mb-6 flex flex-wrap gap-2">
            <Link href={category === "spectacles" ? "/spectacles" : "/sunglasses"} className={`rounded-full px-4 py-2 ${!audience ? "bg-navy text-white" : "bg-ice text-navy"}`}>
              All
            </Link>
            {audiences.map((item) => (
              <Link
                key={item.slug}
                href={`/${category}/${item.slug}`}
                className={`rounded-full px-4 py-2 ${audience === item.slug ? "bg-navy text-white" : "bg-ice text-navy"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        <form method="get" className="grid gap-3 rounded-[1.5rem] bg-ice p-4 md:grid-cols-6">
          {framed ? (
            <>
              <select name="frame" defaultValue={frameType} aria-label="Frame type" className="rounded-2xl border border-navy/10 bg-white px-3 py-3">
                <option value="">All frame types</option>
                {frameTypes.map((item) => (
                  <option key={item} value={item}>{labelize(item)}</option>
                ))}
              </select>
              <select name="shape" defaultValue={shape} aria-label="Shape" className="rounded-2xl border border-navy/10 bg-white px-3 py-3">
                <option value="">All shapes</option>
                {shapes.map((item) => (
                  <option key={item} value={item}>{labelize(item)}</option>
                ))}
              </select>
            </>
          ) : null}
          <select name="brand" defaultValue={brand} aria-label="Brand" className="rounded-2xl border border-navy/10 bg-white px-3 py-3">
            <option value="">All brands</option>
            {result.brands.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <input name="min" type="number" min={0} defaultValue={one(searchParams.min) || ""} placeholder="Min Rs." aria-label="Minimum price" className="rounded-2xl border border-navy/10 bg-white px-3 py-3" />
          <input name="max" type="number" min={0} defaultValue={one(searchParams.max) || ""} placeholder="Max Rs." aria-label="Maximum price" className="rounded-2xl border border-navy/10 bg-white px-3 py-3" />
          <div className="flex gap-2">
            <button className="flex-1 rounded-full bg-navy px-4 py-3 font-semibold text-white" type="submit">Filter</button>
            <Link href={basePath} className="grid place-items-center rounded-full px-4 py-3 font-semibold">Clear</Link>
          </div>
        </form>

        <p className="mt-6 text-base">{result.total} {result.total === 1 ? "product" : "products"}</p>
        {result.items.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-[1.5rem] bg-ice p-8 text-lg">No products match those filters.</p>
        )}

        {result.pages > 1 ? (
          <nav className="mt-10 flex flex-wrap items-center gap-2" aria-label="Pages">
            {Array.from({ length: result.pages }, (_, index) => {
              const next = new URLSearchParams(params);
              next.set("page", String(index + 1));
              const current = result.page === index + 1;
              return (
                <Link key={index} href={`${basePath}?${next.toString()}`} aria-current={current ? "page" : undefined} className={`grid h-11 w-11 place-items-center rounded-full ${current ? "bg-navy text-white" : "bg-ice"}`}>
                  {index + 1}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </section>
    </>
  );
}
