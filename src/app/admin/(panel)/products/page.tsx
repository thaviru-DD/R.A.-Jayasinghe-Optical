import Link from "next/link";
import { deleteProduct } from "@/lib/admin-actions";
import { prisma } from "@/lib/db";
import { formatLkr } from "@/lib/format";

export default async function Page() {
  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-4xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Add product</Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-[1.4rem] bg-white">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-navy/10">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-navy/5">
                <td className="p-4"><span className="font-semibold">{product.name}</span><br />{product.brand}</td>
                <td className="p-4">{product.category}{product.audience ? ` · ${product.audience}` : ""}</td>
                <td className="p-4">{formatLkr(product.price)}{product.showDiscount ? " · offer on" : ""}</td>
                <td className="p-4">{product.hidden ? "Hidden" : "Visible"} · {product.inStock ? "In stock" : "Out of stock"}</td>
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
