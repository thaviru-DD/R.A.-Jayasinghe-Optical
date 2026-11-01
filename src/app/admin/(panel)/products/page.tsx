import Link from "next/link";
import { applyBulkOffer, deleteProduct, updateProductPrice, updateProductStock } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatLkr } from "@/lib/format";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; offer?: string; percent?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const qUpper = q.toUpperCase();
  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { stockNumber: { contains: qUpper } },
            { name: { contains: q } },
            { brand: { contains: q } },
            { category: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">
          Add product
        </Link>
      </div>
      <p className="mt-3 max-w-2xl text-navy/70">
        Search by stock number to open a frame, then update discount, price, or stock.
      </p>

      <div className="mt-6 rounded-[1.6rem] border border-navy/8 bg-white p-5 shadow-[0_12px_30px_rgba(3,4,94,0.04)] md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Bulk offer</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Apply an offer to many products</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-navy/60">
          Set one percentage discount on product prices. To change homepage offer banner text and end date, use{" "}
          <Link href="/admin/banners" className="font-semibold underline">
            Banners → Offer banners
          </Link>
          .
        </p>

        {sp.offer === "applied" ? (
          <p className="mt-4 rounded-2xl border border-aqua/30 bg-aqua/15 px-4 py-3 font-semibold text-navy" role="status">
            Applied {sp.percent ? `${sp.percent}% ` : ""}offer to the selected products.
          </p>
        ) : null}
        {sp.offer === "cleared" ? (
          <p className="mt-4 rounded-2xl border border-aqua/30 bg-aqua/15 px-4 py-3 font-semibold text-navy" role="status">
            Cleared offers from the selected products.
          </p>
        ) : null}
        {sp.offer === "invalid" ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-navy" role="alert">
            Enter a whole percentage between 1 and 99.
          </p>
        ) : null}

        <form action={applyBulkOffer} className="mt-5 flex flex-wrap items-end gap-3">
          <input type="hidden" name="action" value="apply" />
          <label className="block text-sm font-medium text-navy/70">
            Category
            <select
              name="category"
              defaultValue="all"
              className="mt-2 block min-w-[12rem] rounded-2xl border border-navy/15 bg-[#f7fbfd] px-4 py-3 outline-none focus:border-[#c4a35a]/50 focus:bg-white"
            >
              <option value="all">All products</option>
              <option value="spectacles">Spectacles / frames</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="contact-lenses">Contact lenses</option>
              <option value="lenses">Lenses</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-navy/70">
            Discount %
            <input
              name="percent"
              type="number"
              min={1}
              max={99}
              required
              defaultValue={10}
              className="mt-2 block w-28 rounded-2xl border border-navy/15 bg-[#f7fbfd] px-4 py-3 outline-none focus:border-[#c4a35a]/50 focus:bg-white"
            />
          </label>
          <button type="submit" className="rounded-full bg-navy px-5 py-3 font-semibold text-white transition hover:bg-aqua hover:text-navy">
            Apply offer to all
          </button>
        </form>

        <form action={applyBulkOffer} className="mt-3">
          <input type="hidden" name="action" value="clear" />
          <input type="hidden" name="category" value="all" />
          <button type="submit" className="rounded-full border border-navy/15 px-5 py-3 text-sm font-semibold transition hover:border-[#c4a35a]/40">
            Clear all offers
          </button>
        </form>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" action="/admin/products" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search stock number, name, or brand"
          className="min-w-[16rem] flex-1 rounded-2xl border border-navy/15 bg-white px-4 py-3 outline-none focus:border-[#c4a35a]/50"
          aria-label="Search products"
        />
        <button type="submit" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">
          Search
        </button>
        {q ? (
          <Link href="/admin/products" className="rounded-full border border-navy/15 px-5 py-3 font-semibold">
            Clear
          </Link>
        ) : null}
      </form>

      {q ? (
        <p className="mt-3 text-sm text-navy/60">
          {products.length
            ? `${products.length} result${products.length === 1 ? "" : "s"} for “${q}”`
            : `No products found for “${q}”`}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-[1.4rem] bg-white">
        <table className="w-full min-w-[960px] text-left">
          <thead className="border-b border-navy/10">
            <tr>
              <th className="p-4">Stock no.</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price (LKR)</th>
              <th className="p-4">Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-navy/5 align-top">
                <td className="p-4">
                  {product.stockNumber ? (
                    <span className="font-mono text-sm font-semibold tracking-wide">{product.stockNumber}</span>
                  ) : (
                    <span className="text-sm text-navy/40">—</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="font-semibold">{product.name}</span>
                  <br />
                  {product.brand}
                  {product.hidden ? <span className="mt-1 block text-sm text-navy/50">Hidden from site</span> : null}
                </td>
                <td className="p-4">
                  {product.category}
                  {product.audience ? ` · ${product.audience}` : ""}
                </td>
                <td className="p-4">
                  <form action={updateProductPrice} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={product.id} />
                    <input
                      name="price"
                      type="number"
                      min={1}
                      defaultValue={product.price}
                      className="w-28 rounded-xl border border-navy/15 px-3 py-2"
                      aria-label={`Price for ${product.name}`}
                    />
                    <button type="submit" className="font-semibold underline">
                      Save
                    </button>
                  </form>
                  <p className="mt-1 text-sm text-navy/60">
                    {formatLkr(product.price)}
                    {product.showDiscount ? " · offer on" : ""}
                  </p>
                </td>
                <td className="p-4">
                  <form action={updateProductStock}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="inStock" value={product.inStock ? "0" : "1"} />
                    <button
                      type="submit"
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        product.inStock ? "bg-aqua/30 text-navy" : "bg-navy text-white"
                      }`}
                    >
                      {product.inStock ? "Mark sold out" : "Restock"}
                    </button>
                  </form>
                </td>
                <td className="p-4">
                  <Link className="font-semibold underline" href={`/admin/products/${product.id}`}>
                    Edit
                  </Link>
                  <form action={deleteProduct} className="mt-2">
                    <input type="hidden" name="id" value={product.id} />
                    <button className="font-semibold" type="submit">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
