import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";

export default async function Page() {
  await requireAdmin();
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Catalog</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight">New product</h1>
      <p className="mt-3 max-w-2xl text-navy/65">Add details, pricing, and product photos. Images appear on the product page gallery.</p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
