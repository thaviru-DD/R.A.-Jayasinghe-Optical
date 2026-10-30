import Link from "next/link";
import { deleteProduct, updateProductPrice, updateProductStock } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatLkr } from "@/lib/format";

export default async function Page() {
  await requireAdmin();
  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-4xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Add product</Link>
      </div>
      <p className="mt-3 max-w-2xl text-navy/70">Update stock and price here. Open Edit for discounts, images, and full details.</p>
      <div className="mt-6 overflow-x-auto rounded-[1.4rem] bg-white">
        <table className="w-full min-w-[860px] text-left">
          <thead className="border-b border-navy/10">
            <tr>
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
                  <span className="font-semibold">{product.name}</span>
                  <br />
                  {product.brand}
                  {product.hidden ? <span className="mt-1 block text-sm text-navy/50">Hidden from site</span> : null}
                </td>
                <td className="p-4">{product.category}{product.audience ? ` · ${product.audience}` : ""}</td>
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
                    <button type="submit" className="font-semibold underline">Save</button>
                  </form>
                  <p className="mt-1 text-sm text-navy/60">{formatLkr(product.price)}{product.showDiscount ? " · offer on" : ""}</p>
                </td>
                <td className="p-4">
                  <form action={updateProductStock}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="inStock" value={product.inStock ? "0" : "1"} />
                    <button
                      type="submit"
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${product.inStock ? "bg-aqua/30 text-navy" : "bg-navy text-white"}`}
                    >
                      {product.inStock ? "Mark sold out" : "Restock"}
                    </button>
                  </form>
                </td>
                <td className="p-4">
                  <Link className="font-semibold underline" href={`/admin/products/${product.id}`}>Edit</Link>
                  <form action={deleteProduct} className="mt-2">
                    <input type="hidden" name="id" value={product.id} />
                    <button className="font-semibold" type="submit">Delete</button>
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
