import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/format";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id: (await params).id } });
  if (!product) notFound();
  return (
    <div>
      <h1 className="mb-6 font-heading text-4xl font-semibold">Edit product</h1>
      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          brand: product.brand,
          description: product.description,
          price: product.price,
          category: product.category,
          audience: product.audience,
          frameType: product.frameType,
          shape: product.shape,
          discountType: product.discountType,
          discountValue: product.discountValue,
          showDiscount: product.showDiscount,
          inStock: product.inStock,
          hidden: product.hidden,
          featured: product.featured,
          images: parseImages(product.images),
        }}
      />
    </div>
  );
}
