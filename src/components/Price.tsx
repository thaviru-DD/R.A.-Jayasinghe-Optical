import { formatLkr, salePrice } from "@/lib/format";

export function PriceTag({
  product,
}: {
  product: { price: number; showDiscount: boolean; discountType: string | null; discountValue: number | null };
}) {
  const sale = salePrice(product);
  if (sale == null) return <span className="font-semibold">{formatLkr(product.price)}</span>;
  const badge = product.discountType === "percent" && product.discountValue ? `${product.discountValue}% off` : "Offer";
  return (
    <span className="inline-flex flex-wrap items-baseline gap-2">
      <span className="font-semibold">{formatLkr(sale)}</span>
      <span className="text-navy/45 line-through">{formatLkr(product.price)}</span>
      <span className="rounded-full bg-aqua px-2 py-0.5 text-sm font-semibold text-navy">{badge}</span>
    </span>
  );
}
