import Link from "next/link";
import { saveHomeFeatured } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;

  const [selected, options] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, category: { in: ["spectacles", "sunglasses"] } },
      orderBy: [{ featuredOrder: "asc" }, { updatedAt: "desc" }],
      take: 4,
    }),
    prisma.product.findMany({
      where: { hidden: false, category: { in: ["spectacles", "sunglasses"] } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
  ]);

  const slots = [0, 1, 2, 3].map((index) => selected[index]?.id ?? "");

  return (
    <div>
      <h1 className="font-heading text-4xl font-semibold">Homepage picks</h1>
      <p className="mt-3 max-w-2xl text-navy/70">
        Choose up to 4 spectacles or sunglasses to show on the homepage after Our services. Leave a slot empty to show
        fewer.
      </p>

      {sp.saved ? (
        <p className="mt-4 rounded-2xl border border-aqua/40 bg-aqua/15 px-4 py-3 font-semibold text-navy">
          Homepage picks saved.
        </p>
      ) : null}
      {sp.error === "duplicate" ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-navy" role="alert">
          Each slot must be a different product.
        </p>
      ) : null}
      {sp.error === "invalid" ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-navy" role="alert">
          Choose only visible spectacles or sunglasses.
        </p>
      ) : null}

      <form action={saveHomeFeatured} className="mt-8 max-w-3xl space-y-5">
        {slots.map((id, index) => (
          <label key={index} className="block rounded-[1.6rem] border border-navy/8 bg-white p-5 shadow-[0_12px_30px_rgba(3,4,94,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Slot {index + 1}</p>
              {index === 0 ? <span className="text-xs font-semibold text-navy/50">Shown first</span> : null}
            </div>
            <select
              name={`slot${index + 1}`}
              defaultValue={id}
              className="mt-3 w-full rounded-2xl border border-navy/12 bg-[#f7fbfd] px-4 py-3.5 outline-none focus:border-[#c4a35a]/50 focus:bg-white"
            >
              <option value="">None</option>
              {options.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.stockNumber ? `${product.stockNumber} · ` : ""}
                  {product.name} · {product.brand} · {product.category}
                </option>
              ))}
            </select>
            {id ? (
              <p className="mt-2 text-sm text-navy/55">
                <Link href={`/admin/products/${id}`} className="font-semibold underline">
                  Edit this product
                </Link>
              </p>
            ) : null}
          </label>
        ))}

        <button type="submit" className="rounded-full bg-navy px-7 py-3.5 font-semibold text-white transition hover:bg-aqua hover:text-navy">
          Save homepage picks
        </button>
      </form>
    </div>
  );
}
