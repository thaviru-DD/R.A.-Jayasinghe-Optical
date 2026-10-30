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
  variant = "default",
}: {
  category: string;
  audience?: string;
  basePath: string;
  title: string;
  eyebrow: string;
  intro: string;
  searchParams: Record<string, string | string[] | undefined>;
  variant?: "default" | "luxury";
}) {
  const frameType = one(searchParams.frame) || "";
  const shape = one(searchParams.shape) || "";
  const brand = one(searchParams.brand) || "";
  const min = Number(one(searchParams.min) || "");
  const max = Number(one(searchParams.max) || "");
  const page = Number(one(searchParams.page) || "1");
  const framed = category === "spectacles" || category === "sunglasses";
  const luxury = variant === "luxury";
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

  const control =
    luxury
      ? "rounded-2xl border border-navy/12 bg-[#f7fbfd] px-3 py-3 outline-none transition focus:border-[#c4a35a]/50 focus:bg-white"
      : "rounded-2xl border border-navy/10 bg-white px-3 py-3";

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={intro} variant={variant} />
      <section className={`relative ${luxury ? "overflow-hidden bg-[#f7fbfd]" : ""}`}>
        {luxury ? (
          <>
            <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#c4a35a]/10 blur-3xl" />
          </>
        ) : null}

        <div className={`relative mx-auto max-w-7xl px-4 ${luxury ? "py-14 md:py-16" : "py-10"}`}>
          {framed ? (
            <div className={`mb-8 flex flex-wrap gap-2 ${luxury ? "gap-2.5" : ""}`}>
              <Link
                href={category === "spectacles" ? "/spectacles" : "/sunglasses"}
                className={
                  luxury
                    ? `rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        !audience
                          ? "bg-navy text-white shadow-[0_12px_28px_rgba(3,4,94,0.18)]"
                          : "border border-navy/10 bg-white text-navy hover:border-[#c4a35a]/40"
                      }`
                    : `rounded-full px-4 py-2 ${!audience ? "bg-navy text-white" : "bg-ice text-navy"}`
                }
              >
                All
              </Link>
              {audiences.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${category}/${item.slug}`}
                  className={
                    luxury
                      ? `rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                          audience === item.slug
                            ? "bg-navy text-white shadow-[0_12px_28px_rgba(3,4,94,0.18)]"
                            : "border border-navy/10 bg-white text-navy hover:border-[#c4a35a]/40"
                        }`
                      : `rounded-full px-4 py-2 ${audience === item.slug ? "bg-navy text-white" : "bg-ice text-navy"}`
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}

          <form
            method="get"
            className={
              luxury
                ? "grid gap-3 rounded-[1.8rem] border border-navy/8 bg-white p-5 shadow-[0_18px_50px_rgba(3,4,94,0.05)] md:grid-cols-6"
                : "grid gap-3 rounded-[1.5rem] bg-ice p-4 md:grid-cols-6"
            }
          >
            {luxury ? (
              <p className="md:col-span-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">
                Refine the collection
              </p>
            ) : null}
            {framed ? (
              <>
                <select name="frame" defaultValue={frameType} aria-label="Frame type" className={control}>
                  <option value="">All frame types</option>
                  {frameTypes.map((item) => (
                    <option key={item} value={item}>
                      {labelize(item)}
                    </option>
                  ))}
                </select>
                <select name="shape" defaultValue={shape} aria-label="Shape" className={control}>
                  <option value="">All shapes</option>
                  {shapes.map((item) => (
                    <option key={item} value={item}>
                      {labelize(item)}
                    </option>
                  ))}
                </select>
              </>
            ) : null}
            <select name="brand" defaultValue={brand} aria-label="Brand" className={control}>
              <option value="">All brands</option>
              {result.brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              name="min"
              type="number"
              min={0}
              defaultValue={one(searchParams.min) || ""}
              placeholder="Min Rs."
              aria-label="Minimum price"
              className={control}
            />
            <input
              name="max"
              type="number"
              min={0}
              defaultValue={one(searchParams.max) || ""}
              placeholder="Max Rs."
              aria-label="Maximum price"
              className={control}
            />
            <div className="flex gap-2">
              <button
                className={
                  luxury
                    ? "flex-1 rounded-full bg-navy px-4 py-3 font-semibold text-white transition hover:bg-aqua hover:text-navy"
                    : "flex-1 rounded-full bg-navy px-4 py-3 font-semibold text-white"
                }
                type="submit"
              >
                Filter
              </button>
              <Link
                href={basePath}
                className={
                  luxury
                    ? "grid place-items-center rounded-full border border-navy/10 px-4 py-3 font-semibold transition hover:border-[#c4a35a]/40"
                    : "grid place-items-center rounded-full px-4 py-3 font-semibold"
                }
              >
                Clear
              </Link>
            </div>
          </form>

          <div className={`mt-8 flex items-end justify-between gap-4 ${luxury ? "border-b border-navy/8 pb-4" : ""}`}>
            <p className={luxury ? "text-sm font-semibold uppercase tracking-[0.18em] text-navy/55" : "text-base"}>
              {result.total} {result.total === 1 ? "product" : "products"}
            </p>
            {luxury ? <p className="text-sm text-navy/50">Buy on WhatsApp · No online cart</p> : null}
          </div>

          {result.items.length ? (
            <div className={`mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${luxury ? "gap-7" : ""}`}>
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p
              className={
                luxury
                  ? "mt-10 rounded-[1.8rem] border border-navy/8 bg-white p-8 text-lg text-navy/70"
                  : "mt-10 rounded-[1.5rem] bg-ice p-8 text-lg"
              }
            >
              No products match those filters.
            </p>
          )}

          {result.pages > 1 ? (
            <nav className="mt-12 flex flex-wrap items-center gap-2" aria-label="Pages">
              {Array.from({ length: result.pages }, (_, index) => {
                const next = new URLSearchParams(params);
                next.set("page", String(index + 1));
                const current = result.page === index + 1;
                return (
                  <Link
                    key={index}
                    href={`${basePath}?${next.toString()}`}
                    aria-current={current ? "page" : undefined}
                    className={
                      luxury
                        ? `grid h-11 w-11 place-items-center rounded-full text-sm font-semibold transition ${
                            current
                              ? "bg-navy text-white shadow-[0_10px_24px_rgba(3,4,94,0.18)]"
                              : "border border-navy/10 bg-white hover:border-[#c4a35a]/40"
                          }`
                        : `grid h-11 w-11 place-items-center rounded-full ${current ? "bg-navy text-white" : "bg-ice"}`
                    }
                  >
                    {index + 1}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}
