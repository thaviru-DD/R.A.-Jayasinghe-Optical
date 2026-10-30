import { ProductForm } from "@/components/admin/ProductForm";

export default function Page() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-4xl font-semibold">New product</h1>
      <ProductForm />
    </div>
  );
}
